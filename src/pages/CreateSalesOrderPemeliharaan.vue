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
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Alamat -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Alamat *</label>
            <input
              v-model="form.customer.alamat"
              type="text"
              placeholder="Alamat lengkap"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- No HP -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">No. HP *</label>
            <input
              v-model="form.customer.no_hp"
              type="text"
              placeholder="Nomor HP"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
          <textarea
            v-model="form.keterangan"
            rows="3"
            placeholder="Catatan atau keterangan tambahan"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    @input="line.showDropdown = true"
                    class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                  <!-- Dropdown hasil search produk -->
                  <div
                    v-if="line.showDropdown && line.description"
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
                    class="w-full border border-gray-300 rounded px-2 py-1 text-sm text-right"
                  />
                </td>
                <td class="border border-gray-300 px-3 py-2 text-sm">
                  <input
                    v-model.number="line.unit_price"
                    @change="calculateLineTotal(line)"
                    type="number"
                    min="0"
                    placeholder="0"
                    class="w-full border border-gray-300 rounded px-2 py-1 text-sm text-right"
                  />
                </td>
                <td class="border border-gray-300 px-3 py-2 text-sm">
                  <input
                    v-model.number="line.discount"
                    @change="calculateLineTotal(line)"
                    type="number"
                    min="0"
                    placeholder="0"
                    class="w-full border border-gray-300 rounded px-2 py-1 text-sm text-right"
                  />
                </td>
                <td class="border border-gray-300 px-3 py-2 text-sm text-right font-semibold">
                  {{ formatCurrency(line.line_total) }}
                </td>
                <td class="border border-gray-300 px-3 py-2 text-center">
                  <button
                    @click="removeProductLine(idx)"
                    class="text-red-600 hover:text-red-800 text-sm font-medium"
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
                    @input="line.showDropdown = true"
                    class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                  <!-- Dropdown hasil search jasa -->
                  <div
                    v-if="line.showDropdown && line.description"
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
                    class="w-full border border-gray-300 rounded px-2 py-1 text-sm text-right"
                  />
                </td>
                <td class="border border-gray-300 px-3 py-2 text-sm">
                  <input
                    v-model.number="line.unit_price"
                    @change="calculateLineTotal(line)"
                    type="number"
                    min="0"
                    placeholder="0"
                    class="w-full border border-gray-300 rounded px-2 py-1 text-sm text-right"
                  />
                </td>
                <td class="border border-gray-300 px-3 py-2 text-sm">
                  <input
                    v-model.number="line.discount"
                    @change="calculateLineTotal(line)"
                    type="number"
                    min="0"
                    placeholder="0"
                    class="w-full border border-gray-300 rounded px-2 py-1 text-sm text-right"
                  />
                </td>
                <td class="border border-gray-300 px-3 py-2 text-sm text-right font-semibold">
                  {{ formatCurrency(line.line_total) }}
                </td>
                <td class="border border-gray-300 px-3 py-2 text-center">
                  <button
                    @click="removeServiceLine(idx)"
                    class="text-red-600 hover:text-red-800 text-sm font-medium"
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
      <div class="flex justify-end gap-4">
        <button
          @click="goBack"
          class="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50 transition font-medium"
        >
          Batal
        </button>
        <button
          @click="saveSalesOrder"
          :disabled="loading"
          class="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium disabled:opacity-50"
        >
          {{ loading ? 'Menyimpan...' : 'Simpan Sales Order' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import api from '@/user/axios'
import { BASE_URL } from '@/base.utils.url'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const notification = ref({ show: false, message: '', type: 'success' })

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

// Products data for search
const products = ref([])

// Services data for search
const services = ref([])

// Customer search
const searchCustomer = ref('')
const customerSearchResults = ref([])

// Watch for totals changes
const totals = computed(() => {
  let subtotal = 0

  form.value.productLines.forEach((line) => {
    subtotal += line.line_total || 0
  })
  form.value.serviceLines.forEach((line) => {
    subtotal += line.line_total || 0
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
  line.line_total = line.qty * line.unit_price - (line.discount || 0)
  if (line.line_total < 0) line.line_total = 0
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

    const res = await api.post('orders/sale', payload)
    if (res.data.status || res.data.success) {
      showNotification('Sales Order berhasil dibuat!', 'success')
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

// Filter services based on search query
function serviceMatches(searchQuery) {
  const q = (searchQuery || '').trim().toLowerCase()
  if (!q) return services.value.slice(0, 20)
  return services.value.filter((s) => (s.nama || '').toLowerCase().includes(q))
}

// Select product and auto-fill price
function selectProductLine(lineIdx, product) {
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
  const line = form.value.serviceLines[lineIdx]
  line.service_id = service.id
  line.description = service.nama
  line.unit_price = service.harga ?? 0
  line.showDropdown = false
  calculateLineTotal(line)
}

// Initialize
onMounted(async () => {
  form.value.order_number = generateOrderNumber()
  await Promise.all([fetchProducts(), fetchServices()])

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
</script>
