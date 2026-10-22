import { LockOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message, Modal, Space, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ROUTES } from "@constants/routes";
import { useChangePasswordMutation } from "@features/auth/api/authQueries";
import { useAuthStore } from "@stores/authStore";

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ChangePasswordSection() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm<PasswordFormValues>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const clearSession = useAuthStore((state) => state.clearSession);
  const passwordChange = useChangePasswordMutation();

  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleFinish = ({ currentPassword, newPassword }: PasswordFormValues) => {
    passwordChange.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          closeModal();
          message.info("Password changed. Please sign in again with your new password.");
          clearSession();
          queryClient.clear();
          navigate(ROUTES.login, { replace: true });
        },
      },
    );
  };

  return (
    <>
      <Card title="Security">
        <Space orientation="vertical" size={12}>
          <Typography.Text type="secondary">Update your password to keep your account secure.</Typography.Text>
          <Button icon={<LockOutlined />} onClick={() => setIsModalOpen(true)}>
            Change password
          </Button>
        </Space>
      </Card>

      <Modal
        title="Change password"
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleFinish} style={{ marginTop: 20 }}>
          <Form.Item
            name="currentPassword"
            label="Current password"
            rules={[{ required: true, message: "Enter your current password" }]}
          >
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New password"
            rules={[
              { required: true, message: "Enter a new password" },
              { min: 5, message: "Password must be at least 5 characters" },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-+_=<>?]).{5,}$/,
                message: "Include uppercase, lowercase, and a special character",
              },
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm new password"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  return !value || getFieldValue("newPassword") === value
                    ? Promise.resolve()
                    : Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Space>
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={passwordChange.isPending}>
              Update password
            </Button>
          </Space>
        </Form>
      </Modal>
    </>
  );
}
