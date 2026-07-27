# Claude Code Workflow

This document defines the mandatory workflow that Claude Code must follow before, during, and after implementing any feature in the Property Vista CRM MVP project.

---

## Pre-development Checklist

Before starting any implementation task, Claude Code MUST:

1. [ ] Read `00_MASTER_INDEX.md` completely (mandatory first read)
2. [ ] Check the current git branch and ensure it's based on `main`
3. [ ] Verify the task ID from `TASKS.md` and understand its acceptance criteria
4. [ ] Pull latest changes from remote (`git fetch origin && git rebase origin/main`)
5. [ ] Ensure development environment is set up (dependencies installed, DB migrated)
6. [ ] Run linting and tests on current codebase to ensure green state
7. [ ] Create a feature branch following naming convention: `feat/<short-description>` or appropriate type
8. [ ] Review all relevant documentation per the reading order in `00_MASTER_INDEX.md`
9. [ ] Validate that requirements are clear and unambiguous
10. [ ] If any documentation is missing or conflicting, follow the error recovery workflow below

## Documentation Reading Sequence

Claude Code MUST follow this sequence when researching for implementation:

1. **Mandatory first**: `00_MASTER_INDEX.md` (this file)
2. **Project context**: `02_PROJECT_OVERVIEW.md` → `PRD.md` → `NFR.md`
3. **Technical foundation**: `PROJECT_STRUCTURE.md` → `CODING_STANDARDS.md`
4. **Implementation plan**: `IMPLEMENTATION_PLAN.md` → `TASKS.md`
5. **API contract** (if backend work): `API_SPECIFICATION.md`
6. **Data model** (if database work): `DATABASE_DESIGN.md` → `SCREEN_DATABASE_MAPPING.md`
7. **Backend logic** (if backend work): `BACKEND_FUNCTIONAL_SPEC.md` → `BUSINESS_RULES.md`
8. **Frontend UI** (if frontend work): `FRONTEND_FUNCTIONAL_SPEC.md` → `ui/screens/` → `USER_FLOWS.md` → `COMPONENT_LIBRARY.md`
9. **Testing guidance**: `TEST_PLAN.md`
10. **AI-specific guidance**: `AI_CONTEXT.md` → `00_AI_CHARTER.md`
11. **Process guidance**: `GIT_WORKFLOW.md`

## Requirement Validation

Before writing any code, Claude Code MUST:

1. Trace the requirement to its source in PRD/BRD/NFR
2. Verify acceptance criteria are measurable and testable
3. Confirm no conflicts with existing documented requirements
4. Identify any edge cases or error conditions not explicitly covered
5. If requirements are unclear, missing, or conflicting, STOP and follow the clarification process (see below)
6. Document any assumptions made (only after validation) in a comment near the implementation

## Database-First Development Approach

For any feature involving data persistence:

1. **Design first**: Update `DATABASE_DESIGN.md` with proposed schema changes
2. **Create migration**: Write Prisma migration file in `prisma/migrations/`
3. **Validate migration**: Test migration locally against a test database
4. **Update mapping**: Modify `SCREEN_DATABASE_MAPPING.md` to reflect new table/column usage
5. **Implement service layer**: Create/modify service functions that interact with the new schema
6. **Add validation**: Implement Zod schemas for data validation in service layer
7. **Write tests**: Create unit tests for service functions before API implementation
8. **Only then**: Proceed to API implementation

## API-First Implementation Workflow

For backend API endpoints:

1. **Contract first**: Modify `API_SPECIFICATION.md` to reflect endpoint changes (method, URL, auth, request/response schemas)
2. **Get validation**: Ensure API spec changes are reviewed and approved before implementation
3. **Implement handler**: Create/update controller function in `src/backend/src/controllers/`
4. **Add middleware**: Apply authentication, validation, rate limiting as per spec
5. **Call service**: Delegate business logic to appropriate service in `src/backend/src/services/`
6. **Error handling**: Follow standard error format defined in API spec and logging standards
7. **Write tests**: Create integration tests using Supertest to validate contract compliance
8. **Test locally**: Run API tests manually and via npm scripts
9. **Update documentation**: Only after implementation and testing pass

## Frontend Implementation Workflow

For UI components and pages:

1. **Design reference**: Consult `ui/screens/` specifications and `design_reference/` for visual design
2. **Component check**: Determine if new component needed or existing can be reused (see `COMPONENT_LIBRARY.md`)
3. **State planning**: Define required state, props, and data flow (use React Query/SWR or Context)
4. **Accessibility first**: Plan ARIA labels, keyboard navigation, WCAG compliance
5. **Responsive design**: Implement mobile-first approach with Tailwind breakpoints
6. **Create component**: Write TypeScript/TSX file in `src/frontend/src/components/` or `app/` as appropriate
7. **Connect to API**: Use SWR/react-query or custom hook to fetch/modify data via API endpoints
8. **Handle loading/error states**: Implement skeleton loaders, error messages, empty states
9. **Form validation**: Use Zod or Yup for form validation with client-server parity
10. **Write tests**: Create unit tests with React Testing Library and integration tests with Playwright
11. **Update docs**: Modify `FRONTEND_FUNCTIONAL_SPEC.md` and relevant screen specifications

## Testing Workflow

Claude Code MUST follow this testing sequence:

### Before Implementation
1. [ ] Read `TEST_PLAN.md` to understand testing strategy
2. [ ] Identify what types of tests are needed (unit, integration, E2E, UI)
3. [ ] Review existing similar tests for patterns

### During Implementation
1. [ ] Write unit tests FIRST (TDD approach) for new functions/classes
2. [ ] Aim for ≥90% coverage on new/modified files
3. [ ] Write integration tests for API endpoints or component interactions
4. [ ] For UI changes, write Playwright tests for critical user flows
5. [ ] Test edge cases, error conditions, and invalid inputs
6. [ ] Mock external dependencies (DB, AI API, payment gateways)
7. [ ] Ensure tests are deterministic and independent

### After Implementation
1. [ ] Run full test suite: `npm test` (backend) and `npm test` (frontend)
2. [ ] Run linting: `npm run lint`
3. [ ] Fix any test failures or lint errors before proceeding
4. [ ] Update test documentation if testing approach changes

## Code Review Checklist

Before submitting a pull request, Claude Code MUST verify:

### Code Quality
- [ ] Code follows `CODING_STANDARDS.md` (TypeScript, ESLint, Prettier)
- [ ] No `console.log` in production code (use logger)
- [ ] All public functions have JSDoc/TSdoc comments
- [ ] No magic numbers/strings; replaced with named constants
- [ ] Proper error handling with try/catch or async error boundaries
- [ ] Secure by default: input validation, output encoding, auth checks
- [ ] Efficient queries: no N+1, proper use of Prisma select/include
- [ ] Components are small and focused (<300 lines)
- [ ] Custom hooks prefixed with `use`
- [ ] Constants in UPPER_SNAKE_CASE

### Architecture
- [ ] Follows layered architecture: UI → API controller → service → Prisma → DB
- [ ] Business logic in services, not controllers or components
- [ ] Proper separation of concerns
- [ ] Immutability respected where practical
- [ ] Fail fast validation implemented
- [ ] Defensive coding assumptions documented

### Testing
- [ ] Unit tests written for new logic (≥90% coverage on new files)
- [ ] Integration tests written for API endpoints or service interactions
- [ ] UI tests written for new components or page changes
- [ ] All tests pass locally
- [ ] Test names descriptive and follow AAA pattern

### Documentation
- [ ] All affected documentation updated in same PR
- [ ] API spec changes match implementation
- [ ] Database schema changes documented
- [ ] UI changes reflected in screen specifications
- [ ] No outdated comments or TODOs left in code

### Git Hygiene
- [ ] Branches named correctly per `GIT_WORKFLOW.md`
- [ ] Commit messages follow Conventional Commits
- [ ] PR description includes summary, related task ID, screenshots if UI
- [ ] Branch rebased onto latest `main`
- [ ] No merge conflicts

## Documentation Update Process

Claude Code MUST update documentation in the same PR as code changes:

### When to Update
- **API changes**: Update `API_SPECIFICATION.md`
- **Database changes**: Update `DATABASE_DESIGN.md` and `SCREEN_DATABASE_MAPPING.md`
- **UI changes**: Update `ui/screens/` files, `FRONTEND_FUNCTIONAL_SPEC.md`, `USER_FLOWS.md`, `COMPONENT_LIBRARY.md`
- **Business rule changes**: Update `BUSINESS_RULES.md`
- **Process changes**: Update `GIT_WORKFLOW.md`, `TEST_PLAN.md`
- **Feature additions/removals**: Update `PRD.md`, `IMPLEMENTATION_PLAN.md`, `TASKS.md`

### How to Update
1. Make documentation changes in the feature branch
2. Ensure documentation accurately reflects implemented state
3. Use clear, concise language with examples where helpful
4. Follow existing style and format of the document
5. Update any affected diagrams or models
6. Include code samples that match current implementation
7. Verify all internal links remain valid
8. Submit documentation changes for review alongside code changes

### Consequences
- PRs may be rejected if required documentation updates are missing
- Repeated failures will trigger additional review requirements
- Outdated documentation is technical debt to be remediated

## Task Status Update Process

Claude Code MUST update task status in `TASKS.md`:

### When Starting Work
1. Change status from "To Do" to "In Progress"
2. Record start timestamp in metadata if desired
3. Commit the change to `TASKS.md`

### When Completing Work
1. Verify all acceptance criteria are met
2. Verify Definition of Done is satisfied (via checklist)
3. Change status from "In Progress" to "Done"
4. Record completion timestamp in metadata
5. Commit the change to `TASKS.md`
6. Reference task ID in commit message and PR description

### When Blocked
1. Change status to "Blocked" (if using) or add comment explaining blocker
2. Identify what is needed to unblock (dependency, clarification, resource)
3. Communicate via appropriate channels
4. Do not proceed with implementation while blocked

## Commit Process

Claude Code MUST follow this commit process:

1. **Atomic commits**: Each commit should represent a single logical change
2. **Conventional Commits**: Format: `<type>(<scope>): <description>`
   - Types: feat, fix, docs, style, refactor, perf, test, chore
   - Scope: optional, e.g., (auth), (property-list), (chatbot)
   - Description: imperative mood, max 50 chars
3. **Body** (optional): Detailed explanation of what and why
4. **Footer** (optional): References to task IDs, breaking changes, etc.
5. **Examples**:
   - `feat(auth): add JWT refresh token endpoint`
   - `fix(property): resolve N+1 query in property listing`
   - `docs(api): update POST /properties endpoint specification`
   - `refactor(ui): extract search bar component to reusable`
6. **Pre-commit hooks**: Ensure lint-staged runs ESLint and Prettier
7. **Commit frequently**: Small commits are preferred over large ones
8. **Never commit**: `.env` files, node_modules, build artifacts, secrets

## Error Recovery Workflow

When encountering errors, missing documentation, or conflicts:

### Missing Documentation
1. STOP implementation immediately
2. Check if the document exists in alternative location (case-sensitive path)
3. Check git history for recent deletions/moves
4. If truly missing, create issue requesting documentation creation
5. Do NOT proceed with implementation based on assumptions
6. Wait for documentation to be provided or clarified

### Conflicting Documentation
1. STOP implementation immediately
2. Apply source of truth hierarchy from `00_MASTER_INDEX.md`:
   - Code and database schema (actual implementation) > 
   - API_SPECIFICATION.md > 
   - PRD.md > BRD.md > 
   - NFR.md > 
   - Functional specs > 
   - UX/UI docs > 
   - Technical guides > 
   - Process docs > 
   - Project overview > 
   - Planning docs
3. If conflict remains unresolved, create issue for clarification
4. Do NOT implement based on personal judgment

### Implementation Errors
1. REVERT problematic changes if they break existing functionality
2. RUN tests to confirm regression
3. ANALYZE error messages and stack traces
4. FIX root cause, not symptoms
5. ADD tests to prevent recurrence
6. DOCUMENT solution if it involves non-obvious business rule

## Rules for Asking Clarification Questions

Claude Code MUST ask for clarification INSTEAD of making assumptions when:

### Ask When:
1. Requirements are ambiguous or open to multiple interpretations
2. Documentation is missing for a required component
3. API contract does not specify behavior for edge case
4. Database schema lacks needed column or relationship
5. UI specification missing for a required interaction
6. Business rule contradicts another documented rule
7. Performance or security implications are unclear
8. Integration points with external services are unspecified
9. Error handling or fallback behavior is not defined
10. Any aspect of Definition of Done is unclear

### How to Ask:
1. Be specific: reference exact document, section, and line number if possible
2. Explain what is needed and why
3. Suggest possible interpretations if appropriate
4. Do NOT implement anything until clarification is received
5. Wait for response before proceeding
6. Document the clarification received in code comments or task metadata

### Never:
- Assume intent based on similar features elsewhere
- Fill in gaps with "standard practice" or personal preference
- Implement partial solutions hoping to clarify later
- Make unilateral decisions about scope, priority, or design
- Proceed with implementation when uncertainty exists

---
*This workflow is mandatory for all Claude Code implementations in the Property Vista CRM MVP project.*
*Failure to follow this workflow may result in rejected pull requests or required rework.*
*Last updated: 2026-07-24*