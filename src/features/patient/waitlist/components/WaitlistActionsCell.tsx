import { RightOutlined } from "@ant-design/icons";
import { Space } from "antd";
import type { WaitlistEntry } from "../api/waitlist.schemas";
import { WaitlistButton } from "./WaitlistButton";

interface WaitlistActionsCellProps {
  entry: WaitlistEntry;
  acceptingOffer: boolean;
  openingAppointment: boolean;
  onAcceptOffer: (entry: WaitlistEntry) => void;
  onRemoveEntry: (entry: WaitlistEntry) => void;
  onOpenAppointment: (entry: WaitlistEntry) => void;
  onChooseAnotherTime: () => void;
}

export function WaitlistActionsCell({
  entry,
  acceptingOffer,
  openingAppointment,
  onAcceptOffer,
  onRemoveEntry,
  onOpenAppointment,
  onChooseAnotherTime,
}: WaitlistActionsCellProps) {
  if (entry.status === "OFFERED") {
    return (
      <Space orientation="vertical" align="end" size={3}>
        <WaitlistButton
          type="link"
          loading={acceptingOffer}
          onClick={() => onAcceptOffer(entry)}
        >
          Accept Offer
        </WaitlistButton>
        <WaitlistButton
          type="link"
          danger
          onClick={() => onRemoveEntry(entry)}
        >
          Decline offer
        </WaitlistButton>
      </Space>
    );
  }

  if (entry.status === "WAITING") {
    return (
      <WaitlistButton type="link" onClick={() => onRemoveEntry(entry)}>
        Withdraw <RightOutlined />
      </WaitlistButton>
    );
  }

  if (entry.status === "BOOKED") {
    return (
      <WaitlistButton
        type="link"
        loading={openingAppointment}
        onClick={() => onOpenAppointment(entry)}
      >
        View appointment <RightOutlined />
      </WaitlistButton>
    );
  }

  if (entry.status === "EXPIRED") {
    return (
      <WaitlistButton type="link" onClick={onChooseAnotherTime}>
        Choose another time <RightOutlined />
      </WaitlistButton>
    );
  }

  return null;
}
