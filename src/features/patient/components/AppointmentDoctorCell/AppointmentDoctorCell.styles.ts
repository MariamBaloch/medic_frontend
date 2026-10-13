import { Avatar } from "antd";
import styled from "styled-components";
import { colors } from "@theme/tokens";

export const DoctorAvatar = styled(Avatar)`
  && {
    flex: 0 0 auto;
    color: ${colors.primary};
    background: ${colors.tealLight};
    font-weight: 700;
  }
`;
