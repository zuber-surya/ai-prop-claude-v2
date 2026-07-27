# Sprint Plan

This document organizes implementation tasks into logical 2-week sprints based on the phased approach defined in PHASE_ROADMAP.md and IMPLEMENTATION_PLAN.md.

Each sprint includes:
- Sprint Goal
- Features to be implemented
- Specific Tasks (from TASKS.md)
- Deliverables
- Risks
- Dependencies
- Acceptance Criteria
- Definition of Ready
- Definition of Done

## Sprint 1: Foundation & Setup (Phase 0)

**Sprint Goal**: Establish the foundational infrastructure, development environment, and authentication system.

**Features**:
- Project initialization and monorepo structure
- Development tooling setup (TypeScript, ESLint, Prettier, Husky)
- Database initialization and core schema
- Authentication system (registration, login, JWT)
- Basic error handling and logging

**Tasks**:
- T001: Monorepo structure created with frontend, backend, and shared directories
- T002: Root package.json with workspaces configured
- T003: TypeScript configuration established
- T004: ESLint and Prettier configured
- T005: Husky hooks initialized
- T006: Project structure committed to repository
- T007: Linting and formatting run successfully on empty project
- T008: Project structure committed to repository (duplicate - likely should be removed or clarified)
- T009: Linting and formatting run successfully on empty project (duplicate)
- T010: Development environment setup documented
- T011: User can register with valid email/password
- T012: Email verification sent and functional
- T013: User can log in and receive access/refresh tokens
- T014: Protected routes return 401 without token
- T015: Refresh token rotation works
- T016: Password reset flow operational
- T017: All auth endpoints return appropriate error codes (400, 401, 422)
- T018: Auth service implemented with unit tests (≥90% coverage)
- T019: Auth controller implemented with integration tests
- T020: All auth endpoints return correct status codes and responses
- T021: JWT token generation and validation working
- T022: Password hashing using bcrypt
- T023: Email verification flow implemented
- T024: Password reset flow implemented
- T025: Centralized error handling catches and formats all errors
- T026: Request logging implemented for all endpoints
- T027: Input validation rejects malformed requests with 400 status
- T028: CORS configured appropriately for frontend origins
- T029: Basic security headers implemented
- T030: Error handling middleware implemented
- T031: Request logging middleware implemented
- T032: Validation middleware using Zod
- T033: Security headers configured
- T034: CORS properly configured
- T035: Unit tests for middleware components
- T036: PostgreSQL database connected successfully
- T037: Prisma ORM configured and initialized
- T038: Initial migration for users table created and applied
- T039: Database connection pooling configured
- T040: Prisma client accessible throughout application
- T041: Database configuration files committed
- T042: Initial Prisma schema created
- T043: First migration generated and applied
- T044: Database connection tested and working
- T045: Prisma client singleton pattern implemented
- T046: Database utilities module created

**Deliverables**:
- Initial commit with project structure
- Working auth API and UI
- Documentation updated (API spec, DB design, coding standards)
- CI pipeline running lint, unit tests on PR
- Development environment setup guide
- Docker configuration (if applicable)

**Risks**:
- Environment setup delays due to tooling compatibility issues
- Database connection problems in development environment
- Authentication security vulnerabilities if not properly implemented
- Delays in setting up CI/CD pipeline

**Dependencies**: None (foundational sprint)

**Acceptance Criteria**:
- User can register with valid email/password
- Email verification sent and functional
- User can log in and receive access/refresh tokens
- Protected routes return 401 without token
- Refresh token rotation works
- Password reset flow operational
- All auth endpoints return appropriate error codes (400, 401, 422)
- Unit tests for auth service and controllers
- E2E smoke test for login/register flow

**Definition of Ready**:
- All prerequisites for development environment are installed (Node.js, PostgreSQL, etc.)
- Team has access to repository and necessary credentials
- Project requirements and specifications are clearly defined
- Development tools and licenses are available

**Definition of Done**:
- All tasks in the sprint are completed and tested
- Code is reviewed and approved by team lead
- Documentation is updated to reflect changes
- CI/CD pipeline is successfully running tests
- Acceptance criteria are met and verified
- No critical bugs remain in the implemented functionality

---

## Sprint 2: Core Property Catalog & Search (Phase 1 - Part 1)

**Sprint Goal**: Implement the core property catalog functionality including property listing, basic filtering, and property details.

**Features**:
- Property model and database schema
- Basic property CRUD operations (read-only for public)
- Property listing with pagination
- Basic filtering by price, beds, baths
- Property detail page

**Tasks**:
- T063: Property and property_media tables created via migration
- T064: Property service implemented with business logic
- T065: Property controller implemented with all CRUD endpoints
- T066: Unit tests for property service (≥90% coverage)
- T067: Integration tests for property endpoints
- T068: API specification updated
- T069: Database design documentation updated
- T070: Validation rules implemented and tested
- T071: Unauthenticated users can view published properties list
- T072: Filtering works correctly (combined range filters, text search)
- T073: Pagination loads additional pages without duplication
- T074: Empty state handled gracefully when no results
- T075: Loading states displayed during data fetching
- T076: Property list API endpoint implemented with filtering
- T077: Frontend property list component with filter sidebar
- T078: Responsive grid layout (desktop) and list layout (mobile)
- T079: Pagination or infinite scroll implemented
- T080: Filter component with price sliders, dropdowns, checkboxes
- T081: Unit tests for filtering logic
- T082: Integration tests for list endpoint with various filter combinations
- T083: Performance: page loads < 2s on 3G simulated
- T084: Property detail shows all required fields (title, price, beds, baths, area, description, location)
- T085: Property media gallery displays all images with primary image first
- T086: Agent contact information displayed (name, phone, email if available)
- T087: Inquiry CTA button prominent and functional
- T088: Unpublished properties show 404 to non-owners/admins
- T089: Property detail page route and component implemented
- T090: Property gallery/carousel component with zoom capability
- T091: Property information displayed in organized sections
- T092: Agent contact card with click-to-call/email functionality
- T093: Inquiry modal integration (reuse from Feature 2.3)
- T094: SEO meta tags dynamically set based on property data
- T095: Responsive layout: detailed view on desktop, stacked on mobile
- T096: Unit tests for property detail component
- T097: Integration tests for detail endpoint

**Deliverables**:
- Functional property catalog with search
- Updated API spec and DB design docs
- UI screens implemented per specs
- Test coverage ≥80% for new backend endpoints
- Storybook entries for core components (optional)
- Demo data seed script

**Risks**:
- Database schema design issues requiring revisions
- Performance issues with property listings as data grows
- Complexity in implementing proper filtering logic
- Challenges with media upload and storage implementation

**Dependencies**:
- Sprint 1 (Foundation & Setup) must be complete

**Acceptance Criteria**:
- Unauthenticated users can view published properties list and details
- Filtering works correctly (combined range filters, text search)
- Pagination loads additional pages without duplication
- Empty state handled gracefully when no results
- Loading states displayed during data fetching
- Property list API endpoint implemented with filtering
- Frontend property list component with filter sidebar
- Responsive grid layout (desktop) and list layout (mobile)
- Pagination or infinite scroll implemented
- Filter component with price sliders, dropdowns, checkboxes
- Property detail shows all required fields
- Property media gallery displays all images with primary image first
- Agent contact information displayed
- Inquiry CTA button prominent and functional
- Unpublished properties show 404 to non-owners/admins
- Property detail page route and component implemented
- Property gallery/carousel component with zoom capability
- Property information displayed in organized sections
- Agent contact card with click-to-call/email functionality
- Inquiry modal integration
- SEO meta tags dynamically set based on property data
- Responsive layout: detailed view on desktop, stacked on mobile
- Unit tests for property detail component
- Integration tests for detail endpoint
- Performance: page loads < 2s on 3G simulated

**Definition of Ready**:
- Sprint 1 completed and approved
- Property requirements and specifications clearly defined
- Database schema finalized
- API contracts agreed upon
- UI/UX designs reviewed and approved

**Definition of Done**:
- All tasks in the sprint are completed and tested
- Code is reviewed and approved by team lead
- Documentation is updated to reflect changes
- Acceptance criteria are met and verified
- Performance benchmarks met (page loads < 2s on 3G simulated)
- No critical bugs remain in the implemented functionality
- Test coverage meets minimum requirements (≥80% for backend endpoints)

---

## Sprint 3: Core Property Catalog & Search (Phase 1 - Part 2)

**Sprint Goal**: Complete the property catalog functionality with media handling, AI search integration, and SEO optimization.

**Features**:
- Property media upload and management
- AI-powered search with fallback mechanism
- SEO optimization and metadata handling
- Advanced filtering and search capabilities

**Tasks**:
- T098: AI search returns ranked results with explainability icons
- T099: Fallback works when AI service unavailable
- T100: Search suggestions provided based on query input
- T101: Clear indication when AI search is being used vs fallback
- T102: Error handling for AI service failures
- T103: Search service implemented with AI integration and fallback logic
- T104: Search controller with search and suggest endpoints
- T105: Frontend search bar with debounce and AI placeholder text
- T106: Search results display with property cards and explainability badges
- T107: Loading states for AI processing
- T108: Error UI when AI service unavailable (fallback notification)
- T109: Unit tests for search service logic
- T110: Integration tests for search endpoints
- T111: Performance: search results returned within 2s (excluding actual AI latency)
- T112: E2E test: search → filter → open detail → verify data
- T113: Users can upload property images during creation/edit
- T114: Images display correctly in property gallery
- T115: Primary image designated and shown first
- T116: Images can be reordered, captioned, or removed
- T117: Optimized image serving (thumbnails, responsive sizes)
- T118: Media service implemented with upload/storage logic
- T119: Media controller with CRUD endpoints for property media
- T120: Frontend media upload component (drag & drop or file selector)
- T121: Image optimization (thumbnails, responsive srcset)
- T122: Gallery/slider component for property media display
- T123: Media deletion with confirmation
- T124: Unit tests for media service
- T125: Integration tests for media endpoints
- T126: Storage cleanup on property deletion
- T127: Unique, descriptive title tags on all property pages
- T128: Meta descriptions that encourage click-through
- T129: Open graph tags for social sharing
- T130: JSON-LD structured data for properties
- T131: Clean, readable URL structure
- T132: Canonical tags to prevent duplicate content
- T133: Dynamic meta tags implemented based on page content
- T134: Open graph tags for property sharing
- T135: JSON-LD structured data for property listings and details
- T136: SEO-friendly URL routes (no query strings in paths where possible)
- T137: Sitemap.xml generation (dynamic or static)
- T138: Robots.txt configured appropriately
- T139: Lighthouse SEO audit passes
- T140: Unit tests for SEO metadata generation

**Deliverables**:
- Functional property catalog with search
- Updated API spec and DB design docs
- UI screens implemented per specs
- Test coverage ≥80% for new backend endpoints
- Storybook entries for core components (optional)
- Demo data seed script

**Risks**:
- AI service integration complexity and reliability issues
- Media storage and retrieval performance problems
- SEO implementation complexity
- Image processing and optimization challenges

**Dependencies**:
- Sprint 2 must be complete

**Acceptance Criteria**:
- AI search returns ranked results with explainability icons
- Fallback works when AI service unavailable
- Search suggestions provided based on query input
- Clear indication when AI search is being used vs fallback
- Error handling for AI service failures
- Search service implemented with AI integration and fallback logic
- Search controller with search and suggest endpoints
- Frontend search bar with debounce and AI placeholder text
- Search results display with property cards and explainability badges
- Loading states for AI processing
- Error UI when AI service unavailable (fallback notification)
- Unit tests for search service logic
- Integration tests for search endpoints
- Performance: search results returned within 2s (excluding actual AI latency)
- E2E test: search → filter → open detail → verify data
- Users can upload property images during creation/edit
- Images display correctly in property gallery
- Primary image designated and shown first
- Images can be reordered, captioned, or removed
- Optimized image serving (thumbnails, responsive sizes)
- Media service implemented with upload/storage logic
- Media controller with CRUD endpoints for property media
- Frontend media upload component (drag & drop or file selector)
- Image optimization (thumbnails, responsive srcset)
- Gallery/slider component for property media display
- Media deletion with confirmation
- Unit tests for media service
- Integration tests for media endpoints
- Storage cleanup on property deletion
- Unique, descriptive title tags on all property pages
- Meta descriptions that encourage click-through
- Open graph tags for social sharing
- JSON-LD structured data for properties
- Clean, readable URL structure
- Canonical tags to prevent duplicate content
- Dynamic meta tags implemented based on page content
- Open graph tags for property sharing
- JSON-LD structured data for property listings and details
- SEO-friendly URL routes (no query strings in paths where possible)
- Sitemap.xml generation (dynamic or static)
- Robots.txt configured appropriately
- Lighthouse SEO audit passes
- Unit tests for SEO metadata generation

**Definition of Ready**:
- Sprint 2 completed and approved
- Media requirements clearly defined
- AI service API credentials available
- SEO requirements specified
- UI designs for media components approved

**Definition of Done**:
- All tasks in the sprint are completed and tested
- Code is reviewed and approved by team lead
- Documentation is updated to reflect changes
- Acceptance criteria are met and verified
- Performance benchmarks met (search results < 2s excluding AI latency)
- No critical bugs remain in the implemented functionality
- Test coverage meets minimum requirements (≥80% for backend endpoints)
- SEO audit passes

---

## Sprint 4: User Roles, Profiles & Basic Interactions (Phase 2 - Part 1)

**Sprint Goal**: Implement role-based access control, user profile management, and basic user interactions.

**Features**:
- Role-based access control (RBAC) system
- User profile management
- Authentication middleware with role checking
- Basic user interface components

**Tasks**:
- T154: Role-based middleware blocks unauthorized access (e.g., customer cannot access `/admin`)
- T155: Agents can access agent-only routes
- T156: Admins can access all routes
- T157: Visitors limited to public routes
- T158: Proper 403 responses for unauthorized access attempts
- T159: RBAC middleware implemented
- T160: Route protection applied to all relevant endpoints
- T161: Role extraction from JWT verified
- T162: Unit tests for RBAC middleware
- T163: Integration tests for route protection
- T164: API documentation updated with role requirements
- T165: Error handling for insufficient permissions
- T166: Users can view their own profile information
- T167: Users can update their profile details
- T168: Profile changes reflected immediately and persistently
- T169: Validation prevents invalid profile data
- T170: Only profile owner can modify their profile
- T171: User service with profile get/update methods
- T172: User controller with profile endpoints
- T173: Frontend profile page with edit form
- T174: Profile data loaded from JWT/user ID
- T175: Form validation with client-server parity
- T176: Success/error handling for profile updates
- T177: Unit tests for user service
- T178: Integration tests for profile endpoints
- T179: E2E test: register → update profile → verify changes persist
- T180: Users can toggle favorite status on properties
- T181: Favorite state persists across sessions (when authenticated)
- T182: Favorites page shows grid of favorited properties with property details
- T183: Unauthenticated users can use session-based favorites (MVP limitation)
- T184: Favorite count/badge updates in real-time
- T185: Favorite service with add/remove/list methods
- T186: Favorite controller with endpoints
- T187: Frontend favorite button component (heart icon toggle)
- T188: Favorites page component with property grid
- T189: Favorite count in header/navbar
- T190: Session-based fallback for unauthenticated users (MVP)
- T191: Unit tests for favorite service
- T192: Integration tests for favorite endpoints
- T193: E2E test: register → favorite property → view favorites → remove favorite
- T194: Users can submit property inquiries from various contexts
- T195: Inquiry form creates a lead with correct association to property
- T196: Agents/admins can view list of leads, filter by status, see details
- T197: Lead status can be updated (new → contacted → etc.)
- T198: Unauthenticated users can submit inquiry (lead created without user_id)
- T199: Validation on all forms (required fields, email/phone format)
- T200: Lead service with create/list/update/delete methods
- T201: Lead controller with all endpoints
- T202: Inquiry modal component (reusable across contexts)
- T203: Leads index page with filtering and sorting
- T204: Lead detail page with conversation view and action buttons
- T205: Lead status update functionality
- T206: Email notification placeholder (to be expanded in Epic 5)
- T207: Unit tests for lead service
- T208: Integration tests for lead endpoints
- T209: E2E test: register as agent → favorite a property → send inquiry → view lead in agent dashboard

**Deliverables**:
- RBAC middleware and role protection
- Profile and favorites CRUD
- Lead/inquiry system
- Updated docs (API spec, DB design)
- Test suites

**Risks**:
- Complexity in implementing proper role-based access control
- JWT token management and security issues
- Session management complexities for unauthenticated users
- Data validation and security vulnerabilities

**Dependencies**:
- Sprint 3 must be complete

**Acceptance Criteria**:
- Role-based middleware blocks unauthorized access (e.g., customer cannot access `/admin`)
- Agents can access agent-only routes
- Admins can access all routes
- Visitors limited to public routes
- Proper 403 responses for unauthorized access attempts
- RBAC middleware implemented
- Route protection applied to all relevant endpoints
- Role extraction from JWT verified
- Unit tests for RBAC middleware
- Integration tests for route protection
- API documentation updated with role requirements
- Error handling for insufficient permissions
- Users can view their own profile information
- Users can update their profile details
- Profile changes reflected immediately and persistently
- Validation prevents invalid profile data
- Only profile owner can modify their profile
- User service with profile get/update methods
- User controller with profile endpoints
- Frontend profile page with edit form
- Profile data loaded from JWT/user ID
- Form validation with client-server parity
- Success/error handling for profile updates
- Unit tests for user service
- Integration tests for profile endpoints
- E2E test: register → update profile → verify changes persist
- Users can toggle favorite status on properties
- Favorite state persists across sessions (when authenticated)
- Favorites page shows grid of favorited properties with property details
- Unauthenticated users can use session-based favorites (MVP limitation)
- Favorite count/badge updates in real-time
- Favorite service with add/remove/list methods
- Favorite controller with endpoints
- Frontend favorite button component (heart icon toggle)
- Favorites page component with property grid
- Favorite count in header/navbar
- Session-based fallback for unauthenticated users (MVP)
- Unit tests for favorite service
- Integration tests for favorite endpoints
- E2E test: register → favorite property → view favorites → remove favorite
- Users can submit property inquiries from various contexts
- Inquiry form creates a lead with correct association to property
- Agents/admins can view list of leads, filter by status, see details
- Lead status can be updated (new → contacted → etc.)
- Unauthenticated users can submit inquiry (lead created without user_id)
- Validation on all forms (required fields, email/phone format)
- Lead service with create/list/update/delete methods
- Lead controller with all endpoints
- Inquiry modal component (reusable across contexts)
- Leads index page with filtering and sorting
- Lead detail page with conversation view and action buttons
- Lead status update functionality
- Email notification placeholder (to be expanded in Epic 5)
- Unit tests for lead service
- Integration tests for lead endpoints
- E2E test: register as agent → favorite a property → send inquiry → view lead in agent dashboard

**Definition of Ready**:
- Sprint 3 completed and approved
- Role requirements and permissions clearly defined
- JWT authentication approach finalized
- UI designs for profile and favorites components approved
- Lead/inquiry requirements specified

**Definition of Done**:
- All tasks in the sprint are completed and tested
- Code is reviewed and approved by team lead
- Documentation is updated to reflect changes
- Acceptance criteria are met and verified
- No critical bugs remain in the implemented functionality
- Test coverage meets minimum requirements
- Security review passes for authentication and authorization components

---

## Sprint 5: Booking & Appointment Management (Phase 3 - Part 1)

**Sprint Goal**: Implement the core booking system including booking creation, basic management, and calendar functionality.

**Features**:
- Booking model and database schema
- Booking creation from property details
- Basic booking management (confirm, cancel, complete)
- Simple calendar view for agents
- Booking status lifecycle management

**Tasks**:
- T210: Customer can request a booking for a published property
- T211: Agent receives notification of booking request
- T212: Booking includes property, agent, customer, and timing details
- T213: Validation prevents invalid booking requests
- T214: Booking service with create method
- T215: Booking controller with create endpoint
- T216: Booking modal component with datetime picker
- T217: Form validation for booking request
- T218: Integration with property and user data
- T219: Agent notification triggered on booking request
- T220: Unit tests for booking service
- T221: Integration tests for booking creation endpoint
- T222: E2E test: customer requests booking → agent sees notification
- T223: Agent can view, confirm, reschedule, cancel, or mark booking as completed
- T224: System prevents double‑booking for same agent (within a buffer, e.g., 15 minutes) via validation
- T225: Booking status transitions enforced (cannot skip from requested to completed without confirmation)
- T226: Timestamps stored in UTC; displayed in user's timezone
- T227: Related data populated (property info, agent/customer names)
- T228: Booking service with management methods
- T229: Booking controller with all management endpoints
- T230: Booking detail page with property/agent/customer info
- T231: Action buttons for confirm, reschedule, complete, cancel
- T232: Rescheduling interface with conflict detection
- T233: Status transition validation and enforcement
- T234: Timezone conversion for display
- T235: Related data enrichment (property, agent, customer details)
- T236: Unit tests for booking service
- T237: Integration tests for booking management endpoints
- T238: E2E test: customer books → agent confirms → customer sees confirmed status → agent marks complete
- T239: Agent can view upcoming bookings in calendar format
- T240: Calendar shows booked time slots as unavailable
- T241: Available slots clearly marked for new bookings
- T242: System prevents double‑booking for same agent (within buffer) via validation
- T243: Calendar view loads within reasonable time (<1s for a month)
- T244: Booking service with availability checking methods
- T245: Availability endpoint for agent date queries
- T246: Frontend calendar component (week/day views)
- T247: Time slot selection with conflict prevention
- T248: Property booking details visible on slot click
- T249: Upcoming bookings widget for dashboard
- T250: Buffer time enforcement (e.g., 15 min between bookings)
- T251: Unit tests for availability service
- T252: Integration tests for calendar and availability endpoints
- T253: Performance: calendar loads < 1s for monthly view
- T254: E2E test: agent views calendar → sees booking → verifies no double-booking possible

**Deliverables**:
- Booking entity and API
- Calendar UI (basic)
- Workflow endpoints with role guards
- Integration with property and user data
- Tests covering happy and error paths

**Risks**:
- Complexity in implementing conflict detection and prevention
- Timezone handling challenges
- Calendar UI implementation complexity
- Booking workflow state management

**Dependencies**:
- Sprint 4 must be complete

**Acceptance Criteria**:
- Customer can request a booking for a published property
- Agent receives notification of booking request
- Booking includes property, agent, customer, and timing details
- Validation prevents invalid booking requests
- Booking service with create method
- Booking controller with create endpoint
- Booking modal component with datetime picker
- Form validation for booking request
- Integration with property and user data
- Agent notification triggered on booking request
- Unit tests for booking service
- Integration tests for booking creation endpoint
- E2E test: customer requests booking → agent sees notification
- Agent can view, confirm, reschedule, cancel, or mark booking as completed
- System prevents double‑booking for same agent (within a buffer, e.g., 15 minutes) via validation
- Booking status transitions enforced (cannot skip from requested to completed without confirmation)
- Timestamps stored in UTC; displayed in user's timezone
- Related data populated (property info, agent/customer names)
- Booking service with management methods
- Booking controller with all management endpoints
- Booking detail page with property/agent/customer info
- Action buttons for confirm, reschedule, complete, cancel
- Rescheduling interface with conflict detection
- Status transition validation and enforcement
- Timezone conversion for display
- Related data enrichment (property, agent, customer details)
- Unit tests for booking service
- Integration tests for booking management endpoints
- E2E test: customer books → agent confirms → customer sees confirmed status → agent marks complete
- Agent can view upcoming bookings in calendar format
- Calendar shows booked time slots as unavailable
- Available slots clearly marked for new bookings
- System prevents double‑booking for same agent (within buffer) via validation
- Calendar view loads within reasonable time (<1s for a month)
- Booking service with availability checking methods
- Availability endpoint for agent date queries
- Frontend calendar component (week/day views)
- Time slot selection with conflict prevention
- Property booking details visible on slot click
- Upcoming bookings widget for dashboard
- Buffer time enforcement (e.g., 15 min between bookings)
- Unit tests for availability service
- Integration tests for calendar and availability endpoints
- Performance: calendar loads < 1s for monthly view
- E2E test: agent views calendar → sees booking → verifies no double-booking possible

**Definition of Ready**:
- Sprint 4 completed and approved
- Booking requirements and workflow clearly defined
- Calendar/UI designs approved
- Database schema for bookings finalized
- API contracts agreed upon

**Definition of Done**:
- All tasks in the sprint are completed and tested
- Code is reviewed and approved by team lead
- Documentation is updated to reflect changes
- Acceptance criteria are met and verified
- No critical bugs remain in the implemented functionality
- Test coverage meets minimum requirements
- Performance benchmarks met (calendar loads < 1s for monthly view)

---

## Sprint 6: Payments & Premium Listings (Phase 4)

**Sprint Goal**: Implement payment processing with Stripe integration and premium listing functionality.

**Features**:
- Stripe payment integration
- Premium property listings
- Payment webhook handling
- Invoice/receipt generation
- Payment history tracking

**Tasks**:
- T269: Payments are created via secure Stripe integration; no raw card data touches our servers
- T270: Successful payment updates property.is_premium and sets premium_until (now + duration)
- T271: Failed payments do not alter property status and return appropriate error
- T272: Webhook verifies signature and updates payment status reliably
- T273: Idempotency keys prevent duplicate charges
- T274: Payment service with Stripe integration
- T275: Payment controller with intent creation and confirmation endpoints
- T276: Frontend payment form using Stripe Elements
- T277: Secure payment processing (no card data touches servers)
- T278: Webhook endpoint for Stripe events
- T279: Payment success/failure handling and UI
- T280: Unit tests for payment service
- T281: Integration tests using Stripe test mode/mocks
- T282: API tests with mocked Stripe responses
- T283: E2E test: upgrade property to premium → verify badge appears → after expiry, premium removed
- T284: Successful payment updates property.is_premium and sets premium_until (now + duration)
- T285: Users can view payment history with status and amounts
- T286: Premium badge visible on premium properties in lists and details
- T287: Premium filter shows only active premium properties
- T288: Expired premium properties revert to regular status
- T289: Premium listing service with activation/expiry logic
- T290: Premium toggle endpoint with payment verification
- T291: Frontend premium badge component and display logic
- T292: Payment history page for users
- T293: Agent dashboard premium upgrade button
- T294: Property listing filter for premium properties
- T295: Automatic premium expiry handling (cron job or on-access check)
- T296: Unit tests for premium listing service
- T297: Integration tests for premium endpoints
- T298: E2E test: payment success → premium activated → badge visible → time travel → premium expired

**Deliverables**:
- Payment integration with Stripe (or PayPal)
- Premium listing functionality
- Webhook handler
- Payment history UI
- Full test suite (unit, API, simulated E2E)
- Documentation updates (API spec, security notes)

**Risks**:
- Stripe API integration complexity and error handling
- Security concerns with payment processing
- Webhook reliability and signature verification
- Premium expiry handling edge cases
- PCI compliance considerations

**Dependencies**:
- Sprint 5 must be complete

**Acceptance Criteria**:
- Payments are created via secure Stripe integration; no raw card data touches our servers
- Successful payment updates property.is_premium and sets premium_until (now + duration)
- Failed payments do not alter property status and return appropriate error
- Webhook verifies signature and updates payment status reliably
- Idempotency keys prevent duplicate charges
- Refunds (if implemented) revert premium flag or return funds
- Users can view payment history with status and amounts
- Premium badge visible on premium properties in lists and details
- Premium filter shows only active premium properties
- Expired premium properties revert to regular status
- Premium listing service with activation/expiry logic
- Premium toggle endpoint with payment verification
- Frontend premium badge component and display logic
- Payment history page for users
- Agent dashboard premium upgrade button
- Property listing filter for premium properties
- Automatic premium expiry handling (cron job or on-access check)
- Unit tests for premium listing service
- Integration tests for premium endpoints
- E2E test: payment success → premium activated → badge visible → time travel → premium expired

**Definition of Ready**:
- Sprint 5 completed and approved
- Stripe account and API keys available (test mode)
- Payment flow and requirements clearly defined
- UI designs for payment components approved
- Security requirements reviewed

**Definition of Done**:
- All tasks in the sprint are completed and tested
- Code is reviewed and approved by team lead
- Documentation is updated to reflect changes
- Acceptance criteria are met and verified
- No critical bugs remain in the implemented functionality
- Test coverage meets minimum requirements
- Security review passes for payment processing components
- Tested with Stripe test keys in development; ensure no real charges

---

## Sprint 7: Notifications & Real-Time Updates (Phase 5)

**Sprint Goal**: Implement notification system with real-time updates and email/SMS fallback.

**Features**:
- Notification creation and management
- Real-time WebSocket/SSE connections
- Notification UI (bell icon, dropdown, center)
- Email/SMS notification fallback
- Notification preferences and settings

**Tasks**:
- T311: When a relevant event occurs (new lead assigned, booking confirmed, payment succeeded, etc.), a notification is created and sent to the appropriate user(s)
- T312: Users can view their notifications in a list
- T313: Users can mark notifications as read/unread
- T314: Users can delete notifications
- T315: Unread badge shows accurate count
- T316: Notification payload includes sufficient data to link to entity (type and ID)
- T317: Notification service with CRUD methods
- T318: Notification controller with all endpoints
- T319: Frontend notification center page with list and filters
- T320: Notification dropdown component in header with unread badge
- T321: Read/unread toggle functionality
- T322: Bulk actions (mark all read, delete all)
- T323: Unit tests for notification service
- T324: Integration tests for notification endpoints
- T325: E2E test: create a lead as visitor → agent assigned → notification appears in agent's bell → click → navigate to lead detail
- T326: Unread badge updates in real‑time via WebSocket/SSE
- T327: Clicking a notification marks it as read and optionally navigates to the related entity
- T328: Real-time connection recovers after temporary network loss
- T329: Users see notifications appear instantly when triggered
- T330: Notification center updates in real-time without manual refresh
- T331: Real-time connection service implemented
- T332: Authentication for WebSocket/SSE connections
- T333: Notification broadcasting to specific users
- T334: Frontend real-time listeners for notification updates
- T335: Unread badge updates in real-time
- T336: Notification center real-time list updates
- T337: Connection recovery after network interruption
- T338: Unit tests for real-time service
- T339: Integration tests for real-time notification delivery
- T340: E2E test: trigger event → see real-time notification → interact with notification
- T341: Email/SMS fallback sends messages for critical events (configurable)
- T342: Users can configure email/SMS preferences
- T343: Critical events trigger email/SMS when enabled
- T344: Notification content personalized with relevant data
- T345: Opt-out compliance respected
- T346: Email notification service (SendGrid/SMTP template)
- T347: SMS notification service (Twilio template)
- T348: Notification service extension for email/SMS triggering
- T349: User notification preferences page
- T350: Template personalization with notification/event data
- T351: Rate limiting and throttling implementation
- T352: Unit tests for email/SMS services
- T353: Integration tests for notification gateway
- T354: Configuration for providers using test/dev credentials
- T355: E2E test: critical event occurs → email/SMS sent → user receives message

**Deliverables**:
- Notification entity and API
- Real‑time connection (WebSocket/SSE)
- UI notification center and bell dropdown
- Integration with event triggers (via service layer)
- Tests covering creation, delivery, UI updates

**Risks**:
- Real-time connection reliability and scalability
- WebSocket/SSE implementation complexity
- Email/SMS service integration and deliverability
- Notification flooding and performance issues
- Security concerns with real-time connections

**Dependencies**:
- Sprint 6 must be complete

**Acceptance Criteria**:
- When a relevant event occurs (new lead assigned, booking confirmed, payment succeeded, etc.), a notification is created and sent to the appropriate user(s)
- Users can view their notifications in a list
- Users can mark notifications as read/unread
- Users can delete notifications
- Unread badge shows accurate count
- Notification payload includes sufficient data to link to entity (type and ID)
- Notification service with CRUD methods
- Notification controller with all endpoints
- Frontend notification center page with list and filters
- Notification dropdown component in header with unread badge
- Read/unread toggle functionality
- Bulc actions (mark all read, delete all)
- Unit tests for notification service
- Integration tests for notification endpoints
- E2E test: create a lead as visitor → agent assigned → notification appears in agent's bell → click → navigate to lead detail
- Unread badge updates in real‑time via WebSocket/SSE
- Clicking a notification marks it as read and optionally navigates to the related entity
- Real-time connection recovers after temporary network loss
- Users see notifications appear instantly when triggered
- Notification center updates in real-time without manual refresh
- Real-time connection service implemented
- Authentication for WebSocket/SSE connections
- Notification broadcasting to specific users
- Frontend real-time listeners for notification updates
- Unread badge updates in real-time
- Notification center real-time list updates
- Connection recovery after network interruption
- Unit tests for real-time service
- Integration tests for real-time notification delivery
- E2E test: trigger event → see real-time notification → interact with notification
- Email/SMS fallback sends messages for critical events (configurable)
- Users can configure email/SMS preferences
- Critical events trigger email/SMS when enabled
- Notification content personalized with relevant data
- Opt-out compliance respected
- Email notification service (SendGrid/SMTP template)
- SMS notification service (Twilio template)
- Notification service extension for email/SMS triggering
- User notification preferences page
- Template personalization with notification/event data
- Rate limiting and throttling implementation
- Unit tests for email/SMS services
- Integration tests for notification gateway
- Configuration for providers using test/dev credentials
- E2E test: critical event occurs → email/SMS sent → user receives message

**Definition of Ready**:
- Sprint 6 completed and approved
- Notification requirements and workflow clearly defined
- Real-time technology choice made (WebSocket vs SSE)
- UI designs for notification components approved
- Email/SMS provider accounts configured (test credentials)

**Definition of Done**:
- All tasks in the sprint are completed and tested
- Code is reviewed and approved by team lead
- Documentation is updated to reflect changes
- Acceptance criteria are met and verified
- No critical bugs remain in the implemented functionality
- Test coverage meets minimum requirements
- Real-time connection reliability tested
- Email/SMS fallback functionality verified

---

## Sprint 8: Admin Dashboard & Management (Phase 6)

**Sprint Goal**: Implement admin dashboard with KPIs, management capabilities, and system settings.

**Features**:
- Admin dashboard with KPI visualization
- User, property, lead, booking, and payment management
- System and AI settings management
- Reporting and export functionality
- Activity logging and audit trails

**Tasks**:
- T356: Admin can view KPIs that update periodically (or on refresh)
- T357: Admin can search/filter users, properties, leads, bookings, payments
- T358: Admin can perform CRUD operations on each entity with proper authorization
- T359: Non-admin users redirected or receive 403 for admin routes
- T360: Admin role changes require admin confirmation and are logged
- T361: Admin RBAC middleware implemented
- T362: Route protection applied to all admin endpoints
- T363: Admin role verification from JWT
- T364: Unit tests for admin authorization middleware
- T365: Integration tests for admin route protection
- T366: API documentation updated with admin role requirements
- T367: Error handling for insufficient admin privileges
- T368: Admin can view KPIs that update periodically (or on refresh)
- T369: Activity feed shows recent system activities
- T370: Charts display accurate data for selected time periods
- T371: KPI cards show meaningful metrics (leads today, conversion rate, etc.)
- T372: Dashboard loads within reasonable time
- T373: Dashboard service with data aggregation methods
- T374: Dashboard controller with endpoint implementations
- T375: Frontend dashboard layout with KPI row, activity feed, charts
- T376: KPI card component with value, label, trend indicator
- T377: Chart components for pie, line, bar charts
- T378: Activity feed item component
- T379: Data caching strategy for performance
- T380: Unit tests for dashboard service
- T381: Integration tests for dashboard endpoints
- T382: E2E test: admin login → view dashboard → verify data accuracy
- T383: Admin can search/filter users by role, status, name, email
- T384: Admin can view user details (excluding sensitive data)
- T385: Admin can edit user details (role, status, contact info)
- T386: Admin can reset user passwords (generates reset link)
- T387: Admin can delete users (soft delete preserves data)
- T388: Admin can change user roles (with confirmation)
- T389: Role changes are logged for audit trail
- T390: User admin service with CRUD methods (admin-specific logic)
- T391: User admin controller with endpoints
- T392: Frontend users management table with filtering, sorting, pagination
- T393: Edit user modal/form with validation
- T394: Role change modal with confirmation and logging
- T395: Password reset functionality (email-based)
- T396: Soft delete implementation with restore option
- T397: Unit tests for user admin service
- T398: Integration tests for user admin endpoints
- T399: E2E test: admin login → manage users → edit role → reset password → delete user
- T400: Admin can search/filter properties by status, price, agent, location, etc.
- T401: Admin can view all properties including draft/unpublished
- T402: Admin can edit property details
- T403: Admin can perform bulk actions (publish/unpublish/delete) on selected properties
- T404: Bulk actions show success/error counts
- T405: Property admin service with CRUD and bulk methods
- T406: Property admin controller with endpoints
- T407: Frontend properties management table with advanced filtering
- T408: Edit property form with all fields and validation
- T409: Media management integration (upload, reorder, delete)
- T410: Bulk action success/error reporting
- T411: Unit tests for property admin service
- T412: Integration tests for property admin endpoints
- T413: E2E test: admin login → manage properties → bulk publish → verify public listing
- T414: Admin can search/filter leads, bookings, payments by various criteria
- T415: Admin can view detailed information for each entity type
- T416: Admin can perform CRUD operations (where applicable)
- T417: Admin can initiate refunds for payments (if applicable)
- T418: Admin can request data exports (CSV/XML)
- T419: Export progress tracking available
- T420: Lead, booking, payment admin services with CRUD methods
- T421: Corresponding admin controllers with endpoints
- T422: Endpoints with endpoints
- T423: Frontend management tables for each entity type with filtering
- T424: E2E test: admin login → manage users → edit role → reset password → delete user

**Deliverables**:
- Admin UI with dashboard and management sections
- Role‑based middleware protecting admin routes
- API endpoints for admin operations
- Export and reporting features
- Tests covering admin flows
- Documentation updates

**Risks**:
- Complexity in implementing role-based access control for admin functions
- Performance issues with large datasets in admin views
- Data export functionality complexity and reliability
- Security concerns with admin privileges and access
- UI complexity for managing multiple entity types

**Dependencies**:
- Sprint 7 must be complete

**Acceptance Criteria**:
- Admin can view KPIs that update periodically (or on refresh)
- Admin can search/filter users, properties, leads, bookings, payments
- Admin can perform CRUD operations on each entity with proper authorization
- Non-admin users redirected or receive 403 for admin routes
- Admin role changes require admin confirmation and are logged
- Admin RBAC middleware implemented
- Route protection applied to all admin endpoints
- Admin role verification from JWT
- Unit tests for admin authorization middleware
- Integration tests for admin route protection
- API documentation updated with admin role requirements
- Error handling for insufficient admin privileges
- Admin can view KPIs that update periodically (or on refresh)
- Activity feed shows recent system activities
- Charts display accurate data for selected time periods
- KPI cards show meaningful metrics (leads today, conversion rate, etc.)
- Dashboard loads within reasonable time
- Dashboard service with data aggregation methods
- Dashboard controller with endpoint implementations
- Frontend dashboard layout with KPI row, activity feed, charts
- KPI card component with value, label, trend indicator
- Chart components for pie, line, bar charts
- Activity feed item component
- Data caching strategy for performance
- Unit tests for dashboard service
- Integration tests for dashboard endpoints
- E2E test: admin login → view dashboard → verify data accuracy
- Admin can search/filter users by role, status, name, email
- Admin can view user details (excluding sensitive data)
- Admin can edit user details (role, status, contact info)
- Admin can reset user passwords (generates reset link)
- Admin can delete users (soft delete preserves data)
- Admin can change user roles (with confirmation)
- Role changes are logged for audit trail
- User admin service with CRUD methods (admin-specific logic)
- User admin controller with endpoints
- Frontend users management table with filtering, sorting, pagination
- Edit user modal/form with validation
- Role change modal with confirmation and logging
- Password reset functionality (email-based)
- Soft delete implementation with restore option
- Unit tests for user admin service
- Integration tests for user admin endpoints
- E2E test: admin login → manage users → edit role → reset password → delete user
- Admin can search/filter properties by status, price, agent, location, etc.
- Admin can view all properties including draft/unpublished
- Admin can edit property details
- Admin can perform bulk actions (publish/unpublish/delete) on selected properties
- Bulk actions show success/error counts
- Property admin service with CRUD and bulk methods
- Property admin controller with endpoints
- Frontend properties management table with advanced filtering
- Edit property form with all fields and validation
- Media management integration (upload, reorder, delete)
- Bulk action success/error reporting
- Unit tests for property admin service
- Integration tests for property admin endpoints
- E2E test: admin login → manage properties → bulk publish → verify public listing
- Admin can search/filter leads, bookings, payments by various criteria
- Admin can view detailed information for each entity type
- Admin can perform CRUD operations (where applicable)
- Admin can initiate refunds for payments (if applicable)
- Admin can request data exports (CSV/XML)
- Export progress tracking available
- Lead, booking, payment admin services with CRUD methods
- Corresponding admin controllers with endpoints
- Endpoints with endpoints
- Frontend management tables for each entity type with filtering
- E2E test: admin login → manage users → edit role → reset password → delete user

**Definition of Ready**:
- Sprint 7 completed and approved
- Admin requirements and workflows clearly defined
- UI designs for admin dashboard and management components approved
- Reporting and export requirements specified
- API contracts for admin endpoints agreed upon

**Definition of Done**:
- All tasks in the sprint are completed and tested
- Code is reviewed and approved by team lead
- Documentation is updated to reflect changes
- Acceptance criteria are met and verified
- No critical bugs remain in the implemented functionality
- Test coverage meets minimum requirements
- Security review passes for admin components
- Performance benchmarks met for dashboard loading

---

## Sprint 9: AI Chatbot & Advanced Search (Phase 7)

**Sprint Goal**: Implement AI-powered chatbot and advanced search capabilities.

**Features**:
- AI chatbot for natural language property search and assistance
- Conversational UI with message streaming
- Advanced search with filtering, sorting, and saved searches
- Context-aware conversation and action triggering
- Usage tracking and admin oversight

**Tasks**:
- T421: User can open chat widget and type natural language queries like "Show me 3‑bedroom homes under $400k in Brooklyn"
- T422: Assistant replies with a list of property cards that match the criteria, each including a short explanation why it matches (e.g., "3 bedrooms, price $380k")
- T423: Follow‑up questions keep context: after seeing results, user says "add a garage" → filters updated accordingly
- T424: User can click "View" on a property card in chat to navigate to its detail page
- T425: User can click "Save" to add to favorites; confirmation appears
- T426: User can click "Schedule" to open booking modal with property pre‑filled
- T427: If AI service returns error or is unavailable, system shows a friendly message and suggests using filter search
- T428: Rate limiting: after N requests per minute, user receives "Please slow down" message
- T429: Usage tracking: admin can see total tokens used today, requests count, estimated cost
- T430: Saved searches appear under "My searches" and can be re‑run with one click
- T431: Search results can be sorted by price low/high, date new/old, relevance
- T432: Accessibility: keyboard navigable, ARIA labels on chat input/button, message roles
- T433: Unit tests for chat service (prompt building, tool invocation, context handling)
- T434: API tests for chat endpoint with mocked AI
- T435: E2E test: open chat → ask for 2‑bed under $300k → receive list → click view on first → navigate to correct property detail → verify details match query
- T436: Performance: first response < 2s (excluding actual LLM latency) under normal load
- T437: Fallback test: disable AI microservice → query returns filter‑based results with banner
- T438: Persistent chat widget (bottom‑right) and/or dedicated chat page
- T439: Message streaming (SSE or WebSocket) for real‑time bot responses
- T440: Bot understands intents: property search, property details, schedule viewing, save favorite, get agent contact, general help
- T441: Context‑aware conversation: remembers recent properties shown, user preferences
- T442: Ability to show property cards within chat with action buttons (View, Save, Schedule)
- T443: Fallback to filter‑based search when AI service unavailable or over quota
- T444: Input validation, rate limiting, and usage tracking per user
- T445: Admin dashboard for AI usage metrics (tokens, requests, cost)
- T446: Saved searches: users can save a query and re‑run or get alerts for new matches
- T447: Search sorting options: price (low/high), date (new/old), relevance (AI score)
- T448: Saved favorites accessible from chat ("Show my saved properties")
- T449: Create `search_logs` table (if not already) for analytics (id, query_text, parsed_filters, results_count, source, ip_address, user_agent, created_at)
- T450: Create `saved_searches` table (id, user_id, name, query_text, parsed_filters, created_at, updated_at, deleted_at)
- T451: Add optional column `last_searched_at` to users (or derive from search_logs)
- T452: Ensure proper indexes: search_logs(created_at), source, user_id; saved_searches(user_id)
- T453: `POST /chat/message` – send user message, receive assistant reply (streaming optional)
- T454: `GET /chat/messages?stream=true` – SSE endpoint for streaming response (alternative: use POST with Accept: text/event-stream)
- T455: `GET /search/saved` – list user's saved searches
- T456: `POST /search/saved` – create saved search (body: {name, query})
- T457: `DELETE /saved-searches/:id` – delete saved search
- T458: `GET /search/suggest?q=` – autosuggest (enhanced with saved queries?)
- T459: `POST /search` – advanced search with filters, sort, page, limit (non‑AI)
- T460: GET /search/` (as before) – AI search with explanation
- T461: `GET /usage/ai` – admin endpoint for AI usage stats (requests, tokens, estimated cost)
- T462: `POST /usage/ai/reset` – reset counters (admin)
- T463: Chat widget (collapsible panel) with input area, message list, send button
- T464: Chat page (`/chat`) – full‑screen variant
- T465: Message bubbles: user and bot (with avatars, timestamps)
- T466: Bot message may contain: text, property cards (with mini‑actions), suggestions chips
- T467: Input box with placeholder, voice input button (optional)
- T468: Saved searches modal/list
- T469: Search filters sidebar (price, beds, baths, property type, location, sort)
- T470: Search results page with sorting dropdown and saved‑search shortcut
- T471: Admin AI usage dashboard (charts, tables)
- T472: MessageBubble (with props for sender, content type)
- T473: ActionButton (icon+text) inside bot message for quick actions
- T474: SuggestionChip (clickable to insert text into input)
- T475: PropertyCardSmall (compact version for chat)
- T476: Carousel of property cards (if multiple results)
- T477: Timer/typing indicator
- T478: Scrollable message container with auto‑scroll to bottom
- T479: InputBox with resize, send on Enter, cog for settings
- T480: Modal for saved search creation
- T481: FilterPanel (reusable from Phase 1)
- T482: SortDropdown
- T483: EmptyState for no results
- T484: UsageChart (line/bar for token consumption)
- T485: MetricCard (value, label)

**Deliverables**:
- Chatbot UI widget and/or dedicated page
- Backend service orchestrating LLM calls, tool use, and conversation history
- Streaming response implementation
- Prompt management and fallback logic
- Usage tracking and admin oversight
- Saved search functionality
- Enhanced search with sorting and filtering
- Tests (unit, API, E2E)
- Documentation updates (AI_CONTEXT.md, API spec)

**Risks**:
- AI service integration complexity and reliability
- Conversation state management challenges
- Rate limiting and abuse prevention
- Token usage monitoring and cost control
- Security concerns with AI API key handling
- Performance impact of AI processing

**Dependencies**:
- Sprint 8 must be complete

**Acceptance Criteria**:
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
- Persistent chat widget (bottom‑right) and/or dedicated chat page
- Message streaming (SSE or WebSocket) for real‑time bot responses
- Bot understands intents: property search, property details, schedule viewing, save favorite, get agent contact, general help
- Context‑aware conversation: remembers recent properties shown, user preferences
- Ability to show property cards within chat with action buttons (View, Save, Schedule)
- Fallback to filter‑based search when AI service unavailable or over quota
- Input validation, rate limiting, and usage tracking per user
- Admin dashboard for AI usage metrics (tokens, requests, cost)
- Saved searches: users can save a query and re‑run or get alerts for new matches
- Search sorting options: price (low/high), date (new/old), relevance (AI score)
- Saved favorites accessible from chat ("Show my saved properties")
- Create `search_logs` table (if not already) for analytics (id, query_text, parsed_filters, results_count, source, ip_address, user_agent, created_at)
- Create `saved_searches` table (id, user_id, name, query_text, parsed_filters, created_at, updated_at, deleted_at)
- Add optional column `last_searched_at` to users (or derive from search_logs)
- Ensure proper indexes: search_logs(created_at), source, user_id; saved_searches(user_id)
- `POST /chat/message` – send user message, receive assistant reply (streaming optional)
- `GET /chat/messages?stream=true` – SSE endpoint for streaming response (alternative: use POST with Accept: text/event-stream)
- `GET /search/saved` – list user's saved searches
- `POST /search/saved` – create saved search (body: {name, query})
- `DELETE /saved-searches/:id` – delete saved search
- `GET /search/suggest?q=` – autosuggest (enhanced with saved queries?)
- `POST /search` – advanced search with filters, sort, page, limit (non‑AI)
- GET /search/` (as before) – AI search with explanation
- `GET /usage/ai` – admin endpoint for AI usage stats (requests, tokens, estimated cost)
- `POST /usage/ai/reset` – reset counters (admin)
- Chat widget (collapsible panel) with input area, message list, send button
- Chat page (`/chat`) – full‑screen variant
- Message bubbles: user and bot (with avatars, timestamps)
- Bot message may contain: text, property cards (with mini‑actions), suggestions chips
- Input box with placeholder, voice input button (optional)
- Saved searches modal/list
- Search filters sidebar (price, beds, baths, property type, location, sort)
- Search results page with sorting dropdown and saved‑search shortcut
- Admin AI usage dashboard (charts, tables)
- MessageBubble (with props for sender, content type)
- ActionButton (icon+text) inside bot message for quick actions
- SuggestionChip (clickable to insert text into input)
- PropertyCardSmall (compact version for chat)
- Carousel of property cards (if multiple results)
- Timer/typing indicator
- Scrollable message container with auto‑scroll to bottom
- InputBox with resize, send on Enter, cog for settings
- Modal for saved search creation
- FilterPanel (reusable from Phase 1)
- SortDropdown
- EmptyState for no results
- UsageChart (line/bar for token consumption)
- MetricCard (value, label)

**Definition of Ready**:
- Sprint 8 completed and approved
- AI service API credentials available
- Chatbot requirements and conversation flows clearly defined
- UI designs for chat components approved
- Search and filtering requirements specified
- Saved searches functionality defined

**Definition of Done**:
- All tasks in the sprint are completed and tested
- Code is reviewed and approved by team lead
- Documentation is updated to reflect changes
- Acceptance criteria are met and verified
- No critical bugs remain in the implemented functionality
- Test coverage meets minimum requirements
- Security review passes for AI components
- Performance benchmarks met (first response < 2s excluding LLM latency)
- AI integration thoroughly tested (various query types, edge cases)
- Usage tracking and limits functioning correctly

---

## Sprint 10: Polish, Performance, and Release Preparation (Phase 8)

**Sprint Goal**: Finalize UI/UX refinements, accessibility, SEO, and performance optimizations. Prepare for production release.

**Features**:
- Accessibility enhancements (WCAG 2.1 AA compliance)
- SEO optimization and meta tags
- Performance optimization (bundle size, loading times)
- Error handling and resilience improvements
- Internationalization foundation
- Animation and motion preferences
- Theme management (light/dark)
- Comprehensive testing and quality assurance
- Security auditing and hardening
- Documentation completion
- Release preparation and deployment pipeline

**Tasks**:
- T486: Accessibility audit (WCAG 2.1 AA) and fixes (focus traps, ARIA labels, color contrast)
- T487: SEO improvements: meta tags, open graph, structured data, sitemap.xml, robots.txt
- T488: Performance: lazy load images, code splitting, bundle analysis, caching headers
- T489: Error boundaries and graceful degradation (offline fallback, stale‑while‑revalidate)
- T490: Internationalization (i18n) foundation (placeholder for future)
- T491: Enhanced form validation (real‑time, debounced)
- T492: Animation and motion preferences (respect `prefers-reduced-motion`)
- T493: Dark mode toggle (if decided)
- T494: Comprehensive test suite: unit >90%, integration >80%, E2E critical paths
- T495: Security audit: dependency updates, penetration test (basic), OWASP checklist
- T496: Documentation: finalize all guides, onboard new developers
- T497: Release candidate build and staging deployment
- T498: All screens from previous passes, refined
- T499: Custom 404/500 pages with branding
- T500: Maintenance mode banner
- T501: Cookie consent placeholder (for GDPR/CCPA)
- T502: Accessible modal trap
- T503: Skip‑to‑content link
- T504: Language selector (stub)
- T505: Theme toggle (light/dark)
- T506: ErrorBoundary wrapper
- T507: SEOHead component (dynamic title, meta)
- T508: ToastContainer with pause on hover
- T509: FocusManager for modals
- T510: SkipLinks component at top of body
- T511: All WCAG 2.1 AA automated checks pass (using axe or similar)
- T512: Lighthouse score >90 for performance, accessibility, best practices, SEO on mobile and desktop
- T513: Bundle size < 150 KB gzip for JS (initial load)
- T514: First Contentful Paint < 1.5s on 3G
- T515: Time to Interactive < 3s on 3G
- T516: No critical security vulnerabilities in dependencies (npm audit)
- T517: All unit and integration tests pass; E2E passes on critical paths (auth, property flow, booking, payment, chat, admin)
- T518: Cross‑browser testing (Chrome, Firefox, Safari, Edge)
- T519: Regression test: previously closed bugs remain fixed
- T520: Release notes generated from commit history (conventional changelog)
- T521: Deployment pipeline produces Docker image (if applicable) and deploys to staging
- T522: Monitoring and alerting configured (uptime, error rates, response times)
- T523: Backup and disaster recovery plan (outlined)
- T524: Production‑ready codebase
- T525: Final documentation set (all knowledge_base files updated)
- T526: CI/CD pipeline configured for automated testing, building, and deployment
- T527: Release checklist and sign‑off sheet
- T528: Monitoring and alerting configured (uptime, error rates)
- T529: Backup and disaster recovery plan (outline)

**Deliverables**:
- Production‑ready codebase
- Final documentation set (all knowledge_base files updated)
- CI/CD pipeline configured for automated testing, building, and deployment
- Release checklist and sign‑off sheet
- Monitoring and alerting configured (uptime, error rates)
- Backup and disaster recovery plan (outline)

**Risks**:
- Accessibility compliance requiring significant rework
- Performance optimization challenges with complex features
- SEO implementation affecting existing functionality
- Security vulnerabilities discovered during audit
- Browser compatibility issues
- Release timeline slips due to unforeseen issues

**Dependencies**:
- Sprint 9 must be complete

**Acceptance Criteria**:
- Accessibility audit (WCAG 2.1 AA) and fixes (focus traps, ARIA labels, color contrast)
- SEO improvements: meta tags, open graph, structured data, sitemap.xml, robots.txt
- Performance: lazy load images, code splitting, bundle analysis, caching headers
- Error boundaries and graceful degradation (offline fallback, stale‑while‑revalidate)
- Internationalization (i18n) foundation (placeholder for future)
- Enhanced form validation (real‑time, debounced)
- Animation and motion preferences (respect `prefers-reduced-motion`)
- Dark mode toggle (if decided)
- Comprehensive test suite: unit >90%, integration >80%, E2E critical paths
- Security audit: dependency updates, penetration test (basic), OWASP checklist
- Documentation: finalize all guides, onboard new developers
- Release candidate build and staging deployment
- All screens from previous passes, refined
- Custom 404/500 pages with branding
- Maintenance mode banner
- Cookie consent placeholder (for GDPR/CCPA)
- Accessible modal trap
- Skip‑to‑content link
- Language selector (stub)
- Theme toggle (light/dark)
- ErrorBoundary wrapper
- SEOHead component (dynamic title, meta)
- ToastContainer with pause on hover
- FocusManager for modals
- SkipLinks component at top of body
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
- Production‑ready codebase
- Final documentation set (all knowledge_base files updated)
- CI/CD pipeline configured for automated testing, building, and deployment
- Release checklist and sign‑off sheet
- Monitoring and alerting configured (uptime, error rates)
- Backup and disaster recovery plan (outline)

**Definition of Ready**:
- Sprint 9 completed and approved
- All features implemented and tested
- Performance baselines established
- Accessibility requirements defined
- Security audit scope defined
- Release checklist prepared

**Definition of Done**:
- All tasks in the sprint are completed and tested
- Code is reviewed and approved by team lead
- Documentation is updated to reflect changes
- Acceptance criteria are met and verified
- No critical bugs remain in the implemented functionality
- Performance benchmarks achieved
- Accessibility compliance verified
- SEO best practices implemented
- Security audit passed
- All test suites passing (unit >90%, integration >80%, E2E critical paths)
- Release candidate validated in staging
- Documentation complete and accurate
- Deployment pipeline fully functional

## Sprint Planning Notes

1. **Sprint Duration**: Each sprint is planned for 2 weeks (10 business days)
2. **Team Capacity**: Estimated for a team of 2-3 developers
3. **Parallel Work**: Some tasks could potentially be worked on in parallel by different team members
4. **Buffer Time**: Consider adding buffer time for unexpected issues or dependencies
5. **Review Process**: Include time for code reviews, testing, and documentation updates in each sprint
6. **Continuous Integration**: Ensure CI/CD pipeline is set up early to catch issues quickly
7. **Demo & Review**: Plan for sprint reviews and demos at the end of each sprint to stakeholders

This sprint plan provides a structured approach to implementing the Property Vista CRM MVP, breaking down the work into manageable increments that deliver value early and frequently while managing risks and dependencies effectively.