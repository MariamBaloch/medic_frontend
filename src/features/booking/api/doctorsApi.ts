import { z } from "zod";
import { apiClient } from "@services/api/axios";
import { bookingApi, identityApi } from "@services/api/paths";
import { doctorsSchema, type Doctor } from "./doctor.schemas";

interface DoctorSearchFilters {
  search?: string;
  specializationId?: number;
  requireUpcomingAvailability?: boolean;
}

const upcomingAvailabilitySchema = z.array(
  z.object({
    doctorId: z.number().int(),
    hasUpcomingAvailability: z.boolean(),
  }),
);

export async function getDoctors(filters: DoctorSearchFilters): Promise<Doctor[]> {
  const params = new URLSearchParams();
  const search = filters.search?.trim();
  const requireUpcomingAvailability = filters.requireUpcomingAvailability !== false;

  if (search) params.set("search", search);
  if (filters.specializationId !== undefined) {
    params.set("specializationId", String(filters.specializationId));
  }

  const { data } = await apiClient.get(identityApi(`/doctors?${params.toString()}`));
  const doctors = doctorsSchema.parse(data);

  if (!requireUpcomingAvailability || doctors.length === 0) {
    return doctors;
  }

  const ids = doctors.map((doctor) => doctor.doctor.doctorProfileId);
  const upcomingParams = new URLSearchParams();
  for (const id of ids) {
    upcomingParams.append("ids", String(id));
  }
  const { data: upcomingData } = await apiClient.get(
    bookingApi(`/doctors/availability/upcoming?${upcomingParams.toString()}`),
  );
  const upcoming = upcomingAvailabilitySchema.parse(upcomingData);
  const availableIds = new Set(
    upcoming.filter((entry) => entry.hasUpcomingAvailability).map((entry) => entry.doctorId),
  );

  return doctors.filter((doctor) => availableIds.has(doctor.doctor.doctorProfileId));
}
