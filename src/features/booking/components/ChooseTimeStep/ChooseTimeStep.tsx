import { Flex, Spin } from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { WeekAvailability } from "@components/WeekAvailability";
import type { ExistingPatientBooking, SelectedAppointmentTime } from "@components/WeekAvailability";
import { useDoctorAvailabilityQuery } from "@features/booking/api/doctorAvailabilityQueries";
import { StepTitle } from "../StepTitle";

function getCurrentWeekStart(): string {
  const today = dayjs();
  return today.subtract(today.day(), "day").format("YYYY-MM-DD");
}

interface ChooseTimeStepProps {
  doctorId: number | null;
  selectedTime: SelectedAppointmentTime | null;
  onSelectTime: (selection: SelectedAppointmentTime) => void;
}

export function ChooseTimeStep({ doctorId, selectedTime, onSelectTime }: ChooseTimeStepProps) {
  const [weekStartDate, setWeekStartDate] = useState(getCurrentWeekStart);
  const weekEndDate = useMemo(
    () => dayjs(weekStartDate).add(6, "day").format("YYYY-MM-DD"),
    [weekStartDate],
  );
  const availabilityQuery = useDoctorAvailabilityQuery(doctorId, weekStartDate, weekEndDate);
  const existingBookings: ExistingPatientBooking[] = (
    availabilityQuery.data?.patientAppointments ?? []
  ).map((appointment) => ({
    id: appointment.appointmentId,
    doctorId: doctorId ?? 0,
    doctorName: appointment.doctorName,
    patientName: "You",
    appointmentDate: appointment.date,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    status: "BOOKED",
    reason: appointment.reason,
  }));

  return (
    <Flex vertical>
      <StepTitle title="Choose a date and time" description="Select an available time below." />
      <Spin spinning={availabilityQuery.isLoading || availabilityQuery.isFetching}>
        <WeekAvailability
          allowPastWeeks={false}
          availableSlots={availabilityQuery.data?.slots ?? []}
          existingBookings={existingBookings}
          weekStartDate={weekStartDate}
          onWeekChange={setWeekStartDate}
          selectedTime={selectedTime}
          onSelectTime={onSelectTime}
        />
      </Spin>
    </Flex>
  );
}
