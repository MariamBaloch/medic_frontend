import { useMemo, useState } from "react";
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
  AvailabilityDay,
  AvailabilityRule,
  AvailabilityRuleRequest,
} from "@features/doctor/availability/api/availability.schemas";
import {
  useAvailabilityRulesQuery,
  useCreateAvailabilityRuleMutation,
  useDeleteAvailabilityRuleMutation,
  useUpdateAvailabilityRuleMutation,
} from "@features/doctor/availability/api/availabilityQueries";
import { AvailabilityRuleDialog } from "@features/doctor/availability/components/AvailabilityRuleDialog";
import {
  AvailabilityPageRoot,
  AvailabilityTableCard,
  DateRangeHint,
  TableSecondaryText,
} from "./DoctorAvailabilityPage.styles";

const dayLabels: Record<AvailabilityDay, string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun",
};

function displayDate(value: string | null | undefined) {
  if (!value) return "No end date";
  const parsed = dayjs(value, "DD/MM/YYYY", true);
  return parsed.isValid() ? parsed.format("MMM D, YYYY") : value;
}

function showAvailabilitySuccess(message: string, affectedAppointments: unknown[] = []) {
  const appointments = affectedAppointments.filter(
    (appointment): appointment is Record<string, unknown> =>
      typeof appointment === "object" && appointment !== null,
  );

  notifyApp({
    type: "success",
    message,
    description: appointments.length ? (
      <Flex vertical gap={4}>
        <Typography.Text strong>
          Your availability changed, but these appointments were not canceled:
        </Typography.Text>
        {appointments.map((appointment, index) => {
          const patientName =
            typeof appointment.patientName === "string" ? appointment.patientName : "Patient";
          const date =
            typeof appointment.appointmentDate === "string"
              ? displayDate(appointment.appointmentDate)
              : "Date unavailable";
          const startTime = typeof appointment.startTime === "string" ? appointment.startTime : "";
          const endTime = typeof appointment.endTime === "string" ? appointment.endTime : "";
          const time =
            startTime && endTime
              ? formatAppointmentTimeRange(startTime, endTime)
              : "Time unavailable";

          return (
            <Typography.Text key={String(appointment.id ?? index)}>
              {patientName} · {date} · {time}
            </Typography.Text>
          );
        })}
      </Flex>
    ) : undefined,
  });
}

export function DoctorAvailabilityPage() {
  const navigate = useNavigate();
  const rulesQuery = useAvailabilityRulesQuery();
  const createRule = useCreateAvailabilityRuleMutation();
  const updateRule = useUpdateAvailabilityRuleMutation();
  const deleteRule = useDeleteAvailabilityRuleMutation();
  const [editingRule, setEditingRule] = useState<AvailabilityRule | undefined>();
  const [ruleToDelete, setRuleToDelete] = useState<AvailabilityRule | undefined>();
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);

  const openCreateRule = () => {
    setEditingRule(undefined);
    setRuleDialogOpen(true);
  };

  const handleRuleSubmit = async (request: AvailabilityRuleRequest) => {
    if (editingRule) {
      const response = await updateRule.mutateAsync({ id: editingRule.id, request });
      showAvailabilitySuccess("Availability successfully updated", response.affectedAppointments);
    } else {
      await createRule.mutateAsync(request);
      showAvailabilitySuccess("Availability succesfully added");
    }
    setRuleDialogOpen(false);
  };

  const handleDeleteRule = async (ruleId: number) => {
    try {
      const response = await deleteRule.mutateAsync(ruleId);
      showAvailabilitySuccess("Availability rule deleted", response.affectedAppointments);
      return true;
    } catch {
      return false;
    }
  };

  const columns = useMemo<TableColumnsType<AvailabilityRule>>(
    () => [
      {
        title: "Days & hours",
        key: "daysAndHours",
        render: (_, rule) => (
          <Flex vertical>
            <Typography.Text strong>
              {rule.daysOfWeek.map((day) => dayLabels[day]).join(", ")}
            </Typography.Text>
            <TableSecondaryText>
              {formatAppointmentTimeRange(rule.startTime, rule.endTime)}
            </TableSecondaryText>
          </Flex>
        ),
      },
      {
        title: "Date range",
        key: "dateRange",
        render: (_, rule) => (
          <Flex vertical>
            <Typography.Text>
              {displayDate(rule.startDate)} – {displayDate(rule.endDate)}
            </Typography.Text>
            <DateRangeHint>Repeats weekly</DateRangeHint>
          </Flex>
        ),
      },
      {
        title: "Slot length",
        key: "slotLength",
        render: (_, rule) => {
          const slotsPerDay = Math.floor(
            dayjs(`2000-01-01T${rule.endTime}`).diff(
              dayjs(`2000-01-01T${rule.startTime}`),
              "minute",
            ) / rule.slotMinutes,
          );
          return (
            <Flex vertical>
              <Typography.Text>{rule.slotMinutes} minutes</Typography.Text>
              <TableSecondaryText>{slotsPerDay} slots per day</TableSecondaryText>
            </Flex>
          );
        },
      },
      {
        title: "",
        key: "actions",
        align: "right",
        render: (_, rule) => (
          <Space>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingRule(rule);
                setRuleDialogOpen(true);
              }}
            >
              Edit
            </Button>
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => setRuleToDelete(rule)}
            >
              Delete
            </Button>
          </Space>
        ),
      },
    ],
    [deleteRule],
  );

  return (
    <AvailabilityPageRoot>
      <PageHeader
        title="Make room for your patients"
        description="Set recurring hours. Medic turns each rule into bookable appointment slots."
        action={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateRule}>
            Add availability
          </Button>
        }
      />

      <AvailabilityTableCard
        title="Availability"
        extra={<Tag color="green">{rulesQuery.data?.length ?? 0} active</Tag>}
      >
        <DataTable<AvailabilityRule>
          columns={columns}
          dataSource={rulesQuery.data ?? []}
          rowKey="id"
          loading={rulesQuery.isPending || rulesQuery.isFetching}
          withCard={false}
          title={null}
          showClearFilters={false}
        />
      </AvailabilityTableCard>

      <ActionCallout
        title="Need to block a single date?"
        description="Keep your recurring rules in place. Add time off for a meeting, personal leave, or another one-off commitment."
        actionLabel="Manage time off"
        onAction={() => navigate(ROUTES.doctorTimeOff)}
      />

      <AvailabilityRuleDialog
        open={ruleDialogOpen}
        rule={editingRule}
        loading={createRule.isPending || updateRule.isPending}
        onClose={() => setRuleDialogOpen(false)}
        onSubmit={handleRuleSubmit}
      />
      <Modal
        title="Delete availability rule?"
        open={Boolean(ruleToDelete)}
        onCancel={() => setRuleToDelete(undefined)}
        onOk={async () => {
          if (ruleToDelete && (await handleDeleteRule(ruleToDelete.id))) {
            setRuleToDelete(undefined);
          }
        }}
        confirmLoading={deleteRule.isPending}
        okText="Delete rule"
        okButtonProps={{ danger: true }}
        cancelText="Keep rule"
      >
        <Typography.Text>
          This removes the selected availability. Existing appointments will not be canceled.
        </Typography.Text>
      </Modal>
    </AvailabilityPageRoot>
  );
}
