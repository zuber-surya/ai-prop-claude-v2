# Task Status Lifecycle

This document defines the lifecycle of every implementation task in the Property Vista CRM MVP project. Each task progresses through a series of states from initial conception to completion.

## Status Definitions

### Backlog
**Entry Criteria:**
- Task has been identified as needing work
- Task description is captured (even if incomplete)
- Task prioritized relative to other work

**Exit Criteria (to Ready):**
- Task description is clear and achievable
- Acceptance criteria are defined
- Dependencies are identified and either resolved or tracked
- Estimated effort is provided (optional)
- All prerequisite work (if any) is completed or in progress

### Ready
**Entry Criteria:**
- All entry criteria from Backlog satisfied
- Task is prioritized for upcoming work
- No external blockers remain (dependencies satisfied or planned)
- Required resources (knowledge, designs, APIs) are available

**Exit Criteria (to In Progress):**
- Developer has claimed the task (assigned to self or team)
- Development branch has been created
- Initial reading of relevant documentation completed (see CLAUDE.md "Files Claude Must Always Read Before Coding")
- Any clarifying questions have been answered

### In Progress
**Entry Criteria:**
- Task moved from Ready
- Work has commenced on the task
- Developer is actively implementing changes

**Exit Criteria (to Code Complete):**
- Implementation code is written locally
- Code compiles without errors
- Basic functionality works as expected (developer has performed ad‑hoc testing)
- All relevant files touched are saved
- No known show‑stopper defects remain (minor bugs okay for now)

### Blocked
**Entry Criteria:**
- Work cannot progress due to an external dependency, missing information, or impediment
- Examples: waiting on API finalization, design clarification, blocked by another incomplete task, environment issue

**Exit Criteria (back to In Progress or Return to Review):**
- Blocker has been resolved or removed
- Required information received
- Dependency completed
- If blocked indefinitely, may be moved back to Backlog for re‑planning

### Code Complete
**Entry Criteria:**
- All implementation work is done
- Code passes linter (`npm run lint`) and type checker (`npm run typecheck`) locally
- Unit tests for new/changed code have been written and pass
- Developer has performed self‑review (read own diff)

**Exit Criteria (to Testing):**
- Code committed to a feature branch
- Pull Request opened against `main` (or target branch)
- CI pipeline triggered (build, lint, unit tests)
- No compilation or linting errors in CI

### Testing
**Entry Criteria:**
- Pull Request is open
- CI has passed build, lint, unit tests
- Reviewer has been requested (or self‑review initiated for small changes)

**Exit Criteria (to Review):**
- Functional testing completed (manual or automated)
- Integration tests pass (if applicable)
- Any test failures addressed and fixed
- Test coverage meets project minimums (≥80% new code, overall ≥80% if configured)
- Reviewer(s) have approved the PR (or author has self‑approved for trivial changes)

### Review
**Entry Criteria:**
- Code is ready for peer review
- PR is up‑to‑date with target branch
- All required checks (CI, tests) are green

**Exit Criteria (to Documentation Updated):**
- All reviewer comments addressed and resolved
- Approval obtained from at least one designated reviewer (or per team policy)
- No requested changes remain

### Documentation Updated
**Entry Criteria:**
- PR approved and ready to merge
- All code changes finalized

**Exit Criteria (to Done):**
- All affected documentation updated (API contract, schema, UI docs, NFR, etc.)
- Documentation changes committed (either in same PR or a follow‑up commit that is part of the same merge)
- Verification that documentation reflects the implemented changes

### Done
**Entry Criteria:**
- Code merged into target branch (usually `main`)
- Documentation updates merged
- Task fully satisfies acceptance criteria

**Exit Criteria:**
- No further work needed on this task
- Considered complete; can be referenced as done in planning
- Optionally, a tag or release note may be added if part of a milestone

## Transition Rules

- Only move forward in the lifecycle unless a blocker is encountered.
- From **Blocked**, you may go back to **In Progress** (if blocker cleared) or to **Backlog** (if work is no longer viable).
- From **Testing**, if severe defects are found, return to **In Progress** (not Code Complete) to fix.
- From **Review**, if major changes requested, return to **Code Complete** (or In Progress if rework substantial).
- From **Documentation Updated**, if documentation review fails, stay in this state until fixed (do not go back to code states unless docs change reveals code gap).
- Skip phases only with explicit team agreement (e.g., trivial documentation‑only tasks may go Ready → Documentation Updated → Done).

## Recording Transitions

When moving a task between states, add a comment to the task (in the tracking tool) with:
- Timestamp (ISO 8601 preferred)
- New state
- Brief rationale (what was completed or what blocked)
- Relevant links (branch name, PR number, design doc, etc.)

Example:
```
2026-07-24T14:30:00Z -> In Progress: Started work on user service implementation; branch feature/T045-user-service created.
```

## Definition of Done (DoD) for a Task

A task is considered **Done** only when all of the following are true:
1. Code merged into `main`
2. All automated checks pass (build, lint, unit, integration tests)
3. Documentation updated to reflect changes
4. Acceptance criteria met (verified via testing)
5. No open defects related to the task
6. Task marked as Done intracking tool with appropriate closure notes

---

*This lifecycle ensures transparency, quality, and a smooth flow from idea to delivered feature.*