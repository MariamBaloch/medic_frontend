import { SaveOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, InputNumber, Row, Select } from "antd";
import { useEffect } from "react";
import type { PatientProfileUpdate } from "@features/auth/api/authApi";
import type { UserProfile } from "@features/auth/schemas/auth.schemas";
import { countryCallingCodes } from "@utils/countryCallingCodes";
import { ProfileForm } from "./ProfileForm.styles";
import { RepeatableTextFields } from "./RepeatableTextFields";

type PatientFormValues = Omit<PatientProfileUpdate, "allergies" | "chronicConditions"> & {
  allergies?: string[];
  chronicConditions?: string[];
};

interface PatientProfileFormProps {
  profile: UserProfile["patient"];
  onSave: (values: PatientProfileUpdate) => void;
  loading: boolean;
}

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const splitListField = (value?: string | null) =>
  value ? value.split(",").map((item) => item.trim()).filter(Boolean) : [];

export function PatientProfileForm({ profile, onSave, loading }: PatientProfileFormProps) {
  const [form] = Form.useForm<PatientFormValues>();

  useEffect(() => {
    const patient = profile ?? {};
    form.setFieldsValue({
      address: patient.address ?? "",
      city: patient.city ?? "",
      country: patient.country ?? "",
      bloodType: patient.bloodType ?? undefined,
      heightCm: patient.heightCm ?? undefined,
      weightKg: patient.weightKg ?? undefined,
      allergies: splitListField(patient.allergies),
      chronicConditions: splitListField(patient.chronicConditions),
    });
  }, [form, profile]);

  const handleFinish = (values: PatientFormValues) => {
    onSave({
      ...values,
      allergies: values.allergies?.map((item) => item.trim()).filter(Boolean).join(","),
      chronicConditions: values.chronicConditions?.map((item) => item.trim()).filter(Boolean).join(","),
    });
  };

  return (
    <ProfileForm form={form} layout="vertical" onFinish={handleFinish}>
      <Row gutter={[32, 16]}>
        <Col xs={24} md={8}>
          <Form.Item name="country" label="Country">
            <Select
              showSearch
              optionFilterProp="label"
              options={countryCallingCodes.map(({ country }) => ({ value: country, label: country }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="city" label="City"><Input maxLength={35} /></Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="address" label="Address"><Input maxLength={100} /></Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="bloodType" label="Blood type">
            <Select allowClear options={bloodTypes.map((value) => ({ value, label: value }))} />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="heightCm" label="Height">
            <InputNumber min={0} precision={0} suffix="cm" style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="weightKg" label="Weight">
            <InputNumber min={0} precision={0} suffix="kg" style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <RepeatableTextFields
            name="allergies"
            label="Allergies"
            placeholder="e.g. Peanuts"
            addLabel="Add allergy"
            removeLabel="Remove allergy"
          />
        </Col>
        <Col xs={24} md={12}>
          <RepeatableTextFields
            name="chronicConditions"
            label="Chronic conditions"
            placeholder="e.g. Asthma"
            addLabel="Add condition"
            removeLabel="Remove chronic condition"
          />
        </Col>
      </Row>
      <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} style={{ marginTop: 8 }}>
        Save profile
      </Button>
    </ProfileForm>
  );
}
