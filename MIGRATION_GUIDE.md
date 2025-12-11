# Migration Guide

This document provides instructions for migrating your database when upgrading to new versions of the application.

## Account Model Schema Update (NextAuth v5 Compatibility)

**Issue**: If you're experiencing the error `Invalid 'p.account.findUnique()' invocation` or `AdapterError` when using OAuth authentication, you need to migrate your Account model schema.

**Reason**: NextAuth v5 with `@auth/prisma-adapter` requires the Account model to use a composite primary key instead of a separate `id` field.

### Migration Steps

**⚠️ IMPORTANT**: This migration will drop and recreate the Account table. Any existing OAuth accounts will be lost. Users with OAuth accounts will need to re-authenticate after this migration.

#### Option 1: Using Prisma Migrate (Recommended for Production)

1. **Backup your database** before proceeding.

2. **Create a migration**:
   ```bash
   npx prisma migrate dev --name fix-account-model
   ```

3. **Apply the migration**:
   ```bash
   npx prisma migrate deploy
   ```

#### Option 2: Using Prisma DB Push (Development Only)

1. **Backup your database** if you have important OAuth account data.

2. **Push the schema changes**:
   ```bash
   npx prisma db push
   ```

3. **Confirm** when prompted about data loss in the Account table.

#### Option 3: Manual SQL Migration

If you need to preserve existing OAuth account data, you'll need to manually migrate:

1. **Backup your database**.

2. **Connect to your database** and run:
   ```sql
   -- Create temporary table with new structure
   CREATE TABLE "Account_new" (
     "userId" TEXT NOT NULL,
     "type" TEXT NOT NULL,
     "provider" TEXT NOT NULL,
     "providerAccountId" TEXT NOT NULL,
     "refresh_token" TEXT,
     "access_token" TEXT,
     "expires_at" INTEGER,
     "token_type" TEXT,
     "scope" TEXT,
     "id_token" TEXT,
     "session_state" TEXT,
     PRIMARY KEY ("provider", "providerAccountId")
   );

   -- Copy data from old table (excluding the old id field)
   INSERT INTO "Account_new" (
     "userId",
     "type",
     "provider",
     "providerAccountId",
     "refresh_token",
     "access_token",
     "expires_at",
     "token_type",
     "scope",
     "id_token",
     "session_state"
   )
   SELECT
     "userId",
     "type",
     "provider",
     "providerAccountId",
     "refresh_token",
     "access_token",
     "expires_at",
     "token_type",
     "scope",
     "id_token",
     "session_state"
   FROM "Account";

   -- Drop old table
   DROP TABLE "Account";

   -- Rename new table
   ALTER TABLE "Account_new" RENAME TO "Account";

   -- Create foreign key constraint
   ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" 
     FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

   -- Create index
   CREATE INDEX "Account_userId_idx" ON "Account"("userId");
   ```

3. **Regenerate Prisma Client**:
   ```bash
   npx prisma generate
   ```

### Verification

After migration, verify that:

1. The application starts without errors
2. OAuth authentication works correctly
3. Users can sign in with their OAuth providers

### Rollback

If you need to rollback:

1. Restore your database backup
2. Revert the schema changes in `prisma/schema.prisma`:
   ```prisma
   model Account {
     id                String  @id
     userId            String
     type              String
     provider          String
     providerAccountId String
     // ... other fields ...
     
     @@unique([provider, providerAccountId])
     @@index([userId])
   }
   ```
3. Run `npx prisma generate` to regenerate the client

### Questions or Issues?

If you encounter any issues during migration, please:
1. Check that you're using NextAuth v5 (beta.22 or later)
2. Verify `@auth/prisma-adapter` is version 2.6.0 or later (composite primary key support added in v2.4.0)
3. Review the error logs for specific issues
4. Open an issue on the repository with details

---

## Future Migrations

Additional migration guides will be added here as the application evolves.
