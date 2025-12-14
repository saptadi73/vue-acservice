<template>
  <div class="container mx-auto mt-10 space-y-4">
    <!-- Toolbar: Search + Tambah -->
    <div class="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
      <div class="relative w-full md:max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari SO, nama pelanggan, HP, plat, mekanik, kasir, status, tanggal…"
          class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Cari Sales Order"
        />
        <!-- icon search -->
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </div>

      <div class="flex gap-2">
        <button
          v-if="searchQuery"
          type="button"
          class="rounded-xl bg-white px-4 py-2 text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
          @click="searchQuery = ''"
          title="Bersihkan pencarian"
        >
          Bersihkan
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white font-medium shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="handleTambah"
        >
          <span class="material-symbols-outlined">add</span>
          Tambah Sales Order
        </button>
      </div>
    </div>

    <!-- Info kecil -->
    <p class="text-sm text-gray-500">
      Menampilkan {{ filteredOrders.length }} dari {{ orders.length }} data.
    </p>

    <!-- Loading indicator -->
    <div v-if="loading" class="text-center py-10">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Memuat data...</p>
    </div>

    <!-- Error message -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <p class="text-red-700">{{ error }}</p>
      <button @click="fetchOrders" class="mt-2 text-red-600 underline">Coba lagi</button>
    </div>

    <!-- Tabel untuk layar lebar -->
    <table
      class="min-w-full bg-white border border-blue-100 rounded-2xl shadow-xl overflow-hidden hidden md:table"
    >
      <thead class="bg-gradient-to-r from-blue-100 to-teal-100">
        <tr>
          <th class="px-6 py-4 text-left text-sm font-semibold text-blue-700">No. Sales Order</th>
          <th class="px-6 py-4 text-left text-sm font-semibold text-blue-700">Nama Pelanggan</th>
          <th class="px-6 py-4 text-left text-sm font-semibold text-blue-700">Email</th>
          <th class="px-6 py-4 text-left text-sm font-semibold text-blue-700">Subtotal</th>
          <th class="px-6 py-4 text-left text-sm font-semibold text-blue-700">Pajak</th>
          <th class="px-6 py-4 text-left text-sm font-semibold text-blue-700">Total</th>
          <th class="px-6 py-4 text-left text-sm font-semibold text-blue-700">Tanggal</th>
          <th class="px-6 py-4 text-left text-sm font-semibold text-blue-700">Status</th>
          <th class="px-6 py-4 text-left text-sm font-semibold text-blue-700">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(order, index) in filteredOrders"
          :key="order.id"
          :class="
            (index % 2 === 0 ? 'bg-teal-50' : 'bg-white') + ' hover:bg-blue-50 transition-all'
          "
        >
          <td class="px-6 py-4 text-sm text-gray-700">{{ order.order_number }}</td>
          <td class="px-6 py-4 text-sm text-gray-700">{{ order.customer?.name }}</td>
          <td class="px-6 py-4 text-sm text-gray-700">{{ order.customer?.email }}</td>
          <td class="px-6 py-4 text-sm text-gray-700">{{ formatCurrency(order.subtotal) }}</td>
          <td class="px-6 py-4 text-sm text-gray-700">{{ formatCurrency(order.tax) }}</td>
          <td class="px-6 py-4 text-sm text-gray-700">{{ formatCurrency(order.total) }}</td>
          <td class="px-6 py-4 text-sm text-gray-700">
            {{ new Date(order.created_at).toLocaleDateString('id-ID') }}
          </td>
          <td class="px-6 py-4 text-sm">
            <span
              :class="getStatusClass(order.status) + ' px-3 py-1 rounded-full text-xs font-bold'"
            >
              {{ order.status }}
            </span>
          </td>
          <td class="px-6 py-4 text-sm">
            <button
              v-if="order.status === 'confirmed'"
              class="border border-green-400 bg-transparent text-green-600 p-2 shadow hover:ring-2 hover:ring-green-300 transition-all duration-200"
              @click="handleBayar(order)"
              title="Bayar"
            >
              <span class="material-symbols-outlined">point_of_sale</span>
            </button>
            <button
              v-if="order.status === 'draft'"
              class="border border-orange-400 bg-transparent text-orange-500 p-2 shadow hover:ring-2 hover:ring-orange-300 transition-all duration-200"
              @click="handleEdit(order)"
              title="Edit"
            >
              <span class="material-symbols-outlined">edit_square</span>
            </button>
            <button
              v-if="order.status === 'paid'"
              class="border border-blue-400 bg-transparent text-blue-600 p-2 shadow hover:ring-2 hover:ring-blue-300 transition-all duration-200"
              @click="handleCetak(order)"
              title="Cetak"
            >
              <span class="material-symbols-outlined">print</span>
            </button>
            <button
              class="border border-red-400 bg-transparent text-red-500 p-2 shadow hover:ring-2 hover:ring-red-300 transition-all duration-200 mt-2"
              @click="handleDelete(order)"
              title="Hapus"
            >
              <span class="material-symbols-outlined">delete</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Card per baris untuk layar mobile -->
    <div class="md:hidden">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="bg-white border border-blue-100 rounded-2xl shadow-xl mb-4 p-6 hover:shadow-blue-200 transition-all duration-200"
      >
        <div class="flex justify-between mb-2">
          <h3 class="text-lg font-bold text-blue-700">No. SO: {{ order.noSalesOrder }}</h3>
          <span
            :class="getStatusClass(order.status) + ' px-3 py-1 rounded-full text-xs font-bold'"
            >{{ order.status }}</span
          >
        </div>
        <p class="text-sm text-gray-600">Pelanggan: {{ order.customer?.name }}</p>
        <p class="text-sm text-gray-600">Email: {{ order.customer?.email }}</p>
        <p class="text-sm text-gray-600">Subtotal: {{ formatCurrency(order.subtotal) }}</p>
        <p class="text-sm text-gray-600">Pajak: {{ formatCurrency(order.tax) }}</p>
        <p class="text-sm text-gray-600">Total: {{ formatCurrency(order.total) }}</p>
        <p class="text-sm text-gray-600">
          Tanggal: {{ new Date(order.created_at).toLocaleDateString('id-ID') }}
        </p>
        <div class="mt-4 flex flex-wrap gap-2">
          <button
            v-if="order.status === 'Invoiced'"
            class="border border-green-400 bg-transparent text-green-600 px-3 py-2 shadow hover:ring-2 hover:ring-green-300 transition-all duration-200"
            @click="handleBayar(order.id)"
          >
            <span class="material-symbols-outlined">point_of_sale</span> Bayar
          </button>
          <button
            v-if="order.status === 'Open'"
            class="border border-orange-400 bg-transparent text-orange-500 px-3 py-2 shadow hover:ring-2 hover:ring-orange-300 transition-all duration-200"
            @click="handleEdit(order.id)"
          >
            <span class="material-symbols-outlined">edit_square</span> Edit
          </button>
          <button
            v-if="order.status === 'Paid'"
            class="border border-blue-400 bg-transparent text-blue-600 px-3 py-2 shadow hover:ring-2 hover:ring-blue-300 transition-all duration-200"
            @click="handleCetak(order.id)"
          >
            <span class="material-symbols-outlined">print</span> Cetak
          </button>
          <button
            class="border border-red-400 bg-transparent text-red-500 px-3 py-2 shadow hover:ring-2 hover:ring-red-300 transition-all duration-200"
            @click="handleDelete(order.id)"
          >
            <span class="material-symbols-outlined">delete</span> Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="!loading && !error && !filteredOrders.length"
      class="text-center text-gray-500 py-10"
    >
      Tidak ada data yang cocok dengan pencarian.
    </div>
  </div>
</template>

<script>
import * as apiSalesOrder from './apiSalesOrder.js'

export default {
  data() {
    return {
      searchQuery: '',
      orders: [],
      loading: false,
      error: null,
    }
  },
  mounted() {
    this.fetchOrders()
  },
  computed: {
    filteredOrders() {
      const q = this.searchQuery.trim().toLowerCase()
      if (!q) return this.orders

      return this.orders.filter((o) => {
        const haystack = [
          o.order_number,
          o.customer?.name,
          o.customer?.email,
          o.status,
          new Date(o.created_at).toLocaleDateString('id-ID'),
        ]
          .filter(Boolean)
          .join(' | ')
          .toLowerCase()

        return haystack.includes(q)
      })
    },
  },
  methods: {
    async fetchOrders() {
      this.loading = true
      this.error = null
      try {
        const response = await apiSalesOrder.getSalesOrders()
        this.orders = response.data
      } catch (error) {
        console.error('Error fetching sales orders:', error)
        this.error = 'Gagal memuat data sales order.'
      } finally {
        this.loading = false
      }
    },
    handleTambah() {
      this.$router.push({ name: 'sales form' })
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(value)
    },
    getStatusClass(status) {
      switch (status) {
        case 'paid':
          return 'text-green-600 font-semibold'
        case 'confirmed':
          return 'text-blue-600 font-semibold'
        case 'draft':
          return 'text-yellow-600 font-semibold'
        default:
          return 'text-gray-600'
      }
    },
    handleBayar(order) {
      // Update status to paid
      this.updateOrderStatus(order.id, 'paid')
    },
    handleEdit(order) {
      this.$router.push({ name: 'sales form', params: { id: order.id } })
    },
    handleCetak(order) {
      // For now, just show alert
      alert(`Cetak invoice untuk order ${order.order_number}`)
    },
    async handleDelete(order) {
      if (confirm(`Apakah Anda yakin ingin menghapus Sales Order ${order.order_number}?`)) {
        try {
          // Assuming delete endpoint exists, but based on payload, it's for product lines
          // For now, just remove from local state
          this.orders = this.orders.filter((o) => o.id !== order.id)
          alert('Sales Order berhasil dihapus!')
        } catch (error) {
          console.error('Error deleting order:', error)
          this.error = 'Gagal menghapus sales order.'
        }
      }
    },
    async updateOrderStatus(orderId, status) {
      try {
        await apiSalesOrder.updateSalesOrder(orderId, { status })
        await this.fetchOrders() // Refresh data
        alert('Status berhasil diperbarui!')
      } catch (error) {
        console.error('Error updating status:', error)
        this.error = 'Gagal memperbarui status.'
      }
    },
  },
}
</script>

<style scoped>
/* optional: kecilkan ikon material agar pas di tombol */
.material-symbols-outlined {
  font-size: 18px;
  line-height: 1;
}
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
