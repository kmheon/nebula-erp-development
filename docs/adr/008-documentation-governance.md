# ADR-008: Documentation Governance

## ADR Number
ADR-008

## Title
Documentation Governance

## Status
Accepted

## Date
2026-08-31

## Context
Complex enterprise ERP projects often suffer from "documentation drift" where code evolves rapidly while project knowledge, roadmaps, and architecture decisions remain locked in conversational history.

## Problem Statement
Losing chat session history results in lost architectural direction, broken business rules, and orphaned task states.

## Decision
Mandate automated, rigorous Documentation Governance as Phase 4 of the development lifecycle: Every completed task must automatically update the Master Roadmap, Changelog, Project Journal, Mission Control telemetry, Business Rules, and ADR registry.

## Alternatives Considered
1. Retrospective documentation sprints (Rejected because documentation quickly falls behind).

## Consequences
- **Positive**: Complete repository self-documentation, zero reliance on external chat history, and immediate audit readiness.
- **Negative**: Adds mandatory governance steps to task completion.

## Risks
- Developer fatigue regarding documentation updates.

## Future Considerations
- Implement CI validation scripts that verify roadmap and mission control telemetry match git commit logs.

## Related Tasks
- NEB-GOV-01, NEB-GOV-02

## Related Modules
- All core and documentation modules.

## Related Documentation
- `/docs/DEVELOPMENT_GOVERNANCE.md`
- `/MASTER_IMPLEMENTATION_ROADMAP.md`
- `/PROJECT_JOURNAL.md`
