# Security Notes

- Auth: HttpOnly, Secure, SameSite=None cookies (not localStorage)
- Passwords: bcrypt hashed, cost factor 10
- Rate limiting: 20 requests / 15 min on /auth routes
- Headers: Helmet middleware enabled
- Webhooks: verified via shared challenge string
- CORS: locked to FRONTEND_URL only

## Rate limit details
Auth endpoints (/auth/*) are limited to 20 requests per 15-minute window per IP,
returning a 429-equivalent JSON error rather than a raw block page.
