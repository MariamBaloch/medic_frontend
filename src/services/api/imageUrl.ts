import { apiClient } from "@services/api/axios";

const UPLOADS_SEGMENT = "/uploads/";

function collapseSlashes(value: string): string {
  return value.replace(/\\/g, "/").replace(/([^:]\/)\/+/g, "$1");
}

/**
 * Builds a browser URL for an avatar.
 * Stored values may still contain the filesystem directory and a repeated slash.
 */
export function resolveAvatarUrl(imageUrl: string | null | undefined): string | undefined {
  if (!imageUrl?.trim()) return undefined;

  const collapsed = collapseSlashes(imageUrl.trim());
  const origin = String(apiClient.defaults.baseURL ?? "").replace(/\/$/, "");
  const uploadsIndex = collapsed.toLowerCase().lastIndexOf(UPLOADS_SEGMENT);

  if (uploadsIndex >= 0) {
    const objectPath = collapsed.slice(uploadsIndex + UPLOADS_SEGMENT.length).replace(/^\/+/, "");
    if (!objectPath || objectPath.split("/").includes("..")) return undefined;

    const beforeUploads = collapsed.slice(0, uploadsIndex);
    const gatewayPrefix = beforeUploads.match(/(\/api\/[^/]+)$/)?.[1] ?? "/api/identity";
    const path = `${gatewayPrefix}/uploads/${objectPath}`;
    return origin ? `${origin}${path}` : path;
  }

  if (/^https?:\/\//i.test(collapsed)) return collapsed;
  if (!origin) return collapsed;

  try {
    return new URL(collapsed, `${origin}/`).toString();
  } catch {
    return collapsed;
  }
}
