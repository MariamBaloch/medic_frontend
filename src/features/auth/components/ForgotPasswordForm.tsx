import { Button, Input, Typography } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Link } from "react-router-dom";
import { FormField } from "@components/FormField/FormField";
import { ROUTES } from "@constants/routes";
import { useForgotPasswordMutation } from "@features/auth/api/authQueries";
import { getApiErrorMessage } from "@services/api/errors";
import { notifyApp } from "@services/api/appNotifications";
import {
  AuthFormCard,
  AuthFormElement,
  AuthFormFooter,
  AuthFormHeader,
  AuthFormLink,
  AuthFormSubtitle,
  AuthFormTitle,
} from "./AuthForm.styles";
import { forgotPasswordFormSchema } from "@features/auth/schemas/auth.schemas";

export function ForgotPasswordForm() {
  const mutation = useForgotPasswordMutation();
  type FormInput = z.input<typeof forgotPasswordFormSchema>;
  type FormOutput = z.output<typeof forgotPasswordFormSchema>;
  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: { email: "" },
  });

  const handleSubmit = async ({ email }: FormOutput) => {
    try {
      await mutation.mutateAsync(email);
      notifyApp({
        type: "success",
        message: "Check your email",
        description: "You’ll receive a password reset link shortly.",
      });
    } catch (error) {
      notifyApp({ type: "error", message: "Could not send reset link", description: getApiErrorMessage(error) });
    }
  };

  return (
    <AuthFormCard>
      <AuthFormElement noValidate onSubmit={form.handleSubmit(handleSubmit)}>
        <AuthFormHeader>
          <AuthFormTitle>Forgot password?</AuthFormTitle>
          <AuthFormSubtitle>
            Enter the email address associated with your account and we’ll send a reset link.
          </AuthFormSubtitle>
        </AuthFormHeader>

        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormField
              label="Email address"
              htmlFor="forgot-email"
              validateStatus={fieldState.error ? "error" : undefined}
              help={fieldState.error?.message}
            >
              <Input
                {...field}
                id="forgot-email"
                type="email"
                placeholder="maya@example.com"
                autoComplete="email"
              />
            </FormField>
          )}
        />

        <Button
          type="primary"
          htmlType="submit"
          block
          loading={mutation.isPending || form.formState.isSubmitting}
        >
          Send reset link
        </Button>

        <AuthFormFooter>
          <Typography.Text>
            Remembered your password?{" "}
            <AuthFormLink as={Link} to={ROUTES.login}>
              Sign in
            </AuthFormLink>
          </Typography.Text>
        </AuthFormFooter>
      </AuthFormElement>
    </AuthFormCard>
  );
}
