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
            <th class="p-4 text-left font-semibold text-blue-700">Terdaftar</th>
            <th class="p-4 text-left font-semibold text-blue-700">Ditangani</th>
            <th class="p-4 text-left font-semibold text-blue-700">Selesai</th>
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
            <td class="p-4 text-gray-700">{{ order.workOrderNumber }}</td>
            <td class="p-4 text-gray-700">{{ order.customerName }}</td>
            <td class="p-4 text-gray-700">{{ order.registerDate }}</td>
            <td class="p-4 text-gray-700">{{ order.handledBy }}</td>
            <td class="p-4 text-gray-700">{{ order.estimatedFinish }}</td>
            <td class="p-4 text-gray-700">{{ order.serviceType }}</td>
            <td class="p-4">
              <span
                class="inline-block px-3 py-1 rounded-full text-xs font-bold"
                :class="
                  order.status === 'Progress'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-blue-100 text-blue-600'
                "
              >
                {{ order.status }}
              </span>
            </td>
            <td class="p-4">
              <button
                @click="showSalesOrder(order)"
                class="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-4 py-2 rounded-full shadow hover:scale-105 transition-all duration-200 font-bold"
              >
                SO
              </button>
              <button
                @click="showRepairNotes(order)"
                class="bg-gradient-to-r from-green-500 to-teal-400 text-white px-4 py-2 rounded-full shadow hover:scale-105 transition-all duration-200 font-bold ml-2"
              >
                Catatan
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
        <div class="mt-2"><strong>Nomor Work Order:</strong> {{ order.workOrderNumber }}</div>
        <div><strong>Nama Pelanggan:</strong> {{ order.customerName }}</div>
        <div><strong>Tanggal Terdaftar:</strong> {{ order.registerDate }}</div>
        <div><strong>Ditangani Oleh:</strong> {{ order.handledBy }}</div>
        <div><strong>Estimasi Selesai:</strong> {{ order.estimatedFinish }}</div>
        <div><strong>Jenis Layanan:</strong> {{ order.serviceType }}</div>
        <!-- Status with conditional color -->
        <div class="text-center mt-2">
          <span
            class="inline-block px-3 py-1 rounded-full text-xs font-bold"
            :class="
              order.status === 'Progress'
                ? 'bg-green-100 text-green-600'
                : 'bg-blue-100 text-blue-600'
            "
          >
            {{ order.status }}
          </span>
        </div>
        <div class="mt-4 flex gap-2">
          <button
            @click="showSalesOrder(order)"
            class="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-4 py-2 rounded-full shadow hover:scale-105 transition-all duration-200 font-bold w-full"
          >
            Sales Order
          </button>
          <button
            @click="showRepairNotes(order)"
            class="bg-gradient-to-r from-green-500 to-teal-400 text-white px-4 py-2 rounded-full shadow hover:scale-105 transition-all duration-200 font-bold w-full"
          >
            Catatan Perbaikan
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      showSalesOrderModal: false,
      showRepairNotesModal: false,
      selectedOrder: null,
      orders: [
        {
          workOrderNumber: 'WO001',
          customerName: 'John Doe',
          registerDate: '2025-08-20 10:00',
          handledBy: 'Alice',
          estimatedFinish: '2025-08-21 12:00',
          serviceType: 'Perbaikan',
          status: 'Progress',
          salesOrder: {
            items: [
              { name: 'Suku Cadang A', price: 500000 },
              { name: 'Jasa Perbaikan', price: 300000 },
            ],
          },
          repairNotes: 'Mengganti bagian mesin.',
        },
        {
          workOrderNumber: 'WO002',
          customerName: 'Maria Sari',
          registerDate: '2025-08-19 09:30',
          handledBy: 'Bob',
          estimatedFinish: '2025-08-20 14:00',
          serviceType: 'Modifikasi',
          status: 'Selesai',
          salesOrder: {
            items: [
              { name: 'Service Rutin', price: 2000000 },
              { name: 'Jasa Modifikasi', price: 1500000 },
            ],
          },
          repairNotes: 'Service, Menambahkan body kit dan aksesori.',
        },
        {
          workOrderNumber: 'WO003',
          customerName: 'Ali Rahman',
          registerDate: '2025-08-18 15:45',
          handledBy: 'Charlie',
          estimatedFinish: '2025-08-22 10:00',
          serviceType: 'Penggantian Suku Cadang',
          status: 'Progress',
          salesOrder: {
            items: [
              { name: 'Suku Cadang B', price: 800000 },
              { name: 'Jasa Penggantian', price: 400000 },
            ],
          },
          repairNotes: 'Penggantian Freon.',
        },
        {
          workOrderNumber: 'WO004',
          customerName: 'Tina Amalia',
          registerDate: '2025-08-17 11:00',
          handledBy: 'David',
          estimatedFinish: '2025-08-19 13:00',
          serviceType: 'Service Rutin',
          status: 'Selesai',
          salesOrder: {
            items: [
              { name: 'Penggantian Filter', price: 150000 },
              { name: 'Jasa Service', price: 500000 },
            ],
          },
          repairNotes: 'Service rutin dan penggantian filter.',
        },
        {
          workOrderNumber: 'WO005',
          customerName: 'Budi Setiawan',
          registerDate: '2025-08-16 14:00',
          handledBy: 'Emma',
          estimatedFinish: '2025-08-18 17:00',
          serviceType: 'Perbaikan',
          status: 'Progress',
          salesOrder: {
            items: [
              { name: 'Suku Cadang AC', price: 600000 },
              { name: 'Jasa Perbaikan', price: 350000 },
            ],
          },
          repairNotes: 'Perbaikan mesin dan sistem kelistrikan.',
        },
        {
          workOrderNumber: 'WO006',
          customerName: 'Siti Fatimah',
          registerDate: '2025-08-15 13:30',
          handledBy: 'Grace',
          estimatedFinish: '2025-08-16 15:00',
          serviceType: 'Modifikasi',
          status: 'Progress',
          salesOrder: {
            items: [
              { name: 'Body Bracket Custom', price: 1200000 },
              { name: 'Jasa Modifikasi', price: 1000000 },
            ],
          },
          repairNotes: 'Modifikasi body bracket dan cat .',
        },
        {
          workOrderNumber: 'WO007',
          customerName: 'Rahmad Hidayat',
          registerDate: '2025-08-14 10:00',
          handledBy: 'Harry',
          estimatedFinish: '2025-08-18 09:00',
          serviceType: 'Perbaikan',
          status: 'Progress',
          salesOrder: {
            items: [
              { name: 'Pipa Dalam', price: 250000 },
              { name: 'Jasa Penggantian', price: 200000 },
            ],
          },
          repairNotes: 'Penggantian pipa dalam.',
        },
        {
          workOrderNumber: 'WO008',
          customerName: 'Fajar Nugroho',
          registerDate: '2025-08-13 12:30',
          handledBy: 'Ivy',
          estimatedFinish: '2025-08-14 16:00',
          serviceType: 'Service Rutin',
          status: 'Selesai',
          salesOrder: {
            items: [
              { name: 'Filter Udara', price: 100000 },
              { name: 'Jasa Service', price: 600000 },
            ],
          },
          repairNotes: 'Pemeriksaan dan penggantian filter udara.',
        },
        {
          workOrderNumber: 'WO009',
          customerName: 'Dewi Lestari',
          registerDate: '2025-08-12 10:15',
          handledBy: 'Jack',
          estimatedFinish: '2025-08-16 14:00',
          serviceType: 'Modifikasi',
          status: 'Progress',
          salesOrder: {
            items: [
              { name: 'Spoiler', price: 500000 },
              { name: 'Jasa Modifikasi', price: 450000 },
            ],
          },
          repairNotes: 'Menambah spoiler dan pengaturan Rute Pipa Indoor.',
        },
        {
          workOrderNumber: 'WO010',
          customerName: 'Eko Prasetyo',
          registerDate: '2025-08-11 09:45',
          handledBy: 'Liam',
          estimatedFinish: '2025-08-13 12:00',
          serviceType: 'Penggantian Suku Cadang',
          status: 'Selesai',
          salesOrder: {
            items: [
              { name: 'Filter dan Spare Part', price: 150000 },
              { name: 'Jasa Penggantian', price: 200000 },
            ],
          },
          repairNotes: 'Penggantian filter dan pembersihan sistem pendinginan.',
        },

        // Add more orders if needed
      ],
    }
  },
  computed: {
    filteredOrders() {
      const searchText = this.searchQuery.toLowerCase()
      return this.orders.filter((order) => {
        return (
          order.workOrderNumber.toLowerCase().includes(searchText) ||
          order.customerName.toLowerCase().includes(searchText)
        )
      })
    },
  },
  methods: {
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
