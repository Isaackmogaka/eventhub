# FAQ

**Why did my database request fail with P1001?**
Neon's free tier auto-suspends after idle periods. Retry the request after a few seconds.

**Why do frontend changes not appear live after pushing?**
Frontend deploys from a separate mirrored repo. Run the subtree push documented in CONTRIBUTING.md.

**Why does a Google-signed-up user get "no password to change"?**
Google accounts have no passwordHash by design — they authenticate via Google only.
