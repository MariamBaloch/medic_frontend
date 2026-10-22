import styled from "styled-components";

export const DoctorSummaryContent = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const DoctorSummaryName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DoctorSummarySpecialization = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
`;
