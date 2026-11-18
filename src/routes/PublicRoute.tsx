import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@constants/routes";
import { useAuthStore } from "@stores/authStore";

export function PublicRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.app} replace />;
  }

  return <Outlet />;
}
