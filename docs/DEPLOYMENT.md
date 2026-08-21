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
