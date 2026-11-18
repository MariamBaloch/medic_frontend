import dayjs from "dayjs";
import type { TableColumnsType } from "antd";
import { DataTable } from "@components/DataTable/DataTable";
import { PageHeader } from "@components/PageHeader";
import { useAuditLogsQuery } from "./api/adminQueries";
import type { AuditLog } from "./api/admin.schemas";

export function AdminAuditPage() {
  const auditQuery = useAuditLogsQuery();
  const columns: TableColumnsType<AuditLog> = [
    {
      title: "When",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (value: string) => (dayjs(value).isValid() ? dayjs(value).format("DD/MM/YYYY HH:mm") : value),
    },
    { title: "Who", dataIndex: "username", key: "username" },
    { title: "Action", dataIndex: "action", key: "action" },
    { title: "Record", dataIndex: "entityType", key: "entityType" },
    { title: "Description", dataIndex: "description", key: "description" },
  ];

  return (
    <>
      <PageHeader
        title="Audit log"
        description="Business actions recorded across Medic, newest first."
      />
      <DataTable
        columns={columns}
        dataSource={auditQuery.data ?? []}
        loading={auditQuery.isLoading || auditQuery.isFetching}
        rowKey="id"
        title={null}
        showClearFilters={false}
      />
    </>
  );
}
