import { EditOutlined } from "@ant-design/icons";
import { Button, Empty, Flex, Skeleton } from "antd";
import type { DoctorDayAvailabilityRange } from "@features/doctor/schedule/api/schedule.schemas";
import {
  OpenSlotDuration,
  OpenSlotRow,
  OpenSlotTime,
  OpenSlotsCard,
} from "../DoctorOverviewPage.styles";

interface TodayOpenSlotsSectionProps {
  slots: DoctorDayAvailabilityRange[];
  loading: boolean;
  onEditAvailability: () => void;
}

export function TodayOpenSlotsSection({
  slots,
  loading,
  onEditAvailability,
}: TodayOpenSlotsSectionProps) {
  return (
    <OpenSlotsCard
      title="Today's open slots"
      extra={
        <Button type="link" size="small" onClick={onEditAvailability}>
          Manage availability
        </Button>
      }
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : slots.length ? (
        <Flex vertical>
          {slots.map((slot) => (
            <OpenSlotRow key={`${slot.startTime}-${slot.endTime}`}>
              <OpenSlotTime>{slot.displayRange}</OpenSlotTime>
              <OpenSlotDuration>{slot.slotMinutes} min each</OpenSlotDuration>
            </OpenSlotRow>
          ))}
        </Flex>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No open appointment slots today." />
      )}
    </OpenSlotsCard>
  );
}
