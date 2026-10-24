import { Button, Input, Typography } from "antd";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { FormField } from "@components/FormField/FormField";
import { ROUTES } from "@constants/routes";
import { useLoginMutation } from "@features/auth/api/authQueries";
import { loginRequestSchema } from "@features/auth/schemas/auth.schemas";
import {
  AuthFormCard,
  AuthFormActions,
  AuthFormElement,
  AuthFormFooter,
  AuthFormHeader,
  AuthFormLink,
  AuthFormSubtitle,
  AuthFormTitle,
} from "./AuthForm.styles";

export function LoginForm() {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();
  type LoginInput = z.input<typeof loginRequestSchema>;
  type LoginOutput = z.output<typeof loginRequestSchema>;
  const form = useForm<LoginInput, unknown, LoginOutput>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleSubmit = async ({ email, password }: LoginOutput) => {
    try {
      await loginMutation.mutateAsync({ email, password });
      navigate(ROUTES.app, { replace: true });
    } catch {
      return;
    }
  };

  return (
    <AuthFormCard>
      <AuthFormElement noValidate onSubmit={form.handleSubmit(handleSubmit)}>
        <AuthFormHeader>
          <AuthFormTitle>Welcome back</AuthFormTitle>
          <AuthFormSubtitle>Use your portal details to continue.</AuthFormSubtitle>
        </AuthFormHeader>

        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormField
              $compact
              label="Email address"
              htmlFor="login-email"
              validateStatus={fieldState.error ? "error" : undefined}
              help={fieldState.error?.message}
            >
              <Input
                {...field}
                id="login-email"
                type="email"
                placeholder="maya@example.com"
                autoComplete="email"
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
              htmlFor="login-password"
              validateStatus={fieldState.error ? "error" : undefined}
              help={fieldState.error?.message}
            >
              <Input.Password
                {...field}
                id="login-password"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </FormField>
          )}
        />

        <AuthFormActions>
          <AuthFormLink as={Link} to={ROUTES.forgotPassword}>
            Forgot password?
          </AuthFormLink>
        </AuthFormActions>

        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loginMutation.isPending || form.formState.isSubmitting}
        >
          Sign in
        </Button>

        <AuthFormFooter>
          <Typography.Text>
            New to Medic?{" "}
            <AuthFormLink as={Link} to={ROUTES.register}>
              Create an account
            </AuthFormLink>
          </Typography.Text>
        </AuthFormFooter>
      </AuthFormElement>
    </AuthFormCard>
  );
}
