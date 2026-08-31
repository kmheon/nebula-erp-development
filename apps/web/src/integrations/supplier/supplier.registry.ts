/**
 * Supplier Registry ACL — single access point for supplier data across the Purchase module.
 * 
 * ARCHITECTURAL RATIONALE:
 * Routes supplier queries and mutations through the shared Contact registry (`/contacts`),
 * ensuring suppliers are canonical Contact records with the `vendor` role.
 */

import { apiClient } from "../../api/client";
import type { Contact } from "core";
import { toPurchaseSupplier, fromSupplierInput } from "./supplier.mapper";
import type { PurchaseSupplier } from "./supplier.mapper";
import type { CreateSupplierInput, UpdateSupplierInput } from "../../modules/purchase/types/purchase.types";

/**
 * Fetch all suppliers (contacts with vendor role) via the unified Contact Registry.
 */
export async function getSuppliers(): Promise<PurchaseSupplier[]> {
  const response = await apiClient.get<Contact[]>("/contacts/contacts");
  const contacts = response.data ?? [];
  // Filter for contacts having the 'vendor' role or return all if fallback needed
  const vendors = contacts.filter((c) => c.roles?.includes("vendor") || c.roles?.length === 0);
  return vendors.map(toPurchaseSupplier);
}

/**
 * Create a new supplier via the unified Contact Registry.
 */
export async function createSupplier(data: CreateSupplierInput): Promise<PurchaseSupplier> {
  const payload = fromSupplierInput(data);
  const response = await apiClient.post<Contact>("/contacts", payload);
  if (!response.data) {
    throw new Error("Failed to create supplier in Contact Registry.");
  }
  return toPurchaseSupplier(response.data);
}

/**
 * Update an existing supplier via the unified Contact Registry.
 */
export async function updateSupplier(data: UpdateSupplierInput): Promise<PurchaseSupplier> {
  const payload = fromSupplierInput(data);
  const response = await apiClient.post<Contact>(`/contacts/${data.id}`, payload);
  if (!response.data) {
    throw new Error("Failed to update supplier in Contact Registry.");
  }
  return toPurchaseSupplier(response.data);
}

/**
 * Delete / archive a supplier via the unified Contact Registry.
 */
export async function deleteSupplier(id: string): Promise<void> {
  await apiClient.post(`/contacts/${id}/delete`, {});
}
