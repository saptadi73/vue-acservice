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
                <td class="pr-4 font-medium text-gray-700">Pilih Pelanggan</td>
                <td class="font-semibold text-gray-900">
                  <select
                    id="pilihpelanggan"
                    v-if="customers"
                    v-model="selectedCustomerId"
                    @change="onSelectCustomer"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  >
                    <option value="" selected>Pilih Pelanggan</option>
                    <option v-for="value in customers" :key="value.id" :value="value.id">
                      {{ value.nama }}
                    </option>
                  </select>
                </td>
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
              <tr>
                <td class="pr-4 font-medium text-gray-700">No. HP</td>
                <td class="font-semibold text-gray-900">: {{ no_hp }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="ipad:justify-self-end">
          <table>
            <tbody>
              <tr>
                <td class="pr-4 font-medium text-gray-700">AC yang Disewa</td>
                <td class="font-semibold text-gray-900">
                  <select
                    id="sewaAcRental"
                    class="bg-gray-100 border border-gray-300 rounded px-2 py-1 text-sm"
                    v-model="selectedAssetId"
                    @change="onSelectAsset"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  >
                    <option value="" disabled selected>Unit AC yang disewa</option>
                    <option v-for="asset in assets" :key="asset.id" :value="asset.id">
                      {{ asset.brand }},{{ asset.model }} - {{ asset.tipe }} - {{ asset.kapasitas }}
                    </option>
                  </select>
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
                  <input
                    v-model="formData.checkIndoor"
                    type="checkbox"
                    id="checkIndoor"
                    value="1"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.checkIndoor"
                    v-model="formData.keteranganIndoor"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganIndoor"
                    type="text"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">2. Unit Outdoor</td>
                <td class="font-semibold text-gray-900">
                  <input
                    v-model="formData.checkOutdoor"
                    type="checkbox"
                    id="checkOutdoor"
                    value="1"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.checkOutdoor"
                    v-model="formData.keteranganOutdoor"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganOutdoor"
                    type="text"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">3. Pipa AC</td>
                <td class="font-semibold text-gray-900">
                  <input
                    v-model="formData.checkPipa"
                    id="checkPipa"
                    type="checkbox"
                    value="1"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.checkPipa"
                    v-model="formData.keteranganPipa"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganPipa"
                    type="text"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">4. Selang Buangan</td>
                <td class="font-semibold text-gray-900">
                  <input
                    v-model="formData.checkSelang"
                    id="checkSelang"
                    type="checkbox"
                    value="1"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.checkSelang"
                    v-model="formData.keteranganSelang"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganSelang"
                    type="text"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">5. Kabel dan Asesori</td>
                <td class="font-semibold text-gray-900">
                  <input
                    v-model="formData.checkKabel"
                    id="checkKabel"
                    type="checkbox"
                    value="1"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.checkKabel"
                    v-model="formData.keteranganKabel"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganKabel"
                    type="text"
                    :disabled="status === 'selesai' && pelangganSignUrl"
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
                  <input
                    v-model="formData.checkInstIndoor"
                    type="checkbox"
                    id="checkInstIndoor"
                    value="1"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.checkInstIndoor"
                    v-model="formData.keteranganInstIndoor"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganInstIndoor"
                    type="text"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">2. Instalasi Outdoor</td>
                <td class="font-semibold text-gray-900">
                  <input
                    v-model="formData.checkInstOutdoor"
                    type="checkbox"
                    id="checkInstOutdoor"
                    value="1"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.checkInstOutdoor"
                    v-model="formData.keteranganInstOutdoor"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganInstOutdoor"
                    type="text"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">3. Instalasi Listrik</td>
                <td class="font-semibold text-gray-900">
                  <input
                    v-model="formData.checkInstListrik"
                    id="checkInstListrik"
                    type="checkbox"
                    value="1"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.checkInstListrik"
                    v-model="formData.keteranganInstListrik"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganInstListrik"
                    type="text"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">4. Instalasi Pipa</td>
                <td class="font-semibold text-gray-900">
                  <input
                    v-model="formData.checkInstPipa"
                    id="checkInstPipa"
                    type="checkbox"
                    value="1"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.checkInstPipa"
                    v-model="formData.keteranganInstPipa"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganInstPipa"
                    type="text"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">5. Instalasi Buangan</td>
                <td class="font-semibold text-gray-900">
                  <input
                    v-model="formData.checkBuangan"
                    id="checkBuangan"
                    type="checkbox"
                    value="1"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.checkBuangan"
                    v-model="formData.keteranganBuangan"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganBuangan"
                    type="text"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">6. Vaccum</td>
                <td class="font-semibold text-gray-900">
                  <input
                    v-model="formData.checkVaccum"
                    id="checkVaccum"
                    type="checkbox"
                    value="1"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.checkVaccum"
                    v-model="formData.keteranganVaccum"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganVaccum"
                    type="text"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">7. Tekanan Freon</td>
                <td class="font-semibold text-gray-900">
                  <input
                    v-model="formData.checkFreon"
                    id="checkFreon"
                    type="checkbox"
                    value="1"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.checkFreon"
                    v-model="formData.keteranganFreon"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganFreon"
                    type="text"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">8. Arus (Ampere)</td>
                <td class="font-semibold text-gray-900">
                  <input
                    v-model="formData.checkArus"
                    id="checkArus"
                    type="checkbox"
                    value="1"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.checkArus"
                    v-model="formData.keteranganArus"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganArus"
                    type="text"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">9. Temperatur Evaporator</td>
                <td class="font-semibold text-gray-900">
                  <input
                    v-model="formData.checkEva"
                    id="checkEva"
                    type="checkbox"
                    value="1"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.checkEva"
                    v-model="formData.keteranganEva"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganEva"
                    type="text"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">10. Temperatur Kondensor</td>
                <td class="font-semibold text-gray-900">
                  <input
                    v-model="formData.checkKondensor"
                    id="checkKondensor"
                    type="checkbox"
                    value="1"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.checkKondensor"
                    v-model="formData.keteranganKondensor"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganKondensor"
                    type="text"
                    :disabled="status === 'selesai' && pelangganSignUrl"
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
                  <input
                    v-model="formData.checkIndoorB"
                    type="checkbox"
                    id="checkIndoorB"
                    value="1"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.checkIndoorB"
                    v-model="formData.keteranganIndoorB"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganIndoorB"
                    type="text"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">2. Unit Outdoor</td>
                <td class="font-semibold text-gray-900">
                  <input
                    v-model="formData.checkOutdoorB"
                    type="checkbox"
                    id="checkOutdoorB"
                    value="1"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.checkOutdoorB"
                    v-model="formData.keteranganOutdoorB"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganOutdoorB"
                    type="text"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">3. Pipa AC</td>
                <td class="font-semibold text-gray-900">
                  <input
                    v-model="formData.checkPipaB"
                    id="checkPipaB"
                    type="checkbox"
                    value="1"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.checkPipaB"
                    v-model="formData.keteranganPipaB"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganPipaB"
                    type="text"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">4. Selang Buangan</td>
                <td class="font-semibold text-gray-900">
                  <input
                    v-model="formData.checkSelangB"
                    id="checkSelangB"
                    type="checkbox"
                    value="1"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.checkSelangB"
                    v-model="formData.keteranganSelangB"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganSelangB"
                    type="text"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">5. Kabel dan Asesori</td>
                <td class="font-semibold text-gray-900">
                  <input
                    id="checkKabelB"
                    type="checkbox"
                    value="1"
                    v-model="formData.checkKabelB"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.checkKabelB"
                    v-model="formData.keteranganKabelB"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganKabelB"
                    type="text"
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
          v-model="formData.hasil_pekerjaan"
          type="text"
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
              <input type="file" accept="image/*" class="hidden" @change="onTeknisiSignChange" />
              <div
                class="w-full h-24 flex items-center justify-center border-b-2 border-blue-200 bg-blue-50 rounded-md overflow-hidden"
              >
                <img
                  id="teknisiSignImg"
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
              <select id="pilihteknisi" v-if="teknisi" v-model="formData.teknisi_id">
                <option value="" disabled selected>Pilih Teknisi</option>
                <option v-for="value in teknisi" :key="value.id" :value="value.id">
                  {{ value.nama }}
                </option>
              </select>
              )
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
                  id="pelangganSignImg"
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
    <loading-overlay />
    <toast-card v-if="show_toast" :message="message_toast" @close="tutupToast" />
  </div>
</template>

<script setup>
// Import yang diperlukan
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { BASE_URL } from '@/base.utils.url'
import api from '@/user/axios'
import { useLoadingStore } from '../stores/loading'
import LoadingOverlay from '../components/LoadingOverlay.vue'
import ToastCard from '@/components/ToastCard.vue'
import { useWorkOrderPdf } from '@/composables/useWorkOrderPdf'

const loadingStore = useLoadingStore()
const route = useRoute()
const workorder_id = route.params.id
const no_wo = ref(route.query.nowo || '')

const show_toast = ref(false)
const message_toast = ref('')

function tutupToast() {
  show_toast.value = false
  message_toast.value = ''
  window.location.reload()
}

// Routing dan data utama
const nama_pelanggan = ref('')
const alamat = ref('')
const no_hp = ref('')
const selectedCustomerId = ref('')
const assets = ref([])

function onSelectCustomer() {
  const selected = customers.value.find((c) => c.id == selectedCustomerId.value)
  if (selected) {
    nama_pelanggan.value = selected.nama
    alamat.value = selected.alamat
    no_hp.value = selected.hp
    jenis_pelanggan.value = selected.jenis
    formData.value.customer_id = selectedCustomerId.value
  } else {
    nama_pelanggan.value = ''
    alamat.value = ''
    no_hp.value = ''
    jenis_pelanggan.value = ''
    formData.value.customer_id = null
  }
}
const brand = ref('')
const model = ref('')
const tipe = ref('')
const kapasitas = ref('')
const freon = ref('')
const lokasi = ref('')
const selectedAssetId = ref('')

function onSelectAsset() {
  const selected = assets.value.find((a) => a.id == selectedAssetId.value)
  if (selected) {
    brand.value = selected.brand
    model.value = selected.model
    tipe.value = selected.tipe
    kapasitas.value = selected.kapasitas
    lokasi.value = selected.lokasi
    freon.value = selected.freon
    formData.value.rental_asset_id = selectedAssetId.value
  } else {
    brand.value = ''
    model.value = ''
    tipe.value = ''
    kapasitas.value = ''
    lokasi.value = ''
    freon.value = ''
    formData.value.rental_asset_id = ''
  }
}

const jenis_pelanggan = ref('')
const teknisi = ref([])
const customers = ref([])
const pelangganSignUrl = ref(null)
const teknisiSignBase64 = ref(null)
const pelangganSignBase64 = ref(null)
const status = ref('')

const formData = ref({
  customer_id: null,
  rental_asset_id: null,
  teknisi_id: null,
  hasil_pekerjaan: '',
  checkIndoor: false,
  keteranganIndoor: '',
  checkOutdoor: false,
  keteranganOutdoor: '',
  checkPipa: false,
  keteranganPipa: '',
  checkSelang: false,
  keteranganSelang: '',
  checkKabel: false,
  keteranganKabel: '',
  checkInstIndoor: false,
  keteranganInstIndoor: '',
  checkInstOutdoor: false,
  keteranganInstOutdoor: '',
  checkInstListrik: false,
  keteranganInstListrik: '',
  checkInstPipa: false,
  keteranganInstPipa: '',
  checkBuangan: false,
  keteranganBuangan: '',
  checkVaccum: false,
  keteranganVaccum: '',
  checkFreon: false,
  keteranganFreon: '',
  checkArus: false,
  keteranganArus: '',
  checkEva: false,
  keteranganEva: '',
  checkKondensor: false,
  keteranganKondensor: '',
  checkIndoorB: false,
  keteranganIndoorB: '',
  checkOutdoorB: false,
  keteranganOutdoorB: '',
  checkPipaB: false,
  keteranganPipaB: '',
  checkSelangB: false,
  keteranganSelangB: '',
  checkKabelB: false,
  keteranganKabelB: '',
})

// Normalize absolute upload URL to relative path so Vite proxy applies
function toRelativeUploadPath(path) {
  if (!path) return null
  try {
    // If already relative
    if (path.startsWith('/uploads')) return path
    // If absolute, strip origin and keep /uploads...
    const u = new URL(path, BASE_URL)
    const rel = u.pathname + (u.search || '')
    if (rel.startsWith('/uploads')) return rel
    return path // fallback, return as provided
  } catch {
    return path
  }
}

// Helper: convert relative /uploads path to Base64 via Vite proxy (no CORS)
async function convertImageUrlToBase64(relativePath) {
  try {
    console.log('  🔄 Fetching image via Vite proxy:', relativePath)
    const res = await fetch(relativePath, { credentials: 'include' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const blob = await res.blob()
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('  ❌ Proxy fetch failed:', error.message)
    throw new Error(`Failed to convert image: ${error.message}`)
  }
}

// Ambil data work order
async function getForNewWorkOrder() {
  try {
    const response = await axios.get(`${BASE_URL}customers/rentalassets/all`)
    assets.value = response.data.data
    console.log('Data Assets: ', assets.value)
  } catch (error) {
    console.error('Error fetching work order data:', error)
  }
}

async function createPelangganSignLink() {
  loadingStore.show()
  try {
    const response = await api.post(`wo/penyewaan/sign/${workorder_id}`, {
      customer_id: formData.value.customer_id,
    })
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

async function getWorkOrderPenyewaanByID() {
  loadingStore.show()
  if (!workorder_id) {
    console.warn('No work order ID provided')
    loadingStore.hide()
    return
  }
  try {
    console.log('═══════════════════════════════════════════')
    console.log('📡 BACKEND REQUEST DEBUG LOG')
    console.log('═══════════════════════════════════════════')
    console.log('🔹 Endpoint:', `/wo/penyewaan/${workorder_id}`)
    console.log('🔹 Work Order ID:', workorder_id)
    console.log('🔹 Request Time:', new Date().toISOString())

    const response = await api.get(`/wo/penyewaan/${workorder_id}`)

    console.log('═══════════════════════════════════════════')
    console.log('📥 COMPLETE RESPONSE FROM BACKEND')
    console.log('═══════════════════════════════════════════')
    console.log('🔹 Status Code:', response.status)
    console.log('🔹 Status Text:', response.statusText)
    console.log('🔹 Response Headers:', {
      'content-type': response.headers['content-type'],
      'content-length': response.headers['content-length'],
    })
    console.log('🔹 Complete Response Object:', response)
    console.log('🔹 Response.data:', response.data)
    console.log('🔹 Response.data.status:', response.data?.status)
    console.log('🔹 Response.data.message:', response.data?.message)
    console.log('🔹 Response.data.data:', response.data?.data)

    // Check if response has data
    if (!response.data || !response.data.data) {
      console.warn('⚠️ NO DATA RETURNED FROM ENDPOINT')
      console.warn('═══════════════════════════════════════════')
      console.warn('Full response structure:')
      console.warn(JSON.stringify(response.data, null, 2))
      console.warn('═══════════════════════════════════════════')
      message_toast.value = 'Data work order tidak ditemukan. Silakan periksa status penyewaan.'
      show_toast.value = true
      loadingStore.hide()
      return
    }

    const dataku = response.data.data
    console.log('✅ Data successfully extracted from response.data.data')
    console.log('🔹 Object Keys:', Object.keys(dataku))
    console.log('🔹 Status Value:', dataku.status)
    console.log('🔹 Customer ID:', dataku.customer_id)
    console.log('🔹 Rental Asset ID:', dataku.rental_asset_id)
    console.log('🔹 Signature URLs:')
    console.log('  - tanda_tangan_teknisi:', dataku.tanda_tangan_teknisi || 'Not available')
    console.log('  - tanda_tangan_pelanggan:', dataku.tanda_tangan_pelanggan || 'Not available')
    console.log('🔹 Signature Base64 Fields:')
    console.log(
      '  - tanda_tangan_teknisi_base64:',
      dataku.tanda_tangan_teknisi_base64 ? 'Available ✓' : 'Not available',
    )
    console.log(
      '  - tanda_tangan_pelanggan_base64:',
      dataku.tanda_tangan_pelanggan_base64 ? 'Available ✓' : 'Not available',
    )
    console.log('🔹 All Fields:', dataku)
    console.log('═══════════════════════════════════════════')

    formData.value = {
      customer_id: dataku.customer_id || null,
      rental_asset_id: dataku.rental_asset_id || null,
      teknisi_id: dataku.teknisi_id || null,
      hasil_pekerjaan: dataku.hasil_pekerjaan || '',
      checkIndoor: dataku.checkIndoor || false,
      keteranganIndoor: dataku.keteranganIndoor || '',
      checkOutdoor: dataku.checkOutdoor || false,
      keteranganOutdoor: dataku.keteranganOutdoor || '',
      checkPipa: dataku.checkPipa || false,
      keteranganPipa: dataku.keteranganPipa || '',
      checkSelang: dataku.checkSelang || false,
      keteranganSelang: dataku.keteranganSelang || '',
      checkKabel: dataku.checkKabel || false,
      keteranganKabel: dataku.keteranganKabel || '',
      checkInstIndoor: dataku.checkInstIndoor || false,
      keteranganInstIndoor: dataku.keteranganInstIndoor || '',
      checkInstOutdoor: dataku.checkInstOutdoor || false,
      keteranganInstOutdoor: dataku.keteranganInstOutdoor || '',
      checkInstListrik: dataku.checkInstListrik || false,
      keteranganInstListrik: dataku.keteranganInstListrik || '',
      checkInstPipa: dataku.checkInstPipa || false,
      keteranganInstPipa: dataku.keteranganInstPipa || '',
      checkBuangan: dataku.checkBuangan || false,
      keteranganBuangan: dataku.keteranganBuangan || '',
      checkVaccum: dataku.checkVaccum || false,
      keteranganVaccum: dataku.keteranganVaccum || '',
      checkFreon: dataku.checkFreon || false,
      keteranganFreon: dataku.keteranganFreon || '',
      checkArus: dataku.checkArus || false,
      keteranganArus: dataku.keteranganArus || '',
      checkEva: dataku.checkEva || false,
      keteranganEva: dataku.keteranganEva || '',
      checkKondensor: dataku.checkKondensor || false,
      keteranganKondensor: dataku.keteranganKondensor || '',
      checkIndoorB: dataku.checkIndoorB || false,
      keteranganIndoorB: dataku.keteranganIndoorB || '',
      checkOutdoorB: dataku.checkOutdoorB || false,
      keteranganOutdoorB: dataku.keteranganOutdoorB || '',
      checkPipaB: dataku.checkPipaB || false,
      keteranganPipaB: dataku.keteranganPipaB || '',
      checkSelangB: dataku.checkSelangB || false,
      keteranganSelangB: dataku.keteranganSelangB || '',
      checkKabelB: dataku.checkKabelB || false,
      keteranganKabelB: dataku.keteranganKabelB || '',
    }
    selectedCustomerId.value = dataku.customer_id || ''
    onSelectCustomer()
    selectedAssetId.value = dataku.rental_asset_id || ''
    onSelectAsset()
    pelangganSignUrl.value = dataku.tanda_tangan_pelanggan
      ? BASE_URL + dataku.tanda_tangan_pelanggan.replace(/^\//, '')
      : null

    // Simpan Base64 signatures dari backend
    teknisiSignBase64.value = dataku.tanda_tangan_teknisi_base64 || null
    pelangganSignBase64.value = dataku.tanda_tangan_pelanggan_base64 || null

    console.log('📝 Signature URLs from backend:')
    console.log('  - Teknisi URL:', dataku.tanda_tangan_teknisi || 'Not available')
    console.log('  - Pelanggan URL:', dataku.tanda_tangan_pelanggan || 'Not available')
    console.log(
      '  - Teknisi Base64:',
      dataku.tanda_tangan_teknisi_base64 ? 'Available' : 'Not available',
    )
    console.log(
      '  - Pelanggan Base64:',
      dataku.tanda_tangan_pelanggan_base64 ? 'Available' : 'Not available',
    )

    // Fallback: Jika backend tidak kirim Base64, convert dari URL menggunakan relative path
    if (!teknisiSignBase64.value && dataku.tanda_tangan_teknisi) {
      const teknisiPath = toRelativeUploadPath(dataku.tanda_tangan_teknisi)
      console.log('🔄 Converting Teknisi signature from path:', teknisiPath)
      try {
        teknisiSignBase64.value = await convertImageUrlToBase64(teknisiPath)
        console.log('✅ Teknisi Base64 converted successfully')
      } catch (err) {
        console.error('❌ Failed to convert teknisi signature:', err.message)
      }
    }

    if (!pelangganSignBase64.value && dataku.tanda_tangan_pelanggan) {
      const pelangganPath = toRelativeUploadPath(dataku.tanda_tangan_pelanggan)
      console.log('🔄 Converting Pelanggan signature from path:', pelangganPath)
      try {
        pelangganSignBase64.value = await convertImageUrlToBase64(pelangganPath)
        console.log('✅ Pelanggan Base64 converted successfully')
      } catch (err) {
        console.error('❌ Failed to convert pelanggan signature:', err.message)
      }
    }

    console.log('✨ Final Base64 Status:')
    console.log('  - Teknisi:', teknisiSignBase64.value ? 'Ready ✓' : 'Not available')
    console.log('  - Pelanggan:', pelangganSignBase64.value ? 'Ready ✓' : 'Not available')

    console.log('📸 Signature Base64 status:')
    console.log('  - Teknisi Base64:', teknisiSignBase64.value ? 'Loaded ✓' : 'Not available')
    console.log('  - Pelanggan Base64:', pelangganSignBase64.value ? 'Loaded ✓' : 'Not available')

    status.value = dataku.status || ''

    console.log('Work order data successfully loaded for status:', status.value)
    console.log('═══════════════════════════════════════════✅')
  } catch (error) {
    console.error('❌ ERROR FETCHING WORK ORDER')
    console.error('═══════════════════════════════════════════')
    console.error('🔹 Error Message:', error.message)
    console.error('🔹 Error Code:', error.code)
    console.error('🔹 Error Stack:', error.stack)

    // Response error details
    if (error.response) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.error('📡 BACKEND RESPONSE ERROR')
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.error('🔹 Status Code:', error.response.status)
      console.error('🔹 Status Text:', error.response.statusText)
      console.error('🔹 Response Headers:', error.response.headers)
      console.error('🔹 Response Data:', error.response.data)
      console.error('🔹 Response Data (JSON):', JSON.stringify(error.response.data, null, 2))
      console.error('🔹 Error Message from Backend:', error.response.data?.message)
      console.error('🔹 Error Code from Backend:', error.response.data?.code)
    }

    // Request details
    if (error.request) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.error('📤 REQUEST DETAILS')
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.error('🔹 URL:', error.request.responseURL)
      console.error('🔹 Method:', error.request.method)
      console.error('🔹 Status:', error.request.status)
      console.error('🔹 Status Text:', error.request.statusText)
    }

    console.error('═══════════════════════════════════════════')
    console.error('Full Error Object:', error)

    const errorMessage =
      error.response?.data?.message || error.message || 'Gagal memuat data work order'
    message_toast.value = `Error: ${errorMessage}. ID yang diakses: ${workorder_id}`
    show_toast.value = true
  } finally {
    loadingStore.hide()
  }
}

async function createWorkOrder() {
  try {
    loadingStore.show()
    const response = await api.post(`wo/penyewaan/update/${workorder_id}`, formData.value)
    console.log('Work order created:', response.data.data)
    console.log('Form Data Sent:', formData.value)
    message_toast.value = response.data.message || 'Work order berhasil diperbaharui.'
    show_toast.value = true
  } catch (error) {
    console.error('Error creating work order:', error)
    message_toast.value = error.message || 'Gagal membuat work order.'
    show_toast.value = true
  } finally {
    loadingStore.hide()
  }
}

async function getCustomers() {
  try {
    const res = await axios.get(`${BASE_URL}/customers/all`)
    customers.value = Array.isArray(res?.data?.data) ? res.data.data : []
    console.log('Data Customers: ', customers.value)
  } catch (error) {
    console.error('Error fetching customers:', error)
    customers.value = []
  }
}

// Ambil data teknisi
async function getPegawai() {
  try {
    const response = await axios.get(`${BASE_URL}wo/pegawai/list`)
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
    const rel = toRelativeUploadPath(tech.tanda_tangan)
    return rel || tech.tanda_tangan
  }
  return null
})

const router = useRouter()
function createSalesOrder() {
  router.push({
    name: 'create sales order maintenance',
    query: {
      customer_id: selectedCustomerId.value,
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

function previewPdfJsPdf() {
  const { generatePdf } = useWorkOrderPdf()

  // Prepare checklist data structure
  const checklistData = {
    unit: [
      {
        label: '1. Unit Indoor',
        check: formData.value.checkIndoor,
        ket: formData.value.keteranganIndoor,
      },
      {
        label: '2. Unit Outdoor',
        check: formData.value.checkOutdoor,
        ket: formData.value.keteranganOutdoor,
      },
      { label: '3. Pipa AC', check: formData.value.checkPipa, ket: formData.value.keteranganPipa },
      {
        label: '4. Selang Buangan',
        check: formData.value.checkSelang,
        ket: formData.value.keteranganSelang,
      },
      {
        label: '5. Kabel dan Asesori',
        check: formData.value.checkKabel,
        ket: formData.value.keteranganKabel,
      },
    ],
    install: [
      {
        label: '1. Instalasi Indoor',
        check: formData.value.checkInstIndoor,
        ket: formData.value.keteranganInstIndoor,
      },
      {
        label: '2. Instalasi Outdoor',
        check: formData.value.checkInstOutdoor,
        ket: formData.value.keteranganInstOutdoor,
      },
      {
        label: '3. Instalasi Listrik',
        check: formData.value.checkInstListrik,
        ket: formData.value.keteranganInstListrik,
      },
      {
        label: '4. Instalasi Pipa',
        check: formData.value.checkInstPipa,
        ket: formData.value.keteranganInstPipa,
      },
      {
        label: '5. Instalasi Buangan',
        check: formData.value.checkBuangan,
        ket: formData.value.keteranganBuangan,
      },
      {
        label: '6. Vaccum',
        check: formData.value.checkVaccum,
        ket: formData.value.keteranganVaccum,
      },
      {
        label: '7. Tekanan Freon',
        check: formData.value.checkFreon,
        ket: formData.value.keteranganFreon,
      },
      {
        label: '8. Arus (Ampere)',
        check: formData.value.checkArus,
        ket: formData.value.keteranganArus,
      },
      {
        label: '9. Temperatur Evap.',
        check: formData.value.checkEva,
        ket: formData.value.keteranganEva,
      },
      {
        label: '10. Temperatur Kond.',
        check: formData.value.checkKondensor,
        ket: formData.value.keteranganKondensor,
      },
    ],
    dismantle: [
      {
        label: '1. Unit Indoor',
        check: formData.value.checkIndoorB,
        ket: formData.value.keteranganIndoorB,
      },
      {
        label: '2. Unit Outdoor',
        check: formData.value.checkOutdoorB,
        ket: formData.value.keteranganOutdoorB,
      },
      {
        label: '3. Pipa AC',
        check: formData.value.checkPipaB,
        ket: formData.value.keteranganPipaB,
      },
      {
        label: '4. Selang Buangan',
        check: formData.value.checkSelangB,
        ket: formData.value.keteranganSelangB,
      },
      {
        label: '5. Kabel dan Asesori',
        check: formData.value.checkKabelB,
        ket: formData.value.keteranganKabelB,
      },
    ],
  }

  // Get teknisi name
  const teknisiName = teknisi.value.find((t) => t.id === formData.value.teknisi_id)?.nama || ''

  // Call composable with clean data structure
  generatePdf({
    woNumber: no_wo.value || '-',
    customer: {
      nama: nama_pelanggan.value || '-',
      alamat: alamat.value || '-',
      hp: no_hp.value || '-',
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
  })
}

// Alias untuk kompatibilitas
// eslint-disable-next-line no-unused-vars
function generateJsPdfReport() {
  previewPdfJsPdf()
}

// Lifecycle
onMounted(() => {
  getForNewWorkOrder()
  getPegawai()
  getCustomers()
  getWorkOrderPenyewaanByID()
})
</script>

<style lang="scss" scoped></style>
