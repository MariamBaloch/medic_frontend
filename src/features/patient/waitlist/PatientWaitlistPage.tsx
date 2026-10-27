import { isAxiosError } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ZodError } from "zod";
import { PageHeader } from "@components/PageHeader";
import type {
  Appointment,
  AppointmentFilters,
} from "@features/appointment/api/appointment.schemas";
import { AppointmentDetailsModal } from "@features/appointment/components/AppointmentDetailsModal";
import { useAppointmentStatusesQuery } from "@features/appointment/api/appointmentsQueries";
import { usePatientAppointmentsQuery } from "@features/patient/appointment/api/patientAppointmentsQueries";
import { ROUTES } from "@constants/routes";
import type {
  DataTableFilterConfig,
  DataTableFilterValue,
  DataTableFilterValues,
} from "@components/DataTable";
import { showApiAlert } from "@services/api/appAlerts";
import { getApiErrorMessage } from "@services/api/errors";
import { formatAppointmentDate, formatTime, toIsoDate } from "@utils/formatters";
import {
  useAcceptPatientWaitlistOfferMutation,
  usePatientWaitlistQuery,
  useRemovePatientWaitlistEntryMutation,
} from "./api/waitlistQueries";
import {
  waitlistStatusSchema,
  type WaitlistEntry,
  type WaitlistFilters,
} from "./api/waitlist.schemas";
import { WaitlistEntryTable } from "./components/WaitlistEntryTable";
import { WaitlistRemovalModal } from "./components/WaitlistRemovalModal";

function getActionError(error: unknown, action: "accept" | "remove"): string {
  const status = isAxiosError(error) ? error.response?.status : undefined;
  if (action === "accept" && (status === 410 || status === 409)) {
    const providedMessage = getApiErrorMessage(error, "");
    const context =
      status === 410
        ? "The offer has expired. Your waitlist has been refreshed."
        : "The time is no longer available. Your waitlist has been refreshed.";
    return providedMessage ? `${providedMessage} ${context}` : context;
  }
  return getApiErrorMessage(error);
}

export function PatientWaitlistPage() {
  const navigate = useNavigate();
  const [queryFilters, setQueryFilters] = useState<WaitlistFilters>({ page: 0, size: 10 });
  const [searchText, setSearchText] = useState("");
  const [entryToRemove, setEntryToRemove] = useState<WaitlistEntry | null>(null);
  const [appointmentEntryToOpen, setAppointmentEntryToOpen] = useState<WaitlistEntry | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);

  const waitlistQuery = usePatientWaitlistQuery(queryFilters);
  const acceptOfferMutation = useAcceptPatientWaitlistOfferMutation();
  const removeEntryMutation = useRemovePatientWaitlistEntryMutation();
  const appointmentLookupDate = appointmentEntryToOpen
    ? toIsoDate(appointmentEntryToOpen.date)
    : undefined;
  const appointmentLookupFilters = useMemo<AppointmentFilters>(
    () => ({
      doctorName: appointmentEntryToOpen?.doctorName,
      dateFrom: appointmentLookupDate,
      dateTo: appointmentLookupDate,
      page: 0,
      size: 100,
      sort: ["appointmentDate,DESC", "startTime,DESC"],
    }),
    [appointmentEntryToOpen?.doctorName, appointmentLookupDate],
  );
  const appointmentLookupQuery = usePatientAppointmentsQuery(
    appointmentLookupFilters,
    appointmentEntryToOpen !== null && appointmentLookupDate !== undefined,
  );
  const appointmentStatusesQuery = useAppointmentStatusesQuery(
    appointmentEntryToOpen !== null || selectedAppointmentId !== null,
  );

  const handleOpenAppointment = useCallback((entry: WaitlistEntry) => {
    if (!toIsoDate(entry.date)) {
      showApiAlert({
        type: "error",
        message: "Could not open appointment",
        description: "The appointment date for this waitlist entry is invalid.",
      });
      return;
    }
    setAppointmentEntryToOpen(entry);
  }, []);

  useEffect(() => {
    if (!appointmentEntryToOpen || appointmentLookupQuery.isFetching) return;
    if (appointmentLookupQuery.isPlaceholderData) return;

    if (appointmentLookupQuery.isError) {
      setAppointmentEntryToOpen(null);
      return;
    }

    const appointment = appointmentLookupQuery.data?.content.find(
      (candidate) =>
        candidate.doctorId === appointmentEntryToOpen.doctorId &&
        toIsoDate(candidate.appointmentDate) === appointmentLookupDate &&
        candidate.startTime === appointmentEntryToOpen.startTime,
    );

    if (!appointment) {
      showApiAlert({
        type: "error",
        message: "Could not find appointment",
        description: "The booked appointment could not be matched to this waitlist entry.",
      });
      setAppointmentEntryToOpen(null);
      return;
    }

    setSelectedAppointment(appointment);
    setSelectedAppointmentId(appointment.id);
    setAppointmentEntryToOpen(null);
  }, [
    appointmentEntryToOpen,
    appointmentLookupDate,
    appointmentLookupQuery.data,
    appointmentLookupQuery.isError,
    appointmentLookupQuery.isFetching,
    appointmentLookupQuery.isPlaceholderData,
  ]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const doctorName = searchText.trim();
      setQueryFilters((previous) => ({
        ...previous,
        doctorName: doctorName || undefined,
        page: 0,
      }));
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchText]);

  useEffect(() => {
    const error = waitlistQuery.error;
    if (!error || isAxiosError(error)) return;

    const description =
      error instanceof ZodError
        ? [...new Set(error.issues.map((issue) => issue.message))].join(" · ")
        : getApiErrorMessage(error);
    showApiAlert({
      type: "error",
      message: "Could not load your waitlist",
      description,
      key: "patient-waitlist-load-error",
    });
  }, [waitlistQuery.error]);

  const handleAcceptOffer = useCallback(
    async (entry: WaitlistEntry) => {
      try {
        await acceptOfferMutation.mutateAsync(entry.id);
        showApiAlert({
          type: "success",
          message: "Appointment confirmed",
          description: `${entry.doctorName} · ${formatAppointmentDate(entry.date)} at ${formatTime(entry.startTime)}`,
        });
      } catch (error) {
        showApiAlert({
          type: "error",
          message: "Could not accept offer",
          description: getActionError(error, "accept"),
        });
      }
    },
    [acceptOfferMutation.mutateAsync],
  );

  const handleRemoveEntry = useCallback(async () => {
    if (!entryToRemove) return;
    try {
      await removeEntryMutation.mutateAsync(entryToRemove.id);
      showApiAlert({
        type: "success",
        message: entryToRemove.status === "OFFERED" ? "Offer declined" : "Waitlist entry withdrawn",
      });
      setEntryToRemove(null);
    } catch (error) {
      showApiAlert({
        type: "error",
        message: "Could not update waitlist entry",
        description: getActionError(error, "remove"),
      });
    }
  }, [entryToRemove, removeEntryMutation.mutateAsync]);

  const filterDefinitions = useMemo<DataTableFilterConfig[]>(
    () => [
      {
        key: "status",
        label: "Status",
        type: "select",
        options: [
          { label: "All statuses", value: "" },
          ...waitlistStatusSchema.options.map((status) => ({
            label: status.charAt(0) + status.slice(1).toLowerCase(),
            value: status,
          })),
        ],
        placeholder: "All statuses",
      },
      { key: "dateRange", label: "Date range", type: "dateRange" },
    ],
    [],
  );

  const filterValues = useMemo<DataTableFilterValues>(
    () => ({
      status: queryFilters.status,
      dateRange:
        queryFilters.dateFrom && queryFilters.dateTo
          ? [queryFilters.dateFrom, queryFilters.dateTo]
          : undefined,
    }),
    [queryFilters.dateFrom, queryFilters.dateTo, queryFilters.status],
  );

  const changeFilter = useCallback((key: string, value: DataTableFilterValue) => {
    setQueryFilters((previous) => {
      const next = { ...previous, page: 0 };

      if (key === "dateRange") {
        const range = Array.isArray(value) ? value : undefined;
        next.dateFrom = range?.[0];
        next.dateTo = range?.[1];
      } else if (key === "status") {
        const parsedStatus = waitlistStatusSchema.safeParse(value);
        next.status = parsedStatus.success ? parsedStatus.data : undefined;
      }

      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSearchText("");
    setQueryFilters({ page: 0, size: queryFilters.size ?? 10 });
  }, [queryFilters.size]);

  const handlePageChange = useCallback((page: number, size: number) => {
    setQueryFilters((previous) => ({ ...previous, page, size }));
  }, []);

  const handleChooseAnotherTime = useCallback(
    () => navigate(ROUTES.patientBookAppointment),
    [navigate],
  );

  return (
    <>
      <PageHeader
        title="Your waitlist"
        description="Manage your waiting entries, review offers, and see confirmed appointments."
      />
      <WaitlistEntryTable
        dataSource={waitlistQuery.data?.content ?? []}
        loading={waitlistQuery.isLoading || waitlistQuery.isFetching}
        filters={filterDefinitions}
        filterValues={filterValues}
        onFilterChange={changeFilter}
        onClearFilters={clearFilters}
        searchText={searchText}
        onSearchTextChange={setSearchText}
        pagination={{
          page: queryFilters.page ?? 0,
          size: queryFilters.size ?? 10,
          total: waitlistQuery.data?.totalElements ?? 0,
        }}
        onPageChange={handlePageChange}
        acceptingOfferId={acceptOfferMutation.isPending ? acceptOfferMutation.variables : null}
        openingAppointmentId={
          appointmentLookupQuery.isFetching ? (appointmentEntryToOpen?.id ?? null) : null
        }
        onAcceptOffer={handleAcceptOffer}
        onRemoveEntry={setEntryToRemove}
        onOpenAppointment={handleOpenAppointment}
        onChooseAnotherTime={handleChooseAnotherTime}
      />
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        appointmentId={selectedAppointmentId}
        statuses={appointmentStatusesQuery.data ?? []}
        onClose={() => {
          setSelectedAppointmentId(null);
          setSelectedAppointment(null);
        }}
      />
      <WaitlistRemovalModal
        entry={entryToRemove}
        loading={removeEntryMutation.isPending}
        onCancel={() => setEntryToRemove(null)}
        onConfirm={() => void handleRemoveEntry()}
      />
    </>
  );
}
