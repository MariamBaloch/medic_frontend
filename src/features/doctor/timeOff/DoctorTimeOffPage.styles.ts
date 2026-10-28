import styled from "styled-components";
import { AppCard } from "@components/Card";
import { breakpoints, colors } from "@theme/tokens";

export const TimeOffPageRoot = styled.div`
  width: 100%;
  min-height: calc(100dvh - 132px);
  display: flex;
  flex-direction: column;
  gap: 18px;

  @media (max-width: ${breakpoints.small}px) {
    min-height: calc(100dvh - 112px);
  }
`;

export const TimeOffTableCard = styled(AppCard)`
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

export const TimeOffDateBadge = styled.div`
  display: flex;
  width: 44px;
  height: 48px;
  flex: 0 0 44px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: ${colors.background};
`;
