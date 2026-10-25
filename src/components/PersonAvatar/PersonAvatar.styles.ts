import { Avatar } from "antd";
import styled from "styled-components";
import { colors } from "@theme/tokens";

export const PersonAvatar = styled(Avatar)<{
  $hasImage: boolean;
  $imageBackground?: "transparent" | "tinted";
  $objectFit?: "contain" | "cover";
}>`
  && {
    flex: 0 0 auto;
    color: ${colors.primary};
    background: ${({ $hasImage, $imageBackground = "transparent" }) =>
      $hasImage && $imageBackground === "transparent" ? "transparent" : colors.tealLight};

    img {
      object-fit: ${({ $objectFit = "contain" }) => $objectFit};
    }
  }
`;
