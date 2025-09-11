<template>
  <div>
    <div id="workorder-print-area" class="w-[80vw] mx-auto mb-20">
      <!-- Judul dan logo -->
      <div class="flex justify-between items-center my-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">WO Pemeliharaan AC Lestari</h1>
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
                <td class="pr-4 font-medium text-gray-700">Keluhan</td>
                <td class="font-semibold text-gray-900">
                  <select class="bg-gray-100 border border-gray-300 rounded px-2 py-1 text-sm">
                    <option value="AC Tidak Dingin">AC tidak dingin</option>
                    <option value="AC Bocor">AC bocor</option>
                    <option value="AC Berisik">AC berisik</option>
                    <option value="AC Mati Total">AC mati total</option>
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

      <div class="bg-slate-200 p-1 rounded-lg shadow-md">
        <h2 class="text-center font-montserrat font-semibold text-slate-600">Jenis Pekerjaan</h2>
      </div>

      <div class="grid grid-cols-1 ipad:grid-cols-2 gap-4 mt-2 p-2 w-full">
        <div>
          <table>
            <tbody class="text-sm">
              <tr>
                <td class="pr-4 font-medium text-gray-700">1. Pengecekan</td>
                <td class="text-gray-900">
                  <input
                    type="text"
                    id="pengecekan"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
                  />
                </td>
              </tr>
              <tr>
                <td class="text-sm pr-4 font-medium text-gray-700">2. Service</td>
                <td class="text-gray-900">
                  <input
                    id="service"
                    type="text"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 text-sm font-medium text-gray-700">3. Tambah Freon</td>
                <td class="text-gray-900">
                  <input
                    id="tambahfreon"
                    type="text"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 text-sm font-medium text-gray-700">4. Isi Freon</td>
                <td class="text-gray-900">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
                    id="isifreon"
                    type="text"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="ipad:justify-self-end">
          <table>
            <tbody>
              <tr>
                <td class="pr-4 text-sm font-medium text-gray-700">5. Bongkar</td>
                <td class="text-gray-900">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
                    id="bongkar"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 text-sm font-medium text-gray-700">6. Pasang</td>
                <td class="text-gray-900">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
                    id="pasang"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 text-sm font-medium text-gray-700">7. Bongkar+Pasang</td>
                <td class="text-gray-900">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
                    id="bongkarpasang"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 text-sm font-medium text-gray-700">8. Perbaikan</td>
                <td class="text-gray-900">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
                    id="perbaikan"
                    type="text"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-slate-200 p-1 rounded-lg shadow-md">
        <h2 class="text-center font-montserrat font-semibold text-slate-600">Pengecekan Teknisi</h2>
      </div>

      <!-- Pengecekan Teknisi: -->
      <div class="grid grid-cols-1 ipad:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-lg border border-blue-100 p-6 w-full mt-2">
          <h3
            class="font-Poppins font-semibold mb-2 text-center bg-slate-200 rounded-md text-slate-500"
          >
            Indoor
          </h3>
          <table>
            <tbody>
              <tr>
                <td class="pr-4 font-medium text-gray-700">1. Evaporator</td>
                <td class="font-semibold text-gray-900">
                  <input type="checkbox" id="checkEvaporator" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganEvaporator"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">2. Fan/Blower Indoor</td>
                <td class="font-semibold text-gray-900">
                  <input type="checkbox" id="checkFanIndoor" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganFanIndoor"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">3. Kondisi Swing</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkSwing" type="checkbox" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganSwing"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">4. Tegangan Input</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkTeganganInput" type="checkbox" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganTeganganInput"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">5. Thermis Sensor</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkThermis" type="checkbox" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganThermis"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">6. Temperatur</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkTemperaturIndoor" type="checkbox" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganTemperaturIndoor"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">7. Lain-lain</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkLainIndoor" type="checkbox" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganLainIndoor"
                    type="text"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          class="ipad:justify-self-end bg-white rounded-xl shadow-lg border border-blue-100 p-6 w-full mt-2"
        >
          <h3
            class="font-Poppins font-semibold mb-2 text-center bg-slate-200 rounded-md text-slate-500"
          >
            Outdoor
          </h3>
          <table class="w-full">
            <tbody>
              <tr>
                <td class="pr-4 font-medium text-gray-700">1. Kondensor</td>
                <td class="font-semibold text-gray-900">
                  <input type="checkbox" id="checkKondensor" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganKondensor"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">2. Fan/Blower Indoor</td>
                <td class="font-semibold text-gray-900">
                  <input type="checkbox" id="checkFanOutdoor" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganFanOutdoor"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">3. Kapasitor</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkKapasitor" type="checkbox" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganKapasitor"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">4. Tekanan Freon</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkTekananFreon" type="checkbox" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganTekananFreon"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">5. Arus(Ampere)</td>
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
                <td class="pr-4 font-medium text-gray-700">6. Temperatur</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkTemperaturOutdoor" type="checkbox" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganTemperaturOutdoor"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">7. Lain-lain</td>
                <td class="font-semibold text-gray-900">
                  <input id="checkLainOutdoor" type="checkbox" value="1" />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganLainOutdoor"
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
import { ref } from 'vue'

const teknisiSignUrl = ref(null)
const pelangganSignUrl = ref(null)

function onTeknisiSignChange(e) {
  const file = e.target.files[0]
  if (file) {
    teknisiSignUrl.value = URL.createObjectURL(file)
  }
}

function onPelangganSignChange(e) {
  const file = e.target.files[0]
  if (file) {
    pelangganSignUrl.value = URL.createObjectURL(file)
  }
}
</script>

<style lang="scss" scoped></style>
