import { apiClient } from "@services/api/axios";
import {
  markAllNotificationsReadSchema,
  notificationPageSchema,
  notificationSchema,
  unreadNotificationCountSchema,
} from "./notification.schemas";
import type { NotificationPageParams } from "./notification.schemas";

export async function getNotifications({ page, size, unreadOnly }: NotificationPageParams) {
  const { data } = await apiClient.get("/notifications", {
    params: { page, size, unreadOnly },
  });
  return notificationPageSchema.parse(data);
}

export async function getUnreadNotificationCount() {
  const { data } = await apiClient.get("/notifications/unread-count");
  return unreadNotificationCountSchema.parse(data);
}

export async function markNotificationRead(notificationId: number) {
  const { data } = await apiClient.patch(`/notifications/${notificationId}/read`);
  return notificationSchema.parse(data);
}

export async function markAllNotificationsRead() {
  const { data } = await apiClient.patch("/notifications/read-all");
  return markAllNotificationsReadSchema.parse(data);
}
