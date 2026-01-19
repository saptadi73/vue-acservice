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

  // Jika sudah data URI
  if (clean.startsWith('data:image/')) {
    return clean
  }

  // Deteksi format dari signature awal base64
  let format = 'png'
  if (clean.startsWith('/9j/')) format = 'jpeg'
  else if (clean.startsWith('R0lGOD')) format = 'gif'
  else if (clean.startsWith('iVBOR')) format = 'png'

  return `data:image/${format};base64,${clean}`
}

export function isValidBase64Image(base64) {
  return typeof base64 === 'string' && base64.startsWith('data:image/')
}
