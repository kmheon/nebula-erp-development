# Nebula ERP Module Specification: Search

## 1. Purpose
The Search module provides global, multi-domain search capabilities across products, contacts, invoices, purchase orders, and documents.

## 2. Business Responsibilities
- Instant global query execution across all enterprise entities.
- Keyboard shortcut (Ctrl+K / Cmd+K) command palette access.
- Result categorization and quick navigation.

## 3. Current Status
- **Implementation State**: Fully developed frontend global search modal, hooks, and search service adapters.
- **Maturity**: Production-ready command palette UI.

## 4. Architecture
- **Bounded Context**: Enterprise Discovery & Navigation.
- **Pattern**: DDD vertical slice residing in `apps/web/src/modules/search/`.

## 5. Entities
- `SearchResult`: Unified search result structure (id, title, subtitle, module, url, icon).

## 6. Database (Target PostgreSQL Schema)
- Operates via full-text search indexes (`tsvector`) across `inventory.products`, `contacts.contacts`, `sales.sales_orders`, etc.

## 7. API Contracts
- `GET /api/v1/search?q={query}` - Execute cross-domain enterprise search.

## 8. UI Components
- `GlobalSearch`: Command palette modal with keyboard navigation.

## 9. Dependencies
- `@tanstack/react-query`, `react-router-dom`.

## 10. External Integrations
- Queries indexes across all feature modules.

## 11. Business Rules
- **Access Control**: Search results must be strictly filtered by the user's RBAC permissions, omitting entities the user is unauthorized to view.

## 12. Permission Rules
- Respects underlying module permissions for all returned search entities.

## 13. Future Improvements
- Elasticsearch or Postgres pg_vector semantic search integration.
- Recent searches history caching.

## 14. Missing Features
- Natural language query understanding ("Show me unpaid invoices over $5,000").

## 15. Risks
- Latency spikes on large databases if full-text search is unindexed.

## 16. Technical Debt
- Search currently relies on mock service filtering; needs dedicated database search index views.
