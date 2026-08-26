# Roles & Permissions

## ATTENDEE (default)
- Browse and buy tickets
- View own tickets and profile

## ORGANIZER
- All ATTENDEE permissions
- Create, edit, and view own events
- Check in tickets at their own events
- Configure M-Pesa payout number

## ADMIN
- All ORGANIZER permissions
- View platform-wide stats, users, events, payments
- Cancel any event
- Check in tickets at any event

## Promoting a user to ADMIN
No public endpoint exists for this by design. Done manually via
`npx prisma studio`, editing the User.role field directly on the target row.
