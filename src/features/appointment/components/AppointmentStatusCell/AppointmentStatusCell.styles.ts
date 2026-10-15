import styled from "styled-components";
import type { AppointmentStatus } from "@features/appointment/api/appointment.schemas";
import { colors } from "@theme/tokens";

const statusColor = (status: AppointmentStatus) => {
  switch (status) {
    case "BOOKED":
      return colors.success;
    case "COMPLETED":
      return colors.completed;
    case "NO_SHOW":
      return colors.warning;
    case "CANCELLED":
      return colors.error;
  }
};

const statusBackground = (status: AppointmentStatus) =>
  `color-mix(in srgb, ${statusColor(status)} 12%, ${colors.surface})`;

export const AppointmentStatusPill = styled.span<{ $status: AppointmentStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  color: ${({ $status }) => ($status === "NO_SHOW" ? colors.text : statusColor($status))};
  background: ${({ $status }) => statusBackground($status)};
  font-size: 11px;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;

  &::before {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ $status }) => statusColor($status)};
    content: "";
  }
`;

export const AppointmentStatusStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;

  .ant-typography {
    color: ${colors.success};
    font-size: 10px;
  }
`;
