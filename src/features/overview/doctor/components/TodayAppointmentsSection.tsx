import { ClockCircleOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Empty, Flex, Skeleton, Typography } from "antd";
import type { Appointment } from "@features/appointment/api/appointment.schemas";
import { AppointmentPatientCell } from "@features/appointment/components/AppointmentPatientCell";
import { formatAppointmentTimeRange } from "@utils/formatters";
import { DashboardCard, TodayAppointmentRow } from "../DoctorOverviewPage.styles";

interface TodayAppointmentsSectionProps {
  appointments: Appointment[];
  loading: boolean;
  onViewAll: () => void;
  onSelect: (appointment: Appointment) => void;
}

export function TodayAppointmentsSection({
  appointments,
  loading,
  onViewAll,
  onSelect,
}: TodayAppointmentsSectionProps) {
  return (
    <DashboardCard
      title="Today's appointments"
      extra={<Button type="link" onClick={onViewAll}>View all</Button>}
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : appointments.length ? (
        <Flex vertical>
          {appointments.map((appointment) => (
            <TodayAppointmentRow key={appointment.id}>
              <AppointmentPatientCell appointment={appointment} />
              <Flex align="center" gap={7}>
                <ClockCircleOutlined />
                <Typography.Text>
                  {formatAppointmentTimeRange(appointment.startTime, appointment.endTime)}
                </Typography.Text>
              </Flex>
              <Typography.Text type="secondary" ellipsis>
                {appointment.reason || "Appointment"}
              </Typography.Text>
              <Button type="link" onClick={() => onSelect(appointment)} aria-label={`View appointment with ${appointment.patientName}`}>
                View details <RightOutlined />
              </Button>
            </TodayAppointmentRow>
          ))}
        </Flex>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No appointments scheduled for today." />
      )}
    </DashboardCard>
  );
}
