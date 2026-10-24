import { Avatar } from "antd";
import styled from "styled-components";
import { colors } from "@theme/tokens";

export const PatientAvatar = styled(Avatar)`
  && {
    flex: 0 0 auto;
    color: ${colors.primary};
    background: ${colors.tealLight};

    img {
      object-fit: contain;
    }
  }
`;
