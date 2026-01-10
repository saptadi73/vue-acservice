// src/user/auth.utils.js
// Authentication utilities for token and user management

/**
 * Check if user has valid token
 * @returns {boolean} true if token exists
 */
export function isAuthenticated() {
  const token = localStorage.getItem('token')
  return !!token
}

/**
 * Get current token from localStorage
 * @returns {string|null} token or null
 */
export function getToken() {
  return localStorage.getItem('token')
}

/**
 * Save token to localStorage
 * @param {string} token - JWT token
 */
export function saveToken(token) {
  if (token) {
    // Remove 'Bearer ' prefix if present
    const cleanToken = token.replace('Bearer ', '')
    localStorage.setItem('token', cleanToken)
    console.log('✅ Token saved successfully')
  }
}

/**
 * Remove token from localStorage
 */
export function removeToken() {
  localStorage.removeItem('token')
  localStorage.removeItem('user_roles')
  localStorage.removeItem('user_info')
  console.log('✅ Token and user data cleared')
}

/**
 * Save user roles to localStorage
 * @param {array} roles - Array of user roles
 */
export function saveUserRoles(roles) {
  if (roles && Array.isArray(roles)) {
    localStorage.setItem('user_roles', JSON.stringify(roles))
    console.log('✅ User roles saved')
  }
}

/**
 * Get user roles from localStorage
 * @returns {array} array of user roles or empty array
 */
export function getUserRoles() {
  const rolesJson = localStorage.getItem('user_roles') || '[]'
  return JSON.parse(rolesJson)
}

/**
 * Save user info to localStorage
 * @param {object} userInfo - User information object
 */
export function saveUserInfo(userInfo) {
  if (userInfo) {
    localStorage.setItem('user_info', JSON.stringify(userInfo))
    console.log('✅ User info saved')
  }
}

/**
 * Get user info from localStorage
 * @returns {object} user info or null
 */
export function getUserInfo() {
  const infoJson = localStorage.getItem('user_info')
  return infoJson ? JSON.parse(infoJson) : null
}

/**
 * Check if user has specific role
 * @param {string|array} requiredRoles - Single role or array of roles to check
 * @returns {boolean} true if user has one of the required roles
 */
export function hasRole(requiredRoles) {
  const userRoles = getUserRoles()

  // If no roles required, allow access
  if (!requiredRoles || requiredRoles.length === 0) {
    return true
  }

  // Convert single role to array
  const rolesToCheck = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]

  // Check if user has any of the required roles
  return rolesToCheck.some((requiredRole) =>
    userRoles.some((userRole) => {
      const roleName = (userRole.name || '').toLowerCase()
      const roleLabel = (userRole.label || '').toLowerCase()
      const required = (requiredRole || '').toLowerCase()

      return roleName === required || roleLabel === required
    }),
  )
}

/**
 * Logout user - clear all data and redirect to login
 * @param {object} router - Vue router instance
 */
export function logout(router) {
  removeToken()
  console.log('🚀 User logged out')
  router.push({ path: '/login', replace: true })
}

/**
 * Decode JWT token to extract payload
 * @param {string} token - JWT token
 * @returns {object|null} decoded payload or null if invalid
 */
export function decodeToken(token) {
  try {
    if (!token) return null

    // Split token into parts
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.error('❌ Invalid token format')
      return null
    }

    // Decode the payload (second part)
    const payload = parts[1]
    const decoded = JSON.parse(atob(payload))
    return decoded
  } catch (error) {
    console.error('❌ Error decoding token:', error)
    return null
  }
}

/**
 * Check if token is expired
 * @param {string} token - JWT token (optional, will use localStorage if not provided)
 * @returns {boolean} true if token is expired, false if valid
 */
export function isTokenExpired(token) {
  const tokenToCheck = token || getToken()
  if (!tokenToCheck) {
    return true // No token is considered expired
  }

  const decoded = decodeToken(tokenToCheck)
  if (!decoded || !decoded.exp) {
    console.warn('⚠️ Cannot determine token expiration - no exp claim found')
    return true // Cannot verify, treat as expired
  }

  // Convert to milliseconds and compare with current time
  const currentTime = Math.floor(Date.now() / 1000)
  const isExpired = decoded.exp < currentTime

  if (isExpired) {
    console.warn('⚠️ Token expired at:', new Date(decoded.exp * 1000))
    console.warn('⏰ Current time:', new Date(currentTime * 1000))
  }

  return isExpired
}

/**
 * Check if user is authenticated AND token is not expired
 * @returns {boolean} true if token exists and is valid (not expired)
 */
export function isAuthenticatedAndValid() {
  const token = getToken()
  if (!token) {
    return false
  }
  return !isTokenExpired(token)
}

/**
 * Debug: Log all stored auth data
 */
export function debugAuthData() {
  console.log('═══════════════════════════════════════')
  console.log('🔐 Authentication Data Debug')
  console.log('═══════════════════════════════════════')
  const token = getToken()
  console.log('Token:', token ? '✅ Present' : '❌ Missing')
  if (token) {
    const decoded = decodeToken(token)
    console.log('Token Payload:', decoded)
    console.log('Token Expired:', isTokenExpired(token) ? '⚠️ Yes' : '✅ No')
  }
  console.log('User Roles:', getUserRoles())
  console.log('User Info:', getUserInfo())
  console.log('Is Authenticated:', isAuthenticatedAndValid() ? '✅ Yes' : '❌ No')
  console.log('═══════════════════════════════════════')
}
