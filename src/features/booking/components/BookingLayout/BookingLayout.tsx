import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Button, Divider, Flex, Steps, Typography } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppCard } from "@components/Card";
import { PageHeader } from "@components/PageHeader";
import type { SelectedAppointmentTime } from "@components/WeekAvailability";
import { ROUTES } from "@constants/routes";
import { useBookPatientAppointmentMutation } from "@features/patient/appointment/api/patientAppointmentsQueries";
import { useJoinPatientWaitlistMutation } from "@features/patient/waitlist/api/waitlistQueries";
import type { Doctor } from "@features/booking/api/doctor.schemas";
import { ChooseDoctorStep } from "@features/booking/components/ChooseDoctorStep";
import { ChooseTimeStep } from "@features/booking/components/ChooseTimeStep";
import { ReviewAppointmentStep } from "@features/booking/components/ReviewAppointmentStep";
import { VisitReasonStep } from "@features/booking/components/VisitReasonStep";
import { getApiErrorMessage } from "@services/api/errors";
import { showApiAlert } from "@services/api/appAlerts";
import { colors } from "@theme/tokens";
import {
  formatAppointmentDate,
  formatAppointmentTimeRange,
  formatBookingFee,
} from "@utils/formatters";
import { BookingStepsCard } from "./BookingLayout.styles";

const { Text } = Typography;

export function BookingLayout() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTime, setSelectedTime] = useState<SelectedAppointmentTime | null>(null);
  const [visitReason, setVisitReason] = useState("");
  const bookingMutation = useBookPatientAppointmentMutation();
  const joinWaitlistMutation = useJoinPatientWaitlistMutation();
  const navigate = useNavigate();
  const isWaitlistSelection =
    selectedTime?.status === "BOOKED" || selectedTime?.status === "WAITLIST_OFFERED";

  const canVisitStep = (step: number) =>
    (step <= 0 || selectedDoctor !== null) &&
    (step <= 1 || selectedTime !== null) &&
    (step <= 2 || isWaitlistSelection || visitReason.trim().length > 0);

  const handleSelectTime = (selection: SelectedAppointmentTime) => {
    if (selection.patientHasOverlappingAppointment) {
      showApiAlert({
        type: "warning",
        message: "This time conflicts with an appointment",
        description: "You already have an appointment that overlaps this time.",
      });
      return;
    }

    if (
      (selection.status === "BOOKED" || selection.status === "WAITLIST_OFFERED") &&
      !selection.canJoinWaitlist
    ) {
      const description = selection.patientHasOverlappingAppointment
        ? "You already have an appointment that overlaps this time."
        : selection.patientHasActiveWaitlistEntry
          ? "You already have an active waitlist entry for this time."
          : "This slot is not accepting additional waitlist entries.";
      showApiAlert({ type: "warning", message: "You cannot join this waitlist", description });
      return;
    }

    if (selection.status === "BOOKED" || selection.status === "WAITLIST_OFFERED") {
      setVisitReason("");
    }
    setSelectedTime(selection);
  };

  const confirmAppointment = async () => {
    if (!selectedDoctor || !selectedTime || !visitReason.trim() || isWaitlistSelection) return;

    try {
      const appointment = await bookingMutation.mutateAsync({
        doctorId: selectedDoctor.doctor.doctorProfileId,
        date: dayjs(selectedTime.date).format("DD/MM/YYYY"),
        startTime: selectedTime.time,
        reason: visitReason.trim(),
      });
      const location = [
        selectedDoctor.doctor.hospitalAffiliation,
        selectedDoctor.doctor.clinicAddress,
      ]
        .filter(Boolean)
        .join(" · ");

      showApiAlert({
        type: "success",
        message: "Appointment confirmed",
        description: [
          appointment.doctorName,
          `${formatAppointmentDate(appointment.appointmentDate)} · ${formatAppointmentTimeRange(appointment.startTime, appointment.endTime)}`,
          location,
          `Fee: ${formatBookingFee(appointment.bookingFee)}`,
        ]
          .filter(Boolean)
          .join(" · "),
      });
      navigate(ROUTES.patientAppointments);
    } catch {
      return;
    }
  };

  const confirmWaitlist = async () => {
    if (
      !selectedDoctor ||
      !selectedTime ||
      !isWaitlistSelection ||
      selectedTime.canJoinWaitlist !== true
    ) {
      return;
    }

    try {
      await joinWaitlistMutation.mutateAsync({
        doctorId: selectedDoctor.doctor.doctorProfileId,
        date: dayjs(selectedTime.date).format("DD/MM/YYYY"),
        startTime: selectedTime.time,
      });
      showApiAlert({
        type: "success",
        message: "Joined the waitlist",
        description:
          "You will receive an offer if this time becomes available. Joining the waitlist does not book an appointment immediately.",
      });
      navigate(ROUTES.patientWaitlist);
    } catch (error) {
      showApiAlert({
        type: "error",
        message: "Could not join the waitlist",
        description: getApiErrorMessage(error),
      });
    }
  };

  const doctorStep = {
    title: "Choose doctor",
    content: (
      <ChooseDoctorStep
        selectedDoctorId={selectedDoctor?.userId ?? null}
        onSelectDoctor={(doctor) => {
          setSelectedDoctor(doctor);
          setSelectedTime(null);
        }}
      />
    ),
  };
  const timeStep = {
    title: "Choose time",
    content: (
      <ChooseTimeStep
        doctorId={selectedDoctor?.doctor.doctorProfileId ?? null}
        selectedTime={selectedTime}
        onSelectTime={handleSelectTime}
      />
    ),
  };
  const reviewStep = {
    title: "Review waitlist",
    content: (
      <ReviewAppointmentStep
        doctor={selectedDoctor}
        selectedTime={selectedTime}
        visitReason={visitReason}
        isWaitlist={isWaitlistSelection}
        onEditStep={setCurrentStep}
      />
    ),
  };
  const steps = isWaitlistSelection
    ? [doctorStep, timeStep, reviewStep]
    : [
        doctorStep,
        timeStep,
        {
          title: "Visit reason",
          content: <VisitReasonStep reason={visitReason} onReasonChange={setVisitReason} />,
        },
        {
          title: "Review appointment",
          content: reviewStep.content,
        },
      ];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const previousStep = steps[currentStep - 1];
  const nextStep = steps[currentStep + 1];

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: 10 }}
        separator=">"
        items={[
          { title: <Link to={ROUTES.patientAppointments}>Appointments</Link> },
          {
            title: (
              <Text strong style={{ color: colors.primary }}>
                Book an appointment
              </Text>
            ),
          },
        ]}
      />

      <PageHeader
        title="Book an appointment"
        description="Find the right care, at a time that works for you."
        action={
          <>
            <SafetyOutlined style={{ color: colors.primary }} />{" "}
            <Text type="secondary">Secure booking</Text>
          </>
        }
      />

      <BookingStepsCard>
        <Steps
          current={currentStep}
          size="small"
          titlePlacement="horizontal"
          onChange={(step) => {
            if (canVisitStep(step)) setCurrentStep(step);
          }}
          items={steps.map((step, index) => ({
            disabled: index > currentStep && !canVisitStep(index),
            title:
              index === currentStep ? (
                <Text strong style={{ color: colors.primary }}>
                  {step.title}
                </Text>
              ) : (
                step.title
              ),
            description: (
              <Text type="secondary" style={{ fontSize: 10 }}>
                {index === currentStep ? "Current step" : "Up next"}
              </Text>
            ),
          }))}
        />
      </BookingStepsCard>
      <AppCard>
        <Text strong style={{ fontSize: 10, color: colors.primary }}>
          STEP {currentStep + 1} OF {steps.length}
        </Text>
        {steps[currentStep].content}
      </AppCard>

      <Divider />
      <Flex justify="space-between" align="center">
        <Button
          variant="outlined"
          color="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() =>
            isFirstStep ? navigate(ROUTES.patientAppointments) : setCurrentStep((step) => step - 1)
          }
        >
          {isFirstStep ? "Back to appointments" : `Back to ${previousStep?.title.toLowerCase()}`}
        </Button>
        {!isLastStep && nextStep ? (
          <Button
            icon={<ArrowRightOutlined />}
            iconPlacement="end"
            type="primary"
            disabled={!canVisitStep(currentStep + 1)}
            onClick={() => setCurrentStep((step) => step + 1)}
          >
            Continue to {nextStep.title.toLowerCase()}
          </Button>
        ) : isLastStep && isWaitlistSelection ? (
          <Button
            type="primary"
            icon={<ClockCircleOutlined />}
            loading={joinWaitlistMutation.isPending}
            disabled={!selectedDoctor || !selectedTime || selectedTime.canJoinWaitlist !== true}
            onClick={() => void confirmWaitlist()}
          >
            Join Waitlist
          </Button>
        ) : isLastStep ? (
          <Button
            type="primary"
            icon={<CalendarOutlined />}
            loading={bookingMutation.isPending}
            disabled={!selectedDoctor || !selectedTime || !visitReason.trim()}
            onClick={() => void confirmAppointment()}
          >
            Confirm appointment
          </Button>
        ) : null}
      </Flex>
    </>
  );
}
