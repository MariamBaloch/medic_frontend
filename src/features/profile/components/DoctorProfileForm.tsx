import { SaveOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, InputNumber, Row, Select } from "antd";
import { useEffect } from "react";
import type { DoctorProfileUpdate } from "@features/auth/api/authApi";
import type { UserProfile } from "@features/auth/schemas/auth.schemas";
import { useSpecializationsQuery } from "@features/appointment/api/appointmentsQueries";

interface DoctorProfileFormProps {
  profile: UserProfile["doctor"];
  onSave: (values: DoctorProfileUpdate) => void;
  loading: boolean;
}

export function DoctorProfileForm({ profile, onSave, loading }: DoctorProfileFormProps) {
  const [form] = Form.useForm<DoctorProfileUpdate>();
  const specializationsQuery = useSpecializationsQuery();

  useEffect(() => {
    form.setFieldsValue({
      specializationId: profile?.specializationId ?? profile?.specialization?.id ?? undefined,
      qualification: profile?.qualification ?? "",
      yearsOfExperience: profile?.yearsOfExperience ?? undefined,
      consultationFee: profile?.consultationFee ?? undefined,
      hospitalAffiliation: profile?.hospitalAffiliation ?? "",
      clinicAddress: profile?.clinicAddress ?? "",
      bio: profile?.bio ?? "",
    });
  }, [form, profile]);

  return (
    <Form form={form} layout="vertical" onFinish={onSave}>
      <Row gutter={[32, 16]}>
        <Col xs={24} md={12}>
          <Form.Item name="specializationId" label="Specialization">
            <Select
              allowClear
              loading={specializationsQuery.isLoading}
              options={(specializationsQuery.data ?? []).map(({ id, name }) => ({
                value: id,
                label: name,
              }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="qualification" label="Qualification">
            <Input maxLength={255} />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="yearsOfExperience" label="Years of experience">
            <InputNumber min={0} precision={0} style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="consultationFee" label="Consultation fee">
            <InputNumber min={0} precision={2} style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="hospitalAffiliation" label="Hospital affiliation">
            <Input maxLength={255} />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name="clinicAddress" label="Clinic address">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name="bio" label="Professional bio">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Col>
      </Row>
      <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
        Save profile
      </Button>
    </Form>
  );
}
