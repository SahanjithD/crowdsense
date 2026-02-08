# CrowdSense

CrowdSense is a full‑stack web application for collecting, exploring, and managing public space feedback. It consists of a Next.js frontend and a Node.js/Express backend backed by a PostgreSQL database (Supabase-compatible).

## Tech Stack
- Frontend: Next.js, React, Tailwind CSS, Leaflet/Mapbox for maps, NextAuth
- Backend: Node.js, Express, JWT auth, Helmet, CORS, Morgan
- Database: PostgreSQL (tested with Supabase)

## Repository Structure
- `frontend/` – Next.js app (UI, pages, components)
- `backend/` – Express API (routes, models, middleware)

## Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (or Supabase)
- Optional: Mapbox token (if using Mapbox GL features)

## Backend Setup
1. Create a `.env` file in `backend/` with at least:
   - `PORT=8080` (optional; defaults to 8080)
   - `DATABASE_URL=postgres://user:password@host:5432/dbname`
   - `JWT_SECRET=your-strong-secret`
   - `CORS_ORIGINS=http://localhost:3000` (comma-separated list for multiple origins)
   - Optional: `FRONTEND_URL=http://localhost:3000` (used if `CORS_ORIGINS` not set)

2. Install dependencies and start the API:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. Initialize the database schema (requires `psql` CLI):
   - Ensure `SUPABASE_DB_URL` (or any valid Postgres connection string) is set for the `psql` command
   - Run:
   ```bash
   cd backend
   npm run init-db
   ```
   This applies `backend/schema.sql` to your database.

4. Health check:
   - GET `http://localhost:8080/api/health` should return a JSON status.

## Frontend Setup
1. Create a `.env.local` in `frontend/` with typical values (adjust as needed):
   - `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080`
   - `NEXTAUTH_URL=http://localhost:3000`
   - `NEXTAUTH_SECRET=your-strong-secret`
   - Optional Mapbox/Leaflet envs if used

2. Install dependencies and run the dev server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The app runs on `http://localhost:3000` by default.

## Key API Routes (backend)
- `POST /api/auth/signin` – Email/password sign in
- `POST /api/auth/signup` – Create account
- `GET /api/auth/verify` – Validate JWT token
- `GET /api/health` – Service health status
- Additional routes:
  - `/api/feedback`
  - `/api/users`
  - `/api/admin`

## Testing
- Backend test specs are under `backend/__tests__/` (e.g., `auth.test.js`, `feedback.test.js`).
- A test runner is not yet wired in `backend/package.json`; add Jest or your preferred framework before running tests.

## Development Notes
- CORS: Configure allowed origins via `CORS_ORIGINS` (comma‑separated) or `FRONTEND_URL`.
- JWT: `JWT_SECRET` must be set in backend and `NEXTAUTH_SECRET` in frontend to validate sessions.
- Database: The API uses `DATABASE_URL` at runtime. Schema initialization uses `SUPABASE_DB_URL` for the `psql` script.

## Scripts
- Backend:
  - `npm run dev` – Start API with nodemon
  - `npm start` – Start API
  - `npm run init-db` – Apply SQL schema via `psql`
- Frontend:
  - `npm run dev` – Next.js dev server
  - `npm run build` – Production build
  - `npm start` – Start production server

## License
This project currently has no explicit license. Add one if you plan to open‑source or distribute.
