import { apiClient } from "@services/api/axios";
import { auditApi, identityApi } from "@services/api/paths";
import { auditLogsSchema, type AuditLog } from "./admin.schemas";

export async function verifyDoctor(doctorProfileId: number): Promise<void> {
  await apiClient.patch(identityApi(`/admin/doctors/${doctorProfileId}/verify`));
}

export async function deleteUser(userId: number): Promise<void> {
  await apiClient.delete(identityApi(`/admin/users/${userId}`));
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  const { data } = await apiClient.get(auditApi());
  return auditLogsSchema.parse(data);
}
