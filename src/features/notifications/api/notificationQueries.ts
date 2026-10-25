import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@stores/authStore";
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "./notificationsApi";
import type { NotificationPageParams } from "./notification.schemas";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (params: Omit<NotificationPageParams, "page">) => [...notificationKeys.all, "list", params] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};

export function useInfiniteNotificationsQuery(params: Omit<NotificationPageParams, "page">) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useInfiniteQuery({
    queryKey: notificationKeys.list(params),
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getNotifications({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.page + 1),
    enabled: isAuthenticated,
    meta: { notificationTitle: "Could not load notifications" },
  });
}

export function useUnreadNotificationCountQuery() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: getUnreadNotificationCount,
    enabled: isAuthenticated,
    meta: { notificationTitle: "Could not load unread notification count" },
  });
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: number) => markNotificationRead(notificationId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
      ]);
    },
  });
}

export function useMarkAllNotificationsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
