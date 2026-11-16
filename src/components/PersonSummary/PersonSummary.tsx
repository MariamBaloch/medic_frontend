import type { ReactNode } from "react";
import { Space, Typography } from "antd";
import { PersonAvatar } from "@components/PersonAvatar";
import { resolveAvatarUrl } from "@services/api/imageUrl";
import { getDoctorDisplayName, getPersonInitials } from "@utils/formatters";
import {
  PersonSummaryContent,
  PersonSummaryName,
  PersonSummarySpecialization,
} from "./PersonSummary.styles";

export type PersonSummaryType = "doctor" | "patient";

export interface PersonSummaryProps {
  type: PersonSummaryType;
  name: string;
  qualification?: string | null;
  specialization?: string | null;
  imageUrl?: string | null;
  size?: number;
  gap?: number;
  nameFontSize?: number;
  imageBackground?: "transparent" | "tinted";
  avatarFallback?: ReactNode;
}

export function PersonSummary({
  type,
  name,
  qualification,
  specialization,
  imageUrl,
  size = 40,
  gap = 10,
  nameFontSize,
  imageBackground,
  avatarFallback,
}: PersonSummaryProps) {
  const resolvedImageUrl = resolveAvatarUrl(imageUrl);
  const displayName = type === "doctor" ? getDoctorDisplayName(name, qualification) : name;

  return (
    <Space size={gap} style={{ minWidth: 0 }}>
      <PersonAvatar
        size={size}
        src={resolvedImageUrl}
        $hasImage={Boolean(resolvedImageUrl)}
        $imageBackground={imageBackground}
      >
        {avatarFallback ?? getPersonInitials(name)}
      </PersonAvatar>
      <PersonSummaryContent>
        <Typography.Text strong>
          <PersonSummaryName $fontSize={nameFontSize}>{displayName}</PersonSummaryName>
        </Typography.Text>
        {type === "doctor" ? (
          <PersonSummarySpecialization>
            {specialization || "Specialization unavailable"}
          </PersonSummarySpecialization>
        ) : null}
      </PersonSummaryContent>
    </Space>
  );
}
