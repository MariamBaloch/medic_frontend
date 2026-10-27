import styled from "styled-components";
import { colors } from "@theme/tokens";

export const AppointmentStatusStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;

  .ant-typography {
    color: ${colors.success};
    font-size: 10px;
  }
`;
