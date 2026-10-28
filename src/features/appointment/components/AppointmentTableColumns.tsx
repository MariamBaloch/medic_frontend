import { Space, Typography } from "antd";
import type { TableColumnsType } from "antd";
import type {
  Appointment,
  AppointmentStatusOption,
} from "@features/appointment/api/appointment.schemas";
import {
  formatAppointmentDate,
  formatAppointmentTimeRange,
  formatBookingFee,
} from "@utils/formatters";
import { AppointmentDoctorCell } from "./AppointmentDoctorCell";
import { AppointmentPatientCell } from "./AppointmentPatientCell";
import { AppointmentStatusCell } from "./AppointmentStatusCell";
import {
  AppointmentDetailsArrow,
  AppointmentDetailsButton,
} from "./AppointmentTableColumns.styles";

interface CreateAppointmentColumnsOptions {
  statuses: AppointmentStatusOption[];
  person: "doctor" | "patient";
  onViewDetails?: (appointment: Appointment) => void;
}

export function AppointmentColumns({
  statuses,
  person,
  onViewDetails,
}: CreateAppointmentColumnsOptions): TableColumnsType<Appointment> {
  return [
    {
      key: person,
      title: person === "patient" ? "Doctor / specialization" : "Patient",
      width: "20%",
      render: (_value, appointment) =>
        person === "patient" ? (
          <AppointmentDoctorCell appointment={appointment} />
        ) : (
          <AppointmentPatientCell appointment={appointment} />
        ),
    },
    {
      key: "appointmentDate",
      title: "Date & time",
      width: "16%",
      render: (_value, appointment) => (
        <Space orientation="vertical" size={1} style={{ minWidth: 150 }}>
          <Typography.Text strong>
            {formatAppointmentDate(appointment.appointmentDate)}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {formatAppointmentTimeRange(appointment.startTime, appointment.endTime)}
          </Typography.Text>
        </Space>
      ),
    },
    {
      key: "reason",
      title: "Visit reason",
      dataIndex: "reason",
      width: "16%",
      render: (reason: string | null | undefined) => reason || "—",
    },
    {
      key: "status",
      title: "Status",
      width: "16%",
      render: (_value, appointment) => (
        <AppointmentStatusCell appointment={appointment} statuses={statuses} />
      ),
    },
    {
      key: "bookingFee",
      title: "Fee (USD)",
      dataIndex: "bookingFee",
      width: "7%",
      render: (fee: number | null | undefined) => (
        <Typography.Text strong>{formatBookingFee(fee)}</Typography.Text>
      ),
    },
    {
      key: "details",
      title: "Details",
      width: "16%",
      align: "right",
      render: (_value, appointment) => (
        <AppointmentDetailsButton type="link" onClick={() => onViewDetails?.(appointment)}>
          View details <AppointmentDetailsArrow />
        </AppointmentDetailsButton>
      ),
    },
  ];
}
