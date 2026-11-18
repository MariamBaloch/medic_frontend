import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { doctorKeys } from "@features/booking/api/doctorsQueries";
import { deleteUser, getAuditLogs, verifyDoctor } from "./adminApi";

export const adminKeys = {
  all: ["admin"] as const,
  auditLogs: () => [...adminKeys.all, "audit-logs"] as const,
};

export function useAuditLogsQuery() {
  return useQuery({
    queryKey: adminKeys.auditLogs(),
    queryFn: getAuditLogs,
    meta: { notificationTitle: "Could not load audit logs" },
  });
}

export function useVerifyDoctorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (doctorProfileId: number) => verifyDoctor(doctorProfileId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: doctorKeys.all });
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => deleteUser(userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: doctorKeys.all });
    },
  });
}
