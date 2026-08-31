# ADR-001: Modular Monolith Architecture over Microservices

## Status
Accepted

## Context
Nebula ERP is designed to compete with enterprise giants like SAP, Oracle NetSuite, and Microsoft Dynamics 365 while maintaining high developer velocity. When structuring the system architecture, we evaluated whether to start with a distributed microservice architecture or a unified monolith.

## Problem
Distributed microservices introduce severe early-stage overhead (network latency, distributed transactions/Saga patterns, complex deployment pipelines, service discovery, and debugging challenges) which would severely hinder initial feature velocity and domain exploration. Conversely, a traditional unmodularized monolithic codebase quickly devolves into "spaghetti architecture" with circular dependencies and untestable business logic.

## Original Design
Initial concept or unstructured monolithic scripts where all UI components, business services, and database queries are tightly coupled across global directories.

## New Design
A strict **Modular Monolith** architecture. The codebase is organized into independent, self-contained business modules (Accounting, Inventory, POS, Sales, Purchase, CRM, etc.) residing in `apps/web/src/modules/`, while enforcing strict architectural boundaries and zero direct cross-module imports.

## Reason for Change
To combine the development simplicity and transactional integrity of a monolith with the clean domain boundaries required for future microservice extraction.

## Advantages
- **Transactional Simplicity**: Single database transactions across domain boundaries during early phases.
- **High Velocity**: No network serialization overhead or complex service discovery during development.
- **Clean Boundaries**: Strict directory separation ensures business domains remain pure and decoupled.

## Disadvantages
- **Scaling Limits**: All modules share the same deployment artifact and runtime memory space.
- **Discipline Required**: Developers must resist the temptation to import services directly from other modules.

## Affected Modules
All modules (`accounting`, `inventory`, `sales`, `purchase`, `pos`, `crm`, `assets`, `expenses`, `payments`, `reconciliation`, `reports`, `service-desk`, `tax`, `settings`, `notifications`, `activity`, `search`, `dashboard`, `contacts`).

## Future Implications
When individual domains (e.g., POS or Inventory) scale to high throughput demands, their self-contained vertical slice structure allows them to be cleanly extracted into independent microservice workers with minimal refactoring.
