import { BellOutlined, CheckOutlined } from "@ant-design/icons";
import { Badge, Button, Empty, Flex, List, Popover, Space, Spin, Tooltip, Typography } from "antd";
import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { notifyApp } from "@services/api/appNotifications";
import { patientWaitlistKeys } from "@features/patient/waitlist/api/waitlistQueries";
import {
  notificationKeys,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useInfiniteNotificationsQuery,
  useUnreadNotificationCountQuery,
} from "@features/notifications/api/notificationQueries";
import type { AppNotification } from "@features/notifications/api/notification.schemas";
import { useNotificationStream } from "@features/notifications/useNotificationStream";
import { colors } from "@theme/tokens";
import {
  NotificationListViewport,
  NotificationPanel,
  NotificationTabs,
} from "./NotificationCenter.styles";

export function NotificationCenter() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const notificationsQuery = useInfiniteNotificationsQuery({ size: 5, unreadOnly });
  const unreadCountQuery = useUnreadNotificationCountQuery();
  const markReadMutation = useMarkNotificationReadMutation();
  const markAllReadMutation = useMarkAllNotificationsReadMutation();
  const showNotification = useCallback(
    (notification: AppNotification) => {
      notifyApp({
        type: "info",
        message: notification.title,
        description: notification.message,
        duration: 10,
      });
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      void queryClient.invalidateQueries({ queryKey: patientWaitlistKeys.all });
    },
    [queryClient],
  );
  useNotificationStream(showNotification);

  const unreadCount = unreadCountQuery.data?.unreadCount ?? 0;
  const notifications = notificationsQuery.data?.pages.flatMap(({ content }) => content) ?? [];

  return (
    <Popover
      classNames={{ root: "appointment-popover" }}
      trigger="click"
      placement="bottomRight"
      open={open}
      onOpenChange={setOpen}
      content={
        <NotificationPanel vertical>
          <Space
            style={{
              width: "100%",
              justifyContent: "space-between",
              padding: "10px 10px 5px 10px",
            }}
          >
            <Typography.Text strong>Notifications</Typography.Text>
            <Button
              type="link"
              size="small"
              disabled={unreadCount === 0 || markAllReadMutation.isPending}
              loading={markAllReadMutation.isPending}
              onClick={() => markAllReadMutation.mutate()}
            >
              Mark all read
            </Button>
          </Space>
          <NotificationTabs
            size="small"
            activeKey={unreadOnly ? "unread" : "all"}
            items={[
              { key: "all", label: "All" },
              { key: "unread", label: "Unread" },
            ]}
            onChange={(key) => {
              setUnreadOnly(key === "unread");
            }}
          />
          <NotificationListViewport vertical>
            {notificationsQuery.isLoading ? (
              <Flex justify="center">
                <Spin />
              </Flex>
            ) : notifications.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No notifications yet" />
            ) : (
              <List
                size="small"
                dataSource={notifications}
                renderItem={(notification) => (
                  <List.Item
                    key={notification.id}
                    style={{
                      background: notification.read ? undefined : colors.backgroundTint,
                      paddingInline: 20,
                    }}
                    actions={
                      notification.read
                        ? undefined
                        : [
                            <Button
                              key="mark-read"
                              type="text"
                              size="small"
                              icon={<CheckOutlined />}
                              aria-label="Mark notification as read"
                              title="Mark as read"
                              loading={
                                markReadMutation.isPending &&
                                markReadMutation.variables === notification.id
                              }
                              onClick={() => markReadMutation.mutate(notification.id)}
                            />,
                          ]
                    }
                  >
                    <List.Item.Meta
                      title={
                        <Typography.Text strong={!notification.read}>
                          {notification.title}
                        </Typography.Text>
                      }
                      description={notification.message}
                    />
                  </List.Item>
                )}
              />
            )}
          </NotificationListViewport>
          {notificationsQuery.hasNextPage && (
            <Button
              block
              style={{ borderRadius: 0 }}
              loading={notificationsQuery.isFetchingNextPage}
              onClick={() => void notificationsQuery.fetchNextPage()}
            >
              Load more
            </Button>
          )}
        </NotificationPanel>
      }
    >
      <Tooltip title="Notifications">
        <Badge count={unreadCount} size="small" offset={[-13, 15]}>
          <Button
            shape="circle"
            type="text"
            aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
            icon={<BellOutlined />}
          />
        </Badge>
      </Tooltip>
    </Popover>
  );
}
