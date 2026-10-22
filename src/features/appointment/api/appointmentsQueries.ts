import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@stores/authStore";
import type {
  AppointmentBookingRequest,
  AppointmentCancellationRequest,
  AppointmentFilters,
  AppointmentRescheduleRequest,
  AppointmentStatus,
} from "./appointment.schemas";
import {
  bookPatientAppointment,
  cancelPatientAppointment,
  reschedulePatientAppointment,
  getAppointmentStatuses,
  getPatientAppointment,
  getPatientAppointments,
  getSpecializations,
} from "./appointmentsApi";

export const appointmentKeys = {
  all: ["patient", "appointments"] as const,
  list: (filters: AppointmentFilters) => [...appointmentKeys.all, filters] as const,
  detail: (appointmentId: number) => [...appointmentKeys.all, "detail", appointmentId] as const,
  specializations: ["specializations"] as const,
  statuses: ["appointment-statuses"] as const,
};

export function useBookPatientAppointmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AppointmentBookingRequest) => bookPatientAppointment(request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
  });
}

export function useCancelPatientAppointmentMutation(appointmentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AppointmentCancellationRequest) =>
      cancelPatientAppointment(appointmentId, request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
  });
}

export function useReschedulePatientAppointmentMutation(appointmentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AppointmentRescheduleRequest) =>
      reschedulePatientAppointment(appointmentId, request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
  });
}

export function usePatientAppointmentsQuery(filters: AppointmentFilters, enabled = true) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: appointmentKeys.list(filters),
    queryFn: () => getPatientAppointments(filters),
    meta: { notificationTitle: "Could not load appointments" },
    enabled: isAuthenticated && enabled,
    placeholderData: (previousData) => previousData,
  });
}

export function usePatientAppointmentQuery(appointmentId: number | null) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: appointmentKeys.detail(appointmentId ?? 0),
    queryFn: () => getPatientAppointment(appointmentId ?? 0),
    meta: { notificationTitle: "Could not load appointment details" },
    enabled: isAuthenticated && appointmentId !== null,
  });
}

export function useSpecializationsQuery() {
  return useQuery({
    queryKey: appointmentKeys.specializations,
    queryFn: getSpecializations,
    meta: { notificationTitle: "Could not load specializations" },
    staleTime: 30 * 60 * 1000,
  });
}

export function useAppointmentStatusesQuery() {
  return useQuery({
    queryKey: appointmentKeys.statuses,
    queryFn: getAppointmentStatuses,
    meta: { notificationTitle: "Could not load appointment statuses" },
    staleTime: 30 * 60 * 1000,
  });
}

export function useAppointmentStatusCounts(filters: AppointmentFilters, statuses: AppointmentStatus[]) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const commonFilters = {
    doctorId: filters.doctorId,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    specializationId: filters.specializationId,
    sort: filters.sort,
  };
  const countStatuses: Array<{ key: string; status?: AppointmentStatus }> = [
    { key: "all" },
    ...statuses.map((status) => ({ key: status, status })),
  ];
  const results = useQueries({
    queries: countStatuses.map(({ key, status }) => ({
      queryKey: [...appointmentKeys.all, "status-count", commonFilters, key],
      queryFn: () =>
        getPatientAppointments({ ...commonFilters, status, page: 0, size: 1 }),
      meta: {
        notificationTitle: "Could not load appointment counts",
        notificationKey: "appointment-status-counts",
      },
      enabled: isAuthenticated,
      staleTime: 30_000,
    })),
  });

  return Object.fromEntries(
    countStatuses.map(({ key }, index) => [key, results[index]?.data?.totalElements]),
  ) as Record<string, number | undefined>;
}
