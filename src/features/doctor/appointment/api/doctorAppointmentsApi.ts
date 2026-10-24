import { apiClient } from "@services/api/axios";
import {
  appointmentFiltersSchema,
  appointmentPageSchema,
  appointmentStatusCountsSchema,
  doctorAppointmentStatusUpdateSchema,
  type AppointmentFilters,
  type AppointmentPage,
  type DoctorAppointmentStatusUpdate,
} from "@features/appointment/api/appointment.schemas";

export async function getDoctorAppointments(filters: AppointmentFilters): Promise<AppointmentPage> {
  const validatedFilters = appointmentFiltersSchema.parse(filters);
  const params = new URLSearchParams();

  if (validatedFilters.patientName) params.append("patientName", validatedFilters.patientName);
  if (validatedFilters.dateFrom) params.append("dateFrom", validatedFilters.dateFrom);
  if (validatedFilters.dateTo) params.append("dateTo", validatedFilters.dateTo);
  if (validatedFilters.status) params.append("status", validatedFilters.status);
  if (validatedFilters.specializationId !== undefined) {
    params.append("specializationId", String(validatedFilters.specializationId));
  }

  params.append("page", String(validatedFilters.page));
  params.append("size", String(validatedFilters.size));
  validatedFilters.sort.forEach((sort) => params.append("sort", sort));

  const { data } = await apiClient.get(`/doctors/appointments?${params.toString()}`);
  return appointmentPageSchema.parse(data);
}

export async function getDoctorAppointmentStatusCounts(filters: AppointmentFilters) {
  const validatedFilters = appointmentFiltersSchema.parse(filters);
  const params = new URLSearchParams();

  if (validatedFilters.patientName) params.append("patientName", validatedFilters.patientName);
  if (validatedFilters.dateFrom) params.append("dateFrom", validatedFilters.dateFrom);
  if (validatedFilters.dateTo) params.append("dateTo", validatedFilters.dateTo);
  if (validatedFilters.specializationId !== undefined) {
    params.append("specializationId", String(validatedFilters.specializationId));
  }

  const { data } = await apiClient.get(`/doctors/appointments/status-counts?${params.toString()}`);
  return appointmentStatusCountsSchema.parse(data);
}

export async function updateDoctorAppointmentStatus(
  appointmentId: number,
  request: DoctorAppointmentStatusUpdate,
) {
  const validatedRequest = doctorAppointmentStatusUpdateSchema.parse(request);
  const { data } = await apiClient.patch(
    `/doctors/appointments/${appointmentId}/status`,
    validatedRequest,
  );
  return data;
}
