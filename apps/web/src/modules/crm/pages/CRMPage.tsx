import { Users, UserCheck, HeartHandshake } from "lucide-react";
import CustomerTable from "../components/CustomerTable";
import {
  AppPageHeader,
  AppStatCard,
  AppLoading,
} from "../../../components/ui";

import { useContacts } from "../../contacts/hooks/useContacts";

export default function CRMPage() {
  const { data: contacts = [], isLoading } = useContacts();

  const customerContacts = contacts.filter((c) => c.roles.includes("customer"));

  return (
    <div className="space-y-8">
      <AppPageHeader
        title="Customer Relationship Management (CRM)"
        subtitle="Unified contact management and lifecycle relationships mapped seamlessly to the ERP financial core."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AppStatCard
          label="Total Customers"
          value={customerContacts.length}
          subtext="Entities with active customer role"
          icon={<Users size={20} />}
          tone="primary"
        />
        <AppStatCard
          label="Primary Accounts"
          value={contacts.length}
          subtext="Total directory records"
          icon={<UserCheck size={20} />}
          tone="success"
        />
        <AppStatCard
          label="Account Engagement"
          value="100%"
          subtext="Integrated with unified ledger"
          icon={<HeartHandshake size={20} />}
          tone="info"
        />
      </div>

      {isLoading ? (
        <div className="rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-12">
          <AppLoading label="Loading customer relationships..." />
        </div>
      ) : (
        <CustomerTable contacts={contacts} />
      )}
    </div>
  );
}
