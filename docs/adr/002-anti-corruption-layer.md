# ADR-002: Anti-Corruption Layer (ACL) and Integration Registries

## Status
Accepted

## Context
In an enterprise ERP comprising 19+ distinct business domains (e.g., POS interacting with Inventory, Sales, and Accounting), modules frequently need data or services from neighboring domains. 

## Problem
Allowing modules to directly import internal service functions or database queries from other modules creates tight coupling, circular dependencies, and a brittle architecture where changing a private function in one module breaks another.

## Original Design
Direct cross-module service calls and arbitrary file imports across feature folders (e.g., POS importing directly from `modules/sales/services/sales.service.ts`).

## New Design
An **Anti-Corruption Layer (ACL) and Integration Registry** located at `apps/web/src/integrations/`. Modules are strictly forbidden from importing internal services from foreign modules. Instead, inter-module interactions must pass through designated integration contracts and mappers (e.g., `integrations/inventory`, `integrations/sales`).

## Reason for Change
To protect domain boundaries and prevent architectural degradation as the number of modules scales.

## Advantages
- **Decoupled Domains**: Modules remain completely sovereign and ignorant of foreign internal implementations.
- **Microservice Ready**: The integration layer serves as an adapter boundary that can be easily swapped from local function calls to HTTP/gRPC API gateways when microservices are introduced.
- **Clear Contracts**: Explicit data transfer objects (DTOs) and mappers prevent internal model leakage.

## Disadvantages
- **Boilerplate**: Requires writing mapper and integration registry functions for cross-domain data access.

## Affected Modules
`pos`, `sales`, `purchase`, `inventory`, `accounting`, `payments`, `contacts`, `integrations/`.

## Future Implications
When extracting modules into independent services, the integration registry implementations are updated to point to remote network endpoints without requiring any changes to the consuming module's internal business logic.
