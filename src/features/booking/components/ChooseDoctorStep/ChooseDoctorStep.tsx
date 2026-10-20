import { CheckOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import { AppAlert } from "@components/AppAlert";
import { DataTable } from "@components/DataTable";
import type {
  DataTableFilterConfig,
  DataTableFilterValue,
  DataTableFilterValues,
} from "@components/DataTable";
import { DoctorAvatar } from "@components/DoctorAvatar";
import { formatBookingFee, getDoctorDisplayName, getDoctorInitials } from "@utils/formatters";
import { StepTitle } from "../StepTitle";
import { useDoctorsQuery } from "@features/booking/api/doctorsQueries";
import type { Doctor } from "@features/booking/api/doctor.schemas";
import { useSpecializationsQuery } from "@features/appointment/api/appointmentsQueries";
import type { TableColumnsType } from "antd";
import { DoctorSelectionButton, TableContainer } from "./ChooseDoctorStep.styles";

interface ChooseDoctorStepProps {
  selectedDoctorId: number | null;
  onSelectDoctor: (doctor: Doctor) => void;
}

export function ChooseDoctorStep({ selectedDoctorId, onSelectDoctor }: ChooseDoctorStepProps) {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [specializationId, setSpecializationId] = useState<number | undefined>();
  const [pagination, setPagination] = useState({ page: 0, size: 10 });
  const doctorsQuery = useDoctorsQuery({ search: debouncedSearch, specializationId });
  const specializationsQuery = useSpecializationsQuery();
  const doctors = doctorsQuery.data ?? [];

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearch(searchText), 300);
    return () => window.clearTimeout(timeoutId);
  }, [searchText]);

  const filters: DataTableFilterConfig[] = [
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
  const filterValues: DataTableFilterValues = { specializationId };

  const changeFilter = (key: string, value: DataTableFilterValue) => {
    if (key === "specializationId") {
      setSpecializationId(typeof value === "number" ? value : undefined);
      setPagination((previous) => ({ ...previous, page: 0 }));
    }
  };
  const clearFilters = () => {
    setSearchText("");
    setDebouncedSearch("");
    setSpecializationId(undefined);
    setPagination((previous) => ({ ...previous, page: 0 }));
  };
  const changeSearch = (value: string) => {
    setSearchText(value);
    setPagination((previous) => ({ ...previous, page: 0 }));
  };

  const columns = useMemo<TableColumnsType<Doctor>>(
    () => [
      {
        key: "doctor",
        title: "Doctor",
        render: (_value, doctor) => {
          const name = `${doctor.firstName} ${doctor.lastName}`;
          return (
            <Space size={10}>
              <DoctorAvatar size={40} $hasImage={false}>
                {getDoctorInitials(name)}
              </DoctorAvatar>
              <Space orientation="vertical" size={0}>
                <Typography.Text strong>
                  {getDoctorDisplayName(name, doctor.doctor.qualification)}
                </Typography.Text>
                {doctor.doctor.specialization?.name ?? "—"}
              </Space>
            </Space>
          );
        },
      },
      {
        key: "experience",
        title: "Experience",
        width: 110,
        render: (_value, doctor) =>
          doctor.doctor.yearsOfExperience != null
            ? `${doctor.doctor.yearsOfExperience} years`
            : "—",
      },
      {
        key: "practice",
        title: "Hospital / clinic",
        width: 180,
        render: (_value, doctor) => {
          const practiceDetails = [
            doctor.doctor.hospitalAffiliation,
            doctor.doctor.clinicAddress,
          ].filter(Boolean);

          return practiceDetails.join(", ") || "—";
        },
      },
      {
        key: "bio",
        title: "About",
        width: 220,
        render: (_value, doctor) => doctor.doctor.bio || "—",
      },
      {
        key: "consultationFee",
        title: "Consultation fee",
        width: 130,
        render: (_value, doctor) => (
          <Typography.Text strong>
            {formatBookingFee(doctor.doctor.consultationFee)}
          </Typography.Text>
        ),
      },
      {
        key: "select",
        title: "",
        align: "right",
        render: (_value, doctor) => {
          const selected = doctor.userId === selectedDoctorId;
          return (
            <DoctorSelectionButton
              type="button"
              $selected={selected}
              onClick={(event) => {
                event.stopPropagation();
                onSelectDoctor(doctor);
              }}
            >
              {selected ? (
                <>
                  <CheckOutlined /> Selected
                </>
              ) : (
                "Select"
              )}
            </DoctorSelectionButton>
          );
        },
      },
    ],
    [onSelectDoctor, selectedDoctorId],
  );

  return (
    <>
      <StepTitle
        title="Who would you like to see?"
        description="Search by doctor name or browse by specialization, then select a doctor."
      />
      {doctorsQuery.isError ? (
        <AppAlert
          type="error"
          title="Could not load doctors"
          error={doctorsQuery.error}
          onRetry={() => doctorsQuery.refetch()}
          style={{ marginTop: 20 }}
        />
      ) : null}
      {specializationsQuery.isError ? (
        <AppAlert
          type="warning"
          title="Specializations unavailable"
          error={specializationsQuery.error}
          style={{ marginTop: 12 }}
        />
      ) : null}
      <TableContainer>
        <DataTable<Doctor>
          title={null}
          columns={columns}
          dataSource={doctors}
          rowKey="userId"
          loading={doctorsQuery.isLoading || doctorsQuery.isFetching}
          filters={filters}
          filterValues={filterValues}
          onFilterChange={changeFilter}
          onClearFilters={clearFilters}
          searchText={searchText}
          onSearchTextChange={changeSearch}
          searchPlaceholder="Search by doctor name"
          searchColumnRatio={2}
          searchAccessor={(doctor) =>
            `${doctor.firstName} ${doctor.lastName} ${doctor.doctor.qualification ?? ""} ${doctor.doctor.specialization?.name ?? ""}`
          }
          withCard={false}
          filterTableSpacing
          showClearFilters={false}
          pagination={{ ...pagination, total: doctors.length }}
          paginationLabel="doctors"
          onPageChange={(page, size) => setPagination({ page, size })}
          isRowSelected={(doctor) => doctor.userId === selectedDoctorId}
          onRowClick={onSelectDoctor}
        />
      </TableContainer>
    </>
  );
}
