import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Modal, Space, Tag, Typography } from "antd";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";
import { ActionCallout } from "@components/ActionCallout";
import { DataTable } from "@components/DataTable/DataTable";
import { PageHeader } from "@components/PageHeader";
import { ROUTES } from "@constants/routes";
import { notifyApp } from "@services/api/appNotifications";
import { formatAppointmentTimeRange } from "@utils/formatters";
import type {
  AvailabilityException,
  AvailabilityExceptionRequest,
} from "@features/doctor/availability/api/availability.schemas";
import {
  useAvailabilityExceptionsQuery,
  useCreateAvailabilityExceptionMutation,
  useDeleteAvailabilityExceptionMutation,
  useUpdateAvailabilityExceptionMutation,
} from "@features/doctor/availability/api/availabilityQueries";
import { TimeOffDateBadge, TimeOffPageRoot, TimeOffTableCard } from "./DoctorTimeOffPage.styles";
import { TimeOffDialog } from "./components/TimeOffDialog";

function getTimeOffSummary(
  request: AvailabilityExceptionRequest,
  affectedAppointments: unknown,
  affectedMessage?: string | null,
): ReactNode {
  const date = dayjs(request.exceptionDate, "DD/MM/YYYY", true);
  const formattedDate = date.isValid() ? date.format("MMMM D, YYYY") : request.exceptionDate;
  const time =
    request.startTime && request.endTime
      ? formatAppointmentTimeRange(request.startTime, request.endTime)
      : "All day";
  const appointments = Array.isArray(affectedAppointments)
    ? affectedAppointments.filter(
        (appointment): appointment is Record<string, unknown> =>
          typeof appointment === "object" && appointment !== null,
      )
    : [];

  return (
    <Flex vertical gap={2}>
      <Typography.Text strong>
        {formattedDate} · {time}
      </Typography.Text>
      <Typography.Text>Reason: {request.reason || "No reason provided"}</Typography.Text>
      {appointments.length ? (
        <>
          <Typography.Text strong>
            {affectedMessage || "Your time off changed, but these appointments were not canceled:"}
          </Typography.Text>
          {appointments.map((appointment, index) => {
            const patientName =
              typeof appointment.patientName === "string" ? appointment.patientName : "Patient";
            const appointmentDate =
              typeof appointment.appointmentDate === "string"
                ? dayjs(appointment.appointmentDate, "DD/MM/YYYY", true).format("MMM D, YYYY")
                : "Date unavailable";
            const startTime =
              typeof appointment.startTime === "string" ? appointment.startTime : "";
            const endTime = typeof appointment.endTime === "string" ? appointment.endTime : "";
            const appointmentTime =
              startTime && endTime
                ? formatAppointmentTimeRange(startTime, endTime)
                : "Time unavailable";

            return (
              <Typography.Text key={String(appointment.id ?? index)}>
                {patientName}: {appointmentDate} at {appointmentTime}
              </Typography.Text>
            );
          })}
        </>
      ) : null}
    </Flex>
  );
}

export function DoctorTimeOffPage() {
  const navigate = useNavigate();
  const exceptionsQuery = useAvailabilityExceptionsQuery();
  const createException = useCreateAvailabilityExceptionMutation();
  const updateException = useUpdateAvailabilityExceptionMutation();
  const deleteException = useDeleteAvailabilityExceptionMutation();
  const [exceptionToDelete, setExceptionToDelete] = useState<AvailabilityException>();
  const [timeOffDialogOpen, setTimeOffDialogOpen] = useState(false);
  const [editingException, setEditingException] = useState<AvailabilityException>();

  const handleExceptionSubmit = async (request: AvailabilityExceptionRequest) => {
    try {
      if (editingException) {
        const response = await updateException.mutateAsync({ id: editingException.id, request });
        notifyApp({
          type: "success",
          message: "Time off updated",
          description: getTimeOffSummary(request, response.affectedAppointments, response.message),
        });
      } else {
        const response = await createException.mutateAsync(request);
        notifyApp({
          type: "success",
          message: "Time off added",
          description: getTimeOffSummary(request, response.affectedAppointments, response.message),
        });
      }
      setTimeOffDialogOpen(false);
      setEditingException(undefined);
    } catch {
      notifyApp({ type: "error", message: "Could not save time off" });
    }
  };

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
              onClick={() => {
                setEditingException(exception);
                setTimeOffDialogOpen(true);
              }}
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
            onClick={() => {
              setEditingException(undefined);
              setTimeOffDialogOpen(true);
            }}
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

      <TimeOffDialog
        open={timeOffDialogOpen}
        exception={editingException}
        loading={createException.isPending || updateException.isPending}
        onClose={() => {
          setTimeOffDialogOpen(false);
          setEditingException(undefined);
        }}
        onSubmit={handleExceptionSubmit}
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
