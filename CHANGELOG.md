# Nebula ERP — Changelog

All notable changes to Nebula ERP will be documented in this file.

## [1.0.0-enterprise] — 2026-08-31

### Added
- **Mission Control Command Center**: Lightweight developer-only intelligence dashboard reading from `.nebula/mission-control.json` to visualize roadmap tasks, module health, and quality gates.
- **Multi-Currency Revaluation Module**: Automated FX gain/loss adjustment across foreign currency general ledger accounts (NEB-007).
- **Landed Cost Allocation Service**: Freight, duty, and insurance apportionment across inventory receipts (NEB-006).
- **Automated 3-Way Matching Engine**: Matching purchase orders, goods receipts, and vendor invoices with configurable tolerance bands (NEB-003).
- **Enterprise Chart of Accounts & General Ledger**: Double-entry bookkeeping engine with period locks and audit trails (NEB-002).

### Architectural Rationale
- Adopted strict Modular Monolith and Clean Architecture principles with domain boundary enforcement and Anti-Corruption Layers (ACL).
- Implemented lightweight developer telemetry (`.nebula/mission-control.json`) to track sprint progress and roadmap status without polluting production runtime bundles.
