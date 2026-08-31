/**
 * Supplier Mapper & Registry ACL for Purchase Module.
 * 
 * ARCHITECTURAL RATIONALE:
 * Unifies the Purchase module's supplier entities with the canonical Contact Registry.
 * Prevents duplicate, isolated supplier tables by mapping core Contact entities (with vendor role)
 * to purchase-specific Supplier shapes, mirroring the Customer registry pattern (`src/integrations/customer/`).
 */

import type { Contact } from "core";
import type { Supplier, SupplierStatus } from "../../modules/purchase/types/purchase.types";

export type PurchaseSupplier = Supplier;

/**
 * Maps a core Contact entity to the Purchase module's Supplier representation.
 */
export function toPurchaseSupplier(contact: Contact): PurchaseSupplier {
  let status: SupplierStatus = "active";
  if (contact.status === "archived" || contact.status === "inactive") {
    status = "inactive";
  }

  return {
    id: contact.id,
    companyName: contact.companyName || contact.name,
    contactPerson: contact.name,
    phone: contact.phone || "",
    email: contact.email || "",
    address: contact.address || "",
    taxNumber: contact.taxNumber,
    status,
    createdAt: contact.createdAt,
    updatedAt: contact.updatedAt,
  };
}

/**
 * Maps a purchase supplier creation input into a core Contact creation/payload structure
 * for persistence through the unified contact registry.
 */
export function fromSupplierInput(input: {
  companyName?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxNumber?: string;
  status?: SupplierStatus;
}) {
  return {
    name: input.contactPerson || input.companyName || "Unnamed Supplier",
    companyName: input.companyName || "",
    type: "organization" as const,
    roles: ["vendor" as const],
    phone: input.phone || "",
    email: input.email || "",
    address: input.address || "",
    taxNumber: input.taxNumber,
    status: input.status === "inactive" ? ("inactive" as const) : ("active" as const),
    relationships: [],
  };
}
