# Backend Functional Specification

This document details the functional behavior, components, and interactions of each backend module in the Property Vista CRM MVP. It serves as a reference for backend development, testing, and maintenance.

---

## 1. Authentication Module

### Responsibilities
- User registration, login, logout, token refresh, password recovery.
- Issuing and validating JWT access and refresh tokens.
- Enforcing role-based access control (RBAC).

### Services
- **AuthService**: Handles user registration, login, logout, token generation/refresh, password reset.
- **TokenService**: Generates, validates, and revokes JWT tokens.
- **UserService**: Manages user profile data (read/write) linked to authentication.

### Controllers
- **AuthController**: Exposes REST endpoints:
  - `POST /auth/register` – User registration
  - `POST /auth/login` – User login
  - `POST /auth/logout` – User logout
  - `POST /auth/refresh` – Refresh access token
  - `POST /auth/forgot-password` – Initiate password reset
  - `POST /auth/reset-password` – Reset password with token
  - `GET /auth/verify-email/:token` – Verify email address

### Validation
- Registration: Email (unique, RFC-unique, RFC-5322), password (min 8 chars, at least one letter and one number), name (required, max 100), role (enum: customer, agent).
- Login: Email/username and password required.
- Password reset: Token valid (signed, not expired), new password meets policy.
- Email verification: Token valid and not used before.

### Dependencies
- UserService (for user lookup/creation)
- TokenService (for JWT operations)
- EmailService (for sending verification/reset emails)
- Database: `users` table (Prisma model)

### Events
- `user.registered` – After successful registration (triggers welcome email).
- `user.login` – On successful login (audit log).
- `user.logout` – On logout (token invalidation).
- `token.issued` – On token creation.
- `token.refresh` – On refresh token use.
- `password.reset` – After password reset.
- `email.verified` – After email verification.

### Error Handling
- Validation errors: Return 400 with field-specific messages.
- Authentication failures: Return 401 (invalid credentials) or 403 (account locked/unverified email).
- Token errors: Return 401 (invalid/expired token).
- Rate limiting: After too many failed attempts, return 429 with retry-after header.
- Unexpected errors: Return 500 with generic message; log full stack trace internally.

---

## 2. Property Management Module

### Responsibilities
- CRUD operations for property listings.
- Managing property status (draft, published, archived).
- Handling property media (images, documents).
- Enforcing ownership and permission checks.

### Services
- **PropertyService**: Core logic for create, read, update, delete, publish/unpublish.
- **MediaService**: Handles upload, storage, deletion of property images/files.
- **SearchService**: Indexes properties for search (integrates with search engine or uses DB full-text).
- **FavoriteService**: Manages user-favorite property relationships.

### Controllers
- **PropertyController**:
  - `GET /properties` – List with filters, pagination.
  - `GET /properties/:id` – Get single property.
  - `POST /properties` – Create (admin/agent).
  - `PATCH /properties/:id` – Update (partial).
  - `DELETE /properties/:id` – Soft delete or hard delete.
  - `PATCH /properties/:id/publish` – Toggle published flag.
  - `POST /properties/:id/media` – Upload images.
  - `DELETE /properties/:id/media/:mediaId` – Delete media.

### Validation
- Creation/Update: Required fields present and correct type.
- Price: Decimal > 0, configurable max (e.g., 10,000,000).
- Location: Non-empty string; if structured, validate sub-fields (street, city, postal code, country).
- Media: File type (jpeg/png) and size (<=5 MB) validated before upload.
- Slug (if auto-generated from title) must be unique; if manual, must be unique and URL-safe.

### Dependencies
- UserService (to check roles/permissions)
- MediaService (for file handling)
- SearchService (to update search index)
- FavoriteService (to clean up favorites on delete/archive)
- Database: `properties`, `property_media` tables

### Events
- `property.created` – After successful creation.
- `property.updated` – On update.
- `property.published` – When status changed to published.
- `property.unpublished` – When status changed to draft/archived.
- `property.deleted` – On soft/hard delete.
- `property.media.uploaded` – After media upload.
- `property.media.deleted` – After media removal.
- `property.search.indexed` – After indexing in search service.

### Error Handling
- Validation errors: 400 with details.
- Authorization errors: 403 if user lacks rights.
- Not found: 404 if property ID invalid or archived (for non-admin).
- Media upload errors: 400 for invalid type/size; 500 for storage failure.
- Unexpected errors: 500 with internal logging.

---

## 3. Booking Module

### Responsibilities
- Managing property viewing appointments (site visits) and booking requests.
- Coordinating between customers, agents, and properties.
- Sending reminders and notifications for upcoming bookings.

### Services
- **BookingService**: Create, retrieve, update, delete bookings; handle status transitions.
- **NotificationService**: Send emails/SMS for booking confirmation, reminders, cancellations.
- **CalendarService** (optional): Integrate with external calendars (Google/Outlook).

### Controllers
- **BookingController**:
  - `POST /bookings` – Create a booking request.
  - `GET /bookings` – List bookings (with filters for user/property/date range).
  - `GET /bookings/:id` – Get single booking.
  - `PATCH /bookings/:id` – Update (e.g., reschedule, cancel).
  - `DELETE /bookings/:id` – Delete booking.
  - `POST /bookings/:id/confirm` – Agent confirms booking.
  - `POST /bookings/:id/complete` – Mark as completed after visit.

### Validation
- Customer ID exists and is a customer (or visitor with temporary ID).
- Agent ID exists and has role `agent` or `admin`.
- Property ID exists and is published.
- Start time before end time; duration configurable (default 60 minutes).
- No overlapping bookings for the same agent (configurable buffer, e.g., 15 minutes).
- Required fields: customerId, agentId, propertyId, startTime.

### Dependencies
- UserService (validate customer/agent roles)
- PropertyService (verify property exists and is published)
- NotificationService (send emails/SMS)
- BookingService (core logic)
- Database: `bookings` table

### Events
- `booking.created` – After booking request.
- `booking.confirmed` – When agent confirms.
- `booking.reminder.sent` – When reminder notification sent.
- `booking.completed` – After visit marked completed.
- `booking.canceled` – When canceled by either party.
- `booking.no_show` – If not confirmed/completed by start time.

### Error Handling
- Validation errors: 400.
- Authorization: 403 if user tries to modify another’s booking without rights.
- Conflict: 409 if double-booking detected.
- Not found: 404.
- Unexpected: 500.

---

## 4. Payments Module

### Responsibilities
- Processing payments for services (e.g., premium listings, booking deposits).
- Integrating with payment gateway (Stripe/PayPal).
- Recording transaction history and issuing receipts.

### Services
- **PaymentService**: Communicates with payment gateway, creates payment intents, verifies webhooks.
- **InvoiceService**: Generates invoices for payments due.
- **WebhookHandler**: Processes asynchronous events from gateway (payment succeeded/failed).

### Controllers
- **PaymentController**:
  - `POST /payment-intent` – Create payment intent for a given amount and currency.
  - `POST /payment/confirm` – Confirm payment with client-side token.
  - `GET /payments/:id` – Get transaction details.
  - `POST /webhook/stripe` – Endpoint for Stripe webhooks (similarly for PayPal).

### Validation
- Amount: Integer > 0, within configurable limits (min $1, max $10,000 in cents).
- Currency: Must be supported enum (USD primary).
- Payment method ID: Valid format from gateway (if using tokenized flow).
- Metadata: Must include relevant IDs (propertyId, bookingId, userId) for reconciliation.

### Dependencies
- PaymentGateway (Stripe SDK/PayPal SDK)
- UserService (to fetch user details for receipt)
- PropertyService (to update premium status)
- BookingService (to update booking deposit)
- Database: `payments`, `transactions` tables

### Events
- `payment.intent.created` – After creating intent.
- `payment.succeeded` – After webhook confirms successful charge.
- `payment.failed` – After webhook confirms failure.
- `payment.refunded` – After refund processed.
- `invoice.generated` – After invoice creation.
- `webhook.received` – When webhook endpoint called.

### Error Handling
- Validation errors: 400.
- Gateway errors: Relay error code/message; map to 402 (payment required) or 502 (bad gateway) as appropriate.
- Webhook signature verification failure: 400.
- Unexpected errors: 500; log gateway response for debugging.

---

## 5. Notifications Module

### Responsibilities
- Creating, storing, and delivering system-generated notifications to users.
- Supporting real-time delivery via WebSocket and fallback to polling.
- Allowing users to mark as read, delete, and configure preferences.

### Services
- **NotificationService**: Core CRUD for notifications; calculates unread counts.
- **DeliveryService**: Sends notifications via WebSocket (if connected) and stores for later polling.
- **PreferenceService**: Manages user notification preferences (channels, frequency).

### Controllers
- **NotificationController**:
  - `GET /notifications` – List with filters (unread only, pagination).
  - `POST /notifications` – Create a notification (internal use; external via service calls).
  - `PATCH /notifications/:id` – Mark as read/unread.
  - `DELETE /notifications/:id` – Delete single.
  - `POST /notifications/read-all` – Mark all as read.
  - `DELETE /notifications` – Delete all (if allowed).

### Validation
- Creation: RecipientId must exist; type must be from allowed enum; title and message required (max lengths).
- Update: ID must exist and belong to requesting user (or admin for moderation).
- Deletion: Same as update.

### Dependencies
- UserService (validate recipient)
- WebSocketManager (maintain active connections)
- Database: `notifications` table
- Optional: Redis for caching unread counts
- EmailService/SMSService (if delivering via those channels)

### Events
- `notification.created` – After persisting.
- `notification.delivered.realtime` – When sent via WebSocket.
- `notification.delivered.poll` – When fetched via polling (optional metric).
- `notification.read` – When marked as read.
- `notification.deleted` – When deleted.
- `notification.preferences.updated` – When user changes settings.

### Error Handling
- Validation errors: 400.
- Authorization: 403 if user accesses another’s notifications.
- Not found: 404.
- Unexpected: 500.

---

## 6. AI Search Module

### Responsibilities
- Providing natural-language property search using external LLM (Anthropic Claude).
- Transforming user queries into structured search parameters.
- Returning ranked results with explainability scores.
- Caching frequent queries to reduce latency and cost.

### Services
- **SearchQueryService**: Parses free-text query into structured filters (price range, beds, etc.) using LLM prompts.
- **SearchRankingService**: Scores properties based on match to query and returns explanations.
- **SearchCacheService** (Optional): Redis-based caching of query results for TTL (e.g., 5 minutes).
- **FallbackService**: Switches to traditional DB-based full-text/filter search when LLM is unavailable or returns error.

### Controllers
- **SearchController**:
  - `GET /search` – Perform AI-powered search (query param `q`, optional `source=ai`).
  - `GET /search/suggest` – Autocomplete suggestions as user types.

### Validation
- Query string: Required, trimmed, max 200 characters.
- For fallback search: Validate any additional filter params (price, beds, etc.) as per property search rules.
- LLM output schema validation: Ensures numeric ranges sensible (min ≤ max) and values within allowed enumerations.

### Dependencies
- LLMClient (wrapper around Anthropic Claude API)
- PropertyService (to fetch property details for results)
- SearchEngine (or DB query builder)
- SearchCacheService (Redis)
- FallbackService (traditional search)
- RateLimiter (middleware)
- Database: `search_logs` table (optional)

### Events
- `search.query.received` – Upon receiving request.
- `search.llm.success` – After successful LLM parsing.
- `search.llm.failed` – When LLM errors or returns invalid output.
- `search.fallback.used` – When falling back to traditional search.
- `search.results.returned` – Before sending response.

### Error Handling
- Validation errors: 400.
- LLM service errors: 502 (bad gateway) with message “AI search temporarily unavailable”.
- Unexpected errors: 500.
- Fallback search errors: Propagate as 500 if DB/search engine fails.

---

## 7. Favorites Module

### Responsibilities
- Allowing users to save and unsave properties they like.
- Providing quick access to favorite listings.
- Preventing duplicate favorites.

### Services
- **FavoriteService**: Add/remove favorite relationships; retrieve user’s favorites.

### Controllers
- **FavoriteController**:
  - `POST /favorites` – Add a property to favorites (body: `{propertyId}`).
  - `DELETE /favorites/:propertyId` – Remove a property from favorites.
  - `GET /favorites` – List paginated favorites for the current user.

### Validation
- Creation: `propertyId` must exist and be a published property (or accessible to the user based on role).
- Deletion: `propertyId` must exist in the user’s favorites list.

### Dependencies
- UserService (authenticate user)
- PropertyService (verify property existence and status)
- Database: `favorites` table (userId, propertyId, createdAt)

### Events
- `favorite.added` – After successful addition.
- `favorite.removed` – After removal.
- `favorite.cleanup` – When orphaned favorites removed (cascade on property delete/archive).

### Error Handling
- Validation errors: 400.
- Authorization: 403 if not authenticated.
- Not found: 404 if property does not exist or not favorited.
- Unexpected: 500.

---

## 8. Reports Module

### Responsibilities
- Generating administrative and operational reports (sales, leads, property performance).
- Exporting data in CSV, Excel, or PDF formats.
- Supporting scheduled report generation and email delivery.

### Services
- **ReportService**: Core logic for data aggregation and formatting.
- **ExportService**: Converts data to CSV/XLSX/PDF.
- **SchedulerService** (Optional): Triggers report generation at configured intervals (cron-like).
- **EmailService**: Sends generated reports to recipients.

### Controllers
- **ReportController**:
  - `GET /reports/sales` – Sales summary (optional date range).
  - `GET /reports/leads` – Lead conversion funnel.
  - `GET /reports/property-views` – Property popularity.
  - `GET /reports/users` – User growth and activity.
  - `POST /reports/export` – Request export with format and filters.
  - `GET /reports/scheduled` – List configured scheduled reports.
  - `POST /reports/scheduled` – Create a new scheduled report.

### Validation
- Date range: Start ≤ end; both valid dates.
- Format: Must be one of `csv`, `xlsx`, `pdf`.
- Filters: Depend on report type; validated against allowed columns and operators.
- For scheduled reports: Frequency must be supported cron expression; recipients must be valid email addresses.

### Dependencies
- UserService (role check)
- PropertyService, LeadService, PaymentService (for data fetching)
- ExportService (CSV/XLSX/PDF generation)
- SchedulerService (if using in-app scheduler)
- EmailService (for delivery)
- Database: Relevant tables for joins

### Events
- `report.generated` – After successful generation.
- `report.exported` – After export file created.
- `report.scheduled.triggered` – When a scheduled report runs.
- `report.email.sent` – After email delivery.
- `report.error` – If generation/export fails.

### Error Handling
- Validation errors: 400.
- Authorization: 403 if user lacks rights.
- Export errors: 500 if generation fails (e.g., memory, permissions).
- Email delivery failures: 500 (but retry via SchedulerService).
- Unexpected: 500.

---

## 9. Permissions (RBAC) - Cross-Cutting

### Responsibilities
- Enforcing role-based access control across all modules.
- Managing user roles and permissions.

### Implementation
- Middleware (`authenticate`, `authorize`) checks JWT role and resource ownership.
- Routes protected by role-based guards; ownership checked in services (e.g., PropertyService ensures `agentId` matches JWT sub for agent-owned resources).
- Super-admin flag bypasses ownership checks.

### Validation
- Role JWT claim must be one of `visitor`, `customer`, `agent`, `admin`.
- For agent-owned resources, validate that JWT `sub` matches the resource owner ID.

### Dependencies
- UserService (to fetch full user record if needed)
- Middleware layer (auth + role)
- Database: `users` table includes `role` column.

### Events
- `permission.denied` – Logged when authorization fails (for audit).
- `role.changed` – When admin changes a user’s role.

### Error Handling
- Authorization failures: Return 403 with message “Insufficient permissions”.
- Authentication failures: Return 401.

---

## Cross-Cutting Concerns

### Validation
- All API endpoints validate request payloads using a schema library (e.g., Zod, Joi).
- Validation occurs at controller level before reaching service layer.
- Error responses: 400 with array of `{field, message}`.

### Data Integrity
- Database constraints: Unique indexes (email, slug where applicable), foreign keys with cascades where appropriate.
- Soft delete pattern: `deletedAt` timestamp; queries filter `WHERE deletedAt IS NULL` unless admin.
- Timestamps: `createdAt` and `updatedAt` managed by ORM (Prisma).

### Security
- HTTP headers: Set `Helmet` equivalents (X-Frame-Options, CSP, HSTS).
- CORS: Restrict to trusted origins.
- Rate limiting: Per-IP and per-user where applicable (auth endpoints, search).
- SQL/NoSQL injection prevented by ORM/parameterized queries.
- Passwords: Bcrypt salt + hash.
- Tokens: JWT signed with strong secret (HS256) or RS256; refresh tokens stored hashed.
- File uploads: Validate MIME type, size, scan for malware (future).
- API versioning: Prefix `/api/v1/` to allow future evolution.

### Logging & Monitoring
- Structured JSON logs: Timestamp, level, service, message, traceId.
- Error logs include stack trace (non-production may sanitize).
- Access logs: Request method, path, userId, status, response time.
- Metrics: Request latency, error rates, DB query times (via Prometheus middleware).
- Health checks: `/health` endpoint returns 200 if DB, cache, and external services reachable.

---
*End of Backend Functional Specification Document*