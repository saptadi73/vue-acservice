<template>
  <div class="p-6 space-y-6">
    <!-- Title -->
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Daftar Karyawan AC Lestari</h2>

    <!-- Search Bar -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari karyawan..."
        @input="loadEmployees"
        class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
      <p class="mt-4 text-gray-600">Loading data karyawan...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-800">{{ error }}</p>
    </div>

    <!-- List of Employees -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <!-- Employee Card -->
      <div
        v-for="employee in filteredEmployees"
        :key="employee.id"
        class="max-w-sm bg-white rounded-lg shadow-lg overflow-hidden hover:scale-110 hover:transition transition-transform transform duration-300"
      >
        <img
          :src="getImageUrl(employee.url_foto)"
          :alt="employee.nama"
          class="w-full h-48 object-cover"
          @error="handleImageError"
        />

        <div class="p-4">
          <!-- Name -->
          <h3 class="text-lg font-semibold text-gray-800">{{ employee.nama }}</h3>

          <!-- Department & Position -->
          <p class="text-sm text-gray-600">
            {{ employee.departemen?.nama || '-' }} - {{ employee.position?.name || '-' }}
          </p>

          <!-- Contact Info -->
          <div class="mt-2">
            <p class="text-sm text-gray-600"><strong>Alamat:</strong> {{ employee.alamat }}</p>
            <p class="text-sm text-gray-600"><strong>HP:</strong> {{ employee.hp }}</p>
            <p class="text-sm text-gray-600"><strong>Email:</strong> {{ employee.email }}</p>
          </div>

          <!-- Status -->
          <div class="mt-3">
            <span
              :class="employee.is_active ? 'bg-green-500' : 'bg-red-500'"
              class="inline-block px-3 py-1 text-white text-sm font-semibold rounded-full"
            >
              {{ employee.is_active ? 'Aktif' : 'Tidak Aktif' }}
            </span>

            <!-- Group -->
            <p v-if="employee.group" class="text-sm text-gray-600 mt-2">
              <strong>Group:</strong> {{ employee.group.nama }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !error && filteredEmployees.length === 0" class="text-center py-12">
      <p class="text-gray-500">Tidak ada data karyawan</p>
    </div>

    <!-- Modal for Attendance -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 class="text-xl font-semibold mb-4">Konfirmasi Kehadiran</h3>
        <div class="mb-4">
          <label class="block text-sm text-gray-700">Pilih Status Kehadiran</label>
          <select
            v-model="attendanceStatus"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="Tepat Waktu">Tepat Waktu</option>
            <option value="Terlambat">Terlambat</option>
          </select>
        </div>

        <!-- Optional Description for Late or Leave -->
        <div v-if="attendanceStatus === 'Terlambat'" class="mb-4">
          <label for="description" class="block text-sm text-gray-700">Keterangan</label>
          <textarea
            v-model="lateDescription"
            id="description"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Masukkan keterangan (opsional)"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-4">
          <button
            @click="closeModal"
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            @click="markAttendance"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { BASE_URL } from '../base.utils.url.ts'

export default {
  data() {
    return {
      searchQuery: '',
      loading: false,
      error: null,
      isModalOpen: false,
      attendanceStatus: 'Tepat Waktu',
      lateDescription: '',
      selectedEmployee: null,
      employees: [],
    }
  },
  mounted() {
    this.loadEmployees()
  },
  computed: {
    // Filtered employees based on search query
    filteredEmployees() {
      if (!this.searchQuery) {
        return this.employees
      }

      return this.employees.filter((employee) => {
        const query = this.searchQuery.toLowerCase()
        return (
          employee.nama?.toLowerCase().includes(query) ||
          employee.alamat?.toLowerCase().includes(query) ||
          employee.departemen?.nama?.toLowerCase().includes(query) ||
          employee.position?.name?.toLowerCase().includes(query) ||
          employee.email?.toLowerCase().includes(query) ||
          employee.hp?.toLowerCase().includes(query)
        )
      })
    },
  },
  methods: {
    async loadEmployees() {
      this.loading = true
      this.error = null

      try {
        const params = {}
        if (this.searchQuery) {
          params.search = this.searchQuery
        }

        const token = localStorage.getItem('token')
        const response = await axios.get(`${BASE_URL}api/pegawai`, {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log('Employees response:', response.data)

        // API returns status as boolean (true) not string ('success')
        // Data is paginated: response.data.data.data contains the array
        if (response.data && response.data.status === true) {
          this.employees = response.data.data.data || response.data.data

          // Debug: Log sample employee data
          if (this.employees.length > 0) {
            console.log('✅ Sample employee data:', this.employees[0])
          }
        }
      } catch (err) {
        console.error('Error loading employees:', err)
        this.error = 'Gagal memuat data karyawan. ' + (err.response?.data?.message || err.message)
        this.employees = []
      } finally {
        this.loading = false
      }
    },
    getImageUrl(path) {
      if (!path) return '/default-avatar.png'
      // If path already includes http/https, return as is
      if (path.startsWith('http://') || path.startsWith('https://')) {
        return path
      }
      // Prepend BASE_URL for relative paths
      return `${BASE_URL}${path}`
    },
    handleImageError(event) {
      // Fallback to default avatar if image fails to load
      event.target.src = '/default-avatar.png'
    },
    openModal(employee) {
      this.selectedEmployee = employee
      this.isModalOpen = true
    },
    closeModal() {
      this.isModalOpen = false
      this.lateDescription = ''
      this.attendanceStatus = 'Tepat Waktu'
    },
    markAttendance() {
      if (this.selectedEmployee) {
        this.selectedEmployee.status = this.attendanceStatus
        if (this.attendanceStatus === 'Terlambat' && this.lateDescription) {
          this.selectedEmployee.description = this.lateDescription
        }
        this.closeModal()
      }
    },
  },
}
</script>

<style scoped>
/* Modal Styling */
.fixed {
  z-index: 9999;
}

textarea {
  resize: none;
}

.card {
  transition: transform 0.3s ease-in-out;
}

.card:hover {
  transform: translateY(-10px);
}

.card img {
  border-bottom: 1px solid #ddd;
}
</style>
