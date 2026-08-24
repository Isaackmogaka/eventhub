# Ticket & Hold State Reference

## TicketHold status
ACTIVE -> CONVERTED (payment succeeded)
ACTIVE -> EXPIRED (10 min passed, sweep caught it)
ACTIVE -> CANCELLED (user cancelled manually)

## Payment status
PENDING -> COMPLETED (webhook confirmed)
PENDING -> FAILED (webhook reported failure, or user cancelled)

## Ticket status
CONFIRMED -> CHECKED_IN (scanned at event)
CONFIRMED -> CANCELLED (rare, admin action)
