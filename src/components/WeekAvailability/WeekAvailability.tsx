import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Button, Popover, Tooltip, Typography } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { useMemo } from "react";
import { colors } from "@theme/tokens";
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
  status?: "AVAILABLE" | "BOOKED" | "WAITLIST_OFFERED";
  canJoinWaitlist?: boolean;
  patientHasOverlappingAppointment?: boolean;
  patientHasActiveWaitlistEntry?: boolean;
}

export interface DoctorAvailabilitySlot {
  ruleId: number;
  date: string;
  startTime: string;
  endTime: string;
  slotMinutes: number;
  status?: "AVAILABLE" | "BOOKED" | "WAITLIST_OFFERED";
  canJoinWaitlist?: boolean;
  patientHasOverlappingAppointment?: boolean;
  patientHasActiveWaitlistEntry?: boolean;
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
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const legacyMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(date);
  const normalized = isoMatch
    ? date
    : legacyMatch
      ? `${legacyMatch[3]}-${legacyMatch[2]}-${legacyMatch[1]}`
      : null;
  if (!normalized) return null;

  const parsed = dayjs(normalized);
  return parsed.isValid() && parsed.format("YYYY-MM-DD") === normalized ? parsed : null;
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
          type="link"
          color="primary"
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
          type="link"
          color="primary"
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
                  const overlapsPatientAppointment = bookings.some((booking) => {
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
                  return !overlapsPatientAppointment;
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
                      : slots.length === 0 && bookings.length === 0
                  }
                >
                  <DayName>{date.format("ddd")}</DayName>
                  <DayNumber
                    $isUnavailable={
                      mode === "doctor"
                        ? slots.length === 0 && bookings.length === 0
                        : slots.length === 0 && bookings.length === 0
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
                ) : doctorEntries.length === 0 ? (
                  <NoAvailability vertical align="center" justify="center">
                    <NoAvailabilityDash type="secondary">—</NoAvailabilityDash>
                    <Text type="secondary">No availability or appointments</Text>
                  </NoAvailability>
                ) : (
                  doctorEntries.map((entry) => {
                    if (entry.type === "appointment") {
                      const booking = entry.booking;
                      const timeLabel = formatTime(booking.startTime);
                      return (
                        <Popover
                          key={`appointment-${booking.id}`}
                          trigger={["hover", "focus"]}
                          title={booking.doctorName}
                          content={
                            <div>
                              <div>
                                {formatTime(booking.startTime)}–{formatTime(booking.endTime)}
                              </div>
                              {booking.reason ? <div>{booking.reason}</div> : null}
                            </div>
                          }
                        >
                          <TimeSlot
                            htmlType="button"
                            $selected={false}
                            $booked
                            $appointment
                            aria-label={`Appointment with ${booking.doctorName} from ${formatTime(booking.startTime)} to ${formatTime(booking.endTime)}${booking.reason ? `, ${booking.reason}` : ""}`}
                          >
                            {timeLabel}–{formatTime(booking.endTime)}
                          </TimeSlot>
                        </Popover>
                      );
                    }

                    const slot = entry.slot;
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
                    const status = slot.status ?? "AVAILABLE";
                    const isWaitlistSlot = status !== "AVAILABLE";
                    const canJoinWaitlist = isWaitlistSlot && slot.canJoinWaitlist === true;
                    const isBooked =
                      isWaitlistSlot ||
                      slot.patientHasOverlappingAppointment === true ||
                      overlappingBookings.length > 0;
                    const isSelected =
                      selectedTime?.date === dateKey && selectedTime.time === slot.startTime;
                    const timeLabel = formatTime(slot.startTime);
                    const slotButton = (
                      <TimeSlot
                        key={`${dateKey}-${slot.startTime}`}
                        htmlType="button"
                        $selected={isSelected}
                        $booked={isBooked}
                        $waitlistAvailable={canJoinWaitlist}
                        aria-pressed={isSelected}
                        aria-label={
                          isWaitlistSlot
                            ? `${timeLabel}, ${status === "WAITLIST_OFFERED" ? "offer available" : "booked"}${canJoinWaitlist ? ", join waiting list" : ", waitlist unavailable"}`
                            : slot.patientHasOverlappingAppointment
                              ? `${timeLabel}, overlaps your appointment`
                              : `Select ${timeLabel} on ${date.format("dddd, MMMM D")}`
                        }
                        onClick={() =>
                          onSelectTime?.({
                            date: dateKey,
                            time: slot.startTime,
                            endTime: slot.endTime,
                            durationMinutes: slot.slotMinutes,
                            status,
                            canJoinWaitlist: slot.canJoinWaitlist,
                            patientHasOverlappingAppointment: slot.patientHasOverlappingAppointment,
                            patientHasActiveWaitlistEntry: slot.patientHasActiveWaitlistEntry,
                          })
                        }
                      >
                        {timeLabel}
                        {isWaitlistSlot && !canJoinWaitlist ? (
                          <span style={{ display: "block", fontSize: 9, lineHeight: 1.1 }}>
                            {status === "WAITLIST_OFFERED" ? "Offer pending" : "Booked"}
                          </span>
                        ) : null}
                      </TimeSlot>
                    );

                    return isBooked ? (
                      <Tooltip
                        key={`${dateKey}-${slot.startTime}`}
                        trigger={canJoinWaitlist ? ["hover", "focus"] : undefined}
                        color={canJoinWaitlist ? colors.surface : undefined}
                        styles={
                          canJoinWaitlist
                            ? {
                                container: { backgroundColor: colors.surface, color: colors.text },
                              }
                            : undefined
                        }
                        title={
                          canJoinWaitlist
                            ? "Join waiting list"
                            : isWaitlistSlot
                              ? slot.patientHasOverlappingAppointment
                                ? "You already have an appointment that overlaps this time."
                                : slot.patientHasActiveWaitlistEntry && !canJoinWaitlist
                                  ? "You already have an active waitlist entry for this time."
                                  : "This slot is not accepting waitlist entries."
                              : overlappingBookings
                                  .map(
                                    (booking) =>
                                      `${booking.doctorName}, ${formatTime(booking.startTime)}–${formatTime(booking.endTime)}${booking.reason ? ` · ${booking.reason}` : ""}`,
                                  )
                                  .join("; ") || "This time overlaps your appointment."
                        }
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
              <LegendDot $booked />
              <span style={{ textDecoration: "line-through" }}>Unavailable</span>
            </LegendItem>
            <LegendItem>
              <LegendDot $waitlist /> Waitlist available
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
