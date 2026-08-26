# Deployment Notes

## Current hosts
- Frontend: Vercel (eventhub-frontend repo)
- Backend: Railway (eventhub repo, backend/ root directory)
- Database: Neon

## Environment variables required
See backend/.env.example and frontend/.env.example

## Webhook configuration
IntaSend webhook must point to: https://YOUR_BACKEND_URL/webhooks/intasend
Update this after any backend host migration.

## Pre-launch checklist
- [ ] Switch IntaSend from sandbox to live keys
- [ ] Fund IntaSend disbursement wallet for real payouts
- [ ] Upgrade or monitor Neon compute usage
- [ ] Confirm webhook URL matches production backend host

## Health check
GET /health returns {"status":"ok"} and is used by Railway's deploy healthcheck.
GET / returns basic API identification for anyone hitting the root by mistake.

## Why two frontend repos
Vercel is connected to eventhub-frontend (deploy-only mirror), while active
development happens in the eventhub monorepo's frontend/ folder. This avoids
Vercel needing a monorepo root-directory config that previously caused
misconfiguration issues during initial deployment.
