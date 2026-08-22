# Real-Time Events Reference

## Rooms
- event:{eventId} — joined when viewing an event, receives availability-update
- user:{userId} — joined on login, receives payment-update
- admin-room — joined by admins, receives admin-stats-update

## Events emitted by server
- availability-update: { eventId, available }
- payment-update: { holdId, status, ticket? }
- admin-stats-update: { userCount, eventCount, ticketCount, totalRevenueCents }
