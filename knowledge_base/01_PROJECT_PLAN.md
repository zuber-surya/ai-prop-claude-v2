# 01_PROJECT_PLAN.md

## Project Overview
Prospective buyers/renters need a fast way to browse property listings and get their questions answered without waiting on a human agent. The business needs a simple way to publish and manage listings.  
Goal of this MVP: ship a public property-browsing site with an AI assistant that helps visitors find and understand listings, plus a minimal admin tool to manage those listings. Nothing more.

## Objectives
- Ship public property-browsing site  
- Include AI assistant for visitor queries  
- Provide minimal admin tool for listing management  

## Scope
**In-scope:**  
- Property browsing and search (public)  
- Authentication (register/login/logout, admin flag)  
- AI chatbot (Q&A, tool-calling to property data)  
- Admin property management (CRUD, publish/unpublish)  
- Two user types: Visitor and Admin  
- Technology stack: Next.js/React with Tailwind CSS, Node.js/Express with Prisma ORM, PostgreSQL, Anthropic Claude API, OpenStreetMap + Leaflet.js  

**Out-of-scope:**  
- Leads/CRM, agent role/pipeline, requirement profile & recommendation engine  
- Notifications (email/SMS/in-app), audit log, visit scheduling/calendar  
- Session-based favorites & migration, bulk upload/CSV import  
- Voice input, multi-city/multi-currency support  

## Deliverables
- At the end of each phase: a report in `/reports/phase-<N>-<short-name>/` containing:  
  - `REPORT.md` (factual, short, plain language bullets)  
  - `screenshots/` directory with PNGs (one per major page/flow, reproducible using seed data)  
- Each task/PR must satisfy the Definition of Done:  
  1. Scope check (no out-of-scope features)  
  2. Contract check (API matches API_CONTRACT.md)  
  3. Schema check (SCHEMA.md and Prisma migration updated)  
  4. Tests (phase-specific coverage per TESTING_STRATEGY_AND_DOD.md §1.2)  
  5. Lint/typecheck (both pass, no unjustified suppressions)  
  6. Manual check (run locally for user-facing flows, screenshot or note in PR)  
  7. Roadmap updated (checklist item checked off)  
  8. No silent scope decisions (ambiguities flagged in PR description)  
- GitHub artifacts: issues, PRs, branches (feature/fix/chore/docs), project board (Backlog → In Progress → In Review → Done)  

## Project Phases
- **Phase 0 — Planning docs** (completed): Trim scope, CLAUDE.md, ROADMAP.md, PRD.md, NFR.md, API_CONTRACT.md, SCHEMA.md, Testing strategy & Definition of Done doc, GITHUB_WORKFLOW.md, REPORTING.md, .env.example, UI_REFERENCE.md, open decisions resolved  
- **Phase 1 — Data model + auth**: Prisma schema (Property, User, ChatMessage), Postgres setup/migrations, auth (register/login/logout, isAdmin flag), seed script with placeholder/fixture data  
- **Phase 2 — Public site**: Landing page, search (/search) with filters/results/list (grid/list/map toggle), property detail page (/property/[id]), login/register pages  
- **Phase 3 — AI chatbot (Q&A/search only)**: /api/chat endpoint using Anthropic API, chat widget on public site, question answering about listings, fallback message on AI failure/timeouts, rate limiting on chat endpoint  
- **Phase 4 — Admin CRUD**: Admin routes (/admin, /admin/properties) gated by isAdmin, create/edit/delete/unpublish property listings  
- **Phase 5 — Polish**: Basic SEO metadata, error/empty states, manual pass through Definition of Done for every route  

## Milestones
Each phase corresponds to a GitHub milestone:  
- `Phase 0 — Planning`  
- `Phase 1 — Data model + auth`  
- `Phase 2 — Public site`  
- `Phase 3 — AI chatbot`  
- `Phase 4 — Admin CRUD`  
- `Phase 5 — Polish`  
A milestone is closed only when:  
- Every issue in the milestone is closed  
- The corresponding ROADMAP.md gate is satisfied (checkboxes checked)  
- Definition of Done is met for every merged PR in the milestone (per TESTING_STRATEGY_AND_DOD.md §3)  

## Dependencies
- Phase 1: No hard dependencies; can proceed with initial setup  
- Phase 2: Can use temporary mock JSON layer (static fixture responses matching API_CONTRACT.md) before real DB layer is wired; must swap to real DB-backed routes before gate  
- Phase 3: Depends on property data API (from Phase 1/2) for querying listings  
- Phase 4: Depends on auth and data model from Phase 1  
- Phase 5: Depends on completion of all prior phases  
- Cross-phase: The mock JSON layer allows frontend work (Phases 2 and 4) to start before backend database integration is complete  

## Assumptions
- Seed data is placeholder/fixture data, not a real listings import (PRD.md §77, ROADMAP.md Phase 0 open decision #3, SCHEMA.md §5)  
- Login exists but does not unlock public-site functionality in MVP (PRD.md §2.4)  
- Map provider: OpenStreetMap tiles + Leaflet.js (open-source, free, no API key) (PRD.md §FR1.6, ROADMAP.md Phase 0 open decision #2, CLAUDE.md §32)  
- LLM API: Anthropic API direct (PRD.md §75, ROADMAP.md Phase 0 open decision #1, CLAUDE.md §31)  
- Passwords hashed via bcrypt/argon2 (NFR.md §23)  
- Secrets (API key, DB credentials, map key) via environment variables only (NFR.md §27)  
- No specific uptime SLA for MVP (NFR.md §19)  
- Price stored as integer in paise (INR smallest unit) to avoid floating-point issues (SCHEMA.md §102)  
- Latitude/longitude nullable to allow gradual geocoding (SCHEMA.md §104)  
- No over-normalization: amenities and photos as PostgreSQL arrays acceptable for MVP scale (SCHEMA.md §103)  

## Risks
- Scope creep risk: Implementing out-of-scope features (leads/CRM, notifications, etc.) violates PRD.md §4 and ROADMAP.md parking lot; mitigated by scope-risk labeling and Definition of Done checks  
- External dependency risk: Core functionality (chatbot, maps) relies on third-party services (Anthropic API, OpenStreetMap tiles); mitigated by graceful fallbacks (FR3.4, FR2.6) and rate limiting (NFR §4, FR3.6)  
- Data quality risk: Latitude/longitude nullable may result in incomplete map coverage if geocoding not implemented; mitigated by FR1.6 (map omits pins for null coordinates) and treating geocoding as implementation detail  
- Technical debt risk: Deferring decisions (e.g., primary blue shade reconciliation, login gating) may lead to rework; mitigated by resolving open items during phase-gate-nonblocking items early (ROADMAP.md §29)  

## Development Lifecycle
- Feature/fix/chore/docs work begins on a branch off `main` named `<type>/<issue-number>-<short-desc>` (GITHUB_WORKFLOW.md §3)  
- One issue per task (or substantial subtask); issue body references implemented doc/section and epic (Part of #<epic-number>) (GITHUB_WORKFLOW.md §4)  
- Labels applied at creation including `type:*` for branch prefix and `phase-*` for milestone (GITHUB_WORKFLOW.md §5)  
- `scope-risk` label applied if work touches out-of-scope list; requires decision before proceeding (GITHUB_WORKFLOW.md §5, CLAUDE.md §5)  
- Pull requests:  
  - Link closed issue(s) (`Closes #12`)  
  - State milestone/phase  
  - Describe what was tested (per TESTING_STRATEGY_AND_DOD.md §1.2)  
  - Include screenshot for UI-facing changes  
  - Confirm Definition of Done checklist (Reviewer treats unchecked DoD item as blocker)  
- CI checks required to merge: install deps, lint, typecheck, test suite (unit + integration; Playwright E2E on schedule/on-demand but must run before phase milestone closure), Prisma migration dry-run/validate if schema.touched (GITHUB_WORKFLOW.md §6)  
- No merging with `--admin`/bypassing branch protection  
- Project board: single GitHub Project with columns Backlog → In Progress → In Review → Done; issues grouped by milestone; cards moved as work progresses (GITHUB_WORKFLOW.md §7)  
- Lint, typecheck, and full test suite must pass before merge (CLAUDE.md §5, TESTING_STRATEGY_AND_DOD.md §1.4)  

## Release Strategy
- Release occurs per phase when gate is satisfied (ROADMAP.md §3-5, §23, §44, §57, §71, §84, §94)  
- Gate criteria:  
  - Phase 0: All planning docs exist and open decisions answered  
  - Phase 1: Fresh clone + `npm install` + migrate + seed produces working local DB with logged-in user and admin user; plus phase-1 report and screenshots  
  - Phase 2: Visitor can browse, search, view property details end-to-end against seeded data; plus phase-2 report and screenshots  
  - Phase 3: Visitor can ask "2BHK under 50 lakhs near a metro station" and get sensible AI-assisted answer with graceful fallback on AI failure; plus phase-3 report and screenshots  
  - Phase 4: Admin can create property and see it appear on public site; can edit/delete/unpublish; plus phase-4 report and screenshots  
  - Phase 5: MVP demoable start to finish without known broken states; plus phase-5 report and screenshots  
- Progress tracked via GitHub project board; milestone closed manually after issue closure and gate verification  
- No automated versioning or changelog; releases are phase-based internal milestones