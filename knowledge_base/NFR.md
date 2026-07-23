# Non-Functional Requirements (NFR)
## Property Website MVP

### Performance
- **Server‑Side Rendering**: All public pages (`/`, `/search`, `/property/[id]`) must be server‑rendered for fast first paint and SEO benefit (NFR §1, PRD FR1.1‑FR1.6).
- **Image Optimization**: Listing images must be optimized and served responsibly (e.g., Next.js `Image` component or equivalent) – no raw unoptimized full‑size images in list views (NFR §1).
- **Search Latency**: `/search` endpoint (`GET /api/properties` with filters) should return results in under ~1 second against seeded data sets (hundreds to low thousands of rows) – “feels instant” at MVP scale (NFR §1).
- **Chatbot Streaming**: If the Anthropic API supports streaming, chatbot responses should stream to show progressive output rather than a blank wait (NFR §1).
- **API Response Times**: Standard CRUD operations should complete within typical web‑app latency expectations (<2s for 95th percentile) under seeded load.

### Scalability
- **Horizontal Scaling (Not Required for MVP)**: Horizontal scaling / multi‑region hosting is explicitly out of scope for this MVP (NFR §8). The architecture is prepared for future scaling:
  - API layer (Node.js/Express) is stateless and can be placed behind a load balancer.
  - Database (PostgreSQL) may become a bottleneck; vertical scaling or read replicas can be considered post‑MVP.
- **Vertical Scaling**: The system should be able to handle expected MVP load (hundreds to low thousands of concurrent users, limited data volume) on a single vertical scale instance.
- **Stateless Design**: Authentication uses session cookies; chat state is client‑side or session‑scoped, enabling horizontal scaling of API nodes if needed later.
- **Caching** (Optional/Future): No mandatory caching strategy for MVP, but HTTP caching headers may be applied to static assets; future consideration for Redis‑based caching of frequent property lists or AI responses.

### Availability
- **Graceful Degradation**: If the AI provider is down or slow, the chatbot must show a clear fallback message (FR3.4) while the rest of the site (browse/search/detail pages) remains fully operational (NFR §2).
- **Error Handling**: Admin CRUD operation failures (e.g., image upload failures) must present a clear error message to the user, not a silent failure or blank screen (NFR §2).
- **Uptime SLA**: No specific uptime SLA is required for this pre‑launch/internal‑build MVP (NFR §2). The system is expected to be reliable for development and staging use.
- **Retry & Backoff**: Rate‑limited responses (429) include a `Retry-After` header to guide clients (API_CONTRACT §89).

### Reliability
- **Data Integrity**: Use of Prisma ORM provides type‑safe database access and helps prevent inconsistent states; migrations are version‑controlled.
- **Error Responses**: All API errors follow a standardized shape `{ error: { code: string, message: string } }` with appropriate HTTP status codes (API_CONTRACT §8‑9).
- **Input Validation & Sanitization**: All form inputs and chat payloads must be validated (type, length, format) and sanitized to prevent injection (SQL/XSS) – NFR §3, API_CONTRACT §9.
- **Password Security**: Passwords are hashed using bcrypt/argon2; never stored or logged in plain text (NFR §3).
- **Secret Management**: All secrets (API keys, DB credentials, etc.) must be supplied exclusively via environment variables; never committed to repository (NFR §3).
- **Rate Limiting**: Chat endpoint and auth endpoints are rate‑limited per session/IP to prevent abuse and protect against traffic spikes (NFR §4, FR3.6).

### Security
- **Authentication**: Session‑based cookie authentication (not bearer tokens); admin routes enforce `isAdmin` server‑side via middleware or route guard (NFR §3, API_CONTRACT §10‑11).
- **Authorization**: Anonymous/users without `isAdmin = true` receive 403 on any `/admin/*` endpoint; unauthenticated requests receive 401 (API_CONTRACT §10‑11).
- **Data Protection**:
  - No personally identifiable information (PII) beyond email and password is collected in this MVP (NFR §3, PRD FR3.5).
  - Chat logs do not contain contact information; they are limited to sessionId, role, content (PRD FR3.5).
- **Communication Security**: Although not explicitly mandated, TLS is assumed for production deployment; environment‑based configuration enables secure connections.
- **Dependency Vigilance**: While no formal vulnerability scanning is required for MVP, teams should keep dependencies updated and consider periodic audits post‑MVP.
- **Content Safety**: Since the chatbot only reads property data and never writes visitor‑specified data, risk of injection via user prompts is mitigated by prompt sanitization and use of parameterized queries.

### Audit
- **Audit Logging**: No 7‑year audit‑log‑style retention is required for this MVP (NFR §6). The system does not need to implement a comprehensive audit trail for administrative actions.
- **Change Tracking**: Basic create/update/timestamps (`createdAt`, `updatedAt`) are stored via Prisma defaults for entities (SCHEMA §§42,66,86), providing light‐weight change visibility.
- **Access Logging**: No specific access‑log retention or analysis is mandated; standard web server logs may be retained for debugging but are not subject to long‑term retention requirements.

### Logging
- **Error Logging**: Applications should log errors (e.g., failed API calls, validation errors, unexpected exceptions) to aid debugging; however, no formal log aggregation or retention policy is prescribed for MVP.
- **Audit/Activity Logs**: As noted above, comprehensive audit logs are out of scope; any logging implemented should avoid storing PII or sensitive credentials.
- **Log Level Guidance**: Use appropriate log levels (error, warn, info, debug) and avoid printing secrets or request bodies containing passwords/tokens.

### Accessibility
- **Baseline Accessibility**: While a formal accessibility audit (WCAG) is out of scope for MVP (NFR §8), the UI should follow basic accessibility best practices:
  - Semantic HTML elements (header, nav, main, section, button, etc.).
  - Alternative text (`alt`) for all meaningful images.
  - Sufficient color contrast – design system provides defined colors (primary `#003d9b`, secondary `#8E44AD`) that meet AA contrast when used as specified (see DESIGN.md).
  - Focus outlines visible for keyboard navigation.
  - ARIA labels where native semantics are insufficient (e.g., custom widgets, chat button).
- **Responsiveness**: Layouts follow a fluid grid based on an 8‑px base unit, ensuring usability across mobile, tablet, and desktop (DESIGN.md §141‑150).
- **Scalable Text**: Font sizes use relative units where appropriate; users can zoom without loss of content or functionality.

### Compliance
- **Data Minimization**: Only email and password are collected from users; no additional PII (phone, address, etc.) is gathered (NFR §3, PRD FR3.5).
- **Consent & Privacy**: As no personal data beyond credentials is stored, explicit consent mechanisms for data processing are not required for MVP. However, a privacy policy outlining data use (email/password for auth, optional chat logs for session) should be provided.
- **Regulatory Alignment**: The solution does not target specific regulated industries (e.g., healthcare, finance) and thus does not assert compliance with HIPAA, PCI‑DSS, etc. General principles of secure handling of credentials and minimal data retention align with GDPR‑like expectations for the data collected.
- **Copyright & Licensing**: Dependencies must comply with their licenses; open‑source assets (e.g., OpenStreetMap tiles) must be used per their attribution requirements (PRD FR1.6, API_CONTRACT §1 note on lat/lng).
- **Export Controls**: No encryption or controlled technology is included that would trigger export restrictions.

### Maintainability
- **Single Source of Truth**:
  - Database schema is defined in Prisma `schema.prisma` and mirrored in `SCHEMA.md` (NFR §7).
  - API contract is the source of truth for all endpoints; any change must be reflected in `API_CONTRACT.md` (NFR §7).
  - Design tokens (colors, typography, spacing, etc.) are sourced from `design_reference/propvista_crm/DESIGN.md` and translated into `tailwind.config.js` (UI_REFERENCE §24‑36).
- **Code Quality**:
  - Linting (ESLint) and type checking (TypeScript) must run in CI and pass before merge (NFR §7, GITHUB_WORKFLOW §6).
  - Full test suite (unit, API/integration, end‑to‑end) must pass before merge (TESTING_STRATEGY_AND_DOD §1.4, GITHUB_WORKFLOW §6).
- **Database Migrations**: Prisma migrations are version‑controlled; any schema change requires a new migration that runs cleanly on a fresh database (TESTING_STRATEGY_AND_DOD §2.3, GITHUB_WORKFLOW §6).
- **Documentation Drift**: All relevant documentation (PRD, ROADMAP, NFR, API_CONTRACT, SCHEMA, UI_REFERENCE, TESTING_STRATEGY, GITHUB_WORKFLOW, design_reference/) must be kept in sync; changes to code require corresponding doc updates in the same PR (00_AI_CHARTER.md §102‑115, TESTING_STRATEGY_AND_DOD §2.8).
- **Dependency Management**: Package managers (`npm`/`yarn`) lock files are committed; updates should be reviewed and tested.
- **Environment Configuration**: `.env.example` must be committed (ROADMAP.md Phase 0 gate) to illustrate required variables without exposing secrets.