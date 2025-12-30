<template>
  <div class="p-6 space-y-6">
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-semibold text-gray-800">Daftar Pegawai</h2>
        <p class="text-gray-600 text-sm mt-1">Kelola data pegawai AC Lestari</p>
      </div>
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
      >
        <span>➕</span> Tambah Pegawai
      </button>
    </div>

    <!-- Filter Section -->
    <div class="bg-white rounded-lg shadow-sm p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Cari</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Nama atau email..."
            @input="loadEmployees"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Department Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Departemen</label>
          <select
            v-model="filters.department_id"
            @change="loadEmployees"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option :value="null">Semua Departemen</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>

        <!-- Position Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Posisi</label>
          <select
            v-model="filters.position_id"
            @change="loadEmployees"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option :value="null">Semua Posisi</option>
            <option v-for="pos in positions" :key="pos.id" :value="pos.id">
              {{ pos.name }}
            </option>
          </select>
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filters.is_active"
            @change="loadEmployees"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option :value="null">Semua Status</option>
            <option :value="true">Aktif</option>
            <option :value="false">Tidak Aktif</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
      <p class="mt-4 text-gray-600">Loading data pegawai...</p>
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
                Foto
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nama
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kontak
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Departemen
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Posisi
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Group
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
            <tr v-for="employee in employees" :key="employee.id" class="hover:bg-gray-50">
              <!-- Photo -->
              <td class="px-6 py-4 whitespace-nowrap">
                <img
                  :src="employee.url_foto || '/default-avatar.png'"
                  :alt="employee.nama"
                  class="h-10 w-10 rounded-full object-cover"
                />
              </td>

              <!-- Name -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ employee.nama }}</div>
                <div class="text-sm text-gray-500">{{ employee.email }}</div>
              </td>

              <!-- Contact -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ employee.hp }}</div>
                <div class="text-sm text-gray-500">{{ formatDate(employee.tanggal_masuk) }}</div>
              </td>

              <!-- Department -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ employee.departemen?.name || '-' }}</div>
              </td>

              <!-- Position -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ employee.posisi?.name || '-' }}</div>
              </td>

              <!-- Group -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ employee.group?.name || '-' }}</div>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  :class="
                    employee.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  "
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ employee.is_active ? 'Aktif' : 'Tidak Aktif' }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <button
                  @click="viewEmployee(employee)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                  title="Lihat Detail"
                >
                  👁️
                </button>
                <button
                  @click="editEmployee(employee)"
                  class="text-green-600 hover:text-green-900 mr-3"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  @click="confirmDelete(employee)"
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
      <div v-if="employees.length === 0" class="text-center py-12">
        <p class="text-gray-500">Tidak ada data pegawai</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">
            {{ modalMode === 'create' ? '➕ Tambah Pegawai Baru' : '✏️ Edit Pegawai' }}
          </h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
        </div>

        <!-- Form -->
        <form @submit.prevent="saveEmployee" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Nama -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap *</label>
              <input
                v-model="formData.nama"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                v-model="formData.email"
                type="email"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- HP -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">No. HP *</label>
              <input
                v-model="formData.hp"
                type="text"
                required
                placeholder="08XXXXXXXXXX"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Tanggal Masuk -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Masuk *</label>
              <input
                v-model="formData.tanggal_masuk"
                type="date"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Departemen -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Departemen *</label>
              <select
                v-model="formData.departemen_id"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Departemen</option>
                <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                  {{ dept.name }}
                </option>
              </select>
            </div>

            <!-- Posisi -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Posisi *</label>
              <select
                v-model="formData.posisi_id"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Posisi</option>
                <option v-for="pos in positions" :key="pos.id" :value="pos.id">
                  {{ pos.name }}
                </option>
              </select>
            </div>

            <!-- Group -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Group</label>
              <select
                v-model="formData.group_id"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tidak ada Group</option>
                <option v-for="group in groups" :key="group.id" :value="group.id">
                  {{ group.name }}
                </option>
              </select>
            </div>

            <!-- Gaji -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Gaji</label>
              <input
                v-model="formData.gaji"
                type="number"
                step="0.01"
                placeholder="0.00"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Alamat (Full Width) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap *</label>
            <textarea
              v-model="formData.alamat"
              rows="3"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Photo Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Foto Pegawai</label>
              <input
                type="file"
                @change="handlePhotoUpload"
                accept="image/*"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">Format: JPG, PNG (Max 2MB)</p>
            </div>

            <!-- Signature Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tanda Tangan</label>
              <input
                type="file"
                @change="handleSignatureUpload"
                accept="image/*"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">Format: JPG, PNG (Max 1MB)</p>
            </div>
          </div>

          <!-- Status -->
          <div>
            <label class="flex items-center">
              <input
                v-model="formData.is_active"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">Pegawai Aktif</span>
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

    <!-- Detail Modal -->
    <div
      v-if="showDetailModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
        <!-- Modal Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Detail Pegawai</h2>
          <button
            @click="showDetailModal = false"
            class="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div v-if="selectedEmployee" class="space-y-6">
          <!-- Profile Section -->
          <div class="flex items-center gap-6">
            <img
              :src="selectedEmployee.url_foto || '/default-avatar.png'"
              :alt="selectedEmployee.nama"
              class="h-24 w-24 rounded-full object-cover border-4 border-gray-200"
            />
            <div>
              <h3 class="text-2xl font-bold text-gray-900">{{ selectedEmployee.nama }}</h3>
              <p class="text-gray-600">{{ selectedEmployee.email }}</p>
              <span
                :class="
                  selectedEmployee.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                "
                class="mt-2 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ selectedEmployee.is_active ? 'Aktif' : 'Tidak Aktif' }}
              </span>
            </div>
          </div>

          <!-- Details Grid -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">No. HP</p>
              <p class="font-semibold text-gray-900">{{ selectedEmployee.hp }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Tanggal Masuk</p>
              <p class="font-semibold text-gray-900">
                {{ formatDate(selectedEmployee.tanggal_masuk) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Departemen</p>
              <p class="font-semibold text-gray-900">
                {{ selectedEmployee.departemen?.name || '-' }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Posisi</p>
              <p class="font-semibold text-gray-900">{{ selectedEmployee.posisi?.name || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Group</p>
              <p class="font-semibold text-gray-900">{{ selectedEmployee.group?.name || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Gaji</p>
              <p class="font-semibold text-gray-900">{{ formatCurrency(selectedEmployee.gaji) }}</p>
            </div>
          </div>

          <!-- Alamat -->
          <div>
            <p class="text-sm text-gray-600">Alamat</p>
            <p class="font-semibold text-gray-900">{{ selectedEmployee.alamat }}</p>
          </div>

          <!-- Signature (if exists) -->
          <div v-if="selectedEmployee.tandaTangan">
            <p class="text-sm text-gray-600 mb-2">Tanda Tangan</p>
            <img
              :src="selectedEmployee.tandaTangan"
              alt="Tanda Tangan"
              class="h-20 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableKaryawan',
  data() {
    return {
      employees: [],
      departments: [],
      positions: [],
      groups: [],
      loading: false,
      error: null,
      showModal: false,
      showDetailModal: false,
      modalMode: 'create', // 'create' or 'edit'
      selectedEmployee: null,
      filters: {
        search: '',
        department_id: null,
        position_id: null,
        is_active: null,
      },
      formData: {
        nama: '',
        alamat: '',
        hp: '',
        departemen_id: null,
        posisi_id: null,
        group_id: null,
        email: '',
        tanggal_masuk: new Date().toISOString().split('T')[0],
        gaji: '',
        is_active: true,
        url_foto: null,
        tanda_tangan: null,
      },
    }
  },
  mounted() {
    this.loadDepartments()
    this.loadPositions()
    this.loadGroups()
    this.loadEmployees()
  },
  methods: {
    async loadDepartments() {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/departments?is_active=true');
      // const data = await response.json();
      // this.departments = data.data;

      // Mock data with UUID
      this.departments = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Technical',
          description: 'Departemen teknis lapangan',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          name: 'Administration',
          description: 'Departemen administrasi',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          name: 'Finance',
          description: 'Departemen keuangan',
        },
      ]
    },
    async loadPositions() {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/positions?is_active=true');
      // const data = await response.json();
      // this.positions = data.data;

      // Mock data with UUID
      this.positions = [
        {
          id: '660e8400-e29b-41d4-a716-446655440001',
          name: 'Teknisi AC',
          description: 'Teknisi pemasangan dan perbaikan AC',
        },
        {
          id: '660e8400-e29b-41d4-a716-446655440002',
          name: 'Supervisor',
          description: 'Supervisor lapangan',
        },
        {
          id: '660e8400-e29b-41d4-a716-446655440003',
          name: 'Admin',
          description: 'Staff administrasi',
        },
        {
          id: '660e8400-e29b-41d4-a716-446655440004',
          name: 'Kasir',
          description: 'Kasir',
        },
      ]
    },
    async loadGroups() {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/groups?is_active=true');
      // const data = await response.json();
      // this.groups = data.data.data;

      // Mock data
      this.groups = [
        {
          id: '770e8400-e29b-41d4-a716-446655440001',
          name: 'Group A',
          description: 'Group untuk tim AC',
        },
        {
          id: '770e8400-e29b-41d4-a716-446655440002',
          name: 'Group B',
          description: 'Group untuk tim service',
        },
      ]
    },
    async loadEmployees() {
      this.loading = true
      this.error = null

      try {
        // Build query params
        const params = new URLSearchParams()
        if (this.filters.search) params.append('search', this.filters.search)
        if (this.filters.department_id) params.append('department_id', this.filters.department_id)
        if (this.filters.position_id) params.append('position_id', this.filters.position_id)
        if (this.filters.is_active !== null) params.append('is_active', this.filters.is_active)

        // TODO: Replace with actual API call
        const response = await fetch(`/api/pegawai?${params.toString()}`)
        const data = await response.json()
        this.employees = data.data

        // Mock data with Indonesian field names and UUID
        this.employees = [
          {
            id: '880e8400-e29b-41d4-a716-446655440001',
            nama: 'Ahmad Budi',
            alamat: 'Jl. Raya No. 15, Jakarta',
            hp: '08123456789',
            departemen_id: '550e8400-e29b-41d4-a716-446655440001',
            posisi_id: '660e8400-e29b-41d4-a716-446655440001',
            group_id: '770e8400-e29b-41d4-a716-446655440001',
            email: 'ahmad.budi@bengkel.com',
            url_foto: null,
            tanggal_masuk: '2024-01-01',
            gaji: 5000000,
            is_active: true,
            departemen: { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Technical' },
            posisi: { id: '660e8400-e29b-41d4-a716-446655440001', name: 'Teknisi AC' },
            group: { id: '770e8400-e29b-41d4-a716-446655440001', name: 'Group A' },
            tandaTangan: null,
          },
          {
            id: '880e8400-e29b-41d4-a716-446655440002',
            nama: 'Siti Aisyah',
            alamat: 'Jl. Merdeka No. 8, Bandung',
            hp: '08234567890',
            departemen_id: '550e8400-e29b-41d4-a716-446655440002',
            posisi_id: '660e8400-e29b-41d4-a716-446655440003',
            group_id: null,
            email: 'siti.aisyah@bengkel.com',
            url_foto: null,
            tanggal_masuk: '2024-02-15',
            gaji: 4000000,
            is_active: true,
            departemen: { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Administration' },
            posisi: { id: '660e8400-e29b-41d4-a716-446655440003', name: 'Admin' },
            group: null,
            tandaTangan: null,
          },
          {
            id: '880e8400-e29b-41d4-a716-446655440003',
            nama: 'Joko Santoso',
            alamat: 'Jl. Diponegoro No. 12, Surabaya',
            hp: '08345678901',
            departemen_id: '550e8400-e29b-41d4-a716-446655440001',
            posisi_id: '660e8400-e29b-41d4-a716-446655440001',
            group_id: '770e8400-e29b-41d4-a716-446655440001',
            email: 'joko.santoso@bengkel.com',
            url_foto: null,
            tanggal_masuk: '2023-11-20',
            gaji: 5500000,
            is_active: true,
            departemen: { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Technical' },
            posisi: { id: '660e8400-e29b-41d4-a716-446655440001', name: 'Teknisi AC' },
            group: { id: '770e8400-e29b-41d4-a716-446655440001', name: 'Group A' },
            tandaTangan: null,
          },
        ]
      } catch (err) {
        this.error = 'Gagal memuat data pegawai. Silakan coba lagi.' + err.message
      } finally {
        this.loading = false
      }
    },
    openCreateModal() {
      this.modalMode = 'create'
      this.formData = {
        nama: '',
        alamat: '',
        hp: '',
        departemen_id: null,
        posisi_id: null,
        group_id: null,
        email: '',
        tanggal_masuk: new Date().toISOString().split('T')[0],
        gaji: '',
        is_active: true,
        url_foto: null,
        tanda_tangan: null,
      }
      this.showModal = true
    },
    editEmployee(employee) {
      this.modalMode = 'edit'
      this.selectedEmployee = employee
      this.formData = {
        nama: employee.nama,
        alamat: employee.alamat,
        hp: employee.hp,
        departemen_id: employee.departemen_id,
        posisi_id: employee.posisi_id,
        group_id: employee.group_id,
        email: employee.email,
        tanggal_masuk: employee.tanggal_masuk,
        gaji: employee.gaji,
        is_active: employee.is_active,
        url_foto: null,
        tanda_tangan: null,
      }
      this.showModal = true
    },
    viewEmployee(employee) {
      this.selectedEmployee = employee
      this.showDetailModal = true
    },
    closeModal() {
      this.showModal = false
      this.selectedEmployee = null
    },
    handlePhotoUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.formData.url_foto = file
      }
    },
    handleSignatureUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.formData.tanda_tangan = file
      }
    },
    async saveEmployee() {
      try {
        // TODO: Replace with actual API call using multipart/form-data
        const formData = new FormData()
        Object.keys(this.formData).forEach((key) => {
          if (this.formData[key] !== null) {
            formData.append(key, this.formData[key])
          }
        })

        if (this.modalMode === 'create') {
          await fetch('/api/pegawai', {
            method: 'POST',
            body: formData,
          })
        } else {
          await fetch(`/api/pegawai/${this.selectedEmployee.id}`, {
            method: 'PUT',
            body: formData,
          })
        }

        alert(
          `✅ Pegawai berhasil ${this.modalMode === 'create' ? 'ditambahkan' : 'diupdate'}!\n\nNama: ${this.formData.nama}\nEmail: ${this.formData.email}\nHP: ${this.formData.hp}`,
        )
        this.closeModal()
        this.loadEmployees()
      } catch (err) {
        alert('❌ Gagal menyimpan data pegawai') + err.message
      }
    },
    confirmDelete(employee) {
      if (confirm(`Yakin ingin menghapus pegawai "${employee.nama}"?`)) {
        this.deleteEmployee(employee.id)
      }
    },
    async deleteEmployee(id) {
      try {
        // TODO: Replace with actual API call
        // await fetch(`/api/pegawai/${id}`, { method: 'DELETE' });

        alert('✅ Pegawai berhasil dihapus') + id
        this.loadEmployees()
      } catch (err) {
        alert('❌ Gagal menghapus pegawai') + err.message
      }
    },
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    },
    formatCurrency(value) {
      if (!value) return 'Rp 0'
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(value)
    },
  },
}
</script>
