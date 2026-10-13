import { RightOutlined } from "@ant-design/icons";
import { Button, Space, Typography } from "antd";
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
import { AppointmentStatusCell } from "./AppointmentStatusCell";

interface CreateAppointmentColumnsOptions {
  statuses: AppointmentStatusOption[];
  onViewDetails: (appointment: Appointment) => void;
}

export function AppointmentColumns({
  statuses,
  onViewDetails,
}: CreateAppointmentColumnsOptions): TableColumnsType<Appointment> {
  return [
    {
      key: "doctor",
      title: "Doctor / specialization",
      width: "16%",
      render: (_value, appointment) => <AppointmentDoctorCell appointment={appointment} />,
    },
    {
      key: "appointmentDate",
      title: "Date & time",
      width: "16%",
      render: (_value, appointment) => (
        <Space orientation="vertical" size={1}>
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
      width: "16%",
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
        <Button
          type="link"
          className="appointment-details-link"
          style={{ paddingInline: 0, height: "auto", fontSize: 12, fontWeight: 300 }}
          onClick={() => onViewDetails(appointment)}
        >
          View details <RightOutlined style={{ fontSize: 11 }} />
        </Button>
      ),
    },
  ];
}
