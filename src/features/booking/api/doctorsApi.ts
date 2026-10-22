import { apiClient } from "@services/api/axios";
import { doctorsSchema, type Doctor } from "./doctor.schemas";

interface DoctorSearchFilters {
  search?: string;
  specializationId?: number;
}

export async function getDoctors(filters: DoctorSearchFilters): Promise<Doctor[]> {
  const params = new URLSearchParams();
  const search = filters.search?.trim();

  if (search) params.set("search", search);
  if (filters.specializationId !== undefined) {
    params.set("specializationId", String(filters.specializationId));
  }
  params.set("hasFutureAvailability", "true");

  const { data } = await apiClient.get(`/doctors?${params.toString()}`);
  return doctorsSchema.parse(data);
}
