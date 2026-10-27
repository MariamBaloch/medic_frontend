import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import type {
  Appointment,
  AppointmentStatus,
  AppointmentStatusOption,
} from "@features/appointment/api/appointment.schemas";

dayjs.extend(customParseFormat);

export function getDoctorDisplayName(name: string, qualification?: string | null): string {
  const formattedName = /^dr\.?\s/i.test(name) ? name : `Dr. ${name}`;
  return qualification ? `${formattedName}, ${qualification}` : formattedName;
}

export function getPersonInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function parseAppointmentDate(value: string) {
  const parsed = dayjs(value, ["DD/MM/YYYY", "YYYY-MM-DD"], true);
  return parsed.isValid() ? parsed : null;
}

export function formatAppointmentDate(value: string): string {
  return parseAppointmentDate(value)?.format("ddd, MMM D, YYYY") ?? value;
}

export function toIsoDate(value: string): string | undefined {
  const displayDate = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (displayDate) return `${displayDate[3]}-${displayDate[2]}-${displayDate[1]}`;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined;
}

interface ParsedTime {
  clock: string;
  period: "AM" | "PM";
}

function parseAppointmentTime(value: string): ParsedTime | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;

  return {
    clock: `${hour % 12 || 12}:${String(minute).padStart(2, "0")}`,
    period: hour >= 12 ? "PM" : "AM",
  };
}

export function formatTime(value: string): string {
  const parsed = parseAppointmentTime(value);
  return parsed ? `${parsed.clock} ${parsed.period}` : value;
}

export function formatAppointmentTimeRange(startTime: string, endTime: string): string {
  const start = parseAppointmentTime(startTime);
  const end = parseAppointmentTime(endTime);
  if (!start || !end) return `${startTime}–${endTime}`;

  return start.period === end.period
    ? `${start.clock}–${end.clock} ${end.period}`
    : `${start.clock} ${start.period}–${end.clock} ${end.period}`;
}

export function formatBookingFee(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value);
}

export function getAppointmentStatusLabel(
  status: AppointmentStatus,
  statuses: AppointmentStatusOption[],
): string {
  return statuses.find((option) => option.value === status)?.label ?? status;
}

export function isUpcomingAppointment(appointment: Appointment, today = dayjs()): boolean {
  if (appointment.status !== "BOOKED") return false;
  const appointmentDate = parseAppointmentDate(appointment.appointmentDate);
  return appointmentDate !== null && !appointmentDate.isBefore(today.startOf("day"));
}
