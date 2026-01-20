import { jsPDF } from 'jspdf'
import { normalizeBase64Image, isValidBase64Image } from '@/utils/imageBase64'

export function useWorkOrderPdfService() {
  async function generatePdf({
    woNumber,
    customer,
    unit,
    keluhan,
    keterangan,
    checklist,
    hasilPekerjaan,
    teknisi,
    signatures,
  }) {
    const doc = new jsPDF('p', 'mm', 'a4')

    const marginX = 11
    const pageWidth = 210
    let y = 10

    /* ================= HEADER ================= */
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.text('WO Pemeliharaan AC Lestari', marginX, y)

    y += 4
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('No. Telp. 0859 4321 3369', marginX, y)

    y += 5
    doc.line(marginX, y, pageWidth - marginX, y)

    /* ================= CUSTOMER ================= */
    y += 7
    doc.setFontSize(7.5)
    doc.text(`Type Pelanggan : ${customer.jenis || '-'}`, marginX, y)
    doc.text(`No. WO : ${woNumber || '-'}`, pageWidth - marginX - 45, y)
    y += 3.5
    doc.text(`Kode Pelanggan : ${customer.kode || '-'}`, marginX, y)

    y += 5
    doc.text(`Nama Pelanggan : ${customer.nama || '-'}`, marginX, y)
    doc.text(`No. HP : ${customer.hp || '-'}`, pageWidth - marginX - 45, y)
    y += 3.5
    doc.text(`Alamat : ${customer.alamat || '-'}`, marginX, y)

    /* ================= KELUHAN & KETERANGAN ================= */
    y += 8
    drawSection(doc, 'Keluhan & Keterangan', y)
    y += 9

    doc.setFontSize(7.5)
    doc.text(`Keluhan : ${keluhan || '-'}`, marginX, y)
    y += 4
    doc.text(`Keterangan : ${keterangan || '-'}`, marginX, y)

    /* ================= UNIT ================= */
    y += 8
    drawSection(doc, 'Spesifikasi Unit AC', y)
    y += 9

    doc.setFontSize(7.5)
    doc.text(`Brand : ${unit.brand || '-'}`, marginX, y)
    doc.text(`Tipe : ${unit.tipe || '-'}`, pageWidth - marginX - 60, y)
    y += 3.5
    doc.text(`Model : ${unit.model || '-'}`, marginX, y)
    doc.text(`Kapasitas : ${unit.kapasitas || '-'}`, pageWidth - marginX - 60, y)
    y += 3.5
    doc.text(`Freon : ${unit.freon || '-'}`, marginX, y)
    doc.text(`Lokasi : ${unit.lokasi || '-'}`, pageWidth - marginX - 60, y)

    /* ================= CHECKLIST ================= */
    y += 9
    drawSection(doc, 'Pengecekan Teknisi', y)
    y += 9

    const col1X = marginX
    const col2X = marginX + 95

    drawChecklistBox(doc, col1X, y, 'Indoor', checklist.indoor || [])
    drawChecklistBox(doc, col2X, y, 'Outdoor', checklist.outdoor || [])

    y += 54

    /* ================= HASIL ================= */
    y += 6
    drawSection(doc, 'Informasi Tambahan & Hasil Pekerjaan', y)
    y += 8

    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    const maxWidth = pageWidth - marginX * 2
    const splitText = doc.splitTextToSize(hasilPekerjaan || '', maxWidth - 4)
    doc.text(splitText, marginX + 2, y)

    y += Math.min(splitText.length * 3.5, 10) + 5

    /* ================= SIGNATURE ================= */
    y += 5
    if (y > 235) {
      doc.addPage()
      y = 15
    }

    drawSection(doc, 'Tanda Tangan', y)
    y += 9

    console.log('📍 Signature Y position:', y)
    console.log('📍 Teknisi signature:', signatures.teknisi)
    console.log('📍 Pelanggan signature:', signatures.pelanggan)

    await drawSignatureBox(doc, marginX + 3, y, 'Teknisi', teknisi.nama, signatures.teknisi)
    await drawSignatureBox(
      doc,
      pageWidth - marginX - 60,
      y,
      'Pelanggan',
      customer.nama,
      signatures.pelanggan,
    )

    /* ================= OUTPUT ================= */
    const safeName = (customer?.nama || 'customer')
      .toString()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '_')
      .slice(0, 40)
    const fileName = `WO_Pemeliharaan_${woNumber || 'WO'}_${safeName}.pdf`
    doc.save(fileName)
  }

  return { generatePdf }
}

function drawSection(doc, title, y) {
  doc.setFillColor(200, 220, 255)
  doc.rect(11, y - 7, 188, 7, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text(title, 105, y - 2, { align: 'center' })
}

function drawChecklistBox(doc, x, y, title, items) {
  const boxWidth = 85
  const boxHeight = 52

  doc.rect(x, y, boxWidth, boxHeight)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.text(title, x + boxWidth / 2, y + 2.5, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.5)

  let itemY = y + 6
  items.forEach((item) => {
    doc.rect(x + 2, itemY - 2, 1.5, 1.5)
    if (item.check) {
      doc.text('X', x + 2.1, itemY - 0.8)
    }

    const text = item.ket ? `${item.label} (${item.ket})` : item.label
    doc.text(text, x + 4.5, itemY)

    itemY += 4
  })
}

async function drawSignatureBox(doc, x, y, title, name, signature) {
  const boxW = 58
  const boxH = 42

  console.log(`🖼️ [${title}] Drawing box at x=${x}, y=${y}, w=${boxW}, h=${boxH}`)

  doc.rect(x, y, boxW, boxH)
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'bold')
  doc.text(title, x + boxW / 2, y + 2.5, { align: 'center' })

  const base64 = signature?.base64 || (typeof signature === 'string' ? signature : null)
  const url = signature?.url || null

  console.log(`🖼️ [${title}] Signature data:`, {
    hasBase64: !!base64,
    hasUrl: !!url,
    signatureObj: signature,
  })

  if (base64) {
    const img = normalizeBase64Image(base64)
    if (img && isValidBase64Image(img)) {
      try {
        doc.addImage(img, 'PNG', x + 2, y + 5, boxW - 4, 22)
        console.log(`  ✅ ${title} image added via Base64`)
      } catch (err) {
        console.error(`  ❌ ${title} Base64 error:`, err.message)
      }
    } else {
      console.warn(`  ⚠️ ${title} Invalid Base64 format`)
    }
  } else if (url) {
    try {
      const imgEl = await loadImage(url)
      doc.addImage(imgEl, 'PNG', x + 2, y + 5, boxW - 4, 22)
      console.log(`  ✅ ${title} image added via URL`)
    } catch (err) {
      console.error(`  ❌ ${title} URL error:`, err.message)
    }
  } else {
    console.warn(`  ⚠️ ${title} - No signature data available`)
  }

  doc.line(x + 2, y + boxH - 6, x + boxW - 2, y + boxH - 6)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.5)
  const displayName = name ? name.substring(0, 15) : '....'
  doc.text(`(${displayName})`, x + boxW / 2, y + boxH - 2.5, { align: 'center' })
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()

    // For relative paths (proxied), don't set crossOrigin - it's same-origin
    // For absolute URLs with CORS, set anonymous
    if (url && !url.startsWith('http')) {
      img.crossOrigin = 'use-credentials'
    } else if (url && url.startsWith('http')) {
      img.crossOrigin = 'anonymous'
    }

    console.log(`  🔗 Loading image from: ${url}`)
    console.log(`  🔐 CORS setting: ${img.crossOrigin || 'none'}`)

    img.onload = () => {
      console.log(`  ✓ Image loaded successfully`)
      resolve(img)
    }
    img.onerror = (err) => {
      console.error(`  ✗ Image load failed:`, err)
      reject(err)
    }
    img.src = url
  })
}
