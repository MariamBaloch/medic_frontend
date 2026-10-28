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

  const response = error.response.data as ApiErrorResponse | string | undefined;

  if (typeof response === "string" && response.trim()) {
    return response;
  }

  if (response && typeof response === "object") {
    const fieldErrors = response.fieldErrors
      ? Object.entries(response.fieldErrors)
          .filter(([, message]) => typeof message === "string" && message.trim())
          .map(([field, message]) => `${field}: ${message}`)
      : [];
    const messages = [response.message, response.error, ...fieldErrors].filter(
      (message): message is string => Boolean(message?.trim()),
    );

    if (messages.length) return [...new Set(messages)].join(" · ");
  }

  if (error.response.status === 401) return "Unauthorized. Please sign in again.";

  return fallback;
}

export function getApiErrorAlertContent(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): { message: string; description?: string } {
  if (!isAxiosError(error) || !error.response) {
    return { message: getApiErrorMessage(error, fallback) };
  }

  const response = error.response.data as ApiErrorResponse | string | undefined;
  if (!response || typeof response !== "object") {
    return { message: getApiErrorMessage(error, fallback) };
  }

  const message =
    response.message?.trim() || response.error?.trim() || getApiErrorMessage(error, fallback);
  const fieldErrors = Object.entries(response.fieldErrors ?? {})
    .filter(([, fieldMessage]) => typeof fieldMessage === "string" && fieldMessage.trim())
    .map(([field, fieldMessage]) => `${field}: ${fieldMessage}`);
  const descriptionParts = [
    response.message && response.error ? response.error : undefined,
    ...fieldErrors,
  ].filter((part): part is string => Boolean(part?.trim()));

  return {
    message,
    description: descriptionParts.length ? [...new Set(descriptionParts)].join(" · ") : undefined,
  };
}

export function getApiProvidedErrorMessage(error: unknown): string | undefined {
  if (!isAxiosError(error) || !error.response) {
    return undefined;
  }

  const response = error.response.data as ApiErrorResponse | string | undefined;
  if (typeof response === "string" && response.trim()) {
    return response;
  }

  if (!response || typeof response !== "object") {
    return undefined;
  }

  const status = response.status ?? error.response.status;
  const message = response.message ?? response.error;
  const fieldErrors = Object.entries(response.fieldErrors ?? {}).filter(
    ([, fieldMessage]) => typeof fieldMessage === "string" && fieldMessage.trim(),
  );
  const details = [
    `Status: ${status}`,
    message ? `Message: ${message}` : undefined,
    fieldErrors.length
      ? `Field errors: ${fieldErrors.map(([field, fieldMessage]) => `${field}: ${fieldMessage}`).join("; ")}`
      : undefined,
  ].filter(Boolean);

  return details.length ? details.join(" | ") : undefined;
}
