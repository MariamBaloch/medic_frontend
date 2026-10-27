import type { ReactNode } from "react";
import type { StatusPillTone } from "./StatusPill.styles";
import { StyledStatusPill } from "./StatusPill.styles";

interface StatusPillProps {
  tone: StatusPillTone;
  textColor?: string;
  children: ReactNode;
}

export function StatusPill({ tone, textColor, children }: StatusPillProps) {
  return (
    <StyledStatusPill $tone={tone} $textColor={textColor}>
      {children}
    </StyledStatusPill>
  );
}
