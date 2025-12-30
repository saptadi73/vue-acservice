<template>
  <div class="p-6 space-y-6">
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-semibold text-gray-800">Daftar Grup Pegawai</h2>
        <p class="text-gray-600 text-sm mt-1">Kelola grup/kelompok pegawai</p>
      </div>
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
      >
        <span>➕</span> Tambah Grup
      </button>
    </div>

    <!-- Filter Section -->
    <div class="bg-white rounded-lg shadow-sm p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Cari</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Nama grup..."
            @input="loadGroups"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Pagination Limit -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Items per halaman</label>
          <select
            v-model="pagination.limit"
            @change="loadGroups"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
      <p class="mt-4 text-gray-600">Loading data grup...</p>
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
                Nama Grup
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Deskripsi
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
            <tr v-for="group in groups" :key="group.id" class="hover:bg-gray-50">
              <!-- Name -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ group.name }}</div>
              </td>

              <!-- Description -->
              <td class="px-6 py-4">
                <div class="text-sm text-gray-600 max-w-md">{{ group.description || '-' }}</div>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  :class="
                    group.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  "
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ group.is_active ? 'Aktif' : 'Tidak Aktif' }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <button
                  @click="editGroup(group)"
                  class="text-green-600 hover:text-green-900 mr-3"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  @click="confirmDelete(group)"
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
      <div v-if="groups.length === 0" class="text-center py-12">
        <p class="text-gray-500">Tidak ada data grup</p>
      </div>

      <!-- Pagination -->
      <div
        v-if="pagination.total > 0"
        class="bg-gray-50 px-6 py-4 border-t flex items-center justify-between"
      >
        <div class="text-sm text-gray-700">
          Menampilkan {{ (pagination.current_page - 1) * pagination.per_page + 1 }} -
          {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }} dari
          {{ pagination.total }} data
        </div>
        <div class="flex gap-2">
          <button
            @click="changePage(pagination.current_page - 1)"
            :disabled="pagination.current_page === 1"
            class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <button
            @click="changePage(pagination.current_page + 1)"
            :disabled="pagination.current_page * pagination.per_page >= pagination.total"
            class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
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
            {{ modalMode === 'create' ? '➕ Tambah Grup' : '✏️ Edit Grup' }}
          </h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
        </div>

        <!-- Form -->
        <form @submit.prevent="saveGroup" class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"> Nama Grup * </label>
            <input
              v-model="formData.name"
              type="text"
              required
              placeholder="Contoh: Group A, Tim Service"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"> Deskripsi </label>
            <textarea
              v-model="formData.description"
              rows="3"
              placeholder="Deskripsi singkat grup"
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
              <span class="ml-2 text-sm text-gray-700">Grup Aktif</span>
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
  name: 'TableGroups',
  data() {
    return {
      groups: [],
      loading: false,
      error: null,
      showModal: false,
      modalMode: 'create',
      selectedGroup: null,
      searchQuery: '',
      pagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
        limit: 10,
      },
      formData: {
        name: '',
        description: '',
        is_active: true,
      },
    }
  },
  mounted() {
    this.loadGroups()
  },
  methods: {
    async loadGroups() {
      this.loading = true
      this.error = null

      try {
        // Build query params
        const params = new URLSearchParams()
        params.append('page', this.pagination.current_page)
        params.append('limit', this.pagination.limit)
        if (this.searchQuery) params.append('search', this.searchQuery)

        // TODO: Replace with actual API call
        // const response = await fetch(`/api/groups?${params.toString()}`);
        // const data = await response.json();
        // this.groups = data.data.data;
        // this.pagination = data.data.pagination;

        // Mock data
        this.groups = [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Group A',
            description: 'Group untuk tim AC',
            is_active: true,
            created_at: '2025-12-30T10:00:00Z',
            updated_at: '2025-12-30T10:00:00Z',
          },
          {
            id: '660e8400-e29b-41d4-a716-446655440001',
            name: 'Group B',
            description: 'Group untuk tim service',
            is_active: true,
            created_at: '2025-12-30T10:15:00Z',
            updated_at: '2025-12-30T10:15:00Z',
          },
        ]
        this.pagination.total = 2
        this.pagination.per_page = this.pagination.limit
      } catch (err) {
        this.error = 'Gagal memuat data grup. Silakan coba lagi.'
      } finally {
        this.loading = false
      }
    },
    changePage(page) {
      this.pagination.current_page = page
      this.loadGroups()
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
    editGroup(group) {
      this.modalMode = 'edit'
      this.selectedGroup = group
      this.formData = {
        name: group.name,
        description: group.description,
        is_active: group.is_active,
      }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.selectedGroup = null
    },
    async saveGroup() {
      try {
        // TODO: Replace with actual API call
        // if (this.modalMode === 'create') {
        //   await fetch('/api/groups', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(this.formData)
        //   });
        // } else {
        //   await fetch(`/api/groups/${this.selectedGroup.id}`, {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(this.formData)
        //   });
        // }

        alert(
          `✅ Grup berhasil ${this.modalMode === 'create' ? 'ditambahkan' : 'diupdate'}!\n\nNama: ${this.formData.name}`,
        )
        this.closeModal()
        this.loadGroups()
      } catch (err) {
        alert('❌ Gagal menyimpan data grup')
      }
    },
    confirmDelete(group) {
      if (confirm(`Yakin ingin menghapus grup "${group.name}"?`)) {
        this.deleteGroup(group.id)
      }
    },
    async deleteGroup(id) {
      try {
        // TODO: Replace with actual API call
        // await fetch(`/api/groups/${id}`, { method: 'DELETE' });

        alert('✅ Grup berhasil dihapus')
        this.loadGroups()
      } catch (err) {
        alert('❌ Gagal menghapus grup')
      }
    },
  },
}
</script>
