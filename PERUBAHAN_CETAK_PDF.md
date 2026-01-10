# Fitur Cetak PDF dengan Preview

## Perubahan yang Dilakukan

### 1. **Filter Product Order yang Kosong**

- Produk/jasa yang tidak memiliki description atau qty = 0 tidak akan ditampilkan di PDF
- Section "Produk" dan "Jasa" akan otomatis disembunyikan jika tidak ada item yang valid

### 2. **Preview Modal Sebelum Download/Print**

- Ketika tombol "Cetak PDF" diklik, maka akan menampilkan modal preview terlebih dahulu
- Tidak langsung open popup print seperti sebelumnya

### 3. **Opsi Download dan Print dari Preview**

- **Tombol Download**: Mengunduh file HTML dengan nama format `Invoice_[NOMOR].html`
- **Tombol Print**: Membuka popup print window untuk mencetak langsung ke printer

## State/Variable Baru

```javascript
// PDF Preview modal
const pdfPreviewModal = ref(false) // Kontrol visibilitas modal
const pdfPreviewHtml = ref('') // Menyimpan HTML yang akan dipreview
```

## Fungsi Baru

### 1. `generatePdfHtml()`

- Membuat HTML invoice dengan filter
- Filter: Hanya tampilkan produk/jasa yang memiliki description atau qty > 0
- Return: HTML string yang siap dipreview/diprint

### 2. `printInvoice()`

- Diubah dari langsung print menjadi buka modal preview
- Generate HTML menggunakan `generatePdfHtml()`
- Tampilkan modal dengan `pdfPreviewModal.value = true`

### 3. `downloadPdf()`

- Download file HTML invoice
- Nama file: `Invoice_[NOMOR_ORDER].html`
- Tutup modal setelah download

### 4. `printFromPreview()`

- Print dari modal preview
- Membuka window baru dan menjalankan `window.print()`

## UI Modal Preview

Modal preview menampilkan:

- Preview invoice menggunakan `<iframe>` dengan `srcDoc`
- 3 tombol aksi:
  - **Tutup**: Menutup modal tanpa aksi
  - **Download**: Unduh file HTML
  - **Print**: Cetak langsung

## Cara Kerja

1. User klik tombol "Cetak PDF" pada status 'confirmed'
2. Modal preview terbuka menampilkan invoice dalam iframe
3. User dapat memilih:
   - Tutup modal jika hanya ingin lihat preview
   - Download untuk simpan file HTML
   - Print untuk cetak langsung ke printer

## Contoh Filter

**Sebelum:**

```
Produk 1: "Description" | Qty: 5        ✓ Ditampilkan
Produk 2: ""             | Qty: 0        ✓ Ditampilkan (empty row)
Produk 3: "Service A"    | Qty: 2        ✓ Ditampilkan
```

**Sesudah:**

```
Produk 1: "Description" | Qty: 5        ✓ Ditampilkan
Produk 2: ""             | Qty: 0        ✗ TIDAK ditampilkan
Produk 3: "Service A"    | Qty: 2        ✓ Ditampilkan
```

Jika semua produk kosong:

- Section "Produk" tidak ditampilkan sama sekali
- Hanya section dengan data yang ditampilkan
