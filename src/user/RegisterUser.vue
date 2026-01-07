<template>
  <section
    class="bg-gray-100 min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-md">
      <!-- Register Card -->
      <div class="bg-white rounded-lg shadow-xl border border-gray-200 p-8">
        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- Name Input -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              v-model="user.name"
              placeholder="Nama lengkap Anda"
              required
              class="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <!-- Email Input -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2"> Email </label>
            <input
              type="email"
              id="email"
              v-model="user.email"
              placeholder="nama@perusahaan.com"
              required
              class="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              v-model="user.password"
              placeholder="••••••••"
              required
              class="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <p class="text-gray-500 text-xs mt-1">Minimal 8 karakter</p>
          </div>

          <!-- Confirm Password Input -->
          <div>
            <label for="confirm_password" class="block text-sm font-medium text-gray-700 mb-2">
              Konfirmasi Password
            </label>
            <input
              type="password"
              id="confirm_password"
              v-model="user.confirm_password"
              placeholder="••••••••"
              required
              class="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <!-- Role Selection -->
          <div>
            <label for="role_id" class="block text-sm font-medium text-gray-700 mb-2">
              Role Pengguna
            </label>
            <select
              id="role_id"
              v-model="user.role_id"
              required
              class="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none cursor-pointer"
            >
              <option value="" disabled>Pilih Role</option>
              <option v-for="role in roles" :key="role.id" :value="role.id">
                {{ role.name }}
              </option>
            </select>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-700 text-sm">{{ errorMessage }}</p>
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-green-700 text-sm">{{ successMessage }}</p>
          </div>

          <!-- Register Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span v-if="!isLoading">Daftar Sekarang</span>
            <span v-else>Mendaftar...</span>
          </button>

          <!-- Divider -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Sudah punya akun?</span>
            </div>
          </div>

          <!-- Login Link -->
          <div class="text-center">
            <router-link
              to="/login"
              class="inline-block text-blue-600 hover:text-blue-700 font-medium transition"
            >
              Masuk ke akun Anda
            </router-link>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <p class="text-center text-gray-500 text-xs mt-6">
        © 2026 AC Lestari. Semua hak dilindungi.
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { BASE_URL } from '../base.utils.url.ts'

const router = useRouter()

const user = ref({
  name: '',
  email: '',
  password: '',
  confirm_password: '',
  role_id: '',
})

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const roles = ref([]) // Add roles array

// Fetch roles from API
async function fetchRoles() {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${BASE_URL}roles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.data.success || response.data.status) {
      roles.value = response.data.data || response.data.roles || []
    }
  } catch (error) {
    console.error('Error fetching roles:', error)
  }
}

async function handleRegister() {
  // Validation
  if (
    !user.value.name ||
    !user.value.email ||
    !user.value.password ||
    !user.value.confirm_password ||
    !user.value.role_id
  ) {
    errorMessage.value = 'Semua field harus diisi'
    return
  }

  if (user.value.password.length < 8) {
    errorMessage.value = 'Password minimal 8 karakter'
    return
  }

  if (user.value.password !== user.value.confirm_password) {
    errorMessage.value = 'Password tidak sesuai'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await axios.post(`${BASE_URL}auth/register`, {
      name: user.value.name,
      email: user.value.email,
      password: user.value.password,
      role_id: user.value.role_id,
    })

    console.log('Register response:', response.data) // Debug log

    if (response.data.success) {
      successMessage.value = 'Pendaftaran berhasil! Redirecting...'
      console.log('Registration successful, redirecting...') // Debug log
      // Redirect immediately
      router.push('/main/users')
      return
    } else {
      errorMessage.value = response.data.message || 'Pendaftaran gagal'
    }
  } catch (error) {
    console.error('Register error:', error) // Debug log
    errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan. Silahkan coba lagi.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchRoles()
})
</script>

<style lang="scss" scoped></style>
