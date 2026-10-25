import styled from "styled-components";
import { colors } from "@theme/tokens";

export const PageHeaderRoot = styled.header<{ $stacked: boolean }>`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({ $stacked }) =>
    $stacked &&
    `
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    `}

  @media (max-width: 640px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const PageHeaderLeading = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
`;

export const PageHeaderIcon = styled.span`
  display: inline-flex;
  width: 60px;
  height: 60px;
  min-width: 60px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${colors.background};
  color: ${colors.primary};
  font-size: 25px;

  @media (max-width: 767px) {
    width: 46px;
    height: 46px;
    min-width: 46px;
    font-size: 20px;
  }
`;

export const PageHeaderContent = styled.div`
  min-width: 0;

  h2 {
    color: ${colors.text};
    font-family: "Lora", Georgia, "Times New Roman", serif;
    margin-bottom: 0px !important;
    font-weight: 500;
  }

  .ant-typography-secondary {
    margin: 2px 0 0;
    color: ${colors.textSecondary};
    font-size: 13px;
  }
`;

export const PageHeaderEyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: ${colors.primary};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
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
