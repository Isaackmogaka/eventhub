# Database Provider Decision

Moved from Neon to Supabase (August 2026).

Neon: 100 compute-hours/month budget, burns down regardless of real
traffic (background jobs count), caused a mid-month full pause.

Supabase: pauses only after 7 consecutive days of zero database activity,
better suited to a low-traffic portfolio project. Mitigated further with
a scheduled keep-alive ping (see .github/workflows/keep-alive.yml).
