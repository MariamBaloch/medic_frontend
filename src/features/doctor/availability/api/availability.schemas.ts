import { z } from "zod";

export const availabilityDaySchema = z.enum([
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
]);

export const availabilityRuleSchema = z.object({
  id: z.number(),
  startDate: z.string(),
  endDate: z.string().nullish(),
  daysOfWeek: z.array(availabilityDaySchema),
  startTime: z.string(),
  endTime: z.string(),
  slotMinutes: z.number(),
});

export const availabilityRuleChangeSchema = z.object({
  rule: availabilityRuleSchema,
  affectedAppointments: z.array(z.unknown()).default([]),
  message: z.string().nullish(),
});

export const availabilityRuleDeleteSchema = z.object({
  hardDeleted: z.boolean(),
  affectedAppointments: z.array(z.unknown()).default([]),
  message: z.string().nullish(),
});

export const availabilityExceptionSchema = z.object({
  id: z.number(),
  exceptionDate: z.string(),
  startTime: z.string().nullish(),
  endTime: z.string().nullish(),
  reason: z.string().nullish(),
  affectedAppointments: z.union([z.array(z.unknown()), z.unknown()]).optional(),
  message: z.string().nullish(),
});

export const availabilityExceptionDeleteSchema = z.object({
  affectedAppointments: z.array(z.unknown()).default([]),
  message: z.string().nullish(),
});

export const availabilityRuleRequestSchema = z.object({
  daysOfWeek: z.array(availabilityDaySchema).min(1),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  slotMinutes: z.number().int().positive(),
  startDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/),
  endDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/).optional(),
});

export const availabilityExceptionRequestSchema = z.object({
  exceptionDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
  reason: z.string().optional(),
});

export type AvailabilityDay = z.infer<typeof availabilityDaySchema>;
export type AvailabilityRule = z.infer<typeof availabilityRuleSchema>;
export type AvailabilityRuleRequest = z.infer<typeof availabilityRuleRequestSchema>;
export type AvailabilityRuleChange = z.infer<typeof availabilityRuleChangeSchema>;
export type AvailabilityRuleDelete = z.infer<typeof availabilityRuleDeleteSchema>;
export type AvailabilityException = z.infer<typeof availabilityExceptionSchema>;
export type AvailabilityExceptionRequest = z.infer<typeof availabilityExceptionRequestSchema>;
export type AvailabilityExceptionDelete = z.infer<typeof availabilityExceptionDeleteSchema>;
