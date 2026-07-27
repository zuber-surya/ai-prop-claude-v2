# Test Plan

This document outlines the testing strategy for the Property Vista CRM MVP, covering unit, integration, end-to-end (E2E), UI, API tests, acceptance criteria, and specific tools like Playwright and Claude Chrome extension testing.

---

## 1. Unit Tests

**Purpose**: Validate individual functions, components, and utilities in isolation.

**Scope**:
- Backend: Services, controllers, middleware, utility functions.
- Frontend: React components (pure presentational components), hooks, utility functions, context reducers.
- Shared: TypeScript types, constants, formatters.

**Tools & Frameworks**:
- Backend: Jest, Ts-jest, Supertest (for route handlers).
- Frontend: Jest, React Testing Library (RTL).
- Mocking: Jest mocks, MSW (Mock Service Worker) for API calls in frontend tests.

**Coverage Goals**:
- Aim for >80% line coverage on critical paths (auth, property CRUD, booking flow).
- Test both success and error cases.
- Use factories/fixtures for test data (e.g., `@test-data/user`, `@test-data/property`).

**Best Practices**:
- Arrange-Act-Assert (AAA) pattern.
- Avoid testing implementation details; focus on behavior.
- Keep tests fast and deterministic; mock external services (Stripe, Anthropic API).
- Run unit tests on every commit via pre‑push hook or CI.

**Example Structure**:
```
/tests
  /unit
    /backend
      services/__tests__/property.service.test.ts
      controllers/__tests__/property.controller.test.ts
    /frontend
      components/__tests__/PropertyCard.test.tsx
      hooks/__tests__/useAuth.test.ts
```

---

## 2. Integration Tests

**Purpose**: Test interactions between multiple units (e.g., service + database, API route + middleware, frontend component + hooks + API).

**Scope**:
- Backend: API endpoints with real database (test instance), service layer with Prisma, authentication flows.
- Frontend: Component integration with context providers, API client wrappers, end‑to‑end API mocking with MSW.
- Database: Migration scripts, seed data, transaction rollbacks.

**Tools & Frameworks**:
- Backend: Jest, Supertest, test PostgreSQL (in‑memory or Docker) PostgreSQL database.
- Frontend: Jest + RTL with MSW for API mocking; optionally Cypress for component‑level integration.
- Database: Prisma Migrate for test schema, seeds.

**Coverage Goals**:
- Test happy paths and error propagation across layers.
- Validate database constraints, transactions, and rollback behavior.
- Test API request/response serialization, validation, and error formatting.
- Test authentication middleware (token validation, role guards).

**Best Practices**:
- Use dedicated test database; reset schema before each test suite.
- Use transactions and rollbacks to isolate tests.
- Avoid hitting real external services; use mocks or test doubles.
- Run integration tests in CI on pull requests.

**Example Structure**:
```
/tests
  /integration
    /backend
      api/__tests__/properties.routes.test.ts
      services/__tests__/booking.service.integration.test.ts
    /frontend
      __tests__/App.integration.test.tsx   // with MSW
```

---

## 3. End‑to‑End (E2E) Tests

**Purpose**: Validate complete user flows from UI to database, simulating real user interactions.

**Scope**:
- Critical user journeys: registration → login → property search → inquiry → favorite.
- Admin flows: login → property creation → publish → view on frontend.
- Booking flow: schedule visit → confirmation → completion.
- Payment flow (if applicable): premium purchase → success/failure.
- Notification flow: trigger → real‑time update → UI reflection.

**Tools & Frameworks**:
- Playwright (primary) for cross‑browser E2E testing.
- Alternative: Cypress (if team prefers). We'll standardize on Playwright.
- Test data: seeded via API before each test or via CLI scripts.
- Environment: isolated test environment (staging‑like) with seeded data.

**Coverage Goals**:
- Cover all primary user roles (visitor, customer, agent, admin).
- Test responsive breakpoints (mobile, tablet, desktop).
- Validate accessibility basics (keyboard navigation, ARIA labels) where feasible.
- Test error handling (network failures, invalid inputs, expired sessions).
- Validate real‑time features (WebSocket/SSE for notifications, chat).

**Best Practices**:
- Use page objects or fixtures for reusable actions.
- Authenticate via API calls (not UI login) to speed up tests where possible.
- Clear test data before/after each test (database truncate or seed).
- Record videos/screenshots on failure for debugging.
- Run E2E tests in CI on nightly basis or pre‑release due to longer execution time.

**Example Structure**:
```
/tests
  /e2e
    tests/
      login.spec.ts
      property-search.spec.ts
      create-property.spec.ts
      booking-flow.spec.ts
    pages/
      LoginPage.ts
      PropertyDetailPage.ts
    utils/
      test-data.ts
```

---

## 4. UI Tests

**Purpose**: Validate visual regression, layout, and component styling.

**Scope**:
- Component libraries: buttons, cards, modals, forms.
- Page layouts: homepage, property detail, dashboard.
- Themes: light/dark mode (if implemented).
- Responsiveness: breakpoints and fluid behavior.

**Tools & Frameworks**:
- Playwright visual comparison (using `expect(page).toHaveScreenshot()`) or dedicated tools like Percy, Chromatic.
- Jest + React Testing Library for snapshot testing (optional).
- Storybook for component isolation and visual testing (if adopted).

**Coverage Goals**:
- Capture baseline screenshots for key components and pages.
- Detect CSS changes that affect layout or appearance.
- Validate dark mode toggles and color contrast.
- Ensure UI elements meet minimum touch target sizes (≥48dp).

**Best Practices**:
- Store screenshots in version control (or use external service like Percy).
- Use consistent viewport sizes and device emulators.
- ignore dynamic content (timestamps, animations) in visual diffs.
- Run UI tests on every PR for component changes; nightly for full regression.

**Example Structure**:
```
/tests
  /ui
    snapshots/
      homepage.mobile.png
      property-detail.dark.png
    visual.test.ts   // Playwright script that captures and compares
```

---

## 5. API Tests

**Purpose**: Validate API contract, status codes, payload schemas, and error responses independently of UI.

**Scope**:
- All endpoints defined in `API_SPECIFICATION.md`.
- Authentication endpoints (register, login, refresh, etc.).
- Resource endpoints (properties, bookings, payments, etc.).
- Webhook endpoints (Stripe, etc.).
- Rate limiting and validation.

**Tools & Frameworks**:
- Supertest (backend) or custom scripts with `fetch`/`axios`.
- Schema validation: Ajv, Zod, or Joi to validate responses against OpenAPI‑like schemas.
- Load testing (optional): k6 or artillery for performance baselines.

**Coverage Goals**:
- Validate each endpoint returns correct HTTP status for success and error cases.
- Validate response JSON matches.
- Test authentication requirements (401/403).
- Test input validation (400).
- Test idempotency keys where applicable.
- Test pagination, filtering, sorting.

**Best Practices**:
- Treat API tests as contract tests; break if API spec changes without test update.
- Run in CI on every commit.
- Use environment variables to switch between mock/server.

**Example Structure**:
```
/tests
  /api
    __tests__/
      auth.routes.test.ts
      properties.routes.test.ts
      bookings.routes.test.ts
    schemas/
      property.schema.json
      auth.response.schema.json
```

---

## 6. Acceptance Criteria

**Purpose**: Define business‑ready conditions that must be met for a feature to be considered complete.

**Source**: Derived from user stories, PRD, and UI/UX specs.

**Format**:
- Given/When/Then (Gherkin) for clarity.
- Linked to test cases (E2E or API) that verify the criterion.

**Examples**:
- **User Story**: As a visitor, I want to search for properties using natural language so that I can find relevant listings quickly.
  - Acceptance Criteria:
    1. Given I am on the homepage, when I enter "3 bedroom house under $500k" into the AI search bar, then I see matching properties ranked by relevance.
    2. Given the AI service is unavailable, when I perform a search, then the system falls back to filter‑based search and shows a banner indicating fallback mode.
    3. Given I submit an invalid search (empty string), then I receive an inline validation error.

- **User Story**: As an agent, I want to schedule a property visit so that I can show the property to a customer.
  - Acceptance Criteria:
    1. Given I am logged in as an agent, when I navigate to a property detail and click "Schedule tour", then I see a modal with date/time picker.
    2. Given I select a future date and time and confirm, then a booking is created with status "requested" and I receive a confirmation toast.
    3. Given I attempt to schedule a visit in the past, then I see an error "Date must be in the future".

**Tracking**:
- Maintain a traceability matrix (e.g., in `TEST_TRACABILITY.md` or within test descriptions) linking each acceptance criterion to test case IDs.
- Review acceptance criteria with product owner before development.
- Mark criteria as passed when all related tests succeed.

---

## 7. Playwright Testing

**Tool Choice**: Playwright for robust, cross‑browser E2E and visual testing.

**Setup**:
- Install `@playwright/test`.
- Configure `playwright.config.ts`:
  - Test directory: `tests/e2e`.
  - Use three browsers: Chromium, Firefox, WebKit (or just Chromium for speed).
  - Headless mode in CI; headed for debugging.
  - Artifacts: screenshots, videos, traces on failure.
  - Base URL: set to test environment (e.g., `http://localhost:3000`).
- Add npm scripts:
  - `test:e2e`: `playwright test`
  - `test:e2e:debug`: `playwright test --debug`
  - `test:e2e:show-report`: `playwright show-report`

**Best Practices**:
- Use `test.use()` for shared options (viewport, storage state).
- Reuse authentication state: save session after login, reuse across tests to avoid repeated login steps.
- Locators: prefer `getByRole`, `getByLabel`, `getByTestId`; avoid brittle selectors.
- Network: mock or intercept external calls (Stripe, Anthropic) where needed; use `route.fulfill()`.
- Assertions: use `expect` with built‑in matchers (`toBeVisible`, `toHaveText`).
- Fixtures: create custom fixtures for seeded data, API clients.
- Run in CI: upload artifacts as build artifacts for review.

**Example Test**:
```ts
import { test, expect } from '@playwright/test';

test('user can search for properties', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Search for homes…').fill('3 bedroom home in New York');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByText('Results for')).toBeVisible();
  await expect(page.locator('.property-card').first()).toBeVisible();
});
```

---

## 8. Claude Chrome Extension Testing

**Purpose**: Validate the Claude Chrome extension (if part of the project) that provides AI‑powered assistance within the CRM (e.g., sidebar chat, property suggestions).

**Scope**:
- Extension installation and activation.
- Communication between extension and CRM (message passing).
- AI responses within the extension UI.
- Handling of user inputs, property data context, and actions (e.g., "schedule visit").
- Permissions and storage (chrome.storage).

**Tools & Frameworks**:
- Playwright can test Chrome extensions via `chromium` launch with `--disable-extensions-except=<path>` and `--load-extension=<path>`.
- Alternatively, use `web-ext` (for Firefox) or manual testing.
- Unit/test background scripts with Jest or Mocha.
- End‑to‑end: simulate user journey with extension panel open.

**Coverage Goals**:
- Test that the extension loads correctly on CRM domains.
- Test that the extension can read necessary DOM properties (if allowed) or receives data via `postMessage`.
- Test AI requests: ensure extension sends user queries to the backend (or directly to Anthropic if proxy) and displays responses.
- Test that extension actions (e.g., "Save property") trigger appropriate CRM updates.
- Test error handling: offline, API limits, invalid responses.
- Test persistence: settings saved across sessions.

**Best Practices**:
- Use a dedicated test extension to house under 5000k" then I see properties priced below 5000k.

**Example Structure**:
```
/tests
  /extension
    /unit
      background.test.ts
      content-script.test.ts
    /e2e
      extension.spec.ts   // Playwright with extension loaded
    manifest.json   // copy of extension manifest for versioning
```

---

## 9. Test Screenshots

**Purpose**: Capture visual evidence for test failures, documentation, and regression detection.

**When to Capture**:
- On E2E test failure: automatic screenshot and video via Playwright.
- On UI visual regression tests: baseline and diff images.
- On manual exploratory testing: ad‑hoc screenshots for bug reports.
- On API tests: rarely, unless debugging UI‑related payloads.

**Storage & Management**:
- Screenshots from Playwright saved to `test-results/` folder (configurable).
- For visual regression, keep baseline images in `/tests/ui/snapshots/` and commit them.
- Use CI to upload screenshots as artifacts (GitHub Actions, etc.).
- Name screenshots descriptively: `<test-name>_<timestamp>.png`.
- Retain screenshots for a limited period (e.g., 30 days) unless tied to a bug ticket.

**Best Practices**:
- Avoid capturing sensitive data (PII, tokens); mask or avoid fields if needed.
- Use consistent dimensions and device scale factor.
- For dynamic content (charts, timestamps), either mock or exclude from comparison.
- Review screenshots in PRs for intentional UI changes.

---

## 10. Test Execution & CI Integration

**Local Development**:
- `npm test`: runs unit tests.
- `npm run test:integration`: runs integration tests.
- `npm run test:e2e`: runs Playwright tests.
- `npm run test:ui`: runs UI visual tests (if separate).
- `npm run test:extension`: runs extension tests.
- `npm run test:all`: runs everything (may be long; use selectively).

**Continuous Integration (GitHub Actions)**:
- On every push to `main` and PR:
  - Unit + integration tests (fast).
  - Lint and type check.
  - Build (frontend/backend).
- On nightly or pre‑release:
  - Full E2E test suite (with browsers).
  - UI visual regression tests.
  - Extension tests.
  - Deploy to staging and run smoke tests.
- Artifacts:
  - Test reports (JUnit, HTML).
  - Coverage reports (`coverage/`).
  - Playwright traces, screenshots, videos on failure.
- Failure gates: block merge if any critical test fails (unit, integration, lint).
- Allow E2E failures to be investigated but not block if flaky (retry mechanism).

**Performance & Flakiness**:
- Mark flaky tests with `@flaky` and investigate root cause.
- Use test retries (e.g., Playwright `retries: 2`).
- Keep test data isolated to prevent bleed‑through.
- Monitor test execution time; aim for <15 minutes for full suite on CI.

---
*End of Test Plan Document*