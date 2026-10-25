import { Flex, Popover, Tabs } from "antd";
import styled from "styled-components";

export const NotificationPanel = styled(Flex)`
  width: 400px;
  max-width: calc(100vw - 48px);
`;

export const NotificationListViewport = styled(Flex)`
  max-height: 360px;
  overflow-y: auto;
`;

export const NotificationTabs = styled(Tabs)`
  .ant-tabs-nav-list {
    width: 100%;
  }

  .ant-tabs-tab {
    flex: 1;
    justify-content: center;
    margin-inline: 0;
  }
  .ant-tabs-nav {
    margin-bottom: 0px !important;
  }
`;
