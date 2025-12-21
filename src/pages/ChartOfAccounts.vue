<template>
  <div class="p-6 space-y-6">
    <!-- Toast Notification -->
    <div v-if="notification.show" class="fixed top-4 right-4 z-50">
      <div
        :class="{
          'bg-green-50 border-l-4 border-green-500': notification.type === 'success',
          'bg-red-50 border-l-4 border-red-500': notification.type === 'error',
        }"
        class="p-4 rounded shadow-lg max-w-md"
      >
        <p
          :class="{
            'text-green-800': notification.type === 'success',
            'text-red-800': notification.type === 'error',
          }"
        >
          {{ notification.message }}
        </p>
      </div>
    </div>

    <!-- Header -->
    <div class="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white shadow-lg">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold tracking-tight">Daftar Chart of Accounts (CoA)</h2>
          <p class="text-white/90 text-sm">
            Kelola struktur akun untuk keperluan akuntansi perusahaan
          </p>
        </div>
        <button
          @click="openCreateModal"
          class="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tambah CoA
        </button>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-3">
      <div class="lg:col-span-2">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari berdasarkan kode, nama, atau kategori..."
            class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
      </div>
      <div>
        <select
          v-model="filterType"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Filter Tipe</option>
          <option value="asset">Asset</option>
          <option value="liability">Liability</option>
          <option value="equity">Equity</option>
          <option value="revenue">Revenue</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      <div>
        <select
          v-model="filterStatus"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Filter Status</option>
          <option :value="true">Aktif</option>
          <option :value="false">Tidak Aktif</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              <th class="px-6 py-3 text-left text-sm font-semibold">Kode</th>
              <th class="px-6 py-3 text-left text-sm font-semibold">Nama Akun</th>
              <th class="px-6 py-3 text-left text-sm font-semibold">Deskripsi</th>
              <th class="px-6 py-3 text-left text-sm font-semibold">Tipe</th>
              <th class="px-6 py-3 text-left text-sm font-semibold">Kategori</th>
              <th class="px-6 py-3 text-left text-sm font-semibold">Saldo Normal</th>
              <th class="px-6 py-3 text-center text-sm font-semibold">Status</th>
              <th class="px-6 py-3 text-center text-sm font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in paginatedData"
              :key="index"
              class="border-b hover:bg-gray-50 transition"
            >
              <td class="px-6 py-3 font-medium text-gray-900">{{ item.code }}</td>
              <td class="px-6 py-3 text-gray-800">{{ item.name }}</td>
              <td class="px-6 py-3 text-gray-600 text-sm">{{ item.description || '-' }}</td>
              <td class="px-6 py-3">
                <span
                  class="inline-block px-3 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-blue-100 text-blue-800': item.type === 'asset',
                    'bg-red-100 text-red-800': item.type === 'liability',
                    'bg-purple-100 text-purple-800': item.type === 'equity',
                    'bg-green-100 text-green-800': item.type === 'revenue',
                    'bg-yellow-100 text-yellow-800': item.type === 'expense',
                  }"
                >
                  {{ item.type }}
                </span>
              </td>
              <td class="px-6 py-3 text-sm text-gray-600">{{ formatCategory(item.category) }}</td>
              <td class="px-6 py-3 text-sm">
                <span
                  class="inline-block px-3 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-indigo-100 text-indigo-800': item.normal_balance === 'debit',
                    'bg-orange-100 text-orange-800': item.normal_balance === 'credit',
                  }"
                >
                  {{ item.normal_balance }}
                </span>
              </td>
              <td class="px-6 py-3 text-center">
                <span
                  class="inline-block px-3 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-emerald-100 text-emerald-800': item.is_active,
                    'bg-gray-100 text-gray-800': !item.is_active,
                  }"
                >
                  {{ item.is_active ? 'Aktif' : 'Tidak Aktif' }}
                </span>
              </td>
              <td class="px-6 py-3 text-center">
                <div class="flex gap-2 justify-center">
                  <button
                    @click="openEditModal(item)"
                    class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    @click="openDeleteConfirm(item)"
                    class="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredData.length === 0">
              <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                Tidak ada data Chart of Accounts
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="bg-gray-50 px-6 py-4 border-t">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600">
            Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} hingga
            {{ Math.min(currentPage * itemsPerPage, filteredData.length) }} dari
            {{ filteredData.length }} data
          </div>
          <div class="flex gap-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Sebelumnya
            </button>
            <div class="flex gap-1">
              <button
                v-for="page in totalPages"
                :key="page"
                @click="currentPage = page"
                :class="{
                  'bg-blue-500 text-white': currentPage === page,
                  'border hover:bg-gray-100': currentPage !== page,
                }"
                class="px-3 py-1 rounded border"
              >
                {{ page }}
              </button>
            </div>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Selanjutnya →
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 sticky top-0">
          <h3 class="text-xl font-bold">{{ isEditMode ? 'Edit CoA' : 'Tambah CoA Baru' }}</h3>
        </div>

        <!-- Modal Content -->
        <div class="p-6 space-y-4">
          <!-- Kode -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kode *</label>
            <input
              v-model="formData.code"
              type="text"
              placeholder="cth: 1110"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Nama Akun -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Akun *</label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="cth: Cash in Bank"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Deskripsi -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              v-model="formData.description"
              placeholder="Deskripsi akun (opsional)"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="2"
            ></textarea>
          </div>

          <!-- Tipe -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipe *</label>
            <select
              v-model="formData.type"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Pilih Tipe --</option>
              <option value="asset">Asset</option>
              <option value="liability">Liability</option>
              <option value="equity">Equity</option>
              <option value="revenue">Revenue</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <!-- Kategori -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
            <select
              v-model="formData.category"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Pilih Kategori --</option>
              <option value="current_asset">Current Asset</option>
              <option value="fixed_asset">Fixed Asset</option>
              <option value="current_liability">Current Liability</option>
              <option value="long_term_liability">Long Term Liability</option>
              <option value="owner_equity">Owner Equity</option>
              <option value="operating_revenue">Operating Revenue</option>
              <option value="operating_expense">Operating Expense</option>
              <option value="non_operating_revenue">Non Operating Revenue</option>
              <option value="non_operating_expense">Non Operating Expense</option>
            </select>
          </div>

          <!-- Saldo Normal -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Saldo Normal *</label>
            <select
              v-model="formData.normal_balance"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Pilih Saldo Normal --</option>
              <option value="debit">Debit</option>
              <option value="credit">Credit</option>
            </select>
          </div>

          <!-- Status (Checkbox) -->
          <div class="flex items-center gap-3">
            <input
              v-model="formData.is_active"
              type="checkbox"
              id="is_active"
              class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label for="is_active" class="text-sm font-medium text-gray-700">Aktif</label>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t sticky bottom-0">
          <button
            @click="closeModal"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            Batal
          </button>
          <button
            @click="saveForm"
            :disabled="isLoading"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {{ isLoading ? 'Menyimpan...' : isEditMode ? 'Perbarui' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
        <div class="p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-2">Hapus CoA</h3>
          <p class="text-gray-600 mb-6">
            Apakah Anda yakin ingin menghapus CoA
            <strong>{{ deleteConfirmData?.code }} - {{ deleteConfirmData?.name }}</strong
            >?
          </p>
          <div class="flex gap-3 justify-end">
            <button
              @click="showDeleteConfirm = false"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              Batal
            </button>
            <button
              @click="confirmDelete"
              :disabled="isLoading"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              {{ isLoading ? 'Menghapus...' : 'Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getChartOfAccounts,
  getChartOfAccountById,
  createChartOfAccount,
  updateChartOfAccount,
  deleteChartOfAccount,
} from './apiChartOfAccounts'

export default {
  name: 'ChartOfAccounts',
  data() {
    return {
      chartOfAccounts: [],
      filteredData: [],
      searchQuery: '',
      filterType: '',
      filterStatus: '',
      currentPage: 1,
      itemsPerPage: 10,
      showModal: false,
      showDeleteConfirm: false,
      isEditMode: false,
      isLoading: false,
      deleteConfirmData: null,
      notification: {
        show: false,
        type: 'success',
        message: '',
      },
      formData: {
        code: '',
        name: '',
        description: '',
        type: '',
        category: '',
        normal_balance: '',
        is_active: true,
      },
    }
  },
  computed: {
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredData.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage)
    },
  },
  watch: {
    searchQuery() {
      this.applyFilters()
    },
    filterType() {
      this.applyFilters()
    },
    filterStatus() {
      this.applyFilters()
    },
  },
  methods: {
    async fetchData() {
      try {
        const response = await getChartOfAccounts()
        const isSuccess = response?.success === true || response?.status === true
        if (isSuccess) {
          this.chartOfAccounts = response.data || []
          this.applyFilters()
        }
      } catch (error) {
        console.error('Failed to fetch chart of accounts', error)
        this.showNotification('error', 'Gagal memuat data Chart of Accounts')
      }
    },
    applyFilters() {
      let filtered = this.chartOfAccounts

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(
          (item) =>
            item.code.toLowerCase().includes(query) ||
            item.name.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query),
        )
      }

      if (this.filterType) {
        filtered = filtered.filter((item) => item.type === this.filterType)
      }

      if (this.filterStatus !== '') {
        filtered = filtered.filter(
          (item) => item.is_active === (this.filterStatus === 'true' || this.filterStatus === true),
        )
      }

      this.filteredData = filtered
      this.currentPage = 1
    },
    openCreateModal() {
      this.isEditMode = false
      this.resetForm()
      this.showModal = true
    },
    async openEditModal(item) {
      try {
        const response = await getChartOfAccountById(item.id)
        const isSuccess = response?.success === true || response?.status === true
        if (isSuccess) {
          this.formData = { ...response.data }
          this.isEditMode = true
          this.showModal = true
        }
      } catch (error) {
        console.error('Failed to load chart of account detail', error)
        this.showNotification('error', 'Gagal memuat detail CoA')
      }
    },
    closeModal() {
      this.showModal = false
      this.resetForm()
    },
    resetForm() {
      this.formData = {
        code: '',
        name: '',
        description: '',
        type: '',
        category: '',
        normal_balance: '',
        is_active: true,
      }
    },
    async saveForm() {
      if (
        !this.formData.code ||
        !this.formData.name ||
        !this.formData.type ||
        !this.formData.category ||
        !this.formData.normal_balance
      ) {
        this.showNotification('error', 'Harap lengkapi semua field yang wajib')
        return
      }

      this.isLoading = true
      try {
        let response
        if (this.isEditMode) {
          response = await updateChartOfAccount(this.formData.id, this.formData)
          this.showNotification('success', 'CoA berhasil diperbarui')
        } else {
          response = await createChartOfAccount(this.formData)
          this.showNotification('success', 'CoA berhasil ditambahkan')
        }

        const isSuccess = response?.success === true || response?.status === true
        if (isSuccess) {
          this.closeModal()
          await this.fetchData()
        }
      } catch (error) {
        console.error('Failed to save chart of account', error)
        this.showNotification(
          'error',
          this.isEditMode ? 'Gagal memperbarui CoA' : 'Gagal menambahkan CoA',
        )
      } finally {
        this.isLoading = false
      }
    },
    openDeleteConfirm(item) {
      this.deleteConfirmData = item
      this.showDeleteConfirm = true
    },
    async confirmDelete() {
      this.isLoading = true
      try {
        const response = await deleteChartOfAccount(this.deleteConfirmData.id)
        const isSuccess = response?.success === true || response?.status === true
        if (isSuccess) {
          this.showNotification('success', 'CoA berhasil dihapus')
          this.showDeleteConfirm = false
          await this.fetchData()
        }
      } catch (error) {
        console.error('Failed to delete chart of account', error)
        this.showNotification('error', 'Gagal menghapus CoA')
      } finally {
        this.isLoading = false
      }
    },
    showNotification(type, message) {
      this.notification = {
        show: true,
        type,
        message,
      }
      setTimeout(() => {
        this.notification.show = false
      }, 3000)
    },
    formatCategory(category) {
      const categoryMap = {
        current_asset: 'Aset Lancar',
        fixed_asset: 'Aset Tetap',
        current_liability: 'Liabilitas Lancar',
        long_term_liability: 'Liabilitas Jangka Panjang',
        owner_equity: 'Ekuitas Pemilik',
        operating_revenue: 'Pendapatan Operasional',
        operating_expense: 'Biaya Operasional',
        non_operating_revenue: 'Pendapatan Non-Operasional',
        non_operating_expense: 'Biaya Non-Operasional',
      }
      return categoryMap[category] || category
    },
  },
  mounted() {
    this.fetchData()
  },
}
</script>

<style scoped>
/* Add any component-specific styles here if needed */
</style>
