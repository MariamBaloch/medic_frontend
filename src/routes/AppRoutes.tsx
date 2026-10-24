import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { ForgotPasswordPage, LoginPage, RegisterPage, ResetPasswordPage } from "@features/auth";
import { ROUTES, ROUTE_SEGMENTS } from "@constants/routes";
import { RoleBasedAppShell } from "@routes/RoleBasedAppShell";
import { PatientAppointmentsPage } from "@features/patient/appointment/PatientAppointmentsPage";
import { BookingPage } from "@features/booking/BookingPage";
import { ProtectedRoute } from "@routes/ProtectedRoute";
import { PublicRoute } from "@routes/PublicRoute";
import { ProfilePage } from "@features/profile/ProfilePage";
import { PatientOverviewPage } from "@features/overview/patient/PatientOverviewPage";
import { DoctorAvailabilityPage } from "@features/doctor/availability/DoctorAvailabilityPage";
import { DoctorTimeOffPage } from "@features/doctor/timeOff";
import { DoctorAppointmentsPage } from "@features/doctor/appointment";

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<Navigate to={ROUTES.login} replace />} />

      <Route element={<PublicRoute />}>
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />
        <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.resetPassword} element={<ResetPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.app} element={<RoleBasedAppShell />} />
        <Route
          path={ROUTES.patient}
          element={
            <RoleBasedAppShell
              role="PATIENT"
              basePath={ROUTES.patient}
              portalLabel="Patient portal"
            />
          }
        >
          <Route index element={<Navigate to={ROUTE_SEGMENTS.overview} replace />} />
          <Route path={ROUTE_SEGMENTS.overview} element={<PatientOverviewPage />} />
          <Route path={ROUTE_SEGMENTS.profile} element={<ProfilePage />} />
          <Route path={ROUTE_SEGMENTS.appointments} element={<Outlet />}>
            <Route index element={<PatientAppointmentsPage />} />
            <Route path={ROUTE_SEGMENTS.bookAppointment} element={<BookingPage />} />
          </Route>
        </Route>
        <Route
          path={ROUTES.doctor}
          element={
            <RoleBasedAppShell role="DOCTOR" basePath={ROUTES.doctor} portalLabel="Doctor portal" />
          }
        >
          <Route index element={<Navigate to={ROUTE_SEGMENTS.overview} replace />} />
          <Route path={ROUTE_SEGMENTS.overview} element={null} />
          <Route path={ROUTE_SEGMENTS.appointments} element={<DoctorAppointmentsPage />} />
          <Route path={ROUTE_SEGMENTS.availability} element={<DoctorAvailabilityPage />} />
          <Route path={ROUTE_SEGMENTS.timeOff} element={<DoctorTimeOffPage />} />
          <Route path={ROUTE_SEGMENTS.profile} element={<ProfilePage />} />
        </Route>
        <Route
          path={ROUTES.admin}
          element={
            <RoleBasedAppShell role="ADMIN" basePath={ROUTES.admin} portalLabel="Admin portal" />
          }
        >
          <Route index element={<Navigate to={ROUTE_SEGMENTS.overview} replace />} />
          <Route path={ROUTE_SEGMENTS.overview} element={null} />
          <Route path={ROUTE_SEGMENTS.profile} element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path={ROUTES.notFound} element={<Navigate to={ROUTES.login} replace />} />
    </Routes>
  );
}
