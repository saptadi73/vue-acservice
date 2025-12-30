<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Laporan Laba Rugi (Profit & Loss)</h1>
            <p class="text-gray-600 mt-2">Pendapatan dan beban untuk periode tertentu</p>
          </div>
          <button
            @click="downloadReport"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            📥 Download PDF
          </button>
        </div>

        <!-- Filter Period -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Awal</label>
            <input
              v-model="startDate"
              type="date"
              @change="loadReport"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
            <input
              v-model="endDate"
              type="date"
              @change="loadReport"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div class="flex items-end">
            <button
              @click="loadReport"
              class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
        ></div>
        <p class="mt-4 text-gray-600">Loading laporan...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <!-- Report Content -->
      <div v-else-if="report" class="space-y-6">
        <!-- Report Info -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-gray-900">{{ report.report_name }}</h2>
            <p class="text-gray-600">
              Periode: {{ formatDate(report.period.start_date) }} -
              {{ formatDate(report.period.end_date) }}
            </p>
          </div>

          <!-- Revenues Section -->
          <div class="mb-8">
            <h3 class="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-green-600">
              PENDAPATAN (REVENUES)
            </h3>
            <div class="space-y-2">
              <div
                v-for="account in report.revenues.accounts"
                :key="account.code"
                class="flex justify-between items-center py-2 hover:bg-gray-50 px-2 rounded"
              >
                <div>
                  <p class="text-sm text-gray-600">{{ account.code }}</p>
                  <p class="font-medium text-gray-900">{{ account.name }}</p>
                </div>
                <p class="font-semibold text-gray-900">{{ formatCurrency(account.amount) }}</p>
              </div>
            </div>
            <div
              class="flex justify-between items-center mt-4 pt-4 border-t-2 border-gray-300 bg-green-50 px-2 py-2 rounded"
            >
              <p class="font-bold text-gray-900">Total Pendapatan</p>
              <p class="font-bold text-lg text-green-600">
                {{ formatCurrency(report.revenues.total) }}
              </p>
            </div>
          </div>

          <!-- Expenses Section -->
          <div class="mb-8">
            <h3 class="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-red-600">
              BEBAN (EXPENSES)
            </h3>
            <div class="space-y-2">
              <div
                v-for="account in report.expenses.accounts"
                :key="account.code"
                class="flex justify-between items-center py-2 hover:bg-gray-50 px-2 rounded"
              >
                <div>
                  <p class="text-sm text-gray-600">{{ account.code }}</p>
                  <p class="font-medium text-gray-900">{{ account.name }}</p>
                </div>
                <p class="font-semibold text-gray-900">{{ formatCurrency(account.amount) }}</p>
              </div>
            </div>
            <div
              class="flex justify-between items-center mt-4 pt-4 border-t-2 border-gray-300 bg-red-50 px-2 py-2 rounded"
            >
              <p class="font-bold text-gray-900">Total Beban</p>
              <p class="font-bold text-lg text-red-600">
                {{ formatCurrency(report.expenses.total) }}
              </p>
            </div>
          </div>

          <!-- Net Income -->
          <div
            class="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border-2 border-green-600"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Laba Bersih (Net Income)</p>
                <p class="text-3xl font-bold text-green-600">
                  {{ formatCurrency(report.net_income) }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-lg font-semibold text-gray-700">{{ profitMargin.toFixed(2) }}%</p>
                <p class="text-sm text-gray-600">Profit Margin</p>
              </div>
            </div>
          </div>

          <!-- Summary Table -->
          <div class="mt-8 border-t-2 pt-6">
            <table class="w-full">
              <tr class="bg-gray-50">
                <td class="py-2 px-4 font-semibold text-gray-900">Total Pendapatan</td>
                <td class="py-2 px-4 text-right font-semibold text-green-600">
                  {{ formatCurrency(report.revenues.total) }}
                </td>
              </tr>
              <tr>
                <td class="py-2 px-4 font-semibold text-gray-900">Total Beban</td>
                <td class="py-2 px-4 text-right font-semibold text-red-600">
                  {{ formatCurrency(report.expenses.total) }}
                </td>
              </tr>
              <tr class="border-t-2 bg-green-50">
                <td class="py-3 px-4 font-bold text-gray-900 text-lg">Laba Bersih</td>
                <td class="py-3 px-4 text-right font-bold text-green-600 text-lg">
                  {{ formatCurrency(report.net_income) }}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfitLossReport',
  data() {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    return {
      report: null,
      loading: false,
      error: null,
      startDate: firstDay.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
    }
  },
  computed: {
    profitMargin() {
      if (!this.report || this.report.revenues.total === 0) return 0
      return (this.report.net_income / this.report.revenues.total) * 100
    },
  },
  mounted() {
    this.loadReport()
  },
  methods: {
    async loadReport() {
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/reports/profit-loss?start_date=${this.startDate}&end_date=${this.endDate}`);
        // const data = await response.json();

        // Mock data
        this.report = {
          report_name: 'Laporan Laba Rugi',
          period: {
            start_date: this.startDate,
            end_date: this.endDate,
          },
          revenues: {
            accounts: [
              { code: '4110', name: 'Pendapatan Jasa AC', amount: 50000000 },
              { code: '4120', name: 'Penjualan Produk', amount: 30000000 },
              { code: '4130', name: 'Pendapatan Rental', amount: 10000000 },
            ],
            total: 90000000,
          },
          expenses: {
            accounts: [
              { code: '5110', name: 'Harga Pokok Penjualan', amount: 20000000 },
              { code: '5210', name: 'Beban Gaji', amount: 25000000 },
              { code: '5310', name: 'Beban Listrik & Air', amount: 5000000 },
              { code: '5410', name: 'Beban Transportasi', amount: 3000000 },
            ],
            total: 53000000,
          },
          net_income: 37000000,
        }
      } catch (err) {
        this.error = 'Gagal memuat laporan laba rugi. Silakan coba lagi.' + err
      } finally {
        this.loading = false
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount)
    },
    downloadReport() {
      alert('Fitur download akan segera tersedia')
    },
  },
}
</script>
