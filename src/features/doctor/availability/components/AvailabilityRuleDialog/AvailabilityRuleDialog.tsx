import { useEffect } from "react";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Flex,
  Form,
  Modal,
  Radio,
  TimePicker,
  Typography,
} from "antd";
import dayjs, { type Dayjs } from "dayjs";
import type {
  AvailabilityDay,
  AvailabilityRule,
  AvailabilityRuleRequest,
} from "@features/doctor/availability/api/availability.schemas";
import {
  DateFields,
  RadioMark,
  RuleDialogContent,
  RuleDialogHeader,
  RuleHelpText,
  SlotChoice,
  SlotChoiceGrid,
  WeekdayButton,
  WeekdayGrid,
} from "./AvailabilityRuleDialog.styles";

interface RuleFormValues {
  daysOfWeek: AvailabilityDay[];
  dateRange: [Dayjs, Dayjs];
  startTime: Dayjs;
  endTime: Dayjs;
  slotMinutes: number;
}

interface AvailabilityRuleDialogProps {
  open: boolean;
  rule?: AvailabilityRule;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (request: AvailabilityRuleRequest) => Promise<void>;
}

const dayOptions: { label: string; short: string; value: AvailabilityDay }[] = [
  { label: "Sunday", short: "Sun", value: "SUNDAY" },
  { label: "Monday", short: "Mon", value: "MONDAY" },
  { label: "Tuesday", short: "Tue", value: "TUESDAY" },
  { label: "Wednesday", short: "Wed", value: "WEDNESDAY" },
  { label: "Thursday", short: "Thu", value: "THURSDAY" },
  { label: "Friday", short: "Fri", value: "FRIDAY" },
  { label: "Saturday", short: "Sat", value: "SATURDAY" },
];

function parseDate(value: string | null | undefined) {
  if (!value) return null;
  const parsed = dayjs(value, "DD/MM/YYYY", true);
  return parsed.isValid() ? parsed : null;
}

function formatSelectedDays(days: AvailabilityDay[]) {
  const selected = dayOptions.filter(({ value }) => days.includes(value)).map(({ label }) => label);
  if (!selected.length) return "Choose at least one weekday.";
  return `Every ${selected.join(" and ")}`;
}

function getMinutes(time: Dayjs | undefined) {
  return time ? time.hour() * 60 + time.minute() : 0;
}

export function AvailabilityRuleDialog({
  open,
  rule,
  loading = false,
  onClose,
  onSubmit,
}: AvailabilityRuleDialogProps) {
  const [form] = Form.useForm<RuleFormValues>();
  const selectedDays = Form.useWatch("daysOfWeek", form) ?? [];
  const startTime = Form.useWatch("startTime", form);
  const endTime = Form.useWatch("endTime", form);
  const slotMinutes = Form.useWatch("slotMinutes", form) ?? 30;

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue(
      rule
        ? {
            daysOfWeek: rule.daysOfWeek,
            dateRange: [
              parseDate(rule.startDate) ?? dayjs(),
              parseDate(rule.endDate) ?? dayjs().endOf("year"),
            ],
            startTime: dayjs(rule.startTime, "HH:mm"),
            endTime: dayjs(rule.endTime, "HH:mm"),
            slotMinutes: rule.slotMinutes,
          }
        : {
            daysOfWeek: ["TUESDAY", "THURSDAY"],
            dateRange: [dayjs(), dayjs().endOf("year")],
            startTime: dayjs("14:00", "HH:mm"),
            endTime: dayjs("16:00", "HH:mm"),
            slotMinutes: 30,
          },
    );
  }, [form, open, rule]);

  const duration = getMinutes(endTime) - getMinutes(startTime);
  const slotsPerDay = duration > 0 ? Math.floor(duration / slotMinutes) : 0;
  const slotsPerWeek = slotsPerDay * selectedDays.length;

  const submit = async (values: RuleFormValues) => {
    await onSubmit({
      daysOfWeek: values.daysOfWeek,
      startTime: values.startTime.format("HH:mm"),
      endTime: values.endTime.format("HH:mm"),
      slotMinutes: values.slotMinutes,
      startDate: values.dateRange[0].format("DD/MM/YYYY"),
      endDate: values.dateRange[1].format("DD/MM/YYYY"),
    });
    form.resetFields();
  };

  const toggleDay = (day: AvailabilityDay) => {
    const updatedDays = selectedDays.includes(day)
      ? selectedDays.filter((selectedDay) => selectedDay !== day)
      : [...selectedDays, day];
    form.setFieldValue("daysOfWeek", updatedDays);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={620}
      destroyOnHidden
      styles={{ body: { padding: "16px 14px 12px" } }}
      title={null}
    >
      <RuleDialogContent>
        <RuleDialogHeader>
          <Typography.Title level={5} style={{ margin: "0 0 5px" }}>
            {rule ? "Edit availability" : "Add availability"}
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Choose the dates, weekdays and hours when patients can book with you.
          </Typography.Text>
        </RuleDialogHeader>

        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => void submit(values).catch(() => undefined)}
          requiredMark={false}
        >
          <Form.Item
            name="daysOfWeek"
            hidden
            rules={[{ required: true, message: "Choose at least one weekday." }]}
          >
            <Checkbox.Group options={dayOptions.map(({ label, value }) => ({ label, value }))} />
          </Form.Item>
          <Form.Item name="slotMinutes" hidden rules={[{ required: true }]}>
            <Radio.Group
              options={[15, 30].map((value) => ({ label: `${value} minutes`, value }))}
            />
          </Form.Item>
          <Form.Item
            name="dateRange"
            label="Date range"
            rules={[{ required: true, message: "Choose a date range." }]}
          >
            <DatePicker.RangePicker
              format="MMM D, YYYY"
              suffixIcon={<CalendarOutlined />}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <div style={{ marginTop: 20 }}>
            <WeekdayGrid>
              {dayOptions.map((day) => (
                <WeekdayButton
                  key={day.value}
                  type="button"
                  aria-label={day.label}
                  aria-pressed={selectedDays.includes(day.value)}
                  $selected={selectedDays.includes(day.value)}
                  onClick={() => toggleDay(day.value)}
                >
                  {day.short}
                </WeekdayButton>
              ))}
            </WeekdayGrid>
          </div>
          <RuleHelpText>{formatSelectedDays(selectedDays)}</RuleHelpText>

          <Divider style={{ margin: "20px 0 16px" }} />
          <Typography.Text strong style={{ display: "block", marginBottom: 6, fontSize: 12 }}>
            Consultation hours
          </Typography.Text>
          <DateFields>
            <Form.Item name="startTime" label="Start time" rules={[{ required: true }]}>
              <TimePicker
                format="h:mm A"
                suffixIcon={<ClockCircleOutlined />}
                minuteStep={15}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item name="endTime" label="End time" rules={[{ required: true }]}>
              <TimePicker
                format="h:mm A"
                suffixIcon={<ClockCircleOutlined />}
                minuteStep={15}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </DateFields>

          <Typography.Text style={{ display: "block", marginBottom: 7, fontSize: 12 }}>
            Appointment slot length
          </Typography.Text>
          <SlotChoiceGrid>
            {[15, 30].map((minutes) => (
              <SlotChoice
                key={minutes}
                type="button"
                aria-pressed={slotMinutes === minutes}
                $selected={slotMinutes === minutes}
                onClick={() => form.setFieldValue("slotMinutes", minutes)}
              >
                <RadioMark $selected={slotMinutes === minutes} />
                <Typography.Text style={{ fontSize: 12 }}>{minutes} minutes</Typography.Text>
              </SlotChoice>
            ))}
          </SlotChoiceGrid>
          <RuleHelpText>
            {slotsPerDay} appointment slots per day · {slotsPerWeek} slots in a full week
          </RuleHelpText>

          <Divider style={{ margin: "20px 0 16px" }} />
          <Flex align="center" justify="space-between" gap={16} wrap="wrap">
            {rule ? (
              <Typography.Text type="secondary" style={{ maxWidth: 340, fontSize: 11 }}>
                Editing your availability does not cancel or change existing appointments.
              </Typography.Text>
            ) : (
              <span />
            )}
            <Button type="primary" htmlType="submit" loading={loading}>
              {rule ? "Save changes" : "Create rule"}
            </Button>
          </Flex>
        </Form>
      </RuleDialogContent>
    </Modal>
  );
}
