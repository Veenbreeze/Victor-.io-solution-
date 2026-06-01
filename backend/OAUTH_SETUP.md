# OAuth Implementation - Backend Setup Guide

## ✅ Backend Implementation Complete

This guide covers the OAuth (Google & GitHub) integration added to your Veenbreeze Solutions backend.

---

## 📦 Installation

### 1. Install Dependencies
```bash
cd backend
npm install
```

New packages installed:
- `passport` - OAuth middleware framework
- `passport-google-oauth20` - Google OAuth strategy
- `passport-github2` - GitHub OAuth strategy
- `express-session` - Session management for OAuth

### 2. Database Migration

**For NEW databases:**
```bash
mysql -u root -p < database/database.sql
```

**For EXISTING databases:**
```bash
mysql -u root -p < database/migration_oauth.sql
```

This adds OAuth columns to the users table:
- `provider` (VARCHAR 20) - 'email', 'google', or 'github'
- `provider_id` (VARCHAR 255) - Provider's unique identifier
- `avatar` (VARCHAR 500) - Profile picture URL
- `password` - Now nullable (for OAuth users)

---

## 🔑 Environment Configuration

### Development (.env)
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
CLIENT_URL=http://localhost:5173
```

### Production (.env.production)
```
GOOGLE_CLIENT_ID=prod-google-client-id
GOOGLE_CLIENT_SECRET=prod-google-client-secret
GITHUB_CLIENT_ID=prod-github-client-id
GITHUB_CLIENT_SECRET=prod-github-client-secret
CLIENT_URL=https://your-vercel-app.vercel.app
BACKEND_URL=https://your-render-backend.onrender.com
```

---

## 🔐 Getting OAuth Credentials

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (dev)
   - `https://your-render-backend.onrender.com/api/auth/google/callback` (prod)

### GitHub OAuth Setup
1. Go to [GitHub Settings → Developer Settings → OAuth Apps](https://github.com/settings/developers)
2. Create New OAuth App
3. Authorization callback URL:
   - `http://localhost:5000/api/auth/github/callback` (dev)
   - `https://your-render-backend.onrender.com/api/auth/github/callback` (prod)

---

## 🚀 API Endpoints

### OAuth Routes

**Google Login:**
- `GET /api/auth/google` - Initiates Google OAuth flow
- `GET /api/auth/google/callback` - Google callback endpoint
- `GET /api/auth/google/failure` - Failure handler

**GitHub Login:**
- `GET /api/auth/github` - Initiates GitHub OAuth flow
- `GET /api/auth/github/callback` - GitHub callback endpoint
- `GET /api/auth/github/failure` - Failure handler

**Response (all OAuth callbacks):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "https://...",
    "provider": "google"
  }
}
```

---

## 🔄 OAuth Flow

### New User (Google/GitHub)
1. User clicks "Continue with Google/GitHub"
2. User authorizes on provider's site
3. Backend receives user profile from provider
4. Backend creates new user in database
5. Backend generates JWT token
6. Backend redirects to frontend with token

### Existing User (Email/Password Account)
1. User signs in via Google/GitHub
2. Backend finds existing user by email
3. Backend links OAuth provider to account
4. User can now login with both methods

### Existing User (Already linked OAuth)
1. User signs in via OAuth
2. Backend finds account by provider ID
3. Generates JWT token
4. Redirects to frontend

---

## 📝 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password VARCHAR(255) NULL,           -- NULL for OAuth users
  provider VARCHAR(20) DEFAULT 'email', -- 'email', 'google', 'github'
  provider_id VARCHAR(255),             -- Provider's unique ID
  avatar VARCHAR(500),                  -- Profile picture
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_provider_id (provider, provider_id)
);
```

---

## 🛠️ Backend Files Modified/Created

### New Files
- `config/passport.js` - Passport OAuth strategies
- `controllers/oauthController.js` - OAuth callback handlers
- `database/migration_oauth.sql` - Database migration script
- `.env.example` - Updated with OAuth variables
- `.env.production.example` - Updated with production OAuth variables

### Modified Files
- `package.json` - Added passport dependencies
- `routes/authRoutes.js` - Added OAuth endpoints
- `models/userModel.js` - Added OAuth helper functions
- `server.js` - Added Passport initialization
- `config/env.js` - Updated env validation
- `database/database.sql` - Updated user table schema

---

## ✅ Verification Checklist

- [ ] Install dependencies: `npm install`
- [ ] Run database migration
- [ ] Configure Google OAuth credentials
- [ ] Configure GitHub OAuth credentials
- [ ] Update `.env` with OAuth credentials
- [ ] Test `/api/auth/google` endpoint
- [ ] Test `/api/auth/github` endpoint
- [ ] Verify tokens are generated correctly
- [ ] Test database user creation/linking
- [ ] Test deployment environment variables

---

## 🚀 Deployment to Render

### 1. Push code to GitHub
```bash
git add .
git commit -m "Add OAuth authentication (Google & GitHub)"
git push
```

### 2. Add environment variables in Render
Go to your Render backend service → Environment:
```
GOOGLE_CLIENT_ID=***
GOOGLE_CLIENT_SECRET=***
GITHUB_CLIENT_ID=***
GITHUB_CLIENT_SECRET=***
CLIENT_URL=https://your-vercel-app.vercel.app
BACKEND_URL=https://your-render-backend.onrender.com
```

### 3. Update OAuth provider redirect URIs
- Google: Add `https://your-render-backend.onrender.com/api/auth/google/callback`
- GitHub: Add `https://your-render-backend.onrender.com/api/auth/github/callback`

---

## 🔒 Security Notes

1. **Never commit** `.env` with real credentials
2. **Use strong** `JWT_SECRET` in production
3. **HTTPS only** in production
4. **Validate** email domain in corporate environments
5. **Rate limit** OAuth endpoints to prevent abuse
6. **Store secrets** in environment variables, never in code

---

## 🐛 Troubleshooting

### "OAuth credentials not found"
- Check `.env` file has `GOOGLE_CLIENT_ID`, etc.
- Restart backend server

### "Callback URL mismatch"
- Update redirect URIs in Google/GitHub settings
- Match `BACKEND_URL` in `.env`

### "User already exists with email"
- Check if email exists in database
- OAuth will auto-link to existing account

### 401 Unauthorized errors
- Verify JWT token in Authorization header
- Check token hasn't expired (7 days)
- Verify `JWT_SECRET` matches between requests

---

## ✨ Next Steps

1. ✅ **Backend OAuth complete**
2. Next: Frontend implementation
   - Add `@react-oauth/google` package
   - Create OAuth button components
   - Update Login/Register pages
   - Integrate auth callbacks

See `FRONTEND_OAUTH_GUIDE.md` for frontend setup.
