import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { Button, Col, DatePicker, Flex, Form, Input, Row, Select, Typography } from "antd";
import { AppCard } from "@components/Card";
import { PageHeader } from "@components/PageHeader";
import { PhoneInput } from "@components/PhoneInput/PhoneInput";
import { useRegisterAdminMutation } from "@features/auth/api/authQueries";
import { showApiAlert } from "@services/api/appAlerts";

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-+_=<>?]).{5,}$/;

interface AdminFormValues {
  firstName: string;
  lastName: string;
  dateOfBirth?: Dayjs;
  gender?: "MALE" | "FEMALE";
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <Typography.Text strong style={{ display: "block" }}>
        {title}
      </Typography.Text>
      <Typography.Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
        {description}
      </Typography.Text>
    </div>
  );
}

export function RegisterAdminPage() {
  const [form] = Form.useForm<AdminFormValues>();
  const registerAdmin = useRegisterAdminMutation();

  const handleFinish = async (values: AdminFormValues) => {
    try {
      await registerAdmin.mutateAsync({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        password: values.password,
        phone: values.phone.trim(),
        dateOfBirth: values.dateOfBirth?.format("DD/MM/YYYY") ?? "",
        gender: values.gender,
      });
      showApiAlert({
        type: "success",
        message: "Administrator created",
        description: "They can sign in now. No verification email is sent.",
      });
      form.resetFields();
    } catch {
      return;
    }
  };

  return (
    <Flex vertical gap={20} style={{ width: "100%", maxWidth: "min(100%, 1200px)" }}>
      <PageHeader
        title="Administrators"
        description="Create another admin account. It is active immediately and has no patient or doctor profile."
      />
      <Form id="admin-registration-form" form={form} layout="vertical" onFinish={handleFinish}>
        <AppCard
          title={
            <SectionTitle
              title="Personal information"
              description="This is the basic information that identifies the administrator."
            />
          }
          style={{ marginBottom: 20 }}
        >
          <Row gutter={[24, 8]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="firstName"
                label="First name"
                rules={[{ required: true, whitespace: true, max: 100 }]}
              >
                <Input maxLength={100} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="lastName"
                label="Last name"
                rules={[{ required: true, whitespace: true, max: 100 }]}
              >
                <Input maxLength={100} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="dateOfBirth"
                label="Date of birth"
                rules={[{ required: true, message: "Date of birth is required" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="dd/MM/yyyy"
                  format="DD/MM/YYYY"
                  disabledDate={(current) => !current.isBefore(dayjs().startOf("day"))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="gender" label="Gender">
                <Select
                  allowClear
                  options={[
                    { value: "FEMALE", label: "Female" },
                    { value: "MALE", label: "Male" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </AppCard>

        <AppCard
          title={
            <SectionTitle
              title="Contact"
              description="The email is also the sign-in address."
            />
          }
          style={{ marginBottom: 20 }}
        >
          <Row gutter={[24, 8]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email address"
                rules={[
                  { required: true, whitespace: true, message: "Email is required" },
                  { type: "email", message: "Enter a valid email address" },
                ]}
              >
                <Input type="email" maxLength={255} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[
                  { required: true, whitespace: true, message: "Phone is required" },
                  { max: 20, message: "Phone must not exceed 20 characters" },
                  {
                    pattern: /^\+?[0-9]{7,20}$/,
                    message: "Enter 7–20 digits with an optional leading +",
                  },
                ]}
              >
                <PhoneInput />
              </Form.Item>
            </Col>
          </Row>
        </AppCard>

        <AppCard
          title={
            <SectionTitle
              title="Password"
              description="They sign in with this password. No verification email is sent."
            />
          }
        >
          <Row gutter={[24, 8]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Password is required" },
                  { min: 5, message: "Password must be at least 5 characters" },
                  {
                    pattern: passwordPattern,
                    message: "Must include uppercase, lowercase, and a special character",
                  },
                ]}
              >
                <Input.Password autoComplete="new-password" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="confirmPassword"
                label="Confirm password"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Passwords do not match"));
                    },
                  }),
                ]}
              >
                <Input.Password autoComplete="new-password" />
              </Form.Item>
            </Col>
          </Row>
        </AppCard>
      </Form>
      <Flex justify="flex-end">
        <Button
          type="primary"
          htmlType="submit"
          form="admin-registration-form"
          loading={registerAdmin.isPending}
        >
          Create administrator
        </Button>
      </Flex>
    </Flex>
  );
}
