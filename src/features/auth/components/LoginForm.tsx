import { Button, Form, Input } from "antd";
import { FormField } from "../../../components/FormField";
import {
  AuthFormCard,
  AuthFormActions,
  AuthFormFooter,
  AuthFormHeader,
  AuthFormLink,
  AuthFormSubtitle,
  AuthFormTitle,
  RememberMeCheckbox,
  RememberMeField,
} from "./AuthForm.styles";

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export function LoginForm() {
  return (
    <AuthFormCard>
      <Form<LoginFormValues> layout="vertical" requiredMark={false}>
        <AuthFormHeader>
          <AuthFormTitle>Welcome back</AuthFormTitle>
          <AuthFormSubtitle>Use your patient portal details to continue.</AuthFormSubtitle>
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
            <RememberMeCheckbox>Remember me</RememberMeCheckbox>
          </RememberMeField>
          <AuthFormLink href="#forgot-password">Forgot password?</AuthFormLink>
        </AuthFormActions>

        <Button type="primary" htmlType="submit" block>
          Sign in
        </Button>

        <AuthFormFooter>
          <span>
            New to Medic? <AuthFormLink href="#register">Create an account</AuthFormLink>
          </span>
        </AuthFormFooter>
      </Form>
    </AuthFormCard>
  );
}
