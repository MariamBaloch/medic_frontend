import dayjs from "dayjs";
import { CalendarOutlined, CheckCircleFilled, ClockCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@components/PageHeader";
import { ROUTES } from "@constants/routes";
import { useCurrentUserQuery } from "@features/auth/api/authQueries";
import type { Appointment } from "@features/appointment/api/appointment.schemas";
import { useAppointmentStatusesQuery } from "@features/appointment/api/appointmentsQueries";
import {
  useDoctorDayAvailabilityQuery,
  useDoctorScheduleCalendarQuery,
} from "@features/doctor/schedule/api/scheduleQueries";
import { DoctorAppointmentDetailsModal } from "@features/doctor/appointment/components/DoctorAppointmentDetailsModal";
import { useAuthStore } from "@stores/authStore";
import { parseAppointmentDate } from "@utils/formatters";
import { DashboardActionSection } from "../components/DashboardActionSection";
import { OverviewRoot, WelcomeCard } from "../OverviewShared.styles";
import { TodayAppointmentsSection } from "./components/TodayAppointmentsSection";
import { TodayOpenSlotsSection } from "./components/TodayOpenSlotsSection";
import { DashboardActionGrid, OverviewSectionsGrid } from "./DoctorOverviewPage.styles";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function DoctorOverviewPage() {
  const navigate = useNavigate();
  const today = dayjs();
  const todayKey = today.format("YYYY-MM-DD");
  const todayApiDate = today.format("DD/MM/YYYY");
  const storedUser = useAuthStore((state) => state.user);
  const currentUserQuery = useCurrentUserQuery();
  const statusesQuery = useAppointmentStatusesQuery();
  const scheduleQuery = useDoctorScheduleCalendarQuery(todayKey, todayKey);
  const dayAvailabilityQuery = useDoctorDayAvailabilityQuery(todayApiDate);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const user = currentUserQuery.data ?? storedUser;
  const firstName = user?.firstName?.trim().split(/\s+/)[0] || "Doctor";
  const appointments = useMemo(
    () => (scheduleQuery.data?.appointments ?? [])
      .filter((appointment) => parseAppointmentDate(appointment.appointmentDate)?.format("YYYY-MM-DD") === todayKey)
      .sort((left, right) => left.startTime.localeCompare(right.startTime)),
    [scheduleQuery.data?.appointments, todayKey],
  );
  const openSlots = dayAvailabilityQuery.data?.availableRanges ?? [];
  const loading = scheduleQuery.isPending || scheduleQuery.isFetching;

  return (
    <OverviewRoot>
      <WelcomeCard>
        <PageHeader
          eyebrow={<><CheckCircleFilled /> Your practice, connected</>}
          title={`${getGreeting()}, Dr. ${firstName}.`}
          description="Your day at a glance. Review today's patients, check your open slots, and manage your availability."
          action={
            <Button type="primary" icon={<CalendarOutlined />} onClick={() => navigate(ROUTES.doctorSchedule)}>
              View schedule
            </Button>
          }
          stacked
          style={{ marginBottom: 0 }}
        />
      </WelcomeCard>

      <OverviewSectionsGrid>
        <TodayAppointmentsSection
          appointments={appointments}
          loading={loading}
          onViewAll={() => navigate(ROUTES.doctorAppointments)}
          onSelect={setSelectedAppointment}
        />
        <TodayOpenSlotsSection
          slots={openSlots}
          loading={dayAvailabilityQuery.isPending || dayAvailabilityQuery.isFetching}
          onEditAvailability={() => navigate(ROUTES.doctorAvailability)}
        />
      </OverviewSectionsGrid>

      <DashboardActionGrid>
        <DashboardActionSection
          icon={<PlusOutlined />}
          title="Add availability"
          description="Set the hours when patients can book appointments with you."
          buttonLabel="Add availability"
          onClick={() => navigate(ROUTES.doctorAvailability)}
        />
        <DashboardActionSection
          icon={<ClockCircleOutlined />}
          title="Add time off"
          description="Block a date or time when you are unavailable for appointments."
          buttonLabel="Manage time off"
          onClick={() => navigate(ROUTES.doctorTimeOff)}
        />
        <DashboardActionSection
          icon={<CalendarOutlined />}
          title="Appointment history"
          description="Review your appointments and keep up with your patients."
          buttonLabel="View appointments"
          onClick={() => navigate(ROUTES.doctorAppointments)}
        />
      </DashboardActionGrid>

      <DoctorAppointmentDetailsModal
        appointment={selectedAppointment}
        appointmentId={selectedAppointment?.id ?? null}
        statuses={statusesQuery.data ?? []}
        onClose={() => setSelectedAppointment(null)}
      />
    </OverviewRoot>
  );
}
