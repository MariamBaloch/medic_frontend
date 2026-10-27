import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@stores/authStore";
import { doctorAvailabilityKeys } from "@features/booking/api/doctorAvailabilityQueries";
import { patientAppointmentKeys } from "@features/patient/appointment/api/patientAppointmentsQueries";
import {
  acceptPatientWaitlistOffer,
  getPatientWaitlistEntries,
  joinPatientWaitlist,
  removePatientWaitlistEntry,
} from "./waitlistApi";
import type { JoinWaitlistRequest, WaitlistFilters } from "./waitlist.schemas";

export const patientWaitlistKeys = {
  all: ["patient", "waitlist"] as const,
  list: (filters: WaitlistFilters) => [...patientWaitlistKeys.all, "list", filters] as const,
};

export function usePatientWaitlistQuery(filters: WaitlistFilters) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: patientWaitlistKeys.list(filters),
    queryFn: () => getPatientWaitlistEntries(filters),
    meta: { notificationTitle: "Could not load your waitlist" },
    enabled: isAuthenticated,
    placeholderData: (previousData) => previousData,
  });
}

export function useJoinPatientWaitlistMutation() {
  const queryClient = useQueryClient();
  const refreshWaitlistAndAvailability = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: patientWaitlistKeys.all, refetchType: "all" }),
      queryClient.invalidateQueries({ queryKey: doctorAvailabilityKeys.all, refetchType: "all" }),
    ]);

  return useMutation({
    mutationFn: (request: JoinWaitlistRequest) => joinPatientWaitlist(request),
    onSuccess: refreshWaitlistAndAvailability,
    onError: refreshWaitlistAndAvailability,
  });
}

export function useRemovePatientWaitlistEntryMutation() {
  const queryClient = useQueryClient();
  const refreshWaitlistAndAvailability = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: patientWaitlistKeys.all, refetchType: "all" }),
      queryClient.invalidateQueries({ queryKey: doctorAvailabilityKeys.all, refetchType: "all" }),
    ]);

  return useMutation({
    mutationFn: (entryId: number) => removePatientWaitlistEntry(entryId),
    onSuccess: refreshWaitlistAndAvailability,
    onError: refreshWaitlistAndAvailability,
  });
}

export function useAcceptPatientWaitlistOfferMutation() {
  const queryClient = useQueryClient();
  const refreshWaitlistAndAvailability = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: patientWaitlistKeys.all, refetchType: "all" }),
      queryClient.invalidateQueries({ queryKey: doctorAvailabilityKeys.all, refetchType: "all" }),
    ]);

  return useMutation({
    mutationFn: (entryId: number) => acceptPatientWaitlistOffer(entryId),
    onSuccess: () =>
      Promise.all([
        refreshWaitlistAndAvailability(),
        queryClient.invalidateQueries({ queryKey: patientAppointmentKeys.all, refetchType: "all" }),
      ]),
    onError: refreshWaitlistAndAvailability,
  });
}
