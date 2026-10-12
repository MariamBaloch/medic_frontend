import { Navigate, Outlet, useLocation } from "react-router-dom";
import { hasActiveSession } from "@features/auth/authSession";

export function ProtectedRoute() {
  const location = useLocation();

  if (!hasActiveSession()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
