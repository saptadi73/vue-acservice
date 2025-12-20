# Dokumentasi Halaman Table Jasa

## Deskripsi

Halaman ini menampilkan daftar semua jasa yang tersedia dengan fitur lengkap untuk manajemen data (Create, Read, Update, Delete).

## Fitur Utama

### 1. **Tampilan Tabel (Read)**

- Menampilkan daftar jasa dalam format tabel yang rapi dan responsif
- Kolom: Nama Jasa, Harga (format Rupiah), Deskripsi, Aksi
- Status: Bebas token (tidak memerlukan autentikasi)

### 2. **Search/Pencarian**

- Input search untuk mencari berdasarkan nama jasa atau deskripsi
- Pencarian real-time (langsung saat mengetik)
- Case-insensitive (tidak membedakan huruf besar/kecil)
- Otomatis reset ke halaman 1 saat search

### 3. **Pagination**

- Menampilkan data sesuai jumlah per halaman
- Opsi jumlah data per halaman: 5, 10, 20, 50
- Tombol navigasi: Previous dan Next
- Menampilkan halaman aktif dan total halaman
- Menampilkan jumlah total data yang tersedia

### 4. **Tombol Tambah Jasa (Create)**

- Tombol "Tambah Jasa" di bagian atas kanan halaman
- Membuka modal form untuk input data jasa baru
- Field yang diperlukan:
  - **Nama Jasa** (required, max 191 karakter)
  - **Harga** (required, numerik, minimal 0)
  - **Deskripsi** (optional)
- Validasi client-side sebelum submit
- Notifikasi sukses/error setelah proses

### 5. **Tombol Edit**

- Tombol "Edit" pada setiap baris data
- Membuka modal form dengan data yang sudah terprefill
- Memungkinkan update sebagian field (tidak perlu mengisi semua)
- Validasi data sebelum submit
- Notifikasi konfirmasi setelah proses

### 6. **Tombol Hapus**

- Tombol "Hapus" pada setiap baris data
- Menampilkan modal konfirmasi sebelum hapus
- Menampilkan nama jasa yang akan dihapus
- Warning: "Tindakan ini tidak dapat dibatalkan"
- Notifikasi setelah proses berhasil atau gagal

### 7. **Notifikasi (Toast)**

- Notifikasi otomatis untuk setiap aksi
- Tipe notifikasi:
  - **Success** (hijau): Jasa berhasil ditambah/diperbarui/dihapus
  - **Error** (merah): Gagal melakukan operasi
  - **Info** (biru): Informasi umum
- Tampil otomatis 3 detik di kanan atas layar

## Akses Halaman

### Route

```
/services/list
```

### URL Lengkap

```
http://localhost:8000/services/list
```

### Navigation

Halaman dapat diakses melalui:

1. Sidebar menu (jika sudah dikonfigurasi)
2. Direct URL ke `/services/list`
3. Router navigation: `router.push({ name: 'services list' })`

## API Integration

Halaman menggunakan endpoint dari `service-crud.md`:

| Method | Endpoint              | Deskripsi             | Auth     |
| ------ | --------------------- | --------------------- | -------- |
| GET    | /services             | Ambil semua data jasa | Tidak    |
| POST   | /services             | Tambah jasa baru      | Ya (JWT) |
| POST   | /services/update/{id} | Edit jasa             | Ya (JWT) |
| POST   | /services/delete/{id} | Hapus jasa            | Ya (JWT) |

## State Management

### Data Components

- `services` - Array berisi semua data jasa dari API
- `filteredServices` - Array hasil filter search
- `paginatedServices` - Array hasil pagination
- `searchQuery` - Query pencarian
- `currentPage` - Halaman aktif
- `pageSize` - Jumlah data per halaman
- `loading` - Status loading (untuk disable tombol saat loading)

### Modal Controls

- `showCreate` - Kontrol tampil modal tambah jasa
- `showEdit` - Kontrol tampil modal edit jasa
- `showDelete` - Kontrol tampil modal hapus jasa

### Form Data

- `createForm` - Data form tambah jasa
- `editForm` - Data form edit jasa
- `deleteTarget` - Target data untuk dihapus

### Notification

- `notification` - State notifikasi dengan `show`, `message`, `type`

### Validation Errors

- `errors` - Object berisi error dari validasi form

## Validasi Form

### Create Form Validation

- Nama: Wajib, minimal ada 1 karakter, maksimal 191 karakter
- Harga: Wajib, numerik, >= 0

### Edit Form Validation

- Nama: Optional, maksimal 191 karakter jika diisi
- Harga: Optional, >= 0 jika diisi

## Format Data

### Harga

Ditampilkan dalam format Mata Uang Indonesia (IDR) dengan:

- Format: Rp X.XXX.XXX
- Tanpa desimal
- Contoh: Rp 450.000 untuk 450000

### Timestamp

- `created_at` dan `updated_at` disimpan dari API (tidak ditampilkan di table)
- Format dari API: "2025-08-24 10:00:00"

## User Experience

### Loading States

- Button disabled saat loading
- Text berubah saat loading (contoh: "Simpan" menjadi "Menyimpan...")
- Spinner/indicator loading bisa ditambahkan jika diperlukan

### Empty State

- Tabel menampilkan "Tidak ada data" jika tidak ada hasil search
- Pagination buttons otomatis disabled jika tidak ada halaman lain

### Responsive Design

- Tabel scroll horizontal pada layar kecil
- Modal responsive dengan max-width dan overflow handling
- Tombol dan input full-width pada mobile

## Error Handling

### API Errors

- Tangkap error dari response API
- Tampilkan pesan error dari API jika tersedia
- Fallback ke pesan generic jika error tidak jelas
- Log error ke console untuk debugging

### Client-side Errors

- Validasi form sebelum submit
- Display error message di bawah field
- Prevent submit jika ada validation error

## Fitur Tambahan (Opsional untuk Upgrade)

1. **Bulk Operations**
   - Checkbox untuk select multiple rows
   - Bulk delete, export, dll

2. **Advanced Search**
   - Filter berdasarkan range harga
   - Filter berdasarkan tanggal dibuat/diupdate

3. **Sorting**
   - Klik header untuk sort ascending/descending
   - Sort by: Nama, Harga, Created Date, dll

4. **Export Data**
   - Export ke Excel/CSV
   - Export ke PDF

5. **Inline Edit**
   - Edit langsung di table tanpa modal
   - Double-click untuk edit

6. **Row Selection**
   - Highlight baris yang dipilih
   - Copy data ke clipboard

## Testing

### Manual Testing Checklist

- [ ] Halaman load dan menampilkan data jasa
- [ ] Search berfungsi dengan benar
- [ ] Pagination berfungsi
- [ ] Tambah jasa berhasil
- [ ] Edit jasa berhasil
- [ ] Hapus jasa berhasil
- [ ] Validasi form berfungsi
- [ ] Notifikasi tampil dengan benar
- [ ] Loading state berfungsi
- [ ] Currency format tampil benar
- [ ] Responsive di mobile/tablet

### API Mocking (untuk development tanpa backend)

Jika backend belum siap, gunakan axios mock atau json-server untuk testing.

## Troubleshooting

### Halaman Blank/Error

1. Cek console browser untuk error message
2. Verifikasi Base URL di `base.utils.url.ts`
3. Pastikan API endpoint `/services` tersedia

### Token Error saat Create/Edit/Delete

1. Login terlebih dahulu untuk mendapatkan token
2. Verifikasi token disimpan di localStorage dengan key `token`
3. Cek axios interceptor di `user/axios.js`

### Data Tidak Update

1. Cek network tab di DevTools untuk request
2. Verifikasi payload yang dikirim ke API
3. Lihat response API untuk error message

### Modal Tidak Menutup

1. Periksa console untuk error saat submit
2. Verifikasi API response format
3. Reset form state manual jika perlu
