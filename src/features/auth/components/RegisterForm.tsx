import { useState } from "react";
import { Button, DatePicker, Form, Input, InputNumber, Segmented, Select, message } from "antd";
import type { Dayjs } from "dayjs";
import { Link } from "react-router-dom";
import { FormField } from "@components/FormField";
import { PhoneInput } from "@components/PhoneInput";
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
  accountType: "patient" | "doctor";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Dayjs;
  password: string;
  confirmPassword: string;
  gender?: "MALE" | "FEMALE";
  specializationId?: number;
  licenseNumber?: string;
}

export function RegisterForm() {
  const [accountType, setAccountType] = useState<RegisterFormValues["accountType"]>("patient");

  const handleFinish = () => {
    message.info(
      `${accountType === "doctor" ? "Doctor" : "Patient"} registration is not connected yet.`,
    );
  };

  return (
    <AuthFormCard $wide>
      <Form<RegisterFormValues>
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
        initialValues={{ accountType: "patient" }}
      >
        <AuthFormHeader>
          <AuthFormTitle>Register</AuthFormTitle>
          <AuthFormSubtitle>
            Create a patient or doctor account to access the Medic portal.
          </AuthFormSubtitle>
        </AuthFormHeader>

        <RegisterFieldsGrid>
          <FormField $compact $fullWidth label="Account type" name="accountType">
            <Segmented
              block
              size="large"
              options={[
                { label: "Patient", value: "patient" },
                { label: "Doctor", value: "doctor" },
              ]}
              onChange={(value) => setAccountType(value as RegisterFormValues["accountType"])}
            />
          </FormField>

          <FormField
            $compact
            label="First name"
            name="firstName"
            rules={[{ required: true, message: "First name is required" }]}
          >
            <Input placeholder="Mariam" autoComplete="given-name" />
          </FormField>

          <FormField
            $compact
            label="Last name"
            name="lastName"
            rules={[{ required: true, message: "Last name is required" }]}
          >
            <Input placeholder="Ali" autoComplete="family-name" />
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
            <Input placeholder="maya@example.com" autoComplete="email" />
          </FormField>

          <FormField $compact label="Gender" name="gender">
            <Select
              placeholder="Select gender (optional)"
              allowClear
              options={[
                { label: "Male", value: "MALE" },
                { label: "Female", value: "FEMALE" },
              ]}
            />
          </FormField>

          <FormField
            $compact
            label="Date of birth"
            name="dateOfBirth"
            rules={[{ required: true, message: "Date of birth is required" }]}
          >
            <DatePicker style={{ width: "100%" }} placeholder="dd/MM/yyyy" format="DD/MM/YYYY" />
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
            <Input.Password placeholder="Create a password" autoComplete="new-password" />
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
            <Input.Password placeholder="Confirm your password" autoComplete="new-password" />
          </FormField>

          <FormField
            $fullWidth
            label="Phone number"
            name="phone"
            rules={[
              { required: true, message: "Phone number is required" },
              { pattern: /^\+?[0-9]{7,20}$/, message: "Enter a valid phone number" },
            ]}
          >
            <PhoneInput />
          </FormField>

          {accountType === "doctor" ? (
            <>
              <FormField
                $compact
                label="Specialization ID"
                name="specializationId"
                preserve={false}
                rules={[{ required: true, message: "Specialization ID is required" }]}
              >
                <InputNumber style={{ width: "100%" }} min={1} placeholder="1" controls={false} />
              </FormField>

              <FormField
                $compact
                label="Medical license number"
                name="licenseNumber"
                preserve={false}
                rules={[{ required: true, message: "License number is required" }]}
              >
                <Input placeholder="BHP-12345" />
              </FormField>
            </>
          ) : null}
        </RegisterFieldsGrid>

        <AuthFormFooter>
          <Button type="primary" htmlType="submit" block>
            Create account
          </Button>
          <AuthFormLink as={Link} to="/login">
            Already have an account? Sign in
          </AuthFormLink>
        </AuthFormFooter>
      </Form>
    </AuthFormCard>
  );
}
