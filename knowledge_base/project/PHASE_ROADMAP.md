# Phase Roadmap

This document breaks down the Property Vista CRM MVP implementation into distinct phases that can be completed independently, with each producing a working increment of the application. Each phase includes specific objectives, modules, UI screens, backend components, APIs, database changes, dependencies, deliverables, acceptance criteria, exit criteria, and estimated effort.

---

## Phase 0: Foundation & Setup

**Phase Objective**
Establish the foundational infrastructure, development environment, authentication system, and core architecture necessary for all subsequent development phases.

**Modules Included**
- Project setup and build tools
- Authentication system (registration, login, token management)
- User management service
- Security middleware (authentication, authorization)
- Logging and error handling infrastructure
- Database connection and initialization
- API route structure

**UI Screens**
- Login page (`/login`)
- Registration page (`/register`)
- Forgot password (`/forgot-password`)
- Reset password (`/reset-password/:token`)
- Email verification (`/verify-email/:token`)

**Backend Modules**
- AuthController (registration, login, refresh, logout, password reset)
- AuthService (business logic for authentication)
- TokenService (JWT handling)
- UserService (user profile management)
- Middleware (authentication, validation, error handling)
- Config module (environment variables)
- Database initialization (Prisma setup)

**APIs**
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me` (protected)
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /auth/verify-email/:token`

**Database Changes**
- Create table `users` (id, email, password_hash, name, role, is_verified, refresh_token_hash, created_at, updated_at, deleted_at)
- Add indexes: email unique, role index
- Add `created_at`, `updated_at`, `deleted_at` columns
- Add `refresh_token_hash` (or separate `refresh_tokens` table)
- Setup Prisma schema and initial migration

**Dependencies**
- None (foundational phase)

**Deliverables**
- Initial commit with project structure
- Working auth API and UI
- Documentation updated (API spec, DB design, coding standards)
- CI pipeline running lint, unit tests on PR
- Development environment setup guide
- Docker configuration (if applicable)

**Acceptance Criteria**
- User can register with valid email/password
- Email verification sent and functional
- User can log in and receive access/refresh tokens
- Protected routes return 401 without token
- Refresh token rotation works
- Password reset flow operational
- All auth endpoints return appropriate error codes (400, 401, 422)
- Unit tests for auth service and controllers
- E2E smoke test for login/register flow

**Exit Criteria**
- All acceptance criteria met
- Code reviewed and approved
- No critical bugs remain
- Performance benchmarks met for authentication flows
- Security audit passes for authentication components
- Documentation complete and accurate
- CI/CD pipeline fully functional

**Estimated Effort**
- 80-120 hours (2-3 weeks for one developer)
- Infrastructure setup: 20 hours
- Authentication system: 40-60 hours
- Testing and documentation: 20-40 hours

---

## Phase 1: Core Property Catalog & Search (Public)

**Phase Objective**
Enable users to browse and search properties without authentication, implement property listing/filtering, and lay groundwork for property media and details with basic AI-assisted search.

**Modules Included**
- Property management service
- Property media handling
- Search and filtering system
- API route handlers for properties
- Basic AI search integration
- SEO optimization components
- Media upload service

**UI Screens**
- Homepage (`/`): hero search bar, featured properties, CTA
- Properties listing page (`/properties`): filter sidebar, results grid
- Property detail page (`/properties/:id`): gallery, info tabs, agent card, inquiry CTA
- Search results page (`/search` or `/results`): same as listing but with AI badge/explanation
- Property media upload modal (admin/agent)
- Not found pages (404)

**Backend Modules**
- PropertyController (CRUD operations for properties)
- PropertyService (business logic for property management)
- MediaService (handle property images/media)
- SearchService (implement search/filter logic)
- AIService (basic integration for natural language search)
- Search)
- language search)

**APIs**
- `GET /properties` – list with query params (page, limit, priceMin, priceMax, beds, baths, city, state, propertyType, isPublished=true)
- `GET /properties/:id` – single property detail (unless isPublished=false and user not agent/admin)
- `GET /properties/:id/media` – list media for property
- `POST /properties` (admin/agent only) – create property (multipart/form-data)
- `PATCH /properties/:id` – update property
- `PATCH /properties/:id` – soft delete
- `POST /properties/:id/publish` – toggle published flag
- Search endpoint: `GET /search?q=&source=ai|fallback&limit=&offset=` (returns properties with score/explanation if AI)
- Suggestion endpoint: `GET /search/suggest?q=`

**Database Changes**
- Create `properties` table (id, title, description, price, beds, baths, area, area_unit, property_type, year_built, street, city, state, postal_code, country, latitude, longitude, is_published, is_premium, premium_until, agent_id, created_at, updated_at, deleted_at)
- Create `property_media` table (id, property_id, url, caption, is_primary, sort_order, created_at, deleted_at)
- Add foreign keys: properties.agent_id → users.id
- Indexes: is_published, city/state, price, created_at
- Optional: GIST index on (latitude, longitude) for proximity search
- Ensure constraints (price>0, area>0, beds>=0, baths>=0, year_built between 1800 and current year)

**Dependencies**
- Phase 0 (authentication middleware for protected routes)
- Media upload infrastructure (local storage or S3 stub)

**Deliverables**
- Functional property catalog with search
- Updated API spec and DB design docs
- UI screens implemented per specs
- Test coverage ≥80% for new backend endpoints
- Storybook entries for core components (optional)
- Demo data seed script

**Acceptance Criteria**
- Unauthenticated users can view published properties list and details
- Filtering works correctly (combined range filters, text search)
- AI search returns ranked results with explainability icons; fallback works when AI service unavailable
- Property detail shows all required fields, media gallery, and agent info
- Pagination or infinite scroll loads additional pages without duplication
- Metadata tags (title, description) set per page for SEO
- Responsive layout: grid → list on mobile
- Unit tests for property service and controller
- API contract tests for search and property endpoints
- E2E test: search → filter → open detail → verify data
- Performance: page loads < 2s on 3G simulated

**Exit Criteria**
- All acceptance criteria met
- Code reviewed and approved
- No critical bugs remain
- Performance benchmarks achieved
- Security review passed for property data exposure
- Documentation complete and accurate
- Automated tests passing in CI

**Estimated Effort**
- 120-180 hours (3-4 weeks for one developer)
- Property model and API: 40-60 hours
- Search and filtering system: 30-50 hours
- UI components and screens: 30-50 hours
- Testing and documentation: 20-30 hours

---

## Phase 2: User Roles, Profiles & Basic Interactions

**Phase Objective**
Implement role-based access control (RBAC) for agents, admins, customers, enable user profile management, and allow favoriting properties and basic inquiries.

**Modules Included**
- Role-based access control system
- User profile management
- Favorites/wishlist system
- Lead/inquiry management
- Notification system foundation
- Role-based route protection

**UI Screens**
- Profile page (`/profile`): edit name, etc.
- Favorites page (`/favorites`): grid of favorited properties
- Inquiry modal (reused on property detail, search card, homepage CTA)
- Leads index (`/leads` or `/agent/leads`): table with status, property, customer
- Lead detail page (`/leads/:id`): conversation history, actions
- Agent profile page (`/agents/:id`): bio, listings

**Backend Modules**
- UserController (profile management)
- UserService (user business logic)
- RoleService (role-based access control)
- FavoriteService (favorites management)
- LeadService (inquiry/lead management)
- Auth middleware (role-based protection)
- Notification service (placeholder)

**APIs**
- `GET /users/me` – profile
- `PUT /users/me` – update profile (name, etc.)
- `POST /favorites` – add favorite (body: {propertyId})
- `DELETE /favorites/:propertyId` – remove favorite
- `GET /favorites` – list user's favorites (with property details)
- `POST /leads` – create inquiry (requires propertyId, name, phone, email, message, source)
- `GET /leads` (agent/admin) – list leads with filters
- `GET /leads/:id` – lead detail
- `PATCH /leads/:id` – update status/notes
- `DELETE /leads/:id` – delete lead (if allowed)
- `GET /agents/:id` – public agent profile (name, contact)

**Database Changes**
- Ensure `users.role` CHECK constraint includes roles: visitor, customer, agent, admin
- Create `favorites` table (id, user_id, property_id, created_at, deleted_at) with unique constraint on (user_id, property_id)
- Create `leads` table (id, name, phone, email, message, property_id, source, status, created_at, updated_at, deleted_at). Optionally link to user via user_id if authenticated.
- Indexes: favorites(user_id, property_id), leads.property_id, leads.status
- Add foreign keys where appropriate (favorites.user_id → users.id, favorites.property_id → properties.id, leads.property_id → properties.id)

**Dependencies**
- Phase 1 (property catalog)
- Auth system (role claims in JWT)

**Deliverables**
- RBAC middleware and role protection
- Profile and favorites CRUD
- Lead/inquiry system
- Updated docs (API spec, DB design)
- Test suites

**Acceptance Criteria**
- Role-based middleware blocks unauthorized access (e.g., customer cannot access `/admin`)
- Users can update their profile; changes reflected
- Toggling favorite persists and shows correct UI state
- Inquiry form creates a lead with correct association to property
- Agents/admins can view list of leads, filter by status, see details
- Lead status can be updated (new → contacted → etc.)
- Unauthenticated users can submit inquiry (lead created without user_id)
- Validation on all forms (required fields, email/phone format)
- Unit tests for user, favorite, lead services
- API tests for all new endpoints
- E2E test: register as agent → favorite a property → send inquiry → view lead in agent dashboard

**Exit Criteria**
- All acceptance criteria met
- Code reviewed and approved
- No critical bugs remain
- Role-based access control thoroughly tested
- Security review passed for data access controls
- Documentation complete and accurate
- Automated tests passing in CI

**Estimated Effort**
- 100-150 hours (2.5-3.5 weeks for one developer)
- RBAC system: 20-30 hours
- Profile management: 20-30 hours
- Favorites system: 15-25 hours
- Lead/inquiry system: 25-35 hours
- UI components and screens: 20-30 hours
- Testing and documentation: 15-25 hours

---

## Phase 3: Booking & Appointment Management

**Phase Objective**
Enable scheduling property viewings (bookings), implement agent calendar and availability checking, and provide booking confirmation and notifications.

**Modules Included**
- Booking management system
- Calendar and scheduling service
- Availability checking engine
- Notification system (enhanced)
- Booking workflow management

**UI Screens**
- Booking modal (triggered from property detail "Schedule tour" or lead "Schedule visit")
- Agent booking calendar page (`/agent/bookings` or `/calendar`): week/day view with slots
- Booking detail page (agent/customer view)
- Upcoming bookings widget on dashboard
- Booking history page

**Backend Modules**
- BookingController (CRUD operations for bookings)
- BookingService (business logic for booking management)
- AvailabilityService (check for scheduling conflicts)
- NotificationService (send booking-related notifications)
- CalendarViewService (generate calendar views)

**APIs**
- `POST /bookings` – create booking request (requires propertyId, agentId, customerId (or user from JWT), startTime, endTime, notes)
- `GET /bookings` – list with filters (for agent/admin: by agentId, date range, status; for customer: their bookings)
- `GET /bookings/:id` – booking detail
- `PATCH /bookings/:id` – update (e.g., reschedule, notes)
- `POST /bookings/:id/confirm` – agent confirms
- `POST /bookings/:id/complete` – mark as completed
- `POST /bookings/:id/cancel` – cancel (by either party or admin)
- `GET /agents/:id/availability?date=YYYY-MM-DD` – return busy slots (optional)

**Database Changes**
- Create `bookings` table (id, property_id, agent_id, customer_id, start_time, end_time, status, notes, created_at, updated_at, deleted_at)
- Indexes: agent_id, property_id, customer_id, status, start_time/end_time
- Consider exclusion constraint (PostgreSQL) for overlapping bookings per agent, or handle in service layer
- Foreign keys to properties, users (agent_id), users (customer_id)
- Ensure start_time < end_time check via constraint or validation

**Dependencies**
- Phase 2 (users, leads, auth)
- Property data (for booking context)
- Notification system stub (to be fleshed in later phase)

**Deliverables**
- Booking entity and API
- Calendar UI (basic)
- Workflow endpoints with role guards
- Integration with property and user data
- Tests covering happy and error paths

**Acceptance Criteria**
- Customer can request a booking for a published property; agent receives notification
- Agent can view, confirm, reschedule, cancel, or mark booking as completed
- System prevents double‑booking for same agent (within a buffer, e.g., 15 minutes) via validation
- Booking status transitions enforced (cannot skip from requested to completed without confirmation)
- Timestamps stored in UTC; displayed in user's timezone
- Related data populated (property info, agent/customer names)
- Unit tests for booking service (conflict detection, state transitions)
- API tests for booking CRUD and workflow endpoints
- E2E test: customer books → agent confirms → customer sees confirmed status → agent marks complete
- Calendar view loads within reasonable time (<1s for a month)

**Exit Criteria**
- All acceptance criteria met
- Code reviewed and approved
- No critical bugs remain
- Booking system thoroughly tested (edge cases, concurrency)
- Performance benchmarks met for calendar views
- Security review passed for booking data protection
- Documentation complete and accurate
- Automated tests passing in CI

**Estimated Effort**
- 120-160 hours (3-4 weeks for one developer)
- Booking model and API: 30-40 hours
- Availability checking and conflict detection: 25-35 hours
- Calendar UI and views: 25-35 hours
- Notification integration: 15-25 hours
- Testing and documentation: 15-25 hours

---

## Phase 4: Payments & Premium Listings

**Phase Objective**
Enable monetary transactions for premium features (highlighted listings, booking deposits), integrate with a payment gateway (Stripe) for secure processing, and store payment records and update related entities on success.

**Modules Included**
- Payment processing system
- Premium listing management
- Payment webhook handling
- Invoice/receipt generation
- Refund processing system
- Payment history tracking

**UI Screens**
- Payment modal (amount, card fields, submit)
- Payment success/failure screen
- Premium badge on property card/list
- Agent dashboard: upgrade to premium button
- Payment history page (`/payments`)
- Invoice view/download (simple HTML)

**Backend Modules**
- PaymentController (handle payment intents, confirmations, webhooks)
- PaymentService (business logic for payment processing)
- StripeService (wrapper for Stripe API interactions)
- PremiumListingService (manage premium status for properties)
- InvoiceService (generate receipts/invoices)
- RefundService (handle payment refunds)

**APIs**
- `POST /payment-intent` – create intent (body: {amount, currency, metadata?})
- `POST /payment/confirm` – confirm with client-side token (returns success)
- `GET /payments/:id` – transaction details
- `POST /webhook/stripe` – verify signature and dispatch events
- `GET /users/me/payments` – payment history
- `POST /properties/:id/toggle-premium` (agent/admin) – after payment success, set premium_until
- `GET /properties?premium=true` – filter for premium listings

**Database Changes**
- Create `payments` table (id, payment_intent_id (unique), amount, currency, status, payment_method_type, metadata_json, receipt_url, failure_code, failure_message, user_id (nullable), created_at, updated_at, deleted_at)
- Indexes: payment_intent_id unique, status, user_id, created_at
- Ensure `is_premium`, `premium_until` columns exist on `properties` table (added in Phase 1)
- Store associative IDs in `metadata_json` (e.g., {type:'property_premium', id:'uuid'} or {type:'booking_deposit', id:'uuid'})

**Dependencies**
- Phase 1 (property model with premium fields)
- Auth (user_id for payment association)
- Basic backend services (for updating property)

**Deliverables**
- Payment integration with Stripe (or PayPal)
- Premium listing functionality
- Webhook handler
- Payment history UI
- Full test suite (unit, API, simulated E2E)
- Documentation updates (API spec, security notes)

**Acceptance Criteria**
- Payments are created via secure Stripe integration; no raw card data touches our servers
- Successful payment updates property.is_premium and sets premium_until (now + duration)
- Failed payments do not alter property status and return appropriate error
- Webhook verifies signature and updates payment status reliably
- Idempotency keys prevent duplicate charges
- Refunds (if implemented) revert premium flag or return funds
- Users can view payment history with status and amounts
- Test with Stripe test keys in development; ensure no real charges
- Unit tests for payment service (creating intents, handling webhooks)
- API tests using Stripe test mode or mocks
- E2E test (using test card numbers): upgrade property to premium → verify badge appears → after expiry, premium removed (manual time tweak or mock time)

**Exit Criteria**
- All acceptance criteria met
- Code reviewed and approved
- No critical bugs remain
- Payment security compliance verified (PCI DSS basics)
- Webhook security verified (signature validation)
- Tested with payment gateway sandbox
- Documentation complete and accurate
- Automated tests passing in CI

**Estimated Effort**
- 100-140 hours (2.5-3.5 weeks for one developer)
- Payment integration: 30-40 hours
- Premium listing logic: 20-30 hours
- Webhook handling: 15-25 hours
- UI components: 15-25 hours
- Testing and documentation: 15-25 hours

---

## Phase 5: Notifications & Real‑Time Updates

**Phase Objective**
Implement a notification system for real‑time updates (new lead, booking confirmation, etc.), provide UI indicator (bell icon) with unread count, and support both in‑app (WebSocket/SSE) and email/SMS fallbacks.

**Modules Included**
- Notification management system
- Real-time communication service (WebSocket/SSE)
- Email/SMS notification gateway
- Notification preferences and settings
- Admin notification monitoring

**UI Screens**
- Notification center page (`/notifications`**
- Notification center page (`/notifications`): list with filter, bulk actions
- Notification dropdown (from header): shows recent items, uncount, view all
- Toast/snackbar for real‑time toast notifications (optional)
- Settings page to configure email/SMS preferences (optional)

**Backend Modules**
- NotificationController (handle notification CRUD operations)
- NotificationService (business logic for notification management)
- RealtimeService (manage WebSocket/SSE connections)
- EmailNotificationService (send email notifications)
- SMSNotificationService (send SMS notifications)
- NotificationTemplateService (manage notification templates)

**APIs**
- `GET /notifications` – list with filters (?unread=true, limit, offset)
- `PATCH /notifications/:id` – set read=true/false (or separate endpoints /read, /unread)
- `DELETE /notifications/:id` – delete single
- `POST /notifications/read-all` – mark all as read
- `DELETE /notifications/all` – delete all (if allowed)
- `GET /notifications/unread-count` – lightweight endpoint for badge
- WebSocket endpoint: `/ws/notifications` (or SSE: `/api/notifications/stream`)

**Database Changes**
- Create `notifications` table (id, recipient_id, type, title, message, related_entity_id, related_entity_type, is_read, created_at, deleted_at)
- Indexes: recipient_id, is_read, created_at
- Foreign key: recipient_id → users.id
- (Optional) indexes on related_entity_id/type for efficient joins

**Dependencies**
- Earlier phases (users, leads, bookings, payments) for event sources
- Auth system to identify recipient
- WebSocket library (Socket.io) or native SSE support

**Deliverables**
- Notification entity and API
- Real‑time connection (WebSocket/SSE)
- UI notification center and bell dropdown
- Integration with event triggers (via service layer)
- Tests covering creation, delivery, UI updates

**Acceptance Criteria**
- When a relevant event occurs (new lead assigned, booking confirmed, payment succeeded, etc.), a notification is created and sent to the appropriate user(s)
- Unread badge updates in real‑time via WebSocket/SSE
- Clicking a notification marks it as read and optionally navigates to the related entity
- Users can mark all as read, delete notifications
- Notification payload includes sufficient data to link to entity (type and ID)
- Email/SMS fallback sends messages for critical events (configurable)
- Unit tests for notification service and controller
- API tests for notification CRUD
- E2E test: create a lead as visitor → agent assigned → notification appears in agent’s bell → click → navigate to lead detail
- Real‑time connection recovers after temporary network loss

**Exit Criteria**
- All acceptance criteria met
- Code reviewed and approved
- No critical bugs remain
- Real-time connections stable and scalable
- Notification delivery reliability tested
- Security review passed for notification data
- Documentation complete and accurate
- Automated tests passing in CI

**Estimated Effort**
- 110-150 hours (2.75-3.75 weeks for one developer)
- Notification system: 30-40 hours
- Real-time implementation: 25-35 hours
- Email/SMS integration: 20-30 hours
- UI components: 15-25 hours
- Testing and documentation: 15-25 hours

---

## Phase 6: Admin Dashboard & Management

**Phase Objective**
Provide administrators with overview and management capabilities for users, properties, leads, bookings, payments, and system settings. Enable monitoring of key performance indicators (KPIs) and activity.

**Modules Included**
- Admin dashboard and analytics
- User management system
- Property management system (admin)
- Lead management system (admin)
- Booking management system (admin)
- Payment management system (admin)
- Settings management system
- Reporting and export functionality
- Activity logging and audit trails

**UI Screens**
- Admin dashboard page (`/admin` or `/dashboard/admin`): KPI row, activity feed, charts, quick links
- Users management page: table with role, status, actions (edit, reset password, delete)
- Properties management page: table/list with status, price, agent, actions (edit, publish, delete)
- Leads management page: table with status, property, customer, actions (view, assign, delete)
- Bookings management page: table with status, property, agent, customer, time, actions (confirm, complete, cancel)
- Payments management page: table with status, amount, user, actions (view, refund)
- AI settings page: form with model selector, temperature slider, max tokens input, prompt textarea, quota fields, save/test buttons
- System settings page: site name, contact email, maintenance toggle, etc.
- Export modal: format selection, date range filters, submit

**Backend Modules**
- AdminController (handle admin-specific API endpoints)
- AdminService (business logic for admin operations)
- DashboardService (generate KPIs and dashboard data)
- ReportingService (handle data export and reports)
- AuditService (track administrative actions)
- SettingsService (manage system and AI settings)
- UserAdminService (admin-specific user operations)
- PropertyAdminService (admin-specific property operations)
- LeadAdminService (admin-specific lead operations)
- BookingAdminService (admin-specific booking operations)
- PaymentAdminService (admin-specific payment operations)

**APIs**
- `GET /admin/dashboard/summary` – KPI metrics
- `GET /admin/logs/recent` – activity feed items
- `GET /charts/lead-sources` – data for pie chart
- `GET /charts/leads-over-time` – time‑series data
- `GET /charts/property-views` – property popularity data
- `GET /admin/users` – paginated list with filters (role, search)
- `GET /admin/properties` – list of all properties (incl. draft/unpublished) with filters
- `GET /admin/leads` – list of all leads (including protected data) with filters
- `GET /admin/bookings` – list of all bookings with filters
- `GET /admin/payments` – list of all payments with filters
- `GET /settings/ai` – current AI configuration
- `PUT /settings/ai` – update AI configuration
- `POST /settings/ai/test` – send test prompt to AI and return response
- `GET /settings/system` – system settings
- `PUT /settings/system` – update system settings
- `POST /admin/properties/bulk` – bulk update (publish/unpublish/delete) based on selected IDs
- `DELETE /admin/users/:id` – delete user (soft) (admin only)
- `PATCH /admin/users/:id/role` – change role (admin only)
- `GET /admin/users/:id` – user detail (excluding password hash)
- `POST /admin/reports/export` – request export with format and filters (returns job ID or file)
- `GET /admin/reports/job/:id/status` – check export progress

**Database Changes**
- No new tables required; reuse existing tables
- May add summary/cache tables for reporting if needed (optional)
- Indexes on frequently filtered columns: properties.is_published, properties.is_premium, users.role, bookings.status, payments.status

**Dependencies**
- All previous phases (users, properties, bookings, payments, notifications, AI chatbot)
- Charting library (recharts, victory, or similar)
- Export library (e.g., csv-stringify, xlsx) for report generation

**Deliverables**
- Admin UI with dashboard and management sections
- Role‑based middleware protecting admin routes
- API endpoints for admin operations
- Export and reporting features
- Tests covering admin flows
- Documentation updates

**Acceptance Criteria**
- Admin can view KPIs that update periodically (or on refresh)
- Admin can search/filter users, properties, leads, bookings, payments
- Admin can perform CRUD operations on each entity with proper authorization
- Role changes require admin confirmation and are logged
- Property bulk actions work on selected items and show success/error counts
> AI settings can be saved and affect subsequent chat requests  
> System settings can be toggled (e.g., maintenance mode displays banner to non‑admins)  
> Export functionality generates file (CSV/Excel) with selected data and downloads it  
> Accessibility: keyboard navigable, ARIA labels, sufficient contrast  
> Unit tests for admin services and controllers  
> API tests for admin endpoints (role checks)  
> E2E test: admin login → view dashboard → create a property → verify it appears in public listing → bulk publish → verify KPI updates  

**Exit Criteria**  
- All acceptance criteria met  
- Code reviewed and approved  
- No critical bugs remain  
- Admin authorization thoroughly tested (principle of least privilege)  
- Performance benchmarks met for dashboard loading  
- Security review passed for admin access controls  
- Documentation complete and accurate  
- Automated tests passing in CI  

**Estimated Effort**  
- 150-200 hours (3.75-5 weeks for one developer)  
- Admin dashboard and KPIs: 30-40 hours  
- Management UIs (users, properties, etc.): 60-80 hours  
- Reporting and export: 20-30 hours  
- Settings management: 15-25 hours  
- Testing and documentation: 25-35 hours  

---

## Phase 7: AI Chatbot & Advanced Search

**Phase Objective**  
Deliver a fully‑featured AI chatbot for natural‑language property search and assistance, enhance search with advanced filtering, sorting, and saved searches, and provide conversational UI that can trigger actions (schedule viewing, save property, etc.).

**Modules Included**  
- AI chatbot service  
- Natural language processing integration  
- Conversation context management  
- Advanced search and filtering system  
- Saved searches functionality  
- Usage tracking and analytics  
- Search result enhancement (property cards in chat)  

**UI Screens**  
- Chat widget (collapsible panel) with input area, message list, send button  
- Chat page (`/chat`) – full‑screen variant  
- Message bubbles: user and bot (with avatars, timestamps)  
- Bot message may contain: text, property cards (with mini‑actions), suggestions chips  
- Input box with placeholder, voice input button (optional)  
- Saved searches modal/list  
- Search filters sidebar (price, beds, baths, property type, location, sort)  
- Search results page with sorting dropdown and saved‑search shortcut  
- Admin AI usage dashboard (charts, tables)  

**Backend Modules**  
- ChatController (handle chat message endpoints)  
- ChatService (orchestrate LLM calls, tool use, conversation history)  
- PromptService (manage and optimize prompts for LLM)  
- ToolService (implement functions LLM can call: property search, save favorite, schedule viewing, etc.)  
- ConversationService (manage conversation history and context)  
- AISearchService (enhance search with AI capabilities)  
- UsageTrackingService (monitor AI API usage and costs)  
- SavedSearchService (manage saved search functionality)  

**APIs**  
- `POST /chat/message` – send user message, receive assistant reply (streaming optional)  
- `GET /chat/messages?stream=true` – SSE endpoint for streaming response (alternative: use POST with Accept: text/event-stream)  
- `GET /search/saved` – list user's saved searches  
- `POST /search/saved` – create saved search (body: {name, query})  
- `DELETE /saved-searches/:id` – delete saved search  
- `GET /search/suggest?q=` – autosuggest (enhanced with saved queries?)  
- `POST /search` – advanced search with filters, sort, page, limit (non‑AI)  
- `GET /search/` (as before) – AI search with explanation  
- `GET /usage/ai` – admin endpoint for AI usage stats (requests, tokens, estimated cost)  
- `POST /usage/ai/reset` – reset counters (admin)  

**Database Changes**  
- Create `search_logs` table (if not already) for analytics (id, query_text, parsed_filters, results_count, source, ip_address, user_agent, created_at)  
- Create `saved_searches` table (id, user_id, name, query_text, parsed_filters, created_at, updated_at, deleted_at)  
- Add optional column `last_searched_at` to users (or derive from search_logs)  
- Ensure proper indexes: search_logs(created_at), source, user_id; saved_searches(user_id)  

**Dependencies**  
- Prior phases (property data, auth, UI components)  
- External Anthropic API (or compatible LLM) access  
- Real‑time connection for streaming (WS or SSE)  
- Storage for conversation history (optional for MVP; can use in‑memory or client‑side localStorage, but better to store server‑side for continuity across devices)  

**Deliverables**  
- Chatbot UI widget and/or dedicated page  
- Backend service orchestrating LLM calls, tool use, and conversation history  
- Streaming response implementation  
- Prompt management and fallback logic  
- Usage tracking and admin oversight  
- Saved search functionality  
- Enhanced search with sorting and filtering  
- Tests (unit, API, E2E)  
- Documentation updates (AI_CONTEXT.md, API spec)  

**Acceptance Criteria**  
- User can open chat widget and type natural language queries like "Show me 3‑bedroom homes under $400k in Brooklyn"  
- Assistant replies with a list of property cards that match the criteria, each including a short explanation why it matches (e.g., "3 bedrooms, price $380k")  
- Follow‑up questions keep context: after seeing results, user says "add a garage" → filters updated accordingly  
- User can click "View" on a property card in chat to navigate to its detail page  
- User can click "Save" to add to favorites; confirmation appears  
- User can click "Schedule" to open booking modal with property pre‑filled  
- If AI service returns error or is unavailable, system shows a friendly message and suggests using filter search  
- Rate limiting: after N requests per minute, user receives "Please slow down" message  
- Usage tracking: admin can see total tokens used today, requests count, estimated cost  
- Saved searches appear under "My searches" and can be re‑run with one click  
- Search results can be sorted by price low/high, date new/old, relevance  
- Accessibility: keyboard navigable, ARIA labels on chat input/button, message roles  
- Unit tests for chat service (prompt building, tool invocation, context handling)  
- API tests for chat endpoint with mocked AI  
- E2E test: open chat → ask for 2‑bed under $300k → receive list → click view on first → navigate to correct property detail → verify details match query  
- Performance: first response < 2s (excluding actual LLM latency) under normal load  
- Fallback test: disable AI microservice → query returns filter‑based results with banner  

**Exit Criteria**  
- All acceptance criteria met  
- Code reviewed and approved  
- No critical bugs remain  
- AI integration thoroughly tested (various query types, edge cases)  
- Performance benchmarks met for response times  
- Security review passed for AI API key handling  
- Usage tracking and limits functioning correctly  
- Documentation complete and accurate  
- Automated tests passing in CI  

**Estimated Effort**  
- 130-170 hours (3.25-4.25 weeks for one developer)  
- AI chatbot core: 40-50 hours  
- Conversation context management: 20-30 hours  
- Tool integration (property search, save favorite, etc.): 25-35 hours  
- Search enhancement and saved searches: 20-30 hours  
- UI components: 15-25 hours  
- Testing and documentation: 10-20 hours  

---

## Phase 8: Polish, Performance, and Release Preparation

**Phase Objective**  
Finalize UI/UX refinements, accessibility, SEO, and performance optimizations. Conduct thorough testing, bug fixing, and prepare for production release. Ensure compliance with defined non‑functional requirements (NFRs).

**Modules Included**  
- Accessibility enhancement suite  
- SEO optimization tools  
- Performance optimization framework  
- Error handling and resilience patterns  
- Internationalization foundation  
- Animation and motion preference system  
- Theme management (light/dark)  
- Comprehensive testing infrastructure  
- Security auditing and hardening  
- Documentation completion and quality assurance  

**UI Screens**  
- All screens from previous passes, refined  
- Custom 404/500 pages with branding  
- Maintenance mode banner  
- Cookie consent placeholder (for GDPR/CCPA)  

**Backend Modules**  
- Performance monitoring and optimization  
- Security hardening and audit  
- Error boundary and exception handling improvements  
- Logging enhancement and structuring  
- Caching strategy implementation  
- Database query optimization  
- API versioning and documentation  
- Dependency management and updates  

**APIs**  
- Review all endpoints for idempotency, proper status codes, and consistent error shapes  
- Add rate limiting headers (Retry‑Where applicable)  
- Ensure PUT/PATCH semantics are correct  
- Add API versioning in URL (`/api/v1/...`)  

**Database Changes**  
- Likely none unless new indexes discovered from slow‑query review  
- Add any missing indexes for reporting or frequent queries  
- Consider partitioning large tables (logs, notifications) if needed for scale  

**Dependencies**  
- All previous phases fully implemented and tested  

**Deliverables**  
- Production‑ready codebase  
- Final documentation set (all knowledge_base files updated)  
- CI/CD pipeline configured for automated testing, building, and deployment  
- Release checklist and sign‑off sheet  
- Monitoring and alerting configured (uptime, error rates)  
- Backup and disaster recovery plan (outline)  

**Acceptance Criteria**  
- All WCAG 2.1 AA automated checks pass (using axe or similar)  
- Lighthouse score >90 for performance, accessibility, best practices, SEO on mobile and desktop  
- Bundle size < 150 KB gzip for JS (initial load)  
- First Contentful Paint < 1.5s on 3G  
- Time to Interactive < 3s on 3G  
- No critical security vulnerabilities in dependencies (npm audit)  
- All unit and integration tests pass; E2E passes on critical paths (auth, property flow, booking, payment, chat, admin)  
- Cross‑browser testing (Chrome, Firefox, Safari, Edge)  
- Regression test: previously closed bugs remain fixed  
- Release notes generated from commit history (conventional changelog)  
- Deployment pipeline produces Docker image (if applicable) and deploys to staging  
- Monitoring and alerting configured (uptime, error rates, response times)  
- Backup and disaster recovery plan (outlined)  

**Exit Criteria**  
- All acceptance criteria met  
- Code reviewed and approved  
- No critical bugs remain  
- Performance benchmarks achieved  
- Accessibility compliance verified  
- SEO best practices implemented  
- Security audit passed  
- All test suites passing (unit >90%, integration >80%, E2E critical paths)  
- Release candidate validated in staging  
- Documentation complete and accurate  
- Deployment pipeline fully functional  

**Estimated Effort**  
- 100-150 hours (2.5-3.75 weeks for one developer)  
- Accessibility and UI/UX polishing: 25-35 hours  
- Performance optimization: 20-30 hours  
- SEO improvements: 10-20 hours  
- Security hardening: 15-25 hours  
- Testing and QA: 20-30 hours  
- Release preparation: 10-20 hours  

---

## Phase Dependencies and Independence

While each phase builds upon previous ones, they are designed to deliver working increments:

- **Phase 0** is foundational and has no dependencies
- **Phase 1** depends only on Phase 0 (for auth middleware on protected routes)
- **Phase 2** depends on Phase 1 (property catalog) and Phase 0 (auth system)
- **Phase 3** depends on Phase 2 (users, leads, auth) and uses property data from Phase 1
- **Phase 4** depends on Phase 1 (property model) and Phase 0 (auth)
- **Phase 5** depends on earlier phases for event sources (users, leads, bookings, payments) and Phase 0 (auth)
- **Phase 6** depends on all previous phases (users, properties, bookings, payments, notifications, AI chatbot)
- **Phase 7** depends on prior phases (property data, auth, UI components) but can leverage work from earlier phases
- **Phase 8** depends on all previous being fully implemented but focuses on refinement rather than new features

Each phase delivers tangible value:
- Phase 0: Working authentication system
- Phase 1: Public property browsing and search
- Phase 2: User profiles, favorites, and inquiries
- Phase 3: Booking and appointment system
- Phase 4: Payment processing and premium listings
- Phase 5: Real-time notifications
- Phase 6: Administrative dashboard and management
- Phase 7: AI-powered chatbot and enhanced search
- Phase 8: Production-ready system with performance, security, and polish

The modular design allows for parallel work streams where possible (e.g., UI work can begin once APIs are defined, documentation can be updated throughout development).