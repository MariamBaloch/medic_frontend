import { FileTextOutlined } from "@ant-design/icons";
import {
  ReasonCard,
  ReasonHeading,
  ReasonIcon,
  ReasonTitle,
  ReasonValue,
  ReasonValueBox,
} from "./AppointmentReasonPanel.styles";

interface AppointmentReasonPanelProps {
  title: string;
  value: string;
  variant?: "default" | "danger";
}

export function AppointmentReasonPanel({
  title,
  value,
  variant = "default",
}: AppointmentReasonPanelProps) {
  const isDanger = variant === "danger";

  return (
    <ReasonCard>
      <ReasonHeading>
        <ReasonIcon $danger={isDanger}>
          <FileTextOutlined />
        </ReasonIcon>
        <ReasonTitle level={5}>{title}</ReasonTitle>
      </ReasonHeading>
      <ReasonValueBox $danger={isDanger}>
        <ReasonValue>{value}</ReasonValue>
      </ReasonValueBox>
    </ReasonCard>
  );
}
