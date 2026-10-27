import type { ReactNode } from "react";

export type ApiAlertType = "success" | "info" | "warning" | "error";

export interface ApiAlert {
  id: number;
  type: ApiAlertType;
  message: ReactNode;
  description?: ReactNode;
}

type ApiAlertListener = (alert: ApiAlert | null) => void;

let currentAlert: ApiAlert | null = null;
let currentAlertKey: string | undefined;
let nextAlertId = 0;
let autoDismissTimeout: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<ApiAlertListener>();

function publish() {
  listeners.forEach((listener) => listener(currentAlert));
}

export function showApiAlert({
  type,
  message,
  description,
  key,
}: {
  type: ApiAlertType;
  message: ReactNode;
  description?: ReactNode;
  key?: string;
}) {
  const sameAlert = key !== undefined && currentAlertKey === key;
  currentAlert = {
    id: sameAlert && currentAlert ? currentAlert.id : ++nextAlertId,
    type,
    message,
    description,
  };
  currentAlertKey = key;
  if (autoDismissTimeout) clearTimeout(autoDismissTimeout);
  const alertId = currentAlert.id;
  autoDismissTimeout = setTimeout(() => dismissApiAlert(alertId), 10_000);
  publish();
}

export function dismissApiAlert(id: number) {
  if (currentAlert?.id !== id) return;
  if (autoDismissTimeout) clearTimeout(autoDismissTimeout);
  autoDismissTimeout = undefined;
  currentAlert = null;
  currentAlertKey = undefined;
  publish();
}

export function getCurrentApiAlert() {
  return currentAlert;
}

export function subscribeToApiAlerts(listener: ApiAlertListener) {
  listeners.add(listener);
  listener(currentAlert);
  return () => {
    listeners.delete(listener);
  };
}
