# Nebula ERP — Known Limitations & Technical Debt

This document tracks known architectural limitations, technical debt items, and planned refactoring targets in Nebula ERP.

---

## 1. Active Technical Debt Items

### TD-001: Client-Side State Persistence Fallback
- **Description**: While enterprise modules support robust local and session storage mocking, full production deployment requires persistent cloud database synchronization (Firestore / PostgreSQL).
- **Mitigation**: Modular service abstraction allows seamless swapping of mock storage adapters with real database repositories.
- **Priority**: High (Scheduled for production hardening phase).

### TD-002: Virtualized Ledger Performance Optimization
- **Description**: Large enterprise general ledgers with >50,000 journal lines require TanStack Virtual optimization to maintain 60 FPS rendering.
- **Mitigation**: Implemented row virtualizers in ledger and stock movement tables; ongoing tuning for complex filter permutations.
- **Priority**: Medium.

### TD-003: Multi-Currency Revaluation Batching
- **Description**: Real-time unrealized FX gain/loss recalculation across extensive multi-currency portfolios can cause UI stutter if not batched.
- **Mitigation**: Move currency revaluation calculations to asynchronous worker services.
- **Priority**: Medium.

---

## 2. Architectural Boundaries & Constraints
- **Single-Page Application Shell**: The current preview environment runs as a robust client-side modular monolith with lazy-loaded module bundles. Server-side rendering (SSR) is not currently enabled.
- **Browser Storage Limits**: LocalStorage and IndexedDB quota limits apply when storing extensive attachments or un-synced audit logs offline.
