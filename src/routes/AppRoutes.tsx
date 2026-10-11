import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage, RegisterPage } from "@features/auth";
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
        <Route path="/app" element={<Navigate to="/app/appointments" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
