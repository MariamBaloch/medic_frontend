import { CalendarOutlined } from "@ant-design/icons";
import { Button, Modal, Spin } from "antd";
import type {
  Appointment,
  AppointmentStatusOption,
} from "@features/appointment/api/appointment.schemas";
import { usePatientAppointmentQuery } from "@features/appointment/api/appointmentsQueries";
import { PageHeader } from "@components/PageHeader";
import { AppointmentDoctorDetails } from "../AppointmentDoctorDetails";
import { AppointmentInformation } from "../AppointmentInformation";
import { AppointmentReasonPanel } from "../AppointmentReasonPanel";
import {
  ContentGrid,
  InformationColumn,
  LoadingContainer,
} from "./AppointmentDetailsModal.styles";

interface AppointmentDetailsModalProps {
  appointment: Appointment | null;
  appointmentId: number | null;
  statuses: AppointmentStatusOption[];
  onClose: () => void;
}

function hasValue(value: string | null | undefined): value is string {
  return value !== null && value !== undefined && value.trim() !== "";
}

export function AppointmentDetailsModal({
  appointment,
  appointmentId,
  statuses,
  onClose,
}: AppointmentDetailsModalProps) {
  const appointmentQuery = usePatientAppointmentQuery(appointmentId);
  const details = appointmentQuery.data;
  const fullAppointment = appointment && details ? { ...appointment, ...details } : null;

  return (
    <Modal
      title={null}
      open={appointmentId !== null}
      onCancel={onClose}
      centered
      width="min(1100px, calc(100vw - 24px))"
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      {appointmentQuery.isLoading ? (
        <LoadingContainer>
          <Spin />
        </LoadingContainer>
      ) : fullAppointment ? (
        <>
          <PageHeader
            style={{ padding: "10px 0px" }}
            icon={<CalendarOutlined />}
            title="Appointment details"
            description="View the full details of your appointment."
          />
          <ContentGrid>
            <AppointmentDoctorDetails appointment={fullAppointment} />
            <InformationColumn>
              <AppointmentInformation appointment={fullAppointment} statuses={statuses} />
              <AppointmentReasonPanel
                title="Reason for visit"
                value={fullAppointment.reason?.trim() || "No reason provided."}
              />
              {hasValue(fullAppointment.cancelledReason) ? (
                <AppointmentReasonPanel
                  title="Cancellation reason"
                  value={fullAppointment.cancelledReason.trim()}
                  variant="danger"
                />
              ) : null}
            </InformationColumn>
          </ContentGrid>
        </>
      ) : null}
    </Modal>
  );
}
