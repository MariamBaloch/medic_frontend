import styled from "styled-components";
import { colors } from "@theme/tokens";

export const AppBrandIconRoot = styled.div<{ $compact: boolean }>`
  width: ${({ $compact }) => ($compact ? "36px" : "42px")};
  height: ${({ $compact }) => ($compact ? "36px" : "42px")};
  flex: 0 0 ${({ $compact }) => ($compact ? "36px" : "42px")};
  border-radius: ${({ $compact }) => ($compact ? "11px" : "14px")};
  display: grid;
  place-items: center;
  color: ${colors.surface};
  background: ${colors.primary};
  box-shadow: 0 18px 36px color-mix(in srgb, ${colors.primary} 24%, transparent);
  font-size: ${({ $compact }) => ($compact ? "19px" : "22px")};
  font-weight: 800;
`;
