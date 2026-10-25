import {
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Button, Typography } from "antd";
import dayjs from "dayjs";
import { PersonSummary } from "@components/PersonSummary";
import type { SelectedAppointmentTime } from "@components/WeekAvailability";
import type { Doctor } from "@features/booking/api/doctor.schemas";
import { formatAppointmentTimeRange, formatBookingFee } from "@utils/formatters";
import { StepTitle } from "../StepTitle";
import {
  ReviewDetail,
  ReviewDetailContent,
  ReviewDetailIcon,
  ReviewDetailsGrid,
  ReviewHeading,
  ReviewSection,
  ReviewSectionHeader,
  ReviewSectionTitle,
  ReviewStepContent,
  VisitReasonSummary,
} from "./ReviewAppointmentStep.styles";

interface ReviewAppointmentStepProps {
  doctor: Doctor | null;
  selectedTime: SelectedAppointmentTime | null;
  visitReason: string;
  onEditStep: (step: number) => void;
}

export function ReviewAppointmentStep({
  doctor,
  selectedTime,
  visitReason,
  onEditStep,
}: ReviewAppointmentStepProps) {
  const doctorName = doctor ? `${doctor.firstName} ${doctor.lastName}` : "Doctor not selected";
  const practiceLocation = [doctor?.doctor.hospitalAffiliation, doctor?.doctor.clinicAddress]
    .filter(Boolean)
    .join(" · ");

  return (
    <ReviewStepContent>
      <ReviewHeading>
        <StepTitle
          title="Review your appointment"
          description="Make sure everything looks right, then confirm your new visit."
        />
      </ReviewHeading>

      <ReviewSection>
        <ReviewSectionHeader>
          <ReviewSectionTitle>Your doctor</ReviewSectionTitle>
          <Button type="link" icon={<EditOutlined />} onClick={() => onEditStep(0)}>
            Edit doctor
          </Button>
        </ReviewSectionHeader>
        <PersonSummary
          type="doctor"
          name={doctorName}
          qualification={doctor?.doctor.qualification}
          specialization={doctor?.doctor.specialization?.name}
          imageUrl={doctor?.imageUrl ?? undefined}
          size={48}
        />
      </ReviewSection>

      <ReviewSection>
        <ReviewSectionHeader>
          <ReviewSectionTitle>Date, time &amp; location</ReviewSectionTitle>
          <Button type="link" icon={<EditOutlined />} onClick={() => onEditStep(1)}>
            Edit time
          </Button>
        </ReviewSectionHeader>
        <ReviewDetailsGrid>
          <ReviewDetail>
            <ReviewDetailIcon><CalendarOutlined /></ReviewDetailIcon>
            <ReviewDetailContent>
              <Typography.Text type="secondary">Full date</Typography.Text>
              <Typography.Text strong>
                {selectedTime ? dayjs(selectedTime.date).format("dddd, MMMM D, YYYY") : "Not selected"}
              </Typography.Text>
            </ReviewDetailContent>
          </ReviewDetail>
          <ReviewDetail>
            <ReviewDetailIcon><ClockCircleOutlined /></ReviewDetailIcon>
            <ReviewDetailContent>
              <Typography.Text type="secondary">Time &amp; duration</Typography.Text>
              <Typography.Text strong>
                {selectedTime
                  ? `${formatAppointmentTimeRange(selectedTime.time, selectedTime.endTime)} · ${selectedTime.durationMinutes} minutes`
                  : "Not selected"}
              </Typography.Text>
            </ReviewDetailContent>
          </ReviewDetail>
          <ReviewDetail>
            <ReviewDetailIcon><EnvironmentOutlined /></ReviewDetailIcon>
            <ReviewDetailContent>
              <Typography.Text type="secondary">Location</Typography.Text>
              <Typography.Text strong>{practiceLocation || "Location unavailable"}</Typography.Text>
            </ReviewDetailContent>
          </ReviewDetail>
          <ReviewDetail>
            <ReviewDetailIcon><DollarOutlined /></ReviewDetailIcon>
            <ReviewDetailContent>
              <Typography.Text type="secondary">Consultation fee</Typography.Text>
              <Typography.Text strong>{formatBookingFee(doctor?.doctor.consultationFee)}</Typography.Text>
            </ReviewDetailContent>
          </ReviewDetail>
        </ReviewDetailsGrid>
      </ReviewSection>

      <ReviewSection>
        <ReviewSectionHeader>
          <ReviewSectionTitle>Reason for appointment</ReviewSectionTitle>
          <Button type="link" icon={<EditOutlined />} onClick={() => onEditStep(2)}>
            Edit reason
          </Button>
        </ReviewSectionHeader>
        <VisitReasonSummary>
          <Typography.Text>{visitReason}</Typography.Text>
        </VisitReasonSummary>
      </ReviewSection>
    </ReviewStepContent>
  );
}
