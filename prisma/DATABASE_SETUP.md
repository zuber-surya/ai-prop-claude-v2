# Database Setup Guide

## Prisma Schema
The Prisma schema is located at `prisma/schema.prisma` and contains:
- All data models (User, Property, PropertyMedia, Booking, Payment, Notification, Favorite)
- Enums for Role, BookingStatus, PaymentStatus, PropertyType, AreaUnit, NotificationType
- Relations between models
- Indexes for performance optimization
- Notes about constraints that need to be implemented via raw SQL (like partial unique indexes)

## Configuration
Database connection is configured via:
- `prisma/config.ts` - exports the Prisma configuration with DATABASE_URL
- Environment variable `DATABASE_URL` - should be set to your PostgreSQL connection string

Example:
```
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

## Migrations
Migration files are located in `prisma/migrations/`:
- `20240123000000_init/` - Initial schema migration
  - `migration.sql` - SQL statements to create all tables, indexes, and foreign keys
  - `README.md` - Documentation of what the migration does

## Seeding
Initial data can be seeded using:
- `prisma/seed.ts` - TypeScript script to create sample users, properties, bookings, etc.
- Uses bcrypt for password hashing

## Setup Instructions

When you have a PostgreSQL database available:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set your DATABASE_URL environment variable:
   ```bash
   # Linux/Mac
   export DATABASE_URL="postgresql://username:password@localhost:5432/propertyvista"
   
   # Windows (PowerShell)
   $env:DATABASE_URL="postgresql://username:password@localhost:5432/propertyvista"
   ```

3. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

4. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

5. Seed the database:
   ```bash
   ts-node prisma/seed.ts
   ```
   or
   ```bash
   npx ts-node prisma/seed.ts
   ```

## Notes
- The migration files were generated assuming a PostgreSQL database
- Some constraints (like partial unique indexes for primary property images) 
  need to be added via raw SQL after migration if not supported by the migration generator
- Always backup your database before running migrations in production