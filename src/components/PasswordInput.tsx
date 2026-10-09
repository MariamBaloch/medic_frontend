import { Input } from "antd";
import styled from "styled-components";

interface PasswordInputProps {
  $compact?: boolean;
}

export const PasswordInput = styled(Input.Password)<PasswordInputProps>`
  && {
    height: ${({ $compact }) => ($compact ? "48px" : "52px")};
    padding: 0 16px;
    border-radius: 14px;
  }

  && input {
    min-height: 0;
    padding: 0;
  }
`;
