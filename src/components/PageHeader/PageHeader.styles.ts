import styled from "styled-components";
import { colors } from "@theme/tokens";

export const PageHeaderRoot = styled.header`
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 640px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const PageHeaderContent = styled.div`
  min-width: 0;

  h2 {
    margin: 0;
    color: ${colors.text};
    font-family: "Lora", Georgia, "Times New Roman", serif;
    margin-bottom: 10px !important;
    font-size: clamp(28px, 2.8vw, 32px);
    font-weight: 500;
    letter-spacing: -0.02em;
    line-height: 1.12;
  }

  .ant-typography-secondary {
    margin: 2px 0 0;
    color: ${colors.textSecondary};
    font-size: 13px;
  }
`;

export const PageHeaderActions = styled.div`
  flex: 0 0 auto;

  .ant-btn {
    min-height: 42px;
    border-radius: 11px;
    padding-inline: 18px;
    font-size: 12px;
    font-weight: 700;
  }

  .ant-btn-primary {
    box-shadow: none;
  }

  @media (max-width: 640px) {
    width: 100%;

    .ant-space {
      width: 100%;
    }

    .ant-btn {
      width: 100%;
    }
  }
`;
