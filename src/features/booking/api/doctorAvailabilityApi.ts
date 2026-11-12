import { apiClient } from "@services/api/axios";
import { bookingApi } from "@services/api/paths";
import { doctorAvailabilitySchema, type DoctorAvailability } from "./doctorAvailability.schemas";

interface DoctorAvailabilityFilters {
  doctorId: number;
  from: string;
  to: string;
}

export async function getDoctorAvailability({
  doctorId,
  from,
  to,
}: DoctorAvailabilityFilters): Promise<DoctorAvailability> {
  const params = new URLSearchParams({ from, to });
  const { data } = await apiClient.get(
    bookingApi(`/patient/appointments/doctors/${doctorId}/availability?${params.toString()}`),
  );
  return doctorAvailabilitySchema.parse(data);
}
