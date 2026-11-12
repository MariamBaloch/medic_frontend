import { useEffect } from "react";
import { Flex, Result, Spin } from "antd";
import { Navigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { ApiAlertHost } from "@components/ApiAlertHost";
import { AppShell } from "@components/AppShell/AppShell";
import { ROLE_OVERVIEW_ROUTES, ROUTES } from "@constants/routes";
import { useCurrentUserQuery } from "@features/auth/api/authQueries";
import { forceLogoutToLogin } from "@services/api/sessionExpiry";
import { useAuthStore } from "@stores/authStore";
import type { UserProfile } from "@features/auth/schemas/auth.schemas";

interface RoleBasedAppShellProps {
  role?: UserProfile["role"];
  basePath?: string;
  portalLabel?: string;
}

function isAuthFailure(error: unknown): boolean {
  if (!isAxiosError(error)) return false;
  const status = error.response?.status;
  return status === 401 || status === 403;
}

export function RoleBasedAppShell({ role, basePath, portalLabel }: RoleBasedAppShellProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const query = useCurrentUserQuery();

  useEffect(() => {
    if (query.isError && isAuthFailure(query.error)) {
      forceLogoutToLogin();
    }
  }, [query.isError, query.error]);

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  if (query.isPending) {
    return (
      <>
        <ApiAlertHost />
        <Flex align="center" justify="center" style={{ minHeight: "100dvh" }}>
          <Spin size="large" />
        </Flex>
      </>
    );
  }

  if (query.isError || !query.data) {
    if (isAuthFailure(query.error)) {
      return (
        <Flex align="center" justify="center" style={{ minHeight: "100dvh" }}>
          <Spin size="large" />
        </Flex>
      );
    }

    return (
      <>
        <ApiAlertHost />
        <Result
          status="error"
          title="Unable to load your account"
          subTitle="Your account details could not be loaded."
        />
      </>
    );
  }

  const profile = query.data;

  if (!role) {
    return <Navigate to={ROLE_OVERVIEW_ROUTES[profile.role]} replace />;
  }

  if (profile.role !== role) {
    return <Navigate to={ROLE_OVERVIEW_ROUTES[profile.role]} replace />;
  }

  const resolvedBasePath =
    basePath ??
    (role === "PATIENT" ? ROUTES.patient : role === "DOCTOR" ? ROUTES.doctor : ROUTES.admin);
  const resolvedPortalLabel =
    portalLabel ?? `${role.charAt(0)}${role.slice(1).toLowerCase()} portal`;

  return <AppShell basePath={resolvedBasePath} portalLabel={resolvedPortalLabel} />;
}
