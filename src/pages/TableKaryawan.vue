<template>
  <div class="p-6 space-y-6">
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-semibold text-gray-800">Daftar Pegawai</h2>
        <p class="text-gray-600 text-sm mt-1">Kelola data pegawai AC Lestari</p>
      </div>
      <div class="flex items-center gap-3">
        <!-- View Toggle -->
        <div class="flex bg-gray-100 rounded-lg p-1">
          <button
            @click="viewMode = 'table'"
            :class="viewMode === 'table' ? 'bg-white shadow-sm' : 'text-gray-600'"
            class="px-3 py-2 rounded-md transition flex items-center gap-2"
            title="Tampilan Table"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            <span class="text-sm font-medium">List</span>
          </button>
          <button
            @click="viewMode = 'card'"
            :class="viewMode === 'card' ? 'bg-white shadow-sm' : 'text-gray-600'"
            class="px-3 py-2 rounded-md transition flex items-center gap-2"
            title="Tampilan Card"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
              />
            </svg>
            <span class="text-sm font-medium">Kanban</span>
          </button>
        </div>

        <button
          @click="openCreateModal"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <span>➕</span> Tambah Pegawai
        </button>
      </div>
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

    <!-- Table View -->
    <div v-else-if="viewMode === 'table'" class="bg-white rounded-lg shadow-sm overflow-hidden">
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
                Tanggal Masuk
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
                  :src="getImageUrl(employee.url_foto)"
                  :alt="employee.nama"
                  class="h-10 w-10 rounded-full object-cover"
                  @error="handleImageError"
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
                <div class="text-sm text-gray-500">{{ employee.email }}</div>
              </td>

              <!-- Hire Date -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ formatDate(employee.hire_date || employee.tanggal_masuk) }}
                </div>
              </td>

              <!-- Department -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ employee.departemen?.nama || '-' }}</div>
              </td>

              <!-- Position -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ employee.position?.name || '-' }}
                </div>
              </td>

              <!-- Group -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ employee.group?.nama || '-' }}</div>
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

      <!-- Empty State for Table -->
      <div v-if="employees.length === 0" class="text-center py-12">
        <p class="text-gray-500">Tidak ada data pegawai</p>
      </div>

      <!-- Pagination for Table -->
      <div
        v-if="pagination.total > 0"
        class="bg-gray-50 px-6 py-4 border-t flex items-center justify-between"
      >
        <div class="text-sm text-gray-700">
          Menampilkan {{ (pagination.current_page - 1) * pagination.per_page + 1 }} -
          {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }} dari
          {{ pagination.total }} pegawai
        </div>
        <div class="flex gap-2">
          <button
            @click="changePage(pagination.current_page - 1)"
            :disabled="pagination.current_page === 1"
            class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <span class="px-3 py-1 text-sm text-gray-700">
            Halaman {{ pagination.current_page }} dari {{ pagination.last_page }}
          </span>
          <button
            @click="changePage(pagination.current_page + 1)"
            :disabled="pagination.current_page >= pagination.last_page"
            class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>
    </div>

    <!-- Card View (Kanban) -->
    <div
      v-else-if="viewMode === 'card'"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <!-- Empty State for Cards -->
      <div v-if="employees.length === 0" class="col-span-full text-center py-12">
        <p class="text-gray-500">Tidak ada data pegawai</p>
      </div>

      <!-- Employee Card -->
      <div
        v-for="employee in employees"
        :key="employee.id"
        class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
      >
        <img
          :src="getImageUrl(employee.url_foto)"
          :alt="employee.nama"
          class="w-full h-48 object-cover"
          @error="handleImageError"
        />

        <div class="p-4">
          <!-- Name -->
          <h3 class="text-lg font-semibold text-gray-800 truncate">{{ employee.nama }}</h3>

          <!-- Department & Position -->
          <p class="text-sm text-gray-600 truncate">
            {{ employee.departemen?.nama || '-' }} - {{ employee.position?.name || '-' }}
          </p>

          <!-- Contact Info -->
          <div class="mt-2 space-y-1">
            <p class="text-xs text-gray-600 truncate"><strong>HP:</strong> {{ employee.hp }}</p>
            <p class="text-xs text-gray-600 truncate">
              <strong>Email:</strong> {{ employee.email }}
            </p>
            <p v-if="employee.group" class="text-xs text-gray-600 truncate">
              <strong>Group:</strong> {{ employee.group.nama }}
            </p>
          </div>

          <!-- Status & Actions -->
          <div class="mt-3 flex items-center justify-between">
            <span
              :class="employee.is_active ? 'bg-green-500' : 'bg-red-500'"
              class="inline-block px-3 py-1 text-white text-xs font-semibold rounded-full"
            >
              {{ employee.is_active ? 'Aktif' : 'Tidak Aktif' }}
            </span>

            <div class="flex gap-2">
              <button
                @click="viewEmployee(employee)"
                class="text-blue-600 hover:text-blue-900"
                title="Lihat Detail"
              >
                👁️
              </button>
              <button
                @click="editEmployee(employee)"
                class="text-green-600 hover:text-green-900"
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
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination for Card View -->
    <div
      v-if="viewMode === 'card' && pagination.total > 0"
      class="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between"
    >
      <div class="text-sm text-gray-700">
        Menampilkan {{ (pagination.current_page - 1) * pagination.per_page + 1 }} -
        {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }} dari
        {{ pagination.total }} pegawai
      </div>
      <div class="flex gap-2">
        <button
          @click="changePage(pagination.current_page - 1)"
          :disabled="pagination.current_page === 1"
          class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Prev
        </button>
        <span class="px-3 py-1 text-sm text-gray-700">
          Halaman {{ pagination.current_page }} dari {{ pagination.last_page }}
        </span>
        <button
          @click="changePage(pagination.current_page + 1)"
          :disabled="pagination.current_page >= pagination.last_page"
          class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
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
                  {{ dept.nama || dept.name }}
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
                  {{ pos.nama || pos.name }}
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
                  {{ group.nama || group.name }}
                </option>
              </select>
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
                accept="image/png,image/jpg,image/jpeg"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">Format: JPG, PNG (Max 2MB)</p>
              <!-- Photo Preview -->
              <div v-if="photoPreview" class="mt-2">
                <img
                  :src="photoPreview"
                  alt="Preview Foto"
                  class="h-24 w-24 object-cover rounded-lg border border-gray-300"
                />
              </div>
            </div>

            <!-- Signature Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tanda Tangan</label>
              <input
                type="file"
                @change="handleSignatureUpload"
                accept="image/png,image/jpg,image/jpeg"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">Format: JPG, PNG (Max 1MB)</p>
              <p class="text-xs text-blue-600 mt-1">
                ℹ️ Akan diupload ke tabel tanda_tangan terlebih dahulu
              </p>
              <!-- Signature Preview -->
              <div v-if="signaturePreview" class="mt-2">
                <p class="text-xs text-gray-600 mb-1">Preview Tanda Tangan Baru:</p>
                <img
                  :src="signaturePreview"
                  alt="Preview Tanda Tangan"
                  class="h-20 border border-gray-300 rounded"
                />
              </div>
              <!-- Show existing signature -->
              <div v-else-if="modalMode === 'edit' && selectedEmployee" class="mt-2">
                <div v-if="selectedEmployee.tanda_tangan || selectedEmployee.tandaTangan">
                  <p class="text-xs text-gray-600 mb-1">Tanda Tangan Saat Ini:</p>
                  <img
                    :src="
                      getImageUrl(
                        selectedEmployee.tanda_tangan?.url_tanda_tangan ||
                          selectedEmployee.tandaTangan?.url_tanda_tangan,
                      )
                    "
                    alt="Tanda Tangan Existing"
                    class="h-20 border border-gray-300 rounded"
                  />
                  <p class="text-xs text-gray-500 mt-1">📝 ID: {{ formData.tanda_tangan_id }}</p>
                </div>
                <p v-else class="text-xs text-gray-500 mt-1">ℹ️ Belum ada tanda tangan</p>
              </div>
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
              :src="getImageUrl(selectedEmployee.url_foto)"
              :alt="selectedEmployee.nama"
              class="h-24 w-24 rounded-full object-cover border-4 border-gray-200"
              @error="handleImageError"
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
                {{ formatDate(selectedEmployee.hire_date || selectedEmployee.tanggal_masuk) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Departemen</p>
              <p class="font-semibold text-gray-900">
                {{ selectedEmployee.departemen?.nama || '-' }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Posisi</p>
              <p class="font-semibold text-gray-900">
                {{ selectedEmployee.position?.name || '-' }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Group</p>
              <p class="font-semibold text-gray-900">{{ selectedEmployee.group?.nama || '-' }}</p>
            </div>
          </div>

          <!-- Alamat -->
          <div>
            <p class="text-sm text-gray-600">Alamat</p>
            <p class="font-semibold text-gray-900">{{ selectedEmployee.alamat }}</p>
          </div>

          <!-- Signature (if exists) -->
          <div v-if="selectedEmployee.tanda_tangan || selectedEmployee.tandaTangan">
            <p class="text-sm text-gray-600 mb-2">Tanda Tangan</p>
            <img
              :src="
                getImageUrl(
                  selectedEmployee.tanda_tangan?.url_tanda_tangan ||
                    selectedEmployee.tandaTangan?.url_tanda_tangan,
                )
              "
              alt="Tanda Tangan"
              class="h-20 border border-gray-300 rounded"
            />
            <p v-if="selectedEmployee.tanda_tangan" class="text-xs text-gray-500 mt-1">
              ID: {{ selectedEmployee.tanda_tangan_id }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { BASE_URL } from '../base.utils.url.ts'

export default {
  name: 'TableKaryawan',
  data() {
    return {
      viewMode: 'table', // 'table' or 'card'
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
      pagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 1,
      },
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
        is_active: true,
        tanda_tangan_id: null,
      },
      photoFile: null,
      signatureFile: null,
      uploadedSignatureId: null,
      signaturePreview: null,
      photoPreview: null,
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
      try {
        const token = localStorage.getItem('token')
        const endpoint = `${BASE_URL}api/departments/summary/count`

        console.group('🔵 DEPARTMENTS API CALL')
        console.log('📤 Request URL:', endpoint)
        console.log('📤 Request Headers:', {
          Authorization: `Bearer ${token?.substring(0, 20)}...`,
        })
        console.log('📤 Request Time:', new Date().toISOString())

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log('📥 Response Status:', response.status)
        console.log('📥 Response Headers:', response.headers)
        console.log('📥 Full Response Data:', JSON.stringify(response.data, null, 2))
        console.log('📥 Response data.status:', response.data.status, typeof response.data.status)
        console.log('📥 Response data.message:', response.data.message)
        console.log(
          '📥 Response data.data type:',
          Array.isArray(response.data.data) ? 'Array' : typeof response.data.data,
        )
        console.log('📥 Response data.data length:', response.data.data?.length)

        if (
          response.data &&
          (response.data.status === 'success' || response.data.status === true)
        ) {
          this.departments = response.data.data || []
          console.log('✅ Departments successfully loaded:', this.departments.length, 'items')
          console.table(this.departments)
        } else {
          console.warn('⚠️ Response status not success:', response.data.status)
        }
        console.groupEnd()
      } catch (error) {
        console.group('❌ DEPARTMENTS API ERROR')
        console.error('Error Type:', error.name)
        console.error('Error Message:', error.message)
        console.error('Error Stack:', error.stack)
        if (error.response) {
          console.error('Response Status:', error.response.status)
          console.error('Response Data:', JSON.stringify(error.response.data, null, 2))
          console.error('Response Headers:', error.response.headers)
        } else if (error.request) {
          console.error('No Response Received. Request:', error.request)
        }
        console.groupEnd()
        // Fallback to empty array if API fails
        this.departments = []
      }
    },
    async loadPositions() {
      try {
        const token = localStorage.getItem('token')
        const endpoint = `${BASE_URL}api/positions`
        const params = { is_active: true }

        console.group('🟢 POSITIONS API CALL')
        console.log('📤 Request URL:', endpoint)
        console.log('📤 Request Params:', params)
        console.log('📤 Request Headers:', {
          Authorization: `Bearer ${token?.substring(0, 20)}...`,
        })
        console.log('📤 Request Time:', new Date().toISOString())

        const response = await axios.get(endpoint, {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log('📥 Response Status:', response.status)
        console.log('📥 Response Headers:', response.headers)
        console.log('📥 Full Response Data:', JSON.stringify(response.data, null, 2))
        console.log('📥 Response data.status:', response.data.status, typeof response.data.status)
        console.log('📥 Response data.message:', response.data.message)
        console.log(
          '📥 Response data.data type:',
          Array.isArray(response.data.data) ? 'Array' : typeof response.data.data,
        )
        console.log('📥 Response data.data length:', response.data.data?.length)

        if (
          response.data &&
          (response.data.status === 'success' || response.data.status === true)
        ) {
          this.positions = response.data.data || []
          console.log('✅ Positions successfully loaded:', this.positions.length, 'items')
          console.table(this.positions)
        } else {
          console.warn('⚠️ Response status not success:', response.data.status)
        }
        console.groupEnd()
      } catch (error) {
        console.group('❌ POSITIONS API ERROR')
        console.error('Error Type:', error.name)
        console.error('Error Message:', error.message)
        console.error('Error Stack:', error.stack)
        if (error.response) {
          console.error('Response Status:', error.response.status)
          console.error('Response Data:', JSON.stringify(error.response.data, null, 2))
          console.error('Response Headers:', error.response.headers)
        } else if (error.request) {
          console.error('No Response Received. Request:', error.request)
        }
        console.groupEnd()
        // Fallback to empty array if API fails
        this.positions = []
      }
    },
    async loadGroups() {
      try {
        const token = localStorage.getItem('token')
        const endpoint = `${BASE_URL}api/groups`
        const params = { is_active: true }

        console.group('🟡 GROUPS API CALL')
        console.log('📤 Request URL:', endpoint)
        console.log('📤 Request Params:', params)
        console.log('📤 Request Headers:', {
          Authorization: `Bearer ${token?.substring(0, 20)}...`,
        })
        console.log('📤 Request Time:', new Date().toISOString())

        const response = await axios.get(endpoint, {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log('📥 Response Status:', response.status)
        console.log('📥 Response Headers:', response.headers)
        console.log('📥 Full Response Data:', JSON.stringify(response.data, null, 2))
        console.log('📥 Response data.status:', response.data.status, typeof response.data.status)
        console.log('📥 Response data.message:', response.data.message)
        console.log(
          '📥 Response data.data type:',
          Array.isArray(response.data.data) ? 'Array' : typeof response.data.data,
        )
        console.log('📥 Response data.data.data (if paginated):', response.data.data?.data)

        if (
          response.data &&
          (response.data.status === 'success' || response.data.status === true)
        ) {
          // API returns paginated data in data.data
          this.groups = response.data.data.data || response.data.data || []
          console.log('✅ Groups successfully loaded:', this.groups.length, 'items')
          console.table(this.groups)
        } else {
          console.warn('⚠️ Response status not success:', response.data.status)
        }
        console.groupEnd()
      } catch (error) {
        console.group('❌ GROUPS API ERROR')
        console.error('Error Type:', error.name)
        console.error('Error Message:', error.message)
        console.error('Error Stack:', error.stack)
        if (error.response) {
          console.error('Response Status:', error.response.status)
          console.error('Response Data:', JSON.stringify(error.response.data, null, 2))
          console.error('Response Headers:', error.response.headers)
        } else if (error.request) {
          console.error('No Response Received. Request:', error.request)
        }
        console.groupEnd()
        // Fallback to empty array if API fails
        this.groups = []
      }
    },
    async loadEmployees(keepPage = false) {
      this.loading = true
      this.error = null

      // Reset to page 1 when filters change (but not when navigating pages)
      if (!keepPage && this.pagination.current_page !== 1) {
        this.pagination.current_page = 1
      }

      try {
        // Build query params
        const params = {
          page: this.pagination.current_page,
          limit: this.pagination.per_page,
        }
        if (this.filters.search) params.search = this.filters.search
        if (this.filters.department_id) params.department_id = this.filters.department_id
        if (this.filters.position_id) params.position_id = this.filters.position_id
        if (this.filters.is_active !== null) params.is_active = this.filters.is_active

        const token = localStorage.getItem('token')
        const response = await axios.get(`${BASE_URL}api/pegawai`, {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log('Employees response:', response.data)
        console.log('Requested page:', params.page)

        // API returns status as boolean (true) not string ('success')
        // Data is paginated: response.data.data.data contains the array
        if (response.data && response.data.status === true) {
          const data = response.data.data
          this.employees = data.data || data

          // Update pagination info
          this.pagination = {
            current_page: data.current_page || 1,
            per_page: data.per_page || 10,
            total: data.total || 0,
            last_page: data.last_page || 1,
          }

          // Debug: Log sample employee data with field name details
          if (this.employees.length > 0) {
            console.group('✅ EMPLOYEES LOADED')
            console.log('Total Employees:', this.employees.length)
            console.log('Pagination:', this.pagination)
            console.log('Sample Employee (first item):', this.employees[0])
            console.log('Field Names Check:', {
              has_position_id: 'position_id' in this.employees[0],
              has_posisi_id: 'posisi_id' in this.employees[0],
              has_hire_date: 'hire_date' in this.employees[0],
              has_tanggal_masuk: 'tanggal_masuk' in this.employees[0],
              position_value: this.employees[0].position_id || this.employees[0].posisi_id,
              hire_date_value: this.employees[0].hire_date || this.employees[0].tanggal_masuk,
            })
            console.groupEnd()
          }
        }
      } catch (err) {
        console.error('Error loading employees:', err)
        this.error = 'Gagal memuat data pegawai. ' + (err.response?.data?.message || err.message)
        this.employees = []
      } finally {
        this.loading = false
      }
    },
    changePage(page) {
      if (page < 1 || page > this.pagination.last_page) return
      this.pagination.current_page = page
      this.loadEmployees(true) // Pass true to keep the current page
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
        is_active: true,
        tanda_tangan_id: null,
      }
      this.photoFile = null
      this.signatureFile = null
      this.uploadedSignatureId = null
      this.signaturePreview = null
      this.photoPreview = null
      this.showModal = true
    },
    editEmployee(employee) {
      this.modalMode = 'edit'
      this.selectedEmployee = employee

      // Format hire_date to YYYY-MM-DD for date input
      let formattedHireDate = ''
      const hireDate = employee.hire_date || employee.tanggal_masuk
      if (hireDate) {
        try {
          const date = new Date(hireDate)
          if (!isNaN(date.getTime())) {
            formattedHireDate = date.toISOString().split('T')[0]
          }
        } catch (e) {
          console.error('Error formatting hire date:', e)
          formattedHireDate = new Date().toISOString().split('T')[0]
        }
      } else {
        formattedHireDate = new Date().toISOString().split('T')[0]
      }

      this.formData = {
        nama: employee.nama,
        alamat: employee.alamat,
        hp: employee.hp,
        departemen_id: employee.departemen_id,
        posisi_id: employee.posisi_id || employee.position_id,
        group_id: employee.group_id,
        email: employee.email,
        tanggal_masuk: formattedHireDate,
        is_active: employee.is_active,
        tanda_tangan_id: employee.tanda_tangan_id || null,
      }
      this.photoFile = null
      this.signatureFile = null
      this.uploadedSignatureId = null
      this.signaturePreview = null
      this.photoPreview = employee.url_foto ? this.getImageUrl(employee.url_foto) : null

      console.log('📝 Edit Employee Data:', {
        original_hire_date: employee.hire_date || employee.tanggal_masuk,
        formatted_hire_date: formattedHireDate,
        employee_id: employee.id,
        nama: employee.nama,
      })

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
        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
          console.error('❌ Ukuran foto terlalu besar. Maksimal 2MB')
          console.error('File size:', file.size, 'bytes')
          console.error('File name:', file.name)
          event.target.value = ''
          return
        }

        this.photoFile = file

        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
          this.photoPreview = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    handleSignatureUpload(event) {
      const file = event.target.files[0]
      if (file) {
        // Validate file size (max 1MB)
        if (file.size > 1 * 1024 * 1024) {
          console.error('❌ Ukuran tanda tangan terlalu besar. Maksimal 1MB')
          console.error('File size:', file.size, 'bytes')
          console.error('File name:', file.name)
          event.target.value = ''
          return
        }

        this.signatureFile = file

        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
          this.signaturePreview = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    async saveEmployee() {
      try {
        const token = localStorage.getItem('token')

        // Step 1: Upload signature if new signature file is provided
        if (this.signatureFile) {
          console.group('📝 UPLOAD SIGNATURE')
          console.log('Signature file:', this.signatureFile.name, this.signatureFile.size, 'bytes')

          const signatureFormData = new FormData()
          signatureFormData.append('tanda_tangan', this.signatureFile)

          const signatureResponse = await axios.post(
            `${BASE_URL}api/tanda-tangan`,
            signatureFormData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
              },
            },
          )

          console.log('Signature Response Status:', signatureResponse.status)
          console.log('Signature Response Data:', JSON.stringify(signatureResponse.data, null, 2))

          if (signatureResponse.data && signatureResponse.data.status === true) {
            this.uploadedSignatureId = signatureResponse.data.data.id
            console.log('✅ Signature uploaded successfully with ID:', this.uploadedSignatureId)
          }
          console.groupEnd()
        }

        // Step 2: Create/Update employee with multipart/form-data
        const formData = new FormData()

        // Add all form fields - Use English field names as primary (backend standard)
        formData.append('nama', this.formData.nama)
        formData.append('alamat', this.formData.alamat)
        formData.append('hp', this.formData.hp)
        formData.append('email', this.formData.email)
        formData.append('hire_date', this.formData.tanggal_masuk)
        formData.append('is_active', this.formData.is_active ? '1' : '0')

        if (this.formData.departemen_id) {
          formData.append('department_id', this.formData.departemen_id)
        }
        if (this.formData.posisi_id) {
          formData.append('position_id', this.formData.posisi_id)
        }
        if (this.formData.group_id) {
          formData.append('group_id', this.formData.group_id)
        }

        // Add signature ID if uploaded
        if (this.uploadedSignatureId) {
          formData.append('tanda_tangan_id', this.uploadedSignatureId)
        } else if (this.formData.tanda_tangan_id) {
          formData.append('tanda_tangan_id', this.formData.tanda_tangan_id)
        }

        // Add photo file if provided
        if (this.photoFile) {
          formData.append('url_foto', this.photoFile)
        }

        let response
        const endpoint =
          this.modalMode === 'create'
            ? `${BASE_URL}api/pegawai`
            : `${BASE_URL}api/pegawai/${this.selectedEmployee.id}`

        console.group(`💾 SAVE EMPLOYEE REQUEST - ${this.modalMode.toUpperCase()}`)
        console.log('Mode:', this.modalMode === 'create' ? '➕ CREATE NEW' : '✏️ UPDATE EXISTING')
        if (this.modalMode === 'edit') {
          console.log('Employee ID:', this.selectedEmployee.id)
          console.log('Existing Employee Data:', {
            nama: this.selectedEmployee.nama,
            email: this.selectedEmployee.email,
            departemen_id: this.selectedEmployee.departemen_id,
            posisi_id: this.selectedEmployee.posisi_id || this.selectedEmployee.position_id,
            hire_date: this.selectedEmployee.hire_date,
            tanggal_masuk: this.selectedEmployee.tanggal_masuk,
          })
        }
        console.log('Endpoint:', endpoint)
        console.log('Method:', 'POST')
        console.log('📤 Payload (English field names - Backend Standard):', {
          nama: this.formData.nama,
          email: this.formData.email,
          hp: this.formData.hp,
          alamat: this.formData.alamat,
          department_id: this.formData.departemen_id,
          position_id: this.formData.posisi_id,
          group_id: this.formData.group_id,
          hire_date: this.formData.tanggal_masuk,
          is_active: this.formData.is_active,
          tanda_tangan_id: this.uploadedSignatureId || this.formData.tanda_tangan_id,
          has_photo: !!this.photoFile,
        })
        console.log('⚠️ Using: position_id (not posisi_id), department_id, hire_date')
        console.groupEnd()

        if (this.modalMode === 'create') {
          response = await axios.post(endpoint, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          })
        } else {
          // Use POST for file upload with existing employee
          response = await axios.post(endpoint, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          })
        }

        if (response.data && response.data.status === true) {
          console.group(
            `✅ SAVE EMPLOYEE SUCCESS - ${this.modalMode === 'create' ? 'CREATE' : 'UPDATE'}`,
          )
          console.log(
            'Operation:',
            this.modalMode === 'create' ? 'CREATE NEW EMPLOYEE' : 'UPDATE EMPLOYEE',
          )
          console.log('Employee Data:', {
            nama: this.formData.nama,
            email: this.formData.email,
            hp: this.formData.hp,
            departemen_id: this.formData.departemen_id,
            posisi_id: this.formData.posisi_id,
            group_id: this.formData.group_id,
          })
          console.log('Full Response:', JSON.stringify(response.data, null, 2))
          console.log('Response Status:', response.status)
          console.log('Response Data:', response.data)
          console.groupEnd()
          this.closeModal()
          this.loadEmployees()
        }
      } catch (err) {
        console.group('❌ SAVE EMPLOYEE ERROR')
        console.error('Error Type:', err.name)
        console.error('Error Message:', err.message)
        console.error('Form Data Submitted:', {
          nama: this.formData.nama,
          email: this.formData.email,
          hp: this.formData.hp,
          departemen_id: this.formData.departemen_id,
          posisi_id: this.formData.posisi_id,
          group_id: this.formData.group_id,
        })
        if (err.response) {
          console.error('Response Status:', err.response.status)
          console.error('Response Data:', JSON.stringify(err.response.data, null, 2))
          console.error('Response Headers:', err.response.headers)
        } else if (err.request) {
          console.error('No Response Received')
          console.error('Request:', err.request)
        }
        console.error('Full Error:', err)
        console.groupEnd()
      }
    },
    confirmDelete(employee) {
      if (confirm(`Yakin ingin menghapus pegawai "${employee.nama}"?`)) {
        this.deleteEmployee(employee.id)
      }
    },
    async deleteEmployee(id) {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.delete(`${BASE_URL}api/pegawai/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data && response.data.status === true) {
          console.group('✅ DELETE EMPLOYEE SUCCESS')
          console.log('Deleted Employee ID:', id)
          console.log('Response:', JSON.stringify(response.data, null, 2))
          console.log('Response Status:', response.status)
          console.groupEnd()
          this.loadEmployees()
        }
      } catch (err) {
        console.group('❌ DELETE EMPLOYEE ERROR')
        console.error('Error Type:', err.name)
        console.error('Error Message:', err.message)
        console.error('Employee ID:', id)
        if (err.response) {
          console.error('Response Status:', err.response.status)
          console.error('Response Data:', JSON.stringify(err.response.data, null, 2))
          console.error('Response Headers:', err.response.headers)
        }
        console.error('Full Error:', err)
        console.groupEnd()
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
    getImageUrl(path) {
      if (!path) return '/default-avatar.png'
      // If path already includes http/https, return as is
      if (path.startsWith('http://') || path.startsWith('https://')) {
        return path
      }
      // Prepend BASE_URL for relative paths
      return `${BASE_URL}${path}`
    },
    handleImageError(event) {
      // Fallback to default avatar if image fails to load
      event.target.src = '/default-avatar.png'
    },
  },
}
</script>
