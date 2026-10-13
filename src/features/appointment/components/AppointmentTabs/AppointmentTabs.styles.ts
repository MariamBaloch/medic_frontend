import styled from "styled-components";
import { colors } from "@theme/tokens";

export const AppointmentTabLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
`;

export const AppointmentTabCount = styled.span<{ $active?: boolean }>`
  min-width: 20px;
  height: 18px;
  padding: 0 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  color: ${({ $active }) => ($active ? colors.primary : colors.textSecondary)};
  background: ${({ $active }) =>
    $active
      ? `color-mix(in srgb, ${colors.primary} 12%, ${colors.surface})`
      : `color-mix(in srgb, ${colors.textSecondary} 10%, ${colors.surface})`};
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
`;
