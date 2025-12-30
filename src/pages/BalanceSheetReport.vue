<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Laporan Neraca (Balance Sheet)</h1>
            <p class="text-gray-600 mt-2">Posisi aset, kewajiban, dan ekuitas perusahaan</p>
          </div>
          <button
            @click="downloadReport"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            📥 Download PDF
          </button>
        </div>

        <!-- Filter Date -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Laporan</label>
            <input
              v-model="filterDate"
              type="date"
              @change="loadReport"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div class="flex items-end">
            <label class="flex items-center">
              <input
                v-model="showZeroBalance"
                type="checkbox"
                @change="loadReport"
                class="rounded border-gray-300"
              />
              <span class="ml-2 text-sm text-gray-700">Tampilkan akun dengan saldo 0</span>
            </label>
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
        <button @click="loadReport" class="mt-2 text-red-600 hover:text-red-700 underline">
          Coba lagi
        </button>
      </div>

      <!-- Report Content -->
      <div v-else-if="report" class="space-y-6">
        <!-- Report Info -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">{{ report.report_name }}</h2>
            <p class="text-gray-600">Per tanggal {{ formatDate(report.as_of_date) }}</p>
          </div>

          <!-- Assets Section -->
          <div class="mb-8">
            <h3 class="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
              AKTIVA (ASSETS)
            </h3>
            <div class="space-y-2">
              <div
                v-for="account in report.assets.accounts"
                :key="account.code"
                class="flex justify-between items-center py-2 hover:bg-gray-50 px-2 rounded"
              >
                <div>
                  <p class="text-sm text-gray-600">{{ account.code }}</p>
                  <p class="font-medium text-gray-900">{{ account.name }}</p>
                </div>
                <p class="font-semibold text-gray-900">{{ formatCurrency(account.balance) }}</p>
              </div>
            </div>
            <div
              class="flex justify-between items-center mt-4 pt-4 border-t-2 border-gray-300 bg-blue-50 px-2 py-2 rounded"
            >
              <p class="font-bold text-gray-900">Total Aktiva</p>
              <p class="font-bold text-lg text-blue-600">
                {{ formatCurrency(report.assets.total) }}
              </p>
            </div>
          </div>

          <!-- Liabilities Section -->
          <div class="mb-8">
            <h3 class="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-red-600">
              KEWAJIBAN (LIABILITIES)
            </h3>
            <div class="space-y-2">
              <div
                v-for="account in report.liabilities.accounts"
                :key="account.code"
                class="flex justify-between items-center py-2 hover:bg-gray-50 px-2 rounded"
              >
                <div>
                  <p class="text-sm text-gray-600">{{ account.code }}</p>
                  <p class="font-medium text-gray-900">{{ account.name }}</p>
                </div>
                <p class="font-semibold text-gray-900">{{ formatCurrency(account.balance) }}</p>
              </div>
            </div>
            <div
              class="flex justify-between items-center mt-4 pt-4 border-t-2 border-gray-300 bg-red-50 px-2 py-2 rounded"
            >
              <p class="font-bold text-gray-900">Total Kewajiban</p>
              <p class="font-bold text-lg text-red-600">
                {{ formatCurrency(report.liabilities.total) }}
              </p>
            </div>
          </div>

          <!-- Equity Section -->
          <div class="mb-8">
            <h3 class="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-green-600">
              EKUITAS (EQUITY)
            </h3>
            <div class="space-y-2">
              <div
                v-for="account in report.equity.accounts"
                :key="account.code"
                class="flex justify-between items-center py-2 hover:bg-gray-50 px-2 rounded"
              >
                <div>
                  <p class="text-sm text-gray-600">{{ account.code }}</p>
                  <p class="font-medium text-gray-900">{{ account.name }}</p>
                </div>
                <p class="font-semibold text-gray-900">{{ formatCurrency(account.balance) }}</p>
              </div>
            </div>
            <div
              class="flex justify-between items-center mt-4 pt-4 border-t-2 border-gray-300 bg-green-50 px-2 py-2 rounded"
            >
              <p class="font-bold text-gray-900">Total Ekuitas</p>
              <p class="font-bold text-lg text-green-600">
                {{ formatCurrency(report.equity.total) }}
              </p>
            </div>
          </div>

          <!-- Balance Verification -->
          <div
            class="bg-gray-50 rounded-lg p-4 border-2"
            :class="report.balanced ? 'border-green-500' : 'border-red-500'"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Total Kewajiban + Ekuitas</p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ formatCurrency(report.total_liabilities_and_equity) }}
                </p>
              </div>
              <div class="text-right">
                <p
                  :class="report.balanced ? 'text-green-600' : 'text-red-600'"
                  class="font-bold text-lg"
                >
                  {{ report.balanced ? '✓ SEIMBANG' : '✗ TIDAK SEIMBANG' }}
                </p>
                <p class="text-sm text-gray-600">Aktiva = Kewajiban + Ekuitas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BalanceSheetReport',
  data() {
    return {
      report: null,
      loading: false,
      error: null,
      filterDate: new Date().toISOString().split('T')[0],
      showZeroBalance: false,
    }
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
        // const response = await fetch(`/api/reports/balance-sheet?as_of_date=${this.filterDate}&show_zero_balance=${this.showZeroBalance}`);
        // const data = await response.json();

        // Mock data
        this.report = {
          report_name: 'Laporan Neraca',
          as_of_date: this.filterDate,
          assets: {
            accounts: [
              { code: '1110', name: 'Kas di Tangan', balance: 5000000 },
              { code: '1120', name: 'Piutang Usaha', balance: 15000000 },
              { code: '1210', name: 'Persediaan', balance: 25000000 },
            ],
            total: 45000000,
          },
          liabilities: {
            accounts: [
              { code: '2110', name: 'Hutang Usaha', balance: 8000000 },
              { code: '2210', name: 'Hutang Jangka Panjang', balance: 12000000 },
            ],
            total: 20000000,
          },
          equity: {
            accounts: [
              { code: '3110', name: 'Modal Pemilik', balance: 20000000 },
              { code: '3900', name: 'Saldo Laba', balance: 5000000 },
            ],
            total: 25000000,
          },
          total_liabilities_and_equity: 45000000,
          balanced: true,
        }
      } catch (err) {
        this.error = 'Gagal memuat laporan neraca. Silakan coba lagi.' + err
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
