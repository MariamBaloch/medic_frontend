import type { AppNotification } from "./notification.schemas";

interface NotificationStreamOptions {
  token: string;
  signal: AbortSignal;
  onNotification: (notification: AppNotification) => void;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function parseNotification(data: string): AppNotification | undefined {
  try {
    const value: unknown = JSON.parse(data);
    if (typeof value !== "object" || value === null) return undefined;
    const record = value as Record<string, unknown>;
    if (
      typeof record.id !== "number" ||
      typeof record.title !== "string" ||
      typeof record.message !== "string"
    ) {
      return undefined;
    }

    return {
      id: record.id,
      title: record.title,
      message: record.message,
      type: typeof record.type === "string" ? record.type : "",
      action: typeof record.action === "string" ? record.action : "",
      relatedEntityId:
        typeof record.relatedEntityId === "number" || record.relatedEntityId === null
          ? record.relatedEntityId
          : null,
      read: record.read === true,
    };
  } catch {
    return undefined;
  }
}

function dispatchEventBlock(block: string, onNotification: (notification: AppNotification) => void) {
  let eventName = "message";
  const data: string[] = [];

  for (const line of block.split(/\r?\n/)) {
    if (line.startsWith("event:")) eventName = line.slice(6).trim();
    if (line.startsWith("data:")) data.push(line.slice(5).trimStart());
  }

  if (eventName !== "notification" || data.length === 0) return;
  const notification = parseNotification(data.join("\n"));
  if (notification) onNotification(notification);
}

export async function consumeNotificationStream({
  token,
  signal,
  onNotification,
}: NotificationStreamOptions): Promise<void> {
  const baseUrl = apiBaseUrl.replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/notifications/subscribe`, {
    headers: { Accept: "text/event-stream", Authorization: `Bearer ${token}` },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Notification stream failed with status ${response.status}`);
  }
  if (!response.body) throw new Error("Notification stream has no response body");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (!signal.aborted) {
      const { done, value } = await reader.read();
      if (done) return;

      buffer += decoder.decode(value, { stream: true });
      const blocks = buffer.split(/\r?\n\r?\n/);
      buffer = blocks.pop() ?? "";
      for (const block of blocks) dispatchEventBlock(block, onNotification);
    }
  } finally {
    void reader.cancel().catch(() => undefined);
  }
}
