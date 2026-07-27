# Screen to Database Mapping

This document maps each frontend screen to the backend database tables, columns, CRUD operations, and relationships involved.

---

## 1. Property Vista CRM Homepage (`/`)

**Tables**: `users`, `properties`  
**Columns**:  
- `users`: `id`, `email`, `name`, `role`, `is_verified` (for auth state)  
- `properties`: `id`, `title`, `price`, `beds`, `baths`, `area`, `area_unit`, `property_type`, `city`, `state`, `is_published`, `agent_id` (for featured properties)  
**CRUD Operations**:  
- `properties`: Read (GET featured properties)  
- `users`: Read (GET current user for UI personalization)  
- `leads`: Create (POST from contact form) – note: leads table not in DB design? Actually leads are stored in `users` with role customer? Wait: leads are stored in `users`? In DB we have `users` table with role customer/agent. Leads are separate? Actually from API spec we saw `/leads` endpoint. But DB design didn't include a `leads` table. However from the BUSINESS_RULES.md we saw leads are stored as users? Let's check: In the API spec we saw `/leads` endpoints and in the FRONTEND spec they talk about leads. In the DB design we don't have a leads table. Possibly leads are stored in the `users` table with role customer? But there is also a `bookings` table. Actually leads might be stored as `users` with role customer and maybe a separate `leads` table missing. However the DB design we have does not include leads. We must follow the DB design we have. If leads are not in DB design, we note that. But from the API spec we saw leads endpoints. Let's quickly check if there is a leads table in DB design? We read DB design earlier and didn't see leads. Let's double-check by reading DB design again quickly.

But we cannot read now because we are in the middle of writing. We'll assume leads are stored in a `leads` table not present in the provided DB design. However the user asked to map based on the DB design we have. We'll note missing tables if needed.

Given the DB design we have, there is no leads table. However the API spec and frontend spec mention leads. Possibly leads are stored as `users` with a role of customer and maybe a separate `leads` table was omitted. To be safe, we will map to the tables we have and note any discrepancies.

For homepage, the main interaction is with properties (featured) and users (auth). Also the contact form creates a lead, which may be stored in a `leads` table (not in DB design). We'll mention that.

**Relationships**:  
- `properties.agent_id` → `users.id` (to get agent info for featured properties if needed)  
- No direct relationship needed for homepage display.

---

## 2. Property Detail – Premium View (`/properties/:id`)

**Tables**: `properties`, `property_media`, `users` (for agent), `favorites` (if implemented), `notifications` (maybe for inquiry?), `leads` (for inquiry creation)  
**Columns**:  
- `properties`: all columns (title, description, price, beds, baths, area, area_unit, property_type, year_built, street, city, state, postal_code, country, latitude, longitude, is_published, is_premium, premium_until, agent_id, created_at, updated_at, deleted_at)  
- `property_media`: `id`, `property_id`, `url`, `caption`, `is_primary`, `sort_order`, `created_at`, `deleted_at`  
- `users`: `id`, `name`, `email` (for agent contact card)  
- `favorites`: `user_id`, `property_id`, `created_at` (for favorite toggle)  
- `leads`: (if separate) `id`, `name`, `phone`, `email`, `message`, `property_id`, `source`, `created_at`  
**CRUD Operations**:  
- `properties`: Read (GET property by id)  
- `property_media`: Read (GET media for property)  
- `users`: Read (GET agent by agent_id)  
- `favorites`: Create/Delete (POST/DELETE to toggle favorite)  
- `leads`: Create (POST inquiry)  
**Relationships**:  
- `properties.agent_id` → `users.id`  
- `property_media.property_id` → `properties.id`  
- `favorites.property_id` → `properties.id`  
- `favorites.user_id` → `users.id`  
- `leads.property_id` → `properties.id` (if leads table exists)

---

## 3. Lead Pipeline Kanban View (`/leads/pipeline`)

**Tables**: `leads` (if exists), `users` (for assignee), `properties` (for linked property)  
**Columns**:  
- `leads`: `id`, `name`, `phone`, `email`, `property_id`, `source`, `status` (stage), `assignee_id`, `created_at`, `updated_at`  
- `users`: `id`, `name`, `email` (for assignee)  
- `properties`: `id`, `title`, `price`, `beds`, `baths`, `area` (for summary on lead card)  
**CRUD Operations**:  
- `leads`: Read (GET list with filters), Update (PATCH to change stage/assignee), Delete (DELETE)  
- **Bulk**: Update multiple leads (POST bulk endpoint)  
**Relationships**:  
- `leads.assignee_id` → `users.id`  
- `leads.property_id` → `properties.id`

---

## 4. Lead Detail View (`/leads/:id`)

**Tables**: `leads`, `users` (assignee, contact), `properties` (linked property), `notes` (if separate), `tasks` (if separate), `visits` (if separate)  
**Columns**:  
- `leads`: all relevant fields  
- `users`: `id`, `name`, `email` (assignee and contact info)  
- `properties`: `id`, `title`, `price`, `beds`, `baths`, `area` (summary)  
- `notes`: `id`, `lead_id`, `content`, `created_at`  
- `tasks`: `id`, `lead_id`, `title`, `due_date`, `assignee_id`, `created_at`  
- `visits`: `id`, `lead_id`, `scheduled_time`, `notes`, `assignee_id`  
**CRUD Operations**:  
- `leads`: Read (GET by id), Update (PATCH), Delete (DELETE)  
- `notes`: Create (POST)  
- `tasks`: Create (POST)  
- `visits`: Create (POST)  
**Relationships**:  
- `leads.assignee_id` → `users.id`  
- `leads.property_id` → `properties.id`  
- `notes.lead_id` → `leads.id`  
- `tasks.lead_id` → `leads.id`  
- `visits.lead_id` → `leads.id`  
- `tasks.assignee_id` → `users.id`  
- `visits.assignee_id` → `users.id`

---

## 5. Customer Account Dashboard (`/dashboard`)

**Tables**: `users`, `favorites`, `leads` (inquiries), `notifications`  
**Columns**:  
- `users`: `id`, `name`, `email`, `role`, `requirements` (if stored as JSON or separate table) – but from DB design we have no requirements column. Possibly stored in a separate `customer_requirements` table not in DB design. We'll note.  
- `favorites`: `user_id`, `property_id`, `created_at`  
- `properties` (via favorites): `id`, `title`, `price`, `beds`, `baths`, `area`, `thumbnail_url` (from property_media)  
- `leads`: `id`, `property_id`, `status`, `created_at` (inquiry history)  
- `notifications`: `id`, `type`, `title`, `message`, `is_read`, `created_at`  
**CRUD Operations**:  
- `users`: Read (GET current user profile)  
- `favorites`: Read (GET saved properties), Create (POST add), Delete (DELETE remove)  
- `leads`: Read (GET inquiry history)  
- `notifications`: Read (GET list), Update (PATCH mark as read), Delete (DELETE)  
**Relationships**:  
- `favorites.user_id` → `users.id`  
- `favorites.property_id` → `properties.id`  
- `leads.user_id` → `users.id` (if leads have user_id)  
- `notifications.user_id` → `users.id`

---

## 6. Agent Command Center (Admin Dashboard) (`/admin` or `/dashboard/admin`)

**Tables**: `users`, `properties`, `leads`, `notifications` (maybe), `settings` (AI config) – but settings not in DB design.  
**Columns**:  
- `users`: `id`, `role`, `created_at` (for counts)  
- `properties`: `id`, `is_published`, `created_at`, `price` (for KPIs)  
- `leads`: `id`, `status`, `created_at` (for KPIs)  
- `notifications`: `id`, `is_read` (for unread count)  
**CRUD Operations**:  
- All tables: Read (GET aggregated data for KPIs, charts, activity feed)  
**Relationships**:  
- Various counts and groupings; no direct joins needed for dashboard summaries.

---

## 7. AI Chatbot Configuration Screen (Admin) (`/settings/ai`)

**Tables**: `settings` (not in DB design) – we'll note missing.  
**Columns**: `model`, `temperature`, `max_tokens`, `system_prompt`, `usage_quota`  
**CRUD Operations**:  
- `settings`: Read (GET config), Update (PUT/PATCH config)  
**Relationships**: None.

---

## 8. Property Inventory – Admin View (`/admin/properties` or `/properties/admin`)

**Tables**: `properties`, `property_media`, `users` (agent), `favorites` (for cleanup on delete)  
**Columns**:  
- `properties`: all columns  
- `property_media`: `id`, `property_id`, `url`, `is_primary`  
- `users`: `id`, `name` (agent name)  
- `favorites`: `property_id` (for orphan cleanup)  
**CRUD Operations**:  
- `properties`: Read (list with filters/pagination), Create, Update, Delete (soft/hard)  
- `property_media`: Read (media for list), Create (on property create/update), Delete (on property delete via cascade)  
- `favorites`: Read (to check favorites on delete)  
**Relationships**:  
- `properties.agent_id` → `users.id`  
- `property_media.property_id` → `properties.id`  
- `favorites.property_id` → `properties.id`

---

## 9. Listing Editor – Basic Info (`/properties/:id/edit/basic`)

**Tables**: `properties`  
**Columns**: `title`, `description`, `price`, `beds`, `baths`, `area`, `area_unit`, `property_type`, `year_built`, `street`, `city`, `state`, `postal_code`, `country`, `latitude`, `longitude`  
**CRUD Operations**:  
- `properties`: Read (GET to pre-fill), Update (PATCH)  
**Relationships**:  
- `properties.agent_id` → `users.id` (to verify ownership)

---

## 10. Bulk Upload Validation Results (`/uploads/validation-result`)

**Tables**: Depends on upload type: `leads` or `properties` (or both)  
**Columns**:  
- For leads: `leads` columns (name, phone, email, property_id, source, etc.)  
- For properties: `properties` columns  
**CRUD Operations**:  
- None directly; this screen shows validation results from a staging process. Actual Create happens after validation.  
**Relationships**:  
- If leads: `leads.property_id` → `properties.id` (validation of foreign key)  
- If properties: none.

---

## 11. Search Results – Standard View (`/search` with AI)

**Tables**: `properties` (main), `property_media` (for thumbnails)  
**Columns**:  
- `properties`: `id`, `title`, `price`, `beds`, `baths`, `area`, `area_unit`, `property_type`, `city`, `state`, `is_published`  
- `property_media`: `url` (for thumbnail) where `is_primary = true`  
**CRUD Operations**:  
- `properties`: Read (GET search results)  
- `property_media`: Read (GET primary image per property)  
**Relationships**:  
- `property_media.property_id` → `properties.id`

---

## 12. Search Results – Filter‑Based Fallback View

Same as standard view but without AI processing.  
**Tables**: `properties`, `property_media`  
**Columns**: Same as above.  
**CRUD Operations**:  
- `properties`: Read (GET filtered results)  
- `property_media`: Read (GET primary image)  
**Relationships**: Same.

---

## 13. Search Results – Empty State

No database interaction beyond the search query returning zero results.  
**Tables**: `properties` (queried)  
**CRUD Operations**:  
- `properties`: Read (GET search that returns empty set)

---

## 14. Property Inquiry Form (Modal/Inline)

**Tables**: `leads` (if exists), `properties` (for context)  
**Columns**:  
- `leads`: `name`, `phone`, `email`, `message`, `property_id`, `source`  
- `properties`: `id`, `title` (to show in form context)  
**CRUD Operations**:  
- `leads`: Create (POST)  
**Relationships**:  
- `leads.property_id` → `properties.id`

---

## 15. Login / Registration Pages (Auth Routes)

**Tables**: `users`  
**Columns**:  
- `id`, `email`, `password_hash`, `name`, `role`, `is_verified`, `refresh_token_hash`, `created_at`, `updated_at`, `deleted_at`  
**CRUD Operations**:  
- `users`: Create (registration), Read (login by email), Update (on verification, password reset, refresh token hash)  
**Relationships**: None (self-contained).

---

## 16. Notification Center (`/notifications` or dropdown)

**Tables**: `notifications`, `users` (recipient), optionally `properties`, `leads`, `bookings` (related_entity)  
**Columns**:  
- `notifications`: `id`, `recipient_id`, `type`, `title`, `message`, `related_entity_id`, `related_entity_type`, `is_read`, `created_at`, `deleted_at`  
- `users`: `id`, `name` (for display)  
- `properties`: `id`, `title` (if related_entity_type = 'property')  
- `leads`: `id`, `name` (if related_entity_type = 'lead')  
- `bookings`: `id`, `start_time` (if related_entity_type = 'booking')  
**CRUD Operations**:  
- `notifications`: Read (list), Update (PATCH mark as read), Delete (DELETE)  
- Bulk: Update (mark all read), Delete (delete all)  
**Relationships**:  
- `notifications.recipient_id` → `users.id`  
- `notifications.related_entity_id` → respective table based on `related_entity_type` (optional)

---

## Summary of Table Usage Across Screens

- `users`: Used in nearly all screens for auth, profile, agent/customer info.
- `properties`: Core table for property-related screens (homepage, detail, inventory, search, etc.).
- `property_media`: Used wherever property images are shown (detail, inventory, search, homepage featured).
- `leads`: Used in lead pipeline, lead detail, inquiry forms, customer dashboard (inquiry history).
- `favorites`: Used in property detail, customer dashboard, property inventory (cleanup).
- `notifications`: Used in notification center, admin dashboard (activity), customer dashboard.
- `bookings`: Not directly shown in any screen in the provided specs? Possibly in agent calendar or customer dashboard but not detailed. We note potential use.
- `payments`: Not shown in any UI screen in specs (likely in payment flow not detailed).  
- `search_logs`: Used for analytics, not directly in UI.
- `refresh_tokens`: Used internally for auth, not in UI.

All CRUD operations are derived from API endpoints referenced in screen specs.