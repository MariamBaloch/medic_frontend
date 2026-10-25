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
    -webkit-mask-image: linear-gradient(90deg, transparent 45%, rgb(0 0 0 / 10%) 55%, rgb(0 0 0 / 45%) 66%, rgb(0 0 0 / 85%) 78%, #000 90%);
    mask-image: linear-gradient(90deg, transparent 45%, rgb(0 0 0 / 10%) 55%, rgb(0 0 0 / 45%) 66%, rgb(0 0 0 / 85%) 78%, #000 90%);
  }

  .ant-card-body {
    position: relative;
    z-index: 1;
    padding: 30px 34px;
  }

  @media (max-width: 600px) {
    &::before { display: none; }
    .ant-card-body { padding: 24px 20px; }
  }
`;

export const DashboardActionCard = styled(AppCard)`
  height: 100%;
  background: ${colors.backgroundSoft};

  .ant-card-body { height: 100%; padding: 20px 22px; }
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
