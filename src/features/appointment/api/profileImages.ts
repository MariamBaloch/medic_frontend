import { useQuery } from "@tanstack/react-query";
import { getDoctors } from "@features/booking/api/doctorsApi";
import { doctorKeys } from "@features/booking/api/doctorsQueries";
import { useAuthStore } from "@stores/authStore";
import { getAppointment } from "./appointmentsApi";

const doctorDirectoryFilters = { search: "", requireUpcomingAvailability: false } as const;

function profileImageKey(appointmentId: number) {
  return ["appointments", "profile-image", appointmentId] as const;
}

function listedImage(imageUrl?: string | null) {
  return imageUrl?.trim() || undefined;
}

/**
 * Appointment lists omit the photo. Active doctors already expose it on the directory,
 * and the appointment detail response has the current photo when the directory does not.
 */
export function useDoctorProfileImage(
  appointmentId: number,
  doctorId: number | undefined,
  imageUrl?: string | null,
) {
  const listed = listedImage(imageUrl);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const doctorsQuery = useQuery({
    queryKey: doctorKeys.list(doctorDirectoryFilters),
    queryFn: () => getDoctors(doctorDirectoryFilters),
    enabled: isAuthenticated && !listed,
    staleTime: 5 * 60 * 1000,
  });
  const fromDirectory = doctorsQuery.data
    ?.find((doctor) => doctor.doctor.doctorProfileId === doctorId)
    ?.imageUrl?.trim();
  const detailsQuery = useQuery({
    queryKey: profileImageKey(appointmentId),
    queryFn: () => getAppointment(appointmentId, { skipErrorAlert: true }),
    enabled: isAuthenticated && !listed && !fromDirectory && doctorsQuery.isFetched,
    staleTime: 10 * 60 * 1000,
  });

  return listed || fromDirectory || detailsQuery.data?.doctorImageUrl?.trim() || undefined;
}

/** Appointment lists omit the photo. The detail response has the patient's current one. */
export function usePatientProfileImage(appointmentId: number, imageUrl?: string | null) {
  const listed = listedImage(imageUrl);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const detailsQuery = useQuery({
    queryKey: profileImageKey(appointmentId),
    queryFn: () => getAppointment(appointmentId, { skipErrorAlert: true }),
    enabled: isAuthenticated && !listed,
    staleTime: 10 * 60 * 1000,
  });

  return listed || detailsQuery.data?.patientImageUrl?.trim() || undefined;
}
