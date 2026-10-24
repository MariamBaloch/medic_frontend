import { CalendarOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@constants/routes";
import {
  type Appointment,
  type AppointmentFilters,
} from "@features/appointment/api/appointment.schemas";
import {
  useAppointmentStatusesQuery,
  useSpecializationsQuery,
} from "@features/appointment/api/appointmentsQueries";
import {
  usePatientAppointmentStatusCounts,
  usePatientAppointmentsQuery,
} from "./api/patientAppointmentsQueries";
import { AppointmentDetailsModal } from "@features/appointment/components/AppointmentDetailsModal";
import { AppointmentsPageContent } from "@features/appointment/components/AppointmentsPageContent";

export function PatientAppointmentsPage() {
  const navigate = useNavigate();
  const [queryFilters, setQueryFilters] = useState<AppointmentFilters>({
    page: 0,
    size: 10,
    sort: ["appointmentDate,DESC", "startTime,DESC"],
  });
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const appointmentsQuery = usePatientAppointmentsQuery(queryFilters);
  const statusesQuery = useAppointmentStatusesQuery();
  const specializationsQuery = useSpecializationsQuery();
  const statuses = statusesQuery.data ?? [];
  const statusCounts = usePatientAppointmentStatusCounts(queryFilters);
  const handleViewDetails = useCallback((appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setSelectedAppointmentId(appointment.id);
  }, []);

  return (
    <>
      <AppointmentsPageContent
        audience="patient"
        title="Your appointments"
        description="See what’s ahead and keep track of every visit, all in one place."
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
        action={
          <Button
            type="primary"
            icon={<CalendarOutlined />}
            onClick={() => navigate(ROUTES.patientBookAppointment)}
          >
            Book an appointment
          </Button>
        }
        onViewDetails={handleViewDetails}
      />
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        appointmentId={selectedAppointmentId}
        statuses={statuses}
        onClose={() => {
          setSelectedAppointmentId(null);
          setSelectedAppointment(null);
        }}
      />
    </>
  );
}
