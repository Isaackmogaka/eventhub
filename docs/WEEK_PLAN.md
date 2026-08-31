# This Week's Plan

## Monday — Backend hosting migration
Move backend from Railway (free trial expiring) to Render (free tier, no expiry).
Steps: create Render web service with backend/ as root directory, copy all
environment variables, verify /health responds, update NEXT_PUBLIC_API_URL
on Vercel, update IntaSend webhook destination, run a full end-to-end test
(hold, pay, payout, check-in) before decommissioning Railway.

## Follow-up items after migration is stable
- Harden payout webhook idempotency against concurrent delivery race condition
- Verify Socket.io room joins against the authenticated session
- Consider Neon plan upgrade or usage monitoring given the 100 compute-hour limit

## Monday findings
Railway free trial confirmed expired — backend returns "Application not found".
Researched Supabase as a Neon alternative: pauses after 7 days of *inactivity*
(not a shrinking compute-hour budget like Neon), which fits a low-traffic
portfolio site's usage pattern much better. Decision: migrate database to
Supabase alongside the planned Render backend migration.
