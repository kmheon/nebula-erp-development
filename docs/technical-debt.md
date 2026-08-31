# Nebula ERP — Technical Debt & Architectural Risks

This document preserves known technical debt items, architectural trade-offs, and mitigation strategies.

## 1. Client-Side State Fallback for Mission Control
- **Description**: Mission Control reads from `public/.nebula/mission-control.json` with robust client-side fetch fallbacks.
- **Impact**: Low (developer-only module).
- **Mitigation**: Will be entirely removed before production release as specified in architectural guidelines.

## 2. Foreign Exchange Rate Volatility Management
- **Description**: Real-time multi-currency revaluation currently relies on static or periodic exchange rate tables.
- **Impact**: Medium.
- **Mitigation**: Planned integration with live FX feed APIs in Phase 7.
