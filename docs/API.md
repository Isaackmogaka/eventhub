# API Reference

## Auth
POST /auth/register
POST /auth/login
POST /auth/google
POST /auth/logout
POST /auth/forgot-password
POST /auth/reset-password

## Events
GET /events
GET /events/:id
POST /events (organizer)
PATCH /events/:id (owner/admin)

## Holds & Payments
POST /events/:id/hold
POST /events/holds/:holdId/cancel
POST /payments/:holdId/pay
GET /payments/:holdId/status

## Tickets
GET /tickets/mine
GET /tickets/summary
POST /tickets/check-in (organizer/admin)

## Admin
GET /admin/stats
GET /admin/users
GET /admin/events
GET /admin/payments
PATCH /admin/events/:id/status
