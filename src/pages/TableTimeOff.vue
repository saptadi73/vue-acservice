<template>
  <div class="p-6 space-y-6">
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-semibold text-gray-800">Manajemen Cuti & Ijin</h2>
        <p class="text-gray-600 text-sm mt-1">Kelola pengajuan cuti dan izin karyawan</p>
      </div>
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
      >
        <span>➕</span> Ajukan Cuti/Ijin
      </button>
    </div>

    <!-- Filter Section -->
    <div class="bg-white rounded-lg shadow-sm p-4">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <!-- Employee Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Karyawan</label>
          <select
            v-model="filters.employee_id"
            @change="loadTimeOffs"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option :value="null">Semua Karyawan</option>
            <option v-for="emp in employees" :key="emp.id" :value="emp.id">
              {{ emp.nama }}
            </option>
          </select>
        </div>

        <!-- Type Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Cuti</label>
          <select
            v-model="filters.type"
            @change="loadTimeOffs"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option :value="null">Semua Jenis</option>
            <option value="annual_leave">Cuti Tahunan</option>
            <option value="sick_leave">Cuti Sakit</option>
            <option value="unpaid_leave">Cuti Tanpa Gaji</option>
            <option value="maternity_leave">Cuti Melahirkan</option>
            <option value="paternity_leave">Cuti Ayah</option>
            <option value="other">Lainnya</option>
          </select>
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filters.status"
            @change="loadTimeOffs"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option :value="null">Semua Status</option>
            <option value="pending">Menunggu Persetujuan</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>

        <!-- Start Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
          <input
            v-model="filters.start_date"
            type="date"
            @change="loadTimeOffs"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- End Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
          <input
            v-model="filters.end_date"
            type="date"
            @change="loadTimeOffs"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
      <p class="mt-4 text-gray-600">Loading data cuti...</p>
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
                Karyawan
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Jenis Cuti
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tanggal Mulai
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tanggal Selesai
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total Hari
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Alasan
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="timeoff in timeoffs" :key="timeoff.id" class="hover:bg-gray-50">
              <!-- Employee Name -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ timeoff.employee?.nama || timeoff.employee?.name || '-' }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ timeoff.employee?.email || '-' }}
                </div>
              </td>

              <!-- Type -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getTypeClass(timeoff.type)"
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ getTypeLabel(timeoff.type) }}
                </span>
              </td>

              <!-- Start Date -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(timeoff.start_date) }}</div>
              </td>

              <!-- End Date -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(timeoff.end_date) }}</div>
              </td>

              <!-- Total Days -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span class="text-sm font-semibold text-gray-900">
                  {{ timeoff.total_days }} hari
                </span>
              </td>

              <!-- Reason -->
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-xs truncate" :title="timeoff.reason">
                  {{ timeoff.reason || '-' }}
                </div>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  :class="getStatusClass(timeoff.status)"
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ getStatusLabel(timeoff.status) }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <button
                  @click="viewDetail(timeoff)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                  title="Lihat Detail"
                >
                  👁️
                </button>
                <button
                  v-if="timeoff.status === 'pending'"
                  @click="openApproveModal(timeoff)"
                  class="text-green-600 hover:text-green-900 mr-3"
                  title="Setujui"
                >
                  ✓
                </button>
                <button
                  v-if="timeoff.status === 'pending'"
                  @click="openRejectModal(timeoff)"
                  class="text-red-600 hover:text-red-900 mr-3"
                  title="Tolak"
                >
                  ✗
                </button>
                <button
                  v-if="timeoff.status === 'pending' || timeoff.status === 'approved'"
                  @click="confirmCancel(timeoff)"
                  class="text-orange-600 hover:text-orange-900 mr-3"
                  title="Batalkan"
                >
                  🚫
                </button>
                <button
                  v-if="timeoff.status === 'pending'"
                  @click="editTimeOff(timeoff)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  @click="confirmDelete(timeoff)"
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
      <div v-if="timeoffs.length === 0" class="text-center py-12">
        <p class="text-gray-500">Tidak ada data cuti/ijin</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">
            {{ modalMode === 'create' ? '➕ Ajukan Cuti/Ijin Baru' : '✏️ Edit Pengajuan Cuti' }}
          </h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
        </div>

        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Karyawan *</label>
            <select
              v-model="form.employee_id"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option :value="null">Pilih Karyawan</option>
              <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                {{ emp.nama }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Cuti *</label>
            <select
              v-model="form.type"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="annual_leave">Cuti Tahunan</option>
              <option value="sick_leave">Cuti Sakit</option>
              <option value="unpaid_leave">Cuti Tanpa Gaji</option>
              <option value="maternity_leave">Cuti Melahirkan</option>
              <option value="paternity_leave">Cuti Ayah</option>
              <option value="other">Lainnya</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai *</label>
              <input
                v-model="form.start_date"
                type="date"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Selesai *</label>
              <input
                v-model="form.end_date"
                type="date"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Alasan *</label>
            <textarea
              v-model="form.reason"
              rows="4"
              required
              placeholder="Jelaskan alasan pengajuan cuti..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

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
              {{ modalMode === 'create' ? 'Ajukan' : 'Update' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Approve Modal -->
    <div
      v-if="showApproveModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">✓ Setujui Cuti</h2>
          <button @click="closeApproveModal" class="text-gray-500 hover:text-gray-700 text-2xl">
            ✕
          </button>
        </div>

        <form @submit.prevent="approveTimeOff" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Disetujui Oleh *</label>
            <select
              v-model="approvalForm.approved_by"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option :value="null">Pilih Approver</option>
              <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                {{ emp.nama }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
            <textarea
              v-model="approvalForm.notes"
              rows="3"
              placeholder="Catatan persetujuan..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <div class="flex gap-3 pt-4 border-t">
            <button
              type="button"
              @click="closeApproveModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Setujui
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Reject Modal -->
    <div
      v-if="showRejectModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">✗ Tolak Cuti</h2>
          <button @click="closeRejectModal" class="text-gray-500 hover:text-gray-700 text-2xl">
            ✕
          </button>
        </div>

        <form @submit.prevent="rejectTimeOff" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ditolak Oleh *</label>
            <select
              v-model="rejectionForm.approved_by"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option :value="null">Pilih Approver</option>
              <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                {{ emp.nama }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Alasan Penolakan *</label>
            <textarea
              v-model="rejectionForm.notes"
              rows="3"
              required
              placeholder="Jelaskan alasan penolakan..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <div class="flex gap-3 pt-4 border-t">
            <button
              type="button"
              @click="closeRejectModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Tolak
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Detail Modal -->
    <div
      v-if="showDetailModal && selectedTimeOff"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Detail Cuti/Ijin</h2>
          <button
            @click="showDetailModal = false"
            class="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-medium text-gray-700">Karyawan</p>
            <p class="text-gray-900">
              {{ selectedTimeOff.employee?.nama || selectedTimeOff.employee?.name || '-' }}
            </p>
          </div>

          <div>
            <p class="text-sm font-medium text-gray-700">Jenis Cuti</p>
            <p>
              <span
                :class="getTypeClass(selectedTimeOff.type)"
                class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ getTypeLabel(selectedTimeOff.type) }}
              </span>
            </p>
          </div>

          <div>
            <p class="text-sm font-medium text-gray-700">Tanggal Mulai</p>
            <p class="text-gray-900">{{ formatDate(selectedTimeOff.start_date) }}</p>
          </div>

          <div>
            <p class="text-sm font-medium text-gray-700">Tanggal Selesai</p>
            <p class="text-gray-900">{{ formatDate(selectedTimeOff.end_date) }}</p>
          </div>

          <div>
            <p class="text-sm font-medium text-gray-700">Total Hari</p>
            <p class="text-gray-900 font-semibold">{{ selectedTimeOff.total_days }} hari</p>
          </div>

          <div>
            <p class="text-sm font-medium text-gray-700">Status</p>
            <p>
              <span
                :class="getStatusClass(selectedTimeOff.status)"
                class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ getStatusLabel(selectedTimeOff.status) }}
              </span>
            </p>
          </div>

          <div class="col-span-2">
            <p class="text-sm font-medium text-gray-700 mb-2">Alasan</p>
            <p class="text-gray-900">{{ selectedTimeOff.reason || '-' }}</p>
          </div>

          <div v-if="selectedTimeOff.approver" class="col-span-2">
            <p class="text-sm font-medium text-gray-700 mb-2">
              {{ selectedTimeOff.status === 'approved' ? 'Disetujui Oleh' : 'Ditolak Oleh' }}
            </p>
            <p class="text-gray-900">
              {{ selectedTimeOff.approver?.nama || selectedTimeOff.approver?.name || '-' }}
              <span v-if="selectedTimeOff.approved_at" class="text-sm text-gray-500">
                pada {{ formatDateTime(selectedTimeOff.approved_at) }}
              </span>
            </p>
          </div>

          <div v-if="selectedTimeOff.notes" class="col-span-2">
            <p class="text-sm font-medium text-gray-700 mb-2">Catatan</p>
            <p class="text-gray-900">{{ selectedTimeOff.notes }}</p>
          </div>

          <div class="col-span-2">
            <p class="text-sm font-medium text-gray-700">Diajukan Pada</p>
            <p class="text-gray-900">{{ formatDateTime(selectedTimeOff.created_at) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { BASE_URL } from '../base.utils.url.ts'

export default {
  name: 'TableTimeOff',
  data() {
    return {
      timeoffs: [],
      employees: [],
      loading: false,
      error: null,
      showModal: false,
      showApproveModal: false,
      showRejectModal: false,
      showDetailModal: false,
      modalMode: 'create',
      selectedTimeOff: null,
      filters: {
        employee_id: null,
        type: null,
        status: null,
        start_date: null,
        end_date: null,
      },
      form: {
        employee_id: null,
        type: 'annual_leave',
        start_date: '',
        end_date: '',
        reason: '',
      },
      approvalForm: {
        approved_by: null,
        notes: '',
      },
      rejectionForm: {
        approved_by: null,
        notes: '',
      },
    }
  },
  mounted() {
    this.loadEmployees()
    this.loadTimeOffs()
  },
  methods: {
    async loadEmployees() {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${BASE_URL}api/pegawai`, {
          params: { limit: 1000 },
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.data && response.data.status === true) {
          this.employees = response.data.data.data || response.data.data || []
        }
      } catch (error) {
        console.error('Error loading employees:', error)
      }
    },
    async loadTimeOffs() {
      this.loading = true
      this.error = null

      try {
        const params = {}
        if (this.filters.employee_id) params.employee_id = this.filters.employee_id
        if (this.filters.type) params.type = this.filters.type
        if (this.filters.status) params.status = this.filters.status
        if (this.filters.start_date) params.start_date = this.filters.start_date
        if (this.filters.end_date) params.end_date = this.filters.end_date

        const token = localStorage.getItem('token')
        const response = await axios.get(`${BASE_URL}api/timeoffs`, {
          params,
          headers: { Authorization: `Bearer ${token}` },
        })

        if (
          response.data &&
          (response.data.status === true || response.data.status === 'success')
        ) {
          this.timeoffs = response.data.data || []
          console.log('✅ Time offs loaded:', this.timeoffs.length, 'items')
        } else {
          this.error = response.data.message || 'Gagal memuat data cuti'
        }
      } catch (err) {
        console.error('❌ Error loading time offs:', err)
        this.error = err.response?.data?.message || 'Gagal memuat data cuti. Silakan coba lagi.'
      } finally {
        this.loading = false
      }
    },
    openCreateModal() {
      this.modalMode = 'create'
      this.showModal = true
      this.form = {
        employee_id: null,
        type: 'annual_leave',
        start_date: '',
        end_date: '',
        reason: '',
      }
    },
    closeModal() {
      this.showModal = false
      this.selectedTimeOff = null
    },
    editTimeOff(timeoff) {
      this.modalMode = 'edit'
      this.selectedTimeOff = timeoff
      this.showModal = true
      this.form = {
        employee_id: timeoff.employee_id,
        type: timeoff.type,
        start_date: timeoff.start_date,
        end_date: timeoff.end_date,
        reason: timeoff.reason,
      }
    },
    async submitForm() {
      try {
        const payload = { ...this.form }

        const token = localStorage.getItem('token')
        let response

        if (this.modalMode === 'create') {
          response = await axios.post(`${BASE_URL}api/timeoffs`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
        } else {
          response = await axios.put(
            `${BASE_URL}api/timeoffs/${this.selectedTimeOff.id}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            },
          )
        }

        if (response.data.status === true || response.data.status === 'success') {
          alert(`✅ Cuti berhasil ${this.modalMode === 'create' ? 'diajukan' : 'diupdate'}!`)
          this.closeModal()
          this.loadTimeOffs()
        } else {
          alert('❌ ' + (response.data.message || 'Gagal menyimpan data cuti'))
        }
      } catch (err) {
        console.error('❌ Error saving time off:', err)
        alert('❌ Gagal menyimpan data cuti: ' + (err.response?.data?.message || err.message))
      }
    },
    openApproveModal(timeoff) {
      this.selectedTimeOff = timeoff
      this.showApproveModal = true
      this.approvalForm = {
        approved_by: null,
        notes: '',
      }
    },
    closeApproveModal() {
      this.showApproveModal = false
      this.selectedTimeOff = null
    },
    async approveTimeOff() {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.post(
          `${BASE_URL}api/timeoffs/${this.selectedTimeOff.id}/approve`,
          this.approvalForm,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        )

        if (response.data.status === true || response.data.status === 'success') {
          alert('✅ Cuti berhasil disetujui!')
          this.closeApproveModal()
          this.loadTimeOffs()
        } else {
          alert('❌ ' + (response.data.message || 'Gagal menyetujui cuti'))
        }
      } catch (err) {
        console.error('❌ Error approving time off:', err)
        alert('❌ Gagal menyetujui cuti: ' + (err.response?.data?.message || err.message))
      }
    },
    openRejectModal(timeoff) {
      this.selectedTimeOff = timeoff
      this.showRejectModal = true
      this.rejectionForm = {
        approved_by: null,
        notes: '',
      }
    },
    closeRejectModal() {
      this.showRejectModal = false
      this.selectedTimeOff = null
    },
    async rejectTimeOff() {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.post(
          `${BASE_URL}api/timeoffs/${this.selectedTimeOff.id}/reject`,
          this.rejectionForm,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        )

        if (response.data.status === true || response.data.status === 'success') {
          alert('✅ Cuti berhasil ditolak!')
          this.closeRejectModal()
          this.loadTimeOffs()
        } else {
          alert('❌ ' + (response.data.message || 'Gagal menolak cuti'))
        }
      } catch (err) {
        console.error('❌ Error rejecting time off:', err)
        alert('❌ Gagal menolak cuti: ' + (err.response?.data?.message || err.message))
      }
    },
    confirmCancel(timeoff) {
      if (confirm(`Yakin ingin membatalkan pengajuan cuti ini?`)) {
        this.cancelTimeOff(timeoff.id)
      }
    },
    async cancelTimeOff(id) {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.post(
          `${BASE_URL}api/timeoffs/${id}/cancel`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (response.data.status === true || response.data.status === 'success') {
          alert('✅ Pengajuan cuti berhasil dibatalkan')
          this.loadTimeOffs()
        } else {
          alert('❌ ' + (response.data.message || 'Gagal membatalkan cuti'))
        }
      } catch (err) {
        console.error('❌ Error cancelling time off:', err)
        alert('❌ Gagal membatalkan cuti: ' + (err.response?.data?.message || err.message))
      }
    },
    viewDetail(timeoff) {
      this.selectedTimeOff = timeoff
      this.showDetailModal = true
    },
    confirmDelete(timeoff) {
      if (confirm(`Yakin ingin menghapus pengajuan cuti ini?`)) {
        this.deleteTimeOff(timeoff.id)
      }
    },
    async deleteTimeOff(id) {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.delete(`${BASE_URL}api/timeoffs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.data.status === true || response.data.status === 'success') {
          alert('✅ Pengajuan cuti berhasil dihapus')
          this.loadTimeOffs()
        } else {
          alert('❌ ' + (response.data.message || 'Gagal menghapus cuti'))
        }
      } catch (err) {
        console.error('❌ Error deleting time off:', err)
        alert('❌ Gagal menghapus cuti: ' + (err.response?.data?.message || err.message))
      }
    },
    getTypeClass(type) {
      const classes = {
        annual_leave: 'bg-blue-100 text-blue-800',
        sick_leave: 'bg-red-100 text-red-800',
        unpaid_leave: 'bg-gray-100 text-gray-800',
        maternity_leave: 'bg-pink-100 text-pink-800',
        paternity_leave: 'bg-indigo-100 text-indigo-800',
        other: 'bg-purple-100 text-purple-800',
      }
      return classes[type] || 'bg-gray-100 text-gray-800'
    },
    getTypeLabel(type) {
      const labels = {
        annual_leave: 'Cuti Tahunan',
        sick_leave: 'Cuti Sakit',
        unpaid_leave: 'Cuti Tanpa Gaji',
        maternity_leave: 'Cuti Melahirkan',
        paternity_leave: 'Cuti Ayah',
        other: 'Lainnya',
      }
      return labels[type] || type
    },
    getStatusClass(status) {
      const classes = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        cancelled: 'bg-gray-100 text-gray-800',
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },
    getStatusLabel(status) {
      const labels = {
        pending: 'Menunggu Persetujuan',
        approved: 'Disetujui',
        rejected: 'Ditolak',
        cancelled: 'Dibatalkan',
      }
      return labels[status] || status
    },
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    },
    formatDateTime(datetime) {
      if (!datetime) return '-'
      return new Date(datetime).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
  },
}
</script>
