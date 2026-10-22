import { z } from "zod";

export const doctorAvailabilitySlotSchema = z.object({
  ruleId: z.number().int(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  slotMinutes: z.number().int().positive(),
});

export const doctorAvailabilitySchema = z.array(doctorAvailabilitySlotSchema);

export type DoctorAvailabilitySlot = z.infer<typeof doctorAvailabilitySlotSchema>;
