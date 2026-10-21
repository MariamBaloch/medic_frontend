import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@stores/authStore";
import { getDoctorAvailability } from "./doctorAvailabilityApi";

export const doctorAvailabilityKeys = {
  all: ["patient", "doctor-availability"] as const,
  list: (doctorId: number | null, from: string, to: string) =>
    [...doctorAvailabilityKeys.all, doctorId, from, to] as const,
};

export function useDoctorAvailabilityQuery(doctorId: number | null, from: string, to: string) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: doctorAvailabilityKeys.list(doctorId, from, to),
    queryFn: () => {
      if (doctorId === null) {
        throw new Error("A doctor must be selected to load availability.");
      }
      return getDoctorAvailability({ doctorId, from, to });
    },
    enabled: isAuthenticated && doctorId !== null,
  });
}
