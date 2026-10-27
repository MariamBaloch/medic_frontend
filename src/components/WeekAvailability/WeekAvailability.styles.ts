import styled from "styled-components";
import { Button, Flex, Typography } from "antd";
import { colors } from "@theme/tokens";

export const CalendarNavigation = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  margin: 24px 0 16px;

  @media (max-width: 600px) {
    grid-template-columns: auto 1fr auto;
    gap: 8px;
  }
`;

export const WeekLabel = styled(Typography.Text)`
  text-align: center;
  color: ${colors.text};
  font-weight: 600;
`;

export const WeekSubLabel = styled(Typography.Text)`
  display: block;
  color: ${colors.textSecondary};
  font-size: 11px;
  font-weight: 400;
`;

export const CalendarScroller = styled.div`
  overflow-x: auto;
  padding-bottom: 4px;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(100px, 1fr));
  gap: 8px;
  min-width: 760px;
`;

export const DayColumn = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
`;

export const DayHeader = styled.div<{ $isToday: boolean; $isUnavailable: boolean }>`
  display: flex;
  min-height: 64px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: ${({ $isToday }) => ($isToday ? "#E3F0ED" : colors.backgroundSoft)};
  color: ${({ $isUnavailable }) => ($isUnavailable ? "#A6B3B0" : colors.textSecondary)};
  font-size: 11px;
`;

export const DayName = styled(Typography.Text)`
  color: inherit;
  font-size: 11px;
`;

export const DayNumber = styled(Typography.Text)<{ $isUnavailable: boolean }>`
  margin-top: 2px;
  color: ${({ $isUnavailable }) => ($isUnavailable ? "#A6B3B0" : colors.text)};
  font-size: 18px;
  font-weight: 600;
`;

export const TimeSlot = styled(Button)<{
  $selected: boolean;
  $booked: boolean;
  $doctorMode?: boolean;
  $waitlistAvailable?: boolean;
  $appointment?: boolean;
}>`
  width: 100%;
  min-height: 40px;
  padding: 8px 4px;
  border-radius: 10px;
  cursor: ${({ $booked, $doctorMode, $appointment }) =>
    $appointment ? "default" : $doctorMode ? ($booked ? "pointer" : "default") : "pointer"};
  font: inherit;
  font-size: 11px;

  && {
    border: 1px solid
      ${({ $selected, $booked, $doctorMode, $waitlistAvailable, $appointment }) =>
        $selected
          ? colors.primary
          : $waitlistAvailable
            ? colors.border
            : $appointment
              ? colors.border
              : $booked
                ? $doctorMode
                  ? colors.primary
                  : "transparent"
                : colors.border};
    background: ${({ $selected, $booked, $doctorMode, $waitlistAvailable, $appointment }) =>
      $selected
        ? colors.primary
        : $waitlistAvailable
          ? colors.backgroundSoft
          : $appointment
            ? colors.backgroundSoft
            : $doctorMode && $booked
              ? colors.primary
              : $doctorMode
                ? "transparent"
                : $booked
                  ? colors.backgroundSoft
                  : colors.surface};
    color: ${({ $selected, $booked, $doctorMode, $waitlistAvailable, $appointment }) =>
      $selected
        ? colors.surface
        : $waitlistAvailable
          ? colors.primary
          : $appointment
            ? colors.textSecondary
            : $doctorMode
              ? $booked
                ? colors.surface
                : colors.primary
              : $booked
                ? "#A6B3B0"
                : colors.primary};
    font-weight: ${({ $booked, $doctorMode, $waitlistAvailable, $appointment }) =>
      ($booked && $doctorMode) || $waitlistAvailable || $appointment ? 600 : 400};
    text-decoration: ${({ $booked, $doctorMode, $waitlistAvailable, $appointment }) =>
      $appointment || ($booked && !$doctorMode && !$waitlistAvailable) ? "line-through" : "none"};
  }

  &&:disabled {
    opacity: 1;
    background: ${({ $booked }) => ($booked ? colors.backgroundSoft : colors.surface)};
    color: ${({ $booked }) => ($booked ? "#A6B3B0" : colors.primary)};
  }

  &&:hover:not(:disabled) {
    border-color: ${({ $appointment }) => ($appointment ? colors.border : colors.primary)};
    background-color: ${({ $booked, $doctorMode, $waitlistAvailable, $appointment, $selected }) =>
      $selected
        ? colors.primary
        : $waitlistAvailable
          ? colors.backgroundSoft
          : $appointment
            ? colors.backgroundSoft
            : $doctorMode && $booked
              ? colors.primaryHover
              : undefined};
    color: ${({ $booked, $doctorMode, $waitlistAvailable, $appointment, $selected }) =>
      $selected
        ? colors.surface
        : $waitlistAvailable
          ? colors.primary
          : $appointment
            ? colors.textSecondary
            : $doctorMode && $booked
              ? colors.surface
              : undefined};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

export const NoAvailability = styled(Flex)`
  flex: 1;
  min-height: 188px;
  border-radius: 10px;
  background: ${colors.backgroundSoft};
  color: ${colors.textSecondary};
  font-size: 11px;
  text-align: center;
`;

export const NoAvailabilityDash = styled(Typography.Text)`
  margin-bottom: 4px;
  font-size: 20px;
  font-weight: 400;
`;

export const AvailabilityLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 16px;
  color: ${colors.textSecondary};
  font-size: 10px;
`;

export const LegendItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

export const LegendDot = styled.div<{
  $booked?: boolean;
  $selected?: boolean;
  $doctorAvailable?: boolean;
  $appointment?: boolean;
  $waitlist?: boolean;
}>`
  width: 8px;
  height: 8px;
  border: 1px solid
    ${({ $booked, $selected, $doctorAvailable, $appointment, $waitlist }) =>
      $booked
        ? colors.border
        : $selected || $appointment
          ? "transparent"
          : $waitlist
            ? colors.primary
            : $doctorAvailable
              ? colors.textSecondary
              : colors.teal};
  border-radius: 50%;
  background: ${({ $booked, $selected, $appointment, $waitlist }) =>
    $booked
      ? colors.backgroundSoft
      : $selected
        ? colors.primary
        : $appointment
          ? colors.primary
          : $waitlist
            ? colors.backgroundSoft
            : colors.surface};
`;

export const BookedSlotWrapper = styled.div`
  display: block;
  width: 100%;
`;
