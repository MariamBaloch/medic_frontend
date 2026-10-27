import styled from "styled-components";
import { colors } from "@theme/tokens";

export const WaitlistStatusSubtext = styled.span`
  color: ${colors.textSecondary};
  font-size: 12px;
  line-height: 1.3;
`;

export const WaitlistStatusCountdown = styled.span<{ $urgent?: boolean }>`
  color: ${({ $urgent }) => ($urgent ? colors.primary : colors.textSecondary)};
  font-size: 12px;
  font-weight: ${({ $urgent }) => ($urgent ? 600 : 400)};
  line-height: 1.3;
`;
