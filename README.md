# FITSYNC Backend

Gym Management System API for Elite Fight Club (NestJS + PostgreSQL).

## Setup
1. Install Node 20+ and PostgreSQL; create a database named `fitsync`.
2. Copy `.env.example` to `.env` and set your DB password (`Copy-Item .env.example .env` on Windows).
3. `npm install`
4. `npm run start:dev`
5. API: http://localhost:3000/api  |  Docs: http://localhost:3000/api/docs

## Team rules
- Never push to `main`. Branch -> Pull Request -> 1 review -> merge.
- Branch names: `feature/<module>-<what>`
- Commits: `feat:`, `fix:`, `docs:`, `test:`
- Never commit `.env` or any keys.

## Module owners
- Authentication, JWT, roles, shared setup: Saajidh Ahamed
- Booking & calendar: Savindu Udhesh
- Trainers & client progress: Thisarani
- Admin, payments, notifications: Pasan