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
    <div
      class="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-5 text-white shadow-lg"
    >
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold tracking-tight">Jurnal Umum</h2>
          <p class="text-white/90 text-sm">
            Kelola semua entri jurnal manual dan penyesuaian akuntansi
          </p>
        </div>
        <button
          @click="openCreateModal"
          class="inline-flex items-center gap-2 px-4 py-2 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Buat Jurnal
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
            placeholder="Cari berdasarkan nomor referensi atau deskripsi..."
            class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          v-model="filterStatus"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Filter Status</option>
          <option value="draft">Draft</option>
          <option value="posted">Posted</option>
        </select>
      </div>
      <div>
        <input
          v-model="filterStartDate"
          type="date"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500"
        />
      </div>
    </div>

    <!-- Filter End Date -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-3">
      <div>
        <input
          v-model="filterEndDate"
          type="date"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div class="lg:col-span-3"></div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
              <th class="px-6 py-3 text-left text-sm font-semibold">Tanggal</th>
              <th class="px-6 py-3 text-left text-sm font-semibold">No. Referensi</th>
              <th class="px-6 py-3 text-left text-sm font-semibold">Deskripsi</th>
              <th class="px-6 py-3 text-right text-sm font-semibold">Total Debit</th>
              <th class="px-6 py-3 text-right text-sm font-semibold">Total Credit</th>
              <th class="px-6 py-3 text-center text-sm font-semibold">Status</th>
              <th class="px-6 py-3 text-left text-sm font-semibold">Dibuat Oleh</th>
              <th class="px-6 py-3 text-center text-sm font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in paginatedData"
              :key="index"
              class="border-b hover:bg-gray-50 transition"
            >
              <td class="px-6 py-3 text-gray-900">{{ formatDate(item.entry_date) }}</td>
              <td class="px-6 py-3 font-medium text-purple-600">{{ item.reference_number }}</td>
              <td class="px-6 py-3 text-gray-800">{{ item.description }}</td>
              <td class="px-6 py-3 text-right font-medium text-gray-900">
                {{ formatCurrency(calculateTotalDebit(item)) }}
              </td>
              <td class="px-6 py-3 text-right font-medium text-gray-900">
                {{ formatCurrency(calculateTotalCredit(item)) }}
              </td>
              <td class="px-6 py-3 text-center">
                <span
                  class="inline-block px-3 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-yellow-100 text-yellow-800': item.status === 'draft',
                    'bg-green-100 text-green-800': item.status === 'posted',
                  }"
                >
                  {{ item.status === 'draft' ? 'Draft' : 'Posted' }}
                </span>
              </td>
              <td class="px-6 py-3 text-sm text-gray-600">{{ item.created_by || '-' }}</td>
              <td class="px-6 py-3 text-center">
                <div class="flex gap-2 justify-center">
                  <button
                    @click="openEditModal(item)"
                    :disabled="item.status === 'posted'"
                    class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    :title="item.status === 'posted' ? 'Cannot edit posted entries' : 'Edit'"
                  >
                    Edit
                  </button>
                  <button
                    @click="openViewModal(item)"
                    class="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition"
                  >
                    Lihat
                  </button>
                  <button
                    @click="openDeleteConfirm(item)"
                    :disabled="item.status === 'posted'"
                    class="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    :title="item.status === 'posted' ? 'Cannot delete posted entries' : 'Delete'"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredData.length === 0">
              <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                Tidak ada data jurnal umum
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
                  'bg-purple-500 text-white': currentPage === page,
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
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 sticky top-0">
          <h3 class="text-xl font-bold">
            {{ isEditMode ? 'Edit Jurnal Umum' : 'Buat Jurnal Umum Baru' }}
          </h3>
        </div>

        <!-- Modal Content -->
        <div class="p-6 space-y-4">
          <!-- Entry Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Jurnal *</label>
            <input
              v-model="formData.entry_date"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <!-- Reference Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">No. Referensi *</label>
            <input
              v-model="formData.reference_number"
              type="text"
              placeholder="cth: MISC-001"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi *</label>
            <textarea
              v-model="formData.description"
              placeholder="Deskripsi jurnal"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows="2"
            ></textarea>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status *</label>
            <select
              v-model="formData.status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">-- Pilih Status --</option>
              <option value="draft">Draft</option>
              <option value="posted">Posted</option>
            </select>
          </div>

          <!-- Journal Lines Section -->
          <div class="border-t-2 pt-4">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-lg font-semibold text-gray-800">Detail Jurnal</h4>
              <button
                @click="addLine"
                class="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition"
              >
                + Tambah Baris
              </button>
            </div>

            <!-- Lines Table -->
            <div class="overflow-x-auto mb-4">
              <table class="w-full text-sm border border-gray-200 rounded">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="px-3 py-2 text-left font-medium text-gray-700">Akun CoA</th>
                    <th class="px-3 py-2 text-left font-medium text-gray-700">Deskripsi</th>
                    <th class="px-3 py-2 text-right font-medium text-gray-700">Debit</th>
                    <th class="px-3 py-2 text-right font-medium text-gray-700">Credit</th>
                    <th class="px-3 py-2 text-center font-medium text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(line, idx) in formData.lines" :key="idx" class="border-t">
                    <td class="px-3 py-2">
                      <input
                        v-model="line.account_code"
                        type="text"
                        placeholder="Pilih akun"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-purple-500"
                      />
                      <div class="text-xs text-gray-500 mt-1">{{ line.account_name }}</div>
                    </td>
                    <td class="px-3 py-2">
                      <input
                        v-model="line.description"
                        type="text"
                        placeholder="Deskripsi"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-purple-500"
                      />
                    </td>
                    <td class="px-3 py-2">
                      <input
                        v-model.number="line.debit"
                        type="number"
                        placeholder="0"
                        step="0.01"
                        min="0"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-xs text-right focus:ring-1 focus:ring-purple-500"
                      />
                    </td>
                    <td class="px-3 py-2">
                      <input
                        v-model.number="line.credit"
                        type="number"
                        placeholder="0"
                        step="0.01"
                        min="0"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-xs text-right focus:ring-1 focus:ring-purple-500"
                      />
                    </td>
                    <td class="px-3 py-2 text-center">
                      <button
                        @click="removeLine(idx)"
                        class="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Totals Summary -->
            <div class="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded border border-gray-200">
              <div>
                <div class="text-xs text-gray-600">Total Debit</div>
                <div class="text-lg font-bold text-purple-600">
                  {{ formatCurrency(calculateFormTotalDebit()) }}
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-600">Total Credit</div>
                <div class="text-lg font-bold text-purple-600">
                  {{ formatCurrency(calculateFormTotalCredit()) }}
                </div>
              </div>
            </div>

            <!-- Balance Check -->
            <div
              class="mt-3 p-3 rounded text-sm"
              :class="{
                'bg-green-50 text-green-800 border border-green-200':
                  Math.abs(calculateFormTotalDebit() - calculateFormTotalCredit()) < 0.01,
                'bg-red-50 text-red-800 border border-red-200':
                  Math.abs(calculateFormTotalDebit() - calculateFormTotalCredit()) >= 0.01,
              }"
            >
              <span class="font-medium">
                {{
                  Math.abs(calculateFormTotalDebit() - calculateFormTotalCredit()) < 0.01
                    ? '✓ Debit dan Credit seimbang'
                    : '✗ Debit dan Credit tidak seimbang (Selisih: ' +
                      Math.abs(calculateFormTotalDebit() - calculateFormTotalCredit()).toFixed(2) +
                      ')'
                }}
              </span>
            </div>
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
            :disabled="
              isLoading || Math.abs(calculateFormTotalDebit() - calculateFormTotalCredit()) >= 0.01
            "
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            :title="
              Math.abs(calculateFormTotalDebit() - calculateFormTotalCredit()) >= 0.01
                ? 'Debit dan Credit harus seimbang'
                : ''
            "
          >
            {{ isLoading ? 'Menyimpan...' : isEditMode ? 'Perbarui' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <div
      v-if="showViewModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 sticky top-0">
          <h3 class="text-xl font-bold">Detail Jurnal Umum</h3>
        </div>

        <!-- Modal Content -->
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-xs text-gray-600">Tanggal Jurnal</div>
              <div class="font-medium text-gray-900">{{ formatDate(viewData.entry_date) }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-600">No. Referensi</div>
              <div class="font-medium text-purple-600">{{ viewData.reference_number }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-600">Status</div>
              <span
                class="inline-block px-3 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-yellow-100 text-yellow-800': viewData.status === 'draft',
                  'bg-green-100 text-green-800': viewData.status === 'posted',
                }"
              >
                {{ viewData.status === 'draft' ? 'Draft' : 'Posted' }}
              </span>
            </div>
            <div>
              <div class="text-xs text-gray-600">Dibuat Oleh</div>
              <div class="font-medium text-gray-900">{{ viewData.created_by || '-' }}</div>
            </div>
          </div>

          <div>
            <div class="text-xs text-gray-600">Deskripsi</div>
            <div class="font-medium text-gray-900">{{ viewData.description }}</div>
          </div>

          <!-- Journal Lines -->
          <div class="border-t-2 pt-4">
            <h4 class="text-lg font-semibold text-gray-800 mb-3">Detail Jurnal</h4>
            <div class="overflow-x-auto">
              <table class="w-full text-sm border border-gray-200 rounded">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="px-3 py-2 text-left font-medium text-gray-700">Akun</th>
                    <th class="px-3 py-2 text-left font-medium text-gray-700">Deskripsi</th>
                    <th class="px-3 py-2 text-right font-medium text-gray-700">Debit</th>
                    <th class="px-3 py-2 text-right font-medium text-gray-700">Credit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(line, idx) in viewData.journal_lines" :key="idx" class="border-t">
                    <td class="px-3 py-2">{{ line.chart_of_account_id }}</td>
                    <td class="px-3 py-2">{{ line.description }}</td>
                    <td class="px-3 py-2 text-right">
                      {{ line.debit ? formatCurrency(parseFloat(line.debit)) : '-' }}
                    </td>
                    <td class="px-3 py-2 text-right">
                      {{ line.credit ? formatCurrency(parseFloat(line.credit)) : '-' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Totals Summary -->
            <div class="grid grid-cols-2 gap-4 p-3 mt-4 bg-gray-50 rounded border border-gray-200">
              <div>
                <div class="text-xs text-gray-600">Total Debit</div>
                <div class="text-lg font-bold text-purple-600">
                  {{ formatCurrency(calculateTotalDebit(viewData)) }}
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-600">Total Credit</div>
                <div class="text-lg font-bold text-purple-600">
                  {{ formatCurrency(calculateTotalCredit(viewData)) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t sticky bottom-0">
          <button
            @click="showViewModal = false"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            Tutup
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
          <h3 class="text-lg font-bold text-gray-900 mb-2">Hapus Jurnal Umum</h3>
          <p class="text-gray-600 mb-6">
            Apakah Anda yakin ingin menghapus jurnal
            <strong>{{ deleteConfirmData?.reference_number }}</strong>
            ({{ deleteConfirmData?.description }})?
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
  getJournalEntries,
  getJournalEntryById,
  createMiscellaneousJournal,
  updateJournalEntry,
  deleteJournalEntry,
} from './apiJournalEntries'

export default {
  name: 'JournalEntries',
  data() {
    return {
      journalEntries: [],
      filteredData: [],
      searchQuery: '',
      filterStatus: '',
      filterStartDate: '',
      filterEndDate: '',
      currentPage: 1,
      itemsPerPage: 10,
      showModal: false,
      showViewModal: false,
      showDeleteConfirm: false,
      isEditMode: false,
      isLoading: false,
      deleteConfirmData: null,
      viewData: {
        entry_date: '',
        reference_number: '',
        description: '',
        status: 'draft',
        created_by: '',
        journal_lines: [],
      },
      notification: {
        show: false,
        type: 'success',
        message: '',
      },
      formData: {
        entry_date: '',
        reference_number: '',
        description: '',
        status: 'draft',
        created_by: '',
        lines: [
          {
            account_code: '',
            account_name: '',
            description: '',
            debit: 0,
            credit: 0,
          },
          {
            account_code: '',
            account_name: '',
            description: '',
            debit: 0,
            credit: 0,
          },
        ],
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
    filterStatus() {
      this.applyFilters()
    },
    filterStartDate() {
      this.applyFilters()
    },
    filterEndDate() {
      this.applyFilters()
    },
  },
  methods: {
    async fetchData() {
      try {
        const params = {}
        if (this.filterStartDate) params.start_date = this.filterStartDate
        if (this.filterEndDate) params.end_date = this.filterEndDate
        if (this.filterStatus) params.status = this.filterStatus

        const response = await getJournalEntries(params)
        if (response.success) {
          this.journalEntries = response.data || []
          this.applyFilters()
        }
      } catch (error) {
        console.error('Failed to fetch journal entries', error)
        this.showNotification('error', 'Gagal memuat data jurnal')
      }
    },
    applyFilters() {
      let filtered = this.journalEntries

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(
          (item) =>
            item.reference_number.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query),
        )
      }

      if (this.filterStatus) {
        filtered = filtered.filter((item) => item.status === this.filterStatus)
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
        const response = await getJournalEntryById(item.id)
        if (response.success) {
          const data = response.data
          this.formData = {
            id: data.id,
            entry_date: data.entry_date,
            reference_number: data.reference_number,
            description: data.description,
            status: data.status,
            created_by: data.created_by,
            lines: data.journal_lines.map((line) => ({
              id: line.id,
              account_code: line.chart_of_account_id,
              account_name: line.account_name || '',
              description: line.description,
              debit: parseFloat(line.debit) || 0,
              credit: parseFloat(line.credit) || 0,
            })),
          }
          this.isEditMode = true
          this.showModal = true
        }
      } catch (error) {
        console.error('Failed to load journal entry detail', error)
        this.showNotification('error', 'Gagal memuat detail jurnal')
      }
    },
    openViewModal(item) {
      this.viewData = item
      this.showViewModal = true
    },
    closeModal() {
      this.showModal = false
      this.resetForm()
    },
    resetForm() {
      this.formData = {
        entry_date: new Date().toISOString().split('T')[0],
        reference_number: '',
        description: '',
        status: 'draft',
        created_by: '',
        lines: [
          {
            account_code: '',
            account_name: '',
            description: '',
            debit: 0,
            credit: 0,
          },
          {
            account_code: '',
            account_name: '',
            description: '',
            debit: 0,
            credit: 0,
          },
        ],
      }
    },
    addLine() {
      this.formData.lines.push({
        account_code: '',
        account_name: '',
        description: '',
        debit: 0,
        credit: 0,
      })
    },
    removeLine(idx) {
      if (this.formData.lines.length > 2) {
        this.formData.lines.splice(idx, 1)
      } else {
        this.showNotification('error', 'Minimal harus ada 2 baris jurnal')
      }
    },
    calculateFormTotalDebit() {
      return this.formData.lines.reduce((sum, line) => sum + (parseFloat(line.debit) || 0), 0)
    },
    calculateFormTotalCredit() {
      return this.formData.lines.reduce((sum, line) => sum + (parseFloat(line.credit) || 0), 0)
    },
    calculateTotalDebit(item) {
      if (!item.journal_lines) return 0
      return item.journal_lines.reduce((sum, line) => sum + parseFloat(line.debit || 0), 0)
    },
    calculateTotalCredit(item) {
      if (!item.journal_lines) return 0
      return item.journal_lines.reduce((sum, line) => sum + parseFloat(line.credit || 0), 0)
    },
    async saveForm() {
      if (
        !this.formData.entry_date ||
        !this.formData.reference_number ||
        !this.formData.description
      ) {
        this.showNotification('error', 'Harap lengkapi semua field yang wajib')
        return
      }

      if (Math.abs(this.calculateFormTotalDebit() - this.calculateFormTotalCredit()) >= 0.01) {
        this.showNotification('error', 'Debit dan Credit harus seimbang')
        return
      }

      if (this.formData.lines.length < 2) {
        this.showNotification('error', 'Minimal harus ada 2 baris jurnal')
        return
      }

      this.isLoading = true
      try {
        const payload = {
          entry_date: this.formData.entry_date,
          reference_number: this.formData.reference_number,
          description: this.formData.description,
          status: this.formData.status,
          created_by: this.formData.created_by || 'system',
          lines: this.formData.lines.map((line) => ({
            chart_of_account_id: line.account_code,
            description: line.description,
            debit: parseFloat(line.debit) || 0,
            credit: parseFloat(line.credit) || 0,
          })),
        }

        let response
        if (this.isEditMode) {
          response = await updateJournalEntry(this.formData.id, payload)
          this.showNotification('success', 'Jurnal berhasil diperbarui')
        } else {
          response = await createMiscellaneousJournal(payload)
          this.showNotification('success', 'Jurnal berhasil ditambahkan')
        }

        if (response.success) {
          this.closeModal()
          await this.fetchData()
        }
      } catch (error) {
        console.error('Failed to save journal entry', error)
        this.showNotification(
          'error',
          this.isEditMode ? 'Gagal memperbarui jurnal' : 'Gagal menambahkan jurnal',
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
        const response = await deleteJournalEntry(this.deleteConfirmData.id)
        if (response.success) {
          this.showNotification('success', 'Jurnal berhasil dihapus')
          this.showDeleteConfirm = false
          await this.fetchData()
        }
      } catch (error) {
        console.error('Failed to delete journal entry', error)
        this.showNotification('error', 'Gagal menghapus jurnal')
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
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },
    formatCurrency(value) {
      if (typeof value !== 'number') return 'Rp 0'
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 2,
      }).format(value)
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
