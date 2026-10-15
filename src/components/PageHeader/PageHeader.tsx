import type { ReactNode } from "react";
import { Space, Typography } from "antd";
import {
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderIcon,
  PageHeaderLeading,
  PageHeaderRoot,
} from "./PageHeader.styles";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function PageHeader({ title, description, action, icon }: PageHeaderProps) {
  return (
    <PageHeaderRoot>
      <PageHeaderLeading>
        {icon ? <PageHeaderIcon>{icon}</PageHeaderIcon> : null}
        <PageHeaderContent>
          <Typography.Title level={2}>{title}</Typography.Title>
          {description ? (
            <Typography.Paragraph type="secondary">{description}</Typography.Paragraph>
          ) : null}
        </PageHeaderContent>
      </PageHeaderLeading>
      {action ? (
        <PageHeaderActions>
          <Space>{action}</Space>
        </PageHeaderActions>
      ) : null}
    </PageHeaderRoot>
  );
}
