<template>
  <div class="p-6 space-y-6">
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-semibold text-gray-800">Daftar Posisi/Jabatan</h2>
        <p class="text-gray-600 text-sm mt-1">Kelola posisi karyawan</p>
      </div>
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
      >
        <span>➕</span> Tambah Posisi
      </button>
    </div>

    <!-- Filter Section -->
    <div class="bg-white rounded-lg shadow-sm p-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filterStatus"
            @change="loadPositions"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option :value="null">Semua Status</option>
            <option :value="true">Aktif</option>
            <option :value="false">Tidak Aktif</option>
          </select>
        </div>

        <!-- Show Employee Count -->
        <div class="flex items-end">
          <label class="flex items-center">
            <input
              v-model="showEmployeeCount"
              type="checkbox"
              @change="loadPositions"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">Tampilkan jumlah karyawan</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
      <p class="mt-4 text-gray-600">Loading data posisi...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-800">{{ error }}</p>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nama Posisi
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Deskripsi
              </th>
              <th
                v-if="showEmployeeCount"
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Jumlah Karyawan
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="position in positions" :key="position.id" class="hover:bg-gray-50">
              <!-- ID -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{{ position.id }}</td>

              <!-- Name -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ position.name }}</div>
              </td>

              <!-- Description -->
              <td class="px-6 py-4">
                <div class="text-sm text-gray-600 max-w-xs">{{ position.description || '-' }}</div>
              </td>

              <!-- Employee Count -->
              <td v-if="showEmployeeCount" class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-purple-100 text-purple-800"
                >
                  {{ position.pegawai_count || 0 }} orang
                </span>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  :class="
                    position.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  "
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ position.is_active ? 'Aktif' : 'Tidak Aktif' }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <button
                  @click="editPosition(position)"
                  class="text-green-600 hover:text-green-900 mr-3"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  @click="confirmDelete(position)"
                  class="text-red-600 hover:text-red-900"
                  title="Hapus"
                >
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="positions.length === 0" class="text-center py-12">
        <p class="text-gray-500">Tidak ada data posisi</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <!-- Modal Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">
            {{ modalMode === 'create' ? '➕ Tambah Posisi' : '✏️ Edit Posisi' }}
          </h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
        </div>

        <!-- Form -->
        <form @submit.prevent="savePosition" class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"> Nama Posisi * </label>
            <input
              v-model="formData.name"
              type="text"
              required
              placeholder="Contoh: Teknisi AC, Supervisor"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"> Deskripsi </label>
            <textarea
              v-model="formData.description"
              rows="3"
              placeholder="Deskripsi singkat posisi/jabatan"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <!-- Status -->
          <div>
            <label class="flex items-center">
              <input
                v-model="formData.is_active"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">Posisi Aktif</span>
            </label>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 pt-4 border-t">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {{ modalMode === 'create' ? 'Simpan' : 'Update' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TablePositions',
  data() {
    return {
      positions: [],
      loading: false,
      error: null,
      showModal: false,
      modalMode: 'create', // 'create' or 'edit'
      selectedPosition: null,
      filterStatus: null,
      showEmployeeCount: true,
      formData: {
        name: '',
        description: '',
        is_active: true,
      },
    }
  },
  mounted() {
    this.loadPositions()
  },
  methods: {
    async loadPositions() {
      this.loading = true
      this.error = null

      try {
        // Build query params
        const params = new URLSearchParams()
        if (this.filterStatus !== null) params.append('is_active', this.filterStatus)
        if (this.showEmployeeCount) params.append('with_pegawai_count', true)

        // TODO: Replace with actual API call
        // const response = await fetch(`/api/positions?${params.toString()}`);
        // const data = await response.json();
        // this.positions = data.data;

        // Mock data
        this.positions = [
          {
            id: '660e8400-e29b-41d4-a716-446655440001',
            name: 'Teknisi AC',
            description: 'Teknisi pemasangan dan perbaikan AC',
            is_active: true,
            pegawai_count: 5,
            created_at: '2024-01-15T10:00:00.000000Z',
            updated_at: '2024-01-15T10:00:00.000000Z',
          },
          {
            id: '660e8400-e29b-41d4-a716-446655440002',
            name: 'Supervisor',
            description: 'Supervisor lapangan',
            is_active: true,
            pegawai_count: 2,
            created_at: '2024-01-15T10:00:00.000000Z',
            updated_at: '2024-01-15T10:00:00.000000Z',
          },
          {
            id: '660e8400-e29b-41d4-a716-446655440003',
            name: 'Admin',
            description: 'Staff administrasi',
            is_active: true,
            pegawai_count: 3,
            created_at: '2024-01-20T10:00:00.000000Z',
            updated_at: '2024-01-20T10:00:00.000000Z',
          },
          {
            id: '660e8400-e29b-41d4-a716-446655440004',
            name: 'Kasir',
            description: 'Kasir',
            is_active: true,
            pegawai_count: 2,
            created_at: '2024-02-01T10:00:00.000000Z',
            updated_at: '2024-02-01T10:00:00.000000Z',
          },
        ]
      } catch (err) {
        this.error = 'Gagal memuat data posisi. Silakan coba lagi.' + err.message
      } finally {
        this.loading = false
      }
    },
    openCreateModal() {
      this.modalMode = 'create'
      this.formData = {
        name: '',
        description: '',
        is_active: true,
      }
      this.showModal = true
    },
    editPosition(position) {
      this.modalMode = 'edit'
      this.selectedPosition = position
      this.formData = {
        name: position.name,
        description: position.description,
        is_active: position.is_active,
      }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.selectedPosition = null
    },
    async savePosition() {
      try {
        // TODO: Replace with actual API call
        // if (this.modalMode === 'create') {
        //   await fetch('/api/positions', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(this.formData)
        //   });
        // } else {
        //   await fetch(`/api/positions/${this.selectedPosition.id}`, {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(this.formData)
        //   });
        // }

        alert(
          `✅ Posisi berhasil ${this.modalMode === 'create' ? 'ditambahkan' : 'diupdate'}!\n\nNama: ${this.formData.name}`,
        )
        this.closeModal()
        this.loadPositions()
      } catch (err) {
        alert('❌ Gagal menyimpan data posisi') + err.message
      }
    },
    confirmDelete(position) {
      if (confirm(`Yakin ingin menghapus posisi "${position.name}"?`)) {
        this.deletePosition(position.id)
      }
    },
    async deletePosition(id) {
      try {
        // TODO: Replace with actual API call
        // await fetch(`/api/positions/${id}`, { method: 'DELETE' });

        alert('✅ Posisi berhasil dihapus') + id
        this.loadPositions()
      } catch (err) {
        alert('❌ Gagal menghapus posisi') + err.message
      }
    },
  },
}
</script>
