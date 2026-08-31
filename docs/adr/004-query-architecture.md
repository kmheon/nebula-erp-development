# ADR-004: Query Architecture & State Management

## Status
Accepted

## Context
Enterprise ERP dashboards require responsive server-state caching, optimistic UI updates, and performant handling of large datasets (e.g. 50,000+ ledger lines).

## Problem
Unmanaged local component state for server queries leads to stale data, redundant network fetching, and UI freezing during heavy calculations.

## Decision
Standardize on **TanStack Query (React Query)** for asynchronous server state caching paired with immutable service layers and TanStack Virtual for high-performance table rendering.

## Alternatives Considered
1. **Raw React useEffect + Local State**: Rejected due to cache invalidation bugs and race conditions.
2. **Redux Toolkit Query**: Rejected as unnecessarily heavyweight for modular monolith architecture.

## Consequences
- **Positive**: Robust background refetching, automatic cache management, optimistic updates, and smooth 60 FPS table scrolling.
- **Negative**: Learning curve for engineers unfamiliar with query key invalidation patterns.
- **Risks**: Over-fetching if stale times are configured too aggressively.

## Related Modules
- All data-intensive modules (`accounting`, `inventory`, `sales`, `purchase`, `settlement`).

## Related Tasks
- NEB-003, NEB-007, NEB-008

## Future Notes
- Implement persisted query caching for offline-first POS terminal operations.
