import { Space, Typography } from "antd";
import { apiClient } from "@services/api/axios";
import type { Appointment } from "@features/appointment/api/appointment.schemas";
import { getDoctorInitials } from "@utils/formatters";
import { PatientAvatar } from "./AppointmentPatientCell.styles";

export function AppointmentPatientCell({ appointment }: { appointment: Appointment }) {
  const imageUrl = appointment.patientImageUrl
    ? new URL(appointment.patientImageUrl, apiClient.defaults.baseURL).toString()
    : undefined;

  return (
    <Space size={10}>
      <PatientAvatar size={40} src={imageUrl}>
        {getDoctorInitials(appointment.patientName)}
      </PatientAvatar>
      <Typography.Text strong>{appointment.patientName}</Typography.Text>
    </Space>
  );
}
