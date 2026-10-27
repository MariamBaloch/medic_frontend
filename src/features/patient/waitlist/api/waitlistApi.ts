import { apiClient } from "@services/api/axios";
import {
  joinWaitlistRequestSchema,
  waitlistFiltersSchema,
  waitlistPageSchema,
  type JoinWaitlistRequest,
  type WaitlistFilters,
  type WaitlistPage,
} from "./waitlist.schemas";

function formatApiDate(date: string): string {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export async function getPatientWaitlistEntries(filters: WaitlistFilters): Promise<WaitlistPage> {
  const validatedFilters = waitlistFiltersSchema.parse(filters);
  const params = new URLSearchParams();

  if (validatedFilters.doctorName) params.append("doctorName", validatedFilters.doctorName);
  if (validatedFilters.dateFrom) params.append("dateFrom", formatApiDate(validatedFilters.dateFrom));
  if (validatedFilters.dateTo) params.append("dateTo", formatApiDate(validatedFilters.dateTo));
  if (validatedFilters.status) params.append("status", validatedFilters.status);
  params.append("page", String(validatedFilters.page));
  params.append("size", String(validatedFilters.size));

  const { data } = await apiClient.get(`/patient/waitlist?${params.toString()}`);
  return waitlistPageSchema.parse(data);
}

export async function joinPatientWaitlist(request: JoinWaitlistRequest) {
  const validatedRequest = joinWaitlistRequestSchema.parse(request);
  const { data } = await apiClient.post("/patient/waitlist", validatedRequest);
  return data;
}

export async function removePatientWaitlistEntry(entryId: number) {
  await apiClient.delete(`/patient/waitlist/${entryId}`);
}

export async function acceptPatientWaitlistOffer(entryId: number) {
  const { data } = await apiClient.post(`/patient/waitlist/${entryId}/accept`);
  return data;
}
