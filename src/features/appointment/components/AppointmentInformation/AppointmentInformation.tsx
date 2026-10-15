import { CalendarOutlined, ClockCircleOutlined, DollarCircleOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";
import type {
  Appointment,
  AppointmentStatusOption,
} from "@features/appointment/api/appointment.schemas";
import {
  formatAppointmentDate,
  formatAppointmentTimeRange,
  formatBookingFee,
} from "@utils/formatters";
import { AppointmentStatusCell } from "../AppointmentStatusCell";
import {
  AppointmentDetailContent,
  AppointmentDetailIcon,
  AppointmentDetailLabel,
  AppointmentDetailRowContainer,
  AppointmentDetailRows,
  AppointmentDetailValue,
  AppointmentInformationCard,
  AppointmentInformationHeader,
  SectionTitle,
  StatusContainer,
} from "./AppointmentInformation.styles";

interface DetailRowProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  last?: boolean;
}

function DetailRow({ icon, label, value, last = false }: DetailRowProps) {
  return (
    <AppointmentDetailRowContainer $last={last}>
      <AppointmentDetailIcon>{icon}</AppointmentDetailIcon>
      <AppointmentDetailContent>
        <AppointmentDetailLabel type="secondary">{label}</AppointmentDetailLabel>
        <AppointmentDetailValue>{value}</AppointmentDetailValue>
      </AppointmentDetailContent>
    </AppointmentDetailRowContainer>
  );
}

interface AppointmentInformationProps {
  appointment: Appointment;
  statuses: AppointmentStatusOption[];
}

export function AppointmentInformation({ appointment, statuses }: AppointmentInformationProps) {
  return (
    <AppointmentInformationCard>
      <AppointmentInformationHeader>
        <SectionTitle level={4}>Appointment information</SectionTitle>
        <StatusContainer>
          <AppointmentStatusCell appointment={appointment} statuses={statuses} showUpcoming />
        </StatusContainer>
      </AppointmentInformationHeader>
      <AppointmentDetailRows>
        <DetailRow
          icon={<CalendarOutlined />}
          label="Date"
          value={formatAppointmentDate(appointment.appointmentDate)}
        />
        <DetailRow
          icon={<ClockCircleOutlined />}
          label="Time"
          value={formatAppointmentTimeRange(appointment.startTime, appointment.endTime)}
        />
        <DetailRow
          icon={<DollarCircleOutlined />}
          label="Booking fee (USD)"
          value={formatBookingFee(appointment.bookingFee)}
          last
        />
      </AppointmentDetailRows>
    </AppointmentInformationCard>
  );
}
