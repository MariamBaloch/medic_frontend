import { apiClient } from "@services/api/axios";
import { doctorScheduleCalendarSchema } from "./schedule.schemas";

export async function getDoctorScheduleCalendar(from: string, to: string) {
  const params = new URLSearchParams({ from, to });
  const { data } = await apiClient.get(`/doctors/availability/calendar?${params.toString()}`);
  return doctorScheduleCalendarSchema.parse(data);
}
