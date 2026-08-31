# Nebula ERP — Future Ideas & Innovation Pipeline

This document catalogs future enhancements, exploratory concepts, and advanced capabilities discovered during development across EPIC-01 through EPIC-08.

---

## 1. AI & Intelligence (EPIC-08)
- **Natural Language ERP Assistant**: Conversational agent capable of generating journal entries, querying inventory stock across warehouses, and summarizing accounts receivable aging via Gemini API.
- **Predictive Cash Flow Forecasting**: Machine learning model analyzing historical AR/AP payment timings to forecast liquidity over 30/60/90-day horizons.
- **Automated Anomaly Detection**: Real-time detection of duplicate invoice submissions, unusual expense claims, and inventory shrinkage patterns.

## 2. Advanced Financial Operations
- **Multi-Entity Intercompany Elimination**: Automated consolidation engine for multi-subsidiary enterprise groups with intercompany transfer pricing and currency translation.
- **Advanced Fixed Asset Depreciation**: Automated calculation of straight-line, declining-balance, and sum-of-years-digits depreciation schedules with asset disposal accounting.
- **Dynamic Tax Engine**: Integration with global tax calculation engines (VAT, GST, Sales Tax) with automated jurisdiction mapping.

## 3. Workflow & Integration
- **Visual Drag-and-Drop Workflow Designer**: Node-based canvas for configuring multi-tier approval routing, conditional notification triggers, and automated document state transitions.
- **Webhook & Event Bus Architecture**: Event-driven architecture using Kafka or Redis Streams for asynchronous publishing of ERP domain events (e.g. `InvoicePosted`, `StockLow`, `PaymentReceived`).
- **OpenAPI / GraphQL Federation**: Unified API gateway exposing enterprise modules securely to third-party client integrations and mobile apps.
