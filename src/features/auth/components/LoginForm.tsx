import { Button, Checkbox, Form, Input, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { FormField } from "@components/FormField";
import { startDemoSession } from "@features/auth/authSession";
import {
  AuthFormCard,
  AuthFormActions,
  AuthFormFooter,
  AuthFormHeader,
  AuthFormLink,
  AuthFormSubtitle,
  AuthFormTitle,
  RememberMeField,
} from "./AuthForm.styles";

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export function LoginForm() {
  const navigate = useNavigate();

  const handleFinish = () => {
    // Temporary UI-only session until the login API is connected.
    startDemoSession();
    navigate("/patient/overview", { replace: true });
  };

  return (
    <AuthFormCard>
      <Form<LoginFormValues> layout="vertical" requiredMark={false} onFinish={handleFinish}>
        <AuthFormHeader>
          <AuthFormTitle>Welcome back</AuthFormTitle>
          <AuthFormSubtitle>Use your portal details to continue.</AuthFormSubtitle>
        </AuthFormHeader>

        <FormField
          $compact
          label="Email address"
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter a valid email address" },
          ]}
        >
          <Input placeholder="maya@example.com" type="email" autoComplete="email" />
        </FormField>

        <FormField
          $compact
          label="Password"
          name="password"
          rules={[{ required: true, message: "Password is required" }]}
        >
          <Input.Password placeholder="Enter your password" autoComplete="current-password" />
        </FormField>

        <AuthFormActions>
          <RememberMeField name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </RememberMeField>
          <AuthFormLink as={Link} to="/forgot-password">
            Forgot password?
          </AuthFormLink>
        </AuthFormActions>

        <Button type="primary" htmlType="submit" block>
          Sign in
        </Button>

        <AuthFormFooter>
          <Typography.Text>
            New to Medic?{" "}
            <AuthFormLink as={Link} to="/register">
              Create an account
            </AuthFormLink>
          </Typography.Text>
        </AuthFormFooter>
      </Form>
    </AuthFormCard>
  );
}
