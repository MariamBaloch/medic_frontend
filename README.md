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
- **Vite 8** for development and production builds
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
| `pnpm build`        | Type-check the project and create a production build in `dist/`. |
| `pnpm preview`      | Serve the production build locally. Run `pnpm build` first.      |
| `pnpm lint`         | Run ESLint across the project.                                   |
| `pnpm format`       | Format files with Prettier.                                      |
| `pnpm format:check` | Check formatting without changing files.                         |

For a production build, set `VITE_API_BASE_URL` to the API address that users' browsers can reach before running `pnpm build`.

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
