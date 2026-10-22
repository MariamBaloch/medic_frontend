import { Typography } from "antd";
import styled from "styled-components";
import { colors } from "@theme/tokens";

const { Paragraph, Text, Title } = Typography;

export const DoctorCard = styled.section`
  min-width: 0;
  padding: 22px 22px 20px;
  border: 1px solid var(--ant-color-border-secondary, ${colors.border});
  border-radius: 14px;
  background: ${colors.background};

  @media (max-width: 767px) {
    padding: 18px 16px;
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
export const DoctorSummaryHeader = styled.div`
  margin-top: 18px;
`;
export const DoctorDetailsList = styled.section`
  display: grid;
  gap: 15px;
  margin-top: 23px;
`;
export const DoctorDetailRow = styled.article`
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  align-items: start;
  gap: 12px;
  min-width: 0;
`;
export const DoctorDetailIcon = styled.span`
  padding-top: 2px;
  color: ${colors.primary};
  font-size: 16px;
  text-align: center;
`;
export const DoctorDetailContent = styled.section`
  min-width: 0;
`;
export const DetailLabel = styled(Text)`
  && {
    display: block;
    margin-bottom: 2px;
    font-size: 13px;
    line-height: 1.4;
  }
`;
export const DetailValue = styled(Text)`
  && {
    display: block;
    font-size: 14px;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }
`;
export const DoctorBio = styled.section`
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid var(--ant-color-border-secondary, ${colors.border});
`;
export const BioHeading = styled.header`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${colors.primary};
  font-size: 15px;
`;
export const BioTitle = styled(Text)`
  && {
    font-size: 14px;
  }
`;
export const BioText = styled(Paragraph)`
  && {
    margin: 9px 0 0 28px;
    font-size: 13px;
    line-height: 1.55;
    white-space: pre-wrap;
  }
`;
