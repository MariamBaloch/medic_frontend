import dayjs from "dayjs";
import { z } from "zod";

const auditTimestampSchema = z.preprocess((value) => {
  if (typeof value === "string") return value;
  if (!Array.isArray(value) || value.length < 3) return value;
  const [year, month, day, hour = 0, minute = 0, second = 0] = value;
  return dayjs(new Date(year, month - 1, day, hour, minute, second)).toISOString();
}, z.string());

export const auditLogSchema = z.object({
  id: z.number().int(),
  username: z.string(),
  action: z.string(),
  entityType: z.string(),
  description: z.string(),
  timestamp: auditTimestampSchema,
});

export const auditLogsSchema = z.array(auditLogSchema);

export type AuditLog = z.infer<typeof auditLogSchema>;
