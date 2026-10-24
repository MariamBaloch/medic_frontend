import { useState } from "react";
import {
  useAppointmentStatusesQuery,
  useSpecializationsQuery,
} from "@features/appointment/api/appointmentsQueries";
import type { AppointmentFilters } from "@features/appointment/api/appointment.schemas";
import { AppointmentsPageContent } from "@features/appointment/components/AppointmentsPageContent";
import {
  useDoctorAppointmentStatusCounts,
  useDoctorAppointmentsQuery,
} from "./api/doctorAppointmentsQueries";

export function DoctorAppointmentsPage() {
  const [queryFilters, setQueryFilters] = useState<AppointmentFilters>({
    page: 0,
    size: 10,
    sort: ["appointmentDate,DESC", "startTime,DESC"],
  });
  const appointmentsQuery = useDoctorAppointmentsQuery(queryFilters);
  const statusesQuery = useAppointmentStatusesQuery();
  const specializationsQuery = useSpecializationsQuery();
  const statuses = statusesQuery.data ?? [];
  const statusCounts = useDoctorAppointmentStatusCounts(queryFilters);

  return (
    <AppointmentsPageContent
      audience="doctor"
      title="Your appointments"
      description="Review your upcoming visits and keep track of your patients."
      queryFilters={queryFilters}
      setQueryFilters={setQueryFilters}
      appointments={appointmentsQuery.data}
      isLoading={appointmentsQuery.isLoading || appointmentsQuery.isFetching}
      error={appointmentsQuery.error}
      onRetry={() => void appointmentsQuery.refetch()}
      statuses={statuses}
      specializations={specializationsQuery.data ?? []}
      isLoadingStatuses={statusesQuery.isLoading}
      isLoadingSpecializations={specializationsQuery.isLoading}
      statusCounts={statusCounts}
    />
  );
}
