import { Button, Modal, Space, Spin, Typography } from "antd";
import { useState } from "react";
import type {
  Appointment,
  AppointmentStatusOption,
  DoctorAppointmentStatusUpdate,
} from "@features/appointment/api/appointment.schemas";
import { showApiAlert } from "@services/api/appAlerts";
import { LoadingContainer } from "@features/appointment/components/AppointmentDetailsModal/AppointmentDetailsModal.styles";
import { DoctorAppointmentDetails } from "./DoctorAppointmentDetails";
import {
  useDoctorAppointmentDetailsQuery,
  useUpdateDoctorAppointmentStatusMutation,
} from "../api/doctorAppointmentsQueries";

interface DoctorAppointmentDetailsModalProps {
  appointment: Appointment | null;
  appointmentId: number | null;
  statuses: AppointmentStatusOption[];
  onClose: () => void;
}

const statusActions: Array<{ status: DoctorAppointmentStatusUpdate["status"]; label: string }> = [
  { status: "COMPLETED", label: "Completed" },
  { status: "NO_SHOW", label: "No Show" },
];

export function DoctorAppointmentDetailsModal({
  appointment,
  appointmentId,
  statuses,
  onClose,
}: DoctorAppointmentDetailsModalProps) {
  const [confirmStatus, setConfirmStatus] = useState<
    DoctorAppointmentStatusUpdate["status"] | null
  >(null);
  const detailsQuery = useDoctorAppointmentDetailsQuery(appointmentId);
  const statusMutation = useUpdateDoctorAppointmentStatusMutation(appointmentId ?? 0);
  const fullAppointment =
    appointment && detailsQuery.data
      ? {
          ...appointment,
          ...detailsQuery.data,
          patientName: detailsQuery.data.patientName ?? appointment.patientName,
          patientId: detailsQuery.data.patientId ?? appointment.patientId,
          patientImageUrl: detailsQuery.data.patientImageUrl ?? appointment.patientImageUrl,
        }
      : null;
  const confirmationCopy =
    confirmStatus === "COMPLETED"
      ? "Are you sure you want to mark this appointment as completed?"
      : "Are you sure you want to mark this appointment as no show?";

  const confirmStatusChange = () => {
    if (!confirmStatus) return;
    statusMutation.mutate(
      { status: confirmStatus },
      {
        onSuccess: () => {
          const label = confirmStatus === "COMPLETED" ? "completed" : "no show";
          showApiAlert({
            type: "success",
            message: "Appointment updated",
            description: `Appointment with ${fullAppointment?.patientName ?? "the patient"} on ${fullAppointment?.appointmentDate ?? "the selected date"} at ${fullAppointment?.startTime ?? "the selected time"} was marked ${label}.`,
          });
          setConfirmStatus(null);
          onClose();
        },
      },
    );
  };

  const footer =
    fullAppointment?.status === "BOOKED" ? (
      <Space>
        {statusActions.map(({ status, label }) => (
          <Button
            key={status}
            color={status === "NO_SHOW" ? "danger" : "primary"}
            variant="outlined"
            onClick={() => setConfirmStatus(status)}
          >
            {label}
          </Button>
        ))}
      </Space>
    ) : null;

  return (
    <>
      <Modal
        title={null}
        open={appointmentId !== null}
        onCancel={onClose}
        centered
        width="min(1100px, calc(100vw - 24px))"
        footer={footer}
      >
        {detailsQuery.isLoading ? (
          <LoadingContainer>
            <Spin />
          </LoadingContainer>
        ) : fullAppointment ? (
          <DoctorAppointmentDetails appointment={fullAppointment} statuses={statuses} />
        ) : null}
      </Modal>

      <Modal
        title={confirmStatus === "COMPLETED" ? "Mark as completed" : "Mark as no show"}
        open={confirmStatus !== null}
        onCancel={() => setConfirmStatus(null)}
        onOk={confirmStatusChange}
        okText="Confirm"
        cancelText="Cancel"
        confirmLoading={statusMutation.isPending}
        destroyOnHidden
      >
        <Typography.Paragraph>{confirmationCopy}</Typography.Paragraph>
      </Modal>
    </>
  );
}
