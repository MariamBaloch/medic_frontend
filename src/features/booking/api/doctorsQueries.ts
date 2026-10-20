import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@stores/authStore";
import { getDoctors } from "./doctorsApi";

interface DoctorSearchFilters {
  search: string;
  specializationId?: number;
}

export const doctorKeys = {
  all: ["doctors"] as const,
  list: (filters: DoctorSearchFilters) => [...doctorKeys.all, filters] as const,
};

export function useDoctorsQuery(filters: DoctorSearchFilters) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: doctorKeys.list(filters),
    queryFn: () => getDoctors(filters),
    enabled: isAuthenticated,
    placeholderData: (previousData) => previousData,
  });
}
