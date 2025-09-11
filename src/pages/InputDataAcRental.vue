<template>
  <div class="p-8 space-y-8 bg-gradient-to-br from-blue-50 via-white to-teal-50 min-h-screen">
    <!-- Form Header -->
    <div class="flex flex-col items-center mb-8">
      <div class="flex items-center gap-3">
        <span class="inline-block bg-blue-100 p-3 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 17v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m16-2a4 4 0 00-4-4h-1a4 4 0 00-4 4v2m6-2a4 4 0 00-4-4h-1a4 4 0 00-4 4v2"
            />
          </svg>
        </span>
        <h2 class="text-4xl font-bold text-blue-700 font-lexend tracking-wide">
          Form Penambahan Unit AC untuk Rental
        </h2>
      </div>
      <div class="w-24 h-1 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full mt-4"></div>
    </div>

    <!-- Form Section -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div
          class="p-8 bg-white rounded-2xl shadow-2xl border border-blue-100 hover:shadow-blue-200 transition-shadow"
        >
          <!-- AC Type Input -->
          <div class="mt-6">
            <label for="tipe_id" class="block text-sm font-medium text-gray-700 mb-2">Tipe</label>
            <select
              v-model="formData.tipe_id"
              id="tipe_id"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            >
              <option value="" disabled>Pilih Tipe</option>
              <option v-for="tipe in tipes" :key="tipe.id" :value="tipe.id">{{ tipe.nama }}</option>
            </select>
          </div>

          <div class="my-8 border-b border-dashed border-blue-100"></div>
          <!-- Brand Input -->
          <div class="mt-6">
            <label for="brand_id" class="block text-sm font-medium text-gray-700 mb-2">Brand</label>
            <select
              v-model="formData.brand_id"
              id="brand_id"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            >
              <option value="" disabled>Pilih Brand</option>
              <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                {{ brand.nama }}
              </option>
            </select>
          </div>

          <div class="my-8 border-b border-dashed border-teal-200"></div>
          <!-- Model Input -->
          <div class="mt-6">
            <label for="model" class="block text-sm font-medium text-gray-700 mb-2">Model</label>
            <input
              v-model="formData.model"
              id="model"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter AC Model"
              required
            />
          </div>
          <div class="mt-6">
            <label for="harga_perolehan" class="block text-sm font-medium text-gray-700 mb-2"
              >Harga Perolehan</label
            >
            <input
              v-model="formData.harga_perolehan"
              id="harga_perolehan"
              type="number"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Harga Awal Beli AC"
              required
            />
          </div>
          <div class="mt-6">
            <label for="harga_sewa" class="block text-sm font-medium text-gray-700 mb-2"
              >Harga Sewa</label
            >
            <input
              v-model="formData.harga_sewa"
              id="harga_sewa"
              type="number"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Harga Sewa"
              required
            />
          </div>
        </div>

        <div
          class="p-8 bg-white rounded-2xl shadow-2xl border border-blue-100 hover:shadow-blue-200 transition-shadow"
        >
          <!-- Lokasi Input -->
          <div class="mt-6">
            <label for="lokasi" class="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
            <input
              v-model="formData.lokasi"
              id="lokasi"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter Lokasi"
              required
            />
          </div>

          <div class="my-8 border-b border-dashed border-teal-200"></div>
          <!-- Engine Number Input -->
          <div class="mt-6">
            <label for="kapasitas" class="block text-sm font-medium text-gray-700 mb-2"
              >Kapasitas / Power</label
            >
            <input
              v-model="formData.kapasitas"
              id="kapasitas"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter Kapasitas / Power (BTU) / PK"
              required
            />
          </div>

          <div class="my-8 border-b border-dashed border-blue-100"></div>
          <!-- Engine Type Input -->
          <div class="mt-6">
            <label for="freon" class="block text-sm font-medium text-gray-700 mb-2"
              >Refrigerant/Freon Type</label
            >
            <select
              v-model="formData.freon"
              id="freon"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            >
              <option value="" disabled>Pilih Refrigerant/Freon Type</option>
              <option value="R22">R22</option>
              <option value="R32">R32</option>
              <option value="R410A">R410A</option>
            </select>
          </div>

          <div class="my-8 border-b border-dashed border-teal-200"></div>
          <!-- Engine Capacity Input -->
          <div class="mt-6">
            <label for="keterangan" class="block text-sm font-medium text-gray-700 mb-2"
              >Keterangan</label
            >
            <input
              v-model="formData.keterangan"
              id="keterangan"
              type="text"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Keterangan tambahan ditulis di sini"
              required
            />
          </div>

          <div class="my-8 border-b border-dashed border-blue-100"></div>
          <!-- Car Photo Upload -->
          <div class="mt-6">
            <label for="file" class="block text-sm font-medium text-gray-700 mb-2"
              >Upload AC Photo</label
            >
            <input
              id="file"
              type="file"
              accept="image/*"
              class="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              @change="handleFileUpload"
            />
          </div>

          <!-- Car Photo Preview -->
          <div v-if="formData.carPhotoPreview" class="mt-6 rounded-lg shadow-xl overflow-hidden">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Car Photo Preview:</h4>
            <img
              :src="formData.carPhotoPreview"
              alt="Car Photo Preview"
              class="w-full h-auto object-cover rounded-md transition-transform transform hover:scale-105"
            />
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center mt-10">
        <button
          type="submit"
          class="px-10 py-4 bg-gradient-to-r from-blue-500 to-teal-400 text-white text-xl font-bold rounded-full shadow-lg hover:scale-105 hover:from-blue-600 hover:to-teal-500 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200"
        >
          <span class="inline-flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Submit
          </span>
        </button>
      </div>
    </form>
    <toast-card v-if="show_toast" :message="message_toast" @close="tutupToast" />
    <loading-overlay />
  </div>
</template>

<script>
import api from '@/user/axios'
import ToastCard from '@/components/ToastCard.vue'
import LoadingOverlay from '../components/LoadingOverlay.vue'
import { useLoadingStore } from '../stores/loading'
import { mapStores } from 'pinia'

export default {
  components: { ToastCard, LoadingOverlay },

  data() {
    return {
      // PAKAI array biasa, JANGAN ref() di Options API
      tipes: [],
      brands: [],
      customers: [],

      show_toast: false,
      message_toast: '',

      formData: {
        customer_id: '',
        tipe_id: '',
        brand_id: '',
        model: '',
        lokasi: '',
        keterangan: '',
        freon: '',
        kapasitas: '',
        file: null,
        carPhotoPreview: '',
        harga_perolehan: 0,
        harga_sewa: 0,
      },
    }
  },

  computed: {
    // Satu instance store yang konsisten sebagai this.loadingStore
    ...mapStores(useLoadingStore),
  },

  created() {
    this.getAllBrands()
    this.getAllTipes()
  },

  methods: {
    async getAllTipes() {
      try {
        const res = await api.get('/customers/tipe')
        this.tipes = Array.isArray(res?.data?.data) ? res.data.data : []
      } catch (e) {
        console.error('Error fetching AC types:', e)
        this.tipes = []
      }
    },

    async getAllBrands() {
      try {
        const res = await api.get('/customers/brand')
        this.brands = Array.isArray(res?.data?.data) ? res.data.data : []
      } catch (e) {
        console.error('Error fetching brands:', e)
        this.brands = []
      }
    },

    handleFileUpload(event) {
      const file = event.target.files?.[0]
      if (!file) return
      if (file.size > 1024 * 1024) {
        alert('Ukuran file maksimal 1 MB!')
        return
      }
      this.formData.file = file
      const reader = new FileReader()
      reader.onloadend = () => {
        this.formData.carPhotoPreview = reader.result
      }
      reader.readAsDataURL(file)
    },

    tutupToast() {
      this.show_toast = false
      this.message_toast = ''
      window.location.reload()
    },

    async handleSubmit() {
      try {
        const payload = new FormData()
        payload.append('customer_id', this.formData.customer_id)
        payload.append('tipe_id', this.formData.tipe_id)
        payload.append('brand_id', this.formData.brand_id)
        payload.append('model', this.formData.model)
        payload.append('lokasi', this.formData.lokasi)
        payload.append('keterangan', this.formData.keterangan)
        payload.append('freon', this.formData.freon)
        payload.append('kapasitas', this.formData.kapasitas)
        payload.append('harga_perolehan', this.formData.harga_perolehan)
        payload.append('harga_sewa', this.formData.harga_sewa)
        if (this.formData.file) payload.append('file', this.formData.file)

        this.loadingStore.show()

        const res = await api.post('/customers/rentalassets/new', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        // --- DEBUG aman untuk pastikan baris ini dieksekusi ---
        console.log('submit success:', res?.data)

        // set pesan dulu, lalu tampilkan toast
        this.message_toast = res?.data?.message || 'Data berhasil disimpan!'
        this.show_toast = true
      } catch (e) {
        console.error('Error submitting form:', e)
      } finally {
        this.loadingStore.hide()
      }
    },
  },
}
</script>

<style scoped>
/* TailwindCSS for form styling */
@media (max-width: 640px) {
  form {
    padding: 20px;
  }
}
</style>
