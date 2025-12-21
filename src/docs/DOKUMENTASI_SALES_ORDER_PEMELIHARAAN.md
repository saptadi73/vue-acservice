# 📋 DOKUMENTASI: HALAMAN CREATE SALES ORDER PEMELIHARAAN

## Deskripsi

Halaman untuk membuat Sales Order Pemeliharaan dengan fitur lengkap input produk dan jasa, lengkap dengan perhitungan otomatis subtotal, tax, dan total.

---

## 📍 Lokasi File

### Component

- **File**: `src/pages/CreateSalesOrderPemeliharaan.vue`
- **Route**: `/wo/sales/create-maintenance`
- **Route Name**: `create sales order maintenance`

### Related Files

- **API Integration**: `src/user/axios.js`
- **Base URL Config**: `src/base.utils.url.ts`
- **WO Service Page**: `src/pages/WoService.vue` (tombol untuk akses)

---

## 🎯 FITUR UTAMA

### 1. **Data Pelanggan Section**

Menampilkan dan input data pelanggan:

- ✅ **Search/Select Customer** - Cari pelanggan yang sudah ada
- ✅ **Nama Pelanggan** - Input atau fill otomatis dari search
- ✅ **Alamat** - Alamat lengkap
- ✅ **No. HP** - Nomor telepon pelanggan

### 2. **Produk Section**

Tabel untuk menginput produk yang dibeli:

- ✅ **Nama Produk** - Deskripsi produk
- ✅ **Quantity** - Jumlah barang
- ✅ **Harga** - Harga satuan
- ✅ **Diskon** - Diskon per baris
- ✅ **Subtotal** - Auto-calculate: (qty × harga) - diskon
- ✅ **Tombol Tambah/Hapus** - Add/remove produk

### 3. **Jasa Section**

Tabel untuk menginput jasa/service yang dibeli:

- ✅ **Nama Jasa** - Deskripsi jasa
- ✅ **Quantity** - Jumlah jasa
- ✅ **Harga** - Harga satuan
- ✅ **Diskon** - Diskon per baris
- ✅ **Subtotal** - Auto-calculate: (qty × harga) - diskon
- ✅ **Tombol Tambah/Hapus** - Add/remove jasa

### 4. **Totals Section**

Ringkasan dan perhitungan otomatis:

- ✅ **Subtotal** - Total semua line items
- ✅ **Pajak (10%)** - Auto-calculate 10% dari subtotal
- ✅ **Total** - Subtotal + Tax
- ✅ **Status** - Draft / Confirmed / Paid

### 5. **Bonus Features**

- ✅ **Auto-generate Order Number** - Format: SO-YYYYMMDD-NNN
- ✅ **Currency Formatting** - Format Rupiah otomatis
- ✅ **Toast Notifications** - Success/Error notifications
- ✅ **Form Validation** - Validasi input
- ✅ **Loading State** - Disable button saat saving

---

## 🚀 CARA MENGAKSES HALAMAN

### Method 1: Direct URL

```
http://localhost:5173/wo/sales/create-maintenance
```

### Method 2: Tombol di WO Service

1. Buka halaman WO Service: `/wo/service/baru/{id}`
2. Klik tombol **"+ Buat Sales Order"** (tombol hijau)
3. Otomatis navigate ke halaman Create Sales Order dengan data customer terprefill

### Method 3: Via Router

```javascript
router.push({ name: 'create sales order maintenance' })
```

---

## 📝 FORM STRUCTURE

### Customer Data

```javascript
customer: {
  id: null,           // UUID (opsional, untuk existing customer)
  nama: '',           // required
  alamat: '',         // required
  no_hp: '',          // required
}
```

### Product Lines

```javascript
{
  product_id: null,           // UUID (opsional)
  line_number: 1,             // nomor urut
  description: '',            // nama produk (required)
  qty: 0,                     // kuantitas (required)
  unit_price: 0,              // harga satuan (required)
  discount: 0,                // diskon (optional)
  line_total: 0,              // auto-calculate
}
```

### Service Lines

```javascript
{
  service_id: null,           // UUID (opsional)
  line_number: 1,             // nomor urut
  description: '',            // nama jasa (required)
  qty: 0,                     // kuantitas (required)
  unit_price: 0,              // harga satuan (required)
  discount: 0,                // diskon (optional)
  line_total: 0,              // auto-calculate
}
```

---

## 🔧 API INTEGRATION

### Endpoint

```
POST /orders/sale
```

### Headers Required

```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

### Payload Example

```json
{
  "order_number": "SO-20250120-001",
  "order_date": "2025-01-20",
  "status": "draft",
  "customer_id": "uuid-customer-id (optional)",
  "subtotal": 1500000.0,
  "tax": 150000.0,
  "total": 1650000.0,
  "product_lines": [
    {
      "product_id": null,
      "line_number": 1,
      "description": "AC Split 1PK",
      "qty": 1,
      "unit_price": 1000000,
      "discount": 0,
      "line_total": 1000000
    }
  ],
  "service_lines": [
    {
      "service_id": null,
      "line_number": 1,
      "description": "Service AC",
      "qty": 1,
      "unit_price": 500000,
      "discount": 0,
      "line_total": 500000
    }
  ]
}
```

### Response Success

```json
{
  "success": true,
  "data": {
    "id": "uuid-sales-order-id",
    "order_number": "SO-20250120-001",
    "order_date": "2025-01-20",
    "status": "draft",
    "subtotal": "1500000.00",
    "tax": "150000.00",
    "total": "1650000.00",
    "customer_id": "uuid-customer-id",
    "created_at": "2025-01-20 10:30:00",
    "updated_at": "2025-01-20 10:30:00"
  }
}
```

---

## ✅ VALIDATION RULES

### Customer Data

- **Nama**: Required, tidak boleh kosong
- **Alamat**: Required, tidak boleh kosong
- **No HP**: Required, tidak boleh kosong

### Product/Service Lines

- **Minimal harus ada 1 produk atau jasa**
- **Quantity**: Harus lebih dari 0
- **Harga Satuan**: Harus lebih dari atau sama dengan 0
- **Diskon**: Harus lebih dari atau sama dengan 0

### Calculation

- **Line Total**: = (Qty × Unit Price) - Discount
- **Subtotal**: = Sum dari semua line totals
- **Tax**: = 10% dari Subtotal
- **Total**: = Subtotal + Tax

---

## 🎨 UI/UX FEATURES

### Color Coding

- **Produk Section**: Green header (untuk visual separation)
- **Jasa Section**: Blue header (untuk visual separation)
- **Action Buttons**:
  - Tambah: Green/Blue (primary color)
  - Hapus: Red (danger)
  - Save: Blue (primary)
  - Cancel: Gray (secondary)

### Responsive Design

- ✅ Grid layout dengan responsive columns
- ✅ Tables scroll horizontally pada mobile
- ✅ Fullwidth form inputs
- ✅ Proper spacing dan padding

### User Feedback

- ✅ Toast notifications (auto-dismiss 3 detik)
- ✅ Loading state pada button (disabled + text change)
- ✅ Empty state messages
- ✅ Error validation messages

---

## 📊 CUSTOMER SEARCH FEATURE

### Cara Kerja

1. User ketik nama pelanggan di field "Cari Pelanggan"
2. API `GET /customers` dipanggil untuk fetch semua customers
3. Hasil di-filter berdasarkan input (case-insensitive)
4. Dropdown muncul dengan list hasil
5. User klik salah satu untuk select
6. Nama, Alamat, No HP otomatis ter-fill

### API Endpoint

```
GET /customers
```

### Response

```json
{
  "status": true,
  "data": [
    {
      "id": "uuid",
      "nama": "PT. Example",
      "alamat": "Jln. Contoh No. 123",
      "no_hp": "081234567890"
    }
  ]
}
```

---

## 🔄 FORM FLOW

```
1. User buka halaman (dari WO atau direct URL)
   ↓
2. Auto-generate Order Number (SO-YYYYMMDD-NNN)
   ↓
3. Fill customer data (dari search atau manual)
   ↓
4. Add product & service lines
   ↓
5. Input quantity, harga, diskon
   ↓
6. Sistem auto-calculate line totals dan grand total
   ↓
7. Select status (draft/confirmed/paid)
   ↓
8. Click "Simpan Sales Order"
   ↓
9. API POST request dikirim
   ↓
10. Success → Redirect ke "Daftar Sales Order"
    Error → Show error notification
```

---

## 🎯 INTEGRASI DENGAN WO SERVICE

### Tombol di WO Service

```vue
<button class="bg-green-600 text-white font-bold p-2 rounded" @click="createSalesOrder">
  + Buat Sales Order
</button>
```

### Fungsi Handler

```javascript
function createSalesOrder() {
  const router = useRouter()
  router.push({
    name: 'create sales order maintenance',
    params: {
      customerName: nama_pelanggan.value,
      customerAddress: alamat.value,
      customerPhone: no_hp.value,
    },
  })
}
```

---

## 📱 MOBILE RESPONSIVENESS

### Desktop (768px+)

- Grid 3 columns untuk customer data
- Full table view untuk product/service lines
- Side-by-side layout untuk totals

### Tablet (768px)

- Grid 2 columns untuk customer data
- Horizontal scroll untuk tables
- Adjusted padding/margins

### Mobile (< 768px)

- Grid 1 column untuk customer data
- Horizontal scroll untuk tables
- Full-width form inputs
- Stacked buttons

---

## 🧪 TESTING CHECKLIST

### Functional

- [ ] Customer search works
- [ ] Select customer pre-fills data
- [ ] Add product line creates new row
- [ ] Remove product line deletes row
- [ ] Add service line creates new row
- [ ] Remove service line deletes row
- [ ] Line totals calculate correctly
- [ ] Subtotal calculates correctly
- [ ] Tax (10%) calculates correctly
- [ ] Grand total calculates correctly
- [ ] Form validation prevents invalid submit
- [ ] Success notification shows
- [ ] Redirect to sales order list works

### Integration

- [ ] API request sent with correct payload
- [ ] JWT token included in headers
- [ ] Response handled correctly
- [ ] Error response shows in notification

### UI/UX

- [ ] Responsive on mobile
- [ ] Currency formatting correct
- [ ] Loading state visible
- [ ] All buttons clickable
- [ ] No console errors

---

## 🐛 TROUBLESHOOTING

### Problem: Customer search not working

**Solution:**

1. Check API endpoint `/customers` returns data
2. Check network tab untuk verify request
3. Check console untuk error messages

### Problem: Line totals not calculating

**Solution:**

1. Ensure Qty and Unit Price are numbers
2. Check calculation function: `calculateLineTotal()`
3. Clear form and re-enter values

### Problem: Save button disabled

**Solution:**

1. Fill all required customer data
2. Add at least 1 product or service
3. Check form validation errors

### Problem: Form validation error

**Solution:**

1. Ensure Nama Pelanggan tidak kosong
2. Ensure Alamat tidak kosong
3. Ensure No HP tidak kosong
4. Ensure at least 1 product/service added

---

## 📚 RELATED FILES

| File                                         | Deskripsi                |
| -------------------------------------------- | ------------------------ |
| `src/pages/CreateSalesOrderPemeliharaan.vue` | Component utama          |
| `src/pages/WoService.vue`                    | WO Service dengan tombol |
| `src/router/index.js`                        | Route configuration      |
| `src/user/axios.js`                          | API client               |
| `service-crud.md`                            | API documentation        |
| `SALE_ORDER_PAYLOADS.md`                     | Payload examples         |

---

## 🚀 NEXT STEPS (Optional)

1. **List Sales Order Pemeliharaan**
   - Create dedicated page untuk list SO maintenance
   - Filter by status
   - View/Edit/Delete operations

2. **Edit Sales Order**
   - Create edit page untuk update SO
   - Preserve order number
   - Update lines functionality

3. **Invoice Generation**
   - Generate invoice dari SO
   - PDF export
   - Print functionality

4. **Payment Tracking**
   - Track payment status
   - Mark as paid
   - Payment history

---

**Status**: ✅ SELESAI
**Version**: 1.0.0
**Last Updated**: December 20, 2025
