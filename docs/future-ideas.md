# Nebula ERP — Future Ideas & Deferred Features

This document preserves future product ideas, enhancements, and roadmap extensions discussed during development sessions.

## 1. AI-Powered Financial Forecasting & Anomaly Detection
- **Description**: Integrate Gemini API on the backend to analyze general ledger journals and automatically detect anomalous transaction patterns, duplicate vendor bill submissions, or cash flow anomalies.
- **Status**: Deferred to Phase 3
- **Architectural Notes**: Must run strictly server-side through `/api/ai/*` proxy routes to protect API keys.

## 2. Multi-Tenant Organization Workspace Switching
- **Description**: Enable enterprise users to switch between multiple subsidiary legal entities within a single organization hierarchy with automatic currency translation and consolidation.
- **Status**: Planned for Phase 5 (Consolidation Module)

## 3. Real-Time WebSocket Collaboration on Purchase Approvals
- **Description**: WebSocket-based real-time notification stream for multi-tier approval workflows, allowing approvers to sign off on purchase orders instantly without refreshing.
- **Status**: Future enhancement
