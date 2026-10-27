import { Alert } from "antd";
import styled from "styled-components";
import { colors } from "@theme/tokens";

export const ApiAlertRegion = styled.div`
  position: sticky;
  top: 0;
  z-index: 1200;
  margin-bottom: 20px;

  &:empty {
    display: none;
  }
`;

export const StyledApiAlert = styled(Alert)`
  && {
    padding: 14px;
    border: 1px solid ${colors.border};
    border-radius: 8px;
    background: ${colors.background};
    font-size: 13px !important;
  }

  &&[data-alert-type="success"] {
    border-color: ${colors.border};
    background: white;
  }

  &&[data-alert-type="info"] {
    border-color: ${colors.border};
    background: ${colors.backgroundSoft};
  }

  &&[data-alert-type="warning"] {
    border-color: ${colors.warning};
    background: ${colors.backgroundSoft};
  }

  &&[data-alert-type="error"] {
    border-color: ${colors.errorBorder};
    background: ${colors.errorSurface};
  }

  &[data-alert-type="success"] .ant-alert-icon,
  &[data-alert-type="success"] .ant-alert-title {
    color: ${colors.success};
  }

  &[data-alert-type="info"] .ant-alert-icon,
  &[data-alert-type="info"] .ant-alert-title {
    color: ${colors.primary};
  }

  &[data-alert-type="warning"] .ant-alert-icon,
  &[data-alert-type="warning"] .ant-alert-title {
    color: ${colors.warning};
  }

  &[data-alert-type="error"] .ant-alert-icon,
  &[data-alert-type="error"] .ant-alert-title {
    color: ${colors.error};
  }

  .ant-alert-title {
    margin-bottom: 2px !important;
    font-size: 13px !important;
    font-weight: 600;
  }

  .ant-alert-description {
    color: ${colors.textSecondary};
    line-height: 1.5;
    overflow: hidden;
  }
`;
