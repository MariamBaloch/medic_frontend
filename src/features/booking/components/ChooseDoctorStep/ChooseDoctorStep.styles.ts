import styled from "styled-components";
import { colors } from "@theme/tokens";

export const DoctorSelectionButton = styled.button<{ $selected: boolean }>`
  min-width: 78px;
  margin-inline-end: 32px;
  padding: 5px 10px;
  border: 1px solid ${({ $selected }) => ($selected ? colors.primary : colors.border)};
  border-radius: 8px;
  background: ${({ $selected }) => ($selected ? colors.primary : colors.surface)};
  color: ${({ $selected }) => ($selected ? colors.surface : colors.primary)};
  cursor: pointer;
  font: inherit;
  font-size: 11px;
  font-weight: 600;
`;

export const TableContainer = styled.div`
  margin-top: 10px;
`;
