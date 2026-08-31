# Nebula ERP - Strategic Product & Engineering Roadmap

> **Status**: Active / Official Roadmap  
> **Scope**: Global (Architecture, Backend Provisioning, Enterprise Features, AI, Infrastructure)  
> **Evaluation Date**: August 2026

---

## 1. Executive Rationale & Vision
Nebula ERP has successfully established a world-class, domain-driven frontend architecture across 19 enterprise modules. Our immediate engineering imperative is to bridge the frontend UI contracts with a robust, schema-segregated backend persistence layer, subsequently expanding into advanced AI-native capabilities, multi-tenant enterprise compliance, and high-throughput microservice scalability.

---

## 2. Roadmap Phases & Milestones

### Phase I: Immediate (Next 2-4 Weeks)
*Focus: Backend Foundation & Persistence Bridge*

* **Milestone 1.1: Modular Backend Scaffolding (`apps/api`)**
  - **Action**: Initialize a Node.js/TypeScript Express/Fastify API server in `apps/api` mirroring the exact bounded context structure of `apps/web/src/modules/`.
  - **Rationale**: Replaces mock service adapters with real RESTful endpoints while maintaining strict domain boundaries.
* **Milestone 1.2: PostgreSQL & Drizzle ORM Schema Provisioning**
  - **Action**: Provision PostgreSQL via Cloud SQL and implement schema segregation (`accounting.*`, `inventory.*`, `sales.*`, `pos.*`, etc.).
  - **Rationale**: Enforces transactional integrity (ACID) and relational constraints for double-entry bookkeeping and stock ledgers.
* **Milestone 1.3: Authentication & RBAC Middleware**
  - **Action**: Implement JWT/session authentication and backend permission enforcement middleware mapped to frontend RBAC roles.
  - **Rationale**: Secures tenant data and restricts operational endpoints according to enterprise security philosophies.

### Phase II: Next Release (Months 1-3)
*Focus: End-to-End Integration & Core Financial Hardening*

* **Milestone 2.1: Frontend-Backend API Wiring**
  - **Action**: Connect React Query client services to live API endpoints across all 19 modules.
  - **Rationale**: Eliminates mock data dependencies and enables true end-to-end data persistence across user sessions.
* **Milestone 2.2: Double-Entry Ledger Validation Engine**
  - **Action**: Enforce strict backend database constraints requiring `SUM(debits) == SUM(credits)` on all posted journal entries.
  - **Rationale**: Guarantees GAAP/IFRS financial compliance and prevents unbalanced ledger corruptions.
* **Milestone 2.3: POS Offline Sync Engine (IndexedDB)**
  - **Action**: Enhance POS offline service workers to queue offline transactions in durable IndexedDB storage and synchronize upon reconnection.
  - **Rationale**: Ensures uninterrupted retail store operations during network outages.

### Phase III: Next Major Version (Months 3-6)
*Focus: Enterprise Scalability & Advanced Analytics*

* **Milestone 3.1: Multi-Tenant Schema Isolation & White-Labeling**
  - **Action**: Implement multi-tenant database partitioning and runtime CSS variable injection via the Settings module.
  - **Rationale**: Allows enterprise clients to brand their ERP instance and guarantees absolute tenant data isolation.
* **Milestone 3.2: Automated Bank Feed Ingestion (Plaid / OFX)**
  - **Action**: Integrate open banking APIs into the Reconciliation module for automated daily statement syncing.
  - **Rationale**: Reduces manual CSV statement uploads and accelerates treasury reconciliation.
* **Milestone 3.3: Advanced Inventory Serial/Lot Traceability**
  - **Action**: Add serial number and batch/lot tracking capabilities to the Inventory and Purchase modules.
  - **Rationale**: Satisfies regulatory compliance for medical, electronics, and food supply chain distribution.

### Phase IV: Long-term (Months 6-12+)
*Focus: Microservice Extraction & Autonomous Ecosystems*

* **Milestone 4.1: Microservice Domain Extraction**
  - **Action**: Extract high-throughput domains (POS and Inventory) into standalone containerized microservices communicating via gRPC/Kafka.
  - **Rationale**: Scales high-load storefront operations independently from core financial ledgers.
* **Milestone 4.2: Enterprise ERP Marketplace & Plugin SDK**
  - **Action**: Release a secure plugin SDK allowing third-party developers to contribute certified modules to Nebula ERP.
  - **Rationale**: Expands platform extensibility akin to Odoo and Shopify app ecosystems.

---

## 3. Strategic Feature Pillars

### 3.1 Enterprise Features
* **Double-Entry General Ledger**: Immutable audit trails and period-end closing wizards.
* **Advanced Supply Chain**: Multi-warehouse stock transfers, lot traceability, and automated reorder triggers.
* **Role-Based Access Control (RBAC)**: Granular permission matrices across all operational workflows.
* **Multi-Currency Treasury**: Real-time exchange rate conversion and unrealized gain/loss tracking.

### 3.2 AI Features
* **AI Bookkeeper**: Automated journal entry categorization and receipt OCR field extraction using Gemini SDK.
* **Predictive Inventory Replenishment**: Machine learning forecasting of stock depletion rates based on historical sales velocity.
* **Executive Morning Briefing**: AI-generated natural language financial and operational summaries delivered daily to executive dashboards.
* **Smart Anomaly Detection**: Automated flagging of irregular expense claims or duplicate vendor bills.

### 3.3 Infrastructure
* **Cloud-Native Scalability**: Stateless API containers deployable on Cloud Run or Kubernetes.
* **High-Performance Caching**: Redis-backed session and query result caching.
* **Zero-Downtime Migrations**: Automated database schema migration pipelines with zero customer disruption.

### 3.4 Developer Experience
* **Strict TypeScript Monorepo**: Shared `@nebula/core` packages enforcing enterprise type safety.
* **Automated Testing Suite**: Comprehensive unit (Vitest), integration, and end-to-end (Playwright) testing pipelines.
* **Documentation-Driven Architecture**: Continuous synchronization of architecture decision records (ADRs) and module specs.

### 3.5 Platform Improvements
* **Sub-Second UI Latency**: Optimized TanStack Query caching and virtualized tables for large datasets.
* **Universal Command Palette**: Enhanced global search (Ctrl+K) with natural language query capabilities.
* **Thermal Receipt & Hardware Integration**: Direct WebUSB/Serial printer and cash drawer connectivity for POS terminals.
