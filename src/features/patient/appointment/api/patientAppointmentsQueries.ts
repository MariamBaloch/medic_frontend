import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@stores/authStore";
import type {
  AppointmentBookingRequest,
  AppointmentCancellationRequest,
  AppointmentFilters,
  AppointmentRescheduleRequest,
} from "@features/appointment/api/appointment.schemas";
import { getAppointment } from "@features/appointment/api/appointmentsApi";
import {
  bookPatientAppointment,
  cancelPatientAppointment,
  getPatientAppointments,
  getPatientAppointmentStatusCounts,
  reschedulePatientAppointment,
} from "./patientAppointmentsApi";

export const patientAppointmentKeys = {
  all: ["patient", "appointments"] as const,
  list: (filters: AppointmentFilters) => [...patientAppointmentKeys.all, filters] as const,
  detail: (appointmentId: number) =>
    [...patientAppointmentKeys.all, "detail", appointmentId] as const,
};

export function useBookPatientAppointmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: AppointmentBookingRequest) => bookPatientAppointment(request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: patientAppointmentKeys.all }),
  });
}

export function useCancelPatientAppointmentMutation(appointmentId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: AppointmentCancellationRequest) =>
      cancelPatientAppointment(appointmentId, request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: patientAppointmentKeys.all }),
  });
}

export function useReschedulePatientAppointmentMutation(appointmentId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: AppointmentRescheduleRequest) =>
      reschedulePatientAppointment(appointmentId, request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: patientAppointmentKeys.all }),
  });
}

export function usePatientAppointmentsQuery(filters: AppointmentFilters, enabled = true) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: patientAppointmentKeys.list(filters),
    queryFn: () => getPatientAppointments(filters),
    meta: { notificationTitle: "Could not load appointments" },
    enabled: isAuthenticated && enabled,
    placeholderData: (previousData) => previousData,
  });
}

export function usePatientAppointmentQuery(appointmentId: number | null) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: patientAppointmentKeys.detail(appointmentId ?? 0),
    queryFn: () => getAppointment(appointmentId ?? 0),
    meta: { notificationTitle: "Could not load appointment details" },
    enabled: isAuthenticated && appointmentId !== null,
  });
}

export function usePatientAppointmentStatusCounts(filters: AppointmentFilters) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const commonFilters = {
    doctorName: filters.doctorName,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    specializationId: filters.specializationId,
  };
  const countsQuery = useQuery({
    queryKey: [...patientAppointmentKeys.all, "status-counts", commonFilters],
    queryFn: () => getPatientAppointmentStatusCounts(commonFilters),
    meta: { notificationTitle: "Could not load appointment counts" },
    enabled: isAuthenticated,
    staleTime: 30_000,
  });

  return countsQuery.data ? { all: countsQuery.data.total, ...countsQuery.data.byStatus } : {};
}
