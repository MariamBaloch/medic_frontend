import styled from "styled-components";
import { AppCard } from "@components/Card";
import { colors } from "@theme/tokens";

export const OverviewSectionsGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(280px, 1fr);
  gap: 18px;
  margin-bottom: 18px;

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const DashboardCard = styled(AppCard)`
  min-width: 0;
  height: 100%;

  .ant-card-head {
    border-bottom: 0;
    padding-bottom: 4px;
  }
  .ant-card-head-title {
    font-size: 18px;
    font-weight: 600;
  }
  .ant-card-body {
    padding: 0 20px 18px;
  }

  @media (max-width: 600px) {
    .ant-card-head-wrapper {
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 4px 8px;
    }

    .ant-card-head-title {
      white-space: normal;
    }

    .ant-card-extra {
      margin-inline-start: 0;
      padding: 0 0 4px;
    }

    .ant-card-body {
      padding: 0 14px 14px;
    }
  }
`;

export const OpenSlotsCard = styled(DashboardCard)`
  .ant-card-head {
    padding-bottom: 18px;
  }
`;

export const TodayAppointmentRow = styled.div`
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(145px, 1fr) minmax(125px, 1fr) minmax(120px, 0.9fr) auto;
  align-items: center;
  gap: 12px;
  padding: 13px 0;
  border-bottom: 1px solid ${colors.border};

  &:last-child {
    border-bottom: 0;
  }

  > * {
    min-width: 0;
  }

  @media (max-width: 1000px) {
    grid-template-columns: minmax(0, 0.8fr) minmax(125px, 1fr) auto;

    > :nth-child(3) {
      grid-column: 1;
      grid-row: 2;
    }
    > :nth-child(4) {
      grid-column: 3;
      grid-row: 1 / span 2;
    }
  }

  @media (max-width: 560px) {
    grid-template-columns: minmax(0, 1fr) auto;
    > :nth-child(2),
    > :nth-child(3) {
      grid-column: 1;
      grid-row: auto;
    }
    > :nth-child(4) {
      grid-column: 2;
      grid-row: 1 / span 3;
    }
  }
`;

export const OpenSlotRow = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: 38px;
  gap: 10px;
  margin-bottom: 10px;
  padding: 0 14px;
  color: ${colors.primary};
  background: #e4f0ed;
  border-radius: 8px;

  &::before {
    content: "";
    flex: 0 0 7px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${colors.primary};
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const OpenSlotTime = styled.span`
  min-width: 0;
  color: ${colors.primary};
  font-size: 13px;
  font-weight: 500;
`;

export const OpenSlotDuration = styled.span`
  margin-left: auto;
  color: ${colors.textSecondary};
  font-size: 12px;
  white-space: nowrap;
`;

export const DashboardActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;
