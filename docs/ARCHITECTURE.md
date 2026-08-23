# EventHub Architecture

## Services
- Frontend: Next.js on Vercel
- Backend: Express + Socket.io on Railway (migrating to Render)
- Database: PostgreSQL on Neon
- Payments: IntaSend (M-Pesa STK Push + Send Money payouts)
- Email: Resend (password reset)
- Auth: JWT via HttpOnly cookies

## Real-time
Socket.io rooms: event:{id} for live availability, user:{id} for payment updates, admin-room for live stats.

## Repository structure
This is a monorepo (frontend/ + backend/) for development, mirrored to a
separate frontend-only repo for Vercel deployment. See CONTRIBUTING.md.
