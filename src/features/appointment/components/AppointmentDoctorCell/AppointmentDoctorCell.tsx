import { Space, Typography } from "antd";
import { DoctorAvatar } from "./AppointmentDoctorCell.styles";
import { getDoctorDisplayName, getDoctorInitials } from "@utils/formatters";
import type { Appointment } from "@features/appointment/api/appointment.schemas";

interface AppointmentDoctorCellProps {
  appointment: Appointment;
}

export function AppointmentDoctorCell({ appointment }: AppointmentDoctorCellProps) {
  return (
    <Space size={10}>
      <DoctorAvatar size={40}>{getDoctorInitials(appointment.doctorName)}</DoctorAvatar>
      <Space orientation="vertical" size={0}>
        <Typography.Text strong>
          {getDoctorDisplayName(appointment.doctorName, appointment.doctorQualification)}
        </Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {appointment.specialization?.name ?? "Specialization unavailable"}
        </Typography.Text>
      </Space>
    </Space>
  );
}
