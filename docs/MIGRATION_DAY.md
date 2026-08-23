# Render Migration — Execution Checklist

1. Confirm Railway trial has actually expired before starting
2. Create Render web service, root directory: backend/
3. Copy every env var from Railway to Render exactly
4. Deploy, confirm /health responds
5. Update Vercel NEXT_PUBLIC_API_URL to new Render URL
6. Update IntaSend webhook destination to new Render URL
7. Run one real end-to-end test: hold, pay, payout, check-in
8. Only then decommission Railway
