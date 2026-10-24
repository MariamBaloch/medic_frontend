import { apiClient } from "@services/api/axios";
import { appointmentStatusesSchema, specializationsSchema } from "./appointment.schemas";

export async function getSpecializations() {
  const { data } = await apiClient.get("/specializations");
  return specializationsSchema.parse(data);
}

export async function getAppointmentStatuses() {
  const { data } = await apiClient.get("/appointments/statuses");
  return appointmentStatusesSchema.parse(data);
}
