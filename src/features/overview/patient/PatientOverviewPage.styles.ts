import styled from "styled-components";
import { AppCard } from "@components/Card";
import { colors } from "@theme/tokens";
import overviewImage from "@assets/MedicOverview.png";

export const OverviewRoot = styled.div`
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
`;

export const WelcomeCard = styled(AppCard)`
  position: relative;
  isolation: isolate;
  margin-bottom: 20px;
  overflow: hidden;
  border: 0;
  background: linear-gradient(90deg, #e1f2ed 0%, #f1f8f5 100%);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image: url(${overviewImage});
    background-position: right center;
    background-repeat: no-repeat;
    background-size: auto 125%;

    -webkit-mask-image: linear-gradient(
      90deg,
      transparent 45%,
      rgb(0 0 0 / 10%) 55%,
      rgb(0 0 0 / 45%) 66%,
      rgb(0 0 0 / 85%) 78%,
      #000 90%
    );
    mask-image: linear-gradient(
      90deg,
      transparent 45%,
      rgb(0 0 0 / 10%) 55%,
      rgb(0 0 0 / 45%) 66%,
      rgb(0 0 0 / 85%) 78%,
      #000 90%
    );
  }

  .ant-card-body {
    position: relative;
    z-index: 1;
    padding: 30px 34px;
  }

  @media (max-width: 600px) {
    &::before {
      display: none;
    }

    .ant-card-body {
      padding: 24px 20px;
    }
  }
`;

export const DashboardCard = styled(AppCard)`
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
    padding: 0px 6px 0px 20px;
  }
`;

export const SecondSectionGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(300px, 1fr);
  gap: 18px;
  margin-bottom: 18px;

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const UpcomingAppointmentCard = styled(DashboardCard)`
  .ant-card-body {
    padding: 22px 24px;
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
  display: grid;
  grid-template-columns: minmax(180px, 1.35fr) minmax(130px, 0.9fr) minmax(140px, 1fr) auto auto;
  align-items: center;
  gap: 12px;
  padding: 13px 0;
  border-bottom: 1px solid ${colors.border};

  &:last-child {
    border-bottom: 0;
  }

  @media (max-width: 1000px) {
    grid-template-columns: minmax(0, 1fr) minmax(130px, 1fr) auto;

    > :nth-child(3) {
      grid-column: 1;
      grid-row: 2;
    }

    > :nth-child(4) {
      grid-column: 2;
      grid-row: 2;
    }

    > :nth-child(5) {
      grid-column: 3;
      grid-row: 1 / span 2;
    }
  }

  @media (max-width: 560px) {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px;

    > :nth-child(2),
    > :nth-child(3) {
      grid-column: 1;
      grid-row: auto;
    }

    > :nth-child(4) {
      grid-column: 2;
      grid-row: 2;
    }

    > :nth-child(5) {
      grid-column: 2;
      grid-row: 1;
    }
  }
`;

export const DashboardActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const DashboardActionCard = styled(AppCard)`
  background: ${colors.backgroundSoft};

  .ant-card-body {
    height: 100%;
    padding: 20px 22px;
  }
`;

export const DashboardActionIcon = styled.span`
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${colors.primary};
  background: ${colors.backgroundTint};
  border-radius: 11px;
  font-size: 17px;
`;
