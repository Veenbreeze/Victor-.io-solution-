# Victor.io Solutions

Production-ready full-stack app: **React + Vite + Tailwind** frontend on **Vercel**, **Express.js** API on **Render**, **PostgreSQL** database, JWT + OAuth (Google/GitHub) auth, and end-to-end CI/CD via GitHub Actions.

## Architecture

| Layer       | Stack                                       | Deploy target |
| ----------- | ------------------------------------------- | ------------- |
| Frontend    | React 18, Vite 6, Tailwind 3, Framer Motion | Vercel        |
| Backend     | Express 4, Passport, Helmet, Morgan         | Render        |
| Database    | PostgreSQL 16                               | Render PG     |
| CI/CD       | GitHub Actions                              | GitHub        |

```
project-root/
  frontend/          # React SPA (Vercel)
    src/
      components/    # Reusable UI
      pages/         # Routed pages
      layouts/       # Main + Auth layouts
      context/       # Auth + Theme providers
      routes/        # Route table + guards
      services/      # Axios API client
      hooks/         # Custom hooks
      utils/         # Helpers
  backend/           # Express API (Render)
    config/          # db.js, env.js, passport.js
    controllers/     # Route handlers
    middleware/      # Auth, errors, uploads
    models/          # Postgres queries
    routes/          # Express routers
    database/        # SQL schema, migrate.js, seed.js
    uploads/         # Multer file storage
    server.js        # Entry point
  .github/workflows/ # CI/CD pipeline
```

## Quick start (local)

### 1. PostgreSQL

```bash
createdb veenbreeze
```

### 2. Backend

```bash
cd backend
cp .env.example .env       # fill DB + JWT + CLIENT_URL
npm install
npm run db:migrate         # apply schema
npm run db:seed            # optional: create admin user
npm run dev                # http://localhost:5000
```

Default seeded admin: `admin@veenbreeze.com` / `AdminPass123` — change immediately.

### 3. Frontend

```bash
cd frontend
cp .env.example .env       # set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                # http://localhost:5173
```

## Environment variables

### Backend (`backend/.env`)

```
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
JWT_SECRET=long-random-string

# Either provide DATABASE_URL, or DB_* individually:
DATABASE_URL=postgres://user:pass@host:5432/db
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=postgres
# DB_PASSWORD=postgres
# DB_NAME=veenbreeze

# Optional OAuth (auto-disabled if missing):
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

### Frontend (`frontend/.env`)

```
VITE_API_URL=http://localhost:5000/api
VITE_GITHUB_USERNAME=Veenbreeze
```

## Production deployment

### Render (backend + database)

1. Push to GitHub.
2. In Render: **New +** → **Blueprint** → pick this repo.
3. Render reads `backend/render.yaml` and provisions both the PostgreSQL DB and the web service, wiring `DATABASE_URL` automatically.
4. Set the remaining env vars in the Render dashboard:
   - `CLIENT_URL` (the Vercel URL)
   - `BACKEND_URL` (this Render service URL)
   - OAuth client IDs/secrets (optional)
5. Render runs `npm ci && npm run db:migrate` on each deploy, then `npm start`. Health check: `/api/health`.

### Vercel (frontend)

1. Import the repo in Vercel; set the project root to `frontend/`.
2. Add env var `VITE_API_URL=https://<your-render-service>.onrender.com/api`.
3. Vercel reads `frontend/vercel.json` — no extra config required.

### Update OAuth callback URLs

After both services are live, update Google + GitHub OAuth apps:

- Google authorized redirect: `https://<backend>.onrender.com/api/auth/google/callback`
- GitHub callback URL: `https://<backend>.onrender.com/api/auth/github/callback`

## CI/CD pipeline

`.github/workflows/ci-cd.yml`:

| Stage              | Trigger             | What it does                                              |
| ------------------ | ------------------- | --------------------------------------------------------- |
| `backend-ci`       | PR + push to `main` | npm ci → syntax check → PG migration (against test PG) → audit |
| `frontend-ci`      | PR + push to `main` | npm ci → build → audit                                    |
| `deploy-frontend`  | push to `main`      | `vercel pull/build/deploy` (prebuilt prod)                |
| `deploy-backend`   | push to `main`      | Trigger Render deploy hook → poll `/api/health`           |

### Required GitHub Actions secrets

```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
VITE_API_URL                 # public, e.g. https://<backend>.onrender.com/api
VITE_GITHUB_USERNAME         # optional override
RENDER_DEPLOY_HOOK_URL       # from Render service → Settings → Deploy Hook
BACKEND_HEALTH_URL           # optional: enables post-deploy health probe
```

## API reference (summary)

| Method | Route                          | Auth        |
| ------ | ------------------------------ | ----------- |
| GET    | `/api/health`                  | public      |
| POST   | `/api/auth/register`           | public      |
| POST   | `/api/auth/login`              | public      |
| GET    | `/api/auth/providers`          | public      |
| GET    | `/api/auth/google`             | public (OAuth) |
| GET    | `/api/auth/github`             | public (OAuth) |
| GET    | `/api/users/me`                | user        |
| GET    | `/api/users`                   | admin       |
| GET/POST/PUT/DELETE | `/api/services`   | mixed       |
| GET/POST/PUT/DELETE | `/api/portfolio`  | mixed       |
| POST   | `/api/contact`                 | public      |
| GET    | `/api/messages`                | admin       |
| GET    | `/api/admin/stats`             | admin       |

## Smoke tests

```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/services
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"t@x.com","password":"password1"}'
```

## License

MIT
