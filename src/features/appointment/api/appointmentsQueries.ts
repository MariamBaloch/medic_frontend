import { useQuery } from "@tanstack/react-query";
import { getAppointmentStatuses, getSpecializations } from "./appointmentsApi";

export const appointmentLookupKeys = {
  specializations: ["specializations"] as const,
  statuses: ["appointment-statuses"] as const,
};

export function useSpecializationsQuery(enabled = true) {
  return useQuery({
    queryKey: appointmentLookupKeys.specializations,
    queryFn: getSpecializations,
    meta: { notificationTitle: "Could not load specializations" },
    staleTime: 30 * 60 * 1000,
    enabled,
  });
}

export function useAppointmentStatusesQuery() {
  return useQuery({
    queryKey: appointmentLookupKeys.statuses,
    queryFn: getAppointmentStatuses,
    meta: { notificationTitle: "Could not load appointment statuses" },
    staleTime: 30 * 60 * 1000,
  });
}
