import { DatePicker } from "antd";
import styled from "styled-components";

interface DateInputProps {
  $compact?: boolean;
}

export const DateInput = styled(DatePicker)<DateInputProps>`
  && {
    width: 100%;
    height: ${({ $compact }) => ($compact ? "48px" : "52px")};
    padding: 0 16px;
    border-radius: 14px;
  }
`;
