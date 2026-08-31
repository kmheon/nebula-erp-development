# Nebula ERP — Changelog

All notable changes to Nebula ERP will be documented in this file.

## [1.0.0-enterprise] — 2026-08-31

### Added
- **Governance Framework Lock & Transition to Feature Development (NEB-GOV-04)**: Officially completed and locked the Nebula ERP governance framework. Synchronized all documentation, established the comprehensive Mission Control Project Overview panel, locked the roadmap, and transitioned the repository into Enterprise ERP Feature Development Mode with NEB-008 as the active task.
- **Enterprise Code Ownership & Architectural Enforcement (NEB-GOV-03)**: Established permanent code ownership rules, dependency analysis requirements, strict reuse policies, business rule documentation mandates, public API export contracts via `index.ts`, commenting standards, and the Mission Control "Architecture Compliance" panel.
- **Enterprise Architecture Decision Record (ADR) System (NEB-GOV-02)**: Implemented permanent ADR repository under `/docs/adr/` containing 000-template, 001-modular-monolith, 002-shared-kernel, 003-anti-corruption-layer, 004-query-architecture, 005-enterprise-settlement-engine, 006-financial-foundation-strategy, 007-reusable-module-policy, and 008-documentation-governance. Mandated ADR review, creation, and updating for all major architectural changes across `AGENTS.md` and `DEVELOPMENT_GOVERNANCE.md`.
- **Permanent Development Governance & 7-Phase Lifecycle**: Locked in mandatory 7-phase development lifecycle (Discovery, Implementation, Validation, Knowledge Update, Mission Control, Project Journal, Roadmap) and definition of done in `AGENTS.md` and `/docs/DEVELOPMENT_GOVERNANCE.md`.
- **Roadmap Revision & Governance (NEB-001A)**: Structured roadmap into Enterprise Epics (EPIC-01 through EPIC-08), established mandatory documentation governance, created `PROJECT_JOURNAL.md`, and locked in the financial foundation prerequisite rule over workflow controls.
- **Financial Foundation Roadmap Reorganization**: Reorganized roadmap into Enterprise Epics (EPIC-01 through EPIC-08), prioritizing core financial infrastructure before workflow control engines.
- **Enterprise Cash & Bank Management (NEB-008)**: Initialized planning and specification for multi-bank accounts, cash registers, cheque clearing, internal transfers, and bank statement handling integrated with the Settlement Engine.
- **Enterprise Settlement Engine & Unified Contact Ledger (NEB-007)**: Reusable shared settlement service supporting FIFO, LIFO, Due Date, Proportional, and Manual allocation policies, automatic customer/vendor net position calculation, and audit trails.
- **Repository Baseline Certification (NEB-000)**: Comprehensive repository hygiene audit, removal of stale build artifacts (`dist_old`), lint and TypeScript strict compliance verification.
- **Mission Control Command Center**: Lightweight developer-only intelligence dashboard reading from `.nebula/mission-control.json` to visualize roadmap tasks, module health, and quality gates.
- **Multi-Currency Revaluation Module**: Automated FX gain/loss adjustment across foreign currency general ledger accounts (NEB-007).
- **Landed Cost Allocation Service**: Freight, duty, and insurance apportionment across inventory receipts (NEB-006).
- **Automated 3-Way Matching Engine**: Matching purchase orders, goods receipts, and vendor invoices with configurable tolerance bands (NEB-003).
- **Enterprise Chart of Accounts & General Ledger**: Double-entry bookkeeping engine with period locks and audit trails (NEB-002).

### Architectural Rationale
- Adopted strict Modular Monolith and Clean Architecture principles with domain boundary enforcement and Anti-Corruption Layers (ACL).
- Implemented lightweight developer telemetry (`.nebula/mission-control.json`) to track sprint progress and roadmap status without polluting production runtime bundles.
