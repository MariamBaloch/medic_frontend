import {
  MedicineBoxOutlined,
  UserOutlined
} from "@ant-design/icons";
import type { ReactNode } from "react";
import type {
  Appointment,
  AppointmentDetails,
} from "@features/appointment/api/appointment.schemas";
import { PersonSummary } from "@components/PersonSummary";
import {
  PatientCard,
  PatientDetailContent,
  PatientDetailIcon,
  PatientDetailLabel,
  PatientDetailsList,
  PatientDetailRow,
  PatientDetailValue,
  PatientSectionTitle,
  PatientSummaryHeader,
} from "./AppointmentPatientDetails.styles";

interface PatientField {
  icon: ReactNode;
  label: string;
  value: string | number | null | undefined;
}

function PatientField({ icon, label, value }: PatientField) {
  if (value === null || value === undefined || String(value).trim() === "") return null;

  return (
    <PatientDetailRow>
      <PatientDetailIcon>{icon}</PatientDetailIcon>
      <PatientDetailContent>
        <PatientDetailLabel type="secondary">{label}</PatientDetailLabel>
        <PatientDetailValue>{value}</PatientDetailValue>
      </PatientDetailContent>
    </PatientDetailRow>
  );
}

interface AppointmentPatientDetailsProps {
  appointment: Appointment & Partial<AppointmentDetails>;
}

export function AppointmentPatientDetails({ appointment }: AppointmentPatientDetailsProps) {
  const fields: PatientField[] = [
    { icon: <MedicineBoxOutlined />, label: "Blood type", value: appointment.patientBloodType },
    {
      icon: <UserOutlined />,
      label: "Height",
      value: appointment.patientHeightCm != null ? `${appointment.patientHeightCm} cm` : null,
    },
    {
      icon: <UserOutlined />,
      label: "Weight",
      value: appointment.patientWeightKg != null ? `${appointment.patientWeightKg} kg` : null,
    },
    { icon: <MedicineBoxOutlined />, label: "Allergies", value: appointment.patientAllergies },
    {
      icon: <MedicineBoxOutlined />,
      label: "Chronic conditions",
      value: appointment.patientChronicConditions,
    },
  ];

  return (
    <PatientCard>
      <PatientSectionTitle level={4}>Patient details</PatientSectionTitle>
      <PatientSummaryHeader>
        <PersonSummary
          type="patient"
          name={appointment.patientName}
          imageUrl={appointment.patientImageUrl}
          size={60}
          gap={14}
          nameFontSize={16}
          imageBackground="tinted"
          avatarFallback={<UserOutlined />}
        />
      </PatientSummaryHeader>
      <PatientDetailsList>
        {fields.map((field) => (
          <PatientField key={field.label} {...field} />
        ))}
      </PatientDetailsList>
    </PatientCard>
  );
}
