import { Button, Flex, Modal, Spin } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import type { Appointment } from "@features/appointment/api/appointment.schemas";
import { useReschedulePatientAppointmentMutation } from "@features/patient/appointment/api/patientAppointmentsQueries";
import { useDoctorAvailabilityQuery } from "@features/booking/api/doctorAvailabilityQueries";
import { WeekAvailability } from "@components/WeekAvailability";
import type { DoctorAvailabilitySlot, SelectedAppointmentTime } from "@components/WeekAvailability";
import { notifyApp } from "@services/api/appNotifications";
import { PageHeader } from "@components/PageHeader";
import { ScheduleOutlined } from "@ant-design/icons";
import { parseAppointmentDate } from "@utils/formatters";
import { ModalActions } from "./AppointmentDetailsModal.styles";

interface RescheduleAppointmentDialogProps {
  appointment: Appointment | null;
  open: boolean;
  onClose: () => void;
  onRescheduled: () => void;
}

function getCurrentWeekStart(): string {
  const today = dayjs();
  return today.subtract(today.day(), "day").format("YYYY-MM-DD");
}

function getAppointmentSelection(appointment: Appointment | null): SelectedAppointmentTime | null {
  if (!appointment) return null;

  const parsedDate = parseAppointmentDate(appointment.appointmentDate);
  const startMatch = /^(\d{2}):(\d{2})$/.exec(appointment.startTime);
  const endMatch = /^(\d{2}):(\d{2})$/.exec(appointment.endTime);
  if (!parsedDate || !startMatch || !endMatch) return null;

  const date = parsedDate.format("YYYY-MM-DD");
  const startMinutes = Number(startMatch[1]) * 60 + Number(startMatch[2]);
  const endMinutes = Number(endMatch[1]) * 60 + Number(endMatch[2]);
  if (
    Number(startMatch[1]) > 23 ||
    Number(startMatch[2]) > 59 ||
    Number(endMatch[1]) > 23 ||
    Number(endMatch[2]) > 59 ||
    endMinutes <= startMinutes
  ) {
    return null;
  }

  return {
    date,
    time: appointment.startTime,
    endTime: appointment.endTime,
    durationMinutes: endMinutes - startMinutes,
  };
}

function getWeekStart(date: string): string {
  const day = dayjs(date);
  return day.subtract(day.day(), "day").format("YYYY-MM-DD");
}

export function RescheduleAppointmentDialog({
  appointment,
  open,
  onClose,
  onRescheduled,
}: RescheduleAppointmentDialogProps) {
  const [weekStartDate, setWeekStartDate] = useState(getCurrentWeekStart);
  const [selectedTime, setSelectedTime] = useState<SelectedAppointmentTime | null>(null);
  const currentSelection = useMemo(() => getAppointmentSelection(appointment), [appointment]);
  const weekEndDate = useMemo(
    () => dayjs(weekStartDate).add(6, "day").format("YYYY-MM-DD"),
    [weekStartDate],
  );
  const availabilityQuery = useDoctorAvailabilityQuery(
    open ? (appointment?.doctorId ?? null) : null,
    weekStartDate,
    weekEndDate,
  );
  const rescheduleMutation = useReschedulePatientAppointmentMutation(appointment?.id ?? 0);

  useEffect(() => {
    if (open) {
      setWeekStartDate(
        currentSelection ? getWeekStart(currentSelection.date) : getCurrentWeekStart(),
      );
      setSelectedTime(currentSelection);
    }
  }, [open, appointment?.id, currentSelection]);

  const availableSlots = useMemo<DoctorAvailabilitySlot[]>(() => {
    const slots = (availabilityQuery.data?.slots ?? []).filter(
      (slot) => slot.status === "AVAILABLE",
    );
    if (!appointment || !currentSelection) return slots;

    const currentSlotExists = slots.some(
      (slot) =>
        slot.date === currentSelection.date &&
        slot.startTime === appointment.startTime &&
        slot.endTime === appointment.endTime,
    );
    return currentSlotExists
      ? slots
      : [
          ...slots,
          {
            ruleId: 0,
            date: currentSelection.date,
            startTime: appointment.startTime,
            endTime: appointment.endTime,
            slotMinutes: currentSelection.durationMinutes,
            status: "AVAILABLE",
            canJoinWaitlist: false,
            patientHasOverlappingAppointment: false,
            patientHasActiveWaitlistEntry: false,
          },
        ];
  }, [appointment, availabilityQuery.data, currentSelection]);

  const otherBookings = useMemo(
    () =>
      (availabilityQuery.data?.patientAppointments ?? [])
        .filter((booking) => booking.appointmentId !== appointment?.id)
        .map((booking) => ({
          id: booking.appointmentId,
          doctorId: appointment?.doctorId ?? 0,
          doctorName: booking.doctorName,
          patientName: "You",
          appointmentDate: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          status: "BOOKED",
          reason: booking.reason,
        })),
    [appointment?.doctorId, appointment?.id, availabilityQuery.data?.patientAppointments],
  );
  const isCurrentSelection =
    currentSelection?.date === selectedTime?.date && currentSelection?.time === selectedTime?.time;

  const handleKeepCurrent = () => {
    if (currentSelection) {
      setWeekStartDate(getWeekStart(currentSelection.date));
      setSelectedTime(currentSelection);
    }
    onClose();
  };

  const handleConfirm = () => {
    if (!appointment || !selectedTime) return;

    rescheduleMutation.mutate(
      {
        date: dayjs(selectedTime.date).format("DD/MM/YYYY"),
        startTime: selectedTime.time,
        expectedVersion: appointment.version,
      },
      {
        onSuccess: (updatedAppointment) => {
          notifyApp({
            type: "success",
            message: "Appointment rescheduled",
            description: `Your appointment with ${updatedAppointment.doctorName} has been rescheduled to ${updatedAppointment.appointmentDate} at ${updatedAppointment.startTime}.`,
          });
          onRescheduled();
        },
      },
    );
  };

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      width="min(1600px, calc(100vw - 24px))"
      footer={
        <ModalActions>
          <Button onClick={handleKeepCurrent}>Keep current appointment</Button>
          <Button
            type="primary"
            disabled={!selectedTime || isCurrentSelection}
            loading={rescheduleMutation.isPending}
            onClick={handleConfirm}
          >
            Confirm new time
          </Button>
        </ModalActions>
      }
      destroyOnHidden
    >
      <Flex vertical gap={0}>
        <PageHeader
          style={{ padding: "10px 0px", marginBottom: 0 }}
          icon={<ScheduleOutlined />}
          title="Reschedule your appointment"
          description={`Choose a new available time with Dr. ${appointment?.doctorName}.`}
        />
        <Spin spinning={availabilityQuery.isLoading || availabilityQuery.isFetching}>
          <WeekAvailability
            availableSlots={availableSlots}
            existingBookings={otherBookings}
            weekStartDate={weekStartDate}
            onWeekChange={setWeekStartDate}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
          />
        </Spin>
      </Flex>
    </Modal>
  );
}
