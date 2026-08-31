# Nebula ERP Module Specification: Dashboard

## 1. Purpose
The Dashboard module provides executive leadership and operators with a real-time, aggregated command center displaying key financial snapshots, inventory health metrics, executive KPI cards, and recent activity streams.

## 2. Business Responsibilities
- Aggregate real-time metrics across Accounting, Sales, Inventory, and POS domains.
- Render executive summary cards (Total Revenue, Cash Flow, Outstanding Receivables, Low Stock Alerts).
- Provide quick-action shortcuts for primary operational workflows.

## 3. Current Status
- **Implementation State**: Fully developed frontend dashboard with modular widget components and mock query hooks.
- **Maturity**: Production-ready command center interface.

## 4. Architecture
- **Bounded Context**: Executive Analytics & Command Center.
- **Pattern**: DDD vertical slice residing in `apps/web/src/modules/dashboard/`.

## 5. Entities
- `ExecutiveMetric`: Aggregated indicator structure (title, value, change percentage, trend).
- `FinancialSnapshot`: Balance and cash flow summary data contract.

## 6. Database (Target PostgreSQL Schema)
- Operates as an aggregation layer querying views and summary tables across `accounting.*`, `sales.*`, and `inventory.*`. No standalone transactional database tables required.

## 7. API Contracts
- `GET /api/v1/dashboard/metrics` - Retrieve executive summary metrics.
- `GET /api/v1/dashboard/financial-snapshot` - Retrieve high-level financial health indicators.

## 8. UI Components
- `DashboardPage`: Master command center view.
- `ExecutiveCards`: High-level KPI grid.
- `FinancialSnapshot`: Cash flow and P&L miniature charts.
- `InventoryHealth`: Stock status warning widgets.
- `RecentActivity`: Real-time audit stream snippet.
- `QuickActions`: Fast-navigation utility panel.

## 9. Dependencies
- `@tanstack/react-query`, `recharts` for charting.

## 10. External Integrations
- Aggregates data from Accounting, Inventory, Sales, and POS via integration registries.

## 11. Business Rules
- **Real-Time Freshness**: Dashboard metrics must refresh efficiently via React Query caching intervals without overwhelming backend services.

## 12. Permission Rules
- `dashboard:executive:read`: Access executive financial snapshots (restricted by role).

## 13. Events Emitted / Consumed
- **Consumed**: Listens to system-wide domain events to trigger UI cache invalidation and metric re-fetching.

## 14. Future Improvements
- Customizable widget drag-and-drop dashboard builder per user role.
- AI-generated executive morning briefing summaries.

## 15. Missing Features
- Export dashboard snapshot to PDF/Excel.

## 16. Risks
- Performance bottlenecks on heavy aggregations if backend queries are unoptimized (mitigated by materialized views).

## 17. Technical Debt
- Mock metric calculations need replacement with high-performance SQL materialized view queries.
