import { jsPDF } from 'jspdf'
import { normalizeBase64Image, isValidBase64Image } from '@/utils/imageBase64'

export function useWorkOrderPdf() {
  async function generatePdf(
    { woNumber, customer, unit, checklist, hasilPekerjaan, teknisi, signatures },
    options = {},
  ) {
    console.log('📄 generatePdf() called')
    console.log('  - Teknisi signature:', signatures.teknisi ? 'Received' : 'Not received')
    console.log('  - Pelanggan signature:', signatures.pelanggan ? 'Received' : 'Not received')

    const doc = new jsPDF('p', 'mm', 'a4')

    const marginX = 15
    const pageWidth = 210
    let y = 15

    /* ================= HEADER ================= */
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.text('WO Penyewaan AC Lestari', marginX, y)

    y += 6
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('No. Telp. 0859 4321 3369', marginX, y)

    y += 8
    doc.line(marginX, y, pageWidth - marginX, y)

    /* ================= CUSTOMER ================= */
    y += 10
    doc.setFontSize(9)
    doc.text(`No. WO : ${woNumber}`, pageWidth - marginX - 50, y)
    doc.text(`Nama Pelanggan : ${customer.nama}`, marginX, y)
    doc.text(`Alamat : ${customer.alamat}`, marginX, y + 5)
    doc.text(`No. HP : ${customer.hp}`, marginX, y + 10)

    /* ================= UNIT ================= */
    y += 20
    drawSection(doc, 'Spesifikasi Unit AC', y)
    y += 12

    doc.text(`Brand : ${unit.brand}`, marginX, y)
    doc.text(`Model : ${unit.model}`, marginX, y + 5)
    doc.text(`Freon : ${unit.freon}`, marginX, y + 10)

    doc.text(`Tipe : ${unit.tipe}`, pageWidth - marginX - 50, y)
    doc.text(`Kapasitas : ${unit.kapasitas}`, pageWidth - marginX - 50, y + 5)
    doc.text(`Lokasi : ${unit.lokasi}`, pageWidth - marginX - 50, y + 10)

    /* ================= CHECKLIST ================= */
    y += 20
    drawSection(doc, 'Pengecekan Teknisi', y)
    y += 12

    const col1X = marginX
    const col2X = marginX + 65
    const col3X = marginX + 130

    drawChecklistBox(doc, col1X, y, 'Unit AC & Aksesoris', checklist.unit)
    drawChecklistBox(doc, col2X, y, 'Pemasangan', checklist.install)
    drawChecklistBox(doc, col3X, y, 'Pekerjaan Bongkar', checklist.dismantle)

    y += 80

    /* ================= HASIL ================= */
    drawSection(doc, 'Informasi Tambahan & Hasil Pekerjaan', y)
    y += 8

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    const maxWidth = pageWidth - marginX * 2
    const splitText = doc.splitTextToSize(hasilPekerjaan || '', maxWidth - 4)
    doc.text(splitText, marginX + 2, y)

    y += splitText.length * 6 + 8

    /* ================= SIGNATURE ================= */
    if (y > 220) {
      doc.addPage()
      y = 15
    }

    drawSection(doc, 'Tanda Tangan', y)
    y += 10

    await drawSignatureBox(doc, marginX + 10, y, 'Teknisi', teknisi.nama, signatures.teknisi)
    await drawSignatureBox(
      doc,
      pageWidth - marginX - 70,
      y,
      'Pelanggan',
      customer.nama,
      signatures.pelanggan,
    )

    /* ================= OUTPUT ================= */
    if (options.preview) {
      // Return blob URL for preview iframe/modal
      return doc.output('bloburl')
    }

    const blob = doc.output('blob')
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
    return null
  }

  return { generatePdf }
}

function drawSection(doc, title, y) {
  doc.setFillColor(200, 220, 255)
  doc.rect(15, y - 8, 180, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text(title, 105, y - 2, { align: 'center' })
}

function drawChecklistBox(doc, x, y, title, items) {
  const boxWidth = 60
  const boxHeight = 70

  doc.rect(x, y, boxWidth, boxHeight)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.text(title, x + boxWidth / 2, y + 3, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)

  let itemY = y + 6
  items.forEach((item) => {
    doc.rect(x + 2, itemY - 2.5, 2, 2)
    if (item.check) {
      doc.text('X', x + 2.3, itemY - 1)
    }

    // Tampilkan label + keterangan dalam satu baris
    const text = item.ket ? `${item.label} (${item.ket})` : item.label
    doc.text(text, x + 5, itemY)

    itemY += 5
  })
}

async function drawSignatureBox(doc, x, y, title, name, signature) {
  const boxW = 70
  const boxH = 55 // taller box for better signature proportion

  doc.rect(x, y, boxW, boxH)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text(title, x + boxW / 2, y + 5, { align: 'center' })

  const base64 = signature?.base64 || (typeof signature === 'string' ? signature : null)
  const url = signature?.url || null

  console.log(`🖼️ [${title}] Signature rendering:`)
  console.log('  - Base64 received:', base64 ? 'Yes' : 'No')
  console.log('  - URL received:', url ? url : 'No')

  let imageAdded = false

  if (base64) {
    const img = normalizeBase64Image(base64)
    if (img && isValidBase64Image(img)) {
      try {
        doc.addImage(img, 'PNG', x + 5, y + 8, boxW - 10, 30)
        console.log('  - ✅ Image added via Base64')
        imageAdded = true
      } catch (err) {
        console.error('  - ❌ addImage Base64 failed:', err.message)
        console.log('  - 🔄 Attempting fallback to URL...')
      }
    } else {
      console.warn('  - ⚠️ Invalid Base64 format, attempting fallback to URL')
    }
  }

  // Fallback to URL if Base64 failed or not available
  if (!imageAdded && url) {
    // Try to load image as base64 blob first (handles CORS better)
    const base64FromUrl = await loadImageAsBase64(url)
    if (base64FromUrl) {
      try {
        doc.addImage(base64FromUrl, 'PNG', x + 5, y + 8, boxW - 10, 30)
        console.log('  - ✅ Image added via URL (blob conversion)')
        imageAdded = true
      } catch (err) {
        console.error('  - ❌ addImage blob failed:', err.message)
        console.log('  - 🔄 Attempting direct image load...')
      }
    }

    // Final fallback: try direct image load
    if (!imageAdded) {
      try {
        const imgEl = await loadImage(url)
        doc.addImage(imgEl, 'PNG', x + 5, y + 8, boxW - 10, 30)
        console.log('  - ✅ Image added via direct URL load')
        imageAdded = true
      } catch (err) {
        console.error('  - ❌ Direct URL load failed:', err.message)
      }
    }
  }

  if (!imageAdded) {
    console.log('  - ⚠️ No signature image could be added')
  }

  doc.line(x + 5, y + boxH - 10, x + boxW - 5, y + boxH - 10)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(`(${name || '..............'})`, x + boxW / 2, y + boxH - 5, { align: 'center' })
}

// Load image as base64 from URL via fetch (CORS-aware)
async function loadImageAsBase64(url) {
  try {
    console.log('  - 📥 Fetching image as blob from:', url)
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (err) {
    console.error('  - ❌ Failed to load image as blob:', err.message)
    return null
  }
}

// Load image element from URL (with CORS) for jsPDF
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = (err) => reject(err)
    img.src = url
  })
}
