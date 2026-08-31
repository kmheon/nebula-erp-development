# Nebula ERP — Permanent Development Governance

**Document Version**: 1.0.0-enterprise  
**Status**: PERMANENTLY LOCKED  
**Scope**: Mandatory lifecycle and governance rules for all future development tasks in Nebula ERP.

---

## 1. Nebula ERP Development Standard

Every implementation task from this point forward MUST follow this 7-phase lifecycle.

### Phase 1 — Discovery
Before writing code, ALWAYS:
1. Read Mission Control (`/apps/web/public/.nebula/mission-control.json`).
2. Read Master Implementation Roadmap (`/MASTER_IMPLEMENTATION_ROADMAP.md`).
3. Read Project Journal (`/PROJECT_JOURNAL.md`).
4. Read Business Rules (`/docs/BUSINESS_RULES.md`).
5. Read Architecture Decisions (`/docs/ARCHITECTURE_DECISIONS.md`).
6. Read affected module documentation.
7. Analyze all affected files, dependencies, and existing reusable components.
8. Reuse existing code whenever possible. Never create new components if an existing one can be extended.

### Phase 2 — Implementation
Before creating anything new, search for and reuse existing:
- Components, Services, Hooks, Queries
- Types, DTOs, Utilities, Forms, Tables
- Cards, Dialogs, Layouts

**Rules**:
- Maintain strict module boundaries.
- Never duplicate logic.
- Business logic belongs in services; UI only renders state.

### Phase 3 — Validation
Every completed task MUST verify:
- ✅ Build passes (`npm run build`)
- ✅ TypeScript type-checking passes
- ✅ ESLint passes (`npm run lint`)
- ✅ No circular dependencies
- ✅ No duplicated code
- ✅ Strict module boundaries
- ✅ Clean public exports
- ✅ Reusable architecture

### Phase 4 — Knowledge Update
Every completed task MUST update ALL applicable project knowledge:
- `MASTER_IMPLEMENTATION_ROADMAP.md`
- `CHANGELOG.md`
- `PROJECT_JOURNAL.md`
- Mission Control (`.nebula/mission-control.json`)
- `docs/BUSINESS_RULES.md`
- `docs/ARCHITECTURE_DECISIONS.md` and `/docs/adr/` (Any major architectural change must create or update an ADR)
- Module, API, Database, and Integration documentation as applicable.

*Rule*: No implementation decision may exist only inside AI chat history. The repository must always contain enough information for another AI or developer to continue the project without previous conversations.

### Phase 5 — Mission Control
After every completed task automatically update:
- Current Phase
- Current Epic
- Current Task
- Completed Tasks
- Next Task
- Overall Progress & Epic Progress
- Health Score
- Recently Modified Modules & Affected Files
- Dependency Changes, Known Risks, Future Ideas

### Phase 6 — Project Journal
Append an entry in `PROJECT_JOURNAL.md` (and `/docs/PROJECT_JOURNAL.md`) containing:
- Task ID & Epic
- Title & Summary
- Architecture Decisions & Business Rules
- Files Added, Modified, Removed
- Dependencies & Risks
- Lessons Learned & Future Improvements

### Phase 7 — Roadmap
Every completed task must:
- Mark completed items.
- Update progress percentages.
- Update current and next tasks.
- Log new ideas discovered during implementation into `/docs/FUTURE_IDEAS.md`. Never delete ideas; move postponed ideas to Future Ideas.

---

## 2. Definition of Done
A task is **NOT complete** until:
1. Code implemented
2. Build passes
3. TypeScript passes
4. ESLint passes
5. Documentation updated
6. Roadmap updated
7. Project Journal updated
8. Mission Control updated
9. Future ideas logged
10. Business rules documented

---

## 3. Mandatory Return Format
Every completed task must end with:
- Task ID
- Epic
- Files Added
- Files Modified
- Files Removed
- Architecture Decisions
- Business Rules Added
- Documentation Updated
- Mission Control Updated
- Roadmap Updated
- Project Journal Updated
- Future Ideas Logged
- Build Status
- TypeScript Status
- ESLint Status
- Repository Health
- Current Progress
- Next Recommended Task

*This governance document is permanent and locks in enterprise architectural discipline for Nebula ERP.*
