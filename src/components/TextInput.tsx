import { Input } from "antd";
import styled from "styled-components";

interface TextInputProps {
  $compact?: boolean;
}

export const TextInput = styled(Input)<TextInputProps>`
  && {
    height: ${({ $compact }) => ($compact ? "48px" : "52px")};
    padding: 12px 16px;
    border-radius: 14px;
  }
`;
