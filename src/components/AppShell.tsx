import {
  AppstoreOutlined,
  CalendarOutlined,
  FileTextOutlined,
  LogoutOutlined,
  BellOutlined,
  DownOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Button, Dropdown, Menu, Tooltip, Typography } from "antd";
import type { MenuProps } from "antd";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppBrandIcon } from "@components/AppBrandIcon";
import { endSession } from "@features/auth/authSession";
import { colors } from "@theme/tokens";
import {
  BrandBlock,
  BrandCopy,
  HeaderActions,
  PageHeading,
  AppContent,
  AppFooter,
  AppHeader,
  AppLayout,
  AppSider,
  UserMenuTrigger,
} from "./AppShell.styles";

export interface AppShellNavigationItem {
  path: string;
  label: string;
  icon: ReactNode;
  title?: string;
}

interface AppShellProps {
  basePath?: string;
  portalLabel?: string;
  userName?: string;
  navigation?: AppShellNavigationItem[];
}

export function AppShell({
  basePath = "/patient",
  portalLabel = "Patient portal",
  userName = "Maya Thompson",
  navigation = [
    {
      path: `${basePath}/overview`,
      icon: <AppstoreOutlined />,
      label: "Overview",
      title: "Overview",
    },
    {
      path: `${basePath}/appointments`,
      icon: <CalendarOutlined />,
      label: "Appointments",
      title: "Appointments",
    },
  ],
}: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const title = navigation.find((item) => item.path === location.pathname)?.title ?? portalLabel;
  const navigationItems: MenuProps["items"] = navigation.map((item) => ({
    key: item.path,
    icon: item.icon,
    label: item.label,
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

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => navigate(key);
  const handleUserMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "sign-out") {
      endSession();
      navigate("/login", { replace: true });
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
          selectedKeys={[location.pathname]}
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
                <Typography.Text>{userName}</Typography.Text>
                <DownOutlined style={{ fontSize: 10, color: colors.textSecondary }} />
              </UserMenuTrigger>
            </Dropdown>
          </HeaderActions>
        </AppHeader>

        <AppContent>
          <Outlet />
        </AppContent>
        <AppFooter>
          © {new Date().getFullYear()} Medic · {portalLabel}
        </AppFooter>
      </AppLayout>
    </AppLayout>
  );
}
