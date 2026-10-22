import { Form } from "antd";
import type { FormProps } from "antd";
import type { ReactElement } from "react";
import styled from "styled-components";
import { colors } from "@theme/tokens";

type ProfileFormComponent = <Values = unknown>(props: FormProps<Values>) => ReactElement;

export const ProfileForm = styled(Form)`
  .ant-form-item-label > label {
    color: ${colors.text};
    font-weight: 600;
  }
` as unknown as ProfileFormComponent;
