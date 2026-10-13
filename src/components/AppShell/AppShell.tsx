import {
  AppstoreOutlined,
  CalendarOutlined,
  LogoutOutlined,
  BellOutlined,
  DownOutlined,
  MedicineBoxOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Button, Dropdown, Menu, Tooltip, Typography } from "antd";
import type { MenuProps } from "antd";
import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppBrandIcon } from "@components/AppBrandIcon/AppBrandIcon";
import { getAppRoute, ROUTES, ROUTE_SEGMENTS } from "@constants/routes";
import { useCurrentUserQuery, useLogoutMutation } from "@features/auth/api/authQueries";
import { useAuthStore } from "@stores/authStore";
import { colors } from "@theme/tokens";
import {
  BrandBlock,
  BrandCopy,
  HeaderActions,
  PageHeading,
  AppContent,
  AppHeader,
  AppLayout,
  AppSider,
  UserMenuTrigger,
} from "./AppShell.styles";

export interface AppShellNavigationItem {
  key: string;
  path?: string;
  label: string;
  icon: ReactNode;
  title?: string;
  disabled?: boolean;
}

interface AppShellProps {
  basePath?: string;
  portalLabel?: string;
  navigation?: AppShellNavigationItem[];
}

export function AppShell({
  basePath = ROUTES.patient,
  portalLabel = "Patient portal",
  navigation,
}: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const currentUserQuery = useCurrentUserQuery();
  const logoutMutation = useLogoutMutation();
  const profile = currentUserQuery.data ?? user;
  const role = profile?.role ?? "PATIENT";
  const defaultNavigation: AppShellNavigationItem[] = [
    {
      key: getAppRoute(basePath, ROUTE_SEGMENTS.overview),
      path: getAppRoute(basePath, ROUTE_SEGMENTS.overview),
      icon: <AppstoreOutlined />,
      label: "Overview",
      title: "Overview",
    },
    ...(role === "PATIENT"
      ? [
          {
            key: getAppRoute(basePath, ROUTE_SEGMENTS.appointments),
            path: getAppRoute(basePath, ROUTE_SEGMENTS.appointments),
            icon: <CalendarOutlined />,
            label: "Appointments",
            title: "Appointments",
          },
        ]
      : role === "DOCTOR"
        ? [
            {
              key: "doctor-tools",
              icon: <MedicineBoxOutlined />,
              label: "Doctor tools · TBD",
              disabled: true,
            },
          ]
        : [
            {
              key: "admin-tools",
              icon: <SettingOutlined />,
              label: "Administration · TBD",
              disabled: true,
            },
          ]),
  ];
  const activeNavigation = navigation ?? defaultNavigation;
  const displayName = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim() || profile.email
    : "Loading profile";
  const title =
    activeNavigation.find((item) => item.path === location.pathname)?.title ?? portalLabel;
  const navigationItems: MenuProps["items"] = activeNavigation.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
    disabled: item.disabled,
  }));
  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }).format(new Date()),
    [],
  );

  useEffect(() => {
    if (currentUserQuery.data) {
      setUser(currentUserQuery.data);
    }
  }, [currentUserQuery.data, setUser]);

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    const selectedItem = activeNavigation.find((item) => item.key === key);
    if (selectedItem?.path) navigate(selectedItem.path);
  };
  const handleUserMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "sign-out") {
      logoutMutation.mutate(undefined, {
        onSettled: () => navigate(ROUTES.login, { replace: true }),
      });
    }
  };

  return (
    <AppLayout hasSider>
      <AppSider width={260} breakpoint="md" collapsedWidth={72} theme="dark">
        <BrandBlock>
          <AppBrandIcon compact />
          <BrandCopy>
            <Typography.Text strong>Medic</Typography.Text>
            <Typography.Text>{portalLabel}</Typography.Text>
          </BrandCopy>
        </BrandBlock>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={activeNavigation
            .filter((item) => item.path === location.pathname)
            .map((item) => item.key)}
          items={navigationItems}
          onClick={handleMenuClick}
        />
      </AppSider>

      <AppLayout>
        <AppHeader>
          <PageHeading>
            <Typography.Text>{dateLabel}</Typography.Text>
            <Typography.Text strong>{title}</Typography.Text>
          </PageHeading>

          <HeaderActions>
            <Tooltip title="Notifications">
              <Badge dot offset={[-15, 15]}>
                <Button
                  shape="circle"
                  type="text"
                  aria-label="Notifications"
                  icon={<BellOutlined />}
                />
              </Badge>
            </Tooltip>
            <Dropdown
              menu={{
                items: [{ key: "sign-out", label: "Sign out", icon: <LogoutOutlined /> }],
                onClick: handleUserMenuClick,
              }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <UserMenuTrigger type="button" aria-label="Open user menu">
                <Avatar size={34} icon={<UserOutlined />} style={{ background: colors.teal }} />
                <Typography.Text>{displayName}</Typography.Text>
                <DownOutlined style={{ fontSize: 10, color: colors.textSecondary }} />
              </UserMenuTrigger>
            </Dropdown>
          </HeaderActions>
        </AppHeader>

        <AppContent>
          <Outlet />
        </AppContent>
      </AppLayout>
    </AppLayout>
  );
}
