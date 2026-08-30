# Render Migration — Environment Variables Checklist

Copy each of these from Railway's Variables tab to Render's equivalent
settings before the first deploy attempt, to avoid the missing-variable
issues encountered during the original Railway setup:

- DATABASE_URL
- JWT_SECRET
- FRONTEND_URL
- INTASEND_PUBLISHABLE_KEY
- INTASEND_SECRET_KEY
- BACKEND_URL (update to the new Render URL once known)
- INTASEND_WEBHOOK_CHALLENGE
- GOOGLE_CLIENT_ID
- RESEND_API_KEY

After deploy succeeds, update BACKEND_URL to match Render's actual
assigned domain, then redeploy once more so the STK push host field
reflects the correct backend.
