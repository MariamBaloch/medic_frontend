import type { ReactNode } from "react";
import { Button, Flex, Typography } from "antd";
import { DashboardActionCard, DashboardActionIcon } from "../OverviewShared.styles";

interface DashboardActionSectionProps {
  icon: ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
}

export function DashboardActionSection({
  icon,
  title,
  description,
  buttonLabel,
  onClick,
}: DashboardActionSectionProps) {
  return (
    <DashboardActionCard>
      <Flex vertical align="flex-start" gap={10}>
        <DashboardActionIcon>{icon}</DashboardActionIcon>
        <Typography.Title level={5} style={{ margin: 0 }}>{title}</Typography.Title>
        <Typography.Paragraph type="secondary" style={{ margin: 0, minHeight: 42 }}>
          {description}
        </Typography.Paragraph>
        <Button color="primary" variant="outlined" onClick={onClick}>
          {buttonLabel}
        </Button>
      </Flex>
    </DashboardActionCard>
  );
}
