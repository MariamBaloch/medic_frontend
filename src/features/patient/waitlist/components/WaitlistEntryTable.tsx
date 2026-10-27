import { Space, Typography } from "antd";
import type { TableColumnsType } from "antd";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@components/DataTable";
import type {
  DataTableFilterConfig,
  DataTableFilterValue,
  DataTableFilterValues,
} from "@components/DataTable";
import { PersonSummary } from "@components/PersonSummary";
import { formatAppointmentDate, formatAppointmentTimeRange, formatTime } from "@utils/formatters";
import type { WaitlistEntry } from "../api/waitlist.schemas";
import { WaitlistActionsCell } from "./WaitlistActionsCell";
import { WaitlistStatusCell } from "./WaitlistStatusCell";

interface WaitlistEntryTableProps {
  dataSource: WaitlistEntry[];
  loading: boolean;
  filters: DataTableFilterConfig[];
  filterValues: DataTableFilterValues;
  onFilterChange: (key: string, value: DataTableFilterValue) => void;
  onClearFilters: () => void;
  searchText: string;
  onSearchTextChange: (value: string) => void;
  pagination: { page: number; size: number; total: number };
  onPageChange: (page: number, size: number) => void;
  acceptingOfferId: number | null;
  openingAppointmentId: number | null;
  onAcceptOffer: (entry: WaitlistEntry) => void;
  onRemoveEntry: (entry: WaitlistEntry) => void;
  onOpenAppointment: (entry: WaitlistEntry) => void;
  onChooseAnotherTime: () => void;
}

export function WaitlistEntryTable({
  dataSource,
  loading,
  filters,
  filterValues,
  onFilterChange,
  onClearFilters,
  searchText,
  onSearchTextChange,
  pagination,
  onPageChange,
  acceptingOfferId,
  openingAppointmentId,
  onAcceptOffer,
  onRemoveEntry,
  onOpenAppointment,
  onChooseAnotherTime,
}: WaitlistEntryTableProps) {
  const [now, setNow] = useState(() => Date.now());
  const hasActiveOffer = dataSource.some(
    (entry) =>
      entry.status === "OFFERED" &&
      entry.offerExpiresAt !== undefined &&
      Date.parse(entry.offerExpiresAt) > now,
  );

  useEffect(() => {
    if (!hasActiveOffer) return;
    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, [hasActiveOffer]);

  const displayDataSource = useMemo(
    () =>
      dataSource.map((entry) =>
        entry.status === "OFFERED" &&
        entry.offerExpiresAt !== undefined &&
        Date.parse(entry.offerExpiresAt) <= now
          ? { ...entry, status: "EXPIRED" as const }
          : entry,
      ),
    [dataSource, now],
  );

  const columns = useMemo<TableColumnsType<WaitlistEntry>>(
    () => [
      {
        key: "doctor",
        title: "Doctor / specialization",
        width: "28%",
        render: (_value, entry) => (
          <PersonSummary
            type="doctor"
            name={entry.doctorName}
            specialization={entry.specialization}
          />
        ),
      },
      {
        key: "appointmentTime",
        title: "Date & time",
        width: "20%",
        render: (_value, entry) => (
          <Space orientation="vertical" size={2}>
            <Typography.Text strong>{formatAppointmentDate(entry.date)}</Typography.Text>
            <Typography.Text type="secondary">
              {entry.endTime
                ? formatAppointmentTimeRange(entry.startTime, entry.endTime)
                : formatTime(entry.startTime)}
            </Typography.Text>
          </Space>
        ),
      },
      {
        key: "status",
        title: "Status / offer details",
        width: "24%",
        render: (_value, entry) => <WaitlistStatusCell entry={entry} now={now} />,
      },
      {
        key: "actions",
        title: "Actions",
        align: "right",
        width: "18%",
        render: (_value, entry) => (
          <WaitlistActionsCell
            entry={entry}
            acceptingOffer={acceptingOfferId === entry.id}
            openingAppointment={openingAppointmentId === entry.id}
            onAcceptOffer={onAcceptOffer}
            onRemoveEntry={onRemoveEntry}
            onOpenAppointment={onOpenAppointment}
            onChooseAnotherTime={onChooseAnotherTime}
          />
        ),
      },
    ],
    [
      acceptingOfferId,
      openingAppointmentId,
      onAcceptOffer,
      onChooseAnotherTime,
      onOpenAppointment,
      onRemoveEntry,
      now,
    ],
  );

  return (
    <DataTable<WaitlistEntry>
      title="Find an entry"
      columns={columns}
      dataSource={displayDataSource}
      rowKey="id"
      loading={loading}
      filters={filters}
      filterValues={filterValues}
      onFilterChange={onFilterChange}
      onClearFilters={onClearFilters}
      searchText={searchText}
      onSearchTextChange={onSearchTextChange}
      searchPlaceholder="Search doctor"
      serverSearch
      pagination={pagination}
      paginationLabel="entries"
      onPageChange={onPageChange}
    />
  );
}
