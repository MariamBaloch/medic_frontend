import { useEffect, useMemo, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { Alert, Button } from "antd";
import { DataTable } from "@components/DataTable/DataTable";
import type {
  DataTableFilterConfig,
  DataTableFilterValue,
  DataTableFilterValues,
} from "@components/DataTable/DataTable";
import { PageHeader } from "@components/PageHeader";
import {
  appointmentStatusSchema,
  type Appointment,
  type AppointmentFilters,
  type AppointmentPage, type AppointmentStatusOption,
  type Specialization
} from "@features/appointment/api/appointment.schemas";
import { getApiErrorMessage } from "@services/api/errors";
import { AppointmentColumns } from "../AppointmentTableColumns";
import { AppointmentTabs } from "../AppointmentTabs";

interface AppointmentsPageContentProps {
  audience: "patient" | "doctor";
  title: string;
  description: string;
  queryFilters: AppointmentFilters;
  setQueryFilters: Dispatch<SetStateAction<AppointmentFilters>>;
  appointments?: AppointmentPage;
  isLoading: boolean;
  error?: unknown;
  onRetry?: () => void;
  statuses: AppointmentStatusOption[];
  specializations: Specialization[];
  isLoadingStatuses?: boolean;
  isLoadingSpecializations?: boolean;
  statusCounts: Record<string, number | undefined>;
  action?: ReactNode;
  warnings?: ReactNode;
  onViewDetails?: (appointment: Appointment) => void;
}

export function AppointmentsPageContent({
  audience,
  title,
  description,
  queryFilters,
  setQueryFilters,
  appointments,
  isLoading,
  error,
  onRetry,
  statuses,
  specializations,
  isLoadingStatuses = false,
  isLoadingSpecializations = false,
  statusCounts,
  action,
  warnings,
  onViewDetails,
}: AppointmentsPageContentProps) {
  const [searchText, setSearchText] = useState("");
  const personFilterKey = audience === "patient" ? "doctorName" : "patientName";
  const activeTab = queryFilters.status ?? "all";
  const tabCountGroupKey = JSON.stringify([
    audience,
    queryFilters.doctorName,
    queryFilters.patientName,
    queryFilters.dateFrom,
    queryFilters.dateTo,
    queryFilters.specializationId,
  ]);
  const [loadedTabCountCache, setLoadedTabCountCache] = useState<{
    key: string;
    counts: Record<string, number>;
  }>({ key: "", counts: {} });

  useEffect(() => {
    if (!isLoading && appointments) {
      setLoadedTabCountCache((previous) => ({
        key: tabCountGroupKey,
        counts: {
          ...(previous.key === tabCountGroupKey ? previous.counts : {}),
          [activeTab]: appointments.totalElements,
        },
      }));
    }
  }, [activeTab, appointments, isLoading, tabCountGroupKey]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const search = searchText.trim();
      setQueryFilters((previous) => ({
        ...previous,
        [personFilterKey]: search || undefined,
        page: 0,
      }));
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [personFilterKey, searchText, setQueryFilters]);
  const statusOptions = statuses.map(({ label, value }) => ({ label, value }));
  const filterDefinitions: DataTableFilterConfig[] = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [{ label: "All statuses", value: "" }, ...statusOptions],
      placeholder: isLoadingStatuses ? "Loading..." : "All statuses",
    },
    { key: "dateRange", label: "Date range", type: "dateRange" },
    {
      key: "specializationId",
      label: "Specialization",
      type: "select",
      options: specializations.map(({ id, name }) => ({ label: name, value: id })),
      placeholder: isLoadingSpecializations ? "Loading..." : "All specializations",
    },
  ];
  const filterValues: DataTableFilterValues = {
    status: queryFilters.status,
    specializationId: queryFilters.specializationId,
    [personFilterKey]: queryFilters[personFilterKey],
    dateRange:
      queryFilters.dateFrom && queryFilters.dateTo
        ? [queryFilters.dateFrom, queryFilters.dateTo]
        : undefined,
  };

  const changeFilter = (key: string, value: DataTableFilterValue) => {
    setQueryFilters((previous) => {
      const next = { ...previous, page: 0 };

      switch (key) {
        case "dateRange": {
          const range = Array.isArray(value) ? value : undefined;
          next.dateFrom = range?.[0];
          next.dateTo = range?.[1];
          break;
        }
        case "status": {
          const parsedStatus = appointmentStatusSchema.safeParse(value);
          next.status = parsedStatus.success ? parsedStatus.data : undefined;
          break;
        }
        case "specializationId":
          next.specializationId = typeof value === "number" ? value : undefined;
          break;
      }

      return next;
    });
  };

  const clearFilters = () => {
    setSearchText("");
    setQueryFilters({ page: 0, size: queryFilters.size, sort: queryFilters.sort });
  };

  const selectStatusTab = (key: string) => {
    const parsedStatus = appointmentStatusSchema.safeParse(key);
    setQueryFilters((previous) => ({
      ...previous,
      page: 0,
      status: key === "all" ? undefined : parsedStatus.success ? parsedStatus.data : undefined,
    }));
  };

  const handleSearchTextChange = (value: string) => {
    setSearchText(value);
  };

  const columns = useMemo(
    () => AppointmentColumns({ statuses, person: audience, onViewDetails }),
    [audience, onViewDetails, statuses],
  );
  const cachedTabCounts =
    loadedTabCountCache.key === tabCountGroupKey ? loadedTabCountCache.counts : {};
  const activeTabCount =
    !isLoading && appointments ? { [activeTab]: appointments.totalElements } : {};
  const tabCounts = {
    ...cachedTabCounts,
    ...Object.fromEntries(Object.entries(statusCounts).filter(([, count]) => count !== undefined)),
    ...activeTabCount,
  };
  const tabs = AppointmentTabs(statuses, tabCounts, activeTab);

  return (
    <>
      <PageHeader title={title} description={description} action={action} />
      {warnings}
      {error ? (
        <Alert
          type="error"
          showIcon
          title="Could not load appointments"
          description={getApiErrorMessage(error)}
          action={onRetry ? <Button onClick={onRetry}>Retry</Button> : undefined}
          style={{ marginBottom: 16 }}
        />
      ) : null}
      <DataTable<Appointment>
        title={"Find an appointment"}
        columns={columns}
        dataSource={appointments?.content ?? []}
        rowKey="id"
        loading={isLoading}
        filters={filterDefinitions}
        filterValues={filterValues}
        onFilterChange={changeFilter}
        onClearFilters={clearFilters}
        tabs={tabs}
        activeTab={queryFilters.status ?? "all"}
        onTabChange={selectStatusTab}
        searchText={searchText}
        onSearchTextChange={handleSearchTextChange}
        serverSearch
        searchPlaceholder={
          audience === "patient" ? "Doctor or appointment" : "Patient or appointment"
        }
        pagination={{
          page: queryFilters.page ?? 0,
          size: queryFilters.size ?? 10,
          total: appointments?.totalElements ?? 0,
        }}
        paginationLabel="appointments"
        onPageChange={(page, size) => setQueryFilters((previous) => ({ ...previous, page, size }))}
      />
    </>
  );
}
