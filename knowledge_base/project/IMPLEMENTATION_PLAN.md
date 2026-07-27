# Implementation Plan

This document breaks down the Property Vista CRM MVP development into incremental phases. Each phase has clear objectives, features, deliverables, and dependencies to enable steady progress and early value delivery.

---

## Phase 0: Foundation & Setup

**Objectives**
- Set up repository, CI/CD, development environments.
- Establish coding standards, tooling, and baseline architecture.
- Create initial database schema and authentication core.

**Features**
- Project initialization (monorepo structure).
- Basic server setup (Express/Next.js).
- Configure TypeScript, ESLint, Prettier, Husky.
- Initialize PostgreSQL database with core tables.
- Implement user registration, login, JWT auth.
- Basic error handling and logging middleware.

**Database Changes**
- Create table `users` (id, email, password_hash, name, role, is_verified, refresh_token_hash, created_at, updated_at, deleted_at).
- Add indexes: email unique, role index.
- Add `created_at`, `updated_at`, `deleted_at` columns.
- Add `refresh_token_hash` (or separate `refresh_tokens` table).
- Setup Prisma schema and initial migration.

**APIs**
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me` (protected)
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /auth/verify-email/:token`

**UI Screens**
- Login page (`/login`)
- Registration page (`/register`)
- Forgot password (`/forgot-password`)
- Reset password (`/reset-password/:token`)
- Email verification (`/verify-email/:token`)

**Components**
- Auth layout wrapper.
- Form components (text, password, email inputs).
- Button, link, toast notification (basic).
- Validation error display.

**Acceptance Criteria**
- User can register with valid email/password.
- Email verification sent and functional.
- User can log in and receive access/refresh tokens.
- Protected routes return 401 without token.
- Refresh token rotation works.
- Password reset flow operational.
- All auth endpoints return appropriate error codes (400, 401, 422).
- Unit tests for auth service and controllers.
- E2E smoke test for login/register flow.

**Dependencies**
- None (foundational).

**Deliverables**
- Initial commit with project structure.
- Working auth API and UI.
- Documentation updated (API spec, DB design, coding standards).
- CI pipeline running lint, unit tests on PR.

---
## Phase 1: Core Property Catalog & Search (Public)

**Objectives**
- Enable users to browse and search properties without authentication.
- Implement property listing, filtering, and basic AI-assisted search.
- Lay groundwork for property media and details.

**Features**
- Public property list with pagination, filters (price, beds, baths, location).
- Property detail page with gallery, basic info, agent contact.
- AI-powered natural language search bar (fallback to filter-based).
- Basic property media upload (single image per property for MVP).
- SEO-friendly routes and metadata.

**Database Changes**
- Create `properties` table (id, title, description, price, beds, baths, area, area_unit, property_type, year_built, street, city, state, postal_code, country, latitude, longitude, is_published, is_premium, premium_until, agent_id, created_at, updated_at, deleted_at).
- Create `property_media` table (id, property_id, url, caption, is_primary, sort_order, created_at, deleted_at).
- Add foreign keys: properties.agent_id → users.id.
- Indexes: is_published, city/state, price, created_at.
- Optional: GIST index on (latitude, longitude) for proximity search.
- Ensure constraints (price>0, area>0, beds>=0, baths>=0, year_built between 1800 and current year).

**APIs**
- `GET /properties` – list with query params (page, limit, priceMin, priceMax, beds, baths, city, state, propertyType, isPublished=true).
- `GET /properties/:id` – single property detail (unless isPublished=false and user not agent/admin).
- `GET /properties/:id/media` – list media for property.
- `POST /properties` (admin/agent only) – create property (multipart/form-data).
- `PATCH /properties/:id` – update property.
- `DELETE /properties/:id` – soft delete.
- `POST /properties/:id/publish` – toggle published flag.
- Search endpoint: `GET /search?q=&source=ai|fallback&limit=&offset=` (returns properties with score/explanation if AI).
- Suggestion endpoint: `GET /search/suggest?q=`.

**UI Screens**
- Homepage (`/`): hero search bar, featured properties, CTA.
- Properties listing page (`/properties`): filter sidebar, results grid.
- Property detail page (`/properties/:id`): gallery, info tabs, agent card, inquiry CTA.
- Search results page (`/search` or `/results`): same as listing but with AI badge/explanation.
- Property media upload modal (admin/agent).
- Not found pages (404).

**Components**
- PropertyCard (thumbnail, price, beds/baths, favorite button).
- PropertyGallery (carousel/slider).
- SearchBar (with AI placeholder, debounce).
- FilterAccordion/Panel (price sliders, dropdowns).
- PropertyDetailTabs (overview, details, map, amenities).
- AgentContactCard.
- InfinityScroll or Pagination controls.
- SEO Meta component.

**Acceptance Criteria**
- Unauthenticated users can view published properties list and details.
- Filtering works correctly (combined range filters, text search).
- AI search returns ranked results with explainability icons; fallback works when AI service unavailable.
- Property detail shows all required fields, media gallery, and agent info.
- Pagination or infinite scroll loads additional pages without duplication.
- Metadata tags (title, description) set per page for SEO.
- Responsive layout: grid → list on mobile.
- Unit tests for property service and controller.
- API contract tests for search and property endpoints.
- E2E test: search → filter → open detail → verify data.
- Performance: page loads < 2s on 3G simulated.

**Dependencies**
- Phase 0 (authentication middleware for protected routes).
- Media upload infrastructure (local storage or S3 stub).

**Deliverables**
- Functional property catalog with search.
- Updated API spec and DB design docs.
- UI screens implemented per specs.
- Test coverage ≥80% for new backend endpoints.
- Storybook entries for core components (optional).
- Demo data seed script.

---
## Phase 2: User Roles, Profiles & Basic Interactions

**Objectives**
- Implement role-based access control (RBAC) for agents, admins, customers.
- Enable user profile management.
- Allow favoriting properties and basic inquiries.

**Features**
- Role detection from JWT (visitor, customer, agent, admin).
- Protected routes by role (e.g., /admin, agent-only actions).
- User profile page (view/edit).
- Favorites/toggle (persisted).
- Property inquiry form (creates a lead).
- Basic lead management (list for agents/admins).
- Notification placeholder (to be expanded later).

**Database Changes**
- Ensure `users.role` CHECK constraint includes roles: visitor, customer, agent, admin.
- Create `favorites` table (id, user_id, property_id, created_at, deleted_at) with unique constraint on (user_id, property_id).
- Create `leads` table (id, name, phone, email, message, property_id, source, status, created_at, updated_at, deleted_at). Optionally link to user via user_id if authenticated.
- Indexes: favorites(user_id, property_id), leads.property_id, leads.status.
- Add foreign keys where appropriate (favorites.user_id → users.id, favorites.property_id → properties.id, leads.property_id → properties.id).

**APIs**
- `GET /users/me` – profile.
- `PUT /users/me` – update profile (name, etc.).
- `POST /favorites` – add favorite (body: {propertyId}).
- `DELETE /favorites/:propertyId` – remove favorite.
- `GET /favorites` – list user's favorites (with property details).
- `POST /leads` – create inquiry (requires propertyId, name, phone, email, message, source).
- `GET /leads` (agent/admin) – list leads with filters.
- `GET /leads/:id` – lead detail.
- `PATCH /leads/:id` – update status/notes.
- `DELETE /leads/:id` – delete lead (if allowed).
- `GET /agents/:id` – public agent profile (name, contact).

**UI Screens**
- Profile page (`/profile`): edit name, etc.
- Favorites page (`/favorites`): grid of favorited properties.
- Inquiry modal (reused on property detail, search card, homepage CTA).
- Leads index (`/leads` or `/agent/leads`): table with status, property, customer.
- Lead detail page (`/leads/:id`): conversation history, actions.
- Agent profile page (`/agents/:id`): bio, listings.

**Components**
- Avatar, badge (role/status).
- Form sections (profile edit).
- Favorite button (heart icon toggle).
- InquiryForm modal (reuse from Phase 1).
- LeadCard, LeadTable.
- Status badge component.
- Empty state components.

**Acceptance Criteria**
- Role-based middleware blocks unauthorized access (e.g., customer cannot access /admin).
- Users can update their profile; changes reflected.
- Toggling favorite persists and shows correct UI state.
- Inquiry form creates a lead with correct association to property.
- Agents/admins can view list of leads, filter by status, see details.
- Lead status can be updated (new → contacted → etc.).
- Unauthenticated users can submit inquiry (lead created without user_id).
- Validation on all forms (required fields, email/phone format).
- Unit tests for user, favorite, lead services.
- API tests for all new endpoints.
- E2E test: register as agent → favorite a property → send inquiry → view lead in agent dashboard.

**Dependencies**
- Phase 1 (property catalog).
- Auth system (role claims in JWT).

**Deliverables**
- RBAC middleware and role protection.
- Profile and favorites CRUD.
- Lead/inquiry system.
- Updated docs (API spec, DB design).
- Test suites.

---
## Phase 3: Booking & Appointment Management

**Objectives**
- Enable scheduling property viewings (bookings).
- Implement agent calendar and availability checking.
- Provide booking confirmation and notifications.

**Features**
- Booking request from property detail or lead.
- Agent-side booking management (approve, reschedule, cancel, mark completed/no-show).
- Calendar view (basic) for agents to see upcoming bookings.
- Conflict detection (prevent overlapping bookings for same agent).
- Booking status lifecycle: requested → confirmed → completed → cancelled/no_show.
- Email/SMS triggers (placeholder) for booking events.
- Integration with lead: booking can be created from a lead.

**Database Changes**
- Create `bookings` table (id, property_id, agent_id, customer_id, start_time, end_time, status, notes, created_at, updated_at, deleted_at).
- Indexes: agent_id, property_id, customer_id, status, start_time/end_time.
- Consider exclusion constraint (PostgreSQL) for overlapping bookings per agent, or handle in service layer.
- Foreign keys to properties, users (agent_id), users (customer_id).
- Ensure start_time < end_time check via constraint or validation.

**APIs**
- `POST /bookings` – create booking request (requires propertyId, agentId, customerId (or user from JWT), startTime, endTime, notes).
- `GET /bookings` – list with filters (for agent/admin: by agentId, date range, status; for customer: their bookings).
- `GET /bookings/:id` – booking detail.
- `PATCH /bookings/:id` – update (e.g., reschedule, notes).
- `POST /bookings/:id/confirm` – agent confirms.
- `POST /bookings/:id/complete` – mark as completed.
- `POST /bookings/:id/cancel` – cancel (by either party or admin).
- `GET /agents/:id/availability?date=YYYY-MM-DD` – return busy slots (optional).

**UI Screens**
- Booking modal (triggered from property detail "Schedule tour" or lead "Schedule visit").
- Agent booking calendar page (`/agent/bookings` or `/calendar`): week/day view with slots.
- Booking detail page (agent/customer view).
- Upcoming bookings widget on dashboard.
- Booking history page.

**Components**
- DateTimePicker.
- CalendarGrid / TimeSlot component.
- BookingCard (with status badge).
- Confirmation modals.
- Loading/skeleton states.

**Acceptance Criteria**
- Customer can request a booking for a published property; agent receives notification.
- Agent can view, confirm, reschedule, cancel, or mark booking as completed.
- System prevents double‑booking for same agent (within a buffer, e.g., 15 minutes) via validation.
- Booking status transitions enforced (cannot skip from requested to completed without confirmation).
- Timestamps stored in UTC; displayed in user's timezone.
- Related data populated (property info, agent/customer names).
- Unit tests for booking service (conflict detection, state transitions).
- API tests for booking CRUD and workflow endpoints.
- E2E test: customer books → agent confirms → customer sees confirmed status → agent marks complete.
- Calendar view loads within reasonable time (<1s for a month).

**Dependencies**
- Phase 2 (users, leads, auth).
- Property data (for booking context).
- Notification system stub (to be fleshed in later phase).

**Deliverables**
- Booking entity and API.
- Calendar UI (basic).
- Workflow endpoints with role guards.
- Integration with property and user data.
- Tests covering happy and error paths.

---
## Phase 4: Payments & Premium Listings

**Objectives**
- Enable monetary transactions for premium features (highlighted listings, booking deposits).
- Integrate with a payment gateway (Stripe) for secure processing.
- Store payment records and update related entities on success.

**Features**
- Payment intent creation for amount/currency.
- Frontend payment form (card details via Stripe Elements or redirect to Checkout).
- Webhook endpoint to handle payment success/failure/events.
- Mark property as `is_premium` with expiry timestamp upon successful payment.
- Optional: deposit for bookings (hold amount).
- Invoice/receipt generation (simple PDF or email).
- Refund handling (admin-triggered).
- Payment history view for users.

**Database Changes**
- Create `payments` table (id, payment_intent_id (unique), amount, currency, status, payment_method_type, metadata_json, receipt_url, failure_code, failure_message, user_id (nullable), created_at, updated_at, deleted_at).
- Indexes: payment_intent_id unique, status, user_id, created_at.
- Ensure `is_premium`, `premium_until` columns exist on `properties` table (added in Phase 1).
- Store associative IDs in `metadata_json` (e.g., {type:'property_premium', id:'uuid'} or {type:'booking_deposit', id:'uuid'}).  

**APIs**
- `POST /payment-intent` – create intent (body: {amount, currency, metadata?}).
- `POST /payment/confirm` – confirm with client-side token (returns success).
- `GET /payments/:id` – transaction details.
- `POST /webhook/stripe` – verify signature and dispatch events.
- `GET /users/me/payments` – payment history.
- `POST /properties/:id/toggle-premium` (agent/admin) – after payment success, set premium_until.
- `GET /properties?premium=true` – filter for premium listings.

**UI Screens**
- Payment modal (amount, card fields, submit).
- Payment success/failure screen.
- Premium badge on property card/list.
- Agent dashboard: upgrade to premium button.
- Payment history page (`/payments`).
- Invoice view/download (simple HTML).

**Components**
- StripeElements wrapper (cardNumber, expiry, CVC, postalCode).
- PaymentForm (with loading, error states).
- BadgePremium.
- DatePicker for premium duration.
- ReceiptDisplay.

**Acceptance Criteria**
- Payments are created via secure Stripe integration; no raw card data touches our servers.
- Successful payment updates property.is_premium and sets premium_until (now + duration).
- Failed payments do not alter property status and return appropriate error.
- Webhook verifies signature and updates payment status reliably.
- Idempotency keys prevent duplicate charges.
- Refunds (if implemented) revert premium flag or return funds.
- Users can view payment history with status and amounts.
- Test with Stripe test keys in development; ensure no real charges.
- Unit tests for payment service (creating intents, handling webhooks).
- API tests using Stripe test mode or mocks.
- E2E test (using test card numbers): upgrade property to premium → verify badge appears → after expiry, premium removed (manual time tweak or mock time).

**Dependencies**
- Phase 1 (property model with premium fields).
- Auth (user_id for payment association).
- Basic backend services (for updating property).

**Deliverables**
- Payment integration with Stripe (or PayPal).
- Premium listing functionality.
- Webhook handler.
- Payment history UI.
- Full test suite (unit, API, simulated E2E).
- Documentation updates (API spec, security notes).

---
## Phase 5: Notifications & Real‑Time Updates

**Objectives**
- Implement a notification system for real‑time updates (new lead, booking confirmation, etc.).
- Provide UI indicator (bell icon) with unread count.
- Support both in‑app (WebSocket/SSE) and email/SMS fallbacks.

**Features**
- Notification table: recipient_id, type, title, message, related_entity_id/type, is_read, timestamps.
- Real‑time delivery via WebSocket (Socket.io) or Server‑Sent Events (SSE).
- Notification center page and dropdown (bell icon) with unread badge.
- Ability to mark as read/delete, view related entity.
- Email/SMS notifications for critical events (optional, via providers).
- Administration view for monitoring notifications.

**Database Changes**
- Create `notifications` table (id, recipient_id, type, title, message, related_entity_id, related_entity_type, is_read, created_at, deleted_at).
- Indexes: recipient_id, is_read, created_at.
- Foreign key: recipient_id → users.id.
- (Optional) indexes on related_entity_id/type for efficient joins.

**APIs**
- `GET /notifications` – list with filters (?unread=true, limit, offset).
- `PATCH /notifications/:id` – set read=true/false (or separate endpoints /read, /unread).
- `DELETE /notifications/:id` – delete single.
- `POST /notifications/read-all` – mark all as read.
- `DELETE /notifications/all` – delete all (if allowed).
- `GET /notifications/unread-count` – lightweight endpoint for badge.
- WebSocket endpoint: `/ws/notifications` (or SSE: `/api/notifications/stream`).

**UI Screens**
- Notification center page (`/notifications`): list with filter, bulk actions.
- Notification dropdown (from header): shows recent items, uncount, view all.
- Toast/snackbar for real‑time toast notifications (optional).
- Settings page to configure email/SMS preferences (optional).

**Components**
- NotificationItem (icon, title, time, read indicator, actions).
- NotificationList with infinite scroll or pagination.
- Badge for unread count (header button).
- ToastContainer.
- Modal for delete confirmation.
- Settings toggle switches.

**Acceptance Criteria**
- When a relevant event occurs (new lead assigned, booking confirmed, payment succeeded, etc.), a notification is created and sent to the appropriate user(s).
- Unread badge updates in real‑time via WebSocket/SSE.
- Clicking a notification marks it as read and optionally navigates to the related entity.
- Users can mark all as read, delete notifications.
- Notification payload includes sufficient data to link to entity (type and ID).
- Email/SMS fallback sends messages for critical events (configurable).
- Unit tests for notification service and controller.
- API tests for notification CRUD.
- E2E test: create a lead as visitor → agent assigned → notification appears in agent’s bell → click → navigate to lead detail.
- Real‑time connection recovers after temporary network loss.

**Dependencies**
- Earlier phases (users, leads, bookings, payments) for event sources.
- Auth system to identify recipient.
- WebSocket library (Socket.io) or native SSE support.

**Deliverables**
- Notification entity and API.
- Real‑time connection (WebSocket/SSE).
- UI notification center and bell dropdown.
- Integration with event triggers (via service layer).
- Tests covering creation, delivery, UI updates.

---
## Phase 6: Admin Dashboard & Management

**Objectives**
- Provide administrators with overview and management capabilities for users, properties, leads, bookings, payments, and system settings.
- Enable monitoring of key performance indicators (KPIs) and activity.

**Features**
- Admin dashboard (`/admin`) with KPI cards (total leads today, conversion rate, active listings, revenue).
- Activity feed (recent logins, property publishes, role changes).
- Charts: lead sources pie, leads over time, property views.
- Management tabs: Users, Properties, Leads, Bookings, Payments, AI Settings, System Settings.
- CRUD operations for users (except self), properties (bulk publish/unpublish/delete), leads, bookings.
- Ability to toggle advertiser/premium flags, reset passwords, assign roles.
- AI configuration page (model, temperature, tokens, system prompt, usage quotas).
- System settings (maintenance mode, contact info, etc.).
- Export reports (CSV/XML) for selected data.

**Database Changes**
- No new tables required; reuse existing tables.
- May add summary/cache tables for reporting if needed (optional).
- Indexes on frequently filtered columns: properties.is_published, properties.is_premium, users.role, bookings.status, payments.status.

**APIs**
- `GET /admin/dashboard/summary` – KPI metrics.
- `GET /admin/logs/recent` – activity feed items.
- `GET /charts/lead-sources` – data for pie chart.
- `GET /charts/leads-over-time` – time‑series data.
- `GET /charts/property-views` – property popularity data.
- `GET /admin/users` – paginated list with filters (role, search).
- `GET /admin/properties` – list of all properties (incl. draft/unpublished) with filters.
- `GET /admin/leads` – list of all leads (including protected data) with filters.
- `GET /admin/bookings` – list of all bookings with filters.
- `GET /admin/payments` – list of all payments with filters.
- `GET /settings/ai` – current AI configuration.
- `PUT /settings/ai` – update AI configuration.
- `POST /settings/ai/test` – send test prompt to AI and return response.
- `GET /settings/system` – system settings.
- `PUT /settings/system` – update system settings.
- `POST /admin/properties/bulk` – bulk update (publish/unpublish/delete) based on selected IDs.
- `DELETE /admin/users/:id` – delete user (soft) (admin only).
- `PATCH /admin/users/:id/role` – change role (admin only).
- `GET /admin/users/:id` – user detail (excluding password hash).
- `POST /admin/reports/export` – request export with format and filters (returns job ID or file).
- `GET /admin/reports/job/:id/status` – check export progress.

**UI Screens**
- Admin dashboard page (`/admin` or `/dashboard/admin`): KPI row, activity feed, charts, quick links.
- Users management page: table with role, status, actions (edit, reset password, delete).
- Properties management page: table/list with status, price, agent, actions (edit, publish, delete).
- Leads management page: table with status, property, customer, actions (view, assign, delete).
- Bookings management page: table with status, property, agent, customer, time, actions (confirm, complete, cancel).
- Payments management page: table with status, amount, user, actions (view, refund).
- AI settings page: form with model selector, temperature slider, max tokens input, prompt textarea, quota fields, save/test buttons.
- System settings page: site name, contact email, maintenance toggle, etc.
- Export modal: format selection, date range filters, submit.

**Components**
- KPICard (value, label, trend icon, tooltip).
- ChartWrapper (recharts or similar) for pie, line, bar.
- DataTable with sorting, filtering, pagination, row actions.
- ModalForm for edit/create.
- ButtonToolbar with bulk actions.
- Dropdown filters (date range, status, search).
- Loading/skeleton placeholders.
- Confirmation dialog.
- FileUpload for bulk import (optional).
- Chip/status badges.
- Accordion/Collapsible sections.
- Toast notifications.

**Acceptance Criteria**
- Admin can view KPIs that update periodically (or on refresh).
- Admin can search/filter users, properties, leads, bookings, payments.
- Admin can perform CRUD operations on each entity with proper authorization.
- Role changes require admin confirmation and are logged.
- Property bulk actions work on selected items and show success/error counts.
- AI settings can be saved and affect subsequent chat requests.
- System settings can be toggled (e.g., maintenance mode displays banner to non‑admins).
- Export functionality generates file (CSV/Excel) with selected data and downloads it.
- Accessibility: keyboard navigable, ARIA labels, sufficient contrast.
- Unit tests for admin services and controllers.
- API tests for admin endpoints (role checks).
- E2E test: admin login → view dashboard → create a property → verify it appears in public listing → bulk publish → verify KPI updates.

**Dependencies**
- All previous phases (users, properties, bookings, payments, notifications, AI chatbot).
- Charting library (recharts, victory, or similar).
- Export library (e.g., csv-stringify, xlsx) for report generation.

**Deliverables**
- Admin UI with dashboard and management sections.
- Role‑based middleware protecting admin routes.
- API endpoints for admin operations.
- Export and reporting features.
- Tests covering admin flows.
- Documentation updates.

---
## Phase 7: AI Chatbot & Advanced Search

**Objectives**
- Deliver a fully‑featured AI chatbot for natural‑language property search and assistance.
- Enhance search with advanced filtering, sorting, and saved searches.
- Provide conversational UI that can trigger actions (schedule viewing, save property, etc.).

**Features**
- Persistent chat widget (bottom‑right) and/or dedicated chat page.
- Message streaming (SSE or WebSocket) for real‑time bot responses.
- Bot understands intents: property search, property details, schedule viewing, save favorite, get agent contact, general help.
- Context‑aware conversation: remembers recent properties shown, user preferences.
- Ability to show property cards within chat with action buttons (View, Save, Schedule).
- Fallback to filter‑based search when AI service unavailable or over quota.
- Input validation, rate limiting, and usage tracking per user.
- Admin dashboard for AI usage metrics (tokens, requests, cost).
- Saved searches: users can save a query and re‑run or get alerts for new matches.
- Search sorting options: price (low/high), date (new/old), relevance (AI score).
- Saved favorites accessible from chat ("Show my saved properties").

**Database Changes**
- Create `search_logs` table (if not already) for analytics (id, query_text, parsed_filters, results_count, source, ip_address, user_agent, created_at).
- Create `saved_searches` table (id, user_id, name, query_text, parsed_filters, created_at, updated_at, deleted_at).
- Add optional column `last_searched_at` to users (or derive from search_logs).
- Ensure proper indexes: search_logs(created_at), source, user_id; saved_searches(user_id).

**APIs**
- `POST /chat/message` – send user message, receive assistant reply (streaming optional).
- `GET /chat/messages?stream=true` – SSE endpoint for streaming response (alternative: use POST with Accept: text/event-stream).
- `GET /search/saved` – list user's saved searches.
- `POST /search/saved` – create saved search (body: {name, query}).
- `DELETE /saved-searches/:id` – delete saved search.
- `GET /search/suggest?q=` – autosuggest (enhanced with saved queries?).
- `POST /search` – advanced search with filters, sort, page, limit (non‑AI).
- GET /search/` (as before) – AI search with explanation.
- `GET /usage/ai` – admin endpoint for AI usage stats (requests, tokens, estimated cost).
- `POST /usage/ai/reset` – reset counters (admin).

**UI Screens**
- Chat widget (collapsible panel) with input area, message list, send button.
- Chat page (`/chat`) – full‑screen variant.
- Message bubbles: user and bot (with avatars, timestamps).
- Bot message may contain: text, property cards (with mini‑actions), suggestions chips.
- Input box with placeholder, voice input button (optional).
- Saved searches modal/list.
- Search filters sidebar (price, beds, baths, property type, location, sort).
- Search results page with sorting dropdown and saved‑search shortcut.
- Admin AI usage dashboard (charts, tables).

**Components**
- MessageBubble (with props for sender, content type).
- ActionButton (icon+text) inside bot message for quick actions.
- SuggestionChip (clickable to insert text into input).
- PropertyCardSmall (compact version for chat).
- Carousel of property cards (if multiple results).
- Timer/typing indicator.
- Scrollable message container with auto‑scroll to bottom.
- InputBox with resize, send on Enter, cog for settings.
- Modal for saved search creation.
- FilterPanel (reusable from Phase 1).
- SortDropdown.
- EmptyState for no results.
- UsageChart (line/bar for token consumption).
- MetricCard (value, label).

**Acceptance Criteria**
- User can open chat widget and type natural language queries like "Show me 3‑bedroom homes under $400k in Brooklyn".
- Assistant replies with a list of property cards that match the criteria, each including a short explanation why it matches (e.g., "3 bedrooms, price $380k").
- Follow‑up questions keep context: after seeing results, user says "add a garage" → filters updated accordingly.
- User can click "View" on a property card in chat to navigate to its detail page.
- User can click "Save" to add to favorites; confirmation appears.
- User can click "Schedule" to open booking modal with property pre‑filled.
- If AI service returns error or is unavailable, system shows a friendly message and suggests using filter search.
- Rate limiting: after N requests per minute, user receives "Please slow down" message.
- Usage tracking: admin can see total tokens used today, requests count, estimated cost.
- Saved searches appear under "My searches" and can be re‑run with one click.
- Search results can be sorted by price low/high, date new/old, relevance.
- Accessibility: keyboard navigable, ARIA labels on chat input/button, message roles.
- Unit tests for chat service (prompt building, tool invocation, context handling).
- API tests for chat endpoint with mocked AI.
- E2E test: open chat → ask for 2‑bed under $300k → receive list → click view on first → navigate to correct property detail → verify details match query.
- Performance: first response < 2s (excluding actual LLM latency) under normal load.
- Fallback test: disable AI microservice → query returns filter‑based results with banner.

**Dependencies**
- Prior phases (property data, auth, UI components).
- External Anthropic API (or compatible LLM) access.
- Real‑time connection for streaming (WS or SSE).
- Storage for conversation history (optional for MVP; can use in‑memory or client‑side localStorage, but better to store server‑side for continuity across devices).

**Deliverables**
- Chatbot UI widget and/or dedicated page.
- Backend service orchestrating LLM calls, tool use, and conversation history.
- Streaming response implementation.
- Prompt management and fallback logic.
- Usage tracking and admin oversight.
- Saved search functionality.
- Enhanced search with sorting and filtering.
- Tests (unit, API, E2E).
- Documentation updates (AI_CONTEXT.md, API spec).

---
## Phase 8: Polish, Performance, and Release Preparation

**Objectives**
- Finalize UI/UX refinements, accessibility, SEO, and performance optimizations.
- Conduct thorough testing, bug fixing, and prepare for production release.
- Ensure compliance with defined non‑functional requirements (NFRs).

**Features**
- Accessibility audit (WCAG 2.1 AA) and fixes (focus traps, ARIA labels, color contrast).
- SEO improvements: meta tags, open graph, structured data, sitemap.xml, robots.txt.
- Performance: lazy load images, code splitting, bundle analysis, caching headers.
- Error boundaries and graceful degradation (offline fallback, stale‑while‑revalidate).
- Internationalization (i18n) foundation (placeholder for future).
- Enhanced form validation (real‑time, debounced).
- Animation and motion preferences (respect `prefers-reduced-motion`).
- Dark mode toggle (if decided).
- Comprehensive test suite: unit >90%, integration >80%, E2E critical paths.
- Security audit: dependency updates, penetration test (basic), OWASP checklist.
- Documentation: finalize all guides, onboard new developers.
- Release candidate build and staging deployment.

**Database Changes**
- Likely none unless new indexes discovered from slow‑query review.
- Add any missing indexes for reporting or frequent queries.
- Consider partitioning large tables (logs, notifications) if needed for scale.

**APIs**
- Review all endpoints for idempotency, proper status codes, and consistent error shapes.
- Add rate limiting headers (Retry‑Where applicable).
- Ensure PUT/PATCH semantics are correct.
- Add API versioning in URL (`/api/v1/...`).

**UI Screens**
- All screens from previous passes, refined.
- Custom 404/500 pages with branding.
- Maintenance mode banner.
- Cookie consent placeholder (for GDPR/CCPA).

**Components**
- Accessible modal trap.
- Skip‑to‑content link.
- Language selector (stub).
- Theme toggle (light/dark).
- ErrorBoundary wrapper.
- SEOHead component (dynamic title, meta).
- ToastContainer with pause on hover.
- FocusManager for modals.
- SkipLinks component at top of body.

**Acceptance Criteria**
- All WCAG 2.1 AA automated checks pass (using axe or similar).
- Lighthouse score >90 for performance, accessibility, best practices, SEO on mobile and desktop.
- Bundle size < 150 KB gzip for JS (initial load).
- First Contentful Paint < 1.5s on 3G.
- Time to Interactive < 3s on 3G.
- No critical security vulnerabilities in dependencies (npm audit).
- All unit and integration tests pass; E2E passes on critical paths (auth, property flow, booking, payment, chat, admin).
- Cross‑browser testing (Chrome, Firefox, Safari, Edge).
- Regression test: previously closed bugs remain fixed.
- Release notes generated from commit history (conventional changelog).
- Deployment pipeline produces Docker image (if applicable) and deploys to staging.
- Monitoring and alerting configured (uptime, error rates, response times).
- Backup and disaster recovery plan (outlined).

**Dependencies**
- All previous phases fully implemented and tested.

**Deliverables**
- Production‑ready codebase.
- Final documentation set (all knowledge_base files updated).
- CI/CD pipeline configured for automated testing, building, and deployment.
- Release checklist and sign‑off sheet.
- Monitoring and alerting configured (uptime, error rates).
- Backup and disaster recovery plan (outline).

---
## Summary of Phases

| Phase | Focus |
|-------|-------|
| 0 | Foundations & Auth |
| 1 | Property Catalog & Search |
| 2 | User Profiles, Favorites, Leads |
| 3 | Bookings & Appointments |
| 4 | Payments & Premium Listings |
| 5 | Notifications & Real‑Time |
| 6 | Admin Dashboard & Management |
| 7 | AI Chatbot & Advanced Search |
| 8 | Polish, Performance, Release |

Each phase builds on the previous, delivering tangible value early while allowing parallel work streams where possible (e.g., UI/UX polishing can start after core APIs are ready). The plan ensures that by the end of Phase 8, the system is ready for beta release or MVP launch to stakeholders.

--- 

*End of Implementation Plan Document*