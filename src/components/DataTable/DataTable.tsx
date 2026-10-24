import { useMemo } from "react";
import type { ReactNode } from "react";
import { CalendarOutlined, SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { Button, DatePicker, InputNumber, Select, Table, Tabs, Typography } from "antd";
import type { TableColumnsType } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import {
  DataTableFilterCell,
  DataTableFilterGrid,
  DataTableFilterHeader,
  DataTableClearFiltersButton,
  DataTablePlainRoot,
  DataTableRoot,
  DataTableSearch,
  DataTableSection,
} from "./DataTable.styles";

export type DataTableFilterValue = string | number | [string, string] | undefined;
export type DataTableFilterValues = Record<string, DataTableFilterValue>;

interface FilterOption {
  label: string;
  value: string | number;
}

export type DataTableFilterConfig =
  | { key: string; label: string; type: "select"; options: FilterOption[]; placeholder?: string }
  | { key: string; label: string; type: "dateRange"; placeholder?: string }
  | { key: string; label: string; type: "number"; placeholder?: string };

export interface DataTableTab {
  key: string;
  label: ReactNode;
}

interface DataTablePagination {
  page: number;
  size: number;
  total: number;
}

interface DataTableProps<T extends object> {
  columns: TableColumnsType<T>;
  dataSource: T[];
  loading?: boolean;
  filters?: DataTableFilterConfig[];
  filterValues?: DataTableFilterValues;
  onFilterChange?: (key: string, value: DataTableFilterValue) => void;
  onClearFilters?: () => void;
  tabs?: DataTableTab[];
  activeTab?: string;
  onTabChange?: (key: string) => void;
  pagination?: DataTablePagination;
  onPageChange?: (page: number, size: number) => void;
  paginationLabel?: string;
  searchText?: string;
  onSearchTextChange?: (value: string) => void;
  searchPlaceholder?: string;
  serverSearch?: boolean;
  searchColumnRatio?: number;
  searchAccessor?: (record: T) => string;
  rowKey: string | ((record: T) => string);
  isRowSelected?: (record: T) => boolean;
  onRowClick?: (record: T) => void;
  withCard?: boolean;
  filterTableSpacing?: boolean;
  showClearFilters?: boolean;
  title?: ReactNode;
}

function asDateRange(value: DataTableFilterValue): [Dayjs, Dayjs] | null {
  if (!Array.isArray(value) || value.length !== 2) return null;
  return [dayjs(value[0]), dayjs(value[1])];
}

export function DataTable<T extends object>({
  columns,
  dataSource,
  loading = false,
  filters = [],
  filterValues = {},
  onFilterChange,
  onClearFilters,
  tabs,
  activeTab,
  onTabChange,
  pagination,
  onPageChange,
  paginationLabel = "appointments",
  searchText = "",
  onSearchTextChange,
  searchPlaceholder = "Search",
  serverSearch = false,
  searchColumnRatio = 1,
  searchAccessor,
  rowKey,
  isRowSelected,
  onRowClick,
  withCard = true,
  filterTableSpacing = false,
  showClearFilters = true,
  title = "Find an appointment",
}: DataTableProps<T>) {
  const displayedRows = useMemo(() => {
    if (serverSearch) return dataSource;
    const searchTerm = searchText.trim().toLocaleLowerCase();
    if (!searchTerm) return dataSource;
    return dataSource.filter((record) => {
      const searchableText = searchAccessor ? searchAccessor(record) : JSON.stringify(record);
      return searchableText.toLocaleLowerCase().includes(searchTerm);
    });
  }, [dataSource, searchAccessor, searchText, serverSearch]);

  const filterContent = (filter: DataTableFilterConfig) => {
    const value = filterValues[filter.key];

    if (filter.type === "select") {
      return (
        <Select
          value={value}
          placeholder={filter.placeholder ?? "All"}
          options={filter.options}
          allowClear
          onChange={(nextValue) => onFilterChange?.(filter.key, nextValue)}
        />
      );
    }

    if (filter.type === "dateRange") {
      return (
        <DatePicker.RangePicker
          style={{ width: "100%" }}
          value={asDateRange(value)}
          placeholder={["Start date", "End date"]}
          format="MMM D, YYYY"
          suffixIcon={<CalendarOutlined />}
          onChange={(dates) => {
            if (!dates?.[0] || !dates[1]) {
              onFilterChange?.(filter.key, undefined);
              return;
            }
            onFilterChange?.(filter.key, [
              dates[0].format("YYYY-MM-DD"),
              dates[1].format("YYYY-MM-DD"),
            ]);
          }}
        />
      );
    }

    return (
      <InputNumber
        style={{ width: "100%" }}
        min={1}
        value={typeof value === "number" ? value : null}
        placeholder={filter.placeholder}
        controls={false}
        onChange={(nextValue) =>
          onFilterChange?.(filter.key, typeof nextValue === "number" ? nextValue : undefined)
        }
      />
    );
  };

  const activeFilters = Object.values(filterValues).some(
    (value) => value !== undefined && value !== "",
  );

  const content = (
    <>
      {title || showClearFilters || filters.length > 0 || onSearchTextChange ? (
        <DataTableSection>
          {title || showClearFilters ? (
            <DataTableFilterHeader>
              {title ? <Typography.Text strong>{title}</Typography.Text> : null}
              {showClearFilters ? (
                <DataTableClearFiltersButton
                  type="link"
                  icon={<UndoOutlined />}
                  onClick={() => {
                    onSearchTextChange?.("");
                    onClearFilters?.();
                  }}
                  disabled={!activeFilters && !searchText}
                >
                  Clear filters
                </DataTableClearFiltersButton>
              ) : null}
            </DataTableFilterHeader>
          ) : null}

          <DataTableFilterGrid
            $columns={filters.length + (onSearchTextChange ? 1 : 0)}
            $searchColumnRatio={onSearchTextChange ? searchColumnRatio : 1}
          >
            {onSearchTextChange ? (
              <DataTableFilterCell>
                <Typography.Text>Search</Typography.Text>
                <DataTableSearch
                  prefix={<SearchOutlined />}
                  allowClear
                  value={searchText}
                  placeholder={searchPlaceholder}
                  onChange={(event) => onSearchTextChange(event.target.value)}
                />
              </DataTableFilterCell>
            ) : null}
            {filters.map((filter) => (
              <DataTableFilterCell key={filter.key}>
                <Typography.Text>{filter.label}</Typography.Text>
                {filterContent(filter)}
              </DataTableFilterCell>
            ))}
          </DataTableFilterGrid>
        </DataTableSection>
      ) : null}

      {tabs?.length ? (
        <DataTableSection $tabs>
          <Tabs
            activeKey={activeTab}
            items={tabs.map((tab) => ({ key: tab.key, label: tab.label }))}
            onChange={onTabChange}
          />
        </DataTableSection>
      ) : null}

      <Table<T>
        columns={columns}
        dataSource={displayedRows}
        rowKey={rowKey}
        onRow={(record) => ({
          "data-row-selected": isRowSelected?.(record) ? "true" : undefined,
          "data-row-clickable": onRowClick ? "true" : undefined,
          onClick: onRowClick ? () => onRowClick(record) : undefined,
        })}
        loading={loading}
        size="large"
        pagination={
          pagination
            ? {
                current: pagination.page + 1,
                pageSize: pagination.size,
                total: !serverSearch && searchText ? displayedRows.length : pagination.total,
                showSizeChanger: true,
                pageSizeOptions: [10, 20, 50],
                size: "small",
                showTotal: (total, range) =>
                  `${range[0]}–${range[1]} of ${total} ${paginationLabel}`,
                onChange: (current, pageSize) => onPageChange?.(current - 1, pageSize),
              }
            : false
        }
      />
    </>
  );

  return withCard ? (
    <DataTableRoot variant="borderless">{content}</DataTableRoot>
  ) : (
    <DataTablePlainRoot $filterTableSpacing={filterTableSpacing}>{content}</DataTablePlainRoot>
  );
}
