# Token Expiration Fix Documentation

## Problem

Aplikasi memungkinkan user tetap mengakses dashboard meskipun token sudah kadaluwarsa (expired). Token hanya dicek keberadaannya (ada atau tidak ada), tetapi tidak dicek apakah masih valid atau sudah expired.

## Solusi

Menambahkan validasi token expiration di tiga tempat utama:

### 1. **auth.utils.js** - Fungsi Baru untuk Token Expiration Check

Ditambahkan tiga fungsi baru:

#### `decodeToken(token)`

Mendecode JWT token untuk extract payload.

```javascript
const payload = decodeToken(token)
// Returns: { sub: "123", email: "user@email.com", exp: 1234567890, ... }
```

#### `isTokenExpired(token)`

Mengecek apakah token sudah expired dengan membandingkan claim `exp` dengan current time.

```javascript
if (isTokenExpired(token)) {
  console.log('Token sudah kadaluwarsa')
}
```

#### `isAuthenticatedAndValid()`

Menggabungkan cek token existence dan expiration.

```javascript
if (isAuthenticatedAndValid()) {
  // User logged in dan token masih valid
}
```

### 2. **router/index.js** - Router Guard Enhancement

Diupdate `router.beforeEach` untuk check token expiration sebelum navigasi:

```javascript
// Jika token sudah expired, hapus dan redirect ke login
if (token && !isTokenValid) {
  console.warn('⚠️ Token expired - clearing and redirecting to login')
  localStorage.removeItem('token')
  localStorage.removeItem('user_roles')
  localStorage.removeItem('user_info')
  return next({
    path: '/login',
    query: { redirect: to.fullPath },
    replace: true,
  })
}
```

### 3. **App.vue** - Startup Token Validation

Diupdate App.vue untuk check token expiration saat aplikasi pertama kali load:

```javascript
// CEK TOKEN EXPIRED
if (token && isTokenExpired(token)) {
  console.warn('⚠️ Token expired - clearing and redirecting to login')
  localStorage.removeItem('token')
  localStorage.removeItem('user_roles')
  localStorage.removeItem('user_info')
  router.push({
    path: '/login',
    query: { redirect: currentPath },
    replace: true,
  })
  return
}
```

## Alur Kerja

### Skenario 1: Token Kadaluwarsa saat Navigasi

1. User navigasi ke route yang memerlukan autentikasi
2. Router guard mengecek token existence dan expiration
3. Jika expired → clear token dan redirect ke `/login`

### Skenario 2: Token Kadaluwarsa saat App Load

1. User membuka aplikasi dengan token expired di localStorage
2. App.vue check token expiration saat mounted
3. Jika expired → clear token dan redirect ke `/login`

### Skenario 3: Token Kadaluwarsa saat API Request

1. Axios interceptor mengirim token ke API
2. Server return 401 Unauthorized (token invalid/expired)
3. Axios response interceptor clear token dan redirect ke `/login`

## Testing

### Test Case 1: Token Expired di Browser

1. Buka DevTools → Application → localStorage
2. Edit token, ubah `exp` claim ke masa lalu (misal: 1609459200)
3. Refresh aplikasi atau navigasi ke route lain
4. **Expected**: Redirect ke login, token dihapus dari localStorage

### Test Case 2: Check Token Payload

Di browser console, jalankan:

```javascript
import { debugAuthData } from './user/auth.utils'
debugAuthData()
```

Output akan menampilkan:

- Token Payload
- Token Expired status
- User Roles
- Is Authenticated status

### Test Case 3: Expired Token saat Login

1. Login dengan credentials yang benar
2. Di DevTools, ubah token `exp` claim ke masa lalu
3. Navigasi ke dashboard atau route lain
4. **Expected**: Redirect ke login

## Log Messages

### Normal Authentication

```
🚀 App Initialized
🔑 Token exists: true
📍 Current path: /
🔓 Is public path: false
✅ Valid token found, user authenticated
✅ Access granted
```

### Token Expired

```
🚀 App Initialized
🔑 Token exists: true
📍 Current path: /
🔓 Is public path: false
⚠️ Token expired - clearing and redirecting to login
```

### No Token

```
🚀 App Initialized
🔑 Token exists: false
📍 Current path: /
🔓 Is public path: false
⚠️ No token found - redirecting to login
```

## Files Modified

1. **src/user/auth.utils.js**
   - Added: `decodeToken(token)`
   - Added: `isTokenExpired(token)`
   - Added: `isAuthenticatedAndValid()`
   - Updated: `debugAuthData()` - now shows token expiration status

2. **src/router/index.js**
   - Import: `isTokenExpired` from auth.utils
   - Enhanced: `router.beforeEach` guard dengan token expiration check

3. **src/App.vue**
   - Import: `isTokenExpired` from auth.utils
   - Enhanced: `onMounted` hook dengan token expiration check

## Notes

- JWT token structure: `header.payload.signature`
- Payload di-encode menggunakan Base64, bukan encrypted
- Claim `exp` adalah Unix timestamp (seconds since epoch)
- Comparision dilakukan dengan `Math.floor(Date.now() / 1000)` untuk accuracy
