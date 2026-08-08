/**
 * Central configuration for the PrevPaperApp frontend.
 *
 * All backend URLs are sourced from Vite environment variables (VITE_*),
 * which you set in a `.env` file locally or in the Vercel project settings.
 * These are baked in at build time.
 */

const rawApiUrl = import.meta.env.VITE_API_URL as string | undefined;
const rawGlobalAdminUrl = import.meta.env.VITE_GLOBAL_ADMIN_URL as string | undefined;

// Main API gateway (auth, users, reps, content, etc.)
export const API_BASE_URL = rawApiUrl?.replace(/\/+$/, "") || "http://localhost:8080";

// Dedicated global-admin service (runs on a separate port in dev)
export const GLOBAL_ADMIN_BASE_URL =
  rawGlobalAdminUrl?.replace(/\/+$/, "") || "http://localhost:8082";

// Warn loudly if env vars are missing in production builds to avoid
// silently talking to localhost after deploying to Vercel.
if (import.meta.env.PROD && (!rawApiUrl || !rawGlobalAdminUrl)) {
  console.warn(
    "[config] VITE_API_URL and/or VITE_GLOBAL_ADMIN_URL are not set. " +
      "The app will fall back to localhost URLs, which will NOT work in production. " +
      "Set them in Vercel -> Project Settings -> Environment Variables and redeploy."
  );
}
