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

const appointmentDoctorSchema = z.object({
  doctorId: z.number(),
  doctorName: z.string(),
  doctorImageUrl: z.string().nullish(),
  doctorQualification: z.string().nullish(),
  specialization: specializationSchema.nullish(),
  doctorYearsOfExperience: z.number().nullish(),
  doctorHospitalAffiliation: z.string().nullish(),
  doctorClinicAddress: z.string().nullish(),
  doctorLicenseNumber: z.string().nullish(),
  doctorBio: z.string().nullish(),
});

const patientSummarySchema = z.object({
  patientId: z.number(),
  patientName: z.string(),
  patientImageUrl: z.string().nullish(),
  address: z.string().nullish(),
  city: z.string().nullish(),
  country: z.string().nullish(),
  bloodType: z.string().nullish(),
  heightCm: z.number().nullish(),
  weightKg: z.number().nullish(),
  allergies: z.string().nullish(),
  chronicConditions: z.string().nullish(),
});

const normalizedAppointmentSchema = z.object({
  id: z.number(),
  version: z.number().int().nonnegative().default(0),
  doctorId: z.number(),
  doctorName: z.string(),
  doctorQualification: z.string().nullish(),
  doctorYearsOfExperience: z.number().nullish(),
  doctorHospitalAffiliation: z.string().nullish(),
  doctorClinicAddress: z.string().nullish(),
  doctorLicenseNumber: z.string().nullish(),
  doctorImageUrl: z.string().nullish(),
  doctorBio: z.string().nullish(),
  specialization: specializationSchema.nullish(),
  patientId: z.number(),
  patientName: z.string(),
  patientImageUrl: z.string().nullish(),
  appointmentDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  status: appointmentStatusSchema,
  reason: z.string().nullish(),
  bookingFee: z.number().nullish(),
  cancelledReason: z.string().nullish(),
});

const nestedAppointmentSchema = z
  .object({
    id: z.number(),
    version: z.number().int().nonnegative().default(0),
    doctor: appointmentDoctorSchema,
    patient: patientSummarySchema,
    appointmentDate: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    status: appointmentStatusSchema,
    reason: z.string().nullish(),
    bookingFee: z.number().nullish(),
    cancelledReason: z.string().nullish(),
  })
  .transform(({ doctor, patient, ...appointment }) => ({
    ...appointment,
    doctorId: doctor.doctorId,
    doctorName: doctor.doctorName,
    doctorImageUrl: doctor.doctorImageUrl,
    doctorQualification: doctor.doctorQualification,
    doctorYearsOfExperience: doctor.doctorYearsOfExperience,
    doctorHospitalAffiliation: doctor.doctorHospitalAffiliation,
    doctorClinicAddress: doctor.doctorClinicAddress,
    doctorLicenseNumber: doctor.doctorLicenseNumber,
    doctorBio: doctor.doctorBio,
    specialization: doctor.specialization,
    patientId: patient.patientId,
    patientName: patient.patientName,
    patientImageUrl: patient.patientImageUrl,
  }));

export const appointmentSchema = z.union([nestedAppointmentSchema, normalizedAppointmentSchema]);

const normalizedAppointmentDetailsSchema = z.object({
  version: z.number().int().nonnegative().default(0),
  appointmentDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  bookingFee: z.number().nullish(),
  status: appointmentStatusSchema,
  reason: z.string().nullish(),
  cancelledReason: z.string().nullish(),
  doctorName: z.string(),
  doctorId: z.number().optional(),
  doctorImageUrl: z.string().nullish(),
  doctorQualification: z.string().nullish(),
  specialization: specializationSchema.nullish(),
  doctorYearsOfExperience: z.number().nullish(),
  doctorHospitalAffiliation: z.string().nullish(),
  doctorClinicAddress: z.string().nullish(),
  doctorLicenseNumber: z.string().nullish(),
  doctorBio: z.string().nullish(),
  patientId: z.number().optional(),
  patientName: z.string().nullish(),
  patientImageUrl: z.string().nullish(),
  patientAddress: z.string().nullish(),
  patientCity: z.string().nullish(),
  patientCountry: z.string().nullish(),
  patientBloodType: z.string().nullish(),
  patientHeightCm: z.number().nullish(),
  patientWeightKg: z.number().nullish(),
  patientAllergies: z.string().nullish(),
  patientChronicConditions: z.string().nullish(),
});

const nestedAppointmentDetailsSchema = z
  .object({
    version: z.number().int().nonnegative().default(0),
    appointmentDate: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    bookingFee: z.number().nullish(),
    status: appointmentStatusSchema,
    reason: z.string().nullish(),
    cancelledReason: z.string().nullish(),
    doctor: appointmentDoctorSchema,
    patient: patientSummarySchema,
  })
  .transform(({ doctor, patient, ...appointment }) => ({
    ...appointment,
    doctorId: doctor.doctorId,
    doctorName: doctor.doctorName,
    doctorImageUrl: doctor.doctorImageUrl,
    doctorQualification: doctor.doctorQualification,
    specialization: doctor.specialization,
    doctorYearsOfExperience: doctor.doctorYearsOfExperience,
    doctorHospitalAffiliation: doctor.doctorHospitalAffiliation,
    doctorClinicAddress: doctor.doctorClinicAddress,
    doctorLicenseNumber: doctor.doctorLicenseNumber,
    doctorBio: doctor.doctorBio,
    patientId: patient.patientId,
    patientName: patient.patientName,
    patientImageUrl: patient.patientImageUrl,
    patientAddress: patient.address,
    patientCity: patient.city,
    patientCountry: patient.country,
    patientBloodType: patient.bloodType,
    patientHeightCm: patient.heightCm,
    patientWeightKg: patient.weightKg,
    patientAllergies: patient.allergies,
    patientChronicConditions: patient.chronicConditions,
  }));

export const appointmentDetailsSchema = z.union([
  nestedAppointmentDetailsSchema,
  normalizedAppointmentDetailsSchema,
]);

export const appointmentPageSchema = z.object({
  content: z.array(appointmentSchema),
  page: z.number().int(),
  size: z.number().int(),
  totalElements: z.number().int(),
  totalPages: z.number().int(),
  first: z.boolean(),
  last: z.boolean(),
});

export const appointmentStatusCountsSchema = z.object({
  total: z.number().int().nonnegative(),
  byStatus: z.record(appointmentStatusSchema, z.number().int().nonnegative()),
});

const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD");

export const appointmentBookingRequestSchema = z.object({
  doctorId: z.number().int().positive(),
  date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must use DD/MM/YYYY"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must use HH:mm"),
  reason: z.string().max(1000),
});

export const appointmentCancellationRequestSchema = z.object({
  reason: z.string().trim().min(1, "Enter a cancellation reason"),
});

export const appointmentRescheduleRequestSchema = z.object({
  date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must use DD/MM/YYYY"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must use HH:mm"),
  expectedVersion: z.number().int().nonnegative(),
});

export const doctorAppointmentStatusUpdateSchema = z.object({
  status: z.enum(["COMPLETED", "NO_SHOW"]),
});

export const appointmentFiltersSchema = z.object({
  doctorName: z.string().trim().min(1).optional(),
  patientName: z.string().trim().min(1).optional(),
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
export type AppointmentDetails = z.infer<typeof appointmentDetailsSchema>;
export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;
export type AppointmentStatusOption = z.infer<typeof appointmentStatusOptionSchema>;
export type AppointmentPage = z.infer<typeof appointmentPageSchema>;
export type AppointmentStatusCounts = z.infer<typeof appointmentStatusCountsSchema>;
export type AppointmentFilters = z.input<typeof appointmentFiltersSchema>;
export type Specialization = z.infer<typeof specializationSchema>;
export type AppointmentBookingRequest = z.infer<typeof appointmentBookingRequestSchema>;
export type AppointmentCancellationRequest = z.infer<typeof appointmentCancellationRequestSchema>;
export type AppointmentRescheduleRequest = z.infer<typeof appointmentRescheduleRequestSchema>;
export type DoctorAppointmentStatusUpdate = z.infer<typeof doctorAppointmentStatusUpdateSchema>;
