<template>
  <div class="invoice-container">
    <!-- Sales Order Header -->
    <div class="header">
      <div class="logo">YourCompanyName</div>
      <div class="invoice-info">
        <div class="invoice-number">Invoice #: {{ salesOrderNo }}</div>
        <div class="date">Date: {{ currentDate }}</div>
      </div>
    </div>

    <!-- Customer and Work Order Details -->
    <div class="section-title">Customer & Work Order Details</div>
    <table class="invoice-details" cellpadding="0" cellspacing="0">
      <tr>
        <td><strong>Customer Name:</strong> {{ formData.customerName }}</td>
        <td><strong>Work Order No:</strong> {{ formData.workOrderNo }}</td>
      </tr>
      <tr>
        <td><strong>Car License Plate:</strong> {{ formData.licensePlate }}</td>
        <td><strong>Brand:</strong> {{ formData.brand }}</td>
      </tr>
      <tr>
        <td><strong>Car Type:</strong> {{ formData.type }}</td>
        <td><strong>CC:</strong> {{ formData.cc }}</td>
      </tr>
    </table>

    <!-- Sales Order Lines -->
    <div class="section-title">Sales Order Lines</div>
    <table class="product-list" cellpadding="0" cellspacing="0">
      <thead>
        <tr>
          <th>No</th>
          <th>Product</th>
          <th>Quantity</th>
          <th>UOM</th>
          <th>Price</th>
          <th>Tax 11%</th>
          <th>Sub Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(line, index) in formData.salesOrderLines" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ line.product }}</td>
          <td>{{ line.quantity }}</td>
          <td>{{ line.uom }}</td>
          <td>{{ formatCurrency(line.price) }}</td>
          <td>{{ formatCurrency(calculateTaxForItem(line)) }}</td>
          <td>{{ formatCurrency(calculateSubTotalForItem(line)) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Tax & Total -->
    <div class="total">
      <div><strong>Tax (11%):</strong> {{ formatCurrency(tax) }}</div>
      <div>
        <strong>Total Price:</strong>
        <span class="total-price">{{ formatCurrency(total) }}</span>
      </div>
    </div>

    <!-- Download PDF Button - DISABLED -->
    <div class="download-button" style="opacity: 0.5; pointer-events: none">
      <button @click="downloadPDF" class="btn-download" disabled title="Fitur sedang diperbaharui">
        Download PDF (Sedang Diperbaharui)
      </button>
      <p style="font-size: 12px; color: #666; margin-top: 8px">
        Fitur export PDF sedang dimigrasikan ke teknologi yang lebih aman. Gunakan Print Browser
        (Ctrl+P) sebagai alternatif.
      </p>
    </div>
  </div>
</template>

<script>
// import { jsPDF } from 'jspdf' - Migrasi ke pdf-lib sedang berlangsung

export default {
  data() {
    return {
      salesOrderNo: this.generateSalesOrderNo(),
      currentDate: new Date().toISOString().slice(0, 10), // Today's date
      formData: {
        workOrderNo: 'WO123456',
        customerName: 'John Doe',
        licensePlate: 'B 1234 XYZ',
        brand: 'Toyota',
        type: 'Sedan',
        cc: '2000',
        salesOrderLines: [
          { product: 'Product A', quantity: 2, uom: 'PCS', price: 100000 },
          { product: 'Product B', quantity: 3, uom: 'PCS', price: 150000 },
        ],
      },
    }
  },
  computed: {
    // Calculate Total and Tax once
    total() {
      const total = this.formData.salesOrderLines.reduce(
        (acc, line) => acc + this.calculateSubTotalForItem(line),
        0,
      )
      return total
    },
    tax() {
      return this.total * 0.11
    },
  },
  methods: {
    generateSalesOrderNo() {
      return Math.random().toString(36).substr(2, 10).toUpperCase() // Random alphanumeric string
    },

    formatCurrency(amount) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(amount)
    },

    calculateTaxForItem(line) {
      return line.price * 0.11 // Calculate 11% tax for the product
    },

    calculateSubTotalForItem(line) {
      return (line.price + this.calculateTaxForItem(line)) * line.quantity // Price + tax, then multiply by quantity
    },
  },
}
</script>

<style scoped>
.invoice-container {
  font-family: 'Arial', sans-serif;
  margin: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
}

.invoice-number,
.date {
  font-size: 14px;
  color: #777;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-top: 20px;
}

.invoice-details,
.product-list {
  width: 100%;
  margin-top: 10px;
  border-collapse: collapse;
}

.invoice-details td,
.product-list td {
  padding: 10px;
  border: 1px solid #ddd;
}

.invoice-details th,
.product-list th {
  background-color: #f4f7fb;
  padding: 12px;
}

.total {
  font-size: 16px;
  font-weight: bold;
  margin-top: 20px;
}

.total .total-price {
  color: #4a90e2;
}

.btn-download {
  background-color: #4a90e2;
  color: white;
  padding: 10px 20px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 30px;
}

.btn-download:hover {
  background-color: #3578e5;
}
</style>
