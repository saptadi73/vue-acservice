<template>
  <div>
    <div id="workorder-print-area" class="w-[80vw] mx-auto mb-20">
      <!-- Judul dan logo -->
      <div class="flex justify-between items-center my-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">WO Penyewaan AC Lestari</h1>
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
                <td class="font-semibold text-gray-900">: Pribadi</td>
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
                <td class="font-semibold text-gray-900">: Budi</td>
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
                <td class="font-semibold text-gray-900">: Budi</td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">Alamat</td>
                <td class="font-semibold text-gray-900">: Jl. Merdeka No. 123, Jakarta</td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">No. HP</td>
                <td class="font-semibold text-gray-900">: 0812 3456 7890</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="ipad:justify-self-end">
          <table>
            <tbody>
              <tr>
                <td class="pr-4 font-medium text-gray-700">Permintaan Khusus</td>
                <td class="font-semibold text-gray-900">
                  <select class="bg-gray-100 border border-gray-300 rounded px-2 py-1 text-sm">
                    <option value="AC Tidak Dingin">Penambahan Pipa</option>
                    <option value="AC Bocor">Penambahan Plug In Listrik</option>
                    <option value="AC Bocor">Perpanjangan Kabel Listrik</option>
                    <option value="AC Berisik">Instalasi Listrik Tambahan</option>
                    <option value="AC Mati Total">Lain-lain</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">Keterangan</td>
                <td class="font-semibold text-gray-900">
                  <input
                    class="text-sm"
                    type="text"
                    id="keterangan"
                    placeholder="Isikan keterangan Tambahan"
                  />
                </td>
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
                <td class="font-semibold text-gray-900">: Panasonic</td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">Model</td>
                <td class="font-semibold text-gray-900">: TR-WETG53</td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">Freon</td>
                <td class="font-semibold text-gray-900">: R33</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="ipad:justify-self-end">
          <table>
            <tbody>
              <tr>
                <td class="pr-4 font-medium text-gray-700">Tipe</td>
                <td class="font-semibold text-gray-900">: Split</td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">Kapasitas</td>
                <td class="font-semibold text-gray-900">: 2600 BTU</td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">Lokasi</td>
                <td class="font-semibold text-gray-900">: Ruang Tamu</td>
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

      <div class="grid grid-cols-1 ipad:grid-cols-3 gap-6">
        <!-- Card kesatu -->
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
                  <input type="checkbox" id="checkIndoor" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganIndoor"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">2. Unit Outdoor</td>
                <td class="font-semibold text-gray-900">
                  <input type="checkbox" id="checkOutdoor" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganOutdoor"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">3. Pipa AC</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkPipa" type="checkbox" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganPipa"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">4. Selang Buangan</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkSelang" type="checkbox" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganSelang"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">5. Kabel dan Asesori</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkKabel" type="checkbox" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganKabel"
                    type="text"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Card kedua -->

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
                  <input type="checkbox" id="checkInstIndoor" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganInstIndoor"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">2. Instalasi Outdoor</td>
                <td class="font-semibold text-gray-900">
                  <input type="checkbox" id="checkInstOutdoor" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganInstOutdoor"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">3. Instalasi Listrik</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkInstListrik" type="checkbox" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganInstListrik"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">4. Instalasi Pipa</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkInstPipa" type="checkbox" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganInstPipa"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">5. Instalasi Buangan</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkBuangan" type="checkbox" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganBuangan"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">6. Vaccum</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkVaccum" type="checkbox" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganVaccum"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">7. Tekanan Freon</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkFreon" type="checkbox" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganFreon"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">8. Arus (Ampere)</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkArus" type="checkbox" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganArus"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">9. Temperatur Evaporator</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkEva" type="checkbox" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganEva"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">10. Temperatur Kondensor</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkKondensor" type="checkbox" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganKondensor"
                    type="text"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Card Ketiga -->
        <div
          class="ipad:justify-self-end bg-white rounded-xl shadow-lg border border-blue-100 p-6 w-full mt-2"
        >
          <h3
            class="font-Poppins font-semibold mb-2 text-center bg-slate-200 rounded-md text-slate-500"
          >
            Pekerjaan Bongkar
          </h3>
          <table class="w-full">
            <tbody>
              <tr>
                <td class="pr-4 font-medium text-gray-700">1. Unit Indoor</td>
                <td class="font-semibold text-gray-900">
                  <input type="checkbox" id="checkIndoorB" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganIndoorB"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">2. Unit Outdoor</td>
                <td class="font-semibold text-gray-900">
                  <input type="checkbox" id="checkOutdoorB" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganOutdoorB"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">3. Pipa AC</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkPipaB" type="checkbox" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganPipaB"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">4. Selang Buangan</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkSelangB" type="checkbox" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganSelangB"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">5. Kabel dan Asesori</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkKabelB" type="checkbox" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganKabelB"
                    type="text"
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
          id="hasil"
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
            <div class="w-full text-center mt-2 text-blue-700 font-semibold">( Nama Teknisi )</div>
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
              ( Nama Pelanggan )
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import yang diperlukan
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { BASE_URL } from '@/base.utils.url'

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
  customer_asset_id: customerAssetId,
  teknisi_id: null,
  // ...field lain sesuai kebutuhan...
})

// Ambil data work order
async function getForNewWorkOrder(id) {
  try {
    const response = await axios.get(`${BASE_URL}customers/assets/${id}`)
    nama_pelanggan.value = response.data.data.customer_nama
    alamat.value = response.data.data.customer_alamat
    no_hp.value = response.data.data.customer_hp
    brand.value = response.data.data.brand
    model.value = response.data.data.model
    tipe.value = response.data.data.tipe
    kapasitas.value = response.data.data.kapasitas
    freon.value = response.data.data.freon
    lokasi.value = response.data.data.lokasi
    kode_pelanggan.value = response.data.data.customer_kode_pelanggan
    jenis_pelanggan.value = response.data.data.customer_jenis
  } catch (error) {
    console.error('Error fetching work order data:', error)
  }
}

// Ambil data teknisi
async function getPegawai() {
  try {
    const response = await axios.get(`${BASE_URL}wo/pegawai`)
    teknisi.value = response.data.data
  } catch (error) {
    console.error('Error fetching teknisi data:', error)
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
