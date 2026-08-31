# Nebula ERP Module Specification: Service Desk

## 1. Purpose
The Service Desk module manages customer support ticketing, technician scheduling, service request lifecycles, SLA tracking, and field service operations.

## 2. Business Responsibilities
- Support ticket and service request creation, triage, and assignment.
- Technician scheduling and calendar management.
- SLA tracking and escalation workflows.
- Service reporting and customer satisfaction tracking.

## 3. Current Status
- **Implementation State**: Extremely comprehensive frontend implementation with service request lists, cards, technician management, scheduling calendars, new request forms, and reports.
- **Maturity**: Production-ready service management module.

## 4. Architecture
- **Bounded Context**: Customer Support & Field Service.
- **Pattern**: DDD vertical slice residing in `apps/web/src/modules/service-desk/`.

## 5. Entities
- `ServiceRequest`: Support ticket entity (ID, customer ID, title, description, priority, status, assigned technician ID, SLA deadline, created_at).
- `Technician`: Field service staff profile and skills.

## 6. Database (Target PostgreSQL Schema)
- `service_desk.technicians`: PK id, user_id (FK), specialization, phone, status.
- `service_desk.requests`: PK id, customer_id (FK), title, description, priority (low, medium, high, urgent), status (open, in_progress, resolved, closed), assigned_technician_id (FK), sla_due_at, created_at.

## 7. API Contracts
- `GET /api/v1/service-desk/requests` - List service tickets.
- `POST /api/v1/service-desk/requests` - Create new support ticket.
- `PATCH /api/v1/service-desk/requests/{id}` - Update ticket status or assignment.
- `GET /api/v1/service-desk/technicians` - List technicians.

## 8. UI Components
- `ServiceDeskDashboardPage`: Master service desk overview.
- `ServiceRequestList` & `ServiceRequestCard`: Ticket management views.
- `NewRequestForm`: Ticket intake form.
- `ServiceDeskTechniciansPage`: Technician roster and workload management.
- `ServiceDeskSchedulePage`: Scheduling calendar.
- `ServiceDeskReportsPage`: SLA and ticket resolution analytics.

## 9. Dependencies
- `@tanstack/react-query`, `modules/contacts/`.

## 10. External Integrations
- `integrations/service`: Links support tickets with customer accounts and billing.

## 11. Business Rules
- **SLA Escalation**: Tickets approaching their SLA deadline without resolution must automatically escalate in priority and alert supervisors.

## 12. Permission Rules
- `service:request:read` / `write`: Manage support tickets.
- `service:technician:schedule`: Assign technicians and manage schedules.

## 13. Events Emitted / Consumed
- **Emitted**: `SERVICE_REQUEST_CREATED`, `SERVICE_REQUEST_ASSIGNED`, `SERVICE_REQUEST_RESOLVED`, `SLA_BREACHED`.

## 14. Future Improvements
- Customer self-service portal for ticket tracking.
- AI automated ticket categorization and suggested resolution responses.

## 15. Missing Features
- Automated customer satisfaction (CSAT) survey email dispatch upon ticket closure.

## 16. Risks
- SLA breaches damaging customer retention.

## 17. Technical Debt
- Calendar scheduling view currently relies on mock state; needs robust date-range indexing.
