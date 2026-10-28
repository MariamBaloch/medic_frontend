import { unlink } from "node:fs/promises";
import { expect, test, type Page, type Response, type TestInfo } from "@playwright/test";

interface Slot {
  date: string;
  startTime: string;
  status: string;
  patientHasOverlappingAppointment?: boolean;
  patientHasActiveWaitlistEntry?: boolean;
}

interface Doctor {
  firstName: string;
  lastName: string;
  doctor: { doctorProfileId: number };
}

interface AppointmentBody {
  id: number;
  version: number;
}

interface SlotChoice {
  date: string;
  startTime: string;
}

const apiOrigin = (process.env.E2E_API_BASE_URL || "http://localhost:8080").replace(/\/+$/, "");

function hasResponsePath(response: Response, suffix: string, method: string) {
  return (
    new URL(response.url()).pathname.endsWith(suffix) && response.request().method() === method
  );
}

function normalizeDate(date: string): string {
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (iso) return date;
  const display = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(date);
  if (display) return `${display[3]}-${display[2]}-${display[1]}`;
  throw new Error(`Unsupported availability date: ${date}`);
}

function asDisplayDate(isoDate: string) {
  const [, year, month, day] = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate)!;
  return `${day}/${month}/${year}`;
}

function uiDateLabel(isoDate: string) {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function uiTableDateLabel(isoDate: string) {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function uiTimeLabel(time: string) {
  const [rawHours, minutes] = time.split(":");
  const hours = Number(rawHours);
  return `${hours % 12 || 12}:${minutes} ${hours >= 12 ? "PM" : "AM"}`;
}

function uiTableStartTimeLabel(time: string) {
  const [rawHours, minutes] = time.split(":");
  const hours = Number(rawHours);
  return `${hours % 12 || 12}:${minutes}`;
}

function getDateOffset(days: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function getSundayOf(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - date.getUTCDay());
  return date.toISOString().slice(0, 10);
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
    // Chromium can keep the source video locked briefly on Windows after context.close().
    if (code !== "EBUSY" && code !== "EPERM") throw error;
  }
}

async function positionWindow(page: Page, index: number) {
  const screen = await page.evaluate(() => ({
    width: window.screen.availWidth,
    height: window.screen.availHeight,
  }));
  const gap = 8;
  const width = Math.floor((screen.width - gap) / 2);
  const session = await page.context().newCDPSession(page);
  try {
    const { windowId } = await session.send("Browser.getWindowForTarget");
    await session.send("Browser.setWindowBounds", { windowId, bounds: { windowState: "normal" } });
    await session.send("Browser.setWindowBounds", {
      windowId,
      bounds: { left: index * (width + gap), top: 0, width, height: screen.height },
    });
  } finally {
    await session.detach();
  }
}

async function findAppointmentRow(page: Page, doctorName: string, slot: SlotChoice) {
  const matchingRow = page
    .getByRole("row")
    .filter({ hasText: doctorName })
    .filter({ hasText: uiTableDateLabel(slot.date) })
    .filter({ hasText: uiTableStartTimeLabel(slot.startTime) })
    .filter({ hasText: "Playwright reschedule conflict demonstration" });
  const nextPageButton = page.locator("li.ant-pagination-next button");

  for (let currentPage = 0; currentPage < 50; currentPage += 1) {
    if (await matchingRow.count()) return matchingRow.first();
    if (!(await nextPageButton.count()) || (await nextPageButton.isDisabled())) break;

    const nextPage = currentPage + 1;
    const pageResponsePromise = page.waitForResponse((response) => {
      const url = new URL(response.url());
      return (
        url.pathname.endsWith("/patient/appointments") &&
        response.request().method() === "GET" &&
        url.searchParams.get("page") === String(nextPage)
      );
    });
    await nextPageButton.click();
    const pageResponse = await pageResponsePromise;
    expect(pageResponse.ok(), `Could not load appointments page ${nextPage}`).toBeTruthy();
  }

  throw new Error(
    `Could not find the seeded appointment for ${doctorName} on ${uiTableDateLabel(slot.date)} at ${uiTimeLabel(slot.startTime)}.`,
  );
}

test("a stale reschedule conflicts after the same appointment was rescheduled", async ({
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
  let createdAppointment: { id: number; authorization: string } | undefined;

  try {
    if (slowMotion) {
      await Promise.all(pages.map((page, index) => positionWindow(page, index)));
    }

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
    const loginPayloads = await Promise.all(
      loginResponses.map(async (responsePromise) => {
        const response = await responsePromise;
        expect(response.ok(), `Login failed with HTTP ${response.status()}`).toBeTruthy();
        return (await response.json()) as { token: string };
      }),
    );
    await Promise.all(pages.map((page) => expect(page).toHaveURL(/\/patient\/overview$/)));
    const authorization = `Bearer ${loginPayloads[0].token}`;

    const doctorsResponse = await request.get(`${apiOrigin}/doctors?hasFutureAvailability=true`, {
      headers: { authorization },
    });
    expect(
      doctorsResponse.ok(),
      `Doctor list failed with HTTP ${doctorsResponse.status()}`,
    ).toBeTruthy();
    const doctors = (await doctorsResponse.json()) as Doctor[];

    let chosenDoctor: Doctor | undefined;
    let bookingSlot: SlotChoice | undefined;
    let firstTarget: SlotChoice | undefined;
    let staleTarget: SlotChoice | undefined;
    let matchedWeek: { from: string; to: string } | undefined;

    for (let week = 1; week <= 17 && !chosenDoctor; week += 1) {
      const from = getSundayOf(getDateOffset(week * 7));
      const toDate = new Date(`${from}T00:00:00Z`);
      toDate.setUTCDate(toDate.getUTCDate() + 6);
      const to = toDate.toISOString().slice(0, 10);
      for (const doctor of doctors) {
        const availabilityResponse = await request.get(
          `${apiOrigin}/patient/appointments/doctors/${doctor.doctor.doctorProfileId}/availability?from=${from}&to=${to}`,
          { headers: { authorization } },
        );
        if (!availabilityResponse.ok()) continue;
        const availability = (await availabilityResponse.json()) as { slots: Slot[] };
        const freeSlots = availability.slots
          .filter(
            (slot) =>
              slot.status === "AVAILABLE" &&
              !slot.patientHasOverlappingAppointment &&
              !slot.patientHasActiveWaitlistEntry,
          )
          .map((slot) => ({ date: normalizeDate(slot.date), startTime: slot.startTime }));
        if (freeSlots.length >= 3) {
          chosenDoctor = doctor;
          [bookingSlot, firstTarget, staleTarget] = freeSlots.slice(0, 3);
          matchedWeek = { from, to };
          break;
        }
      }
    }

    expect(
      chosenDoctor && bookingSlot && firstTarget && staleTarget && matchedWeek,
      "No doctor had three free appointment times in a future week within the next 17 weeks.",
    ).toBeTruthy();

    const bookingResponse = await request.post(`${apiOrigin}/patient/appointments`, {
      headers: { authorization },
      data: {
        doctorId: chosenDoctor!.doctor.doctorProfileId,
        date: asDisplayDate(bookingSlot!.date),
        startTime: bookingSlot!.startTime,
        reason: "Playwright reschedule conflict demonstration",
      },
    });
    expect(
      bookingResponse.ok(),
      `Could not set up appointment (HTTP ${bookingResponse.status()})`,
    ).toBeTruthy();
    const initialAppointment = (await bookingResponse.json()) as AppointmentBody;
    createdAppointment = { id: initialAppointment.id, authorization };

    await Promise.all(pages.map((page) => page.goto("/patient/appointments")));
    const doctorName = `${chosenDoctor!.firstName} ${chosenDoctor!.lastName}`;
    const doctorSearchResponses = pages.map((page) =>
      page.waitForResponse((response) => {
        const url = new URL(response.url());
        return (
          url.pathname.endsWith("/patient/appointments") &&
          response.request().method() === "GET" &&
          url.searchParams.get("doctorName") === doctorName
        );
      }),
    );
    await Promise.all(
      pages.map((page) => page.getByPlaceholder("Doctor or appointment").fill(doctorName)),
    );
    await Promise.all(
      doctorSearchResponses.map(async (responsePromise) => {
        const response = await responsePromise;
        expect(response.ok(), `Doctor search failed with HTTP ${response.status()}`).toBeTruthy();
      }),
    );
    const initialRows = await Promise.all(
      pages.map((page) => findAppointmentRow(page, doctorName, bookingSlot!)),
    );
    await Promise.all(
      initialRows.map((row) => row.getByRole("button", { name: /View details/ }).click()),
    );
    await Promise.all(
      pages.map((page) => page.getByRole("button", { name: "Reschedule appointment" }).click()),
    );

    const firstTargetLabel = `Select ${uiTimeLabel(firstTarget!.startTime)} on ${uiDateLabel(firstTarget!.date)}`;
    const staleTargetLabel = `Select ${uiTimeLabel(staleTarget!.startTime)} on ${uiDateLabel(staleTarget!.date)}`;
    await pages[0].getByRole("button", { name: firstTargetLabel, exact: true }).click();
    await pages[1].getByRole("button", { name: staleTargetLabel, exact: true }).click();

    const successResponsePromise = pages[0].waitForResponse((response) =>
      hasResponsePath(response, `/patient/appointments/${initialAppointment.id}/reschedule`, "PUT"),
    );
    await pages[0].getByRole("button", { name: "Confirm new time" }).click();
    const successResponse = await successResponsePromise;
    expect(successResponse.status(), "The first reschedule should succeed").toBe(200);
    const updatedAppointment = (await successResponse.json()) as AppointmentBody;
    expect(updatedAppointment.version).toBeGreaterThan(initialAppointment.version);
    await expect(pages[0].locator("[data-alert-type='success']")).toBeVisible();

    const staleResponsePromise = pages[1].waitForResponse((response) =>
      hasResponsePath(response, `/patient/appointments/${initialAppointment.id}/reschedule`, "PUT"),
    );
    await pages[1].getByRole("button", { name: "Confirm new time" }).click();
    const staleResponse = await staleResponsePromise;
    expect(staleResponse.status(), "The stale reschedule should return HTTP 409").toBe(409);
    const successfulRequest = successResponse.request().postDataJSON() as {
      expectedVersion: number;
    };
    const staleRequest = staleResponse.request().postDataJSON() as { expectedVersion: number };
    expect(staleRequest.expectedVersion).toBe(successfulRequest.expectedVersion);
    expect(staleRequest.expectedVersion).toBe(initialAppointment.version);
    await expect(pages[1].locator("[data-alert-type='error']")).toBeVisible();

    await testInfo.attach("reschedule-conflict-result", {
      body: JSON.stringify(
        {
          appointmentId: initialAppointment.id,
          doctor: doctorName,
          originalSlot: bookingSlot,
          successfulReschedule: firstTarget,
          staleReschedule: staleTarget,
          initialVersion: initialAppointment.version,
          resultingVersion: updatedAppointment.version,
          responseStatuses: [successResponse.status(), staleResponse.status()],
        },
        null,
        2,
      ),
      contentType: "application/json",
    });
    await new Promise((resolve) => setTimeout(resolve, 5_000));
  } finally {
    await Promise.all(contexts.map((context) => context.close()));
    if (createdAppointment) {
      const cleanupResponse = await request.put(
        `${apiOrigin}/patient/appointments/${createdAppointment.id}/cancel`,
        {
          headers: { authorization: createdAppointment.authorization },
          data: { reason: "Playwright reschedule conflict demo cleanup" },
        },
      );
      expect(
        cleanupResponse.ok(),
        `Could not cancel demo appointment during cleanup (HTTP ${cleanupResponse.status()})`,
      ).toBeTruthy();
    }
    await Promise.all([
      attachRecording(testInfo, pages[0], "reschedule-success-session-recording"),
      attachRecording(testInfo, pages[1], "stale-reschedule-conflict-session-recording"),
    ]);
  }
});
