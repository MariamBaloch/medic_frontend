import { z } from "zod";

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-+_=<>?]).{5,}$/;

export const passwordSchema = z.string().superRefine((password, context) => {
  if (!password) {
    context.addIssue({ code: "custom", message: "Password is required" });
    return;
  }

  if (password.length < 5) {
    context.addIssue({ code: "custom", message: "Password must be at least 5 characters" });
    return;
  }

  if (!passwordPattern.test(password)) {
    context.addIssue({
      code: "custom",
      message: "Must include uppercase, lowercase, and a special character",
    });
  }
});

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address");

const registrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  dateOfBirth: z.string().superRefine((dateOfBirth, context) => {
    if (!dateOfBirth) {
      context.addIssue({ code: "custom", message: "Date of birth is required" });
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateOfBirth)) {
      context.addIssue({ code: "custom", message: "Use dd/MM/yyyy" });
    }
  }),
  phone: z.string().superRefine((phone, context) => {
    if (!phone) {
      context.addIssue({ code: "custom", message: "Phone number is required" });
    } else if (!/^\+?[0-9]{7,20}$/.test(phone)) {
      context.addIssue({ code: "custom", message: "Enter a valid phone number" });
    }
  }),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
});

export const loginRequestSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const loginResponseSchema = z.object({ token: z.string().min(1) });

const auditSchema = z
  .object({
    createdAt: z.string().nullish(),
    updatedAt: z.string().nullish(),
  })
  .nullish();

const patientProfileSchema = z
  .object({
    address: z.string().nullish(),
    city: z.string().nullish(),
    country: z.string().nullish(),
    bloodType: z.string().nullish(),
    heightCm: z.number().nullish(),
    weightKg: z.number().nullish(),
    allergies: z.string().nullish(),
    chronicConditions: z.string().nullish(),
    audit: auditSchema,
  })
  .nullish();

const doctorProfileSchema = z
  .object({
    specializationId: z.number().nullish(),
    specialization: z
      .object({ id: z.number(), name: z.string(), description: z.string().nullish() })
      .nullish(),
    qualification: z.string().nullish(),
    yearsOfExperience: z.number().nullish(),
    consultationFee: z.number().nullish(),
    hospitalAffiliation: z.string().nullish(),
    clinicAddress: z.string().nullish(),
    bio: z.string().nullish(),
    audit: auditSchema,
  })
  .nullish();

export const userProfileSchema = z.object({
  userId: z.number(),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string().nullish(),
  phone: z.string().nullish(),
  gender: z.enum(["MALE", "FEMALE"]).nullish(),
  role: z.enum(["PATIENT", "DOCTOR", "ADMIN"]),
  status: z.enum(["ACTIVE", "INACTIVE", "DELETED", "PENDING_VERIFICATION"]),
  imageUrl: z.string().nullish(),
  patient: patientProfileSchema,
  doctor: doctorProfileSchema,
  audit: auditSchema,
});

export const patientRegistrationSchema = registrationSchema;
export const doctorRegistrationSchema = registrationSchema.extend({
  specializationId: z
    .number({ error: "Specialization ID is required" })
    .int("Specialization ID must be a whole number")
    .positive("Specialization ID is required"),
  licenseNumber: z.string().trim().min(1, "License number is required").max(100),
});
export const adminRegistrationSchema = registrationSchema;
export const forgotPasswordEmailSchema = emailSchema;
export const verifyEmailTokenSchema = z.string().min(1);
export const resetPasswordSchema = z.object({ token: z.string().min(1), newPassword: passwordSchema });
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordSchema,
});

export const forgotPasswordFormSchema = z.object({ email: forgotPasswordEmailSchema });
export const resetPasswordFormSchema = resetPasswordSchema
  .omit({ token: true })
  .extend({ confirmPassword: z.string().min(1, "Please confirm your password") })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
export const changePasswordFormSchema = changePasswordSchema
  .extend({ confirmPassword: z.string().min(1, "Please confirm your password") })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const patientRegistrationFormSchema = registrationSchema
  .extend({
    accountType: z.literal("patient"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const doctorRegistrationFormSchema = doctorRegistrationSchema
  .extend({
    accountType: z.literal("doctor"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const registrationFormSchema = z.discriminatedUnion("accountType", [
  patientRegistrationFormSchema,
  doctorRegistrationFormSchema,
]);

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginFormValues = z.input<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type PatientRegistrationRequest = z.infer<typeof patientRegistrationSchema>;
export type DoctorRegistrationRequest = z.infer<typeof doctorRegistrationSchema>;
export type AdminRegistrationRequest = z.infer<typeof adminRegistrationSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordFormValues = z.input<typeof forgotPasswordFormSchema>;
export type ResetPasswordFormValues = z.input<typeof resetPasswordFormSchema>;
export type RegistrationFormValues = z.input<typeof registrationFormSchema>;
