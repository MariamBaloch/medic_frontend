import { useEffect, useState } from "react";
import { Button, Modal, Space, Typography } from "antd";
import type { TableColumnsType } from "antd";
import { DataTable } from "@components/DataTable/DataTable";
import { PageHeader } from "@components/PageHeader";
import type { Doctor } from "@features/booking/api/doctor.schemas";
import { useCurrentUserQuery } from "@features/auth/api/authQueries";
import { useDoctorsQuery } from "@features/booking/api/doctorsQueries";
import { showApiAlert } from "@services/api/appAlerts";
import { useAuthStore } from "@stores/authStore";
import { useDeleteUserMutation, useVerifyDoctorMutation } from "./api/adminQueries";

function doctorName(doctor: Doctor) {
  return `${doctor.firstName} ${doctor.lastName}`.trim();
}

type DoctorAction = "verify" | "delete";

export function AdminDoctorsPage() {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pendingAction, setPendingAction] = useState<{
    type: DoctorAction;
    doctor: Doctor;
  } | null>(null);
  const storedUser = useAuthStore((state) => state.user);
  const currentUserQuery = useCurrentUserQuery();
  const currentUserId = currentUserQuery.data?.userId ?? storedUser?.userId;
  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearch(searchText.trim()), 300);
    return () => window.clearTimeout(timeoutId);
  }, [searchText]);

  const doctorsQuery = useDoctorsQuery({
    search: debouncedSearch,
    requireUpcomingAvailability: false,
  });
  const verifyDoctor = useVerifyDoctorMutation();
  const deleteUser = useDeleteUserMutation();
  const confirming = verifyDoctor.isPending || deleteUser.isPending;

  const confirmAction = () => {
    if (!pendingAction) return;
    const name = doctorName(pendingAction.doctor);

    if (pendingAction.type === "verify") {
      verifyDoctor.mutate(pendingAction.doctor.doctor.doctorProfileId, {
        onSuccess: () => {
          showApiAlert({
            type: "success",
            message: "Doctor verified",
            description: `${name} is now verified.`,
          });
          setPendingAction(null);
        },
      });
      return;
    }

    deleteUser.mutate(pendingAction.doctor.userId, {
      onSuccess: () => {
        showApiAlert({
          type: "success",
          message: "User deleted",
          description: `${name} was deleted.`,
        });
        setPendingAction(null);
      },
    });
  };

  const columns: TableColumnsType<Doctor> = [
    {
      title: "Doctor",
      key: "name",
      render: (_, doctor) => doctorName(doctor),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Specialization",
      key: "specialization",
      render: (_, doctor) => doctor.doctor.specialization?.name ?? "—",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "",
      key: "actions",
      width: 220,
      align: "right",
      render: (_, doctor) => (
        <Space>
          {doctor.doctor.isVerified ? null : (
            <Button size="small" onClick={() => setPendingAction({ type: "verify", doctor })}>
              Verify
            </Button>
          )}
          <Button
            size="small"
            danger
            disabled={doctor.userId === currentUserId}
            onClick={() => setPendingAction({ type: "delete", doctor })}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Doctors"
        description="Active doctors from the directory. Verify a profile or delete the account."
      />
      <DataTable
        columns={columns}
        dataSource={doctorsQuery.data ?? []}
        loading={doctorsQuery.isLoading || doctorsQuery.isFetching}
        rowKey="userId"
        searchText={searchText}
        onSearchTextChange={setSearchText}
        serverSearch
        title="Find a doctor"
        searchPlaceholder="Search by name or email"
      />
      <Modal
        title={pendingAction?.type === "delete" ? "Delete this doctor?" : "Verify this doctor?"}
        open={pendingAction !== null}
        onCancel={() => {
          if (!confirming) setPendingAction(null);
        }}
        onOk={confirmAction}
        confirmLoading={confirming}
        okText={pendingAction?.type === "delete" ? "Delete" : "Verify"}
        okButtonProps={{ danger: pendingAction?.type === "delete" }}
        cancelText="Cancel"
        destroyOnHidden
      >
        <Typography.Text>
          {pendingAction?.type === "delete"
            ? `${doctorName(pendingAction.doctor)} will be marked deleted and can no longer sign in.`
            : pendingAction
              ? `${doctorName(pendingAction.doctor)} will be marked as a verified doctor.`
              : null}
        </Typography.Text>
      </Modal>
    </>
  );
}
