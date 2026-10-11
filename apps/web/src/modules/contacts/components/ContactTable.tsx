import { AppBadge } from "../../../components/ui";
import type { Contact } from "../types/contact.types";

type ContactTableProps = {
  contacts: Contact[];
  selectedContactId?: string;
  onSelect?: (contact: Contact) => void;
};

export default function ContactTable({
  contacts,
  selectedContactId,
  onSelect,
}: ContactTableProps) {
  return (
    <div className="surface overflow-hidden rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-secondary)]">
          <tr className="border-b border-[var(--nebula-border)]">
            <th className="p-3.5 text-left font-semibold">Name</th>
            <th className="p-3.5 text-left font-semibold">Company</th>
            <th className="p-3.5 text-left font-semibold">Roles</th>
            <th className="p-3.5 text-left font-semibold">Phone</th>
            <th className="p-3.5 text-left font-semibold">Email</th>
            <th className="p-3.5 text-left font-semibold">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--nebula-border)]">
          {contacts.map((contact) => (
            <tr
              key={contact.id}
              className={`cursor-pointer transition-colors ${
                selectedContactId === contact.id
                  ? "bg-[var(--nebula-primary)]/10"
                  : "hover:bg-[var(--nebula-surface-hover)]"
              }`}
              onClick={() => onSelect?.(contact)}
            >
              <td className="p-3.5 font-medium text-[var(--nebula-text-primary)]">{contact.name}</td>

              <td className="p-3.5 text-[var(--nebula-text-secondary)]">{contact.companyName || "-"}</td>

              <td className="p-3.5">
                <div className="flex flex-wrap gap-1">
                  {contact.roles.map((role) => (
                    <AppBadge
                      key={role}
                      tone={role === "customer" ? "primary" : "secondary"}
                      size="sm"
                    >
                      {role}
                    </AppBadge>
                  ))}
                </div>
              </td>

              <td className="p-3.5 text-[var(--nebula-text-secondary)]">{contact.phone || "-"}</td>

              <td className="p-3.5 text-[var(--nebula-text-secondary)]">{contact.email || "-"}</td>

              <td className="p-3.5">
                <AppBadge
                  tone={contact.status === "active" ? "success" : "neutral"}
                  size="sm"
                >
                  {contact.status}
                </AppBadge>
              </td>
            </tr>
          ))}

          {contacts.length === 0 && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-[var(--nebula-text-secondary)]">
                No contacts found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
