import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Flex, message, Modal, Space, Tag, Typography } from "antd";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";
import { ActionCallout } from "@components/ActionCallout";
import { DataTable } from "@components/DataTable/DataTable";
import { PageHeader } from "@components/PageHeader";
import { ROUTES } from "@constants/routes";
import { notifyApp } from "@services/api/appNotifications";
import { formatAppointmentTimeRange } from "@utils/formatters";
import type { AvailabilityException } from "@features/doctor/availability/api/availability.schemas";
import {
  useAvailabilityExceptionsQuery,
  useDeleteAvailabilityExceptionMutation,
} from "@features/doctor/availability/api/availabilityQueries";
import { TimeOffDateBadge, TimeOffPageRoot, TimeOffTableCard } from "./DoctorTimeOffPage.styles";

export function DoctorTimeOffPage() {
  const navigate = useNavigate();
  const exceptionsQuery = useAvailabilityExceptionsQuery();
  const deleteException = useDeleteAvailabilityExceptionMutation();
  const [exceptionToDelete, setExceptionToDelete] = useState<AvailabilityException>();

  const handleDelete = useCallback(
    async (exceptionId: number) => {
      try {
        await deleteException.mutateAsync(exceptionId);
        notifyApp({ type: "success", message: "Time off deleted" });
        return true;
      } catch {
        notifyApp({ type: "error", message: "Could not delete time off" });
        return false;
      }
    },
    [deleteException.mutateAsync],
  );

  const columns = useMemo<TableColumnsType<AvailabilityException>>(
    () => [
      {
        title: "Date & time",
        key: "dateTime",
        render: (_, exception) => {
          const parsedDate = dayjs(exception.exceptionDate, "DD/MM/YYYY", true);
          const isAllDay = !exception.startTime || !exception.endTime;
          const time =
            exception.startTime && exception.endTime
              ? formatAppointmentTimeRange(exception.startTime, exception.endTime)
              : "All day";

          return (
            <Flex align="center" gap={12}>
              <TimeOffDateBadge>
                <Typography.Text type="secondary" style={{ fontSize: 9, lineHeight: 1.2 }}>
                  {parsedDate.isValid() ? parsedDate.format("ddd") : "—"}
                </Typography.Text>
                <Typography.Text strong style={{ fontSize: 16, lineHeight: 1.2 }}>
                  {parsedDate.isValid() ? parsedDate.format("DD") : "—"}
                </Typography.Text>
              </TimeOffDateBadge>
              <Flex vertical gap={2}>
                <Space size={8} wrap>
                  <Typography.Text strong>
                    {parsedDate.isValid()
                      ? parsedDate.format("MMMM D, YYYY")
                      : exception.exceptionDate}
                  </Typography.Text>
                  <Tag color={isAllDay ? "orange" : "blue"}>
                    {isAllDay ? "All day" : "Specific time"}
                  </Tag>
                </Space>
                <Typography.Text type="secondary">{time}</Typography.Text>
              </Flex>
            </Flex>
          );
        },
      },
      {
        title: "Reason",
        dataIndex: "reason",
        key: "reason",
        render: (reason: string | null | undefined) => reason || "—",
      },
      {
        title: "",
        key: "actions",
        align: "right",
        render: (_, exception) => (
          <Space>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => message.info("Editing time off will be available soon.")}
            >
              Edit
            </Button>
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              loading={deleteException.isPending}
              onClick={() => setExceptionToDelete(exception)}
            >
              Delete
            </Button>
          </Space>
        ),
      },
    ],
    [deleteException.isPending, handleDelete],
  );

  return (
    <TimeOffPageRoot>
      <PageHeader
        title="Protect time outside your practice"
        description="Manage one-off blocks without changing your recurring availability."
        action={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => message.info("Adding time off will be available soon.")}
          >
            Add time off
          </Button>
        }
      />

      <TimeOffTableCard title="Time off">
        <DataTable<AvailabilityException>
          columns={columns}
          dataSource={exceptionsQuery.data ?? []}
          rowKey="id"
          loading={exceptionsQuery.isPending || exceptionsQuery.isFetching}
          withCard={false}
          title={null}
          showClearFilters={false}
        />
      </TimeOffTableCard>

      <ActionCallout
        title="Recurring hours and one-off changes"
        description="Time off takes precedence over your recurring hours for that date. To change your regular weekly schedule instead, update an availability rule."
        actionLabel="Manage availability"
        onAction={() => navigate(ROUTES.doctorAvailability)}
      />

      <Modal
        title="Delete time off?"
        open={Boolean(exceptionToDelete)}
        onCancel={() => setExceptionToDelete(undefined)}
        onOk={async () => {
          if (exceptionToDelete && (await handleDelete(exceptionToDelete.id))) {
            setExceptionToDelete(undefined);
          }
        }}
        confirmLoading={deleteException.isPending}
        okText="Delete time off"
        okButtonProps={{ danger: true }}
        cancelText="Keep time off"
      >
        <Typography.Text>
          This will make the selected time available for appointments again.
        </Typography.Text>
      </Modal>
    </TimeOffPageRoot>
  );
}
