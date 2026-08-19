# EventHub Roadmap

## Known issues
- Neon free tier compute hours can be exhausted with continuous background jobs; hold-expiry sweep interval reduced from 60s to 5min to mitigate.
- Railway free trial credit is limited; backend hosting migration to Render's free tier is planned.

## Planned migration
- Move backend hosting from Railway to Render (free tier, no expiry).
- Re-point IntaSend webhook URL and Vercel's NEXT_PUBLIC_API_URL once migrated.

## Deferred features (deliberate future work)
Waitlists, dynamic/tiered pricing, refunds, multi-currency, recurring events,
signed/rotating QR tokens, floor plan designer, email campaign builder, dark mode.
