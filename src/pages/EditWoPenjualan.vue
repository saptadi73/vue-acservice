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
                <td class="font-semibold text-gray-900">: {{ no_wo || '-' }}</td>
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
                  <input
                    type="checkbox"
                    id="checkIndoor"
                    v-model="formData.check_indoor"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_indoor"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganIndoor"
                    type="text"
                    v-model="formData.keterangan_indoor"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">2. Unit Outdoor</td>
                <td class="font-semibold text-gray-900">
                  <input
                    type="checkbox"
                    id="checkOutdoor"
                    v-model="formData.check_outdoor"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_outdoor"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganOutdoor"
                    type="text"
                    v-model="formData.keterangan_outdoor"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">3. Pipa AC</td>
                <td class="font-semibold text-gray-900">
                  <input
                    id="checkPipa"
                    type="checkbox"
                    v-model="formData.check_pipa"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_pipa"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganPipa"
                    type="text"
                    v-model="formData.keterangan_pipa"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">4. Selang Buangan</td>
                <td class="font-semibold text-gray-900">
                  <input
                    id="checkSelang"
                    type="checkbox"
                    v-model="formData.check_selang"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_selang"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganSelang"
                    type="text"
                    v-model="formData.keterangan_selang"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">5. Kabel dan Asesori</td>
                <td class="font-semibold text-gray-900">
                  <input
                    id="checkKabel"
                    type="checkbox"
                    v-model="formData.check_kabel"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_kabel"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganKabel"
                    type="text"
                    v-model="formData.keterangan_kabel"
                    :disabled="status === 'selesai' && pelangganSignUrl"
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
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_inst_indoor"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganInstIndoor"
                    type="text"
                    v-model="formData.keterangan_inst_indoor"
                    :disabled="status === 'selesai' && pelangganSignUrl"
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
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_inst_outdoor"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganInstOutdoor"
                    type="text"
                    v-model="formData.keterangan_inst_outdoor"
                    :disabled="status === 'selesai' && pelangganSignUrl"
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
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_inst_listrik"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganInstListrik"
                    type="text"
                    v-model="formData.keterangan_inst_listrik"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">4. Instalasi Pipa</td>
                <td class="font-semibold text-gray-900">
                  <input
                    id="checkInstPipa"
                    type="checkbox"
                    v-model="formData.check_inst_pipa"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_inst_pipa"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganInstPipa"
                    type="text"
                    v-model="formData.keterangan_inst_pipa"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">5. Instalasi Buangan</td>
                <td class="font-semibold text-gray-900">
                  <input
                    id="checkBuangan"
                    type="checkbox"
                    v-model="formData.check_buangan"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_buangan"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganBuangan"
                    type="text"
                    v-model="formData.keterangan_buangan"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">6. Vaccum</td>
                <td class="font-semibold text-gray-900">
                  <input
                    id="checkVaccum"
                    type="checkbox"
                    v-model="formData.check_vaccum"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_vaccum"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganVaccum"
                    type="text"
                    v-model="formData.keterangan_vaccum"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">7. Tekanan Freon</td>
                <td class="font-semibold text-gray-900">
                  <input
                    id="checkFreon"
                    type="checkbox"
                    v-model="formData.check_freon"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_freon"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganFreon"
                    type="text"
                    v-model="formData.keterangan_freon"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">8. Arus (Ampere)</td>
                <td class="font-semibold text-gray-900">
                  <input
                    id="checkArus"
                    type="checkbox"
                    v-model="formData.check_arus"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_arus"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganArus"
                    type="text"
                    v-model="formData.keterangan_arus"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">9. Temperatur Evaporator</td>
                <td class="font-semibold text-gray-900">
                  <input
                    id="checkEva"
                    type="checkbox"
                    v-model="formData.check_eva"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_eva"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganEva"
                    type="text"
                    v-model="formData.keterangan_eva"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">10. Temperatur Kondensor</td>
                <td class="font-semibold text-gray-900">
                  <input
                    id="checkKondensor"
                    type="checkbox"
                    v-model="formData.check_kondensor"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_kondensor"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganKondensor"
                    type="text"
                    v-model="formData.keterangan_kondensor"
                    :disabled="status === 'selesai' && pelangganSignUrl"
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
          :disabled="status === 'selesai' && pelangganSignUrl"
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
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="onTeknisiSignChange"
                :disabled="status === 'selesai' && pelangganSignUrl"
              />
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
                :disabled="status === 'selesai' && pelangganSignUrl"
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
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="onPelangganSignChange"
                :disabled="status === 'selesai' && pelangganSignUrl"
              />
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
    <div class="flex gap-3 mt-3 flex-wrap">
      <button
        class="flex-1 min-w-[200px] bg-slate-600 font-montserrat text-center cursor-pointer text-white font-bold p-2 rounded-md hover:bg-slate-700 transition"
        @click="createWorkOrder"
        :disabled="status === 'selesai' && pelangganSignUrl"
      >
        Simpan Perubahan
      </button>
      <button
        class="flex-1 min-w-[200px] bg-indigo-600 font-montserrat text-center cursor-pointer text-white font-bold p-2 rounded-md hover:bg-indigo-700 transition"
        @click="previewPdfJsPdf"
      >
        📄 Preview & Download PDF
      </button>
    </div>
    <div class="flex gap-3 mt-3 flex-wrap">
      <button
        class="flex-1 min-w-[200px] bg-green-600 font-montserrat text-center cursor-pointer text-white font-bold p-2 rounded-md hover:bg-green-700 transition"
        @click="createPelangganSignLink"
        :disabled="status === 'selesai' && pelangganSignUrl"
      >
        Buat Link untuk Pelanggan
      </button>
      <button
        class="flex-1 min-w-[200px] bg-blue-600 font-montserrat text-center cursor-pointer text-white font-bold p-2 rounded-md hover:bg-blue-700 transition"
        @click="createSalesOrder"
      >
        + Buat Sales Order
      </button>
    </div>

    <!-- PDF Preview Modal -->
    <div
      v-if="showPdfModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="closePdfPreview"
    >
      <div class="w-[92vw] max-w-5xl h-[86vh] rounded-2xl bg-white p-4 shadow-xl flex flex-col">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-semibold text-gray-800">Preview WO Penjualan</h3>
          <div class="flex items-center gap-2">
            <button
              @click="downloadFromPreview"
              class="rounded-lg bg-indigo-600 text-white px-3 py-1.5 text-sm hover:bg-indigo-700"
            >
              Download
            </button>
            <button
              @click="printFromPreview"
              class="rounded-lg bg-gray-700 text-white px-3 py-1.5 text-sm hover:bg-gray-800"
            >
              Print
            </button>
            <button
              @click="closePdfPreview"
              class="rounded-lg px-2 py-1.5 text-sm hover:bg-gray-100"
            >
              Tutup
            </button>
          </div>
        </div>
        <iframe :src="pdfPreviewUrl" class="flex-1 w-full border rounded-lg"></iframe>
      </div>
    </div>
  </div>
  <loading-overlay />
  <toast-card v-if="show_toast" :message="message_toast" @close="tutupToast" />
</template>

<script setup>
// Import yang diperlukan
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { BASE_URL } from '@/base.utils.url'
import api from '@/user/axios'
import { useLoadingStore } from '../stores/loading'
import LoadingOverlay from '../components/LoadingOverlay.vue'
import ToastCard from '@/components/ToastCard.vue'
import { useWorkOrderPdfPenjualan } from '@/composables/useWorkOrderPdfPenjualan'

const loadingStore = useLoadingStore()

const show_toast = ref(false)
const message_toast = ref('')

// Preview modal state
const showPdfModal = ref(false)
const pdfPreviewUrl = ref('')

function tutupToast() {
  show_toast.value = false
  message_toast.value = ''
  window.location.reload()
}

function closePdfPreview() {
  showPdfModal.value = false
  // Do not revoke here; jsPDF blob URLs are managed by the browser
}

// Routing dan data utama
const route = useRoute()
const customerAssetId = route.params.id
const no_wo = ref(route.query.nowo || '')
const customer_id = ref('')
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
const status = ref('')
const pelangganSignUrl = ref(null)
const teknisiSignUploadUrl = ref(null)
const teknisiSignBase64 = ref(null)
const pelangganSignBase64 = ref(null)

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
    customer_id.value = response.data.data.customer_asset.customer.id
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
    pelangganSignUrl.value = response.data.data.tanda_tangan_pelanggan
      ? toRelativeUploadPath(response.data.data.tanda_tangan_pelanggan)
      : null
    teknisiSignBase64.value = response.data.data.tanda_tangan_teknisi_base64 || null
    pelangganSignBase64.value = response.data.data.tanda_tangan_pelanggan_base64 || null
    teknisiSignUploadUrl.value = null
    status.value = response.data.data.status || ''
  } catch (error) {
    console.error('Error fetching work order data:', error)
  } finally {
    loadingStore.hide()
  }
}

// Helper: Convert absolute URL to relative path for Vite proxy
function toRelativeUploadPath(path) {
  if (!path) return null
  try {
    // If already relative path, use it as-is
    if (path.startsWith('/uploads')) return path
    // If absolute URL, extract the /uploads part
    const url = new URL(path)
    const pathname = url.pathname
    if (pathname.includes('/uploads')) {
      return pathname.substring(pathname.indexOf('/uploads'))
    }
    return path // fallback
  } catch {
    return path
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

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function onTeknisiSignChange(e) {
  const file = e.target.files[0]
  if (!file) return

  teknisiSignBase64.value = await fileToBase64(file)
  teknisiSignUploadUrl.value = URL.createObjectURL(file)
}

async function onPelangganSignChange(e) {
  const file = e.target.files[0]
  if (!file) return

  pelangganSignBase64.value = await fileToBase64(file)
  pelangganSignUrl.value = URL.createObjectURL(file)
}

// Tanda tangan teknisi (otomatis preview sesuai teknisi_id)
const teknisiSignUrl = computed(() => {
  if (teknisiSignUploadUrl.value) return teknisiSignUploadUrl.value

  if (!formData.value.teknisi_id) return null
  const tech = teknisi.value.find((t) => t.id === formData.value.teknisi_id)
  if (tech && tech.tanda_tangan) {
    // If already data URL or absolute URL, use it directly
    if (tech.tanda_tangan.startsWith('data:') || tech.tanda_tangan.startsWith('http')) {
      return tech.tanda_tangan
    }
    // If relative path, use it
    if (tech.tanda_tangan.startsWith('/')) {
      return tech.tanda_tangan
    }
    // Otherwise, assume it's relative and prepend /
    return `/${tech.tanda_tangan}`
  }
  return null
})

// Watcher: When teknisi changes, convert their signature to Base64
watch(
  () => formData.value.teknisi_id,
  async (teknisiId) => {
    if (!teknisiId) {
      teknisiSignBase64.value = null
      return
    }

    const tech = teknisi.value.find((t) => t.id === teknisiId)
    if (!tech || !tech.tanda_tangan) {
      teknisiSignBase64.value = null
      return
    }

    // If it's already Base64, use it directly
    if (tech.tanda_tangan.startsWith('data:')) {
      teknisiSignBase64.value = tech.tanda_tangan
      return
    }

    // Build the URL for fetching
    let fetchUrl = tech.tanda_tangan
    if (fetchUrl.startsWith('http')) {
      // If it's absolute URL, extract the path for proxy
      try {
        const url = new URL(fetchUrl)
        fetchUrl = url.pathname
      } catch {
        // If not a valid URL, use as-is
      }
    }
    if (!fetchUrl.startsWith('/')) {
      fetchUrl = `/${fetchUrl}`
    }

    // Convert from URL/path to Base64
    try {
      console.log('Converting teknisi signature from path:', fetchUrl)
      const res = await fetch(fetchUrl, { credentials: 'include' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      const reader = new FileReader()
      reader.onloadend = () => {
        teknisiSignBase64.value = reader.result
        console.log('✅ Teknisi Base64 converted successfully')
      }
      reader.onerror = () => {
        console.error('❌ Failed to read teknisi signature blob')
        teknisiSignBase64.value = null
      }
      reader.readAsDataURL(blob)
    } catch (error) {
      console.error('❌ Failed to convert teknisi signature:', error.message)
      teknisiSignBase64.value = null
    }
  },
)

const router = useRouter()
function createSalesOrder() {
  router.push({
    name: 'create sales order maintenance',
    query: {
      customer_id: customer_id.value,
      customer_name: nama_pelanggan.value,
      customer_address: alamat.value,
      customer_phone: no_hp.value,
    },
  })
}

// function serializeForPrint(element) {
//   const clone = element.cloneNode(true)
//   const originals = element.querySelectorAll('input, textarea, select')
//   const clonedNodes = clone.querySelectorAll('input, textarea, select')

//   clonedNodes.forEach((node, idx) => {
//     const orig = originals[idx]
//     if (!orig) return
//     if (node.tagName === 'INPUT') {
//       const type = (orig.getAttribute('type') || 'text').toLowerCase()
//       if (type === 'checkbox' || type === 'radio') {
//         if (orig.checked) {
//           node.setAttribute('checked', 'checked')
//         } else {
//           node.removeAttribute('checked')
//         }
//       }
//       node.setAttribute('value', orig.value || '')
//     } else if (node.tagName === 'TEXTAREA') {
//       node.textContent = orig.value || ''
//     } else if (node.tagName === 'SELECT') {
//       Array.from(node.options || []).forEach((opt) => {
//         if (opt.value === orig.value) {
//           opt.setAttribute('selected', 'selected')
//         } else {
//           opt.removeAttribute('selected')
//         }
//       })
//     }
//   })

//   return clone.outerHTML
// }

async function previewPdfJsPdf() {
  const { generatePdf } = useWorkOrderPdfPenjualan()

  const checklistData = {
    unit: [
      {
        label: '1. Unit Indoor',
        check: formData.value.check_indoor,
        ket: formData.value.keterangan_indoor,
      },
      {
        label: '2. Unit Outdoor',
        check: formData.value.check_outdoor,
        ket: formData.value.keterangan_outdoor,
      },
      {
        label: '3. Pipa AC',
        check: formData.value.check_pipa,
        ket: formData.value.keterangan_pipa,
      },
      {
        label: '4. Selang Buangan',
        check: formData.value.check_selang,
        ket: formData.value.keterangan_selang,
      },
      {
        label: '5. Kabel dan Asesori',
        check: formData.value.check_kabel,
        ket: formData.value.keterangan_kabel,
      },
    ],
    install: [
      {
        label: '1. Instalasi Indoor',
        check: formData.value.check_inst_indoor,
        ket: formData.value.keterangan_inst_indoor,
      },
      {
        label: '2. Instalasi Outdoor',
        check: formData.value.check_inst_outdoor,
        ket: formData.value.keterangan_inst_outdoor,
      },
      {
        label: '3. Instalasi Listrik',
        check: formData.value.check_inst_listrik,
        ket: formData.value.keterangan_inst_listrik,
      },
      {
        label: '4. Instalasi Pipa',
        check: formData.value.check_inst_pipa,
        ket: formData.value.keterangan_inst_pipa,
      },
      {
        label: '5. Instalasi Buangan',
        check: formData.value.check_buangan,
        ket: formData.value.keterangan_buangan,
      },
      {
        label: '6. Vaccum',
        check: formData.value.check_vaccum,
        ket: formData.value.keterangan_vaccum,
      },
      {
        label: '7. Tekanan Freon',
        check: formData.value.check_freon,
        ket: formData.value.keterangan_freon,
      },
      {
        label: '8. Arus (Ampere)',
        check: formData.value.check_arus,
        ket: formData.value.keterangan_arus,
      },
      {
        label: '9. Temperatur Evaporator',
        check: formData.value.check_eva,
        ket: formData.value.keterangan_eva,
      },
      {
        label: '10. Temperatur Kondensor',
        check: formData.value.check_kondensor,
        ket: formData.value.keterangan_kondensor,
      },
    ],
  }

  const teknisiName = teknisi.value.find((t) => t.id === formData.value.teknisi_id)?.nama || ''

  const blobUrl = await generatePdf(
    {
      woNumber: no_wo.value || '-',
      customer: {
        nama: nama_pelanggan.value || '-',
        alamat: alamat.value || '-',
        hp: no_hp.value || '-',
        jenis: jenis_pelanggan.value || '-',
        kode: kode_pelanggan.value || '-',
      },
      unit: {
        brand: brand.value || '-',
        model: model.value || '-',
        tipe: tipe.value || '-',
        kapasitas: kapasitas.value || '-',
        freon: freon.value || '-',
        lokasi: lokasi.value || '-',
      },
      checklist: checklistData,
      hasilPekerjaan: formData.value.hasil_pekerjaan || '',
      teknisi: {
        nama: teknisiName,
      },
      signatures: {
        teknisi: {
          base64: teknisiSignBase64.value,
          url: teknisiSignUrl.value,
        },
        pelanggan: {
          base64: pelangganSignBase64.value,
          url: pelangganSignUrl.value,
        },
      },
    },
    { preview: true },
  )

  if (blobUrl) {
    pdfPreviewUrl.value = blobUrl
    showPdfModal.value = true
  }
}

function downloadFromPreview() {
  if (!pdfPreviewUrl.value) return
  const a = document.createElement('a')
  const safeName = (nama_pelanggan.value || 'customer')
    .toString()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 40)
  a.href = pdfPreviewUrl.value
  a.download = `WO_Penjualan_${no_wo.value || 'WO'}_${safeName}.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

function printFromPreview() {
  if (!pdfPreviewUrl.value) return
  const w = window.open(pdfPreviewUrl.value)
  if (w) {
    w.addEventListener('load', () => {
      w.focus()
      w.print()
    })
  }
}

// Lifecycle
onMounted(() => {
  getForNewWorkOrder(customerAssetId)
  getPegawai()
})
</script>

<style lang="scss" scoped></style>
