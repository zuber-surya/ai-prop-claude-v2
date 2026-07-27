# Coding Standards

This document outlines the coding standards and best practices for the Property Vista CRM MVP project. Adhering to these standards ensures consistency, maintainability, and quality across the codebase.

---

## TypeScript

- Use TypeScript `>= 5.0`.
- Enable strict mode in `tsconfig.json` (`strict: true`).
- Prefer interfaces over types for object shapes; use types for unions/intersections for complex types.
- Avoid `any`; use `unknown` when type is truly unknown and validate.
- Use explicit return types for exported functions.
- Prefer const over let; let only when reassignment is needed.
- Use arrow functions for inline callbacks; named functions for reusable logic.
- Organize types in `src/types/` or alongside components if component-specific.
- Enforce ESLint rules: `@typescript-eslint/no-explicit-any`, `@typescript-eslint/explicit-module-boundary-types`.

## Next.js

- Use Next.js `>= 14` with App Router.
- Place page components in `src/app/` (or `pages/` if using Pages Router, but App Router preferred).
- Use `generateMetadata` or `metadata` export for SEO.
- For data fetching:
  - Use Server Components by default.
  - Use `fetch` with caching; revalidate with `revalidateTag` or `revalidateSeconds`.
  - Avoid `getServerSideProps`/`getStaticProps` in App Router; use `load` or server functions.
- API routes go in `src/app/api/`.
- Use `<Link>` for client-side navigation; avoid `<a>` for internal links.
- Optimize images with `next/image`.
- Environment variables: prefix `NEXT_PUBLIC_` for client-exposed vars; keep secrets in `.env.local` (not committed).

## React

- Use React `>= 18` with concurrent features.
- Prefer functional components with hooks; avoid class components.
- Hooks rules: only call at top level; only in React functions.
- Use `useState`, `useEffect`, `useContext`, `useReducer` as appropriate.
- Memoize expensive computations with `useMemo`; memoize callbacks with `useCallback`.
- Split large components; aim for single responsibility.
- Use prop-types or TypeScript for component props; default props via destructuring.
- Handle loading and error states in UI.
- Avoid inline object/array literals in render; memoize if they cause re-renders.
- Use fragments (`<>...</>`) to avoid unnecessary wrappers.
- Follow React Hooks lint rules.

## Prisma

- Use Prisma ORM `>= 5.0`.
- Define schema in `prisma/schema.prisma`.
- Use PostgreSQL as the database.
- Follow Prisma naming conventions: model names PascalCase, fields snake_case.
- Use `@id` with `@default(uuid())` for UUID primary keys.
- Use `@updatedAt` and `@createdAt` for audit timestamps.
- Use `@default(now())` for timestamps.
- Use `@relation` for explicit relationships.
- Use enum types for fixed values (role, status).
- Generate client with `prisma generate`.
- Use transactions for multi-step writes (`prisma.$transaction`).
- Handle Prisma known errors (`PrismaClientKnownRequestError`).
- Do not expose raw Prisma client in routes; use service/repository layer.

## Tailwind CSS

- Use Tailwind CSS `>= 3.0`.
- Configure custom colors, spacing, radius in `tailwind.config.js`.
- Use utility classes for layout, spacing, typography.
- Extract repeated utility patterns into components or `@apply` in CSS (sparingly).
- Follow mobile-first approach; use `sm:`, `md:`, `lg:` prefixes.
- Use `@layer base`, `@layer components`, `@layer utilities` for custom styles.
- Avoid arbitrary values unless necessary; prefer design system tokens.
- Ensure sufficient contrast (WCAG AA) for text and background.
- Use `hover:`, `focus:`, `active:` for interactive states.
- Dark mode: use `dark:` selector if supported.

## API

- Follow RESTful conventions; versioned under `/api/v1/`.
- Use JSON for request/response bodies.
- Use appropriate HTTP methods: GET (read), POST (create), PUT/PATCH (update), DELETE (delete).
- Use HTTP status codes correctly:
  - 200 OK for successful GET/PUT/PATCH.
  - 201 Created for successful POST.
  - 204 No Content for successful DELETE.
  - 400 Bad Request for validation errors.
  - 401 Unauthorized for missing/invalid auth.
  - 403 Forbidden for authenticated but insufficient permissions.
  - 404 Not Found for missing resources.
  - 409 Conflict for resource conflicts (e.g., duplicate).
  - 422 Unprocessable Entity for semantic errors.
  - 429 Too Many Requests for rate limiting.
  - 500 Internal Server Error for unexpected errors.
- Validate all inputs with a schema library (e.g., Zod).
- Use consistent error response format: `{ error: { message: string, details?: any } }`.
- Use UUIDs for resource IDs in URLs.
- Use query parameters for filtering, pagination (`page`, `limit`), sorting (`sort`, `order`).
- Protect routes with authentication middleware; role-based guards.
- Log requests and responses (sanitized) for debugging.
- Use async/await; avoid callbacks.
- Return only necessary fields; consider DTOs or select clauses to avoid over-fetching.

## Logging

- Use a structured logger (e.g., `pino` or `winston`).
- Log levels: `error`, `warn`, `info`, `debug`, `trace`.
- Log to stdout/stderr; let PM2 or Docker handle log rotation.
- Include contextual fields: `reqId`, `userId`, `route`, `method`, `duration`.
- Do not log sensitive data (passwords, tokens, PII).
- Use request ID middleware to trace requests across services.
- Log errors with stack trace in development; omit in production.
- Performance logs: log slow queries (>1s), slow API endpoints (>500ms).
- Audit log: log significant actions (user login, property create, etc.) to a dedicated table or external service.
- Configure log levels per environment: `debug` in dev, `info` in prod.

## Security

- Authentication: Use JWT (access token + refresh token); store refresh token httpOnly cookie.
- Passwords: bcrypt with salt factor >= 12.
- HTTPS: enforce in production; use HSTS.
- Helmet: use equivalent middleware for secure headers (CSP, X-Frame-Options, etc.).
- CORS: restrict to trusted origins.
- Rate limiting: per-IP and per-user on auth endpoints, search.
- Input validation: validate and sanitize all inputs to prevent injection (SQL, XSS).
- Use parameterized queries (Prisma) to prevent SQL injection.
- Escape output in templates to prevent XSS.
- File uploads: validate MIME type, size (<5MB), scan for malware (future).
- Store uploads in secure bucket (S3) with private access; serve via CDN with signed URLs.
- Secrets: keep in environment variables; use `.env.local`; never commit.
- Dependencies: run `npm audit` regularly; keep packages updated.
- Use CSRF protection for state-changing operations if using cookies.
- Implement proper error handling: do not leak stack traces to users.
- Use environment-specific configs; disable debug endpoints in prod.

## Testing

- Unit tests: Jest + React Testing Library for components; test pure functions.
- Integration tests: Supertest for API routes; test database interactions with test DB.
- End-to-end tests: Cypress for critical user flows (login, search, inquiry).
- Test coverage: aim for >80% line coverage; prioritize critical paths.
- Mock external services (Stripe, Anthropic API) in tests.
- Test both success and error cases.
- Use factories (e.g., Factory Girl) or fixtures for test data.
- Run tests on CI for every PR.
- Use `test. touch` files or `.test.ts` naming convention.
- Follow Arrange-Act-Assert pattern.
- Clean up test data after each test.

## Naming Conventions

- **Files and folders**: use `kebab-case` for directories and files (`user-profile.tsx`).
- **Components**: use `PascalCase` (`UserProfileCard.tsx`).
- **Functions and variables**: use `camelCase` (`getUserProfile()`).
- **Constants**: use `UPPER_SNAKE_CASE` (`MAX_RESULTS_PER_PAGE`).
- **TypeScript types/interfaces**: use `PascalCase` (`interface UserProfile {}`).
- **Enum members**: use `UPPER_SNAKE_CASE` (`enum UserRole { ADMIN, CUSTOMER }`).
- **CSS classes**: use `kebab-case` (via Tailwind utilities; custom classes also kebab-case).
- **Prisma models**: use `PascalCase` (`model User {}`).
- **Prisma fields**: use `snake_case` (`emailVerified` -> `email_verified`? Actually Prisma defaults to camelCase in JS but snake_case in DB; we keep camelCase in schema for JS friendliness).
- **API endpoints**: use `kebab-case` in URL paths (`/api/v1/users`).
- **Query parameters**: use `snake_case` (`start_date`, `end_date`).
- **Environment variables**: use `UPPER_SNAKE_CASE` (`DATABASE_URL`).
- **Git branches**: use `feat/feature-name`, `fix/bug-description`, `chore/task`.

## General

- Format code with Prettier; integrate with pre-commit hook.
- Lint with ESLint (TypeScript + React plugins); fix all lint errors.
- Write meaningful commit messages: `feat(add|fix:|`, `(`docs:|`, etc.
- Keep functions small; aim for <50 lines.
- Comment complex logic; avoid obvious comments.
- Use absolute imports via `tsconfig` `baseUrl` (`@/components/Button`).
- Avoid deep nesting; prefer early returns.
- Handle promises properly; use `try/catch` or `.then().catch()`.
- Avoid `console.log` in production; use logger.
- Review code with pull requests; require at least one approval.

---
*End of Coding Standards Document*