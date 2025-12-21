# 🆕 SALES ORDER PEMELIHARAAN - QUICK START

## ✅ APA YANG BARU DITAMBAHKAN

### 1. **Halaman Create Sales Order Pemeliharaan** ✅

- File: `src/pages/CreateSalesOrderPemeliharaan.vue`
- Route: `/wo/sales/create-maintenance`
- Fitur lengkap untuk input SO dengan produk & jasa

### 2. **Tombol "Buat Sales Order" di WO Service** ✅

- Lokasi: Halaman WO Service (`src/pages/WoService.vue`)
- Tombol hijau di bawah halaman (sebelah "Simpan Perubahan")
- Auto pre-fill customer data

### 3. **Route Baru** ✅

- Route name: `create sales order maintenance`
- Path: `/wo/sales/create-maintenance`

### 4. **Dokumentasi Lengkap** ✅

- File: `DOKUMENTASI_SALES_ORDER_PEMELIHARAAN.md`

---

## 🚀 CARA MENGGUNAKAN

### **Method 1: Dari Halaman WO Service (Recommended)**

```
1. Buka halaman WO Service
   URL: /wo/service/baru/{id}

2. Isi form WO Pemeliharaan

3. Klik tombol "Simpan Perubahan" (opsional, atau langsung ke step 4)

4. Klik tombol "+ Buat Sales Order" (tombol hijau)

5. Halaman Create Sales Order muncul dengan data customer terprefill
```

### **Method 2: Direct URL**

```
Buka: http://localhost:5173/wo/sales/create-maintenance
```

---

## 📊 FORM SECTIONS

### **Section 1: Data Pelanggan**

```
┌─────────────────────────────────────────────┐
│  Cari Pelanggan atau Buat Baru (search)   │
│  Nama Pelanggan *                         │
│  Alamat *                                 │
│  No. HP *                                 │
└─────────────────────────────────────────────┘
```

### **Section 2: Produk yang Dibeli**

```
┌─────────────────────────────────────────────────────────┐
│ No │ Nama Produk │ Qty │ Harga │ Diskon │ Subtotal    │
├─────────────────────────────────────────────────────────┤
│ 1  │  AC Split   │  1  │ 1jt  │   -   │ Rp 1.000.000│
│ 2  │  Pipa       │  2  │ 100k │   -   │ Rp 200.000  │
└─────────────────────────────────────────────────────────┘
```

### **Section 3: Jasa yang Dibeli**

```
┌─────────────────────────────────────────────────────────┐
│ No │ Nama Jasa   │ Qty │ Harga │ Diskon │ Subtotal    │
├─────────────────────────────────────────────────────────┤
│ 1  │  Instalasi  │  1  │ 500k │ 50k   │ Rp 450.000  │
│ 2  │  Service    │  1  │ 200k │   -   │ Rp 200.000  │
└─────────────────────────────────────────────────────────┘
```

### **Section 4: Summary**

```
Subtotal:  Rp 1.850.000
Pajak:     Rp 185.000
─────────────────────
Total:     Rp 2.035.000

Status: [Draft ▼]
```

---

## 🎯 FITUR-FITUR

### **Customer Search**

- ✅ Type nama pelanggan di field search
- ✅ Dropdown muncul dengan hasil pencarian
- ✅ Klik untuk auto-fill data (nama, alamat, no HP)
- ✅ Atau manual input data customer baru

### **Add/Remove Product**

- ✅ Klik "Tambah Produk" untuk add baris baru
- ✅ Klik "Hapus" untuk delete baris
- ✅ Input: Nama, Qty, Harga, Diskon
- ✅ Subtotal auto-calculate

### **Add/Remove Service**

- ✅ Klik "Tambah Jasa" untuk add baris baru
- ✅ Klik "Hapus" untuk delete baris
- ✅ Input: Nama, Qty, Harga, Diskon
- ✅ Subtotal auto-calculate

### **Auto-Calculation**

- ✅ Line Total = (Qty × Harga) - Diskon
- ✅ Subtotal = Sum semua line totals
- ✅ Tax = 10% dari Subtotal
- ✅ Total = Subtotal + Tax

### **Auto-Generate Order Number**

- ✅ Format: SO-YYYYMMDD-NNN
- ✅ Contoh: SO-20250120-001
- ✅ Generated saat halaman load

---

## 💾 SUBMIT & SAVE

```
1. Fill customer data (nama, alamat, no_hp)
2. Add minimal 1 produk atau jasa
3. Input semua required fields
4. Klik "Simpan Sales Order"
5. Loading state...
6. Success → Redirect ke "Daftar Sales Order"
   OR Error → Show error notification
```

---

## ✅ VALIDATION

### **Required Fields**

- ✅ Nama Pelanggan (tidak boleh kosong)
- ✅ Alamat (tidak boleh kosong)
- ✅ No HP (tidak boleh kosong)
- ✅ Minimal 1 produk atau jasa

### **Validation Messages**

```
"Mohon isi semua data pelanggan"
"Mohon tambahkan minimal satu produk atau jasa"
```

---

## 🔗 API INTEGRATION

### **Endpoint**

```
POST /orders/sale
Authorization: Bearer {JWT_TOKEN}
```

### **Auto-Calculated Fields (dari frontend)**

```javascript
{
  order_number: "SO-20250120-001",      // auto-generate
  order_date: "2025-01-20",              // hari ini
  subtotal: 1850000,                     // sum of lines
  tax: 185000,                           // 10% of subtotal
  total: 2035000,                        // subtotal + tax
  status: "draft",                       // user select
  product_lines: [...],                  // array
  service_lines: [...]                   // array
}
```

---

## 🎨 UI COLORS

| Element              | Color    | Status         |
| -------------------- | -------- | -------------- |
| Button Tambah Produk | Green    | Add product    |
| Button Tambah Jasa   | Blue     | Add service    |
| Button Hapus         | Red      | Delete         |
| Button Simpan        | Blue     | Primary action |
| Header Produk        | Green bg | Section        |
| Header Jasa          | Blue bg  | Section        |

---

## 📱 RESPONSIVE

- ✅ Desktop (1024px+): Full layout
- ✅ Tablet (768px): 2-column grid
- ✅ Mobile (< 768px): 1-column, horizontal scroll for tables

---

## 🧪 TESTING CHECKLIST

- [ ] Buka halaman WO Service
- [ ] Klik tombol "+ Buat Sales Order"
- [ ] Halaman Create SO muncul
- [ ] Customer data pre-filled (jika dari WO)
- [ ] Search customer works
- [ ] Add product line works
- [ ] Add service line works
- [ ] Calculations correct
- [ ] Remove lines works
- [ ] Form validation works
- [ ] Save button works
- [ ] Success notification shows
- [ ] Redirect ke list works
- [ ] Check halaman responsif

---

## 🐛 COMMON ISSUES

### Masalah: Tombol "+ Buat Sales Order" tidak ada

**Solusi:**

- Pastikan file `WoService.vue` sudah updated
- Check browser console untuk error
- Refresh halaman

### Masalah: Customer search tidak muncul

**Solusi:**

- Check API endpoint `/customers` available
- Check network tab di DevTools
- Pastikan ada customer data di database

### Masalah: Calculations tidak bekerja

**Solusi:**

- Input harus angka (tidak text)
- Check qty dan harga filled
- Clear form dan coba lagi

### Masalah: Save error

**Solusi:**

- Check semua required fields filled
- Check JWT token valid
- Check API endpoint `/orders/sale` available
- Check network tab untuk error detail

---

## 📚 DOKUMENTASI LENGKAP

Lihat file: `DOKUMENTASI_SALES_ORDER_PEMELIHARAAN.md`

Konten:

- Fitur lengkap
- API integration detail
- Validation rules
- Customer search feature
- Testing checklist
- Troubleshooting guide

---

## 🚀 NEXT STEPS

1. **Test halaman baru**
   - Buka `/wo/service/baru/{customer_id}`
   - Klik "+ Buat Sales Order"
   - Test semua fitur

2. **Setup API** (jika belum)
   - Pastikan endpoint `/orders/sale` tersedia
   - Pastikan endpoint `/customers` tersedia
   - Test dengan Postman/cURL

3. **Production Ready**
   - Semua fitur tested
   - Dokumentasi ready
   - API integration verified

---

## ✨ SUMMARY

| Item                 | Status |
| -------------------- | ------ |
| Component dibuat     | ✅     |
| Route terdaftar      | ✅     |
| Tombol di WO Service | ✅     |
| Dokumentasi          | ✅     |
| API Integration      | ✅     |
| Validation           | ✅     |
| Responsive           | ✅     |
| Testing Ready        | ✅     |

**Status: SIAP DIGUNAKAN** 🎉

---

_Last Updated: December 20, 2025_
_Version: 1.0.0_
