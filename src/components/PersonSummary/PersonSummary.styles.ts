import styled from "styled-components";

export const PersonSummaryContent = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const PersonSummaryName = styled.span<{ $fontSize?: number }>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${({ $fontSize }) => ($fontSize ? `font-size: ${$fontSize}px;` : `font-size: 12px;`)}
`;

export const PersonSummarySpecialization = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
`;
