const demoSessionKey = "medic.demoAuthenticated";

export function hasActiveSession() {
  return Boolean(localStorage.getItem("authToken") || sessionStorage.getItem(demoSessionKey));
}

export function startDemoSession() {
  sessionStorage.setItem(demoSessionKey, "true");
}

export function endSession() {
  localStorage.removeItem("authToken");
  sessionStorage.removeItem(demoSessionKey);
}
