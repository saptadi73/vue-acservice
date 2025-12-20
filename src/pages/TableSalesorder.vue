<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-800">Daftar Sales Order</h1>
      <button
        @click="createNew"
        class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium"
      >
        + Buat Sales Order Baru
      </button>
    </div>

    <!-- Search and Filter Section -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search by Order Number or Customer Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Cari Order atau Pelanggan</label
          >
          <input
            v-model="searchQuery"
            type="text"
            placeholder="No. Order atau nama pelanggan..."
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Filter by Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Filter Status</label>
          <select
            v-model="filterStatus"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="confirmed">Confirmed</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <!-- Reset Button -->
        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition font-medium"
          >
            Reset Filter
          </button>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-gray-500">
        <p>Loading data...</p>
      </div>

      <div v-else-if="filteredSalesOrders.length === 0" class="p-8 text-center text-gray-500">
        <p>Tidak ada data Sales Order</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300">
          <thead class="bg-blue-50">
            <tr>
              <th class="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">No</th>
              <th class="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">
                No. Order
              </th>
              <th class="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">
                Tanggal
              </th>
              <th class="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">
                Pelanggan
              </th>
              <th class="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">
                Alamat
              </th>
              <th class="border border-gray-300 px-4 py-3 text-right text-sm font-semibold">
                Total
              </th>
              <th class="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">
                Status
              </th>
              <th class="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(order, idx) in paginatedSalesOrders"
              :key="order.id"
              class="hover:bg-gray-50"
            >
              <td class="border border-gray-300 px-4 py-3 text-sm">
                {{ (currentPage - 1) * itemsPerPage + idx + 1 }}
              </td>
              <td class="border border-gray-300 px-4 py-3 text-sm font-semibold">
                {{ order.order_number }}
              </td>
              <td class="border border-gray-300 px-4 py-3 text-sm">
                {{ formatDate(order.order_date) }}
              </td>
              <td class="border border-gray-300 px-4 py-3 text-sm">{{ order.nama }}</td>
              <td class="border border-gray-300 px-4 py-3 text-sm">{{ order.alamat }}</td>
              <td class="border border-gray-300 px-4 py-3 text-sm text-right font-semibold">
                {{ formatCurrency(order.total) }}
              </td>
              <td class="border border-gray-300 px-4 py-3 text-center">
                <span
                  :class="{
                    'bg-yellow-100 text-yellow-800': order.status === 'draft',
                    'bg-blue-100 text-blue-800': order.status === 'confirmed',
                    'bg-green-100 text-green-800': order.status === 'paid',
                  }"
                  class="px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {{ capitalizeStatus(order.status) }}
                </span>
              </td>
              <td class="border border-gray-300 px-4 py-3 text-center">
                <div class="flex gap-2 justify-center">
                  <button
                    @click="editOrder(order.id)"
                    class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    @click="openDeleteModal(order.id, order.order_number)"
                    class="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination Section -->
    <div v-if="totalPages > 1" class="bg-white rounded-lg shadow-md p-4">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} -
          {{ Math.min(currentPage * itemsPerPage, filteredSalesOrders.length) }} dari
          {{ filteredSalesOrders.length }} data
        </div>

        <div class="flex gap-2">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Sebelumnya
          </button>

          <div class="flex items-center gap-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              :class="{
                'bg-blue-600 text-white': page === currentPage,
                'border border-gray-300 hover:bg-gray-50': page !== currentPage,
              }"
              class="px-3 py-2 rounded transition"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Selanjutnya →
          </button>
        </div>

        <div class="text-sm text-gray-700">Halaman {{ currentPage }} dari {{ totalPages }}</div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Konfirmasi Hapus</h2>
        <p class="text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus Sales Order <strong>{{ selectedOrderNumber }}</strong
          >?
        </p>
        <div class="flex gap-4">
          <button
            @click="showDeleteModal = false"
            class="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition font-medium"
          >
            Batal
          </button>
          <button
            @click="deleteOrder"
            :disabled="deleting"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-medium disabled:opacity-50"
          >
            {{ deleting ? 'Menghapus...' : 'Hapus' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="notification.show" class="fixed top-4 right-4 z-50">
      <div
        :class="{
          'bg-green-50 border-l-4 border-green-500': notification.type === 'success',
          'bg-red-50 border-l-4 border-red-500': notification.type === 'error',
        }"
        class="p-4 rounded shadow-lg max-w-md"
      >
        <p
          :class="{
            'text-green-800': notification.type === 'success',
            'text-red-800': notification.type === 'error',
          }"
        >
          {{ notification.message }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import api from '@/user/axios'
import { BASE_URL } from '@/base.utils.url'

const router = useRouter()

// State
const salesOrders = ref([])
const loading = ref(false)
const searchQuery = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showDeleteModal = ref(false)
const selectedOrderId = ref(null)
const selectedOrderNumber = ref('')
const deleting = ref(false)
const notification = ref({ show: false, message: '', type: 'success' })

// Computed: Filtered sales orders
const filteredSalesOrders = computed(() => {
  let filtered = salesOrders.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (order) =>
        (order.order_number && order.order_number.toLowerCase().includes(query)) ||
        (order.nama && order.nama.toLowerCase().includes(query)),
    )
  }

  // Filter by status
  if (filterStatus.value) {
    filtered = filtered.filter((order) => order.status === filterStatus.value)
  }

  return filtered
})

// Computed: Paginated sales orders
const paginatedSalesOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredSalesOrders.value.slice(start, end)
})

// Computed: Total pages
const totalPages = computed(() => {
  return Math.ceil(filteredSalesOrders.value.length / itemsPerPage.value)
})

// Computed: Visible pages for pagination
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Format currency
function formatCurrency(num) {
  if (!num || num === 0) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num)
}

// Format date
function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Capitalize status
function capitalizeStatus(status) {
  const map = {
    draft: 'Draft',
    confirmed: 'Confirmed',
    paid: 'Paid',
  }
  return map[status] || status
}

// Show notification
function showNotification(message, type = 'success') {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

// Pagination handlers
function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Reset filters
function resetFilters() {
  searchQuery.value = ''
  filterStatus.value = ''
  currentPage.value = 1
}

// CRUD operations
function createNew() {
  router.push({ name: 'create sales order maintenance' })
}

function editOrder(id) {
  router.push({
    name: 'edit sales order',
    params: { id },
  })
}

function openDeleteModal(id, orderNumber) {
  selectedOrderId.value = id
  selectedOrderNumber.value = orderNumber
  showDeleteModal.value = true
}

async function deleteOrder() {
  if (!selectedOrderId.value) return

  deleting.value = true
  try {
    const response = await api.post(`orders/sale/delete/${selectedOrderId.value}`)
    showNotification(response.data.message || 'Sales Order berhasil dihapus', 'success')

    // Refresh list
    await fetchSalesOrders()
    showDeleteModal.value = false
  } catch (error) {
    console.error('Error deleting sales order:', error)
    const errorMsg = error.response?.data?.message || 'Gagal menghapus Sales Order'
    showNotification(errorMsg, 'error')
  } finally {
    deleting.value = false
  }
}

// Fetch sales orders
async function fetchSalesOrders() {
  loading.value = true
  try {
    const response = await axios.get(`${BASE_URL}orders/sale`)
    salesOrders.value = Array.isArray(response.data.data) ? response.data.data : []
    currentPage.value = 1
    console.log('Sales orders fetched:', salesOrders.value)
  } catch (error) {
    console.error('Error fetching sales orders:', error)
    showNotification('Gagal memuat data Sales Order', 'error')
    salesOrders.value = []
  } finally {
    loading.value = false
  }
}

// Initialize
onMounted(() => {
  fetchSalesOrders()
})
</script>

<style lang="scss" scoped></style>
