import { unlink } from "node:fs/promises";
import {
  expect,
  test,
  type Browser,
  type Page,
  type Response as PlaywrightResponse,
  type TestInfo,
} from "@playwright/test";

interface PatientCredentials {
  email: string;
  password: string;
}

interface Doctor {
  userId: number;
  firstName: string;
  lastName: string;
  doctor: { doctorProfileId: number };
}

interface AvailabilityResponse {
  slots: Array<{
    date: string;
    startTime: string;
    status: string;
    patientHasOverlappingAppointment?: boolean;
    patientHasActiveWaitlistEntry?: boolean;
  }>;
}

interface SharedSlot {
  date: string;
  startTime: string;
}

interface BookingResponseBody {
  id?: number;
}

const apiOrigin = (process.env.E2E_API_BASE_URL || "http://localhost:8080").replace(/\/+$/, "");

function hasResponsePath(response: PlaywrightResponse, pathSuffix: string, method: string) {
  return (
    new URL(response.url()).pathname.endsWith(pathSuffix) && response.request().method() === method
  );
}

function normalizeDate(date: string): string {
  const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (isoDate) return date;

  const legacyDate = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(date);
  if (legacyDate) return `${legacyDate[3]}-${legacyDate[2]}-${legacyDate[1]}`;

  throw new Error(`The availability API returned an unsupported date: ${date}`);
}

function findSharedAvailableSlot(
  first: AvailabilityResponse,
  second: AvailabilityResponse,
): SharedSlot | null {
  const isAvailableForPatient = (slot: AvailabilityResponse["slots"][number]) =>
    slot.status === "AVAILABLE" &&
    !slot.patientHasOverlappingAppointment &&
    !slot.patientHasActiveWaitlistEntry;
  const secondSlots = new Set(
    second.slots
      .filter(isAvailableForPatient)
      .map((slot) => `${normalizeDate(slot.date)}|${slot.startTime}`),
  );
  for (const slot of first.slots) {
    const date = normalizeDate(slot.date);
    const slotKey = `${date}|${slot.startTime}`;
    if (isAvailableForPatient(slot) && secondSlots.has(slotKey)) {
      return { date, startTime: slot.startTime };
    }
  }

  return null;
}

function getUiDateLabel(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function getUiTimeLabel(time: string): string {
  const [rawHours, rawMinutes] = time.split(":");
  const hours = Number(rawHours);
  return `${hours % 12 || 12}:${rawMinutes} ${hours >= 12 ? "PM" : "AM"}`;
}

async function readSuccessfulAvailability(
  response: PlaywrightResponse,
): Promise<AvailabilityResponse> {
  expect(response.ok(), `Availability request failed with HTTP ${response.status()}`).toBeTruthy();
  return (await response.json()) as AvailabilityResponse;
}

async function attachRecording(testInfo: TestInfo, page: Page, name: string) {
  const video = page.video();
  if (!video) return;
  const videoPath = await video.path();
  await testInfo.attach(name, { path: videoPath, contentType: "video/webm" });
  await unlink(videoPath);
}

async function activatePatientWindow(browser: Browser, page: Page) {
  const session = await browser.newBrowserCDPSession();

  try {
    const { targetInfos } = await session.send("Target.getTargets");
    const matchingTargets = targetInfos.filter(
      (target) => target.type === "page" && target.url === page.url(),
    );
    if (matchingTargets.length === 1) {
      await session.send("Target.activateTarget", { targetId: matchingTargets[0].targetId });
    }
  } finally {
    await session.detach();
  }

  await page.bringToFront();
}

async function positionPatientWindow(
  browser: Browser,
  page: Page,
  patientIndex: number,
  windowCount: number,
) {
  const screenSize = await page.evaluate(() => ({
    width: window.screen.availWidth,
    height: window.screen.availHeight,
  }));
  const gap = 8;
  const windowWidth = Math.floor((screenSize.width - gap * (windowCount - 1)) / windowCount);
  const session = await page.context().newCDPSession(page);

  try {
    const { windowId } = await session.send("Browser.getWindowForTarget");
    await session.send("Browser.setWindowBounds", {
      windowId,
      bounds: { windowState: "normal" },
    });
    await new Promise((resolve) => setTimeout(resolve, 150));
    await session.send("Browser.setWindowBounds", {
      windowId,
      bounds: {
        left: patientIndex * (windowWidth + gap),
        top: 0,
        width: windowWidth,
        height: screenSize.height,
      },
    });
  } finally {
    await session.detach();
  }
  await activatePatientWindow(browser, page);
}

test("two real patients submit the same appointment slot at once", async ({
  browser,
  request,
}, testInfo) => {
  const patients: PatientCredentials[] = [
    {
      email: process.env.E2E_PATIENT_ONE_EMAIL ?? "",
      password: process.env.E2E_PATIENT_ONE_PASSWORD ?? "",
    },
    {
      email: process.env.E2E_PATIENT_TWO_EMAIL ?? "",
      password: process.env.E2E_PATIENT_TWO_PASSWORD ?? "",
    },
  ];

  test.skip(
    patients.some(({ email, password }) => !email || !password),
    "Set both patient credentials in the ignored .env.e2e file to run against the real backend.",
  );
  test.skip(
    patients[0].email.toLowerCase() === patients[1].email.toLowerCase(),
    "The race demo needs two different patient accounts.",
  );

  const isSlowMotionDemo = Number(testInfo.project.use.launchOptions?.slowMo) > 0;
  const contexts = await Promise.all(
    patients.map(() =>
      browser.newContext({
        viewport: isSlowMotionDemo ? null : { width: 1100, height: 900 },
        timezoneId: "Asia/Riyadh",
        recordVideo: { dir: testInfo.outputDir },
      }),
    ),
  );
  const pages = await Promise.all(contexts.map((context) => context.newPage()));
  const successfulBookings: Array<{ id: number; authorization: string }> = [];

  try {
    if (isSlowMotionDemo) {
      for (let index = 0; index < pages.length; index += 1) {
        await positionPatientWindow(browser, pages[index], index, 2);
      }
    }

    const loginResponses = pages.map((page) =>
      page.waitForResponse((response) => hasResponsePath(response, "/auth/users/login", "POST")),
    );
    await Promise.all(pages.map((page) => page.goto("/login")));
    await Promise.all(
      pages.map(async (page, index) => {
        await page.getByLabel("Email address").fill(patients[index].email);
        await page.getByLabel("Password").fill(patients[index].password);
        await page.getByRole("button", { name: "Sign in" }).click();
      }),
    );

    const loginAuthorizations = await Promise.all(
      loginResponses.map(async (responsePromise) => {
        const response = await responsePromise;
        expect(response.ok(), `Patient login failed with HTTP ${response.status()}`).toBeTruthy();
        const payload = (await response.json()) as { token: string };
        return `Bearer ${payload.token}`;
      }),
    );
    await Promise.all(pages.map((page) => expect(page).toHaveURL(/\/patient\/overview$/)));

    const doctorResponses = pages.map((page) =>
      page.waitForResponse((response) => hasResponsePath(response, "/doctors", "GET")),
    );
    await Promise.all(
      pages.map((page) => page.getByRole("button", { name: /Book an appointment$/ }).click()),
    );
    const doctorLists = await Promise.all(
      doctorResponses.map(async (responsePromise) => {
        const response = await responsePromise;
        expect(response.ok(), `Doctor list failed with HTTP ${response.status()}`).toBeTruthy();
        return (await response.json()) as Doctor[];
      }),
    );
    await Promise.all(
      pages.map((page) => expect(page).toHaveURL(/\/patient\/appointments\/book$/)),
    );

    await Promise.all(
      pages.map(async (page) => {
        const collapseButton = page.getByRole("button", { name: "Collapse sidebar" });
        if (await collapseButton.isVisible()) await collapseButton.click();
        await expect(page.getByRole("button", { name: "Expand sidebar" })).toBeVisible();
      }),
    );

    const doctorsForSecondPatient = new Set(
      doctorLists[1].map((doctor) => doctor.doctor.doctorProfileId),
    );
    const sharedDoctor = doctorLists[0].find((doctor) =>
      doctorsForSecondPatient.has(doctor.doctor.doctorProfileId),
    );
    expect(
      sharedDoctor,
      "No doctor with future availability is visible to both patients",
    ).toBeTruthy();

    const doctorName = `${sharedDoctor!.firstName} ${sharedDoctor!.lastName}`;
    await Promise.all(
      pages.map(async (page) => {
        const doctorRow = page.getByRole("row").filter({ hasText: doctorName }).first();
        await doctorRow.getByRole("button", { name: "Select", exact: true }).click();
      }),
    );

    let availabilityResponses = pages.map((page) =>
      page.waitForResponse((response) => hasResponsePath(response, "/availability", "GET")),
    );
    await Promise.all(
      pages.map((page) => page.getByRole("button", { name: "Continue to choose time" }).click()),
    );
    let availability = await Promise.all(
      availabilityResponses.map(async (responsePromise) =>
        readSuccessfulAvailability(await responsePromise),
      ),
    );

    let sharedSlot = findSharedAvailableSlot(availability[0], availability[1]);
    for (let week = 0; !sharedSlot && week < 16; week += 1) {
      availabilityResponses = pages.map((page) =>
        page.waitForResponse((response) => hasResponsePath(response, "/availability", "GET")),
      );
      await Promise.all(
        pages.map((page) => page.getByRole("button", { name: "Next week" }).click()),
      );
      availability = await Promise.all(
        availabilityResponses.map(async (responsePromise) =>
          readSuccessfulAvailability(await responsePromise),
        ),
      );
      sharedSlot = findSharedAvailableSlot(availability[0], availability[1]);
    }

    expect(
      sharedSlot,
      "No common available slot was found in the next 17 weeks for the selected doctor.",
    ).toBeTruthy();

    const slotLabel = `Select ${getUiTimeLabel(sharedSlot!.startTime)} on ${getUiDateLabel(sharedSlot!.date)}`;
    await Promise.all(
      pages.map(async (page) => {
        await page.getByRole("button", { name: slotLabel, exact: true }).click();
        await page.getByRole("button", { name: "Continue to visit reason" }).click();
        await page
          .getByLabel("Reason for appointment")
          .fill("Playwright booking race demonstration");
        await page.getByRole("button", { name: "Continue to review appointment" }).click();
      }),
    );

    const bookingResponses = pages.map((page) =>
      page.waitForResponse((response) =>
        hasResponsePath(response, "/patient/appointments", "POST"),
      ),
    );
    await Promise.all(
      pages.map((page) => page.getByRole("button", { name: "Confirm appointment" }).click()),
    );

    const results = await Promise.all(
      bookingResponses.map(async (responsePromise) => {
        const response = await responsePromise;
        const authorization = response.request().headers().authorization;
        let body: BookingResponseBody | null = null;
        try {
          body = (await response.json()) as BookingResponseBody;
        } catch {
          // Conflict responses may have no JSON body.
        }
        return { response, authorization, body };
      }),
    );

    for (const result of results) {
      if (result.response.ok() && result.body?.id && result.authorization) {
        successfulBookings.push({ id: result.body.id, authorization: result.authorization });
      }
    }

    const bookingRequests = results.map(({ response }) => response.request());
    const payloads = bookingRequests.map(
      (bookingRequest) =>
        bookingRequest.postDataJSON() as { doctorId: number; date: string; startTime: string },
    );
    expect(payloads[0]).toEqual(payloads[1]);
    expect(payloads[0].doctorId).toBe(sharedDoctor!.doctor.doctorProfileId);
    expect(payloads[0].startTime).toBe(sharedSlot!.startTime);
    expect(results.map(({ authorization }) => authorization)).toEqual(loginAuthorizations);
    expect(new Set(results.map(({ authorization }) => authorization)).size).toBe(2);

    const successCount = results.filter(({ response }) => response.ok()).length;
    const clientRejectionCount = results.filter(
      ({ response }) => response.status() >= 400 && response.status() < 500,
    ).length;
    expect(successCount, "Exactly one patient should get the appointment").toBe(1);
    expect(clientRejectionCount, "The other booking should be rejected as a conflict").toBe(1);

    const alertTypes = await Promise.all(
      pages.map(async (page) => {
        const alert = page.locator("[data-alert-type]");
        await expect(alert).toBeVisible();
        await expect(alert).toBeInViewport();
        return alert.getAttribute("data-alert-type");
      }),
    );
    expect(alertTypes).toContain("success");
    expect(alertTypes).toContain("error");
    await expect(
      pages[alertTypes.indexOf("success")].getByText("Appointment confirmed"),
    ).toBeVisible();

    await testInfo.attach("race-result", {
      body: JSON.stringify(
        {
          doctor: doctorName,
          doctorId: sharedDoctor!.doctor.doctorProfileId,
          date: sharedSlot!.date,
          startTime: sharedSlot!.startTime,
          bookingStatuses: results.map(({ response }) => response.status()),
        },
        null,
        2,
      ),
      contentType: "application/json",
    });

    // Leave both actual backend outcomes visible in headed mode and in the recordings.
    await new Promise((resolve) => setTimeout(resolve, 5_000));
  } finally {
    await Promise.all(contexts.map((context) => context.close()));
    await Promise.all([
      attachRecording(testInfo, pages[0], "patient-one-recording"),
      attachRecording(testInfo, pages[1], "patient-two-recording"),
    ]);

    for (const booking of successfulBookings) {
      const response = await request.put(`${apiOrigin}/patient/appointments/${booking.id}/cancel`, {
        headers: { authorization: booking.authorization },
        data: { reason: "Playwright booking race demo cleanup" },
      });
      expect(
        response.ok(),
        `Could not cancel demo appointment ${booking.id} during cleanup (HTTP ${response.status()})`,
      ).toBeTruthy();
    }
  }
});
