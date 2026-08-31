# ADR-001: Modular Monolith Architecture

## ADR Number
ADR-001

## Title
Modular Monolith Architecture

## Status
Accepted

## Date
2026-01-15

## Context
Nebula ERP competes with tier-one enterprise systems (SAP, NetSuite, Odoo). Choosing between distributed microservices and a modular monolith was foundational.

## Problem Statement
Distributed microservices introduce severe early operational overhead, network latency, and distributed transaction management complexity. Conversely, unstructured monoliths quickly degrade into unmaintainable spaghetti code.

## Decision
Adopt a strict Modular Monolith architecture with isolated domain modules (`accounting`, `inventory`, `sales`, `purchase`, `crm`, `settlement`, `banking`, etc.) communicating through explicit service interfaces and shared kernel abstractions within a single deployment artifact.

## Alternatives Considered
1. Full Microservices (Rejected due to distributed complexity and orchestration overhead).
2. Traditional Monolithic Spaghetti Code (Rejected due to maintenance hazard and lack of domain boundaries).

## Consequences
- **Positive**: High developer velocity, atomic database transactions across domains, easy local testing, and clean domain separation.
- **Negative**: Single shared runtime memory space.

## Risks
- Developers bypassing module boundaries via direct cross-module imports (mitigated by linter rules and architecture reviews).

## Future Considerations
- Domain slices are organized to allow future extraction into microservices if enterprise scaling requirements demand it.

## Related Tasks
- NEB-000 (Repository Baseline Certification)
- NEB-001A (Roadmap Revision & Governance)

## Related Modules
- All core and domain modules (`accounting`, `inventory`, `sales`, `purchase`, `settlement`, `banking`).

## Related Documentation
- `/docs/adr/001-modular-monolith.md`
- `/docs/ARCHITECTURE_DECISIONS.md`
