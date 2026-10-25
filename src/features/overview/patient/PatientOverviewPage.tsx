import dayjs from "dayjs";
import { CalendarOutlined, CheckCircleFilled, UserOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@constants/routes";
import { PageHeader } from "@components/PageHeader";
import { useCurrentUserQuery } from "@features/auth/api/authQueries";
import { useAuthStore } from "@stores/authStore";
import { useAppointmentStatusesQuery } from "@features/appointment/api/appointmentsQueries";
import { usePatientAppointmentsQuery } from "@features/patient/appointment/api/patientAppointmentsQueries";
import type { Appointment } from "@features/appointment/api/appointment.schemas";
import { parseAppointmentDate } from "@utils/formatters";
import { AppointmentDetailsModal } from "@features/appointment/components/AppointmentDetailsModal";
import { RecentVisitsSection } from "./components/RecentVisitsSection";
import { UpcomingAppointmentSection } from "./components/UpcomingAppointmentSection";
import { DashboardActionSection } from "../components/DashboardActionSection";
import { OverviewRoot, WelcomeCard } from "../OverviewShared.styles";
import {
  DashboardActionGrid,
  SecondSectionGrid,
} from "./PatientOverviewPage.styles";

function getAppointmentDateTime(appointment: Appointment) {
  const date = parseAppointmentDate(appointment.appointmentDate);
  if (!date) return null;
  const [hours, minutes] = appointment.startTime.split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  return date.hour(hours).minute(minutes).second(0);
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function PatientOverviewPage() {
  const navigate = useNavigate();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const storedUser = useAuthStore((state) => state.user);
  const currentUserQuery = useCurrentUserQuery();
  const user = currentUserQuery.data ?? storedUser;
  const appointmentsQuery = usePatientAppointmentsQuery({
    page: 0,
    size: 100,
    sort: ["appointmentDate,ASC", "startTime,ASC"],
  });
  const statusesQuery = useAppointmentStatusesQuery();
  const statuses = statusesQuery.data ?? [];
  const appointments = appointmentsQuery.data?.content ?? [];

  const upcomingAppointment = useMemo(
    () =>
      appointments
        .filter((appointment) => {
          const dateTime = getAppointmentDateTime(appointment);
          return appointment.status === "BOOKED" && dateTime?.isAfter(dayjs());
        })
        .sort((left, right) => {
          const leftDate = getAppointmentDateTime(left)?.valueOf() ?? 0;
          const rightDate = getAppointmentDateTime(right)?.valueOf() ?? 0;
          return leftDate - rightDate;
        })[0],
    [appointments],
  );
  const recentAppointments = useMemo(
    () =>
      [...appointments]
        .filter((appointment) => {
          const dateTime = getAppointmentDateTime(appointment);
          return dateTime?.isBefore(dayjs()) ?? false;
        })
        .sort((left, right) => {
          const leftDate = getAppointmentDateTime(left)?.valueOf() ?? 0;
          const rightDate = getAppointmentDateTime(right)?.valueOf() ?? 0;
          return rightDate - leftDate;
        })
        .slice(0, 3),
    [appointments],
  );
  const greeting = getGreeting();
  const firstName = user?.firstName?.trim().split(/\s+/)[0] || "there";
  const openAppointmentDetails = (appointment: Appointment) => setSelectedAppointment(appointment);

  return (
    <OverviewRoot>
      <WelcomeCard>
        <PageHeader
          eyebrow={
            <>
              <CheckCircleFilled /> Your care, connected
            </>
          }
          title={`${greeting}, ${firstName}.`}
          description="Keep your care on track. Book a visit, manage an upcoming appointment, or review your health details."
          action={
            <Button
              type="primary"
              icon={<CalendarOutlined />}
              onClick={() => navigate(ROUTES.patientBookAppointment)}
            >
              Book an appointment
            </Button>
          }
          stacked
          style={{ marginBottom: 0 }}
        />
      </WelcomeCard>

      <SecondSectionGrid>
        <RecentVisitsSection
          appointments={recentAppointments}
          statuses={statuses}
          loading={appointmentsQuery.isPending}
          onViewAll={() => navigate(ROUTES.patientAppointments)}
          onViewDetails={openAppointmentDetails}
        />
        <UpcomingAppointmentSection
          appointment={upcomingAppointment}
          statuses={statuses}
          loading={appointmentsQuery.isPending}
          onManage={openAppointmentDetails}
          onBook={() => navigate(ROUTES.patientBookAppointment)}
        />
      </SecondSectionGrid>

      <DashboardActionGrid>
        <DashboardActionSection
          icon={<CalendarOutlined />}
          title="Manage appointments"
          description="Book a new visit, reschedule an upcoming appointment, or cancel a visit that no longer works for you."
          buttonLabel="View appointments"
          onClick={() => navigate(ROUTES.patientAppointments)}
        />
        <DashboardActionSection
          icon={<UserOutlined />}
          title="Update profile"
          description="Keep your contact details, birth date, and medical information current so your care team can reach you and prepare for visits."
          buttonLabel="Edit profile"
          onClick={() => navigate(`${ROUTES.patient}/profile`)}
        />
      </DashboardActionGrid>

      <AppointmentDetailsModal
        appointment={selectedAppointment}
        appointmentId={selectedAppointment?.id ?? null}
        statuses={statuses}
        onClose={() => setSelectedAppointment(null)}
      />
    </OverviewRoot>
  );
}
