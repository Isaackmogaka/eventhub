# Backend Structure

- src/routes/ — one file per resource (auth, events, holds, payments, webhooks, admin, etc.)
- src/middleware/ — requireAuth, requireAdmin
- src/lib/ — shared singletons (prisma, socket, intasend, authCookie)
- prisma/schema.prisma — single source of truth for the database

## Middleware order
helmet -> cors -> cookieParser -> express.json -> routes -> global error handler
