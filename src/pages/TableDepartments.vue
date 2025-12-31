<template>
  <div class="p-6 space-y-6">
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-semibold text-gray-800">Daftar Departemen</h2>
        <p class="text-gray-600 text-sm mt-1">Kelola departemen karyawan</p>
      </div>
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
      >
        <span>➕</span> Tambah Departemen
      </button>
    </div>

    <!-- Filter Section -->
    <div class="bg-white rounded-lg shadow-sm p-4">
      <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
        <!-- Show Employee Count -->
        <div class="flex items-center">
          <label class="flex items-center">
            <input
              v-model="showEmployeeCount"
              type="checkbox"
              @change="loadDepartments"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">Tampilkan jumlah karyawan</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
      <p class="mt-4 text-gray-600">Loading data departemen...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-800">{{ error }}</p>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nama Departemen
              </th>
              <th
                v-if="showEmployeeCount"
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Jumlah Karyawan
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="dept in departments" :key="dept.id" class="hover:bg-gray-50">
              <!-- Name -->
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ dept.nama }}</div>
              </td>

              <!-- Employee Count -->
              <td v-if="showEmployeeCount" class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
                >
                  {{ dept.jumlah_karyawan || 0 }} orang
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <button
                  @click="editDepartment(dept)"
                  class="text-green-600 hover:text-green-900 mr-3"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  @click="confirmDelete(dept)"
                  class="text-red-600 hover:text-red-900"
                  title="Hapus"
                >
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="departments.length === 0" class="text-center py-12">
        <p class="text-gray-500">Tidak ada data departemen</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <!-- Modal Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">
            {{ modalMode === 'create' ? '➕ Tambah Departemen' : '✏️ Edit Departemen' }}
          </h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
        </div>

        <!-- Form -->
        <form @submit.prevent="saveDepartment" class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"> Nama Departemen * </label>
            <input
              v-model="formData.name"
              type="text"
              required
              placeholder="Contoh: Teknisi, Finance, HRD, Sales/Marketing"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 pt-4 border-t">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {{ modalMode === 'create' ? 'Simpan' : 'Update' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { BASE_URL } from '../base.utils.url'

export default {
  name: 'TableDepartments',
  data() {
    return {
      departments: [],
      loading: false,
      error: null,
      showModal: false,
      modalMode: 'create', // 'create' or 'edit'
      selectedDepartment: null,
      filterStatus: null,
      showEmployeeCount: true,
      formData: {
        name: '',
      },
    }
  },
  mounted() {
    this.loadDepartments()
  },
  methods: {
    async loadDepartments() {
      this.loading = true
      this.error = null

      try {
        // Use summary/count endpoint to get departments with employee count
        const response = await axios.get(`${BASE_URL}api/departments/summary/count`)

        if (response.data.status === true) {
          this.departments = response.data.data || []

          console.log('✅ Departments loaded:', this.departments.length, 'items')
        } else {
          this.error = response.data.message || 'Gagal memuat data departemen'
        }
      } catch (err) {
        console.error('❌ Error loading departments:', err)
        this.error =
          err.response?.data?.message || 'Gagal memuat data departemen. Silakan coba lagi.'
      } finally {
        this.loading = false
      }
    },
    openCreateModal() {
      this.modalMode = 'create'
      this.formData = {
        name: '',
      }
      this.showModal = true
    },
    editDepartment(dept) {
      this.modalMode = 'edit'
      this.selectedDepartment = dept
      this.formData = {
        name: dept.nama,
      }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.selectedDepartment = null
    },
    async saveDepartment() {
      try {
        const payload = {
          nama: this.formData.name,
        }

        let response
        if (this.modalMode === 'create') {
          response = await axios.post(`${BASE_URL}api/departments`, payload)
        } else {
          response = await axios.post(`${BASE_URL}api/departments/${this.selectedDepartment.id}`, {
            ...payload,
            _method: 'PUT',
          })
        }

        if (response.data.status === true) {
          alert(
            `✅ Departemen berhasil ${this.modalMode === 'create' ? 'ditambahkan' : 'diupdate'}!\n\nNama: ${this.formData.name}`,
          )
          this.closeModal()
          this.loadDepartments()
        } else {
          alert('❌ ' + (response.data.message || 'Gagal menyimpan data departemen'))
        }
      } catch (err) {
        console.error('❌ Error saving department:', err)
        alert('❌ Gagal menyimpan data departemen: ' + (err.response?.data?.message || err.message))
      }
    },
    confirmDelete(dept) {
      if (confirm(`Yakin ingin menghapus departemen "${dept.nama}"?`)) {
        this.deleteDepartment(dept.id)
      }
    },
    async deleteDepartment(id) {
      try {
        const response = await axios.delete(`${BASE_URL}api/departments/${id}`)

        if (response.data.status === true) {
          alert('✅ Departemen berhasil dihapus')
          this.loadDepartments()
        } else {
          alert('❌ ' + (response.data.message || 'Gagal menghapus departemen'))
        }
      } catch (err) {
        console.error('❌ Error deleting department:', err)
        alert('❌ Gagal menghapus departemen: ' + (err.response?.data?.message || err.message))
      }
    },
  },
}
</script>
