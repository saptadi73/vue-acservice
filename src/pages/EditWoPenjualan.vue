<template>
  <div>
    <div id="workorder-print-area" class="w-[80vw] mx-auto mb-20">
      <!-- Judul dan logo -->
      <div class="flex justify-between items-center my-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">WO Penjualan AC Lestari</h1>
          <p class="text-gray-600">No. Telp. 0859 4321 3369</p>
        </div>
        <div>
          <img
            src="../assets/images/ac_lestari_black.png"
            alt="Logo"
            class="h-25 w-25 object-contain"
          />
        </div>
      </div>

      <hr class="border-t border-gray-300 mb-6" />

      <!-- Konten utama -->
      <div class="grid grid-cols-1 ipad:grid-cols-2 gap-2 bg-white p-6 rounded-lg shadow-md">
        <div class="font-Poppins font-semibold space-y-2">
          <table>
            <tbody>
              <tr>
                <td class="pr-4 font-medium text-gray-700">Hari Tanggal</td>
                <td class="font-semibold text-gray-900">: 15 Oktober 2023</td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">Type Pelanggan</td>
                <td class="font-semibold text-gray-900">: {{ jenis_pelanggan }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Data pelanggan -->
        <div class="ipad:justify-self-end">
          <table>
            <tbody>
              <tr>
                <td class="pr-4 font-medium text-gray-700">No. WO</td>
                <td class="font-semibold text-gray-900">: WO-001</td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">Kode Pelanggan</td>
                <td class="font-semibold text-gray-900">: {{ kode_pelanggan }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <hr class="border-t border-gray-300 my-6" />
      <!-- Detail layanan -->
      <div class="grid grid-cols-1 ipad:grid-cols-2 gap-4">
        <div>
          <table>
            <tbody>
              <tr>
                <td class="pr-4 font-medium text-gray-700">Nama Pelanggan</td>
                <td class="font-semibold text-gray-900">: {{ nama_pelanggan }}</td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">Alamat</td>
                <td class="font-semibold text-gray-900">: {{ alamat }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="ipad:justify-self-end">
          <table>
            <tbody>
              <tr>
                <td class="pr-4 font-medium text-gray-700">No. HP</td>
                <td class="font-semibold text-gray-900">: {{ no_hp }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <hr class="border-t border-gray-300 my-6" />

      <div class="bg-slate-200 p-1 rounded-lg shadow-md">
        <h2 class="text-center font-montserrat font-semibold text-slate-600">
          Spesifikasi Unit AC
        </h2>
      </div>

      <div class="grid grid-cols-1 ipad:grid-cols-2 gap-4 mt-2 p-2 w-full">
        <div>
          <table>
            <tbody>
              <tr>
                <td class="pr-4 font-medium text-gray-700">Brand</td>
                <td class="font-semibold text-gray-900">: {{ brand }}</td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">Model</td>
                <td class="font-semibold text-gray-900">: {{ model }}</td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">Freon</td>
                <td class="font-semibold text-gray-900">: {{ freon }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="ipad:justify-self-end">
          <table>
            <tbody>
              <tr>
                <td class="pr-4 font-medium text-gray-700">Tipe</td>
                <td class="font-semibold text-gray-900">: {{ tipe }}</td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">Kapasitas</td>
                <td class="font-semibold text-gray-900">: {{ kapasitas }}</td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">Lokasi</td>
                <td class="font-semibold text-gray-900">: {{ lokasi }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <hr class="border-t border-gray-300 my-6" />

      <div class="bg-slate-200 p-1 rounded-lg shadow-md">
        <h2 class="text-center font-montserrat font-semibold text-slate-600">Pengecekan Teknisi</h2>
      </div>

      <!-- Pengecekan Teknisi: -->
      <div class="grid grid-cols-1 ipad:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-lg border border-blue-100 p-6 w-full mt-2">
          <h3
            class="font-Poppins font-semibold mb-2 text-center bg-slate-200 rounded-md text-slate-500"
          >
            Unit AC dan Assesories
          </h3>
          <table>
            <tbody>
              <tr>
                <td class="pr-4 font-medium text-gray-700">1. Unit Indoor</td>
                <td class="font-semibold text-gray-900">
                  <input type="checkbox" id="checkIndoor" v-model="formData.check_indoor" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_indoor"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganIndoor"
                    type="text"
                    v-model="formData.keterangan_indoor"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">2. Unit Outdoor</td>
                <td class="font-semibold text-gray-900">
                  <input type="checkbox" id="checkOutdoor" v-model="formData.check_outdoor" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_outdoor"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganOutdoor"
                    type="text"
                    v-model="formData.keterangan_outdoor"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">3. Pipa AC</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkPipa" type="checkbox" v-model="formData.check_pipa" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_pipa"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganPipa"
                    type="text"
                    v-model="formData.keterangan_pipa"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">4. Selang Buangan</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkSelang" type="checkbox" v-model="formData.check_selang" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_selang"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganSelang"
                    type="text"
                    v-model="formData.keterangan_selang"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">5. Kabel dan Asesori</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkKabel" type="checkbox" v-model="formData.check_kabel" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_kabel"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganKabel"
                    type="text"
                    v-model="formData.keterangan_kabel"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Card Kedua -->
        <div
          class="ipad:justify-self-end bg-white rounded-xl shadow-lg border border-blue-100 p-6 w-full mt-2"
        >
          <h3
            class="font-Poppins font-semibold mb-2 text-center bg-slate-200 rounded-md text-slate-500"
          >
            Pemasangan
          </h3>
          <table class="w-full">
            <tbody>
              <tr>
                <td class="pr-4 font-medium text-gray-700">1. Instalasi Indoor</td>
                <td class="font-semibold text-gray-900">
                  <input
                    type="checkbox"
                    id="checkInstIndoor"
                    v-model="formData.check_inst_indoor"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_inst_indoor"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganInstIndoor"
                    type="text"
                    v-model="formData.keterangan_inst_indoor"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">2. Instalasi Outdoor</td>
                <td class="font-semibold text-gray-900">
                  <input
                    type="checkbox"
                    id="checkInstOutdoor"
                    v-model="formData.check_inst_outdoor"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_inst_outdoor"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganInstOutdoor"
                    type="text"
                    v-model="formData.keterangan_inst_outdoor"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">3. Instalasi Listrik</td>
                <td class="font-semibold text-gray-900">
                  <input
                    id="checkInstListrik"
                    type="checkbox"
                    v-model="formData.check_inst_listrik"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_inst_listrik"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganInstListrik"
                    type="text"
                    v-model="formData.keterangan_inst_listrik"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">4. Instalasi Pipa</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkInstPipa" type="checkbox" v-model="formData.check_inst_pipa" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_inst_pipa"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganInstPipa"
                    type="text"
                    v-model="formData.keterangan_inst_pipa"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">5. Instalasi Buangan</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkBuangan" type="checkbox" v-model="formData.check_buangan" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_buangan"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganBuangan"
                    type="text"
                    v-model="formData.keterangan_buangan"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">6. Vaccum</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkVaccum" type="checkbox" v-model="formData.check_vaccum" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_vaccum"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganVaccum"
                    type="text"
                    v-model="formData.keterangan_vaccum"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">7. Tekanan Freon</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkFreon" type="checkbox" v-model="formData.check_freon" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_freon"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganFreon"
                    type="text"
                    v-model="formData.keterangan_freon"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">8. Arus (Ampere)</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkArus" type="checkbox" v-model="formData.check_arus" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_arus"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganArus"
                    type="text"
                    v-model="formData.keterangan_arus"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">9. Temperatur Evaporator</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkEva" type="checkbox" v-model="formData.check_eva" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_eva"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganEva"
                    type="text"
                    v-model="formData.keterangan_eva"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">10. Temperatur Kondensor</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkKondensor" type="checkbox" v-model="formData.check_kondensor" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_kondensor"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganKondensor"
                    type="text"
                    v-model="formData.keterangan_kondensor"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Informasi Tambahan dan Hasil Pekerjaan: -->
      <div class="bg-slate-200 p-1 rounded-lg shadow-md mt-5">
        <h2 class="text-center font-montserrat font-semibold text-slate-600">
          Informasi Tambahan dan Hasil
        </h2>
      </div>
      <div class="mt-2 p-2 w-full rounded-lg shadow-md bg-white">
        <input
          type="text"
          v-model="formData.hasil_pekerjaan"
          id="hasil_pekerjaan"
          class="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Informasi Tambahan dan Hasil Pekerjaan"
        />
      </div>

      <!-- Tanda Tangan Teknisi & Pelanggan -->
      <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
        <!-- Teknisi -->
        <div class="bg-gradient-to-r from-blue-100 via-white to-teal-100 p-1 rounded-xl shadow-lg">
          <div
            class="bg-white/80 backdrop-blur-md border-2 border-transparent bg-clip-padding rounded-2xl shadow-xl p-6 flex flex-col items-center"
          >
            <h3 class="font-bold text-blue-700 text-lg mb-6 tracking-wide">Tanda Tangan Teknisi</h3>
            <label class="w-full flex flex-col items-center cursor-pointer mb-2">
              <span class="text-xs text-blue-500 mb-1">Upload Tanda Tangan</span>
              <input type="file" accept="image/*" class="hidden" @change="onTeknisiSignChange" />
              <div
                class="w-full h-24 flex items-center justify-center border-b-2 border-blue-200 bg-blue-50 rounded-md overflow-hidden"
              >
                <img
                  v-if="teknisiSignUrl"
                  :src="teknisiSignUrl"
                  alt="Tanda Tangan Teknisi"
                  class="max-h-24 object-contain"
                />
                <span v-else class="text-gray-400 text-xs">Belum ada tanda tangan</span>
              </div>
            </label>
            <div class="w-full text-center mt-2 text-blue-700 font-semibold">
              (
              <select
                id="teknisiSelect"
                v-model="formData.teknisi_id"
                class="bg-transparent text-blue-700 font-semibold"
              >
                <option value="" disabled selected class="text-sm">Pilih Teknisi</option>
                <option v-for="tech in teknisi" :key="tech.id" :value="tech.id" class="text-sm">
                  {{ tech.nama }}
                </option></select
              >)
            </div>
          </div>
        </div>
        <!-- Pelanggan -->
        <div class="bg-gradient-to-r from-blue-100 via-white to-teal-100 p-1 rounded-xl shadow-lg">
          <div
            class="bg-white/80 backdrop-blur-md border-2 border-transparent bg-clip-padding rounded-2xl shadow-xl p-6 flex flex-col items-center"
          >
            <h3 class="font-bold text-blue-700 text-lg mb-6 tracking-wide">
              Tanda Tangan Pelanggan
            </h3>
            <label class="w-full flex flex-col items-center cursor-pointer mb-2">
              <span class="text-xs text-blue-500 mb-1">Upload Tanda Tangan</span>
              <input type="file" accept="image/*" class="hidden" @change="onPelangganSignChange" />
              <div
                class="w-full h-24 flex items-center justify-center border-b-2 border-blue-200 bg-blue-50 rounded-md overflow-hidden"
              >
                <img
                  v-if="pelangganSignUrl"
                  :src="pelangganSignUrl"
                  alt="Tanda Tangan Pelanggan"
                  class="max-h-24 object-contain"
                />
                <span v-else class="text-gray-400 text-xs">Belum ada tanda tangan</span>
              </div>
            </label>
            <div class="w-full text-center mt-2 text-blue-700 font-semibold">
              ( {{ nama_pelanggan }} )
            </div>
          </div>
        </div>
      </div>
    </div>
    <loading-overlay />
    <toast-card v-if="show_toast" :message="message_toast" @close="tutupToast" />
    <button
      class="bg-slate-600 font-montserrat text-center cursor-pointer text-white font-bold w-full p-2 rounded-md"
      @click="createWorkOrder"
    >
      simpan perubahan
    </button>
    <button
      class="bg-green-600 mt-3 font-montserrat text-center cursor-pointer text-white font-bold w-full p-2 rounded-md"
      @click="createPelangganSignLink"
    >
      Buat Link untuk Pelanggan
    </button>
  </div>
</template>

<script setup>
// Import yang diperlukan
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { BASE_URL } from '@/base.utils.url'
import api from '@/user/axios'
import { useLoadingStore } from '../stores/loading'
import LoadingOverlay from '../components/LoadingOverlay.vue'
import ToastCard from '@/components/ToastCard.vue'

const loadingStore = useLoadingStore()

const show_toast = ref(false)
const message_toast = ref('')

function tutupToast() {
  show_toast.value = false
  message_toast.value = ''
  window.location.reload()
}

// Routing dan data utama
const route = useRoute()
const customerAssetId = route.params.id
const nama_pelanggan = ref('')
const alamat = ref('')
const no_hp = ref('')
const brand = ref('')
const model = ref('')
const tipe = ref('')
const kapasitas = ref('')
const freon = ref('')
const lokasi = ref('')
const kode_pelanggan = ref('')
const jenis_pelanggan = ref('')
const teknisi = ref([])

const formData = ref({
  customer_asset_id: '',
  teknisi_id: null,
  check_indoor: false,
  keterangan_indoor: '',
  check_outdoor: false,
  keterangan_outdoor: '',
  check_pipa: false,
  keterangan_pipa: '',
  check_selang: false,
  keterangan_selang: '',
  check_kabel: false,
  keterangan_kabel: '',
  check_inst_indoor: false,
  keterangan_inst_indoor: '',
  check_inst_outdoor: false,
  keterangan_inst_outdoor: '',
  check_inst_listrik: false,
  keterangan_inst_listrik: '',
  check_inst_pipa: false,
  keterangan_inst_pipa: '',
  check_buangan: false,
  keterangan_buangan: '',
  check_vaccum: false,
  keterangan_vaccum: '',
  check_freon: false,
  keterangan_freon: '',
  check_arus: false,
  keterangan_arus: '',
  check_eva: false,
  keterangan_eva: '',
  check_kondensor: false,
  keterangan_kondensor: '',
  hasil_pekerjaan: '',
})

async function createWorkOrder() {
  // loadingStore.show()
  try {
    const response = await api.post(`wo/penjualan/update/${customerAssetId}`, formData.value)
    console.log('Work order created:', response.data.data)
    console.log('Form Data Submitted:', formData.value)
    message_toast.value = response.data.message || 'Work order berhasil dibuat.'
    show_toast.value = true
  } catch (error) {
    console.error('Error creating work order:', error)
    message_toast.value = 'Gagal membuat work order. Silakan coba lagi.'
    show_toast.value = true
  } finally {
    loadingStore.hide()
  }
}

async function createPelangganSignLink() {
  loadingStore.show()
  try {
    const response = await api.post(`wo/penjualan/sign/${customerAssetId}`)
    console.log('Link Created:', response.data.data)
    show_toast.value = true
    message_toast.value = response.data.message || 'Link created successfully.'
    // Optionally reset form or provide user feedback here
  } catch (error) {
    console.error('Error creating link:', error)
    show_toast.value = true
    message_toast.value = error.message || 'Failed to create link.'
  } finally {
    loadingStore.hide()
  }
}

// Ambil data work order
async function getForNewWorkOrder(id) {
  loadingStore.show()
  try {
    const response = await axios.get(`${BASE_URL}wo/penjualan/${id}`)
    console.log('Work order data:', response.data.data)
    nama_pelanggan.value = response.data.data.customer_asset.customer.nama
    alamat.value = response.data.data.customer_asset.customer.alamat
    no_hp.value = response.data.data.customer_asset.customer.hp
    brand.value = response.data.data.customer_asset.brand.nama
    model.value = response.data.data.customer_asset.model
    tipe.value = response.data.data.customer_asset.tipe.nama
    formData.value.teknisi_id = response.data.data.teknisi_id
    kapasitas.value = response.data.data.customer_asset.kapasitas
    freon.value = response.data.data.customer_asset.freon
    lokasi.value = response.data.data.customer_asset.lokasi
    kode_pelanggan.value = response.data.data.customer_asset.customer.kode_pelanggan
    jenis_pelanggan.value = response.data.data.customer_asset.customer.jenis
    formData.value.hasil_pekerjaan = response.data.data.hasil_pekerjaan || ''
    formData.value.check_indoor = response.data.data.check_indoor || false
    formData.value.keterangan_indoor = response.data.data.keterangan_indoor || ''
    formData.value.check_outdoor = response.data.data.check_outdoor || false
    formData.value.keterangan_outdoor = response.data.data.keterangan_outdoor || ''
    formData.value.check_pipa = response.data.data.check_pipa || false
    formData.value.keterangan_pipa = response.data.data.keterangan_pipa || ''
    formData.value.check_selang = response.data.data.check_selang || false
    formData.value.keterangan_selang = response.data.data.keterangan_selang || ''
    formData.value.check_kabel = response.data.data.check_kabel || false
    formData.value.keterangan_kabel = response.data.data.keterangan_kabel || ''
    formData.value.check_inst_indoor = response.data.data.check_inst_indoor || false
    formData.value.keterangan_inst_indoor = response.data.data.keterangan_inst_indoor || ''
    formData.value.check_inst_outdoor = response.data.data.check_inst_outdoor || false
    formData.value.keterangan_inst_outdoor = response.data.data.keterangan_inst_outdoor || ''
    formData.value.check_inst_listrik = response.data.data.check_inst_listrik || false
    formData.value.keterangan_inst_listrik = response.data.data.keterangan_inst_listrik || ''
    formData.value.check_inst_pipa = response.data.data.check_inst_pipa || false
    formData.value.keterangan_inst_pipa = response.data.data.keterangan_inst_pipa || ''
    formData.value.check_buangan = response.data.data.check_buangan || false
    formData.value.keterangan_buangan = response.data.data.keterangan_buangan || ''
    formData.value.check_vaccum = response.data.data.check_vaccum || false
    formData.value.keterangan_vaccum = response.data.data.keterangan_vaccum || ''
    formData.value.check_freon = response.data.data.check_freon || false
    formData.value.keterangan_freon = response.data.data.keterangan_freon || ''
    formData.value.check_arus = response.data.data.check_arus || false
    formData.value.keterangan_arus = response.data.data.keterangan_arus || ''
    formData.value.check_eva = response.data.data.check_eva || false
    formData.value.keterangan_eva = response.data.data.keterangan_eva || ''
    formData.value.check_kondensor = response.data.data.check_kondensor || false
    formData.value.keterangan_kondensor = response.data.data.keterangan_kondensor || ''
    formData.value.customer_asset_id = response.data.data.customer_asset.id
  } catch (error) {
    console.error('Error fetching work order data:', error)
  } finally {
    loadingStore.hide()
  }
}

// Ambil data teknisi
async function getPegawai() {
  try {
    const response = await axios.get(`${BASE_URL}wo/pegawai/list`)
    teknisi.value = response.data.data
    console.log('Teknisi data:', teknisi.value)
  } catch (error) {
    console.error('Error fetching teknisi data:', error)
  }
}

const pelangganSignUrl = ref(null)

function onPelangganSignChange(e) {
  const file = e.target.files[0]
  if (file) {
    pelangganSignUrl.value = URL.createObjectURL(file)
  }
}

// Tanda tangan teknisi (otomatis preview sesuai teknisi_id)
const teknisiSignUrl = computed(() => {
  if (!formData.value.teknisi_id) return null
  const tech = teknisi.value.find((t) => t.id === formData.value.teknisi_id)
  if (tech && tech.tanda_tangan) {
    if (tech.tanda_tangan.startsWith('http') || tech.tanda_tangan.startsWith('data:')) {
      return tech.tanda_tangan
    }
    return BASE_URL + tech.tanda_tangan
  }
  return null
})

// Lifecycle
onMounted(() => {
  getForNewWorkOrder(customerAssetId)
  getPegawai()
})
</script>

<style lang="scss" scoped></style>
