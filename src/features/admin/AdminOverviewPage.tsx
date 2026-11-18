import { CheckCircleFilled, FileSearchOutlined, TeamOutlined, UserAddOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@components/PageHeader";
import { ROUTES } from "@constants/routes";
import { useCurrentUserQuery } from "@features/auth/api/authQueries";
import { DashboardActionSection } from "@features/overview/components/DashboardActionSection";
import { OverviewRoot, WelcomeCard } from "@features/overview/OverviewShared.styles";
import { DashboardActionGrid } from "@features/overview/patient/PatientOverviewPage.styles";
import { useAuthStore } from "@stores/authStore";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function AdminOverviewPage() {
  const navigate = useNavigate();
  const storedUser = useAuthStore((state) => state.user);
  const currentUserQuery = useCurrentUserQuery();
  const user = currentUserQuery.data ?? storedUser;
  const firstName = user?.firstName?.trim().split(/\s+/)[0] || "there";

  return (
    <OverviewRoot>
      <WelcomeCard>
        <PageHeader
          eyebrow={
            <>
              <CheckCircleFilled /> Admin portal
            </>
          }
          title={`${getGreeting()}, ${firstName}.`}
          description="Verify doctors, review the audit log, and add another administrator."
          stacked
          style={{ marginBottom: 0 }}
        />
      </WelcomeCard>
      <DashboardActionGrid>
        <DashboardActionSection
          icon={<TeamOutlined />}
          title="Doctors"
          description="Review active doctors, mark a profile verified, or remove a doctor account."
          buttonLabel="Open doctors"
          onClick={() => navigate(ROUTES.adminDoctors)}
        />
        <DashboardActionSection
          icon={<FileSearchOutlined />}
          title="Audit log"
          description="See who changed accounts, profiles, appointments, and schedules."
          buttonLabel="Open audit log"
          onClick={() => navigate(ROUTES.adminAudit)}
        />
        <DashboardActionSection
          icon={<UserAddOutlined />}
          title="Administrators"
          description="Create another admin account. The new admin can sign in immediately."
          buttonLabel="Add administrator"
          onClick={() => navigate(ROUTES.adminAdministrators)}
        />
      </DashboardActionGrid>
    </OverviewRoot>
  );
}
