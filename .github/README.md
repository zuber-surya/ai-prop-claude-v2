# GitHub Repository Configuration

This directory contains GitHub-specific configurations for the Property Vista CRM MVP project.

## Issue Templates

The following issue templates are available:

1. **Bug Report** (`bug_report.yml`) - For reporting bugs
2. **Feature Request** (`feature_request.yml`) - For suggesting new features
3. **Task** (`task.yml`) - For creating sprint tasks

## Using Issue Templates for Sprint Planning

To create sprint tasks:

1. Click "Issues" in the GitHub repository
2. Click "New Issue"
3. Select the "Task" template
4. Fill in the form with:
   - Task ID (e.g., T001, T002)
   - Priority (Low/Medium/High/Critical)
   - Detailed description
   - Acceptance criteria
   - Dependencies (if any)
   - Additional notes

## Sprint Planning Process

Based on SPRINT_PLAN.md, the project follows 2-week sprints with the following phases:

1. **Sprint 1: Foundation & Setup** (T001-T046)
2. **Sprint 2: Core Property Catalog & Search (Part 1)** (T063-T108)
3. **Sprint 3: Core Property Catalog & Search (Part 2)** (T098-T143)
4. **Sprint 4: User Roles, Profiles & Basic Interactions** (T154-T210)
5. **Sprint 5: Booking & Appointment Management** (T210-T265)
6. **Sprint 6: Payments & Premium Listings** (T269-T308)
7. **Sprint 7: Notifications & Real-Time Updates** (T311-T356)
8. **Sprint 8: Admin Dashboard & Management** (T357-T419)
9. **Sprint 9: AI Chatbot & Advanced Search** (T421-T485)
10. **Sprint 10: Polish, Performance, and Release Preparation** (T486-T529)

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

## GitHub Workflows

The repository includes a CI/CD pipeline (`.github/workflows/ci-cd.yml`) that:
- Runs on push/pull request to main and develop branches
- Executes linting, testing, and building
- Deploys to staging from develop branch
- Deploys to production from main branch
- Includes test coverage reporting

## Project Structure

The repository follows a monorepo structure with:
- `/packages/frontend` - Next.js/React application
- `/packages/backend` - Node.js/Express API
- `/packages/shared` - Shared TypeScript types and utilities

## Development Workflow

1. Create a feature branch from `develop`: `git checkout -b feat/feature-name develop`
2. Make changes and commit following [Conventional Commits](https://www.conventionalcommits.org/)
3. Push branch and open Pull Request targeting `develop`
4. Ensure CI checks pass
5. Request review from team members
6. Squash and merge upon approval
7. Regularly deploy develop to staging and main to production