# Nebula ERP - Official Architecture & Technical Documentation

## 1. Executive Summary

Nebula ERP is an enterprise-grade, modular ERP platform currently built as a React-based Single Page Application (SPA). The repository demonstrates a rigorous application of **Domain-Driven Design (DDD)** on the frontend. Rather than a tangled web of UI components, the architecture enforces strict module boundaries, isolated bounded contexts, and a dedicated integration layer to prevent domain leakage. 

This document serves as the official reconstruction of the Nebula ERP architecture, reverse-engineered and analyzed by the Principal Architect, separating implemented facts from architectural assumptions.

## 2. Structural Architecture & Monorepo Setup

The system is configured as a monorepo workspace (currently managed via npm workspaces, originally pnpm/Turbo). 

- **Frontend Application (`apps/web`)**: A Vite-powered React application written in TypeScript. 
- **Styling**: Tailwind CSS v4, strictly utilizing design tokens (`var(--nebula-*)`) and avoiding inline/hardcoded styles to support enterprise white-labeling and theming.
- **State Management**: `@tanstack/react-query` handles remote server state, caching, and mutation synchronizations. Local state is restricted to UI behavior (e.g., cart state in POS) using React hooks.
- **Routing**: `react-router-dom` drives the modular navigation.

## 3. Domain-Driven Design (DDD) Implementation

The most critical architectural achievement of Nebula ERP is its enforcement of DDD principles on the frontend, anticipating a modular monolith or microservice backend.

### 3.1 The `core` Module (Shared Kernel)
Located at `apps/web/src/core/`, this is the **Shared Kernel**. It contains shared entity contracts (Company, User, Employee, Contact, Product) and foundational event payloads.
- **Rule enforced**: Modules never define their own version of a Customer or Product. They import the shared `Contact` or `Product` interface from `core`.
- **Cross-Module References**: Rather than deeply nesting objects, `core/types/references.types.ts` defines lightweight reference types (e.g., `SalesOrderReference`). This enables relational mapping (POS → Sales → Payment) without forcing POS to import Sales business logic.

### 3.2 Feature Modules (Bounded Contexts)
Located in `apps/web/src/modules/`, these represent isolated business domains. There are currently **19 business domains**:
1. **Accounting**: Chart of Accounts, Journal Entries, General Ledger.
2. **Activity**: System-wide activity timelines and audit logs.
3. **Assets**: Fixed asset tracking and depreciation.
4. **Contacts**: Customer, Vendor, and Business relationship ledgers.
5. **CRM**: Customer pipeline and relationship management.
6. **Dashboard**: Executive summaries and financial snapshots.
7. **Expenses**: Expense categorization and tracking.
8. **Inventory**: Product Master, Stock Adjustments, Movements, Transfers, Ledger, Units, Warehouses.
9. **Notifications**: In-app notification center.
10. **Payments**: Accounts Receivable, Accounts Payable, Payment allocations.
11. **POS (Point of Sale)**: Cashier interface, Cart management, Shifts, Registers, Receipt printing, Loyalty integration.
12. **Purchase**: Purchase Orders, Goods Receive, Supplier management.
13. **Reconciliation**: Bank statement imports and ledger matching.
14. **Reports**: Balance sheets, Cash flow, Profit & Loss.
15. **Sales**: Sales Orders, Delivery processing.
16. **Search**: Global system search.
17. **Service Desk**: Ticketing, Technician scheduling, SLA tracking.
18. **Settings**: Tenant-level and user-level configurations.
19. **Tax**: Tax rate management and summaries.

### 3.3 The `integrations` Layer (Anti-Corruption Layer)
Located at `apps/web/src/integrations/`. 
- **Rule enforced**: Modules **cannot** import internal services from other modules. If the POS needs to read a Sales Order, it does not import `src/modules/sales/services/...`. Instead, it imports from `src/integrations/sales`.
- **Purpose**: This acts as an Anti-Corruption Layer (ACL) and Registry. It provides read-only contracts and mappers. When the backend is eventually split into microservices, this frontend integration layer will seamlessly swap local API calls for specific gateway endpoints without breaking UI modules.

## 4. Interaction & Communication Layers

### 4.1 The API Client (`apiClient`)
The frontend communicates exclusively via `apps/web/src/api/client.ts`. It assumes a standard REST API backend available at `VITE_API_URL` (defaulting to `http://localhost:3000/api`). 
- Interceptors handle Authorization headers automatically.
- Every service (e.g., `inventory.service.ts`) delegates to `apiClient.get()` or `apiClient.post()`.

### 4.2 Event-Driven Architecture (Future Proofing)
The `core/types/events.types.ts` file outlines a comprehensive event envelope system (e.g., `STOCK_CHANGED`, `SALE_COMPLETED`). While currently acting as type definitions, this explicitly anticipates an Event-Driven backend (e.g., Kafka, RabbitMQ, or Postgres NOTIFY) and potentially frontend WebSocket listeners.

### 4.3 Security & Permissions (RBAC)
Role-Based Access Control (RBAC) is enforced locally via `apps/web/src/hooks/usePermission.ts` and `apps/web/src/permissions/`. Components wrap restricted features (e.g., POS Dashboard requires `REPORTS_VIEW` permissions).

## 5. Fact vs. Assumption Analysis

To protect the architectural integrity of Nebula ERP, we must distinctly separate what is actually implemented from what is merely implied.

### Facts (What is currently built)
- **Frontend SPA Only**: The repository contains *no backend source code*, no database schema, and no ORM logic. It is purely a React/Vite web application.
- **Strict Modularity**: The codebase successfully isolates business logic. The POS module, for example, successfully orchestrates Sales, Inventory, and Loyalty without tangling their underlying source files.
- **REST Protocol Standard**: All frontend services map to standard RESTful endpoints (`/inventory/products`, `/accounting/journal-entries`, etc.).
- **Token-Based Theming**: CSS variables drive the entire UI, allowing instantaneous multi-tenant white-labeling.

### Assumptions (What the architecture implies)
- **Backend Architecture**: The frontend implicitly assumes a matching Modular Monolith or Microservice backend. If a monolithic backend with tightly coupled database schemas is built, it will violate the boundary principles established in the frontend.
- **Data Persistence**: The frontend assumes the existence of relational tables mirroring `core/entities` (e.g., `companies`, `users`, `products`, `documents`).
- **Synchronous Execution**: Features like `handleConfirmPayment` in POS assume that creating a transaction synchronously returns the created entities. 
- **Authentication**: `auth.service.ts` assumes a standard JWT or session-cookie auth flow, currently mocked with a hardcoded `admin@nebula.local` user.

## 6. Strategic Architectural Direction

As the Principal Architect, my immediate technical directives for the evolution of Nebula ERP are:

1. **Backend Provisioning (Phase 1)**: We must provision a backend (Node.js/TypeScript) adhering to the exact same DDD bounded contexts defined in `/apps/web/src/modules`. We will adopt a Modular Monolith architecture for the backend initially, using a shared Postgres database but strictly segregating schemas (e.g., `inventory.products`, `accounting.ledgers`) to mirror the frontend isolation.
2. **State & Event Sourcing**: For modules like Accounting and Inventory, we must ensure the backend treats Ledgers and Stock Movements as append-only immutable records, rather than mutable state tables.
3. **API Contract Enforcement**: The backend must satisfy the exact interfaces defined in `apps/web/src/core/entities`.
4. **ADR Workflow**: All future structural changes (e.g., introducing a message broker, changing auth providers) must be documented in a new `docs/adr/` directory before implementation.
