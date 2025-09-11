<template>
  <div
    class="min-h-screen pb-28 bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center py-8"
  >
    <div class="w-full max-w-4xl mx-auto">
      <div class="flex flex-col items-center mb-8">
        <div class="flex items-center gap-3">
          <span class="inline-block bg-blue-100 p-3 rounded-full shadow-md">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
          <h2 class="text-4xl font-bold text-blue-700 font-lexend tracking-wide drop-shadow">
            Form Registrasi Pelanggan Baru
          </h2>
        </div>
        <div class="w-24 h-1 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full mt-4"></div>
      </div>
      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 flex flex-col gap-6">
          <div>
            <label for="nama" class="block text-base font-semibold text-blue-700 mb-2">Nama</label>
            <input
              v-model="formData.nama"
              id="nama"
              type="text"
              class="w-full px-5 py-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
              placeholder="Masukan Nama Pelanggan"
              required
            />
          </div>
          <div>
            <label for="alamat" class="block text-base font-semibold text-blue-700 mb-2"
              >Alamat</label
            >
            <input
              v-model="formData.alamat"
              id="alamat"
              type="text"
              class="w-full px-5 py-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
              placeholder="Masukan Alamat Pelanggan"
              required
            />
          </div>
          <div>
            <label for="hp" class="block text-base font-semibold text-blue-700 mb-2">No. HP</label>
            <input
              v-model="formData.hp"
              id="hp"
              type="text"
              class="w-full px-5 py-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
              placeholder="Masukan No. HP Pelanggan"
              required
            />
          </div>
          <div>
            <label for="email" class="block text-base font-semibold text-blue-700 mb-2"
              >Email</label
            >
            <input
              v-model="formData.email"
              id="email"
              type="email"
              class="w-full px-5 py-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
              placeholder="Masukan Email Pelanggan"
              required
            />
          </div>
          <div>
            <label for="jenis" class="block text-base font-semibold text-blue-700 mb-2"
              >Jenis Pelanggan</label
            >
            <select
              v-model="formData.jenis"
              id="brand_id"
              class="w-full px-5 py-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
              required
            >
              <option value="" disabled selected>Pilih Jenis Pelanggan</option>
              <option value="Perorangan">Perorangan</option>
              <option value="Perusahaan">Perusahaan</option>
            </select>
          </div>
          <div>
            <label for="photo" class="block text-base font-semibold text-blue-700 mb-2"
              >Upload Photo</label
            >
            <input
              id="photo"
              type="file"
              accept="image/*"
              class="w-full px-5 py-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
              @change="handleFileUpload"
            />
            <div v-if="formData.photoPreview" class="mt-4 rounded-lg shadow overflow-hidden">
              <img
                :src="formData.photoPreview"
                alt="Preview"
                class="w-full h-auto object-cover rounded-md transition-transform hover:scale-105"
              />
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 flex flex-col gap-6">
          <div>
            <label for="brand_id" class="block text-base font-semibold text-blue-700 mb-2"
              >Brand / Merk</label
            >
            <select
              v-model="formData.brand_id"
              id="brand_id"
              class="w-full px-5 py-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
              required
            >
              <option value="" disabled selected>Pilih Brand / Merk</option>
              <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                {{ brand.nama }}
              </option>
            </select>
          </div>
          <div>
            <label for="model" class="block text-base font-semibold text-blue-700 mb-2"
              >Model</label
            >
            <input
              v-model="formData.model"
              id="model"
              type="text"
              class="w-full px-5 py-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
              required
            />
          </div>
          <div>
            <label for="tipe" class="block text-base font-semibold text-blue-700 mb-2">Tipe</label>
            <select
              v-model="formData.tipe_id"
              id="tipe"
              class="w-full px-5 py-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
            >
              <option value="" disabled selected>Pilih Tipe</option>
              <option v-for="tipe in tipes" :key="tipe.id" :value="tipe.id">
                {{ tipe.nama }}
              </option>
            </select>
          </div>
          <div>
            <label for="lokasi" class="block text-base font-semibold text-blue-700 mb-2"
              >Lokasi</label
            >
            <input
              v-model="formData.lokasi"
              id="lokasi"
              type="text"
              class="w-full px-5 py-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
              placeholder="Lokasi AC"
            />
          </div>
          <div>
            <label for="freon" class="block text-base font-semibold text-blue-700 mb-2"
              >Freon</label
            >
            <select
              v-model="formData.freon"
              id="freon"
              class="w-full px-5 py-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
            >
              <option value="" disabled selected>Pilih Tipe</option>
              <option value="R22">R22</option>
              <option value="R32">R32</option>
              <option value="R410A">R410A</option>
            </select>
          </div>
          <div>
            <label for="kapasitas" class="block text-base font-semibold text-blue-700 mb-2"
              >Kapasitas</label
            >
            <input
              v-model="formData.kapasitas"
              id="kapasitas"
              type="text"
              class="w-full px-5 py-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
              placeholder="Kapasitas AC"
            />
          </div>
        </div>
        <div class="col-span-1 md:col-span-2 flex justify-center mt-8">
          <button
            type="submit"
            class="w-full max-w-md px-10 py-4 bg-gradient-to-r from-blue-500 to-teal-400 text-white text-xl font-bold rounded-full shadow-lg hover:scale-105 hover:from-blue-600 hover:to-teal-500 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200"
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
    </div>
    <ToastCard v-if="show_toast" :message="message_toast" @close="tutupToast" />
    <LoadingOverlay />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/user/axios'
import ToastCard from '@/components/ToastCard.vue'
import { useLoadingStore } from '../stores/loading'
import LoadingOverlay from '../components/LoadingOverlay.vue'

const loadingStore = useLoadingStore()

const formData = ref({
  nama: '',
  alamat: '',
  hp: '',
  email: '',
  brand_id: '',
  model: '',
  tipe_id: '',
  lokasi: '',
  freon: '',
  kapasitas: '',
  jenis: '',
  keterangan: '',
  file: null,
  photoPreview: '',
})

const brands = ref([])

const tipes = ref([])
const message_toast = ref('')
const show_toast = ref(false)

async function getAllBrands() {
  try {
    const response = await api.get('/customers/brand')
    brands.value = response.data.data
    console.log('Fetched brands:', brands.value)
  } catch (error) {
    console.error('Error fetching brands:', error)
  }
}

async function getAllTipes() {
  try {
    const response = await api.get('/customers/tipe')
    if (response && response.data && response.data.status === true) {
      tipes.value.splice(0, tipes.value.length, ...response.data.data)
      console.log('Fetched tipes:', tipes.value)
    }
  } catch (error) {
    console.error('Error fetching tipes:', error)
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 1024 * 1024) {
      // 1 MB
      alert('Ukuran file maksimal 1 MB!')
      return
    }
    formData.value.file = file
    const reader = new FileReader()
    reader.onloadend = () => {
      formData.value.photoPreview = reader.result
    }
    reader.readAsDataURL(file)
  }
}

function tutupToast() {
  show_toast.value = false
  message_toast.value = ''
  window.location.reload()
}

async function handleSubmit() {
  const fd = new FormData()
  fd.append('nama', formData.value.nama)
  fd.append('alamat', formData.value.alamat)
  fd.append('hp', formData.value.hp)
  fd.append('email', formData.value.email)
  fd.append('brand_id', formData.value.brand_id)
  fd.append('model', formData.value.model)
  fd.append('tipe_id', formData.value.tipe_id)
  fd.append('lokasi', formData.value.lokasi)
  fd.append('freon', formData.value.freon)
  fd.append('kapasitas', formData.value.kapasitas)
  fd.append('keterangan', formData.value.keterangan)
  fd.append('jenis', formData.value.jenis)
  if (formData.value.file) {
    fd.append('file', formData.value.file)
  }
  loadingStore.show()
  await api
    .post('/customers/new', fd, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
      console.log('Success:', res.data)
      show_toast.value = true
      message_toast.value = res.data.message
    })
    .finally(() => {
      loadingStore.hide()
      // Reset form
    })
    .catch((err) => {
      console.error('Error:', err.response?.data || err)
      show_toast.value = true
      message_toast.value = err.response?.data?.message || 'An error occurred'
      console.log('Form data:', formData.value)
    })
}

onMounted(() => {
  getAllBrands()
  getAllTipes()
})
</script>

<style scoped>
/* Additional Custom Styling */
input,
button {
  transition: all 0.3s ease;
}

button:hover {
  background-color: #2563eb;
}

input:focus,
button:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);
}
</style>
