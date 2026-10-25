import { PersonSummary } from "@components/PersonSummary";
import type { Appointment } from "@features/appointment/api/appointment.schemas";

export function AppointmentPatientCell({ appointment }: { appointment: Appointment }) {
  return (
    <PersonSummary
      type="patient"
      name={appointment.patientName}
      imageUrl={appointment.patientImageUrl}
      imageBackground="tinted"
    />
  );
}
