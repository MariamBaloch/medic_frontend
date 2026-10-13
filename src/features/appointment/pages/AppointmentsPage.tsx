import { CalendarOutlined } from "@ant-design/icons";
import { Alert, Button, message } from "antd";
import { useMemo, useState } from "react";
import { DataTable } from "@components/DataTable/DataTable";
import type {
  DataTableFilterConfig,
  DataTableFilterValue,
  DataTableFilterValues,
} from "@components/DataTable/DataTable";
import { PageHeader } from "@components/PageHeader/PageHeader";
import { getApiErrorMessage } from "@services/api/errors";
import {
  appointmentStatusSchema,
  type Appointment,
  type AppointmentFilters,
} from "@features/appointment/api/appointment.schemas";
import {
  useAppointmentStatusCounts,
  useAppointmentStatusesQuery,
  usePatientAppointmentsQuery,
  useSpecializationsQuery,
} from "@features/appointment/api/appointmentsQueries";
import { AppointmentDetailsModal } from "@features/appointment/components/AppointmentDetailsModal";
import { AppointmentTabs } from "@features/appointment/components/AppointmentTabs";
import { AppointmentColumns } from "@features/appointment/components/AppointmentTableColumns";

export function PatientAppointmentsPage() {
  const [queryFilters, setQueryFilters] = useState<AppointmentFilters>({
    page: 0,
    size: 10,
    sort: ["appointmentDate,DESC", "startTime,DESC"],
  });
  const [searchText, setSearchText] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const appointmentsQuery = usePatientAppointmentsQuery(queryFilters);
  const statusesQuery = useAppointmentStatusesQuery();
  const specializationsQuery = useSpecializationsQuery();
  const statuses = statusesQuery.data ?? [];
  const statusCounts = useAppointmentStatusCounts(
    queryFilters,
    statuses.map((status) => status.value),
  );

  const filterDefinitions: DataTableFilterConfig[] = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "All statuses", value: "" },
        ...statuses.map(({ label, value }) => ({ label, value })),
      ],
      placeholder: statusesQuery.isLoading ? "Loading…" : "All statuses",
    },
    { key: "dateRange", label: "Date range", type: "dateRange" },
    {
      key: "specializationId",
      label: "Specialization",
      type: "select",
      options: (specializationsQuery.data ?? []).map(({ id, name }) => ({
        label: name,
        value: id,
      })),
      placeholder: specializationsQuery.isLoading ? "Loading…" : "All specializations",
    },
  ];

  const filterValues: DataTableFilterValues = {
    status: queryFilters.status,
    specializationId: queryFilters.specializationId,
    doctorId: queryFilters.doctorId,
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
        case "doctorId":
          next.doctorId = typeof value === "number" ? value : undefined;
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
    const doctorId = /^\d+$/.test(value.trim()) ? Number(value) : undefined;
    setQueryFilters((previous) => ({ ...previous, doctorId, page: 0 }));
  };

  const columns = useMemo(
    () => AppointmentColumns({ statuses, onViewDetails: setSelectedAppointment }),
    [statuses],
  );
  const tabs = AppointmentTabs(statuses, statusCounts, queryFilters.status ?? "all");

  return (
    <>
      <PageHeader
        title="Your appointments"
        description="See what’s ahead and keep track of every visit, all in one place."
        action={
          <Button
            type="primary"
            icon={<CalendarOutlined />}
            onClick={() => message.info("Booking flow coming soon.")}
          >
            Book an appointment
          </Button>
        }
      />

      {appointmentsQuery.isError ? (
        <Alert
          type="error"
          showIcon
          title="Could not load appointments"
          description={getApiErrorMessage(appointmentsQuery.error)}
          action={<Button onClick={() => void appointmentsQuery.refetch()}>Retry</Button>}
          style={{ marginBottom: 16 }}
        />
      ) : null}

      {specializationsQuery.isError ? (
        <Alert
          type="warning"
          showIcon
          title="Specializations unavailable"
          description={getApiErrorMessage(specializationsQuery.error)}
          style={{ marginBottom: 16 }}
        />
      ) : null}

      {statusesQuery.isError ? (
        <Alert
          type="warning"
          showIcon
          title="Appointment statuses unavailable"
          description={getApiErrorMessage(statusesQuery.error)}
          style={{ marginBottom: 16 }}
        />
      ) : null}

      <DataTable<Appointment>
        title="Find an appointment"
        columns={columns}
        dataSource={appointmentsQuery.data?.content ?? []}
        rowKey="id"
        loading={appointmentsQuery.isLoading || appointmentsQuery.isFetching}
        filters={filterDefinitions}
        filterValues={filterValues}
        onFilterChange={changeFilter}
        onClearFilters={clearFilters}
        tabs={tabs}
        activeTab={queryFilters.status ?? "all"}
        onTabChange={selectStatusTab}
        searchText={searchText}
        onSearchTextChange={handleSearchTextChange}
        searchPlaceholder="Doctor or appointment"
        searchAccessor={(appointment) =>
          [
            appointment.doctorName,
            appointment.doctorQualification,
            appointment.doctorId,
            appointment.specialization?.name,
            appointment.reason,
          ]
            .filter(Boolean)
            .join(" ")
        }
        pagination={{
          page: queryFilters.page ?? 0,
          size: queryFilters.size ?? 10,
          total: appointmentsQuery.data?.totalElements ?? 0,
        }}
        onPageChange={(page, size) => setQueryFilters((previous) => ({ ...previous, page, size }))}
      />

      <AppointmentDetailsModal
        appointment={selectedAppointment}
        statuses={statuses}
        onClose={() => setSelectedAppointment(null)}
      />
    </>
  );
}
