# Security Notes

- Auth: HttpOnly, Secure, SameSite=None cookies (not localStorage)
- Passwords: bcrypt hashed, cost factor 10
- Rate limiting: 20 requests / 15 min on /auth routes
- Headers: Helmet middleware enabled
- Webhooks: verified via shared challenge string
- CORS: locked to FRONTEND_URL only
