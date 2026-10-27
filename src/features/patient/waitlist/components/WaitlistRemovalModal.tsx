import { Modal, Space, Typography } from "antd";
import type { WaitlistEntry } from "../api/waitlist.schemas";
import { WaitlistButton } from "./WaitlistButton";

interface WaitlistRemovalModalProps {
  entry: WaitlistEntry | null;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function WaitlistRemovalModal({
  entry,
  loading,
  onCancel,
  onConfirm,
}: WaitlistRemovalModalProps) {
  const isOffer = entry?.status === "OFFERED";

  return (
    <Modal
      open={entry !== null}
      title={isOffer ? "Decline this offer?" : "Withdraw from this waitlist?"}
      onCancel={onCancel}
      footer={
        <Space>
          <WaitlistButton disabled={loading} onClick={onCancel}>
            {isOffer ? "Keep offer" : "Keep entry"}
          </WaitlistButton>
          <WaitlistButton type="primary" danger={isOffer} loading={loading} onClick={onConfirm}>
            {isOffer ? "Decline offer" : "Withdraw"}
          </WaitlistButton>
        </Space>
      }
    >
      <Typography.Text>
        {isOffer
          ? "This will remove the offer from your waitlist."
          : "You will be removed from this waitlist entry."}
      </Typography.Text>
    </Modal>
  );
}
