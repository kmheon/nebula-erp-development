import { useServiceDeskStats, useServiceRequests } from "../hooks/useServiceDesk";
import ServiceDeskCards from "../components/ServiceDeskCards";
import ServiceRequestList from "../components/ServiceRequestList";
import { AppPageHeader } from "../../../components/ui";

/**
 * Service Desk — Dashboard.
 *
 * Foundation surface: aggregates the in-memory seed requests into the KPI
 * cards and shows the most recent requests.
 */
export default function ServiceDeskDashboardPage() {
  const { requests } = useServiceRequests();
  const stats = useServiceDeskStats(requests);

  const recent = [...requests]
    .sort((a, b) => b.createdDate.localeCompare(a.createdDate))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <AppPageHeader
        title="Field Service Management & Operations"
        subtitle="Service requests, technician dispatch, ticket triage, and field operations across all accounts."
      />

      <ServiceDeskCards stats={stats} />

      <section
        aria-label="Recent service requests"
        className="rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-5 shadow-[var(--nebula-shadow-sm)]"
      >
        <h2 className="mb-4 text-base font-semibold text-[var(--nebula-text-primary)]">
          Recent Requests
        </h2>

        <ServiceRequestList requests={recent} />
      </section>
    </div>
  );
}
