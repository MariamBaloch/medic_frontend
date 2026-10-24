import styled from "styled-components";
import { AppCard } from "@components/Card";

export const ScheduleCalendar = styled(AppCard)`
  min-width: 0;

  .ant-card-body {
    padding: 18px 20px;
  }

  @media (max-width: 600px) {
    .ant-card-body {
      padding: 14px 12px;
    }
  }
`;
