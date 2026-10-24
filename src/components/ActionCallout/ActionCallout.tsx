import type { ReactNode } from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Flex, Typography } from "antd";
import { ActionCalloutRoot } from "./ActionCallout.styles";

interface ActionCalloutProps {
  title: string;
  description: string;
  actionLabel: string;
  icon?: ReactNode;
  onAction: () => void;
}

export function ActionCallout({ title, description, actionLabel, icon, onAction }: ActionCalloutProps) {
  return (
    <ActionCalloutRoot>
      <Flex vertical gap={8}>
        <Typography.Title level={5} style={{ margin: 0 }}>{title}</Typography.Title>
        <Typography.Text>{description}</Typography.Text>
        <Button type="link" onClick={onAction} style={{ alignSelf: "flex-start", paddingInline: 0 }}>
          <Flex align="center" gap={8}>
            {actionLabel}
            {icon ?? <ArrowRightOutlined />}
          </Flex>
        </Button>
      </Flex>
    </ActionCalloutRoot>
  );
}
