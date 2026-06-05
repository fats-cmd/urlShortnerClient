# URL Shortener Client - Codebase Documentation

## 📋 Overview

This is a React + TypeScript frontend for a URL shortening application. It handles user authentication, email verification, link management, and link analytics.

**Tech Stack:**
- React 19 + TypeScript
- Vite (bundler)
- React Router 7 (routing)
- Axios (HTTP client)
- Tailwind CSS 4 (styling)
- Vitest (testing)

---

## 🗂️ Project Structure

```
src/
├── App.tsx                          # Main app routing
├── main.tsx                         # Entry point
├── api/                             # API communication
│   ├── axios.ts                     # Axios instance with interceptors
│   ├── services/
│   │   └── authService.ts           # Auth API calls (login, signup, logout)
│   ├── auth/
│   │   ├── tokenStorage.ts          # Access token management (localStorage)
│   │   ├── refreshAuth.ts           # Token refresh logic
│   │   ├── clearAuth.ts             # Clear auth state
│   │   └── authQueue.ts             # Queue for failed requests during refresh
│   └── interceptors/
│       ├── requestInterceptor.ts    # Adds Authorization header to requests
│       └── responseInterceptor.ts   # Handles 401 errors & silent token refresh
├── components/
│   ├── Navbar.tsx                   # Navigation bar
│   ├── LinkCard.tsx                 # Link item display
│   ├── EyeIcon.tsx                  # Password visibility toggle
│   └── shared/
│       └── PageWrapper.tsx          # Layout wrapper for authenticated pages
├── context/
│   └── AuthContext.tsx              # Global auth state management
├── hooks/
│   └── useAuth.ts                   # Hook to access auth context
├── pages/
│   ├── Home.tsx                     # Dashboard - link management
│   └── auth/
│       ├── Login.tsx                # Login page
│       ├── Signup.tsx               # Signup page
│       ├── VerifyEmail.tsx          # Email verification prompt
│       ├── VerifySuccess.tsx        # Verification success page
│       └── VerifySuccess.test.tsx   # (existing test file)
├── router/
│   ├── ProtectedRoute.tsx           # Route protection wrapper
│   └── ProtectedRoute.test.tsx      # Route protection tests
├── types/
│   ├── Auth.tsx                     # Auth types (login, signup, credentials)
│   ├── User.tsx                     # User type definition
│   ├── Api.tsx                      # API response types
│   └── Types.tsx                    # General types (ShortLink, etc.)
├── utils/
│   ├── utils.tsx                    # Helper functions
│   └── constants/
│       └── constants.tsx            # App constants
├── styles/
│   └── theme.css                    # CSS variables & theme
└── assets/                          # Static assets

```

---

## 🔐 Authentication Flow

### 1. **Login Flow**

```
User fills login form (email, password)
         ↓
Login.tsx handleSubmit()
         ↓
calls useAuth().login(credentials)
         ↓
AuthContext.login() → loginRequest()
         ↓
axios POST /auth/login
         ↓
Backend returns: { accessToken, user, ... }
         ↓
tokenStorage.setAccessToken() → saves to localStorage
         ↓
AuthContext updates user state
         ↓
Login.tsx detects user state change via useEffect
         ↓
navigate("/dashboard")
         ↓
ProtectedRoute renders <Outlet /> (authenticated routes)
         ↓
Dashboard loads
```

**Key Files:**
- `src/pages/auth/Login.tsx` - Form & navigation logic
- `src/context/AuthContext.tsx` - User state management
- `src/api/services/authService.ts` - API call
- `src/api/auth/tokenStorage.ts` - Token persistence
- `src/router/ProtectedRoute.tsx` - Route protection

---

### 2. **Signup + Email Verification Flow**

```
User fills signup form (username, email, password)
         ↓
Signup.tsx handleSubmit()
         ↓
calls useAuth().signup(credentials)
         ↓
AuthContext.signup() → signupRequest()
         ↓
axios POST /auth/signup
         ↓
Backend:
  - Creates new user
  - Sends verification email
  - Returns: { accessToken, user, ... }
         ↓
tokenStorage.setAccessToken()
         ↓
AuthContext updates user state
         ↓
Signup.tsx detects user state change
         ↓
navigate("/verify-email?email=user@example.com")
         ↓
VerifyEmail.tsx shows prompt
         ↓
User clicks link in email OR uses resend button
         ↓
Backend verifies token: POST /auth/verify-email { token }
         ↓
navigate("/verify-success")
         ↓
VerifySuccess.tsx shows success message
         ↓
Auto-redirects to /dashboard after 3 seconds
```

**Key Files:**
- `src/pages/auth/Signup.tsx` - Form & navigation
- `src/pages/auth/VerifyEmail.tsx` - Email verification prompt
- `src/pages/auth/VerifySuccess.tsx` - Success confirmation

---

### 3. **Silent Token Refresh Flow**

```
User is logged in, access token stored in localStorage
         ↓
User makes request to protected endpoint
         ↓
requestInterceptor adds: Authorization: Bearer {token}
         ↓
Request sent to backend
         ↓
If status 401 (token expired):
  responseInterceptor catches error
         ↓
  if already refreshing: wait in failedQueue
  else: start refresh
         ↓
  axios POST /auth/refresh (uses httpOnly cookie)
         ↓
  Backend returns: { accessToken }
         ↓
  tokenStorage.setAccessToken() → updates localStorage
         ↓
  Retry original request with new token
         ↓
  Return response to user
         ↓
User doesn't notice interruption ✓
```

**Key Files:**
- `src/api/interceptors/requestInterceptor.ts` - Adds token to requests
- `src/api/interceptors/responseInterceptor.ts` - Handles 401 & refresh
- `src/api/auth/refreshAuth.ts` - Calls refresh endpoint
- `src/api/auth/tokenStorage.ts` - Token management
- `src/api/auth/authQueue.ts` - Queues requests during refresh

---

## 📁 Key Files & Their Responsibilities

### **Core Authentication**

| File | Purpose | Techniques |
|------|---------|-----------|
| `AuthContext.tsx` | Global auth state (user, isLoading, isAuthenticated) | React Context API, useCallback, useEffect |
| `useAuth.ts` | Hook to access auth context | Custom React hook, useContext |
| `loginRequest()` | POST /auth/login | Axios, TypeScript generics |
| `signupRequest()` | POST /auth/signup | Axios, TypeScript generics |
| `meRequest()` | GET /auth/me | Axios |
| `logoutRequest()` | POST /auth/logout | Axios, finally block |

### **Token Management**

| File | Purpose | Techniques |
|------|---------|-----------|
| `tokenStorage.ts` | Get/set/clear access token | localStorage API, module-level state, error handling |
| `refreshAuth.ts` | Refresh short-lived token | Axios post with credentials, httpOnly cookies |
| `clearAuth.ts` | Clear token | Wrapper around tokenStorage |
| `authQueue.ts` | Queue failed requests during refresh | Promise-based queue, resolve/reject callbacks |

### **HTTP Interception**

| File | Purpose | Techniques |
|------|---------|-----------|
| `axios.ts` | Axios instance setup | Axios interceptors, environment variables |
| `requestInterceptor.ts` | Adds Authorization header | Axios request interceptor |
| `responseInterceptor.ts` | Handles 401 & retries | Axios response interceptor, request queue, lock pattern |

### **Routing & Protection**

| File | Purpose | Techniques |
|------|---------|-----------|
| `App.tsx` | App routing configuration | React Router Routes & Outlet |
| `ProtectedRoute.tsx` | Guards protected routes | React Router custom wrapper, useAuth, navigate |

### **Pages**

| File | Purpose | Techniques |
|------|---------|-----------|
| `Login.tsx` | User login | Form state, useNavigate, useEffect for navigation |
| `Signup.tsx` | User registration | Password strength validation, form state |
| `VerifyEmail.tsx` | Email verification prompt | useSearchParams, resend logic |
| `VerifySuccess.tsx` | Success confirmation | useEffect auto-redirect, setTimeout |
| `Home.tsx` | Dashboard - link management | Pagination, filtering, sorting, API calls |

### **Types**

| File | Purpose |
|------|---------|
| `Auth.tsx` | LoginCredentials, SignupCredentials, AuthResponse, AuthContextValue |
| `User.tsx` | User profile type |
| `Api.tsx` | PaginatedResponse and API types |
| `Types.tsx` | ShortLink and general types |

---

## 🔄 State Management Strategy

**Global State (AuthContext):**
```typescript
{
  user: User | null,                    // Current authenticated user
  isLoading: boolean,                   // Loading during session verification
  isAuthenticated: boolean,             // !!user
  login: (credentials) => Promise,      // Login function
  signup: (credentials) => Promise,     // Signup function
  logout: () => Promise                 // Logout function
}
```

**Local State (Component Level):**
- Form fields (email, password, etc.)
- Loading/error states for async operations
- UI state (show password, open modals, etc.)

---

## 🌐 API Endpoints Expected

Your backend must implement:

```
POST   /auth/login              → { accessToken, user }
POST   /auth/signup             → { accessToken, user } (sends verification email)
POST   /auth/verify-email       → { message } (verify with token from email)
POST   /auth/resend-verification → { message }
POST   /auth/refresh            → { accessToken } (uses httpOnly cookie)
GET    /auth/me                 → { user }
POST   /auth/logout             → { message }

GET    /links                   → { data: ShortLink[], totalPages, total }
POST   /links                   → { data: ShortLink }
GET    /links/:id               → { data: ShortLink }
PUT    /links/:id               → { data: ShortLink }
DELETE /links/:id               → { message }
```

---

## 🔧 Advanced Techniques Used

### 1. **Request Interceptor Pattern**
```typescript
// Automatically adds auth header to every request
api.interceptors.request.use(requestInterceptor);
```

### 2. **Response Interceptor with Request Queue**
```typescript
// Handles 401 errors:
// - Detects token expiration
// - Silently refreshes token
// - Retries failed request with new token
// - Prevents multiple refresh calls (lock pattern)
```

### 3. **React Context with useCallback**
```typescript
// Prevents unnecessary re-renders
// Memoizes login/signup/logout functions
const login = useCallback(async (details) => {...}, []);
```

### 4. **useEffect for Navigation Side Effects**
```typescript
// Waits for async state update before navigating
useEffect(() => {
  if (shouldNavigate && user) {
    navigate(from);
  }
}, [shouldNavigate, user]);
```

### 5. **localStorage Persistence**
```typescript
// Token survives page reload
setAccessToken() → localStorage.setItem()
getAccessToken() → localStorage.getItem() with try/catch
```

### 6. **Custom React Hooks**
```typescript
// Encapsulates auth context access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Must be inside AuthProvider");
  return context;
};
```

### 7. **TypeScript Generics**
```typescript
// Type-safe API responses
api.post<AuthResponse>("/auth/login", credentials)
api.get<PaginatedResponse<ShortLink>>("/links")
```

### 8. **Environment Variables**
```typescript
// Production/development configuration
const BASE_URL = import.meta.env.VITE_APIV1_URL || "http://localhost:3000/api/v1";
```

---

## 🧪 Debugging Guide

### Issue: "Signing in..." shows indefinitely

**Steps to debug:**

1. **Open Browser DevTools** (F12)
2. **Go to Console tab**
   - Look for logs starting with `[Login]`
   - Should see: `[Login] Attempting login...` → `[Login] Login successful` or error
3. **Go to Network tab**
   - Look for `/auth/login` request
   - Check status code (200, 400, 401, 500, CORS error?)
   - Check response body
4. **Common Issues:**
   - Backend not running
   - CORS error (origin mismatch)
   - Backend response format wrong (missing `accessToken` or `user`)
   - Network timeout

### Issue: Token refresh not working

**Causes:**
- httpOnly cookie not being sent from backend
- `withCredentials: true` not set in axios (already set ✓)
- Refresh endpoint returning wrong format

**Check in Network tab:**
- Look for `/auth/refresh` request during 401 scenario
- Verify cookies are being sent

### Issue: Page stays on login after successful login

**Causes:**
- User state not updating in AuthContext
- useEffect in Login.tsx not triggering navigation
- ProtectedRoute redirect loop

**Fix:** Check browser console logs from [Login] to see if error occurred

---

## 📊 Component Dependency Graph

```
App (Routes)
├── /login → Login.tsx
│   └── uses useAuth() → login()
├── /signup → Signup.tsx
│   └── uses useAuth() → signup()
├── /verify-email → VerifyEmail.tsx
├── /verify-success → VerifySuccess.tsx
└── ProtectedRoute
    └── checks useAuth() → isAuthenticated
    └── /dashboard → Home.tsx
        └── uses api.get("/links")
    └── /profile → Profile.tsx
    └── /links/:id → LinkDetail.tsx
    └── /links/create → CreateLink.tsx
    └── /subscription → Subscription.tsx
```

---

## 🚀 Key Functions

### Login
```typescript
// Login.tsx handleSubmit
1. Validate form fields
2. Set loading = true
3. Call login(form)
4. Set shouldNavigate = true
5. useEffect detects user state change
6. Navigate to /dashboard
7. ProtectedRoute renders authenticated routes
```

### Token Refresh
```typescript
// responseInterceptor
1. Request returns 401
2. Check if already refreshing (prevent duplicate calls)
3. Call refreshAuth() → POST /auth/refresh
4. Get new accessToken
5. Store in localStorage via setAccessToken()
6. Retry original request with new token
7. Return response to component
```

### Session Verification
```typescript
// AuthContext useEffect (on mount)
1. Check if token exists in localStorage
2. If no token: set isLoading = false, skip refresh
3. If token exists: call refreshAuth()
4. Call meRequest() to get user data
5. Set user state
6. Set isLoading = false
```

---

## 💾 Local Storage Keys

```
__app_access_token   → Short-lived access token (JWT)
```

---

## 🔒 Security Considerations

✅ **Implemented:**
- Access token in localStorage (short-lived)
- Refresh token in httpOnly cookie (secure, can't be accessed by JS)
- CORS configured (frontend/backend same origin or CORS headers)
- Authorization header on every request
- Silent token refresh without user disruption

⚠️ **Considerations:**
- localStorage can be accessed by malicious scripts (XSS)
- Refresh token in httpOnly cookie is secure (httpOnly = not accessible via JS)
- Consider CSP headers for XSS protection
- Validate tokens server-side for every request

---

## 📦 Dependencies

**Core:**
- react: UI framework
- react-dom: React DOM rendering
- react-router-dom: Client-side routing
- axios: HTTP client

**Styling:**
- tailwindcss: Utility-first CSS
- @tailwindcss/vite: Vite plugin for Tailwind

**Build:**
- vite: Fast bundler
- typescript: Type safety

**Testing:**
- vitest: Fast unit testing
- @testing-library/react: Component testing
- jsdom: DOM simulation for tests

---

## 🏃 Running the App

```bash
# Install dependencies
npm install

# Development (runs on http://localhost:4000)
npm run dev

# Build for production
npm run build

# Preview production build
npm preview

# Run tests
npm test -- --run

# Lint code
npm run lint
```

---

## 📝 Environment Variables

Create `.env` file:
```env
VITE_APIV1_URL=https://urlshortner-production-ff8b.up.railway.app/api/v1
```

---

## 🎯 Next Steps

1. ✅ Fix CORS issue (update backend or deploy frontend)
2. ✅ Test login flow with browser console logs
3. ✅ Implement token refresh scenario
4. ✅ Build remaining pages (profile, subscription)
5. ✅ Add e2e tests
6. ✅ Deploy to production

---

## 📞 Support

For issues, check browser console (F12) for `[Login]` prefix logs showing exact error.
