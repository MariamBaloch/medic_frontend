import { z } from "zod";

export const appointmentStatusSchema = z.enum(["BOOKED", "COMPLETED", "NO_SHOW", "CANCELLED"]);
export const appointmentStatusOptionSchema = z.object({
  value: appointmentStatusSchema,
  label: z.string(),
});
export const appointmentStatusesSchema = z.array(appointmentStatusOptionSchema);

export const specializationSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullish(),
});


export const appointmentSchema = z.object({
  id: z.number(),
  doctorId: z.number(),
  doctorName: z.string(),
  doctorQualification: z.string().nullish(),
  specialization: specializationSchema.nullish(),
  patientId: z.number(),
  patientName: z.string(),
  appointmentDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  status: appointmentStatusSchema,
  reason: z.string().nullish(),
  bookingFee: z.number().nullish(),
  cancelledReason: z.string().nullish(),
});

export const appointmentPageSchema = z.object({
  content: z.array(appointmentSchema),
  page: z.number().int(),
  size: z.number().int(),
  totalElements: z.number().int(),
  totalPages: z.number().int(),
  first: z.boolean(),
  last: z.boolean(),
});

const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD");

export const appointmentFiltersSchema = z.object({
  doctorId: z.number().int().positive().optional(),
  dateFrom: isoDateSchema.optional(),
  dateTo: isoDateSchema.optional(),
  status: appointmentStatusSchema.optional(),
  specializationId: z.number().int().positive().optional(),
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(100).default(10),
  sort: z.array(z.string().min(1)).default(["appointmentDate,DESC", "startTime,DESC"]),
});

export const specializationsSchema = z.array(specializationSchema);

export type Appointment = z.infer<typeof appointmentSchema>;
export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;
export type AppointmentStatusOption = z.infer<typeof appointmentStatusOptionSchema>;
export type AppointmentPage = z.infer<typeof appointmentPageSchema>;
export type AppointmentFilters = z.input<typeof appointmentFiltersSchema>;
export type Specialization = z.infer<typeof specializationSchema>;
