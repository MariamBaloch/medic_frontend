import { Button, Descriptions, Modal } from "antd";
import type {
  Appointment,
  AppointmentStatusOption,
} from "@features/patient/api/appointment.schemas";
import {
  formatAppointmentDate,
  formatAppointmentTimeRange,
  formatBookingFee,
  getDoctorDisplayName,
} from "@utils/formatters";
import { AppointmentStatusCell } from "./AppointmentStatusCell";

interface AppointmentDetailsModalProps {
  appointment: Appointment | null;
  statuses: AppointmentStatusOption[];
  onClose: () => void;
}

export function AppointmentDetailsModal({
  appointment,
  statuses,
  onClose,
}: AppointmentDetailsModalProps) {
  return (
    <Modal
      title="Appointment details"
      open={appointment !== null}
      onCancel={onClose}
      footer={<Button onClick={onClose}>Close</Button>}
    >
      {appointment ? (
        <Descriptions column={1} size="small">
          <Descriptions.Item label="Doctor">
            {getDoctorDisplayName(appointment.doctorName, appointment.doctorQualification)}
          </Descriptions.Item>
          <Descriptions.Item label="Specialization">
            {appointment.specialization?.name ?? "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Date">
            {formatAppointmentDate(appointment.appointmentDate)}
          </Descriptions.Item>
          <Descriptions.Item label="Time">
            {formatAppointmentTimeRange(appointment.startTime, appointment.endTime)}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <AppointmentStatusCell
              appointment={appointment}
              statuses={statuses}
              showUpcoming={false}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Fee (USD)">
            {formatBookingFee(appointment.bookingFee)}
          </Descriptions.Item>
          <Descriptions.Item label="Reason">{appointment.reason || "—"}</Descriptions.Item>
          {appointment.cancelledReason ? (
            <Descriptions.Item label="Cancellation reason">
              {appointment.cancelledReason}
            </Descriptions.Item>
          ) : null}
        </Descriptions>
      ) : null}
    </Modal>
  );
}
