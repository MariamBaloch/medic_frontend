import styled from "styled-components";

export const ContentGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.35fr);
  align-items: stretch;
  gap: 16px;

  @media (max-width: 767px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
`;

export const InformationColumn = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-content: start;
  gap: 16px;
  min-width: 0;

  @media (max-width: 767px) {
    gap: 12px;
  }
`;
