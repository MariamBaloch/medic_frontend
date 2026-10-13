import type { DataTableTab } from "@components/DataTable/DataTable";
import type {
  AppointmentStatus,
  AppointmentStatusOption,
} from "@features/patient/api/appointment.schemas";
import { AppointmentTabCount, AppointmentTabLabel } from "./AppointmentTabs.styles";

interface AppointmentStatusCounts {
  all?: number;
  [status: string]: number | undefined;
}

export function AppointmentTabs(
  statuses: AppointmentStatusOption[],
  counts: AppointmentStatusCounts,
  activeStatus: "all" | AppointmentStatus,
): DataTableTab[] {
  const statusTabs = statuses.map((status) => ({
    key: status.value,
    label: status.value === "BOOKED" ? "Upcoming" : status.label,
    count: counts[status.value],
  }));
  const items = [{ key: "all", label: "All appointments", count: counts.all }, ...statusTabs];

  return items.map((item) => ({
    key: item.key,
    label: (
      <AppointmentTabLabel>
        {item.label}
        {item.count !== undefined ? (
          <AppointmentTabCount $active={activeStatus === item.key}>
            {item.count}
          </AppointmentTabCount>
        ) : null}
      </AppointmentTabLabel>
    ),
  }));
}
