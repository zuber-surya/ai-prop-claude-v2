# 00_MASTER_INDEX.md

# Property Vista CRM MVP - Master Index

**THIS DOCUMENT MUST BE READ BEFORE ANY IMPLEMENTATION BEGINS.**

This document serves as the single entry point for developers and AI coding agents working on the Property Vista CRM MVP project. It provides essential context, guidelines, and references to ensure consistent and aligned development efforts.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Goals](#project-goals)
4. [Repository Structure](#repository-structure)
5. [Knowledge Base Structure](#knowledge-base-structure)
6. [Document Dependency Map](#document-dependency-map)
7. [Reading Order for Every Document](#reading-order-for-every-document)
8. [Development Lifecycle](#development-lifecycle)
9. [Source of Truth Policy](#source-of-truth-policy)
10. [Current Implementation Status](#current-implementation-status)
11. [Phase Tracking](#phase-tracking)
12. [Sprint Tracking](#sprint-tracking)
13. [Task Tracking](#task-tracking)
14. [Definition of Done](#definition-of-done)
15. [Documentation Update Requirements](#documentation-update-requirements)
16. [Git Workflow Summary](#git-workflow-summary)
17. [Testing Workflow](#testing-workflow)
18. [Deployment Workflow](#deployment-workflow)

---

## Project Overview

### Business Problem
Prospective buyers/renters need a fast way to browse property listings and get their questions answered without waiting on a human agent. The business needs a simple way to publish and manage listings.

### Product Vision
Ship a public property-browsing site with an AI assistant that helps visitors find and understand listings, plus a minimal admin tool to manage those listings. Nothing more.

### Business Goals
- Enable visitors to browse, filter, and view property details end-to-end without an account.
- Allow visitors to ask natural-language questions and receive relevant answers referencing real listings, with a graceful fallback on AI failure.
- Allow admins to create a property listing and see it appear on the public site within the same session.
- Ensure no out-of-scope feature exists in the shipped code, even partially.

### Target Users
- **Visitor**: Anyone browsing the public site, logged in or not. Login is not required to browse, search, or chat.
- **Admin**: A user account with `isAdmin = true` who manages property listings. There is no self-serve way to become admin; it is set directly in the database or via a seed script for MVP.

### User Roles
- Visitor
- Admin

### High-Level Modules
- **Frontend**: Next.js/React application with Tailwind CSS for styling.
- **Backend**: Node.js/Express server implementing RESTful API.
- **Database**: PostgreSQL managed via Prisma ORM.
- **AI Service**: Integration with Anthropic Claude API for natural language understanding and property data querying.
- **Mapping Service**: OpenStreetMap tiles with Leaflet.js for map view.
- **Authentication Module**: Handles user registration, login, logout, and admin flag verification.
- **Property Module**: Manages property data (CRUD, search, filtering, sorting).
- **Chatbot Module**: Processes visitor queries, interacts with property data, returns responses with optional property references.
- **Admin Module**: Provides admin interface for property management (create, edit, delete, unpublish).

### High-Level Features
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

### Scope
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

**Out of Scope**:
- Leads/CRM, agent role/pipeline, requirement profile & recommendation engine.
- Notifications (email/SMS/in-app), audit log, visit scheduling/calendar.
- Session-based favorites & migration, bulk upload/CSV import.
- Voice input, multi-city/multi-currency support.
(Any request to add one of these should be treated as a scope-change request, not a bug fix or small addition.)

### Success Metrics
- A visitor with no account can browse, filter, and view property details end-to-end.
- A visitor can ask the chatbot a natural-language question and get a relevant answer referencing real listings, with a graceful fallback on AI failure.
- An admin can create a listing and see it go live on the public site within the same session.
- No feature listed in the out-of-scope list exists anywhere in the shipped code, even partially.

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Library**: React 18
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: React Query/SWR (preferred) or Context/Zustand
- **HTTP Client**: Fetch API or Axios wrapper
- **Form Validation**: Zod or Yup
- **Testing**: Jest, React Testing Library, Playwright

### Backend
- **Runtime**: Node.js (LTS)
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma (PostgreSQL provider)
- **Validation**: Zod
- **Logging**: Pino or Winston
- **Authentication**: JWT (access token + refresh token in httpOnly cookie)
- **Password Hashing**: Bcrypt (salt ≥ 12)
- **API Documentation**: OpenAPI/Swagger (via automatic generation or manual)
- **Testing**: Jest, Supertest

### Database
- **System**: PostgreSQL
- **ORM**: Prisma
- **Connection Pooled**: Yes (via Prisma)
- **Migrations**: Prisma Migrate
- **Seed Data**: Prisma seeding

### External Services
- **AI**: Anthropic Claude API
- **Payments**: Stripe (for MVP - optional based on scope)
- **Email**: Nodemailer (with mock service in development)
- **Maps**: OpenStreetMap + Leaflet.js
- **Storage**: Local filesystem (MVP) or AWS S3 (future)

### DevOps & Infrastructure
- **Version Control**: Git (GitHub)
- **CI/CD**: GitHub Actions
- **Containerization**: Docker (optional for MVP)
- **Monitoring**: Basic logging (to be enhanced)
- **Hosting**: Vercel (frontend) / Render/AWS (backend) or similar

### Development Tools
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript
- **Pre-commit**: Husky + lint-staged
- **API Testing**: VS Code REST Client or Postman (manual)
- **Database GUI**: TablePlus, DBeaver, or similar

---

## Project Goals

### Primary Goals
1. Deliver a Minimum Viable Product (MVP) that satisfies the core business goals outlined in the Project Overview.
2. Establish a maintainable codebase with clear separation of concerns.
3. Implement comprehensive automated testing to ensure reliability.
4. Follow industry best practices for security, performance, and accessibility.
5. Create comprehensive documentation to support future development and maintenance.

### Success Criteria
- All in-scope features from the Project Overview are implemented and tested.
- The application achieves a Lighthouse score of ≥90 for Performance, Accessibility, Best Practices, and SEO.
- Test coverage meets or exceeds targets: ≥90% unit test coverage for critical paths, ≥80% integration test coverage for APIs.
- All documented APIs behave as specified in API_SPECIFICATION.md.
- The UI matches the designs in UI_REFERENCE.md and design_reference/ with allowances for technical constraints.
- The application is secure against common web vulnerabilities (OWASP Top 10).
- The codebase adheres to CODING_STANDARDS.md and PROJECT_STRUCTURE.md.

---

## Repository Structure

See [PROJECT_STRUCTURE.md](knowledge_base/development/PROJECT_STRUCTURE.md) for complete details.

### Root Level
```
property-vista-crm/
├── knowledge_base/              # Project documentation (PRD, specs, etc.)
├── src/                         # Source code (monorepo style)
│   ├── backend/                 # Node.js/Express server with Prisma ORM
│   └── frontend/                # Next.js/React application
├── scripts/                     # Utility scripts (db migrations, seed, dev tools)
├── tests/                       # End-to-end tests (Cypress, Playwright)
├── .github/                     # GitHub Actions workflows, issue templates
├── .gitignore
├── README.md
└── package.json                 # Optional root package.json for workspace scripts
```

### Backend (`src/backend/src/`)
- `controllers/` - Request handlers (Express controllers)
- `services/` - Business logic layer
- `middleware/` - Custom Express middleware (auth, validation, etc.)
- `routes/` - API route definitions
- `utils/` - Utility functions and helpers
- `lib/` - External service wrappers (e.g., mail, payment, AI client)
- `config/` - Configuration loading (env, feature flags)
- `prisma/` - Prisma schema and generated client
- `index.ts` - Server entry point

### Frontend (`src/frontend/src/`)
- `app/` - App Router (pages, layouts, route groups)
- `components/` - Reusable UI components (buttons, cards, modals, etc.)
- `lib/` - Utilities, API clients, helpers
- `hooks/` - Custom React hooks
- `styles/` - Global styles, CSS modules, Tailwind customizations
- `types/` - TypeScript types and interfaces
- `context/` - React context providers (auth, theme, etc.)
- `middleware/` - Next.js middleware (auth, redirects)
- `public/` - Static assets (images, icons, robots.txt)
- `styles/` - Global CSS/Tailwind entry (styles/globals.css)
- Configuration files: `next.config.js`, `tailwind.config.js`, `postcss.config.js`, `tsconfig.json`, `eslint.config.js`, `package.json`

---

## Knowledge Base Structure

The `knowledge_base/` directory contains all project documentation, organized by domain:

```
knowledge_base/
├── 00_MASTER_INDEX.md           # THIS FILE - Single entry point
├── 00_AI_CHARTER.md             # AI usage guidelines and constraints
├── 01_PROJECT_PLAN.md           # High-level project planning
├── 02_PROJECT_OVERVIEW.md       # Business problem, vision, goals, scope
├── BRD.md                       # Business Requirements Document
├── PRD.md                       # Product Requirements Document
├── NFR.md                       # Non-Functional Requirements
├── SOLUTION_ARCHITECTURE.md     # High-level architectural decisions
├── DATABASE_DESIGN.md           # Database schema design
├── API_SPECIFICATION.md         # API contracts and specifications
├── TASKS.md                     # Detailed task breakdown (Epic → Feature → Task → Subtask)
├── README.md                    # Knowledge base overview
├── CODING_STANDARDS.md          # Coding standards and best practices
├── ui/                          # UI/UX documentation
│   ├── SCREEN_INVENTORY.md      # Inventory of all screens
│   ├── COMPONENT_LIBRARY.md     # Reusable component specifications
│   ├── USER_FLOWS.md            # User journey maps
│   ├── FRONTEND_FUNCTIONAL_SPEC.md # Detailed frontend specifications
│   └── screens/                 # Individual screen specifications
│       ├── propvista_crm_homepage.md
│       ├── search_results_standard_view.md
│       ├── ... (and others)
├── requirements/                # Requirement specifications
│   └── USER_ROLES.md            # Detailed role-based requirements
├── backend/                     # Backend-specific documentation
│   ├── BUSINESS_RULES.md        # Domain business rules
│   └── BACKEND_FUNCTIONAL_SPEC.md # Backend functional specifications
├── api/                         # API-specific documentation
│   └── API_SPECIFICATION.md     # API contracts (also at root for convenience)
├── database/                    # Database-specific documentation
│   ├── DATABASE_DESIGN.md       # Database schema (also at root for convenience)
│   └── SCREEN_DATABASE_MAPPING.md # UI-to-database mapping
├── development/                 # Development process documentation
│   ├── CODING_STANDARDS.md      # Coding standards (also at root for convenience)
│   ├── PROJECT_STRUCTURE.md     # Repository structure and conventions
│   └── GIT_WORKFLOW.md          # Git workflow and processes
├── testing/                     # Testing strategy and plans
│   └── TEST_PLAN.md             # Comprehensive test plan
├── AI_CONTEXT.md                # Context for AI coding assistants
└── project/                     # Project management artifacts
   ├── IMPLEMENTATION_PLAN.md    # Phase-based implementation plan
   └── TASKS.md                  # Detailed task breakdown (also at root for convenience)
```

---

## Document Dependency Map

### Core Foundation Documents
These establish the project foundation and should be read first:
1. `02_PROJECT_OVERVIEW.md` - Business problem, vision, goals, scope
2. `PRD.md` - Product requirements (detailed features)
3. `BRD.md` - Business requirements (if separate from PRD)
4. `NFR.md` - Non-functional requirements (performance, security, etc.)

### Technical Specification Documents
These define how the system should be built:
5. `SOLUTION_ARCHITECTURE.md` - High-level architectural decisions
6. `DATABASE_DESIGN.md` - Database schema design
7. `API_SPECIFICATION.md` - API contracts and specifications
8. `PROJECT_STRUCTURE.md` - Repository structure and conventions
9. `CODING_STANDARDS.md` - Coding standards and best practices

### Implementation Guidance Documents
These guide the implementation process:
10. `IMPLEMENTATION_PLAN.md` - Phase-based implementation plan
11. `TASKS.md` - Detailed task breakdown (Epic → Feature → Task → Subtask)
12. `GIT_WORKFLOW.md` - Git workflow and processes
13. `TEST_PLAN.md` - Testing strategy and plans

### Component and UI Documents
These detail the user interface:
14. `FRONTEND_FUNCTIONAL_SPEC.md` - Detailed frontend specifications
15. `USER_FLOWS.md` - User journey maps
16. `COMPONENT_LIBRARY.md` - Reusable component specifications
17. `SCREEN_INVENTORY.md` - Inventory of all screens
18. Individual screen specifications in `ui/screens/` (e.g., `propvista_crm_homepage.md`)

### Role and Requirement Documents
19. `requirements/USER_ROLES.md` - Detailed role-based requirements
20. `AI_CONTEXT.md` - Context for AI coding assistants
21. `00_AI_CHARTER.md` - AI usage guidelines and constraints

### Supporting Documents
22. `README.md` - Knowledge base overview
23. `01_PROJECT_PLAN.md` - High-level project planning

---

## Reading Order for Every Document

### For New Developers/Contributors
1. `00_MASTER_INDEX.md` (THIS FILE) - Start here
2. `02_PROJECT_OVERVIEW.md` - Understand the business context
3. `PRD.md` - Understand what needs to be built
4. `NFR.md` - Understand quality attributes and constraints
5. `PROJECT_STRUCTURE.md` - Understand how the code is organized
6. `CODING_STANDARDS.md` - Understand how to write code
7. `GIT_WORKFLOW.md` - Understand how to collaborate via Git
8. `TEST_PLAN.md` - Understand how quality is ensured
9. `IMPLEMENTATION_PLAN.md` - Understand the phased approach
10. `TASKS.md` - Understand the detailed work breakdown
11. `API_SPECIFICATION.md` - Understand the contracts (for backend/frontend integration)
12. `DATABASE_DESIGN.md` - Understand the data model
13. `FRONTEND_FUNCTIONAL_SPEC.md` - Understand UI requirements (for frontend work)
14. `BACKEND_FUNCTIONAL_SPEC.md` - Understand backend requirements (for backend work)
15. `USER_FLOWS.md` - Understand user journeys
16. `AI_CONTEXT.md` - Understand how to work effectively with AI assistants
17. `00_AI_CHARTER.md` - Understand AI usage guidelines

### For Backend Developers
After the foundation, focus on:
1. `API_SPECIFICATION.md` - Primary reference
2. `DATABASE_DESIGN.md` - Data model understanding
3. `BACKEND_FUNCTIONAL_SPEC.md` - Detailed backend requirements
4. `BUSINESS_RULES.md` - Domain logic requirements
5. `PROJECT_STRUCTURE.md` (backend sections) - Code organization
6. `CODING_STANDARDS.md` - Language-specific standards

### For Frontend Developers
After the foundation, focus on:
1. `FRONTEND_FUNCTIONAL_SPEC.md` - Primary reference
2. `UI_REFERENCE.md` and `design_reference/` - Visual designs
3. `USER_FLOWS.md` - Interaction patterns
4. `COMPONENT_LIBRARY.md` - Reusable components
5. `SCREEN_INVENTORY.md` - Complete screen list
6. Individual screen specs in `ui/screens/` - Specific screen requirements
7. `PROJECT_STRUCTURE.md` (frontend sections) - Code organization
8. `CODING_STANDARDS.md` - Language-specific standards

### For DevOps/Infrastructure
After the foundation, focus on:
1. `NFR.md` - Performance, security, scalability requirements
2. `GIT_WORKFLOW.md` - Branching and release strategies
3. `TEST_PLAN.md` - Testing requirements for CI/CD
4. `PROJECT_STRUCTURE.md` - Deployment considerations

### For AI Coding Agents
Always consult:
1. `00_MASTER_INDEX.md` (THIS FILE) - Mandatory first read
2. `AI_CONTEXT.md` - Specific guidance for AI assistants
3. `00_AI_CHARTER.md` - AI usage boundaries and permissions
4. Relevant technical specification documents based on task type

---

## Development Lifecycle

### 1. Planning Phase
- Review business requirements in `02_PROJECT_OVERVIEW.md`, `PRD.md`, `BRD.md`
- Consult `NFR.md` for non-functional constraints
- Examine `IMPLEMENTATION_PLAN.md` for phased approach
- Break down work using `TASKS.md` (Epic → Feature → Task → Subtask)
- Estimate effort and prioritize tasks

### 2. Design Phase
- Review `SOLUTION_ARCHITECTURE.md` for architectural decisions
- Study `DATABASE_SESIGN.md` for data modeling
- Examine `API_SPECIFICATION.md` for contract definition
- Review `FRONTEND_FUNCTIONAL_SPEC.md` and `BACKEND_FUNCTIONAL_SPEC.md` for detailed requirements
- Consult `USER_FLOWS.md` for interaction design
- Refer to `UI_REFERENCE.md` and `design_reference/` for visual design

### 3. Implementation Phase
- Follow `PROJECT_STRUCTURE.md` for file organization
- Adhere to `CODING_STANDARDS.md` for code quality
- Implement features according to task breakdown in `TASKS.md`
- Write tests following `TEST_PLAN.md` guidelines
- Use branch naming conventions from `GIT_WORKFLOW.md`
- Follow commit message conventions from `GIT_WORKFLOW.md`

### 4. Testing Phase
- Write unit tests as specified in `TEST_PLAN.md`
- Write integration tests as specified in `TEST_PLAN.md`
- Perform manual testing against UI specifications
- Run automated test suites
- Address test failures and improve coverage

### 5. Review Phase
- Submit Pull Request following `GIT_WORKFLOW.md` guidelines
- Participate in code review process
- Address review feedback
- Ensure all checks pass (CI, lint, tests)

### 6. Release Phase
- Follow release procedures in `GIT_WORKFLOW.md`
- Version according to SemVer
- Update changelog
- Tag release
- Deploy to appropriate environments

### 7. Maintenance Phase
- Monitor production systems
- Address bug reports
- Implement minor enhancements
- Update documentation as needed

---

## Source of Truth Policy

To ensure consistency and avoid conflicting information, the following sources of truth are established:

### Primary Sources of Truth
1. **Code**: The actual implementation in the `src/` directory is the ultimate source of truth for how the system works.
2. **Database Schema**: The `prisma/schema.prisma` file is the source of truth for the data model.
3. **API Specification**: `API_SPECIFICATION.md` is the source of truth for API contracts.
4. **UI Designs**: Files in `design_reference/` and `ui/screens/` are the source of truth for visual design and user interactions.
5. **Business Rules**: `BUSINESS_RULES.md` is the source of truth for domain logic requirements.

### Documentation Hierarchy
When conflicts arise between documents, the following hierarchy applies (higher overrides lower):
1. Code and database schema (actual implementation)
2. API_SPECIFICATION.md
3. PRODUCT REQUIREMENTS: PRD.md > BRD.md
4. NON-FUNCTIONAL REQUIREMENTS: NFR.md
5. FUNCTIONAL SPECS: FRONTEND_FUNCTIONAL_SPEC.md, BACKEND_FUNCTIONAL_SPEC.md
6. USER EXPERIENCE: USER_FLOWS.md, UI_REFERENCE.md, design_reference/
7. TECHNICAL GUIDES: PROJECT_STRUCTURE.md, CODING_STANDARDS.md
8. PROCESS DOCS: GIT_WORKFLOW.md, TEST_PLAN.md, IMPLEMENTATION_PLAN.md
9. PROJECT OVERVIEW: 02_PROJECT_OVERVIEW.md
10. PLANNING DOCS: 01_PROJECT_PLAN.md

### Documentation Maintenance Responsibility
- **API Changes**: Developer making the change must update `API_SPECIFICATION.md`
- **Database Changes**: Developer making the change must update `DATABASE_DESIGN.md` and `SCREEN_DATABASE_MAPPING.md`
- **UI Changes**: Developer making the change must update relevant files in `ui/screens/` and `FRONTEND_FUNCTIONAL_SPEC.md`
- **Business Rule Changes**: Developer making the change must update `BUSINESS_RULES.md`
- **Feature Additions/Removal**: Product owner or lead developer must update `PRD.md` and `IMPLEMENTATION_PLAN.md`
- **Process Changes**: Team lead or Scrum Master must update relevant process documents

### Documentation Update Process
1. When making a change that affects documentation, update the relevant document(s) in the same PR
2. Documentation updates will be reviewed as part of the code review process
3. Outdated documentation is considered a defect and should be fixed promptly
4. Documentation should never be ahead of implementation - it should describe the current or imminent state

---

## Current Implementation Status

Based on the latest commits and documentation:

### Completed
- Project initialization and repository setup
- Basic project structure creation
- Initial documentation suite creation
- Foundation phase planning

### In Progress
- None (this is the initial setup phase)

### Not Started
- Phase 0: Foundation & Setup (authentication, tooling, database)
- All subsequent phases

### Known Issues
- None reported at this time

### Last Updated
2026-07-24 (based on conversation context)

---

## Phase Tracking

Based on the IMPLEMENTATION_PLAN.md:

| Phase | Focus | Status | Start Date | Target Completion | Actual Completion |
|-------|-------|--------|------------|-------------------|-------------------|
| 0 | Foundations & Auth | Not Started | TBD | TBD | Not Started |
| 1 | Property Catalog & Search | Not Started | TBD | TBD | Not Started |
| 2 | User Profiles, Favorites, Leads | Not Started | TBD | TBD | Not Started |
| 3 | Bookings & Appointments | Not Started | TBD | TBD | Not Started |
| 4 | Payments & Premium Listings | Not Started | TBD | TBD | Not Started |
| 5 | Notifications & Real-Time | Not Started | TBD | TBD | Not Started |
| 6 | Admin Dashboard & Management | Not Started | TBD | TBD | Not Started |
| 7 | AI Chatbot & Advanced Search | Not Started | TBD | TBD | Not Started |
| 8 | Polish, Performance & Release | Not Started | TBD | TBD | Not Started |

*Note: Status will be updated as work progresses. Refer to TASKS.md for granular tracking.*

---

## Sprint Tracking

The project uses Scrum methodology with 2-week sprints.

### Current Sprint
- **Sprint #**: 0 (Setup/Sprint 0)
- **Duration**: 2026-07-24 to 2026-08-07
- **Goal**: Project setup, documentation completion, environment preparation
- **Planned Velocity**: 40 story points
- **Completed**: To be determined at sprint end
- **Remaining**: To be determined at sprint end

### Sprint Goals History
- **Sprint -1 (Planning)**: Project initiation, repository setup, documentation creation (Completed: 2026-07-23)
- **Sprint 0 (Current)**: Environment setup, dependency installation, initial configuration

### Sprint Ceremonies
- **Sprint Planning**: Every other Monday, 10:00 AM
- **Daily Standup**: Every weekday, 9:15 AM (15 minutes)
- **Sprint Review**: Every other Friday, 3:00 PM
- **Sprint Retrospective**: Every other Friday, 3:30 PM

### Definition of Ready
A story is ready for sprint planning when:
1. It has clear acceptance criteria
2. It has been sized (story points assigned)
3. Dependencies are identified and resolved
4. UI/UX designs are available (if applicable)
5. API contracts are defined (if applicable)
6. Any required spike work is completed

### Definition of Done
See [Definition of Done](#definition-of-done) section below.

---

## Task Tracking

Task tracking is managed through:
1. **Primary**: `TASKS.md` - Contains the complete hierarchical breakdown (Epic → Feature → Task → Subtask) with estimates, priorities, dependencies, and status
2. **Secondary**: GitHub Issues - For tracking specific bugs, enhancements, and tasks that don't fit the hierarchical model
3. **Tertiary**: Project Board (GitHub Projects) - For visual workflow management (To Do → In Progress → Review → Done)

### Updating Task Status
When working on a task:
1. Update the status in `TASKS.md` from "To Do" to "In Progress" when starting work
2. Update the status to "Done" when all acceptance criteria are met and Definition of Done is satisfied
3. Commit changes to `TASKS.md` with each significant status update
4. Reference the task ID in commit messages and PR descriptions

### Task ID Format
Tasks are identified by hierarchical numbering:
- Format: `P#.F#.T#` (Phase.Feature.Task)
- Example: `2.3.1` = Phase 2, Feature 3, Task 1
- Subtasks use decimal notation: `2.3.1.1` = Phase 2, Feature 3, Task 1, Subtask 1

### Tracking Metrics
- **Burndown Chart**: Updated daily based on completed story points in `TASKS.md`
- **Velocity**: Calculated at the end of each sprint
- **Predictability**: Planned vs. actual completion
- **Quality**: Defect rate, test coverage percentages

---

## Definition of Done

A work item (task, user story, or feature) is considered "Done" when all of the following criteria are met:

### Universal Criteria
- [ ] Code is written and committed to a feature branch
- [ ] Code follows all guidelines in `CODING_STANDARDS.md`
- [ ] Code follows the structure defined in `PROJECT_STRUCTURE.md`
- [ ] All new and modified code has corresponding unit tests
- [ ] All new and modified code has corresponding integration tests (where applicable)
- [ ] All tests pass (unit, integration, and linting)
- [ ] No new compiler warnings or TypeScript errors
- [ ] Code has been reviewed and approved by at least one team member
- [ ] Documentation has been updated to reflect changes (if applicable)
- [ ] Changes have been tested in a clean environment
- [ ] No security vulnerabilities introduced (verified via dependency scan)
- [ ] Performance impact has been assessed and is acceptable
- [ ] Accessibility considerations have been addressed (WCAG 2.1 AA where applicable)

### Backend-Specific Criteria
- [ ] API endpoint behaves as specified in `API_SPECIFICATION.md`
- [ ] Database migrations are properly defined and tested
- [ ] Error handling follows standard format
- [ ] Logging is implemented appropriately
- [ ] Security validations are in place (input validation, authentication, authorization)
- [ ] Rate limiting is applied where necessary
- [ ] Cache invalidation strategy is defined (if applicable)

### Frontend-Specific Criteria
- [ ] UI matches the specifications in `ui/screens/` and `FRONTEND_FUNCTIONAL_SPEC.md`
- [ ] Responsive design works across all breakpoints (mobile, tablet, desktop)
- [ ] Accessible keyboard navigation is implemented
- [ ] ARIA attributes are used where appropriate
- [ ] Color contrast meets WCAG 2.1 AA standards
- [ ] Form validation and error handling are implemented
- [ ] Loading and empty states are handled
- [ ] State management follows established patterns
- [ ] Component reusability is maximized
- [ ] Performance optimizations are applied (lazy loading, memoization, etc.)

### API-Specific Criteria
- [ ] Request/response schemas match `API_SPECIFICATION.md`
- [ ] HTTP status codes are used correctly
- [ ] Error responses follow the standard format
- [ ] Authentication and authorization checks are implemented
- [ ] Input validation is performed using Zod
- [ ] Rate limiting headers are included (where applicable)
- [ ] CORS headers are set appropriately
- [ ] API is idempotent where required
- [ ] API versioning is respected

### Database-Specific Criteria
- [ ] Schema changes are captured in migration files
- [ ] Data integrity constraints are properly defined
- [ ] Indexes are created for query performance
- [ ] Soft delete pattern is consistently applied (where used)
- [ ] Timestamps (created_at, updated_at, deleted_at) are correctly maintained
- [ ] Relationships (foreign keys) are properly defined
- [ ] No unnecessary data duplication or denormalization

### Testing-Specific Criteria
- [ ] Unit tests achieve ≥90% coverage for modified files
- [ ] Integration tests cover all critical paths and edge cases
- [ ] Tests are deterministic and don't have external dependencies (where possible)
- [ ] Test names clearly describe what is being tested
- [ ] Test setup and teardown are properly implemented
- [ ] Mocks and stubs are used appropriately
- [ ] Test data is realistic and varied

### Documentation-Specific Criteria
- [ ] Documentation is written in clear, concise language
- [ ] Documentation follows the established style and format
- [ ] Documentation includes examples where helpful
- [ ] Diagrams are updated to reflect changes (if applicable)
- [ ] Documentation is reviewed for technical accuracy
- [ ] Links to related documentation are correct and functional
- [ ] Documentation is accessible and searchable

### Release-Specific Criteria
- [ ] Version number has been updated according to SemVer
- [ ] Changelog entry has been created
- [ ] Release notes have been written
- [ ] Deployment scripts have been tested
- [ ] Rollback procedure has been documented
- [ ] Post-deployment verification steps have been defined

---

## Documentation Update Requirements

To maintain the integrity and usefulness of the knowledge base, the following documentation update requirements must be followed:

### Mandatory Updates
When implementing changes that affect the following areas, the corresponding documentation MUST be updated in the SAME pull request:

| Change Type | Required Documentation Updates |
|-------------|--------------------------------|
| **API Changes** (new endpoints, modified parameters, changed responses) | `API_SPECIFICATION.md` |
| **Database Changes** (schema modifications, new tables, changed columns) | `DATABASE_DESIGN.md`, `SCREEN_DATABASE_MAPPING.md` |
| **UI Changes** (new screens, modified components, changed user flows) | Relevant files in `ui/screens/`, `FRONTEND_FUNCTIONAL_SPEC.md`, `USER_FLOWS.md`, `COMPONENT_LIBRARY.md` |
| **Business Rule Changes** (new rules, modified rules, removed rules) | `BUSINESS_RULES.md` |
| **Non-Functional Requirement Changes** (performance targets, security requirements, etc.) | `NFR.md` |
| **Architecture Changes** (major structural changes, technology swaps) | `SOLUTION_ARCHITECTURE.md` |
| **Process Changes** (workflow modifications, new ceremonies) | `GIT_WORKFLOW.md`, `TEST_PLAN.md` |
| **Feature Addition/Removal** | `PRD.md`, `IMPLEMENTATION_PLAN.md`, `TASKS.md` |

### Update Guidelines
1. **Timeliness**: Update documentation before or during implementation, not after
2. **Accuracy**: Ensure documentation precisely reflects the implemented state
3. **Completeness**: Update all affected sections, not just the obvious ones
4. **Clarity**: Use clear, concise language with examples where helpful
5. **Consistency**: Follow the existing style and format of the document
6. **Versioning**: When applicable, indicate which version the documentation applies to
7. **Diagrams**: Update any affected diagrams, flowcharts, or models
8. **Examples**: Update code examples and samples to reflect current implementation
9. **Links**: Ensure all internal links remain valid and point to correct sections
10. **Review**: Documentation changes are subject to the same review process as code changes

### Documentation Update Process
1. Identify which documents are affected by your changes
2. Make the documentation changes in your feature branch
3. Include documentation changes in your pull request
4. Ensure documentation is reviewed as part of the code review process
5. Address any documentation-related feedback during review
6. Merge documentation changes along with code changes

### Consequences of Non-Compliance
- Pull requests may be rejected if required documentation updates are missing
- Repeated failures to update documentation may result in additional review requirements
- Outdated documentation is considered technical debt and will be prioritized for remediation
- In extreme cases, access to make certain types of changes may be restricted until compliance is demonstrated

---

## Git Workflow Summary

See [GIT_WORKFLOW.md](knowledge_base/development/GIT_WORKFLOW.md) for complete details.

### Branch Naming Conventions
- `feat/<short-description>` - New features
- `fix/<short-description>` - Bug fixes
- `docs/<short-description>` - Documentation changes
- `chore/<short-description>` - Maintenance tasks
- `refactor/<short-description>` - Code refactoring
- `release/<version>` - Release preparation
- `hotfix/<short-description>` - Urgent production fixes

### Commit Message Convention (Conventional Commits)
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```
Types: feat, fix, docs, style, refactor, perf, test, chore

### Pull Request Process
1. Create branch from `main`
2. Make commits following conventions
3. Push branch to remote
4. Open PR targeting `main`
5. PR title follows commit format
6. PR description includes:
   - Summary of changes
   - Related issue/ticket number
   - Screenshots/recordings for UI changes
   - Breaking changes or migrations needed
   - Checklist of completed tasks
7. Requirements before merging:
   - All CI checks pass
   - At least one approving review
   - No merge conflicts
   - Branch up-to-date with `main`
8. Squash and merge preferred
9. Delete branch after merging

### Code Review Focus
- Correctness and implementation fidelity
- Adherence to coding standards
- Security considerations
- Performance implications
- Test coverage and quality
- Code clarity and maintainability
- Documentation completeness

### Release Flow
1. Ensure `main` is up-to-date and passes CI
2. Create release branch: `git checkout -b release/vX.Y.Z`
3. Update version numbers in `package.json` and other locations
4. Update `CHANGELOG.md`
5. Commit: `chore(release): prepare vX.Y.Z`
6. Push release branch and open PR targeting `main`
7. Obtain approvals and ensure CI passes
8. Merge release branch into `main` (squash and merge)
9. Tag merge commit: `git tag vX.Y.Z`
10. Push tag: `git push origin vX.Y.Z`

---

## Testing Workflow

See [TEST_PLAN.md](knowledge_base/testing/TEST_PLAN.md) for complete details.

### Test Levels
1. **Unit Tests** - Test individual functions, methods, classes
   - Tools: Jest, Ts-jest
   - Coverage Target: ≥90% for critical paths
   - Location: alongside source code or in `__tests__/` directories
   - Execution: `npm test` (backend), `npm test` (frontend)

2. **Integration Tests** - Test interactions between components/services
   - Tools: Supertest (backend), React Testing Library + Jest (frontend)
   - Coverage Target: ≥80% for API endpoints
   - Location: `tests/integration/`
   - Execution: `npm run test:integration`

3. **End-to-End Tests** - Test complete user workflows
   - Tools: Playwright
   - Coverage Target: Critical user journeys
   - Location: `tests/e2e/`
   - Execution: `npm run test:e2e`

4. **UI/Visual Tests** - Test visual appearance and layout
   - Tools: Playwright visual comparison
   - Baseline stored in: `tests/ui/snapshots/`
   - Execution: `npm run test:ui`

5. **API Contract Tests** - Test adherence to API specification
   - Tools: Custom scripts or Pact
   - Location: `tests/api/`
   - Execution: `npm run test:api`

### Testing Best Practices
- Write tests before or during development (TDD/TAD preferred)
- Use AAA pattern: Arrange, Act, Assert
- Test one thing per test
- Use descriptive test names
- Mock external dependencies
- Use factory functions or fixtures for test data
- Test both positive and negative cases
- Test edge cases and boundary conditions
- Keep tests independent and isolated
- Regularly review and refactor tests
- Treat test code with same respect as production code

### Test Execution in CI
- **Pull Request Build**: Runs unit + integration tests + linting
- **Merge to Main Build**: Runs full test suite (unit, integration, e2e, ui)
- **Nightly Build**: Runs comprehensive test suite with coverage reporting
- **Release Build**: Runs full test suite + performance benchmarks

### Coverage Requirements
- **Statements**: ≥90% for critical paths (auth, property, payment, chat)
- **Branches**: ≥85% for critical paths
- **Functions**: ≥90% for critical paths
- **Lines**: ≥90% for critical paths
- **Overall**: ≥80% project-wide

### Handling Flaky Tests
1. Identify root cause (timing, external dependencies, test isolation)
2. Fix the test to be deterministic
3. If immediate fix isn't possible, mark with appropriate skip/retry annotation
4. Prioritize fixing flaky tests in next sprint
5. Never ignore or permanently disable failing tests

---

## Deployment Workflow

### Environments
1. **Development** - Individual developer environments
2. **Testing** - Shared environment for integration testing
3. **Staging** - Production-like environment for final verification
4. **Production** - Live customer-facing environment

### Deployment Triggers
- **Development**: On every commit to feature branch (manual/local)
- **Testing**: On pull request to `main` (automated via CI)
- **Staging**: On merge to `main` (automated via CI)
- **Production**: Manual approval after successful staging deployment

### Deployment Process
1. **Build Phase**:
   - Install dependencies
   - Run linting checks
   - Run unit tests
   - Build application artifacts
   - Run security scans

2. **Test Phase**:
   - Deploy to testing environment
   - Run integration tests
   - Run API contract tests
   - Perform basic smoke tests

3. **Staging Promotion**:
   - Deploy to staging environment
   - Run end-to-end tests
   - Run UI/visual tests
   - Perform exploratory testing
   - Validate against performance benchmarks

4. **Production Release**:
   - Manual approval gate
   - Deploy to production environment
   - Run smoke tests
   - Monitor key metrics (error rates, latency, throughput)
   - Verify business metrics (if applicable)

### Rollback Procedure
1. **Detection**: Identify issue through monitoring or user reports
2. **Assessment**: Determine if rollback is appropriate (hotfix may be better)
3. **Execution**:
   - For blue/green: Switch traffic back to previous version
   - For rolling: Redeploy previous version
   - For immutable: Redeploy previous image/tag
4. **Verification**: Confirm system has returned to previous state
5. **Follow-up**: Create issue to address root cause, schedule fix

### Configuration Management
- Environment-specific config stored in environment variables
- Secrets managed via secret management service (AWS Secrets Manager, HashiCorp Vault, etc.)
- Configuration validated at startup
- No secrets or sensitive data in version control
- `.env.example` provided for developer onboarding

### Monitoring and Observability
- **Logging**: Structured logging with correlation IDs
- **Metrics**: Request latency, error rates, throughput, saturation
- **Tracing**: Distributed tracing for cross-service requests
- **Health Checks**: Endpoint for liveness and readiness probes
- **Alerting**: Threshold-based alerts for critical metrics
- **Dashboards**: Operational and business metrics visibility

### Database Migration Strategy
- Migrations are version-controlled and applied automatically
- Backward-compatible changes preferred
- Breaking changes require careful coordination
- Rollback scripts maintained for critical changes
- Migration testing performed in staging before production

### Feature Flags
- Used for risky or major changes
- Allow gradual rollout and quick rollback
- Managed via configuration service
- Cleaned up after full rollout

### Notification on Deployment
- Deployment notifications sent to team channels
- Failure notifications escalated appropriately
- Success notifications include version and timestamp
- Post-deployment retro conducted for significant releases

---

## Instructions: Mandatory Pre-Implementation Reading

**BEFORE BEGINNING ANY IMPLEMENTATION WORK ON THIS PROJECT, YOU MUST:**

1. **Read this document completely** (`00_MASTER_INDEX.md`)
2. **Understand the project context** from `02_PROJECT_OVERVIEW.md` and `PRD.md`
3. **Familiarize yourself with the technical foundations** from `PROJECT_STRUCTURE.md` and `CODING_STANDARDS.md`
4. **Review the implementation plan** in `IMPLEMENTATION_PLAN.md` and task breakdown in `TASKS.md`
5. **Check the current status** of the specific area you plan to work on
6. **Verify you have the latest version** of all relevant documents (pull before starting)

**FAILURE TO COMPLY WITH THIS REQUIREMENT MAY RESULT IN:**
- Misunderstood requirements
- Duplicate effort
- Inconsistent implementation
- Violations of architectural principles
- Increased rework and technical debt
- Delays in project timeline

**REMEMBER**: This document is the single source of truth for project orientation. All other documents are important, but this is the gateway to them. When in doubt, stop and re-read this document before proceeding.

---

*Document maintained by the Project Team. Last updated: 2026-07-24.*
*Questions or suggestions for improvement should be submitted as issues to the project repository.*