<template>
  <div class="p-6 space-y-6">
    <!-- Toast Notification -->
    <div v-if="notification.show" class="fixed top-4 right-4 z-50">
      <div
        :class="{
          'bg-green-50 border-l-4 border-green-500': notification.type === 'success',
          'bg-red-50 border-l-4 border-red-500': notification.type === 'error',
          'bg-blue-50 border-l-4 border-blue-500': notification.type === 'info',
        }"
        class="p-4 rounded shadow-lg max-w-md"
      >
        <p
          :class="{
            'text-green-800': notification.type === 'success',
            'text-red-800': notification.type === 'error',
            'text-blue-800': notification.type === 'info',
          }"
        >
          {{ notification.message }}
        </p>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold text-gray-800">Daftar Jasa</h1>
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition disabled:opacity-50"
        @click="openCreateModal"
        :disabled="loading"
      >
        <span v-if="!loading">+ Tambah Jasa</span>
        <span v-else>Loading...</span>
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
      <button
        class="bg-gray-100 border px-3 py-2 rounded hover:bg-gray-200 transition"
        @click="fetchServices"
        :disabled="loading"
      >
        Refresh
      </button>
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
            <td class="px-4 py-3 text-right space-x-2">
              <button
                class="text-blue-600 hover:text-blue-800 hover:underline transition disabled:opacity-50"
                @click="openEditModal(svc)"
                :disabled="loading"
              >
                Edit
              </button>
              <button
                class="text-red-600 hover:text-red-800 hover:underline transition disabled:opacity-50"
                @click="openDeleteModal(svc)"
                :disabled="loading"
              >
                Hapus
              </button>
            </td>
          </tr>
          <tr v-if="paginatedServices.length === 0">
            <td class="px-4 py-6 text-center text-gray-500" colspan="4">Tidak ada data</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between">
      <div class="text-sm text-gray-600">
        Halaman {{ currentPage }} dari {{ totalPages }} (Total: {{ filteredServices.length }}
        data)
      </div>
      <div class="flex items-center gap-2">
        <button
          class="px-3 py-2 border rounded hover:bg-gray-100 transition disabled:opacity-50"
          :disabled="currentPage === 1 || totalPages === 0"
          @click="currentPage--"
        >
          ← Prev
        </button>
        <select
          v-model.number="pageSize"
          class="border rounded px-2 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
        <button
          class="px-3 py-2 border rounded hover:bg-gray-100 transition disabled:opacity-50"
          :disabled="currentPage === totalPages || totalPages === 0"
          @click="currentPage++"
        >
          Next →
        </button>
      </div>
    </div>

    <!-- Modal Create -->
    <div
      v-if="showCreate"
      class="fixed inset-0 bg-black/30 flex items-center justify-center z-30 p-4"
    >
      <div class="bg-white w-full max-w-lg rounded shadow p-6 max-h-[90vh] overflow-y-auto">
        <h2 class="text-lg font-semibold mb-4">Tambah Jasa Baru</h2>
        <form @submit.prevent="submitCreate">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Jasa *</label>
              <input
                v-model="createForm.nama"
                type="text"
                placeholder="Contoh: Install AC Split 1PK"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p v-if="errors.createNama" class="text-red-600 text-xs mt-1">
                {{ errors.createNama }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Harga (Rp) *</label>
              <input
                v-model.number="createForm.harga"
                type="number"
                min="0"
                placeholder="Contoh: 450000"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p v-if="errors.createHarga" class="text-red-600 text-xs mt-1">
                {{ errors.createHarga }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea
                v-model="createForm.deskripsi"
                rows="3"
                placeholder="Opsional: Jelaskan detail layanan"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button
              type="button"
              class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
              @click="closeCreateModal"
              :disabled="loading"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
              :disabled="loading"
            >
              {{ loading ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Edit -->
    <div
      v-if="showEdit"
      class="fixed inset-0 bg-black/30 flex items-center justify-center z-30 p-4"
    >
      <div class="bg-white w-full max-w-lg rounded shadow p-6 max-h-[90vh] overflow-y-auto">
        <h2 class="text-lg font-semibold mb-4">Edit Jasa</h2>
        <form @submit.prevent="submitEdit">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Jasa</label>
              <input
                v-model="editForm.nama"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p v-if="errors.editNama" class="text-red-600 text-xs mt-1">{{ errors.editNama }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
              <input
                v-model.number="editForm.harga"
                type="number"
                min="0"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p v-if="errors.editHarga" class="text-red-600 text-xs mt-1">
                {{ errors.editHarga }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea
                v-model="editForm.deskripsi"
                rows="3"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button
              type="button"
              class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
              @click="closeEditModal"
              :disabled="loading"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
              :disabled="loading"
            >
              {{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Delete -->
    <div
      v-if="showDelete"
      class="fixed inset-0 bg-black/30 flex items-center justify-center z-30 p-4"
    >
      <div class="bg-white w-full max-w-md rounded shadow p-6">
        <h2 class="text-lg font-semibold mb-3 text-red-600">Hapus Jasa</h2>
        <p class="text-gray-700 mb-4">
          Apakah Anda yakin ingin menghapus jasa <strong>"{{ deleteTarget?.nama }}"</strong>?
          Tindakan ini tidak dapat dibatalkan.
        </p>
        <div class="flex justify-end gap-2">
          <button
            class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
            @click="closeDeleteModal"
            :disabled="loading"
          >
            Batal
          </button>
          <button
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
            :disabled="loading"
            @click="confirmDelete"
          >
            {{ loading ? 'Menghapus...' : 'Hapus' }}
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

const notification = ref({ show: false, message: '', type: 'success' })
const errors = ref({
  createNama: '',
  createHarga: '',
  editNama: '',
  editHarga: '',
})

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

function showNotification(message, type = 'success') {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
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

function validateCreateForm() {
  errors.value = { createNama: '', createHarga: '' }
  let isValid = true

  if (!createForm.value.nama || createForm.value.nama.trim().length === 0) {
    errors.value.createNama = 'Nama jasa tidak boleh kosong'
    isValid = false
  }

  if (createForm.value.nama && createForm.value.nama.length > 191) {
    errors.value.createNama = 'Nama jasa maksimal 191 karakter'
    isValid = false
  }

  if (createForm.value.harga === null || createForm.value.harga === undefined) {
    errors.value.createHarga = 'Harga harus diisi'
    isValid = false
  } else if (createForm.value.harga < 0) {
    errors.value.createHarga = 'Harga tidak boleh negatif'
    isValid = false
  }

  return isValid
}

function validateEditForm() {
  errors.value = { editNama: '', editHarga: '' }
  let isValid = true

  if (editForm.value.nama && editForm.value.nama.length > 191) {
    errors.value.editNama = 'Nama jasa maksimal 191 karakter'
    isValid = false
  }

  if (
    editForm.value.harga !== null &&
    editForm.value.harga !== undefined &&
    editForm.value.harga < 0
  ) {
    errors.value.editHarga = 'Harga tidak boleh negatif'
    isValid = false
  }

  return isValid
}

async function fetchServices() {
  loading.value = true
  try {
    const res = await axios.get(`${BASE_URL}services`)
    services.value = Array.isArray(res?.data?.data) ? res.data.data : []
    resetToFirstPage()
  } catch (err) {
    console.error('Failed to fetch services:', err)
    showNotification('Gagal mengambil data jasa', 'error')
  } finally {
    loading.value = false
  }
}

function openCreateModal() {
  createForm.value = { nama: '', harga: 0, deskripsi: '' }
  errors.value = { createNama: '', createHarga: '' }
  showCreate.value = true
}

function closeCreateModal() {
  showCreate.value = false
  errors.value = { createNama: '', createHarga: '' }
}

async function submitCreate() {
  if (!validateCreateForm()) return

  loading.value = true
  try {
    const payload = {
      nama: createForm.value.nama.trim(),
      harga: Number(createForm.value.harga),
      deskripsi: createForm.value.deskripsi?.trim() || undefined,
    }
    const res = await api.post('services', payload)
    if (res?.data?.status) {
      showNotification('Jasa berhasil ditambahkan', 'success')
      showCreate.value = false
      await fetchServices()
    } else {
      const errorMsg = res?.data?.errors || 'Gagal menambahkan jasa'
      showNotification(errorMsg, 'error')
    }
  } catch (err) {
    console.error('Failed to create service:', err)
    const errorMsg = err?.response?.data?.errors || 'Gagal menambahkan jasa'
    showNotification(errorMsg, 'error')
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
  errors.value = { editNama: '', editHarga: '' }
  showEdit.value = true
}

function closeEditModal() {
  showEdit.value = false
  editForm.value = { id: null, nama: '', harga: null, deskripsi: '' }
  errors.value = { editNama: '', editHarga: '' }
}

async function submitEdit() {
  if (!editForm.value.id) return

  if (!validateEditForm()) return

  loading.value = true
  try {
    const payload = {}
    if (editForm.value.nama) payload.nama = editForm.value.nama.trim()
    if (editForm.value.harga !== null && editForm.value.harga !== undefined)
      payload.harga = Number(editForm.value.harga)
    if (editForm.value.deskripsi) payload.deskripsi = editForm.value.deskripsi.trim()

    const res = await api.post(`services/update/${editForm.value.id}`, payload)
    if (res?.data?.status) {
      showNotification('Jasa berhasil diperbarui', 'success')
      showEdit.value = false
      await fetchServices()
    } else {
      const errorMsg = res?.data?.errors || 'Gagal memperbarui jasa'
      showNotification(errorMsg, 'error')
    }
  } catch (err) {
    console.error('Failed to update service:', err)
    const errorMsg = err?.response?.data?.errors || 'Gagal memperbarui jasa'
    showNotification(errorMsg, 'error')
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
      showNotification('Jasa berhasil dihapus', 'success')
      showDelete.value = false
      deleteTarget.value = null
      await fetchServices()
    } else {
      const errorMsg = res?.data?.errors || 'Gagal menghapus jasa'
      showNotification(errorMsg, 'error')
    }
  } catch (err) {
    console.error('Failed to delete service:', err)
    const errorMsg = err?.response?.data?.errors || 'Gagal menghapus jasa'
    showNotification(errorMsg, 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchServices()
})
</script>

<style scoped></style>
