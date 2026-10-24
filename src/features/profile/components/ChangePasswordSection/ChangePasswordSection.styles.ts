import styled from "styled-components";
import { AppCard } from "@components/Card";
import { colors } from "@theme/tokens";

export const SecurityCard = styled(AppCard)`
  overflow: hidden;
  border: 1px solid ${colors.teal} !important;
  border-left: 4px solid ${colors.primary} !important;
  background: ${colors.backgroundTint};
  box-shadow: 0 4px 16px rgb(23 107 91 / 8%);

  .ant-card-head {
    min-height: 56px;
    background: ${colors.backgroundTint};
    border-bottom-color: ${colors.border};
  }

  .ant-card-head-title {
    color: ${colors.primary};
    font-weight: 700;
  }

  .ant-card-body {
    background: ${colors.surface};
  }
`;
