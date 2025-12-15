<template>
  <div class="p-4 space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold text-gray-800">Purchase Order</h1>
      <div class="text-sm text-gray-500">{{ isEdit ? 'Edit' : 'Draft' }}</div>
    </div>

    <!-- Header fields -->
    <div class="bg-white rounded shadow p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
      <div>
        <label class="text-sm text-gray-700">Nomor PO</label>
        <input
          v-model="orderNumber"
          class="w-full border rounded px-3 py-2"
          placeholder="PO-2025-001"
        />
      </div>
      <div>
        <label class="text-sm text-gray-700">Tanggal</label>
        <input v-model="orderDate" type="date" class="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label class="text-sm text-gray-700">Status</label>
        <select v-model="status" class="w-full border rounded px-3 py-2">
          <option value="draft">draft</option>
          <option value="confirmed">confirmed</option>
          <option value="paid">paid</option>
          <option value="cancelled">cancelled</option>
        </select>
      </div>
    </div>

    <!-- Vendor selector -->
    <div class="bg-white rounded shadow p-4 space-y-3">
      <h2 class="text-lg font-semibold text-gray-800">Pilih Vendor</h2>
      <div class="relative">
        <input
          v-model="vendorSearch"
          type="text"
          placeholder="Cari vendor berdasarkan nama/email/hp"
          class="w-full border rounded px-3 py-2"
          @input="onVendorSearch"
        />
        <div
          v-if="showVendorDropdown"
          class="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-y-auto"
        >
          <div
            v-for="v in filteredVendors"
            :key="v.id"
            class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            @click="selectVendor(v)"
          >
            <div class="font-semibold text-gray-800">{{ v.nama }}</div>
            <div class="text-xs text-gray-600">{{ v.alamat || '-' }}</div>
            <div class="text-xs text-gray-600">{{ v.hp || v.email || '-' }}</div>
          </div>
          <div v-if="filteredVendors.length === 0" class="px-3 py-2 text-sm text-gray-500">
            Tidak ada vendor
          </div>
        </div>
      </div>
      <div v-if="selectedVendor" class="text-sm text-gray-700 space-y-1">
        <div><span class="font-semibold">Nama:</span> {{ selectedVendor.nama }}</div>
        <div><span class="font-semibold">Alamat:</span> {{ selectedVendor.alamat || '-' }}</div>
        <div><span class="font-semibold">HP:</span> {{ selectedVendor.hp || '-' }}</div>
        <div><span class="font-semibold">Email:</span> {{ selectedVendor.email || '-' }}</div>
      </div>
    </div>

    <!-- Items -->
    <div class="bg-white rounded shadow p-4 space-y-4">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 class="text-lg font-semibold text-gray-800">Item List</h2>
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 text-sm text-gray-700">
            <input v-model="taxEnabled" type="checkbox" class="h-4 w-4" @change="onToggleTax" />
            <span>Gunakan Pajak</span>
          </label>
          <button class="px-3 py-2 bg-blue-600 text-white rounded" @click="addItem">
            + Tambah Item
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
            <tr>
              <th class="px-3 py-2 text-left">Produk</th>
              <th class="px-3 py-2 text-left">Qty</th>
              <th class="px-3 py-2 text-left">Satuan</th>
              <th class="px-3 py-2 text-left">Harga</th>
              <th class="px-3 py-2 text-left">Discount</th>
              <th v-if="taxEnabled" class="px-3 py-2 text-left">Tax (%)</th>
              <th class="px-3 py-2 text-left">Subtotal</th>
              <th class="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="(row, idx) in items" :key="row.uid">
              <td class="px-3 py-2 w-64">
                <div class="relative">
                  <input
                    v-model="row.productSearch"
                    type="text"
                    placeholder="Cari produk..."
                    class="w-full border rounded px-2 py-2"
                    @input="onProductSearch(idx)"
                  />
                  <div
                    v-if="row.showDropdown"
                    class="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-80 overflow-y-auto"
                  >
                    <div
                      v-for="p in productMatches(row.productSearch)"
                      :key="p.id"
                      class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      @click="selectProduct(idx, p)"
                    >
                      <div class="font-semibold text-gray-800">{{ p.nama }}</div>
                      <div class="text-xs text-gray-600">{{ p.kode || '-' }}</div>
                    </div>
                    <div
                      v-if="productMatches(row.productSearch).length === 0"
                      class="px-3 py-2 text-sm text-gray-500"
                    >
                      Tidak ada produk
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-3 py-2 w-24">
                <input
                  v-model.number="row.qty"
                  type="number"
                  min="1"
                  class="w-full border rounded px-2 py-2 text-right"
                  @input="recalc(idx)"
                />
              </td>
              <td class="px-3 py-2 w-32">
                <input
                  v-model="row.satuan"
                  class="w-full border rounded px-2 py-2"
                  placeholder="Satuan"
                />
              </td>
              <td class="px-3 py-2 w-32">
                <input
                  v-model.number="row.harga"
                  type="number"
                  min="0"
                  class="w-full border rounded px-2 py-2 text-right"
                  @input="recalc(idx)"
                />
              </td>
              <td class="px-3 py-2 w-32">
                <input
                  v-model.number="row.discount"
                  type="number"
                  min="0"
                  class="w-full border rounded px-2 py-2 text-right"
                  @input="recalc(idx)"
                />
              </td>
              <td v-if="taxEnabled" class="px-3 py-2 w-32">
                <div class="flex gap-2">
                  <input
                    v-model.number="row.taxRate"
                    type="number"
                    min="0"
                    class="w-20 border rounded px-2 py-2 text-right"
                    @input="recalc(idx)"
                  />
                  <input
                    :value="formatCurrency(row.tax)"
                    readonly
                    class="flex-1 border rounded px-2 py-2 text-right bg-gray-50"
                  />
                </div>
              </td>
              <td class="px-3 py-2 w-32 text-right align-middle">
                {{ formatCurrency(row.subtotal) }}
              </td>
              <td class="px-3 py-2 text-right">
                <button class="text-red-600" @click="removeItem(idx)">Hapus</button>
              </td>
            </tr>
            <tr v-if="items.length === 0">
              <td class="px-3 py-4 text-center text-gray-500" :colspan="taxEnabled ? 8 : 7">
                Belum ada item
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex justify-end text-right text-gray-800">
        <div class="space-y-1 w-64">
          <div class="flex justify-between text-sm">
            <span>Subtotal</span>
            <span class="font-semibold">{{ formatCurrency(subtotal) }}</span>
          </div>
          <div v-if="taxEnabled" class="flex justify-between text-sm">
            <span>Tax</span>
            <span class="font-semibold">{{ formatCurrency(taxTotal) }}</span>
          </div>
          <div class="flex justify-between text-lg font-semibold">
            <span>Grand Total</span>
            <span>{{ formatCurrency(total) }}</span>
          </div>
        </div>
      </div>

      <div class="flex justify-end items-center gap-4">
        <div v-if="taxEnabled" class="text-sm text-gray-600">
          Pajak: <span class="font-semibold">{{ formatCurrency(taxTotal) }}</span>
        </div>
        <button class="px-3 py-2 border rounded" @click="resetForm" :disabled="loading">
          Reset
        </button>
        <button
          class="px-3 py-2 bg-blue-600 text-white rounded"
          @click="submit"
          :disabled="loading"
        >
          {{ loading ? 'Menyimpan...' : isEdit ? 'Update PO' : 'Simpan PO' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { BASE_URL } from '@/base.utils.url'
import api from '@/user/axios'

const vendors = ref([])
const vendorSearch = ref('')
const showVendorDropdown = ref(false)
const selectedVendor = ref(null)

const products = ref([])

const items = reactive([])
const deletedLineIds = ref([])
const originalLines = ref([])

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)

const orderNumber = ref('')
const orderDate = ref(new Date().toISOString().slice(0, 10))
const status = ref('draft')
const taxEnabled = ref(true)
const loading = ref(false)
const subtotal = computed(() => items.reduce((sum, it) => sum + (it.subtotal || 0), 0))
const taxTotal = computed(() =>
  taxEnabled.value ? items.reduce((sum, it) => sum + (Number(it.tax) || 0), 0) : 0,
)
const total = computed(() => subtotal.value + taxTotal.value)

function formatCurrency(n) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(n))
}

function addItem() {
  items.push({
    uid: crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2),
    product_id: '',
    productSearch: '',
    showDropdown: false,
    nama: '',
    qty: 1,
    satuan: '',
    harga: 0,
    discount: 0,
    tax: 0,
    taxRate: 11,
    subtotal: 0,
    lineId: null,
  })
}

function removeItem(idx) {
  const it = items[idx]
  if (it?.lineId) deletedLineIds.value.push(it.lineId)
  items.splice(idx, 1)
}

function recalc(idx) {
  const it = items[idx]
  const qty = Number(it.qty) || 0
  const harga = Number(it.harga) || 0
  const discount = Number(it.discount) || 0
  const base = Math.max(0, qty * harga - discount)
  const taxAmount = taxEnabled.value ? Math.max(0, base * ((Number(it.taxRate) || 0) / 100)) : 0
  it.tax = taxAmount
  it.subtotal = base
}

function onToggleTax() {
  items.forEach((it, idx) => {
    if (!taxEnabled.value) {
      it.tax = 0
    }
    recalc(idx)
  })
}

const filteredVendors = computed(() => {
  const q = vendorSearch.value.trim().toLowerCase()
  if (!q) return vendors.value
  return vendors.value.filter((v) =>
    [v.nama, v.email, v.hp, v.alamat].some((x) => (x || '').toLowerCase().includes(q)),
  )
})

function onVendorSearch() {
  showVendorDropdown.value = true
}
function selectVendor(v) {
  selectedVendor.value = v
  vendorSearch.value = v.nama
  showVendorDropdown.value = false
}

function productMatches(q) {
  const query = (q || '').trim().toLowerCase()
  if (!query) return products.value.slice(0, 20)
  return products.value.filter((p) =>
    [p.nama, p.kode, p.model, p.tipe].some((x) => (x || '').toLowerCase().includes(query)),
  )
}

function onProductSearch(idx) {
  items[idx].showDropdown = true
}

function selectProduct(idx, p) {
  const it = items[idx]
  it.product_id = p.id
  it.productSearch = p.nama
  it.nama = p.nama
  it.satuan = p.satuan?.nama || ''
  it.harga = p.harga ?? p.hpp ?? 0
  items[idx].showDropdown = false
  recalc(idx)
}

async function fetchVendors() {
  try {
    const res = await axios.get(`${BASE_URL}vendors`)
    vendors.value = Array.isArray(res?.data?.data) ? res.data.data : []
  } catch (err) {
    console.error('Gagal memuat vendor:', err)
  }
}

async function fetchProducts() {
  try {
    const res = await axios.get(`${BASE_URL}products`)
    products.value = Array.isArray(res?.data?.data) ? res.data.data : []
  } catch (err) {
    console.error('Gagal memuat produk:', err)
  }
}
function resetForm() {
  vendorSearch.value = ''
  selectedVendor.value = null
  items.splice(0, items.length)
  deletedLineIds.value = []
  originalLines.value = []
  orderNumber.value = `PO-${Date.now()}`
  orderDate.value = new Date().toISOString().slice(0, 10)
  status.value = 'draft'
  taxEnabled.value = true
  addItem()
}

async function loadOrder(id) {
  loading.value = true
  try {
    const res = await api.get(`orders/purchase/${id}`)
    const d = res?.data?.data || res?.data || {}
    orderNumber.value = d.order_number || `PO-${id}`
    orderDate.value = d.order_date || new Date().toISOString().slice(0, 10)
    status.value = d.status || 'draft'

    const vendId = d.vendor_id || d.vendor?.id
    if (vendId) {
      const match = vendors.value.find((v) => v.id === vendId)
      if (match) {
        selectVendor(match)
      } else if (d.vendor) {
        selectedVendor.value = {
          id: vendId,
          nama: d.vendor.nama || d.vendor.name,
          alamat: d.vendor.alamat || d.vendor.address,
          hp: d.vendor.hp || d.vendor.phone,
          email: d.vendor.email,
        }
        vendorSearch.value = selectedVendor.value.nama
      }
    }

    items.splice(0, items.length)
    originalLines.value = []
    const lines = d.product_lines || []
    lines.forEach((ln) => {
      const qty = Number(ln.qty) || 0
      const harga = Number(ln.unit_price) || 0
      const discount = Number(ln.discount) || 0
      const base = Math.max(0, qty * harga - discount)
      const taxVal = Number(ln.tax) || Number(ln.tax_amount) || 0
      const taxRate = base > 0 ? (taxVal / base) * 100 : 0
      const row = {
        uid: crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2),
        lineId: ln.id,
        product_id: ln.product_id,
        productSearch: ln.product?.nama || ln.product?.name || ln.description || '',
        showDropdown: false,
        nama: ln.product?.nama || ln.product?.name || ln.description || '',
        qty,
        satuan: ln.product?.satuan?.nama || ln.product?.unit || '',
        harga,
        discount,
        tax: taxVal,
        taxRate,
        subtotal: base,
      }
      items.push(row)
      originalLines.value.push({ ...row })
    })
    taxEnabled.value = items.some((it) => Number(it.tax) > 0)
    items.forEach((_, idx) => recalc(idx))
    if (!items.length) addItem()
  } catch (err) {
    console.error('Gagal memuat PO:', err)
  } finally {
    loading.value = false
  }
}

function isLineChanged(row) {
  if (!row.lineId) return false
  const orig = originalLines.value.find((o) => o.lineId === row.lineId)
  if (!orig) return true
  return (
    Number(orig.qty) !== Number(row.qty) ||
    Number(orig.harga) !== Number(row.harga) ||
    Number(orig.discount) !== Number(row.discount) ||
    Number(orig.tax) !== Number(row.tax) ||
    Number(orig.taxRate) !== Number(row.taxRate) ||
    (orig.nama || '') !== (row.nama || '') ||
    (orig.satuan || '') !== (row.satuan || '')
  )
}

function buildLinesPayload() {
  return items
    .filter((it) => it.product_id)
    .map((it, idx) => ({
      product_id: it.product_id,
      line_number: idx + 1,
      description: it.nama || '',
      qty: Number(it.qty) || 0,
      unit_price: Number(it.harga) || 0,
      discount: Number(it.discount) || 0,
      line_total: Math.max(
        0,
        (Number(it.qty) || 0) * (Number(it.harga) || 0) - (Number(it.discount) || 0),
      ),
    }))
}

async function submit() {
  if (!selectedVendor.value?.id) {
    alert('Pilih vendor terlebih dahulu')
    return
  }
  if (!items.some((it) => it.product_id)) {
    alert('Tambahkan minimal 1 item produk')
    return
  }
  loading.value = true
  try {
    if (isEdit.value) {
      await updateOrder()
    } else {
      await createOrder()
    }
    alert('Purchase Order tersimpan')
    router.push({ name: 'pembelian' })
  } catch (err) {
    console.error('Gagal simpan PO:', err)
    alert('Gagal menyimpan PO')
  } finally {
    loading.value = false
  }
}

async function createOrder() {
  const subtotalVal = subtotal.value
  const taxVal = taxTotal.value
  const payload = {
    order_number: orderNumber.value || `PO-${Date.now()}`,
    order_date: orderDate.value,
    status: status.value || 'draft',
    subtotal: subtotalVal,
    tax: taxVal,
    total: subtotalVal + taxVal,
    vendor_id: selectedVendor.value.id,
    product_lines: buildLinesPayload(),
  }
  await api.post('orders/purchase', payload)
}

async function updateOrder() {
  const subtotalVal = subtotal.value
  const taxVal = taxTotal.value
  const header = {
    order_number: orderNumber.value,
    order_date: orderDate.value,
    status: status.value,
    subtotal: subtotalVal,
    tax: taxVal,
    total: subtotalVal + taxVal,
    vendor_id: selectedVendor.value.id,
  }
  const orderId = route.params.id
  await api.post(`orders/update/purchase/${orderId}`, header)

  for (const lineId of deletedLineIds.value) {
    await api.post(`orders/delete/purchase/product-lines/${lineId}`, {})
  }
  deletedLineIds.value = []

  for (const it of items) {
    if (it.lineId && isLineChanged(it)) {
      await api.post(`orders/delete/purchase/product-lines/${it.lineId}`, {})
      await api.post(`orders/add/purchase/product-lines/${orderId}`, {
        product_id: it.product_id,
        line_number: items.indexOf(it) + 1,
        description: it.nama || '',
        qty: Number(it.qty) || 0,
        unit_price: Number(it.harga) || 0,
        discount: Number(it.discount) || 0,
        line_total: Math.max(
          0,
          (Number(it.qty) || 0) * (Number(it.harga) || 0) - (Number(it.discount) || 0),
        ),
      })
    }
  }

  for (const it of items.filter((x) => !x.lineId && x.product_id)) {
    await api.post(`orders/add/purchase/product-lines/${orderId}`, {
      product_id: it.product_id,
      line_number: items.indexOf(it) + 1,
      description: it.nama || '',
      qty: Number(it.qty) || 0,
      unit_price: Number(it.harga) || 0,
      discount: Number(it.discount) || 0,
      line_total: Math.max(
        0,
        (Number(it.qty) || 0) * (Number(it.harga) || 0) - (Number(it.discount) || 0),
      ),
    })
  }
}

onMounted(async () => {
  await Promise.all([fetchVendors(), fetchProducts()])
  if (route.params.id) {
    await loadOrder(route.params.id)
  } else {
    resetForm()
  }
})
</script>

<style scoped></style>
