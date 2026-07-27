# User Roles

This document defines the user roles for the Property Website MVP, their responsibilities, permissions, accessible modules, restricted actions, and authentication requirements.

## Roles Overview

| Role | Description |
|------|-------------|
| Visitor | Unauthenticated user accessing public-facing pages. |
| Customer | Registered property seeker with a personal dashboard. |
| Agent | Sales agent responsible for lead management and property listing operations. |
| Admin | System administrator with full access to all modules and settings. |

---

## Visitor

**Responsibilities**
- Browse the homepage and learn about the service.
- Perform property searches (AI-powered or filter‑based).
- View property detail pages.
- Express interest in a property (submit inquiry) without creating an account.
- Access the AI chatbot for general questions and FAQs.

**Permissions**
- Read‑only access to public content.
- Ability to submit a property inquiry (creates an anonymous lead).
- Ability to interact with the chatbot (send/receive messages).

**Accessible Modules**
- `propvista_crm_homepage`
- `search_results_standard_view`
- `search_results_filter_fallback_view`
- `search_results_empty_state`
- `property_details_premium_view`

**Restricted Actions**
- Access any authenticated dashboard or administrative interface.
- Create, edit, or delete property listings.
- Manage leads (view pipeline, lead detail, bulk operations).
- Access AI configuration, admin command center, or bulk upload results.
- Save properties, manage requirement profile, or view inquiry history.

**Authentication Requirements**
- No authentication required for any visitor actions.

---

## Customer

**Responsibilities**
- Register and authenticate to the platform.
- Manage a personal dashboard showing saved properties, requirement profile, and inquiry history.
- Save properties of interest for later review.
- Create and maintain a requirement profile (budget, property type, location, etc.).
- View the status and history of inquiries submitted.
- Receive notifications about new matches or updates.
- Use the AI chatbot with personalized context (if authenticated).

**Permissions**
- Full access to own customer dashboard.
- Ability to save/un‑save properties.
- Ability to create, edit, and delete requirement profile entries.
- Ability to view and manage personal inquiry history.
- Ability to submit property inquiries (linked to authenticated user).
- Ability to interact with the chatbot (authenticated session).

**Accessible Modules**
- `customer_account_dashboard` (primary)
- `property_details_premium_view` (view only)
- `propvista_crm_homepage` (public pages remain accessible)

**Restricted Actions**
- Access agent‑only modules: lead pipeline, lead detail, property inventory (admin view), bulk upload validation results.
- Access admin‑only modules: AI chatbot configuration, admin command center.
- Perform bulk operations (import/export) or bulk lead uploads.
- Modify system‑wide settings or view global metrics.

**Authentication Requirements**
- Must log in via email/password (or social login) to access customer‑specific features.
- Session maintained via secure cookie or token; re‑authentication required after session expiry.

---

## Agent

**Responsibilities**
- Manage leads through the entire sales pipeline (from initial contact to closed won/lost).
- Create and edit property listings to keep inventory accurate.
- View and filter the property inventory (read‑only or limited edit based on ownership).
- Conduct bulk lead uploads (if permitted) and review validation results.
- Use the AI chatbot for lead‑related queries and follow‑up suggestions.
- Update lead stages, assign tasks, and log communication history.

**Permissions**
- Full access to lead management: view pipeline, lead detail, update stages, add notes/tasks.
- Ability to create, edit, and delete property listings (subject to business rules; may be limited to own listings or all listings depending on configuration).
- Ability to upload leads in bulk and review validation results (if permission granted; otherwise view‑only).
- Ability to view property inventory (grid) with filtering, sorting, and pagination.
- Ability to export data (CSV) for leads or properties they own/manage.

**Accessible Modules**
- `lead_pipeline_kanban_view`
- `lead_detail_sarah_jenkins`
- `listing_editor_basic_info`
- `property_inventory_admin_view` (view/edit permissions as per configuration)
- `bulk_upload_validation_results` (if bulk‑lead upload permission granted)
- `propvista_crm_homepage` and all public property views
- `customer_account_dashboard` (read‑only view of own customer profile if also a customer; otherwise not applicable)

**Restricted Actions**
- Access admin‑only modules: AI chatbot configuration, admin command center.
- Perform system‑wide bulk property uploads (if restricted to admin only).
- Modify global AI behavior, escalation rules, or chatbot FAQ.
- View or modify another agent’s private lead notes/tasks without permission.
- Delete property listings permanently (may require admin approval).

**Authentication Requirements**
- Must log in with agent credentials (email/password, possibly with MFA).
- Role‑based access control (RBAC) enforced at the API level.
- Session timeout and re‑authentication applies same as for customers.

---

## Admin

**Responsibilities**
- Oversee the entire system: monitor key performance indicators, manage users, and configure platform behavior.
- Manage all property listings (create, edit, archive, delete) and leads (all stages).
- Conduct bulk uploads for properties and leads, and review validation results.
- Configure the AI chatbot (greeting, FAQ, escalation rules, model selection).
- Administer the admin command center (KPIs, charts, activity feed).
- Manage user roles and permissions (if user‑management UI exists; otherwise via backend).
- Ensure data quality, perform audits, and generate reports.

**Permissions**
- Full CRUD access to all modules: properties, leads, users, system settings.
- Access to bulk upload validation results for both property and lead imports.
- Full access to AI chatbot configuration (greeting, FAQ, escalation, model, tone).
- Unrestricted access to admin command center (KPIs, charts, activity feed).
- Ability to view and manage all customer dashboards (if needed for support).
- Ability to perform system‑wide exports, backups, and maintenance tasks.

**Accessible Modules**
- All modules listed for Visitor, Customer, Agent, plus:
  - `bulk_upload_validation_results` (full access)
  - `ai_chatbot_configuration`
  - `admin_agent_command_center`
  - Any future user‑management or settings modules.

**Restricted Actions**
- None within the MVP scope; admin has unrestricted access to all defined features.
- Restrictions may apply only to platform‑level infrastructure (e.g., server configuration, billing) which is out of scope for the MVP.

**Authentication Requirements**
- Must log in with admin credentials (email/password, enforced MFA recommended).
- Highest privilege level; session handling identical to other authenticated roles but with additional audit logging.
- Password policy and account lockout rules apply as per security requirements.

---

## Summary Table

| Role | Authentication Required | Accessible Modules (Key) | Restricted Modules |
|------|------------------------|--------------------------|--------------------|
| Visitor | No | Public pages only (homepage, search views, property details) | All authenticated modules |
| Customer | Yes (login) | Customer dashboard, public property views | Agent & Admin modules (lead pipeline, property inventory, bulk upload, AI config, admin command center) |
| Agent | Yes (login) | Lead pipeline, lead detail, property editor, property inventory (view/edit as permitted), bulk upload results (if permitted), public pages | Admin‑only modules (AI config, admin command center) |
| Admin | Yes (login) | All modules (including agent and customer) | None (full access) |

--- 

*This user‑role model aligns with the functional requirements captured in the BRD, PRD, and the design reference documents (see `design-references-catalog.md` for role‑specific screen mapping).*