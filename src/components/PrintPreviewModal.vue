<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="flex justify-between items-center p-6 border-b">
        <h2 class="text-2xl font-bold text-gray-800">Preview PDF Workorder</h2>
        <button @click="close" class="text-gray-500 hover:text-gray-700 text-2xl font-bold">
          ✕
        </button>
      </div>

      <!-- Preview Area -->
      <div class="flex-1 overflow-y-auto bg-gray-100 p-4">
        <div
          ref="previewRef"
          id="print-preview-content"
          class="bg-white p-8 mx-auto"
          style="max-width: 8.5in"
        >
          <!-- HTML content will be rendered here via v-html -->
          <div v-html="htmlContent" class="text-gray-900"></div>
        </div>
      </div>

      <!-- Footer with Action Buttons -->
      <div class="flex gap-3 p-6 border-t bg-gray-50 justify-end">
        <button
          @click="close"
          class="px-6 py-2 bg-gray-400 text-white font-semibold rounded-md hover:bg-gray-500 transition"
        >
          Tutup
        </button>
        <button
          @click="downloadPDF"
          class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm14 1v6H4V7h12z"
            ></path>
            <path d="M10 14l-3-3m0 0l3-3m-3 3h6"></path>
          </svg>
          Download PDF
        </button>
        <button
          @click="printPDF"
          class="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
          </svg>
          Print
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import html2pdf from 'html2pdf.js'

const previewRef = ref(null)

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  htmlContent: {
    type: String,
    default: '',
  },
  fileName: {
    type: String,
    default: 'workorder.pdf',
  },
})

const emit = defineEmits(['close'])

function close() {
  emit('close')
}

function downloadPDF() {
  const element = previewRef.value
  if (!element) return
  const opt = {
    margin: 10,
    filename: props.fileName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
  }
  html2pdf().set(opt).from(element).save()
}

function printPDF() {
  const element = previewRef.value
  if (!element) return
  const printWindow = window.open('', '', 'width=900,height=700')
  if (!printWindow) return
  const doc = printWindow.document
  doc.open()
  doc.write('<html><head><title>Print Workorder</title>')
  doc.write(
    '<style>body{margin:0;padding:24px;font-family:Arial, sans-serif;} .page{max-width:8.5in;margin:0 auto;} .page img{max-width:100%; height:auto;} </style>'
  )
  doc.write('</head><body>')
  doc.write(`<div class="page">${element.innerHTML}</div>`)
  doc.write('</body></html>')
  doc.close()
  printWindow.focus()
  printWindow.onload = () => {
    printWindow.print()
    printWindow.close()
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
