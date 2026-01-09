# Authentication Flow Diagrams

## 1. App Startup Flow

```
┌─────────────────────────────────────────────────────────┐
│                    User Opens App                       │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
         ┌─────────────────────────────┐
         │  src/App.vue onMounted()    │
         │                             │
         │  Check: Token exists?       │
         └────────┬────────────────────┘
                  │
        ┌─────────┴──────────┐
        │                    │
        ▼                    ▼
    ✅ YES                ❌ NO
        │                    │
        ├─ Check path        ├─ Is public page?
        │  private?          │  (/login, /register)
        │  │                 │
        │  YES: OK           YES: OK
        │  │                 │
        │  NO: Error         NO: Redirect
        │                    │
        ▼                    ▼
   ✅ Access App      ⚠️ Go to /login

┌─────────────────────────────────────────────┐
│  RESULT:                                    │
│  ✅ Has token & private page: Access app   │
│  ✅ Has token & public page: Access app    │
│  ✅ No token & public page: Access login   │
│  ⚠️ No token & private page: Redirect      │
└─────────────────────────────────────────────┘
```

---

## 2. Route Navigation Flow

```
┌──────────────────────────────────────────────┐
│     User Clicks Link / Navigates to Route    │
└───────────────────┬──────────────────────────┘
                    │
                    ▼
    ┌────────────────────────────────┐
    │   router.beforeEach() runs     │
    │                                │
    │   Get token from localStorage  │
    └─────────┬──────────────────────┘
              │
              ▼
    ┌────────────────────────────────┐
    │   Check: Token exists?         │
    └────────┬──────────────────────┘
             │
      ┌──────┴──────┐
      │             │
     ✅             ❌
      │             │
      ▼             ▼
   Has Token    No Token
      │             │
      ├─Check        └─Check Path
      │  require     │
      │  Role?       Is public?
      │  │           │
    YES NO YES NO   YES    NO
      │  │  │  │     │      │
      ▼  ▼  ▼  ▼     ▼      ▼
    Allow Allow Allow Deny  Deny
      │     │    │     │     │
      ▼     ▼    ▼     ▼     ▼
    Access Access Access ERROR → /login
      Route Route  Route

┌─────────────────────────────────────────────┐
│  DECISION TREE:                             │
│  Token + No Role Required = ✅ ALLOW        │
│  Token + Has Required Role = ✅ ALLOW       │
│  Token + No Required Role = ❌ DENY → /     │
│  No Token + Private Route = ❌ DENY → /login│
│  No Token + Public Route = ✅ ALLOW         │
└─────────────────────────────────────────────┘
```

---

## 3. API Request Flow

```
┌──────────────────────────────────────────────────┐
│          Component Makes API Request             │
│                                                  │
│  api.get('/wo/penyewaan/123')                   │
└────────────────┬─────────────────────────────────┘
                 │
                 ▼
    ┌──────────────────────────────┐
    │  axios.interceptor.request   │
    │                              │
    │  Get token from localStorage │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │  Check: Token exists?        │
    └────┬───────────────────┬─────┘
         │                   │
        ✅                  ❌
        YES                 NO
         │                   │
         ▼                   ▼
    Add Header        Continue
    Authorization:    without header
    Bearer {token}
         │
         │
         ▼
    ┌──────────────────────────────┐
    │  Send Request to Backend     │
    │  POST /wo/penyewaan/123      │
    │  Headers: Authorization: ... │
    └────┬───────────────────┬──────┘
         │                   │
        ✅                  ❌
      200 OK            401/403
         │              Error
         │                   │
         ▼                   ▼
    ┌──────────────┐  ┌──────────────┐
    │ axios.       │  │ axios.       │
    │ interceptor  │  │ interceptor  │
    │ .response    │  │ .response    │
    │             │  │              │
    │ Return      │  │ If 401:      │
    │ Success     │  │ Clear token  │
    │ Response    │  │ Redirect /   │
    │             │  │ login        │
    └──────┬───────┘  │              │
           │          │ If 403:      │
           │          │ Redirect /   │
           │          │ home         │
           ▼          └──────┬───────┘
    ┌──────────────┐        │
    │ Component    │        ▼
    │ receives     │   ┌─────────────┐
    │ data ✅      │   │ Auto        │
    └──────────────┘   │ Redirect    │
                       └─────────────┘
```

---

## 4. Login & Token Save Flow

```
┌──────────────────────────────────────────────┐
│       User Enters Credentials & Logs In      │
│    Email: user@example.com                   │
│    Password: ****                            │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
    ┌──────────────────────────────┐
    │  POST /login                 │
    │  {email, password}           │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │  Backend Response:           │
    │  {                           │
    │    token: "eyJhbG...",       │
    │    roles: [...],             │
    │    user: {...}               │
    │  }                           │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │  Save to localStorage:       │
    │                              │
    │  token                       │
    │  user_roles                  │
    │  user_info                   │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │  Check: Token exists?        │
    │  YES ✅                      │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │  Redirect to Dashboard       │
    │  /main/dashboard             │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │  ✅ User is logged in        │
    │  ✅ Can access protected     │
    │     routes                   │
    │  ✅ API requests have token  │
    └──────────────────────────────┘
```

---

## 5. Logout Flow

```
┌──────────────────────────────────────────────┐
│     User Clicks Logout Button                │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
    ┌──────────────────────────────┐
    │  logout(router) called       │
    │  from auth.utils.js          │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │  removeToken()               │
    │                              │
    │  localStorage.removeItem()   │
    │  - token                     │
    │  - user_roles                │
    │  - user_info                 │
    │  - all auth data             │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │  router.push('/login')       │
    │  with replace: true          │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │  ✅ User logged out          │
    │  ✅ All data cleared         │
    │  ✅ Redirected to login      │
    └──────────────────────────────┘
```

---

## 6. Role-Based Access Control Flow

```
┌──────────────────────────────────────────────┐
│  User Tries to Access /admin Route           │
│                                              │
│  Route Definition:                           │
│  {                                           │
│    path: 'admin',                            │
│    meta: {                                   │
│      requiresRole: ['admin']                 │
│    }                                         │
│  }                                           │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
    ┌──────────────────────────────┐
    │  router.beforeEach() runs    │
    │                              │
    │  Check: requiresRole in meta?│
    └────┬───────────────────┬─────┘
         │                   │
        YES                  NO
         │                   │
         ▼                   ▼
    ┌──────────────┐  ┌──────────────┐
    │  Get user    │  │  Access      │
    │  roles from  │  │  Granted     │
    │  localStorage│  │  ✅ Allow    │
    └────┬─────────┘  └──────────────┘
         │
         ▼
    ┌──────────────────────────────┐
    │  Check: Has required role?   │
    └────┬───────────────────┬─────┘
         │                   │
        YES                  NO
         │                   │
         ▼                   ▼
    ┌──────────────┐  ┌──────────────┐
    │  Access      │  │  Access      │
    │  Granted     │  │  Denied      │
    │  ✅ Allow    │  │  ❌ Redirect │
    │              │  │  to /home    │
    └──────────────┘  └──────────────┘
```

---

## 7. Utility Functions Usage Flow

```
┌──────────────────────────────────────────────────┐
│  Component Needs to Check Auth Status           │
└────────────────┬─────────────────────────────────┘
                 │
        ┌────────┴──────────┐
        │                   │
        ▼                   ▼
    Check if        Check user
    authenticated   role
        │                   │
        ▼                   ▼
    import {          import {
      isAuthenticated,  hasRole
      getToken        } from
    } from            '@/user/
    '@/user/          auth.utils'
    auth.utils'
        │                   │
        ▼                   ▼
    if (                if (
      isAuthenticated()  hasRole('admin')
    ) {                ) {
      // Show feature   // Show admin
    }                  }

        │                   │
        └────────┬──────────┘
                 │
                 ▼
    ┌──────────────────────────┐
    │  Easy auth checks in     │
    │  components ✅           │
    │                          │
    │  Show/hide features      │
    │  based on auth status    │
    │  and roles               │
    └──────────────────────────┘
```

---

## 8. Error Recovery Flow

```
┌──────────────────────────────────────────────┐
│   API Returns 401 Unauthorized Error         │
│                                              │
│   Reason: Token expired or invalid           │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
    ┌──────────────────────────────┐
    │  axios.interceptor catches   │
    │  error.response.status = 401 │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │  Auto Actions:               │
    │  1. Log error to console     │
    │  2. Clear token              │
    │  3. Clear user_roles         │
    │  4. Clear user_info          │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │  Redirect to /login          │
    │  with redirect query         │
    │  ?redirect=/original/page    │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │  User sees login page        │
    │  with message:               │
    │  "Session expired, login"    │
    │  again"                      │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │  User logs in again          │
    │  Gets new token              │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │  Redirects back to:          │
    │  Original page (from query)  │
    │                              │
    │  ✅ User back where they     │
    │     wanted to go             │
    └──────────────────────────────┘
```

---

## Summary Legend

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Action    │    │   Decision  │    │  Component  │
└─────────────┘    └─────────────┘    └─────────────┘

┌─────────────┐
│   Result    │
│  ✅ Allow   │
│  ❌ Deny    │
│  ⚠️ Warning │
└─────────────┘

────────────>  Process flow direction
```

---

**Last Updated**: 2026-01-10  
**For**: Understanding Authentication System Flow
