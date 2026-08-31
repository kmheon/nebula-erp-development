# Nebula ERP Module Specification: CRM

## 1. Purpose
The CRM (Customer Relationship Management) module manages sales pipelines, lead generation, customer interactions, and conversion tracking to drive commercial revenue.

## 2. Business Responsibilities
- Customer lead and opportunity pipeline tracking.
- Sales stage progression management (Prospect, Qualification, Proposal, Negotiation, Closed Won/Lost).
- Interaction history and follow-up scheduling.

## 3. Current Status
- **Implementation State**: Initial customer table views and CRM page scaffolding implemented.
- **Maturity**: Functional foundation awaiting advanced pipeline Kanban boards and automated lead scoring.

## 4. Architecture
- **Bounded Context**: Customer Acquisition & Pipeline.
- **Pattern**: DDD vertical slice residing in `apps/web/src/modules/crm/`.

## 5. Entities
- `Lead`: Prospective customer record.
- `Opportunity`: Sales deal linked to a contact, tracking expected revenue, probability, and closing date.

## 6. Database (Target PostgreSQL Schema)
- `crm.opportunities`: PK id, contact_id (FK), title, stage (enum), estimated_value, probability, closing_date, owner_id (FK).

## 7. API Contracts
- `GET /api/v1/crm/opportunities` - List sales opportunities.
- `POST /api/v1/crm/opportunities` - Create sales opportunity.

## 8. UI Components
- `CRMPage`: Main CRM dashboard.
- `CustomerTable`: CRM customer view integrated with Contact module data.

## 9. Dependencies
- `@tanstack/react-query`, `modules/contacts/`.

## 10. External Integrations
- `integrations/customer`: Syncs CRM accounts with master Contact records.

## 11. Business Rules
- **Pipeline Conversion**: When an opportunity reaches "Closed Won", it must seamlessly generate a Sales Order draft in the Sales module.

## 12. Permission Rules
- `crm:opportunity:read` / `write`: Manage sales pipeline.

## 13. Events Emitted / Consumed
- **Emitted**: `CRM_OPPORTUNITY_WON`, `CRM_LEAD_CONVERTED`.

## 14. Future Improvements
- Kanban pipeline drag-and-drop board.
- AI-powered win probability scoring.

## 15. Missing Features
- Email integration for automated communication logging.

## 16. Risks
- Data fragmentation if CRM customer records desynchronize from the master Contacts module.

## 17. Technical Debt
- CRM currently borrows heavily from Contacts; needs dedicated opportunity state management.
