# Nebula ERP Module Specification: Assets

## 1. Purpose
The Assets module manages fixed capital assets, depreciation schedules, asset categories, and asset lifecycle tracking in alignment with corporate accounting standards (GAAP/IFRS).

## 2. Business Responsibilities
- Fixed asset cataloging (property, plant, equipment, intangible assets).
- Asset category and depreciation method configuration (Straight-Line, Declining Balance).
- Automated depreciation calculation and general ledger journal entry posting.
- Asset disposal, transfer, and valuation tracking.

## 3. Current Status
- **Implementation State**: Frontend components fully built (Asset Form, Asset Table, Depreciation Overview, Category management).
- **Maturity**: Feature-complete UI awaiting persistent database linking.

## 4. Architecture
- **Bounded Context**: Fixed Asset Management.
- **Pattern**: DDD vertical slice residing in `apps/web/src/modules/assets/`.

## 5. Entities
- `Asset`: Represents a physical or intangible capital asset (ID, code, name, category ID, acquisition date, purchase cost, salvage value, useful life, status).
- `AssetCategory`: Defines depreciation rules and GL account mappings for asset classes.
- `DepreciationSchedule`: Projected or realized depreciation periods and amounts.

## 6. Database (Target PostgreSQL Schema)
- `assets.categories`: PK id, name, depreciation_method, default_useful_life, gl_asset_account_id, gl_depreciation_account_id.
- `assets.assets`: PK id, code, name, category_id (FK), acquisition_date, purchase_cost, salvage_value, useful_life_months, status.
- `assets.depreciation_entries`: PK id, asset_id (FK), period_date, depreciation_amount, journal_entry_id (FK).

## 7. API Contracts
- `GET /api/v1/assets` - List fixed assets.
- `POST /api/v1/assets` - Register new asset.
- `GET /api/v1/assets/depreciation` - Retrieve depreciation forecasts and history.
- `POST /api/v1/assets/depreciation/run` - Execute period depreciation run and post GL entries.

## 8. UI Components
- `AssetsPage`: Dashboard for asset portfolio oversight.
- `AssetTable` & `AssetForm`: Asset inventory management.
- `AssetCategoryTable` & `AssetCategoryForm`: Asset classification and depreciation rules.
- `DepreciationOverview`: Visual analytics of asset book values and depreciation curves.

## 9. Dependencies
- `@tanstack/react-query`, `core/`.

## 10. External Integrations
- `integrations/finance`: Posts monthly depreciation charges directly to the Accounting module's General Ledger.

## 11. Business Rules
- **Depreciation Limits**: Cumulative depreciation cannot exceed `purchase_cost - salvage_value`.
- **Accounting Integration**: Running depreciation must automatically generate a balanced journal entry (Debit: Depreciation Expense, Credit: Accumulated Depreciation).

## 12. Permission Rules
- `assets:asset:read` / `write`: Manage asset records.
- `assets:depreciation:run`: Execute financial depreciation posting runs.

## 13. Events Emitted / Consumed
- **Emitted**: `ASSET_REGISTERED`, `DEPRECIATION_POSTED`, `ASSET_DISPOSED`.

## 14. Future Improvements
- QR code asset tagging and physical audit scanning.
- Maintenance tracking and insurance policy management.

## 15. Missing Features
- Partial asset impairment tracking.

## 16. Risks
- Miscalculation of useful life or salvage value leading to financial restatements.

## 17. Technical Debt
- Depreciation calculator currently uses simplified client-side formulas; needs robust server-side fiscal calendar support.
