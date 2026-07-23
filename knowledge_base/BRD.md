# Business Requirements Document (BRD)
## Property Website MVP

### Business Objectives
- Enable prospective buyers/renters to quickly browse property listings and get questions answered without waiting for human agents
- Provide business with a simple way to publish and manage property listings
- Ship a minimum viable product (MVP) consisting of:
  - Public property browsing and search functionality
  - AI-powered chatbot assistant for natural language property queries
  - Minimal admin tool for property listing management (CRUD operations)
- Establish foundation for future enhancements while maintaining strict scope discipline for MVP

### Stakeholders
- **Visitors/Public Users**: Individuals browsing properties, searching listings, and interacting with the AI chatbot (no login required for core functionality)
- **Administrators**: Users with `isAdmin = true` privilege responsible for creating, editing, and managing property listings through the admin interface
- **Business Owners/Product Stakeholders**: Entities requiring a simple, effective way to publish and manage property listings online
- **Development Team**: Engineers building the MVP following the phased approach defined in ROADMAP.md
- **Product Owner**: Authority responsible for scope decisions, including deferred items like login-gated features (PRD §2 note, FR2.4)

### Business Processes
1. **Property Browsing & Search (Public)**
   - Visitors browse paginated lists of published properties
   - Visitors filter results by price range, property type, bedrooms, and location
   - Visitors sort results by price (asc/desc) or date added
   - Visors view detailed property information including photos, description, specs, amenities, and location
   - Visitors toggle between list and map views (using OpenStreetMap + Leaflet.js)
   - System handles empty search results with guidance to broaden filters

2. **User Authentication**
   - Visitors register accounts using email and password
   - Registered users log in and log out
   - Authentication persists via session cookies
   - Note: Login does not gate any public-facing features in this MVP (open item for future phases)

3. **AI Chatbot Interaction (Q&A/Search Only)**
   - Visitors access chat widget on public site (available with or without login)
   - Users ask natural language questions about property listings
   - Chatbot responds with relevant answers referencing specific properties
   - Conversation maintains context within a single browser session
   - On AI failure, system shows graceful fallback message suggesting use of search filters
   - Chatbot never collects contact information or creates visitor records beyond chat logs
   - Chat requests are rate-limited per session/IP address

4. **Admin Property Management**
   - Administrators log in to access `/admin` interface
   - Admins create new property listings with all required details
   - Admins edit existing property listings
   - Admins delete or unpublish listings (unpublished properties hidden from public site)
   - System maintains only two property statuses: draft and published
   - Non-admin users attempting to access admin routes are blocked (403 or redirect to login)

### Functional Scope

**In-Scope Features (Per PRD §3 & UI_REFERENCE.md §3):**
- Property browsing with pagination, filtering, and sorting
- Property detail views
- Map-based property visualization (OSM + Leaflet.js)
- User registration, login, logout
- AI-powered natural language chatbot for property queries
- Session-based chat history (non-persistent across sessions)
- Admin property creation, editing, deletion, and publishing/unpublishing
- Status management (draft/published only)

**Explicitly Out of Scope (Per PRD §4 & ROADMAP.md Parking Lot):**
- Lead capture, CRM, or agent management features
- Recommendation engines or requirement profiling
- Notification systems (email/SMS/in-app)
- Visit scheduling or calendar features
- User favorites or saved searches
- Bulk upload/CSV import functionality
- Voice input capabilities
- Multi-city or multi-currency support
- Audit logging or visit tracking
- Agent commission tracking or lead pipelines
- Saved searches or search alerts
- Complex approval workflows for property publishing

### Business Rules
- **Data Storage & Format**
  - Property prices stored as integers in paise (INR smallest unit) to avoid floating-point precision issues
  - Only two property statuses supported: `draft` and `published`
  - Latitude and longitude coordinates stored as nullable floats to allow gradual geocoding
  - Amenities and photos stored as simple string arrays (no controlled vocabulary for MVP)
  - No foreign key relationship between Property and User entities (no ownership tracking)
  - Chat messages optionally linked to users but support anonymous sessions via sessionId
  - Hard delete only for properties - no soft delete/archive mechanism

- **User & Access Management**
  - Authentication via email/password only (no social login, email verification, or password reset in MVP)
  - No public features require authentication in this MVP
  - Admin access strictly enforced via server-side `isAdmin` validation
  - Anonymous chat sessions supported via sessionId without requiring user login
  - Passwords hashed using bcrypt/argon2 - never stored or logged in plaintext

- **Chatbot Behavior**
  - Natural language queries processed against property data to generate responses
  - Responses may reference specific property IDs for frontend display
  - Chatbot explicitly prohibited from collecting contact information or creating lead/CRM records
  - Graceful degradation to search filter suggestions when AI service unavailable
  - Rate limiting applied per session/IP address to control API costs and prevent abuse
  - Conversation history maintained only for single browser session (no cross-session persistence)

- **API & Data Access**
  - Public property endpoints return only `status = published` listings
  - Admin property endpoints return all listings regardless of status
  - Standardized JSON request/response format with consistent error structure
  - Session-based authentication via cookies (not bearer tokens)
  - Admin routes return 403 for logged-in non-admins, 401 for anonymous users
  - Latitude/longitude may be null for ungeocoded listings - frontend handles gracefully in map view
  - Geographic coordinates may be populated asynchronously via geocoding after record creation

### Constraints

**Non-Functional Requirements (Per NFR.md):**
- **Performance**
  - Public pages server-rendered for fast first paint and SEO benefits
  - Listing images optimized and served responsively (Next.js Image or equivalent)
  - Property search results returned in under ~1 second against seeded data sets (hundreds to low thousands of records)
  - Chatbot responses streamed when supported by Anthropic API for progressive user experience

- **Availability & Error Handling**
  - System remains fully functional (browse/search/detail pages) during AI provider downtime/slowness
  - Admin operation failures display clear error messages rather than silent failures
  - No formal uptime SLA required for this pre-launch/internal build MVP
  
- **Security**
  - Passwords hashed using bcrypt/argon2 - never stored or transmitted in plaintext
  - Admin-protected routes enforced via server-side middleware/route checks (not just UI hiding)
  - Comprehensive input validation and sanitization applied to all form inputs and chat endpoint
  - No personally identifiable information (PII) collected beyond email and password
  - All secrets (API keys, database credentials, etc.) managed exclusively via environment variables
  - No sensitive data committed to repository

- **Cost & Abuse Prevention**
  - Chat endpoint rate-limited per session/IP address to control Anthropic API usage and costs
  - Login/register endpoints rate-limited to mitigate brute-force and credential-stuffing attempts
  - Rate limiting thresholds configurable via environment variables without code changes
  - No enforced budget cap, but tunable rate limits provide cost control mechanism

- **SEO & Visibility**
  - All public pages server-rendered to enable search engine indexing
  - Each page features appropriate title tags and meta descriptions generated from property data
  - Simple XML sitemap generated for published property URLs
  - Structured data/schema.org markup deferred to future phases

- **Privacy & Data Handling**
  - Chat message logs retained only for duration needed to support in-session conversations
  - No long-term chat history retention requirement for MVP
  - No 7-year audit log retention obligation
  - Pre-deployment validation required to ensure no PII embedded in sample/listing data

- **Maintainability & Quality**
  - Prisma schema established as single source of truth for data model
  - API routes strictly adhere to defined contract in API_CONTRACT.md
  - Linting and type checking required in CI pipeline or as pre-merge gate
  - Technology stack fixed: Next.js/React/Tailwind (frontend), Node.js/Express/Prisma (backend), PostgreSQL (database), Anthropic Claude API (AI), OpenStreetMap/Leaflet.js (maps)
  - Image optimization and responsive delivery required for all listing photos

**Explicitly Not Required for MVP (Per NFR.md §8):**
- Multi-region hosting or horizontal scaling architectures
- Formal service level agreements (SLAs)
- Penetration testing or security audits beyond standard validation
- Accessibility compliance testing (WCAG) beyond basic semantic HTML/alt text
- Load or stress performance testing
- Production deployment pipelines or release automation
- Advanced monitoring, alerting, or observability tooling
- Backup and disaster recovery procedures beyond basic database dumps

### Success Criteria
Per PRD.md §6, the MVP will be considered successful when:
- A visitor with no account can browse properties, apply filters, view property details, and complete the full property discovery flow end-to-end
- A visitor can ask the AI chatbot a natural language question about listings and receive a relevant answer that references specific available properties, with a graceful fallback mechanism that suggests search filters when the AI service is unavailable or fails
- An administrator can create a new property listing through the admin interface and observe that listing appear immediately on the public property browsing site within the same session
- No features explicitly listed as out of scope in PRD §4 or the ROADMAP.md "parking lot" are present in the shipped codebase, even in partial or incomplete form

Additional success indicators from supporting documentation:
- All implemented features satisfy their respective Definition of Done criteria per TESTING_STRATEGY_AND_DOD.md
- API implementation matches the contract specified in API_CONTRACT.md exactly
- Database schema corresponds precisely to the definitions in SCHEMA.md
- User interface implementations follow the designs and specifications in UI_REFERENCE.md and design_reference/
- All code passes linting, type checking, and test suites, and security validation checks before merging
- Phase completion validated via GitHub workflow with associated REPORT.md documentation and screenshots per REPORTING.md and GITHUB_WORKFLOW.md