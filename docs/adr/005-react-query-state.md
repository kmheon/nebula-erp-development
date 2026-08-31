# ADR-005: TanStack React Query for Remote State Synchronization

## Status
Accepted

## Context
An enterprise ERP handles thousands of asynchronous remote data queries and mutations across 19 modules (Inventory stock levels, General Ledger entries, POS transactions, Customer ledgers).

## Problem
Managing server state using local React `useState` and `useEffect` leads to race conditions, redundant network requests, stale UI caches, and complex manual loading/error boilerplate.

## Original Design
Scattered asynchronous fetch calls wrapped in local component state hooks.

## New Design
Standardized server state management using `@tanstack/react-query` across all modules, paired with structured query key factories (`queries/*.keys.ts`).

## Reason for Change
To ensure robust caching, automatic background refetching, optimistic UI updates, and predictable cache invalidation upon domain mutations.

## Advantages
- **Automatic Caching & Deduplication**: Prevents redundant network requests for shared reference data.
- **Optimistic Updates**: Delivers instant feedback for high-frequency operations like POS checkout and inventory adjustments.
- **Structured Query Keys**: Organized query key factories prevent cache collision and make targeted invalidation trivial.

## Disadvantages
- **Learning Curve**: Requires developers to understand query lifecycle, stale times, and cache invalidation patterns.

## Affected Modules
All modules utilizing remote data fetching (`accounting`, `inventory`, `sales`, `purchase`, `pos`, `crm`, `payments`, `assets`, `expenses`, `reconciliation`, `reports`, `service-desk`, `tax`, `settings`, `notifications`).

## Future Implications
Provides a clean abstraction layer for offline synchronization (critical for POS offline resilience) and real-time WebSocket cache invalidation.
