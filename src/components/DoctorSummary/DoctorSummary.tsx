import { Space, Typography } from "antd";
import { DoctorAvatar } from "@components/DoctorAvatar";
import { apiClient } from "@services/api/axios";
import { getDoctorDisplayName, getDoctorInitials } from "@utils/formatters";
import { DoctorSummaryContent, DoctorSummaryName, DoctorSummarySpecialization } from "./DoctorSummary.styles";

interface DoctorSummaryProps {
  name: string;
  qualification?: string | null;
  specialization?: string | null;
  imageUrl?: string;
  size?: number;
}

export function DoctorSummary({
  name,
  qualification,
  specialization,
  imageUrl,
  size = 40,
}: DoctorSummaryProps) {
  let resolvedImageUrl: string | undefined;
  if (imageUrl) {
    try {
      resolvedImageUrl = new URL(imageUrl, apiClient.defaults.baseURL).toString();
    } catch {
      resolvedImageUrl = imageUrl;
    }
  }

  return (
    <Space size={10}>
      <DoctorAvatar size={size} src={resolvedImageUrl} $hasImage={Boolean(resolvedImageUrl)}>
        {getDoctorInitials(name)}
      </DoctorAvatar>
      <DoctorSummaryContent>
        <Typography.Text strong>
          <DoctorSummaryName>{getDoctorDisplayName(name, qualification)}</DoctorSummaryName>
        </Typography.Text>
        <DoctorSummarySpecialization>
          {specialization || "Specialization unavailable"}
        </DoctorSummarySpecialization>
      </DoctorSummaryContent>
    </Space>
  );
}
