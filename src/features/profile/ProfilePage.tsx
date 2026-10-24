import { CameraOutlined, SaveOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Flex, message, Space, Tag, Typography, Upload } from "antd";
import { useEffect } from "react";
import { AppCard } from "@components/Card";
import { PageHeader } from "@components/PageHeader";
import {
  useCurrentUserQuery,
  useUpdateDoctorProfileMutation,
  useUpdatePatientProfileMutation,
  useUpdateUserAccountMutation,
  useUploadProfilePictureMutation,
} from "@features/auth/api/authQueries";
import { useAuthStore } from "@stores/authStore";
import type {
  DoctorProfileUpdate,
  PatientProfileUpdate,
  UserAccountUpdate,
} from "@features/auth/api/authApi";
import { ChangePasswordSection } from "./components/ChangePasswordSection/ChangePasswordSection";
import { UserAccountForm } from "./components/UserAccountForm";

export function ProfilePage() {
  const storedUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const currentUserQuery = useCurrentUserQuery();
  const patientUpdate = useUpdatePatientProfileMutation();
  const doctorUpdate = useUpdateDoctorProfileMutation();
  const accountUpdate = useUpdateUserAccountMutation();
  const avatarUpload = useUploadProfilePictureMutation();
  const user = currentUserQuery.data ?? storedUser;

  useEffect(() => {
    if (!user) return;
    setUser(user);
  }, [user, setUser]);

  const handleAvatarChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      message.error("Choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error("Image must be 5 MB or smaller.");
      return;
    }
    avatarUpload.mutate(file, {
      onSuccess: () => message.success("Profile photo updated."),
    });
  };

  const submitUserAccount = async (
    account: UserAccountUpdate,
    patient?: PatientProfileUpdate,
    doctor?: DoctorProfileUpdate,
  ) => {
    await Promise.all([
      accountUpdate.mutateAsync(account),
      ...(patient ? [patientUpdate.mutateAsync(patient)] : []),
      ...(doctor ? [doctorUpdate.mutateAsync(doctor)] : []),
    ]);
    message.success("Profile details saved.");
  };

  if (!user) {
    return (
      <AppCard loading={currentUserQuery.isPending}>
        {!currentUserQuery.isPending && (
          <Typography.Text type="secondary">
            Your account details could not be loaded.
          </Typography.Text>
        )}
      </AppCard>
    );
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return (
    <Flex vertical gap={20} style={{ width: "100%", maxWidth: "min(100%, 1200px)" }}>
      <PageHeader
        title="Profile"
        description="View your account details and manage your profile."
      />

      <AppCard title="Account">
        <Flex align="center" gap={18}>
          <Avatar size={76} src={user.imageUrl || undefined} icon={<UserOutlined />} />
          <Flex vertical>
            <Typography.Title level={4} style={{ margin: "0 0" }}>
              {fullName || user.email}
            </Typography.Title>
            <Typography.Text type="secondary">{user.email}</Typography.Text>
            <Space>
              <Tag color="blue">{user.role}</Tag>
              <Tag color={user.status === "ACTIVE" ? "green" : "default"}>
                {user.status.replaceAll("_", " ")}
              </Tag>
            </Space>
            <Flex align="center" gap={10} style={{ marginTop:18 }}>
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={(file) => {
                  handleAvatarChange(file);
                  return Upload.LIST_IGNORE;
                }}
              >
                <Button icon={<CameraOutlined />} loading={avatarUpload.isPending}>
                  Change photo
                </Button>
              </Upload>
              <Typography.Text type="secondary">Image up to 5 MB</Typography.Text>
            </Flex>
          </Flex>
        </Flex>
      </AppCard>

      <UserAccountForm
        user={user}
        patientProfile={user.role === "PATIENT" ? user.patient ?? {} : undefined}
        doctorProfile={user.role === "DOCTOR" ? user.doctor ?? {} : undefined}
        onSave={submitUserAccount}
      />

      <ChangePasswordSection />

      <Flex justify="flex-end">
        <Button
          type="primary"
          htmlType="submit"
          form="profile-details-form"
          icon={<SaveOutlined />}
          loading={accountUpdate.isPending || patientUpdate.isPending || doctorUpdate.isPending}
        >
          Save changes
        </Button>
      </Flex>
    </Flex>
  );
}
