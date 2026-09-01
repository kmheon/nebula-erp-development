import { useState } from "react";
import { Plus, Users, UserCheck, BookOpen, Building2 } from "lucide-react";
import ContactForm from "../components/ContactForm";
import ContactTable from "../components/ContactTable";
import ContactLedgerTable from "../components/ContactLedgerTable";
import ContactBalance from "../components/ContactBalance";
import {
  AppPageHeader,
  AppStatCard,
  AppButton,
  AppCard,
  AppEmptyState,
} from "../../../components/ui";

import { useContacts } from "../hooks/useContacts";
import { useContactLedger } from "../hooks/useContacts";

import type { Contact } from "../types/contact.types";

export default function ContactsPage() {
  const { data: contacts = [] } = useContacts();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: ledgerEntries = [] } = useContactLedger(
    selectedContact?.id || "",
  );

  const customersCount = contacts.filter((c) => c.roles.includes("customer")).length;
  const suppliersCount = contacts.filter((c) => c.roles.includes("vendor")).length;
  const dualCount = contacts.filter(
    (c) => c.roles.includes("customer") && c.roles.includes("vendor"),
  ).length;

  return (
    <div className="space-y-8">
      <AppPageHeader
        title="Unified Contact Directory"
        subtitle="Unified contact management and financial ledger. Contacts can act as Customers, Suppliers, or both without data duplication."
        actions={
          <AppButton
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={() => setShowForm(true)}
          >
            Add Contact
          </AppButton>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AppStatCard
          label="Total Directory"
          value={contacts.length}
          subtext="Active unified business entities"
          icon={<Users size={20} />}
          tone="primary"
        />
        <AppStatCard
          label="Customers"
          value={customersCount}
          subtext="Clients with receivable ledger"
          icon={<UserCheck size={20} />}
          tone="success"
        />
        <AppStatCard
          label="Suppliers"
          value={suppliersCount}
          subtext="Vendors with payable ledger"
          icon={<Building2 size={20} />}
          tone="info"
        />
        <AppStatCard
          label="Dual-Role Entities"
          value={dualCount}
          subtext="Eligible for settlement netting"
          icon={<BookOpen size={20} />}
          tone="default"
        />
      </div>

      {/* Contact Table Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--nebula-text-primary)]">
            Contact Registry
          </h2>
          <span className="text-xs text-[var(--nebula-text-secondary)]">
            Select a row to inspect financial ledger
          </span>
        </div>

        <ContactTable
          contacts={contacts}
          selectedContactId={selectedContact?.id}
          onSelect={setSelectedContact}
        />
      </div>

      {/* Contact Ledger Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--nebula-text-primary)]">
            Financial Ledger & Balance
            {selectedContact && (
              <span className="ml-3 text-sm font-normal text-[var(--nebula-text-secondary)]">
                — {selectedContact.name} ({selectedContact.roles.join(", ")})
              </span>
            )}
          </h2>
        </div>

        {selectedContact && <ContactBalance contact={selectedContact} />}

        {!selectedContact ? (
          <AppEmptyState
            title="No Contact Selected"
            description="Select a contact from the table above to view their chronological financial ledger and outstanding balances."
            icon={<Users size={32} />}
          />
        ) : (
          <AppCard
            title={`Ledger Entries (${ledgerEntries.length})`}
            subtitle="Chronological record of invoices, payments, bills, and settlement adjustments."
          >
            {ledgerEntries.length === 0 ? (
              <div className="py-8 text-center text-sm text-[var(--nebula-text-secondary)]">
                No financial activity recorded for this contact yet.
              </div>
            ) : (
              <ContactLedgerTable entries={ledgerEntries} />
            )}
          </AppCard>
        )}
      </div>

      {/* Modal: Contact Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg">
            <ContactForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
