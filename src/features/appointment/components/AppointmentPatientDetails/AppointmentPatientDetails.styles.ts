import { Typography } from "antd";
import styled from "styled-components";
import { colors } from "@theme/tokens";

const { Text, Title } = Typography;

export const PatientCard = styled.section`
  min-width: 0;
  padding: 22px 22px 20px;
  border: 1px solid var(--ant-color-border-secondary, ${colors.border});
  border-radius: 14px;
  background: ${colors.background};

  @media (max-width: 767px) {
    padding: 18px 16px;
  }
`;

export const PatientSectionTitle = styled(Title)`
  && {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.35;
  }
`;

export const PatientSummaryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  margin-top: 18px;
`;

export const PatientDetailsList = styled.section`
  display: grid;
  gap: 15px;
  margin-top: 23px;
`;

export const PatientDetailRow = styled.article`
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  align-items: start;
  gap: 12px;
  min-width: 0;
`;

export const PatientDetailIcon = styled.span`
  padding-top: 2px;
  color: ${colors.primary};
  font-size: 16px;
  text-align: center;
`;

export const PatientDetailContent = styled.section`
  min-width: 0;
`;

export const PatientDetailLabel = styled(Text)`
  && {
    display: block;
    margin-bottom: 2px;
    font-size: 13px;
    line-height: 1.4;
  }
`;

export const PatientDetailValue = styled(Text)`
  && {
    display: block;
    font-size: 14px;
    line-height: 1.5;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
  }
`;
