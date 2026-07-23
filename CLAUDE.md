# graphify
- **graphify** (`~/.claude/skills/graphify/SKILL.md`) - any input to knowledge graph. Trigger: `/graphify`
When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.
# currentDate
Today's date is 2026-07-23.

      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.


# Project Specific Instructions
This project is a Property Website MVP with AI chatbot assistant.

Key documents to understand the project:
- PRD.md - Product Requirements
- ROADMAP.md - Implementation phases
- NFR.md - Non-functional requirements
- API_CONTRACT.md - API specifications
- SCHEMA.md - Database schema
- UI_REFERENCE.md + design_reference/ - UI designs and components

Core features:
1. Property browsing & search (public)
2. Authentication (register/login/logout, admin flag)
3. AI chatbot (Q&A, tool-calling to property data)
4. Admin property management (CRUD, publish/unpublish)

Tech stack:
- Frontend: Next.js/React with Tailwind CSS
- Backend: Node.js/Express with Prisma ORM
- Database: PostgreSQL
- AI: Anthropic Claude API
- Maps: OpenStreetMap + Leaflet.js

When working on this project:
1. Always check the relevant documentation first
2. Follow the phased approach in ROADMAP.md
3. Ensure API changes match API_CONTRACT.md
4. Keep database schema in sync with SCHEMA.md
5. Follow UI designs in UI_REFERENCE.md and design_reference/
6. Write tests according to TESTING_STRATEGY_AND_DOD.md
7. Use the GitHub workflow defined in GITHUB_WORKFLOW.md