<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Purchasing Orders</h1>
      <button class="px-4 py-2 rounded-2xl bg-black text-white hover:opacity-90" @click="addPO">
        Tambah PO
      </button>
    </div>

    <div class="overflow-x-auto bg-white rounded-2xl shadow">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100 text-gray-700">
          <tr>
            <th class="px-4 py-3 text-left">No. PO</th>
            <th class="px-4 py-3 text-left">Vendor</th>
            <th class="px-4 py-3 text-left">Tanggal Order</th>
            <th class="px-4 py-3 text-right">Subtotal</th>
            <th class="px-4 py-3 text-right">Pajak</th>
            <th class="px-4 py-3 text-right">Total</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-center w-48">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="po in pos" :key="po.id" class="border-t">
            <td class="px-4 py-3 font-medium">{{ po.order_number }}</td>
            <td class="px-4 py-3">
              <div class="font-medium">{{ po.vendor?.nama || po.vendor?.name || '-' }}</div>
              <div class="text-xs text-gray-500">
                {{ po.vendor?.phone || po.vendor?.hp || '-' }}
              </div>
            </td>
            <td class="px-4 py-3">{{ formatDate(po.order_date) }}</td>
            <td class="px-4 py-3 text-right">{{ formatIDR(po.subtotal) }}</td>
            <td class="px-4 py-3 text-right">{{ formatIDR(po.tax) }}</td>
            <td class="px-4 py-3 text-right font-semibold">{{ formatIDR(po.total) }}</td>
            <td class="px-4 py-3">
              <span
                :class="statusClass(po.status)"
                class="px-2.5 py-1 rounded-full text-xs font-semibold"
              >
                {{ po.status }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <div class="flex items-center justify-center gap-2">
                <button
                  v-if="po.status === 'draft'"
                  @click="editPO(po)"
                  class="px-3 py-1.5 rounded-xl bg-amber-500 text-white hover:bg-amber-600"
                >
                  Edit
                </button>
                <button
                  v-if="po.status === 'paid'"
                  @click="cetakPO(po)"
                  class="px-3 py-1.5 rounded-xl bg-slate-800 text-white hover:opacity-90"
                >
                  Cetak
                </button>
                <button
                  @click="viewPO(po)"
                  class="px-3 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                >
                  Lihat
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="pos.length === 0">
            <td colspan="8" class="px-4 py-8 text-center text-gray-500">
              Tidak ada purchase order
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/user/axios'

const router = useRouter()
const pos = ref([])
const loading = ref(false)

async function fetchPOs() {
  loading.value = true
  try {
    const res = await api.get('orders/purchase')
    pos.value = Array.isArray(res?.data?.data) ? res.data.data : []
    console.log('Data PO:', pos.value)
  } catch (err) {
    console.error('Gagal memuat purchase orders:', err)
  } finally {
    loading.value = false
  }
}

function formatIDR(n) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n || 0)
}
function formatDate(d) {
  if (!d) return '-'
  const dt = new Date(d)
  if (isNaN(dt)) return d
  return dt.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function statusClass(status) {
  switch (status) {
    case 'draft':
      return 'bg-amber-100 text-amber-700'
    case 'confirmed':
      return 'bg-blue-100 text-blue-700'
    case 'paid':
      return 'bg-emerald-100 text-emerald-700'
    case 'cancelled':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

function editPO(po) {
  router.push({ name: 'purchase edit', params: { id: po.id } })
}

function viewPO(po) {
  router.push({ name: 'purchase edit', params: { id: po.id } })
}

function cetakPO(po) {
  window.print?.()
  alert(`Mencetak PO ${po.order_number}`)
}

function addPO() {
  router.push({ name: 'purchase new' })
}

onMounted(() => {
  fetchPOs()
})
</script>

<!-- Tailwind relies on your project setup. Ensure Tailwind is configured in your Vue build. -->

<style scoped>
/**** Optional: tweak table row hover ****/
tbody tr:hover {
  background-color: #fafafa;
}
</style>
