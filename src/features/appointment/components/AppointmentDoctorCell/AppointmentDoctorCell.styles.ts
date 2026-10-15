import { Avatar } from "antd";
import styled from "styled-components";
import { colors } from "@theme/tokens";

export const DoctorAvatar = styled(Avatar)<{ $hasImage: boolean }>`
  && {
    flex: 0 0 auto;
    color: ${colors.primary};
    background: ${({ $hasImage }) => ($hasImage ? "transparent" : colors.tealLight)};

    img {
      object-fit: contain;
    }
  }
`;
