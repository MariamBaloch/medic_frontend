import { Checkbox, Form } from "antd";
import styled from "styled-components";
import { colors } from "../../../theme/tokens";

interface AuthFormCardProps {
  $wide?: boolean;
}

export const AuthFormCard = styled.section<AuthFormCardProps>`
  width: min(100%, ${({ $wide }) => ($wide ? "600px" : "392px")});
  position: relative;
  z-index: 1;
  border: 1px solid rgba(224, 233, 230, 0.18);
  border-radius: 28px;
  padding: ${({ $wide }) => ($wide ? "clamp(28px, 4vw, 42px)" : "38px")};
  background: #f5f6f6;
  box-shadow: 0 30px 80px rgba(4, 22, 19, 0.34);
`;

export const RememberMeField = styled(Form.Item)`
  && {
    margin-bottom: 0;
  }
`;

export const RememberMeCheckbox = styled(Checkbox)`
  color: ${colors.textSecondary};
  font-size: 14px;

  .ant-checkbox-inner {
    width: 16px;
    height: 16px;
  }
`;

export const AuthFormHeader = styled.div`
  margin-bottom: 32px;
`;

export const AuthFormTitle = styled.h2`
  margin: 0;
  color: ${colors.text};
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(34px, 4vw, 42px);
  letter-spacing: -0.045em;
`;

export const AuthFormSubtitle = styled.p`
  margin: 10px 0 0;
  color: ${colors.textSecondary};
  font-size: 15px;
  line-height: 1.6;
`;

export const RegisterFieldsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 14px;
  align-items: start;

  @media (max-width: 460px) {
    grid-template-columns: 1fr;
  }
`;

export const AuthFormActions = styled.div`
  margin: 4px 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
`;

export const AuthFormLink = styled.a`
  color: ${colors.primary};
  font-size: 14px;
  font-weight: 800;
  text-decoration: none;

  &:hover {
    color: ${colors.primaryHover};
  }
`;

export const AuthFormFooter = styled.div`
  display: grid;
  gap: 16px;
  justify-items: center;
  margin-top: 22px;
  color: ${colors.textSecondary};
  font-size: 14px;

  a {
    color: ${colors.primary};
    font-size: 14px;
    font-weight: 800;
    text-decoration: none;

    &:hover {
      color: ${colors.primaryHover};
    }
  }
`;
