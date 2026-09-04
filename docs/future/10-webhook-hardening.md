# Future: Webhook Idempotency Hardening
Wrap payout webhook status checks in a database transaction with row
locking to eliminate the observed concurrent-delivery race condition.
