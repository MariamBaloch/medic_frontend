import styled from "styled-components";
import { colors, statusColors } from "@theme/tokens";

export type StatusPillTone = "success" | "completed" | "warning" | "error" | "neutral";

const toneColor: Record<StatusPillTone, string> = {
  success: statusColors.success,
  completed: statusColors.completed,
  warning: statusColors.warning,
  error: statusColors.error,
  neutral: statusColors.neutral,
};

export const StyledStatusPill = styled.span<{
  $tone: StatusPillTone;
  $textColor?: string;
}>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: 999px;
  color: ${({ $tone, $textColor }) => $textColor ?? toneColor[$tone]};
  background: ${({ $tone }) => `color-mix(in srgb, ${toneColor[$tone]} 12%, ${colors.surface})`};
  font-size: 10px;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;

  &::before {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${({ $tone }) => toneColor[$tone]};
    content: "";
  }
`;
