import { createGlobalStyle, styled } from "styled-components";
import { colors } from "@theme/tokens";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-width: 320px;
    min-height: 100vh;
    color: ${colors.text};
    background: ${colors.background};
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  button, input {
    font: inherit;
  }
`;

export const LoginPageShell = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(420px, 0.95fr);
  background:
    radial-gradient(
      circle at 12% 18%,
      color-mix(in srgb, ${colors.tealLight} 45%, transparent),
      transparent 26rem
    ),
    linear-gradient(
      135deg,
      ${colors.backgroundSoft} 0%,
      ${colors.background} 48%,
      ${colors.backgroundTint} 100%
    );

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const PageColumn = styled.section`
  min-height: 100vh;
  padding: 36px clamp(24px, 5vw, 72px);
  display: flex;
  flex-direction: column;
  gap: 56px;
`;

export const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

export const Brand = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
`;

export const BrandName = styled.p`
  margin: 0;
  color: ${colors.text};
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

export const BrandKicker = styled.span`
  color: ${colors.textSecondary};
  display: block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

export const SecurePill = styled.div`
  border: 1px solid ${colors.border};
  border-radius: 999px;
  color: ${colors.primary};
  background: color-mix(in srgb, ${colors.surface} 72%, transparent);
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 700;

  &::before {
    content: "▣";
    margin-right: 8px;
  }
`;

export const HeroPanel = styled.div`
  position: relative;
  overflow: hidden;
  flex: 1;
  border: 1px solid ${colors.border};
  border-radius: 32px;
  padding: clamp(28px, 5vw, 56px);
  display: grid;
  align-content: center;
  gap: 36px;
  background:
    linear-gradient(
      140deg,
      color-mix(in srgb, ${colors.surface} 92%, transparent),
      color-mix(in srgb, ${colors.surface} 68%, transparent)
    ),
    ${colors.surface};
  box-shadow: 0 28px 70px color-mix(in srgb, ${colors.sidebar} 9%, transparent);
`;

export const AmbientCircle = styled.div<{ $position: "top" | "bottom" }>`
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 999px;
  background: ${({ $position }) => ($position === "top" ? colors.tealLight : colors.primary)};
  opacity: ${({ $position }) => ($position === "top" ? 0.28 : 0.1)};
  filter: blur(2px);
  top: ${({ $position }) => ($position === "top" ? "-120px" : "auto")};
  right: ${({ $position }) => ($position === "top" ? "-72px" : "auto")};
  bottom: ${({ $position }) => ($position === "bottom" ? "-140px" : "auto")};
  left: ${({ $position }) => ($position === "bottom" ? "-80px" : "auto")};
`;

export const HeroContent = styled.div`
  position: relative;
  max-width: 680px;
`;

export const HeroEyebrow = styled.p`
  margin: 0 0 12px;
  color: ${colors.primary};
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const HeroTitle = styled.h1`
  margin: 0;
  color: ${colors.text};
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(42px, 6vw, 76px);
  line-height: 0.95;
  letter-spacing: -0.055em;
`;

export const HeroSubtitle = styled.p`
  max-width: 560px;
  margin: 24px 0 0;
  color: ${colors.textSecondary};
  font-size: clamp(16px, 1.5vw, 19px);
  line-height: 1.7;
`;

export const FeatureGrid = styled.div`
  position: relative;
  margin-top: 34px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const FeatureCard = styled.div`
  min-height: 94px;
  border: 1px solid ${colors.border};
  border-radius: 18px;
  padding: 18px;
  color: ${colors.text};
  background: color-mix(in srgb, ${colors.surface} 72%, transparent);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.45;

  &::before {
    content: "✓";
    width: 24px;
    height: 24px;
    margin-bottom: 12px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    color: ${colors.surface};
    background: ${colors.primary};
    font-size: 12px;
  }
`;

export const FormPanel = styled.aside`
  min-height: 100vh;
  padding: 36px clamp(20px, 4vw, 56px);
  display: grid;
  place-items: center;
  background: ${colors.sidebar};
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 24px;
    border: 1px solid color-mix(in srgb, ${colors.tealLight} 16%, transparent);
    border-radius: 32px;
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    width: 320px;
    height: 320px;
    right: -120px;
    bottom: -120px;
    border-radius: 999px;
    background: color-mix(in srgb, ${colors.teal} 18%, transparent);
  }
`;
