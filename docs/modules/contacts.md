# Nebula ERP Module Specification: Contacts

## 1. Purpose
The Contacts module manages centralized business relationship data, unifying customers, suppliers, partners, and vendors into a single master contact directory with real-time financial balances.

## 2. Business Responsibilities
- Master contact directory management (Customer, Vendor, Supplier, Both).
- Contact ledger tracking (Accounts Receivable and Accounts Payable balances per contact).
- Contact-specific metadata, billing/shipping addresses, and tax identification numbers.

## 3. Current Status
- **Implementation State**: Fully developed frontend module with tables, forms, balances, and ledger views.
- **Maturity**: Production-ready UI components integrated with the global shared kernel.

## 4. Architecture
- **Bounded Context**: Party & Relationship Management.
- **Pattern**: DDD vertical slice residing in `apps/web/src/modules/contacts/`.

## 5. Entities
- `Contact`: Represents an enterprise relationship entity (ID, name, type [customer/supplier/both], email, phone, tax ID, addresses, credit limit, current balance).
- `ContactLedger`: Transaction history affecting a specific contact's balance.

## 6. Database (Target PostgreSQL Schema)
- `contacts.contacts`: PK id, name, type (enum), email, phone, tax_id, billing_address, shipping_address, credit_limit, current_balance, created_at.
- `contacts.ledgers`: PK id, contact_id (FK), transaction_id, reference_type, amount, balance_after, date.

## 7. API Contracts
- `GET /api/v1/contacts` - Retrieve contact directory with search/filter.
- `POST /api/v1/contacts` - Create new contact.
- `GET /api/v1/contacts/{id}/ledger` - Retrieve contact financial ledger.

## 8. UI Components
- `ContactsPage`: Master contact management view.
- `ContactTable` & `ContactForm`: Contact directory and creation/edit forms.
- `ContactBalance` & `ContactLedgerTable`: Financial standing and transaction history per contact.
- `ContactSelector`: Reusable dropdown component used across Sales and Purchase modules.

## 9. Dependencies
- `@tanstack/react-query`, `core/entities/contact.types.ts`.

## 10. External Integrations
- `integrations/customer`: Feeds CRM and Sales modules.
- `integrations/finance`: Links with Payments and Accounting.

## 11. Business Rules
- **Unique Identification**: Tax IDs and emails should be validated for uniqueness where applicable.
- **Credit Limit Enforcement**: Sales orders exceeding a customer's credit limit must trigger managerial approval workflows.

## 12. Permission Rules
- `contacts:contact:read` / `write`: Manage contact directory.
- `contacts:ledger:read`: View contact financial standing.

## 13. Events Emitted / Consumed
- **Emitted**: `CONTACT_CREATED`, `CONTACT_UPDATED`, `CONTACT_CREDIT_EXCEEDED`.

## 14. Future Improvements
- CRM pipeline linking and automated customer segmentation.
- Customer portal access management.

## 15. Missing Features
- Multi-contact person association per company organization.

## 16. Risks
- Duplicate contact creation leading to fragmented financial ledgers.

## 17. Technical Debt
- Search indexing is currently client-side; needs server-side pagination and full-text search for large enterprises.
