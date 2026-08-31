# Nebula ERP — Architecture Decisions (ADR Registry)

This document indexes and summarizes all formal Architecture Decision Records (ADRs) governing Nebula ERP.

---

## Index of Architecture Decision Records

| ADR ID | Title | Status | Date | Summary |
| :--- | :--- | :--- | :--- | :--- |
| **ADR-001** | Modular Monolith Architecture | Approved | 2026-01-15 | Adopt modular monolith pattern with strict domain boundaries and shared kernel. |
| **ADR-002** | Anti-Corruption Layer (ACL) | Approved | 2026-01-20 | Implement ACLs between external integrations and core ERP modules. |
| **ADR-003** | Shared Kernel & Cross-Cutting Services | Approved | 2026-02-01 | Establish shared utilities for audit logging, authentication, and state management. |
| **ADR-004** | Design Token Theming & Anti-Slop UI | Approved | 2026-02-10 | Mandate high-contrast design system, mathematical spacing, and no generic AI styling. |
| **ADR-005** | React Query & Immutable State | Approved | 2026-02-18 | Use React Query for server-state caching and immutable service layers. |
| **ADR-006** | Financial Foundation Prioritization | Approved | 2026-08-31 | Mandate completion of Phase 2 (Financial Foundation) before Phase 4 (Workflow Controls). |

---

## Detailed Summaries

### ADR-001: Modular Monolith Architecture
- **Context**: Choosing between microservices and monolith for enterprise ERP.
- **Decision**: Modular Monolith. Combines the deployment simplicity of a monolith with strict domain boundaries (Accounting, Sales, Purchase, Inventory, CRM, HR, Manufacturing).
- **Consequences**: Fast local development and testing, clear module boundaries, zero network overhead between core domains, easy future extraction to microservices if needed.

### ADR-002: Anti-Corruption Layer (ACL)
- **Context**: Preventing external system models (e.g. Stripe, Bank APIs) from polluting domain models.
- **Decision**: Enforce strict mapping boundaries using adapter services.
- **Consequences**: Insulates core ERP financial data from third-party schema changes.

### ADR-003: Shared Kernel & Cross-Cutting Services
- **Context**: Common utilities needed across all modules.
- **Decision**: Centralize logging, currency formatting, audit trail generation, and settlement logic in `src/core/` and module-specific shared services.
- **Consequences**: Reduced code duplication and consistent cross-module behavior.

### ADR-004: Design Token Theming & Anti-Slop UI
- **Context**: Avoiding generic, low-effort AI visual templates ("AI Slop").
- **Decision**: Strictly adhere to Design Bible guidelines (sophisticated neutrals, mathematical scale ratios, no gradient text, high legibility).
- **Consequences**: Professional enterprise aesthetic matching SAP and NetSuite.

### ADR-005: React Query & Immutable State
- **Context**: Managing asynchronous data fetching and cache invalidation.
- **Decision**: Standardize on React Query / TanStack Query patterns with immutable service stores.
- **Consequences**: Reliable cache management and optimistic UI updates.

### ADR-006: Financial Foundation Prioritization over Workflow Controls
- **Context**: Balancing the roadmap between financial accounting integrity and workflow approvals.
- **Decision**: Require all core financial modules (Settlement Engine, Cash & Bank Management, Multi-Currency, Reconciliation) to be fully certified before implementing multi-tier approval workflows.
- **Consequences**: Eliminates architectural risk of approving financially unsound transactions through automated routing.
