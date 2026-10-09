import { Form, message } from "antd";
import type { Dayjs } from "dayjs";
import { DateInput } from "../../../components/DateInput";
import { FormField } from "../../../components/FormField";
import { PasswordInput } from "../../../components/PasswordInput";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { SelectInput } from "../../../components/SelectInput";
import { TextInput } from "../../../components/TextInput";
import {
  AuthFormCard,
  AuthFormFooter,
  AuthFormHeader,
  AuthFormLink,
  AuthFormSubtitle,
  AuthFormTitle,
  RegisterFieldsGrid,
} from "./AuthForm.styles";

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Dayjs;
  password: string;
  confirmPassword: string;
  gender?: "MALE" | "FEMALE";
}

export function RegisterForm() {
  const handleFinish = () => {
    message.info("Registration is not connected yet.");
  };

  return (
    <AuthFormCard $wide>
      <Form<RegisterFormValues> layout="vertical" requiredMark={false} onFinish={handleFinish}>
        <AuthFormHeader>
          <AuthFormTitle>Register</AuthFormTitle>
          <AuthFormSubtitle>Register as a patient to start booking appointments.</AuthFormSubtitle>
        </AuthFormHeader>

        <RegisterFieldsGrid>
          <FormField
            $compact
            label="First name"
            name="firstName"
            rules={[{ required: true, message: "First name is required" }]}
          >
            <TextInput $compact placeholder="Mariam" autoComplete="given-name" />
          </FormField>

          <FormField
            $compact
            label="Last name"
            name="lastName"
            rules={[{ required: true, message: "Last name is required" }]}
          >
            <TextInput $compact placeholder="Ali" autoComplete="family-name" />
          </FormField>

          <FormField
            $compact
            $fullWidth
            label="Email address"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <TextInput $compact placeholder="maya@example.com" autoComplete="email" />
          </FormField>

          <FormField
            $compact
            label="Phone number"
            name="phone"
            rules={[
              { required: true, message: "Phone number is required" },
              { pattern: /^\+?[0-9]{7,20}$/, message: "Enter a valid phone number" },
            ]}
          >
            <TextInput $compact placeholder="+97312345678" autoComplete="tel" />
          </FormField>

          <FormField
            $compact
            label="Date of birth"
            name="dateOfBirth"
            rules={[{ required: true, message: "Date of birth is required" }]}
          >
            <DateInput $compact placeholder="dd/MM/yyyy" format="DD/MM/YYYY" />
          </FormField>

          <FormField
            $compact
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 5, message: "Password must be at least 5 characters" },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-+_=<>?]).{5,}$/,
                message: "Must include uppercase, lowercase, and a special character",
              },
            ]}
          >
            <PasswordInput $compact placeholder="Create a password" autoComplete="new-password" />
          </FormField>

          <FormField
            $compact
            label="Confirm password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value: string | undefined) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <PasswordInput
              $compact
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
          </FormField>

          <FormField $compact $fullWidth label="Gender" name="gender">
            <SelectInput
              $compact
              placeholder="Select gender (optional)"
              allowClear
              options={[
                { label: "Male", value: "MALE" },
                { label: "Female", value: "FEMALE" },
              ]}
            />
          </FormField>
        </RegisterFieldsGrid>

        <AuthFormFooter>
          <PrimaryButton type="primary" htmlType="submit" block>
            Create account
          </PrimaryButton>
          <AuthFormLink href="#login">Already have an account? Sign in</AuthFormLink>
        </AuthFormFooter>
      </Form>
    </AuthFormCard>
  );
}
