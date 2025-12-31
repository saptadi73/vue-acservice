<template>
  <div class="p-6 space-y-6">
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-semibold text-gray-800">Daftar Absensi Karyawan</h2>
        <p class="text-gray-600 text-sm mt-1">Kelola kehadiran dan absensi karyawan</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="openCheckinModal"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          <span>✓</span> Check In
        </button>
        <button
          @click="openManualAttendanceModal"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <span>➕</span> Tambah Absensi Manual
        </button>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="bg-white rounded-lg shadow-sm p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Employee Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Karyawan</label>
          <select
            v-model="filters.employee_id"
            @change="loadAttendances"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option :value="null">Semua Karyawan</option>
            <option v-for="emp in employees" :key="emp.id" :value="emp.id">
              {{ emp.nama }}
            </option>
          </select>
        </div>

        <!-- Start Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
          <input
            v-model="filters.start_date"
            type="date"
            @change="loadAttendances"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- End Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
          <input
            v-model="filters.end_date"
            type="date"
            @change="loadAttendances"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filters.status"
            @change="loadAttendances"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option :value="null">Semua Status</option>
            <option value="present">Hadir</option>
            <option value="absent">Tidak Hadir</option>
            <option value="late">Terlambat</option>
            <option value="half_day">Setengah Hari</option>
            <option value="on_leave">Cuti</option>
            <option value="sick">Sakit</option>
            <option value="holiday">Libur</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
      <p class="mt-4 text-gray-600">Loading data absensi...</p>
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
                Tanggal
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Check In
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Check Out
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Jam Kerja
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Lembur
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
            <tr v-for="attendance in attendances" :key="attendance.id" class="hover:bg-gray-50">
              <!-- Employee Name -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ attendance.employee?.nama || attendance.employee?.name || '-' }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ attendance.employee?.email || '-' }}
                </div>
              </td>

              <!-- Date -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(attendance.date) }}</div>
              </td>

              <!-- Check In -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ attendance.check_in ? formatTime(attendance.check_in) : '-' }}
                </div>
                <div v-if="attendance.location" class="text-xs text-gray-500">
                  📍 {{ attendance.location }}
                </div>
              </td>

              <!-- Check Out -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ attendance.check_out ? formatTime(attendance.check_out) : '-' }}
                </div>
              </td>

              <!-- Work Hours -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span class="text-sm text-gray-900">
                  {{ attendance.work_hours ? attendance.work_hours.toFixed(2) + ' jam' : '-' }}
                </span>
              </td>

              <!-- Overtime Hours -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  v-if="attendance.overtime_hours > 0"
                  class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800"
                >
                  {{ attendance.overtime_hours.toFixed(2) }} jam
                </span>
                <span v-else class="text-sm text-gray-400">-</span>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  :class="getStatusClass(attendance.status)"
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ getStatusLabel(attendance.status) }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <button
                  v-if="!attendance.check_out"
                  @click="openCheckoutModal(attendance)"
                  class="text-orange-600 hover:text-orange-900 mr-3"
                  title="Check Out"
                >
                  ⏰
                </button>
                <button
                  @click="viewDetail(attendance)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                  title="Lihat Detail"
                >
                  👁️
                </button>
                <button
                  @click="editAttendance(attendance)"
                  class="text-green-600 hover:text-green-900 mr-3"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  @click="confirmDelete(attendance)"
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
      <div v-if="attendances.length === 0" class="text-center py-12">
        <p class="text-gray-500">Tidak ada data absensi</p>
      </div>
    </div>

    <!-- Check In Modal -->
    <div
      v-if="showCheckinModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">✓ Check In</h2>
          <button @click="closeCheckinModal" class="text-gray-500 hover:text-gray-700 text-2xl">
            ✕
          </button>
        </div>

        <form @submit.prevent="submitCheckin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Karyawan *</label>
            <select
              v-model="checkinForm.employee_id"
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
            <label class="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
            <input
              v-model="checkinForm.location"
              type="text"
              placeholder="Contoh: Kantor Jakarta"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Foto Check In</label>
            <input
              @change="handleCheckinPhoto"
              type="file"
              accept="image/*"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <img
              v-if="checkinPhotoPreview"
              :src="checkinPhotoPreview"
              class="mt-2 h-32 rounded border"
              alt="Preview"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
            <textarea
              v-model="checkinForm.notes"
              rows="3"
              placeholder="Catatan check in..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <div class="flex gap-3 pt-4 border-t">
            <button
              type="button"
              @click="closeCheckinModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Check In
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Check Out Modal -->
    <div
      v-if="showCheckoutModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">⏰ Check Out</h2>
          <button @click="closeCheckoutModal" class="text-gray-500 hover:text-gray-700 text-2xl">
            ✕
          </button>
        </div>

        <form @submit.prevent="submitCheckout" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Jam Lembur</label>
            <input
              v-model.number="checkoutForm.overtime_hours"
              type="number"
              step="0.5"
              min="0"
              placeholder="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p class="text-xs text-gray-500 mt-1">Dalam satuan jam (contoh: 1.5 untuk 1.5 jam)</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Foto Check Out</label>
            <input
              @change="handleCheckoutPhoto"
              type="file"
              accept="image/*"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <img
              v-if="checkoutPhotoPreview"
              :src="checkoutPhotoPreview"
              class="mt-2 h-32 rounded border"
              alt="Preview"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
            <textarea
              v-model="checkoutForm.notes"
              rows="3"
              placeholder="Catatan check out..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <div class="flex gap-3 pt-4 border-t">
            <button
              type="button"
              @click="closeCheckoutModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              Check Out
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Manual Attendance Modal -->
    <div
      v-if="showManualModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">
            {{ modalMode === 'create' ? '➕ Tambah Absensi Manual' : '✏️ Edit Absensi' }}
          </h2>
          <button @click="closeManualModal" class="text-gray-500 hover:text-gray-700 text-2xl">
            ✕
          </button>
        </div>

        <form @submit.prevent="submitManualAttendance" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Karyawan *</label>
            <select
              v-model="manualForm.employee_id"
              required
              :disabled="modalMode === 'edit'"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option :value="null">Pilih Karyawan</option>
              <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                {{ emp.nama }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal *</label>
            <input
              v-model="manualForm.date"
              type="date"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Jam Check In</label>
              <input
                v-model="manualForm.check_in_time"
                type="time"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Jam Check Out</label>
              <input
                v-model="manualForm.check_out_time"
                type="time"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status *</label>
            <select
              v-model="manualForm.status"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="present">Hadir</option>
              <option value="absent">Tidak Hadir</option>
              <option value="late">Terlambat</option>
              <option value="half_day">Setengah Hari</option>
              <option value="on_leave">Cuti</option>
              <option value="sick">Sakit</option>
              <option value="holiday">Libur</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
            <input
              v-model="manualForm.location"
              type="text"
              placeholder="Contoh: Kantor Jakarta"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
            <textarea
              v-model="manualForm.notes"
              rows="3"
              placeholder="Catatan absensi..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <div class="flex gap-3 pt-4 border-t">
            <button
              type="button"
              @click="closeManualModal"
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

    <!-- Detail Modal -->
    <div
      v-if="showDetailModal && selectedAttendance"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Detail Absensi</h2>
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
            <p class="text-gray-900">{{ selectedAttendance.employee?.nama || '-' }}</p>
          </div>

          <div>
            <p class="text-sm font-medium text-gray-700">Tanggal</p>
            <p class="text-gray-900">{{ formatDate(selectedAttendance.date) }}</p>
          </div>

          <div>
            <p class="text-sm font-medium text-gray-700">Check In</p>
            <p class="text-gray-900">
              {{ selectedAttendance.check_in ? formatDateTime(selectedAttendance.check_in) : '-' }}
            </p>
          </div>

          <div>
            <p class="text-sm font-medium text-gray-700">Check Out</p>
            <p class="text-gray-900">
              {{
                selectedAttendance.check_out ? formatDateTime(selectedAttendance.check_out) : '-'
              }}
            </p>
          </div>

          <div>
            <p class="text-sm font-medium text-gray-700">Jam Kerja</p>
            <p class="text-gray-900">
              {{
                selectedAttendance.work_hours
                  ? selectedAttendance.work_hours.toFixed(2) + ' jam'
                  : '-'
              }}
            </p>
          </div>

          <div>
            <p class="text-sm font-medium text-gray-700">Jam Lembur</p>
            <p class="text-gray-900">
              {{
                selectedAttendance.overtime_hours
                  ? selectedAttendance.overtime_hours.toFixed(2) + ' jam'
                  : '-'
              }}
            </p>
          </div>

          <div>
            <p class="text-sm font-medium text-gray-700">Status</p>
            <p>
              <span
                :class="getStatusClass(selectedAttendance.status)"
                class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ getStatusLabel(selectedAttendance.status) }}
              </span>
            </p>
          </div>

          <div>
            <p class="text-sm font-medium text-gray-700">Lokasi</p>
            <p class="text-gray-900">{{ selectedAttendance.location || '-' }}</p>
          </div>

          <div class="col-span-2">
            <p class="text-sm font-medium text-gray-700 mb-2">Catatan</p>
            <p class="text-gray-900">{{ selectedAttendance.notes || '-' }}</p>
          </div>

          <div v-if="selectedAttendance.check_in_photo">
            <p class="text-sm font-medium text-gray-700 mb-2">Foto Check In</p>
            <img
              :src="getImageUrl(selectedAttendance.check_in_photo)"
              class="h-32 rounded border"
              alt="Check In"
            />
          </div>

          <div v-if="selectedAttendance.check_out_photo">
            <p class="text-sm font-medium text-gray-700 mb-2">Foto Check Out</p>
            <img
              :src="getImageUrl(selectedAttendance.check_out_photo)"
              class="h-32 rounded border"
              alt="Check Out"
            />
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
  name: 'TableAbsen',
  data() {
    return {
      attendances: [],
      employees: [],
      loading: false,
      error: null,
      showCheckinModal: false,
      showCheckoutModal: false,
      showManualModal: false,
      showDetailModal: false,
      modalMode: 'create',
      selectedAttendance: null,
      filters: {
        employee_id: null,
        start_date: null,
        end_date: null,
        status: null,
      },
      checkinForm: {
        employee_id: null,
        location: '',
        notes: '',
      },
      checkinPhoto: null,
      checkinPhotoPreview: null,
      checkoutForm: {
        overtime_hours: 0,
        notes: '',
      },
      checkoutPhoto: null,
      checkoutPhotoPreview: null,
      manualForm: {
        employee_id: null,
        date: new Date().toISOString().split('T')[0],
        check_in_time: '',
        check_out_time: '',
        status: 'present',
        location: '',
        notes: '',
      },
    }
  },
  mounted() {
    this.loadEmployees()
    this.loadAttendances()
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
    async loadAttendances() {
      this.loading = true
      this.error = null

      try {
        const params = {}
        if (this.filters.employee_id) params.employee_id = this.filters.employee_id
        if (this.filters.start_date) params.start_date = this.filters.start_date
        if (this.filters.end_date) params.end_date = this.filters.end_date
        if (this.filters.status) params.status = this.filters.status

        const token = localStorage.getItem('token')
        const response = await axios.get(`${BASE_URL}api/attendances`, {
          params,
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.data && response.data.status === true) {
          this.attendances = response.data.data || []
          console.log('✅ Attendances loaded:', this.attendances.length, 'items')
        } else {
          this.error = response.data.message || 'Gagal memuat data absensi'
        }
      } catch (err) {
        console.error('❌ Error loading attendances:', err)
        this.error = err.response?.data?.message || 'Gagal memuat data absensi. Silakan coba lagi.'
      } finally {
        this.loading = false
      }
    },
    openCheckinModal() {
      this.showCheckinModal = true
      this.checkinForm = {
        employee_id: null,
        location: '',
        notes: '',
      }
      this.checkinPhoto = null
      this.checkinPhotoPreview = null
    },
    closeCheckinModal() {
      this.showCheckinModal = false
    },
    handleCheckinPhoto(event) {
      const file = event.target.files[0]
      if (file) {
        this.checkinPhoto = file
        const reader = new FileReader()
        reader.onload = (e) => {
          this.checkinPhotoPreview = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    async submitCheckin() {
      try {
        const formData = new FormData()
        formData.append('employee_id', this.checkinForm.employee_id)
        if (this.checkinForm.location) formData.append('location', this.checkinForm.location)
        if (this.checkinForm.notes) formData.append('notes', this.checkinForm.notes)
        if (this.checkinPhoto) formData.append('photo', this.checkinPhoto)

        const token = localStorage.getItem('token')
        const response = await axios.post(`${BASE_URL}api/attendances/checkin`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        })

        if (response.data.status === true) {
          alert('✅ Check in berhasil!')
          this.closeCheckinModal()
          this.loadAttendances()
        } else {
          alert('❌ ' + (response.data.message || 'Gagal check in'))
        }
      } catch (err) {
        console.error('❌ Error check in:', err)
        alert('❌ Gagal check in: ' + (err.response?.data?.message || err.message))
      }
    },
    openCheckoutModal(attendance) {
      this.selectedAttendance = attendance
      this.showCheckoutModal = true
      this.checkoutForm = {
        overtime_hours: 0,
        notes: '',
      }
      this.checkoutPhoto = null
      this.checkoutPhotoPreview = null
    },
    closeCheckoutModal() {
      this.showCheckoutModal = false
      this.selectedAttendance = null
    },
    handleCheckoutPhoto(event) {
      const file = event.target.files[0]
      if (file) {
        this.checkoutPhoto = file
        const reader = new FileReader()
        reader.onload = (e) => {
          this.checkoutPhotoPreview = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    async submitCheckout() {
      try {
        const formData = new FormData()
        if (this.checkoutForm.overtime_hours)
          formData.append('overtime_hours', this.checkoutForm.overtime_hours)
        if (this.checkoutForm.notes) formData.append('notes', this.checkoutForm.notes)
        if (this.checkoutPhoto) formData.append('photo', this.checkoutPhoto)

        const token = localStorage.getItem('token')
        const response = await axios.post(
          `${BASE_URL}api/attendances/${this.selectedAttendance.id}/checkout`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        )

        if (response.data.status === true) {
          alert('✅ Check out berhasil!')
          this.closeCheckoutModal()
          this.loadAttendances()
        } else {
          alert('❌ ' + (response.data.message || 'Gagal check out'))
        }
      } catch (err) {
        console.error('❌ Error check out:', err)
        alert('❌ Gagal check out: ' + (err.response?.data?.message || err.message))
      }
    },
    openManualAttendanceModal() {
      this.modalMode = 'create'
      this.showManualModal = true
      this.manualForm = {
        employee_id: null,
        date: new Date().toISOString().split('T')[0],
        check_in_time: '',
        check_out_time: '',
        status: 'present',
        location: '',
        notes: '',
      }
    },
    closeManualModal() {
      this.showManualModal = false
      this.selectedAttendance = null
    },
    editAttendance(attendance) {
      this.modalMode = 'edit'
      this.selectedAttendance = attendance
      this.showManualModal = true

      // Parse check_in and check_out times
      const checkInTime = attendance.check_in
        ? new Date(attendance.check_in).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : ''
      const checkOutTime = attendance.check_out
        ? new Date(attendance.check_out).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : ''

      this.manualForm = {
        employee_id: attendance.employee_id,
        date: attendance.date,
        check_in_time: checkInTime,
        check_out_time: checkOutTime,
        status: attendance.status,
        location: attendance.location || '',
        notes: attendance.notes || '',
      }
    },
    async submitManualAttendance() {
      try {
        const payload = {
          employee_id: this.manualForm.employee_id,
          date: this.manualForm.date,
          status: this.manualForm.status,
          location: this.manualForm.location,
          notes: this.manualForm.notes,
        }

        if (this.manualForm.check_in_time) {
          payload.check_in = `${this.manualForm.date} ${this.manualForm.check_in_time}:00`
        }

        if (this.manualForm.check_out_time) {
          payload.check_out = `${this.manualForm.date} ${this.manualForm.check_out_time}:00`
        }

        const token = localStorage.getItem('token')
        let response

        if (this.modalMode === 'create') {
          response = await axios.post(`${BASE_URL}api/attendances`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
        } else {
          response = await axios.put(
            `${BASE_URL}api/attendances/${this.selectedAttendance.id}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            },
          )
        }

        if (response.data.status === true) {
          alert(`✅ Absensi berhasil ${this.modalMode === 'create' ? 'ditambahkan' : 'diupdate'}!`)
          this.closeManualModal()
          this.loadAttendances()
        } else {
          alert('❌ ' + (response.data.message || 'Gagal menyimpan absensi'))
        }
      } catch (err) {
        console.error('❌ Error saving attendance:', err)
        alert('❌ Gagal menyimpan absensi: ' + (err.response?.data?.message || err.message))
      }
    },
    viewDetail(attendance) {
      this.selectedAttendance = attendance
      this.showDetailModal = true
    },
    confirmDelete(attendance) {
      if (confirm(`Yakin ingin menghapus absensi tanggal ${this.formatDate(attendance.date)}?`)) {
        this.deleteAttendance(attendance.id)
      }
    },
    async deleteAttendance(id) {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.delete(`${BASE_URL}api/attendances/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.data.status === true) {
          alert('✅ Absensi berhasil dihapus')
          this.loadAttendances()
        } else {
          alert('❌ ' + (response.data.message || 'Gagal menghapus absensi'))
        }
      } catch (err) {
        console.error('❌ Error deleting attendance:', err)
        alert('❌ Gagal menghapus absensi: ' + (err.response?.data?.message || err.message))
      }
    },
    getStatusClass(status) {
      const classes = {
        present: 'bg-green-100 text-green-800',
        absent: 'bg-red-100 text-red-800',
        late: 'bg-orange-100 text-orange-800',
        half_day: 'bg-yellow-100 text-yellow-800',
        on_leave: 'bg-blue-100 text-blue-800',
        sick: 'bg-purple-100 text-purple-800',
        holiday: 'bg-gray-100 text-gray-800',
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },
    getStatusLabel(status) {
      const labels = {
        present: 'Hadir',
        absent: 'Tidak Hadir',
        late: 'Terlambat',
        half_day: 'Setengah Hari',
        on_leave: 'Cuti',
        sick: 'Sakit',
        holiday: 'Libur',
      }
      return labels[status] || status
    },
    getImageUrl(path) {
      if (!path) return ''
      if (path.startsWith('http://') || path.startsWith('https://')) {
        return path
      }
      return `${BASE_URL}${path}`
    },
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    },
    formatTime(datetime) {
      if (!datetime) return '-'
      return new Date(datetime).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
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
