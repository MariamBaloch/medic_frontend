import { Button } from "antd";
import type { ComponentProps } from "react";
import { waitlistButtonStyle } from "./WaitlistButton.styles";

export function WaitlistButton({ style, ...props }: ComponentProps<typeof Button>) {
  return <Button {...props} size="small" style={{ ...style, ...waitlistButtonStyle }} />;
}
