import { Form } from "antd";
import styled from "styled-components";
import { colors } from "@theme/tokens";

interface FormFieldProps {
  $fullWidth?: boolean;
  $compact?: boolean;
}

export const FormField = styled(Form.Item).attrs({ layout: "vertical" })<FormFieldProps>`
  && {
    margin-bottom: ${({ $compact }) => ($compact ? "10px" : "24px")};
    grid-column: ${({ $fullWidth }) => ($fullWidth ? "1 / -1" : "auto")};
  }

  .ant-form-item-label {
    padding-bottom: ${({ $compact }) => ($compact ? "3px" : "8px")};
  }

  .ant-form-item-label > label {
    height: auto;
    color: ${colors.text};
    font-size: 13px;
    font-weight: 800;
  }
`;
