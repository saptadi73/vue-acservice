<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white shadow-lg">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold tracking-tight">Daftar Pelanggan & Servis AC</h2>
          <p class="text-white/90 text-sm">
            Pantau riwayat dan jadwal servis AC berikutnya secara cepat.
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <span class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm">
            <span class="h-2 w-2 rounded-full bg-emerald-400"></span> Aman
          </span>
          <span class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm">
            <span class="h-2 w-2 rounded-full bg-amber-400"></span> Dekat Jatuh Tempo
          </span>
          <span class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm">
            <span class="h-2 w-2 rounded-full bg-rose-400"></span> Terlambat
          </span>
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-3">
      <div class="lg:col-span-2">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari pelanggan, plat, model, alamat..."
            class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <!-- search icon -->
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
          class="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Filter Status</option>
          <option v-for="o in statusOptions" :key="o.label" :value="o.label">
            {{ o.label }} ({{ o.count }})
          </option>
        </select>
      </div>
      <div>
        <select
          v-model="filterBrand"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Filter Brand</option>
          <option v-for="b in brandOptions" :key="b" :value="b">{{ b }}</option>
        </select>
      </div>
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6">
      <div
        v-for="(customer, index) in filteredCustomers"
        :key="index"
        class="group relative overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100 hover:shadow-xl transition"
      >
        <!-- Photo badge -->
        <div class="absolute z-20 top-4 left-4">
          <img
            :src="`${BASE_URL}${customer.gambar_customer}`"
            alt="Customer"
            class="h-14 w-14 rounded-full border-4 border-white shadow-lg ring-2 ring-white/60"
          />
        </div>

        <!-- Cover car -->
        <div class="relative">
          <img
            :src="
              customer.gambar_ac
                ? `${BASE_URL}${customer.gambar_ac}`
                : `${BASE_URL}/uploads/assets/ac_default.png`
            "
            alt="Car"
            class="w-full h-56 object-cover"
          />
          <!-- status badge -->
          <div class="absolute top-4 right-4">
            <span
              class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-white shadow-md"
              :class="{
                'bg-blue-600': customer.status === 'Selesai',
                'bg-emerald-600': customer.status === 'Progress',
                'bg-gray-700': customer.status === 'Tidak dalam Antrean',
              }"
            >
              <span class="h-2 w-2 rounded-full bg-white"></span>
              {{ customer.status }}
            </span>
          </div>

          <!-- gradient overlay on hover -->
          <div
            class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition"
          ></div>
        </div>

        <!-- Content -->
        <div class="p-5">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 leading-tight">{{ customer.nama }}</h3>
              <p class="text-sm text-gray-500">{{ customer.alamat }}</p>
            </div>
            <!-- brand & type chip -->
            <div class="text-right">
              <div class="mb-1">
                <span
                  class="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                  >{{ customer.brand }}</span
                >
              </div>
              <span
                class="inline-block rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-600"
                >{{ customer.tipe }}</span
              >
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-700">
            <div><span class="font-medium">Tipe AC:</span> {{ customer.tipe }}</div>
            <div><span class="font-medium">Kode:</span> {{ customer.kode_pelanggan }}</div>
            <div><span class="font-medium">Kapasitas:</span> {{ customer.kapasitas }}</div>
            <div><span class="font-medium">Freon:</span> {{ customer.freon }}</div>
            <div><span class="font-medium">Lokasi:</span> {{ customer.lokasi }}</div>
            <div><span class="font-medium">HP:</span> {{ customer.hp }}</div>
          </div>

          <!-- Service timeline -->
          <div class="mt-5 rounded-xl border border-gray-100 bg-gray-50/60 p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <!-- wrench icon -->
                <svg class="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 3a7 7 0 0 1-9.8 6.4l-6.8 6.8a2 2 0 1 1-2.8-2.8l6.8-6.8A7 7 0 1 1 21 3Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                </svg>
                <span class="text-sm font-semibold text-gray-800">Servis</span>
              </div>
              <span
                class="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium text-white"
                :class="servicePillClass(customer)"
                :title="serviceTitle(customer)"
              >
                <span class="h-2 w-2 rounded-full bg-white"></span>
                {{ serviceBadge(customer) }}
              </span>
            </div>

            <div class="mt-3 grid grid-cols-2 gap-3">
              <div class="rounded-lg bg-white p-3 ring-1 ring-gray-100">
                <div class="text-[11px] text-gray-500">Last Service</div>
                <div class="font-medium text-gray-900">{{ formatDate(customer._lastService) }}</div>
              </div>
              <div class="rounded-lg bg-white p-3 ring-1 ring-gray-100">
                <div class="text-[11px] text-gray-500">Next Service</div>
                <div class="font-medium" :class="nextServiceTextClass(customer)">
                  {{ formatDate(customer._nextService) }}
                </div>
              </div>
            </div>

            <div class="mt-2 text-[12px] text-gray-500">
              {{ serviceNote(customer) }}
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-4 flex items-center gap-2">
            <button
              @click="openUpdateServiceModal(customer)"
              class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <!-- bell -->
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 8a6 6 0 1 1 12 0v4l1.5 3H4.5L6 12V8Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M10 19a2 2 0 1 0 4 0"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
              Ingatkan
            </button>
            <button
              @click="$router.push({ name: 'wo service baru', params: { id: customer.asset_id } })"
              class="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-gray-700 text-sm font-medium ring-1 ring-gray-200 hover:bg-gray-50"
            >
              <!-- pencil -->
              <span class="material-symbols-outlined">plumbing</span>
              Service
            </button>
            <button
              @click="openHistoryModal(customer)"
              class="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-gray-700 text-sm font-medium ring-1 ring-gray-200 hover:bg-gray-50"
              title="Lihat History Service"
            >
              <!-- history icon -->
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <button
              @click="$router.push({ name: 'wo jual baru', params: { id: customer.asset_id } })"
              class="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-gray-700 text-sm font-medium ring-1 ring-gray-200 hover:bg-gray-50"
            >
              <!-- pencil -->
              <span class="material-symbols-outlined">tools_power_drill</span>
              Pasang Baru
            </button>

            <button
              class="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-gray-700 text-sm font-medium ring-1 ring-gray-200 hover:bg-gray-50"
            >
              <!-- pencil -->
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path d="M14.06 6.19l3.75 3.75" stroke="currentColor" stroke-width="1.5" />
              </svg>
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>

    <p v-if="!filteredCustomers.length" class="text-center text-gray-500">
      Tidak ada data yang cocok.
    </p>
    <loading-overlay />

    <!-- Update Next Service Modal -->
    <div
      v-if="showUpdateModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="closeUpdateModal"
    >
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-xl font-semibold text-gray-900">Update Jadwal Service</h3>
          <button @click="closeUpdateModal" class="rounded-lg p-1 hover:bg-gray-100">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>

        <div class="mb-4">
          <p class="text-sm text-gray-600 mb-1">Pelanggan:</p>
          <p class="font-medium text-gray-900">{{ selectedCustomer?.nama }}</p>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2"> Tanggal Next Service </label>
          <input
            v-model="updateNextServiceDate"
            type="date"
            class="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex gap-3">
          <button
            @click="closeUpdateModal"
            class="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            @click="updateNextService"
            class="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>

    <!-- Service History Modal -->
    <div
      v-if="showHistoryModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="closeHistoryModal"
    >
      <div class="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-auto">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-xl font-semibold text-gray-900">History Service</h3>
          <button @click="closeHistoryModal" class="rounded-lg p-1 hover:bg-gray-100">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>

        <div class="mb-4">
          <p class="text-sm text-gray-600 mb-1">Pelanggan:</p>
          <p class="font-medium text-gray-900">{{ selectedCustomer?.nama }}</p>
          <p class="text-sm text-gray-500">
            {{ selectedCustomer?.tipe }} - {{ selectedCustomer?.brand }}
          </p>
        </div>

        <div v-if="loadingHistory" class="py-12 text-center">
          <div
            class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
          ></div>
          <p class="mt-2 text-sm text-gray-500">Memuat history...</p>
        </div>

        <div v-else-if="serviceHistory.length === 0" class="py-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
          <p class="mt-2 text-gray-500">Belum ada history service</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tanggal</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">No. WO</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Teknisi</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Keluhan</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Keterangan</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in serviceHistory"
                :key="item.id"
                class="border-b border-gray-100 hover:bg-gray-50"
              >
                <td class="px-4 py-3 text-sm text-gray-900">
                  {{ formatDate(item.created_at) }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.nowo || '-' }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.pegawai?.nama || '-' }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.keluhan || '-' }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.keterangan || '-' }}
                </td>
                <td class="px-4 py-3">
                  <span
                    class="inline-block rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-700': item.status === 'selesai',
                      'bg-blue-100 text-blue-700': item.status === 'progress',
                      'bg-gray-100 text-gray-700':
                        item.status !== 'selesai' && item.status !== 'progress',
                    }"
                  >
                    {{ item.status || '-' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/user/axios'
import { useLoadingStore } from '../stores/loading'
import { mapStores } from 'pinia'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { BASE_URL } from '@/base.utils.url'
import { useCustomersStore } from '../stores/customers'

export default {
  name: 'CustomerCard',
  components: { LoadingOverlay },
  data() {
    return {
      searchQuery: '',
      filterStatus: '',
      filterBrand: '',
      customers: [],
      BASE_URL,
      showUpdateModal: false,
      showHistoryModal: false,
      selectedCustomer: null,
      updateNextServiceDate: '',
      serviceHistory: [],
      loadingHistory: false,
    }
  },
  created() {
    this.fetchCustomers()
  },
  computed: {
    ...mapStores(useLoadingStore, useCustomersStore),
    // opsi filter dinamis dari data
    statusOptions() {
      const counts = {
        Aman: 0,
        'Dekat Jatuh Tempo': 0,
        Terlambat: 0,
      }
      this.customers.forEach((raw) => {
        const c = this.withComputedService(raw)
        const label = this.serviceCategory(c)
        if (counts[label] != null) counts[label] += 1
      })
      return Object.entries(counts)
        .filter(([, count]) => count > 0)
        .map(([label, count]) => ({ label, count }))
    },
    brandOptions() {
      const set = new Set(this.customers.map((c) => c.brand))
      return Array.from(set).sort()
    },
    // hasil akhir: cari + filter + mapping tanggal & indikator
    filteredCustomers() {
      const q = this.searchQuery.trim().toLowerCase()
      const now = new Date()

      const toStr = (v) => (v == null ? '' : String(v))

      return (
        this.customers
          .map((c) => this.withComputedService(c)) // pastikan _lastService & _nextService ada
          .filter((c) => {
            // search (aman terhadap field undefined/null)
            const matchText =
              toStr(c.nama).toLowerCase().includes(q) ||
              toStr(c.alamat).toLowerCase().includes(q) ||
              toStr(c.tipe).toLowerCase().includes(q) ||
              toStr(c.brand).toLowerCase().includes(q) ||
              toStr(c.model).toLowerCase().includes(q) ||
              toStr(c.kapasitas).toLowerCase().includes(q) ||
              toStr(c.lokasi).toLowerCase().includes(q) ||
              toStr(c.hp).toLowerCase().includes(q) ||
              toStr(c.kode_pelanggan).toLowerCase().includes(q)

            // filter dropdown (berdasarkan kategori servis)
            const matchStatus = this.filterStatus
              ? this.serviceCategory(c) === this.filterStatus
              : true
            const matchBrand = this.filterBrand ? c.brand === this.filterBrand : true

            return (q ? matchText : true) && matchStatus && matchBrand
          })
          // urutkan: yang paling mendesak di atas
          .sort((a, b) => {
            const da = this.daysUntil(a._nextService, now)
            const db = this.daysUntil(b._nextService, now)
            return da - db
          })
      )
    },
  },
  methods: {
    async fetchCustomers() {
      this.loadingStore.show()
      await api
        .get('/customers/assets/all')
        .then((response) => {
          console.log('=== FETCH CUSTOMERS API RESPONSE ===')
          console.log('Full Response:', response.data)
          console.log('Raw data array:', response.data.data)

          // Log first 3 customers to see structure
          if (response.data.data && response.data.data.length > 0) {
            console.log('First customer sample:', JSON.stringify(response.data.data[0], null, 2))
            response.data.data.slice(0, 3).forEach((c, i) => {
              console.log(
                `Customer ${i}: ${c.customer_id || 'no id'} - nextService: ${c.nextService}, lastService: ${c.lastService}`,

                `Customer ${i}: ${c.customer_id || 'no id'} - nextService: ${c.nextService}, lastService: ${c.lastService}`,
              )
            })
          }

          // Force reactivity by creating new array
          this.customers = [...response.data.data]
          console.log('Customers set to component:', this.customers.length, 'items')
          console.log('Sample customer nextService after set:', this.customers[0]?.nextService)
          console.log('=== END FETCH ===')

          this.customersStore.setCustomers(this.customers)
          if (this.$emitter && typeof this.$emitter.emit === 'function') {
            this.$emitter.emit('customers:updated', this.customers)
          }
        })
        .catch((error) => {
          console.error('Error fetching customers:', error)
        })
        .finally(() => {
          this.loadingStore.hide()
        })
    },
    // menambahkan 3 bulan dengan aman (memperhatikan rollover tanggal)
    addMonths(dateStr, months = 3) {
      const d = new Date(dateStr)
      const day = d.getDate()
      d.setMonth(d.getMonth() + months)

      // jika bulan bergeser (contoh 31 -> Feb), set ke akhir bulan
      if (d.getDate() < day) {
        d.setDate(0)
      }
      return d.toISOString().slice(0, 10)
    },
    withComputedService(c) {
      const last = c.lastService ? c.lastService : null
      const next = c.nextService ? c.nextService : last ? this.addMonths(last, 3) : null

      // buat salinan + field internal untuk tampilan
      return {
        ...c,
        _lastService: last,
        _nextService: next,
      }
    },
    daysUntil(dateStr, now = new Date()) {
      if (!dateStr) return Infinity
      const d = new Date(dateStr)
      return Math.ceil((d - now) / (1000 * 60 * 60 * 24))
    },
    // UI Helpers
    serviceState(customer) {
      if (!customer._nextService) return { state: 'unknown', days: Infinity }
      const days = this.daysUntil(customer._nextService)
      if (days < 0) return { state: 'overdue', days }
      if (days <= 14) return { state: 'dueSoon', days }
      return { state: 'ok', days }
    },
    serviceBadge(customer) {
      const s = this.serviceState(customer)
      if (s.state === 'overdue') return 'Terlambat'
      if (s.state === 'dueSoon') return 'Dekat Jatuh Tempo'
      if (s.state === 'ok') return 'Aman'
      return '—'
    },
    serviceCategory(customer) {
      const s = this.serviceState(customer)
      if (s.state === 'overdue') return 'Terlambat'
      if (s.state === 'dueSoon') return 'Dekat Jatuh Tempo'
      if (s.state === 'ok') return 'Aman'
      return '—'
    },
    servicePillClass(customer) {
      const s = this.serviceState(customer)
      return {
        'bg-rose-600': s.state === 'overdue',
        'bg-amber-500': s.state === 'dueSoon',
        'bg-emerald-600': s.state === 'ok',
        'bg-gray-400': s.state === 'unknown',
      }
    },
    nextServiceTextClass(customer) {
      const s = this.serviceState(customer)
      return {
        'text-rose-600 font-semibold': s.state === 'overdue',
        'text-amber-600 font-semibold': s.state === 'dueSoon',
        'text-gray-900': s.state === 'ok',
        'text-gray-400': s.state === 'unknown',
      }
    },
    serviceTitle(customer) {
      const s = this.serviceState(customer)
      if (s.state === 'overdue') return 'Lewat dari jadwal servis'
      if (s.state === 'dueSoon') return 'Mendekati jadwal servis'
      if (s.state === 'ok') return 'Jadwal servis masih aman'
      return 'Jadwal servis tidak tersedia'
    },
    serviceNote(customer) {
      const s = this.serviceState(customer)
      if (!customer._nextService) return 'Jadwal servis belum ditentukan.'
      if (s.state === 'overdue')
        return `Lewat ${Math.abs(s.days)} hari dari jadwal. Disarankan segera servis.`
      if (s.state === 'dueSoon') return `Sisa ${s.days} hari menuju jadwal servis.`
      return `Sekitar ${s.days} hari menuju jadwal servis berikutnya.`
    },
    formatDate(dateStr) {
      if (!dateStr) return '—'
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    },
    openUpdateServiceModal(customer) {
      this.selectedCustomer = customer
      this.updateNextServiceDate = customer._nextService || ''
      this.showUpdateModal = true
    },
    closeUpdateModal() {
      this.showUpdateModal = false
      this.selectedCustomer = null
      this.updateNextServiceDate = ''
    },
    async updateNextService() {
      if (!this.updateNextServiceDate) {
        alert('Tanggal next service harus diisi')
        return
      }

      this.loadingStore.show()
      try {
        console.log('Updating next service for asset:', this.selectedCustomer.asset_id)
        console.log('New date:', this.updateNextServiceDate)

        const response = await api.post(
          `/customers/assets/update-next-service/${this.selectedCustomer.asset_id}`,
          { nextService: this.updateNextServiceDate },
        )

        console.log('Update response:', response.data)

        if (response.data.status) {
          console.log('=== UPDATE NEXT SERVICE - BEFORE LOCAL UPDATE ===')
          console.log('Selected Customer asset_id:', this.selectedCustomer.asset_id)
          console.log('New nextService date to set:', this.updateNextServiceDate)

          // Update the customer in the local array immediately for instant UI update
          const customerIndex = this.customers.findIndex(
            (c) => c.asset_id === this.selectedCustomer.asset_id,
          )
          console.log('Customer found at index:', customerIndex)

          if (customerIndex !== -1) {
            // Update nextService in local array
            console.log('Before update:', this.customers[customerIndex].nextService)
            this.customers[customerIndex].nextService = this.updateNextServiceDate
            console.log('After update:', this.customers[customerIndex].nextService)
            console.log('Updated local customer:', this.customers[customerIndex])
          } else {
            console.warn('Customer not found in local array!')
          }

          this.closeUpdateModal()
          alert('Jadwal service berhasil diupdate')

          // Then fetch fresh data from server
          console.log('Fetching fresh data from server...')
          await this.fetchCustomers()
          console.log('=== UPDATE COMPLETE ===')

          console.log('Data refreshed, check updated customer')
        } else {
          alert('Update gagal: ' + (response.data.message || 'Unknown error'))
        }
      } catch (error) {
        console.error('Error updating next service:', error)
        console.error('Error response:', error.response?.data)
        alert(
          'Gagal mengupdate jadwal service: ' + (error.response?.data?.message || error.message),
        )
      } finally {
        this.loadingStore.hide()
      }
    },
    openHistoryModal(customer) {
      this.selectedCustomer = customer
      this.showHistoryModal = true
      this.fetchServiceHistory(customer.asset_id)
    },
    closeHistoryModal() {
      this.showHistoryModal = false
      this.selectedCustomer = null
      this.serviceHistory = []
    },
    async fetchServiceHistory(assetId) {
      this.loadingHistory = true
      try {
        const response = await api.get(`/wo/service/history/asset/${assetId}`)

        if (response.data.status) {
          this.serviceHistory = response.data.data || []
        } else {
          this.serviceHistory = []
        }
      } catch (error) {
        console.error('Error fetching service history:', error)
        this.serviceHistory = []
      } finally {
        this.loadingHistory = false
      }
    },
  },
}
</script>

<style scoped>
/* Sentuhan halus untuk fokus ring di Safari/Firefox */
:focus-visible {
  outline: none;
}
</style>
