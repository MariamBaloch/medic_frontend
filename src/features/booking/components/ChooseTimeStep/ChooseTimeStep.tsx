import { Flex, Spin } from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { WeekAvailability } from "@components/WeekAvailability";
import type { SelectedAppointmentTime } from "@components/WeekAvailability";
import { usePatientAppointmentsQuery } from "@features/appointment/api/appointmentsQueries";
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
  const availabilityFrom = dayjs(weekStartDate).format("DD/MM/YYYY");
  const availabilityTo = dayjs(weekEndDate).format("DD/MM/YYYY");
  const availabilityQuery = useDoctorAvailabilityQuery(doctorId, availabilityFrom, availabilityTo);
  const appointmentsQuery = usePatientAppointmentsQuery({
    dateFrom: weekStartDate,
    dateTo: weekEndDate,
    page: 0,
    size: 100,
    sort: ["appointmentDate,ASC", "startTime,ASC"],
  });

  return (
    <Flex vertical>
      <StepTitle title="Choose a date and time" description="Select an available time below." />
      <Spin spinning={availabilityQuery.isLoading || appointmentsQuery.isLoading}>
        <WeekAvailability
          allowPastWeeks={false}
          availableSlots={availabilityQuery.data ?? []}
          existingBookings={appointmentsQuery.data?.content ?? []}
          weekStartDate={weekStartDate}
          onWeekChange={setWeekStartDate}
          selectedTime={selectedTime}
          onSelectTime={onSelectTime}
        />
      </Spin>
    </Flex>
  );
}
