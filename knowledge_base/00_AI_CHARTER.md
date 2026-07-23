# 00_AI_CHARTER.md

## Project Mission
Ship public property-browsing site
Include AI assistant for visitor queries
Provide minimal admin tool for listing management

## Success Criteria
Visitor browses filters views property details end-to-end no account
Visitor asks natural-language question gets relevant answer referencing listings
Graceful fallback on AI failure
Admin creates listing sees it live same session
No out-of-scope feature present in shipped code

## Engineering Principles
Always check relevant documentation first
Follow phased approach per ROADMAP.md
Ensure API changes match API_CONTRACT.md
Keep database schema in sync with SCHEMA.md
Follow UI designs in UI_REFERENCE.md design_reference/
Write tests per TESTING_STRATEGY_AND_DOD.md
Use GitHub workflow per GITHUB_WORKFLOW.md
Run lint typecheck test suite before merge
Keep secrets in env vars only
Hash passwords bcrypt/argon2
Enforce isAdmin server-side
Validate sanitize all inputs
Rate limit chat login per session/IP
Server-render pages for fast first paint SEO
Optimize images responsive
Keep search latency under ~1s seeded data
Stream chatbot responses if API supports
Maintain Prisma single source of truth
Keep API routes per contract
No PII beyond email password
No 7-year audit log needed

## Decision Priority Order
1 User instructions (CLAUDE.md AGENTS.md GEMINI.md direct requests)
2 Skills (e.g. graphify)
3 Default behavior
Scope authority bound by ROADMAP.md CLAUDE.md
If conflict with out-of-scope list in PRD.md ROADMAP.md those docs win
Do not start phase until previous phase gate checked off

## AI Autonomy Rules
Invoke relevant skilled before any response including clarifying questions
If think 1% chance skill applies MUST use it
Check for existing graph agent continue via SendMessage
Follow skill exactly create todo per checklist if present
Process skills come first then implementation skills
Before plan mode brainstorming skill first
User instructions trump skills which override default

## Human Approval Gates
Phase gate satisfied when every issue in milestone closed AND corresponding ROADMAP checklist checked AND DoD met per TESTING_STRATEGY_AND_DOD.md
Produce phase report REPORT.md screenshots per REPORTING.md before closing milestone
One PR per task/subtask-issue
PR must link issue(s) state milestone describe what tested per TESTING_STRATEGY_AND_DOD §1.2 include screenshot for UI change confirm DoD checklist
CI checks install deps lint typecheck test suite Prisma migration deform if schema touched must pass before merge
Project board columns Backlog In Progress In Review Done every issue on board grouped by milestone

## Security Principles
Passwords hashed bcrypt argon2 never stored/plaintext logged
isAdmin-gated routes enforced server-side middleware or route check
Input validation sanitization all form inputs chat endpoint
No PII beyond email password collected
Secrets API key DB credentials map key via env vars only never committed
Rate limit chat endpoint per session/IP
Rate limit login/register attempts
No specific uptime SLA for MVP
Graceful degradation AI failure rest of site works
Admin CRUD failures show clear error not silent blank
Standard error struct {error:{code message}} with appropriate HTTP status

## Architecture Principles
Frontend Next.js React Tailwind CSS
Backend Node.js Express Prisma ORM
Database PostgreSQL
AI Anthropic Claude API
Maps OpenStreetMap Leaflet.js
Three-tier separation presentation application data external services
Loose coupling via well-defined APIs API_CONTRACT.md
Stateless design session via cookie chat state client-side or session-scoped
Horizontal scaling API layer behind load balancer DB potential bottleneck
Server-rendered pages for SEO performance NFR §1 5
Images optimized responsive NFR §1
Search latency under ~1s seeded data NFR §1
Chatbot stream if API supports NFR §1
Prisma single source of truth schema NFR §7
API routes follow contract NFR §7
Lint typecheck CI NFR §7
No over-normalization amenities photos as Postgres arrays OK MVP
Price integer paise avoids floating point
Latitude longitude nullable allow gradual geocoding
Optional userId in ChatMessage supports anonymous authenticated chats
Status enum draft published indexed filter
Indexes status price type support core query patterns
SessionId index ChatMessage supports session queries

## Documentation Standards
Always check relevant documentation first
Keep design system single source of truth Tailwind config from DESIGN.md
Update API_CONTRACT.md when endpoints change
Keep SCHEMA.md Prisma migration in sync
Follow UI_REFERENCE.md screen-to-route mapping strip out-of-scope elements
Maintain design_reference/ code.html as structural starting point
Produce phase report REPORT.md screenshots per REPORTING.md after gate satisfied
Keep REPORT.md factual short plain language bullets
One screenshot per major page/flow reflect seed data reproducible
Issue title short imperative body must reference doc/section implemented and epic Part of #<epic-number>
Labels include type:* for branch prefix
Project board tracks issues by milestone
Test documentation per TESTING_STRATEGY_AND_DOD.md unit API/integration E2E

## Quality Standards
Test levels unit API/integration E2E per TESTING_STRATEGY_AND_DOD.md §1.1
Required coverage per phase per §1.2
Phase1 register login logout happy path duplicate email wrong password isAdmin flag
Phase2 GET /api/properties filter sort pagination combos GET /api/properties/:id found 404 unpublished never appear
Phase3 normal query reply empty no-graceful graceful AI failure simulated triggers 503 fallback rate limit triggers 429 after threshold
Phase4 create edit delete unpublish round-trip non-admin 403 anonymous 401 published appears immediately reverted disappears
Phase5 smoke E2E full PRD §6 success criteria one run
All tests pass none skipped disabled to make CI green
Lint typecheck both pass no added suppressions unless justified in code comment
Manual check change run locally for user-facing flow screenshot or short note in PR
Roadmap updated corresponding checklist item checked same PR or follow-up with reason
No silent scope decisions flag ambiguity need out-of-scope in PR desc not resolve unilaterally
CI install deps lint typecheck test suite Prisma migration deform if schema touched must pass before merge
Performance availability security cost SEO privacy maintainability per NFR.md
No load testing accessibility audit visual regression cross-matrix beyond Playwright default

## Definition of Complete Documentation
Phase report REPORT.md plus screenshots in /reports/phase-<N>-<name>/ per REPORTING.md
All relevant docs updated when change made PRD ROADMAP NFR API_CONTRACT SCHEMA UI_REFERENCE design_reference/ TESTING_STRATEGY GITHUB_WORKFLOW
API_CONTRACT matches implementation exactly or updated same PR
SCHEMA.md and Prisma migration updated same PR migration runs cleanly fresh DB
Design documentos match implemented UI per UI_REFERENCE.md design_reference/
Test coverage per TESTING_STRATEGY_AND_DOD.md for phase present
Documentation considered complete when phase gate satisfied report produced and all artifacts per Definition of Done satisfied