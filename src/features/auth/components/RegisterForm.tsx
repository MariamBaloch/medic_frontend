import dayjs from "dayjs";
import { Button, DatePicker, Input, InputNumber, Segmented, Select, message } from "antd";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { FormField } from "@components/FormField";
import { ROUTES } from "@constants/routes";
import { PhoneInput } from "@components/PhoneInput";
import { getApiErrorMessage } from "@services/api/errors";
import {
  useRegisterDoctorMutation,
  useRegisterPatientMutation,
} from "@features/auth/api/authQueries";
import {
  AuthFormCard,
  AuthFormFooter,
  AuthFormHeader,
  AuthFormLink,
  AuthFormSubtitle,
  AuthFormTitle,
  RegisterFieldsGrid,
  AuthFormElement,
} from "./AuthForm.styles";
import { registrationFormSchema } from "@features/auth/schemas/auth.schemas";

export function RegisterForm() {
  const navigate = useNavigate();
  type FormInput = z.input<typeof registrationFormSchema>;
  type FormOutput = z.output<typeof registrationFormSchema>;
  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      accountType: "patient",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      password: "",
      confirmPassword: "",
      gender: undefined,
    },
    shouldUnregister: true,
  });
  const accountType = useWatch({ control: form.control, name: "accountType" });
  const registerPatient = useRegisterPatientMutation();
  const registerDoctor = useRegisterDoctorMutation();
  const isSubmitting = registerPatient.isPending || registerDoctor.isPending;

  const handleSubmit = async (values: FormOutput) => {
    const commonPayload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      phone: values.phone,
      dateOfBirth: values.dateOfBirth,
      gender: values.gender,
    };

    try {
      if (values.accountType === "doctor") {
        await registerDoctor.mutateAsync({
          ...commonPayload,
          specializationId: values.specializationId,
          licenseNumber: values.licenseNumber,
        });
      } else {
        await registerPatient.mutateAsync(commonPayload);
      }

      message.success("Registration successful. Check your email to verify your account.");
      navigate(ROUTES.login, { replace: true });
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  return (
    <AuthFormCard $wide>
      <AuthFormElement noValidate onSubmit={form.handleSubmit(handleSubmit)}>
        <AuthFormHeader>
          <AuthFormTitle>Register</AuthFormTitle>
          <AuthFormSubtitle>
            Create a patient or doctor account to access the Medic portal.
          </AuthFormSubtitle>
        </AuthFormHeader>

        <RegisterFieldsGrid>
          <Controller
            control={form.control}
            name="accountType"
            render={({ field, fieldState }) => (
              <FormField
                $compact
                $fullWidth
                label="Account type"
                htmlFor="accountType"
                required
                validateStatus={fieldState.error ? "error" : undefined}
                help={fieldState.error?.message}
              >
                <Segmented
                  id="accountType"
                  block
                  size="large"
                  value={field.value}
                  options={[
                    { label: "Patient", value: "patient" },
                    { label: "Doctor", value: "doctor" },
                  ]}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </FormField>
            )}
          />

          <Controller
            control={form.control}
            name="firstName"
            render={({ field, fieldState }) => (
              <FormField
                $compact
                label="First name"
                htmlFor="register-first-name"
                validateStatus={fieldState.error ? "error" : undefined}
                help={fieldState.error?.message}
              >
                <Input
                  {...field}
                  id="register-first-name"
                  placeholder="Mariam"
                  autoComplete="given-name"
                />
              </FormField>
            )}
          />
          <Controller
            control={form.control}
            name="lastName"
            render={({ field, fieldState }) => (
              <FormField
                $compact
                label="Last name"
                htmlFor="register-last-name"
                validateStatus={fieldState.error ? "error" : undefined}
                help={fieldState.error?.message}
              >
                <Input
                  {...field}
                  id="register-last-name"
                  placeholder="Ali"
                  autoComplete="family-name"
                />
              </FormField>
            )}
          />
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormField
                $compact
                $fullWidth
                label="Email address"
                htmlFor="register-email"
                validateStatus={fieldState.error ? "error" : undefined}
                help={fieldState.error?.message}
              >
                <Input
                  {...field}
                  id="register-email"
                  type="email"
                  placeholder="maya@example.com"
                  autoComplete="email"
                />
              </FormField>
            )}
          />

          <Controller
            control={form.control}
            name="gender"
            render={({ field, fieldState }) => (
              <FormField
                $compact
                label="Gender"
                htmlFor="gender"
                required={false}
                validateStatus={fieldState.error ? "error" : undefined}
                help={fieldState.error?.message}
              >
                <Select
                  id="gender"
                  value={field.value}
                  placeholder="Select gender (optional)"
                  allowClear
                  options={[
                    { label: "Male", value: "MALE" },
                    { label: "Female", value: "FEMALE" },
                  ]}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </FormField>
            )}
          />

          <Controller
            control={form.control}
            name="dateOfBirth"
            render={({ field, fieldState }) => (
              <FormField
                $compact
                label="Date of birth"
                htmlFor="dateOfBirth"
                required
                validateStatus={fieldState.error ? "error" : undefined}
                help={fieldState.error?.message}
              >
                <DatePicker
                  id="dateOfBirth"
                  style={{ width: "100%" }}
                  placeholder="dd/MM/yyyy"
                  format="DD/MM/YYYY"
                  value={field.value ? dayjs(`${field.value.slice(6)}-${field.value.slice(3, 5)}-${field.value.slice(0, 2)}`) : null}
                  onChange={(date) => field.onChange(date?.format("DD/MM/YYYY") ?? "")}
                  onBlur={field.onBlur}
                />
              </FormField>
            )}
          />

          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormField
                $compact
                label="Password"
                htmlFor="register-password"
                validateStatus={fieldState.error ? "error" : undefined}
                help={fieldState.error?.message}
              >
                <Input.Password
                  {...field}
                  id="register-password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
              </FormField>
            )}
          />
          <Controller
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <FormField
                $compact
                label="Confirm password"
                htmlFor="register-confirm-password"
                validateStatus={fieldState.error ? "error" : undefined}
                help={fieldState.error?.message}
              >
                <Input.Password
                  {...field}
                  id="register-confirm-password"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
              </FormField>
            )}
          />

          <Controller
            control={form.control}
            name="phone"
            render={({ field, fieldState }) => (
              <FormField
                $fullWidth
                label="Phone number"
                htmlFor="phone"
                required
                validateStatus={fieldState.error ? "error" : undefined}
                help={fieldState.error?.message}
              >
                <PhoneInput
                  id="phone"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </FormField>
            )}
          />

          {accountType === "doctor" ? (
            <>
              <Controller
                control={form.control}
                name="specializationId"
                render={({ field, fieldState }) => (
                  <FormField
                    $compact
                    label="Specialization ID"
                    htmlFor="specializationId"
                    required
                    validateStatus={fieldState.error ? "error" : undefined}
                    help={fieldState.error?.message}
                  >
                    <InputNumber
                      id="specializationId"
                      style={{ width: "100%" }}
                      min={1}
                      placeholder="1"
                      controls={false}
                      value={field.value ?? null}
                      onChange={(value) => field.onChange(value ?? undefined)}
                      onBlur={field.onBlur}
                    />
                  </FormField>
                )}
              />

              <Controller
                control={form.control}
                name="licenseNumber"
                render={({ field, fieldState }) => (
                  <FormField
                    $compact
                    label="Medical license number"
                    htmlFor="register-license-number"
                    validateStatus={fieldState.error ? "error" : undefined}
                    help={fieldState.error?.message}
                  >
                    <Input
                      {...field}
                      id="register-license-number"
                      placeholder="BHP-12345"
                      autoComplete="off"
                    />
                  </FormField>
                )}
              />
            </>
          ) : null}
        </RegisterFieldsGrid>

        <AuthFormFooter>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isSubmitting || form.formState.isSubmitting}
          >
            Create account
          </Button>
          <AuthFormLink as={Link} to={ROUTES.login}>
            Already have an account? Sign in
          </AuthFormLink>
        </AuthFormFooter>
      </AuthFormElement>
    </AuthFormCard>
  );
}
