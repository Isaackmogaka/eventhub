# EventHub

A full-stack event management and ticketing platform built for the Kenyan market.

## Stack
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript, Prisma
- **Database:** PostgreSQL (Neon)
- **Real-time:** Socket.io
- **Payments:** IntaSend (M-Pesa STK Push)
- **Deployment:** Vercel (frontend), Railway (backend)

## Features
- Concurrency-safe ticket holds with a 10-minute reservation window
- Real-time ticket availability across all connected clients
- M-Pesa payment collection via IntaSend, with webhook-confirmed ticket issuance
- Role-based access: Attendee, Organizer, Admin
- Admin dashboard with live platform stats
- QR-code ticket check-in
- Interactive event location maps (Leaflet/OpenStreetMap)

## Local development
See `backend/.env.example` and `frontend/.env.example` for required environment variables.

```bash
cd backend && npm install && npx prisma migrate dev && npm run dev
cd frontend && npm install && npm run dev
```

## Deployment note
Frontend changes must be pushed to both remotes:
```bash
git push
git subtree push --prefix=frontend frontend-repo main
```

## Current status
Fully functional end-to-end: real M-Pesa payments via IntaSend, real-time
ticket availability, organizer payouts, admin dashboard, Google OAuth,
HttpOnly cookie authentication. See ROADMAP.md for hosting migration plans.

## Hosting
Frontend: Vercel. Backend: Render. Database: Supabase.
