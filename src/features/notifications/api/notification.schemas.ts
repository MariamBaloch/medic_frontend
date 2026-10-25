import { z } from "zod";

export const notificationSchema = z.object({
  id: z.number(),
  title: z.string(),
  message: z.string(),
  type: z.string(),
  action: z.string(),
  relatedEntityId: z.number().nullable(),
  read: z.boolean(),
});

export const notificationPageSchema = z.object({
  content: z.array(notificationSchema),
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  first: z.boolean(),
  last: z.boolean(),
});

export const unreadNotificationCountSchema = z.object({ unreadCount: z.number() });
export const markAllNotificationsReadSchema = z.object({ updatedCount: z.number() });

export type AppNotification = z.infer<typeof notificationSchema>;
export type NotificationPage = z.infer<typeof notificationPageSchema>;
export type NotificationPageParams = { page: number; size: number; unreadOnly: boolean };
