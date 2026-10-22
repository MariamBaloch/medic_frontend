import { z } from "zod";
import { specializationSchema } from "@features/appointment/api/appointment.schemas";

export const doctorSchema = z.object({
  userId: z.number().int(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string(),
  phone: z.string(),
  gender: z.string(),
  role: z.literal("DOCTOR"),
  status: z.string(),
  imageUrl: z.string().nullish(),
  doctor: z.object({
    doctorProfileId: z.number().int(),
    specialization: specializationSchema.nullish(),
    qualification: z.string().nullish(),
    yearsOfExperience: z.number().nullish(),
    consultationFee: z.number().nullish(),
    hospitalAffiliation: z.string().nullish(),
    clinicAddress: z.string().nullish(),
    bio: z.string().nullish(),
    audit: z.object({
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  }),
  audit: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});

export const doctorsSchema = z.array(doctorSchema);

export type Doctor = z.infer<typeof doctorSchema>;
