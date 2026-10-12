import type { AxiosError, AxiosInstance } from "axios";
import { ROUTES } from "@constants/routes";
import { useAuthStore } from "@stores/authStore";

export function setupResponseInterceptor(client: AxiosInstance): void {
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
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
