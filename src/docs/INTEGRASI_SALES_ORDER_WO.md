# 📋 INTEGRASI TOMBOL SALES ORDER DI HALAMAN WO

## ✅ RINGKASAN PERUBAHAN

Tombol **"+ Buat Sales Order"** telah ditambahkan ke 3 halaman Work Order:

| Halaman         | File                  | Status     |
| --------------- | --------------------- | ---------- |
| WO Pemeliharaan | `EditWoService.vue`   | ✅ Selesai |
| WO Penjualan    | `EditWoPenjualan.vue` | ✅ Selesai |
| WO Penyewaan    | `EditWoPenyewaan.vue` | ✅ Selesai |

---

## 🔧 DETAIL PERUBAHAN

### 1️⃣ EditWoService.vue (WO Pemeliharaan)

```
📍 File: src/pages/EditWoService.vue
```

**Perubahan:**

- ✅ Import: Tambah `useRouter` dari `vue-router`
- ✅ Function: Tambah `createSalesOrder()`
- ✅ Button: Tambah tombol "Buat Sales Order" (warna biru)

**Code:**

```javascript
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
function createSalesOrder() {
  router.push({
    name: 'create sales order maintenance',
    query: {
      customer_id: formData.value.customer_asset_id,
      customer_name: nama_pelanggan.value,
      customer_address: alamat.value,
      customer_phone: no_hp.value,
    },
  })
}
```

**Button:**

```vue
<button
  class="bg-blue-600 mt-3 font-montserrat text-center cursor-pointer text-white font-bold w-full p-2 rounded-md"
  @click="createSalesOrder"
  :disabled="status === 'selesai' && pelangganSignUrl"
>
  + Buat Sales Order
</button>
```

---

### 2️⃣ EditWoPenjualan.vue (WO Penjualan)

```
📍 File: src/pages/EditWoPenjualan.vue
```

**Perubahan:**

- ✅ Import: Tambah `useRouter` dari `vue-router`
- ✅ Function: Tambah `createSalesOrder()`
- ✅ Button: Tambah tombol "Buat Sales Order" (warna biru)

**Code:**

```javascript
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
function createSalesOrder() {
  router.push({
    name: 'create sales order maintenance',
    query: {
      customer_id: formData.value.customer_asset_id,
      customer_name: nama_pelanggan.value,
      customer_address: alamat.value,
      customer_phone: no_hp.value,
    },
  })
}
```

---

### 3️⃣ EditWoPenyewaan.vue (WO Penyewaan)

```
📍 File: src/pages/EditWoPenyewaan.vue
```

**Perubahan:**

- ✅ Import: Tambah `useRouter` dari `vue-router`
- ✅ Function: Tambah `createSalesOrder()`
- ✅ Button: Tambah tombol "Buat Sales Order" (warna biru)

**Code:**

```javascript
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
function createSalesOrder() {
  router.push({
    name: 'create sales order maintenance',
    query: {
      customer_id: selectedCustomerId.value,
      customer_name: nama_pelanggan.value,
      customer_address: alamat.value,
      customer_phone: no_hp.value,
    },
  })
}
```

---

## 🎯 FITUR

### Tombol di 3 Halaman WO:

```
┌─────────────────────────────────────────────┐
│  [Simpan Perubahan] (gray)                 │
│  [Buat Link untuk Pelanggan] (green)       │
│  [+ Buat Sales Order] (blue) ← BARU        │
└─────────────────────────────────────────────┘
```

### Fungsi Tombol:

✅ Navigasi ke halaman Create Sales Order  
✅ Pre-fill data customer:

- `customer_id` (dari WO)
- `customer_name` (nama pelanggan)
- `customer_address` (alamat)
- `customer_phone` (no HP)

✅ Disabled jika status "selesai" dan pelanggan sudah sign

### Route yang Digunakan:

```
Route Name: 'create sales order maintenance'
Path: /wo/sales/create-maintenance
Component: CreateSalesOrderPemeliharaan.vue
```

---

## 🧪 TESTING

### Test pada 3 halaman:

**WO Pemeliharaan:**

```
1. Buka: /wo/service/detail/{id}
2. Klik tombol "+ Buat Sales Order"
3. Halaman SO Pemeliharaan muncul dengan data customer terprefill
```

**WO Penjualan:**

```
1. Buka: /wo/penjualan/detail/{id}
2. Klik tombol "+ Buat Sales Order"
3. Halaman SO Pemeliharaan muncul dengan data customer terprefill
```

**WO Penyewaan:**

```
1. Buka: /wo/penyewaan/detail/{id}
2. Klik tombol "+ Buat Sales Order"
3. Halaman SO Pemeliharaan muncul dengan data customer terprefill
```

---

## 📝 CATATAN

### Kesamaan Data di 3 File:

| Field            | EditWoService       | EditWoPenjualan     | EditWoPenyewaan      |
| ---------------- | ------------------- | ------------------- | -------------------- |
| customer_id      | `customer_asset_id` | `customer_asset_id` | `selectedCustomerId` |
| customer_name    | `nama_pelanggan`    | `nama_pelanggan`    | `nama_pelanggan`     |
| customer_address | `alamat`            | `alamat`            | `alamat`             |
| customer_phone   | `no_hp`             | `no_hp`             | `no_hp`              |

### Disabled State:

```javascript
:disabled="status === 'selesai' && pelangganSignUrl"
```

Tombol disabled jika:

- Status WO = "selesai"
- AND pelanggan sudah memberikan tanda tangan

---

## 🎨 STYLING

**Button Styling:**

```
Background: bg-blue-600
Hover: blue-700 (default)
Text: white, bold
Padding: py-2
Width: full
Border: rounded-md
```

**Spacing:**

```
Margin Top: mt-3 (gap antara button)
```

---

## 📚 DOKUMENTASI TERKAIT

📄 [SALES_ORDER_QUICK_START.md](SALES_ORDER_QUICK_START.md)  
📄 [DOKUMENTASI_SALES_ORDER_PEMELIHARAAN.md](DOKUMENTASI_SALES_ORDER_PEMELIHARAAN.md)

---

## ✨ STATUS

| Item                    | Status      |
| ----------------------- | ----------- |
| EditWoService.vue       | ✅ Complete |
| EditWoPenjualan.vue     | ✅ Complete |
| EditWoPenyewaan.vue     | ✅ Complete |
| Import Router           | ✅ Complete |
| Function Implementation | ✅ Complete |
| Button Integration      | ✅ Complete |
| Testing Ready           | ✅ Ready    |

**SIAP UNTUK PRODUCTION** 🚀

---

_Last Updated: December 20, 2025_
_Version: 1.0.0_
