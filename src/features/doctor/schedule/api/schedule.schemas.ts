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

export type DoctorScheduleCalendar = z.infer<typeof doctorScheduleCalendarSchema>;
