# Coding Standards
## Property Website MVP

### Folder Structure
The repository follows a conventional full-stack separation with clear boundaries between frontend, backend, database, documentation, and configuration.

```
ai-prop-claude-v2/
├── .claude/
├── .clinerules
├── .cursor
├── .github/
│   └── workflows/
├── .opencode/
├── .windsurf/
├── AGENTS.md
├── CLAUDE.md
├── knowledge_base/
│   ├── 00_AI_CHARTER.md
│   ├── 01_PROJECT_PLAN.md
│   ├── 02_PROJECT_OVERVIEW.md
│   ├── API_SPECIFICATION.md
│   ├── BRD.md
│   ├── CODING_STANDARDS.md   (this file)
│   ├── DATABASE_DESIGN.md
│   ├── NFR.md
│   ├── PRD.md
│   ├── README.md
│   ├── REVIEW_SUMMARY.md
│   ├── SOLUTION_ARCHITECTURE.md
│   └── TASKS.md
├── raw_documents/
│   ├── API_CONTRACT.md
│   ├── GITHUB_WORKFLOW.md
│   ├── NFR.md
│   ├── PRD.md
│   ├── REPORTING.md
│   ├── ROADMAP.md
│   ├── SCHEMA.md
│   ├── TESTING_STRATEGY_AND_DOD.md
│   ├── UI_REFERENCE.md
│   └── design_reference/
│       ├── design-details.md
│       ├── design-references-catalog.md
│       ├── admin_agent_command_center/
│       ├── ai_chatbot_configuration/
│       ├── bulk_upload_validation_results/
│       ├── customer_account_dashboard/
│       ├── lead_detail_sarah_jenkins/
│       ├── lead_pipeline_kanban_view/
│       ├── listing_editor_basic_info/
│       ├── propvista_crm/
│       │   └── DESIGN.md
│       ├── propvista_crm_homepage/
│       ├── search_results_empty_state/
│       ├── search_results_filter_fallback_view/
│       ├── search_results_standard_view/
│       └── property_inventory_admin_view/
│       └── property_details_premium_view/
├── src/                     # Source code (to be created during implementation)
│   ├── client/              # Frontend (Next.js/React)
│   │   ├── components/
│   │   ├── pages/
│   │   ├── public/
│   │   └── styles/
│   ├── server/              # Backend (Node.js/Express)
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── prisma/              # Prisma schema and migrations
│       ├── migrations/
│       └── schema.prisma
├── .env.example             # Example environment variables (committed)
├── .gitignore
└── README.md
```

**Notes:**
- The `knowledge_base/` directory contains living artifacts (AI_CHARTER.md, PROJECT_PLAN.md, etc.) and derived specifications (API_SPECIFICATION.md, DATABASE_DESIGN.md, SOLUTION_ARCHITECTURE.md, CODING_STANDARDS.md).
- The `raw_documents/` directory contains source‑of‑truth documents (API_CONTRACT.md, GITHUB_WORKFLOW.md, NFR.md, PRD.md, ROADMAP.md, SCHEMA.md, TESTING_STRATEGY_AND_DOD.md, UI_REFERENCE.md) and the `design_reference/` folder with UI mockups.
- The `src/` directory will hold the application source code once implementation begins (Phases 1‑5).

### Naming Conventions
#### Files and Directories
- Use **kebab-case** for file and directory names (e.g., `api-specification.md`, `user-profile.component.tsx`).
- Exception: JSON configuration files (e.g., `tsconfig.json`, `package.json`) and environment files (`.env.example`) retain their conventional naming.
- Test files: colocated with the module they test or in a `__tests__` directory; use `.test.` or `.spec.` suffix (e.g., `userService.test.ts`, `authMiddleware.spec.ts`).

#### Variables, Functions, and Classes
- **camelCase** for variables, functions, and instances (e.g., `userId`, `calculateTotalPrice`, `userService`).
- **PascalCase** for classes, types, interfaces, and React components (e.g., `UserService`, `PropertyCard`, `ApiResponse`).
- **UPPER_SNAKE_CASE** for constants (e.g., `MAX_PAGE_SIZE`, `DEFAULT_LANGUAGE`, `API_BASE_URL`).
- **Private members** (TypeScript): prefix with underscore (e.g., `_privateMethod`, `_internalState`) – though TypeScript privacy is preferred via `private` keyword.

#### Database
- **Tables**: snake_case via `@@map` in Prisma (e.g., `users`, `properties`, `chat_messages`).
- **Columns**: snake_case (e.g., `id`, `email`, `password_hash`, `is_admin`, `created_at`, `updated_at`).
- **Indexes**: no custom naming required; Prisma generates names like `User_email_key`, `Properties_status_index`.
- **Enums**: PascalCase in Prisma (`PropertyStatus`, `ChatRole`).

#### API Endpoints
- Use **kebab-case** in URL paths (e.g., `/api/properties`, `/api/auth/register`, `/api/chat/message`).
- Resource nouns are pluralized for collections (e.g., `/properties` for list, `/properties/:id` for single item).
- Actions that are not CRUD use verbs in the path only when necessary (e.g., `/auth/login` – though these are under a collection noun `auth`).

#### Environment Variables
- Use **UPPER_SNAKE_CASE** (e.g., `DATABASE_URL`, `ANTHROPIC_API_KEY`, `SESSION_SECRET`, `NEXT_PUBLIC_APP_URL`).
- Prefix frontend-exposed variables with `NEXT_PUBLIC_` (Next.js convention).

### Coding Standards
#### Language Versions
- **JavaScript/TypeScript**: Use TypeScript 5.0+ for all new code.
- **Node.js**: Minimum version 18.x (LTS).
- **Frontend**: React 18.x, Next.js 13.x+ (App Router or Pages Router as appropriate; follow existing patterns).

#### Code Formatting
- Use **Prettier** with the following configuration (to be committed as `.prettierrc`):
  ```json
  {
    "semi": true,
    "trailingComma": "es5",
    "singleQuote": true,
    "printWidth": 100,
    "tabWidth": 2
  }
  ```
- Use **ESLint** with the following plugins and extends (to be committed as `.eslintrc.js`):
  - `eslint:recommended`
  - `@typescript-eslint/recommended`
  - `plugin:@typescript-eslint/recommended`
  - `plugin:react/recommended` (for frontend)
  - `plugin:@next/next/recommended` (for Next.js)
  - Rules:
    - `"@typescript-eslint/explicit-function-return-type": "off"` (allow inference for brevity where safe)
    - `"@typescript-eslint/no-explicit-any": "warn"`
    - `"@typescript-eslint/no-non-null-assertion": "off"` (use with caution)
    - `"react/react-in-jsx-scope": "off"` (Next.js 13+ handles this automatically)
    - `"import/order": ["error", { "groups": [["builtin", "external"], ["internal"], ["parent"], ["sibling"], ["index"]], "newlines-between": "always" }]`

#### TypeScript Practices
- Prefer **interfaces** for object shapes that may be extended or implemented; **type aliases** for unions, tuples, and mapped types.
- Avoid `any`; use `unknown` when type is truly unknown and perform type guards.
- Use `readonly` for arrays and objects that should not be mutated after initialization.
- Leverage **utility types** (`Partial`, `Required`, `Pick`, `Omit`, `Record`) where appropriate.
- Enable `strict`: true in `tsconfig.json` (already implied by Next.js and Node.js TS setups).
- Use **path aliases** for clean imports (e.g., `@/components/Button` -> `src/client/components/Button.tsx`; configure in `tsconfig.json` and `jsconfig.json` or via Next.js `next.config.js`).

#### React/Specific Frontend
- **Functional Components** with hooks; avoid class components unless required by a library.
- **File Extensions**: `.tsx` for React components with JSX, `.ts` for pure logic.
- **Styling**: Use **Tailwind CSS** utility classes directly in JSX; avoid custom CSS unless absolutely necessary (then use CSS modules or styled-jsx with scoped styles).
- **Component Organization**:
  - Split components into `components/` (UI primitives: Button, Input, Card, etc.) and `components/` for domain-specific components (PropertyFilter, ChatWidget, AdminPropertyForm).
  - Keep components small and focused; extract reusable logic into custom hooks (`hooks/` directory).
- **State Management**: Use React hooks (`useState`, `useEffect`, `useContext`) for local state; consider React Query or SWR for server state (data fetching, caching, updates) – but for MVP, simple fetching with `useEffect` and `useState` is acceptable.
- **Next.js Specific**:
  - Use the **Pages Router** (for simplicity in MVP) or App Router if the team prefers; but stick to one.
  - Place pages under `src/client/pages/` (if using Pages Router) or `src/client/app/` (if using App Router).
  - Use `next/link` for client-side navigation and `next/router` for programmatic navigation.
  - Optimize images with `next/image` component; provide `width`, `height`, and `alt` attributes.
  - Export metadata (title, description) via `export const metadata` (App Router) or `Head` component (Pages Router).

#### Node.js/Backend
- **File Extensions**: `.ts` for all server-side code.
- **Project Structure**:
  - `src/server/controllers/` – request handlers (thin layer; delegate to services).
  - `src/server/services/` – business logic (encapsulates data access, external API calls, validation).
  - `src/server/routes/` – Express route definitions (wire controllers to paths).
  - `src/server/middleware/` – custom middleware (authentication, validation, error handling, logging, rate limiting).
  - `src/server/utils/` – helper functions (formatters, validators, constants).
  - `src/server/config/` – configuration loader (environment variables with validation via `zod` or `joi`).
- **Express Practices**:
  - Use async handlers with a wrapper to catch errors and pass to `next(err)` (to avoid try/catch in every route).
  - Example:
    ```ts
    const asyncHandler = (fn: RequestHandler) => (req: Request, res: Response, next: NextFn) =>
      Promise.resolve(fn(req, res, next)).catch(next);
    ```
  - Keep controllers focused on request/response mapping; move logic to services.
  - Use middleware for cross-cutting concerns (auth, validation, rate limiting, logging).
- **Dependency Injection** (lightweight): Pass services into controllers via constructor or context; avoid singletons where possible for testability.
- **Validation**: Use a schema-based validator (e.g., Zod) for request bodies and query parameters; validate at the route level or in a middleware.
- **Error Handling**: Centralized error-handling middleware that formats errors per `API_CONTRACT.md` (see Error Handling section below).
- **Logging**: Use a logger (e.g., `pino` or `winston`) with request ID correlation; see Logging section below.

### Error Handling
#### General Principles
- **Do not leak stack traces or internal details** to the client in production; return generic messages for unexpected errors.
- **All errors** (expected and unexpected) must be logged server-side with sufficient context for debugging (request ID, timestamp, user ID if available, error message) – but **never log passwords, tokens, or other sensitive data**.
- **Use standardized error responses** as defined in `API_CONTRACT.md` §8‑9:
  ```json
  {
    "error": {
      "code": "string",   // machine-readable error code (e.g., "validation_error", "ai_unavailable")
      "message": "string" // human-readable description
    }
  }
  ```
- **HTTP Status Codes**: Use appropriate codes (2xx for success, 4xx for client errors, 5xx for server errors).

#### Backend (Node.js/Express)
1. **Validation Errors**:
   - Validate request bodies, query parameters, and params using a schema library (e.g., Zod).
   - On failure, return `400 Bad Request` with `{ error: { code: "validation_error", message: "<details>" } }`.
   - Example using Zod middleware:
     ```ts
     import { z } from 'zod';
     const registerSchema = z.object({
       email: z.string().email(),
       password: z.string().min(8),
     });
     // In route:
     const result = registerSchema.safeParse(req.body);
     if (!result.success) {
       return res.status(400).json({
         error: {
           code: 'validation_error',
           message: result.error.errors.map(e => e.message).join(', '),
         }
       });
     }
     ```
2. **Authentication/Authorization Errors**:
   - Missing or invalid session → `401 Unauthorized` (or redirect to login for UI).
   - Valid session but `!req.user?.isAdmin` for admin routes → `403 Forbidden`.
3. **Resource Not Found**:
   - If a requested resource (e.g., property by ID) does not exist or is not accessible (e.g., unpublished property via public endpoint) → `404 Not Found`.
4. **Conflict**:
   - Attempting to create a duplicate unique resource (e.g., email during registration) → `409 Conflict`.
5. **Rate Limiting**:
   - When rate limit is exceeded → `429 Too Many Requests` with `Retry-After` header and error body `{ error: { code: "rate_limit_exceeded", message: "Too many requests, please try again later." } }`.
6. **External Service Failure** (e.g., Anthropic API):
   - If the upstream service is unavailable, times out, or returns an error → `503 Service Unavailable` with `{ error: { code: "ai_unavailable", message: "The AI service is temporarily unavailable. Please try again later or use the search filters." } }`.
7. **Unexpected Errors**:
   - Catch-all error handler (Express `err => { ... }`) logs the error and returns `500 Internal Server Error` with `{ error: { code: "internal_server_error", message: "An unexpected error occurred." } }` (in production; in development, may include more details for debugging).

#### Frontend
- **Error Boundaries**: Use React error boundaries to catch rendering errors in component trees and display a fallback UI.
- **API Error Handling**:
  - Check response status; if not ok, parse the JSON error body (if present) to display a user‑friendly message based on `error.code`.
  - For network errors or non‑JSON responses, show a generic message (e.g., "Unable to connect to the server").
  - Specific handling:
    - `401` → redirect to login page.
    - `403` → show "Access denied" message.
    - `404` → show "Resource not found".
    - `429` → show "Too many requests; please wait a moment and try again" (and respect `Retry-After` if available).
    - `503` (AI unavailable) → show the fallback message per FR3.4 (e.g., "I'm having trouble right now — try the search filters above").
    - `5xx` → show "Something went wrong; please try again later."
- **Form Validation**:
  - Validate client-side before submitting (immediate feedback).
  - Always validate server-side as the source of truth.
  - Display field‑level errors returned from the API (if any) near the corresponding input.
- **Console Errors**: Avoid `console.log` in production; use a logging wrapper that respects `process.env.NODE_ENV`.

### Logging
#### Backend
- **Logger Choice**: Use `pino` (low overhead, JSON‑friendly) or `winston` (flexible transports). Configure as a singleton.
- **Log Format**: JSON for ease of parsing in log aggregation systems (e.g., ELK, Loki, Datadog).
- **Log Levels**:
  - `error`: For exceptions, failed operations, validation errors that result in 4xx/5xx responses.
  - `warn`: For deprecated usage, recoverable issues, unexpected but non‑fatal conditions.
  - `info`: For important events (server start, shutdown, database connection, external API calls).
  - `debug`: For detailed tracing during development; disable in production.
  - `trace`: For very fine‑grained logging (rarely used).
- **What to Log**:
  - **Requests**: Incoming request ID, method, path, query string, user ID (if authenticated), response status, response time.
  - **Errors**: Full error stack (in development) or message (in production), context (user ID, request ID, operation being performed).
  - **External Calls**: Outgoing requests to third‑party APIs (Anthropic, geocoding) – log URLs (without secrets), status codes, and response times.
  - **Database**: Connection events, query times (slow query threshold), migration events.
  - **Authentication**: Login attempts (success/failure), session creation/destruction, permission denials.
  - **Startup/Shutdown**: Server start, port listening, graceful shutdown signals.
- **Do NOT Log**:
  - Passwords, password hashes, session secrets, API keys, authentication tokens, or any other sensitive data.
  - Full request bodies containing sensitive fields (e.g., registration/password fields) – redact or hash before logging if absolutely necessary.
- **Request ID Correlation**: Generate a unique request ID (e.g., using `uuid`) at the start of each request and attach it to the request object (`req.id`); include this ID in all log entries for that request to enable tracing.
- **Log Rotation and Retention**: In production, rely on the hosting platform’s log management (e.g., CloudWatch, Loki) with retention policies; for local development, logs may be written to console or rotating files.

#### Frontend
- **Console Logging**: Limit to `console.warn` and `console.error` for unexpected conditions; avoid `console.log` in production builds.
- **Error Boundaries**: Capture rendering errors and log them to an error‑reporting service (optional for MVP; not required per NFR §8).
- **Custom Logging Wrapper** (optional): A small utility that prefixes logs with a timestamp and component name, and respects `process.env.NODE_ENV` to suppress in production.
- **What to Log**:
  - Failed API requests (status, error code, message).
  - Unhandled promises or exceptions caught in error boundaries.
  - Critical state transitions (e.g., user login/logout, admin actions) – but avoid logging PII.

### Testing Standards
#### Levels and Tooling (Per TESTING_STRATEGY_AND_DOD.md §1.1)
- **Unit**
  - **Tool**: Vitest (or Jest) – fast, built‑in TypeScript support, excellent for pure functions.
  - **What**: Price formatting, filter‑query building, validation helpers, utility functions.
  - **Coverage**: Aim for high percentage (>80%) on utility and helper files.
- **API/Integration**
  - **Tool**: Vitest (or Jest) with an in‑memory or test‑specific PostgreSQL database (using Prisma’s `--generate` and a test database URL).
  - **What**: Every route in `API_CONTRACT.md` – request in, response/status out, DB state after.
  - **Coverage**: Test all endpoints for happy path, edge cases, and error conditions.
- **E2E**
  - **Tool**: Playwright (Chromium, Firefox, WebKit) – simulates real user interactions.
  - **What**: The success criteria in `PRD.md` §6, run against a seeded local build.
  - **Scenarios**:
    1. Visitor browses, filters, views property details.
    2. Visitor asks chatbot a question and receives a relevant answer or graceful fallback.
    3. Admin creates a listing and sees it appear on the public site within the same session.
  - **Coverage**: Full user journeys; not required to test every edge edge but must cover the core flows.

#### Required Coverage per Phase (Per TESTING_STRATEGY_AND_DOD.md §1.2)
- **Phase 1 (Data Model + Auth)**:
  - Registration: happy path, duplicate email rejection.
  - Login: happy path, wrong password rejection.
  - `isAdmin` flag: correctly set and read.
- **Phase 2 (Public Site)**:
  - `GET /api/properties`: filter/sort/pagination combinations.
  - `GET /api/properties/:id`: found and 404 cases.
  - Ensure unpublished properties never appear in public endpoints.
- **Phase 3 (Chatbot)**:
  - Normal query returns a reply.
  - Empty/no‑match query handled gracefully.
  - Simulated AI‑provider failure triggers the `503` fallback path (mock the Anthropic call).
  - Rate‑limit triggers `429` after threshold.
- **Phase 4 (Admin CRUD)**:
  - Create/edit/delete/unpublish round‑trip.
  - Non‑admin gets `403`; anonymous gets `401`.
  - A `published` property appears on the public site immediately after status change; a reverted‑to‑`draft` one disappears.
- **Phase 5 (Polish)**:
  - Smoke E2E covering the full PRD §6 success criteria in one run.

#### General Testing Practices
- **Test Isolation**:
  - Use a separate test database (never run tests against the development database directly).
  - Reset database state before each test (transactions, truncates, or fresh migrations).
  - Mock external services (Anthropic API, geocoding) to avoid flaky tests and control costs.
- **Test Organization**:
  - Place unit tests alongside the source files they test (e.g., `src/services/propertyService.test.ts`).
  - Place API/integration tests in `src/server/tests/` or `tests/api/`.
  - Place E2E tests in `tests/e2e/` or `src/tests/e2e/`.
- **Assertions**: Use built-in Vitest/Expect or a lightweight assertion library; avoid over‑mocking – test real integrations where possible.
- **Coverage Threshold**: While no hard percentage is mandated, the test suite must pass and new/changed behavior must have test coverage per phase. Avoid disabling tests to make CI green.
- **CI Integration**:
  - Lint, typecheck, and the full test suite must pass before merge (PER `CLAUDE.md` §5 and `GITHUB_WORKFLOW.md` §6).
  - If no CI pipeline exists yet, run the suite locally before opening a PR and state so in the PR description.
- **Test Data**:
  - Use factories (e.g., `@faker-js/faker` or custom builders) to generate realistic but deterministic test data.
  - For database tests, seed known states before each test suite or test.
- **Snapshot Testing**: Use sparingly for stable UI components or API response schemas; update snapshots intentionally when the contract changes.

### Git Workflow
Per `GITHUB_WORKFLOW.md` and `CLAUDE.md` §5:
- **Repository Hosting**: GitHub.
- **Default Branch**: `main` (protected – requires PR and status checks).
- **Branch Naming**:
  - `<type>/<issue-number>-<short-description>`
  - Types:
    - `feature/` – new functionality.
    - `fix/` – bug fixes.
    - `chore/` – tooling, configuration, dependencies.
    - `docs/` – documentation-only changes.
- **Commit Messages**:
  - Use imperative mood, present tense (e.g., "Add user registration endpoint", "Fix password validation regex").
  - Keep subject line under 50 characters; wrap body at 72 characters if needed.
  - Reference the issue: e.g., "Fixes #42" or "Closes #123" in the body.
  - Include `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` for AI‑generated commits (optional but recommended for transparency).
- **Pull Requests**:
  - One PR per task or subtask (where practical) – small, reviewable, mappable to a single line in `ROADMAP.md`.
  - PR must:
    - Link the issue(s) it closes (`Closes #12`).
    - State which milestone/phase it belongs to.
    - Describe what was tested (per `TESTING_STRATEGY_AND_DOD.md` §1.2 for that phase).
    - For any UI‑facing change: include a screenshot (see `REPORTING.md` for archiving).
    - Confirm the Definition of Done checklist (`TESTING_STRATEGY_AND_DOD.md` §2) – reviewer treats an unchecked DoD item as a blocker.
  - **Required CI Checks** (GitHub Actions):
    1. Install dependencies (`npm ci`).
    2. Lint (`npm run lint`).
    3. Typecheck (`npm run typecheck` or `tsc --noEmit`).
    4. Test suite (unit + integration; Playwright E2E runs on a schedule or on‑demand but must run before a phase milestone is closed).
    5. Prisma migration dry‑run/validate if the PR touches `schema.prisma`.
- **Merging**:
  - No merging with `--no-verify` or bypassing branch protection, even for "small" changes.
  - After approval and green CI, merge via the "Squash and merge" option to keep a clean linear history (or rebase and merge if preferred).
- **Branch Cleanup**:
  - Enable "Automatically delete head branches" in repository settings so branches are removed after merge.
- **Tags and Releases**:
  - Use semantic versioning tags (`v1.0.0`, `v1.0.1`, etc.) for major milestones (not required for MVP but good practice).
  - Create a GitHub Release with release notes when a phase gate is satisfied.
- **Project Board**:
  - Use a GitHub Project (board view) with columns: `Backlog` → `In Progress` → `In Review` → `Done`.
  - Every issue lives on the board, grouped by milestone (phase).
  - Update card positions as work progresses (not only at the end).

### Documentation Standards
#### Living Documentation
- **Source of Truth**: The files in `documents/` are the source documents (PRD, ROADMAP, NFR, API_CONTRACT, SCHEMA, UI_REFERENCE, TESTING_STRATEGY_AND_DOD, GITHUB_WORKFLOW, design_reference/). These should be treated as immutable during a phase; changes are made by creating a new version or updating via a documented process.
- **Living Artifacts**: The files in `docs/` (`00_AI_CHARTER.md`, `01_PROJECT_PLAN.md`, `02_PROJECT_OVERVIEW.md`, `REVIEW_SUMMARY.md`) and `requirements/` (`BRD.md`, `PRD.md`, `NFR.md`) are updated as the project evolves to reflect the current state and decisions.
- **Generated Artifacts**: Files in `api/`, `architecture/`, `database/`, `development/` are derived from the source documents and should be regenerated when the source changes.
- **Update Process**:
  1. Make changes to the source document in `documents/` (e.g., update `API_CONTRACT.md` for a new endpoint).
  2. Update any dependent source documents to maintain consistency (e.g., if a new DB column is added, update `SCHEMA.md` and the Prisma schema).
  3. Regenerate derived documents (e.g., `api/API_SPECIFICATION.md`, `database/DATABASE_DESIGN.md`, `architecture/SOLUTION_ARCHITECTURE.md`) using the same process that created them (manual or scripted).
  4. Update the living documents (`docs/` and `requirements/`) to reflect the change.
  5. Ensure all updates are in the same pull request.
  6. Update the corresponding checklist item in `ROADMAP.md` (if applicable) and verify the Definition of Done is met.

#### Documentation Writing Principles
- **Clarity and Conciseness**: Write in plain language; avoid unnecessary jargon.
- **Consistency**: Use the same terminology across documents (e.g., "Visitor" not "User" for public‑facing actors; "Admin" for administrators).
- **Versioning**: Use dates in filenames for historical versions (e.g., `00_AI_CHARTER_2026-07-23.md`) when preserving older versions; the latest version should always be at the base name (e.g., `00_AI_CHARTER.md`).
- **Diagrams and Images**: Store in an `assets/` directory within the relevant document folder (e.g., `docs/assets/architecture-diagram.png`) and reference via relative path.
- **Code Snippets**: When including code, fence it with the appropriate language tag (e.g., ```ts, ```json, ```sql) and keep it short and relevant.
- **Links**: Use relative links for internal documents (e.g., `../documents/PRD.md`) and absolute links for external resources.
- **Review and Approval**: Any change to documentation must be reviewed and approved via the same PR process as code changes.

#### Specific Documents
- **API_CONTRACT.md**: The single source of truth for API endpoints; must be kept in sync with the actual implementation and the Prisma schema.
- **SCHEMA.md**: The single source of truth for the database schema; must be kept in sync with the Prisma schema (`prisma/schema.prisma`).
- **UI_REFERENCE.md** and `design_reference/propvista_crm/DESIGN.md`: The sources for UI design and design tokens; frontend implementation must follow these.
- **TESTING_STRATEGY_AND_DOD.md**: Defines what must be tested and when a task is considered "Done".
- **GITHUB_WORKFLOW.md**: Defines the GitHub‑based processes for issues, PRs, branches, and project boards.
- **REPORTING.md**: Defines the format for phase reports (`REPORT.md`) and screenshots.

*These coding standards are derived from the approved project documentation, including but not limited to: PRD.md, ROADMAP.md, NFR.md, API_CONTRACT.md, SCHEMA.md, UI_REFERENCE.md, TESTING_STRATEGY_AND_DOD.md, GITHUB_WORKFLOW.md, design_reference/propvista_crm/DESIGN.md, and the generated architecture, database, and API specifications.*