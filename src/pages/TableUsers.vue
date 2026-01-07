<template>
  <div class="p-6">
    <div class="bg-white rounded-lg shadow-lg border border-gray-200">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-gray-900">Daftar Pengguna</h2>
          <router-link
            to="/user/register"
            class="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
          >
            + Tambah Pengguna
          </router-link>
        </div>

        <!-- Search Bar -->
        <div class="flex gap-4 flex-col sm:flex-row">
          <div class="flex-1">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Cari nama atau email..."
              class="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            @click="searchUsers"
            class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            Cari
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="p-6 text-center">
        <p class="text-gray-500">Loading...</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-100 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">No</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nama</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(user, index) in paginatedUsers"
              :key="user.id"
              class="border-b border-gray-200 hover:bg-gray-50 transition"
            >
              <td class="px-6 py-4 text-sm text-gray-700">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ user.name }}</td>
              <td class="px-6 py-4 text-sm text-gray-800">{{ user.email }}</td>
              <td class="px-6 py-4 text-sm">
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="getRoleClass(user.roles?.[0]?.name || 'user')"
                >
                  {{ user.roles?.[0]?.label || 'User' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm">
                <router-link
                  :to="`/user/edit/${user.id}`"
                  class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-xs transition"
                >
                  Edit
                </router-link>
              </td>
            </tr>
            <!-- Empty State -->
            <tr v-if="filteredUsers.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                Tidak ada data pengguna ditemukan
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="!isLoading && filteredUsers.length > 0" class="p-6 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-600">
            Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} hingga
            {{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }} dari
            {{ filteredUsers.length }} data
          </p>

          <div class="flex gap-2">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-lg transition"
            >
              Sebelumnya
            </button>

            <div class="flex gap-1">
              <button
                v-for="page in totalPages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'px-3 py-2 rounded-lg transition',
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100',
                ]"
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-lg transition"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="p-6 text-center">
        <p class="text-red-600">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { BASE_URL } from '../base.utils.url.ts'

const users = ref([])
const searchQuery = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// Get token dari localStorage
const token = localStorage.getItem('token')

// Fetch all users
async function fetchUsers() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await axios.get(`${BASE_URL}users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.data.success || response.data.status) {
      users.value = response.data.data || response.data.users || []
    } else {
      errorMessage.value = 'Gagal memuat data pengguna'
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan saat memuat data'
    console.error('Error fetching users:', error)
  } finally {
    isLoading.value = false
  }
}

// Filter users berdasarkan search query
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value

  const query = searchQuery.value.toLowerCase()
  return users.value.filter(
    (user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
  )
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUsers.value.slice(start, end)
})

// Search handler
function searchUsers() {
  currentPage.value = 1 // Reset ke halaman 1
}

// Pagination handlers
function previousPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Role badge styling
function getRoleClass(role) {
  const roleClasses = {
    admin: 'bg-red-100 text-red-700 border border-red-200',
    officer: 'bg-blue-100 text-blue-700 border border-blue-200',
    user: 'bg-green-100 text-green-700 border border-green-200',
  }
  return roleClasses[role] || roleClasses.user
}

// Load data on mount
onMounted(() => {
  fetchUsers()
})
</script>

<style lang="scss" scoped></style>
