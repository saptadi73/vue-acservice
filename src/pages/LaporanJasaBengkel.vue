<template>
  <div class="w-[80vw] mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-gray-800 text-center mb-6">Laporan Jasa AC Service</h2>

    <!-- Search Bar and Date Range -->
    <div class="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
      <!-- Search Bar -->
      <div>
        <label for="search" class="block text-sm font-medium text-gray-700">Cari Jenis Jasa</label>
        <input
          v-model="searchQuery"
          type="text"
          id="search"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Cari jenis jasa..."
        />
      </div>

      <!-- Start Date -->
      <div>
        <label for="startDate" class="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
        <input
          v-model="startDate"
          type="date"
          id="startDate"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- End Date -->
      <div>
        <label for="endDate" class="block text-sm font-medium text-gray-700">Tanggal Selesai</label>
        <input
          v-model="endDate"
          type="date"
          id="endDate"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <!-- Jasa Table -->
    <div class="overflow-x-auto">
      <table
        class="min-w-full table-auto border-collapse bg-white border border-blue-100 rounded-2xl shadow-xl overflow-hidden"
      >
        <thead class="bg-gradient-to-r from-blue-100 to-teal-100">
          <tr>
            <th class="px-4 py-4 text-left font-semibold text-blue-700">No</th>
            <th class="px-4 py-4 text-left font-semibold text-blue-700">Jenis Jasa</th>
            <th class="px-4 py-4 text-left font-semibold text-blue-700">Pelanggan</th>
            <th class="px-4 py-4 text-left font-semibold text-blue-700">Harga</th>
            <th class="px-4 py-4 text-left font-semibold text-blue-700">Pajak (11%)</th>
            <th class="px-4 py-4 text-left font-semibold text-blue-700">Subtotal Harga</th>
            <th class="px-4 py-4 text-left font-semibold text-blue-700">Tanggal</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in filteredData"
            :key="index"
            :class="
              (index % 2 === 0 ? 'bg-teal-50' : 'bg-white') + ' hover:bg-blue-50 transition-all'
            "
          >
            <td class="px-4 py-3">{{ index + 1 }}</td>
            <td class="px-4 py-3 font-medium text-gray-800">{{ item.serviceType }}</td>
            <td class="px-4 py-3 text-gray-700">{{ item.customer }}</td>
            <td class="px-4 py-3">
              <span
                class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-600"
                >{{ formatCurrency(item.price) }}</span
              >
            </td>
            <td class="px-4 py-3">
              <span
                class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-600"
                >{{ formatCurrency(item.tax) }}</span
              >
            </td>
            <td class="px-4 py-3">
              <span
                class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600"
                >{{ formatCurrency(item.totalPrice) }}</span
              >
            </td>
            <td class="px-4 py-3 text-gray-700">{{ formatDate(item.date) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="bg-blue-50 font-bold">
            <td class="px-4 py-3 text-right" colspan="3">Total</td>
            <td class="px-4 py-3">
              <span
                class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-200 text-blue-700"
              >
                {{ formatCurrency(totalHarga) }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span
                class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-teal-200 text-teal-700"
              >
                {{ formatCurrency(totalPajak) }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span
                class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-green-200 text-green-700"
              >
                {{ formatCurrency(totalSubtotal) }}
              </span>
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Print, Download PDF, Export Excel Buttons -->
    <div class="flex justify-center mt-6 space-x-4">
      <button
        @click="printReport"
        class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
      >
        Print Report
      </button>
      <button
        @click="downloadPDF"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Download PDF
      </button>
      <button
        @click="exportExcel"
        class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Export to Excel
      </button>
    </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'

export default {
  data() {
    return {
      searchQuery: '',
      startDate: '',
      endDate: '',
      servicesData: [
        {
          serviceType: 'Service',
          customer: 'Sumarjo',

          price: 500000,
          tax: 500000 * 0.11,
          totalPrice: 500000 + 500000 * 0.11,
          date: '2025-08-05',
        },
        {
          serviceType: 'Perbaikan',
          customer: 'Budi',

          price: 1000000,
          tax: 1000000 * 0.11,
          totalPrice: 1000000 + 1000000 * 0.11,
          date: '2025-08-06',
        },
        {
          serviceType: 'Modifikasi',
          customer: 'Rudi',

          price: 1500000,
          tax: 1500000 * 0.11,
          totalPrice: 1500000 + 1500000 * 0.11,
          date: '2025-08-07',
        },
        // Add more dummy data as needed
      ],
    }
  },
  computed: {
    filteredData() {
      return this.servicesData
        .filter((item) => {
          const searchMatch = item.serviceType
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
          const dateMatch =
            (!this.startDate || new Date(item.date) >= new Date(this.startDate)) &&
            (!this.endDate || new Date(item.date) <= new Date(this.endDate))
          return searchMatch && dateMatch
        })
        .map((item) => {
          const tax = item.price * 0.11
          const totalPrice = item.price + tax
          return { ...item, tax, totalPrice }
        })
    },
    totalHarga() {
      return this.filteredData.reduce((sum, item) => sum + item.price, 0)
    },
    totalPajak() {
      return this.filteredData.reduce((sum, item) => sum + item.tax, 0)
    },
    totalSubtotal() {
      return this.filteredData.reduce((sum, item) => sum + item.totalPrice, 0)
    },
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('id-ID')
    },
    printReport() {
      window.print()
    },
    downloadPDF() {
      const doc = new jsPDF()
      doc.text('Laporan Jasa Bengkel', 20, 20)
      doc.text(`Tanggal: ${new Date().toLocaleDateString()}`, 20, 30)

      // Add table headers
      doc.text('No', 20, 40)
      doc.text('Jenis Jasa', 40, 40)
      doc.text('Pelanggan', 100, 40)
      doc.text('No. Polisi', 140, 40)
      doc.text('Harga', 160, 40)
      doc.text('Pajak (11%)', 180, 40)
      doc.text('Subtotal Harga', 200, 40)
      doc.text('Tanggal', 220, 40)

      // Add data rows
      let y = 50
      this.filteredData.forEach((item, index) => {
        doc.text(`${index + 1}`, 20, y)
        doc.text(item.serviceType, 40, y)
        doc.text(item.customer, 100, y)
        doc.text(item.licensePlate, 140, y)
        doc.text(this.formatCurrency(item.price), 160, y)
        doc.text(this.formatCurrency(item.tax), 180, y)
        doc.text(this.formatCurrency(item.totalPrice), 200, y)
        doc.text(this.formatDate(item.date), 220, y)
        y += 10
      })

      doc.save('Laporan_Jasa_Ac_Lestari.pdf')
    },
    exportExcel() {
      const data = this.filteredData.map((item, idx) => ({
        No: idx + 1,
        'Jenis Jasa': item.serviceType,
        Pelanggan: item.customer,
        Harga: item.price,
        'Pajak (11%)': item.tax,
        'Subtotal Harga': item.totalPrice,
        Tanggal: this.formatDate(item.date),
      }))
      data.push({
        No: '',
        'Jenis Jasa': 'Total',
        Pelanggan: '',
        Harga: this.totalHarga,
        'Pajak (11%)': this.totalPajak,
        'Subtotal Harga': this.totalSubtotal,
        Tanggal: '',
      })
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Jasa AC Lestari Service')
      XLSX.writeFile(workbook, 'Laporan_Jasa_AC_Lestari_Service.xlsx')
    },
  },
}
</script>

<style scoped>
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
