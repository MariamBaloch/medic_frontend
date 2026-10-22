import { App, notification } from "antd";
import type { ReactNode } from "react";

type NotificationApi = Pick<typeof notification, "open">;

let notificationApi: NotificationApi | undefined;

export function setAppNotificationApi(api: NotificationApi) {
  notificationApi = api;
}

export function notifyApp({
  type,
  message,
  description,
  key,
}: {
  type: "success" | "info" | "warning" | "error";
  message: ReactNode;
  description?: ReactNode;
  key?: string;
}) {
  notificationApi?.open({
    type,
    title: message,
    description,
    key,
    placement: "topRight",
    duration: 0,
  });
}

export function AppNotificationBridge() {
  const { notification: appNotification } = App.useApp();
  setAppNotificationApi(appNotification);
  return null;
}
