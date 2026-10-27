import { LockOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Modal, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ROUTES } from "@constants/routes";
import { useChangePasswordMutation } from "@features/auth/api/authQueries";
import { useAuthStore } from "@stores/authStore";
import { showApiAlert } from "@services/api/appAlerts";
import { SecurityCard } from "./ChangePasswordSection.styles";

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
          showApiAlert({
            type: "success",
            message: "Password changed",
            description: "Please sign in again with your new password.",
          });
          clearSession();
          queryClient.clear();
          navigate(ROUTES.login, { replace: true });
        },
      },
    );
  };

  return (
    <>
      <SecurityCard title="Security">
        <Flex vertical gap={12} style={{ width: "100%" }}>
          <Typography.Text type="secondary">
            Update your password to keep your account secure.
          </Typography.Text>
          <Flex justify="flex-start">
            <Button
              color="primary"
              variant="outlined"
              icon={<LockOutlined />}
              onClick={() => setIsModalOpen(true)}
            >
              Change password
            </Button>
          </Flex>
        </Flex>
      </SecurityCard>

      <Modal
        title="Change password"
        open={isModalOpen}
        onCancel={closeModal}
        destroyOnHidden
        okText="Update password"
        cancelText="Cancel"
        confirmLoading={passwordChange.isPending}
        onOk={() => form.submit()}
        styles={{
          footer: {
            marginTop: 24,
          },
        }}
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
        </Form>
      </Modal>
    </>
  );
}
