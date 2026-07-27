# Database Design

This document outlines the database schema for the Property Vista CRM MVP. It covers tables, columns, relationships, constraints, indexes, naming conventions, soft delete strategy, and audit columns.

---

## Naming Conventions

- **Tables**: snake_case, plural noun (e.g., `users`, `properties`).
- **Columns**: snake_case.
- **Primary Keys**: `id` (UUID or BIGSERIAL; we use UUID for public APIs).
- **Foreign Keys**: `{table}_id` (e.g., `user_id`, `property_id`).
- **Indexes**: `idx_{table}_{column}` or `idx_{table}_{col1}_{col2}` for composite.
- **Constraints**: 
  - Primary key: `pk_{table}`
  - Foreign key: `fk_{table}_{referenced_table}`
  - Unique: `uq_{table}_{column}`
  - Check: `chk_{table}_{condition}`
- **Timestamps**: `created_at` (TIMESTAMP WITH TIME ZONE), `updated_at` (TIMESTAMP WITH TIME ZONE).
- **Soft Delete**: `deleted_at` (TIMESTAMP WITH TIME ZONE, NULLable).

All timestamps stored with time zone (UTC).

---

## Core Tables

### 1. `users`

Stores authentication and profile information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT `uuid_generate_v4()` | Unique identifier |
| email | VARCHAR(255) | NOT NULL, UNIQUE | User's email address |
| password_hash | TEXT | NOT NULL | Bcrypt hash of password |
| name | VARCHAR(100) | NOT NULL | Full name |
| role | VARCHAR(20) | NOT NULL, CHECK (`role` IN ('visitor','customer','agent','admin')) | Role-based access control |
| is_verified | BOOLEAN | NOT NULL, DEFAULT false | Email verification flag |
| refresh_token_hash | TEXT | NULLABLE | Hashed refresh token (for rotation) |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` | Record creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` | Last update timestamp |
| deleted_at | TIMESTAMPTZ | NULLABLE | Soft delete timestamp |

**Indexes**:
- Primary key on `id`
- Unique index on `email` (implicit from UNIQUE)
- Index on `role` for role‑based queries
- Index on `deleted_at` for filtering active users

**Relationships**:
- One‑to‑many: `users` → `properties` (as owner/agent)
- One‑to‑many: `users` → `bookings` (as customer or agent)
- One‑to‑many: `users` → `payments` (as payer)
- One‑to‑many: `users` → `notifications` (as recipient)
- One‑to‑many: `users` → `favorites` (as user)

### 2. `properties`

Stores real‑estate listings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT `uuid_generate_v4()` | Unique identifier |
| title | VARCHAR(200) | NOT NULL | Property title/name |
| description | TEXT | NOT NULL | Detailed description |
| price | DECIMAL(12,2) | NOT NULL, CHECK (`price` > 0) | Price in base currency (e.g., USD) |
| beds | INTEGER | NOT NULL, CHECK (`beds` >= 0) | Number of bedrooms |
| baths | DECIMAL(3,1) | NOT NULL, CHECK (`baths` >= 0) | Number of bathrooms (allows 0.5 increments) |
| area | DECIMAL(10,2) | NOT NULL, CHECK (`area` > 0) | Size of property |
| area_unit | VARCHAR(10) | NOT NULL, CHECK (`area_unit` IN ('sqft','sqm')) | Unit of area |
| property_type | VARCHAR(50) | NOT NULL | e.g., 'single_family', 'condo', 'townhouse' |
| year_built | INTEGER | NULLABLE, CHECK (`year_built` BETWEEN 1800 AND EXTRACT(YEAR FROM CURRENT_DATE)) | Construction year |
| street | VARCHAR(255) | NOT NULL | Street address |
| city | VARCHAR(100) | NOT NULL | City |
| state | VARCHAR(100) | NULLABLE | State/Province |
| postal_code | VARCHAR(20) | NOT NULL | Postal/ZIP code |
| country | VARCHAR(100) | NOT NULL, DEFAULT 'USA' | Country |
| latitude | DECIMAL(9,6) | NULLABLE | Latitude for mapping |
| longitude | DECIMAL(9,6) | NULLABLE | Longitude for mapping |
| is_published | BOOLEAN | NOT NULL, DEFAULT false | Publication status |
| is_premium | BOOLEAN | NOT NULL, DEFAULT false | Featured/listing boost |
| premium_until | TIMESTAMPTZ | NULLABLE | Expiry of premium boost |
| agent_id | UUID | NOT NULL, FK `users(id)` | Owner/agent responsible |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` |  |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` |  |
| deleted_at | TIMESTAMPTZ | NULLABLE | Soft delete |

**Indexes**:
- Primary key on `id`
- Index on `agent_id` for agent‑based queries
- Index on `is_published` for public listings
- Composite index on `(city, state)` for location filtering
- Index on `price` for range queries
- Index on `created_at` for sorting newest first
- (Optional) GIST index on `(latitude, longitude)` for proximity searches

**Relationships**:
- Many‑to‑one: `properties.agent_id` → `users.id`
- One‑to‑many: `properties` → `property_media`
- One‑to‑many: `properties` → `favorites`
- One‑to‑many: `properties` → `bookings` (via property_id)
- One‑to‑many: `properties` → `reviews` (if implemented)

**Constraints**:
- Ensure `price` > 0.
- Ensure `area` > 0.
- Ensure `beds` >= 0.
- Ensure `baths` >= 0.
- Ensure `year_built` within reasonable range if set.

### 3. `property_media`

Stores images and other media for properties.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT `uuid_generate_v4()` | Unique identifier |
| property_id | UUID | NOT NULL, FK `properties(id)` ON DELETE CASCADE | Associated property |
| url | TEXT | NOT NULL | Storage URL (e.g., S3 key or CDN path) |
| caption | VARCHAR(255) | NULLABLE | Optional description |
| is_primary | BOOLEAN | NOT NULL, DEFAULT false | Flag for main thumbnail |
| sort_order | INTEGER | NOT NULL, DEFAULT 0 | Ordering within property |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` |  |
| deleted_at | TIMESTAMPTZ | NULLABLE | Soft delete |

**Indexes**:
- Primary key on `id`
- Index on `property_id`
- Index on `is_primary` (to fetch main image quickly)
- Unique constraint on `(property_id, is_primary)` where `is_primary = true` (partial unique index)

**Relationships**:
- Many‑to‑one: `property_media.property_id` → `properties.id`

### 4. `bookings`

Tracks property viewing appointments.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT `uuid_generate_v4()` | Unique identifier |
| property_id | UUID | NOT NULL, FK `properties(id)` | Property being viewed |
| agent_id | UUID | NOT NULL, FK `users(id)` | Agent conducting the showing |
| customer_id | UUID | NOT NULL, FK `users(id)` | Customer (or visitor) booking |
| start_time | TIMESTAMPTZ | NOT NULL | Start of appointment |
| end_time | TIMESTAMPTZ | NOT NULL | End of appointment (derived or set) |
| status | VARCHAR(20) | NOT NULL, CHECK (`status` IN ('requested','confirmed','completed','cancelled','no_show')) | Booking lifecycle |
| notes | TEXT | NULLABLE | Additional instructions |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` |  |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` |  |
| deleted_at | TIMESTAMPTZ | NULLABLE | Soft delete |

**Indexes**:
- Primary key on `id`
- Index on `property_id`
- Index on `agent_id`
- Index on `customer_id`
- Index on `status` for filtering
- Composite index on `(agent_id, start_time, end_time)` for overlap detection
- Index on `start_time` for range queries

**Relationships**:
- Many‑to‑one: `bookings.property_id` → `properties.id`
- Many‑to‑one: `bookings.agent_id` → `users.id`
- Many‑to‑one: `bookings.customer_id` → `users.id`

**Constraints**:
- Ensure `end_time` > `start_time`.
- Application‑level check for no overlapping bookings for same agent (can enforce via exclusion range types if using PostgreSQL).

### 5. `payments`

Records payment transactions (via Stripe/PayPal).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT `uuid_generate_v4()` | Unique identifier |
| payment_intent_id | VARCHAR(255) | NOT NULL, UNIQUE | External provider's ID (e.g., Stripe PI) |
| amount | INTEGER | NOT NULL, CHECK (`amount` >= 0) | Amount in smallest currency unit (cents) |
| currency | VARCHAR(3) | NOT NULL, DEFAULT 'usd' | ISO 4217 currency code |
| status | VARCHAR(20) | NOT NULL, CHECK (`status` IN ('pending','succeeded','failed','refunded','partially_refunded')) | Payment state |
| payment_method_type | VARCHAR(20) | NULLABLE | e.g., 'card' |
| metadata_json | JSONB | NULLABLE | Arbitrary key‑value pairs (e.g., {type:'property_premium', id:'uuid'}) |
| receipt_url | TEXT | NULLABLE | URL to receipt from provider |
| failure_code | VARCHAR(50) | NULLABLE | Provider failure code if applicable |
| failure_message | TEXT | NULLABLE | Provider failure message |
| user_id | UUID | NULLABLE, FK `users(id)` | User who initiated payment (nullable for guest checkout) |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` |  |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` |  |
| deleted_at | TIMESTAMPTZ | NULLABLE | Soft delete |

**Indexes**:
- Primary key on `id`
- Unique index on `payment_intent_id`
- Index on `status`
- Index on `user_id` (if not null)
- Index on `created_at` for time‑based queries

**Relationships**:
- Many‑to‑one (optional): `payments.user_id` → `users.id`
- Link to business objects via `metadata_json` (application‑level join).

### 6. `notifications`

User‑directed system notices.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT `uuid_generate_v4()` | Unique identifier |
| recipient_id | UUID | NOT NULL, FK `users(id)` ON DELETE CASCADE | User receiving the notice |
| type | VARCHAR(50) | NOT NULL | e.g., 'lead_assigned', 'property_inquiry' |
| title | VARCHAR(200) | NOT NULL | Short summary |
| message | TEXT | NOT NULL | Full notification text |
| related_entity_id | UUID | NULLABLE | Optional FK to related object (property, booking, etc.) |
| related_entity_type | VARCHAR(50) | NULLABLE | Entity name (e.g., 'property', 'booking') |
| is_read | BOOLEAN | NOT NULL, DEFAULT false | Read flag |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` |  |
| deleted_at | TIMESTAMPTZ | NULLABLE | Soft delete (archived after 90 days via job) |

**Indexes**:
- Primary key on `id`
- Index on `recipient_id`
- Index on `is_read` (for unread count)
- Index on `created_at` for recent queries
- Composite index on `(recipient_id, is_read)` for fast unread lookup
- Index on `type` for filtering by notification type

**Relationships**:
- Many‑to‑one: `notifications.recipient_id` → `users.id`

### 7. `favorites`

User‑saved properties.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT `uuid_generate_v4()` | Unique identifier |
| user_id | UUID | NOT NULL, FK `users(id)` ON DELETE CASCADE | User who favorited |
| property_id | UUID | NOT NULL, FK `properties(id)` ON DELETE CASCADE | Favorited property |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` |  |
| deleted_at | TIMESTAMPTZ | NULLABLE | Soft delete (if needed) |

**Indexes**:
- Primary key on `id`
- Unique constraint on `(user_id, property_id)` to prevent duplicates
- Index on `user_id` for user’s favorites list
- Index on `property_id` for reverse lookup (optional)

**Relationships**:
- Many‑to‑one: `favorites.user_id` → `users.id`
- Many‑to‑one: `favorites.property_id` → `properties.id`

### 8. `search_logs` (optional)

Stores anonymized search queries for analytics.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT `uuid_generate_v4()` |  |
| query_text | TEXT | NOT NULL | The raw search string (PII stripped) |
| parsed_filters | JSONB | NULLABLE | Structured filters derived from LLM or fallback |
| results_count | INTEGER | NOT NULL, DEFAULT 0 | Number of results returned |
| source | VARCHAR(20) | NOT NULL, CHECK (`source` IN ('ai','fallback')) | Origin of search |
| ip_address | INET | NULLABLE | Anonymized/IP masked if stored |
| user_agent | TEXT | NULLABLE |  |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` |  |

**Indexes**:
- Primary key on `id`
- Index on `created_at` for time‑series analysis
- Index on `source` for comparing AI vs fallback usage

### 9. `refresh_tokens` (alternative to storing hash in users)

If we prefer a separate table for token rotation.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT `uuid_generate_v4()` |  |
| user_id | UUID | NOT NULL, FK `users(id)` ON DELETE CASCADE | Owner |
| token_hash | TEXT | NOT NULL | Hashed refresh token |
| expires_at | TIMESTAMPTZ | NOT NULL | Expiration timestamp |
| revoked_at | TIMESTAMPTZ | NULLABLE | When revoked (used or logout) |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` |  |

**Indexes**:
- Primary key on `id`
- Unique index on `token_hash` (to prevent reuse)
- Index on `user_id` for lookup
- Index on `expires_at` for cleanup jobs

*(If using this, remove `refresh_token_hash` from `users`.)*

---

## Relationships Summary

- **Users** ↔ **Properties** (one‑to‑many, agent)
- **Users** ↔ **Bookings** (one‑to‑many as customer, one‑to‑many as agent)
- **Users** ↔ **Payments** (one‑to‑many, optional)
- **Users** ↔ **Notifications** (one‑to‑many)
- **Users** ↔ **Favorites** (one‑to‑many)
- **Properties** ↔ **Property Media** (one‑to‑many)
- **Properties** ↔ **Bookings** (one‑to‑many)
- **Properties** ↔ **Favorites** (one‑to‑many)
- **Bookings** ↔ **Properties** (many‑to‑one)
- **Bookings** ↔ **Users** (many‑to‑one as agent, many‑to‑one as customer)

---

## Constraints & Data Integrity

1. **Primary Keys**: UUIDv4 ensures uniqueness globally.
2. **Foreign Keys**: Enforce referential integrity with `ON DELETE CASCADE` where appropriate (e.g., deleting a user deletes their owned properties, bookings, notifications, favorites; deleting a property deletes its media, favorites, and associated bookings? Typically bookings may stay for history; adjust as needed).
3. **Unique Constraints**:
   - `users.email`
   - `payments.payment_intent_id`
   - `favorites(user_id, property_id)`
   - Partial unique index for primary property image: `CREATE UNIQUE INDEX ON property_media(property_id) WHERE is_primary = true;`
4. **Check Constraints**:
   - Role enumeration.
   - Status enumerations (bookings, payments).
   - Price > 0, area > 0, beds ≥ 0, baths ≥ 0.
   - Year built range.
   - Latitude/longitude ranges if stored.
5. **Not Null**: Essential fields enforced.

---

## Indexes (Performance)

- Primary key indexes automatically created.
- Foreign key columns indexed for join performance.
- Frequently filtered/status columns indexed (`is_published`, `status`, `role`, `is_read`).
- Timestamp columns indexed for range queries and sorting.
- Composite indexes for common query patterns:
  - `bookings(agent_id, start_time, end_time)` – overlap detection.
  - `properties(city, state)` – location filtering.
  - `property_media(property_id, is_primary)` – main image fetch.
  - `notifications(recipient_id, is_read)` – unread count.
- Full‑text or trigram indexes on searchable text fields if needed (e.g., `properties.title`, `properties.description`) – not required if external search engine used.
- Spatial index (GIST) on `(latitude, longitude)` for proximity search.

---

## Soft Deletes

- All core tables include a `deleted_at TIMESTAMPTZ NULLABLE` column.
- Queries should automatically filter `WHERE deleted_at IS NULL` via:
  - Database views (e.g., `CREATE VIEW users_active AS SELECT * FROM users WHERE deleted_at IS NULL;`)
  - ORM soft‑delete plugins (if using an ORM like Sequelize/TypeORM) or repository layer.
- Administrative queries can include/depart from the filter to see archived records.
- Cascade deletes respect `deleted_at`? Usually physical delete still cascades; but soft delete means we mark rows deleted and rely on application filters. For tables with `ON DELETE CASCADE` set to `SET NULL` or we handle via triggers. Simpler: avoid `ON DELETE CASCADE` for soft‑deleted parents; instead, application cleans up child rows or sets their `deleted_at` when parent is soft‑deleted via a background job or trigger.

---

## Audit Columns

Every table includes:
- `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
- `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()` (trigger to update on change)
- `deleted_at TIMESTAMPTZ NULLABLE` (soft delete)

Some tables may also include:
- `created_by UUID` (optional, FK to users) – who created the record.
- `updated_by UUID` (optional) – who last modified.

For simplicity, we stick to timestamps only; user attribution can be derived from context (e.g., `agent_id` on properties, `user_id` on favorites, etc.).

---

## Example ERD (Textual)

```
users
  │
  ├─1───∞ properties (agent_id)
  │
  ├─1───∞ bookings (customer_id)
  │
  ├─1───∞ bookings (agent_id)
  │
  ├─1───∞ payments (user_id) [optional]
  │
  ├─1───∞ notifications (recipient_id)
  │
  └─1───∞ favorites (user_id)

properties
  │
  ├─1───∞ property_media (property_id)
  │
  ├─1───∞ favorites (property_id)
  │
  └─1───∞ bookings (property_id)

bookings
  │
  ├─1─── properties
  ├─1─── users (agent)
  └─1─── users (customer)
```

---

## Migration Considerations

- Use UUID extension (`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`) for `uuid_generate_v4()`.
- All timestamps with time zone.
- Run periodic cleanup jobs:
  - Delete anonymized `search_logs` older than 180 days.
  - Archive `notifications` older than 90 days (set `deleted_at`).
  - Revoke expired `refresh_tokens`.

---
*End of Database Design Document*