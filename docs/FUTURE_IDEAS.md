# Future Ideas & Enhancements Log (Nebula ERP)

This document records future architectural ideas, potential optimizations, and advanced ERP features identified during development.

---

## 1. Automated Real-Time FX Rate API Webhooks (NEB-009-FI1)
- **Description**: Connect the exchange rate service directly to European Central Bank (ECB) and Federal Reserve REST APIs via server webhooks for automated daily rate updates.
- **Priority**: Medium
- **Target Epic**: EPIC-01 (Financial Foundation)

## 2. Multi-Currency Ledger Revaluation Batch Jobs (NEB-009-FI2)
- **Description**: Implement scheduled month-end background jobs to automatically calculate unrealized FX gains and losses on all foreign currency accounts and post draft journal entries.
- **Priority**: High
- **Target Epic**: EPIC-01 (Financial Foundation)

## 3. Advanced Supplier Payment Matching ML (NEB-010-FI1)
- **Description**: Introduce fuzzy matching algorithms for automated bank statement reconciliation against open vendor bills and customer invoices.
- **Priority**: Low
- **Target Epic**: EPIC-01 (Financial Foundation)
