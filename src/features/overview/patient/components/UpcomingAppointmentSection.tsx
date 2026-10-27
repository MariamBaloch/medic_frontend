import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Button, Empty, Flex, Skeleton, Typography } from "antd";
import { PersonSummary } from "@components/PersonSummary";
import { formatAppointmentDate, formatAppointmentTimeRange } from "@utils/formatters";
import type {
  Appointment,
  AppointmentStatusOption,
} from "@features/appointment/api/appointment.schemas";
import { AppointmentStatusCell } from "@features/appointment/components/AppointmentStatusCell";
import { AppointmentDetail, UpcomingAppointmentCard } from "../PatientOverviewPage.styles";

interface UpcomingAppointmentSectionProps {
  appointment?: Appointment;
  statuses: AppointmentStatusOption[];
  loading: boolean;
  onManage: (appointment: Appointment) => void;
  onBook: () => void;
}

export function UpcomingAppointmentSection({
  appointment,
  statuses,
  loading,
  onManage,
}: UpcomingAppointmentSectionProps) {
  return (
    <UpcomingAppointmentCard title="Upcoming appointment">
      {loading ? (
        <Skeleton active avatar paragraph={{ rows: 2 }} />
      ) : appointment ? (
        <Flex vertical gap={16}>
          <Flex align="center" justify="space-between" gap={10}>
            <PersonSummary
              type="doctor"
              name={appointment.doctorName}
              qualification={appointment.doctorQualification}
              specialization={appointment.specialization?.name}
              imageUrl={appointment.doctorImageUrl || undefined}
              size={48}
            />
            <AppointmentStatusCell
              appointment={appointment}
              statuses={statuses}
              showUpcoming={false}
            />
          </Flex>
          <Flex gap={8} wrap="wrap">
            <AppointmentDetail style={{ flex: "1 1 130px" }}>
              <CalendarOutlined />
              <Flex vertical>
                <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                  Date
                </Typography.Text>
                <Typography.Text>
                  {formatAppointmentDate(appointment.appointmentDate)}
                </Typography.Text>
              </Flex>
            </AppointmentDetail>
            <AppointmentDetail style={{ flex: "1 1 130px" }}>
              <ClockCircleOutlined />
              <Flex vertical>
                <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                  Visit time
                </Typography.Text>
                <Typography.Text>
                  {formatAppointmentTimeRange(appointment.startTime, appointment.endTime)}
                </Typography.Text>
              </Flex>
            </AppointmentDetail>
          </Flex>
          <Button
            style={{ marginTop: 10 }}
            type="primary"
            block
            onClick={() => onManage(appointment)}
          >
            Manage appointment
          </Button>
        </Flex>
      ) : (
        <Flex vertical align="center" gap={10} style={{ padding: "4px 0" }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="You have no upcoming appointments."
          />
        </Flex>
      )}
    </UpcomingAppointmentCard>
  );
}
