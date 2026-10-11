import { useState } from "react";
import { Plus } from "lucide-react";
import { useServiceRequests } from "../hooks/useServiceDesk";
import ServiceRequestList from "../components/ServiceRequestList";
import NewRequestForm from "../components/NewRequestForm";
import { AppPageHeader, AppButton } from "../../../components/ui";

import type { ServiceRequest } from "../types/service-desk.types";

/**
 * Service Desk — Requests.
 *
 * Lists all service requests with filtering, and reveals the New Request form
 * inline. The form links customers to the existing Sales source of truth.
 */
export default function ServiceDeskRequestsPage() {
  const { requests, addRequest } = useServiceRequests();
  const [showForm, setShowForm] = useState(false);

  function handleCreate(request: ServiceRequest) {
    addRequest(request);
    setShowForm(false);
  }

  return (
    <div className="space-y-8">
      <AppPageHeader
        title="Service Requests & Ticket Triage"
        subtitle="Triage, dispatch, and track every client service ticket with SLA monitoring."
        actions={
          <AppButton
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? "Close Form" : "New Service Request"}
          </AppButton>
        }
      />

      {showForm && (
        <div className="rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6">
          <NewRequestForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <ServiceRequestList requests={requests} />
    </div>
  );
}
