<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Laporan Buku Kas (Cash Book)</h1>
            <p class="text-gray-600 mt-2">Semua transaksi kas/bank untuk periode tertentu</p>
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
          <div class="flex items-end gap-2">
            <button
              @click="loadReport"
              class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              🔄 Refresh
            </button>
            <button
              @click="openCashInModal"
              class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              ➕ Cash In
            </button>
            <button
              @click="openCashOutModal"
              class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              ➖ Cash Out
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
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">{{ report.report_name }}</h2>
            <p class="text-gray-600">
              Periode: {{ formatDate(report.period.start_date) }} -
              {{ formatDate(report.period.end_date) }}
            </p>
          </div>

          <!-- Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
              <p class="text-sm text-gray-600">Saldo Awal</p>
              <p class="text-2xl font-bold text-blue-600">
                {{ formatCurrency(report.opening_balance) }}
              </p>
            </div>
            <div class="bg-green-50 rounded-lg p-4 border-l-4 border-green-600">
              <p class="text-sm text-gray-600">Total Masuk</p>
              <p class="text-2xl font-bold text-green-600">
                {{ formatCurrency(report.total_debit) }}
              </p>
            </div>
            <div class="bg-red-50 rounded-lg p-4 border-l-4 border-red-600">
              <p class="text-sm text-gray-600">Total Keluar</p>
              <p class="text-2xl font-bold text-red-600">
                {{ formatCurrency(report.total_credit) }}
              </p>
            </div>
            <div class="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-600">
              <p class="text-sm text-gray-600">Saldo Akhir</p>
              <p class="text-2xl font-bold text-purple-600">
                {{ formatCurrency(report.closing_balance) }}
              </p>
            </div>
          </div>

          <!-- Transactions Table -->
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gray-100 border-b-2 border-gray-300">
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tanggal</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Referensi</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Deskripsi</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Akun</th>
                  <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    Masuk (Debit)
                  </th>
                  <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    Keluar (Kredit)
                  </th>
                  <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">Saldo</th>
                </tr>
              </thead>
              <tbody>
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
                  <td class="px-4 py-3 text-sm text-gray-600">{{ transaction.account }}</td>
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
              <tfoot class="bg-gray-100 font-bold">
                <tr class="border-t-2 border-gray-300">
                  <td colspan="4" class="px-4 py-3 text-right text-sm">Total:</td>
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

          <!-- Summary Section -->
          <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
            <div class="text-center">
              <p class="text-sm text-gray-600">Saldo Awal</p>
              <p class="text-xl font-bold text-gray-900">
                {{ formatCurrency(report.opening_balance) }}
              </p>
            </div>
            <div class="text-center">
              <p class="text-sm text-gray-600">Perubahan Neto</p>
              <p
                class="text-xl font-bold"
                :class="netChange >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ formatCurrency(netChange) }}
              </p>
            </div>
            <div class="text-center">
              <p class="text-sm text-gray-600">Saldo Akhir</p>
              <p class="text-xl font-bold text-purple-600">
                {{ formatCurrency(report.closing_balance) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Cash In / Cash Out -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <!-- Modal Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">
            {{ modalType === 'in' ? '💰 Kas Masuk' : '💸 Kas Keluar' }}
          </h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitJournal" class="space-y-4">
          <!-- Date Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
            <input
              v-model="formData.date"
              type="date"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Account Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Akun Kas/Bank</label>
            <select
              v-model="formData.accountId"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option :value="null">-- Pilih Akun --</option>
              <option v-for="account in cashAccounts" :key="account.id" :value="account.id">
                {{ account.code }} - {{ account.name }}
              </option>
            </select>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
            <input
              v-model="formData.description"
              type="text"
              placeholder="Deskripsi transaksi"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Reference -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Referensi (opsional)</label>
            <input
              v-model="formData.reference"
              type="text"
              placeholder="JE-001, INV-001, dll"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Amount -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"> Jumlah (IDR) </label>
            <input
              v-model="formData.amount"
              type="number"
              min="0"
              step="1000"
              placeholder="0"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              :class="`flex-1 px-4 py-2 text-white rounded-lg transition ${
                modalType === 'in' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
              }`"
            >
              {{ modalType === 'in' ? 'Simpan Kas Masuk' : 'Simpan Kas Keluar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CashBookReport',
  data() {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    return {
      report: null,
      loading: false,
      error: null,
      startDate: firstDay.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
      showModal: false,
      modalType: null, // 'in' or 'out'
      formData: {
        date: today.toISOString().split('T')[0],
        accountId: null,
        description: '',
        reference: '',
        amount: 0,
      },
      cashAccounts: [
        { id: 1, code: '1110', name: 'Kas di Tangan' },
        { id: 2, code: '1120', name: 'Kas di Bank - Mandiri' },
        { id: 3, code: '1130', name: 'Kas di Bank - BCA' },
        { id: 4, code: '1140', name: 'Kas di Bank - BNI' },
      ],
    }
  },
  computed: {
    netChange() {
      if (!this.report) return 0
      return this.report.total_debit - this.report.total_credit
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
        // const response = await fetch(`/api/reports/cash-book?start_date=${this.startDate}&end_date=${this.endDate}`);
        // const data = await response.json();

        // Mock data
        this.report = {
          report_name: 'Laporan Buku Kas',
          period: {
            start_date: this.startDate,
            end_date: this.endDate,
          },
          opening_balance: 10000000,
          transactions: [
            {
              date: '2024-12-05',
              reference: 'JE-001',
              description: 'Pembayaran dari customer ABC',
              account: 'Kas di Tangan',
              debit: 5000000,
              credit: 0,
              balance: 15000000,
            },
            {
              date: '2024-12-10',
              reference: 'JE-002',
              description: 'Pembayaran ke vendor XYZ',
              account: 'Kas di Tangan',
              debit: 0,
              credit: 2000000,
              balance: 13000000,
            },
            {
              date: '2024-12-15',
              reference: 'JE-003',
              description: 'Pendapatan jasa layanan',
              account: 'Kas di Tangan',
              debit: 3000000,
              credit: 0,
              balance: 16000000,
            },
          ],
          total_debit: 8000000,
          total_credit: 2000000,
          closing_balance: 16000000,
        }
      } catch (err) {
        this.error = 'Gagal memuat laporan buku kas. Silakan coba lagi.' + err
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
    openCashInModal() {
      this.modalType = 'in'
      this.formData = {
        date: new Date().toISOString().split('T')[0],
        accountId: null,
        description: '',
        reference: '',
        amount: 0,
      }
      this.showModal = true
    },
    openCashOutModal() {
      this.modalType = 'out'
      this.formData = {
        date: new Date().toISOString().split('T')[0],
        accountId: null,
        description: '',
        reference: '',
        amount: 0,
      }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.modalType = null
    },
    submitJournal() {
      // Validasi
      if (!this.formData.accountId || !this.formData.amount || !this.formData.description) {
        alert('Silakan isi semua field yang diperlukan')
        return
      }

      // Find account name
      const selectedAccount = this.cashAccounts.find((acc) => acc.id === this.formData.accountId)

      // Create new transaction
      const newTransaction = {
        date: this.formData.date,
        reference: this.formData.reference || 'JE-' + Date.now().toString().slice(-5),
        description: this.formData.description,
        account: selectedAccount.name,
        debit: this.modalType === 'in' ? this.formData.amount : 0,
        credit: this.modalType === 'out' ? this.formData.amount : 0,
        balance:
          this.report.closing_balance +
          (this.modalType === 'in' ? this.formData.amount : -this.formData.amount),
      }

      // Add to report
      if (this.report.transactions) {
        this.report.transactions.push(newTransaction)

        // Update totals
        this.report.total_debit += newTransaction.debit
        this.report.total_credit += newTransaction.credit
        this.report.closing_balance = newTransaction.balance
      }

      // Show success message
      alert(
        `✅ Transaksi ${this.modalType === 'in' ? 'Kas Masuk' : 'Kas Keluar'} berhasil ditambahkan!\n\n` +
          `Deskripsi: ${this.formData.description}\n` +
          `Jumlah: ${this.formatCurrency(this.formData.amount)}\n` +
          `Akun: ${selectedAccount.name}`,
      )

      // Close modal
      this.closeModal()
    },
  },
}
</script>
