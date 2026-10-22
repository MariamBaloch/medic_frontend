import { Flex } from "antd";
import styled from "styled-components";
import { colors } from "@theme/tokens";

export const ReasonSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding-top: 8px;
`;

export const ReasonHeading = styled.div``;

export const ReasonField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  .ant-input {
    border-color: ${colors.primary};
    border-radius: 9px;
    color: ${colors.text};
    padding: 14px;
    resize: vertical;

    &:hover,
    &:focus {
      border-color: ${colors.primary};
    }
  }
`;

export const ReasonFieldHeader = styled(Flex)`
  min-height: 20px;
`;

export const ReasonLabel = styled.label`
  color: ${colors.text};
  font-weight: 600;
`;

export const RequiredLabel = styled.span`
  color: ${colors.error};
`;

export const ReasonFooter = styled(Flex)`
  font-size: 11px;
  line-height: 1.4;
`;

export const PrivacyNote = styled(Flex)`
  border-top: 1px solid ${colors.border};
  color: ${colors.textSecondary};
  padding-top: 20px;

  .anticon {
    color: ${colors.primary};
    font-size: 16px;
  }
`;
