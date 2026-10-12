import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@stores/authStore";
import type {
  AdminRegistrationRequest,
  ChangePasswordRequest,
  DoctorRegistrationRequest,
  LoginRequest,
  PatientRegistrationRequest,
  ResetPasswordRequest,
} from "../schemas/auth.schemas";
import {
  changePassword,
  forgotPassword,
  getCurrentUser,
  login,
  logout,
  registerAdmin,
  registerDoctor,
  registerPatient,
  resetPassword,
  verifyEmail,
} from "./authApi";

export const authKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authKeys.all, "current-user"] as const,
};

export function useCurrentUserQuery() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLoginMutation() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (input: LoginRequest) => login(input),
    onSuccess: ({ token }) => setSession(token),
  });
}

export function useLogoutMutation() {
  const clearSession = useAuthStore((state) => state.clearSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSettled: () => {
      clearSession();
      queryClient.clear();
    },
  });
}

export function useRegisterPatientMutation() {
  return useMutation({ mutationFn: (input: PatientRegistrationRequest) => registerPatient(input) });
}

export function useRegisterDoctorMutation() {
  return useMutation({ mutationFn: (input: DoctorRegistrationRequest) => registerDoctor(input) });
}

export function useRegisterAdminMutation() {
  return useMutation({ mutationFn: (input: AdminRegistrationRequest) => registerAdmin(input) });
}

export function useForgotPasswordMutation() {
  return useMutation({ mutationFn: (email: string) => forgotPassword(email) });
}

export function useResetPasswordMutation() {
  return useMutation({ mutationFn: (input: ResetPasswordRequest) => resetPassword(input) });
}

export function useChangePasswordMutation() {
  return useMutation({ mutationFn: (input: ChangePasswordRequest) => changePassword(input) });
}

export function useVerifyEmailMutation() {
  return useMutation({ mutationFn: (token: string) => verifyEmail(token) });
}
