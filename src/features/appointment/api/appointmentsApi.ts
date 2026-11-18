import { apiClient } from "@services/api/axios";
import { bookingApi, identityApi } from "@services/api/paths";
import {
  appointmentDetailsSchema,
  appointmentStatusesSchema,
  specializationsSchema,
} from "./appointment.schemas";

export async function getAppointment(
  appointmentId: number,
  options?: { skipErrorAlert?: boolean },
) {
  const { data } = await apiClient.get(bookingApi(`/appointments/${appointmentId}`), {
    skipErrorAlert: options?.skipErrorAlert,
  });
  return appointmentDetailsSchema.parse(data);
}

export async function getSpecializations() {
  const { data } = await apiClient.get(identityApi("/specializations"));
  return specializationsSchema.parse(data);
}

export async function getAppointmentStatuses() {
  const { data } = await apiClient.get(bookingApi("/appointments/statuses"));
  return appointmentStatusesSchema.parse(data);
}
