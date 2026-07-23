# Database Design
## Property Website MVP

### Entity Overview
The database consists of three core entities that support the MVP functionality:

1. **User**
   - Represents registered accounts (both regular users and administrators).
   - Attributes:
     - `id`: Unique identifier (CUID)
     - `email`: Unique login credential
     - `passwordHash`: Bcrypt/Argon2 hashed password
     - `isAdmin`: Boolean flag granting access to admin interfaces
     - `createdAt` / `updatedAt`: Timestamp tracking

2. **Property**
   - Represents real‑estate listings available for browsing.
   - Attributes:
     - `id`: Unique identifier (CUID)
     - `title`: Short listing title
     - `description`: Detailed description
     - `price`: Integer value in INR paise (avoids floating‑point issues)
     - `type`: Free‑text category (e.g., apartment, house, villa)
     - `bedrooms`: Integer count
     - `bathrooms`: Integer count
     - `area`: Integer square footage
     - `location`: Free‑text label (e.g., "Adajan, Surat")
     - `latitude` / `longitude`: Nullable floats for map positioning (nullable to allow gradual geocoding)
     - `amenities`: Array of strings (simple list, no controlled vocabulary)
     - `photos`: Array of strings (URLs to stored images)
     - `status`: Enumerated (`draft` | `published`) – controls public visibility
     - `createdAt` / `updatedAt`: Timestamp tracking

3. **ChatMessage**
   - Represents a single message in a chat session between a visitor and the AI assistant.
   - Attributes:
     - `id`: Unique identifier (CUID)
     - `sessionId`: String grouping messages belonging to the same browser session
     - `userId`: Optional foreign key to User (set when the sender is a logged‑in user; null for anonymous visitors)
     - `role`: Enumerated (`user` | `assistant`) indicating who authored the message
     - `content`: Text of the message
     - `createdAt`: Timestamp of message creation

### Relationships
| Entity (Parent) | Relationship | Entity (Child) | Details |
|-----------------|--------------|----------------|---------|
| User            | One‑to‑Many  | ChatMessage    | `ChatMessage.userId` is a foreign key referencing `User.id`. Optional; allows anonymous chats (`userId = null`). |
| Property        | None         | — | No foreign keys to or from Property in the MVP (ownership/agent tracking is out of scope). |
| Session (implied) | One‑to‑Many | ChatMessage    | All chat messages sharing the same `sessionId` belong to a single conversation session. Session is not a formal table; it is a logical grouping keyed by `sessionId`. |

### Naming Standards
- **Tables**: Explicitly mapped via `@@map` in the Prisma schema:
  - `User` → `users`
  - `Property` → `properties`
  - `ChatMessage` → `chat_messages`
- **Columns**: Use snake_case in the underlying database (Prisma default). Examples: `id`, `email`, `password_hash`, `is_admin`, `created_at`, `updated_at`, `session_id`, `user_id`, `role`, `content`, `price`, `latitude`, `longitude`, `title`, `description`.
- **Indexes**: Named**: Prisma generates index names based on the table and column(s); no custom naming convention is required for MVP.
- **Enums**: PascalCase in Prisma (`PropertyStatus`, `ChatRole`) map to check constraints or ENUM types in PostgreSQL as appropriate.

### Constraints
| Entity | Constraint Type | Details |
|--------|----------------|---------|
| User | Primary Key | `id` (CUID) |
| User | Unique | `email` (ensures no duplicate accounts) |
| User | Not Null | `email`, `passwordHash` |
| Property | Primary Key | `id` (CUID) |
| Property | Not Null | `title`, `description`, `price`, `type`, `bedrooms`, `bathrooms`, `area`, `location`, `status` |
| Property | Check | `price >= 0` (implicit via application validation; DB allows negative but app enforces) |
| Property | Check | `bedrooms >= 0`, `bathrooms >= 0`, `area >= 0` |
| Property | Enum | `status` ∈ {`'draft'`, `'published'`} |
| Property | Nullable | `latitude`, `longitude` (allow pre‑geocoding records) |
| ChatMessage | Primary Key | `id` (CUID) |
| ChatMessage | Not Null | `sessionId`, `role`, `content` |
| ChatMessage | Foreign Key | `userId` → `User.id` (ON DELETE SET NULL – if a user is deleted, their chat messages remain anonymized) |
| ChatMessage | Enum | `role` ∈ {`'user'`, `'assistant'`} |
| ChatMessage | Index | Non‑unique index on `sessionId` for fast session‑scoped queries |
| General | Timestamps | `createdAt` defaults to `now()`; `updatedAt` auto‑updated on row changes |

### Index Strategy
Indexes are defined to support the query patterns outlined in `API_CONTRACT.md` and to enforce uniqueness:

| Table | Indexed Columns | Type | Purpose |
|-------|----------------|------|---------|
| `users` | `email` | Unique | Enforce unique login identifier; accelerate lookups by email during authentication. |
| `properties` | `status` | Non‑unique | Filter published listings (`WHERE status = 'published'`). |
| `properties` | `price` | Non‑unique | Support price range filters (`BETWEEN minPrice AND maxPrice`). |
| `properties` | `type` | Non‑unique | Support property‑type filters. |
| `chat_messages` | `sessionId` | Non‑unique | Retrieve all messages for a given chat session efficiently. |
| `chat_messages` | `userId` (implicit via FK) | Non‑unique | Optional; assists queries that filter messages by user (if needed). |

Note: Primary keys (`id`) are automatically indexed as unique. No additional composite indexes are required for the MVP’s query volume.

### Migration Strategy
The project uses **Prisma Migrate** as the source of truth for schema changes. The workflow is as follows:

1. **Schema Definition**  
   - The Prisma schema is defined in `schema.prisma` (source of truth).  
   - The human‑readable equivalent is maintained in `docs/SCHEMA.md`; both must stay in sync (any change to one must be mirrored in the other via the same PR).

2. **Creating a Migration**  
   - Run `npx prisma migrate dev --name <descriptive_name>` to generate a new migration SQL file under `prisma/migrations/`.  
   - The migration file contains the SQL statements required to alter the database schema (create tables, add columns, add indexes, etc.).  
   - The `--create-db` flag can be used for initial setup; otherwise, migrations are applied against an existing development database.

3. **Applying Migrations**  
   - In development: `prisma migrate dev` applies pending migrations and regenerates the Prisma Client.  
   - In CI / staging / production: `prisma migrate deploy` applies only the migrated SQL (skip schema regeneration) to reach the target schema.  
   - The CI pipeline (see `GITHUB_WORKFLOW.md`) runs `prisma migrate deploy` as part of the build step before executing tests, ensuring the test database reflects the latest schema.

4. **Data Seeding (Optional)**  
   - A seed script (referenced in `ROADMAP.md` Phase 1 and `SCHEMA.md` §5) can be executed after migrations to insert placeholder/fixture property records (varied `type`, `price`, `bedrooms`, mix of `draft`/`published`, some with lat/lng populated).  
   - The seed script is **not** part of the migration files; it is run manually or via a separate `npm run seed` step after migration.

5. **Rollback Strategy**  
   - Prisma Migrate does not support automatic down‑migrations in the CLI. To revert, developers either:  
     a. Create a new migration that reverts the undesired change (preferred for production safety), or  
     b. Temporarily delete the migration folder and reset the local database (only in development environments).  
   - Production rollbacks should be handled via a forward‑fixing migration to preserve auditability.

6. **Backup & Recovery**  
   - While not mandated for MVP (NFR §8), production deployments should employ managed PostgreSQL offerings with automated backups and point‑in‑time recovery.  
   - Development workflows rely on the ability to `docker-compose down -v` and spin up a fresh database from migrations + seed data.

7. **Version Control**  
   - Migration files are committed to the repository, providing a deterministic history of schema evolution.  
   - The `prisma` folder (containing `schema.prisma` and the `migrations/` directory) is treated as any other source code: reviewed, tested, and merged via the standard GitHub workflow.

This design satisfies all functional requirements (property CRUD, authentication, chat sessions) and non‑functional constraints (performance via targeted indexes, security via constrained columns and password hashing, maintainability through a single source of truth and version‑controlled migrations).