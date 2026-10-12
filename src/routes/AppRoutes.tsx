import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage, RegisterPage } from "@features/auth";
import { AppShell } from "@components/AppShell";
import {
  PatientAppointmentsPage
} from "@features/patient/pages/PatientPages";
import { ProtectedRoute } from "@routes/ProtectedRoute";
import { PublicRoute } from "@routes/PublicRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<Navigate to="/patient/overview" replace />} />
        <Route path="/patient" element={<AppShell basePath="/patient" portalLabel="Patient portal" />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={null} />
          <Route path="appointments" element={<PatientAppointmentsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
