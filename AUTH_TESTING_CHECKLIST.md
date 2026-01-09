# 🧪 Authentication System - Testing Checklist

## Phase 1: Basic Token Validation

### Test 1.1: No Token on App Start

- [ ] Clear localStorage (DevTools → Application → localStorage → Clear All)
- [ ] Reload app
- **Expected**: Auto-redirect to /login page
- **Console**: Should see "⚠️ No token found - redirecting to login"

### Test 1.2: Token Exists on App Start

- [ ] Login with valid credentials
- [ ] Reload app
- **Expected**: Stay on current page (dashboard)
- **Console**: Should see "✅ Valid token found, user authenticated"

### Test 1.3: Accessing App URL Directly

- [ ] Copy dashboard URL: `http://localhost:5173/main/dashboard`
- [ ] Logout first
- [ ] Paste URL in new tab without token
- **Expected**: Redirect to /login
- **Console**: Should see redirect warning

---

## Phase 2: Route Protection

### Test 2.1: Accessing Private Route Without Token

- [ ] Clear token from localStorage
- [ ] Try to access `/wo/all` (work order page)
- **Expected**: Redirect to /login with redirect query
- **URL**: Should show `?redirect=/wo/all`

### Test 2.2: Accessing Public Route Without Token

- [ ] Clear token from localStorage
- [ ] Go to `/login`
- **Expected**: Should allow access (no redirect)
- **Console**: Should not show error

### Test 2.3: Redirect After Login

- [ ] Try accessing `/wo/all` without token
- [ ] Get redirected to `/login?redirect=/wo/all`
- [ ] Login with valid credentials
- **Expected**: Auto-redirect back to `/wo/all`
- **Result**: User continues where they left off ✅

---

## Phase 3: Token in API Requests

### Test 3.1: Token Included in Requests

- [ ] Login successfully
- [ ] Open DevTools → Network tab
- [ ] Perform any action that makes API request
- [ ] Click on request in Network tab
- [ ] Check Headers section
- **Expected**: See `Authorization: Bearer eyJhbGc...`

### Test 3.2: No Token in Requests When Not Logged In

- [ ] Clear token
- [ ] Open Network tab
- [ ] Make request
- **Expected**: No Authorization header
- **Console**: Should warn "⚠️ No token found in localStorage"

### Test 3.3: Token Format Cleanup

- [ ] Save token with "Bearer " prefix: `Bearer eyJhbGc...`
- [ ] Reload app
- **Expected**: "Bearer " prefix is removed automatically
- **Console**: Should log "⚠️ Token format incorrect"

---

## Phase 4: Error Handling

### Test 4.1: 401 Unauthorized Response

- [ ] Manually set expired token in localStorage
- [ ] Try to access protected page or make API request
- **Expected**:
  - Token cleared from localStorage
  - Redirect to /login
  - See error in console: "❌ 401 Unauthorized"

### Test 4.2: 403 Forbidden Response

- [ ] Create scenario where user lacks permission
- [ ] Make request that returns 403
- **Expected**:
  - Redirect to home page (`/`)
  - See error in console: "❌ 403 Forbidden"

### Test 4.3: Graceful Error Display

- [ ] Trigger any auth error
- **Expected**: No browser error alerts
- **Console**: Detailed error logging
- **UI**: User-friendly message (if implemented)

---

## Phase 5: Role-Based Access

### Test 5.1: Route with Role Requirement

- [ ] Add role requirement to route:
  ```javascript
  meta: {
    requiresRole: ['admin']
  }
  ```
- [ ] Login as non-admin user
- [ ] Try to access route
- **Expected**: Redirect to home page
- **Alert**: Show "Anda tidak memiliki akses ke halaman ini"

### Test 5.2: Access with Correct Role

- [ ] Login as admin user
- [ ] Access route with `requiresRole: ['admin']`
- **Expected**: Allow access ✅
- **Console**: Should log "✅ Access granted"

### Test 5.3: Multiple Required Roles

- [ ] Add route: `meta: { requiresRole: ['admin', 'manager'] }`
- [ ] Login as 'manager' user
- [ ] Access route
- **Expected**: Allow access (has one of required roles) ✅

### Test 5.4: hasRole() Utility Function

- [ ] In console, run:
  ```javascript
  import { hasRole } from '@/user/auth.utils'
  console.log(hasRole('admin'))
  console.log(hasRole(['admin', 'editor']))
  ```
- **Expected**: Should return true/false correctly

---

## Phase 6: Logout

### Test 6.1: Logout Clears Data

- [ ] Login with credentials
- [ ] Click logout button
- [ ] Open DevTools → Application → localStorage
- **Expected**:
  - `token` cleared
  - `user_roles` cleared
  - `user_info` cleared
  - `user` cleared
  - `roles` cleared

### Test 6.2: Logout Redirects to Login

- [ ] Logout from any page
- **Expected**: Redirect to /login
- **URL**: Should be exactly `/login`

### Test 6.3: Cannot Access Protected Routes After Logout

- [ ] Logout
- [ ] Try to access `/main/dashboard`
- **Expected**: Redirect to /login
- **Console**: Should show token not found warning

---

## Phase 7: Console Logging

### Test 7.1: App Startup Logs

- [ ] Clear console
- [ ] Reload app
- **Expected**: See logs like:
  ```
  🚀 App Initialized
  🔑 Token exists: true
  📍 Current path: /main/dashboard
  ✅ Valid token found, user authenticated
  ```

### Test 7.2: Route Guard Logs

- [ ] Open console
- [ ] Navigate between pages
- **Expected**: See logs like:
  ```
  🔐 Route Guard Check
  📍 Navigating to: /wo/all
  🔑 Token exists: true
  ✅ Is Authenticated: true
  ✅ Access granted
  ```

### Test 7.3: Debug Authentication Data

- [ ] In console, run:
  ```javascript
  import { debugAuthData } from '@/user/auth.utils'
  debugAuthData()
  ```
- **Expected**: See formatted output:
  ```
  ═══════════════════════════════════════
  🔐 Authentication Data Debug
  ═══════════════════════════════════════
  Token: ✅ Present
  User Roles: [...]
  User Info: {...}
  Is Authenticated: ✅ Yes
  ═══════════════════════════════════════
  ```

---

## Phase 8: Edge Cases

### Test 8.1: Rapid Page Navigation

- [ ] Login
- [ ] Quickly click between different pages
- **Expected**: No errors, smooth navigation
- **Console**: No error spam

### Test 8.2: Open Multiple Tabs

- [ ] Login in tab 1
- [ ] Open new tab
- [ ] Try to access protected page in tab 2
- **Expected**: Should work (token in localStorage is shared)

### Test 8.3: Login in One Tab, Check Another

- [ ] Have tab 1 with login page
- [ ] Have tab 2 with protected page (showing error)
- [ ] Login in tab 1
- [ ] Refresh tab 2
- **Expected**: Tab 2 now shows content (token was saved to localStorage)

### Test 8.4: Logout in One Tab

- [ ] Have two tabs open with app
- [ ] Logout in tab 1
- [ ] Try any action in tab 2
- **Expected**: Tab 2 detects no token and redirects to login

### Test 8.5: Token Expires During Session

- [ ] Login
- [ ] Wait for token to expire (or simulate)
- [ ] Try to make API request
- **Expected**: Auto-redirect to login with "session expired" message

---

## Phase 9: Utility Functions

### Test 9.1: isAuthenticated()

```javascript
import { isAuthenticated } from '@/user/auth.utils'

// When logged in:
console.log(isAuthenticated()) // true

// When logged out:
console.log(isAuthenticated()) // false
```

### Test 9.2: getToken()

```javascript
import { getToken } from '@/user/auth.utils'

console.log(getToken()) // Returns token string or null
```

### Test 9.3: saveToken()

```javascript
import { saveToken } from '@/user/auth.utils'

saveToken('new-token-here')
// Should save to localStorage and log: ✅ Token saved successfully
```

### Test 9.4: hasRole()

```javascript
import { hasRole } from '@/user/auth.utils'

hasRole('admin') // true if user is admin
hasRole(['admin', 'editor']) // true if user is either
hasRole('superuser') // false if user doesn't have role
```

### Test 9.5: logout()

```javascript
import { logout } from '@/user/auth.utils'
import { useRouter } from 'vue-router'

const router = useRouter()
logout(router)
// Should clear all data and redirect to /login
```

---

## Phase 10: Browser Compatibility

### Test 10.1: Clear localStorage Persistence

- [ ] Login
- [ ] Close browser
- [ ] Reopen browser to same URL
- **Expected**: Token still exists, user stays logged in ✅

### Test 10.2: Private Window/Incognito

- [ ] Open app in private/incognito window
- **Expected**: Token not persisted (new session each time) ✅

---

## Checklist Summary

| Phase     | Tests        | Status |
| --------- | ------------ | ------ |
| Phase 1   | 3 tests      | ☐      |
| Phase 2   | 3 tests      | ☐      |
| Phase 3   | 3 tests      | ☐      |
| Phase 4   | 3 tests      | ☐      |
| Phase 5   | 4 tests      | ☐      |
| Phase 6   | 3 tests      | ☐      |
| Phase 7   | 3 tests      | ☐      |
| Phase 8   | 5 tests      | ☐      |
| Phase 9   | 5 tests      | ☐      |
| Phase 10  | 2 tests      | ☐      |
| **TOTAL** | **34 tests** | ☐      |

---

## Pass/Fail Criteria

### ✅ PASS (All Green)

- [ ] All 34 tests passed
- [ ] No console errors
- [ ] No auth-related bugs
- [ ] Smooth user experience
- [ ] Ready for production

### ⚠️ PARTIAL (Some Issues)

- [ ] Some tests failed
- [ ] Document failures
- [ ] Fix issues
- [ ] Re-test

### ❌ FAIL (Critical Issues)

- [ ] Major auth flows broken
- [ ] Security concerns
- [ ] Complete overhaul needed

---

## Quick Test Script

Run this in browser console to test multiple scenarios:

```javascript
// Import utilities
import { isAuthenticated, getToken, hasRole, debugAuthData } from '@/user/auth.utils'

// Test 1: Check auth status
console.log('Test 1 - Is Authenticated:', isAuthenticated())

// Test 2: Get token
console.log('Test 2 - Token:', getToken() ? 'Present' : 'Missing')

// Test 3: Check roles
console.log('Test 3 - Is Admin:', hasRole('admin'))

// Test 4: Debug all data
console.log('Test 4 - Full Debug:')
debugAuthData()

// All tests complete!
console.log('✅ All console tests completed')
```

---

## Test Results Template

```
Date: __________
Tester: __________
Build Version: __________

Phase 1 Tests: ☐ PASS ☐ FAIL
Phase 2 Tests: ☐ PASS ☐ FAIL
Phase 3 Tests: ☐ PASS ☐ FAIL
Phase 4 Tests: ☐ PASS ☐ FAIL
Phase 5 Tests: ☐ PASS ☐ FAIL
Phase 6 Tests: ☐ PASS ☐ FAIL
Phase 7 Tests: ☐ PASS ☐ FAIL
Phase 8 Tests: ☐ PASS ☐ FAIL
Phase 9 Tests: ☐ PASS ☐ FAIL
Phase 10 Tests: ☐ PASS ☐ FAIL

Overall: ☐ PASS ☐ FAIL

Issues Found:
_________________________________
_________________________________
_________________________________

Notes:
_________________________________
_________________________________
_________________________________

Approved by: __________
Date: __________
```

---

**Last Updated**: 2026-01-10  
**Purpose**: Comprehensive testing guide for authentication system
