import type { ReactNode } from "react";
import { Space, Typography } from "antd";
import { PageHeaderActions, PageHeaderContent, PageHeaderRoot } from "./PageHeader.styles";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <PageHeaderRoot>
      <PageHeaderContent>
        <Typography.Title level={2}>{title}</Typography.Title>
        {description ? <Typography.Paragraph type="secondary">{description}</Typography.Paragraph> : null}
      </PageHeaderContent>
      {action ? <PageHeaderActions><Space>{action}</Space></PageHeaderActions> : null}
    </PageHeaderRoot>
  );
}
