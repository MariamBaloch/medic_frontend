import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@stores/authStore";
import type { AppointmentFilters } from "@features/appointment/api/appointment.schemas";
import { getDoctorAppointmentStatusCounts, getDoctorAppointments } from "./doctorAppointmentsApi";

export const doctorAppointmentKeys = {
  all: ["doctor", "appointments"] as const,
  list: (filters: AppointmentFilters) => [...doctorAppointmentKeys.all, filters] as const,
};

export function useDoctorAppointmentsQuery(filters: AppointmentFilters) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: doctorAppointmentKeys.list(filters),
    queryFn: () => getDoctorAppointments(filters),
    meta: { notificationTitle: "Could not load appointments" },
    enabled: isAuthenticated,
    placeholderData: (previousData) => previousData,
  });
}

export function useDoctorAppointmentStatusCounts(filters: AppointmentFilters) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const countFilters = {
    patientName: filters.patientName,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    specializationId: filters.specializationId,
  };
  const countsQuery = useQuery({
    queryKey: [...doctorAppointmentKeys.all, "status-counts", countFilters],
    queryFn: () => getDoctorAppointmentStatusCounts(countFilters),
    meta: { notificationTitle: "Could not load appointment counts" },
    enabled: isAuthenticated,
    staleTime: 30_000,
  });

  return countsQuery.data ? { all: countsQuery.data.total, ...countsQuery.data.byStatus } : {};
}
