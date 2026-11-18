import { PersonSummary } from "@components/PersonSummary";
import type { Appointment } from "@features/appointment/api/appointment.schemas";
import { usePatientProfileImage } from "@features/appointment/api/profileImages";

export function AppointmentPatientCell({ appointment }: { appointment: Appointment }) {
  const imageUrl = usePatientProfileImage(appointment.id, appointment.patientImageUrl);

  return (
    <PersonSummary
      type="patient"
      name={appointment.patientName}
      imageUrl={imageUrl}
      imageBackground="tinted"
    />
  );
}
