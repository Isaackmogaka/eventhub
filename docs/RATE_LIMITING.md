# Rate Limiting Rationale

Applied only to /auth/* routes (20 req / 15 min per IP) since these are the
highest-value brute-force targets. Other routes rely on requireAuth/requireAdmin
for access control rather than rate limiting, since they require a valid session.
