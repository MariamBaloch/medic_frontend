import styled from "styled-components";
import { AppCard } from "@components/Card";
import { breakpoints, colors } from "@theme/tokens";

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

  @media (max-width: ${breakpoints.small}px) {
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

export const SecondSectionGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(300px, 1fr);
  gap: 18px;
  margin-bottom: 18px;

  @media (max-width: ${breakpoints.large}px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const UpcomingAppointmentCard = styled(DashboardCard)`
  .ant-card-body {
    padding: 22px 24px;
  }

  @media (max-width: ${breakpoints.small}px) {
    .ant-card-body {
      padding: 16px;
    }
  }
`;

export const AppointmentDetail = styled.div`
  min-width: 0;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${colors.backgroundSoft};
  border-radius: 10px;
`;

export const RecentVisitRow = styled.div`
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(130px, 0.9fr) minmax(100px, auto) auto;
  align-items: center;
  gap: 12px;
  padding: 13px 0;
  border-bottom: 1px solid ${colors.border};

  > * {
    min-width: 0;
  }

  &:last-child {
    border-bottom: 0;
  }

  @media (max-width: ${breakpoints.medium}px) {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;

    > :nth-child(2) {
      grid-column: 1;
      grid-row: 2;
    }

    > :nth-child(3) {
      grid-column: 1;
      grid-row: 3;
    }

    > :nth-child(4) {
      grid-column: 2;
      grid-row: 1 / span 3;
      align-self: center;
      justify-self: end;
    }
  }

  @media (max-width: 560px) {
    gap: 6px 8px;
  }
`;

export const DashboardActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: ${breakpoints.large}px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;
