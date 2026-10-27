import { z } from "zod";

export const doctorAvailabilityStatusSchema = z.enum(["AVAILABLE", "BOOKED", "WAITLIST_OFFERED"]);

export const doctorAvailabilitySlotSchema = z.object({
  ruleId: z.number().int(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  slotMinutes: z.number().int().positive(),
  status: doctorAvailabilityStatusSchema,
  canJoinWaitlist: z.boolean(),
  patientHasOverlappingAppointment: z.boolean(),
  patientHasActiveWaitlistEntry: z.boolean(),
});

export const patientAvailabilityAppointmentSchema = z.object({
  appointmentId: z.number().int(),
  doctorName: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  reason: z.string().nullish(),
});

export const doctorAvailabilitySchema = z.object({
  slots: z.array(doctorAvailabilitySlotSchema),
  patientAppointments: z.array(patientAvailabilityAppointmentSchema),
});

export type DoctorAvailabilitySlot = z.infer<typeof doctorAvailabilitySlotSchema>;
export type PatientAvailabilityAppointment = z.infer<typeof patientAvailabilityAppointmentSchema>;
export type DoctorAvailability = z.infer<typeof doctorAvailabilitySchema>;
