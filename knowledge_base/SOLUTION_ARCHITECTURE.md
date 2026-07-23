# Solution Architecture
## Property Website MVP

### System Overview
The Property Website MVP is a three‑tier web application that enables public property browsing, AI‑assisted natural‑language property search, and minimal administrative property management. The system follows a classic presentation–application–data separation:

- **Presentation Layer**: Next.js/React frontend with Tailwind CSS, server‑rendered for SEO and fast first paint.
- **Application Layer**: Node.js/Express REST API implementing the contracts defined in `API_CONTRACT.md`.
- **Data Layer**: PostgreSQL database accessed via Prisma ORM, schema defined in `SCHEMA.md`.
- **External Services**: Anthropic Claude API for the chatbot, OpenStreetMap tiles (via Leaflet.js) for map visualisation.
- **Cross‑cutting Concerns**: Authentication via session cookies, role‑based access control (admin flag), input validation/sanitization, rate limiting, and secret management through environment variables.

The MVP scope is limited to the functional requirements enumerated in `PRD.md` and deliberately excludes out‑of‑scope items such as lead management, recommendation engines, notifications, and bulk uploads (see `PRD.md` §4 and `ROADMAP.md` parking lot).

### Architecture Diagram
```
+-------------------+       +---------------------+       +---------------------+
|   Web Browser     | <-->  |   API Gateway (DNS/ | <-->  |   External Services |
|   (SPA/SSR)       |       |   Load Balancer)    |       |  - Anthropic Claude |
|                   |       +---------------------+       |  - OpenStreetMap    |
|   - Next.js App   |               |                     |    Tiles            |
|   - Pages:        |               |                     |                     |
|     * /           |               |                     |                     |
|     * /search     |               |                     |                     |
|     * /property/[id] |            |                     |                     |
|     * /admin/...  |               |                     |                     |
|   - Components    |               |                     |                     |
|   - Tailwind CSS  |               |                     |                     |
+-------------------+               v                     +---------------------+
                                        +-------------------+
                                        |   API Server      |
                                        |   (Node.js/Express)|
                                        |                   |
                                        |  - Controllers    |
                                        |  - Services       |
                                        |  - Middleware     |
                                        |    * auth (session)|
                                        |    * validation   |
                                        |    * rate‑limit   |
                                        |  - Error handling |
                                        +-------------------+
                                                   |
                                                   v
                                           +-------------------+
                                           |   Database        |
                                           |   (PostgreSQL)    |
                                           |   via Prisma ORM  |
                                           |  - Users          |
                                           |  - Properties     |
                                           |  - ChatMessages   |
                                           +-------------------+
```

### Components
| Layer | Component | Responsibility |
|-------|-----------|----------------|
| **Presentation** | Next.js Application (`pages/`, `components/`) | Server‑side rendered UI, client‑side interactivity, consumption of REST APIs, chat widget UI, map view (Leaflet.js + OSM tiles). |
| | Tailwind CSS | Styling system driven by design tokens from `design_reference/propvista_crm/DESIGN.md`. |
| **Application** | Express.js Server | HTTP routing, middleware pipeline (body parsing, session handling, validation, rate limiting). |
| | API Controllers | Implement endpoints per `API_CONTRACT.md`: properties, auth, chat, admin properties. |
| | Service Layer | Business logic: property query building, authentication workflows, chatbot prompt construction & Anthropic API invocation, admin CRUD operations. |
| | Middleware | Authentication (session → `req.user`), authorization (`isAdmin` guard), input validation/sanitization, error handling, rate‑limit handling. |
| | Utilities | Password hashing (bcrypt/argon2), email validation, helper functions. |
| **Data** | PostgreSQL | Persistent storage for users, properties, chat messages. |
| | Prisma ORM | Type‑safe data access layer; migrations defined in `prisma/schema.prisma` (mirrored in `SCHEMA.md`). |
| **External** | Anthropic Claude API | LLM provider for natural‑language property Q&A (endpoint `/api/chat/message`). |
| | OpenStreetMap Tile Servers | Raster map tiles consumed via Leaflet.js for the map view (`/search` map toggle). |
| | (Optional) Nominatim / Geocoding Service | If async geocoding is implemented on property save/lookup to populate latitude/longitude. |
| **Cross‑cutting** | Session Store | In‑memory or Redis‑backed store for session IDs (express‑session). |
| | Configuration | Environment variables (`DATABASE_URL`, `ANTHROPIC_API_KEY`, `SESSION_SECRET`, etc.) captured in `.env.example`. |
| | Logging & Error Handling | Centralised error formatter matching `{ error: { code, message } }`; optional winston/pino for dev logs. |
| | Monitoring (future) | Placeholder for health‑check endpoint; not required for MVP (NFR §8). |

### Data Flow
#### 1. Property Browse & Search (Public)
1. User visits `/` or `/search`.
2. Next.js page performs SSR: calls `GET /api/properties` with query params (page, pageSize, filters, sort).
3. Express route validates params, calls Property Service.
4. Service builds Prisma `where` clause (status = published, price range, type, bedrooms, location text match), `orderBy`, pagination.
5. Query executed against PostgreSQL via Prisma; results returned.
6. API wraps results in `{ results, page, pageSize, total }` per contract.
7. Next.js renders property grid/map view; map view uses leaflet to request OSM tiles; pins placed for records with non‑null latitude/longitude.
8. User interaction (filter/sort/page change) triggers new API request (client‑side navigation or router push).

#### 2. Property Detail
1. User navigates to `/property/[id]`.
2. Next.js page calls `GET /api/properties/:id` during SSR.
3. Express validates ID, calls Property Service to fetch record (status must be published for public).
4. Service returns full property record (photos array, description, etc.) or 404 if not found/unpublished.
5. Page renders gallery, specs, amenities, location, map pin (if coordinates present).

#### 3. User Authentication
- **Registration**: `POST /api/auth/register` → validates email/password, hashes password (bcrypt), creates User record, creates session, sets cookie, returns `{ id, email }`.
- **Login**: `POST /api/auth/login` → validates credentials, verifies password hash, creates session, sets cookie, returns `{ id, email, isAdmin }`.
- **Logout**: `POST /api/auth/logout` → destroys session, clears cookie.

#### 4. Admin Property Management
All admin routes guarded by `ensureAdmin` middleware (checks `req.user?.isAdmin`).
- **Create**: `POST /admin/properties` → validates payload, creates Property record (status default draft), returns created object.
- **Read**: `GET /admin/properties` (list with optional status filter) / `GET /admin/properties/:id`.
- **Update**: `PATCH /admin/properties/:id` → merges changes, updates record.
- **Delete/Unpublish**: `DELETE` removes record; or `PATCH` with `status: draft` to hide from public list while retaining in admin view.

#### 5. AI Chatbot Interaction
1. User types message in chat widget; frontend maintains local message array (or relies on server‑side session storage – implementation choice per API_CONTRACT §68).
2. On submit, frontend `POST /api/chat/message` with `{ messages: [{role:'user', content:'...'}] }`.
3. Express validates payload, optional rate‑limit check per session/IP.
4. Chat Service:
   - If server‑side history: retrieves prior messages from session; appends new user message.
   - Constructs prompt: includes system instruction, conversation history, and instruction to ground answer in property data.
   - Calls Anthropic Claude API (`messages.create`) with model specified (e.g., `claude-3-5-sonnet-20240620`).
   - On success, extracts `reply` and optionally extracts referenced property IDs from answer (via simple regex or NER) to populate `propertiesReferenced`.
   - Returns `{ reply, propertiesReferenced }`.
   - On Anthropic error/timeout: returns `503` with `{ error: { code: 'ai_unavailable', message: '...' } }`.
5. Frontend displays assistant message; if `propertiesReferenced` non‑empty, renders property cards inline.
6. If 503 received, fallback UI shows message suggesting use of search filters (FR3.4).
7. Rate limit: after threshold, subsequent calls return `429` with `Retry-After` header.

### Integrations
| External System | Purpose | Integration Points |
|-----------------|---------|--------------------|
| Anthropic Claude API | Natural‑language property Q&A | POST `/api/chat/message` → Service layer → `anthropic.messages.create` |
| OpenStreetMap (OSM) Tiles | Map visualisation for property locations | Frontend Leaflet.js tile layer (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`) |
| (Optional) Nominatim / Geocoding | Convert address text → lat/lng for new/edited properties | Backend service (e.g., node‑geocoder) called on property create/update if lat/lng not provided |
| Email Provider (none in MVP) | — | Not required; no email verification/password reset |
| Storage for Photos (placeholder URLs) | Property photo URLs stored as strings | Frontend renders `<Image src={url}>`; actual hosting/CDN out of scope for MVP (placeholder/imagesrv) |

### Security Architecture
- **Authentication**: Session‑based cookie (`express‑session` with signed cookie). Session ID stored server‑side (memory/Redis). No bearer tokens.
- **Authorization**: 
  - Middleware `ensureAuth` populates `req.user` from session.
  - Middleware `ensureAdmin` checks `req.user?.isAdmin === true`; otherwise returns 403 (or redirects to login for UI).
- **Data Protection**:
  - Passwords hashed using bcrypt (cost 12) or argon2; never logged or stored in plaintext.
  - PII limited to email and password; no phone, address, or payment data collected.
  - Chat logs store only `sessionId`, `role` (`user`/`assistant`), `content`; no personal identifiers.
- **Input Validation & Sanitization**:
  - All request bodies validated via Joi/Zod or custom schema (type, length, format, enum).
  - Sanitization to prevent SQL injection (mitigated by Prisma parameterized queries) and XSS (output encoding in React, sanitizing any HTML if ever rendered).
- **Secrets Management**: All sensitive values (DB connection string, Anthropic API key, session secret) sourced exclusively from environment variables; `.env.example` committed, actual `.env` ignored via `.gitignore`.
- **Rate Limiting**: 
  - `express-rate-limit` applied per IP (`windowMs`, `max`) for `/api/chat/message` and auth endpoints (`/api/auth/*`).
  - Configurable via env vars (`CHAT_RATE_LIMIT_WINDOW_MS`, `CHAT_RATE_LIMIT_MAX`, `AUTH_RATE_LIMIT_*`).
  - Responses include `Retry-After` header.
- **Transport Security**: Assumes TLS termination at reverse proxy / load balancer; enforces HTTPS in production via environment config.
- **Headers & CSP**: Baseline security headers (helmet) applied: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `strict‑transport‑security` (if HTTPS), `content‑security‑policy` restricting inline scripts and limiting sources.
- **Audit & Logging**: Errors logged with winston/pino (level error); no PII logged. Access logs may be retained for debugging but not subject to long‑term retention (NFR §6).

### Deployment Architecture
- **Development**: Docker Compose (per NFR §8) with three services: `frontend` (Next.js dev server), `api` (Node/Express), `db` (PostgreSQL). Volumes for source code; environment file for secrets.
- **Staging / Production** (future): 
  - **Container Orchestration**: Deploy Docker images to Kubernetes or similar (EKS, GKE, AKS) or PaaS (Vercel for Next.js, Render/Fly.io for Node, managed Postgres).
  - **Load Balancing**: External L7 LB (ALB, Ingress) terminating TLS, distributing traffic to API replicas.
  - **Stateless API**: Horizontal scaling of API pods behind LB; session store migrated to Redis for shared session state.
  - **Database**: Managed PostgreSQL (AWS RDS, Google Cloud SQL, Azure Database for PostgreSQL) with read replica for scaling read‑heavy workloads; backups and point‑in‑time restore configured.
  - **Object Storage (optional)**: If actual photo hosting needed, integrate with S3‑compatible service; store URLs in `photos` array.
  - **CDN**: Static assets served via CDN (CloudFront, Cloudflare) for edge caching of JS/CSS/images.
  - **Observability**: Basic health‑check endpoints (`/health`), Prometheus metrics, and log aggregation (optional, not required for MVP per NFR §8).
  - **CI/CD**: GitHub Actions workflow: on PR → install, lint, type‑check, test, Prisma migrate:deploy (to test ephemeral DB). On merge to `main` → build Docker images, push to registry, deploy to staging/prod via automated pipeline.

### Technology Decisions & Rationale
| Decision | Chosen Technology | Justification (from docs) |
|----------|-------------------|--------------------------|
| **Frontend Framework** | Next.js (React) with Server‑Side Rendering | Provides SSR for SEO & fast first paint (NFR §1, PRD FR1.1‑FR1.6); pages align with UI_REFERENCE routes. |
| **Styling** | Tailwind CSS | Utility‑first approach matches design token mapping in UI_REFERENCE §24‑36; design tokens sourced from `design_reference/propvista_crm/DESIGN.md`. |
| **Backend Language / Framework** | Node.js + Express.js | Explicitly called out in NFR §7 and API_CONTRACT; mature ecosystem, easy middleware for auth/validation. |
| **ORM / Data Access** | Prisma | Single source of truth for schema (NFR §7, 00_AI_CHARTER §103‑104); type‑safe, migration‑based. |
| **Database** | PostgreSQL | Chosen for relational model, ACID compliance, nativeArray support for `amenities`/`photos` (SCHEMA §§56‑63). |
| **Authentication** | Session‑based cookies (express‑session) | Specified in API_CONTRACT §9‑10; avoids JWT storage issues; aligns with NFR §3. |
| **Password Hashing** | bcrypt / argon2 | Explicitly mandated in NFR §3 and 00_AI_CHARTER §25‑26. |
| **AI Provider** | Anthropic Claude API | Direct integration per ROADMAP.md Phase 0 open decision #1 and CLAUDE.md §4 (Anthropic direct). |
| **Map Provider** | OpenStreetMap tiles + Leaflet.js | Per PRD FR1.6, ROADMAP.md Phase 0 decision #2, API_CONTRACT §1 note on lat/lng. |
| **State Management (Chat)** | Client‑side message array or server‑side session storage | Left as implementation detail per API_CONTRACT §68; both satisfy FR3.3 (session‑scoped). |
| **Rate Limiting** | express‑rate‑limit (IP/session based) | Required by NFR §4 and FR3.6 to control Anthropic costs and abuse. |
| **Validation Library** | Joi / Zod / custom | Ensures input validation & sanitization per NFR §3, API_CONTRACT §9. |
| **Logging** | winston / pino (optional) | For error diagnostics; not mandated but recommended. |
| **Testing** | Vitest (unit/API), Playwright (E2E) | Aligns with TESTING_STRATEGY_AND_DOD §1.1 and GITHUB_WORKFLOW §6. |
| **CI / CD** | GitHub Actions | Referenced in GITHUB_WORKFLOW §6 and 00_AI_CHARTER §129. |
| **Containerisation** | Docker & Docker‑Compose | Required for local development per NFR §8 and ROADMAP.md Phase 0 gate (`.env.example`). |
| **Infrastructure as Code (future)** | Terraform / Pulumi (optional) | Not mandated for MVP but can be adopted post‑MVP. |

### Scalability Strategy
- **Stateless Application Layer**: The API server stores no session state in memory (session store externalised to Redis), enabling horizontal scaling behind a load balancer.
- **Read‑Scaling for Database**: 
  - Primary PostgreSQL instance handles writes.
  - Read replicas can be added for the high‑traffic `GET /api/properties` endpoint (property browse/search).
  - Connection pooling via Prisma (`connectionLimit`).
- **Caching Layer (Optional/Future)**: 
  - HTTP caching headers (`Cache‑Control`, `ETag`) for static assets and API responses where appropriate (e.g., property lists with short TTL).
  - Potential Redis‑based cache for frequent property‑list queries or chatbot responses to reduce load on DB and Anthropic API.
- **Asset Delivery**: 
  - Static assets (JS, CSS, images) served via CDN (CloudFront, Cloudflare) with edge caching to reduce origin load and improve global latency.
  - Image optimisation via Next.js `Image` component (automatic resizing, lazy‑loading, modern formats).
- **Database Scaling**: 
  - Vertical scaling (upgrade instance size) sufficient for MVP load (hundreds‑to‑low‑thousands of rows, modest concurrent users).
  - If growth warrants, consider partitioning by `status` or read‑replica strategy; sharding not anticipated for MVP.
- **Third‑Party API Rate Limits**: 
  - Anthropic usage capped by client‑side rate limiter (per session/IP) and configurable server limits; mitigates cost spikes and ensures fair usage.
- **Deployment Pipeline**: 
  - Blue/Green or rolling updates via Kubernetes Deployments or equivalent; zero‑downtime rollouts.
  - Database migrations run as init‑container or Helm hook; backward‑compatible changes only.
- **Observability (post‑MVP)**: 
  - Healthcheck endpoint (`/status`) returning DB connectivity and service uptime.
  - Centralised log aggregation (ELK, Loki) and Prometheus metrics for latency, error rates, request volume.

*This architecture satisfies all functional and non‑functional requirements documented in PRD.md, ROADMAP.md, NFR.md, API_CONTRACT.md, SCHEMA.md, UI_REFERENCE.md, TESTING_STRATEGY_AND_DOD.md, GITHUB_WORKFLOW.md, and design_reference/propvista_crm/DESIGN.md while providing a clear path for future growth beyond the MVP scope.*