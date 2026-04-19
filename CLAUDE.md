# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Recipe web app being built per [brainstorm.md](brainstorm.md). Admin publishes categorized recipes (FREE / PREMIUM); users browse/search; premium recipes require a subscription managed by Polar.

**Only Phase 1 is implemented** (scaffolding, database, authentication). Categories, recipes, public browsing, Polar billing, access control — not yet built. The build strategy (brainstorm §15) is: finish the app *without* billing first (Phases 1–2), then add Polar (Phase 3). Do not introduce billing concerns into Phase 2 work.

## Stack (actual, not what README says)

- **Backend:** Spring Boot 3.3, **Java 17** (not 21), Maven. JWT auth via `io.jsonwebtoken:jjwt` 0.12.x. Flyway owns schema (`spring.jpa.hibernate.ddl-auto: validate`).
- **Frontend:** Next.js 15 App Router, **React 18** (not 19 — Next 15.0.3 peer dep), TypeScript, Tailwind CSS.
- **DB:** PostgreSQL (local install on dev; Docker compose file exists but is unused on this machine).

## Dev commands (Windows PowerShell)

```powershell
# Backend — from ./backend
.\mvnw.cmd spring-boot:run        # run on :8080
.\mvnw.cmd clean test             # run all tests
.\mvnw.cmd test -Dtest=ClassName  # single test class
.\mvnw.cmd clean package          # build jar

# Frontend — from ./frontend
npm run dev                        # dev server on :3000
npm run build
npm run lint
```

First-time setup: `mvn wrapper:wrapper` in `backend/` to generate `mvnw.cmd` (user's corporate Maven mirror `napsa-inovation-hub-group` is configured in `~/.m2/settings.xml`). Frontend needs `copy .env.local.example .env.local` before `npm install`.

Postgres expected at `localhost:5432` with db/user/password all `recipes` — see `application.yml` defaults.

## Architecture

### Backend package layout (`com.recipes.app`)

- `auth/` — `AuthController` (endpoints), `AuthService` (registration/login logic), `dto/` (request/response records). All API surface for auth lives here.
- `security/` — JWT pipeline: `JwtService` (sign/verify), `JwtAuthFilter` (reads `Authorization: Bearer`, populates `SecurityContext`), `UserDetailsServiceImpl` (loads by email, maps role → `ROLE_*`).
- `config/` — `SecurityConfig` (stateless, CORS, filter chain, permit `/api/auth/register` + `/api/auth/login`, everything else authenticated), `GlobalExceptionHandler` (maps `AuthenticationException` → 401 so login failures don't become 403).
- `user/` — `User` entity, `Role` enum (`USER`/`ADMIN`), `UserRepository`. The `polarCustomerId` field is intentionally nullable and reserved for Phase 3 — leave it alone until billing work starts.

### Frontend structure

- `src/lib/auth.ts` — token in `localStorage` (key `recipes.token`). `User` type mirrors backend `UserDto`.
- `src/lib/api.ts` — `apiFetch` wrapper auto-injects `Bearer` header from `localStorage`, throws `ApiError` (with `.status`) on non-2xx. `authApi` is the typed client for `/auth/*`.
- `src/app/` — App Router pages. `/account` is the canonical protected-page pattern: client component, calls `authApi.me()` in `useEffect`, redirects to `/login` on 401. Reuse this pattern for future protected pages.

### Critical invariants

- **Flyway owns schema.** `spring.jpa.hibernate.ddl-auto` is `validate` — Hibernate will refuse to start if entities drift from migrations. When adding fields, write a new migration (`V2__*.sql`, `V3__*.sql`, …) and update the entity in the same change. Never edit `V1__init_users.sql`.
- **Backend enforces premium access, not the frontend** (brainstorm §7 security rule). When Phase 3 lands, access checks must live in `@PreAuthorize`/controller logic — UI lock overlays are cosmetic only.
- **Polar is billing source of truth** (brainstorm §6). The app stores `polar_customer_id` + a `subscriptions` mirror, but never derives billing state independently — webhook events update local state.
- **DTOs at the boundary.** `AuthController` never returns the `User` entity — always `UserDto`. Keep this discipline in future controllers so we don't leak `passwordHash` or internal timestamps.

## Environment

Backend reads these env vars (defaults in [application.yml](backend/src/main/resources/application.yml) are dev-only):

- `APP_JWT_SECRET` — use a long random string, ≥32 chars
- `APP_JWT_EXPIRATION_MS` — default `86400000` (24h)
- `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` — default all `recipes`
- `APP_CORS_ALLOWED_ORIGINS` — CSV, default `http://localhost:3000`

Frontend reads `NEXT_PUBLIC_API_URL` (default `http://localhost:8080/api`).
