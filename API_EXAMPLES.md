# API Testing Examples

This document provides example curl commands to test the API endpoints.

## Authentication

### Sign Up

Create a new user account:

```bash
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

Expected response:
```json
{
  "message": "User created successfully",
  "user": {
    "id": "clxxx...",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Sign In

After signing up, you can sign in through the web interface at `/signin`.

The sign-in is handled by NextAuth and uses session cookies, so it's best tested through the web UI.

## Using the Application

1. **Sign Up** - Create an account at `/signup`
2. **Sign In** - Login at `/signin`
3. **Create Checklist** - Go to `/checklist` and click "+ New Checklist"
4. **Add Items** - Click on a checklist and add items
5. **Toggle Items** - Check/uncheck items to mark them as done
6. **Edit Items** - Click "Edit" to modify item details
7. **Delete Items** - Click "Delete" to remove items
8. **View Profile** - Check your profile at `/profile`
9. **Sign Out** - Sign out from the profile page

## Testing with Seed Data

If you ran the seed script, you can test with:

- **Email**: `test@example.com`
- **Password**: `password123`

This account will have a pre-populated "Angular Fundamentals" checklist with sample items.

## Notes

- All checklist operations require authentication (session cookies)
- Each user can only access their own checklists
- Server actions are used for data mutations (not REST endpoints)
- The app uses Next.js 15 App Router with Server Actions and Server Components
