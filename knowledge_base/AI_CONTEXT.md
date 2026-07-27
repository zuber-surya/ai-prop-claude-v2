# AI Context for Claude Code

This document provides essential context for Claude Code before implementing features in the Property Vista CRM MVP. Review this file to understand the project’s fundamentals, conventions, and constraints.

---

## Project Overview

Property Vista CRM MVP is a real‑estate customer relationship management platform with AI‑powered search. It enables users to browse listings, schedule viewings, manage leads, process payments, and receive notifications. The AI chatbot assists with natural‑language property search and answers user queries.

**Core Features**
- Property browsing & search (public)
- Authentication (register/login/logout, role‑based access)
- AI chatbot (Q&A, tool‑calling to property data)
- Admin property management (CRUD, publish/unpublish)
- Lead pipeline & booking management
- Payments (premium listings, deposits)
- Notifications (real‑time via WebSocket/SSE)
- Favorites, reports, and admin dashboards

**Tech Stack**
- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **Backend**: Node.js/Express, Prisma ORM (PostgreSQL)
- **AI**: Anthropic Claude API
- **Database**: PostgreSQL
- **Testing**: Jest, React Testing Library, Playwright, Supertest
- **Dev**: TypeScript, ESLint, Prettier, GitHub Actions

---

## Architecture

The system follows a layered, modular architecture:

1. **Presentation Layer** (Next.js/Pages, React components) – UI, client‑state, API consumption.
2. **API Layer** (Express REST) – Controllers, validation, authentication middleware.
3. **Service Layer** – Business logic, transaction boundaries, data transformation.
4. **Data Layer** – Prisma models, migrations, database queries.
5. **External Services** – Stripe/PayPal (payments), Anthropic (AI), email/SMS providers, storage (S3/CDN).
6. **Cross‑cutting** – Logging, error handling, security, caching.

Data flows: UI → API controller → service → Prisma → DB. Events (e.g., user.registered) can be emitted for future extension (WebSockets, queues).

---

## Coding Philosophy

- **Type‑safe**: Use TypeScript strictly; avoid `any`. Prefer `unknown` with validation.
- **Explicit over implicit**: Clear function signatures, avoid magic strings/numbers.
- **Separation of concerns**: Keep UI dumb; business logic in services.
- **Immutability**: Favor immutable data patterns where practical.
- **Fail fast**: Validate early; return precise HTTP errors.
- **Defensive coding**: Assume inputs are malicious; sanitize and authorize.
- **Testability**: Write pure functions; mock external dependencies.
- **Maintainability**: Small, focused files; meaningful names; comments for why, not what.
- **Performance‑aware**: Avoid N+1 queries, lazy load heavy assets, leverage caching.
- **Security first**: Authentication, authorization, input validation, output encoding.

---

## Folder Structure

Refer to `knowledge_base/development/PROJECT_STRUCTURE.md` for full details. Key highlights:

```
src/
├── backend/
│   └── src/
│       ├── controllers/
│       ├── services/
│       ├── middleware/
│       ├── routes/
│       ├── utils/
│       ├── lib/
│       ├── config/
│       └── prisma/
└── frontend/
    └── src/
        ├── app/
        ├── components/
        ├── lib/
        ├── hooks/
        ├── styles/
        ├── types/
        ├── context/
        └── middleware/
```

Documentation lives in `knowledge_base/` (api, backend, database, development, requirements, ui). Scripts in `scripts/`. Tests in `tests/` (unit, integration, e2e, ui).

---

## Libraries & Packages

### Backend (package.json in src/backend)

- **express** – web framework
- **typescript**, **ts-node** – language support
- **prisma**, **@prisma/client** – ORM
- **pg** – PostgreSQL driver
- **jsonwebtoken** – JWT handling
- **bcryptjs** – password hashing
- **zod** – schema validation
- **pino** or **winston** – structured logging
- **helmet** – security headers
- **cors** – CORS middleware
- **express-rate-limit** – rate limiting
- **multer** – file upload handling
- **stripe** or **paypal-rest-sdk** – payment gateway
- **nodemailer** – email service
- **dotenv** – environment variables
- **jest**, **supertest**, **ts-jest** – testing

### Frontend (package.json in src/frontend)

- **next** – React framework
- **react**, **react-dom** – UI library
- **typescript** – type safety
- **@types/react**, **@types/node** – type definitions
- **tailwindcss**, **postcss**, **autoprefixer** – styling
- **eslint**, **eslint-plugin-react**, **@typescript-eslint/parser** – linting
- **jest**, **react-testing-library** – unit testing
- **@playwright/test** – end‑to‑end testing
- **swr** or **react-query** – server state caching (optional)
- **zustand** or **jotai** – client state (optional)
- **framer-motion** – animations (optional)
- **axios** or **fetch** – HTTP client (via wrapper)

### Dev Tools

- **prettier** – code formatting
- **lint-staged**, **husky** – pre‑commit hooks
- **turbo** or **npm workspaces** – monorepo scripts (if adopted)

---

## Naming Conventions

- **Directories/files**: `kebab-case` (user-profile, auth.middleware.ts)
- **Components**: `PascalCase` (UserProfileCard.tsx)
- **Functions/variables**: `camelCase` (getUserProfile())
- **Constants**: `UPPER_SNAKE_CASE` (MAX_RESULTS_PER_PAGE)
- **TypeScript types/interfaces**: `PascalCase` (interface UserProfile {})
- **Enum members**: `UPPER_SNAKE_CASE` (enum UserRole { ADMIN, CUSTOMER })
- **CSS classes**: `kebab-case` (Tailwind utilities)
- **Prisma models**: `PascalCase` (model User {})
- **Prisma fields**: `camelCase` in schema (maps to snake_case in DB)
- **API endpoints**: `kebab-case` under `/api/v1/` (/api/v1/auth/login)
- **Query parameters**: `snake_case` (start_date, limit)
- **Environment variables**: `UPPER_SNAKE_CASE` (DATABASE_URL)
- **Git branches**: `feat/`, `fix/`, `docs/`, `chore/`, `refactor/`, `release/`, `hotfix/`

---

## Error Handling

- Use centralized error‑handling middleware (Express) to catch async errors.
- Format error responses uniformly:
  ```json
  { "error": { "message": "Human‑readable summary", "details?: any" } }
  ```
- Status codes:
  - `400` – validation or bad request
  - `401` – missing/invalid auth
  - `403` – insufficient permissions
  - `404` – resource not found
  - `409` – conflict (duplicate)
  - `422` – semantic error
  - `429` – rate limit
  - `500` – unexpected server error
- Do **not** leak stack traces or internal details to clients in production.
- Log full error details server‑side (see Logging).
- Validate all inputs with Zod (or Joi) before reaching service layer.
- Use `try/catch` in async routes; forward errors to `next(err)`.

---

## Logging

- Use a structured logger (Pino or Winston) with levels: `error`, `warn`, `info`, `debug`, `trace`.
- Include contextual fields in every log entry: `reqId`, `userId`, `route`, `method`, `duration`, `status`.
- **Never** log passwords, tokens, raw request bodies containing PII.
- Use request‑ID middleware (e.g., `request-id` or custom) to trace requests across services.
- In development: log level `debug`; in production: `info` (errors still logged).
- Performance logging: log slow DB queries (>1 s) and slow API endpoints (>500 ms).
- Audit log critical actions (user login, property created, payment processed) to a dedicated table or external service for compliance.
- Rotate logs via external system (PM2, Docker, or log‑shipper); do not rely on file‑size rotation inside Node.

---

## Security

- **Authentication**: JWT (access token + refresh token). Store refresh token in httpOnly, Secure cookie; access token in memory or short‑lived cookie.
- **Passwords**: bcrypt with salt ≥ 12.
- **HTTPS**: Enforce in production; enable HSTS.
- **Headers**: Use helmet‑equivalent middleware (CSP, X‑Frame‑Options, X‑Content‑Type‑Options, Referrer‑Policy, etc.).
- **CORS**: Restrict to trusted origins (configure via env).
- **Rate limiting**: Per‑IP and per‑user on auth endpoints, search, etc.
- **Input validation**: Validate and sanitize all inputs; use parameterized queries via Prisma to prevent SQL injection.
- **Output encoding**: Escape dynamic content rendered in HTML; rely on React’s auto‑escaping for JSX, but beware of `dangerouslySetInnerHTML`.
- **File uploads**: Validate MIME type (jpeg/png), limit size (≤5 MB), store in private S3 bucket, serve via signed URLs or CDN.
- **Secrets**: Keep in environment variables; never commit `.env`. Use `.env.example` for template.
- **Dependencies**: Run `npm audit` regularly; keep packages up‑to‑date.
- **CSR‑F**: If using cookies for auth, implement CSRF tokens or rely on SameSite attributes.
- **Error messages**: Generic to avoid user enumeration (e.g., “Invalid email or password”).
- **Environment segregation**: Separate configs for dev, staging, prod; disable debug endpoints in prod.

---

## Performance

- **Database**: Use indexes (per DATABASE_DESIGN.md); employ pagination (`limit/offset` or cursor); use connection pooling (Prisma pool).
- **Caching**: Cache static assets via CDN; cache frequent API responses (e.g., homepage data) with short TTL; consider Redis for session‑independent data.
- **Asset optimization**: Next.js Image component for lazy‑loaded, resized images; enable compression (gzip/brotli).
- **Code splitting**: Leverage Next.js automatic route‑based splitting; dynamic `import()` for heavy libraries.
- **State management**: Prefer React Query/SWR for server state with background refetch; avoid prop‑drilling with Context or Zustand.
- **Avoid blocking operations**: Offload CPU‑intensive tasks (e.g., image processing) to workers or queues.
- **Monitor**: Track response times, error rates, throughput via APM or simple logging; set alerts on SLA breaches.
- **Payload size**: Return only needed fields (use Prisma `select`); avoid over‑fetching.

---

## Coding Rules

1. **TypeScript strict mode** enabled in all `tsconfig.json`.
2. **ESLint** and **Prettier** must pass before committing (enforced by husky/ lint‑staged).
3. **No `console.log`** in production code; use the logger.
4. **All public functions** must have JSDoc or TSdoc comments describing purpose, params, returns.
5. **Component files**: one component per file (except tiny helper components).
6. **Custom hooks** prefixed with `use` (`useAuth`, `useForm`).
7. **Utility verbs**: `get`, `create`, `update`, `delete`, `format`, `parse`.
8. **Constants** defined at top of file or in dedicated `constants.ts`.
9. **Magic numbers/strings** avoided; replace with named constants.
10. **Async/await** preferred over `.then()` chains; handle errors with `try/catch`.
11. **File size**: aim < 300 lines per file; split concerns if larger.
12. **Imports sorted**: built‑ins → external → absolute aliases → relative.
13. **No barrel (`index.js`) exports** to preserve tree‑shaking.
14. **Tests**: write unit tests for utilities, services, components; aim ≥ 80% coverage on critical paths.
15. **Review**: every change must pass pull‑request review with at least one approval.

---

## Files to Always Read Before Coding

Before starting any development task, consult these files to ensure alignment with project standards:

1. **knowledge_base/development/PROJECT_STRUCTURE.md** – folder layout, naming, import rules.
2. **knowledge_base/development/CODING_STANDARDS.md** – language‑specific guidelines (TS, Next.js, React, Prisma, Tailwind, API, logging, security, testing, naming).
3. **knowledge_base/api/API_SPECIFICATION.md** – endpoint contracts, request/response schemas, auth requirements.
4. **knowledge_base/database/DATABASE_DESIGN.md** – table schemas, column types, constraints, relationships.
5. **knowledge_base/backend/BUSINESS_RULES.md** – domain‑level rules that must be enforced in service layer.
6. **knowledge_base/backend/BACKEND_FUNCTIONAL_SPEC.md** – expected behavior of modules, services, controllers.
7. **knowledge_base/ui/FRONTEND_FUNCTIONAL_SPEC.md** – UI screens, components, state, API integration details.
8. **knowledge_base/testing/TEST_PLAN.md** – testing strategies and required test types for new features.
9. **knowledge_base/development/GIT_WORKFLOW.md** – branch naming, commit messages, PR process, code review, release flow.
10. **knowledge_base/requirements/PRD.md** (if exists) – high‑level product requirements and success criteria.

After reading the above, proceed with implementation, ensuring that all code adheres to the outlined standards and that tests are added or updated accordingly.

--- 

*End of AI_CONTEXT.md*