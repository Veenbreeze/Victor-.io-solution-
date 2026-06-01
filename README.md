# VEENBREEZE SOLUTIONS

Production-ready full stack web application using React + Vite, TailwindCSS, Express.js, JWT authentication, and MySQL.

## Step 1: Architecture Design

The application is split into two deployable services:

- `frontend/`: React + Vite single-page application deployed to Vercel.
- `backend/`: Express REST API deployed to Render.
- `backend/database/database.sql`: MySQL schema and seed data for application tables.

Frontend responsibilities:

- Public marketing pages: Home, About, Services, Portfolio, Pricing, Contact.
- Authentication pages: Login and Register.
- Protected user dashboard.
- Admin dashboard for users, services, portfolio items, messages, and statistics.
- Axios API client using `VITE_API_URL`.
- Context API for authentication and theme state.

Backend responsibilities:

- REST API with modular routes, controllers, models, middleware, and config.
- JWT authentication and role authorization.
- bcrypt password hashing.
- Parameterized MySQL queries through `mysql2/promise`.
- Centralized error handling.
- CORS configured through `CLIENT_URL`.

## Step 2: Folder Structure

```text
project-root/
  frontend/
    src/
      components/
      pages/
      layouts/
      context/
      routes/
      services/
      hooks/
      utils/
      assets/
      data/
      App.jsx
  backend/
    controllers/
    routes/
    middleware/
    models/
    config/
    utils/
    uploads/
    database/
    server.js
```

## Step 3: Dependencies Installation Commands

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Step 4: Database Schema

Import the MySQL schema:

```bash
mysql -u root -p < backend/database/database.sql
```

Tables:

- `users`: names, emails, hashed passwords, `admin` or `user` roles, timestamps.
- `services`: service catalog records.
- `portfolio`: project cards with image, description, technologies, and links.
- `messages`: contact form submissions.

Create an admin user after configuring backend `.env`:

```bash
cd backend
npm run db:seed
```

Default seed admin:

- Email: `admin@veenbreeze.com`
- Password: `AdminPass123`

Change this password before production use.

## Step 5: Backend Development

Create `backend/.env` from `backend/.env.example`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=veenbreeze_solutions
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
```

Run locally:

```bash
cd backend
npm run dev
```

## Step 6: Frontend Development

Create `frontend/.env` from `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run locally:

```bash
cd frontend
npm run dev
```

## Step 7: Frontend-Backend Integration

The frontend uses `src/services/api.js` for all HTTP requests. JWT tokens are stored in local storage under:

- `veenbreeze_token`
- `veenbreeze_user`

Protected pages use route guards:

- `/dashboard`: authenticated users.
- `/admin`: admin users only.

## Step 8: Deployment Configuration

Frontend:

- `frontend/vercel.json` configures Vercel SPA rewrites.
- Set `VITE_API_URL` to the deployed Render API URL ending in `/api`.

Backend:

- `backend/render.yaml` defines a Render web service.
- Set production environment variables in Render.
- Set `CLIENT_URL` to the deployed Vercel domain. Multiple origins can be comma-separated.
- `backend/config/env.js` validates required backend environment variables at startup.

Required backend environment variables:

```text
PORT
DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
DB_NAME
JWT_SECRET
CLIENT_URL
```

Use `backend/.env.example` for local development and `backend/.env.production.example` as the checklist for Render.

## Step 9: Production Deployment Guide

1. Create a production MySQL database.
2. Import `backend/database/database.sql`.
3. Deploy `backend/` to Render.
4. Add backend environment variables in Render.
5. Deploy `frontend/` to Vercel.
6. Add `VITE_API_URL=https://your-render-service.onrender.com/api` in Vercel.
7. Update backend `CLIENT_URL=https://your-vercel-app.vercel.app`.
8. Run `npm run db:seed` once against production, then immediately change the admin password through a secure admin workflow or database update.

## Step 10: Testing Instructions

Backend smoke tests:

```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/services
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"Password123\"}"
```

Frontend checks:

```bash
cd frontend
npm run build
```

Manual QA:

- Verify desktop and mobile nav.
- Toggle dark and light mode.
- Register, login, and logout.
- Submit the contact form.
- Login as admin and verify admin statistics, users, services, portfolio, and messages.
- Test Vercel SPA routes by refreshing `/services`, `/dashboard`, and `/admin`.

## CI/CD With GitHub Actions

This project includes a complete workflow at `.github/workflows/ci-cd.yml`.

The pipeline runs automatically when you open a pull request into `main` and when you push or merge into `main`.

Pull request behavior:

- Install backend dependencies with `npm ci`.
- Run backend syntax tests with `npm test`.
- Run backend high-severity dependency audit.
- Install frontend dependencies with `npm ci`.
- Build the frontend with `npm run build`.
- Run frontend high-severity dependency audit.

Production deployment behavior:

- Only pushes to `main` deploy.
- Frontend deploys to Vercel after both backend and frontend checks pass.
- Backend deploys to Render after both backend and frontend checks pass.
- Render automatic deploys are disabled in `backend/render.yaml` so deployment is controlled by GitHub Actions.

Add these GitHub repository secrets in `Settings > Secrets and variables > Actions`:

```text
VITE_API_URL=https://your-render-service.onrender.com/api
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-team-or-user-id
VERCEL_PROJECT_ID=your-vercel-project-id
RENDER_DEPLOY_HOOK_URL=https://api.render.com/deploy/...
```

Vercel setup:

1. Create/import the Vercel project for `frontend/`.
2. Set the Vercel project root directory to `frontend`.
3. Add `VITE_API_URL` in Vercel project environment variables.
4. Get `VERCEL_TOKEN` from your Vercel account settings.
5. Get `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` from Vercel project settings or `.vercel/project.json` after running `vercel link`.

Render setup:

1. Create the Render web service for `backend/`.
2. Set the Render root directory to `backend`.
3. Add `PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, and `CLIENT_URL`.
4. Copy the service Deploy Hook URL from Render service settings.
5. Save it as the GitHub secret `RENDER_DEPLOY_HOOK_URL`.

Recommended team workflow:

1. Create a feature branch.
2. Push your new feature branch to GitHub.
3. Open a pull request into `main`.
4. GitHub Actions tests the backend and frontend.
5. Merge only after checks pass.
6. The merge to `main` automatically deploys the frontend to Vercel and backend to Render.
