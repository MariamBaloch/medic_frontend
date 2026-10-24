import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Button, Tooltip, Typography } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { useMemo } from "react";
import {
  AvailabilityLegend,
  BookedSlotWrapper,
  CalendarGrid,
  CalendarNavigation,
  CalendarScroller,
  DayColumn,
  DayHeader,
  DayNumber,
  DayName,
  LegendDot,
  LegendItem,
  NoAvailability,
  NoAvailabilityDash,
  TimeSlot,
  WeekLabel,
  WeekSubLabel,
} from "./WeekAvailability.styles";

const { Text } = Typography;

export interface SelectedAppointmentTime {
  date: string;
  time: string;
  endTime: string;
  durationMinutes: number;
}

export interface DoctorAvailabilitySlot {
  ruleId: number;
  date: string;
  startTime: string;
  endTime: string;
  slotMinutes: number;
}

export interface ExistingPatientBooking {
  id: number;
  doctorId: number;
  doctorName: string;
  patientName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  reason?: string | null;
}

type DoctorCalendarEntry =
  | { type: "available"; slot: DoctorAvailabilitySlot }
  | { type: "appointment"; booking: ExistingPatientBooking };

export interface WeekAvailabilityProps {
  allowPastWeeks?: boolean;
  mode?: "booking" | "doctor";
  availableSlots: DoctorAvailabilitySlot[];
  existingBookings: ExistingPatientBooking[];
  weekStartDate: string;
  onWeekChange: (weekStartDate: string) => void;
  selectedTime?: SelectedAppointmentTime | null;
  onSelectTime?: (selection: SelectedAppointmentTime) => void;
  onAppointmentClick?: (appointmentId: number) => void;
}

function getSunday(date: Dayjs): Dayjs {
  return date.startOf("day").subtract(date.day(), "day");
}

function parseApiDate(date: string): Dayjs | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(date);
  if (!match) {
    return null;
  }

  const [, day, month, year] = match;
  const parsed = dayjs(`${year}-${month}-${day}`);
  return parsed.isValid() && parsed.format("DD/MM/YYYY") === date ? parsed : null;
}

function getTimeInMinutes(time: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(time);
  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) {
    return null;
  }

  return hours * 60 + minutes;
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${period}`;
}

function getWeekLabel(start: Dayjs, end: Dayjs): string {
  if (start.year() === end.year() && start.month() === end.month()) {
    return `${start.format("MMMM D")}–${end.format("D, YYYY")}`;
  }

  return `${start.format("MMM D")}–${end.format("MMM D, YYYY")}`;
}

export function WeekAvailability({
  allowPastWeeks = false,
  mode = "booking",
  availableSlots,
  existingBookings,
  weekStartDate,
  onWeekChange,
  selectedTime = null,
  onSelectTime,
  onAppointmentClick,
}: WeekAvailabilityProps) {
  const currentWeek = useMemo(() => getSunday(dayjs()), []);
  const weekStart = useMemo(() => dayjs(weekStartDate), [weekStartDate]);
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, index) => weekStart.add(index, "day")),
    [weekStart],
  );
  const canGoToPreviousWeek = allowPastWeeks || weekStart.isAfter(currentWeek, "day");
  const slotsByDate = useMemo(() => {
    const slots = new Map<string, DoctorAvailabilitySlot[]>();
    availableSlots.forEach((slot) => {
      const date = parseApiDate(slot.date);
      const start = getTimeInMinutes(slot.startTime);
      const end = getTimeInMinutes(slot.endTime);
      if (!date || start === null || end === null || end <= start) {
        return;
      }

      const dateKey = date.format("YYYY-MM-DD");
      const daySlots = slots.get(dateKey) ?? [];
      daySlots.push(slot);
      slots.set(dateKey, daySlots);
    });

    slots.forEach((daySlots) =>
      daySlots.sort((left, right) => left.startTime.localeCompare(right.startTime)),
    );
    return slots;
  }, [availableSlots]);
  const bookingsByDate = useMemo(() => {
    const bookings = new Map<string, ExistingPatientBooking[]>();
    existingBookings.forEach((booking) => {
      const date = parseApiDate(booking.appointmentDate);
      if (!date) {
        return;
      }

      const dateKey = date.format("YYYY-MM-DD");
      const dayBookings = bookings.get(dateKey) ?? [];
      dayBookings.push(booking);
      bookings.set(dateKey, dayBookings);
    });

    return bookings;
  }, [existingBookings]);

  const navigateWeek = (direction: -1 | 1) => {
    onWeekChange(weekStart.add(direction, "week").format("YYYY-MM-DD"));
  };

  return (
    <>
      <CalendarNavigation>
        <Button
          icon={<ArrowLeftOutlined />}
          disabled={!canGoToPreviousWeek}
          style={{ justifySelf: "start" }}
          onClick={() => navigateWeek(-1)}
        >
          Previous week
        </Button>
        <WeekLabel>
          {getWeekLabel(weekDays[0], weekDays[6])}
          <WeekSubLabel>Sunday – Saturday</WeekSubLabel>
        </WeekLabel>
        <Button
          icon={<ArrowRightOutlined />}
          iconPlacement="end"
          style={{ justifySelf: "end" }}
          onClick={() => navigateWeek(1)}
        >
          Next week
        </Button>
      </CalendarNavigation>

      <CalendarScroller>
        <CalendarGrid>
          {weekDays.map((date) => {
            const dateKey = date.format("YYYY-MM-DD");
            const slots = slotsByDate.get(dateKey) ?? [];
            const dayBookings = bookingsByDate.get(dateKey) ?? [];
            const bookings =
              mode === "doctor"
                ? dayBookings
                : dayBookings.filter((booking) => booking.status === "BOOKED");
            const doctorEntries: DoctorCalendarEntry[] = [
              ...slots
                .filter((slot) => {
                  const slotStart = getTimeInMinutes(slot.startTime);
                  const slotEnd = getTimeInMinutes(slot.endTime);
                  return !bookings.some((booking) => {
                    const bookingStart = getTimeInMinutes(booking.startTime);
                    const bookingEnd = getTimeInMinutes(booking.endTime);
                    return (
                      slotStart !== null &&
                      slotEnd !== null &&
                      bookingStart !== null &&
                      bookingEnd !== null &&
                      slotStart < bookingEnd &&
                      bookingStart < slotEnd
                    );
                  });
                })
                .map((slot) => ({ type: "available" as const, slot })),
              ...bookings.map((booking) => ({ type: "appointment" as const, booking })),
            ].sort((left, right) => {
              const leftTime =
                left.type === "available" ? left.slot.startTime : left.booking.startTime;
              const rightTime =
                right.type === "available" ? right.slot.startTime : right.booking.startTime;
              return leftTime.localeCompare(rightTime);
            });

            return (
              <DayColumn key={dateKey}>
                <DayHeader
                  $isToday={date.isSame(dayjs(), "day")}
                  $isUnavailable={
                    mode === "doctor"
                      ? slots.length === 0 && bookings.length === 0
                      : slots.length === 0
                  }
                >
                  <DayName>{date.format("ddd")}</DayName>
                  <DayNumber
                    $isUnavailable={
                      mode === "doctor"
                        ? slots.length === 0 && bookings.length === 0
                        : slots.length === 0
                    }
                  >
                    {date.format("D")}
                  </DayNumber>
                </DayHeader>
                {mode === "doctor" ? (
                  doctorEntries.length === 0 ? (
                    <NoAvailability vertical align="center" justify="center">
                      <NoAvailabilityDash type="secondary">{"\u2014"}</NoAvailabilityDash>
                      <Text type="secondary">No availability or appointments</Text>
                    </NoAvailability>
                  ) : (
                    doctorEntries.map((entry) => {
                      if (entry.type === "available") {
                        const slot = entry.slot;
                        return (
                          <TimeSlot
                            key={`available-${dateKey}-${slot.startTime}`}
                            htmlType="button"
                            $selected={false}
                            $booked={false}
                            $doctorMode
                            aria-label={`Available from ${formatTime(slot.startTime)} to ${formatTime(slot.endTime)}`}
                          >
                            {formatTime(slot.startTime)}
                          </TimeSlot>
                        );
                      }

                      const booking = entry.booking;
                      const timeLabel = formatTime(booking.startTime);
                      return (
                        <Tooltip
                          key={`appointment-${booking.id}`}
                          title={`Appointment with ${booking.patientName} · ${formatTime(booking.startTime)}–${formatTime(booking.endTime)}`}
                        >
                          <BookedSlotWrapper>
                            <TimeSlot
                              htmlType="button"
                              $selected={false}
                              $booked
                              $doctorMode
                              aria-label={`Appointment with ${booking.patientName} at ${timeLabel}`}
                              onClick={() => onAppointmentClick?.(booking.id)}
                            >
                              {timeLabel}
                            </TimeSlot>
                          </BookedSlotWrapper>
                        </Tooltip>
                      );
                    })
                  )
                ) : slots.length === 0 ? (
                  <NoAvailability vertical align="center" justify="center">
                    <NoAvailabilityDash type="secondary">—</NoAvailabilityDash>
                    <Text type="secondary">No available times</Text>
                  </NoAvailability>
                ) : (
                  slots.map((slot) => {
                    const slotStart = getTimeInMinutes(slot.startTime);
                    const slotEnd = getTimeInMinutes(slot.endTime);
                    const overlappingBookings =
                      slotStart === null || slotEnd === null
                        ? []
                        : bookings.filter((booking) => {
                            const bookingStart = getTimeInMinutes(booking.startTime);
                            const bookingEnd = getTimeInMinutes(booking.endTime);
                            return (
                              bookingStart !== null &&
                              bookingEnd !== null &&
                              slotStart < bookingEnd &&
                              bookingStart < slotEnd
                            );
                          });
                    const isBooked = overlappingBookings.length > 0;
                    const isSelected =
                      selectedTime?.date === dateKey && selectedTime.time === slot.startTime;
                    const timeLabel = formatTime(slot.startTime);
                    const slotButton = (
                      <TimeSlot
                        key={`${dateKey}-${slot.startTime}`}
                        htmlType="button"
                        $selected={isSelected}
                        $booked={isBooked}
                        disabled={isBooked}
                        aria-pressed={isSelected}
                        aria-label={
                          isBooked
                            ? `${timeLabel}, already booked`
                            : `Select ${timeLabel} on ${date.format("dddd, MMMM D")}`
                        }
                        onClick={() =>
                          onSelectTime?.({
                            date: dateKey,
                            time: slot.startTime,
                            endTime: slot.endTime,
                            durationMinutes: slot.slotMinutes,
                          })
                        }
                      >
                        {timeLabel}
                      </TimeSlot>
                    );

                    return isBooked ? (
                      <Tooltip
                        key={`${dateKey}-${slot.startTime}`}
                        title={overlappingBookings
                          .map(
                            (booking) =>
                              `${booking.doctorName}, ${formatTime(booking.startTime)}–${formatTime(booking.endTime)}${booking.reason ? ` · ${booking.reason}` : ""}`,
                          )
                          .join("; ")}
                      >
                        <BookedSlotWrapper>{slotButton}</BookedSlotWrapper>
                      </Tooltip>
                    ) : (
                      slotButton
                    );
                  })
                )}
              </DayColumn>
            );
          })}
        </CalendarGrid>
      </CalendarScroller>

      <AvailabilityLegend aria-label="Availability legend">
        {mode === "doctor" ? (
          <>
            <LegendItem>
              <LegendDot $doctorAvailable /> Available time
            </LegendItem>
            <LegendItem>
              <LegendDot $appointment /> Appointment
            </LegendItem>
          </>
        ) : (
          <>
            <LegendItem>
              <LegendDot /> Available
            </LegendItem>
            <LegendItem>
              <LegendDot $booked /> Unavailable
            </LegendItem>
            <LegendItem>
              <LegendDot $selected /> Selected
            </LegendItem>
          </>
        )}
      </AvailabilityLegend>
    </>
  );
}
