import { apiClient } from "@services/api/axios";
import {
  adminRegistrationSchema,
  changePasswordSchema,
  doctorRegistrationSchema,
  forgotPasswordEmailSchema,
  loginRequestSchema,
  loginResponseSchema,
  patientRegistrationSchema,
  resetPasswordSchema,
  userProfileSchema,
  verifyEmailTokenSchema,
  type AdminRegistrationRequest,
  type ChangePasswordRequest,
  type DoctorRegistrationRequest,
  type LoginRequest,
  type LoginResponse,
  type PatientRegistrationRequest,
  type ResetPasswordRequest,
  type UserProfile,
} from "../schemas/auth.schemas";

export interface PatientProfileUpdate {
  address?: string;
  city?: string;
  country?: string;
  bloodType?: string;
  heightCm?: number;
  weightKg?: number;
  allergies?: string;
  chronicConditions?: string;
}

export interface UserAccountUpdate {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  gender?: "MALE" | "FEMALE";
}

export interface DoctorProfileUpdate {
  specializationId?: number;
  qualification?: string;
  yearsOfExperience?: number;
  consultationFee?: number;
  hospitalAffiliation?: string;
  clinicAddress?: string;
  bio?: string;
}

export async function login(input: LoginRequest): Promise<LoginResponse> {
  const payload = loginRequestSchema.parse(input);
  const { data } = await apiClient.post("/auth/users/login", payload);
  return loginResponseSchema.parse(data);
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/users/logout");
}

export async function getCurrentUser(): Promise<UserProfile> {
  const { data } = await apiClient.get("/user");
  return userProfileSchema.parse(data);
}

export async function updateUserAccount(input: UserAccountUpdate): Promise<void> {
  await apiClient.put("/user", input);
}

export async function updatePatientProfile(input: PatientProfileUpdate): Promise<void> {
  await apiClient.patch("/profile/patient", input);
}

export async function updateDoctorProfile(input: DoctorProfileUpdate): Promise<void> {
  await apiClient.patch("/profile/doctor", input);
}

export async function uploadProfilePicture(file: File): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);
  await apiClient.patch("/user/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function registerPatient(input: PatientRegistrationRequest): Promise<void> {
  await apiClient.post("/auth/users/register/patient", patientRegistrationSchema.parse(input));
}

export async function registerDoctor(input: DoctorRegistrationRequest): Promise<void> {
  await apiClient.post("/auth/users/register/doctor", doctorRegistrationSchema.parse(input));
}

export async function registerAdmin(input: AdminRegistrationRequest): Promise<void> {
  await apiClient.post("/auth/users/register/admin", adminRegistrationSchema.parse(input));
}

export async function verifyEmail(token: string): Promise<void> {
  await apiClient.get("/auth/users/verify", {
    params: { token: verifyEmailTokenSchema.parse(token) },
  });
}

export async function forgotPassword(email: string): Promise<void> {
  await apiClient.post("/auth/users/forgot-password", null, {
    params: { email: forgotPasswordEmailSchema.parse(email) },
  });
}

export async function resetPassword(input: ResetPasswordRequest): Promise<void> {
  await apiClient.post("/auth/users/reset-password", resetPasswordSchema.parse(input));
}

export async function changePassword(input: ChangePasswordRequest): Promise<void> {
  await apiClient.post("/auth/users/change-password", changePasswordSchema.parse(input));
}
