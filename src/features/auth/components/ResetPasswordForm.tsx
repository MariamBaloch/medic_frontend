import { Alert, Button, Input, Typography, message } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FormField } from "@components/FormField";
import { ROUTES } from "@constants/routes";
import { useResetPasswordMutation } from "@features/auth/api/authQueries";
import { getApiErrorMessage } from "@services/api/errors";
import {
  AuthFormCard,
  AuthFormElement,
  AuthFormFooter,
  AuthFormHeader,
  AuthFormLink,
  AuthFormSubtitle,
  AuthFormTitle,
} from "./AuthForm.styles";
import { resetPasswordFormSchema } from "@features/auth/schemas/auth.schemas";

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mutation = useResetPasswordMutation();
  const token = searchParams.get("token")?.trim();
  type FormInput = z.input<typeof resetPasswordFormSchema>;
  type FormOutput = z.output<typeof resetPasswordFormSchema>;
  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const handleSubmit = async ({ newPassword }: FormOutput) => {
    if (!token) return;

    try {
      await mutation.mutateAsync({ token, newPassword });
      message.success("Your password has been reset. Sign in with your new password.");
      navigate(ROUTES.login, { replace: true });
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  return (
    <AuthFormCard>
      <AuthFormElement noValidate onSubmit={form.handleSubmit(handleSubmit)}>
        <AuthFormHeader>
          <AuthFormTitle>Reset password</AuthFormTitle>
          <AuthFormSubtitle>Create a new password for your Medic account.</AuthFormSubtitle>
        </AuthFormHeader>

        {!token ? (
          <Alert
            type="warning"
            showIcon
            message="Reset link is missing or invalid"
            description="Request a new password reset link to continue."
            style={{ marginBottom: 20 }}
          />
        ) : null}

        <Controller
          control={form.control}
          name="newPassword"
          render={({ field, fieldState }) => (
            <FormField
              $compact
              label="New password"
              htmlFor="reset-new-password"
              validateStatus={fieldState.error ? "error" : undefined}
              help={fieldState.error?.message}
            >
              <Input.Password
                {...field}
                id="reset-new-password"
                placeholder="Create a new password"
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
              label="Confirm new password"
              htmlFor="reset-confirm-password"
              validateStatus={fieldState.error ? "error" : undefined}
              help={fieldState.error?.message}
            >
              <Input.Password
                {...field}
                id="reset-confirm-password"
                placeholder="Confirm your new password"
                autoComplete="new-password"
              />
            </FormField>
          )}
        />

        <Button
          type="primary"
          htmlType="submit"
          block
          disabled={!token}
          loading={mutation.isPending || form.formState.isSubmitting}
        >
          Reset password
        </Button>

        <AuthFormFooter>
          <Typography.Text>
            Need another link? <AuthFormLink as={Link} to={ROUTES.forgotPassword}>Request a reset</AuthFormLink>
          </Typography.Text>
        </AuthFormFooter>
      </AuthFormElement>
    </AuthFormCard>
  );
}
