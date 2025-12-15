<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-semibold text-gray-800">Daftar Produk</h1>
      <button class="bg-blue-600 text-white px-3 py-2 rounded-md" @click="openCreateModal">
        Tambah Produk
      </button>
    </div>

    <div class="flex items-center gap-2 mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari nama/kode/brand/kategori..."
        class="border rounded px-3 py-2 w-full max-w-md"
      />
      <button class="bg-gray-100 border px-3 py-2 rounded" @click="fetchAll">Refresh</button>
    </div>

    <div class="overflow-x-auto bg-white rounded shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Gambar
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Nama
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Kode
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Harga
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Stok
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Brand
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Kategori
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Satuan
            </th>
            <th
              class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="p in paginatedProducts" :key="p.id">
            <td class="px-4 py-2">
              <img
                v-if="p.gambar"
                :src="resolveImage(p.gambar)"
                alt="Produk"
                class="h-12 w-12 object-cover rounded"
              />
              <div v-else class="h-12 w-12 bg-gray-100 rounded" />
            </td>
            <td class="px-4 py-2 font-medium text-gray-800">{{ p.nama }}</td>
            <td class="px-4 py-2 text-gray-600">{{ p.kode }}</td>
            <td class="px-4 py-2 text-gray-800">{{ formatCurrency(p.harga) }}</td>
            <td class="px-4 py-2 text-gray-800">{{ p.stok }}</td>
            <td class="px-4 py-2 text-gray-700">{{ p.brand?.nama || '-' }}</td>
            <td class="px-4 py-2 text-gray-700">{{ p.kategori?.nama || '-' }}</td>
            <td class="px-4 py-2 text-gray-700">{{ p.satuan?.nama || '-' }}</td>
            <td class="px-4 py-2 text-right">
              <button class="text-blue-600 mr-2" @click="openEditModal(p.id)">Edit</button>
              <button class="text-red-600" @click="openDeleteModal(p.id, p.nama)">Delete</button>
            </td>
          </tr>
          <tr v-if="paginatedProducts.length === 0">
            <td class="px-4 py-6 text-center text-gray-500" colspan="9">Tidak ada data</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between mt-4">
      <div class="text-sm text-gray-600">Halaman {{ currentPage }} dari {{ totalPages }}</div>
      <div class="flex items-center gap-2">
        <button
          class="px-3 py-2 border rounded"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Prev
        </button>
        <select v-model.number="pageSize" class="border rounded px-2 py-2">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
        </select>
        <button
          class="px-3 py-2 border rounded"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreate" class="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div class="bg-white w-full max-w-3xl rounded shadow p-4 max-h-[90vh] overflow-y-auto">
        <h2 class="text-lg font-semibold mb-3">Tambah Produk</h2>
        <form @submit.prevent="submitCreate">
          <div class="grid grid-cols-2 gap-3">
            <input
              v-model="createForm.nama"
              class="border rounded px-3 py-2"
              placeholder="Nama"
              required
            />
            <input v-model="createForm.kode" class="border rounded px-3 py-2" placeholder="Kode" />
            <input v-model="createForm.tipe" class="border rounded px-3 py-2" placeholder="Tipe" />
            <input
              v-model="createForm.model"
              class="border rounded px-3 py-2"
              placeholder="Model"
            />
            <input
              v-model="createForm.harga"
              type="number"
              class="border rounded px-3 py-2"
              placeholder="Harga"
            />
            <input
              v-model="createForm.hpp"
              type="number"
              class="border rounded px-3 py-2"
              placeholder="HPP"
            />
            <input
              v-model="createForm.stok"
              type="number"
              class="border rounded px-3 py-2"
              placeholder="Stok"
            />
            <textarea
              v-model="createForm.deskripsi"
              class="border rounded px-3 py-2 col-span-2"
              placeholder="Deskripsi"
              rows="2"
            ></textarea>

            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-700 w-24">Brand</label>
              <select v-model="createForm.brand_id" class="border rounded px-3 py-2 w-full">
                <option :value="''">Pilih brand</option>
                <option v-for="b in brands" :key="b.id" :value="b.id">{{ b.nama }}</option>
              </select>
              <button type="button" class="text-blue-600 text-sm" @click="showBrandModal = true">
                + Brand
              </button>
            </div>
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-700 w-24">Kategori</label>
              <select v-model="createForm.kategori_id" class="border rounded px-3 py-2 w-full">
                <option :value="''">Pilih kategori</option>
                <option v-for="k in categories" :key="k.id" :value="k.id">{{ k.nama }}</option>
              </select>
              <button type="button" class="text-blue-600 text-sm" @click="showCategoryModal = true">
                + Kategori
              </button>
            </div>
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-700 w-24">Satuan</label>
              <select v-model="createForm.satuan_id" class="border rounded px-3 py-2 w-full">
                <option :value="''">Pilih satuan</option>
                <option v-for="s in units" :key="s.id" :value="s.id">{{ s.nama }}</option>
              </select>
              <button type="button" class="text-blue-600 text-sm" @click="showUnitModal = true">
                + Satuan
              </button>
            </div>

            <div class="flex items-center gap-2 col-span-2">
              <label class="text-sm text-gray-700">Dijual?</label>
              <input v-model="createForm.is_sealable" type="checkbox" class="h-4 w-4" />
            </div>

            <div class="flex items-center gap-3 col-span-2">
              <input type="file" accept="image/*" @change="onCreateFileChange" />
              <div v-if="createPreview" class="text-xs text-gray-600">Preview aktif</div>
            </div>
            <div v-if="createPreview" class="border rounded p-2 col-span-2">
              <img :src="createPreview" alt="Preview gambar" class="max-h-40 object-contain" />
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" class="px-3 py-2 border rounded" @click="closeCreateModal">
              Batal
            </button>
            <button
              type="submit"
              class="px-3 py-2 bg-blue-600 text-white rounded"
              :disabled="loading"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEdit" class="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div class="bg-white w-full max-w-3xl rounded shadow p-4 max-h-[90vh] overflow-y-auto">
        <h2 class="text-lg font-semibold mb-3">Edit Produk</h2>
        <form @submit.prevent="submitEdit">
          <div class="grid grid-cols-2 gap-3">
            <input
              v-model="editForm.nama"
              class="border rounded px-3 py-2"
              placeholder="Nama"
              required
            />
            <input v-model="editForm.kode" class="border rounded px-3 py-2" placeholder="Kode" />
            <input v-model="editForm.tipe" class="border rounded px-3 py-2" placeholder="Tipe" />
            <input v-model="editForm.model" class="border rounded px-3 py-2" placeholder="Model" />
            <input
              v-model="editForm.harga"
              type="number"
              class="border rounded px-3 py-2"
              placeholder="Harga"
            />
            <input
              v-model="editForm.hpp"
              type="number"
              class="border rounded px-3 py-2"
              placeholder="HPP"
            />
            <input
              v-model="editForm.stok"
              type="number"
              class="border rounded px-3 py-2"
              placeholder="Stok"
            />
            <textarea
              v-model="editForm.deskripsi"
              class="border rounded px-3 py-2 col-span-2"
              placeholder="Deskripsi"
              rows="2"
            ></textarea>

            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-700 w-24">Brand</label>
              <select v-model="editForm.brand_id" class="border rounded px-3 py-2 w-full">
                <option :value="''">Pilih brand</option>
                <option v-for="b in brands" :key="b.id" :value="b.id">{{ b.nama }}</option>
              </select>
              <button type="button" class="text-blue-600 text-sm" @click="showBrandModal = true">
                + Brand
              </button>
            </div>
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-700 w-24">Kategori</label>
              <select v-model="editForm.kategori_id" class="border rounded px-3 py-2 w-full">
                <option :value="''">Pilih kategori</option>
                <option v-for="k in categories" :key="k.id" :value="k.id">{{ k.nama }}</option>
              </select>
              <button type="button" class="text-blue-600 text-sm" @click="showCategoryModal = true">
                + Kategori
              </button>
            </div>
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-700 w-24">Satuan</label>
              <select v-model="editForm.satuan_id" class="border rounded px-3 py-2 w-full">
                <option :value="''">Pilih satuan</option>
                <option v-for="s in units" :key="s.id" :value="s.id">{{ s.nama }}</option>
              </select>
              <button type="button" class="text-blue-600 text-sm" @click="showUnitModal = true">
                + Satuan
              </button>
            </div>

            <div class="flex items-center gap-2 col-span-2">
              <label class="text-sm text-gray-700">Dijual?</label>
              <input v-model="editForm.is_sealable" type="checkbox" class="h-4 w-4" />
            </div>

            <div class="flex items-center gap-3 col-span-2">
              <input type="file" accept="image/*" @change="onEditFileChange" />
              <div v-if="editPreview" class="text-xs text-gray-600">Preview aktif</div>
            </div>
            <div v-if="editPreview || resolvedEditImageUrl" class="border rounded p-2 col-span-2">
              <img
                :src="editPreview || resolvedEditImageUrl"
                alt="Preview gambar"
                class="max-h-40 object-contain"
              />
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" class="px-3 py-2 border rounded" @click="closeEditModal">
              Batal
            </button>
            <button
              type="submit"
              class="px-3 py-2 bg-blue-600 text-white rounded"
              :disabled="loading"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <div v-if="showDelete" class="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div class="bg-white w-full max-w-md rounded shadow p-4">
        <h2 class="text-lg font-semibold mb-3">Hapus Produk</h2>
        <p>Apakah Anda yakin ingin menghapus produk "{{ deleteTargetName }}"?</p>
        <div class="flex justify-end gap-2 mt-4">
          <button class="px-3 py-2 border rounded" @click="closeDeleteModal">Batal</button>
          <button
            class="px-3 py-2 bg-red-600 text-white rounded"
            :disabled="loading"
            @click="confirmDelete"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>

    <!-- Quick add Brand -->
    <div v-if="showBrandModal" class="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div class="bg-white w-full max-w-sm rounded shadow p-4">
        <h2 class="text-lg font-semibold mb-3">Tambah Brand</h2>
        <form @submit.prevent="submitBrand">
          <input
            v-model="newBrandName"
            class="border rounded px-3 py-2 w-full"
            placeholder="Nama brand"
            required
          />
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" class="px-3 py-2 border rounded" @click="closeBrandModal">
              Batal
            </button>
            <button
              type="submit"
              class="px-3 py-2 bg-blue-600 text-white rounded"
              :disabled="loading"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Quick add Kategori -->
    <div
      v-if="showCategoryModal"
      class="fixed inset-0 bg-black/30 flex items-center justify-center"
    >
      <div class="bg-white w-full max-w-sm rounded shadow p-4">
        <h2 class="text-lg font-semibold mb-3">Tambah Kategori</h2>
        <form @submit.prevent="submitCategory">
          <input
            v-model="newCategoryName"
            class="border rounded px-3 py-2 w-full"
            placeholder="Nama kategori"
            required
          />
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" class="px-3 py-2 border rounded" @click="closeCategoryModal">
              Batal
            </button>
            <button
              type="submit"
              class="px-3 py-2 bg-blue-600 text-white rounded"
              :disabled="loading"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Quick add Satuan -->
    <div v-if="showUnitModal" class="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div class="bg-white w-full max-w-sm rounded shadow p-4">
        <h2 class="text-lg font-semibold mb-3">Tambah Satuan</h2>
        <form @submit.prevent="submitUnit">
          <input
            v-model="newUnitName"
            class="border rounded px-3 py-2 w-full"
            placeholder="Nama satuan"
            required
          />
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" class="px-3 py-2 border rounded" @click="closeUnitModal">
              Batal
            </button>
            <button
              type="submit"
              class="px-3 py-2 bg-blue-600 text-white rounded"
              :disabled="loading"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import api from '@/user/axios'
import { BASE_URL } from '@/base.utils.url'

const products = ref([])
const brands = ref([])
const categories = ref([])
const units = ref([])
const searchQuery = ref('')
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

const showCreate = ref(false)
const showEdit = ref(false)
const showDelete = ref(false)
const showBrandModal = ref(false)
const showCategoryModal = ref(false)
const showUnitModal = ref(false)

const deleteTargetId = ref(null)
const deleteTargetName = ref('')

const createForm = ref({
  nama: '',
  deskripsi: '',
  kode: '',
  tipe: '',
  harga: '',
  hpp: '',
  stok: '',
  model: '',
  kategori_id: '',
  satuan_id: '',
  brand_id: '',
  is_sealable: true,
})
const createFile = ref(null)
const createPreview = ref(null)

const editId = ref(null)
const editForm = ref({
  nama: '',
  deskripsi: '',
  kode: '',
  tipe: '',
  harga: '',
  hpp: '',
  stok: '',
  model: '',
  kategori_id: '',
  satuan_id: '',
  brand_id: '',
  is_sealable: true,
  gambar: null,
})
const editFile = ref(null)
const editPreview = ref(null)

const newBrandName = ref('')
const newCategoryName = ref('')
const newUnitName = ref('')

const filteredProducts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return products.value
  return products.value.filter((p) => {
    const brand = p.brand?.nama || ''
    const kategori = p.kategori?.nama || ''
    const satuan = p.satuan?.nama || ''
    return [p.nama, p.kode, brand, kategori, satuan]
      .map((x) => (x || '').toLowerCase())
      .some((x) => x.includes(q))
  })
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredProducts.value.length / pageSize.value)),
)
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredProducts.value.slice(start, start + pageSize.value)
})

function resetToFirstPage() {
  currentPage.value = 1
}

function resolveImage(path) {
  if (!path) return ''
  if (path.startsWith('http') || path.startsWith('data:')) return path
  return `${BASE_URL}${path}`
}

function formatCurrency(num) {
  if (num === null || num === undefined || num === '') return '-'
  const n = Number(num)
  if (Number.isNaN(n)) return num
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n)
}

async function fetchProducts() {
  loading.value = true
  try {
    const res = await axios.get(`${BASE_URL}products`)
    products.value = Array.isArray(res?.data?.data) ? res.data.data : []
    resetToFirstPage()
  } catch (err) {
    console.error('Failed to fetch products:', err)
  } finally {
    loading.value = false
  }
}

async function fetchBrands() {
  try {
    const res = await axios.get(`${BASE_URL}brands`)
    brands.value = Array.isArray(res?.data?.data) ? res.data.data : []
  } catch (err) {
    console.error('Failed to fetch brands:', err)
  }
}

async function fetchCategories() {
  try {
    const res = await axios.get(`${BASE_URL}kategoris`)
    categories.value = Array.isArray(res?.data?.data) ? res.data.data : []
  } catch (err) {
    console.error('Failed to fetch categories:', err)
  }
}

async function fetchUnits() {
  try {
    const res = await axios.get(`${BASE_URL}satuans`)
    units.value = Array.isArray(res?.data?.data) ? res.data.data : []
  } catch (err) {
    console.error('Failed to fetch units:', err)
  }
}

async function fetchAll() {
  await Promise.all([fetchProducts(), fetchBrands(), fetchCategories(), fetchUnits()])
}

function openCreateModal() {
  createForm.value = {
    nama: '',
    deskripsi: '',
    kode: '',
    type: '',
    harga: '',
    hpp: '',
    stok: '',
    model: '',
    kategori_id: '',
    satuan_id: '',
    brand_id: '',
    is_sealable: true,
  }
  createFile.value = null
  createPreview.value = null
  showCreate.value = true
}
function closeCreateModal() {
  showCreate.value = false
}
function onCreateFileChange(e) {
  const file = e.target.files?.[0] || null
  createFile.value = file
  createPreview.value = file ? URL.createObjectURL(file) : null
}
async function submitCreate() {
  loading.value = true
  try {
    const fd = new FormData()
    fd.append('nama', createForm.value.nama)
    fd.append('deskripsi', createForm.value.deskripsi || '')
    fd.append('kode', createForm.value.kode || '')
    fd.append('tipe', createForm.value.tipe || '')
    fd.append('harga', createForm.value.harga || '')
    fd.append('hpp', createForm.value.hpp || '')
    fd.append('stok', createForm.value.stok || '')
    fd.append('model', createForm.value.model || '')
    fd.append('kategori_id', createForm.value.kategori_id || '')
    fd.append('satuan_id', createForm.value.satuan_id || '')
    fd.append('brand_id', createForm.value.brand_id || '')
    fd.append('is_sealable', createForm.value.is_sealable ? 'true' : 'false')
    if (createFile.value) fd.append('gambar', createFile.value)
    const res = await api.post('products', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    if (res?.data?.status) {
      showCreate.value = false
      await fetchProducts()
    }
  } catch (err) {
    console.error('Failed to create product:', err)
  } finally {
    loading.value = false
  }
}

function openEditModal(id) {
  editId.value = id
  showEdit.value = true
  loadProductDetail(id)
}
function closeEditModal() {
  showEdit.value = false
  editId.value = null
  editFile.value = null
  editPreview.value = null
}
async function loadProductDetail(id) {
  loading.value = true
  try {
    const res = await axios.get(`${BASE_URL}products/${id}`)
    const d = res?.data?.data || {}
    editForm.value = {
      nama: d.nama || '',
      deskripsi: d.deskripsi || '',
      kode: d.kode || '',
      tipe: d.tipe || d.type || '',
      harga: d.harga ?? '',
      hpp: d.hpp ?? '',
      stok: d.stok ?? '',
      model: d.model || '',
      kategori_id: d.kategori_id || d.kategori?.id || '',
      satuan_id: d.satuan_id || d.satuan?.id || '',
      brand_id: d.brand_id || d.brand?.id || '',
      is_sealable: !!d.is_sealable,
      gambar: d.gambar || null,
    }
  } catch (err) {
    console.error('Failed to load product detail:', err)
  } finally {
    loading.value = false
  }
}
function onEditFileChange(e) {
  const file = e.target.files?.[0] || null
  editFile.value = file
  editPreview.value = file ? URL.createObjectURL(file) : null
}
const resolvedEditImageUrl = computed(() => {
  const g = editForm.value.gambar
  if (!g) return null
  if (typeof g === 'string' && (g.startsWith('http') || g.startsWith('data:'))) return g
  return `${BASE_URL}${g}`
})
async function submitEdit() {
  if (!editId.value) return
  loading.value = true
  try {
    const fd = new FormData()
    fd.append('nama', editForm.value.nama)
    fd.append('deskripsi', editForm.value.deskripsi || '')
    fd.append('kode', editForm.value.kode || '')
    fd.append('tipe', editForm.value.tipe || '')
    fd.append('harga', editForm.value.harga || '')
    fd.append('hpp', editForm.value.hpp || '')
    fd.append('stok', editForm.value.stok || '')
    fd.append('model', editForm.value.model || '')
    fd.append('kategori_id', editForm.value.kategori_id || '')
    fd.append('satuan_id', editForm.value.satuan_id || '')
    fd.append('brand_id', editForm.value.brand_id || '')
    fd.append('is_sealable', editForm.value.is_sealable ? 'true' : 'false')
    if (editFile.value) fd.append('gambar', editFile.value)
    const res = await api.post(`products/${editId.value}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    console.log('respon Edit data', res.data)
    if (res?.data?.status) {
      showEdit.value = false
      editId.value = null
      editFile.value = null
      editPreview.value = null
      await fetchProducts()
    }
  } catch (err) {
    console.error('Failed to update product:', err)
  } finally {
    loading.value = false
  }
}

function openDeleteModal(id, name) {
  deleteTargetId.value = id
  deleteTargetName.value = name
  showDelete.value = true
}
function closeDeleteModal() {
  showDelete.value = false
  deleteTargetId.value = null
  deleteTargetName.value = ''
}
async function confirmDelete() {
  if (!deleteTargetId.value) return
  loading.value = true
  try {
    const res = await api.delete(`products/${deleteTargetId.value}`)
    if (res?.data?.status) {
      showDelete.value = false
      deleteTargetId.value = null
      deleteTargetName.value = ''
      await fetchProducts()
    }
  } catch (err) {
    console.error('Failed to delete product:', err)
  } finally {
    loading.value = false
  }
}

// quick add helpers
function closeBrandModal() {
  showBrandModal.value = false
  newBrandName.value = ''
}
async function submitBrand() {
  loading.value = true
  try {
    const res = await api.post('brands', { nama: newBrandName.value })
    if (res?.data?.status) {
      await fetchBrands()
      const newId = res?.data?.data?.id || res?.data?.data?.brand?.id
      if (newId) {
        createForm.value.brand_id = createForm.value.brand_id || newId
        editForm.value.brand_id = editForm.value.brand_id || newId
      }
      closeBrandModal()
    }
  } catch (err) {
    console.error('Failed to create brand:', err)
  } finally {
    loading.value = false
  }
}

function closeCategoryModal() {
  showCategoryModal.value = false
  newCategoryName.value = ''
}
async function submitCategory() {
  loading.value = true
  try {
    const res = await api.post('kategoris', { nama: newCategoryName.value })
    if (res?.data?.status) {
      await fetchCategories()
      const newId = res?.data?.data?.id
      if (newId) {
        createForm.value.kategori_id = createForm.value.kategori_id || newId
        editForm.value.kategori_id = editForm.value.kategori_id || newId
      }
      closeCategoryModal()
    }
  } catch (err) {
    console.error('Failed to create category:', err)
  } finally {
    loading.value = false
  }
}

function closeUnitModal() {
  showUnitModal.value = false
  newUnitName.value = ''
}
async function submitUnit() {
  loading.value = true
  try {
    const res = await api.post('satuans', { nama: newUnitName.value })
    if (res?.data?.status) {
      await fetchUnits()
      const newId = res?.data?.data?.id
      if (newId) {
        createForm.value.satuan_id = createForm.value.satuan_id || newId
        editForm.value.satuan_id = editForm.value.satuan_id || newId
      }
      closeUnitModal()
    }
  } catch (err) {
    console.error('Failed to create unit:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAll()
})
</script>

<style scoped></style>
