export function isJwtExpired(token: string, skewMs = 5_000): boolean {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return true;

    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const payload = JSON.parse(atob(padded)) as { exp?: unknown };

    if (typeof payload.exp !== "number") return false;
    return payload.exp * 1000 <= Date.now() + skewMs;
  } catch {
    return true;
  }
}
