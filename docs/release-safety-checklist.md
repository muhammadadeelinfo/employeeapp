# Release Safety Checklist

Use this checklist before every production release.

## 1) Environment and Config

- [ ] `.env` has required values: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `DATABASE_URL`, `DIRECT_URL`.
- [ ] Run `npm run check-db-config` and confirm it passes.
- [ ] Expo runtime `extra` values are present (`supabaseUrl`, `supabaseAnonKey`, `apiBaseUrl`).

## 2) Database and Schema

- [ ] Required tables exist in production schema, especially `public.notifications`.
- [ ] Run `supabase/notifications-table.sql` in the correct Supabase project.
- [ ] Row-level security policies are present and validated.

## 3) Type and Build Gates

- [ ] TypeScript check passes (`npx tsc --noEmit`) with project tsconfig.
- [ ] App builds successfully (`npm run android` / `npm run ios` / CI build).
- [ ] No unhandled runtime exceptions in startup flow.

## 4) Runtime Safety

- [ ] Global error boundary is enabled (`AppErrorBoundary` in `app/_layout.tsx`).
- [ ] Startup health checks run and show no critical warnings.
- [ ] Network failures degrade gracefully (error UI shown, no crashes).

## 5) Core User Journeys

- [ ] Login and logout work.
- [ ] Startup jobs list loads and refreshes.
- [ ] Notifications endpoint is reachable and does not return table-not-found errors.
- [ ] Shift/calendar screens open without render crashes.

## 6) Release and Monitoring

- [ ] `SENTRY_DSN` is set for production builds.
- [ ] Sentry events are visible for test error events.
- [ ] Roll out to a small percentage first.
- [ ] Monitor crash reports and API errors for at least 30 minutes.
- [ ] Keep last stable release ready for rollback.
