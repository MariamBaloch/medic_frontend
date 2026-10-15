import { apiClient } from "@services/api/axios";
import {
  appointmentFiltersSchema,
  appointmentPageSchema,
  appointmentStatusesSchema,
  appointmentDetailsSchema,
  specializationsSchema,
  type AppointmentFilters,
  type AppointmentPage,
  type Specialization,
} from "./appointment.schemas";

export async function getPatientAppointments(filters: AppointmentFilters): Promise<AppointmentPage> {
  const validatedFilters = appointmentFiltersSchema.parse(filters);
  const params = new URLSearchParams();

  if (validatedFilters.doctorId !== undefined) {
    params.append("doctorId", String(validatedFilters.doctorId));
  }
  if (validatedFilters.dateFrom) params.append("dateFrom", validatedFilters.dateFrom);
  if (validatedFilters.dateTo) params.append("dateTo", validatedFilters.dateTo);
  if (validatedFilters.status) params.append("status", validatedFilters.status);
  if (validatedFilters.specializationId !== undefined) {
    params.append("specializationId", String(validatedFilters.specializationId));
  }

  params.append("page", String(validatedFilters.page));
  params.append("size", String(validatedFilters.size));
  validatedFilters.sort.forEach((sort) => params.append("sort", sort));

  const { data } = await apiClient.get(`/patient/appointments?${params.toString()}`);
  return appointmentPageSchema.parse(data);
}

export async function getPatientAppointment(appointmentId: number) {
  const { data } = await apiClient.get(`/patient/appointments/${appointmentId}`);
  return appointmentDetailsSchema.parse(data);
}

export async function getSpecializations(): Promise<Specialization[]> {
  const { data } = await apiClient.get("/specializations");
  return specializationsSchema.parse(data);
}

export async function getAppointmentStatuses() {
  const { data } = await apiClient.get("/appointments/statuses");
  return appointmentStatusesSchema.parse(data);
}
