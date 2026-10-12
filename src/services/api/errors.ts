import { isAxiosError } from "axios";

interface ApiErrorResponse {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
  fieldErrors?: Record<string, string>;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  if (!error.response) {
    return "Unable to reach the server. Check your connection and try again.";
  }

  if (error.response.status === 401) {
    return "Invalid email or password.";
  }

  const response = error.response.data as
    | ApiErrorResponse
    | string
    | undefined;

  if (typeof response === "string" && response.trim()) {
    return response;
  }

  if (response && typeof response === "object") {
    if (response.fieldErrors) {
      const messages = Object.values(response.fieldErrors)
        .filter((message) => typeof message === "string" && message.trim());

      if (messages.length) {
        return messages.join(", ");
      }
    }

    if (response.message) return response.message;
    if (response.error) return response.error;
  }

  return fallback;
}