import { Alert, Button } from "antd";
import type { AlertProps } from "antd";
import type { ReactNode } from "react";
import { getApiErrorMessage } from "@services/api/errors";

interface AppAlertProps extends Omit<AlertProps, "action" | "description" | "message" | "title" | "type"> {
  type: NonNullable<AlertProps["type"]>;
  title?: ReactNode;
  message?: ReactNode;
  description?: ReactNode;
  error?: unknown;
  onRetry?: () => void;
  retryLabel?: string;
}

export function AppAlert({
  type,
  title,
  message,
  description,
  error,
  onRetry,
  retryLabel = "Retry",
  showIcon = true,
  ...alertProps
}: AppAlertProps) {
  return (
    <Alert
      {...alertProps}
      type={type}
      showIcon={showIcon}
      title={title ?? message}
      description={error === undefined ? description : getApiErrorMessage(error)}
      action={
        onRetry ? (
          <Button onClick={() => void onRetry()}>{retryLabel}</Button>
        ) : undefined
      }
    />
  );
}
