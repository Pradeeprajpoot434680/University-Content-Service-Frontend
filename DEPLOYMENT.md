# Deployment Guide (Vercel)

This frontend is a **Vite + React** SPA. It has **no hardcoded backend URLs** anymore —
every API call reads from environment variables via `src/config.ts`.

## 1. Environment variables

All backend URLs are configured through Vite env vars (must be prefixed with `VITE_`).

| Variable | Example | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | `https://api.prevpaper.fun` | Main API gateway (auth, users, reps, content) |
| `VITE_GLOBAL_ADMIN_URL` | `https://api.prevpaper.fun` | Global-admin service (separate port in dev) |

> ⚠️ **Important:** If these are missing in a production build, the app falls back to
> `http://localhost:8080` / `http://localhost:8082` **and logs a warning in the browser
> console**. Always set them in Vercel before deploying.

### Local development

```bash
cp .env.example .env
# edit .env to point at your local backend
npm install
npm run dev
```

## 2. Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel: **New Project → Import** the repo. Vercel auto-detects **Vite**.
   - Build command: `npm run build`
   - Output directory: `dist`
3. Go to **Project → Settings → Environment Variables** and add:
   - `VITE_API_URL` → your deployed backend URL
   - `VITE_GLOBAL_ADMIN_URL` → your global-admin URL
4. Click **Deploy**. On future env-var changes, redeploy.

SPA routing is handled by the included `vercel.json` rewrite
(every path falls back to `index.html`), so deep links like `/dashboard`
work without 404s.

## 3. Backend must allow cross-origin requests

Because the frontend lives on `https://*.vercel.app` (or a custom domain) and the backend
on another origin, the backend must:

- Enable **CORS** for the frontend origin (see `docs/spring-boot-cors.md`).
- Allow **credentials** (`Access-Control-Allow-Credentials: true`).
- Use `SameSite=None; Secure` on the auth cookies so they are sent cross-site.
- Serve over **HTTPS** (Vercel does this automatically for the frontend).

## 4. Verifying the deployment

1. Open the deployed site and check the browser console has **no** config warning.
2. Sign in — the login call should succeed and the session should survive a page refresh.
3. Navigate to a few protected routes (`/dashboard`, `/exam-formats`) and confirm data loads.
