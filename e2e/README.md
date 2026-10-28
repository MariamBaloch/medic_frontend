# Appointment demos

These Playwright scenarios sign into the real backend and exercise appointment behavior without mocking API responses:

- **Booking race:** two different patients submit the same available time. One booking succeeds and the other is rejected.
- **Reschedule conflict:** two browser sessions for Patient One load the same appointment version. The first reschedule succeeds; the second submits that stale version and receives HTTP 409.

## Setup

1. Start the backend you want to exercise, or point the demo at a reachable development or staging API. Use a non-production environment.
2. Copy `.env.e2e.example` to `.env.e2e` and fill in the backend URL and patient credentials. `.env.e2e` is ignored by Git. The booking race needs Patients One and Two; the reschedule conflict demo needs Patient One.

The Playwright-managed Vite server serves the frontend at `http://127.0.0.1:5174` and proxies its `/api` calls to `E2E_API_BASE_URL`. Chromium makes same-origin requests to the frontend; the proxy forwards them to the real backend. No API responses are mocked.

## Run

- `pnpm demo:booking-race` opens the two-patient booking race in headed Chromium with slowed browser actions.
- `pnpm test:e2e:booking-race` runs that scenario headlessly.
- `pnpm demo:reschedule-conflict` opens the reschedule conflict in headed Chromium. Two side-by-side sessions use the same Patient One account so both can edit the same appointment.
- `pnpm test:e2e:reschedule-conflict` runs the reschedule scenario headlessly.
- `pnpm test:e2e` runs both scenarios headlessly.

The scenarios attach browser recordings and JSON outcome summaries to the Playwright result. They cancel appointments created during setup after capturing the outcome. If cleanup fails, cancel the created appointment manually in the test environment.
