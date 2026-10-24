import type {
  Appointment,
  AppointmentDetails,
  AppointmentStatusOption,
} from "@features/appointment/api/appointment.schemas";
import { AppointmentDetailsContent } from "@features/appointment/components/AppointmentDetailsContent";
import { AppointmentDoctorDetails } from "@features/appointment/components/AppointmentDoctorDetails";

interface PatientAppointmentDetailsProps {
  appointment: Appointment & Partial<AppointmentDetails>;
  statuses: AppointmentStatusOption[];
}

export function PatientAppointmentDetails({
  appointment,
  statuses,
}: PatientAppointmentDetailsProps) {
  return (
    <AppointmentDetailsContent
      appointment={appointment}
      statuses={statuses}
      personPanel={<AppointmentDoctorDetails appointment={appointment} />}
      description="View the full details of your appointment."
    />
  );
}
