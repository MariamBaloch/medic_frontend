import { Breadcrumb, Button, Divider, Flex, Steps, Typography } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@constants/routes";
import { colors } from "@theme/tokens";
import { PageHeader } from "@components/PageHeader";
import { ArrowLeftOutlined, ArrowRightOutlined, SafetyOutlined } from "@ant-design/icons";
import { ChooseDoctorStep } from "@features/booking/components/ChooseDoctorStep";
import { ChooseTimeStep } from "@features/booking/components/ChooseTimeStep";
import { VisitReasonStep } from "@features/booking/components/VisitReasonStep";
import { ReviewAppointmentStep } from "@features/booking/components/ReviewAppointmentStep";
import { BookingStepsCard } from "./BookingLayout.styles";
import { AppCard } from "@components/Card";
import type { SelectedAppointmentTime } from "@components/WeekAvailability";
import type { Doctor } from "@features/booking/api/doctor.schemas";

const { Text } = Typography;

export function BookingLayout() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTime, setSelectedTime] = useState<SelectedAppointmentTime | null>(null);
  const [visitReason, setVisitReason] = useState("");
  const navigate = useNavigate();
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
    { title: "Review appointment", content: <ReviewAppointmentStep /> },
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
          onChange={setCurrentStep}
          items={steps.map((step, index) => ({
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
            disabled={
              (currentStep === 0 && selectedDoctor === null) ||
              (currentStep === 1 && selectedTime === null) ||
              (currentStep === 2 && visitReason.trim().length === 0)
            }
            onClick={() => setCurrentStep((step) => step + 1)}
          >
            Continue to {nextStep.title.toLowerCase()}
          </Button>
        ) : null}
      </Flex>
    </>
  );
}
