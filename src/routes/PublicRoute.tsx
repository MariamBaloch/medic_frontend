import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => Boolean(localStorage.getItem("authToken"));

export function PublicRoute() {
  if (isAuthenticated()) {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
}
