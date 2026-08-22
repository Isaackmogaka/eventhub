# Payment Flow

1. Attendee reserves a ticket (creates a TicketHold, 10-minute expiry)
2. Attendee enters M-Pesa number, triggers STK push via IntaSend
3. IntaSend sends webhook on state change (PENDING -> PROCESSING -> COMPLETE/FAILED)
4. On COMPLETE: hold converts to Ticket, ticketsSold increments, organizer payout triggers automatically
5. Organizer receives 95% via IntaSend Send Money; platform retains 5% (min KES 5)
