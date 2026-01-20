// src/utils/imageBase64.js

/**
 * Normalize Base64 image for jsPDF
 * - Remove whitespace & newline
 * - Add data:image/* prefix if missing
 */
export function normalizeBase64Image(base64) {
  if (!base64 || typeof base64 !== 'string') return null

  // jsPDF SANGAT sensitif whitespace
  const clean = base64.replace(/\s+/g, '')

  // Jika sudah data URI, extract formatnya dari URI jika ada
  if (clean.startsWith('data:image/')) {
    return clean
  }

  // Jika clean masih dimulai dengan "data:" berarti ada format, return as-is
  if (clean.startsWith('data:')) {
    return clean
  }

  // Deteksi format dari signature awal base64 (magic bytes)
  let format = 'png' // default
  if (clean.startsWith('/9j/'))
    format = 'jpeg' // JPEG magic bytes
  else if (clean.startsWith('R0lGOD'))
    format = 'gif' // GIF magic bytes
  else if (clean.startsWith('iVBOR'))
    format = 'png' // PNG magic bytes
  // Fallback: coba detect dari common encoding
  else if (clean.includes('PNG') || clean.startsWith('89504e47')) format = 'png'
  else if (clean.includes('JPEG') || clean.includes('FFD8')) format = 'jpeg'

  return `data:image/${format};base64,${clean}`
}

export function isValidBase64Image(base64) {
  return typeof base64 === 'string' && base64.startsWith('data:image/')
}
