# Development notes

## Deploying frontend changes
Frontend changes must be pushed to both remotes:
```bash
git push
git subtree push --prefix=frontend frontend-repo main
```

## Local setup
See `backend/.env.example` and `frontend/.env.example` for required variables.

## Known constraints
- Neon free tier: 100 compute hours/month. Background jobs (hold expiry sweep) run every 5 minutes to conserve usage.
- Hosting migration from Railway to Render planned — see ROADMAP.md.

## Neon free tier note
100 compute-hours/month limit. If project shows "paused", check
console.neon.tech billing page for reset timing before assuming a code bug.
