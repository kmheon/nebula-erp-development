# ADR-003: Shared Kernel for Enterprise Entities and Domain Contracts

## Status
Accepted

## Context
Enterprise ERP systems manage foundational entities (such as `Company`, `User`, `Contact`, `Product`, and `Document`) that are referenced across nearly every business domain.

## Problem
Without a centralized contract definition, individual modules tend to redefine their own variations of core entities (e.g., Customer defined differently in POS vs CRM), leading to data inconsistency, serialization errors, and synchronization overhead.

## Original Design
Fragmented type definitions scattered across individual module folders without a unifying source of truth.

## New Design
A dedicated **Shared Kernel** located at `apps/web/src/core/`, containing canonical enterprise entity interfaces, base reference types, and system-wide event contracts.

## Reason for Change
To enforce a unified Ubiquitous Language across all modules and guarantee type safety for shared data structures.

## Advantages
- **Unified Domain Language**: Ensures terms like `Contact`, `Product`, and `Company` have identical meaning across the entire platform.
- **Type Consistency**: Eliminates redundant interface definitions and prevents type drift between modules.

## Disadvantages
- **Rigidity**: Changes to shared kernel entities require careful review to avoid downstream compilation impacts across all modules.

## Affected Modules
`core/`, all feature modules (`accounting`, `contacts`, `inventory`, `pos`, `sales`, `purchase`, etc.).

## Future Implications
The Shared Kernel will evolve into a shared npm package (`@nebula/core`) when backend and frontend monorepo tooling is fully split into independent micro-packages.
