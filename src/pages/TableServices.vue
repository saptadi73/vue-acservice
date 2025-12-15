<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold text-gray-800">Daftar Jasa</h1>
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
        @click="openCreateModal"
      >
        Tambah Jasa
      </button>
    </div>

    <div class="flex items-center gap-2">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari nama/deskripsi..."
        class="block w-full max-w-lg px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        @input="resetToFirstPage"
      />
      <button class="bg-gray-100 border px-3 py-2 rounded" @click="fetchServices">Refresh</button>
    </div>

    <div class="overflow-x-auto bg-white rounded shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Nama Jasa
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Harga
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Deskripsi
            </th>
            <th
              class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="svc in paginatedServices" :key="svc.id">
            <td class="px-4 py-3 font-semibold text-gray-800">{{ svc.nama }}</td>
            <td class="px-4 py-3 text-gray-800">{{ formatCurrency(svc.harga) }}</td>
            <td class="px-4 py-3 text-gray-600">{{ svc.deskripsi || '-' }}</td>
            <td class="px-4 py-3 text-right">
              <button class="text-blue-600 mr-3" @click="openEditModal(svc)">Edit</button>
              <button class="text-red-600" @click="openDeleteModal(svc)">Delete</button>
            </td>
          </tr>
          <tr v-if="paginatedServices.length === 0">
            <td class="px-4 py-6 text-center text-gray-500" colspan="4">Tidak ada data</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between">
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

    <!-- Modal Create -->
    <div v-if="showCreate" class="fixed inset-0 bg-black/30 flex items-center justify-center z-30">
      <div class="bg-white w-full max-w-lg rounded shadow p-4">
        <h2 class="text-lg font-semibold mb-3">Tambah Jasa</h2>
        <form @submit.prevent="submitCreate">
          <div class="space-y-3">
            <div>
              <label class="text-sm text-gray-700">Nama</label>
              <input v-model="createForm.nama" class="border rounded w-full px-3 py-2" required />
            </div>
            <div>
              <label class="text-sm text-gray-700">Harga</label>
              <input
                v-model.number="createForm.harga"
                type="number"
                min="0"
                class="border rounded w-full px-3 py-2"
                required
              />
            </div>
            <div>
              <label class="text-sm text-gray-700">Deskripsi</label>
              <textarea
                v-model="createForm.deskripsi"
                rows="3"
                class="border rounded w-full px-3 py-2"
                placeholder="Opsional"
              ></textarea>
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

    <!-- Modal Edit -->
    <div v-if="showEdit" class="fixed inset-0 bg-black/30 flex items-center justify-center z-30">
      <div class="bg-white w-full max-w-lg rounded shadow p-4">
        <h2 class="text-lg font-semibold mb-3">Edit Jasa</h2>
        <form @submit.prevent="submitEdit">
          <div class="space-y-3">
            <div>
              <label class="text-sm text-gray-700">Nama</label>
              <input v-model="editForm.nama" class="border rounded w-full px-3 py-2" required />
            </div>
            <div>
              <label class="text-sm text-gray-700">Harga</label>
              <input
                v-model.number="editForm.harga"
                type="number"
                min="0"
                class="border rounded w-full px-3 py-2"
              />
            </div>
            <div>
              <label class="text-sm text-gray-700">Deskripsi</label>
              <textarea
                v-model="editForm.deskripsi"
                rows="3"
                class="border rounded w-full px-3 py-2"
                placeholder="Opsional"
              ></textarea>
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

    <!-- Modal Delete -->
    <div v-if="showDelete" class="fixed inset-0 bg-black/30 flex items-center justify-center z-30">
      <div class="bg-white w-full max-w-md rounded shadow p-4">
        <h2 class="text-lg font-semibold mb-3">Hapus Jasa</h2>
        <p>Apakah Anda yakin ingin menghapus jasa "{{ deleteTarget?.nama }}"?</p>
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

const services = ref([])
const searchQuery = ref('')
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

const showCreate = ref(false)
const showEdit = ref(false)
const showDelete = ref(false)

const deleteTarget = ref(null)

const createForm = ref({ nama: '', harga: 0, deskripsi: '' })
const editForm = ref({ id: null, nama: '', harga: null, deskripsi: '' })

const filteredServices = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return services.value
  return services.value.filter((s) => {
    return [s.nama, s.deskripsi].filter(Boolean).some((val) => val.toLowerCase().includes(q))
  })
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredServices.value.length / pageSize.value)),
)
const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredServices.value.slice(start, start + pageSize.value)
})

function resetToFirstPage() {
  currentPage.value = 1
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

async function fetchServices() {
  loading.value = true
  try {
    const res = await axios.get(`${BASE_URL}services`)
    services.value = Array.isArray(res?.data?.data) ? res.data.data : []
    resetToFirstPage()
  } catch (err) {
    console.error('Failed to fetch services:', err)
  } finally {
    loading.value = false
  }
}

function openCreateModal() {
  createForm.value = { nama: '', harga: 0, deskripsi: '' }
  showCreate.value = true
}
function closeCreateModal() {
  showCreate.value = false
}
async function submitCreate() {
  loading.value = true
  try {
    const payload = {
      nama: createForm.value.nama,
      harga: Number(createForm.value.harga),
      deskripsi: createForm.value.deskripsi || undefined,
    }
    const res = await api.post('services', payload)
    if (res?.data?.status) {
      showCreate.value = false
      await fetchServices()
    }
  } catch (err) {
    console.error('Failed to create service:', err)
  } finally {
    loading.value = false
  }
}

function openEditModal(service) {
  editForm.value = {
    id: service.id,
    nama: service.nama || '',
    harga: service.harga ?? null,
    deskripsi: service.deskripsi || '',
  }
  showEdit.value = true
}
function closeEditModal() {
  showEdit.value = false
  editForm.value = { id: null, nama: '', harga: null, deskripsi: '' }
}
async function submitEdit() {
  if (!editForm.value.id) return
  loading.value = true
  try {
    const payload = {}
    if (editForm.value.nama) payload.nama = editForm.value.nama
    if (editForm.value.harga !== null && editForm.value.harga !== undefined)
      payload.harga = Number(editForm.value.harga)
    if (editForm.value.deskripsi) payload.deskripsi = editForm.value.deskripsi

    const res = await api.post(`services/update/${editForm.value.id}`, payload)
    if (res?.data?.status) {
      showEdit.value = false
      await fetchServices()
    }
  } catch (err) {
    console.error('Failed to update service:', err)
  } finally {
    loading.value = false
  }
}

function openDeleteModal(service) {
  deleteTarget.value = service
  showDelete.value = true
}
function closeDeleteModal() {
  showDelete.value = false
  deleteTarget.value = null
}
async function confirmDelete() {
  if (!deleteTarget.value?.id) return
  loading.value = true
  try {
    const res = await api.post(`services/delete/${deleteTarget.value.id}`)
    if (res?.data?.status) {
      showDelete.value = false
      deleteTarget.value = null
      await fetchServices()
    }
  } catch (err) {
    console.error('Failed to delete service:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchServices()
})
</script>

<style scoped></style>
