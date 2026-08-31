# Nebula ERP - The Official Design Bible & System Constitution

> **Status**: Active / Constitutional Document  
> **Scope**: Global (Architecture, Engineering, Design, Product, Operations)  
> **Precedence**: Supreme. This document overrides all ad-hoc decisions, short-term workarounds, and unvetted patterns.

---

## 1. Vision
To establish Nebula ERP as the world's premier **AI-native, enterprise-grade, modular ERP platform**. Nebula ERP bridges the reliability, rigor, and compliance of legacy monolithic giants (SAP, Oracle NetSuite, Microsoft Dynamics 365) with the agility, modularity, and pristine developer experience of modern cloud-native software (Odoo, ERPNext, modern TypeScript ecosystems).

## 2. Mission
To eliminate enterprise software friction by embedding AI natively into every business workflow, enforcing strict domain isolation, and providing an extensible, high-performance architecture that scales seamlessly from mid-market enterprises to Fortune 500 multinationals without technical debt accumulation.

## 3. Goals
1. **Uncompromising Correctness**: Zero tolerance for silent financial discrepancies, data corruption, or inventory misalignment.
2. **Modular Sovereignty**: Complete decoupling of enterprise domains (Accounting, Inventory, POS, CRM, Supply Chain) to allow independent scaling, testing, and microservice extraction.
3. **AI-First Workflow**: Seamless integration of generative and analytical AI to automate bookkeeping, forecast inventory, detect anomalies, and accelerate operator decision-making.
4. **Developer Elegance**: Maintain an intuitive, strictly typed TypeScript codebase adhering to Domain-Driven Design (DDD) and SOLID principles.

---

## 4. Core Principles
* **Long-Term Maintainability over Short-Term Convenience**: Never compromise architecture for expediency. Every line of code must be written as if it will be maintained for decades.
* **Think Like the Giants**: Before approving any pattern or database model, evaluate: *"Would SAP, Microsoft, or Oracle build it this way?"* If not, elevate the standard.
* **Documentation-Driven Engineering**: System decisions must be captured in code and documentation (`/AGENTS.md`, `/ARCHITECTURE.md`, `/DESIGN_BIBLE.md`, ADRs). Transient chat knowledge is ephemeral; version-controlled documentation is eternal.
* **Zero Magic**: Code must be explicit, typed, and predictable. Magic wrappers and undocumented side-effects are strictly forbidden.

---

## 5. Architecture Principles
* **Modular Monolith First**: The system is architected as a rigorous Modular Monolith. Domains are completely isolated in source code with explicit boundaries, ready for seamless extraction into independent microservices when scale demands it.
* **Anti-Corruption Layers (ACL)**: Inter-domain communication is strictly mediated through defined integration registries and mappers. Modules never directly query or import internal services from foreign bounded contexts.
* **Event-Driven Foundation**: State mutations publish structured domain events, preparing the platform for asynchronous messaging, audit streaming, and reactive analytics.

---

## 6. Domain Philosophy
* **Strict Bounded Contexts**: Each module (Accounting, POS, Inventory, Sales, Purchase, Assets, CRM, etc.) represents a distinct DDD bounded context.
* **Ubiquitous Language**: Domain models use precise industry-standard terminology (e.g., General Ledger, Goods Receive Note, Cost of Goods Sold, SKU, Reconciliation).
* **Domain Isolation**: Business logic lives within the domain module, never leaking into UI components or generic utility files.

---

## 7. Entity Philosophy
* **Immutable Auditability**: Financial, inventory, and transaction entities are immutable or append-only where legal and business integrity demands it. Historical records cannot be silently overwritten; corrections are made via compensating entries.
* **Shared Kernel Contracts**: Foundational entities (`Company`, `User`, `Contact`, `Product`) are defined in the Shared Kernel (`core/entities`) and strictly adhered to across all modules.

---

## 8. AI Philosophy
* **Native Intelligence**: AI is not a superficial chatbot widget bolted onto the side; it is an integrated decision engine embedded directly into transaction validation, anomaly detection, cash flow forecasting, and inventory replenishment.
* **Auditable AI**: AI recommendations and automated journal entries must maintain clear provenance, explaining *why* a suggestion was made and providing human-in-the-loop override capabilities.

---

## 9. Security Philosophy
* **Defense in Depth**: Security is embedded at every layer—client routing guards, API middleware, domain validation, and database access controls.
* **Zero Trust Data Handling**: Tenant data is strictly segregated. No cross-tenant leakage is tolerated under any circumstance.
* **Secret Management**: API keys and environment secrets never touch the client bundle and are strictly governed by server-side environment configurations.

---

## 10. Permission Philosophy
* **Granular Role-Based Access Control (RBAC)**: Permissions are mapped to specific operational actions (`accounting:ledger:read`, `pos:register:close`, `inventory:stock:adjust`).
* **Declarative Enforcement**: UI elements and backend endpoints alike evaluate permissions explicitly, denying access by default.

---

## 11. UI Philosophy
* **Enterprise Ergonomics**: Interfaces are designed for high-density, high-efficiency data entry and monitoring. Operators spend hours in the system; legibility, keyboard navigation, and feedback latency take precedence over flashy animations.
* **Design Token Discipline**: All styling utilizes CSS design tokens (`var(--nebula-*)`) and Tailwind utility classes. Inline styles and arbitrary color codes are strictly prohibited to support seamless enterprise multi-tenant theming.
* **Anti-Slop Standard**: Rejection of generic AI visual clichés (nested cards, gradient text, arbitrary glow effects). Focus on mathematical typographic scales, precise padding math, and refined neutrals.

---

## 12. Module Philosophy
* **Self-Contained Vertical Slices**: Every module contains its own components, hooks, services, types, and queries.
* **Zero Direct Cross-Module Dependencies**: Modules communicate solely through public integration contracts (`src/integrations`), preventing circular dependencies and spaghetti architectures.

---

## 13. API Philosophy
* **RESTful Consistency**: Standard HTTP methods, predictable resource naming (`/api/v1/[domain]/[resource]`), and standardized error payloads.
* **Strict Schema Validation**: Incoming payloads and outgoing responses are validated against TypeScript contracts to prevent runtime type drift.

---

## 14. Database Philosophy
* **Schema Segregation**: Database architecture mirrors bounded contexts (e.g., `accounting.*`, `inventory.*`, `sales.*`), preventing monolithic database coupling.
* **Relational Integrity**: Foreign keys, strict constraints, and transactional consistency (ACID) are mandatory for financial and inventory ledgers.

---

## 15. Development Standards
* **Type Safety First**: Zero implicit `any`. Strict TypeScript compiler settings.
* **Linting & Formatting**: Enforced linting (`oxlint`, ESLint) and formatting (`prettier`) standards.
* **Build Verification**: Every code modification must successfully pass typechecking and build compilation (`npm run build`).

---

## 16. Enterprise Standards
* **Compliance Ready**: Designed with audit trails, immutable ledgers, and role separation suitable for regulated industries and GAAP/IFRS accounting standards.
* **Resilience**: Graceful degradation, idempotent transaction handling, and robust error boundaries.

---

## 17. Coding Standards
* **SOLID & Clean Architecture**: Single responsibility, open-closed, Liskov substitution, interface segregation, dependency inversion.
* **Pure Functions & Predictable State**: Avoid side effects in state handlers; leverage `@tanstack/react-query` for server state synchronization.

---

## 18. Scalability Strategy
* **Stateless Compute**: Application servers are stateless, allowing horizontal scaling behind load balancers.
* **Asynchronous Offloading**: Heavy computational tasks (reports generation, AI inference, batch reconciliation) are offloaded to background worker queues.

---

## 19. Future Roadmap
1. **Phase I**: Complete Modular Monolith frontend and provision modular PostgreSQL backend with schema segregation.
2. **Phase II**: Implement robust double-entry accounting engine and real-time inventory ledger synchronization.
3. **Phase III**: Deploy native AI agents for automated invoice reconciliation and predictive supply chain management.
4. **Phase IV**: Introduce microservice extraction tooling for high-load domains (POS and Inventory).

---

## 20. Long-term Vision
To become the definitive open and extensible enterprise ERP standard worldwide—empowering businesses of all sizes with sovereign data ownership, unbeatable performance, and artificial intelligence that acts as a true co-pilot for enterprise operations.
