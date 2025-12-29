<template>
  <div class="p-4 space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold text-gray-800">Input Biaya</h1>
      <div class="text-sm text-gray-500">Form pengeluaran operasional</div>
    </div>

    <div class="bg-white rounded shadow p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="text-sm text-gray-700">Nomor</label>
        <input
          v-model="form.nomor"
          class="w-full border rounded px-3 py-2"
          placeholder="EXP-2025-001"
        />
        <p class="text-xs text-gray-500 mt-1">Wajib. Contoh: EXP-2025-001</p>
      </div>

      <div>
        <label class="text-sm text-gray-700">Tanggal</label>
        <input v-model="form.tanggal" type="date" class="w-full border rounded px-3 py-2" />
        <p class="text-xs text-gray-500 mt-1">Format YYYY-MM-DD</p>
      </div>

      <div>
        <label class="text-sm text-gray-700">Jumlah</label>
        <input
          v-model.number="form.jumlah"
          type="number"
          min="0"
          class="w-full border rounded px-3 py-2 text-right"
        />
        <p class="text-xs text-gray-500 mt-1">Wajib. Contoh: 250000</p>
      </div>

      <div>
        <label class="text-sm text-gray-700">Jenis (CoA)</label>
        <select v-model="selectedCoaId" class="w-full border rounded px-3 py-2">
          <option value="" disabled>Pilih jenis biaya</option>
          <option v-for="coa in expenseAccounts" :key="coa.id" :value="coa.id">
            {{ coa.code }} - {{ coa.name }}
          </option>
        </select>
        <p class="text-xs text-gray-500 mt-1">Wajib. Diambil dari Chart of Accounts (expenses)</p>
      </div>

      <div class="md:col-span-2">
        <label class="text-sm text-gray-700">Keterangan</label>
        <input
          v-model="form.keterangan"
          type="text"
          class="w-full border rounded px-3 py-2"
          placeholder="Pembayaran listrik bulan Desember"
        />
      </div>

      <div>
        <label class="text-sm text-gray-700">Status</label>
        <select v-model="form.status" class="w-full border rounded px-3 py-2">
          <option value="pending">pending</option>
          <option value="approved">approved</option>
          <option value="paid">paid</option>
        </select>
        <p class="text-xs text-gray-500 mt-1">Opsional. Default pending</p>
      </div>

      <div>
        <label class="text-sm text-gray-700">Bukti (gambar)</label>
        <input
          @change="onFileChange"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          class="w-full"
        />
        <p class="text-xs text-gray-500 mt-1">Opsional. Format jpg/png/webp/gif, maksimal 1MB.</p>
        <p v-if="fileError" class="text-xs text-red-600 mt-1">{{ fileError }}</p>
      </div>
    </div>

    <div class="flex justify-end gap-3">
      <button @click="resetForm" class="px-4 py-2 border rounded">Reset</button>
      <button
        @click="submit"
        :disabled="loading || isLoadingExpense"
        class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {{ loading ? 'Menyimpan...' : isLoadingExpense ? 'Memuat...' : 'Simpan Biaya' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/user/axios'

const EXPENSES_ENDPOINT = 'expenses' // ubah jika endpoint berbeda
const route = useRoute()
const router = useRouter()

const loading = ref(false)
const fileError = ref('')
const expenseAccounts = ref([])
const selectedCoaId = ref('')
const buktiFile = ref(null)
const isLoadingExpense = ref(false)

const form = reactive({
  nomor: generateExpenseNumber(),
  tanggal: new Date().toISOString().split('T')[0],
  jumlah: 0,
  jenis: '',
  keterangan: '',
  status: 'pending',
})

function generateExpenseNumber() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const seq = String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')
  return `EXP-${yyyy}-${seq}`
}

async function fetchExpenseAccounts() {
  try {
    const res = await api.get('chart-of-accounts/expenses')
    expenseAccounts.value = Array.isArray(res?.data?.data) ? res.data.data : []
  } catch (err) {
    console.error('Gagal memuat CoA expenses:', err)
    alert('Gagal memuat daftar jenis biaya (CoA)')
  }
}

async function loadExpense(id) {
  try {
    isLoadingExpense.value = true
    const res = await api.get(`expenses/${id}`)
    console.debug('Load expense response:', res?.data)
    const d = res?.data?.data || res?.data || {}
    console.debug('Loaded expense data:', d)
    form.nomor = d.nomor || form.nomor
    form.tanggal = d.tanggal || form.tanggal
    form.jumlah = Number(d.jumlah) || form.jumlah
    form.jenis = d.jenis || form.jenis
    form.keterangan = d.keterangan || ''
    form.status = d.status || form.status
    selectedCoaId.value = d.chart_of_account_id || d.chart_of_account?.id || ''
    console.debug('Form after load:', {
      nomor: form.nomor,
      tanggal: form.tanggal,
      jumlah: form.jumlah,
      jenis: form.jenis,
      keterangan: form.keterangan,
      status: form.status,
      selectedCoaId: selectedCoaId.value,
    })
  } catch (err) {
    console.error('Gagal memuat data biaya:', err)
    alert('Gagal memuat data biaya')
  } finally {
    isLoadingExpense.value = false
  }
}

function onFileChange(e) {
  fileError.value = ''
  const file = e.target.files?.[0]
  if (!file) {
    buktiFile.value = null
    return
  }
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  const maxSize = 1 * 1024 * 1024 // 1MB
  if (!allowed.includes(file.type)) {
    fileError.value = 'File harus berupa gambar (jpg/png/webp/gif)'
    buktiFile.value = null
    return
  }
  if (file.size > maxSize) {
    fileError.value = 'Ukuran file tidak boleh lebih dari 1MB'
    buktiFile.value = null
    return
  }
  buktiFile.value = file
}

function resetForm() {
  form.nomor = generateExpenseNumber()
  form.tanggal = new Date().toISOString().split('T')[0]
  form.jumlah = 0
  form.jenis = ''
  form.keterangan = ''
  form.status = 'pending'
  selectedCoaId.value = ''
  buktiFile.value = null
  fileError.value = ''
}

function validate() {
  if (!form.nomor || !String(form.nomor).trim()) {
    console.log('❌ Validation failed: Nomor required')
    return 'Nomor wajib diisi'
  }
  if (!form.tanggal) {
    console.log('❌ Validation failed: Tanggal required')
    return 'Tanggal wajib diisi'
  }
  if (!Number.isInteger(Number(form.jumlah)) || Number(form.jumlah) <= 0) {
    console.log('❌ Validation failed: Jumlah invalid', form.jumlah)
    return 'Jumlah harus integer > 0'
  }
  if (!selectedCoaId.value) {
    console.log('❌ Validation failed: CoA required')
    return 'Pilih jenis biaya (CoA) terlebih dahulu'
  }
  console.log('✅ Validation passed')
  return ''
}

async function submit() {
  console.log('⬜ SUBMIT CLICKED')
  const err = validate()
  if (err) {
    console.log('⬜ Validation error:', err)
    alert(err)
    return
  }
  console.log('⬜ Validation OK, starting submit')
  loading.value = true
  console.log('🔷 START SUBMIT')
  try {
    // set jenis berdasarkan nama COA terpilih
    const selected = expenseAccounts.value.find((x) => x.id === selectedCoaId.value)
    form.jenis = selected ? selected.name : form.jenis
    console.log('🔷 Form values:', {
      nomor: form.nomor,
      tanggal: form.tanggal,
      jumlah: form.jumlah,
      keterangan: form.keterangan,
    })

    const fd = new FormData()
    fd.append('nomor', String(form.nomor))
    fd.append('tanggal', String(form.tanggal))
    fd.append('jumlah', String(parseInt(form.jumlah)))
    fd.append('jenis', String(form.jenis))
    if (form.keterangan) fd.append('keterangan', String(form.keterangan))
    fd.append('status', String(form.status || 'pending'))
    fd.append('chart_of_account_id', String(selectedCoaId.value))
    if (buktiFile.value) fd.append('bukti', buktiFile.value)

    console.log('🔷 FormData keys:', Array.from(fd.keys()))
    console.log('🔷 Route params:', route.params)

    if (route.params.id) {
      console.log('🔷 CALLING UPDATE: PUT /expenses/' + route.params.id)
      const res = await api.put(`expenses/${route.params.id}`, fd)
      console.log('🟢 UPDATE SUCCESS')
      console.log('Response:', res.data)
      alert('Biaya berhasil diupdate')
      router.push({ path: '/finansial/biaya/list' })
    } else {
      console.log('🔷 CALLING CREATE: POST /expenses')
      const res = await api.post(EXPENSES_ENDPOINT, fd)
      console.log('🟢 CREATE SUCCESS')
      console.log('Response:', res.data)
      alert('Biaya berhasil disimpan')
      resetForm()
    }
  } catch (err) {
    console.log('🔴 ERROR CAUGHT')
    console.log('Error type:', err?.constructor?.name)
    console.log('Error message:', err?.message)
    console.log('Error config:', err?.config)
    console.log('Request:', err?.request)
    console.log('Response status:', err?.response?.status)
    console.log('Response headers:', err?.response?.headers)
    console.log('Response data:', err?.response?.data)
    console.log('Full error:', err)
    alert(err.response?.data?.message || err.message || 'Gagal menyimpan biaya')
  } finally {
    console.log('🔷 END SUBMIT')
    loading.value = false
  }
}

onMounted(async () => {
  console.log('🟦 InputBiaya Component MOUNTED')
  await fetchExpenseAccounts()
  console.log('🟦 Expense Accounts loaded:', expenseAccounts.value?.length)
  if (route.params.id) {
    console.log('🟦 Edit mode - loading expense:', route.params.id)
    await loadExpense(route.params.id)
  } else {
    console.log('🟦 Create mode - new expense form')
  }
})
</script>

<style scoped></style>
