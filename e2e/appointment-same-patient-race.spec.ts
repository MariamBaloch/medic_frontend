import { unlink } from "node:fs/promises";
import { expect, test, type Browser, type Page, type Response, type TestInfo } from "@playwright/test";

interface AvailabilityResponse {
  slots: Array<{
    date: string;
    startTime: string;
    status: string;
    patientHasOverlappingAppointment?: boolean;
    patientHasActiveWaitlistEntry?: boolean;
  }>;
}

interface Doctor {
  firstName: string;
  lastName: string;
  doctor: { doctorProfileId: number };
}

interface Slot {
  date: string;
  startTime: string;
}

const apiOrigin = (process.env.E2E_API_BASE_URL || "http://localhost:8080").replace(/\/+$/, "");

function hasResponsePath(response: Response, suffix: string, method: string) {
  return new URL(response.url()).pathname.endsWith(suffix) && response.request().method() === method;
}

function normalizeDate(date: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const legacyDate = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(date);
  if (legacyDate) return `${legacyDate[3]}-${legacyDate[2]}-${legacyDate[1]}`;
  throw new Error(`The availability API returned an unsupported date: ${date}`);
}

function uiDateLabel(isoDate: string) {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function uiTimeLabel(time: string) {
  const [rawHours, minutes] = time.split(":");
  const hours = Number(rawHours);
  return `${hours % 12 || 12}:${minutes} ${hours >= 12 ? "PM" : "AM"}`;
}

async function attachRecording(testInfo: TestInfo, page: Page, name: string) {
  const video = page.video();
  if (!video) return;
  const videoPath = await video.path();
  await testInfo.attach(name, { path: videoPath, contentType: "video/webm" });
  try {
    await unlink(videoPath);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "EBUSY" && code !== "EPERM") throw error;
  }
}

async function positionWindow(browser: Browser, page: Page, index: number) {
  const screenSize = await page.evaluate(() => ({
    width: window.screen.availWidth,
    height: window.screen.availHeight,
  }));
  const gap = 8;
  const width = Math.floor((screenSize.width - gap) / 2);
  const session = await page.context().newCDPSession(page);
  try {
    const { windowId } = await session.send("Browser.getWindowForTarget");
    await session.send("Browser.setWindowBounds", { windowId, bounds: { windowState: "normal" } });
    await session.send("Browser.setWindowBounds", {
      windowId,
      bounds: { left: index * (width + gap), top: 0, width, height: screenSize.height },
    });
  } finally {
    await session.detach();
  }
  const targetSession = await browser.newBrowserCDPSession();
  try {
    const { targetInfos } = await targetSession.send("Target.getTargets");
    const target = targetInfos.find((info) => info.type === "page" && info.url === page.url());
    if (target) await targetSession.send("Target.activateTarget", { targetId: target.targetId });
  } finally {
    await targetSession.detach();
  }
  await page.bringToFront();
}

test("the same patient submits the same appointment slot twice at once", async ({
  browser,
  request,
}, testInfo) => {
  const patient = {
    email: process.env.E2E_PATIENT_ONE_EMAIL ?? "",
    password: process.env.E2E_PATIENT_ONE_PASSWORD ?? "",
  };
  test.skip(!patient.email || !patient.password, "Set Patient One credentials in .env.e2e.");

  const slowMotion = Number(testInfo.project.use.launchOptions?.slowMo) > 0;
  test.setTimeout(slowMotion ? 180_000 : 90_000);
  const contexts = await Promise.all(
    [0, 1].map(() =>
      browser.newContext({
        viewport: slowMotion ? null : { width: 1100, height: 900 },
        timezoneId: "Asia/Riyadh",
        recordVideo: { dir: testInfo.outputDir },
      }),
    ),
  );
  const pages = await Promise.all(contexts.map((context) => context.newPage()));
  let successfulBooking: { id: number; authorization: string } | undefined;

  try {
    if (slowMotion) await Promise.all(pages.map((page, index) => positionWindow(browser, page, index)));

    const loginResponses = pages.map((page) =>
      page.waitForResponse((response) => hasResponsePath(response, "/auth/users/login", "POST")),
    );
    await Promise.all(pages.map((page) => page.goto("/login")));
    await Promise.all(
      pages.map(async (page) => {
        await page.getByLabel("Email address").fill(patient.email);
        await page.getByLabel("Password").fill(patient.password);
        await page.getByRole("button", { name: "Sign in" }).click();
      }),
    );
    const authorizations = await Promise.all(
      loginResponses.map(async (responsePromise) => {
        const response = await responsePromise;
        expect(response.ok(), `Login failed with HTTP ${response.status()}`).toBeTruthy();
        const { token } = (await response.json()) as { token: string };
        return `Bearer ${token}`;
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
    const doctor = doctorLists[0][0];
    expect(doctor, "No doctor with future availability is available").toBeTruthy();
    const doctorId = doctor!.doctor.doctorProfileId;
    const doctorName = `${doctor.firstName} ${doctor.lastName}`;
    await Promise.all(
      pages.map(async (page) => {
        await expect(page).toHaveURL(/\/patient\/appointments\/book$/);
        const collapse = page.getByRole("button", { name: "Collapse sidebar" });
        if (await collapse.isVisible()) await collapse.click();
        await page
          .getByRole("row")
          .filter({ hasText: doctorName })
          .first()
          .getByRole("button", { name: "Select", exact: true })
          .click();
      }),
    );

    const getAvailability = (page: Page) =>
      page.waitForResponse((response) => hasResponsePath(response, "/availability", "GET"));
    let availabilityResponses = pages.map(getAvailability);
    await Promise.all(
      pages.map((page) => page.getByRole("button", { name: "Continue to choose time" }).click()),
    );
    let availability = await Promise.all(
      availabilityResponses.map(async (responsePromise) => {
        const response = await responsePromise;
        expect(response.ok(), `Availability request failed with HTTP ${response.status()}`).toBeTruthy();
        return (await response.json()) as AvailabilityResponse;
      }),
    );

    const availableSlot = () =>
      availability[0].slots.find((slot) =>
        slot.status === "AVAILABLE" &&
        !slot.patientHasOverlappingAppointment &&
        !slot.patientHasActiveWaitlistEntry &&
        availability[1].slots.some(
          (other) =>
            other.status === "AVAILABLE" &&
            !other.patientHasOverlappingAppointment &&
            !other.patientHasActiveWaitlistEntry &&
            normalizeDate(other.date) === normalizeDate(slot.date) &&
            other.startTime === slot.startTime,
        ),
      );
    let slot = availableSlot();
    for (let week = 0; !slot && week < 16; week += 1) {
      availabilityResponses = pages.map(getAvailability);
      await Promise.all(pages.map((page) => page.getByRole("button", { name: "Next week" }).click()));
      availability = await Promise.all(
        availabilityResponses.map(async (responsePromise) => {
          const response = await responsePromise;
          expect(response.ok(), `Availability request failed with HTTP ${response.status()}`).toBeTruthy();
          return (await response.json()) as AvailabilityResponse;
        }),
      );
      slot = availableSlot();
    }
    expect(slot, "No common available slot was found in the next 17 weeks.").toBeTruthy();
    const chosenSlot: Slot = { date: normalizeDate(slot!.date), startTime: slot!.startTime };
    const slotLabel = `Select ${uiTimeLabel(chosenSlot.startTime)} on ${uiDateLabel(chosenSlot.date)}`;

    await Promise.all(
      pages.map(async (page) => {
        await page.getByRole("button", { name: slotLabel, exact: true }).click();
        await page.getByRole("button", { name: "Continue to visit reason" }).click();
        await page.getByLabel("Reason for appointment").fill("Playwright same-patient booking race");
        await page.getByRole("button", { name: "Continue to review appointment" }).click();
      }),
    );
    const bookingResponses = pages.map((page) =>
      page.waitForResponse((response) => hasResponsePath(response, "/patient/appointments", "POST")),
    );
    await Promise.all(pages.map((page) => page.getByRole("button", { name: "Confirm appointment" }).click()));
    const results = await Promise.all(
      bookingResponses.map(async (responsePromise) => {
        const response = await responsePromise;
        let body: { id?: number } | undefined;
        try {
          body = (await response.json()) as { id?: number };
        } catch {
          // Conflict responses may not include a JSON body.
        }
        return { response, body, authorization: response.request().headers().authorization };
      }),
    );
    const successful = results.filter(({ response }) => response.ok());
    expect(successful).toHaveLength(1);
    expect(results.filter(({ response }) => response.status() >= 400 && response.status() < 500)).toHaveLength(1);
    expect(results[1].response.request().postDataJSON()).toEqual(
      results[0].response.request().postDataJSON(),
    );
    expect(results.every(({ authorization }) => authorization?.startsWith("Bearer "))).toBe(true);
    const successIndex = results.findIndex(({ response }) => response.ok());
    const successResult = results[successIndex];
    if (successResult.body?.id) {
      successfulBooking = {
        id: successResult.body.id,
        authorization: successResult.authorization ?? authorizations[successIndex],
      };
    }
    await expect(pages[successIndex].getByText("Appointment confirmed")).toBeVisible();

    await testInfo.attach("same-patient-race-result", {
      body: JSON.stringify(
        {
          patientEmail: patient.email,
          doctor: doctorName,
          doctorId,
          ...chosenSlot,
          bookingStatuses: results.map(({ response }) => response.status()),
        },
        null,
        2,
      ),
      contentType: "application/json",
    });
    await new Promise((resolve) => setTimeout(resolve, 5_000));
  } finally {
    await Promise.all(contexts.map((context) => context.close()));
    await Promise.all([
      attachRecording(testInfo, pages[0], "patient-session-one-recording"),
      attachRecording(testInfo, pages[1], "patient-session-two-recording"),
    ]);
    if (successfulBooking) {
      const response = await request.put(
        `${apiOrigin}/patient/appointments/${successfulBooking.id}/cancel`,
        {
          headers: { authorization: successfulBooking.authorization },
          data: { reason: "Playwright same-patient booking race cleanup" },
        },
      );
      expect(
        response.ok(),
        `Could not cancel demo appointment ${successfulBooking.id} during cleanup (HTTP ${response.status()})`,
      ).toBeTruthy();
    }
  }
});
