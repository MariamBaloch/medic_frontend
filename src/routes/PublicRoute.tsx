import { Navigate, Outlet } from "react-router-dom";
import { ApiAlertHost } from "@components/ApiAlertHost";
import { ROUTES } from "@constants/routes";
import { useAuthStore } from "@stores/authStore";

export function PublicRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.app} replace />;
  }

  return (
    <>
      <ApiAlertHost />
      <Outlet />
    </>
  );
}
