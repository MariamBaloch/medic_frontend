import { Select } from "antd";
import styled from "styled-components";
import { colors } from "../theme/tokens";

interface SelectInputProps {
  $compact?: boolean;
}

export const SelectInput = styled(Select)<SelectInputProps>`
  && {
    height: ${({ $compact }) => ($compact ? "48px" : "52px")};
    min-height: ${({ $compact }) => ($compact ? "48px" : "52px")};
    border: 1px solid ${colors.border};
    border-radius: 14px;
    background: ${colors.surface};
    display: flex;
    align-items: center;
    transition:
      border-color 160ms ease,
      box-shadow 160ms ease;
  }

  &&:hover {
    border-color: ${colors.primary};
  }

  &&:focus-within {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 4px rgba(23, 107, 91, 0.12);
  }
`;
