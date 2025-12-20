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
                <td class="font-semibold text-gray-900">: WO-001</td>
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
    <button
      class="bg-slate-600 font-montserrat text-center cursor-pointer text-white font-bold w-full p-2 rounded-md"
      @click="createWorkOrder"
      :disabled="status === 'selesai' && pelangganSignUrl"
    >
      simpan perubahan
    </button>
    <button
      class="bg-green-600 mt-3 font-montserrat text-center cursor-pointer text-white font-bold w-full p-2 rounded-md"
      @click="createPelangganSignLink"
      :disabled="status === 'selesai' && pelangganSignUrl"
    >
      Buat Link untuk Pelanggan
    </button>
    <button
      class="bg-blue-600 mt-3 font-montserrat text-center cursor-pointer text-white font-bold w-full p-2 rounded-md hover:bg-blue-700"
      @click="createSalesOrder"
    >
      + Buat Sales Order
    </button>
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

const loadingStore = useLoadingStore()
const route = useRoute()
const workorder_id = route.params.id

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
  if (!workorder_id) return
  try {
    const response = await api.get(`/wo/penyewaan/${workorder_id}`)
    const dataku = response.data.data
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
      ? BASE_URL + dataku.tanda_tangan_pelanggan
      : null
    status.value = dataku.status || ''

    console.log('Fetched work order data:', dataku)
  } catch (error) {
    console.error('Error fetching work order by ID:', error)
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
    if (tech.tanda_tangan.startsWith('http') || tech.tanda_tangan.startsWith('data:')) {
      return tech.tanda_tangan
    }
    return BASE_URL + tech.tanda_tangan
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

// Lifecycle
onMounted(() => {
  getForNewWorkOrder()
  getPegawai()
  getCustomers()
  getWorkOrderPenyewaanByID()
})
</script>

<style lang="scss" scoped></style>
