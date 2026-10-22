import { Typography } from "antd";
import styled, { css } from "styled-components";
import { colors } from "@theme/tokens";

const { Text, Title } = Typography;

export const ReasonCard = styled.section`
  min-width: 0;
  padding: 17px 20px 19px;
  border: 1px solid var(--ant-color-border-secondary, ${colors.border});
  border-radius: 14px;
  @media (max-width: 767px) {
    padding: 16px;
  }
`;
export const ReasonHeading = styled.header`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`;
export const ReasonIcon = styled.span<{ $danger?: boolean }>`
  display: inline-flex;
  width: 34px;
  height: 34px;
  min-width: 34px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${colors.background};
  color: ${colors.primary};
  font-size: 16px;
  ${({ $danger }) =>
    $danger &&
    css`
      background: var(--ant-color-error-bg, ${colors.errorSurface});
      color: var(--ant-color-error, ${colors.error});
    `}
`;
export const ReasonTitle = styled(Title)<{ $danger?: boolean }>`
  && {
    margin: 0;
    color: ${({ $danger }) => ($danger ? `var(--ant-color-error, ${colors.error})` : "inherit")};
    font-size: 16px;
    font-weight: 600;
    line-height: 1.4;
  }
`;
export const ReasonValueBox = styled.section<{ $danger?: boolean }>`
  display: flex;
  min-height: 48px;
  align-items: center;
  padding: 12px 15px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: ${colors.background};
  ${({ $danger }) =>
    $danger &&
    css`
      border-color: var(--ant-color-error-border, ${colors.errorBorder});
      background: var(--ant-color-error-bg, ${colors.errorSurface});
    `}
`;
export const ReasonValue = styled(Text)`
  && {
    font-size: 14px;
    line-height: 1.5;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
  }
`;
