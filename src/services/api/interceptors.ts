import type { AxiosError, AxiosInstance } from "axios";
import { showApiAlert } from "@services/api/appAlerts";
import { getApiErrorAlertContent } from "@services/api/errors";
import { forceLogoutToLogin, isPublicAuthRequest } from "@services/api/sessionExpiry";
import { useAuthStore } from "@stores/authStore";

export function setupResponseInterceptor(client: AxiosInstance): void {
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const status = error.response?.status;
      const requestUrl = error.config?.url ?? "";
      const hadSession = Boolean(useAuthStore.getState().token || useAuthStore.getState().isAuthenticated);
      const isSessionUnauthorized = status === 401 && hadSession && !isPublicAuthRequest(requestUrl);

      if (isSessionUnauthorized) {
        forceLogoutToLogin();
        return Promise.reject(error);
      }

      if (error.config?.skipErrorAlert) {
        return Promise.reject(error);
      }

      const alertContent = getApiErrorAlertContent(error);
      const requestPath = requestUrl.split("?")[0] || "unknown";
      showApiAlert({
        type: "error",
        ...alertContent,
        key: `api-error-${error.config?.method ?? "request"}-${requestPath}-${status ?? "network"}`,
      });

      return Promise.reject(error);
    },
  );
}
