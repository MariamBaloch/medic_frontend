import {
  BankOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  InfoCircleOutlined,
  MedicineBoxOutlined,
  SafetyCertificateOutlined,
  StarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";
import type {
  Appointment,
  AppointmentDetails,
} from "@features/appointment/api/appointment.schemas";
import { getDoctorDisplayName } from "@utils/formatters";
import {
  BioHeading,
  BioText,
  BioTitle,
  DoctorAvatar,
  DoctorBio,
  DoctorCard,
  DoctorDetailContent,
  DoctorDetailIcon,
  DoctorDetailRow,
  DoctorDetailsList,
  DoctorHeader,
  DoctorIdentity,
  DoctorName,
  DoctorSpecialization,
  DetailLabel,
  DetailValue,
  SectionTitle,
} from "./AppointmentDoctorDetails.styles";

interface DoctorDetailItemProps {
  icon: ReactNode;
  label: string;
  value: string | number | null | undefined;
}

function hasValue(value: string | number | null | undefined): boolean {
  return value !== null && value !== undefined && String(value).trim() !== "";
}

function DoctorDetailItem({ icon, label, value }: DoctorDetailItemProps) {
  if (!hasValue(value)) return null;

  return (
    <DoctorDetailRow>
      <DoctorDetailIcon>{icon}</DoctorDetailIcon>
      <DoctorDetailContent>
        <DetailLabel type="secondary">{label}</DetailLabel>
        <DetailValue>{value}</DetailValue>
      </DoctorDetailContent>
    </DoctorDetailRow>
  );
}

interface AppointmentDoctorDetailsProps {
  appointment: Appointment & Partial<AppointmentDetails>;
}

export function AppointmentDoctorDetails({ appointment }: AppointmentDoctorDetailsProps) {
  const doctorDetails: DoctorDetailItemProps[] = [
    {
      icon: <SafetyCertificateOutlined />,
      label: "Qualification",
      value: appointment.doctorQualification,
    },
    {
      icon: <MedicineBoxOutlined />,
      label: "Specialization",
      value: appointment.specialization?.name,
    },
    {
      icon: <StarOutlined />,
      label: "Years of experience",
      value:
        appointment.doctorYearsOfExperience != null
          ? `${appointment.doctorYearsOfExperience} ${appointment.doctorYearsOfExperience === 1 ? "year" : "years"}`
          : null,
    },
    {
      icon: <BankOutlined />,
      label: "Hospital affiliation",
      value: appointment.doctorHospitalAffiliation,
    },
    {
      icon: <EnvironmentOutlined />,
      label: "Clinic address",
      value: appointment.doctorClinicAddress,
    },
    { icon: <IdcardOutlined />, label: "License number", value: appointment.doctorLicenseNumber },
  ];
  const doctorName = getDoctorDisplayName(appointment.doctorName, appointment.doctorQualification);

  return (
    <DoctorCard>
      <SectionTitle level={4}>Doctor details</SectionTitle>
      <DoctorHeader>
        <DoctorAvatar
          size={60}
          src={appointment.doctorImageUrl || undefined}
          icon={<UserOutlined />}
        />
        <DoctorIdentity>
          <DoctorName level={5}>{doctorName}</DoctorName>
          <DoctorSpecialization type="secondary">
            {appointment.specialization?.name ?? "Specialization unavailable"}
          </DoctorSpecialization>
        </DoctorIdentity>
      </DoctorHeader>
      <DoctorDetailsList>
        {doctorDetails.map((detail) => (
          <DoctorDetailItem key={detail.label} {...detail} />
        ))}
      </DoctorDetailsList>
      {hasValue(appointment.doctorBio) ? (
        <DoctorBio>
          <BioHeading>
            <InfoCircleOutlined />
            <BioTitle strong>About the doctor</BioTitle>
          </BioHeading>
          <BioText type="secondary">{appointment.doctorBio}</BioText>
        </DoctorBio>
      ) : null}
    </DoctorCard>
  );
}
