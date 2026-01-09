import axios from 'axios'
import router from '../router'
import { BASE_URL } from '../base.utils.url.ts'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

// Automatically add access_token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  console.log('Token in axios interceptor:', token) // Debugging line

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    console.warn('⚠️ No token found in localStorage')
  }
  return config
})

// Handle 401 errors and redirect to login (tanpa refresh token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - Token invalid or expired
    if (error.response && error.response.status === 401) {
      console.error('❌ 401 Unauthorized - Token invalid or expired')
      localStorage.removeItem('token')
      localStorage.removeItem('user_roles')
      localStorage.removeItem('user_info')
      setTimeout(() => {
        router.push({
          name: 'login',
          query: { redirect: router.currentRoute.value.fullPath },
        })
      }, 0)
      return Promise.reject(error)
    }

    // Handle 403 - Forbidden (no permission)
    if (error.response && error.response.status === 403) {
      console.error('❌ 403 Forbidden - No permission to access this resource')
      setTimeout(() => {
        router.push({ path: '/' })
      }, 0)
      return Promise.reject(error)
    }

    return Promise.reject(error)
  },
)

export default api
