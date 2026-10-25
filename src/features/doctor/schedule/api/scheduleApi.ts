import { apiClient } from "@services/api/axios";
import { doctorDayAvailabilitySchema, doctorScheduleCalendarSchema } from "./schedule.schemas";

export async function getDoctorScheduleCalendar(from: string, to: string) {
  const params = new URLSearchParams({ from, to });
  const { data } = await apiClient.get(`/doctors/availability/calendar?${params.toString()}`);
  return doctorScheduleCalendarSchema.parse(data);
}

export async function getDoctorDayAvailability(date: string) {
  const params = new URLSearchParams({ date });
  const { data } = await apiClient.get(`/doctors/availability/day?${params.toString()}`);
  return doctorDayAvailabilitySchema.parse(data);
}
