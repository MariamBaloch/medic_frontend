import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Button, Space, Spin } from "antd";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@constants/routes";
import { PageHeader } from "@components/PageHeader";
import { WeekAvailability } from "@components/WeekAvailability";
import type { Appointment } from "@features/appointment/api/appointment.schemas";
import { useAppointmentStatusesQuery } from "@features/appointment/api/appointmentsQueries";
import { DoctorAppointmentDetailsModal } from "@features/doctor/appointment/components/DoctorAppointmentDetailsModal";
import { useDoctorScheduleCalendarQuery } from "./api/scheduleQueries";
import { ScheduleCalendar } from "./DoctorSchedulePage.styles";

function getCurrentWeekStart() {
  const today = dayjs();
  return today.subtract(today.day(), "day").format("YYYY-MM-DD");
}

export function DoctorSchedulePage() {
  const navigate = useNavigate();
  const [weekStartDate, setWeekStartDate] = useState(getCurrentWeekStart);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const weekEndDate = dayjs(weekStartDate).add(6, "day").format("YYYY-MM-DD");
  const calendarQuery = useDoctorScheduleCalendarQuery(weekStartDate, weekEndDate);
  const statusesQuery = useAppointmentStatusesQuery();
  const statuses = statusesQuery.data ?? [];

  const openAppointment = useCallback(
    (appointmentId: number) => {
      const appointment = calendarQuery.data?.appointments.find(({ id }) => id === appointmentId);
      if (!appointment) return;
      setSelectedAppointment(appointment);
      setSelectedAppointmentId(appointment.id);
    },
    [calendarQuery.data?.appointments],
  );

  return (
    <>
      <PageHeader
        title="Schedule"
        description="View your availability and scheduled appointments by week."
        action={
          <Space size={15}>
            <Button
              color="primary"
              variant="outlined"
              icon={<ClockCircleOutlined />}
              onClick={() => navigate(ROUTES.doctorAvailability)}
            >
              Manage availability
            </Button>
            <Button
              color="primary"
              variant="outlined"
              icon={<CalendarOutlined />}
              onClick={() => navigate(ROUTES.doctorTimeOff)}
            >
              Manage time off
            </Button>
          </Space>
        }
      />
      <Spin spinning={calendarQuery.isLoading || calendarQuery.isFetching}>
        <ScheduleCalendar>
          <WeekAvailability
            allowPastWeeks
            mode="doctor"
            availableSlots={calendarQuery.data?.availableSlots ?? []}
            existingBookings={calendarQuery.data?.appointments ?? []}
            weekStartDate={weekStartDate}
            onWeekChange={setWeekStartDate}
            onAppointmentClick={openAppointment}
          />
        </ScheduleCalendar>
      </Spin>
      <DoctorAppointmentDetailsModal
        appointment={selectedAppointment}
        appointmentId={selectedAppointmentId}
        statuses={statuses}
        onClose={() => {
          setSelectedAppointmentId(null);
          setSelectedAppointment(null);
        }}
      />
    </>
  );
}
