# ADR-001: Modular Monolith Architecture

## Status
Accepted

## Context
Nebula ERP is engineered as an enterprise-grade ERP platform competing with tier-one systems (SAP, NetSuite, Odoo). Choosing between distributed microservices and a modular monolith was foundational.

## Problem
Distributed microservices introduce severe early overhead (network latency, distributed transactions, complex orchestration), while traditional unstructured monoliths degrade into unmaintainable spaghetti code.

## Decision
Adopt a strict **Modular Monolith** architecture with isolated domain modules (`accounting`, `inventory`, `sales`, `purchase`, `crm`, `settlement`, etc.) communicating through explicit service interfaces and shared kernel abstractions.

## Alternatives Considered
1. **Full Microservices**: Rejected due to prohibitive operational complexity and distributed transaction overhead at current stage.
2. **Traditional Monolith**: Rejected due to lack of domain boundary enforcement and high technical debt accumulation.

## Consequences
- **Positive**: High developer velocity, atomic database transactions, clear domain separation, and modular testability.
- **Negative**: Shared runtime and deployment artifact.
- **Risks**: Developers bypassing module boundaries via direct cross-module imports (mitigated by linter rules and architecture audits).

## Related Modules
- All modules across Nebula ERP core and domain boundaries.

## Related Tasks
- NEB-000 (Repository Baseline Certification)
- NEB-001A (Roadmap Revision & Governance)

## Future Notes
- Domain slices are structured to allow clean future extraction into microservices if enterprise scaling requirements demand it.
