# Project Structure

This document defines the recommended folder hierarchy, naming conventions, file placement, import conventions, and module organization for the Property Vista CRM MVP.

---

## Folder Hierarchy

```
property-vista-crm/
├── knowledge_base/              # Project documentation (PRD, specs, etc.)
│   ├── api/
│   ├── backend/
│   ├── database/
│   ├── development/
│   ├── requirements/
│   └── ui/
├── src/                         # Source code (monorepo style)
│   ├── backend/                 # Node.js/Express server with Prisma ORM
│   │   ├── src/                 # TypeScript source
│   │   │   ├── controllers/     # Request handlers (Express controllers)
│   │   │   ├── services/        # Business logic layer
│   │   │   ├── middleware/      # Custom Express middleware (auth, validation, etc.)
│   │   │   ├── routes/          # API route definitions
│   │   │   ├── utils/           # Utility functions and helpers
│   │   │   ├── lib/             # External service wrappers (e.g., mail, payment, AI client)
│   │   │   ├── config/          # Configuration loading (env, feature flags)
│   │   │   ├── prisma/          # Prisma schema and generated client
│   │   │   │   ├── schema.prisma
│   │   │   │   └── migrations/
│   │   │   └── index.ts         # Server entry point
│   │   ├── tests/               # Backend tests (unit, integration)
│   │   ├── prisma/              # Prisma CLI and migration files (alternative location)
│   │   ├── .env                 # Environment variables (not committed)
│   │   ├── .env.example         # Example environment variables
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── frontend/                # Next.js/React application
│       ├── src/                 # React components and logic
│       │   ├── app/             # App Router (pages, layouts, route groups)
│       │   ├── components/      # Reusable UI components (buttons, cards, modals, etc.)
│       │   ├── lib/                 # Utilities, API clients, helpers
│       │   ├── hooks/               # Custom React hooks
│       │   ├── styles/              # Global styles, CSS modules, Tailwind customizations
│       │   ├── types/               # TypeScript types and interfaces
│       │   ├── context/             # React context providers (auth, theme, etc.)
│       │   └── middleware/          # Next.js middleware (auth, redirects)
│       ├── public/                # Static assets (images, icons, robots.txt)
│       ├── styles/                # Global CSS/Tailwind entry (styles/globals.css)
│       ├── next.config.js
│       ├── tailwind.config.js
│       ├── postcss.config.js
│       ├── tsconfig.json
│       ├── eslint.config.js
│       └── package.json
├── scripts/                     # Utility scripts (db migrations, seed, dev tools)
├── tests/                       # End-to-end tests (Cypress, Playwright)
├── .github/                     # GitHub Actions workflows, issue templates
├── .gitignore
├── README.md
└── package.json                 # Optional root package.json for workspace scripts
```

---

## Naming Conventions

- **Directories**: `kebab-case` (`user-profile`, `api-v1`).
- **Files**:
  - TypeScript/JavaScript: `kebab-case` (`user-service.ts`, `auth.middleware.ts`).
  - React components: `PascalCase` (`UserProfileCard.tsx`).
  - Styles/CSS modules: `kebab-case.module.css` (`user-profile.module.css`).
  - Tests: `__tests__/` or `.test.ts` suffix (`user.service.test.ts`).
  - Configuration: `.json`, `.js`, `.ts` as appropriate (`tsconfig.json`, `tailwind.config.ts`).
  - Prisma schema: `schema.prisma`.
- **Environment Variables**: `UPPER_SNAKE_CASE` (`DATABASE_URL`, `NEXT_PUBLIC_API_URL`).
- **Database Tables/Columns**: `snake_case` (users, user_id, email).
- **API Endpoints**: `kebab-case` under versioned path (`/api/v1/users`, `/api/v1/auth/login`).

---

## File Placement Guidelines

### Backend (`src/backend/src/`)

- **controllers**: Handle HTTP requests, validate input, call services, return responses.
- **services**: Contain business logic, interact with Prisma models, encapsulate complex operations.
- **middleware**: Reusable Express middleware (authentication, validation, error handling).
- **routes**: Define Express routers, mount controllers, apply middleware.
- **utils**: Generic helper functions (date formatting, string utils, etc.).
- **lib**: Wrappers for third-party services (Stripe, Anthropic, email providers).
- **config**: Load environment variables, provide typed config objects.
- **prisma**: Contains `schema.prisma` and migration scripts.

### Frontend (`src/frontend/src/`)

- **app**: Next.js App Router structure:
  - Each route folder (`layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`).
  - Route groups for structuring (`(auth)`, `(dashboard)`, etc.).
- **components**: Dumb/reusable components; accept props, no data fetching.
- **lib**: Data fetching utilities, API client wrappers (`api.ts`), formatters, constants.
- **hooks**: Custom hooks (`useAuth`, `useForm`, `useApi`).
- **context**: React providers (`AuthProvider`, `ThemeProvider`).
- **styles**: Global CSS (`globals.css`), theme variables.
- **types**: Shared TypeScript interfaces and types (`types.ts` or domain-specific files).
- **middleware**: Next.js middleware (`middleware.ts` for auth redirects, headers).

### Documentation (`knowledge_base/`)

- Follow existing subdivision: `api/`, `backend/`, `database/`, `development/`, `ui/`, `requirements/`.

### Scripts (`scripts/`)

- Database: `db:migrate.sh`, `db:seed.ts`.
- Dev: `dev:start`, `build`, `lint`, `test`.
- Test: (placeholder for test scripts)

---

## Import Conventions

### Absolute Imports (Recommended)

Configure `tsconfig.json` `baseUrl` and `paths` to enable clean imports:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@backend/*": ["./src/backend/src/*"],
      "@frontend/*": ["./src/frontend/src/*"],
      "@lib/*": ["./src/frontend/src/lib/*"],
      "@components/*": ["./src/frontend/src/components/*"],
      "@hooks/*": ["./src/frontend/src/hooks/*"],
      "@utils/*": ["./src/backend/src/utils/*"],
      "@services/*": ["./src/backend/src/services/*"]
    }
  }
}
```

**Examples**:

- Backend service import: `import { PropertyService } from '@services/property.service';`
- Frontend component import: `import { PropertyCard } from '@components/PropertyCard';`
- Frontend lib/util: `import { formatCurrency } from '@lib/utils';`
- Shared types (if any): `import type { User } from '@types';`

### Relative Imports (When Appropriate)

Use relative imports for files within the same directory or when cross-package coupling is undesirable.

- Within `src/backend/src/services/`: `./user.service`
- Within `src/frontend/src/components/`: `../layout/layout`

### Import Order (ESLint-friendly)

1. **Built-in Node modules** (`fs`, `path`).
2. **External libraries** (`express`, `mongoose`, `react`).
3. **Absolute aliases** (`@services/*`, `@components/*`).
4. **Relative paths** (`./utils`, `../types`).

Avoid barrel exports (`index.js` re-exports) to improve tree-shaking and clarity.

---

## Module Organization

### Backend Layers

1. **Controllers** – Thin layer; validate request, delegate to service.
2. **Services** – Business logic; transaction boundaries; encapsulate domain rules.
3. **Repositories (Optional)** – If complex queries, create repository functions inside services or separate `repositories/` folder.
4. **Middleware** – Cross-cutting concerns (auth, logging, error handling).
5. **Routes** – Wire HTTP methods to controllers; attach middleware.
6. **Utils/Lib** – Stateless helpers, third-party wrappers.

### Frontend Architecture

- **App Router** handles routing, layouts, loading, error boundaries.
- **Components**: Presentational; receive data via props or hooks.
- **Hooks**: Encapsulate data fetching, state logic, side effects.
- **Lib**: Pure utilities, API clients, formatters.
- **Context**: Global state (auth, theme, language).
- **Types**: Shared interfaces; avoid duplication.
- **Styles**: Tailwind utilities; CSS modules for component-scoped styles.

### Code Splitting & Lazy Loading

- Use dynamic `import()` for heavy libraries or route-based splitting (Next.js does this automatically per route).
- Avoid large vendor bundles; use `next/script` strategies for third-party scripts.

### State Management

- Prefer React Query/SWR for server state (caching, background updates).
- Use React Context or Zustand/Jotai for lightweight client state (UI toggles, modals).
- Avoid prop drilling; lift state only when necessary.

### Testing Placement

- **Unit tests**: alongside the file (`user.service.test.ts`) or in `__tests__/` folder.
- **Integration tests**: under `tests/integration/`.
- **E2E tests**: under `tests/e2e/` (Cypress).

### Configuration & Environment

- Keep `.env` files out of version control; provide `.env.example`.
- Use configuration loader (e.g., `config`) that validates schema (zod, Joi).
- Separate runtime config (feature flags) from build-time env variables (`NEXT_PUBLIC_*`).

--- 

*End of Project Structure Document*