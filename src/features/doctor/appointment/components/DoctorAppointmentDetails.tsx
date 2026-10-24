import type {
  Appointment,
  AppointmentDetails,
  AppointmentStatusOption,
} from "@features/appointment/api/appointment.schemas";
import { AppointmentDetailsContent } from "@features/appointment/components/AppointmentDetailsContent";
import { AppointmentPatientDetails } from "@features/appointment/components/AppointmentPatientDetails";

interface DoctorAppointmentDetailsProps {
  appointment: Appointment & Partial<AppointmentDetails>;
  statuses: AppointmentStatusOption[];
}

export function DoctorAppointmentDetails({ appointment, statuses }: DoctorAppointmentDetailsProps) {
  return (
    <AppointmentDetailsContent
      appointment={appointment}
      statuses={statuses}
      personPanel={<AppointmentPatientDetails appointment={appointment} />}
      description="Review the details for your patient appointment."
    />
  );
}
