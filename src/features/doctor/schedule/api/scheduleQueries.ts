import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@stores/authStore";
import { getDoctorDayAvailability, getDoctorScheduleCalendar } from "./scheduleApi";

export const doctorScheduleKeys = {
  all: ["doctor", "schedule"] as const,
  calendar: (from: string, to: string) => [...doctorScheduleKeys.all, from, to] as const,
  dayAvailability: (date: string) => [...doctorScheduleKeys.all, "day-availability", date] as const,
};

export function useDoctorScheduleCalendarQuery(from: string, to: string) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: doctorScheduleKeys.calendar(from, to),
    queryFn: () => getDoctorScheduleCalendar(from, to),
    meta: { notificationTitle: "Could not load schedule" },
    enabled: isAuthenticated,
    placeholderData: (previousData) => previousData,
  });
}

export function useDoctorDayAvailabilityQuery(date: string) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: doctorScheduleKeys.dayAvailability(date),
    queryFn: () => getDoctorDayAvailability(date),
    meta: { notificationTitle: "Could not load today's open slots" },
    enabled: isAuthenticated,
  });
}
