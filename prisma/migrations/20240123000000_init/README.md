# Initial Migration

This migration creates the initial database schema for the Property Vista CRM MVP.

## Tables Created
- User
- Property
- PropertyMedia
- Booking
- Payment
- Notification
- Favorite

## Indexes Created
- Indexes on foreign keys for join performance
- Indexes on frequently queried columns (email, role, status, etc.)
- Composite indexes for common query patterns
- Unique constraints where applicable

## Notes
- All tables include `createdAt`, `updatedAt`, and `deletedAt` columns for audit trails
- Enum types are used for fields with fixed value sets
- Relationships are defined with appropriate foreign key constraints
- Sample data can be seeded using `prisma/seed.ts`