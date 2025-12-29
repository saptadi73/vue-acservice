<template>
  <div class="p-4 space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold text-gray-800">Daftar Biaya</h1>
      <button
        @click="openAddModal"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        + Tambah Biaya
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded shadow p-4 grid grid-cols-1 md:grid-cols-5 gap-3">
      <div class="md:col-span-2">
        <label class="text-sm text-gray-700">Cari</label>
        <input
          v-model="filters.search"
          class="w-full border rounded px-3 py-2"
          placeholder="Cari nomor/keterangan/jenis"
          @keyup.enter="fetchExpenses"
        />
      </div>
      <div>
        <label class="text-sm text-gray-700">Start Date</label>
        <input v-model="filters.start_date" type="date" class="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label class="text-sm text-gray-700">End Date</label>
        <input v-model="filters.end_date" type="date" class="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label class="text-sm text-gray-700">Jenis (CoA)</label>
        <select v-model="filters.chart_of_account_id" class="w-full border rounded px-3 py-2">
          <option value="">Semua jenis</option>
          <option v-for="coa in expenseAccounts" :key="coa.id" :value="coa.id">
            {{ coa.code }} - {{ coa.name }}
          </option>
        </select>
      </div>
      <div class="md:col-span-5 flex justify-end gap-3">
        <button @click="resetFilters" class="px-3 py-2 border rounded">Reset</button>
        <button @click="fetchExpenses" class="px-3 py-2 bg-slate-800 text-white rounded">
          Terapkan
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded shadow overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
          <tr>
            <th class="px-3 py-2 text-left">Nomor</th>
            <th class="px-3 py-2 text-left">Tanggal</th>
            <th class="px-3 py-2 text-right">Jumlah</th>
            <th class="px-3 py-2 text-left">Jenis</th>
            <th class="px-3 py-2 text-left">Status</th>
            <th class="px-3 py-2 text-left">Jurnal</th>
            <th class="px-3 py-2 text-left">Keterangan</th>
            <th class="px-3 py-2 text-center">Bukti</th>
            <th class="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200" v-if="!loading && expenses.length">
          <tr v-for="row in expenses" :key="row.id">
            <td class="px-3 py-2">{{ row.nomor }}</td>
            <td class="px-3 py-2">{{ formatDateID(row.tanggal) }}</td>
            <td class="px-3 py-2 text-right">{{ formatCurrency(row.jumlah) }}</td>
            <td class="px-3 py-2">{{ getJenisName(row) }}</td>
            <td class="px-3 py-2">
              <span :class="getStatusBadgeClass(row)">{{ getStatusText(row) }}</span>
            </td>
            <td class="px-3 py-2">
              {{ row.journal_status || row.journal_created ? 'Ada' : 'Belum' }}
            </td>
            <td class="px-3 py-2">{{ row.keterangan || row.deskripsi || row.notes }}</td>
            <td class="px-3 py-2 text-center">
              <button
                v-if="row.bukti"
                @click="openImageModal(row.bukti)"
                class="inline-block px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 transition"
                title="Klik untuk melihat bukti"
              >
                <svg
                  class="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>
              <span v-else class="text-gray-400 text-sm">-</span>
            </td>
            <td class="px-3 py-2 text-right space-x-2">
              <button v-if="isExpenseOpen(row)" @click="goEdit(row.id)" class="text-blue-600">
                Edit
              </button>
              <button v-if="isExpenseOpen(row)" @click="confirmDelete(row)" class="text-red-600">
                Delete
              </button>
              <button
                v-if="isExpenseConfirmed(row)"
                @click="openPaymentModal(row)"
                class="text-green-600"
              >
                Payment
              </button>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td class="px-3 py-4 text-center text-gray-500" colspan="8">
              {{ loading ? 'Memuat data...' : 'Tidak ada data' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between">
      <div class="text-sm text-gray-600">
        Menampilkan {{ pageInfo.from }} - {{ pageInfo.to }} dari {{ pageInfo.total }}
      </div>
      <div class="flex items-center gap-2">
        <select v-model.number="filters.per_page" class="border rounded px-2 py-1">
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
        <button @click="prevPage" :disabled="filters.page <= 1" class="px-3 py-1 border rounded">
          Prev
        </button>
        <span class="text-sm">Page {{ filters.page }}</span>
        <button
          @click="nextPage"
          :disabled="pageInfo.to >= pageInfo.total"
          class="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Add Expense Modal -->
    <div
      v-if="addModal.open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <h3 class="text-lg font-semibold text-gray-800">Tambah Biaya</h3>
        <form @submit.prevent="performAddExpense" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tanggal <span class="text-red-500">*</span>
              </label>
              <input
                v-model="addModal.form.tanggal"
                type="date"
                required
                class="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Jenis Pembiayaan (CoA) <span class="text-red-500">*</span>
              </label>
              <select
                v-model="addModal.form.chart_of_account_id"
                required
                class="w-full border rounded px-3 py-2"
              >
                <option value="">-- Pilih Jenis Pembiayaan --</option>
                <option v-for="coa in expenseAccounts" :key="coa.id" :value="coa.id">
                  {{ coa.name }}
                </option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Keterangan <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="addModal.form.keterangan"
              required
              rows="3"
              class="w-full border rounded px-3 py-2"
              placeholder="Masukkan keterangan biaya"
            ></textarea>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Jumlah <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="addModal.form.jumlah"
                type="number"
                min="0"
                step="1"
                required
                class="w-full border rounded px-3 py-2"
                placeholder="0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Kategori <span class="text-xs text-gray-500">(otomatis dari Jenis Pembiayaan)</span>
              </label>
              <input
                v-model="addModal.form.kategori"
                type="text"
                disabled
                class="w-full border rounded px-3 py-2 bg-gray-50 text-gray-600 cursor-not-allowed"
                placeholder="Akan terisi otomatis..."
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Bukti (Gambar JPG/PNG)
            </label>
            <input
              @change="handleFileChange"
              type="file"
              accept=".jpg,.jpeg,.png"
              class="w-full border rounded px-3 py-2"
            />
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button
              type="button"
              @click="closeAddModal"
              class="px-4 py-2 border rounded hover:bg-gray-50"
              :disabled="addModal.loading"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              :disabled="addModal.loading"
            >
              {{ addModal.loading ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Expense Modal -->
    <div
      v-if="editModal.open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <h3 class="text-lg font-semibold text-gray-800">Edit Biaya</h3>
        <form @submit.prevent="performEditExpense" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tanggal <span class="text-red-500">*</span>
              </label>
              <input
                v-model="editModal.form.tanggal"
                type="date"
                required
                class="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Jenis Pembiayaan (CoA) <span class="text-red-500">*</span>
              </label>
              <select
                v-model="editModal.form.chart_of_account_id"
                required
                class="w-full border rounded px-3 py-2"
              >
                <option value="">-- Pilih Jenis Pembiayaan --</option>
                <option v-for="coa in expenseAccounts" :key="coa.id" :value="coa.id">
                  {{ coa.name }}
                </option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Keterangan <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="editModal.form.keterangan"
              required
              rows="3"
              class="w-full border rounded px-3 py-2"
              placeholder="Masukkan keterangan biaya"
            ></textarea>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Jumlah <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="editModal.form.jumlah"
                type="number"
                min="0"
                step="1"
                required
                class="w-full border rounded px-3 py-2"
                placeholder="0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Kategori <span class="text-xs text-gray-500">(otomatis dari Jenis Pembiayaan)</span>
              </label>
              <input
                v-model="editModal.form.kategori"
                type="text"
                disabled
                class="w-full border rounded px-3 py-2 bg-gray-50 text-gray-600 cursor-not-allowed"
                placeholder="Akan terisi otomatis..."
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                v-model="editModal.form.status"
                :disabled="editModal.currentStatus === 'confirmed'"
                class="w-full border rounded px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="open">OPEN</option>
                <option value="confirmed">CONFIRMED</option>
              </select>
              <p v-if="editModal.currentStatus === 'confirmed'" class="text-xs text-gray-500 mt-1">
                Status sudah dikonfirmasi, tidak bisa diubah
              </p>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Bukti (Gambar JPG/PNG)
            </label>
            <input
              @change="
                (e) => {
                  const f = e.target.files?.[0]
                  if (f && ['image/jpeg', 'image/png'].includes(f.type)) editModal.form.bukti = f
                  else {
                    alert('Hanya JPG/PNG')
                    e.target.value = ''
                  }
                }
              "
              type="file"
              accept=".jpg,.jpeg,.png"
              class="w-full border rounded px-3 py-2"
            />
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button
              type="button"
              @click="closeEditModal"
              class="px-4 py-2 border rounded hover:bg-gray-50"
              :disabled="editModal.loading"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              :disabled="editModal.loading"
            >
              {{ editModal.loading ? 'Menyimpan...' : 'Update' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete confirm -->
    <div
      v-if="deleteDialog.open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">
        <h3 class="text-lg font-semibold text-gray-800">Hapus Biaya</h3>
        <p class="text-sm text-gray-700">
          Yakin ingin menghapus biaya
          <span class="font-semibold">{{ deleteDialog.row?.nomor }}</span
          >?
        </p>
        <div class="flex justify-end gap-2">
          <button @click="deleteDialog.open = false" class="px-3 py-2 border rounded">Batal</button>
          <button @click="performDelete" class="px-3 py-2 bg-red-600 text-white rounded">
            Hapus
          </button>
        </div>
      </div>
    </div>

    <!-- Image View Modal -->
    <div
      v-if="imageModal.open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      @click.self="closeImageModal"
    >
      <div class="relative max-w-3xl max-h-[90vh]">
        <button
          @click="closeImageModal"
          class="absolute -top-10 -right-10 text-white hover:text-gray-200 text-3xl"
        >
          ✕
        </button>
        <img
          :src="imageModal.imageUrl"
          alt="Bukti"
          class="max-w-full max-h-[90vh] rounded shadow-2xl"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import api from '@/user/axios'
import { BASE_URL } from '@/base.utils.url.ts'

const expenses = ref([])
const expenseAccounts = ref([])
const loading = ref(false)

const filters = reactive({
  search: '',
  start_date: '',
  end_date: '',
  chart_of_account_id: '',
  page: 1,
  per_page: 10,
})

const pageInfo = reactive({ total: 0, from: 0, to: 0 })

function formatCurrency(num) {
  const n = Number(num) || 0
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n)
}

function formatDateID(dateStr) {
  if (!dateStr) return '-'
  let d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) {
    // Try parse YYYY-MM-DD
    const parts = String(dateStr).split('-')
    if (parts.length >= 3) {
      const y = Number(parts[0])
      const m = Number(parts[1]) - 1
      const day = Number(parts[2])
      d = new Date(y, m, day)
    }
  }
  if (Number.isNaN(d.getTime())) return String(dateStr)
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

function getJenisName(row) {
  // Prefer CoA name, then account_name, then kategori/jenis
  const coaName = row?.chart_of_account?.name
  const accountName = row?.account_name
  const kategori = row?.kategori
  const jenis = row?.jenis
  return coaName || accountName || kategori || jenis || '-'
}

function getStatusText(row) {
  // Use common status keys if available
  const s = row?.status || row?.approval_status || row?.payment_status || row?.state
  if (s === 'open') return 'OPEN'
  if (s === 'confirmed') return 'CONFIRMED'
  return s || '-'
}

function getStatusBadgeClass(row) {
  const s = row?.status || row?.approval_status || row?.payment_status || row?.state
  if (s === 'open') return 'px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm'
  if (s === 'confirmed') return 'px-2 py-1 bg-green-100 text-green-800 rounded text-sm'
  return 'px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm'
}

function isExpenseOpen(row) {
  const s = row?.status || row?.approval_status || row?.payment_status || row?.state
  return s === 'open'
}

function isExpenseConfirmed(row) {
  const s = row?.status || row?.approval_status || row?.payment_status || row?.state
  return s === 'confirmed'
}

async function fetchCoaExpenses() {
  try {
    const res = await api.get('chart-of-accounts/expenses')
    expenseAccounts.value = Array.isArray(res?.data?.data) ? res.data.data : []
  } catch (err) {
    console.error('Gagal memuat CoA expenses:', err)
  }
}

async function fetchExpenses() {
  loading.value = true
  try {
    const params = {
      search: filters.search || undefined,
      start_date: filters.start_date || undefined,
      end_date: filters.end_date || undefined,
      chart_of_account_id: filters.chart_of_account_id || undefined,
      page: filters.page,
      per_page: filters.per_page,
    }
    const res = await api.get('expenses', { params })
    const rows = Array.isArray(res?.data?.data)
      ? res.data.data
      : Array.isArray(res?.data)
        ? res.data
        : []
    expenses.value = rows
    const meta = res?.data?.meta || {}
    pageInfo.total = meta.total ?? rows.length
    pageInfo.from = meta.from ?? (filters.page - 1) * filters.per_page + 1
    pageInfo.to = meta.to ?? Math.min(filters.page * filters.per_page, pageInfo.total)
  } catch (err) {
    console.error('Gagal memuat daftar biaya:', err)
  } finally {
    loading.value = false
  }
}

function resetFilters() {
  filters.search = ''
  filters.start_date = ''
  filters.end_date = ''
  filters.chart_of_account_id = ''
  filters.page = 1
  fetchExpenses()
}

function prevPage() {
  if (filters.page > 1) {
    filters.page -= 1
    fetchExpenses()
  }
}
function nextPage() {
  filters.page += 1
  fetchExpenses()
}

function goEdit(id) {
  openEditModal(id)
}

const deleteDialog = reactive({ open: false, row: null })
function confirmDelete(row) {
  deleteDialog.open = true
  deleteDialog.row = row
}
async function performDelete() {
  try {
    const id = deleteDialog.row?.id
    if (!id) return
    await api.delete(`expenses/${id}`)
    deleteDialog.open = false
    deleteDialog.row = null
    alert('Biaya berhasil dihapus')
    fetchExpenses()
  } catch (err) {
    console.error('Gagal menghapus biaya:', err)
    alert(err.response?.data?.message || 'Gagal menghapus biaya')
  }
}

// Add Expense Modal
const addModal = reactive({
  open: false,
  loading: false,
  form: {
    tanggal: '',
    keterangan: '',
    jumlah: 0,
    kategori: '',
    chart_of_account_id: '',
    bukti: null,
    status: 'open',
  },
  autoCategoryName: '',
})

// Image View Modal
const imageModal = reactive({
  open: false,
  imageUrl: '',
})

function openImageModal(imageUrl) {
  // imageUrl bisa berupa:
  // 1. Full URL: http://localhost:8080/uploads/expenses/file.jpg
  // 2. Relative path: /uploads/expenses/file.jpg
  // 3. Filename only: file.jpg

  let fullUrl = imageUrl

  // Jika dimulai dengan / atau tanpa http, tambahkan base URL
  if (imageUrl && !imageUrl.startsWith('http')) {
    const baseUrl = BASE_URL.replace(/\/$/, '') // Remove trailing slash if present
    if (imageUrl.startsWith('/')) {
      fullUrl = baseUrl + imageUrl
    } else {
      fullUrl = baseUrl + '/uploads/expenses/' + imageUrl
    }
  }

  console.debug('Opening image modal with URL:', fullUrl)
  imageModal.imageUrl = fullUrl
  imageModal.open = true
}

function closeImageModal() {
  imageModal.open = false
  imageModal.imageUrl = ''
}

// Edit Expense Modal
const editModal = reactive({
  open: false,
  loading: false,
  id: null,
  currentStatus: 'open',
  form: {
    tanggal: '',
    keterangan: '',
    jumlah: 0,
    kategori: '',
    chart_of_account_id: '',
    bukti: null,
    status: 'open',
  },
  autoCategoryName: '',
})

function openAddModal() {
  addModal.open = true
  addModal.form.tanggal = new Date().toISOString().split('T')[0]
  addModal.form.deskripsi = ''
  addModal.form.jumlah = 0
  addModal.form.kategori = ''
  addModal.form.chart_of_account_id = ''
  addModal.form.notes = ''
  addModal.form.bukti = null
  addModal.autoCategoryName = ''
}

function closeAddModal() {
  addModal.open = false
  addModal.form.tanggal = ''
  addModal.form.keterangan = ''
  addModal.form.jumlah = 0
  addModal.form.kategori = ''
  addModal.form.chart_of_account_id = ''
  addModal.form.bukti = null
  addModal.autoCategoryName = ''
}

function openEditModal(id) {
  editModal.id = id
  editModal.open = true
  editModal.loading = true
  loadExpenseForEdit(id)
}

function closeEditModal() {
  editModal.open = false
  editModal.id = null
  editModal.form.tanggal = ''
  editModal.form.keterangan = ''
  editModal.form.jumlah = 0
  editModal.form.kategori = ''
  editModal.form.chart_of_account_id = ''
  editModal.form.bukti = null
  editModal.autoCategoryName = ''
}

async function loadExpenseForEdit(id) {
  try {
    const res = await api.get(`expenses/${id}`)
    console.debug('Load expense API response:', res?.data)
    const d = res?.data?.data || res?.data || {}
    console.debug('Extracted expense data:', d)
    console.debug('Available keys:', Object.keys(d))

    // Extract YYYY-MM-DD from ISO datetime format
    const formatDateForInput = (dateStr) => {
      if (!dateStr) return ''
      return String(dateStr).split('T')[0]
    }

    // Map API fields to form fields
    editModal.form.tanggal = formatDateForInput(d.tanggal)
    editModal.form.keterangan = d.deskripsi || d.notes || d.keterangan || '' // API uses 'deskripsi' or 'notes'
    editModal.form.jumlah = Number(d.jumlah) || 0
    editModal.form.kategori = d.kategori || d.jenis || '' // API returns kategori or jenis as category/account name
    editModal.form.status = d.status || 'open' // Load current status
    editModal.currentStatus = d.status || 'open' // Save original status
    editModal.form.bukti = null

    // Find chart_of_account_id - try multiple approaches
    let foundCoaId = null

    // Approach 1: Direct ID from API
    if (d.chart_of_account_id) {
      foundCoaId = d.chart_of_account_id
    }

    // Approach 2: From nested chart_of_account object
    if (!foundCoaId && d.chart_of_account?.id) {
      foundCoaId = d.chart_of_account.id
    }

    // Approach 3: Match by name from kategori/jenis
    if (!foundCoaId) {
      const coaName = d.kategori || d.jenis || d.account_name || ''
      const selectedByName = expenseAccounts.value.find((c) => c.name === coaName)
      if (selectedByName) {
        foundCoaId = selectedByName.id
      }
    }

    if (foundCoaId) {
      editModal.form.chart_of_account_id = foundCoaId
      const selectedCoa = expenseAccounts.value.find((c) => c.id === foundCoaId)
      editModal.autoCategoryName = selectedCoa?.name || d.kategori || d.jenis || ''
    } else {
      editModal.form.chart_of_account_id = ''
      editModal.autoCategoryName = ''
      console.warn('⚠️ Could not find chart_of_account_id for expense')
    }

    console.debug('Form after load:', {
      tanggal: editModal.form.tanggal,
      keterangan: editModal.form.keterangan,
      jumlah: editModal.form.jumlah,
      kategori: editModal.form.kategori,
      status: editModal.form.status,
      chart_of_account_id: editModal.form.chart_of_account_id,
      foundCoaId,
      apiFields: {
        deskripsi: d.deskripsi,
        notes: d.notes,
        kategori: d.kategori,
        jenis: d.jenis,
        chart_of_account_id: d.chart_of_account_id,
        chart_of_account: d.chart_of_account,
      },
    })
  } catch (err) {
    console.error('Gagal memuat biaya untuk edit:', err)
    alert('Gagal memuat data biaya')
    closeEditModal()
  } finally {
    editModal.loading = false
  }
}

function handleFileChange(event) {
  const file = event.target.files?.[0]
  if (!file) {
    addModal.form.bukti = null
    return
  }
  const allowedTypes = ['image/jpeg', 'image/png']
  if (!allowedTypes.includes(file.type)) {
    alert('File bukti harus berupa gambar JPG atau PNG')
    event.target.value = ''
    addModal.form.bukti = null
    return
  }
  addModal.form.bukti = file
}

// Default kategori equals selected CoA name - always update since field is disabled
watch(
  () => addModal.form.chart_of_account_id,
  (newId) => {
    if (!newId) {
      addModal.form.kategori = ''
      addModal.autoCategoryName = ''
      return
    }
    const selected = expenseAccounts.value.find((c) => c.id === newId)
    const newName = selected?.name || ''
    // Always update kategori when CoA changes (since it's disabled field)
    addModal.form.kategori = newName
    addModal.autoCategoryName = newName
    console.log('🔄 Add modal kategori updated:', newName)
  },
)

// Default kategori for edit modal - always update since field is disabled
watch(
  () => editModal.form.chart_of_account_id,
  (newId) => {
    if (!newId) {
      editModal.form.kategori = ''
      editModal.autoCategoryName = ''
      return
    }
    const selected = expenseAccounts.value.find((c) => c.id === newId)
    const newName = selected?.name || ''
    // Always update kategori when CoA changes (since it's disabled field)
    editModal.form.kategori = newName
    editModal.autoCategoryName = newName
    console.log('🔄 Edit modal kategori updated:', newName)
  },
)

// Generate a unique expense number (numeric-only for compatibility)
function generateExpenseNumber() {
  const now = new Date()
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, '') // YYYYMMDD
  const rand = Math.floor(100000 + Math.random() * 900000) // 6-digit random
  return `${ymd}${rand}` // e.g., 20251229xxxxxx
}

async function performAddExpense() {
  if (addModal.loading) return

  // Validation
  if (!addModal.form.tanggal) {
    alert('Tanggal wajib diisi')
    return
  }
  if (!addModal.form.keterangan) {
    alert('Keterangan wajib diisi')
    return
  }
  if (!addModal.form.jumlah || addModal.form.jumlah <= 0) {
    alert('Jumlah harus lebih dari 0')
    return
  }
  if (!addModal.form.chart_of_account_id) {
    alert('Jenis Pembiayaan (CoA) wajib dipilih')
    return
  }

  addModal.loading = true
  try {
    const nomor = generateExpenseNumber()
    const selectedCoa = expenseAccounts.value.find(
      (c) => c.id === addModal.form.chart_of_account_id,
    )
    const jenisValue = selectedCoa?.name || addModal.form.kategori || ''
    const formData = new FormData()
    formData.append('tanggal', addModal.form.tanggal)
    formData.append('keterangan', addModal.form.keterangan)
    formData.append('jumlah', addModal.form.jumlah)
    formData.append('chart_of_account_id', addModal.form.chart_of_account_id)
    // Include both keys to satisfy varying backend expectations
    formData.append('nomor', nomor)
    formData.append('number', nomor)
    formData.append('status', 'open')
    formData.append('kategori', jenisValue)
    formData.append('jenis', jenisValue) // Add jenis for backend compatibility

    if (addModal.form.kategori) {
      formData.append('notes', addModal.form.kategori)
    }
    if (addModal.form.bukti) {
      // Only append valid image files (JPG/PNG)
      const f = addModal.form.bukti
      const allowedTypes = ['image/jpeg', 'image/png']
      if (!allowedTypes.includes(f.type)) {
        alert('File bukti harus berupa gambar JPG atau PNG')
        return
      } else {
        formData.append('bukti', f)
      }
    }

    // Debug payload: log form values and FormData entries
    const fdPreview = {}
    for (const [k, v] of formData.entries()) {
      fdPreview[k] =
        v instanceof File
          ? { name: v.name, size: v.size, type: v.type }
          : v instanceof Blob
            ? { size: v.size, type: v.type }
            : v
    }
    console.debug('Create Expense payload', {
      form: {
        tanggal: addModal.form.tanggal,
        keterangan: addModal.form.keterangan,
        jumlah: addModal.form.jumlah,
        kategori: addModal.form.kategori || null,
        chart_of_account_id: addModal.form.chart_of_account_id,
        chart_of_account: selectedCoa
          ? { id: selectedCoa.id, code: selectedCoa.code, name: selectedCoa.name }
          : null,
        bukti: addModal.form.bukti
          ? {
              name: addModal.form.bukti.name,
              size: addModal.form.bukti.size,
              type: addModal.form.bukti.type,
            }
          : null,
        nomor,
        status: 'open',
        jenis: jenisValue || null,
      },
      formData: fdPreview,
    })

    // Step 1: Create the expense
    const expenseRes = await api.post('expenses', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.debug('Create Expense response', expenseRes?.data ?? expenseRes)

    const expenseId = expenseRes?.data?.data?.id || expenseRes?.data?.id
    if (!expenseId) {
      throw new Error('Expense created but no ID returned from server')
    }

    // Step 2: Create journal entry for the expense
    // Debit: Selected expense account
    // Credit: 2030 HUTANG PERUSAHAAN (Accounts Payable)
    try {
      // Get current user ID from localStorage
      const userId = localStorage.getItem('user_id') || localStorage.getItem('userId')

      const journalPayload = {
        expense_id: expenseId,
        expense_account_id: addModal.form.chart_of_account_id,
      }

      // Add created_by if available
      if (userId) {
        journalPayload.created_by = userId
      }

      console.debug('Creating journal entry for expense', {
        ...journalPayload,
        amount: addModal.form.jumlah,
        date: addModal.form.tanggal,
      })

      const journalRes = await api.post('accounting/journals/expense', journalPayload)
      console.debug('Create Journal Entry response', journalRes?.data ?? journalRes)
    } catch (journalErr) {
      console.warn('⚠️ Expense created but journal entry failed:', {
        message: journalErr?.message,
        status: journalErr?.response?.status,
        data: journalErr?.response?.data,
        errorDetails: journalErr?.response?.data?.error || journalErr?.response?.data?.message,
      })

      // Check if error is due to missing CoA
      const errorMsg =
        journalErr?.response?.data?.error || journalErr?.response?.data?.message || 'Unknown error'

      if (errorMsg.includes('Required chart of accounts not found')) {
        console.error('❌ Missing Accounts Payable CoA in database')
        console.info(
          '💡 Solution: Create Accounts Payable CoA (code 2110 or 2030) in Chart of Accounts',
        )
        // Silently skip - expense is already saved successfully
      } else {
        // For other errors, show alert
        alert(
          `⚠️ Biaya berhasil disimpan.\n\nNamun jurnal otomatis gagal dibuat: ${errorMsg}\n\nSilakan buat jurnal secara manual atau hubungi administrator.`,
        )
      }
    }

    closeAddModal()
    fetchExpenses()
    alert('Biaya berhasil ditambahkan')
  } catch (err) {
    console.error('Gagal menambah biaya:', {
      message: err?.message,
      status: err?.response?.status,
      data: err?.response?.data,
    })
    alert(err.response?.data?.message || 'Gagal menambah biaya')
  } finally {
    addModal.loading = false
  }
}

async function performEditExpense() {
  if (editModal.loading || !editModal.id) return

  // Validation
  if (!editModal.form.tanggal) {
    alert('Tanggal wajib diisi')
    return
  }
  if (!editModal.form.keterangan) {
    alert('Keterangan wajib diisi')
    return
  }
  if (!editModal.form.jumlah || editModal.form.jumlah <= 0) {
    alert('Jumlah harus lebih dari 0')
    return
  }
  if (!editModal.form.chart_of_account_id) {
    alert('Jenis Pembiayaan (CoA) wajib dipilih')
    return
  }

  editModal.loading = true
  console.log('⬜ EDIT MODAL: Submit clicked')
  try {
    const selectedCoa = expenseAccounts.value.find(
      (c) => c.id === editModal.form.chart_of_account_id,
    )
    const jenisValue = selectedCoa?.name || editModal.form.kategori || ''

    console.log('🔷 Edit form values:', {
      id: editModal.id,
      tanggal: editModal.form.tanggal,
      keterangan: editModal.form.keterangan,
      jumlah: editModal.form.jumlah,
      chart_of_account_id: editModal.form.chart_of_account_id,
      jenis: jenisValue,
    })

    // Build JSON payload with status
    const payload = {
      tanggal: editModal.form.tanggal,
      keterangan: editModal.form.keterangan,
      jumlah: editModal.form.jumlah,
      chart_of_account_id: editModal.form.chart_of_account_id,
      kategori: jenisValue,
      jenis: jenisValue, // Add jenis field for backend compatibility
      status: editModal.form.status, // Include status in payload
    }

    console.log('🔷 Payload:', payload)
    console.log('🔷 Status changed from:', editModal.currentStatus, 'to:', editModal.form.status)

    console.log('🔷 CALLING: PUT /expenses/' + editModal.id)
    const res = await api.put(`expenses/${editModal.id}`, payload)
    console.log('🟢 UPDATE SUCCESS')
    console.log('Response status:', res?.status)
    console.log('Response data:', res?.data)

    // Save values BEFORE closing modal
    const expenseIdToUpdate = editModal.id
    const expenseAccountIdToUpdate = editModal.form.chart_of_account_id
    const wasStatusChangedToConfirmed =
      editModal.currentStatus !== 'confirmed' && editModal.form.status === 'confirmed'

    closeEditModal()
    // Add slight delay to ensure server processed the update
    setTimeout(() => {
      fetchExpenses()
    }, 500)

    // Step 2: If status changed to CONFIRMED, create journal entry
    if (wasStatusChangedToConfirmed) {
      try {
        console.log('🔷 Status changed to CONFIRMED - Creating journal entry')

        const userId = localStorage.getItem('user_id') || localStorage.getItem('userId')
        const journalPayload = {
          expense_id: expenseIdToUpdate,
          expense_account_id: expenseAccountIdToUpdate,
        }
        if (userId) {
          journalPayload.created_by = userId
        }

        console.log('🔷 Creating journal:', journalPayload)
        const journalRes = await api.post('accounting/journals/expense', journalPayload)
        console.log('✅ Journal entry created:', journalRes?.data)
        alert('Biaya berhasil diperbarui dan dikonfirmasi dengan jurnal')
      } catch (journalErr) {
        console.log('⚠️ Journal creation failed:', {
          message: journalErr?.message,
          status: journalErr?.response?.status,
          data: journalErr?.response?.data,
        })

        const errorMsg =
          journalErr?.response?.data?.error ||
          journalErr?.response?.data?.message ||
          'Unknown error'

        if (errorMsg.includes('Required chart of accounts not found')) {
          console.error('❌ Missing Accounts Payable CoA in database')
          console.info('💡 Solution: Create Accounts Payable CoA (code 2110 or 2030)')
          alert('⚠️ Status dikonfirmasi tapi journal gagal: CoA Hutang tidak ditemukan')
        } else {
          alert(`⚠️ Biaya dikonfirmasi.\n\nNamun journal gagal: ${errorMsg}`)
        }
      }
    } else {
      alert('Biaya berhasil diperbarui')
    }
  } catch (err) {
    console.log('🔴 ERROR CAUGHT')
    console.log('Error message:', err?.message)
    console.log('Response status:', err?.response?.status)
    console.log('Response data:', err?.response?.data)
    console.log('Full error:', err)
    alert(err.response?.data?.message || err.message || 'Gagal mengupdate biaya')
  } finally {
    console.log('🔷 END EDIT MODAL SUBMIT')
    editModal.loading = false
  }
}

onMounted(async () => {
  await fetchCoaExpenses()
  await fetchExpenses()
})

// Payment modal - for confirmed expenses
function openPaymentModal(row) {
  // TODO: Implement payment functionality like in PO/SO/WO
  alert(`Payment untuk biaya ${row.nomor} - jumlah ${formatCurrency(row.jumlah)}`)
}
</script>

<style scoped></style>
