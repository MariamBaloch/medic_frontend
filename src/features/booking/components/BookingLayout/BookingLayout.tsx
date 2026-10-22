import { Breadcrumb, Button, Divider, Flex, Steps, Typography } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@constants/routes";
import { colors } from "@theme/tokens";
import { PageHeader } from "@components/PageHeader";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { ChooseDoctorStep } from "@features/booking/components/ChooseDoctorStep";
import { ChooseTimeStep } from "@features/booking/components/ChooseTimeStep";
import { VisitReasonStep } from "@features/booking/components/VisitReasonStep";
import { ReviewAppointmentStep } from "@features/booking/components/ReviewAppointmentStep";
import { BookingStepsCard } from "./BookingLayout.styles";
import { AppCard } from "@components/Card";
import type { SelectedAppointmentTime } from "@components/WeekAvailability";
import type { Doctor } from "@features/booking/api/doctor.schemas";
import { useBookPatientAppointmentMutation } from "@features/appointment/api/appointmentsQueries";
import { notifyApp } from "@services/api/appNotifications";
import { getApiErrorMessage } from "@services/api/errors";
import {
  formatAppointmentDate,
  formatAppointmentTimeRange,
  formatBookingFee,
} from "@utils/formatters";

const { Text } = Typography;

export function BookingLayout() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTime, setSelectedTime] = useState<SelectedAppointmentTime | null>(null);
  const [visitReason, setVisitReason] = useState("");
  const bookingMutation = useBookPatientAppointmentMutation();
  const navigate = useNavigate();
  const canVisitStep = (step: number) =>
    (step <= 0 || selectedDoctor !== null) &&
    (step <= 1 || selectedTime !== null) &&
    (step <= 2 || visitReason.trim().length > 0);

  const confirmAppointment = async () => {
    if (!selectedDoctor || !selectedTime || !visitReason.trim()) return;

    try {
      const appointment = await bookingMutation.mutateAsync({
        doctorId: selectedDoctor.doctor.doctorProfileId,
        date: dayjs(selectedTime.date).format("DD/MM/YYYY"),
        startTime: selectedTime.time,
        reason: visitReason.trim(),
      });
      const location = [selectedDoctor.doctor.hospitalAffiliation, selectedDoctor.doctor.clinicAddress]
        .filter(Boolean)
        .join(" · ");

      notifyApp({
        type: "success",
        message: "Appointment confirmed",
        description: (
          <Flex vertical gap={4}>
            <Typography.Text>{appointment.doctorName}</Typography.Text>
            <Typography.Text>
              {formatAppointmentDate(appointment.appointmentDate)} · {formatAppointmentTimeRange(appointment.startTime, appointment.endTime)}
            </Typography.Text>
            {location ? <Typography.Text>{location}</Typography.Text> : null}
            <Typography.Text>Fee: {formatBookingFee(appointment.bookingFee)}</Typography.Text>
          </Flex>
        ),
      });
      navigate(ROUTES.patientAppointments);
    } catch (error) {
      notifyApp({
        type: "error",
        message: "Could not confirm appointment",
        description: getApiErrorMessage(error),
      });
    }
  };
  const steps = [
    {
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
    },
    {
      title: "Choose time",
      content: (
        <ChooseTimeStep
          doctorId={selectedDoctor?.doctor.doctorProfileId ?? null}
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
        />
      ),
    },
    {
      title: "Visit reason",
      content: <VisitReasonStep reason={visitReason} onReasonChange={setVisitReason} />,
    },
    {
      title: "Review appointment",
      content: (
        <ReviewAppointmentStep
          doctor={selectedDoctor}
          selectedTime={selectedTime}
          visitReason={visitReason}
          onEditStep={setCurrentStep}
        />
      ),
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
          {
            title: <Link to={ROUTES.patientAppointments}>Appointments</Link>,
          },
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
