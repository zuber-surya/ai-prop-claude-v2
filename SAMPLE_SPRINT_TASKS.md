# Sample Sprint Tasks for Property Vista CRM MVP

This document shows examples of how sprint tasks would appear as GitHub Issues using the provided templates.

## Sprint 1: Foundation & Setup (T001-T046)

### Issue Template: Task
**Title**: [TASK]: T001: Monorepo structure created with frontend, backend, and shared directories

**Body**:
```
## Task Description
Monorepo structure created with frontend, backend, and shared directories

## Acceptance Criteria
- Monorepo structure created with frontend, backend, and shared directories

## Dependencies
None

## Additional Notes
This is a foundational task for setting up the project structure.
```

**Labels**: `task`

---

### Issue Template: Task
**Title**: [TASK]: T011: User can register with valid email/password

**Body**:
```
## Task Description
User can register with valid email/password

## Acceptance Criteria
- User can register with valid email/password
- Registration form validates email format and password strength
- Success/error messages are displayed appropriately
- User receives email verification upon successful registration

## Dependencies
T001, T002, T003, T004, T005, T006, T007, T008, T009, T010

## Additional Notes
This task implements the user registration feature including form validation, backend API, and email verification.
```

**Labels**: `task`

---

## Sprint 2: Core Property Catalog & Search (Part 1) (T063-T108)

### Issue Template: Task
**Title**: [TASK]: T063: Property and property_media tables created via migration

**Body**:
```
## Task Description
Property and property_media tables created via migration

## Acceptance Criteria
- Property table created with required fields (title, price, beds, baths, area, description, location, etc.)
- Property_media table created to store media relationships
- Migration files generated and applied successfully
- Database schema updated accordingly

## Dependencies
T036, T037, T038, T039, T040, T041, T042, T043, T044, T045, T046

## Additional Notes
This task sets up the core property data models needed for the property catalog feature.
```

**Labels**: `task`

---

## Sprint 4: User Roles, Profiles & Basic Interactions (T154-T210)

### Issue Template: Task
**Title**: [TASK]: T154: Role-based middleware blocks unauthorized access

**Body**:
```
## Task Description
Role-based middleware blocks unauthorized access (e.g., customer cannot access `/admin`)

## Acceptance Criteria
- Role-based middleware implemented
- Middleware correctly identifies user roles from JWT
- Customers attempting to access `/admin` receive 403 Forbidden
- Agents can access agent-only routes
- Admins can access all routes
- Proper error responses for unauthorized access attempts

## Dependencies
T013, T014, T015, T016, T017, T018, T019, T020, T021, T022, T023, T024, T025, T026, T027, T028, T029, T030, T031, T032, T033, T034, T035

## Additional Notes
This task implements the role-based access control (RBAC) system that secures application routes based on user roles.
```

**Labels**: `task`
