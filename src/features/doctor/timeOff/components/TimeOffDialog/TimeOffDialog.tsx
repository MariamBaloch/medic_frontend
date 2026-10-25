import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  Row,
  TimePicker,
  Typography,
} from "antd";
import dayjs, { type Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect } from "react";
import type {
  AvailabilityException,
  AvailabilityExceptionRequest,
} from "@features/doctor/availability/api/availability.schemas";
import { RadioButtonGroup } from "@components/RadioButtonGroup";

dayjs.extend(customParseFormat);

interface TimeOffFormValues {
  date: Dayjs;
  allDay: boolean;
  startTime?: Dayjs;
  endTime?: Dayjs;
  reason?: string;
}

interface TimeOffDialogProps {
  open: boolean;
  exception?: AvailabilityException;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (request: AvailabilityExceptionRequest) => Promise<void>;
}

function parseDate(value: string | undefined) {
  if (!value) return null;
  const parsed = dayjs(value, "DD/MM/YYYY", true);
  return parsed.isValid() ? parsed : null;
}

function parseTime(value: string | null | undefined, fallback: string) {
  return dayjs(value ?? fallback, "HH:mm");
}

export function TimeOffDialog({
  open,
  exception,
  loading = false,
  onClose,
  onSubmit,
}: TimeOffDialogProps) {
  const [form] = Form.useForm<TimeOffFormValues>();
  const allDay = Form.useWatch("allDay", form) ?? false;
  const selectedDate = Form.useWatch("date", form);

  useEffect(() => {
    if (!open) return;

    const hasSpecificHours = Boolean(exception?.startTime && exception?.endTime);
    form.setFieldsValue({
      date: parseDate(exception?.exceptionDate) ?? dayjs(),
      allDay: !hasSpecificHours,
      startTime: parseTime(exception?.startTime, "09:00"),
      endTime: parseTime(exception?.endTime, "10:30"),
      reason: exception?.reason ?? "",
    });
  }, [exception, form, open]);

  const submit = async (values: TimeOffFormValues) => {
    await onSubmit({
      exceptionDate: values.date.format("DD/MM/YYYY"),
      startTime: values.allDay ? null : values.startTime?.format("HH:mm"),
      endTime: values.allDay ? null : values.endTime?.format("HH:mm"),
      reason: values.reason?.trim() || undefined,
    });
  };

  return (
    <Modal
      open={open}
      title={null}
      footer={null}
      width={620}
      onCancel={onClose}
      destroyOnHidden
      styles={{ body: { padding: "16px 14px 12px" } }}
    >
      <div>
        <div style={{ marginBottom: 24 }}>
          <Typography.Title level={5} style={{ margin: "0 0 5px" }}>
            {exception ? "Edit time off" : "Add time off"}
          </Typography.Title>
          <Flex vertical gap={2} style={{ marginBottom: 14 }}>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Block one date, for the whole day or just the hours you need.
            </Typography.Text>
          </Flex>
        </div>

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={(values) => void submit(values)}
        >
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Choose a date." }]}
            style={{ marginBottom: 4 }}
          >
            <DatePicker
              format="MMM D, YYYY"
              suffixIcon={<CalendarOutlined />}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Typography.Text
            type="secondary"
            style={{ display: "block", marginBottom: 12, fontSize: 10 }}
          >
            {selectedDate
              ? `${selectedDate.format("dddd")} · This exception applies to this date only.`
              : "This exception applies to this date only."}
          </Typography.Text>

          <Form.Item
            name="allDay"
            label="How much time do you need?"
            style={{ marginBottom: allDay ? 4 : 12 }}
          >
            <RadioButtonGroup
              optionType="button"
              options={[
                { label: "All day", value: true },
                { label: "Specific hours", value: false },
              ]}
            />
          </Form.Item>

          {!allDay ? (
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name="startTime"
                  label="Start time"
                  rules={[{ required: true, message: "Choose a start time." }]}
                >
                  <TimePicker
                    format="h:mm A"
                    minuteStep={15}
                    suffixIcon={<ClockCircleOutlined />}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="endTime"
                  label="End time"
                  dependencies={["startTime"]}
                  rules={[
                    { required: true, message: "Choose an end time." },
                    ({ getFieldValue }) => ({
                      validator(_, value: Dayjs | undefined) {
                        const startTime = getFieldValue("startTime") as Dayjs | undefined;
                        if (!value || !startTime || value.isAfter(startTime)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("End time must be after start time."));
                      },
                    }),
                  ]}
                >
                  <TimePicker
                    format="h:mm A"
                    minuteStep={15}
                    suffixIcon={<ClockCircleOutlined />}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>
          ) : null}

          <Form.Item name="reason" label="Reason" style={{ marginBottom: 8 }}>
            <Input.TextArea rows={3} maxLength={300} placeholder="Add a reason for this time off" />
          </Form.Item>
          <Typography.Text type="secondary" style={{ display: "block", fontSize: 10 }}>
            A short explanation to help you recognize this time off.
          </Typography.Text>

          <Divider style={{ margin: "14px 0 12px" }} />
          <Flex align="center" justify="space-between" gap={12} wrap>
            <Typography.Text type="secondary" style={{ fontSize: 10 }}>
              {exception
                ? "Changing time off does not cancel or change existing appointments."
                : "Adding time off does not cancel or change existing appointments."}
            </Typography.Text>
            <Flex gap={8}>
              <Button type="primary" htmlType="submit" loading={loading}>
                {exception ? "Save changes" : "Add time off"}
              </Button>
            </Flex>
          </Flex>
        </Form>
      </div>
    </Modal>
  );
}
