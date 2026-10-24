import { Card } from "antd";
import styled from "styled-components";
import { colors } from "@theme/tokens";

export const AppCard = styled(Card)`
  border: 1px solid ${colors.border};
  border-radius: 18px;

  .ant-card-head {
    min-height: auto;
    padding-block: 16px;
  }

  .ant-card-body {
    padding: 15px 25px;
  }
`;
