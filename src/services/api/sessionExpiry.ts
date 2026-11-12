import { ROUTES } from "@constants/routes";
import { clearApiAlerts } from "@services/api/appAlerts";
import { isJwtExpired } from "@services/api/jwt";
import { queryClient } from "@services/api/queryClient";
import { useAuthStore } from "@stores/authStore";

let redirectingToLogin = false;

const PUBLIC_AUTH_PATH_MARKERS = [
  "/auth/users/login",
  "/auth/users/register/",
  "/auth/users/forgot-password",
  "/auth/users/reset-password",
  "/auth/users/verify",
] as const;

/**
 * Returns true when the request is a public credential endpoint that may legitimately return 401.
 */
export function isPublicAuthRequest(url?: string): boolean {
  if (!url) return false;
  return PUBLIC_AUTH_PATH_MARKERS.some((marker) => url.includes(marker));
}

/**
 * Clears persisted auth, query cache, and alerts, then hard-redirects to login once.
 */
export function forceLogoutToLogin(): void {
  const { token, isAuthenticated } = useAuthStore.getState();
  if (!token && !isAuthenticated) {
    if (window.location.pathname !== ROUTES.login && !redirectingToLogin) {
      redirectingToLogin = true;
      window.location.assign(ROUTES.login);
    }
    return;
  }

  if (redirectingToLogin) return;
  redirectingToLogin = true;

  useAuthStore.getState().clearSession();
  queryClient.clear();
  clearApiAlerts();

  if (window.location.pathname !== ROUTES.login) {
    window.location.assign(ROUTES.login);
  } else {
    redirectingToLogin = false;
  }
}

/**
 * Clears the local session when the stored JWT is already expired.
 */
export function clearSessionIfTokenExpired(): boolean {
  const token = useAuthStore.getState().token;
  if (!token || !isJwtExpired(token)) return false;
  useAuthStore.getState().clearSession();
  queryClient.clear();
  clearApiAlerts();
  return true;
}
