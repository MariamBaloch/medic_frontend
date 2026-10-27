import { z } from "zod";

export const waitlistStatusSchema = z.enum([
  "WAITING",
  "OFFERED",
  "BOOKED",
  "EXPIRED",
  "CANCELLED",
]);

const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD");

export const waitlistFiltersSchema = z.object({
  doctorName: z.string().trim().min(1).optional(),
  dateFrom: isoDateSchema.optional(),
  dateTo: isoDateSchema.optional(),
  status: waitlistStatusSchema.optional(),
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(100).default(10),
});

export const joinWaitlistRequestSchema = z.object({
  doctorId: z.number().int().positive(),
  date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must use DD/MM/YYYY"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must use HH:mm"),
});

const waitlistSpecializationSchema = z
  .object({
    id: z.number().int().optional(),
    name: z.string(),
    description: z.string().nullish(),
  })
  .loose();

const specializationValueSchema = z.union([z.string(), waitlistSpecializationSchema]);

const rawWaitlistEntrySchema = z
  .object({
    id: z.number().int(),
    doctorId: z.number().int(),
    doctorName: z.string(),
    specialization: specializationValueSchema.optional(),
    appointmentDate: z.string(),
    preferredStartTime: z.string(),
    endTime: z.string().optional(),
    status: waitlistStatusSchema,
    offeredAt: z.string().nullish(),
    offerExpiresAt: z.string().nullish(),
  })
  .loose()
  .transform((entry) => {
    const { appointmentDate, preferredStartTime, specialization, ...waitlistEntry } = entry;
    return {
      ...waitlistEntry,
      date: appointmentDate,
      startTime: preferredStartTime,
      specialization:
        typeof specialization === "string" ? specialization : specialization?.name,
      offerExpiresAt: entry.offerExpiresAt ?? undefined,
    };
  });

export const waitlistPageSchema = z
  .object({
    content: z.array(rawWaitlistEntrySchema),
    page: z.number().int().nonnegative(),
    size: z.number().int().positive(),
    totalElements: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
    first: z.boolean(),
    last: z.boolean(),
  })
  .loose();

export type JoinWaitlistRequest = z.infer<typeof joinWaitlistRequestSchema>;
export type WaitlistStatus = z.infer<typeof waitlistStatusSchema>;
export type WaitlistFilters = z.input<typeof waitlistFiltersSchema>;
export type WaitlistEntry = z.output<typeof rawWaitlistEntrySchema>;
export type WaitlistPage = z.output<typeof waitlistPageSchema>;
