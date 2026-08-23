# Database Schema Overview

## Core models
- User — auth, role (ATTENDEE/ORGANIZER/ADMIN), optional passwordHash (Google users have none)
- Organizer — linked to User, holds payoutPhoneNumber
- Event — owned by Organizer, tracks totalTickets/ticketsSold
- TicketHold — temporary reservation, status ACTIVE/CONVERTED/EXPIRED/CANCELLED
- Payment — one per hold, tracks IntaSend invoiceId and status
- Ticket — created only on confirmed payment, holds qrCode and checkedInAt
- Payout — one per payment, tracks organizer disbursement status

## Key constraints
- Payment.holdId and Ticket.paymentId are unique — enforces one payment/ticket per hold
- Payout.intasendRef is unique — prevents duplicate payout processing
