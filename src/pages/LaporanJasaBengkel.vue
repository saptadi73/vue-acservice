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
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import ExcelJS from 'exceljs'

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
    async downloadPDF() {
      const pdfDoc = await PDFDocument.create()
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

      const marginX = 30
      const marginY = 40
      const rowHeight = 18
      const headerHeight = 22
      const fontSize = 10

      let page = pdfDoc.addPage()
      let { width, height } = page.getSize()
      let y = height - marginY

      const columns = [
        { key: 'no', label: 'No', x: marginX },
        { key: 'serviceType', label: 'Jenis Jasa', x: marginX + 30 },
        { key: 'customer', label: 'Pelanggan', x: marginX + 130 },
        { key: 'price', label: 'Harga', x: marginX + 250 },
        { key: 'tax', label: 'Pajak (11%)', x: marginX + 330 },
        { key: 'totalPrice', label: 'Subtotal', x: marginX + 420 },
        { key: 'date', label: 'Tanggal', x: marginX + 520 },
      ]

      const ensureSpace = () => {
        if (y < marginY + rowHeight * 2) {
          page = pdfDoc.addPage()
          ;({ width, height } = page.getSize())
          y = height - marginY
        }
      }

      const drawText = (text, x, customFont = font, size = fontSize) => {
        page.drawText(text, { x, y, size, font: customFont, color: rgb(0, 0, 0) })
      }

      // Header
      drawText('Laporan Jasa Bengkel', marginX, fontBold, 14)
      y -= 16
      drawText(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, marginX, font, 10)
      y -= headerHeight

      // Table header
      columns.forEach((col) => drawText(col.label, col.x, fontBold))
      y -= rowHeight

      // Rows
      this.filteredData.forEach((item, index) => {
        ensureSpace()
        const row = {
          no: `${index + 1}`,
          serviceType: item.serviceType,
          customer: item.customer,
          price: this.formatCurrency(item.price),
          tax: this.formatCurrency(item.tax),
          totalPrice: this.formatCurrency(item.totalPrice),
          date: this.formatDate(item.date),
        }
        columns.forEach((col) => drawText(String(row[col.key] ?? ''), col.x))
        y -= rowHeight
      })

      // Totals row
      ensureSpace()
      page.drawRectangle({
        x: marginX,
        y: y - 6,
        width: width - marginX * 2,
        height: rowHeight,
        color: rgb(0.95, 0.97, 1),
      })
      const totals = {
        harga: this.formatCurrency(this.totalHarga),
        pajak: this.formatCurrency(this.totalPajak),
        subtotal: this.formatCurrency(this.totalSubtotal),
      }
      drawText('Total', columns[1].x, fontBold)
      drawText(totals.harga, columns[3].x, fontBold)
      drawText(totals.pajak, columns[4].x, fontBold)
      drawText(totals.subtotal, columns[5].x, fontBold)

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Laporan_Jasa_AC_Lestari.pdf'
      a.click()
      URL.revokeObjectURL(url)
    },
    async exportExcel() {
      const workbook = new ExcelJS.Workbook()
      const sheet = workbook.addWorksheet('Laporan Jasa AC Lestari')

      sheet.columns = [
        { header: 'No', key: 'no', width: 5 },
        { header: 'Jenis Jasa', key: 'serviceType', width: 20 },
        { header: 'Pelanggan', key: 'customer', width: 20 },
        { header: 'Harga', key: 'price', width: 15 },
        { header: 'Pajak (11%)', key: 'tax', width: 15 },
        { header: 'Subtotal', key: 'totalPrice', width: 18 },
        { header: 'Tanggal', key: 'date', width: 15 },
      ]

      this.filteredData.forEach((item, idx) => {
        sheet.addRow({
          no: idx + 1,
          serviceType: item.serviceType,
          customer: item.customer,
          price: item.price,
          tax: item.tax,
          totalPrice: item.totalPrice,
          date: this.formatDate(item.date),
        })
      })

      sheet.addRow({})
      sheet.addRow({
        serviceType: 'Total',
        price: this.totalHarga,
        tax: this.totalPajak,
        totalPrice: this.totalSubtotal,
      })

      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Laporan_Jasa_AC_Lestari_Service.xlsx'
      a.click()
      URL.revokeObjectURL(url)
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
