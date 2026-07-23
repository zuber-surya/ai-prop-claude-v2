# Product Requirements Document (PRD)
## Property Website MVP

### Product Modules
1. **Property Browsing & Search (Public)**
   - Property listing, filtering, sorting, detail view, map view
2. **User Authentication**
   - User registration, login, logout (session‑based)
3. **AI Chatbot (Q&A / Search only)**
   - Natural‑language property queries, session‑based chat history, graceful AI fallback
4. **Admin Property Management**
   - Admin‑only CRUD operations on property listings (create, edit, delete, publish/unpublish)

### Features
| Module | Feature ID | Description |
|--------|------------|-------------|
| Property Browsing & Search | FR1.1 | Visitors can view a paginated/scrollable list of published properties. |
|  | FR1.2 | Visitors can filter by price range, property type, bedrooms, and location (text match). |
|  | FR1.3 | Visitors can sort by price (asc/desc) or date added. |
|  | FR1.4 | Each property has a detail page showing photos, description, price, specs (bedrooms/bathrooms/area), amenities, and location. |
|  | FR1.5 | Empty search results show a clear "no matches" state with a suggestion to broaden filters. |
|  | FR1.6 | Visitors can toggle to a map view on `/search` showing published properties as pins (OpenStreetMap + Leaflet.js). Clicking a pin shows a summary card linking to the property detail page. |
| User Authentication | FR2.1 | Visitor can register with email + password. |
|  | FR2.2 | Visitor can log in / log out. |
|  | FR2.3 | No email verification, password reset, or social login required for MVP. |
|  | FR2.4 | No public‑facing feature is gated behind login in this MVP (login exists as groundwork). |
| AI Chatbot | FR3.1 | Chat widget available on the public site, accessible with or without login. |
|  | FR3.2 | Chatbot answers natural‑language questions about listings by querying property data. |
|  | FR3.3 | Chatbot maintains a short back‑and‑forth within a single browser session; history need not persist across sessions or devices. |
|  | FR3.4 | On AI provider failure/timeout, widget shows a clear fallback message (e.g., "I'm having trouble right now — try the search filters above"). |
|  | FR3.5 | Chatbot never collects contact information, never creates records other than chat logs, never initiates contact with visitor. |
|  | FR3.6 | Chat requests are rate‑limited per session/IP to control cost and abuse. |
| Admin Property Management | FR4.1 | Admin can log in and reach `/admin`, gated by `isAdmin`. |
|  | FR4.2 | Admin can create a new property listing (photos, description, price, specs, amenities, location, status). |
|  | FR4.3 | Admin can edit an existing listing. |
|  | FR4.4 | Admin can delete or unpublish a listing (unpublished listings don't appear on the public site). |
|  | FR4.5 | Listings have exactly two statuses: `draft` and `published`. No approval workflow. |
|  | FR4.6 | Non‑admin user attempting `/admin/*` is redirected/blocked (403 or redirect to login). |

### User Stories
| Role | User Story | Acceptance Criteria (summary) |
|------|------------|------------------------------|
| Visitor | As a visitor, I can browse a paginated list of published properties so I can see what’s available. | List loads with pagination controls; each item shows thumbnail, title, price, type, beds/baths. |
| Visitor | As a visitor, I can filter properties by price range, type, bedrooms, and location so I can narrow results to my needs. | Filter controls update list in real time; only matching published properties shown. |
| Visitor | As a visitor, I can sort properties by price (low‑high, high‑low) or date added (newest first) so I can prioritize results. | Sort dropdown changes order; API receives sort param and returns correct ordering. |
| Visitor | As a visitor, I can view a property’s detail page with photos, description, price, specs, amenities, and location so I can evaluate the listing. | Detail page loads for given ID; all fields from FR1.4 displayed correctly; 404 if unpublished or non‑existent. |
| Visitor | As a visitor, I see a clear “no matches” message with suggestion to broaden filters when my search yields no results so I know how to adjust. | Empty state shows message and CTA to adjust filters. |
| Visitor | As a visitor, I can toggle to a map view on `/search` to see property pins and click a pin to see a summary linking to the detail page so I can explore geographically. | Map loads OSM tiles; pins for geocoded properties; click shows card with link to `/property/[id]`. |
| Visitor | As a visitor, I can register with email and password so I can create an account (groundwork for future features). | Registration endpoint returns 201 with user id and email; sets session cookie; duplicate email returns 409. |
| Visitor | As a visitor, I can log in with email/password and log out so I can authenticate (groundwork for future features). | Login returns 200 with user data and `isAdmin` flag; logout clears session cookie; invalid creds return 401. |
| Visitor | As a visitor, I can ask the AI chatbot a natural‑language question about listings and receive a relevant answer referencing specific properties so I get AI‑assisted search. | Chat endpoint returns `reply` and optional `propertiesReferenced`; answer addresses query; references match listings. |
| Visitor | As a visitor, if the AI service fails, I see a fallback message suggesting I use search filters so I’m not left hanging. | On AI timeout/error, endpoint returns 503 with `ai_unavailable` code; frontend shows fallback UI. |
| Visitor | As a visitor, I know the chatbot does not collect my contact info or create any records beyond chat logs so my privacy is protected. | No PII stored; chat logs only contain sessionId, role, content; no lead/CRM records created. |
| Visitor | As a visitor, my chat requests are rate‑limited per session/IP so the service remains available and costs controlled. | After threshold, further chat calls return 429 with Retry‑After header. |
| Admin | As an admin, I can log in and access `/admin` to manage property listings so I can maintain the catalog. | Login with `isAdmin=true` redirects to `/admin`; non‑admin gets 403/redirect. |
| Admin | As an admin, I can create a new property listing with all required fields so I can add inventory. | POST `/admin/properties` returns 201 with created record; fields persisted; appears in admin list. |
| Admin | As an admin, I can edit an existing listing so I can keep information up‑to‑date. | PATCH `/admin/properties/:id` returns 200 with updated record; changes reflected immediately. |
| Admin | As an admin, I can delete or unpublish a listing so I can remove it from public view. | DELETE returns 204; PATCH status to `draft` hides from public `/api/properties`; DELETE removes record entirely. |
| Admin | As an admin, I see only draft/published statuses; no other states exist so the workflow stays simple. | Property status field only accepts `draft` or `published`; UI reflects only these two options. |
| Visitor/Admin | As any user, I am protected by server‑side enforcement of admin routes so unauthorized access is blocked. | Non‑admin/authenticated request to admin routes returns 403; anonymous returns 401; no UI‑only bypass. |

### Screen Requirements
| Design Screen | Route | What to Keep (In‑Scope) | What to Strip (Out‑of‑Scope per PRD §4 / UI_REFERENCE §3) |
|---------------|-------|------------------------|-----------------------------------------------------------|
| `propvista_crm_homepage` | `/` | Hero, AI search bar, featured listings grid, “how it works” section, footer | Contact form block (lead capture), testimonials (optional) |
| `search_results_standard_view` | `/search` (AI‑ranked state) | Search bar, results grid with match % + reasons, pagination | None – maps cleanly to FR2.1‑FR2.3 |
| `search_results_filter_fallback_view` | `/search` (fallback state) | “AI temporarily unavailable, showing filter results” banner, results without match scores | None – maps to FR2.6/FR3.4 |
| `search_results_empty_state` | `/search` (no‑results state) | Empty‑state illustration, “no matches” messaging, refine‑search CTA | “Save this search” suggestion (no saved‑search feature) |
| `property_details_premium_view` | `/property/[id]` | Gallery, header (title/price/specs/favorite), description, amenities, floor plan, map, EMI/affordability calculator, similar properties | “Message Agent”, “Request Callback”, “Schedule Visit” CTAs and agent contact card – replace with single “Ask AI about this property” CTA opening chat widget |
| `property_inventory_admin_view` | `/admin/properties` | Property grid/list, status badges (map to `draft`/`published` only), sorting | Multi‑select bulk actions (publish/archive/delete in bulk) – single‑item actions only |
| `listing_editor_basic_info` | `/admin/properties/new` / `/admin/properties/[id]/edit` | Form fields: title, price, bedrooms/bathrooms, area, location, amenities | None structural – maps directly to FR4.2/FR4.3; wire to two‑status model |
| Chat widget | Floating icon on homepage (per reference) | Persistent bottom‑right chat widget styled with AI/secondary color | None – no dedicated chat UI screen; widget built from homepage reference |

### Workflows
1. **Visitor Browse & Search Flow**
   - User loads `/` or `/search`.
   - Sees paginated list of published properties (or map view if toggled).
   - Applies filters (price, type, bedrooms, location) → list updates via `GET /api/properties` with query params.
   - Sorts results via `sort` param.
   - Clicks a property card → navigates to `/property/[id]` → detail view shows all FR1.4 fields.
   - If no results, sees empty‑state with guidance to broaden filters.
   - Optionally toggles map view → sees OSM tiles with pins for geocoded properties; clicks pin → sees summary card linking to detail.

2. **Visitor Authentication Flow (Groundwork)**
   - User clicks “Register” → submits email/password → `POST /api/auth/register` → 201 + session cookie.
   - User logs in via `/api/auth/login` → 200 + session cookie with `isAdmin` flag.
   - User logs out via `/api/auth/logout` → session cleared.
   - Note: No public feature currently requires login; auth persists for future use.

3. **Visitor AI Chatbot Flow**
   - User opens chat widget (bottom‑right) on any public page.
   - Types a natural‑language question and sends.
   - Frontend POSTs `/api/chat/message` with `{ messages: [{role:"user", content:"..."}] }`.
   - On success (200): receives `{reply, propertiesReferenced}`; displays assistant message; if property IDs present, renders property cards inline.
   - On AI failure (503): shows fallback message suggesting use of search filters.
   - Conversation persists within session via cookie or client‑side message array (per implementation choice).
   - After rate‑limit threshold: receives 429 with `Retry‑After`; UI shows rate‑limit notice.

4. **Admin Property Management Flow**
   - Admin logs in (auth as above) → redirected to `/admin`.
   - Navigates to `/admin/properties` → sees list of all properties (draft + published) with status badges.
   - Clicks “New Property” → navigates to `/admin/properties/new` → fills form (title, price, bedrooms, bathrooms, area, location, amenities, photos, status) → submits → `POST /admin/properties` → 201 created → redirected to list; new property appears.
   - To edit: clicks edit icon on a row → navigates to `/admin/properties/[id]/edit` → form pre‑filled → updates → `PATCH /admin/properties/:id` → 200 → list updates.
   - To delete: clicks delete icon → confirm → `DELETE /admin/properties/:id` → 204 → row removed.
   - To unpublish: edits status to `draft` via PATCH → property disappears from public list immediately.
   - Non‑admin attempts to access any `/admin/*` path → receives 403 (if logged‑in) or 401 (if anonymous); redirected to login if appropriate.

### Permissions
| Role | Description | Permissions |
|------|-------------|-------------|
| **Visitor (Public)** | Any user accessing the site, logged‑in or not. | - Read access to public property endpoints (`GET /api/properties`, `GET /api/properties/:id`).<br>- Access to chat endpoint (`POST /api/chat/message`).<br>- Access to auth endpoints (`POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`).<br>- No access to any `/admin/*` routes. |
| **Authenticated User (Logged‑in non‑admin)** | User with valid session but `isAdmin = false`. | Same as Visitor **plus**:<br>- Ability to authenticate/logout (already covered).<br>- No additional public‑feature rights in MVP (login is groundwork only). |
| **Admin** | User with `isAdmin = true`. | All Visitor permissions **plus**:<br>- Full access to admin property endpoints: `GET /admin/properties`, `POST /admin/properties`, `GET /admin/properties/:id`, `PATCH /admin/properties/:id`, `DELETE /admin/properties/:id`.<br>- Access to `/admin` UI. |

### Validation Rules
- **Input Validation & Sanitization (NFR §3, API_CONTRACT)**
  - All form inputs (registration, login, property creation/edit, chat message) must be validated for type, length, and format.
  - Sanitize to prevent SQL injection (mitigated by Prisma parameterized queries) and XSS (output encoding).
  - Email: valid email format, max length per DB column.
  - Password: minimum length (e.g., 8 chars); stored as bcrypt/argon2 hash; never logged or stored plaintext.
  - Price: integer ≥ 0 (paise); stored as Int.
  - Bedrooms, bathrooms, area: integers ≥ 0.
  - Type, location, title, description: strings with sensible max lengths (e.g., title 200 chars).
  - Amenities & photos: arrays of strings; each item validated for length and URI format (photos).
  - Latitude/longitude: optional floats; if present, must be within valid geo ranges (−90 to 90, −180 to 180).
  - Status: limited to enum `draft` \| `published`.
  - Chat message: `role` ∈ {`user`, `assistant`}; `content` non‑empty string, max length (e.g., 2000).
  - SessionId: non‑empty string (UUID/cuid).
- **Business‑Rule Validations**
  - Property price stored as integer paise to avoid floating‑point errors (NFR §1, SCHEMA §102).
  - Latitude/longitude nullable to allow gradual geocoding (SCHEMA §104).
  - No foreign key between Property and User (ownership not tracked in MVP).
  - ChatMessage.userId optional to support anonymous chats.
  - Only two status values allowed; any other value rejected.
  - Admin routes enforce `isAdmin` server‑side (NFR §3, API_CONTRACT §10‑11).
  - Rate limits applied per session/IP for chat and auth endpoints (NFR §4, FR3.6).
  - Passwords hashed with bcrypt/argon2; never stored/plaintext (NFR §3).
  - All secrets (API keys, DB credentials) loaded exclusively from environment variables (NFR §3).
  - No PII beyond email and password collected (NFR §3, PRD FR3.5).
  - Chat logs retained only for session duration; no long‑term storage required (NFR §6).
  - Public property endpoints return only `status = published` (API_CONTRACT §1, FR1.1‑1.4).
  - Admin property endpoints return all records regardless of status (API_CONTRACT §4).
  - Error responses follow `{ error: { code: string, message: string } }` with appropriate HTTP status (API_CONTRACT §8‑9).
  - Successful responses follow defined JSON schemas (API_CONTRACT §§1‑4, 9‑11).

### Acceptance Criteria
(Combined from PRD §6 Success Criteria, TESTING_STRATEGY_AND_DOD.md §1.2, and Definition of Done)

#### Phase 0 – Planning (already complete)
- All foundational documents (PRD, ROADMAP, NFR, API_CONTRACT, SCHEMA, UI_REFERENCE, TESTING_STRATEGY_AND_DOD, GITHUB_WORKFLOW, REPORTING.md) exist and are reviewed.
- Open decisions resolved (LLM API, map provider, seed data, primary blue shade).

#### Phase 1 – Data Model + Auth
- **Registration**: Valid email/password → 201 + session cookie; duplicate email → 409.
- **Login**: Valid credentials → 200 with `{id, email, isAdmin}` + session; invalid → 401.
- **Logout**: Endpoint clears session cookie → 200.
- **isAdmin flag**: Correctly set/retrieved from user record.
- **DB**: Prisma schema matches SCHEMA.md; migrations run cleanly on fresh DB; seed script creates mix of draft/published properties with varied attributes.
- **Tests**: Unit & API‑integration tests cover reg/login/logout/happy‑path, duplicate email, wrong password, isAdmin flag.
- **DoD**: Code passes lint/typecheck; tests pass; manual check performed; ROADMAP checklist updated.

#### Phase 2 – Public Site
- **Property List**: `GET /api/properties` with pagination, filters (`q`, `minPrice`, `maxPrice`, `type`, `bedrooms`), sort (`price_asc`, `price_desc`, `date_desc`) returns correct subset of published properties; total count accurate.
- **Property Detail**: `GET /api/properties/:id` returns 200 for published property with all FR1.4 fields; returns 404 for unpublished or non‑existent ID.
- **Unpublished Filter**: Never appear in public list or detail endpoints.
- **Map View**: Frontend omits pins for null latitude/longitude; shows summary card on pin click linking to detail.
- **Empty Results**: Returns empty `results` array with `total: 0`; UI shows “no matches” state.
- **Tests**: API/integration tests cover filter/sort/pagination combos, found/not‑found detail cases.
- **DoD**: Same as above; plus UI manual check with screenshots saved per REPORTING.md.

#### Phase 3 – AI Chatbot
- **Normal Query**: POST `/api/chat/message` with valid message array → 200 response containing `reply` string and optional `propertiesReferenced` array; answer relevant to query.
- **Empty/No‑Match Query**: Handled gracefully; response may have empty `propertiesReferenced` or generic reply.
- **AI Failure Simulation**: Mock Anthropic call to throw/error → endpoint returns 503 with `{error: {code:"ai_unassigned", message:"…"}}`; frontend triggers fallback UI showing suggestion to use search filters.
- **Rate Limiting**: After configured threshold per session/IP, subsequent calls return 429 with `Retry‑After` header.
- **No Side Effects**: Verified that chat endpoint does NOT create lead, contact, CRM, or any user‑related records; only optional chat log row (if server‑side storage chosen) tied to sessionId.
- **Tests**: Unit/API tests cover normal query, empty‑match, simulated AI failure (503), rate‑limit (429).
- **DoD**: Same; plus manual check of chat widget UI and fallback screenshots.

#### Phase 4 – Admin CRUD
- **Create**: POST `/admin/properties` with valid payload → 201 Created record; appears in admin list and (if status=published) public list.
- **Edit**: PATCH `/admin/properties/:id` with partial updates → 200 Updated record; changes reflected immediately in admin and public (if published).
- **Delete**: DELETE `/admin/properties/:id` → 204; record removed from both admin and public lists.
- **Unpublish**: PATCH status to `draft` → 200; record disappears from public `/api/properties` list; remains in admin list.
- **Permissions**: Non‑admin gets 403; anonymous gets 401 on any admin endpoint.
- **Tests**: API/integration tests cover create/edit/delete/unpublish round‑trip, permission checks, immediate public visibility change.
- **DoD**: Same; plus manual check of admin UI screens and screenshots.

#### Phase 5 – Polish
- **End‑to‑End Smoke Test**: Single script that executes full PRD §6 success criteria:
  1. Visitor (no account) browses, filters, views property detail → success.
  2. Visitor asks chatbot natural‑language question → gets relevant answer with property references or graceful fallback on simulated AI failure.
  3. Admin creates listing → sees it appear on public site within same session.
  4. No out‑of‑scope features present in codebase.
- **Reports**: `/reports/phase-5-polish/REPORT.md` + screenshots exist per REPORTING.md.
- **Final DoD**: All previous phase criteria satisfied; release branch ready for merge.

### Additional Acceptance Notes
- **Documentation**: Any change to API, schema, or UI must be reflected in API_CONTRACT.md, SCHEMA.md, UI_REFERENCE.md, and design_reference/ code.html within same PR.
- **Security**: All secrets via environment variables; passwords hashed; input validation/sanitization applied; admin enforces server‑side `isAdmin` check.
- **Quality**: Lint, typecheck, and full test suite must pass before merge; no disabling of tests to achieve green CI.
- **Process**: One PR per task/subtask‑issue; PR links issue(s), states milestone, describes what was tested per TESTING_STRATEGY_AND_DOD §1.2, includes screenshot for UI changes, confirms DoD checklist.
- **Scope Discipline**: No features from PRD §4 or ROADMAP “parking lot” appear in code, even partially; any ambiguity flagged in PR description.

---
*Generated from all raw requirement documents (PRD.md, ROADMAP.md, NFR.md, API_CONTRACT.md, SCHEMA.md, UI_REFERENCE.md, TESTING_STRATEGY_AND_DOD.md, GITHUB_WORKFLOW.md, design_reference/propvista_crm/DESIGN.md) and the derived Business Requirements Document (requirements/BRD.md).*