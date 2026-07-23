# 02_PROJECT_OVERVIEW.md

## Business Problem
Prospective buyers/renters need a fast way to browse property listings and get their questions answered without waiting on a human agent. The business needs a simple way to publish and manage listings.

## Product Vision
Ship a public property-browsing site with an AI assistant that helps visitors find and understand listings, plus a minimal admin tool to manage those listings. Nothing more.

## Business Goals
- Enable visitors to browse, filter, and view property details end-to-end without an account.
- Allow visitors to ask natural-language questions and receive relevant answers referencing real listings, with a graceful fallback on AI failure.
- Allow admins to create a property listing and see it appear on the public site within the same session.
- Ensure no out-of-scope feature exists in the shipped code, even partially.

## Target Users
- **Visitor**: Anyone browsing the public site, logged in or not. Login is not required to browse, search, or chat.
- **Admin**: A user account with `isAdmin = true` who manages property listings. There is no self-serve way to become admin; it is set directly in the database or via a seed script for MVP.

## User Roles
- Visitor
- Admin

## High-Level Modules
- **Frontend**: Next.js/React application with Tailwind CSS for styling.
- **Backend**: Node.js/Express server implementing RESTful API.
- **Database**: PostgreSQL managed via Prisma ORM.
- **AI Service**: Integration with Anthropic Claude API for natural language understanding and property data querying.
- **Mapping Service**: OpenStreetMap tiles with Leaflet.js for map view.
- **Authentication Module**: Handles user registration, login, logout, and admin flag verification.
- **Property Module**: Manages property data (CRUD, search, filtering, sorting).
- **Chatbot Module**: Processes visitor queries, interacts with property data, returns responses with optional property references.
- **Admin Module**: Provides admin interface for property management (create, edit, delete, unpublish).

## High-Level Features
- **Property Browsing & Search**:
  - Paginated/scrollable list of published properties.
  - Filter by price range, property type, bedrooms, and location (text match).
  - Sort by price or date added.
  - Property detail page with photos, description, price, specs, amenities, and location.
  - Clear "no matches" state with suggestion to broaden filters.
  - Map view on `/search` showing published properties as pins using OpenStreetMap + Leaflet.js; clicking a pin shows a summary card linking to the property detail page.
- **Authentication**:
  - Visitor registration with email + password.
  - Visitor login/logout.
  - No email verification, password reset, or social login required for MVP.
  - No public-facing feature gated behind login in this MVP (login exists as groundwork).
- **AI Chatbot (Q&A / Search only)**:
  - Chat widget available on the public site, accessible with or without login.
  - Answers natural-language questions about listings by querying property data.
  - Holds short back-and-forth within a single browser session (history does not persist across sessions or devices).
  - Shows a clear fallback message on AI provider failure or timeout (rather than hanging or erroring silently).
  - Never collects contact information, never creates records other than chat message log, and never initiates contact with the visitor.
  - Rate-limited per session/IP to control cost and abuse.
- **Admin Property Management**:
  - Admin login and access to `/admin` gated by `isAdmin`.
  - Create new property listing (photos, description, price, specs, amenities, location, status).
  - Edit an existing listing.
  - Delete or unpublish a listing (unpublished listings do not appear on the public site).
  - Listings have exactly two statuses: `draft` and `published`; no approval workflow.
  - Non-admin users attempting to reach `/admin/*` are redirected/blocked (403 or redirect to login).

## Scope
**In-scope**:
- Public property browsing and search (FR1).
- Visitor authentication (register/login/logout) (FR2).
- AI chatbot for natural language Q&A and tool-calling into property data (FR3).
- Admin property management (CRUD, publish/unpublish) (FR4).
- Two user types: Visitor and Admin.
- Technology stack: Next.js/React with Tailwind CSS, Node.js/Express with Prisma ORM, PostgreSQL, Anthropic Claude API, OpenStreetMap + Leaflet.js.
- UI implementation following UI_REFERENCE.md and design_reference/ designs, stripping out-of-scope elements where necessary.
- Seed data as placeholder/fixture data (not a real listings import).
- Reports and screenshots per phase as defined in REPORTING.md.
- Development workflow per GITHUB_WORKFLOW.md, including issue/PR conventions, project board, and CI checks.

## Out of Scope
- Leads/CRM, agent role/pipeline, requirement profile & recommendation engine.
- Notifications (email/SMS/in-app), audit log, visit scheduling/calendar.
- Session-based favorites & migration, bulk upload/CSV import.
- Voice input, multi-city/multi-currency support.
(Any request to add one of these should be treated as a scope-change request, not a bug fix or small addition.)

## Success Metrics
- A visitor with no account can browse, filter, and view property details end-to-end.
- A visitor can ask the chatbot a natural-language question and get a relevant answer referencing real listings, with a graceful fallback on AI failure.
- An admin can create a listing and see it go live on the public site within the same session.
- No feature listed in the out-of-scope list exists anywhere in the shipped code, even partially.