# 🚀 LANGKAH-LANGKAH MENJALANKAN HALAMAN TABLE JASA

Ikuti langkah-langkah berikut untuk menjalankan halaman table jasa:

---

## STEP 1: Pastikan Development Server Berjalan ⚙️

### Option A: Jika belum pernah jalankan sebelumnya

```bash
# Buka terminal di folder project
cd c:\projek\vue-ac-service

# Install dependencies (jika belum)
npm install

# Jalankan development server
npm run dev
```

### Option B: Jika sudah pernah jalankan

```bash
# Terminal sudah ada di VS Code? Cek tab "Vite"
# Jika ada, sudah berjalan otomatis

# Jika belum, buka terminal baru dan jalankan
npm run dev
```

**Expected output:**

```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
```

✅ Jika melihat output di atas, development server sudah siap!

---

## STEP 2: Buka Halaman di Browser 🌐

### Opsi 1: Direct URL

```
http://localhost:5173/services/list
```

### Opsi 2: Dari halaman utama

```
1. Buka: http://localhost:5173/
2. Cari atau klik menu "Daftar Jasa"
   (jika sudah ada di sidebar)
3. Atau ketik URL di address bar
```

### Opsi 3: Via Router (dari component lain)

```javascript
router.push({ name: 'services list' })
```

**Expected result:**

- ✅ Halaman jasa muncul
- ✅ Tabel kosong atau ada data jasa
- ✅ Button "Tambah Jasa" tersedia
- ✅ Search input tersedia

Jika halaman blank atau error → [Baca Troubleshooting](#troubleshooting)

---

## STEP 3: Test Fitur-Fitur ✅

### 3.1 Test SEARCH

```
1. Ketik nama jasa di search box
   Contoh: "Install"
2. Tekan Enter atau tunggu sebentar
3. ✅ Tabel harus ter-filter dengan hasil yang cocok
```

### 3.2 Test PAGINATION

```
1. Scroll ke bawah halaman
2. Lihat dropdown "Page Size"
3. Pilih "10" untuk tampil 10 data per halaman
4. ✅ Tabel harus update dengan 10 data
5. Klik "Next" untuk ke halaman berikutnya
6. ✅ Tabel harus show data halaman 2
```

### 3.3 Test CREATE (Tambah Jasa)

```
1. Klik button "Tambah Jasa" (biru di atas)
2. ✅ Modal form harus muncul
3. Isi form:
   - Nama: "Service Test 123"
   - Harga: 100000
   - Deskripsi: "Testing"
4. Klik "Simpan"
5. ✅ Modal harus close
6. ✅ Toast notification harus show "Jasa berhasil ditambahkan"
7. ✅ Tabel harus refresh dan show data baru
```

### 3.4 Test UPDATE (Edit Jasa)

```
1. Cari jasa yang baru dibuat
2. Klik button "Edit" di baris tersebut
3. ✅ Modal harus muncul dengan data terprefill
4. Ubah harga: 200000
5. Klik "Simpan Perubahan"
6. ✅ Modal harus close
7. ✅ Toast notification harus show "Jasa berhasil diperbarui"
8. ✅ Tabel harus refresh dan show harga baru
```

### 3.5 Test DELETE (Hapus Jasa)

```
1. Cari jasa yang baru diedit
2. Klik button "Hapus" di baris tersebut
3. ✅ Modal konfirmasi harus muncul
4. ✅ Nama jasa harus tampil di modal
5. Klik "Hapus" (tombol merah)
6. ✅ Modal harus close
7. ✅ Toast notification harus show "Jasa berhasil dihapus"
8. ✅ Tabel harus refresh dan data harus hilang
```

### 3.6 Test VALIDATION

```
1. Klik "Tambah Jasa"
2. Jangan isi nama, langsung submit
3. ✅ Error message harus show di bawah field nama
   Contoh: "Nama jasa tidak boleh kosong"
4. Isi nama, tapi kosongkan harga
5. ✅ Error message harus show di bawah field harga
6. Isi nama dengan 200+ karakter
7. ✅ Error message harus show "Nama jasa maksimal 191 karakter"
```

---

## STEP 4: Check Browser DevTools 🔍

Buka DevTools (F12) dan cek:

### Console Tab

```
✅ Tidak ada error messages
✅ Request log untuk API calls visible
```

### Network Tab

```
1. Buka Network tab
2. Refresh halaman
3. ✅ Harus ada request:
   - GET /services (data jasa)
4. Test create jasa
5. ✅ Harus ada request:
   - POST /services (create)
   - GET /services (refresh)
```

### Vue DevTools (Optional)

```
1. Install Vue DevTools extension
2. Buka Vue tab
3. ✅ Harus melihat component:
   - TableServices (root component)
   - Form elements, buttons, dll
```

---

## STEP 5: Setup API (Jika Backend Belum Siap) 🔌

Jika backend belum siap, gunakan **json-server** untuk testing:

### A. Install json-server

```bash
npm install -D json-server
```

### B. Buat file db.json

Di root folder project, buat file `db.json`:

```json
{
  "services": [
    {
      "id": "uuid-1",
      "nama": "Install AC Split 1PK",
      "deskripsi": "Pemasangan unit baru beserta pipa standar",
      "harga": 450000,
      "created_at": "2025-08-24 10:00:00",
      "updated_at": "2025-08-24 10:00:00"
    },
    {
      "id": "uuid-2",
      "nama": "Service AC 2PK",
      "deskripsi": "Perawatan AC dengan pembersihan menyeluruh",
      "harga": 200000,
      "created_at": "2025-08-24 10:30:00",
      "updated_at": "2025-08-24 10:30:00"
    }
  ]
}
```

### C. Jalankan json-server

```bash
# Di terminal baru
npx json-server --watch db.json --port 8080
```

**Expected output:**

```
  ✔ watch: db.json
  ✔ routes: db.json
  ✔ public: public
  Resources
  http://localhost:8080/services
  Home
  http://localhost:8080/
```

### D. Update Base URL

Edit `src/base.utils.url.ts`:

```typescript
// Ganti dari:
export const BASE_URL = 'http://localhost:8080/'

// Tetap sama jika json-server di port 8080
export const BASE_URL = 'http://localhost:8080/'
```

### E. Test dengan Mock API

```
1. Buka halaman /services/list
2. ✅ Harus tampil 2 data jasa dari db.json
3. Test semua fitur CRUD dengan data json-server
4. Data akan disimpan di db.json
```

---

## STEP 6: Dokumentasi & Learning 📚

Setelah testing berhasil, baca dokumentasi:

### Quick Overview (5 menit)

```
Baca: SUMMARY.md atau README_JASA.md
```

### Full Documentation (20 menit)

```
Baca: HALAMAN_JASA.md
```

### Integration Guide (10 menit)

```
Baca: INTEGRASI_SIDEBAR_JASA.md (jika ingin add ke sidebar)
```

### Source Code Review (30 menit)

```
Buka: src/pages/TableServices.vue
```

---

## TROUBLESHOOTING 🔧

### Problem: Halaman tidak muncul / Error

**Solution:**

```bash
# 1. Check console browser (F12)
#    Ada error? Cari di dokumentasi

# 2. Check development server running
#    Terminal ada "Local: http://localhost:5173" ?

# 3. Refresh halaman
#    Ctrl+R atau F5

# 4. Hard refresh (cache bersih)
#    Ctrl+Shift+R

# 5. Check file ada di tempat benar
#    src/pages/TableServices.vue harus exist
```

### Problem: Data tidak tampil (Table kosong)

**Solution:**

```bash
# 1. Check Network tab (F12 → Network)
#    Ada request ke /services?
#    Response ada data?

# 2. Check Base URL config
#    src/base.utils.url.ts harus pointing ke API yang benar

# 3. Jika backend belum siap
#    Setup json-server (lihat STEP 5 di atas)

# 4. Check console untuk error
#    console.error atau network errors?
```

### Problem: Create/Edit/Delete tidak berfungsi

**Solution:**

```bash
# 1. Check sudah login
#    Token di localStorage ada? (F12 → Application → LocalStorage)

# 2. Check Network tab
#    Ada request ke API?
#    Response status 200 atau 401 atau 500?

# 3. Jika 401 Unauthorized
#    Login dulu, then try again

# 4. Jika 500 Server Error
#    Check backend logs

# 5. Jika error validation
#    Baca error message di toast notification
```

### Problem: Currency format salah

**Solution:**

```bash
# Check browser locale
#    Harus 'id-ID' untuk format Rupiah
#    Code di: src/pages/TableServices.vue → formatCurrency()
```

---

## CHECKLIST ✅

Setelah selesai semua step:

- [ ] Development server berjalan (npm run dev)
- [ ] Halaman muncul di browser
- [ ] Data jasa tampil di tabel
- [ ] Search berfungsi
- [ ] Pagination berfungsi
- [ ] Create jasa berfungsi
- [ ] Edit jasa berfungsi
- [ ] Delete jasa berfungsi
- [ ] Validasi form berfungsi
- [ ] Toast notification tampil
- [ ] Tidak ada error di console
- [ ] API requests successful di Network tab
- [ ] Sudah baca dokumentasi
- [ ] Siap untuk customize/deploy

---

## ✅ SUKSES!

Jika semua checklist ✅, Anda sudah siap untuk:

1. **Development** - Modify code sesuai kebutuhan
2. **Testing** - Full testing dengan data real
3. **Integration** - Add ke sidebar menu (lihat INTEGRASI_SIDEBAR_JASA.md)
4. **Deployment** - Deploy ke production (npm run build)

---

## 📞 NEED HELP?

**Jika ada masalah:**

1. Check error message di browser console (F12)
2. Check [README_JASA.md](README_JASA.md#-troubleshooting)
3. Check [HALAMAN_JASA.md](HALAMAN_JASA.md#troubleshooting)
4. Check [CHECKLIST_SELESAI.md](CHECKLIST_SELESAI.md#🔧-configuration-notes)

---

**Good luck! 🚀**

Semua fitur sudah siap. Selamat menggunakan halaman table jasa!
