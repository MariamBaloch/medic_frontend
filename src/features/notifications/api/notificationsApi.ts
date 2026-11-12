import { apiClient } from "@services/api/axios";
import { notificationApi } from "@services/api/paths";
import {
  markAllNotificationsReadSchema,
  notificationPageSchema,
  notificationSchema,
  unreadNotificationCountSchema,
} from "./notification.schemas";
import type { NotificationPageParams } from "./notification.schemas";

export async function getNotifications({ page, size, unreadOnly }: NotificationPageParams) {
  const { data } = await apiClient.get(notificationApi(""), {
    params: { page, size, unreadOnly },
  });
  return notificationPageSchema.parse(data);
}

export async function getUnreadNotificationCount() {
  const { data } = await apiClient.get(notificationApi("/unread-count"));
  return unreadNotificationCountSchema.parse(data);
}

export async function markNotificationRead(notificationId: number) {
  const { data } = await apiClient.patch(notificationApi(`/${notificationId}/read`));
  return notificationSchema.parse(data);
}

export async function markAllNotificationsRead() {
  const { data } = await apiClient.patch(notificationApi("/read-all"));
  return markAllNotificationsReadSchema.parse(data);
}
