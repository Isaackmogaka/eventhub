# Database schema

Run `npx prisma studio` locally to browse data visually.
Run `npx prisma migrate dev` after any schema.prisma change to create a new migration.
Never edit files inside migrations/ manually.

## Migration count
As of this note, the schema has undergone multiple migrations covering:
users/events, ticket holds, payments, tickets, admin roles, event coordinates,
password reset, payout tracking, and Google OAuth support.
