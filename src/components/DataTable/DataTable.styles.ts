import { Input } from "antd";
import styled, { css } from "styled-components";
import { colors } from "@theme/tokens";
import { AppCard } from "@components/Card";

const dataTableStyles = css`
  .ant-table-wrapper {
    overflow-x: auto;
  }

  .ant-table-thead > tr > th {
    color: ${colors.textSecondary};
    background: ${colors.surface};
    border-bottom-color: ${colors.border};
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
  }

  .ant-table-tbody > tr > td {
    border-bottom-color: ${colors.border};
    vertical-align: middle;
    color: ${colors.text};
    font-size: 12px;
  }

  .ant-table-thead > tr > th:first-child,
  .ant-table-tbody > tr > td:first-child {
    padding-inline-start: 30px;
  }

  .ant-table-thead > tr > th:last-child,
  .ant-table-tbody > tr > td:last-child {
    padding-inline-end: 30px;
  }

  .ant-pagination {
    margin: 14px 32px 18px 20px !important;
  }

  .ant-pagination-item-active {
    border-color: ${colors.primary};
    background: ${colors.primary};

    a {
      color: ${colors.surface};
    }
  }

  .ant-pagination-prev,
  .ant-pagination-next,
  .ant-pagination-item {
    border-radius: 8px;
  }

  .ant-tabs-tab {
    padding-top: 15px;
    padding-bottom: 14px;
    color: ${colors.textSecondary};
    font-size: 12px;
  }

  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: ${colors.primary};
    font-weight: 700;
  }

  .ant-tabs-ink-bar {
    background: ${colors.primary};
  }

  .clear-filters-button {
    color: ${colors.primary};
    font-size: 12px;
    font-weight: 600;
  }

  .ant-table-tbody > tr.data-table-row-clickable {
    cursor: pointer;
  }

  .ant-table-tbody > tr.data-table-row-clickable > td:first-child {
    padding-inline-start: 10px;
  }

  .ant-table-tbody > tr.data-table-row-selected > td {
    background: ${colors.backgroundTint};
    border-top: 1px solid ${colors.primary};
    border-bottom: 1px solid ${colors.primary};
  }

  .ant-table-tbody > tr.data-table-row-selected > td:first-child {
    border-left: 1px solid ${colors.primary};
    border-start-start-radius: 10px;
    border-end-start-radius: 10px;
  }

  .ant-table-tbody > tr.data-table-row-selected > td:last-child {
    border-right: 1px solid ${colors.primary};
    border-start-end-radius: 10px;
    border-end-end-radius: 10px;
  }
`;

export const DataTableRoot = styled(AppCard)`
  overflow: hidden;

  .ant-card-body {
    padding: 0;
  }

  ${dataTableStyles}
`;

export const DataTablePlainRoot = styled.div`
  ${dataTableStyles}

  &.data-table-filter-table-spacing > section:first-of-type {
    padding-bottom: 18px;
  }

  > section {
    padding: 0;
  }

  .ant-table-thead > tr > th:first-child,
  .ant-table-tbody > tr > td:first-child {
    padding-inline-start: 0;
  }

  .ant-table-thead > tr > th:last-child,
  .ant-table-tbody > tr > td:last-child {
    padding-inline-end: 0;
  }
`;

export const DataTableSection = styled.section<{ $tabs?: boolean }>`
  padding: ${({ $tabs }) => ($tabs ? "0 20px" : "14px 22px 18px")};
  border-bottom: 1px solid ${colors.border};

  ${({ $tabs }) =>
    $tabs &&
    `
      padding-top: 0;

      .ant-tabs-nav {
        margin: 0;
      }
    `}
`;

export const DataTableFilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 10px;

  .ant-typography {
    color: ${colors.sidebar};
    font-size: 14px;
    font-weight: 700;
  }

  .ant-btn {
    padding-inline: 0;
    font-size: 12px;
  }
`;

export const DataTableFilterGrid = styled.div<{ $columns: number; $searchColumnRatio: number }>`
  display: grid;
  grid-template-columns: ${({ $columns, $searchColumnRatio }) =>
    $columns === 2 && $searchColumnRatio > 1
      ? `minmax(0, ${$searchColumnRatio}fr) minmax(0, 1fr)`
      : `repeat(${Math.max(1, Math.min($columns, 4))}, minmax(0, 1fr))`};
  gap: 14px;

  @media (max-width: 1100px) {
    grid-template-columns: ${({ $columns, $searchColumnRatio }) =>
      $columns === 2 && $searchColumnRatio > 1
        ? `minmax(0, ${$searchColumnRatio}fr) minmax(0, 1fr)`
        : "repeat(2, minmax(0, 1fr))"};
  }

  @media (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const DataTableFilterCell = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;

  .ant-typography {
    color: ${colors.sidebar};
    font-size: 12px;
    font-weight: 600;
  }

  .ant-select,
  .ant-picker,
  .ant-input-number,
  .ant-input-affix-wrapper,
  .ant-input {
    width: 100%;
  }

  .ant-select-selector,
  .ant-picker,
  .ant-input-affix-wrapper,
  .ant-input-number {
    min-height: 42px;
    border-radius: 10px !important;
  }

  .ant-select-single .ant-select-selector {
    height: 42px;
    align-items: center;
  }

  .ant-input-affix-wrapper {
    padding-inline: 12px;
  }

  .ant-input-number-input {
    height: 40px;
  }
`;

export const DataTableSearch = styled(Input)`
  .ant-input-prefix {
    color: ${colors.textSecondary};
  }
`;
