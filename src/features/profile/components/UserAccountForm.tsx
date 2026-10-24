import dayjs from "dayjs";
import { Col, DatePicker, Form, Input, InputNumber, Row, Select, Typography } from "antd";
import { useEffect } from "react";
import type { Dayjs } from "dayjs";
import { AppCard } from "@components/Card";
import { PhoneInput } from "@components/PhoneInput/PhoneInput";
import type {
  DoctorProfileUpdate,
  PatientProfileUpdate,
  UserAccountUpdate,
} from "@features/auth/api/authApi";
import type { UserProfile } from "@features/auth/schemas/auth.schemas";
import { countryCallingCodes } from "@utils/countryCallingCodes";
import { useSpecializationsQuery } from "@features/appointment/api/appointmentsQueries";
import { RepeatableTextFields } from "./RepeatableTextFields";

type FormValues = Omit<UserAccountUpdate, "dateOfBirth"> & {
  dateOfBirth?: Dayjs;
  address?: string;
  city?: string;
  country?: string;
  bloodType?: string;
  heightCm?: number;
  weightKg?: number;
  allergies?: string[];
  chronicConditions?: string[];
  specializationId?: number;
  qualification?: string;
  yearsOfExperience?: number;
  consultationFee?: number;
  hospitalAffiliation?: string;
  clinicAddress?: string;
  bio?: string;
};

interface UserAccountFormProps {
  user: UserProfile;
  patientProfile?: NonNullable<UserProfile["patient"]>;
  doctorProfile?: NonNullable<UserProfile["doctor"]>;
  onSave: (
    account: UserAccountUpdate,
    patient?: PatientProfileUpdate,
    doctor?: DoctorProfileUpdate,
  ) => void | Promise<void>;
}

interface SectionTitleProps {
  title: string;
  description: string;
}

function SectionTitle({ title, description }: SectionTitleProps) {
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

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const splitListField = (value?: string | null) =>
  value
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
const parseDateOfBirth = (value?: string | null) => {
  if (!value) return undefined;
  const [day, month, year] = value.split("/");
  return dayjs(`${year}-${month}-${day}`);
};

export function UserAccountForm({
  user,
  patientProfile,
  doctorProfile,
  onSave,
}: UserAccountFormProps) {
  const [form] = Form.useForm<FormValues>();
  const specializationsQuery = useSpecializationsQuery(Boolean(doctorProfile));

  useEffect(() => {
    form.setFieldsValue({
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: parseDateOfBirth(user.dateOfBirth),
      phone: user.phone ?? "",
      gender: user.gender ?? undefined,
      address: patientProfile?.address ?? "",
      city: patientProfile?.city ?? "",
      country: patientProfile?.country ?? "",
      bloodType: patientProfile?.bloodType ?? undefined,
      heightCm: patientProfile?.heightCm ?? undefined,
      weightKg: patientProfile?.weightKg ?? undefined,
      allergies: splitListField(patientProfile?.allergies),
      chronicConditions: splitListField(patientProfile?.chronicConditions),
      specializationId:
        doctorProfile?.specializationId ?? doctorProfile?.specialization?.id ?? undefined,
      qualification: doctorProfile?.qualification ?? "",
      yearsOfExperience: doctorProfile?.yearsOfExperience ?? undefined,
      consultationFee: doctorProfile?.consultationFee ?? undefined,
      hospitalAffiliation: doctorProfile?.hospitalAffiliation ?? "",
      clinicAddress: doctorProfile?.clinicAddress ?? "",
      bio: doctorProfile?.bio ?? "",
    });
  }, [form, patientProfile, doctorProfile, user]);

  const handleFinish = (values: FormValues) => {
    const account: UserAccountUpdate = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      dateOfBirth: values.dateOfBirth?.format("DD/MM/YYYY") ?? "",
      phone: values.phone.trim(),
      gender: values.gender,
    };

    const patient: PatientProfileUpdate | undefined = patientProfile
      ? {
          address: values.address,
          city: values.city,
          country: values.country,
          bloodType: values.bloodType,
          heightCm: values.heightCm,
          weightKg: values.weightKg,
          allergies: values.allergies
            ?.map((item) => item.trim())
            .filter(Boolean)
            .join(","),
          chronicConditions: values.chronicConditions
            ?.map((item) => item.trim())
            .filter(Boolean)
            .join(","),
        }
      : undefined;

    const doctor: DoctorProfileUpdate | undefined = doctorProfile
      ? {
          specializationId: values.specializationId,
          qualification: values.qualification,
          yearsOfExperience: values.yearsOfExperience,
          consultationFee: values.consultationFee,
          hospitalAffiliation: values.hospitalAffiliation,
          clinicAddress: values.clinicAddress,
          bio: values.bio,
        }
      : undefined;

    return onSave(account, patient, doctor);
  };

  return (
    <Form id="profile-details-form" form={form} layout="vertical" onFinish={handleFinish}>
      <AppCard
        title={
          <SectionTitle
            title="Personal information"
            description="This is the basic information that helps us identify you."
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
            title="Contact and address"
            description="Where we can reach you with updates about your care."
          />
        }
        style={{ marginBottom: 20 }}
      >
        <Row gutter={[24, 8]}>
          <Col xs={24} md={patientProfile ? 8 : doctorProfile ? 8 : 24}>
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
          {patientProfile && (
            <>
              <Col xs={24} md={8}>
                <Form.Item name="country" label="Country">
                  <Select
                    showSearch
                    optionFilterProp="label"
                    options={countryCallingCodes.map(({ country }) => ({
                      value: country,
                      label: country,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="city" label="City">
                  <Input maxLength={35} />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item name="address" label="Address">
                  <Input maxLength={100} />
                </Form.Item>
              </Col>
            </>
          )}
          {doctorProfile && (
            <Col xs={24} md={16}>
              <Form.Item name="clinicAddress" label="Clinic address">
                <Input />
              </Form.Item>
            </Col>
          )}
        </Row>
      </AppCard>

      {patientProfile && (
        <AppCard
          title={
            <SectionTitle
              title="Medical information"
              description="Share accurate health details to help your care team prepare."
            />
          }
          style={{ marginBottom: 20 }}
        >
          <Row gutter={[24, 8]}>
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
        </AppCard>
      )}

      {doctorProfile && (
        <AppCard
          title={
            <SectionTitle
              title="Professional information"
              description="Keep your qualifications and practice details up to date."
            />
          }
          style={{ marginBottom: 20 }}
        >
          <Row gutter={[24, 8]}>
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
              <Form.Item name="bio" label="Professional bio">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
        </AppCard>
      )}
    </Form>
  );
}
