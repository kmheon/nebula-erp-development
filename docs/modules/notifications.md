# Nebula ERP Module Specification: Notifications

## 1. Purpose
The Notifications module delivers real-time system alerts, task assignments, inventory warnings, and approval requests to users across the ERP platform.

## 2. Business Responsibilities
- Centralized notification bell and dropdown center.
- Read/unread status management.
- Triggering notifications based on system events (Low stock, invoice due, approval required).

## 3. Current Status
- **Implementation State**: Fully developed frontend notification bell, hooks, and services.
- **Maturity**: Production-ready UI components.

## 4. Architecture
- **Bounded Context**: Messaging & Alerting.
- **Pattern**: DDD vertical slice residing in `apps/web/src/modules/notifications/`.

## 5. Entities
- `Notification`: Represents a user alert (ID, user ID, title, message, type [info/warning/success/error], read status, link, created_at).

## 6. Database (Target PostgreSQL Schema)
- `notifications.notifications`: PK id, user_id (FK), title, message, type, is_read, action_url, created_at.

## 7. API Contracts
- `GET /api/v1/notifications` - Retrieve current user notifications.
- `PATCH /api/v1/notifications/{id}/read` - Mark notification as read.
- `PATCH /api/v1/notifications/read-all` - Mark all notifications as read.

## 8. UI Components
- `NotificationBell`: Header dropdown component displaying unread alerts and quick actions.

## 9. Dependencies
- `@tanstack/react-query`, `core/`.

## 10. External Integrations
- Subscribes to system-wide event emitters to broadcast alerts.

## 11. Business Rules
- **User Scoping**: Notifications are strictly scoped to the recipient user ID.

## 12. Permission Rules
- `notifications:notification:read`: View own notifications.

## 13. Events Emitted / Consumed
- **Consumed**: Listens to domain events across all modules to generate targeted alerts.

## 14. Future Improvements
- Web push notifications and email notification digests.

## 15. Missing Features
- User preference settings for notification channels (In-app vs. Email vs. SMS).

## 16. Risks
- Notification fatigue due to excessive low-priority alerts.

## 17. Technical Debt
- Polling mechanism currently used; should transition to WebSockets for instant delivery.
