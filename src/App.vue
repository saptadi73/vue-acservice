<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { isTokenExpired } from './user/auth.utils'

const router = useRouter()

onMounted(() => {
  // 🔐 Check token on app startup
  const token = localStorage.getItem('token')
  const currentPath = router.currentRoute.value.path
  const publicPaths = ['/login', '/register']

  console.log('🚀 App Initialized')
  console.log('🔑 Token exists:', !!token)
  console.log('📍 Current path:', currentPath)
  console.log('🔓 Is public path:', publicPaths.includes(currentPath))

  // ✅ CEK TOKEN EXPIRED
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

  // Jika user membuka app tanpa token dan bukan di halaman public
  if (!token && !publicPaths.includes(currentPath)) {
    console.warn('⚠️ No token found - redirecting to login')
    router.push({
      path: '/login',
      query: { redirect: currentPath },
      replace: true,
    })
    return
  }

  // Optional: Validate token format
  if (token) {
    if (token.startsWith('Bearer ')) {
      console.warn('⚠️ Token format incorrect - contains "Bearer" prefix')
      localStorage.setItem('token', token.replace('Bearer ', ''))
    }
    console.log('✅ Valid token found, user authenticated')
  }
})
</script>

<template>
  <RouterView />
</template>
