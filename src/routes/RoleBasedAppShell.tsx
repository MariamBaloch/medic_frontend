import { Flex, Result, Spin } from "antd";
import { Navigate } from "react-router-dom";
import { AppShell } from "@components/AppShell/AppShell";
import { ROLE_OVERVIEW_ROUTES, ROUTES } from "@constants/routes";
import { useCurrentUserQuery } from "@features/auth/api/authQueries";
import { useAuthStore } from "@stores/authStore";
import type { UserProfile } from "@features/auth/schemas/auth.schemas";

interface RoleBasedAppShellProps {
  role?: UserProfile["role"];
  basePath?: string;
  portalLabel?: string;
}

export function RoleBasedAppShell({ role, basePath, portalLabel }: RoleBasedAppShellProps) {
  const currentUser = useAuthStore((state) => state.user);
  const query = useCurrentUserQuery();
  const profile = query.data ?? currentUser;

  if (!profile) {
    if (query.isPending) {
      return (
        <Flex align="center" justify="center" style={{ minHeight: "100dvh" }}>
          <Spin size="large" />
        </Flex>
      );
    }

    return (
      <Result
        status="error"
        title="Unable to load your account"
        subTitle="Your account details could not be loaded."
      />
    );
  }

  if (!role) {
    return <Navigate to={ROLE_OVERVIEW_ROUTES[profile.role]} replace />;
  }

  if (profile.role !== role) {
    return <Navigate to={ROLE_OVERVIEW_ROUTES[profile.role]} replace />;
  }

  const resolvedBasePath = basePath ?? (role === "PATIENT" ? ROUTES.patient : role === "DOCTOR" ? ROUTES.doctor : ROUTES.admin);
  const resolvedPortalLabel = portalLabel ?? `${role.charAt(0)}${role.slice(1).toLowerCase()} portal`;

  return <AppShell basePath={resolvedBasePath} portalLabel={resolvedPortalLabel} />;
}
