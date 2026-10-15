import styled from "styled-components";
import { colors } from "@theme/tokens";

interface AuthFormCardProps {
  $wide?: boolean;
}

export const AuthFormCard = styled.section<AuthFormCardProps>`
  width: min(100%, ${({ $wide }) => ($wide ? "600px" : "450px")});
  position: relative;
  z-index: 1;
  border: 1px solid color-mix(in srgb, ${colors.border} 18%, transparent);
  border-radius: 28px;
  padding: ${({ $wide }) => ($wide ? "clamp(28px, 4vw, 42px)" : "38px")};
  background: ${colors.background};
  box-shadow: 0 30px 80px color-mix(in srgb, ${colors.sidebar} 34%, transparent);
`;

export const AuthFormElement = styled.form`
  width: 100%;
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
  justify-content: flex-end;
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
