import { z } from "zod";
import { appointmentSchema } from "@features/appointment/api/appointment.schemas";

export const doctorScheduleSlotSchema = z.object({
  ruleId: z.number(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  slotMinutes: z.number(),
});

export const doctorScheduleCalendarSchema = z.object({
  availableSlots: z.array(doctorScheduleSlotSchema),
  appointments: z.array(appointmentSchema),
});

export const doctorDayAvailabilityRangeSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  slotMinutes: z.number(),
  displayRange: z.string(),
});

export const doctorDayAvailabilitySchema = z.object({
  doctorId: z.number(),
  date: z.string(),
  availableRanges: z.array(doctorDayAvailabilityRangeSchema),
});

export type DoctorScheduleCalendar = z.infer<typeof doctorScheduleCalendarSchema>;
export type DoctorDayAvailabilityRange = z.infer<typeof doctorDayAvailabilityRangeSchema>;
export type DoctorDayAvailability = z.infer<typeof doctorDayAvailabilitySchema>;
