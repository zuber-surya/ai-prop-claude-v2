# Development Checklist

Use this checklist for every implementation task to ensure nothing is missed before marking the task as done.

## Pre‑Implementation

- [ ] **Documentation reviewed**  
  Read all relevant files listed in CLAUDE.md under “Files Claude Must Always Read Before Coding” (PRD, ROADMAP, API_CONTRACT, SCHEMA, UI_REFERENCE, NFR, etc.) and any task‑specific specs.

- [ ] **Dependencies verified**  
  Confirm that all prerequisite tasks (from TASKS.md or sprint plan) are completed and that required libraries, services, or data are available.

- [ ] **Database updated**  
  If the task requires schema changes:  
  - Create/generate Prisma migration  
  - Apply migration locally (`prisma migrate dev`)  
  - Update `SCHEMA.md` to reflect the new schema  
  - Verify that related queries work with Prisma Studio or a test script

## Implementation

- [ ] **API implemented**  
  - Controller and service logic written  
  - Routes registered and versioned (`/api/v1/...`)  
  - Input validation (Zod schemas) in place  
  - Error handling consistent with project standards  
  - API responses follow the defined success/error format

- [ ] **Frontend implemented**  
  - Components/pages created following UI_REFERENCE and Tailwind guidelines  
  - Responsive layout tested at breakpoints (sm, md, lg, xl)  
  - Accessibility basics checked (labels, ARIA, focus outlines)  
  - State management (React hooks, context, or SWR) implemented  
  - Loading and error states handled

- [ ] **Validation completed**  
  - Backend: All inputs validated with Zod; invalid requests return 400 with field‑level errors  
  - Frontend: Client‑side validation mirrors server rules (where feasible) and provides immediate feedback  
  - Business‑rule validation (e.g., date ranges, unique constraints) enforced in services

- [ ] **Unit tests written**  
  - At least one unit test per new service method or utility function  
  - Tests cover happy path, edge cases, and error branches  
  - Mock external dependencies (db, third‑party APIs)  
  - Test file naming: `*.test.ts` alongside implementation or in `__tests__`  
  - Run locally: `npm test` (or `npm run test:unit`) and confirm they pass

- [ ] **Integration tests passed**  
  - API endpoint tests using Supertest (backend) or Playwright (full‑stack)  
  - Verify correct status codes, payload shape, and error responses  
  - Use a test database migrated before each test run  
  - Run locally: `npm run test:integration` (or included in `npm test`) and confirm they pass

- [ ] **Manual testing completed**  
  - Start the dev server (`npm run dev`)  
  - Perform end‑to‑end scenarios covering the feature:  
    - UI interaction → API call → DB change → UI update  
    - Test with valid and invalid data  
    - Check error messages, loading states, and edge cases  
    - Verify responsiveness on mobile viewport (Chrome DevTools)  
    - Confirm no console errors or warnings

## Post‑Implementation

- [ ] **Documentation updated**  
  - API contract (`API_CONTRACT.md`) if endpoints changed  
  - Database schema (`SCHEMA.md`) if tables/columns changed  
  - UI reference (`UI_REFERENCE.md`) if components or appearance altered  
  - Any other affected docs (NFR, development guides, etc.)  
  - Ensure docs are committed in the same PR (or a clearly linked follow‑up commit)

- [ ] **Task status updated**  
  - Move the task through the states defined in `TASK_STATUS.md`:  
    `In Progress → Code Complete → Testing → Review → Documentation Updated → Done`  
  - Add a comment with timestamp and brief note for each transition

- [ ] **Code committed**  
  - Write clear, conventional commit messages (e.g., `feat(auth): add refresh token rotation`)  
  - Push the feature branch to origin  
  - Open a Pull Request against `main` (or target branch)  
  - Ensure CI pipeline runs and passes (build, lint, unit, integration tests)

- [ ] **Ready for next task**  
  - Verify that the PR has been approved and merged (or that you have local confirmation it meets DoD)  
  - Clean up local branch (`git branch -d feature/...`)  
  - Pull latest `main` to stay up‑to‑date  
  - Select the next task from `TASKS.md` (or sprint backlog) and repeat the checklist

---

### How to Use

1. Copy this checklist into a temporary note or your task tracking tool.
2. Tick each box as you complete the item.
3. Do not mark the task as **Done** until all boxes are checked and the PR is merged.
4. If any item is not applicable (e.g., no frontend changes), mark it as N/A and briefly note why.

--- 

*Adhering to this checklist helps maintain quality, consistency, and predictability across all development work.*