import type { CSSProperties, ReactNode } from "react";
import { Typography } from "antd";
import {
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderEyebrow,
  PageHeaderIcon,
  PageHeaderLeading,
  PageHeaderRoot,
} from "./PageHeader.styles";

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  stacked?: boolean;
  style?: CSSProperties;
}

export function PageHeader({ title, description, eyebrow, action, icon, stacked = false, style }: PageHeaderProps) {
  return (
    <PageHeaderRoot $stacked={stacked} style={style}>
      <PageHeaderLeading>
        {icon ? <PageHeaderIcon>{icon}</PageHeaderIcon> : null}
        <PageHeaderContent>
          {eyebrow ? <PageHeaderEyebrow>{eyebrow}</PageHeaderEyebrow> : null}
          <Typography.Title level={2}>{title}</Typography.Title>
          {description ? (
            <Typography.Paragraph type="secondary">{description}</Typography.Paragraph>
          ) : null}
        </PageHeaderContent>
      </PageHeaderLeading>
      {action ? (
        <PageHeaderActions>
          <>{action}</>
        </PageHeaderActions>
      ) : null}
    </PageHeaderRoot>
  );
}
