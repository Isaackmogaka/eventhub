# Known Limitations

- Neon free tier: 100 compute-hours/month, can pause the project if exceeded
- IntaSend sandbox mode: test transactions only, real launch requires business verification
- Socket.io room joins are not currently token-verified (join-user trusts the client-supplied ID)
- No refund flow yet — payments are one-directional once completed

## Payout webhook idempotency
Rare race condition observed: concurrent webhook deliveries for the same
payout can both read PENDING status before either writes an update, causing
duplicate "updated to X" log lines. End state is still correct (no duplicate
money movement), but worth hardening with a transaction lock in future work.

## Payout webhook idempotency
Rare race condition observed: concurrent webhook deliveries for the same
payout can both read PENDING status before either writes an update, causing
duplicate "updated to X" log lines. End state is still correct (no duplicate
money movement), but worth hardening with a transaction lock in future work.
