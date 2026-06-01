# OAuth Implementation - Frontend Setup Guide

## ✅ Frontend Implementation Complete

This guide covers the OAuth (Google & GitHub) integration added to your Veenbreeze Solutions frontend.

---

## 📦 Installation

### 1. Install Dependencies
```bash
cd frontend
npm install
```

New package installed:
- `@react-oauth/google` - Google OAuth integration library

---

## 🎨 UI Components Added

### OAuth Buttons Component
**File:** `src/components/OAuthButtons.jsx`

Features:
- ✅ Google "Continue with Google" button
- ✅ GitHub "Continue with GitHub" button
- ✅ Loading states during OAuth flow
- ✅ Error message display
- ✅ Divider between OAuth and email/password
- ✅ Dark mode compatible
- ✅ Responsive layout
- ✅ Icon integration (react-icons)

**Usage:**
```jsx
import OAuthButtons from '../components/OAuthButtons.jsx';

<OAuthButtons isLoading={loading} disabled={loading} />
```

---

### Auth Callback Page
**File:** `src/pages/AuthCallback.jsx` *(NEW)*

Handles OAuth redirects from backend:
- ✅ Extracts token and user from URL params
- ✅ Stores in localStorage
- ✅ Updates auth context
- ✅ Redirects to dashboard or admin panel
- ✅ Error handling with user-friendly messages
- ✅ Loading spinner display

**Route:** `/auth-callback`

---

## 🔄 Updated Components

### Login Page
**File:** `src/pages/Login.jsx` *(MODIFIED)*

**Changes:**
- Added OAuthButtons component above email/password form
- OAuth buttons display before the divider
- All error handling integrated
- Loading states manage both OAuth and email login

**UI Flow:**
```
Header
OAuth Buttons (Google + GitHub)
───── OR ─────
Email/Password Form
Login Button
Links (Register, Home)
```

---

### Register Page
**File:** `src/pages/Register.jsx` *(MODIFIED)*

**Changes:**
- Added OAuthButtons component above email/password form
- Users can register via OAuth or email/password
- Auto-creates account on first OAuth login
- Same error handling and loading states

**UI Flow:**
```
Header
OAuth Buttons (Google + GitHub)
───── OR ─────
Email/Password Form
Register Button
Links (Login, Home)
```

---

### Auth Context
**File:** `src/context/AuthContext.jsx` *(MODIFIED)*

**New State:**
- `oauthError` - Stores OAuth error messages

**New Functions:**
- `setAuthState(payload)` - Called by AuthCallback to set user + token
- `clearOAuthError()` - Clears error message

**Updated Functions:**
- `login()` - Now clears OAuth errors
- `register()` - Now clears OAuth errors
- `logout()` - Clears OAuth errors on logout

**Error Auto-Clear:**
- OAuth errors auto-clear after 5 seconds

---

### Routes
**File:** `src/routes/AppRoutes.jsx` *(MODIFIED)*

**New Route:**
```jsx
<Route path="auth-callback" element={<AuthCallback />} />
```

Location: Inside `<AuthLayout />` so it has proper styling

---

### CSS Styling
**File:** `src/index.css` *(MODIFIED)*

**New Classes:**
```css
.btn-oauth      /* Base OAuth button styles */
.btn-google     /* Google button (white + light styling) */
.btn-github     /* GitHub button (dark/black styling) */
```

Features:
- ✅ Responsive padding and sizing
- ✅ Icon spacing
- ✅ Hover effects
- ✅ Dark mode support
- ✅ Disabled state handling
- ✅ Shadow effects
- ✅ Smooth transitions

---

## 🔧 Environment Configuration

### Development (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_GITHUB_USERNAME=Veenbreeze
VITE_GOOGLE_CLIENT_ID=your-development-google-client-id.apps.googleusercontent.com
```

### Production (.env.production)
```
VITE_API_URL=https://your-render-backend.onrender.com/api
VITE_GITHUB_USERNAME=Veenbreeze
VITE_GOOGLE_CLIENT_ID=your-production-google-client-id.apps.googleusercontent.com
```

---

## 🔐 Getting Google OAuth Credentials

### For Frontend (Google Client ID)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Enable Google+ API:
   - Go to APIs & Services → Library
   - Search for "Google+ API"
   - Click "Enable"
4. Create OAuth 2.0 Client ID:
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth Client ID"
   - Select "Web application"
   - Add Authorized JavaScript origins:
     - `http://localhost:5173` (dev)
     - `https://your-vercel-app.vercel.app` (prod)
   - Add Authorized redirect URIs:
     - `http://localhost:5173/auth-callback` (dev)
     - `https://your-vercel-app.vercel.app/auth-callback` (prod)
   - Copy the **Client ID** to `VITE_GOOGLE_CLIENT_ID`

### For Backend (Google Client Secret)
- Same credentials as above
- Copy the **Client Secret** to backend `GOOGLE_CLIENT_SECRET`
- Add to Authorized redirect URIs:
  - `http://localhost:5000/api/auth/google/callback` (dev)
  - `https://your-render-backend.onrender.com/api/auth/google/callback` (prod)

---

## 🚀 OAuth Flow (Frontend Side)

### User Clicks "Continue with Google"
```
User clicks button
  ↓
Frontend redirects to /api/auth/google
  ↓
Backend initiates Google OAuth
  ↓
Google consent screen appears
  ↓
User authorizes
  ↓
Google redirects to backend callback
  ↓
Backend processes + generates JWT
  ↓
Backend redirects to frontend:
  /auth-callback?token=JWT&user=JSON&provider=google
  ↓
Frontend's AuthCallback page:
  - Extracts token + user
  - Stores in localStorage
  - Updates auth context
  - Redirects to /dashboard
  ✅ User logged in
```

### User Clicks "Continue with GitHub"
Same flow, but:
- Endpoint: `/api/auth/github`
- GitHub's consent screen instead
- GitHub redirects to backend callback

---

## 📝 File Structure

### Frontend Files Modified/Created

```
frontend/
├── src/
│   ├── components/
│   │   └── OAuthButtons.jsx          ✨ NEW - OAuth buttons
│   │
│   ├── pages/
│   │   ├── Login.jsx                 🔄 Modified - Added OAuth
│   │   ├── Register.jsx              🔄 Modified - Added OAuth
│   │   └── AuthCallback.jsx          ✨ NEW - OAuth callback handler
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx             🔄 Modified - Added /auth-callback
│   │
│   ├── context/
│   │   └── AuthContext.jsx           🔄 Modified - OAuth state + methods
│   │
│   └── index.css                     🔄 Modified - Added OAuth button styles
│
├── .env.example                      🔄 Modified - Added VITE_GOOGLE_CLIENT_ID
└── package.json                      🔄 Modified - Added @react-oauth/google
```

---

## 🔄 Data Flow

### OAuth Success Flow
```
User Data (from provider)
        ↓
Backend validation
        ↓
User creation/lookup
        ↓
JWT token generation
        ↓
Redirect to frontend with token
        ↓
Frontend stores token + user
        ↓
Auth context updated
        ↓
Protected route access granted
        ✅ Authenticated
```

### Error Handling
```
OAuth fails
        ↓
Backend redirects with ?error=
        ↓
Frontend's AuthCallback catches error
        ↓
Display user-friendly error message
        ↓
Auto-redirect to /login after 3s
        ✅ User can retry
```

---

## 🎯 User Experience

### Login Page Now Shows
```
┌─────────────────────────────────┐
│     Welcome back                │
│                                 │
│  [  Google  ] [  GitHub  ]     │
│                                 │
│       ─────── OR ───────        │
│                                 │
│  Email:    [ input ]            │
│  Password: [ input ]            │
│                                 │
│  [ Login ]                      │
│                                 │
│  Need account? Register         │
│  ← Back to home                 │
└─────────────────────────────────┘
```

### Register Page Now Shows
```
┌─────────────────────────────────┐
│     Create account              │
│                                 │
│  [  Google  ] [  GitHub  ]     │
│                                 │
│       ─────── OR ───────        │
│                                 │
│  Name:     [ input ]            │
│  Email:    [ input ]            │
│  Password: [ input ]            │
│                                 │
│  [ Register ]                   │
│                                 │
│  Already registered? Login      │
│  ← Back to home                 │
└─────────────────────────────────┘
```

---

## ✅ Testing Checklist

### Local Development
- [ ] Run `npm install` in frontend
- [ ] Set `VITE_GOOGLE_CLIENT_ID` in `.env`
- [ ] Run `npm run dev`
- [ ] Click "Continue with Google" on Login page
- [ ] Verify Google consent screen appears
- [ ] Verify redirected to /auth-callback
- [ ] Verify user logged in on /dashboard
- [ ] Click "Continue with GitHub" on Register page
- [ ] Verify GitHub consent screen appears
- [ ] Verify redirected to /auth-callback
- [ ] Verify new account created and logged in

### OAuth Token Storage
- [ ] Open DevTools → Application → localStorage
- [ ] Verify `veenbreeze_token` is stored
- [ ] Verify `veenbreeze_user` is stored with name, email, avatar
- [ ] Token should be JWT format (3 parts separated by dots)

### Error Scenarios
- [ ] Test with wrong credentials
- [ ] Test network failure during OAuth
- [ ] Test expired token
- [ ] Verify error messages display
- [ ] Verify auto-redirect to login

### Email/Password Still Works
- [ ] Register with email/password works
- [ ] Login with email/password works
- [ ] Password validation enforced
- [ ] Existing users can still login

---

## 🚀 Deployment to Vercel

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Add OAuth authentication (Google & GitHub) - Frontend"
git push
```

### 2. Add Environment Variables in Vercel
Go to your Vercel project → Settings → Environment Variables:

```
VITE_API_URL=https://your-render-backend.onrender.com/api
VITE_GITHUB_USERNAME=Veenbreeze
VITE_GOOGLE_CLIENT_ID=prod-google-client-id.apps.googleusercontent.com
```

### 3. Redeploy Vercel
- Environment variables are automatically used
- Vite builds with production values
- Production deployment complete

### 4. Update Google OAuth Settings
- Go to Google Cloud Console
- Add Vercel domain to Authorized redirect URIs:
  - `https://your-vercel-app.vercel.app/auth-callback`

---

## 🔒 Security Best Practices

✅ **Token Storage:** Stored in localStorage (accessible via XSS)
✅ **HTTPS Only:** OAuth requires HTTPS in production
✅ **Secure Backend:** Backend validates all OAuth tokens
✅ **Short-lived Tokens:** JWT expires in 7 days
✅ **No Secrets Exposed:** Google Client Secret only on backend
✅ **CORS Protected:** Backend validates Origin header

---

## 🐛 Common Issues

### "Callback URL mismatch" Error
- **Cause:** Frontend redirect URL doesn't match Google settings
- **Fix:** Update Google Console → Authorized redirect URIs
- **Includes:** `https://your-domain.com/auth-callback`

### "Invalid Client ID" Error
- **Cause:** Wrong `VITE_GOOGLE_CLIENT_ID`
- **Fix:** Copy correct ID from Google Cloud Console
- **Check:** It should end with `.apps.googleusercontent.com`

### OAuth button not redirecting
- **Cause:** Backend API URL incorrect
- **Fix:** Check `VITE_API_URL` in .env
- **Should be:** `http://localhost:5000/api` (dev)

### User stays on AuthCallback page
- **Cause:** Token not in URL params
- **Fix:** Check backend OAuth routes are configured
- **Verify:** Backend redirects with `?token=...&user=...`

### Dark mode buttons look wrong
- **Cause:** TailwindCSS dark classes not applied
- **Fix:** Check `dark:` prefixes in CSS
- **Verify:** Dark mode toggle works globally

---

## ✨ Next Steps

### ✅ Implementation Complete
1. ✅ Backend OAuth routes
2. ✅ Frontend OAuth UI
3. ✅ Auth callback handling
4. ✅ Token management
5. ✅ Error handling

### 🚀 Ready to Deploy
- Backend to Render
- Frontend to Vercel
- Both environments configured with OAuth credentials

### 📚 Testing Recommendations
1. Test OAuth flow end-to-end
2. Test email/password login still works
3. Test linking multiple auth providers
4. Test error scenarios
5. Test on mobile devices

---

## 📞 Support

### Backend Issues?
- See `backend/OAUTH_SETUP.md`

### OAuth Credentials Issues?
- Google: https://console.cloud.google.com
- GitHub: https://github.com/settings/developers

### Deployment Issues?
- Vercel: https://vercel.com/docs
- Render: https://render.com/docs
