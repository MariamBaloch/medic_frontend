import { apiClient } from "@services/api/axios";
import {
  appointmentFiltersSchema,
  appointmentPageSchema,
  appointmentStatusCountsSchema,
  appointmentBookingRequestSchema,
  appointmentCancellationRequestSchema,
  appointmentRescheduleRequestSchema,
  appointmentSchema,
  type AppointmentBookingRequest,
  type AppointmentCancellationRequest,
  type AppointmentRescheduleRequest,
  type AppointmentFilters,
  type AppointmentPage,
} from "@features/appointment/api/appointment.schemas";

export async function bookPatientAppointment(request: AppointmentBookingRequest) {
  const validatedRequest = appointmentBookingRequestSchema.parse(request);
  const { data } = await apiClient.post("/patient/appointments", validatedRequest);
  return appointmentSchema.parse(data);
}

export async function cancelPatientAppointment(
  appointmentId: number,
  request: AppointmentCancellationRequest,
) {
  const validatedRequest = appointmentCancellationRequestSchema.parse(request);
  const { data } = await apiClient.put(
    `/patient/appointments/${appointmentId}/cancel`,
    validatedRequest,
  );
  return appointmentSchema.parse(data);
}

export async function reschedulePatientAppointment(
  appointmentId: number,
  request: AppointmentRescheduleRequest,
) {
  const validatedRequest = appointmentRescheduleRequestSchema.parse(request);
  const { data } = await apiClient.put(
    `/patient/appointments/${appointmentId}/reschedule`,
    validatedRequest,
  );
  return appointmentSchema.parse(data);
}

export async function getPatientAppointments(
  filters: AppointmentFilters,
): Promise<AppointmentPage> {
  const validatedFilters = appointmentFiltersSchema.parse(filters);
  const params = new URLSearchParams();

  if (validatedFilters.doctorName) params.append("doctorName", validatedFilters.doctorName);
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

export async function getPatientAppointmentStatusCounts(filters: AppointmentFilters) {
  const validatedFilters = appointmentFiltersSchema.parse(filters);
  const params = new URLSearchParams();

  if (validatedFilters.doctorName) params.append("doctorName", validatedFilters.doctorName);
  if (validatedFilters.dateFrom) params.append("dateFrom", validatedFilters.dateFrom);
  if (validatedFilters.dateTo) params.append("dateTo", validatedFilters.dateTo);
  if (validatedFilters.specializationId !== undefined) {
    params.append("specializationId", String(validatedFilters.specializationId));
  }

  const { data } = await apiClient.get(`/patient/appointments/status-counts?${params.toString()}`);
  return appointmentStatusCountsSchema.parse(data);
}
