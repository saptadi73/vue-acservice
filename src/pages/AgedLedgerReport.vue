<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              Laporan Umur Piutang/Hutang (Aged Ledger)
            </h1>
            <p class="text-gray-600 mt-2">Outstanding receivables atau payables berdasarkan umur</p>
          </div>
          <button
            @click="downloadReport"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            📥 Download PDF
          </button>
        </div>

        <!-- Filter Options -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Laporan</label>
            <select
              v-model="ledgerType"
              @change="loadReport"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="receivable">Piutang (Receivable)</option>
              <option value="payable">Hutang (Payable)</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Laporan</label>
            <input
              v-model="reportDate"
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
        <!-- Summary Cards -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div class="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
            <p class="text-xs text-gray-600 uppercase">Total</p>
            <p class="text-2xl font-bold text-blue-600">
              {{ formatCurrency(report.summary.total) }}
            </p>
          </div>
          <div class="bg-green-50 rounded-lg p-4 border-l-4 border-green-600">
            <p class="text-xs text-gray-600 uppercase">0-30 hari</p>
            <p class="text-2xl font-bold text-green-600">
              {{ formatCurrency(report.summary.current) }}
            </p>
          </div>
          <div class="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-600">
            <p class="text-xs text-gray-600 uppercase">31-60 hari</p>
            <p class="text-2xl font-bold text-yellow-600">
              {{ formatCurrency(report.summary['1_30_days']) }}
            </p>
          </div>
          <div class="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-600">
            <p class="text-xs text-gray-600 uppercase">61-90 hari</p>
            <p class="text-2xl font-bold text-orange-600">
              {{ formatCurrency(report.summary['31_60_days']) }}
            </p>
          </div>
          <div class="bg-red-50 rounded-lg p-4 border-l-4 border-red-600">
            <p class="text-xs text-gray-600 uppercase">> 90 hari</p>
            <p class="text-2xl font-bold text-red-600">
              {{ formatCurrency(report.summary['61_90_days']) }}
            </p>
          </div>
        </div>

        <!-- Details Section -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-6 border-b">
            <h2 class="text-2xl font-bold text-gray-900">
              {{ reportTitleType }} - Per tanggal {{ formatDate(report.as_of_date) }}
            </h2>
          </div>

          <div class="overflow-x-auto">
            <div v-for="detail in report.details" :key="detail.party_id" class="border-b">
              <!-- Party Header -->
              <div class="bg-gray-50 px-6 py-4 border-b-2">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-lg font-bold text-gray-900">{{ detail.party_name }}</p>
                    <p class="text-sm text-gray-600">ID: {{ detail.party_id }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-gray-600">Total Outstanding</p>
                    <p class="text-2xl font-bold text-blue-600">
                      {{ formatCurrency(detail.total) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Party Details -->
              <div class="p-6">
                <!-- Age Breakdown -->
                <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                  <div class="bg-green-50 rounded p-3">
                    <p class="text-xs text-gray-600">Belum jatuh tempo</p>
                    <p class="font-bold text-green-600">{{ formatCurrency(detail.current) }}</p>
                  </div>
                  <div class="bg-yellow-50 rounded p-3">
                    <p class="text-xs text-gray-600">1-30 hari</p>
                    <p class="font-bold text-yellow-600">
                      {{ formatCurrency(detail['1_30_days']) }}
                    </p>
                  </div>
                  <div class="bg-orange-50 rounded p-3">
                    <p class="text-xs text-gray-600">31-60 hari</p>
                    <p class="font-bold text-orange-600">
                      {{ formatCurrency(detail['31_60_days']) }}
                    </p>
                  </div>
                  <div class="bg-red-50 rounded p-3">
                    <p class="text-xs text-gray-600">61-90 hari</p>
                    <p class="font-bold text-red-600">{{ formatCurrency(detail['61_90_days']) }}</p>
                  </div>
                  <div class="bg-red-100 rounded p-3">
                    <p class="text-xs text-gray-600">> 90 hari</p>
                    <p class="font-bold text-red-700">
                      {{ formatCurrency(detail['over_90_days']) }}
                    </p>
                  </div>
                </div>

                <!-- Transactions -->
                <div v-if="detail.transactions && detail.transactions.length > 0">
                  <p class="text-sm font-semibold text-gray-700 mb-3">Detail Transaksi:</p>
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="border-b">
                        <th class="text-left py-2 text-gray-600">Tanggal</th>
                        <th class="text-left py-2 text-gray-600">Referensi</th>
                        <th class="text-left py-2 text-gray-600">Deskripsi</th>
                        <th class="text-right py-2 text-gray-600">Jumlah</th>
                        <th class="text-right py-2 text-gray-600">Usia (hari)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(trans, idx) in detail.transactions"
                        :key="idx"
                        class="border-b hover:bg-gray-50"
                      >
                        <td class="py-2">{{ formatDate(trans.date) }}</td>
                        <td class="py-2 font-mono text-blue-600">{{ trans.reference }}</td>
                        <td class="py-2">{{ trans.description }}</td>
                        <td class="py-2 text-right font-semibold">
                          {{ formatCurrency(trans.amount) }}
                        </td>
                        <td class="py-2 text-right" :class="getAgeClass(trans.days_old)">
                          {{ trans.days_old }} hari
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary Footer -->
          <div class="bg-gray-100 px-6 py-4 border-t-2">
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p class="text-xs text-gray-600 uppercase">Total</p>
                <p class="text-xl font-bold text-blue-600">
                  {{ formatCurrency(report.summary.total) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-600 uppercase">0-30 hari</p>
                <p class="text-xl font-bold text-green-600">
                  {{ formatCurrency(report.summary.current) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-600 uppercase">31-60 hari</p>
                <p class="text-xl font-bold text-yellow-600">
                  {{ formatCurrency(report.summary['1_30_days']) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-600 uppercase">61-90 hari</p>
                <p class="text-xl font-bold text-orange-600">
                  {{ formatCurrency(report.summary['31_60_days']) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-600 uppercase">> 90 hari</p>
                <p class="text-xl font-bold text-red-600">
                  {{ formatCurrency(report.summary['61_90_days']) }}
                </p>
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
  name: 'AgedLedgerReport',
  data() {
    return {
      report: null,
      loading: false,
      error: null,
      ledgerType: 'receivable',
      reportDate: new Date().toISOString().split('T')[0],
    }
  },
  computed: {
    reportTitleType() {
      return this.ledgerType === 'receivable' ? 'Laporan Umur Piutang' : 'Laporan Umur Hutang'
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
        // const response = await fetch(`/api/reports/aged-ledger?type=${this.ledgerType}&as_of_date=${this.reportDate}`);
        // const data = await response.json();

        // Mock data
        this.report = {
          report_name:
            this.ledgerType === 'receivable' ? 'Laporan Umur Piutang' : 'Laporan Umur Hutang',
          as_of_date: this.reportDate,
          type: this.ledgerType,
          details: [
            {
              party_id: 1,
              party_name: 'PT ABC Indonesia',
              transactions: [
                {
                  date: '2024-12-01',
                  reference: 'INV-001',
                  description: 'Jasa AC Service',
                  amount: 5000000,
                  days_old: 30,
                },
                {
                  date: '2024-10-15',
                  reference: 'INV-002',
                  description: 'Penjualan Produk',
                  amount: 8000000,
                  days_old: 77,
                },
              ],
              current: 5000000,
              '1_30_days': 0,
              '31_60_days': 0,
              '61_90_days': 8000000,
              over_90_days: 0,
              total: 13000000,
            },
            {
              party_id: 2,
              party_name: 'CV XYZ Sejahtera',
              transactions: [
                {
                  date: '2024-09-01',
                  reference: 'INV-003',
                  description: 'Jasa Rental',
                  amount: 10000000,
                  days_old: 121,
                },
              ],
              current: 0,
              '1_30_days': 0,
              '31_60_days': 0,
              '61_90_days': 0,
              over_90_days: 10000000,
              total: 10000000,
            },
          ],
          summary: {
            total: 23000000,
            current: 5000000,
            '1_30_days': 0,
            '31_60_days': 0,
            '61_90_days': 8000000,
            over_90_days: 10000000,
          },
        }
      } catch (err) {
        this.error = 'Gagal memuat laporan umur piutang/hutang. Silakan coba lagi.' + err
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
    getAgeClass(days) {
      if (days <= 30) return 'text-green-600 font-semibold'
      if (days <= 60) return 'text-yellow-600 font-semibold'
      if (days <= 90) return 'text-orange-600 font-semibold'
      return 'text-red-600 font-semibold'
    },
    downloadReport() {
      alert('Fitur download akan segera tersedia')
    },
  },
}
</script>
