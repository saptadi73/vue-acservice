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

    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-800">Buat Sales Order Pemeliharaan</h1>
      <button
        @click="goBack"
        class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
      >
        ← Kembali
      </button>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- CUSTOMER DATA SECTION -->
      <div class="mb-8">
        <h2 class="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
          Data Pelanggan
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Customer Search / Select - Only show if customer not prefilled from WO -->
          <div v-if="!form.customer.id">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Cari Pelanggan atau Buat Baru
            </label>
            <input
              v-model="searchCustomer"
              @input="searchCustomers"
              type="text"
              placeholder="Ketik nama pelanggan..."
              :disabled="isLocked"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <!-- Dropdown hasil search -->
            <div
              v-if="searchCustomer && customerSearchResults.length > 0"
              class="absolute bg-white border border-gray-300 rounded mt-1 w-80 max-h-40 overflow-y-auto z-10"
            >
              <div
                v-for="customer in customerSearchResults"
                :key="customer.id"
                @click="selectCustomer(customer)"
                class="p-2 hover:bg-blue-100 cursor-pointer border-b"
              >
                <div class="font-semibold">{{ customer.nama }}</div>
                <div class="text-sm text-gray-600">{{ customer.alamat }}</div>
              </div>
            </div>
          </div>

          <!-- Nama Pelanggan (read-only or editable) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Pelanggan *</label>
            <input
              v-model="form.customer.nama"
              type="text"
              placeholder="Nama pelanggan"
              :disabled="isLocked"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <!-- Alamat -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Alamat *</label>
            <input
              v-model="form.customer.alamat"
              type="text"
              placeholder="Alamat lengkap"
              :disabled="isLocked"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <!-- No HP -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">No. HP *</label>
            <input
              v-model="form.customer.no_hp"
              type="text"
              placeholder="Nomor HP"
              :disabled="isLocked"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
        </div>
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
          <textarea
            v-model="form.keterangan"
            rows="3"
            placeholder="Catatan atau keterangan tambahan"
            :disabled="isLocked"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          ></textarea>
        </div>
      </div>

      <!-- PRODUCT LINES SECTION -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-800 border-b-2 border-green-500 pb-2 w-full">
            Produk yang Dibeli
          </h2>
          <button
            @click="addProductLine"
            :disabled="isLocked"
            class="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition whitespace-nowrap"
          >
            + Tambah Produk
          </button>
        </div>

        <div v-if="form.productLines.length === 0" class="text-center text-gray-500 py-4">
          Belum ada produk ditambahkan
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300">
            <thead class="bg-green-50">
              <tr>
                <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">No</th>
                <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                  Nama Produk
                </th>
                <th class="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">
                  Qty
                </th>
                <th class="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">
                  Harga
                </th>
                <th class="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">
                  Diskon
                </th>
                <th class="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">
                  Subtotal
                </th>
                <th class="border border-gray-300 px-3 py-2 text-center text-sm font-semibold">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(line, idx) in form.productLines" :key="`product-${idx}`">
                <td class="border border-gray-300 px-3 py-2 text-sm">{{ idx + 1 }}</td>
                <td class="border border-gray-300 px-3 py-2 text-sm relative">
                  <input
                    v-model="line.description"
                    type="text"
                    placeholder="Cari nama produk..."
                    @input="onProductInput(line)"
                    :disabled="isLocked"
                    class="w-full border border-gray-300 rounded px-2 py-1 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <!-- Dropdown hasil search produk -->
                  <div
                    v-if="line.showDropdown && line.description && !isLocked"
                    class="absolute bg-white border border-gray-300 rounded mt-1 w-full max-h-48 overflow-y-auto z-20 shadow-lg"
                  >
                    <div
                      v-for="product in productMatches(line.description)"
                      :key="product.id"
                      @click="selectProductLine(idx, product)"
                      class="p-2 hover:bg-blue-100 cursor-pointer border-b last:border-b-0"
                    >
                      <div class="font-semibold text-sm text-gray-800">{{ product.nama }}</div>
                      <div class="text-xs text-gray-600">
                        Kode: {{ product.kode || '-' }} | Harga:
                        {{ formatCurrency(product.harga || product.hpp || 0) }}
                      </div>
                    </div>
                    <div
                      v-if="productMatches(line.description).length === 0"
                      class="p-2 text-sm text-gray-500 text-center"
                    >
                      Produk tidak ditemukan
                    </div>
                  </div>
                </td>
                <td class="border border-gray-300 px-3 py-2 text-sm">
                  <input
                    v-model.number="line.qty"
                    @change="calculateLineTotal(line)"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    :disabled="isLocked"
                    class="w-full border border-gray-300 rounded px-2 py-1 text-sm text-right disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </td>
                <td class="border border-gray-300 px-3 py-2 text-sm">
                  <input
                    v-model.number="line.unit_price"
                    @change="calculateLineTotal(line)"
                    type="number"
                    min="0"
                    placeholder="0"
                    :disabled="isLocked"
                    class="w-full border border-gray-300 rounded px-2 py-1 text-sm text-right disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </td>
                <td class="border border-gray-300 px-3 py-2 text-sm">
                  <input
                    v-model.number="line.discount"
                    @change="calculateLineTotal(line)"
                    type="number"
                    min="0"
                    placeholder="0"
                    :disabled="isLocked"
                    class="w-full border border-gray-300 rounded px-2 py-1 text-sm text-right disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </td>
                <td class="border border-gray-300 px-3 py-2 text-sm text-right font-semibold">
                  {{ formatCurrency(line.line_total) }}
                </td>
                <td class="border border-gray-300 px-3 py-2 text-center">
                  <button
                    @click="removeProductLine(idx)"
                    :disabled="isLocked"
                    class="text-red-600 hover:text-red-800 text-sm font-medium disabled:cursor-not-allowed"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- SERVICE LINES SECTION -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 w-full">
            Jasa yang Dibeli
          </h2>
          <button
            @click="addServiceLine"
            :disabled="isLocked"
            class="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition whitespace-nowrap"
          >
            + Tambah Jasa
          </button>
        </div>

        <div v-if="form.serviceLines.length === 0" class="text-center text-gray-500 py-4">
          Belum ada jasa ditambahkan
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300">
            <thead class="bg-blue-50">
              <tr>
                <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">No</th>
                <th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                  Nama Jasa
                </th>
                <th class="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">
                  Qty
                </th>
                <th class="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">
                  Harga
                </th>
                <th class="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">
                  Diskon
                </th>
                <th class="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">
                  Subtotal
                </th>
                <th class="border border-gray-300 px-3 py-2 text-center text-sm font-semibold">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(line, idx) in form.serviceLines" :key="`service-${idx}`">
                <td class="border border-gray-300 px-3 py-2 text-sm">{{ idx + 1 }}</td>
                <td class="border border-gray-300 px-3 py-2 text-sm relative">
                  <input
                    v-model="line.description"
                    type="text"
                    placeholder="Cari nama jasa..."
                    @input="onServiceInput(line)"
                    :disabled="isLocked"
                    class="w-full border border-gray-300 rounded px-2 py-1 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <!-- Dropdown hasil search jasa -->
                  <div
                    v-if="line.showDropdown && line.description && !isLocked"
                    class="absolute bg-white border border-gray-300 rounded mt-1 w-full max-h-48 overflow-y-auto z-20 shadow-lg"
                  >
                    <div
                      v-for="service in serviceMatches(line.description)"
                      :key="service.id"
                      @click="selectServiceLine(idx, service)"
                      class="p-2 hover:bg-blue-100 cursor-pointer border-b last:border-b-0"
                    >
                      <div class="font-semibold text-sm text-gray-800">{{ service.nama }}</div>
                      <div class="text-xs text-gray-600">
                        Harga: {{ formatCurrency(service.harga || 0) }}
                      </div>
                    </div>
                    <div
                      v-if="serviceMatches(line.description).length === 0"
                      class="p-2 text-sm text-gray-500 text-center"
                    >
                      Jasa tidak ditemukan
                    </div>
                  </div>
                </td>
                <td class="border border-gray-300 px-3 py-2 text-sm">
                  <input
                    v-model.number="line.qty"
                    @change="calculateLineTotal(line)"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    :disabled="isLocked"
                    class="w-full border border-gray-300 rounded px-2 py-1 text-sm text-right disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </td>
                <td class="border border-gray-300 px-3 py-2 text-sm">
                  <input
                    v-model.number="line.unit_price"
                    @change="calculateLineTotal(line)"
                    type="number"
                    min="0"
                    placeholder="0"
                    :disabled="isLocked"
                    class="w-full border border-gray-300 rounded px-2 py-1 text-sm text-right disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </td>
                <td class="border border-gray-300 px-3 py-2 text-sm">
                  <input
                    v-model.number="line.discount"
                    @change="calculateLineTotal(line)"
                    type="number"
                    min="0"
                    placeholder="0"
                    :disabled="isLocked"
                    class="w-full border border-gray-300 rounded px-2 py-1 text-sm text-right disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </td>
                <td class="border border-gray-300 px-3 py-2 text-sm text-right font-semibold">
                  {{ formatCurrency(line.line_total) }}
                </td>
                <td class="border border-gray-300 px-3 py-2 text-center">
                  <button
                    @click="removeServiceLine(idx)"
                    :disabled="isLocked"
                    class="text-red-600 hover:text-red-800 text-sm font-medium disabled:cursor-not-allowed"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TOTALS SECTION -->
      <div class="mb-8 border-t-2 border-gray-300 pt-4">
        <div class="flex justify-end mb-4">
          <div class="w-full md:w-96">
            <div class="flex justify-between mb-3">
              <span class="font-semibold text-gray-700">Subtotal:</span>
              <span class="text-right font-semibold">{{ formatCurrency(totals.subtotal) }}</span>
            </div>
            <div v-if="form.useTax" class="flex justify-between mb-3">
              <span class="font-semibold text-gray-700">Pajak (11%):</span>
              <span class="text-right font-semibold">{{ formatCurrency(totals.tax) }}</span>
            </div>
            <div class="flex justify-between mb-4 border-t-2 border-gray-300 pt-2">
              <span class="text-lg font-bold text-gray-900">Total:</span>
              <span class="text-lg font-bold text-blue-600">{{
                formatCurrency(totals.total)
              }}</span>
            </div>
          </div>
        </div>

        <!-- Tax Checkbox -->
        <div class="flex justify-end mb-6">
          <div class="w-full md:w-96">
            <label class="flex items-center">
              <input
                v-model="form.useTax"
                type="checkbox"
                :disabled="isLocked"
                class="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span class="ml-2 text-sm font-medium text-gray-700">Tambahkan Pajak (11%)</span>
            </label>
          </div>
        </div>

        <!-- Status -->
        <div class="flex justify-end mb-6">
          <div class="w-full md:w-96">
            <label class="block text-sm font-medium text-gray-700 mb-1">Status *</label>
            <select
              v-model="form.status"
              :disabled="isLocked"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="confirmed">Confirmed</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
      </div>

      <!-- ACTION BUTTONS -->
      <div class="flex justify-end gap-4 items-center">
        <button
          v-if="showPaymentButton"
          @click="openPaymentModal"
          class="px-6 py-3 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition font-medium"
        >
          Payment
        </button>
        <button
          v-if="showPrintButton"
          @click="printInvoice"
          class="px-6 py-3 bg-slate-800 text-white rounded hover:bg-slate-900 transition font-medium"
        >
          Cetak PDF
        </button>
        <button
          @click="goBack"
          class="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50 transition font-medium"
        >
          Batal
        </button>
        <button
          @click="saveSalesOrder"
          :disabled="loading || isLocked"
          class="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium disabled:opacity-50"
        >
          {{ loading ? 'Menyimpan...' : 'Simpan Sales Order' }}
        </button>
      </div>

      <!-- Payment Modal -->
      <div
        v-if="paymentModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-gray-800">Payment</h3>
            <button @click="closePaymentModal" class="text-gray-500 hover:text-gray-700">✕</button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Pembayaran</label>
              <input
                v-model="paymentDate"
                type="date"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Akun Bank</label>
              <select
                v-model="selectedBankAccountId"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Pilih akun bank</option>
                <option v-for="acc in bankAccounts" :key="acc.id" :value="acc.id">
                  {{ acc.code }} - {{ acc.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
              <input
                v-model="paymentReference"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <input
                v-model="paymentDescription"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah Pembayaran</label>
              <div
                class="px-3 py-2 border border-gray-200 rounded bg-gray-50 font-semibold text-gray-800"
              >
                {{ formatCurrency(paymentAmount) }}
              </div>
            </div>

            <p v-if="paymentError" class="text-sm text-red-600">{{ paymentError }}</p>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button
              @click="closePaymentModal"
              class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              @click="submitPayment"
              :disabled="paymentLoading"
              class="px-5 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-60"
            >
              {{ paymentLoading ? 'Memproses...' : 'Konfirmasi Pembayaran' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import api from '@/user/axios'
import { BASE_URL } from '@/base.utils.url'
const companyLogo = new URL('@/assets/images/ac_lestari_black.png', import.meta.url).href

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const notification = ref({ show: false, message: '', type: 'success' })
const isEdit = computed(() => Boolean(route.params?.id))

// Form data
const form = ref({
  order_number: '',
  order_date: new Date().toISOString().split('T')[0],
  status: 'draft',
  customer: {
    id: null,
    nama: '',
    alamat: '',
    no_hp: '',
  },
  keterangan: '',
  useTax: true,
  productLines: [],
  serviceLines: [],
})

const isLocked = computed(() => ['confirmed', 'paid'].includes(form.value.status))
const showPaymentButton = computed(() => isEdit.value && form.value.status === 'confirmed')
const showPrintButton = computed(() => form.value.status === 'confirmed')

// Products data for search
const products = ref([])

// Services data for search
const services = ref([])

// Payment modal
const paymentModal = ref(false)
const bankAccounts = ref([])
const selectedBankAccountId = ref('')
const paymentDate = ref(new Date().toISOString().split('T')[0])
const paymentReference = ref('')
const paymentDescription = ref('')
const paymentLoading = ref(false)
const paymentError = ref('')
const paymentAmount = computed(() => totals.value.total)

// Customer search
const searchCustomer = ref('')
const customerSearchResults = ref([])

// Watch for totals changes with NaN guards
const totals = computed(() => {
  let subtotal = 0

  form.value.productLines.forEach((line) => {
    subtotal += toNumber(line.line_total)
  })
  form.value.serviceLines.forEach((line) => {
    subtotal += toNumber(line.line_total)
  })

  const tax = form.value.useTax ? subtotal * 0.11 : 0 // 11% tax or 0 if disabled
  const total = subtotal + tax

  return {
    subtotal,
    tax,
    total,
  }
})

// Format currency
function formatCurrency(num) {
  if (!num || num === 0) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num)
}

// Convert any value to finite number or default to 0
function toNumber(val) {
  const parsed = Number(val)
  return Number.isFinite(parsed) ? parsed : 0
}

// Generate order number
function generateOrderNumber() {
  const date = new Date()
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const rand = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')
  return `SO-${yyyy}${mm}${dd}-${rand}`
}

// Search customers
async function searchCustomers() {
  if (!searchCustomer.value.trim()) {
    customerSearchResults.value = []
    return
  }

  try {
    const res = await api.get('customers')
    const allCustomers = res.data.data || []
    customerSearchResults.value = allCustomers.filter((c) =>
      c.nama.toLowerCase().includes(searchCustomer.value.toLowerCase()),
    )
  } catch (err) {
    console.error('Error searching customers:', err)
  }
}

// Select customer
function selectCustomer(customer) {
  form.value.customer.id = customer.id
  form.value.customer.nama = customer.nama
  form.value.customer.alamat = customer.alamat || ''
  form.value.customer.no_hp = customer.no_hp || ''
  searchCustomer.value = ''
  customerSearchResults.value = []
}

// Product line operations
function addProductLine() {
  form.value.productLines.push({
    product_id: null,
    line_number: form.value.productLines.length + 1,
    description: '',
    qty: 0,
    unit_price: 0,
    hpp: 0,
    discount: 0,
    line_total: 0,
  })
}

function removeProductLine(idx) {
  form.value.productLines.splice(idx, 1)
}

// Service line operations
function addServiceLine() {
  form.value.serviceLines.push({
    service_id: null,
    line_number: form.value.serviceLines.length + 1,
    description: '',
    qty: 0,
    unit_price: 0,
    discount: 0,
    line_total: 0,
  })
}

function removeServiceLine(idx) {
  form.value.serviceLines.splice(idx, 1)
}

// Calculate line total
function calculateLineTotal(line) {
  const qty = toNumber(line.qty)
  const unitPrice = toNumber(line.unit_price)
  const discount = toNumber(line.discount)

  const total = qty * unitPrice - discount
  line.qty = qty
  line.unit_price = unitPrice
  line.discount = discount
  line.line_total = Number.isFinite(total) && total > 0 ? total : 0
}

// Show notification
function showNotification(message, type = 'success') {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

// Save sales order
async function saveSalesOrder() {
  // Validation
  if (!form.value.customer.nama || !form.value.customer.alamat || !form.value.customer.no_hp) {
    showNotification('Mohon isi semua data pelanggan', 'error')
    return
  }

  if (!form.value.customer.id) {
    showNotification('Mohon pilih pelanggan dari dropdown', 'error')
    return
  }

  if (form.value.productLines.length === 0 && form.value.serviceLines.length === 0) {
    showNotification('Mohon tambahkan minimal satu produk atau jasa', 'error')
    return
  }

  loading.value = true
  try {
    const payload = {
      order_number: form.value.order_number,
      order_date: form.value.order_date,
      status: form.value.status,
      customer_id: form.value.customer.id,
      nama: form.value.customer.nama,
      alamat: form.value.customer.alamat,
      hp: form.value.customer.no_hp,
      keterangan: form.value.keterangan,
      subtotal: totals.value.subtotal,
      tax: totals.value.tax,
      total: totals.value.total,
      product_lines: form.value.productLines.map((line) => ({
        product_id: line.product_id,
        line_number: line.line_number,
        description: line.description,
        qty: line.qty,
        unit_price: line.unit_price,
        hpp: line.hpp,
        discount: line.discount,
        line_total: line.line_total,
      })),
      service_lines: form.value.serviceLines.map((line) => ({
        service_id: line.service_id,
        line_number: line.line_number,
        description: line.description,
        qty: line.qty,
        unit_price: line.unit_price,
        discount: line.discount,
        line_total: line.line_total,
      })),
    }

    console.log('Payload yang dikirim ke API:', payload)

    const res = isEdit.value
      ? await api.post(`orders/update/sale/${route.params.id}`, payload)
      : await api.post('orders/sale', payload)

    if (res.data.status || res.data.success) {
      showNotification(
        isEdit.value ? 'Sales Order berhasil diperbarui!' : 'Sales Order berhasil dibuat!',
        'success',
      )
      setTimeout(() => {
        router.push({ name: 'daftar Sales Order' })
      }, 1500)
    } else {
      showNotification(res.data.message || 'Gagal menyimpan Sales Order', 'error')
    }
  } catch (err) {
    console.error('Error saving sales order:', err)
    const errorMsg = err.response?.data?.message || 'Gagal menyimpan Sales Order'
    showNotification(errorMsg, 'error')
  } finally {
    loading.value = false
  }
}

// Go back
function goBack() {
  router.push({ name: 'daftar Sales Order' })
}

// Fetch products from API
async function fetchProducts() {
  try {
    const res = await axios.get(`${BASE_URL}products`)
    products.value = Array.isArray(res?.data?.data) ? res.data.data : []
    console.log('Products fetched:', products.value)
  } catch (err) {
    console.error('Error fetching products:', err)
  }
}

// Filter products based on search query
function productMatches(searchQuery) {
  const q = (searchQuery || '').trim().toLowerCase()
  if (!q) return products.value.slice(0, 20)
  return products.value.filter((p) =>
    [p.nama, p.kode, p.model, p.tipe].some((x) => (x || '').toLowerCase().includes(q)),
  )
}

// Fetch services from API
async function fetchServices() {
  try {
    const res = await axios.get(`${BASE_URL}services`)
    services.value = Array.isArray(res?.data?.data) ? res.data.data : []
    console.log('Services fetched:', services.value)
  } catch (err) {
    console.error('Error fetching services:', err)
  }
}

// Fetch bank accounts for payment
async function fetchBankAccounts() {
  try {
    const res = await api.get('bank-accounts')
    bankAccounts.value = Array.isArray(res?.data?.data) ? res.data.data : []
  } catch (err) {
    console.error('Error fetching bank accounts:', err)
    showNotification('Gagal memuat akun bank', 'error')
  }
}

// Filter services based on search query
function serviceMatches(searchQuery) {
  const q = (searchQuery || '').trim().toLowerCase()
  if (!q) return services.value.slice(0, 20)
  return services.value.filter((s) => (s.nama || '').toLowerCase().includes(q))
}

// Select product and auto-fill price
function selectProductLine(lineIdx, product) {
  if (isLocked.value) return
  const line = form.value.productLines[lineIdx]
  line.product_id = product.id
  line.description = product.nama
  line.unit_price = product.harga ?? product.hpp ?? 0
  line.hpp = product.hpp ?? 0
  line.showDropdown = false
  calculateLineTotal(line)
}

// Select service and auto-fill price
function selectServiceLine(lineIdx, service) {
  if (isLocked.value) return
  const line = form.value.serviceLines[lineIdx]
  line.service_id = service.id
  line.description = service.nama
  line.unit_price = service.harga ?? 0
  line.showDropdown = false
  calculateLineTotal(line)
}

function onProductInput(line) {
  if (isLocked.value) return
  line.showDropdown = true
}

function onServiceInput(line) {
  if (isLocked.value) return
  line.showDropdown = true
}

watch(
  () => isLocked.value,
  (locked) => {
    if (!locked) return
    form.value.productLines.forEach((line) => {
      line.showDropdown = false
    })
    form.value.serviceLines.forEach((line) => {
      line.showDropdown = false
    })
  },
)

// Payment flow
function openPaymentModal() {
  paymentError.value = ''
  paymentReference.value = form.value.order_number ? `PAY-${form.value.order_number}` : 'PAY-SALE'
  paymentDescription.value = `Pelunasan ${form.value.order_number || 'Sales Order'}`
  paymentDate.value = new Date().toISOString().split('T')[0]
  paymentModal.value = true
  if (bankAccounts.value.length === 0) {
    fetchBankAccounts()
  }
}

function closePaymentModal() {
  paymentModal.value = false
}

async function submitPayment() {
  paymentError.value = ''

  if (!isEdit.value || !route.params.id) {
    paymentError.value = 'Pembayaran hanya bisa dilakukan pada order yang sudah tersimpan.'
    return
  }

  if (!selectedBankAccountId.value) {
    paymentError.value = 'Pilih akun bank terlebih dahulu.'
    return
  }

  if (!form.value.customer.id) {
    paymentError.value = 'Data pelanggan tidak lengkap.'
    return
  }

  paymentLoading.value = true
  try {
    await api.post(`/orders/update/sale/${route.params.id}`, { status: 'paid' })

    const payload = {
      payment_date: paymentDate.value,
      amount: paymentAmount.value,
      customer_id: form.value.customer.id,
      cash_account_id: selectedBankAccountId.value,
      reference_number: paymentReference.value || `PAY-${form.value.order_number}`,
      description: paymentDescription.value || `Pelunasan ${form.value.order_number}`,
      created_by: localStorage.getItem('email') || 'system',
    }

    await api.post('/accounting/journals/sales-payment', payload)

    form.value.status = 'paid'
    showNotification('Pembayaran berhasil, status berubah menjadi paid', 'success')
    paymentModal.value = false
  } catch (err) {
    console.error('Error processing payment:', err)
    paymentError.value = err.response?.data?.message || 'Gagal memproses pembayaran'
  } finally {
    paymentLoading.value = false
  }
}

// Print invoice (browser print to PDF)
function printInvoice() {
  const productRows = form.value.productLines
    .map(
      (line, idx) => `
        <tr>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:center;">${idx + 1}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">${line.description || '-'}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right;">${line.qty || 0}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right;">${formatCurrency(line.unit_price)}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right;">${formatCurrency(line.discount)}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right;">${formatCurrency(line.line_total)}</td>
        </tr>`,
    )
    .join('')

  const serviceRows = form.value.serviceLines
    .map(
      (line, idx) => `
        <tr>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:center;">${idx + 1}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">${line.description || '-'}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right;">${line.qty || 0}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right;">${formatCurrency(line.unit_price)}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right;">${formatCurrency(line.discount)}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right;">${formatCurrency(line.line_total)}</td>
        </tr>`,
    )
    .join('')

  const now = new Date().toLocaleString('id-ID')

  const html = `
    <html>
    <head>
      <title>Invoice ${form.value.order_number}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f8fafc; color: #0f172a; padding: 24px; }
        .card { max-width: 900px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 15px 35px rgba(15, 23, 42, 0.08); overflow: hidden; }
        .header { padding: 24px; background: linear-gradient(135deg, #0f172a, #1e293b); color: #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
        .badge { display: inline-block; padding: 6px 12px; border-radius: 9999px; background: #22c55e; color: #0f172a; font-weight: 700; font-size: 12px; letter-spacing: 0.5px; text-transform: uppercase; }
        .section { padding: 20px 24px; }
        .section h3 { margin: 0 0 8px 0; font-size: 16px; color: #0f172a; }
        .muted { color: #475569; font-size: 13px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th { padding: 10px 8px; text-align: left; border: 1px solid #e5e7eb; background: #f8fafc; font-size: 13px; color: #0f172a; }
        td { font-size: 13px; }
        .totals { width: 320px; margin-left: auto; }
        .totals td { padding: 8px 6px; }
        .totals .label { color: #475569; }
        .totals .value { text-align: right; font-weight: 600; color: #0f172a; }
        .totals .grand { font-size: 16px; color: #0f172a; }
        .footer { padding: 12px 24px 20px; color: #475569; font-size: 12px; text-align: right; }
        @media print { body { padding: 0; background: #fff; } .card { box-shadow: none; border: none; } }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div style="display:flex;align-items:center;gap:12px;">
            <img src="${companyLogo}" alt="Logo" style="height:44px;object-fit:contain;" />
            <div>
              <div style="font-size:22px;font-weight:700;">Invoice</div>
              <div style="margin-top:4px;color:#cbd5e1;">${form.value.order_number || '-'}</div>
            </div>
          </div>
          <div style="text-align:right;">
            <div class="badge">${form.value.status || 'draft'}</div>
            <div style="margin-top:8px;font-size:12px;color:#cbd5e1;">Dicetak: ${now}</div>
          </div>
        </div>

        <div class="section" style="display:flex;gap:32px;flex-wrap:wrap;">
          <div style="flex:1; min-width:240px;">
            <h3>Ditagihkan Kepada</h3>
            <div class="muted">${form.value.customer.nama || '-'}</div>
            <div class="muted">${form.value.customer.alamat || '-'}</div>
            <div class="muted">HP: ${form.value.customer.no_hp || '-'}</div>
          </div>
          <div style="width:260px;">
            <h3>Detail</h3>
            <div class="muted">Tanggal: ${form.value.order_date || '-'}</div>
            <div class="muted">Status: ${form.value.status || '-'}</div>
            <div class="muted">Keterangan: ${form.value.keterangan || '-'}</div>
          </div>
        </div>

        <div class="section">
          <h3>Produk</h3>
          <table>
            <thead>
              <tr>
                <th style="width:40px;">No</th>
                <th>Deskripsi</th>
                <th style="width:80px;text-align:right;">Qty</th>
                <th style="width:100px;text-align:right;">Harga</th>
                <th style="width:100px;text-align:right;">Diskon</th>
                <th style="width:120px;text-align:right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${productRows || '<tr><td colspan="6" style="padding:10px;text-align:center;border:1px solid #e5e7eb;color:#94a3b8;">Tidak ada produk</td></tr>'}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h3>Jasa</h3>
          <table>
            <thead>
              <tr>
                <th style="width:40px;">No</th>
                <th>Deskripsi</th>
                <th style="width:80px;text-align:right;">Qty</th>
                <th style="width:100px;text-align:right;">Harga</th>
                <th style="width:100px;text-align:right;">Diskon</th>
                <th style="width:120px;text-align:right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${serviceRows || '<tr><td colspan="6" style="padding:10px;text-align:center;border:1px solid #e5e7eb;color:#94a3b8;">Tidak ada jasa</td></tr>'}
            </tbody>
          </table>
        </div>

        <div class="section" style="display:flex; justify-content:flex-end;">
          <table class="totals">
            <tr>
              <td class="label">Subtotal</td>
              <td class="value">${formatCurrency(totals.value.subtotal)}</td>
            </tr>
            <tr>
              <td class="label">Pajak (11%)</td>
              <td class="value">${formatCurrency(totals.value.tax)}</td>
            </tr>
            <tr>
              <td class="label grand" style="font-weight:700;">Total</td>
              <td class="value grand" style="color:#0ea5e9;">${formatCurrency(totals.value.total)}</td>
            </tr>
          </table>
        </div>

        <div class="footer">Terima kasih atas kepercayaan Anda.</div>
      </div>
    </body>
    </html>
  `

  const invoiceWindow = window.open('', '_blank', 'width=900,height=1000')
  if (!invoiceWindow) {
    showNotification('Popup diblokir, izinkan popup untuk mencetak.', 'error')
    return
  }
  invoiceWindow.document.write(html)
  invoiceWindow.document.close()
  invoiceWindow.focus()
  invoiceWindow.print()
  invoiceWindow.close()
}

// Initialize
onMounted(async () => {
  form.value.order_number = generateOrderNumber()
  await Promise.all([fetchProducts(), fetchServices()])

  if (isEdit.value) {
    await loadSalesOrder(route.params.id)
    return
  }

  // Prefill customer from WorkOrder navigation
  const cid = route.query?.customer_id
  const cname = route.query?.customer_name
  const caddr = route.query?.customer_address
  const cphone = route.query?.customer_phone

  // Set customer data directly from query params
  if (cid) {
    form.value.customer.id = cid
    form.value.customer.nama = cname || ''
    form.value.customer.alamat = caddr || ''
    form.value.customer.no_hp = cphone || ''
    console.log('Customer set from WorkOrder:', {
      id: form.value.customer.id,
      nama: form.value.customer.nama,
    })
  } else if (cname || caddr || cphone) {
    // If only details provided without id (shouldn't happen from WO)
    form.value.customer.nama = cname || ''
    form.value.customer.alamat = caddr || ''
    form.value.customer.no_hp = cphone || ''
    console.log('Customer set without ID (manual entry)')
  }
})

// Load existing sales order for edit mode
async function loadSalesOrder(id) {
  try {
    loading.value = true
    const res = await api.get(`/orders/sale/${id}`)
    const data = res?.data?.data || {}

    form.value.order_number = data.order_number || ''
    form.value.order_date = data.order_date || form.value.order_date
    form.value.status = data.status || 'draft'
    form.value.keterangan = data.keterangan || ''
    form.value.useTax = data.tax ? data.tax > 0 : false

    // Customer
    const customerId = data.customer_id || data.customer?.id
    form.value.customer.id = customerId || null
    form.value.customer.nama = data.nama || data.customer?.nama || ''
    form.value.customer.alamat = data.alamat || data.customer?.alamat || ''
    form.value.customer.no_hp = data.hp || data.customer?.hp || ''

    // Product lines
    form.value.productLines = (data.product_lines || []).map((line, idx) => ({
      product_id: line.product_id ?? line.product?.id ?? null,
      line_number: line.line_number ?? idx + 1,
      description: line.description || line.product?.nama || '',
      qty: toNumber(line.qty),
      unit_price: toNumber(line.unit_price ?? line.harga),
      hpp: toNumber(line.hpp),
      discount: toNumber(line.discount),
      line_total: toNumber(line.line_total ?? line.subtotal),
      showDropdown: false,
    }))

    // Service lines
    form.value.serviceLines = (data.service_lines || []).map((line, idx) => ({
      service_id: line.service_id ?? line.service?.id ?? null,
      line_number: line.line_number ?? idx + 1,
      description: line.description || line.service?.nama || '',
      qty: toNumber(line.qty),
      unit_price: toNumber(line.unit_price ?? line.harga),
      discount: toNumber(line.discount),
      line_total: toNumber(line.line_total ?? line.subtotal),
      showDropdown: false,
    }))

    // Recalculate to guarantee clean totals
    form.value.productLines.forEach((line) => calculateLineTotal(line))
    form.value.serviceLines.forEach((line) => calculateLineTotal(line))

    paymentReference.value = form.value.order_number ? `PAY-${form.value.order_number}` : 'PAY-SALE'
    paymentDescription.value = `Pelunasan ${form.value.order_number || 'Sales Order'}`

    console.log('Sales order loaded for edit:', data)
  } catch (err) {
    console.error('Gagal memuat Sales Order:', err)
    showNotification('Gagal memuat Sales Order', 'error')
  } finally {
    loading.value = false
  }
}
</script>
