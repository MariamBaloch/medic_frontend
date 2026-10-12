import { Navigate, Outlet } from "react-router-dom";
import { hasActiveSession } from "@features/auth/authSession";

export function PublicRoute() {
  if (hasActiveSession()) {
    return <Navigate to="/patient/overview" replace />;
  }

  return <Outlet />;
}
