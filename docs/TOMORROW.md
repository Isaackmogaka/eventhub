# Tomorrow — Pick Up Here

## Order of operations
1. Create Supabase account and new project
2. Get Supabase connection string, update backend/.env locally, run
   `npx prisma migrate deploy` against it to recreate all tables fresh
3. Create Render account, new Web Service, root directory: backend/
4. Add all env vars to Render (see docs/RENDER_ENV_CHECKLIST.md), using
   the new Supabase DATABASE_URL instead of the old Neon one
5. Deploy, confirm /health responds
6. Update Vercel NEXT_PUBLIC_API_URL to the new Render URL
7. Update IntaSend webhook destination to the new Render URL
8. Full end-to-end test: register, hold, pay, payout, check-in
9. Set up a GitHub Actions scheduled ping to keep Supabase from
   pausing after 7 days of inactivity

## Don't forget
.github/workflows/keep-alive.yml has a placeholder YOUR_BACKEND_URL —
update it to the real Render URL once step 5 is complete.
