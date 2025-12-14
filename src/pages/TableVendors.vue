<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-semibold text-gray-800">Daftar Vendor</h1>
      <button class="bg-blue-600 text-white px-3 py-2 rounded-md" @click="openCreateModal">
        Tambah Vendor
      </button>
    </div>

    <div class="flex items-center gap-2 mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari vendor..."
        class="border rounded px-3 py-2 w-full max-w-md"
      />
      <button class="bg-gray-100 border px-3 py-2 rounded" @click="fetchVendors">Refresh</button>
    </div>

    <div class="overflow-x-auto bg-white rounded shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Nama
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Alamat
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              HP
            </th>
            <th
              class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="v in paginatedVendors" :key="v.id">
            <td class="px-4 py-2">{{ v.nama }}</td>
            <td class="px-4 py-2">{{ v.alamat }}</td>
            <td class="px-4 py-2">{{ v.email }}</td>
            <td class="px-4 py-2">{{ v.hp }}</td>
            <td class="px-4 py-2 text-right">
              <button class="text-blue-600 mr-2" @click="openEditModal(v.id)">Edit</button>
              <button class="text-red-600" @click="openDeleteModal(v.id, v.nama)">Delete</button>
            </td>
          </tr>
          <tr v-if="paginatedVendors.length === 0">
            <td class="px-4 py-6 text-center text-gray-500" colspan="5">Tidak ada data</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
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
      <div class="bg-white w-full max-w-lg rounded shadow p-4">
        <h2 class="text-lg font-semibold mb-3">Tambah Vendor</h2>
        <form @submit.prevent="submitCreate">
          <div class="grid grid-cols-1 gap-3">
            <input
              v-model="createForm.nama"
              class="border rounded px-3 py-2"
              placeholder="Nama"
              required
            />
            <input
              v-model="createForm.alamat"
              class="border rounded px-3 py-2"
              placeholder="Alamat"
              required
            />
            <input
              v-model="createForm.email"
              type="email"
              class="border rounded px-3 py-2"
              placeholder="Email"
            />
            <input v-model="createForm.hp" class="border rounded px-3 py-2" placeholder="HP" />
            <!-- Optional file upload -->
            <div class="flex items-center gap-3">
              <input type="file" accept="image/*" @change="onCreateFileChange" />
              <div v-if="createPreview" class="text-xs text-gray-600">Preview aktif</div>
            </div>
            <div v-if="createPreview" class="border rounded p-2">
              <img :src="createPreview" alt="Preview gambar" class="max-h-32 object-contain" />
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
      <div class="bg-white w-full max-w-lg rounded shadow p-4">
        <h2 class="text-lg font-semibold mb-3">Edit Vendor</h2>
        <form @submit.prevent="submitEdit">
          <div class="grid grid-cols-1 gap-3">
            <input
              v-model="editForm.nama"
              class="border rounded px-3 py-2"
              placeholder="Nama"
              required
            />
            <input
              v-model="editForm.alamat"
              class="border rounded px-3 py-2"
              placeholder="Alamat"
              required
            />
            <input
              v-model="editForm.email"
              type="email"
              class="border rounded px-3 py-2"
              placeholder="Email"
            />
            <input v-model="editForm.hp" class="border rounded px-3 py-2" placeholder="HP" />
            <!-- Optional file upload for edit -->
            <div class="flex items-center gap-3">
              <input type="file" accept="image/*" @change="onEditFileChange" />
              <div v-if="editPreview" class="text-xs text-gray-600">Preview aktif</div>
            </div>
            <div v-if="editPreview || editForm.gambar" class="border rounded p-2">
              <img
                :src="editPreview || resolvedEditImageUrl"
                alt="Preview gambar"
                class="max-h-32 object-contain"
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
        <h2 class="text-lg font-semibold mb-3">Hapus Vendor</h2>
        <p>Apakah Anda yakin ingin menghapus vendor "{{ deleteTargetName }}"?</p>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import api from '@/user/axios'
import { BASE_URL } from '@/base.utils.url'

const vendors = ref([])
const searchQuery = ref('')
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

const filteredVendors = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return vendors.value
  return vendors.value.filter((v) =>
    [v.nama, v.alamat, v.email, v.hp].some((x) => (x || '').toLowerCase().includes(q)),
  )
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredVendors.value.length / pageSize.value)),
)
const paginatedVendors = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredVendors.value.slice(start, start + pageSize.value)
})

function resetToFirstPage() {
  currentPage.value = 1
}

async function fetchVendors() {
  loading.value = true
  try {
    const res = await axios.get(`${BASE_URL}vendors`)
    vendors.value = Array.isArray(res?.data?.data) ? res.data.data : []
    resetToFirstPage()
  } catch (err) {
    console.error('Failed to fetch vendors:', err)
  } finally {
    loading.value = false
  }
}

// Create
const showCreate = ref(false)
const createForm = ref({ nama: '', alamat: '', email: '', hp: '', gambar: null })
const createFile = ref(null)
const createPreview = ref(null)
function openCreateModal() {
  createForm.value = { nama: '', alamat: '', email: '', hp: '', gambar: null }
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
    fd.append('alamat', createForm.value.alamat)
    fd.append('email', createForm.value.email || '')
    fd.append('hp', createForm.value.hp || '')
    // if file provided, append; else optionally append null (backend should ignore missing)
    if (createFile.value) fd.append('gambar', createFile.value)
    const res = await api.post('vendors', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    console.log('Create vendor response:', res.data)
    if (res?.data?.status) {
      showCreate.value = false
      await fetchVendors()
    }
  } catch (err) {
    console.error('Failed to create vendor:', err)
  } finally {
    loading.value = false
  }
}

// Edit
const showEdit = ref(false)
const editId = ref(null)
const editForm = ref({ nama: '', alamat: '', email: '', hp: '', gambar: null })
const editFile = ref(null)
const editPreview = ref(null)
function openEditModal(id) {
  editId.value = id
  showEdit.value = true
  loadVendorDetail(id)
}
function closeEditModal() {
  showEdit.value = false
  editId.value = null
  editFile.value = null
  editPreview.value = null
}
async function loadVendorDetail(id) {
  loading.value = true
  try {
    const res = await axios.get(`${BASE_URL}vendors/${id}`)
    const d = res?.data?.data || {}
    editForm.value = {
      nama: d.nama || '',
      alamat: d.alamat || '',
      email: d.email || '',
      hp: d.hp || '',
      gambar: d.gambar || null,
    }
  } catch (err) {
    console.error('Failed to load vendor detail:', err)
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
  // if backend returns relative path, you may need to prefix BASE_URL
  const g = editForm.value.gambar
  if (!g) return null
  if (typeof g === 'string' && (g.startsWith('http') || g.startsWith('data:'))) return g
  return `${BASE_URL}${g}`
})
async function submitEdit() {
  console.log('submitEdit called, editId:', editId.value)
  if (!editId.value) return
  loading.value = true
  try {
    const fd = new FormData()
    fd.append('nama', editForm.value.nama)
    fd.append('alamat', editForm.value.alamat)
    fd.append('email', editForm.value.email || '')
    fd.append('hp', editForm.value.hp || '')
    if (editFile.value) {
      console.log('Appending file:', editFile.value.name, editFile.value.size)
      fd.append('gambar', editFile.value)
    } else {
      console.log('No file selected for edit')
    }
    console.log('Sending PUT request to vendors/' + editId.value)
    console.log('FormData entries:')
    for (let pair of fd.entries()) {
      console.log(pair[0], ':', pair[1])
    }
    const res = await api.post(`vendors/${editId.value}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    console.log('Edit vendor response:', res.data)
    if (res?.data?.status) {
      showEdit.value = false
      editId.value = null
      editFile.value = null
      editPreview.value = null
      await fetchVendors()
    }
  } catch (err) {
    console.error('Failed to update vendor:', err)
  } finally {
    loading.value = false
  }
}

// Delete
const showDelete = ref(false)
const deleteTargetId = ref(null)
const deleteTargetName = ref('')
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
    const res = await api.delete(`vendors/${deleteTargetId.value}`)
    if (res?.data?.status) {
      showDelete.value = false
      deleteTargetId.value = null
      deleteTargetName.value = ''
      await fetchVendors()
    }
  } catch (err) {
    console.error('Failed to delete vendor:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchVendors()
})
</script>

<style scoped></style>
