# 🔐 Authentication - Quick Reference Card

## ✅ What's Done

- ✅ App checks token on startup
- ✅ Route guard redirects to login if no token
- ✅ API requests automatically include token
- ✅ 401 errors trigger re-login automatically
- ✅ Role-based access control implemented
- ✅ New utility functions for auth management

---

## 🚀 Usage Examples

### Check if User is Logged In

```javascript
import { isAuthenticated } from '@/user/auth.utils'

if (isAuthenticated()) {
  console.log('✅ User is logged in')
} else {
  console.log('❌ User needs to login')
}
```

### Check User Role

```javascript
import { hasRole } from '@/user/auth.utils'

if (hasRole('admin')) {
  // Show admin features
}

if (hasRole(['admin', 'editor'])) {
  // Check multiple roles
}
```

### Get Current Token

```javascript
import { getToken } from '@/user/auth.utils'

const token = getToken()
console.log('Current token:', token)
```

### Save Token (After Login)

```javascript
import { saveToken } from '@/user/auth.utils'

saveToken(responseToken)
```

### Logout User

```javascript
import { logout } from '@/user/auth.utils'
import { useRouter } from 'vue-router'

const router = useRouter()
logout(router)
```

### Debug Auth Data

```javascript
import { debugAuthData } from '@/user/auth.utils'

debugAuthData()
// Shows all token, roles, and user info in console
```

---

## 🔄 Flow Diagram

```
App Starts
    ↓
App.vue checks: Token exists?
    ↓
No Token? & Private Page?
    ↓YES→ Redirect to /login
    ↓NO→ Continue

User tries to access route
    ↓
router.beforeEach checks token
    ↓
No Token? & Private Route?
    ↓YES→ Redirect to /login
    ↓NO→ Check roles

User has required role?
    ↓YES→ Allow access
    ↓NO→ Redirect to home

API Request made
    ↓
axios.interceptor adds: Authorization: Bearer {token}
    ↓
Backend Response
    ↓
Status 401? → Clear token, redirect to /login
Status 403? → Redirect to home
Status 200? → Continue normally
```

---

## 📍 Protected Routes Example

```javascript
// In router/index.js
{
  path: 'admin',
  name: 'admin',
  component: () => import('../pages/Admin.vue'),
  meta: {
    requiresRole: ['admin', 'super_admin']  // ← Add this
  }
}
```

---

## 🛑 Common Error Scenarios

| Error                      | Cause                          | Solution                      |
| -------------------------- | ------------------------------ | ----------------------------- |
| Redirects to login on load | No token in localStorage       | Login first                   |
| Can't access admin page    | User doesn't have 'admin' role | Assign role in backend        |
| API returns 401            | Token expired or invalid       | App auto-redirects to login   |
| API returns 403            | User lacks permission          | Check user roles/permissions  |
| Token not sent in request  | Interceptor not loaded         | Check if axios.js is imported |

---

## 🔧 Files Modified

| File                     | Change                                           |
| ------------------------ | ------------------------------------------------ |
| `src/App.vue`            | Added token check on startup                     |
| `src/user/axios.js`      | Enhanced interceptors with better error handling |
| `src/router/index.js`    | Improved route guard with logging                |
| `src/user/auth.utils.js` | NEW - Auth utility functions                     |

---

## 📦 New File: `src/user/auth.utils.js`

**Location**: `src/user/auth.utils.js`

**Functions Available**:

- `isAuthenticated()` - Check if user is logged in
- `getToken()` - Get current token
- `saveToken(token)` - Save token
- `removeToken()` - Remove token
- `saveUserRoles(roles)` - Save roles
- `getUserRoles()` - Get roles
- `hasRole(roles)` - Check if user has role
- `saveUserInfo(info)` - Save user info
- `getUserInfo()` - Get user info
- `logout(router)` - Logout user
- `debugAuthData()` - Debug auth data

---

## 🎯 Import Statement

```javascript
// Single import
import { isAuthenticated } from '@/user/auth.utils'

// Multiple imports
import { isAuthenticated, getToken, hasRole, logout } from '@/user/auth.utils'
```

---

## 💡 Tips

1. **Check token before making decisions**

   ```javascript
   if (isAuthenticated()) {
     // Safe to use user data
   }
   ```

2. **Always check role before showing admin features**

   ```javascript
   if (hasRole('admin')) {
     // Show admin button
   }
   ```

3. **Debug authentication issues**

   ```javascript
   // In browser console:
   import { debugAuthData } from '@/user/auth.utils'
   debugAuthData()
   ```

4. **Check console for auth logs**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for logs with 🔐, ✅, ❌ icons

---

## ✨ Result

Users will now:

- ✅ Automatically redirect to login if no token
- ✅ Never see "401 Unauthorized" errors
- ✅ Be protected from accessing routes without authentication
- ✅ Be logged out automatically if token expires
- ✅ Have their role-based access controlled

---

**Last Updated**: 2026-01-10  
**Status**: ✅ Ready to Use
