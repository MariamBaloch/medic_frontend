import { Typography } from "antd";
import styled from "styled-components";
import { colors } from "@theme/tokens";

const { Text, Title } = Typography;

export const AppointmentInformationCard = styled.section`
  min-width: 0;
  padding: 20px 22px 10px;
  border: 1px solid var(--ant-color-border-secondary, ${colors.border});
  border-radius: 14px;
  background: var(--ant-color-bg-container, ${colors.surface});
  @media (max-width: 767px) {
    padding: 18px 16px 8px;
  }
`;
export const AppointmentInformationHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
  @media (max-width: 480px) {
    flex-wrap: wrap;
  }
`;
export const SectionTitle = styled(Title)`
  && {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.35;
  }
`;
export const StatusContainer = styled.section`
  display: flex;
  flex-shrink: 0;
  align-items: flex-start;
  justify-content: flex-end;
  max-width: 45%;
  @media (max-width: 480px) {
    max-width: 100%;
  }
`;
export const AppointmentDetailRows = styled.section``;
export const AppointmentDetailRowContainer = styled.article<{ $last?: boolean }>`
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  align-items: start;
  gap: 12px;
  min-width: 0;
  padding: 12px 0;
  border-bottom: 1px solid var(--ant-color-border-secondary, ${colors.border});
  ${({ $last }) => $last && "border-bottom: none;"}
`;
export const AppointmentDetailIcon = styled.span`
  padding-top: 2px;
  color: var(--ant-color-primary, ${colors.primary});
  font-size: 17px;
  text-align: center;
`;
export const AppointmentDetailContent = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(120px, 1.1fr);
  align-items: start;
  gap: 12px;
  min-width: 0;
  @media (max-width: 480px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 4px;
  }
`;
export const AppointmentDetailLabel = styled(Text)`
  && {
    font-size: 14px;
    line-height: 1.5;
  }
`;
export const AppointmentDetailValue = styled(Text)`
  && {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }
`;
