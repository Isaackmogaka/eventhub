# Payment Flow

1. Attendee reserves a ticket (creates a TicketHold, 10-minute expiry)
2. Attendee enters M-Pesa number, triggers STK push via IntaSend
3. IntaSend sends webhook on state change (PENDING -> PROCESSING -> COMPLETE/FAILED)
4. On COMPLETE: hold converts to Ticket, ticketsSold increments, organizer payout triggers automatically
5. Organizer receives 95% via IntaSend Send Money; platform retains 5% (min KES 5)

## Payout states
PENDING -> COMPLETED (IntaSend Send Money webhook confirms Successful)
PENDING -> FAILED (webhook reports failure, or insufficient disbursement balance)

## Idempotency
Webhook handler checks payment/payout status before processing — a status
other than PENDING short-circuits with 200 OK, preventing duplicate ticket
issuance or duplicate payout processing on repeated webhook delivery.

## Fee structure rationale
5% platform fee with a KES 5 minimum floor, based on Kenyan ticketing market
rates (5-8% is standard). The floor protects margin on low-priced tickets
where a pure percentage would fall below IntaSend's own transaction cost.
