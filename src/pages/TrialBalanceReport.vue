<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Laporan Neraca Saldo (Trial Balance)</h1>
            <p class="text-gray-600 mt-2">Daftar semua akun dengan saldo debit dan kredit</p>
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
            <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Laporan</label>
            <input
              v-model="reportDate"
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
      </div>

      <!-- Report Content -->
      <div v-else-if="report" class="space-y-6">
        <!-- Report Info -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-gray-900">{{ report.report_name }}</h2>
            <p class="text-gray-600">Per tanggal {{ formatDate(report.as_of_date) }}</p>
          </div>

          <!-- Balance Status -->
          <div
            class="mb-6 p-4 rounded-lg"
            :class="
              report.balanced
                ? 'bg-green-50 border-2 border-green-600'
                : 'bg-red-50 border-2 border-red-600'
            "
          >
            <div class="flex items-center justify-between">
              <div>
                <p
                  class="font-semibold"
                  :class="report.balanced ? 'text-green-700' : 'text-red-700'"
                >
                  Status Neraca Saldo
                </p>
                <p class="text-sm" :class="report.balanced ? 'text-green-600' : 'text-red-600'">
                  {{
                    report.balanced
                      ? '✓ SEIMBANG - Total Debit = Total Kredit'
                      : '✗ TIDAK SEIMBANG - Ada perbedaan'
                  }}
                </p>
              </div>
            </div>
          </div>

          <!-- Accounts Table -->
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gray-100 border-b-2 border-gray-300">
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Kode Akun</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama Akun</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tipe</th>
                  <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">Debit</th>
                  <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">Kredit</th>
                </tr>
              </thead>
              <tbody>
                <!-- Asset Accounts -->
                <tr class="bg-blue-50 font-bold border-b">
                  <td colspan="5" class="px-4 py-2 text-blue-700">ASET (ASSET)</td>
                </tr>
                <tr
                  v-for="account in groupedAccounts.asset"
                  :key="account.code"
                  class="border-b hover:bg-gray-50"
                >
                  <td class="px-4 py-3 text-sm font-mono text-blue-600">{{ account.code }}</td>
                  <td class="px-4 py-3 text-sm">{{ account.name }}</td>
                  <td class="px-4 py-3 text-sm">
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{{
                      account.type
                    }}</span>
                  </td>
                  <td
                    class="px-4 py-3 text-right text-sm font-semibold"
                    :class="account.debit > 0 ? 'text-green-600' : 'text-gray-400'"
                  >
                    {{ account.debit > 0 ? formatCurrency(account.debit) : '-' }}
                  </td>
                  <td
                    class="px-4 py-3 text-right text-sm font-semibold"
                    :class="account.credit > 0 ? 'text-red-600' : 'text-gray-400'"
                  >
                    {{ account.credit > 0 ? formatCurrency(account.credit) : '-' }}
                  </td>
                </tr>

                <!-- Liability Accounts -->
                <tr class="bg-red-50 font-bold border-b">
                  <td colspan="5" class="px-4 py-2 text-red-700">KEWAJIBAN (LIABILITY)</td>
                </tr>
                <tr
                  v-for="account in groupedAccounts.liability"
                  :key="account.code"
                  class="border-b hover:bg-gray-50"
                >
                  <td class="px-4 py-3 text-sm font-mono text-blue-600">{{ account.code }}</td>
                  <td class="px-4 py-3 text-sm">{{ account.name }}</td>
                  <td class="px-4 py-3 text-sm">
                    <span class="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">{{
                      account.type
                    }}</span>
                  </td>
                  <td
                    class="px-4 py-3 text-right text-sm font-semibold"
                    :class="account.debit > 0 ? 'text-green-600' : 'text-gray-400'"
                  >
                    {{ account.debit > 0 ? formatCurrency(account.debit) : '-' }}
                  </td>
                  <td
                    class="px-4 py-3 text-right text-sm font-semibold"
                    :class="account.credit > 0 ? 'text-red-600' : 'text-gray-400'"
                  >
                    {{ account.credit > 0 ? formatCurrency(account.credit) : '-' }}
                  </td>
                </tr>

                <!-- Equity Accounts -->
                <tr class="bg-green-50 font-bold border-b">
                  <td colspan="5" class="px-4 py-2 text-green-700">EKUITAS (EQUITY)</td>
                </tr>
                <tr
                  v-for="account in groupedAccounts.equity"
                  :key="account.code"
                  class="border-b hover:bg-gray-50"
                >
                  <td class="px-4 py-3 text-sm font-mono text-blue-600">{{ account.code }}</td>
                  <td class="px-4 py-3 text-sm">{{ account.name }}</td>
                  <td class="px-4 py-3 text-sm">
                    <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">{{
                      account.type
                    }}</span>
                  </td>
                  <td
                    class="px-4 py-3 text-right text-sm font-semibold"
                    :class="account.debit > 0 ? 'text-green-600' : 'text-gray-400'"
                  >
                    {{ account.debit > 0 ? formatCurrency(account.debit) : '-' }}
                  </td>
                  <td
                    class="px-4 py-3 text-right text-sm font-semibold"
                    :class="account.credit > 0 ? 'text-red-600' : 'text-gray-400'"
                  >
                    {{ account.credit > 0 ? formatCurrency(account.credit) : '-' }}
                  </td>
                </tr>

                <!-- Revenue Accounts -->
                <tr class="bg-purple-50 font-bold border-b">
                  <td colspan="5" class="px-4 py-2 text-purple-700">PENDAPATAN (REVENUE)</td>
                </tr>
                <tr
                  v-for="account in groupedAccounts.revenue"
                  :key="account.code"
                  class="border-b hover:bg-gray-50"
                >
                  <td class="px-4 py-3 text-sm font-mono text-blue-600">{{ account.code }}</td>
                  <td class="px-4 py-3 text-sm">{{ account.name }}</td>
                  <td class="px-4 py-3 text-sm">
                    <span class="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">{{
                      account.type
                    }}</span>
                  </td>
                  <td
                    class="px-4 py-3 text-right text-sm font-semibold"
                    :class="account.debit > 0 ? 'text-green-600' : 'text-gray-400'"
                  >
                    {{ account.debit > 0 ? formatCurrency(account.debit) : '-' }}
                  </td>
                  <td
                    class="px-4 py-3 text-right text-sm font-semibold"
                    :class="account.credit > 0 ? 'text-red-600' : 'text-gray-400'"
                  >
                    {{ account.credit > 0 ? formatCurrency(account.credit) : '-' }}
                  </td>
                </tr>

                <!-- Expense Accounts -->
                <tr class="bg-orange-50 font-bold border-b">
                  <td colspan="5" class="px-4 py-2 text-orange-700">BEBAN (EXPENSE)</td>
                </tr>
                <tr
                  v-for="account in groupedAccounts.expense"
                  :key="account.code"
                  class="border-b hover:bg-gray-50"
                >
                  <td class="px-4 py-3 text-sm font-mono text-blue-600">{{ account.code }}</td>
                  <td class="px-4 py-3 text-sm">{{ account.name }}</td>
                  <td class="px-4 py-3 text-sm">
                    <span class="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">{{
                      account.type
                    }}</span>
                  </td>
                  <td
                    class="px-4 py-3 text-right text-sm font-semibold"
                    :class="account.debit > 0 ? 'text-green-600' : 'text-gray-400'"
                  >
                    {{ account.debit > 0 ? formatCurrency(account.debit) : '-' }}
                  </td>
                  <td
                    class="px-4 py-3 text-right text-sm font-semibold"
                    :class="account.credit > 0 ? 'text-red-600' : 'text-gray-400'"
                  >
                    {{ account.credit > 0 ? formatCurrency(account.credit) : '-' }}
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-100 font-bold border-t-2 border-gray-300">
                <tr>
                  <td colspan="3" class="px-4 py-3 text-sm">TOTAL:</td>
                  <td class="px-4 py-3 text-right text-sm text-green-600">
                    {{ formatCurrency(report.total_debit) }}
                  </td>
                  <td class="px-4 py-3 text-right text-sm text-red-600">
                    {{ formatCurrency(report.total_credit) }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Balance Summary -->
          <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
            <div class="bg-green-50 rounded p-4">
              <p class="text-sm text-gray-600">Total Debit</p>
              <p class="text-2xl font-bold text-green-600">
                {{ formatCurrency(report.total_debit) }}
              </p>
            </div>
            <div class="bg-red-50 rounded p-4">
              <p class="text-sm text-gray-600">Total Kredit</p>
              <p class="text-2xl font-bold text-red-600">
                {{ formatCurrency(report.total_credit) }}
              </p>
            </div>
            <div class="rounded p-4" :class="report.balanced ? 'bg-green-50' : 'bg-red-50'">
              <p class="text-sm" :class="report.balanced ? 'text-gray-600' : 'text-red-600'">
                {{ report.balanced ? 'Selisih' : 'Ketidaksesuaian' }}
              </p>
              <p
                class="text-2xl font-bold"
                :class="report.balanced ? 'text-green-600' : 'text-red-600'"
              >
                {{ formatCurrency(Math.abs(report.total_debit - report.total_credit)) }}
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
  name: 'TrialBalanceReport',
  data() {
    return {
      report: null,
      loading: false,
      error: null,
      reportDate: new Date().toISOString().split('T')[0],
      showZeroBalance: false,
    }
  },
  computed: {
    groupedAccounts() {
      if (!this.report) return { asset: [], liability: [], equity: [], revenue: [], expense: [] }

      const grouped = {
        asset: [],
        liability: [],
        equity: [],
        revenue: [],
        expense: [],
      }

      this.report.accounts.forEach((account) => {
        if (account.type === 'asset') grouped.asset.push(account)
        else if (account.type === 'liability') grouped.liability.push(account)
        else if (account.type === 'equity') grouped.equity.push(account)
        else if (account.type === 'revenue') grouped.revenue.push(account)
        else if (account.type === 'expense') grouped.expense.push(account)
      })

      return grouped
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
        // const response = await fetch(`/api/reports/trial-balance?as_of_date=${this.reportDate}&show_zero_balance=${this.showZeroBalance}`);
        // const data = await response.json();

        // Mock data
        this.report = {
          report_name: 'Laporan Neraca Saldo',
          as_of_date: this.reportDate,
          accounts: [
            { code: '1110', name: 'Kas di Tangan', type: 'asset', debit: 15000000, credit: 0 },
            { code: '1120', name: 'Piutang Usaha', type: 'asset', debit: 10000000, credit: 0 },
            { code: '1210', name: 'Persediaan', type: 'asset', debit: 8000000, credit: 0 },
            { code: '2110', name: 'Hutang Usaha', type: 'liability', debit: 0, credit: 8000000 },
            { code: '3110', name: 'Modal Pemilik', type: 'equity', debit: 0, credit: 20000000 },
            { code: '4110', name: 'Pendapatan Jasa', type: 'revenue', debit: 0, credit: 50000000 },
            { code: '5110', name: 'Beban Gaji', type: 'expense', debit: 25000000, credit: 0 },
            {
              code: '5210',
              name: 'Beban Listrik & Air',
              type: 'expense',
              debit: 5000000,
              credit: 0,
            },
          ],
          total_debit: 58000000,
          total_credit: 78000000,
          balanced: false,
        }

        // Recalculate for accuracy
        this.report.total_debit = this.report.accounts.reduce((sum, acc) => sum + acc.debit, 0)
        this.report.total_credit = this.report.accounts.reduce((sum, acc) => sum + acc.credit, 0)
        this.report.balanced = this.report.total_debit === this.report.total_credit
      } catch (err) {
        this.error = 'Gagal memuat laporan neraca saldo. Silakan coba lagi.'
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
