import type { ReactNode } from "react";
import { Space } from "antd";
import {
  AmbientCircle,
  Brand,
  BrandKicker,
  BrandName,
  FeatureCard,
  FeatureGrid,
  FormPanel,
  GlobalStyle,
  HeroContent,
  HeroEyebrow,
  HeroPanel,
  HeroSubtitle,
  HeroTitle,
  LoginPageShell,
  PageColumn,
  SecurePill,
  TopBar,
} from "./AuthLayout.styles";
import { AppBrandIcon } from "@components/AppBrandIcon";

const features = [
  "Book appointments in minutes",
  "Access visit details securely",
  "Manage your care from one place",
];

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <GlobalStyle />
      <LoginPageShell>
        <PageColumn>
          <TopBar>
            <Brand>
              <AppBrandIcon />
              <Space direction="vertical" size={0}>
                <BrandName>Medic</BrandName>
                <BrandKicker>Health made easy</BrandKicker>
              </Space>
            </Brand>
            <SecurePill>Secure sign in</SecurePill>
          </TopBar>

          <HeroPanel>
            <AmbientCircle $position="top" />
            <AmbientCircle $position="bottom" />

            <HeroContent>
              <HeroEyebrow>{today}</HeroEyebrow>
              <HeroTitle>Your care, coordinated with clarity.</HeroTitle>
              <HeroSubtitle>
                Sign in to book appointments, review visit details, and stay connected with your
                care team.
              </HeroSubtitle>

              <FeatureGrid>
                {features.map((feature) => (
                  <FeatureCard key={feature}>{feature}</FeatureCard>
                ))}
              </FeatureGrid>
            </HeroContent>
          </HeroPanel>
        </PageColumn>

        <FormPanel>{children}</FormPanel>
      </LoginPageShell>
    </>
  );
}
