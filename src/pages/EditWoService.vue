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
                <td class="font-semibold text-gray-900">: {{ tanggal }}</td>
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
                <td class="pr-4 font-medium text-gray-700">Keluhan</td>
                <td class="font-semibold text-gray-900">
                  <select
                    v-model="formData.keluhan"
                    class="bg-gray-100 border border-gray-300 rounded px-2 py-1 text-sm"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  >
                    <option value="" disabled selected>Pilih Keluhan</option>
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
                    v-model="formData.keterangan"
                    class="text-sm"
                    type="text"
                    id="keterangan"
                    placeholder="Isikan keterangan Tambahan"
                    :disabled="status === 'selesai' && pelangganSignUrl"
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
                    v-model="formData.pengecekan"
                    type="text"
                    id="pengecekan"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="text-sm pr-4 font-medium text-gray-700">2. Service</td>
                <td class="text-gray-900">
                  <input
                    v-model="formData.service"
                    id="service"
                    type="text"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 text-sm font-medium text-gray-700">3. Tambah Freon</td>
                <td class="text-gray-900">
                  <input
                    v-model="formData.tambah_freon"
                    id="tambahfreon"
                    type="text"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 text-sm font-medium text-gray-700">4. Isi Freon</td>
                <td class="text-gray-900">
                  <input
                    v-model="formData.isi_freon"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
                    id="isifreon"
                    type="text"
                    :disabled="status === 'selesai' && pelangganSignUrl"
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
                    v-model="formData.bongkar"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
                    id="bongkar"
                    type="text"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 text-sm font-medium text-gray-700">6. Pasang</td>
                <td class="text-gray-900">
                  <input
                    v-model="formData.pasang"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
                    id="pasang"
                    type="text"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 text-sm font-medium text-gray-700">7. Bongkar+Pasang</td>
                <td class="text-gray-900">
                  <input
                    v-model="formData.bongkar_pasang"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
                    id="bongkarpasang"
                    type="text"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 text-sm font-medium text-gray-700">8. Perbaikan</td>
                <td class="text-gray-900">
                  <input
                    v-model="formData.perbaikan"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
                    id="perbaikan"
                    type="text"
                    :disabled="status === 'selesai' && pelangganSignUrl"
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
                  <input
                    type="checkbox"
                    id="checkEvaporator"
                    v-model="formData.check_evaporator"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_evaporator"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganEvaporator"
                    type="text"
                    v-model="formData.keterangan_evaporator"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">2. Fan/Blower Indoor</td>
                <td class="font-semibold text-gray-900">
                  <input
                    type="checkbox"
                    id="checkFanIndoor"
                    v-model="formData.check_fan_indoor"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_fan_indoor"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganFanIndoor"
                    type="text"
                    v-model="formData.keterangan_fan_indoor"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">3. Kondisi Swing</td>
                <td class="font-semibold text-gray-900">
                  <input
                    id="checkSwing"
                    type="checkbox"
                    v-model="formData.check_swing"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_swing"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganSwing"
                    type="text"
                    v-model="formData.keterangan_swing"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">4. Tegangan Input</td>
                <td class="font-semibold text-gray-900">
                  <input
                    id="checkTeganganInput"
                    type="checkbox"
                    v-model="formData.check_tegangan_input"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_tegangan_input"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganTeganganInput"
                    type="text"
                    v-model="formData.keterangan_tegangan_input"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">5. Thermis Sensor</td>
                <td class="font-semibold text-gray-900">
                  <input
                    id="checkThermis"
                    type="checkbox"
                    v-model="formData.check_thermis"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_thermis"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganThermis"
                    type="text"
                    v-model="formData.keterangan_thermis"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">6. Temperatur</td>
                <td class="font-semibold text-gray-900">
                  <input
                    id="checkTemperaturIndoor"
                    type="checkbox"
                    v-model="formData.check_temperatur_indoor"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_temperatur_indoor"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganTemperaturIndoor"
                    type="text"
                    v-model="formData.keterangan_temperatur_indoor"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">7. Lain-lain</td>
                <td class="font-semibold text-gray-900">
                  <input
                    id="checkLainIndoor"
                    type="checkbox"
                    v-model="formData.check_lain_indoor"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_lain_indoor"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganLainIndoor"
                    type="text"
                    v-model="formData.keterangan_lain_indoor"
                    :disabled="status === 'selesai' && pelangganSignUrl"
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
                  <input
                    type="checkbox"
                    id="checkKondensor"
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
              <tr>
                <td class="pr-4 font-medium text-gray-700">2. Fan/Blower Indoor</td>
                <td class="font-semibold text-gray-900">
                  <input
                    type="checkbox"
                    id="checkFanOutdoor"
                    v-model="formData.check_fan_outdoor"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_fan_outdoor"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganFanOutdoor"
                    type="text"
                    v-model="formData.keterangan_fan_outdoor"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">3. Kapasitor</td>
                <td class="font-semibold text-gray-900">
                  <input
                    id="checkKapasitor"
                    type="checkbox"
                    v-model="formData.check_kapasitor"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_kapasitor"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganKapasitor"
                    type="text"
                    v-model="formData.keterangan_kapasitor"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">4. Tekanan Freon</td>
                <td class="font-semibold text-gray-900">
                  <input
                    id="checkTekananFreon"
                    type="checkbox"
                    v-model="formData.check_tekanan_freon"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_tekanan_freon"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganTekananFreon"
                    type="text"
                    v-model="formData.keterangan_tekanan_freon"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">5. Arus(Ampere)</td>
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
                <td class="pr-4 font-medium text-gray-700">6. Temperatur</td>
                <td class="font-semibold text-gray-900">
                  <input
                    id="checkTemperaturOutdoor"
                    type="checkbox"
                    v-model="formData.check_temperatur_outdoor"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_temperatur_outdoor"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganTemperaturOutdoor"
                    type="text"
                    v-model="formData.keterangan_temperatur_outdoor"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
              </tr>
              <tr>
                <td class="pr-4 font-medium text-gray-700">7. Lain-lain</td>
                <td class="font-semibold text-gray-900">
                  <input
                    id="checkLainOutdoor"
                    type="checkbox"
                    v-model="formData.check_lain_outdoor"
                    :disabled="status === 'selesai' && pelangganSignUrl"
                  />
                </td>
                <td class="pr-4 font-medium text-gray-700">
                  <input
                    v-if="!formData.check_lain_outdoor"
                    class="text-sm border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
                    id="keteranganLainOutdoor"
                    type="text"
                    v-model="formData.keterangan_lain_outdoor"
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
          id="hasil"
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
                vi-model="formData.teknisi_id"
                id="teknisiSelect"
                v-model="formData.teknisi_id"
                class="bg-transparent text-blue-700 font-semibold"
                :disabled="status === 'selesai' && pelangganSignUrl"
              >
                <option value="" disabled selected>Pilih Teknisi</option>
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
                id="file"
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
  </div>
  <loading-overlay />
  <ToastCard v-if="show_toast" :message="message_toast" @close="tutupToast" />
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
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
const tanggal = ref(
  new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
)

const formData = ref({
  customer_asset_id: '',
  teknisi_id: null,
  keluhan: '',
  keterangan: '',
  pengecekan: '',
  service: '',
  tambah_freon: '',
  isi_freon: '',
  bongkar: '',
  pasang: '',
  bongkar_pasang: '',
  perbaikan: '',
  check_evaporator: false,
  keterangan_evaporator: '',
  check_fan_indoor: false,
  keterangan_fan_indoor: '',
  check_swing: false,
  keterangan_swing: '',
  check_tegangan_input: false,
  keterangan_tegangan_input: '',
  check_thermis: false,
  keterangan_thermis: '',
  check_temperatur_indoor: false,
  keterangan_temperatur_indoor: '',
  check_lain_indoor: false,
  keterangan_lain_indoor: '',
  check_kondensor: false,
  keterangan_kondensor: '',
  check_fan_outdoor: false,
  keterangan_fan_outdoor: '',
  check_kapasitor: false,
  keterangan_kapasitor: '',
  check_tekanan_freon: false,
  keterangan_tekanan_freon: '',
  check_arus: false,
  keterangan_arus: '',
  check_temperatur_outdoor: false,
  keterangan_temperatur_outdoor: '',
  check_lain_outdoor: false,
  keterangan_lain_outdoor: '',
  hasil_pekerjaan: '',
})

async function createWorkOrder() {
  loadingStore.show()
  try {
    const response = await api.post(
      `${BASE_URL}wo/service/update/${customerAssetId}`,
      formData.value,
    )
    console.log('Work Order Created:', response.data.data)
    console.log('Form datanya :', formData.value)
    show_toast.value = true
    message_toast.value = response.data.message || 'Work order created successfully.'
    // Optionally reset form or provide user feedback here
  } catch (error) {
    console.error('Error creating work order:', error)
    show_toast.value = true
    message_toast.value = error.message || 'Failed to create work order.'
  } finally {
    loadingStore.hide()
  }
}

async function createPelangganSignLink() {
  loadingStore.show()
  try {
    const response = await api.post(`wo/service/sign/${customerAssetId}`)
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

async function getForNewWorkOrder(id) {
  loadingStore.show()
  try {
    const response = await axios.get(`${BASE_URL}wo/service/${id}`)
    formData.value.customer_asset_id = response.data.data.customer_asset_id
    formData.value.teknisi_id = response.data.data.teknisi_id || null
    formData.value.keluhan = response.data.data.keluhan || ''
    formData.value.keterangan = response.data.data.keterangan || ''
    formData.value.pengecekan = response.data.data.pengecekan || ''
    formData.value.service = response.data.data.service || ''
    formData.value.tambah_freon = response.data.data.tambah_freon || ''
    formData.value.isi_freon = response.data.data.isi_freon || ''
    formData.value.bongkar = response.data.data.bongkar || ''
    formData.value.pasang = response.data.data.pasang || ''
    formData.value.bongkar_pasang = response.data.data.bongkar_pasang || ''
    formData.value.perbaikan = response.data.data.perbaikan || ''
    formData.value.hasil_pekerjaan = response.data.data.hasil_pekerjaan || ''
    formData.value.check_evaporator = response.data.data.check_evaporator || false
    formData.value.keterangan_evaporator = response.data.data.keterangan_evaporator || ''
    formData.value.check_fan_indoor = response.data.data.check_fan_indoor || false
    formData.value.keterangan_fan_indoor = response.data.data.keterangan_fan_indoor || ''
    formData.value.check_swing = response.data.data.check_swing || false
    formData.value.keterangan_swing = response.data.data.keterangan_swing || ''
    formData.value.check_tegangan_input = response.data.data.check_tegangan_input || false
    formData.value.keterangan_tegangan_input = response.data.data.keterangan_tegangan_input || ''
    formData.value.check_thermis = response.data.data.check_thermis || false
    formData.value.keterangan_thermis = response.data.data.keterangan_thermis || ''
    formData.value.check_temperatur_indoor = response.data.data.check_temperatur_indoor || false
    formData.value.keterangan_temperatur_indoor =
      response.data.data.keterangan_temperatur_indoor || ''
    formData.value.check_lain_indoor = response.data.data.check_lain_indoor || false
    formData.value.keterangan_lain_indoor = response.data.data.keterangan_lain_indoor || ''
    formData.value.check_kondensor = response.data.data.check_kondensor || false
    formData.value.keterangan_kondensor = response.data.data.keterangan_kondensor || ''
    formData.value.check_fan_outdoor = response.data.data.check_fan_outdoor || false
    formData.value.keterangan_fan_outdoor = response.data.data.keterangan_fan_outdoor || ''
    formData.value.check_kapasitor = response.data.data.check_kapasitor || false
    formData.value.keterangan_kapasitor = response.data.data.keterangan_kapasitor || ''
    formData.value.check_tekanan_freon = response.data.data.check_tekanan_freon || false
    formData.value.keterangan_tekanan_freon = response.data.data.keterangan_tekanan_freon || ''
    formData.value.check_arus = response.data.data.check_arus || false
    formData.value.keterangan_arus = response.data.data.keterangan_arus || ''
    formData.value.check_temperatur_outdoor = response.data.data.check_temperatur_outdoor || false
    formData.value.keterangan_temperatur_outdoor =
      response.data.data.keterangan_temperatur_outdoor || ''
    formData.value.check_lain_outdoor = response.data.data.check_lain_outdoor || false
    formData.value.keterangan_lain_outdoor = response.data.data.keterangan_lain_outdoor || ''
    brand.value = response.data.data.customer_asset.brand.nama || ''
    model.value = response.data.data.customer_asset.model || ''
    tipe.value = response.data.data.customer_asset.tipe.nama || ''
    kapasitas.value = response.data.data.customer_asset.kapasitas || ''
    freon.value = response.data.data.customer_asset.freon || ''
    lokasi.value = response.data.data.customer_asset.lokasi || ''
    nama_pelanggan.value = response.data.data.customer_asset.customer.nama || ''
    alamat.value = response.data.data.customer_asset.customer.alamat || ''
    no_hp.value = response.data.data.customer_asset.customer.hp || ''
    kode_pelanggan.value = response.data.data.customer_asset.customer.kode_pelanggan || ''
    jenis_pelanggan.value = response.data.data.customer_asset.customer.jenis || ''
    pelangganSignUrl.value = response.data.data.tanda_tangan_pelanggan
      ? BASE_URL + response.data.data.tanda_tangan_pelanggan
      : null
    status.value = response.data.data.status || ''

    // nama_pelanggan.value = response.data.data.customer_nama
    // alamat.value = response.data.data.customer_alamat
    // no_hp.value = response.data.data.customer_hp
    // brand.value = response.data.data.brand
    // model.value = response.data.data.model
    // tipe.value = response.data.data.tipe
    // kapasitas.value = response.data.data.kapasitas
    // freon.value = response.data.data.freon
    // lokasi.value = response.data.data.lokasi
    // kode_pelanggan.value = response.data.data.customer_kode_pelanggan
    // jenis_pelanggan.value = response.data.data.customer_jenis
    console.log('Work Order Data:', response.data.data)
  } catch (error) {
    console.error('Error fetching work order data:', error)
  } finally {
    loadingStore.hide()
  }
}
async function getPegawai() {
  try {
    const response = await axios.get(`${BASE_URL}wo/pegawai/list`)
    teknisi.value = response.data.data
    console.log('Teknisi Data:', response.data.data)
  } catch (error) {
    console.error('Error fetching teknisi data:', error)
  }
}

onMounted(() => {
  console.log('Customer Asset ID:', customerAssetId)
  getForNewWorkOrder(customerAssetId)
  getPegawai()
})

const router = useRouter()
function createSalesOrder() {
  router.push({
    name: 'create sales order maintenance',
    query: {
      customer_id: formData.value.customer_asset_id,
      customer_name: nama_pelanggan.value,
      customer_address: alamat.value,
      customer_phone: no_hp.value,
    },
  })
}

import { computed } from 'vue'
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
const pelangganSignUrl = ref(null)
const status = ref('')

function onPelangganSignChange(e) {
  const file = e.target.files[0]
  if (file) {
    pelangganSignUrl.value = URL.createObjectURL(file)
  }
}
</script>

<style lang="scss" scoped></style>
