import type { AxiosError, AxiosInstance } from "axios";
import { ROUTES } from "@constants/routes";
import { notifyApp } from "@services/api/appNotifications";
import { getApiErrorMessage } from "@services/api/errors";
import { useAuthStore } from "@stores/authStore";

export function setupResponseInterceptor(client: AxiosInstance): void {
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const message = getApiErrorMessage(error);
      const requestPath = error.config?.url?.split("?")[0] ?? "unknown";
      notifyApp({
        type: "error",
        message,
        key: `api-error-${error.config?.method ?? "request"}-${requestPath}-${error.response?.status ?? "network"}`,
      });

      const token = useAuthStore.getState().token;

      if (error.response?.status === 401 && token) {
        useAuthStore.getState().clearSession();

        if (window.location.pathname !== ROUTES.login) {
          window.location.assign(ROUTES.login);
        }
      }

      return Promise.reject(error);
    },
  );
}
