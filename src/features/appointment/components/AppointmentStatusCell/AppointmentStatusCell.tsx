import { Typography } from "antd";
import type {
  Appointment,
  AppointmentStatusOption,
} from "@features/appointment/api/appointment.schemas";
import { getAppointmentStatusLabel, isUpcomingAppointment } from "@utils/formatters";
import { AppointmentStatusPill, AppointmentStatusStack } from "./AppointmentStatusCell.styles";

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
      <AppointmentStatusPill $status={appointment.status}>
        {getAppointmentStatusLabel(appointment.status, statuses)}
      </AppointmentStatusPill>
      {upcoming ? <Typography.Text>Upcoming</Typography.Text> : null}
    </AppointmentStatusStack>
  );
}
