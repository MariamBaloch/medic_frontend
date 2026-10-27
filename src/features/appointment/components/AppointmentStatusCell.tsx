import { Typography } from "antd";
import { StatusPill, type StatusPillTone } from "@components/StatusPill";
import type {
  Appointment,
  AppointmentStatus,
  AppointmentStatusOption,
} from "@features/appointment/api/appointment.schemas";
import { getAppointmentStatusLabel, isUpcomingAppointment } from "@utils/formatters";
import { AppointmentStatusStack } from "./AppointmentStatusCell/AppointmentStatusCell.styles";

const appointmentStatusTone: Record<AppointmentStatus, StatusPillTone> = {
  BOOKED: "success",
  COMPLETED: "completed",
  NO_SHOW: "warning",
  CANCELLED: "error",
};

interface AppointmentStatusCellProps {
  appointment: Appointment;
  statuses: AppointmentStatusOption[];
  showUpcoming?: boolean;
}

export function AppointmentStatusCell({
  appointment,
  statuses,
  showUpcoming = true,
}: AppointmentStatusCellProps) {
  const upcoming = showUpcoming && isUpcomingAppointment(appointment);

  return (
    <AppointmentStatusStack>
      <StatusPill
        tone={appointmentStatusTone[appointment.status]}
      >
        {getAppointmentStatusLabel(appointment.status, statuses)}
      </StatusPill>
      {upcoming ? <Typography.Text>Upcoming</Typography.Text> : null}
    </AppointmentStatusStack>
  );
}
