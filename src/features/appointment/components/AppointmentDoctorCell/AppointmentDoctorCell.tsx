import { DoctorSummary } from "@components/DoctorSummary";
import type { Appointment } from "@features/appointment/api/appointment.schemas";

interface AppointmentDoctorCellProps {
  appointment: Appointment;
}

export function AppointmentDoctorCell({ appointment }: AppointmentDoctorCellProps) {
  return (
    <DoctorSummary
      name={appointment.doctorName}
      qualification={appointment.doctorQualification}
      specialization={appointment.specialization?.name}
      imageUrl={appointment.doctorImageUrl ?? undefined}
    />
  );
}
