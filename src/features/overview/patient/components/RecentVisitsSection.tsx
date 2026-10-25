import { RightOutlined } from "@ant-design/icons";
import { Button, Empty, Flex, Skeleton, Typography } from "antd";
import { PersonSummary } from "@components/PersonSummary";
import { formatAppointmentDate, formatAppointmentTimeRange } from "@utils/formatters";
import type { Appointment, AppointmentStatusOption } from "@features/appointment/api/appointment.schemas";
import { AppointmentStatusCell } from "@features/appointment/components/AppointmentStatusCell";
import { DashboardCard, RecentVisitRow } from "../PatientOverviewPage.styles";

interface RecentVisitsSectionProps {
  appointments: Appointment[];
  statuses: AppointmentStatusOption[];
  loading: boolean;
  onViewAll: () => void;
  onViewDetails: (appointment: Appointment) => void;
}

export function RecentVisitsSection({
  appointments,
  statuses,
  loading,
  onViewAll,
  onViewDetails,
}: RecentVisitsSectionProps) {
  return (
    <DashboardCard
      title="Recent visits"
      extra={<Button type="link" onClick={onViewAll}>View all </Button>}
    >
      {loading ? (
        <Skeleton active avatar paragraph={{ rows: 3 }} />
      ) : appointments.length ? (
        <Flex vertical>
          {appointments.map((appointment) => (
            <RecentVisitRow key={appointment.id}>
              <PersonSummary
                type="doctor"
                name={appointment.doctorName}
                qualification={appointment.doctorQualification}
                specialization={appointment.specialization?.name ?? "Medical visit"}
                imageUrl={appointment.doctorImageUrl || undefined}
              />
              <Flex vertical>
                <Typography.Text strong>{formatAppointmentDate(appointment.appointmentDate)}</Typography.Text>
                <Typography.Text type="secondary">
                  {formatAppointmentTimeRange(appointment.startTime, appointment.endTime)}
                </Typography.Text>
              </Flex>
              <AppointmentStatusCell appointment={appointment} statuses={statuses} showUpcoming={false} />
              <Button
                type="link"
                onClick={() => onViewDetails(appointment)}
              >
                View details <RightOutlined />
              </Button>
            </RecentVisitRow>
          ))}
        </Flex>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Your recent visits will appear here." />
      )}
    </DashboardCard>
  );
}
