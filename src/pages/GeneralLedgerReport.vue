<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Laporan Buku Besar (General Ledger)</h1>
            <p class="text-gray-600 mt-2">Semua transaksi dan saldo berjalan untuk akun tertentu</p>
          </div>
          <button
            @click="downloadReport"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            📥 Download PDF
          </button>
        </div>

        <!-- Filter Options -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Pilih Akun</label>
            <select
              v-model="selectedAccountId"
              @change="loadReport"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option :value="null">-- Pilih Akun --</option>
              <option v-for="account in availableAccounts" :key="account.id" :value="account.id">
                {{ account.code }} - {{ account.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Awal</label>
            <input
              v-model="startDate"
              type="date"
              @change="loadReport"
              :disabled="!selectedAccountId"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
            <input
              v-model="endDate"
              type="date"
              @change="loadReport"
              :disabled="!selectedAccountId"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          <div class="flex items-end">
            <button
              @click="loadReport"
              :disabled="!selectedAccountId"
              class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
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

      <!-- Empty State -->
      <div v-else-if="!report" class="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <p class="text-blue-800">Silakan pilih akun untuk melihat laporan buku besar</p>
      </div>

      <!-- Report Content -->
      <div v-else-if="report" class="space-y-6">
        <!-- Account Info -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <div class="text-sm text-gray-600">Kode Akun: {{ report.account.code }}</div>
              <h2 class="text-2xl font-bold text-gray-900">{{ report.account.name }}</h2>
              <div class="text-sm text-gray-600 mt-1">Tipe: {{ report.account.type }}</div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600">Periode</p>
              <p class="text-lg font-semibold text-gray-900">
                {{ formatDate(report.period.start_date) }} -
                {{ formatDate(report.period.end_date) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
            <p class="text-sm text-gray-600">Saldo Awal</p>
            <p class="text-2xl font-bold text-blue-600">
              {{ formatCurrency(report.opening_balance) }}
            </p>
          </div>
          <div class="bg-green-50 rounded-lg p-4 border-l-4 border-green-600">
            <p class="text-sm text-gray-600">Total Debit</p>
            <p class="text-2xl font-bold text-green-600">
              {{ formatCurrency(report.total_debit) }}
            </p>
          </div>
          <div class="bg-red-50 rounded-lg p-4 border-l-4 border-red-600">
            <p class="text-sm text-gray-600">Total Kredit</p>
            <p class="text-2xl font-bold text-red-600">{{ formatCurrency(report.total_credit) }}</p>
          </div>
          <div class="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-600">
            <p class="text-sm text-gray-600">Saldo Akhir</p>
            <p class="text-2xl font-bold text-purple-600">
              {{ formatCurrency(report.closing_balance) }}
            </p>
          </div>
        </div>

        <!-- Transactions Table -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gray-100 border-b-2 border-gray-300">
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tanggal</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Referensi</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Deskripsi</th>
                  <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">Debit</th>
                  <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">Kredit</th>
                  <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">Saldo</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b hover:bg-gray-50 bg-blue-50">
                  <td colspan="5" class="px-4 py-3 text-sm font-semibold text-gray-700">
                    Saldo Awal
                  </td>
                  <td class="px-4 py-3 text-right text-sm font-bold text-blue-600">
                    {{ formatCurrency(report.opening_balance) }}
                  </td>
                </tr>
                <tr
                  v-for="(transaction, index) in report.transactions"
                  :key="index"
                  class="border-b hover:bg-gray-50"
                >
                  <td class="px-4 py-3 text-sm">{{ formatDate(transaction.date) }}</td>
                  <td class="px-4 py-3 text-sm font-mono text-blue-600">
                    {{ transaction.reference }}
                  </td>
                  <td class="px-4 py-3 text-sm">{{ transaction.description }}</td>
                  <td
                    class="px-4 py-3 text-right text-sm font-semibold"
                    :class="transaction.debit > 0 ? 'text-green-600' : 'text-gray-400'"
                  >
                    {{ transaction.debit > 0 ? formatCurrency(transaction.debit) : '-' }}
                  </td>
                  <td
                    class="px-4 py-3 text-right text-sm font-semibold"
                    :class="transaction.credit > 0 ? 'text-red-600' : 'text-gray-400'"
                  >
                    {{ transaction.credit > 0 ? formatCurrency(transaction.credit) : '-' }}
                  </td>
                  <td class="px-4 py-3 text-right text-sm font-bold text-purple-600">
                    {{ formatCurrency(transaction.balance) }}
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-100 font-bold border-t-2 border-gray-300">
                <tr>
                  <td colspan="3" class="px-4 py-3 text-sm text-right">Total Periode:</td>
                  <td class="px-4 py-3 text-right text-sm text-green-600">
                    {{ formatCurrency(report.total_debit) }}
                  </td>
                  <td class="px-4 py-3 text-right text-sm text-red-600">
                    {{ formatCurrency(report.total_credit) }}
                  </td>
                  <td class="px-4 py-3 text-right text-sm text-purple-600">
                    {{ formatCurrency(report.closing_balance) }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Summary Section -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Ringkasan</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="border-l-4 border-blue-600 pl-4">
              <p class="text-sm text-gray-600">Saldo Awal Periode</p>
              <p class="text-2xl font-bold text-blue-600">
                {{ formatCurrency(report.opening_balance) }}
              </p>
            </div>
            <div class="border-l-4 border-green-600 pl-4">
              <p class="text-sm text-gray-600">Perubahan Neto (Debit - Kredit)</p>
              <p class="text-2xl font-bold text-green-600">{{ formatCurrency(netChange) }}</p>
            </div>
            <div class="border-l-4 border-purple-600 pl-4">
              <p class="text-sm text-gray-600">Saldo Akhir Periode</p>
              <p class="text-2xl font-bold text-purple-600">
                {{ formatCurrency(report.closing_balance) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GeneralLedgerReport',
  data() {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    return {
      report: null,
      loading: false,
      error: null,
      selectedAccountId: null,
      startDate: firstDay.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
      availableAccounts: [
        { id: 1, code: '1110', name: 'Kas di Tangan' },
        { id: 2, code: '1120', name: 'Piutang Usaha' },
        { id: 3, code: '1210', name: 'Persediaan' },
        { id: 4, code: '2110', name: 'Hutang Usaha' },
        { id: 5, code: '3110', name: 'Modal Pemilik' },
        { id: 6, code: '4110', name: 'Pendapatan Jasa' },
        { id: 7, code: '5110', name: 'Beban Gaji' },
        { id: 8, code: '5210', name: 'Beban Listrik & Air' },
      ],
    }
  },
  computed: {
    netChange() {
      if (!this.report) return 0
      return this.report.total_debit - this.report.total_credit
    },
  },
  methods: {
    async loadReport() {
      if (!this.selectedAccountId) {
        this.report = null
        return
      }

      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/reports/general-ledger?account_id=${this.selectedAccountId}&start_date=${this.startDate}&end_date=${this.endDate}`);
        // const data = await response.json();

        // Find selected account
        const selectedAccount = this.availableAccounts.find(
          (acc) => acc.id === parseInt(this.selectedAccountId),
        )

        // Mock data
        this.report = {
          report_name: 'Laporan Buku Besar',
          account: {
            code: selectedAccount.code,
            name: selectedAccount.name,
            type: 'asset',
          },
          period: {
            start_date: this.startDate,
            end_date: this.endDate,
          },
          opening_balance: 10000000,
          transactions: [
            {
              date: '2024-01-05',
              reference: 'JE-001',
              description: 'Saldo awal',
              debit: 10000000,
              credit: 0,
              balance: 10000000,
            },
            {
              date: '2024-01-10',
              reference: 'JE-002',
              description: 'Pendapatan jasa',
              debit: 5000000,
              credit: 0,
              balance: 15000000,
            },
            {
              date: '2024-01-15',
              reference: 'JE-003',
              description: 'Pembayaran ke vendor',
              debit: 0,
              credit: 3000000,
              balance: 12000000,
            },
            {
              date: '2024-01-20',
              reference: 'JE-004',
              description: 'Penerimaan dari customer',
              debit: 8000000,
              credit: 0,
              balance: 20000000,
            },
          ],
          total_debit: 23000000,
          total_credit: 3000000,
          closing_balance: 20000000,
        }
      } catch (err) {
        this.error = 'Gagal memuat laporan buku besar. Silakan coba lagi.' + err
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
