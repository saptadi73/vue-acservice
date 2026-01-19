<template>
  <div class="p-4 space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold text-gray-800">Pengeluaran/Pemakaian Barang Internal</h1>
      <button @click="goBack" class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
        ← Kembali
      </button>
    </div>

    <!-- Form header -->
    <div class="bg-white rounded shadow p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Tanggal Pemakaian <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.usage_date"
          type="date"
          required
          class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Nomor Referensi <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.reference_number"
          type="text"
          required
          class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="INT-USE-001"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"> Dibuat Oleh </label>
        <input
          :value="createdBy"
          disabled
          class="w-full border rounded px-3 py-2 bg-gray-50 text-gray-600"
        />
      </div>
    </div>

    <!-- Items list -->
    <div class="bg-white rounded shadow p-4 space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800">Daftar Barang</h2>
        <button @click="addItem" class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Tambah Barang
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
            <tr>
              <th class="px-3 py-2 text-left w-1/3">Nama Barang</th>
              <th class="px-3 py-2 text-left">Stok</th>
              <th class="px-3 py-2 text-left">Qty</th>
              <th class="px-3 py-2 text-left">Satuan</th>
              <th class="px-3 py-2 text-left">Harga Satuan</th>
              <th class="px-3 py-2 text-right">Total</th>
              <th class="px-3 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="(item, idx) in items" :key="item.uid">
              <td class="px-3 py-2">
                <div class="relative w-full">
                  <input
                    v-model="item.productSearch"
                    type="text"
                    placeholder="Ketik nama barang..."
                    class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @input="onProductInput(idx)"
                    @focus="item.showDropdown = true"
                  />
                  <div
                    v-if="item.showDropdown && productMatches(item.productSearch).length > 0"
                    class="fixed z-50 bg-white border rounded shadow"
                    style="max-height: 300px; overflow-y: auto; min-width: 300px"
                  >
                    <div
                      v-for="product in productMatches(item.productSearch)"
                      :key="product.id"
                      class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      @click="selectProduct(idx, product)"
                    >
                      <div class="font-semibold text-gray-800">{{ product.nama }}</div>
                      <div class="text-xs text-gray-600">
                        Kode: {{ product.kode || '-' }} | Stok: {{ product.stok || 0 }}
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-3 py-2 w-32">
                <div class="flex items-center justify-center gap-2">
                  <span
                    :class="[
                      'font-semibold text-sm',
                      item.stok > 0 ? 'text-green-600' : 'text-red-600',
                    ]"
                  >
                    {{ item.stok || 0 }}
                  </span>
                  <span v-if="item.stok === 0" class="text-xs text-red-600 font-medium">
                    (Out of Stock)
                  </span>
                </div>
              </td>
              <td class="px-3 py-2 w-32">
                <div>
                  <input
                    v-model.number="item.qty"
                    type="number"
                    min="1"
                    :max="item.stok"
                    :disabled="item.stok === 0"
                    :class="[
                      'w-full border rounded px-3 py-2 text-right focus:outline-none focus:ring-2',
                      item.qty > item.stok
                        ? 'border-red-500 focus:ring-red-500'
                        : 'focus:ring-blue-500',
                      item.stok === 0 ? 'bg-gray-100 cursor-not-allowed' : '',
                    ]"
                    @input="calculateLineTotal(item)"
                  />
                  <p v-if="item.qty > item.stok && item.stok > 0" class="text-xs text-red-600 mt-1">
                    Melebihi stok!
                  </p>
                </div>
              </td>
              <td class="px-3 py-2 w-28">
                <input
                  v-model="item.satuan"
                  disabled
                  class="w-full border rounded px-3 py-2 bg-gray-50 text-gray-600"
                />
              </td>
              <td class="px-3 py-2 w-32">
                <input
                  :value="formatCurrency(item.unit_price)"
                  disabled
                  class="w-full border rounded px-3 py-2 text-right bg-gray-50 text-gray-600"
                />
              </td>
              <td class="px-3 py-2 w-32 text-right">
                <span class="font-semibold">{{ formatCurrency(item.line_total) }}</span>
              </td>
              <td class="px-3 py-2 text-center">
                <button @click="removeItem(idx)" class="text-red-600 hover:text-red-800">
                  Hapus
                </button>
              </td>
            </tr>
            <tr v-if="items.length === 0">
              <td class="px-3 py-4 text-center text-gray-500" colspan="7">
                Belum ada barang ditambahkan
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Total -->
      <div class="flex justify-end">
        <div class="w-64 space-y-2 text-right">
          <div class="flex justify-between text-lg font-semibold text-gray-800">
            <span>Total:</span>
            <span>{{ formatCurrency(totalAmount) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Description -->
    <div class="bg-white rounded shadow p-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Keterangan/Deskripsi <span class="text-red-500">*</span>
      </label>
      <textarea
        v-model="form.description"
        rows="3"
        required
        class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Contoh: Pemakaian alat tulis kantor untuk operasional bulan ini"
      ></textarea>
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded p-4">
      <p class="text-sm text-red-600">{{ errorMessage }}</p>
    </div>

    <!-- Action buttons -->
    <div class="flex justify-end gap-3">
      <button
        @click="goBack"
        class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
        :disabled="loading"
      >
        Batal
      </button>
      <button
        @click="submitExpenditure"
        :disabled="loading || items.length === 0"
        class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Memproses...' : 'Simpan & Buat Jurnal' }}
      </button>
    </div>

    <!-- Success notification -->
    <div
      v-if="showNotification"
      class="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50"
    >
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <span>{{ notificationMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import api from '@/user/axios'
import { BASE_URL } from '@/base.utils.url'

const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')
const showNotification = ref(false)
const notificationMessage = ref('')

// Form data
const form = reactive({
  usage_date: new Date().toISOString().split('T')[0],
  reference_number: generateReferenceNumber(),
  description: '',
})

const createdBy = computed(() => localStorage.getItem('email') || 'User')

// Products
const products = ref([])

// Items
const items = reactive([])

// Total amount
const totalAmount = computed(() => {
  return items.reduce((sum, item) => sum + (Number(item.line_total) || 0), 0)
})

// Generate reference number
function generateReferenceNumber() {
  const date = new Date()
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const rand = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')
  return `INT-USE-${yyyy}${mm}${dd}-${rand}`
}

// Format currency
function formatCurrency(num) {
  if (!num || num === 0) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num)
}

// Add item
function addItem() {
  items.push({
    uid: crypto?.randomUUID?.() || Math.random().toString(36).slice(2),
    product_id: null,
    productSearch: '',
    showDropdown: false,
    nama: '',
    qty: 1,
    stok: 0,
    satuan: '',
    unit_price: 0,
    line_total: 0,
  })
}

// Remove item
function removeItem(idx) {
  items.splice(idx, 1)
}

// Product matches
function productMatches(searchQuery) {
  const q = (searchQuery || '').trim().toLowerCase()
  if (!q) return products.value.slice(0, 20)
  return products.value.filter((p) =>
    [p.nama, p.kode, p.model, p.tipe].some((x) => (x || '').toLowerCase().includes(q)),
  )
}

// On product input
function onProductInput(idx) {
  items[idx].showDropdown = true
}

// Select product
function selectProduct(idx, product) {
  const item = items[idx]
  item.product_id = product.id
  item.productSearch = product.nama
  item.nama = product.nama
  item.stok = Number(product.stok) || 0
  item.satuan = product.satuan?.nama || product.satuan || ''
  item.unit_price = product.hpp || product.harga || 0
  item.showDropdown = false

  // Set qty to 1 or available stock if less
  if (item.stok > 0) {
    item.qty = Math.min(1, item.stok)
  } else {
    item.qty = 0
  }

  calculateLineTotal(item)
}

// Calculate line total
function calculateLineTotal(item) {
  let qty = Number(item.qty) || 0
  const stok = Number(item.stok) || 0
  const unitPrice = Number(item.unit_price) || 0

  // Auto-correct if qty exceeds stock
  if (qty > stok && stok > 0) {
    item.qty = stok
    qty = stok
  }

  item.line_total = qty * unitPrice
}

// Fetch products
async function fetchProducts() {
  try {
    const res = await axios.get(`${BASE_URL}products`)
    products.value = Array.isArray(res?.data?.data) ? res.data.data : []
  } catch (err) {
    console.error('Error fetching products:', err)
  }
}

// Submit expenditure
async function submitExpenditure() {
  errorMessage.value = ''

  // Validation
  if (!form.usage_date) {
    errorMessage.value = 'Tanggal pemakaian wajib diisi'
    return
  }
  if (!form.reference_number) {
    errorMessage.value = 'Nomor referensi wajib diisi'
    return
  }
  if (!form.description) {
    errorMessage.value = 'Keterangan wajib diisi'
    return
  }
  if (items.length === 0) {
    errorMessage.value = 'Minimal harus ada 1 barang'
    return
  }

  // Check all items have product selected
  const invalidItems = items.filter((item) => !item.product_id)
  if (invalidItems.length > 0) {
    errorMessage.value = 'Semua barang harus dipilih dari dropdown'
    return
  }

  // Check all items qty does not exceed stock
  const overStockItems = items.filter((item) => item.qty > item.stok)
  if (overStockItems.length > 0) {
    errorMessage.value = 'Ada barang dengan quantity melebihi stok yang tersedia'
    return
  }

  // Check all items have valid stock
  const zeroStockItems = items.filter((item) => item.stok <= 0 || item.qty <= 0)
  if (zeroStockItems.length > 0) {
    errorMessage.value = 'Semua barang harus memiliki stok dan quantity yang valid'
    return
  }

  loading.value = true
  try {
    const payload = {
      usage_date: form.usage_date,
      reference_number: form.reference_number,
      amount: totalAmount.value,
      description: form.description,
      created_by: localStorage.getItem('email'),
      items: items.map((item) => ({
        product_id: item.product_id,
        product_name: item.nama,
        qty: item.qty,
        unit_price: item.unit_price,
        line_total: item.line_total,
      })),
    }

    console.log('Submitting internal expenditure payload:', payload)

    const res = await api.post('/accounting/journals/internal-expenditure', payload)

    console.log('Internal expenditure response:', res?.data)

    notificationMessage.value = 'Pengeluaran barang internal berhasil disimpan dan jurnal dibuat!'
    showNotification.value = true

    setTimeout(() => {
      showNotification.value = false
      router.push({ name: 'jurnal umum' })
    }, 2000)
  } catch (err) {
    console.error('Error submitting internal expenditure:', err)
    errorMessage.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      'Gagal menyimpan pengeluaran barang'
  } finally {
    loading.value = false
  }
}

// Go back
function goBack() {
  router.back()
}

onMounted(async () => {
  await fetchProducts()
  // Add first item by default
  if (items.length === 0) {
    addItem()
  }
})
</script>

<style scoped>
/* Hide number input spinners */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
