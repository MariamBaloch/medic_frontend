import { CameraOutlined, UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Flex,
  message,
  Space,
  Tag,
  Typography,
  Upload,
} from "antd";
import { useEffect } from "react";
import { PageHeader } from "@components/PageHeader";
import {
  useCurrentUserQuery,
  useUpdateDoctorProfileMutation,
  useUpdatePatientProfileMutation,
  useUploadProfilePictureMutation,
} from "@features/auth/api/authQueries";
import { useAuthStore } from "@stores/authStore";
import type { DoctorProfileUpdate, PatientProfileUpdate } from "@features/auth/api/authApi";
import { DoctorProfileForm } from "./components/DoctorProfileForm";
import { PatientProfileForm } from "./components/PatientProfileForm";
import { ChangePasswordSection } from "./components/ChangePasswordSection";

export function ProfilePage() {
  const storedUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const currentUserQuery = useCurrentUserQuery();
  const patientUpdate = useUpdatePatientProfileMutation();
  const doctorUpdate = useUpdateDoctorProfileMutation();
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

  const submitPatientProfile = (values: PatientProfileUpdate) => {
    patientUpdate.mutate(values, {
      onSuccess: () => message.success("Patient profile saved."),
    });
  };

  const submitDoctorProfile = (values: DoctorProfileUpdate) => {
    doctorUpdate.mutate(values, {
      onSuccess: () => message.success("Doctor profile saved."),
    });
  };

  if (!user) {
    return (
      <Card loading={currentUserQuery.isPending}>
        {!currentUserQuery.isPending && (
          <Typography.Text type="secondary">Your account details could not be loaded.</Typography.Text>
        )}
      </Card>
    );
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  const profileTitle = user.role === "ADMIN" ? "Administrator profile" : `${user.role.charAt(0)}${user.role.slice(1).toLowerCase()} profile`;

  return (
    <Flex vertical gap={20} style={{ maxWidth: 1000 }}>
      <PageHeader
        title="Profile"
        description="View your account details and manage your profile."
      />

      <Card>
        <Flex align="center" gap={18}>
          <Avatar size={76} src={user.imageUrl || undefined} icon={<UserOutlined />} />
          <Flex vertical>
            <Typography.Title level={4} style={{ margin: "0 0 4px" }}>{fullName || user.email}</Typography.Title>
            <Space>
              <Tag color="blue">{user.role}</Tag>
              <Tag color={user.status === "ACTIVE" ? "green" : "default"}>{user.status.replaceAll("_", " ")}</Tag>
            </Space>
            <Flex align="center" gap={10} style={{ marginTop: 12 }}>
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
      </Card>

      <Card title="Account details">
        <Descriptions column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="First name">{user.firstName || "—"}</Descriptions.Item>
          <Descriptions.Item label="Last name">{user.lastName || "—"}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{user.phone || "—"}</Descriptions.Item>
          <Descriptions.Item label="Date of birth">{user.dateOfBirth || "—"}</Descriptions.Item>
          <Descriptions.Item label="Gender">
            {user.gender
              ? `${user.gender.charAt(0)}${user.gender.slice(1).toLowerCase()}`
              : "—"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {user.role === "PATIENT" && (
        <Card title={profileTitle}>
          <PatientProfileForm
            profile={user.patient}
            onSave={submitPatientProfile}
            loading={patientUpdate.isPending}
          />
        </Card>
      )}

      {user.role === "DOCTOR" && (
        <Card title={profileTitle}>
          <DoctorProfileForm
            profile={user.doctor}
            onSave={submitDoctorProfile}
            loading={doctorUpdate.isPending}
          />
        </Card>
      )}

      <ChangePasswordSection />
    </Flex>
  );
}
