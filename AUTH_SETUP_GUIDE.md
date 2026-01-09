# Authentication & Token Management Guide

## 📋 Overview

This application now has a complete authentication system that automatically redirects users to the login page if no token is found. This prevents users from encountering errors when accessing protected routes without authentication.

---

## 🔐 How It Works

### 1. **Initial App Load** (`src/App.vue`)

When the app loads, it checks:

- ✅ If token exists in localStorage
- ✅ If current page is public (login/register) or private
- ✅ Redirects to login if no token on private pages

### 2. **Route Navigation** (`src/router/index.js`)

Before each route change:

- ✅ Checks if user has valid token
- ✅ If no token and trying to access private route → redirect to login
- ✅ If accessing role-restricted route → checks user roles
- ✅ Logs all guard checks to console

### 3. **API Request** (`src/user/axios.js`)

For every API request:

- ✅ Automatically adds `Authorization: Bearer {token}` header
- ✅ If receives 401 (token invalid) → clears token and redirects to login
- ✅ If receives 403 (forbidden) → redirects to home page
- ✅ Logs request/response details

---

## 🛠️ Key Files Modified

### `src/App.vue`

```javascript
// Checks token on app startup
// Redirects to login if no token
```

### `src/user/axios.js`

```javascript
// Enhanced request interceptor
// Enhanced response interceptor with 401 and 403 handling
```

### `src/router/index.js`

```javascript
// Improved route guard with comprehensive logging
// Role-based access control
```

### `src/user/auth.utils.js` (NEW)

```javascript
// Utility functions for token management
// Role checking
// User info management
// Debugging helpers
```

---

## 📦 Available Utilities

### From `src/user/auth.utils.js`:

#### Check Authentication

```javascript
import { isAuthenticated } from '@/user/auth.utils'

if (isAuthenticated()) {
  console.log('User is logged in')
} else {
  console.log('User needs to login')
}
```

#### Get/Save Token

```javascript
import { getToken, saveToken, removeToken } from '@/user/auth.utils'

const token = getToken()
saveToken(newToken)
removeToken() // logout
```

#### Manage User Roles

```javascript
import { getUserRoles, saveUserRoles, hasRole } from '@/user/auth.utils'

const roles = getUserRoles() // Get all user roles
const canAccess = hasRole('admin') // Check specific role
const canAccess = hasRole(['admin', 'editor']) // Check multiple roles
```

#### User Info

```javascript
import { getUserInfo, saveUserInfo } from '@/user/auth.utils'

const userInfo = getUserInfo()
saveUserInfo({ id: 123, name: 'John', email: 'john@example.com' })
```

#### Logout

```javascript
import { logout } from '@/user/auth.utils'
import { useRouter } from 'vue-router'

const router = useRouter()
logout(router) // Clears all data and redirects to login
```

#### Debug

```javascript
import { debugAuthData } from '@/user/auth.utils'

debugAuthData() // Logs all auth data to console
```

---

## 🔄 Login Flow

### Step 1: User enters credentials

```
Email: user@example.com
Password: ****
```

### Step 2: App sends login request

```javascript
POST /login
{
  "email": "user@example.com",
  "password": "****"
}
```

### Step 3: Backend returns token & roles

```json
{
  "status": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "admin"
    }
  }
}
```

### Step 4: App saves token & roles

```javascript
localStorage.setItem('token', token)
localStorage.setItem('user_roles', JSON.stringify(roles))
localStorage.setItem('user_info', JSON.stringify(user))
```

### Step 5: App redirects to dashboard

```
/login → /main/dashboard
```

---

## 🚫 Logout Flow

### When user clicks logout button:

```javascript
import { logout } from '@/user/auth.utils'

function handleLogout() {
  logout(router)
  // ✅ Clears token
  // ✅ Clears user roles
  // ✅ Clears user info
  // ✅ Redirects to /login
}
```

---

## 🛡️ Protected Routes Example

### Add role requirement to route:

```javascript
{
  path: 'admin-panel',
  name: 'admin panel',
  component: () => import('../pages/AdminPanel.vue'),
  meta: {
    requiresRole: ['admin', 'super_admin']
  }
}
```

### Check in component:

```javascript
import { hasRole } from '@/user/auth.utils'

const isAdmin = hasRole('admin')
const canEdit = hasRole(['admin', 'editor'])
```

---

## 📊 Console Debugging

### On App Startup:

```
🚀 App Initialized
🔑 Token exists: true
📍 Current path: /main/dashboard
🔓 Is public path: false
✅ Valid token found, user authenticated
```

### On Route Navigation:

```
🔐 Route Guard Check
📍 Navigating to: /main/dashboard
🔑 Token exists: true
✅ Is Authenticated: true
✅ Access granted
```

### On API Request (with token):

```
Token in axios interceptor: eyJhbGc...
```

### On API Error (401):

```
❌ 401 Unauthorized - Token invalid or expired
```

### Debug All Auth Data:

```javascript
// In console, run:
import { debugAuthData } from '@/user/auth.utils'
debugAuthData()

// Output:
═══════════════════════════════════════
🔐 Authentication Data Debug
═══════════════════════════════════════
Token: ✅ Present
User Roles: [{ id: 'admin', name: 'admin', label: 'Admin' }]
User Info: { id: 'uuid', email: 'user@example.com' }
Is Authenticated: ✅ Yes
═══════════════════════════════════════
```

---

## 🚨 Error Handling

### 401 - Unauthorized (Token Invalid)

```
Action: Clears token and redirects to login
Message: "⚠️ No token found - redirecting to login"
```

### 403 - Forbidden (No Permission)

```
Action: Redirects to home page
Message: "❌ 403 Forbidden - No permission to access this resource"
```

### Missing Token on Private Route

```
Action: Redirects to login with redirect query
URL: /login?redirect=/original/path
```

### Invalid Token Format

```
Action: Removes "Bearer " prefix if present
Message: "⚠️ Token format incorrect - contains 'Bearer' prefix"
```

---

## 📝 Local Storage Keys

| Key          | Purpose                  | Example                                          |
| ------------ | ------------------------ | ------------------------------------------------ |
| `token`      | JWT authentication token | `eyJhbGc...`                                     |
| `user_roles` | User's roles             | `[{id: 'admin', name: 'admin', label: 'Admin'}]` |
| `user_info`  | User information         | `{id: 'uuid', email: 'user@example.com'}`        |
| `user`       | (Legacy) User data       | `{email: 'user@example.com', role: 'admin'}`     |
| `roles`      | (Legacy) Roles array     | `['admin']`                                      |
| `email`      | (Legacy) User email      | `user@example.com`                               |

---

## ✨ Features

✅ **Automatic Authentication Check**

- Checks token on app startup
- Prevents access to protected routes without token

✅ **Token Validation**

- Removes invalid token format
- Handles 401 responses automatically
- Redirects to login on token expiration

✅ **Role-Based Access Control (RBAC)**

- Check user roles before accessing routes
- Check roles in components
- Multiple role support

✅ **Comprehensive Logging**

- Logs all authentication events
- Logs all route guard checks
- Easy debugging with console logs

✅ **Clean Logout**

- Clears all stored data
- Removes token
- Redirects to login

✅ **User-Friendly Redirects**

- Remembers where user wanted to go
- Redirects back after login via `redirect` query param

---

## 🎯 Quick Reference

```javascript
// Import utilities
import {
  isAuthenticated,
  getToken,
  saveToken,
  removeToken,
  getUserRoles,
  hasRole,
  logout,
  debugAuthData,
} from '@/user/auth.utils'

// Check if user is logged in
if (isAuthenticated()) {
  // User has token
}

// Get current token
const token = getToken()

// Check if user has specific role
if (hasRole('admin')) {
  // Show admin features
}

// Logout user
logout(router)

// Debug authentication
debugAuthData()
```

---

## 🔧 Troubleshooting

### User gets redirected to login unexpectedly

- Check console for route guard logs
- Verify token exists in localStorage
- Check if route has `requiresRole` meta

### API requests fail with 401

- Token may be expired
- Clear localStorage and login again
- Check if backend is returning valid token

### Can't access certain routes

- Check if route requires specific roles
- Verify user roles in localStorage
- Use `debugAuthData()` to inspect auth state

### Token not being sent in requests

- Check if token is saved in localStorage
- Open DevTools → Application → localStorage
- Verify axios interceptor is loading

---

**Last Updated**: 2026-01-10
**Status**: ✅ Complete Authentication System Implemented
