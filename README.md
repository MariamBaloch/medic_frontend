en# Medic Frontend

Medic is a role-based healthcare portal built as a React single-page application. Patients can manage their profile and appointments, book visits, and join a waitlist for booked times. Doctors can manage their profile, schedule, availability, time off, and appointments.

The frontend connects to the Medic API for authentication and application data. You need a running backend to use the portal beyond its public pages.

## Features

- Patient registration, sign in, password recovery, and profile management
- Patient overview, appointment booking, cancellations, rescheduling, and waitlist offers
- Doctor overview, appointment management, schedule, availability, and time-off management
- Role-based routes and protected application pages
- Responsive layouts and shared theme tokens for colors and screen breakpoints

## Technology

### Application libraries

- **React 19** and **React DOM** for the user interface
- **TypeScript** for static typing
- **Vite 8** for development and builds
- **Ant Design 6** and **Ant Design Icons** for UI components and icons
- **styled-components** for component styles and theming
- **React Router 7** for client-side routing
- **TanStack Query** for server state and API request caching
- **Axios** for HTTP requests
- **React Hook Form** and **Hook Form Resolvers** for forms
- **Zod** for request and form validation
- **Day.js** for date and time handling
- **Zustand** for client-side state

### Development tools

- **ESLint** and **typescript-eslint** for linting
- **Prettier** for formatting
- **Babel React Compiler** with the Vite React plugin
- **pnpm** for dependency management
- **Playwright** for browser-based end-to-end tests

## Requirements

- Node.js supported by the installed Vite version
- pnpm
- A running Medic backend API (defaults to `http://localhost:8080`)

## Getting started

Install dependencies:

```sh
pnpm install
```

Copy `.env.example` to `.env.local` in the project root. Change the URL if your backend is not available at the default address:

```env
VITE_API_BASE_URL=http://localhost:8080
```

`VITE_API_BASE_URL` is also used for the live notification stream. The browser connects directly to this API origin, so the backend must allow requests from the frontend origin (by default, `http://localhost:5173`). Vite proxies `/uploads` to `http://localhost:8080` during development.

Start the development server:

```sh
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173). The root route redirects to the login page.

## Available commands

| Command             | Description                                                      |
| ------------------- | ---------------------------------------------------------------- |
| `pnpm dev`          | Start the Vite development server.                               |
| `pnpm build`        | Type-check the project and create build files in `dist/`.        |
| `pnpm preview`      | Serve the built app locally. Run `pnpm build` first.             |
| `pnpm lint`         | Run ESLint across the project.                                   |
| `pnpm format`       | Format files with Prettier.                                      |
| `pnpm format:check` | Check formatting without changing files.                         |
| `pnpm test:e2e`     | Run the Playwright end-to-end scenarios headlessly.              |

## End-to-end tests

The Playwright tests in `e2e/` use Chromium to exercise appointment booking and rescheduling against a real Medic API. They do not mock API responses.

Install the browser once after installing project dependencies:

```sh
pnpm exec playwright install chromium
```

Copy `.env.e2e.example` to `.env.e2e` and fill in the API URL and patient credentials:

```env
E2E_API_BASE_URL=http://localhost:8080
E2E_PATIENT_ONE_EMAIL=
E2E_PATIENT_ONE_PASSWORD=
E2E_PATIENT_TWO_EMAIL=
E2E_PATIENT_TWO_PASSWORD=
E2E_PATIENT_THREE_EMAIL=
E2E_PATIENT_THREE_PASSWORD=
```

Run all scenarios headlessly with `pnpm test:e2e`, or run an individual scenario with `pnpm test:e2e:booking-race` and `pnpm test:e2e:reschedule-conflict`. To watch the browser interactions with slowed actions, use `pnpm demo:booking-race` or `pnpm demo:reschedule-conflict`. Playwright starts Vite on `http://127.0.0.1:5174` and proxies API calls to the configured backend. Results and failure artifacts are written to `test-results/`.

## Project structure

```text
src/
  components/   Shared UI components
  features/     Auth, appointments, booking, patient, doctor, profile, and overview features
  routes/       Application routes and access control
  services/     API client, query client, notifications, and API alerts
  stores/       Client-side application state
  theme/        Design tokens and Ant Design/styled-components themes
  utils/        Shared formatting and utility functions
```

Feature-specific API clients, query hooks, schemas, components, and pages are generally kept together under `src/features/`.

## AI assistance

AI tools were used to help create and refine parts of this project, including implementation and documentation. Project contributors remain responsible for reviewing, validating, and maintaining the code.
