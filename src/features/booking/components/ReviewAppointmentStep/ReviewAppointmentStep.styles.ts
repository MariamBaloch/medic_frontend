import { Flex, Typography } from "antd";
import styled from "styled-components";
import { colors } from "@theme/tokens";

export const ReviewStepContent = styled.section`
  display: flex;
  flex-direction: column;
  padding-top: 8px;
`;

export const ReviewHeading = styled.div`
  margin-bottom: 16px;
`;

export const ReviewSection = styled.section`
  padding: 14px 0;

  & + & {
    border-top: 1px solid ${colors.border};
  }
`;

export const ReviewSectionHeader = styled(Flex).attrs({
  justify: "space-between",
  align: "center",
})`
  margin-bottom: 8px;

  .ant-btn {
    height: auto;
    padding: 0;
    font-size: 12px;
  }
`;

export const ReviewSectionTitle = styled(Typography.Text).attrs({ strong: true })`
  color: ${colors.text};
`;

export const ReviewDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 24px;

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const ReviewDetailContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

export const ReviewDetail = styled(Flex).attrs({ gap: 10, align: "flex-start" })`
  min-width: 0;
`;

export const ReviewDetailIcon = styled.span`
  color: ${colors.primary};
  font-size: 15px;
  line-height: 24px;
`;

export const VisitReasonSummary = styled.div`
  border-radius: 8px;
  background: ${colors.backgroundTint};
  padding: 12px;
  white-space: pre-wrap;
`;
