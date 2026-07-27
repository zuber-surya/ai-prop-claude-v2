# Business Rules

This document outlines the core business rules for each backend module in the Property Vista CRM MVP.

---

## Authentication

### Responsibilities
- Manage user registration, login, logout, token refresh, and password recovery.
- Issue and validate JWT access and refresh tokens.
- Enforce role-based access control (RBAC) for endpoints.

### Services
- **AuthService**: Handles user registration, login, logout, token generation/refresh, password reset.
- **TokenService**: Generates, validates, and revokes JWT tokens.
- **UserService**: Manages user profile data (read/write) linked to auth.

### Controllers
- **AuthController**: Exposes endpoints:
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/logout`
  - `POST /auth/refresh`
  - `POST /auth/forgot-password`
  - `POST /auth/reset-password`
  - `GET /auth/verify-email/:token`

### Business Rules
- Passwords must be hashed using bcrypt (cost >= 12) before storage.
- Access tokens expire in 15 minutes; refresh tokens expire in 7 days.
- Refresh token rotation: each use issues a new refresh token, invalidating the old one.
- Email verification required before full access (except password reset).
- Role assignment: Users select Customer or Agent on registration; Admin role assigned only by existing Admin via admin panel.
- Failed login attempts: after 5 failures, account locked for 15 minutes.
- Tokens are invalidated on logout; refresh tokens stored hashed in DB.
- Multi-factor authentication (MFA) optional for Admin role (future extension).

### Validation
- Registration: email (unique, RFC‑5322), password (min 8 chars, at least one letter and one number), name (required, max 100), role (enum: customer, agent).
- Login: email/username and password required.
- Password reset: token valid (signed, not expired), new password meets policy.
- Email verification: token valid and not used before.

### Dependencies
- **UserService** (for user lookup/creation)
- **TokenService** (for JWT operations)
- **EmailService** (for sending verification/reset emails)
- Database: `users` table (Prisma model)

### Events
- `user.registered` – after successful registration (triggers welcome email).
- `user.login` – on successful login (audit log).
- `user.logout` – on logout (token invalidation).
- `token.issued` – on token creation.
- `token.refresh` – on refresh token use.
- `password.reset` – after password reset.
- `email.verified` – after email verification.

### Error Handling
- Validation errors: return 400 with field‑specific messages.
- Authentication failures: return 401 (invalid credentials) or 403 (account locked/ unverified email).
- Token errors: return 401 (invalid/expired token).
- Rate limiting: after too many failed attempts, return 429 with retry‑after header.
- Unexpected errors: return 500 with generic message; log full stack trace internally.

---

## Property Management

### Responsibilities
- CRUD operations for property listings.
- Manage property status (draft, published, archived).
- Handle property media (images, documents).
- Enforce ownership and permission checks.

### Services
- **PropertyService**: Core logic for create, read, update, delete, publish/unpublish.
- **MediaService**: Handles upload, storage, deletion of property images/files (e.g., to local disk or S3).
- **SearchService**: Indexes properties for search (integrates with search engine or uses DB full‑text).
- **FavoriteService**: Manages user‑favorite property relationships.

### Controllers
- **PropertyController**:
  - `GET /properties` – list with filters, pagination.
  - `GET /properties/:id` – get single property.
  - `POST /properties` – create (admin/agent).
  - `PATCH /properties/:id` – update (partial).
  - `DELETE /properties/:id` – soft delete or hard delete.
  - `PATCH /properties/:id/publish` – toggle published flag.
  - `POST /properties/:id/media` – upload images.
  - `DELETE /properties/:id/media/:mediaId` – delete media.

### Business Rules
- Only users with role `admin` or `agent` (with proper permissions) can create/edit/delete properties.
- A property must have at least one image, a title, price (> 0), location, and description to be published.
- Price must be a positive decimal with two decimal places.
- Bedrooms/baths are non‑negative integers; baths may support 0.5 increments.
- Living area > 0, with unit (sq ft or sq m).
- Year built between 1800 and current year.
- Slug/title uniqueness enforced per city/region (if applicable).
- Publishing a property triggers re‑indexing in search service.
- Deleting a property: soft delete by default (mark `archivedAt`); hard delete only for drafts or via admin override.
- Media files: allowed MIME types `image/jpeg`, `image/png`; max size 5 MB per file.
- Media storage: filenames are UUID‑based to avoid collisions; original filename stored for reference.
- When a property is unpublished, it remains accessible via direct link for admins but excluded from public listings.

### Validation
- Creation/Update: required fields present and of correct type.
- Price: decimal > 0, max 10,000,000 (configurable).
- Location: non‑empty string; if using structured address, validate sub‑fields (street, city, postal code, country).
- Media: file type and size validated before upload.
- Slug (if auto‑generated from title) must be unique; if manual, must be unique and URL‑safe.

### Dependencies
- **UserService** (to check roles/permissions)
- **MediaService** (for file handling)
- **SearchService** (to update search index)
- **FavoriteService** (to clean up favorites on delete/archive)
- Database: `properties`, `property_media` tables

### Events
- `property.created` – after successful creation.
- `property.updated` – on update.
- `property.published` – when status changed to published.
- `property.unpublished` – when status changed to draft/archived.
- `property.deleted` – on soft/hard delete.
- `property.media.uploaded` – after media upload.
- `property.media.deleted` – after media removal.
- `property.search.indexed` – after indexing in search service.

### Error Handling
- Validation errors: 400 with details.
- Authorization errors: 403 if user lacks rights.
- Not found: 404 if property ID invalid or archived (for non‑admin).
- Media upload errors: 400 for invalid type/size; 500 for storage failure.
- Unexpected errors: 500 with internal logging.

---

## Booking

### Responsibilities
- Manage property viewing appointments (site visits) and booking requests.
- Coordinate between customers, agents, and properties.
- Send reminders and notifications for upcoming bookings.

### Services
- **BookingService**: Create, retrieve, update, delete bookings; handle status transitions.
- **NotificationService**: Send emails/SMS for booking confirmation, reminders, cancellations.
- **CalendarService** (optional): Integrate with external calendars (Google/Outlook).

### Controllers
- **BookingController**:
  - `POST /bookings` – create a booking request.
  - `GET /bookings` – list bookings (with filters for user/property/date range).
  - `GET /bookings/:id` – get single booking.
  - `PATCH /bookings/:id` – update (e.g., reschedule, cancel).
  - `DELETE /bookings/:id` – delete booking.
  - `POST /bookings/:id/confirm` – agent confirms booking.
  - `POST /bookings/:id/complete` – mark as completed after visit.

### Business Rules
- A booking links a customer (or visitor), an agent, and a property.
- Booking statuses: `requested`, `confirmed`, `completed`, `canceled`, `no_show`.
- Only the assigned agent or an admin can confirm/cancel a booking.
- Customers can cancel up to 24 hours before the scheduled time; otherwise may incur a fee (configurable).
- Booking datetime must be in the future (minimum 1 hour from now, maximum 30 days ahead).
- Double‑booking prevention: an agent cannot have overlapping bookings for the same time window (configurable buffer, e.g., 15 minutes).
- When a booking is confirmed, send confirmation email/SMS to customer and agent.
- 24‑hour and 1‑hour automated reminders via NotificationService (triggered by cron or event scheduler).
- After completion, prompt customer for feedback/rating (future extension).

### Validation
- Customer ID must exist and be a customer (or visitor with temporary ID).
- Agent ID must exist and have role `agent` or `admin`.
- Property ID must exist and be published.
- Start time must be before end time; duration configurable (default 60 minutes).
- No overlapping bookings for the same agent (checked via service).
- Required fields: customerId, agentId, propertyId, startTime.

### Dependencies
- **UserService** (validate customer/agent roles)
- **PropertyService** (verify property exists and is published)
- **NotificationService** (send emails/SMS)
- **BookingService** (core logic)
- Database: `bookings` table

### Events
- `booking.created` – after booking request.
- `booking.confirmed` – when agent confirms.
- `booking.reminder.sent` – when reminder notification sent.
- `booking.completed` – after visit marked completed.
- `booking.canceled` – when canceled by either party.
- `booking.no_show` – if not confirmed/completed by start time.

### Error Handling
- Validation errors: 400.
- Authorization: 403 if user tries to modify another’s booking without rights.
- Conflict: 409 if double‑booking detected.
- Not found: 404.
- Unexpected: 500.

---

## Payments

### Responsibilities
- Process payments for services (e.g., premium listings, booking deposits).
- Integrate with payment gateway (Stripe/PayPal).
- Record transaction history and issue receipts.

### Services
- **PaymentService**: Communicates with payment gateway, creates payment intents, verifies webhooks.
- **InvoiceService**: Generates invoices for payments due.
- **WebhookHandler**: Processes asynchronous events from gateway (payment succeeded/failed).

### Controllers
- **PaymentController**:
  - `POST /payment-intent` – create payment intent for a given amount and currency.
  - `POST /payment/confirm` – confirm payment with client‑side token.
  - `GET /payments/:id` – get transaction details.
  - `POST /webhook/stripe` – endpoint for Stripe webhooks (similarly for PayPal).

### Business Rules
- Payments are processed in the smallest currency unit (e.g., cents) to avoid floating‑point errors.
- Supported currencies: USD (primary), with ability to extend.
- Payment amounts must be positive integers (in cents) and within configurable limits (min $1, max $10,000).
- Only authenticated users can initiate payments; guests may pay for premium listings via guest checkout (creates a temporary user record).
- Payment intents expire after 1 hour if not confirmed.
- Successful payments trigger:
  - For property premium listing: set property’s `premiumUntil` timestamp.
  - For booking deposit: mark booking as `confirmed` (or apply deposit).
- Failed payments: retain error details, notify user, allow retry.
- Refunds: processed via gateway; update transaction status to `refunded`; trigger any necessary reversals (e.g., remove premium status).
- PCI compliance: never store raw card details; only store gateway‑provided IDs and last‑4 digits for reference.

### Validation
- Amount: integer > 0, within min/max.
- Currency: must be supported enum.
- Payment method ID: valid format from gateway (if using tokenized flow).
- Metadata: must include relevant IDs (propertyId, bookingId, userId) for reconciliation.

### Dependencies
- **PaymentGateway** (Stripe SDK/PayPal SDK)
- **UserService** (to fetch user details for receipt)
- **PropertyService** (to update premium status)
- **BookingService** (to update booking deposit)
- Database: `payments`, `transactions` tables

### Events
- `payment.intent.created` – after creating intent.
- `payment.succeeded` – after webhook confirms successful charge.
- `payment.failed` – after webhook confirms failure.
- `payment.refunded` – after refund processed.
- `invoice.generated` – after invoice creation.
- `webhook.received` – when webhook endpoint called.

### Error Handling
- Validation errors: 400.
- Gateway errors: relay error code/message; map to 402 (payment required) or 502 (bad gateway) as appropriate.
- Webhook signature verification failure: 400.
- Unexpected errors: 500; log gateway response for debugging.

---

## Notifications

### Responsibilities
- Create, store, and deliver system‑generated notifications to users.
- Support real‑time delivery via WebSocket and fallback to polling.
- Allow users to mark as read, delete, and configure preferences.

### Services
- **NotificationService**: Core CRUD for notifications; calculates unread counts.
- **DeliveryService**: Sends notifications via WebSocket (if connected) and stores for later polling.
- **PreferenceService**: Manages user notification preferences (channels, frequency).

### Controllers
- **NotificationController**:
  - `GET /notifications` – list with filters (unread only, pagination).
  - `POST /notifications` – create a notification (internal use; external via service calls).
  - `PATCH /notifications/:id` – mark as read/unread.
  - `DELETE /notifications/:id` – delete single.
  - `POST /notifications/read-all` – mark all as read.
  - `DELETE /notifications` – delete all (if allowed).

### Business Rules
- Notifications have types: `lead_assigned`, `property_inquiry`, `booking_confirmation`, `booking_reminder`, `payment_success`, `payment_failed`, `system_alert`, `password_reset`, etc.
- Each notification includes: recipient user ID, type, title, message, timestamp, related entity IDs (optional), read flag.
- Real‑time push: when a notification is created, if the user has an active WebSocket connection, push the notification payload immediately.
- Fallback: notifications are stored in DB; clientes can poll `/notifications` for updates (with `?unread=true`).
- Users can configure per‑type delivery preferences (in‑app, email, push, SMS) via PreferenceService.
- Notifications older than 90 days are automatically archived (soft delete) via cron job.
- Unread count is cached per user (e.g., in Redis) for fast retrieval.
- When a notification is marked as read, the unread count decrements; if all notifications read, badge disappears.

### Validation
- Creation: recipientId must exist; type must be from allowed enum; title and message required (max lengths).
- Update: ID must exist and belong to the requesting user (or admin for moderation).
- Deletion: same as update.

### Dependencies
- **UserService** (validate recipient)
- **WebSocketManager** (maintain active connections)
- Database: `notifications` table
- Optional: Redis for caching unread counts
- EmailService/SMSService (if delivering via those channels)

### Events
- `notification.created` – after persisting.
- `notification.delivered.realtime` – when sent via WebSocket.
- `notification.delivered.poll` – when fetched via polling (optional metric).
- `notification.read` – when marked as read.
- `notification.deleted` – when deleted.
- `notification.preferences.updated` – when user changes settings.

### Error Handling
- Validation errors: 400.
- Authorization: 403 if user accesses another’s notifications.
- Not found: 404.
- Unexpected: 500.

---

## AI Search

### Responsibilities
- Provide natural‑language property search using external LLM (Anthropic Claude).
- Transform user queries into structured search parameters.
- Return ranked results with explainability scores.
- Cache frequent queries to reduce latency and cost.

### Services
- **SearchQueryService**: Parses free‑text query into structured filters (price range, beds, etc.) using LLM prompts.
- **SearchRankingService**: Scores properties based on match to query and returns explanations.
- **SearchCacheService**: (Optional) Redis‑based caching of query results for TTL (e.g., 5 minutes).
- **FallbackService**: Switches to traditional DB‑based full‑text/filter search when LLM is unavailable or returns error.

### Controllers
- **SearchController**:
  - `GET /search` – perform AI‑powered search (query param `q`, optional `source=ai`).
  - `GET /search/suggest` – autocomplete suggestions as user types.

### Business Rules
- The LLM receives a prompt containing the user query and the schema of available filters; it returns JSON with fields: `priceMin`, `priceMax`, `bedsMin`, `bedsMax`, `bathsMin`, `bathsMax`, `propertyType`, `keywords`, `location`.
- The service validates LLM output: ensures numeric ranges are sensible (min ≤ max) and values are within allowed enumerations.
- If LLM fails (timeout, invalid JSON, or service error), automatically fall back to keyword search with disclaimer banner.
- Search results are ranked by relevance score (0‑100) computed by combining:
  - Exact match on keywords in title/description.
  - Match on numeric filters (closer to midpoint = higher score).
  - Location proximity (if lat/lng provided).
  - Property recency (newer gets slight boost).
- Explainability: for each result, indicate which criteria matched (✓) or missed (✗) based on the parsed filters.
- Rate limiting: max 5 search requests per second per IP to control LLM usage cost.
- Query logging: store anonymized queries for analytics (no PII).
- If the LLM returns empty filters, treat as keyword‑only search.
- Search index: properties are indexed in a search engine (e.g., Meilisearch, Elasticsearch) or use DB full‑text with trigram support for fast retrieval.
- The AI search endpoint returns: `{ results: [{property, score, explanations}], total, query, source: "ai" | "fallback" }`.

### Validation
- Query string: required, trimmed, max 200 characters.
- For fallback search: validate any additional filter params (price, beds, etc.) as per property search rules.
- LLM output schema validation as described.

### Dependencies
- **LLMClient** (wrapper around Anthropic Claude API)
- **PropertyService** (to fetch property details for results)
- **SearchEngine** (or DB query builder)
- **SearchCacheService** (Redis)
- **FallbackService** (traditional search)
- **RateLimiter** (middleware)
- Database: `search_logs` table (optional)

### Events
- `search.query.received` – upon receiving request.
- `search.llm.success` – after successful LLM parsing.
- `search.llm.failed` – when LLM errors or returns invalid output.
- `search.fallback.used` – when falling back to traditional search.
- `search.results.returned` – before sending response.

### Error Handling
- Validation errors: 400.
- LLM service errors: 502 (bad gateway) with message “AI search temporarily unavailable”.
- Unexpected errors: 500.
- Fallback search errors: propagate as 500 if DB/search engine fails.

---

## Favorites

### Responsibilities
- Allow users to save and unsave properties they like.
- Provide quick access to favorite listings.
- Prevent duplicate favorites.

### Services
- **FavoriteService**: Add/remove favorite relationships; retrieve user’s favorites.

### Controllers
- **FavoriteController**:
  - `POST /favorites` – add a property to favorites (body: `{propertyId}`).
  - `DELETE /favorites/:propertyId` – remove a property from favorites.
  - `GET /favorites` – list paginated favorites for the current user.

### Business Rules
- Only authenticated users can manage favorites.
- A user cannot favorite the same property more than once; duplicate attempts are ignored (idempotent).
- When a property is deleted or archived, it is automatically removed from all users’ favorites (via cascade or cleanup job).
- Favorites are private; no other user can see another’s favorites list.
- Retrieval returns summary property data (thumbnail, title, price, etc.) with links to full detail.
- Maximum favorites per user: configurable soft limit (e.g., 1000); beyond that, oldest favorites may be auto‑removed or user warned.

### Validation
- Creation: `propertyId` must exist and be a published property (or accessible to the user based on role).
- Deletion: `propertyId` must exist in the user’s favorites list.

### Dependencies
- **UserService** (authenticate user)
- **PropertyService** (verify property existence and status)
- Database: `favorites` table (userId, propertyId, createdAt)

### Events
- `favorite.added` – after successful addition.
- `favorite.removed` – after removal.
- `favorite.cleanup` – when orphaned favorites removed (cascade on property delete/archive).

### Error Handling
- Validation errors: 400.
- Authorization: 403 if not authenticated.
- Not found: 404 if property does not exist or not favorited.
- Unexpected: 500.

---

## Reports

### Responsibilities
- Generate administrative and operational reports (sales, leads, property performance).
- Export data in CSV, Excel, or PDF formats.
- Support scheduled report generation and email delivery.

### Services
- **ReportService**: Core logic for data aggregation and formatting.
- **ExportService**: Converts data to CSV/XLSX/PDF.
- **SchedulerService** (optional): Triggers report generation at configured intervals (cron-like).
- **EmailService**: Sends generated reports to recipients.

### Controllers
- **ReportController**:
  - `GET /reports/sales` – sales summary (optional date range).
  - `GET /reports/leads` – lead conversion funnel.
  - `GET /reports/property-views` – property popularity.
  - `GET /reports/users` – user growth and activity.
  - `POST /reports/export` – request export with format and filters.
  - `GET /reports/scheduled` – list configured scheduled reports.
  - `POST /reports/scheduled` – create a new scheduled report.

### Business Rules
- Reports are read‑only; they aggregate data without side effects.
- Date range defaults: last 30 days if not specified.
- Admin role required for all report endpoints; agents may see limited reports (e.g., their own leads).
- Data sources: joined tables (`properties`, `leads`, `payments`, `users`, `notifications`).
- Export formats: CSV (default), XLSX (for formatted tables), PDF (for summary reports).
- Large result sets: streaming export to avoid memory overload; max rows per export configurable (e.g., 100k).
- Scheduled reports: store configuration (report type, frequency, recipients, format); executed by background worker.
- Reports may include charts (via server‑side generation or link to frontend charts).
- Sensitive data (e.g., payment amounts) masked in reports for non‑finance roles.
- Report generation logs: timestamp, user, parameters, duration, row count.

### Validation
- Date range: start ≤ end; both valid dates.
- Format: must be one of `csv`, `xlsx`, `pdf`.
- Filters: depend on report type; validated against allowed columns and operators.
- For scheduled reports: frequency must be supported cron expression; recipients must be valid email addresses.

### Dependencies
- **UserService** (role check)
- **PropertyService**, **LeadService**, **PaymentService** (for data fetching)
- **ExportService** (CSV/XLSX/PDF generation)
- **SchedulerService** (if using in‑app scheduler)
- **EmailService** (for delivery)
- Database: relevant tables for joins

### Events
- `report.generated` – after successful generation.
- `report.exported` – after export file created.
- `report.scheduled.triggered` – when a scheduled report runs.
- `report.email.sent` – after email delivery.
- `report.error` – if generation/export fails.

### Error Handling
- Validation errors: 400.
- Authorization: 403 if user lacks rights.
- Export errors: 500 if generation fails (e.g., memory, permissions).
- Email delivery failures: 500 (but retry via SchedulerService).
- Unexpected: 500.

---

## Permissions (RBAC Overview)

### Roles
- **Visitor**: unauthenticated user; can browse public properties, use search, view property detail, submit inquiries.
- **Customer**: authenticated user seeking to buy/rent; can favorite properties, make inquiries, view own inquiry history, manage profile.
- **Agent**: authenticated user representing seller/landlord; can create/edit own properties, manage leads, confirm bookings, view assigned leads.
- **Admin**: super‑user; can manage all properties, users, agents, system settings, view all reports.

### Permission Matrix (summary)

| Action / Resource          | Visitor | Customer | Agent | Admin |
|----------------------------|---------|----------|-------|-------|
| View public properties     | ✅      | ✅       | ✅    | ✅    |
| View property detail       | ✅      | ✅       | ✅    | ✅    |
| Submit property inquiry    | ✅      | ✅       | ✅    | ✅    |
| Favorite / unfavorite      | ❌      | ✅       | ✅    | ✅    |
| View own inquiries/favorites| ❌    | ✅       | ✅    | ✅    |
| Create property            | ❌      | ❌       | ✅*   | ✅    |
| Edit own property          | ❌      | ❌       | ✅    | ✅    |
| Delete property            | ❌      | ❌       | ❌    | ✅    |
| Publish/unpublish property | ❌      | ❌       | ✅*   | ✅    |
| View leads (all)           | ❌      | ❌       | ❌    | ✅    |
| View own/assigned leads    | ❌      | ❌       | ✅    | ✅    |
| Create/edit booking        | ❌      | ✅       | ✅*   | ✅    |
| Confirm booking            | ❌      | ❌       | ✅    | ✅    |
| Manage users               | ❌      | ❌       | ❌    | ✅    |
| View system reports        | ❌      | ❌       | ❌    | ✅    |
| Manage AI settings         | ❌      | ❌       | ❌    | ✅    |

\* Agents can only create/edit/publish properties they own; admins can act on any.

### Implementation
- Middleware (`authenticate`, `authorize`) checks JWT role and resource ownership.
- Routes protected by role‑based guards; ownership checked in services (e.g., PropertyService ensures `agentId` matches JWT sub for agent‑owned resources).
- Super‑admin flag bypasses ownership checks.

### Validation
- Role JWT claim must be one of `visitor`, `customer`, `agent`, `admin`.
- For agent‑owned resources, validate that JWT `sub` matches the resource owner ID.

### Dependencies
- **UserService** (to fetch full user record if needed)
- Middleware layer (auth + role)
- Database: `users` table includes `role` column.

### Events
- `permission.denied` – logged when authorization fails (for audit).
- `role.changed` – when admin changes a user’s role.

### Error Handling
- Authorization failures: return 403 with message “Insufficient permissions”.
- Authentication failures: return 401.

---

## Validation (Cross‑Cutting)

### Input Validation
- All API endpoints validate request payloads using a schema library (e.g., Zod, Joi).
- Validation occurs at controller level before reaching service layer.
- Error responses: 400 with array of `{field, message}`.

### Data Integrity
- Database constraints: unique indexes (email, slug where applicable), foreign keys with cascades where appropriate.
- Soft delete pattern: `deletedAt` timestamp; queries filter `WHERE deletedAt IS NULL` unless admin.
- Timestamps: `createdAt` and `updatedAt` managed by ORM (Prisma).

### Security
- HTTP headers: set `Helmet` equivalents (X‑Frame‑Options, CSP, HSTS).
- CORS: restrict to trusted origins.
- Rate limiting: per‑IP and per‑user where applicable (auth endpoints, search).
- SQL/NoSQL injection prevented by ORM/parameterized queries.
- Passwords: bcrypt salt + hash.
- Tokens: JWT signed with strong secret (HS256) or RS256; refresh tokens stored hashed.
- File uploads: validate MIME type, size, scan for malware (future).
- API versioning: prefix `/api/v1/` to allow future evolution.

### Logging & Monitoring
- Structured JSON logs: timestamp, level, service, message, traceId.
- Error logs include stack trace (non‑production may sanitize).
- Access logs: request method, path, userId, status, response time.
- Metrics: request latency, error rates, DB query times (via Prometheus middleware).
- Health checks: `/health` endpoint returns 200 if DB, cache, and external services reachable.

---
*End of Business Rules Document*