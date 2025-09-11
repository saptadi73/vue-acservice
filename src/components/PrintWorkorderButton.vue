<template>
  <div>
    <button
      @click="printPDF"
      class="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold shadow hover:bg-blue-700 transition mb-4"
    >
      Print PDF Workorder
    </button>
  </div>
</template>

<script setup>
import html2pdf from 'html2pdf.js'

function printPDF() {
  // Ambil elemen utama workorder dengan id
  const el = document.getElementById('workorder-print-area')
  if (!el) {
    alert('Area workorder tidak ditemukan!')
    return
  }
  html2pdf()
    .set({
      margin: 0.2,
      filename: 'workorder.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    })
    .from(el)
    .save()
}
</script>
