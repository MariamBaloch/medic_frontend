import { LockOutlined } from "@ant-design/icons";
import { Input, Typography } from "antd";
import { StepTitle } from "../StepTitle";
import {
  PrivacyNote,
  ReasonHeading,
  ReasonField,
  ReasonFieldHeader,
  ReasonFooter,
  ReasonLabel,
  ReasonSection,
  RequiredLabel,
} from "./VisitReasonStep.styles";

const { TextArea } = Input;
const MAX_REASON_LENGTH = 200;

interface VisitReasonStepProps {
  reason: string;
  onReasonChange: (reason: string) => void;
}

export function VisitReasonStep({ reason, onReasonChange }: VisitReasonStepProps) {
  return (
    <ReasonSection>
      <ReasonHeading>
        <StepTitle
          title="What brings you in?"
          description="Help your doctor prepare for your visit by sharing what you'd like to discuss."
        />
      </ReasonHeading>

      <ReasonField>
        <ReasonFieldHeader justify="space-between" align="center">
          <ReasonLabel htmlFor="visit-reason">
            Reason for appointment <RequiredLabel>*</RequiredLabel>
          </ReasonLabel>
          <Typography.Text type="secondary">Required</Typography.Text>
        </ReasonFieldHeader>
        <TextArea
          id="visit-reason"
          value={reason}
          onChange={(event) => onReasonChange(event.target.value)}
          maxLength={MAX_REASON_LENGTH}
          autoSize={{ minRows: 4, maxRows: 4 }}
          aria-required="true"
          aria-describedby="visit-reason-help"
        />
        <ReasonFooter justify="space-between" align="center">
          <Typography.Text id="visit-reason-help" type="secondary">
            Briefly describe your main concern or the purpose of your visit.
          </Typography.Text>
          <Typography.Text type="secondary">
            {reason.length} / {MAX_REASON_LENGTH}
          </Typography.Text>
        </ReasonFooter>
      </ReasonField>

      <PrivacyNote align="center" gap={10}>
        <LockOutlined aria-hidden="true" />
        <Typography.Text type="secondary">
          Your information is private and will only be shared with your care team.
        </Typography.Text>
      </PrivacyNote>
    </ReasonSection>
  );
}
