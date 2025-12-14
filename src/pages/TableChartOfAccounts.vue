<template>
  <div class="container mx-auto mt-10 space-y-4">
    <!-- Toolbar: Search + Tambah -->
    <div class="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
      <div class="relative w-full md:max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari Chart of Account..."
          class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Cari Chart of Account"
        />
        <!-- icon search -->
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

      <div class="flex gap-2">
        <button
          v-if="searchQuery"
          type="button"
          class="rounded-xl bg-white px-4 py-2 text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
          @click="searchQuery = ''"
          title="Bersihkan pencarian"
        >
          Bersihkan
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white font-medium shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="openModal()"
        >
          <span class="material-symbols-outlined">add</span>
          Tambah Chart of Account
        </button>
      </div>
    </div>

    <!-- Info kecil -->
    <p class="text-sm text-gray-500">
      Menampilkan {{ filteredAccounts.length }} dari {{ accounts.length }} data.
    </p>

    <!-- Tabel untuk layar lebar -->
    <table
      class="min-w-full bg-white border border-blue-100 rounded-2xl shadow-xl overflow-hidden hidden md:table"
    >
      <thead class="bg-gradient-to-r from-blue-100 to-teal-100">
        <tr>
          <th class="px-6 py-4 text-left text-sm font-semibold text-blue-700">Code</th>
          <th class="px-6 py-4 text-left text-sm font-semibold text-blue-700">Name</th>
          <th class="px-6 py-4 text-left text-sm font-semibold text-blue-700">Type</th>
          <th class="px-6 py-4 text-left text-sm font-semibold text-blue-700">Category</th>
          <th class="px-6 py-4 text-left text-sm font-semibold text-blue-700">Active</th>
          <th class="px-6 py-4 text-left text-sm font-semibold text-blue-700">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(account, index) in filteredAccounts"
          :key="account.id"
          :class="
            (index % 2 === 0 ? 'bg-teal-50' : 'bg-white') + ' hover:bg-blue-50 transition-all'
          "
        >
          <td class="px-6 py-4 text-sm text-gray-700">{{ account.code }}</td>
          <td class="px-6 py-4 text-sm text-gray-700">{{ account.name }}</td>
          <td class="px-6 py-4 text-sm text-gray-700">{{ account.type }}</td>
          <td class="px-6 py-4 text-sm text-gray-700">{{ account.category }}</td>
          <td class="px-6 py-4 text-sm">
            <button
              @click="toggleActive(account)"
              :class="account.is_active ? 'bg-green-500' : 'bg-gray-400'"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span
                :class="account.is_active ? 'translate-x-6' : 'translate-x-1'"
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              ></span>
            </button>
          </td>
          <td class="px-6 py-4 text-sm">
            <button
              class="border border-orange-400 bg-transparent text-orange-500 p-2 shadow hover:ring-2 hover:ring-orange-300 transition-all duration-200"
              @click="openModal(account)"
              title="Edit"
            >
              <span class="material-symbols-outlined">edit_square</span>
            </button>
            <button
              class="border border-red-400 bg-transparent text-red-500 p-2 shadow hover:ring-2 hover:ring-red-300 transition-all duration-200 mt-2"
              @click="deleteAccount(account.id)"
              title="Hapus"
            >
              <span class="material-symbols-outlined">delete</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Card per baris untuk layar mobile -->
    <div class="md:hidden">
      <div
        v-for="account in filteredAccounts"
        :key="account.id"
        class="bg-white border border-blue-100 rounded-2xl shadow-xl mb-4 p-6 hover:shadow-blue-200 transition-all duration-200"
      >
        <div class="flex justify-between mb-2">
          <h3 class="text-lg font-bold text-blue-700">{{ account.code }}</h3>
          <button
            @click="toggleActive(account)"
            :class="account.is_active ? 'bg-green-500' : 'bg-gray-400'"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span
              :class="account.is_active ? 'translate-x-6' : 'translate-x-1'"
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            ></span>
          </button>
        </div>
        <p class="text-sm text-gray-600">Name: {{ account.name }}</p>
        <p class="text-sm text-gray-600">Type: {{ account.type }}</p>
        <p class="text-sm text-gray-600">Category: {{ account.category }}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <button
            class="border border-orange-400 bg-transparent text-orange-500 px-3 py-2 shadow hover:ring-2 hover:ring-orange-300 transition-all duration-200"
            @click="openModal(account)"
          >
            <span class="material-symbols-outlined">edit_square</span> Edit
          </button>
          <button
            class="border border-red-400 bg-transparent text-red-500 px-3 py-2 shadow hover:ring-2 hover:ring-red-300 transition-all duration-200"
            @click="deleteAccount(account.id)"
          >
            <span class="material-symbols-outlined">delete</span> Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!filteredAccounts.length" class="text-center text-gray-500 py-10">
      Tidak ada data yang cocok dengan pencarian.
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeModal"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
        @click.stop
      >
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ isEditing ? 'Edit' : 'Tambah' }} Chart of Account
          </h3>
          <form @submit.prevent="submitForm">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">Code</label>
              <input
                v-model="form.code"
                type="text"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">Name</label>
              <input
                v-model="form.name"
                type="text"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">Type</label>
              <select
                v-model="form.type"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Pilih Type</option>
                <option value="cash">Cash</option>
                <option value="bank">Bank</option>
                <option value="asset">Asset</option>
                <option value="liability">Liability</option>
                <option value="equity">Equity</option>
                <option value="revenue">Revenue</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">Category</label>
              <input
                v-model="form.category"
                type="text"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">Normal Balance</label>
              <select
                v-model="form.normal_balance"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Pilih Normal Balance</option>
                <option value="debit">Debit</option>
                <option value="credit">Credit</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">Active</label>
              <button
                @click="form.is_active = !form.is_active"
                :class="form.is_active ? 'bg-green-500' : 'bg-gray-400'"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span
                  :class="form.is_active ? 'translate-x-6' : 'translate-x-1'"
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                ></span>
              </button>
            </div>
            <div class="flex items-center justify-between">
              <button
                type="submit"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {{ isEditing ? 'Update' : 'Tambah' }}
              </button>
              <button
                type="button"
                @click="closeModal"
                class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <ToastCard v-if="show_toast" :message="message_toast" @close="tutupToast" />
  <LoadingOverlay />
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import { BASE_URL } from '@/base.utils.url'
import { useLoadingStore } from '../stores/loading'
import LoadingOverlay from '../components/LoadingOverlay.vue'
import ToastCard from '@/components/ToastCard.vue'

export default {
  components: {
    LoadingOverlay,
    ToastCard,
  },
  setup() {
    const loadingStore = useLoadingStore()
    const show_toast = ref(false)
    const message_toast = ref('')

    return {
      loadingStore,
      show_toast,
      message_toast,
    }
  },
  data() {
    return {
      searchQuery: '',
      accounts: [],
      showModal: false,
      isEditing: false,
      currentAccount: null,
      form: {
        code: '',
        name: '',
        type: '',
        category: '',
        normal_balance: '',
        is_active: true,
      },
    }
  },
  computed: {
    filteredAccounts() {
      const q = this.searchQuery.trim().toLowerCase()
      if (!q) return this.accounts

      return this.accounts.filter((account) => {
        const haystack = [account.code, account.name, account.type, account.category]
          .filter(Boolean)
          .join(' | ')
          .toLowerCase()

        return haystack.includes(q)
      })
    },
  },
  mounted() {
    this.fetchAccounts()
  },
  methods: {
    async fetchAccounts() {
      this.loadingStore.show()
      try {
        const response = await axios.get(`${BASE_URL}chart-of-accounts`)
        this.accounts = response.data.data || []
      } catch (error) {
        this.showToast(error.response?.data?.message || 'Gagal memuat data Chart of Accounts')
      } finally {
        this.loadingStore.hide()
      }
    },
    openModal(account = null) {
      this.isEditing = !!account
      if (account) {
        this.currentAccount = account
        this.form = { ...account }
      } else {
        this.currentAccount = null
        this.form = {
          code: '',
          name: '',
          type: '',
          category: '',
          normal_balance: '',
          is_active: true,
        }
      }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.isEditing = false
      this.currentAccount = null
    },
    async submitForm() {
      this.loadingStore.show()
      try {
        if (this.isEditing) {
          await axios.put(`${BASE_URL}chart-of-accounts/${this.currentAccount.id}`, this.form)
          this.showToast('Chart of Account berhasil diupdate')
        } else {
          await axios.post(`${BASE_URL}chart-of-accounts`, this.form)
          this.showToast('Chart of Account berhasil ditambahkan')
        }
        this.closeModal()
        this.fetchAccounts()
      } catch (error) {
        this.showToast(error.response?.data?.message || 'Gagal menyimpan Chart of Account')
      } finally {
        this.loadingStore.hide()
      }
    },
    async toggleActive(account) {
      this.loadingStore.show()
      try {
        await axios.put(`${BASE_URL}chart-of-accounts/${account.id}`, {
          ...account,
          is_active: !account.is_active,
        })
        account.is_active = !account.is_active
        this.showToast('Status berhasil diubah')
      } catch (error) {
        this.showToast(error.response?.data?.message || 'Gagal mengubah status')
      } finally {
        this.loadingStore.hide()
      }
    },
    async deleteAccount(id) {
      if (!confirm('Apakah Anda yakin ingin menghapus Chart of Account ini?')) return

      this.loadingStore.show()
      try {
        await axios.delete(`${BASE_URL}chart-of-accounts/${id}`)
        this.showToast('Chart of Account berhasil dihapus')
        this.fetchAccounts()
      } catch (error) {
        this.showToast(error.response?.data?.message || 'Gagal menghapus Chart of Account')
      } finally {
        this.loadingStore.hide()
      }
    },
    showToast(message) {
      this.message_toast = message
      this.show_toast = true
      setTimeout(() => {
        this.show_toast = false
      }, 3000)
    },
  },
}
</script>

<style scoped>
.material-symbols-outlined {
  font-size: 18px;
  line-height: 1;
}
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
