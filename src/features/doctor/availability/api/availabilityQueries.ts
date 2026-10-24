import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@stores/authStore";
import {
  createAvailabilityException,
  createAvailabilityRule,
  deleteAvailabilityException,
  deleteAvailabilityRule,
  getAvailabilityExceptions,
  getAvailabilityRules,
  updateAvailabilityRule,
} from "./availabilityApi";
import type { AvailabilityExceptionRequest, AvailabilityRuleRequest } from "./availability.schemas";

export const availabilityKeys = {
  all: ["doctor", "availability"] as const,
  rules: () => [...availabilityKeys.all, "rules"] as const,
  exceptions: () => [...availabilityKeys.all, "exceptions"] as const,
};

export function useAvailabilityRulesQuery() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: availabilityKeys.rules(),
    queryFn: getAvailabilityRules,
    meta: { notificationTitle: "Could not load availability rules" },
    enabled: isAuthenticated,
  });
}

export function useAvailabilityExceptionsQuery() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: availabilityKeys.exceptions(),
    queryFn: getAvailabilityExceptions,
    meta: { notificationTitle: "Could not load availability exceptions" },
    enabled: isAuthenticated,
  });
}

export function useCreateAvailabilityRuleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: AvailabilityRuleRequest) => createAvailabilityRule(request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: availabilityKeys.rules() }),
  });
}

export function useUpdateAvailabilityRuleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: AvailabilityRuleRequest }) =>
      updateAvailabilityRule(id, request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: availabilityKeys.rules() }),
  });
}

export function useDeleteAvailabilityRuleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAvailabilityRule,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: availabilityKeys.rules() }),
  });
}

export function useCreateAvailabilityExceptionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: AvailabilityExceptionRequest) => createAvailabilityException(request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: availabilityKeys.exceptions() }),
  });
}

export function useDeleteAvailabilityExceptionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAvailabilityException,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: availabilityKeys.exceptions() }),
  });
}
