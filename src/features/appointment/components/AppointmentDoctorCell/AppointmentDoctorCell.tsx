import { PersonSummary } from "@components/PersonSummary";
import type { Appointment } from "@features/appointment/api/appointment.schemas";
import { useDoctorProfileImage } from "@features/appointment/api/profileImages";

interface AppointmentDoctorCellProps {
  appointment: Appointment;
  size?: number;
  specializationFallback?: string;
}

export function AppointmentDoctorCell({
  appointment,
  size,
  specializationFallback,
}: AppointmentDoctorCellProps) {
  const imageUrl = useDoctorProfileImage(
    appointment.id,
    appointment.doctorId,
    appointment.doctorImageUrl,
  );

  return (
    <PersonSummary
      type="doctor"
      name={appointment.doctorName}
      qualification={appointment.doctorQualification}
      specialization={appointment.specialization?.name ?? specializationFallback}
      imageUrl={imageUrl}
      size={size}
    />
  );
}
