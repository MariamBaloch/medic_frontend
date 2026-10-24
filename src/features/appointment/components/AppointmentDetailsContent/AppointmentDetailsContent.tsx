import { CalendarOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";
import type {
  Appointment,
  AppointmentDetails,
  AppointmentStatusOption,
} from "@features/appointment/api/appointment.schemas";
import { AppointmentInformation } from "../AppointmentInformation";
import { AppointmentReasonPanel } from "../AppointmentReasonPanel";
import { ContentGrid, InformationColumn } from "./AppointmentDetailsContent.styles";
import { PageHeader } from "@components/PageHeader";

interface AppointmentDetailsContentProps {
  appointment: Appointment & Partial<AppointmentDetails>;
  statuses: AppointmentStatusOption[];
  personPanel: ReactNode;
  description?: string;
}

function hasValue(value: string | null | undefined): value is string {
  return value !== null && value !== undefined && value.trim() !== "";
}

export function AppointmentDetailsContent({
  appointment,
  statuses,
  personPanel,
  description = "View the full details of this appointment.",
}: AppointmentDetailsContentProps) {
  return (
    <>
      <PageHeader
        icon={<CalendarOutlined />}
        title="Appointment details"
        description={description}
        style={{ paddingBottom: 10 }}
      />
      <ContentGrid>
        {personPanel}
        <InformationColumn>
          <AppointmentInformation appointment={appointment} statuses={statuses} />
          <AppointmentReasonPanel
            title="Reason for visit"
            value={appointment.reason?.trim() || "No reason provided."}
          />
          {hasValue(appointment.cancelledReason) ? (
            <AppointmentReasonPanel
              title="Cancellation reason"
              value={appointment.cancelledReason.trim()}
              variant="danger"
            />
          ) : null}
        </InformationColumn>
      </ContentGrid>
    </>
  );
}
