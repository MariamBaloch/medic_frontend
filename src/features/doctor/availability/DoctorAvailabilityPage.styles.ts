import styled from "styled-components";
import { AppCard } from "@components/Card";
import { breakpoints, colors } from "@theme/tokens";

export const AvailabilityPageRoot = styled.div`
  width: 100%;
  min-height: calc(100dvh - 132px);
  margin: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 18px;

  @media (max-width: ${breakpoints.small}px) {
    min-height: calc(100dvh - 112px);
  }
`;

export const AvailabilityTableCard = styled(AppCard)`
  overflow: hidden;

  .ant-card-body {
    padding: 0;
  }

  .ant-table-wrapper {
    padding: 0 16px 12px;
  }

  .ant-card-head {
    border-bottom: 0;
    padding-inline: 20px;
  }

  .ant-card-head-title {
    font-size: 18px;
    font-weight: 600;
  }
`;

export const DateRangeHint = styled.span`
  display: block;
  margin-top: 3px;
  color: ${colors.textSecondary};
  font-size: 12px;
`;

export const TableSecondaryText = styled.span`
  color: ${colors.textSecondary};
  font-size: 12px;
`;
