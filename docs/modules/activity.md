# Nebula ERP Module Specification: Activity

## 1. Purpose
The Activity module provides system-wide audit logging, user action tracking, and chronological timeline event visualization across all enterprise domains.

## 2. Business Responsibilities
- Record system events, user logins, data modifications, and document approvals.
- Render chronological activity streams on entity profiles (Contacts, Sales Orders, Inventory items).
- Support compliance auditing and security forensics.

## 3. Current Status
- **Implementation State**: Frontend SPA fully implemented with activity timeline components and mock services.
- **Maturity**: Production-ready UI components for rendering activity feeds.

## 4. Architecture
- **Bounded Context**: Audit & System Telemetry.
- **Pattern**: Vertical slice architecture residing in `apps/web/src/modules/activity/`.

## 5. Entities
- `ActivityLog`: Represents a recorded system action (ID, timestamp, user ID, module, action type, entity ID, metadata JSON, IP address).

## 6. Database (Target PostgreSQL Schema)
- `activity.logs`: PK id, timestamp, user_id (FK), module, action, entity_type, entity_id, metadata (JSONB), ip_address.
- **Constraints**: Append-only audit table with rigorous indexing on `entity_type`, `entity_id`, and `timestamp`.

## 7. API Contracts
- `GET /api/v1/activity/logs` - Retrieve global or filtered activity logs.
- `POST /api/v1/activity/logs` - Internal endpoint for recording audit events.

## 8. UI Components
- `ActivityTimeline`: Reusable component rendering chronological event histories with status badges and actor metadata.

## 9. Dependencies
- `@tanstack/react-query`, `core/`.

## 10. External Integrations
- Consumed by all modules to render entity-specific audit trails.

## 11. Business Rules
- **Non-Editable**: Activity logs are immutable. No user, including administrators, is permitted to update or delete audit records.
- **Automatic Capture**: State-changing actions across modules must automatically trigger activity log emission.

## 12. Permission Rules
- `activity:log:read`: View system audit trails.
- `activity:log:export`: Export audit logs for compliance reviews.

## 13. Events Emitted / Consumed
- **Emitted**: `ACTIVITY_LOGGED`.
- **Consumed**: Listens to system-wide domain events to generate audit records.

## 14. Future Improvements
- Real-time WebSocket streaming of security alerts and critical audit events.
- Advanced log querying with full-text search.

## 15. Missing Features
- Automated alerting rules for suspicious activity patterns.

## 16. Risks
- Database table bloat due to high-frequency logging (mitigated by automated partitioning and log archival policies).

## 17. Technical Debt
- Currently relies on client-side or mocked event emission; needs server-side interceptor logging.
