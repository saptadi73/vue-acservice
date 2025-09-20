<template>
  <div
    class="p-8 space-y-8 bg-gradient-to-br from-blue-50 via-white to-teal-50 min-h-screen rounded-2xl shadow-xl"
  >
    <div class="flex flex-col items-center mb-8">
      <div class="flex items-center gap-3">
        <span class="inline-block bg-blue-100 p-3 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 17v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m16-2a4 4 0 00-4-4h-1a4 4 0 00-4 4v2m6-2a4 4 0 00-4-4h-1a4 4 0 00-4 4v2"
            />
          </svg>
        </span>
        <h1 class="text-3xl font-bold text-blue-700 font-lexend tracking-wide">Table Work Order</h1>
      </div>
      <div class="w-24 h-1 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full mt-4"></div>
    </div>
    <!-- Search Bar -->
    <div class="mb-6 flex justify-center">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari Work Order..."
        class="px-6 py-3 border-2 border-blue-200 rounded-full w-full max-w-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-lg"
      />
    </div>

    <!-- Table Work Order (Visible on 2xl screens) -->
    <div class="overflow-x-auto hidden ipad:block">
      <table
        class="min-w-full font-montserrat bg-white border border-blue-100 rounded-2xl shadow-xl overflow-hidden"
      >
        <thead class="bg-gradient-to-r from-blue-100 to-teal-100 text-sm">
          <tr>
            <th class="p-4 text-left font-semibold text-blue-700">#</th>
            <th class="p-4 text-left font-semibold text-blue-700">No.</th>
            <th class="p-4 text-left font-semibold text-blue-700">Nama</th>
            <th class="p-4 text-left font-semibold text-blue-700">HP</th>
            <th class="p-4 text-left font-semibold text-blue-700">Terdaftar</th>
            <th class="p-4 text-left font-semibold text-blue-700">Ditangani</th>
            <th class="p-4 text-left font-semibold text-blue-700">Layanan</th>
            <th class="p-4 text-left font-semibold text-blue-700">Status</th>
            <th class="p-4 text-left font-semibold text-blue-700">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(order, index) in filteredOrders"
            :key="order.workOrderNumber"
            :class="
              (order.status === 'Progress' ? 'bg-teal-50' : 'bg-white') +
              ' hover:bg-blue-50 transition-all text-sm'
            "
          >
            <td class="p-4 font-medium text-gray-800">{{ index + 1 }}</td>
            <td class="p-4 text-gray-700">{{ order.nowo }}</td>
            <td class="p-4 text-gray-700">{{ order.nama_pelanggan }}</td>
            <td class="p-4 text-gray-700">{{ order.hp }}</td>
            <td class="p-4 text-gray-700">{{ formatDateIndo(order.tanggal) }}</td>
            <td class="p-4 text-gray-700">{{ order.nama_pegawai }}</td>
            <td class="p-4 text-gray-700">{{ order.jenis }}</td>
            <td class="p-4">
              <span
                class="inline-block px-3 py-1 rounded-full text-xs font-bold"
                :class="{
                  'bg-green-100 text-green-600': order.status === 'open',
                  'bg-yellow-100 text-yellow-700': order.status === 'waiting signature',
                  'bg-red-100 text-red-600': order.status === 'selesai',
                }"
              >
                {{ order.status }}
              </span>
            </td>
            <td class="p-4">
              <button
                @click="goToWorkOrder(order)"
                class="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-4 py-2 rounded-full shadow hover:scale-105 transition-all duration-200 font-bold"
              >
                WO
              </button>
              <button
                v-if="order.status === 'waiting signature'"
                @click="goToSignWorkOrder(order)"
                class="bg-gradient-to-r from-green-500 to-teal-400 text-white px-4 py-2 rounded-full shadow hover:scale-105 transition-all duration-200 font-bold ml-2"
              >
                Tanda Tangan
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Work Order as Cards (Visible on smaller screens) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ipad:hidden">
      <div
        v-for="(order, index) in filteredOrders"
        :key="order.workOrderNumber"
        class="bg-white border border-blue-100 rounded-2xl shadow-xl p-6 hover:shadow-blue-200 transition-all duration-200"
      >
        <div class="font-semibold text-blue-700 text-lg">#{{ index + 1 }}</div>
        <div class="mt-2"><strong>Nomor Work Order:</strong> {{ order.nowo }}</div>
        <div><strong>Nama Pelanggan:</strong> {{ order.nama_pelanggan }}</div>
        <div><strong>HP:</strong> {{ order.hp }}</div>
        <div><strong>Tanggal Terdaftar:</strong> {{ formatDateIndo(order.tanggal) }}</div>
        <div><strong>Ditangani Oleh:</strong> {{ order.nama_pegawai }}</div>
        <div><strong>Jenis Layanan:</strong> {{ order.jenis }}</div>
        <!-- Status with conditional color -->
        <div class="text-center mt-2">
          <span
            class="inline-block px-3 py-1 rounded-full text-xs font-bold"
            :class="{
              'bg-green-100 text-green-600': order.status === 'open',
              'bg-yellow-100 text-yellow-700': order.status === 'waiting signature',
              'bg-red-100 text-red-600': order.status === 'selesai',
            }"
          >
            {{ order.status }}
          </span>
        </div>
        <div class="mt-4 flex gap-2">
          <button
            @click="goToWorkOrder(order)"
            class="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-4 py-2 rounded-full shadow hover:scale-105 transition-all duration-200 font-bold w-full"
          >
            Work Order
          </button>
          <button
            v-if="order.status === 'waiting signature'"
            @click="goToSignWorkOrder(order)"
            class="bg-gradient-to-r from-green-500 to-teal-400 text-white px-4 py-2 rounded-full shadow hover:scale-105 transition-all duration-200 font-bold w-full"
          >
            Tanda Tangan
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Sales Order -->
    <div
      v-if="showSalesOrderModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg w-1/2">
        <h2 class="text-2xl font-bold text-center mb-4">
          Sales Order - {{ selectedOrder.workOrderNumber }}
        </h2>

        <!-- Customer Details -->
        <div class="space-y-4 mb-6">
          <h3 class="text-lg font-semibold">Customer Details</h3>
          <div>
            <p><strong>Customer Name:</strong> {{ selectedOrder.customerName }}</p>
            <p><strong>Work Order Number:</strong> {{ selectedOrder.workOrderNumber }}</p>
          </div>
        </div>

        <!-- Sales Order Items -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Sales Order Items</h3>
          <table class="min-w-full table-auto mb-4">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left">Item</th>
                <th class="px-4 py-2 text-left">Price</th>
                <th class="px-4 py-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in selectedOrder.salesOrder.items" :key="item.name">
                <td class="px-4 py-2">{{ item.name }}</td>
                <td class="px-4 py-2">{{ formatCurrency(item.price) }}</td>
                <td class="px-4 py-2">{{ formatCurrency(item.price) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Total Estimation -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Total Estimation</h3>
          <div class="flex justify-between mb-2">
            <span class="font-semibold">Subtotal:</span>
            <span>{{ formatCurrency(getTotalPrice()) }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="font-semibold">Tax (10%):</span>
            <span>{{ formatCurrency(getTotalPrice() * 0.1) }}</span>
          </div>
          <div class="flex justify-between mb-4">
            <span class="font-semibold">Total:</span>
            <span class="text-lg font-bold">{{ formatCurrency(getTotalPrice() * 1.1) }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-between mt-6">
          <button @click="closeSalesOrderModal" class="bg-red-500 text-white px-4 py-2 rounded">
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Catatan Perbaikan (Buku Bergaris) -->
    <div
      v-if="showRepairNotesModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg w-1/2">
        <h2 class="text-2xl font-semibold mb-4 text-center">
          Catatan Perbaikan untuk {{ selectedOrder.workOrderNumber }}
        </h2>

        <!-- Buku Bergaris -->
        <div
          class="border-2 p-6 bg-gray-50 rounded-lg bg-[url('https://cdn.pixabay.com/photo/2017/08/30/02/47/letter-2695307_960_720.jpg')] bg-cover bg-no-repeat bg-center"
        >
          <div class="overflow-y-auto h-96 p-4 text-gray-800">
            <p class="text-sm">{{ selectedOrder.repairNotes }}</p>
          </div>
        </div>

        <div class="mt-6 flex justify-between">
          <button @click="closeRepairNotesModal" class="bg-red-500 text-white px-4 py-2 rounded">
            Tutup
          </button>
        </div>
      </div>
    </div>
    <loading-overlay />
    <toast-card v-if="show_toast" :message="message_toast" @close="tutupToast" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { BASE_URL } from '@/base.utils.url'
import { useLoadingStore } from '../stores/loading'
import LoadingOverlay from '../components/LoadingOverlay.vue'
import ToastCard from '@/components/ToastCard.vue'
import { useRouter } from 'vue-router'

export default {
  components: {
    LoadingOverlay,
    ToastCard,
  },
  data() {
    return {
      searchQuery: '',
      showSalesOrderModal: false,
      showRepairNotesModal: false,
      selectedOrder: null,
      orders: [],
    }
  },
  created() {
    this.getWorkOrders()
    this.router = this.$router || this.router // fallback jika belum ada
  },
  computed: {
    filteredOrders() {
      const searchText = this.searchQuery.toLowerCase()
      return this.orders.filter((order) => {
        return (
          order.nowo.toLowerCase().includes(searchText) ||
          order.nama_pelanggan.toLowerCase().includes(searchText) ||
          order.nama_pegawai.toLowerCase().includes(searchText)
        )
      })
    },
  },
  setup() {
    const route = useRoute()
    const loadingStore = useLoadingStore()
    const loading = ref(false)
    const show_toast = ref(false)
    const message_toast = ref('')
    const router = useRouter()

    onMounted(() => {
      // You can fetch initial data here if needed
    })

    return {
      router,
      route,
      loadingStore,
      loading,
      show_toast,
      message_toast,
    }
  },
  methods: {
    tutupToast() {
      this.show_toast = false
    },

    goToWorkOrder(order) {
      const link = this.getLinkToWorkOrder(order)
      // const link = '/pelanggan/all'
      this.$router.push(link)
      console.log('Navigating to:', link)
    },

    goToSignWorkOrder(order) {
      const link = this.getLinkToSignWorkOrder(order)
      // const link = '/pelanggan/all'
      this.$router.push(link)
      console.log('Navigating to:', link)
    },

    getLinkToWorkOrder(order) {
      switch (order.jenis) {
        case 'pemeliharaan':
          return `/wo/service/update/${order.work_order_ac_service.id}`
        case 'penjualan':
          return `/wo/penjualan/update/${order.workorder_penjualan.id}`
        case 'penyewaan':
          return `/wo/sewa/update/${order.workorder_penyewaan.id}`
        default:
          return `/wo/service/update/${order.work_order_ac_service.id}`
      }
    },

    getLinkToSignWorkOrder(order) {
      switch (order.jenis) {
        case 'pemeliharaan':
          return `/wo/service/sign/${order.work_order_ac_service.customerCode}`
        case 'penjualan':
          return `/wo/penjualan/sign/${order.workorder_penjualan.customerCode}`
        case 'penyewaan':
          return `/wo/penyewaan/sign/${order.workorder_penyewaan.customerCode}`
        default:
          return `/wo/service/sign/${order.work_order_ac_service.customerCode}`
      }
    },

    getWorkOrders() {
      this.loadingStore.show()
      axios
        .get(`${BASE_URL}wo/wo/list`)
        .then((response) => {
          this.orders = response.data.data
          console.log('Work Orders fetched:', this.orders)
        })
        .catch((error) => {
          this.message_toast = error.response?.data?.message || 'Gagal memuat data Work Order.'
          this.show_toast = true
          console.error('Error fetching work orders:', error)
        })
        .finally(() => {
          this.loadingStore.hide()
        })
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(amount)
    },

    // Calculate the total price for the order
    getTotalPrice() {
      return this.selectedOrder.salesOrder.items.reduce((total, item) => total + item.price, 0)
    },

    closeSalesOrderModal() {
      this.showSalesOrderModal = false
    },

    showSalesOrder(order) {
      this.selectedOrder = order
      this.showSalesOrderModal = true
    },

    showRepairNotes(order) {
      this.selectedOrder = order
      this.showRepairNotesModal = true
    },

    closeRepairNotesModal() {
      this.showRepairNotesModal = false
    },

    formatDateIndo(dateStr) {
      if (!dateStr) return '-'
      const date = new Date(dateStr)
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    },
  },
}
</script>

<style scoped>
/* TailwindCSS styles for the modal */
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.bg-opacity-75 {
  background-color: rgba(0, 0, 0, 0.75);
}

.bg-white {
  background-color: white;
}

.rounded-lg {
  border-radius: 8px;
}

.p-6 {
  padding: 1.5rem;
}

.text-xl {
  font-size: 1.25rem;
}

/* Modern Table & Card Styles */
table {
  border-collapse: separate;
  border-spacing: 0;
}
th,
td {
  transition:
    background 0.2s,
    color 0.2s;
}
</style>
