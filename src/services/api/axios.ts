import axios from "axios";
import type { AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { setupResponseInterceptor } from "@services/api/interceptors";
import { useAuthStore } from "@stores/authStore";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;

  if (token) {
    (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
  }

  return config;
});

setupResponseInterceptor(apiClient);
