import { Layout } from "antd";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { breakpoints, colors } from "@theme/tokens";

export const AppLayout = styled(Layout)`
  flex: 1 1 auto;
  min-width: 0;
  height: 100dvh;
  min-height: 0;
  overflow: hidden;
  background: ${colors.background};
`;

export const AppSider = styled(Layout.Sider)`
  height: 100dvh;
  min-height: 0;
  overflow: visible;
  position: relative;
  background: ${colors.sidebar} !important;

  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .ant-menu {
    flex: 1;
    border-inline-end: 0;
    background: transparent;
  }
`;

export const BrandBlock = styled.div<{ $collapsed: boolean }>`
  min-height: 84px;
  padding: 20px 22px;
  display: flex;
  align-items: center;
  gap: 10px;

  ${({ $collapsed }) =>
    $collapsed &&
    `
      min-height: 96px;
      padding: 8px 0;
      flex-direction: column;
      justify-content: center;
      gap: 25px;
    `}
`;

export const BrandCopy = styled.div<{ $collapsed: boolean }>`
  min-width: 0;
  white-space: nowrap;
  display: ${({ $collapsed }) => ($collapsed ? "none" : "block")};

  && > .ant-typography {
    display: block;
    margin: 0;
    color: ${colors.surface};
  }

  && > .ant-typography-strong {
    font-size: 15px;
    font-weight: 600;
    line-height: 1.2;
  }

  && > .ant-typography + .ant-typography {
    margin-top: 3px;
    color: ${colors.tealLight};
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    line-height: 1.2;
  }
`;

export const BrandLink = styled(Link)`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid ${colors.tealLight};
    outline-offset: 3px;
  }
`;

export const SidebarToggle = styled.button<{ $collapsed: boolean }>`
  flex: 0 0 auto;
  width: 28px;
  height: 28px;
  margin-left: ${({ $collapsed }) => ($collapsed ? "0" : "auto")};
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${colors.surface};
  background: transparent;
  border: 0;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    color: ${colors.tealLight};
    background: ${colors.sidebarActive};
  }

  &:focus-visible {
    outline: 2px solid ${colors.tealLight};
    outline-offset: 2px;
  }
`;

export const AppHeader = styled(Layout.Header)`
  height: 76px;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  line-height: normal;
  background: ${colors.surface};
  border-bottom: 1px solid ${colors.border};

  @media (max-width: ${breakpoints.small}px) {
    padding: 0 16px;
  }
`;

export const PageHeading = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;

  && > .ant-typography:first-child {
    display: block;
    margin: 0 !important;
    color: ${colors.primary};
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.06em;
    line-height: 10px;
    text-transform: uppercase;
  }

  && > .ant-typography:last-child {
    display: block;
    margin: 0 !important;
    color: ${colors.text};
    font-size: 18px;
    line-height: 18px;
    font-weight: 800;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const UserMenuTrigger = styled.button`
  border: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${colors.text};
  background: transparent;
  cursor: pointer;

  .ant-typography {
    font-size: 12px;
  }

  @media (max-width: 560px) {
    .ant-typography {
      display: none;
    }
  }
`;

export const AppContent = styled(Layout.Content)`
  min-height: 0;
  flex: 1 1 auto;
  overflow: auto;
  padding: 28px;
  background: ${colors.background};

  @media (max-width: ${breakpoints.small}px) {
    padding: 18px 14px;
  }
`;

export const AppFooter = styled(Layout.Footer)`
  padding: 14px 28px;
  color: ${colors.textSecondary};
  background: ${colors.background};
  font-size: 12px;

  @media (max-width: ${breakpoints.small}px) {
    padding: 12px 14px;
  }
`;
