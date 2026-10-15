import { Space, Typography } from "antd";
import { apiClient } from "@services/api/axios";
import { DoctorAvatar } from "./AppointmentDoctorCell.styles";
import { getDoctorDisplayName, getDoctorInitials } from "@utils/formatters";
import type { Appointment } from "@features/appointment/api/appointment.schemas";

interface AppointmentDoctorCellProps {
  appointment: Appointment;
}

export function AppointmentDoctorCell({ appointment }: AppointmentDoctorCellProps) {
  const avatarUrl = appointment.doctorImageUrl
    ? new URL(appointment.doctorImageUrl, apiClient.defaults.baseURL).toString()
    : undefined;

  return (
    <Space size={10}>
      <DoctorAvatar size={40} src={avatarUrl} $hasImage={Boolean(avatarUrl)}>
        {getDoctorInitials(appointment.doctorName)}
      </DoctorAvatar>
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
