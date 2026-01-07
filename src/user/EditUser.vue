<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-200 p-8">
      <!-- Header -->
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Edit Pengguna</h1>
        <p class="text-gray-600 mt-2">Ubah data pengguna</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-8">
        <p class="text-gray-500">Loading data pengguna...</p>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="submitForm" class="space-y-4">
        <!-- Name Field -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Masukkan nama lengkap"
            class="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <span v-if="errors.name" class="text-red-500 text-sm mt-1 block">{{ errors.name }}</span>
        </div>

        <!-- Email Field -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="Masukkan email"
            class="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <span v-if="errors.email" class="text-red-500 text-sm mt-1 block">{{
            errors.email
          }}</span>
        </div>

        <!-- Password Field -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Password Baru (Kosongkan jika tidak ingin mengubah)</label
          >
          <input
            v-model="form.password"
            type="password"
            placeholder="Masukkan password baru (opsional)"
            class="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span v-if="errors.password" class="text-red-500 text-sm mt-1 block">{{
            errors.password
          }}</span>
        </div>

        <!-- Confirm Password Field -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Konfirmasi Password Baru</label
          >
          <input
            v-model="form.confirmPassword"
            type="password"
            placeholder="Konfirmasi password baru"
            class="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1 block">{{
            errors.confirmPassword
          }}</span>
        </div>

        <!-- Role Field -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            v-model="form.role_id"
            class="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Pilih Role</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
          <span v-if="errors.role_id" class="text-red-500 text-sm mt-1 block">{{
            errors.role_id
          }}</span>
        </div>

        <!-- Error Alert -->
        <div
          v-if="errorMessage"
          class="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
        >
          {{ errorMessage }}
        </div>

        <!-- Success Alert -->
        <div
          v-if="successMessage"
          class="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm"
        >
          {{ successMessage }}
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-4">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
          >
            {{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
          <router-link
            to="/main/users"
            class="flex-1 px-4 py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition text-center"
          >
            Batal
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { BASE_URL } from '../base.utils.url.ts'

const route = useRoute()
const router = useRouter()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role_id: '',
})

const errors = ref({})
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(true)
const isSubmitting = ref(false)
const roles = ref([]) // Add roles array
const userId = route.params.id

const token = localStorage.getItem('token')

// Fetch roles
async function fetchRoles() {
  try {
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

// Fetch user data
async function fetchUser() {
  try {
    const response = await axios.get(`${BASE_URL}users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.data.success || response.data.status) {
      const user = response.data.data || response.data.user
      form.value.name = user.name
      form.value.email = user.email
      form.value.role_id = user.role_id || user.roles?.[0]?.id || ''
    } else {
      errorMessage.value = 'Gagal memuat data pengguna'
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan saat memuat data'
    console.error('Error fetching user:', error)
  } finally {
    isLoading.value = false
  }
}

// Validate form
function validateForm() {
  errors.value = {}

  if (!form.value.name.trim()) {
    errors.value.name = 'Nama tidak boleh kosong'
  }

  if (!form.value.email.trim()) {
    errors.value.email = 'Email tidak boleh kosong'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Format email tidak valid'
  }

  // Only validate password if provided
  if (form.value.password) {
    if (form.value.password.length < 8) {
      errors.value.password = 'Password minimal 8 karakter'
    }

    if (form.value.password !== form.value.confirmPassword) {
      errors.value.confirmPassword = 'Konfirmasi password tidak cocok'
    }
  }

  if (!form.value.role_id) {
    errors.value.role_id = 'Role tidak boleh kosong'
  }

  return Object.keys(errors.value).length === 0
}

// Submit form
async function submitForm() {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const updateData = {
      name: form.value.name,
      email: form.value.email,
      role_id: form.value.role_id,
    }

    // Only include password if provided
    if (form.value.password) {
      updateData.password = form.value.password
    }

    const response = await axios.put(`${BASE_URL}users/${userId}`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.data.success || response.data.status) {
      successMessage.value = 'Data pengguna berhasil diperbarui'

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/main/users')
      }, 2000)
    } else {
      errorMessage.value = response.data.message || 'Gagal memperbarui data pengguna'
    }
  } catch (error) {
    if (error.response?.data?.errors) {
      // Server validation errors
      const serverErrors = error.response.data.errors
      Object.keys(serverErrors).forEach((key) => {
        errors.value[key] = serverErrors[key][0]
      })
      errorMessage.value = 'Terdapat kesalahan pada form. Periksa kembali data Anda.'
    } else {
      errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data'
    }
    console.error('Error updating user:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Load data on mount
onMounted(() => {
  fetchRoles()
  fetchUser()
})
</script>

<style lang="scss" scoped></style>
