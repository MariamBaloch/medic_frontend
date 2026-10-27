import { Space } from "antd";
import dayjs from "dayjs";
import { StatusPill } from "@components/StatusPill";
import type { WaitlistEntry, WaitlistStatus } from "../../api/waitlist.schemas";
import { WaitlistStatusCountdown, WaitlistStatusSubtext } from "./WaitlistStatusCell.styles";

interface WaitlistStatusCellProps {
  entry: WaitlistEntry;
  now: number;
}

interface StatusDescription {
  text: string;
  countdown?: string;
  urgent?: boolean;
}

function getExpirationStatus(value: string | undefined, now: number): StatusDescription | null {
  if (!value) return null;
  const expiration = dayjs(value);
  if (!expiration.isValid()) return { text: value };

  const label = `Expires ${expiration.format("MMM D [at] h:mm:ss A")}`;
  const remainingMs = expiration.valueOf() - now;
  if (remainingMs <= 0) return { text: label };

  const totalSeconds = Math.floor(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  const countdown = minutes > 0 ? `${minutes}:${seconds} minutes left` : `${seconds} seconds left`;
  return {
    text: label,
    countdown,
    urgent: true,
  };
}

function getStatusTone(status: WaitlistStatus) {
  switch (status) {
    case "OFFERED":
    case "BOOKED":
      return "success" as const;
    case "EXPIRED":
      return "error" as const;
    case "WAITING":
    case "CANCELLED":
      return "neutral" as const;
  }
}

function getStatusDescription(entry: WaitlistEntry, now: number): StatusDescription {
  switch (entry.status) {
    case "WAITING":
      return { text: "Waiting for a slot offer" };
    case "OFFERED":
      return (
        getExpirationStatus(entry.offerExpiresAt, now) ?? {
          text: "Offer is available for 15 minutes",
        }
      );
    case "BOOKED":
      return { text: "Appointment confirmed" };
    case "EXPIRED":
      return { text: "Offer expired" };
    case "CANCELLED":
      return { text: "Entry withdrawn" };
  }
}

export function WaitlistStatusCell({ entry, now }: WaitlistStatusCellProps) {
  const statusDescription = getStatusDescription(entry, now);

  return (
    <Space orientation="vertical" size={5}>
      <StatusPill tone={getStatusTone(entry.status)}>{entry.status}</StatusPill>
      <Space orientation="vertical" size={0}>
        <WaitlistStatusSubtext>{statusDescription.text}</WaitlistStatusSubtext>
        {statusDescription.countdown && (
          <WaitlistStatusCountdown $urgent={statusDescription.urgent}>
            {statusDescription.countdown}
          </WaitlistStatusCountdown>
        )}
      </Space>
    </Space>
  );
}
