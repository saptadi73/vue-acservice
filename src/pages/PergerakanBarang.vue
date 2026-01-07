<template>
  <div class="p-6 space-y-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-gray-800">Laporan Pergerakan Barang</h2>
        <p class="text-sm text-gray-500">Sumber: /api/reports/product-movements</p>
      </div>
      <div class="flex gap-2">
        <button
          @click="resetFilters"
          class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 border"
        >
          Reset
        </button>
        <button
          @click="fetchReport"
          :disabled="isLoading"
          class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          <span v-if="!isLoading">Terapkan</span>
          <span v-else>Memuat...</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 bg-white p-4 rounded-lg shadow">
      <div class="md:col-span-2">
        <label class="block text-sm text-gray-700 mb-1">Pencarian Produk/Transaksi</label>
        <input
          v-model="filters.search"
          type="text"
          placeholder="Cari nama produk, kode, brand, catatan"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm text-gray-700 mb-1">Tanggal Awal</label>
        <input
          v-model="filters.startDate"
          type="date"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm text-gray-700 mb-1">Tanggal Akhir</label>
        <input
          v-model="filters.endDate"
          type="date"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm text-gray-700 mb-1">Jenis Pergerakan</label>
        <select
          v-model="filters.moveType"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Semua</option>
          <option value="in">Barang Masuk</option>
          <option value="out">Barang Keluar</option>
        </select>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
      <div>
        Periode:
        <span class="font-semibold">{{ filters.startDate }} s/d {{ filters.endDate }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span>Baris per halaman:</span>
        <select
          v-model.number="pagination.perPage"
          class="px-2 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
        >
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
      </div>
    </div>

    <div class="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 text-gray-700">
          <tr>
            <th class="px-4 py-3 text-left">Tanggal</th>
            <th class="px-4 py-3 text-left">Produk</th>
            <th class="px-4 py-3 text-left">Kode</th>
            <th class="px-4 py-3 text-left">Brand</th>
            <th class="px-4 py-3 text-left">Satuan</th>
            <th class="px-4 py-3 text-left">Jenis</th>
            <th class="px-4 py-3 text-right">Qty Masuk</th>
            <th class="px-4 py-3 text-right">Qty Keluar</th>
            <th class="px-4 py-3 text-right">Stok Awal</th>
            <th class="px-4 py-3 text-right">Stok Akhir</th>
            <th class="px-4 py-3 text-left">Catatan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="11" class="px-4 py-6 text-center text-gray-500">Memuat data...</td>
          </tr>
          <tr v-else-if="paginatedRows.length === 0">
            <td colspan="11" class="px-4 py-6 text-center text-gray-500">Tidak ada data</td>
          </tr>
          <tr v-else v-for="row in paginatedRows" :key="row.id" class="border-t">
            <td class="px-4 py-2">{{ formatDate(row.date) }}</td>
            <td class="px-4 py-2 font-medium text-gray-900">{{ row.productName }}</td>
            <td class="px-4 py-2">{{ row.productCode || '-' }}</td>
            <td class="px-4 py-2">{{ row.brand || '-' }}</td>
            <td class="px-4 py-2">{{ row.uom || '-' }}</td>
            <td class="px-4 py-2 capitalize">{{ row.moveType || '-' }}</td>
            <td class="px-4 py-2 text-right text-emerald-700">{{ row.qtyIn }}</td>
            <td class="px-4 py-2 text-right text-rose-700">{{ row.qtyOut }}</td>
            <td class="px-4 py-2 text-right">{{ row.stockBefore }}</td>
            <td class="px-4 py-2 text-right">{{ row.stockAfter }}</td>
            <td class="px-4 py-2 max-w-xs truncate" :title="row.note">{{ row.note || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
      <div>Menampilkan {{ paginatedRows.length }} dari {{ filteredRows.length }} transaksi</div>
      <div class="flex items-center gap-2">
        <button
          @click="goToPage(pagination.page - 1)"
          :disabled="pagination.page === 1"
          class="px-3 py-1 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
        >
          Prev
        </button>
        <span>Halaman {{ pagination.page }} / {{ totalPages }}</span>
        <button
          @click="goToPage(pagination.page + 1)"
          :disabled="pagination.page >= totalPages"
          class="px-3 py-1 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { computed, onMounted, reactive, ref } from 'vue'
import { BASE_URL } from '../base.utils.url.ts'

const isLoading = ref(false)
const reportItems = ref([])

const filters = reactive({
  search: '',
  startDate: getDefaultStartDate(),
  endDate: getDefaultEndDate(),
  moveType: 'all',
})

const pagination = reactive({
  page: 1,
  perPage: 10,
})

const flattenedRows = computed(() => {
  return reportItems.value.flatMap((item) => {
    return (item.transactions || []).map((tx, idx) => ({
      id: `${item.product.id || item.product.nama || 'prod'}-${idx}-${tx.date}`,
      date: tx.date,
      productName: item.product?.nama || '-',
      productCode: item.product?.kode,
      brand: item.product?.brand,
      uom: item.product?.satuan,
      moveType: tx.move_type,
      qtyIn: tx.qty_in,
      qtyOut: tx.qty_out,
      stockBefore: tx.stock_before,
      stockAfter: tx.stock_after,
      note: tx.note,
    }))
  })
})

const filteredRows = computed(() => {
  const q = filters.search.trim().toLowerCase()
  const bySearch = !q
    ? flattenedRows.value
    : flattenedRows.value.filter((row) => {
        return (
          (row.productName || '').toLowerCase().includes(q) ||
          (row.productCode || '').toLowerCase().includes(q) ||
          (row.brand || '').toLowerCase().includes(q) ||
          (row.moveType || '').toLowerCase().includes(q) ||
          (row.note || '').toLowerCase().includes(q)
        )
      })

  if (filters.moveType === 'all') return bySearch
  if (filters.moveType === 'in') {
    return bySearch.filter(
      (row) => Number(row.qtyIn) > 0 || (row.moveType || '').toLowerCase().includes('in'),
    )
  }
  if (filters.moveType === 'out') {
    return bySearch.filter(
      (row) => Number(row.qtyOut) > 0 || (row.moveType || '').toLowerCase().includes('out'),
    )
  }
  return bySearch
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredRows.value.length / pagination.perPage))
})

const paginatedRows = computed(() => {
  const start = (pagination.page - 1) * pagination.perPage
  return filteredRows.value.slice(start, start + pagination.perPage)
})

function getDefaultStartDate() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
}

function getDefaultEndDate() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function goToPage(page) {
  pagination.page = Math.min(Math.max(page, 1), totalPages.value)
}

function resetFilters() {
  filters.search = ''
  filters.startDate = getDefaultStartDate()
  filters.endDate = getDefaultEndDate()
  pagination.page = 1
  fetchReport()
}

function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  return date.toLocaleString('id-ID')
}

async function fetchReport() {
  isLoading.value = true
  try {
    const params = {
      start_date: filters.startDate,
      end_date: filters.endDate,
    }

    console.log('Fetching product movements with params:', params)

    const response = await axios.get(`${BASE_URL}api/reports/product-movements`, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('API response status:', response.status)
    console.log('API response data:', response.data)

    if (response.data?.status && response.data?.data?.items) {
      reportItems.value = response.data.data.items
      pagination.page = 1
    } else {
      console.warn('Unexpected API shape, fallback to empty items')
      reportItems.value = []
    }
  } catch (error) {
    console.error('Gagal memuat laporan pergerakan barang:', error)
    if (error.response) {
      console.error('Response status:', error.response.status)
      console.error('Response data:', error.response.data)
    }
    if (error.request) {
      console.error('No response received. Request:', error.request)
    }
    reportItems.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchReport()
})
</script>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0;
}

th:first-child,
td:first-child {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

th:last-child,
td:last-child {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}
</style>
