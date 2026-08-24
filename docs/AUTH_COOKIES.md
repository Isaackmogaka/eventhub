# Cookie-Based Auth Reference

Token issued via Set-Cookie on register/login/google, httpOnly + secure + sameSite=none.
requireAuth middleware checks req.cookies.token first, falls back to Authorization
header (kept for any non-browser or Socket.io use cases).
Logout clears the cookie server-side via /auth/logout — client cannot delete
an httpOnly cookie directly.
