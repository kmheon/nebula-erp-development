# Nebula ERP Module Specification: Settings

## 1. Purpose
The Settings module manages multi-tenant configuration, company profile details, tax settings, user preferences, security policies, and system-wide operational parameters.

## 2. Business Responsibilities
- Company profile and branding configuration.
- Tenant-level operational settings (Fiscal year-end, default currency, timezone).
- User role management and security policy enforcement.

## 3. Current Status
- **Implementation State**: Fully developed frontend settings panels and configuration services.
- **Maturity**: Production-ready settings UI.

## 4. Architecture
- **Bounded Context**: Tenant Administration & Configuration.
- **Pattern**: DDD vertical slice residing in `apps/web/src/modules/settings/`.

## 5. Entities
- `CompanySettings`: Tenant configuration record (company name, tax ID, currency, timezone, fiscal year start).
- `SecurityPolicy`: Password complexity and session timeout rules.

## 6. Database (Target PostgreSQL Schema)
- `settings.tenant_config`: PK id, tenant_id, key, value (JSONB), updated_at.

## 7. API Contracts
- `GET /api/v1/settings` - Retrieve tenant settings.
- `PUT /api/v1/settings` - Update tenant configuration.

## 8. UI Components
- `SettingsPage`: Master configuration hub.
- `SettingsPanel`: Tabbed configuration interface for company, tax, and security settings.

## 9. Dependencies
- `@tanstack/react-query`, `core/entities/company.types.ts`.

## 10. External Integrations
- Feeds global configuration values to all modules.

## 11. Business Rules
- **Admin Restriction**: Only users with administrator privileges are authorized to modify tenant-level configuration settings.

## 12. Permission Rules
- `settings:tenant:write`: Modify company configuration and security policies.

## 13. Events Emitted / Consumed
- **Emitted**: `SETTINGS_UPDATED`.

## 14. Future Improvements
- Audit logging of all settings modifications.
- Multi-company hierarchy management.

## 15. Missing Features
- Webhook endpoint configuration for outbound ERP events.

## 16. Risks
- Misconfiguration of fiscal settings causing accounting period errors.

## 17. Technical Debt
- Settings persistence currently mocked; requires server-side tenant configuration store.
