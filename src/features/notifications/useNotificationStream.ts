import { useEffect, useRef } from "react";
import { useAuthStore } from "@stores/authStore";
import { consumeNotificationStream } from "./api/notificationStream";
import type { AppNotification } from "./api/notification.schemas";

const reconnectDelayMs = 3_000;

export function useNotificationStream(onNotification: (notification: AppNotification) => void) {
  const token = useAuthStore((state) => state.token);
  const clearSession = useAuthStore((state) => state.clearSession);
  const seenIds = useRef(new Set<number>());
  const onNotificationRef = useRef(onNotification);

  useEffect(() => {
    onNotificationRef.current = onNotification;
  }, [onNotification]);

  useEffect(() => {
    seenIds.current.clear();
    if (!token) return;

    const controller = new AbortController();
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const connect = async () => {
      try {
        await consumeNotificationStream({
          token,
          signal: controller.signal,
          onNotification: (notification) => {
            if (seenIds.current.has(notification.id)) return;
            seenIds.current.add(notification.id);
            onNotificationRef.current(notification);
          },
        });
        if (!controller.signal.aborted) {
          retryTimer = setTimeout(() => void connect(), reconnectDelayMs);
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        if (error instanceof Error && error.message.includes("status 401")) {
          clearSession();
          return;
        }
        retryTimer = setTimeout(() => void connect(), reconnectDelayMs);
      }
    };

    void connect();
    return () => {
      controller.abort();
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [clearSession, token]);
}
