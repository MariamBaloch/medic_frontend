import styled from "styled-components";
import { colors } from "@theme/tokens";

export const RuleDialogHeader = styled.div`
  margin-bottom: 24px;
`;

export const RuleDialogContent = styled.div`
  .ant-form-item {
    margin-bottom: 18px;
  }

  .ant-form-item-label {
    padding-bottom: 6px;
  }
`;

export const DateFields = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 440px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }
`;

export const WeekdayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 5px;
`;

export const WeekdayButton = styled.button<{ $selected: boolean }>`
  min-width: 0;
  height: 42px;
  padding: 0 4px;
  border: 1px solid ${({ $selected }) => ($selected ? colors.primary : colors.border)};
  border-radius: 8px;
  color: ${({ $selected }) => ($selected ? colors.surface : colors.textSecondary)};
  background: ${({ $selected }) => ($selected ? colors.primary : colors.surface)};
  font-size: 11px;
  cursor: pointer;
  transition: background 120ms ease, border-color 120ms ease, color 120ms ease;

  &:hover {
    border-color: ${colors.primary};
    color: ${({ $selected }) => ($selected ? colors.surface : colors.primary)};
  }

  &:focus-visible {
    outline: 2px solid ${colors.teal};
    outline-offset: 2px;
  }
`;

export const SlotChoiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
`;

export const SlotChoice = styled.button<{ $selected: boolean }>`
  min-height: 42px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 9px;
  border: 1px solid ${({ $selected }) => ($selected ? colors.primary : colors.border)};
  border-radius: 8px;
  color: ${colors.text};
  background: ${({ $selected }) => ($selected ? "#E1F2ED" : colors.surface)};
  text-align: left;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${colors.teal};
    outline-offset: 2px;
  }
`;

export const RadioMark = styled.span<{ $selected: boolean }>`
  width: 13px;
  height: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid ${({ $selected }) => ($selected ? colors.primary : colors.textSecondary)};
  border-radius: 50%;

  &::after {
    content: "";
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${({ $selected }) => ($selected ? colors.primary : "transparent")};
  }
`;

export const RuleHelpText = styled.div`
  margin-top: 7px;
  color: ${colors.textSecondary};
  font-size: 11px;
`;
