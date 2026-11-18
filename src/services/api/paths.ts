/**
 * Gateway public paths: /api/{service}/** with StripPrefix=2 on the backend.
 */
export const identityApi = (path = "") => `/api/identity${path}`;
export const bookingApi = (path = "") => `/api/booking${path}`;
export const notificationApi = (path = "") => `/api/notification${path}`;
export const auditApi = (path = "") => `/api/audit${path}`;
