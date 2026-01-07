<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-gray-800 text-center mb-6">Work Order Form</h2>

    <!-- Customer Information Section -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
      <div>
        <label for="customerName" class="block text-sm font-medium text-gray-700"
          >Customer Name</label
        >
        <input
          v-model="form.customerName"
          type="text"
          id="customerName"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter customer name"
        />
      </div>
      <div>
        <label for="ac" class="block text-sm font-medium text-gray-700">AC</label>
        <input
          v-model="form.ac"
          type="text"
          id="ac"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Masukkan data AC"
        />
      </div>
    </div>

    <!-- Keluhan Pelanggan -->
    <div class="mb-6">
      <label for="keluhan" class="block text-sm font-medium text-gray-700 mb-2"
        >Keluhan Pelanggan</label
      >
      <select
        v-model="form.keluhan"
        id="keluhan"
        class="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>Pilih keluhan</option>
        <option>Tidak dingin</option>
        <option>Mati Total</option>
        <option>Suara Berisik</option>
        <option>Lainnya</option>
      </select>
    </div>

    <!-- Data Unit AC -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
      <div>
        <label for="acBrand" class="block text-sm font-medium text-gray-700">Brand</label>
        <input
          v-model="form.acBrand"
          type="text"
          id="acBrand"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Masukkan brand AC"
        />
      </div>
      <div>
        <label for="acType" class="block text-sm font-medium text-gray-700">Type</label>
        <input
          v-model="form.acType"
          type="text"
          id="acType"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Masukkan type AC"
        />
      </div>
      <div>
        <label for="acKapasitas" class="block text-sm font-medium text-gray-700">Kapasitas</label>
        <input
          v-model="form.acKapasitas"
          type="text"
          id="acKapasitas"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Masukkan kapasitas AC"
        />
      </div>
      <div>
        <label for="pendingin" class="block text-sm font-medium text-gray-700"
          >Jenis Pendinginan</label
        >
        <select
          v-model="form.pendingin"
          id="pendingin"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Pilih jenis pendinginan</option>
          <option>Refrigerant</option>
          <option>Freon</option>
        </select>
      </div>
    </div>

    <!-- Service Date -->
    <div class="mb-6">
      <label for="serviceDate" class="block text-sm font-medium text-gray-700">Service Date</label>
      <input
        v-model="form.serviceDate"
        type="date"
        id="serviceDate"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Checklist Pengecekan Indoor -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-2">A. Pengecekan Indoor</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          v-for="(item, idx) in indoorItems"
          :key="'indoor-' + idx"
          class="flex items-center gap-4"
        >
          <span class="w-40">{{ item }}</span>
          <select
            v-model="form.indoorCheck[item]"
            class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Baik">Baik</option>
            <option value="Rusak">Rusak</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Checklist Pengecekan Outdoor -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-2">B. Pengecekan Outdoor</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          v-for="(item, idx) in outdoorItems"
          :key="'outdoor-' + idx"
          class="flex items-center gap-4"
        >
          <span class="w-40">{{ item }}</span>
          <select
            v-model="form.outdoorCheck[item]"
            class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Baik">Baik</option>
            <option value="Rusak">Rusak</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Catatan / Notes -->
    <div class="mb-6">
      <label for="notes" class="block text-sm font-medium text-gray-700 mb-2"
        >Catatan / Informasi Lain &amp; Hasil Pekerjaan</label
      >
      <textarea
        v-model="form.notes"
        id="notes"
        rows="3"
        class="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Tulis informasi lain dan hasil pekerjaan di sini..."
      ></textarea>
    </div>
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800">List Biaya Jasa dan Suku Cadang</h3>
      <div class="space-y-4">
        <div v-for="(item, index) in form.items" :key="index" class="flex items-center space-x-4">
          <input
            v-model="item.code"
            type="text"
            class="block w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Kode"
          />
          <select
            v-model="item.name"
            class="block w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Pilih Jasa/Suku Cadang</option>
            <option>Pengecekan</option>
            <option>Service/Cuci Ac</option>
            <option>Tambah Refigerant</option>
            <option>Isi Refigerant</option>
            <option>Bongkar</option>
            <option>Bongkar dan Pasang</option>
            <option>Pasang</option>
            <option>Perbaikan</option>
            <option>Kompressor</option>
            <option>Pipa Outdoor</option>
            <option>Thermostat</option>
            <option>LED</option>
            <option>Lainnya</option>
          </select>
          <input
            v-model="item.qty"
            type="number"
            class="block w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Qty"
          />
          <input
            v-model="item.price"
            type="number"
            class="block w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Harga"
          />
        </div>
      </div>
      <button
        @click="addItem"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Tambah Item
      </button>
    </div>

    <!-- Subtotal, Total, and Payment Method -->
    <div class="space-y-6 mb-6">
      <div class="flex justify-between">
        <span class="font-medium text-gray-700">Subtotal Jasa</span>
        <span>{{ formatCurrency(form.subtotalJasa) }}</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium text-gray-700">Total Tagihan</span>
        <span>{{ formatCurrency(form.totalTagihan) }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="font-medium text-gray-700">DP</span>
        <input
          v-model.number="form.dp"
          type="number"
          min="0"
          class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-32 text-right"
        />
      </div>
      <div class="flex justify-between">
        <span class="font-medium text-gray-700">Sisa</span>
        <span>{{ formatCurrency(form.sisa) }}</span>
      </div>

      <div class="mt-6">
        <label for="paymentMethod" class="block text-sm font-medium text-gray-700"
          >Payment Method</label
        >
        <input
          v-model="form.paymentMethod"
          type="text"
          id="paymentMethod"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter payment method"
        />
      </div>
    </div>

    <div class="text-center">
      <button
        @click="submitForm"
        class="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Submit Work Order
      </button>
    </div>

    <!-- Print and Download Buttons -->
    <div class="flex justify-center mt-6 space-x-4">
      <button
        @click="printForm"
        class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
      >
        Print
      </button>
      <button
        disabled
        class="px-4 py-2 bg-gray-400 text-gray-600 rounded-md cursor-not-allowed"
        title="Fitur sedang diperbaharui"
      >
        Download PDF (Sedang Diperbaharui)
      </button>
    </div>
  </div>
</template>

<script>
// import jsPDF from 'jspdf' - Migrasi ke pdf-lib sedang berlangsung

export default {
  data() {
    return {
      form: {
        customerName: '',
        ac: '',
        serviceDate: '',
        paymentMethod: '',
        dp: 0,
        subtotalJasa: 0,
        totalTagihan: 0,
        sisa: 0,
        items: [{ code: '', name: '', qty: 0, price: 0 }],
        keluhan: '',
        acBrand: '',
        acType: '',
        acKapasitas: '',
        pendingin: '',
        jenisPekerjaan: '',
        indoorCheck: {
          Evaporator: 'Baik',
          'Fan/Blower Indoor': 'Baik',
          'Kondisi Swing': 'Baik',
          'Tegangan Input': 'Baik',
        },
        outdoorCheck: {
          Kondensor: 'Baik',
          'Fan Outdoor': 'Baik',
          Capasitor: 'Baik',
          'Tekanan Freon': 'Baik',
        },
        notes: '',
      },
      indoorItems: ['Evaporator', 'Fan/Blower Indoor', 'Kondisi Swing', 'Tegangan Input'],
      outdoorItems: ['Kondensor', 'Fan Outdoor', 'Capasitor', 'Tekanan Freon'],
    }
  },
  computed: {
    totalJasa() {
      return this.form.items.reduce((acc, item) => acc + item.qty * item.price, 0)
    },
    totalTagihan() {
      return this.totalJasa + this.form.subtotalJasa
    },
  },
  methods: {
    addItem() {
      this.form.items.push({ code: '', name: '', qty: 0, price: 0 })
    },
    submitForm() {
      console.log(this.form)
      // Handle form submission logic
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(amount)
    },
    printForm() {
      window.print() // Print the page
    },
  },
}
</script>

<style scoped>
/* Custom styling if needed */
</style>
