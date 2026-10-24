export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  app: "/app",
  patient: "/patient",
  patientOverview: "/patient/overview",
  patientAppointments: "/patient/appointments",
  patientBookAppointment: "/patient/appointments/book",
  doctor: "/doctor",
  doctorOverview: "/doctor/overview",
  doctorAppointments: "/doctor/appointments",
  doctorAvailability: "/doctor/availability",
  doctorTimeOff: "/doctor/time-off",
  admin: "/admin",
  adminOverview: "/admin/overview",
  notFound: "*",
} as const;

export const ROUTE_SEGMENTS = {
  overview: "overview",
  appointments: "appointments",
  availability: "availability",
  timeOff: "time-off",
  profile: "profile",
  bookAppointment: "book",
} as const;

export const ROLE_OVERVIEW_ROUTES = {
  PATIENT: ROUTES.patientOverview,
  DOCTOR: ROUTES.doctorOverview,
  ADMIN: ROUTES.adminOverview,
} as const;

export function getAppRoute(basePath: string, segment: string): string {
  return `${basePath.replace(/\/$/, "")}/${segment}`;
}
