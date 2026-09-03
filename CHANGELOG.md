# Changelog

## Unreleased
- Migrated authentication from localStorage to HttpOnly cookies
- Reduced hold-expiry sweep interval to conserve database compute hours
- Fixed payment retry flow to allow reattempts after a failed transaction

## Prior milestones
- Real-time ticket availability via Socket.io
- M-Pesa payments via IntaSend, with webhook-confirmed ticket issuance
- Organizer payouts (95/5 split) via IntaSend Send Money
- Admin dashboard with live stats
- Google OAuth sign-in

## In progress
- Migrating backend hosting from Railway to Render (free tier expired)
- Migrating database from Neon to Supabase (better free-tier fit)
