# Development Lifecycle

This document outlines the complete software development lifecycle for the Property Vista CRM MVP project, including quality gates between each stage to ensure quality and adherence to project standards.

---

## Overview

The development lifecycle follows a structured, phased approach with defined quality gates at each transition point. This ensures that work meets quality standards before progressing to the next phase, reducing rework and maintaining consistency across the team.

## Phase 1: Requirement Analysis

### Activities
- Review business requirements in `02_PROJECT_OVERVIEW.md`, `PRD.md`, and `BRD.md`
- Identify user stories and acceptance criteria
- Clarify non-functional requirements from `NFR.md`
- Define scope boundaries and assumptions
- Identify dependencies and risks
- Create user personas and journey maps (if not already defined)
- Review existing similar features for consistency

### Deliverables
- Clear, testable requirement statements
- Updated/confirmed acceptance criteria in `TASKS.md`
- List of open questions requiring clarification
- Risk assessment and mitigation plan
- Requirement traceability matrix (linking requirements to implementation)

### Quality Gate: Requirements Review
**Criteria for progression:**
- [ ] All requirements are clear, unambiguous, and testable
- [ ] Requirements are traceable to business objectives
- [ ] No conflicting requirements identified
- [ ] Edge cases and error conditions considered
- [ ] Non-functional requirements (performance, security, usability) addressed
- [ ] Stakeholder approval obtained (if applicable)
- [ ] Any ambiguities resolved through clarification process

### Exit Criteria
If any gate criterion fails, return to requirement analysis for clarification before proceeding.

## Phase 2: Technical Design

### Activities
- Review system architecture in `SOLUTION_ARCHITECTURE.md`
- Define component interactions and data flow
- Identify required API contracts and database schema changes
- Select appropriate technologies and patterns
- Create technical design documents
- Review for scalability, maintainability, and performance
- Identify potential technical risks and mitigation strategies

### Deliverables
- Technical design specification
- API contract updates (for backend work)
- Database schema changes (for data-related work)
- Component diagrams and data flow diagrams
- Technology decisions justification
- Risk assessment and mitigation plan

### Quality Gate: Design Review
**Criteria for progression:**
- [ ] Design aligns with architectural principles in `SOLUTION_ARCHITECTURE.md`
- [ ] API contracts are consistent with `API_SPECIFICATION.md` guidelines
- [ ] Database design follows standards in `DATABASE_DESIGN.md`
- [ ] Design addresses all functional requirements
- [ ] Non-functional requirements considered (scalability, security, performance)
- [ ] Design is modular, maintainable, and follows separation of concerns
- [ ] Reviewed by at least one peer developer
- [ ] Any open design questions resolved

### Exit Criteria
If design review fails, return to technical design phase for revisions before proceeding.

## Phase 3: Database Design (if applicable)

### Activities
- Review existing schema in `DATABASE_DESIGN.md` and `prisma/schema.prisma`
- Design necessary schema changes (tables, columns, relationships, indexes)
- Consider data migration requirements
- Ensure data integrity constraints are properly defined
- Plan for backward compatibility where needed
- Review performance implications of schema changes

### Deliverables
- Updated `DATABASE_DESIGN.md` documentation
- Prisma schema migration files
- Database diagram showing new/existing relationships
- Data migration plan (if applicable)
- Performance impact assessment
- Update `SCREEN_DATABASE_MAPPING.md` if UI screens affected

### Quality Gate: Database Design Review
**Criteria for progression:**
- [ ] Schema changes are backward compatible or have migration plan
- [ ] Proper data types, constraints, and indexes defined
- [ ] Relationships correctly defined with appropriate cascade rules
- [ ] Naming conventions followed per `DATABASE_DESIGN.md`
- [ ] Indexes created for query performance where needed
- [ ] Data integrity maintained (foreign keys, unique constraints, etc.)
- [ ] Reviewed by database/backend lead or peer
- [ ] Migration scripts tested in development environment

### Exit Criteria
If database design review fails, return to database design for corrections before proceeding.
*Skip this phase if no database changes are required.*

## Phase 4: API Implementation (if applicable)

### Activities
- Implement API endpoints per `API_SPECIFICATION.md`
- Create/update controller functions in `src/backend/src/controllers/`
- Implement validation using Zod schemas
- Apply appropriate authentication, authorization, and rate limiting
- Implement error handling per standard format
- Write unit tests for controller logic
- Write integration tests for API endpoints
- Ensure proper logging implementation

### Deliverables
- Implemented API endpoints
- Updated validation schemas
- Unit tests for API logic
- Integration tests using Supertest
- Updated API documentation if needed
- Logging implementation

### Quality Gate: API Implementation Review
**Criteria for progression:**
- [ ] API implementation matches `API_SPECIFICATION.md`
- [ ] All endpoints properly secured (auth/authorization where required)
- [ ] Input validation implemented for all parameters
- [ ] Error responses follow standard format
- [ ] Logging implemented appropriately
- [ ] Unit tests achieve ≥90% coverage on new/modified files
- [ ] Integration tests validate API contracts
- [ ] Code follows `CODING_STANDARDS.md`
- [ ] Reviewed by peer developer
- [ ] No linting or TypeScript errors

### Exit Criteria
If API implementation review fails, return to API implementation for fixes before proceeding.
*Skip this phase if no API changes are required.*

## Phase 5: Frontend Implementation (if applicable)

### Activities
- Implement UI components per `ui/screens/` specifications and `design_reference/`
- Create/update components in `src/frontend/src/components/` or `app/`
- Connect to APIs using SWR/react-query or custom hooks
- Implement proper loading, error, and empty states
- Ensure responsive design with Tailwind breakpoints
- Implement accessibility features (ARIA labels, keyboard navigation)
- Add form validation with client-server parity
- Write unit tests with React Testing Library
- Write integration tests with Playwright for critical user flows

### Deliverables
- Implemented UI components/pages
- Connected API integrations
- Responsive design implementations
- Accessibility enhancements
- Form validation implementations
- Unit tests for components
- Playwright tests for user flows

### Quality Gate: Frontend Implementation Review
**Criteria for progression:**
- [ ] UI matches specifications in `ui/screens/` and `design_reference/`
- [ ] Responsive design works across all breakpoints
- [ ] Accessible keyboard navigation implemented
- [ ] ARIA attributes used appropriately
- [ ] Color contrast meets WCAG 2.1 AA standards
- [ ] Form validation and error handling implemented
- [ ] Loading and empty states handled
- [ ] State management follows established patterns
- [ ] Unit tests written for new components (≥80% coverage)
- [ ] Playwright tests for critical user flows
- [ ] Code follows `CODING_STANDARDS.md`
- [ ] Reviewed by peer developer
- [ ] No linting or TypeScript errors

### Exit Criteria
If frontend implementation review fails, return to frontend implementation for fixes before proceeding.
*Skip this phase if no frontend changes are required.*

## Phase 6: Testing

### Activities
- Execute all unit tests and verify coverage targets met
- Execute integration tests for API endpoints and service interactions
- Execute end-to-end tests for critical user journeys
- Execute UI/visual tests for visual regression checking
- Execute API contract tests for specification compliance
- Perform manual exploratory testing
- Performance testing for critical paths
- Security testing for authentication and authorization
- Accessibility testing (axe-core or similar)

### Deliverables
- Test reports (unit, integration, E2E, UI)
- Coverage reports
- Performance test results
- Security scan results
- Accessibility audit report
- Bug reports for any issues found
- Fixed issues and retest confirmation

### Quality Gate: Testing Gate
**Criteria for progression:**
- [ ] Unit tests achieve ≥90% coverage for critical paths (auth, property, payment, chat)
- [ ] Integration tests achieve ≥80% coverage for API endpoints
- [ ] All E2E tests pass for critical user journeys
- [ ] No critical or high-severity bugs remain open
- [ ] Performance benchmarks met for key transactions
- [ ] Security vulnerabilities addressed (no high/critical findings)
- [ ] Accessibility compliance meets WCAG 2.1 AA
- [ ] All tests pass in CI environment
- [ ] No regressions introduced

### Exit Criteria
If testing gate fails, return to implementation phase to fix defects before retesting.

## Phase 7: Documentation Updates

### Activities
- Update all affected documentation in same PR as code changes
- API changes: Update `API_SPECIFICATION.md`
- Database changes: Update `DATABASE_DESIGN.md` and `SCREEN_DATABASE_MAPPING.md`
- UI changes: Update `ui/screens/` files, `FRONTEND_FUNCTIONAL_SPEC.md`, `USER_FLOWS.md`, `COMPONENT_LIBRARY.md`
- Business rule changes: Update `BUSINESS_RULES.md`
- Process changes: Update `GIT_WORKFLOW.md`, `TEST_PLAN.md`
- Feature additions/removals: Update `PRD.md`, `IMPLEMENTATION_PLAN.md`, `TASKS.md`
- Ensure documentation accurately reflects implemented state
- Add code samples and examples where helpful
- Update any affected diagrams or models
- Verify all internal links remain valid

### Deliverables
- Updated documentation files
- Clear, concise documentation with examples
- Updated diagrams/models where applicable
- Valid internal links
- Documentation that matches implementation exactly

### Quality Gate: Documentation Review
**Criteria for progression:**
- [ ] All affected documentation updated in same PR
- [ ] Documentation accurately reflects implemented state
- [ ] API spec changes match implementation exactly
- [ ] Database schema changes documented properly
- [ ] UI changes reflected in screen specifications
- [ ] Business rule changes documented
- [ ] Documentation follows established style and format
- [ ] Examples and code samples match current implementation
- [ ] All internal links are valid and functional
- [ ] Reviewed by peer or technical writer

### Exit Criteria
If documentation review fails, update documentation and resubmit for review.

## Phase 8: Code Review

### Activities
- Create pull request from feature branch to `main`
- Ensure PR follows contribution guidelines
- Request reviews from appropriate team members
- Address all review comments promptly
- Ensure all checks pass (CI, linting, tests)
- Incorporate feedback and improve code quality
- Obtain required approvals

### Deliverables
- Pull request with clear description
- Responses to all review comments
- Updated code addressing feedback
- Approved pull request
- Passing CI checks

### Quality Gate: Code Review Approval
**Criteria for progression:**
- [ ] At least one approving review from team member
- [ ] All review comments addressed or resolved
- [ ] CI pipeline passes (build, tests, linting, security scans)
- [ ] No merge conflicts with `main` branch
- [ ] Code follows all standards in `CODING_STANDARDS.md`
- [ ] Security considerations addressed
- [ ] Performance implications evaluated
- [ ] Test coverage meets requirements
- [ ] Documentation updated as required

### Exit Criteria
If code review is not approved, address feedback and resubmit for review.

## Phase 9: Deployment

### Activities
- Deploy to staging environment following deployment workflow
- Execute smoke tests in staging
- Perform integration testing in staging
- Conduct user acceptance testing (if applicable)
- Validate performance in staging environment
- Monitor logs and metrics for anomalies
- Obtain stakeholder sign-off for production release
- Schedule production deployment (if manual approval required)
- Deploy to production environment
- Execute post-deployment smoke tests
- Monitor key metrics post-deployment
- Conduct post-deployment retrospective

### Deliverables
- Successfully deployed application to staging
- Test reports from staging environment
- Stakeholder sign-off for production
- Successfully deployed application to production
- Post-deployment verification reports
- Monitoring logs and metrics
- Retrospective notes and action items

### Quality Gate: Deployment Readiness
**Criteria for progression to staging:**
- [ ] Code review approved and merged to `main`
- [ ] Release version determined and documented
- [ ] Deployment scripts tested and validated
- [ ] Rollback procedure prepared and tested
- [ ] Configuration validated for target environment
- [ ] Database migrations tested in staging copy
- [ ] Smoke test suite passes in staging
- [ ] Performance benchmarks met in staging
- [ ] Security scans clean in staging
- [ ] Stakeholder approval obtained for production

### Quality Gate: Production Release
**Criteria for progression to production:**
- [ ] All staging tests pass
- [ ] Performance benchmarks met in staging
- [ ] No critical issues identified in staging
- [ ] Security vulnerabilities addressed
- [ ] Rollback tested and verified
- [ ] Monitoring and alerting configured
- [ ] On-call support notified and prepared
- [ ] Stakeholder sign-off obtained
- [ ] Release communication prepared

### Exit Criteria
If deployment fails or issues are detected, initiate rollback procedure and return to implementation phase to fix defects.

## Phase 10: Release Management

### Activities
- Version release according to SemVer
- Update changelog with detailed changes
- Communicate release to stakeholders and users
- Monitor post-release metrics and feedback
- Address any post-release issues
- Conduct retrospective and capture lessons learned
- Update roadmap and planning documents as needed
- Archive release artifacts

### Deliverables
- Versioned release (following SemVer)
- Updated CHANGELOG.md
- Release notes and communication
- Post-release monitoring report
- Issue resolution report (if applicable)
- Retrospective notes and action items
- Updated planning documents

### Quality Gate: Release Closure
**Criteria for completion:**
- [ ] Version released according to SemVer
- [ ] Changelog updated with all changes
- [ ] Release communicated to stakeholders
- [ ] Post-release monitoring shows stable operation
- [ ] Any post-release issues addressed or tracked
- [ ] Retrospective conducted and action items captured
- [ ] Release artifacts archived
- [ ] Planning documents updated if needed

---

## Quality Gates Summary

Each phase transition has a defined quality gate that must be passed before proceeding:

1. **Requirements → Design**: Requirements Review
2. **Design → Database**: Design Review  
3. **Database → API**: Database Design Review
4. **API → Frontend**: API Implementation Review
5. **Frontend → Testing**: Frontend Implementation Review
6. **Testing → Documentation**: Testing Gate
7. **Documentation → Code Review**: Documentation Review
8. **Code Review → Deployment**: Code Review Approval
9. **Deployment → Release**: Deployment Readiness & Production Release Gates
10. **Release → Complete**: Release Closure Gate

## Cross-Cutting Practices

### Throughout All Phases
- Maintain clear communication with team and stakeholders
- Follow the Claude Code workflow defined in `CLAUDE_WORKFLOW.md`
- Adhere to coding standards in `CODING_STANDARDS.md`
- Follow Git workflow in `GIT_WORKFLOW.md`
- Apply security best practices from `NFR.md` and coding standards
- Consider performance implications in all design decisions
- Ensure accessibility compliance (WCAG 2.1 AA)
- Maintain testability in mind
- Document decisions and assumptions
- Seek clarification instead of making assumptions
- Never skip quality gates

### Handling Blockers
If blocked at any phase:
1. Clearly document the blocker
2. Identify what is needed to unblock
3. Communicate to appropriate stakeholders
4. Do not proceed with dependent work
5. Work on other tasks if available
6. Escalate if blocker persists beyond reasonable time

## References
- [00_MASTER_INDEX.md](../../00_MASTER_INDEX.md) - Mandatory first read
- [CLAUDE_WORKFLOW.md](./CLAUDE_WORKFLOW.md) - Claude Code specific workflow
- [CODING_STANDARDS.md](./CODING_STANDARDS.md) - Technical standards
- [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) - Git processes
- [TEST_PLAN.md](../../testing/TEST_PLAN.md) - Testing strategy
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Repository organization
- [AI_CONTEXT.md](../../AI_CONTEXT.md) - AI assistant guidance

---

*Document maintained by the Project Team. Last updated: 2026-07-24.*
*Questions or suggestions for improvement should be submitted as issues to the project repository.*