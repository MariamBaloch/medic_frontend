import { Button, Form, Input, Modal, Spin, Typography } from "antd";
import { useState } from "react";
import type {
  Appointment,
  AppointmentStatusOption,
} from "@features/appointment/api/appointment.schemas";
import {
  useCancelPatientAppointmentMutation,
  usePatientAppointmentQuery,
} from "@features/patient/appointment/api/patientAppointmentsQueries";
import { notifyApp } from "@services/api/appNotifications";
import { RescheduleAppointmentDialog } from "./RescheduleAppointmentDialog";
import { LoadingContainer, ModalActions } from "./AppointmentDetailsModal.styles";
import { PatientAppointmentDetails } from "@features/patient/appointment/components";

interface AppointmentDetailsModalProps {
  appointment: Appointment | null;
  appointmentId: number | null;
  statuses: AppointmentStatusOption[];
  onClose: () => void;
}

function isFutureAppointment(date: string, time: string): boolean {
  const dateMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(date);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(time);
  if (!dateMatch || !timeMatch) return false;

  const [, day, month, year] = dateMatch;
  const [, hours, minutes] = timeMatch;
  const appointmentTime = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
  );
  return !Number.isNaN(appointmentTime.getTime()) && appointmentTime.getTime() > Date.now();
}

export function AppointmentDetailsModal({
  appointment,
  appointmentId,
  statuses,
  onClose,
}: AppointmentDetailsModalProps) {
  const [cancelForm] = Form.useForm<{ reason: string }>();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const cancelMutation = useCancelPatientAppointmentMutation(appointmentId ?? 0);
  const appointmentQuery = usePatientAppointmentQuery(appointmentId);
  const details = appointmentQuery.data;
  const fullAppointment =
    appointment && details
      ? {
          ...appointment,
          ...details,
          patientName: details.patientName ?? appointment.patientName,
          patientId: details.patientId ?? appointment.patientId,
          patientImageUrl: details.patientImageUrl ?? appointment.patientImageUrl,
        }
      : null;

  const closeDetails = () => {
    setIsRescheduleDialogOpen(false);
    onClose();
  };

  const closeCancelDialog = () => {
    setIsCancelDialogOpen(false);
    cancelForm.resetFields();
  };

  const handleCancel = ({ reason }: { reason: string }) => {
    cancelMutation.mutate(
      { reason },
      {
        onSuccess: (cancelledAppointment) => {
          closeCancelDialog();
          notifyApp({
            type: "success",
            message: "Appointment cancelled",
            description: `Your appointment with ${cancelledAppointment.doctorName} on ${cancelledAppointment.appointmentDate} at ${cancelledAppointment.startTime} has been cancelled. Reason: ${cancelledAppointment.cancelledReason || reason}`,
          });
          closeDetails();
        },
      },
    );
  };

  const canReschedule =
    fullAppointment?.status === "BOOKED" &&
    isFutureAppointment(fullAppointment.appointmentDate, fullAppointment.startTime);
  const modalFooter =
    fullAppointment?.status === "BOOKED" ? (
      <ModalActions>
        {canReschedule ? (
          <Button
            color="primary"
            variant="outlined"
            onClick={() => setIsRescheduleDialogOpen(true)}
          >
            Reschedule appointment
          </Button>
        ) : null}
        <Button color="danger" variant="outlined" onClick={() => setIsCancelDialogOpen(true)}>
          Cancel appointment
        </Button>
      </ModalActions>
    ) : null;

  return (
    <>
      <Modal
        title={null}
        open={appointmentId !== null}
        onCancel={closeDetails}
        centered
        width="min(1100px, calc(100vw - 24px))"
        footer={modalFooter}
      >
        {appointmentQuery.isLoading ? (
          <LoadingContainer>
            <Spin />
          </LoadingContainer>
        ) : fullAppointment ? (
          <>
            <PatientAppointmentDetails appointment={fullAppointment} statuses={statuses} />
          </>
        ) : null}
      </Modal>

      <Modal
        title="Cancel appointment"
        open={isCancelDialogOpen}
        onCancel={closeCancelDialog}
        footer={
          <ModalActions>
            <Button onClick={closeCancelDialog}>Keep appointment</Button>
            <Button
              danger
              type="primary"
              htmlType="submit"
              form="patient-cancel-appointment-form"
              loading={cancelMutation.isPending}
            >
              Confirm cancellation
            </Button>
          </ModalActions>
        }
        destroyOnHidden
      >
        <Typography.Paragraph>
          Please provide a reason for cancelling this appointment.
        </Typography.Paragraph>
        <Form
          id="patient-cancel-appointment-form"
          form={cancelForm}
          layout="vertical"
          onFinish={handleCancel}
        >
          <Form.Item
            name="reason"
            label="Cancellation reason"
            rules={[{ required: true, whitespace: true, message: "Enter a cancellation reason" }]}
          >
            <Input.TextArea rows={4} maxLength={1000} showCount />
          </Form.Item>
        </Form>
      </Modal>

      <RescheduleAppointmentDialog
        appointment={fullAppointment}
        open={isRescheduleDialogOpen}
        onClose={() => setIsRescheduleDialogOpen(false)}
        onRescheduled={closeDetails}
      />
    </>
  );
}
