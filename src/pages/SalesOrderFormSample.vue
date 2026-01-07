<template>
  <div class="bg-slate-100 text-slate-800 min-h-screen p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header Bar -->
      <div
        class="bg-[#1E64A3] text-white rounded-t-lg px-6 py-3 font-semibold tracking-widest text-center"
      >
        SALES ORDER
      </div>

      <!-- PDF Area -->
      <div ref="pdfArea" class="bg-white shadow rounded-b-lg p-6 border border-slate-200">
        <!-- Top Row: Customer -->
        <div class="grid grid-cols-12 gap-4 items-center text-sm">
          <div class="col-span-12 md:col-span-6 flex items-center gap-2">
            <label class="font-semibold whitespace-nowrap">CUSTOMER NAME:</label>
            <input
              v-model="form.customerName"
              type="text"
              placeholder="Netsuite Customer"
              class="border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 w-full"
            />
          </div>
          <div class="col-span-12 md:col-span-6 flex items-center gap-2">
            <label class="font-semibold whitespace-nowrap">CUSTOMER ID:</label>
            <input
              v-model="form.customerId"
              type="text"
              placeholder="##########"
              class="border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 w-full"
            />
          </div>
        </div>

        <!-- Bill To & Ship To -->
        <div class="grid grid-cols-12 gap-6 mt-6 text-sm">
          <div class="col-span-12 md:col-span-6">
            <div class="font-semibold mb-2 tracking-wide">BILL TO:</div>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <span class="w-24">Name:</span>
                <input
                  v-model="form.billTo.name"
                  placeholder="Netsuite Customer"
                  class="border border-slate-300 rounded-md px-2 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                />
              </div>
              <div class="flex items-center gap-2">
                <span class="w-24">Address 1:</span>
                <input
                  v-model="form.billTo.addr1"
                  placeholder="123 Main St"
                  class="border border-slate-300 rounded-md px-2 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                />
              </div>
              <div class="flex items-center gap-2">
                <span class="w-24">Address 2:</span>
                <input
                  v-model="form.billTo.addr2"
                  class="border border-slate-300 rounded-md px-2 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                />
              </div>
              <div class="grid grid-cols-12 gap-2 items-center">
                <span class="col-span-2">City:</span>
                <input
                  v-model="form.billTo.city"
                  placeholder="Somewhere"
                  class="border border-slate-300 rounded-md px-2 py-1.5 col-span-4 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                />
                <span class="col-span-3 text-right pr-1">State/Region:</span>
                <input
                  v-model="form.billTo.state"
                  placeholder="NY"
                  class="border border-slate-300 rounded-md px-2 py-1.5 col-span-1 text-center focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                />
                <span class="col-span-2 text-right pr-1">Postal Code:</span>
                <input
                  v-model="form.billTo.postal"
                  placeholder="12345"
                  class="border border-slate-300 rounded-md px-2 py-1.5 col-span-1 min-w-24 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                />
              </div>
            </div>
          </div>

          <div class="col-span-12 md:col-span-6">
            <div class="font-semibold mb-2 tracking-wide">SHIP TO:</div>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <span class="w-24">Name:</span>
                <input
                  v-model="form.shipTo.name"
                  placeholder="Netsuite Customer"
                  class="border border-slate-300 rounded-md px-2 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                />
              </div>
              <div class="flex items-center gap-2">
                <span class="w-24">Address 1:</span>
                <input
                  v-model="form.shipTo.addr1"
                  placeholder="PO Box 456"
                  class="border border-slate-300 rounded-md px-2 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                />
              </div>
              <div class="flex items-center gap-2">
                <span class="w-24">Address 2:</span>
                <input
                  v-model="form.shipTo.addr2"
                  class="border border-slate-300 rounded-md px-2 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                />
              </div>
              <div class="grid grid-cols-12 gap-2 items-center">
                <span class="col-span-2">City:</span>
                <input
                  v-model="form.shipTo.city"
                  placeholder="Somewhere"
                  class="border border-slate-300 rounded-md px-2 py-1.5 col-span-4 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                />
                <span class="col-span-3 text-right pr-1">State/Region:</span>
                <input
                  v-model="form.shipTo.state"
                  placeholder="NY"
                  class="border border-slate-300 rounded-md px-2 py-1.5 col-span-1 text-center focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                />
                <span class="col-span-2 text-right pr-1">Postal Code:</span>
                <input
                  v-model="form.shipTo.postal"
                  placeholder="12345"
                  class="border border-slate-300 rounded-md px-2 py-1.5 col-span-1 min-w-24 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Order Info Panel -->
        <div class="grid grid-cols-12 gap-6 mt-6 text-sm">
          <div class="col-span-12 md:col-span-6"></div>
          <div class="col-span-12 md:col-span-6 grid grid-cols-12 gap-2">
            <div class="col-span-5 flex items-center justify-end pr-2">Sales Order No.</div>
            <div class="col-span-7">
              <input
                v-model="form.orderNo"
                placeholder="##########"
                class="border border-slate-300 rounded-md px-2 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
              />
            </div>

            <div class="col-span-5 flex items-center justify-end pr-2">Date</div>
            <div class="col-span-7">
              <input
                v-model="form.date"
                type="date"
                class="border border-slate-300 rounded-md px-2 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
              />
            </div>

            <div class="col-span-5 flex items-center justify-end pr-2">Purchase Order No.</div>
            <div class="col-span-7">
              <input
                v-model="form.poNo"
                placeholder="##########"
                class="border border-slate-300 rounded-md px-2 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
              />
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div class="mt-8">
          <div class="flex items-center justify-between mb-2">
            <button
              @click="addItem"
              class="px-3 py-1.5 rounded-md text-sm font-medium bg-slate-100 border border-slate-300 hover:bg-slate-200"
            >
              + Add Item
            </button>
          </div>
          <div class="overflow-x-auto border rounded-md">
            <table class="min-w-full text-sm">
              <thead class="bg-[#1E64A3] text-white">
                <tr>
                  <th class="px-3 py-2 text-left w-28">Item</th>
                  <th class="px-3 py-2 text-left w-36">Item ID</th>
                  <th class="px-3 py-2 text-left">Description</th>
                  <th class="px-3 py-2 text-right w-28">Unit Cost</th>
                  <th class="px-3 py-2 text-right w-20">Qty</th>
                  <th class="px-3 py-2 text-right w-28">Amount</th>
                  <th class="px-3 py-2 text-left w-36">Tax 11%</th>
                  <th class="px-3 py-2 w-12"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(it, idx) in form.items"
                  :key="it.uid"
                  class="odd:bg-white even:bg-slate-50"
                >
                  <td class="px-3 py-2">
                    <input
                      v-model="it.name"
                      placeholder="Item"
                      class="border border-slate-300 rounded-md px-2 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                    />
                  </td>
                  <td class="px-3 py-2">
                    <input
                      v-model="it.itemId"
                      placeholder="Product/Service ID"
                      class="border border-slate-300 rounded-md px-2 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                    />
                  </td>
                  <td class="px-3 py-2">
                    <input
                      v-model="it.desc"
                      placeholder="Item description"
                      class="border border-slate-300 rounded-md px-2 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                    />
                  </td>
                  <td class="px-3 py-2 text-right">
                    <input
                      v-model.number="it.unitCost"
                      type="number"
                      step="0.01"
                      class="border border-slate-300 rounded-md px-2 py-1.5 w-full text-right focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                    />
                  </td>
                  <td class="px-3 py-2 text-right">
                    <input
                      v-model.number="it.qty"
                      type="number"
                      step="1"
                      class="border border-slate-300 rounded-md px-2 py-1.5 w-full text-right focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                    />
                  </td>
                  <td class="px-3 py-2 text-right">{{ money(it.qty * it.unitCost) }}</td>
                  <td class="px-3 py-2 text-right">
                    <input
                      v-model.number="it.tax"
                      type="number"
                      step="0.01"
                      class="border border-slate-300 rounded-md px-2 py-1.5 w-full text-right focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                    />
                  </td>
                  <td class="px-3 py-2 text-center">
                    <button
                      @click="removeItem(idx)"
                      class="px-2 py-1 text-xs rounded-md bg-rose-100 text-rose-700 hover:bg-rose-200"
                    >
                      Del
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Totals -->
        <div class="grid grid-cols-12 gap-6 mt-4 text-sm">
          <div class="col-span-12 md:col-span-6"></div>
          <div class="col-span-12 md:col-span-6 border rounded-md p-3 bg-slate-50">
            <div class="grid grid-cols-12 gap-2 items-center">
              <div class="col-span-6 text-right pr-2">Subtotal</div>
              <div class="col-span-6 text-right font-medium">{{ money(subtotal) }}</div>

              <div class="col-span-6 text-right pr-2">Tax ( {{ form.taxRate }}% )</div>
              <div class="col-span-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <input
                    v-model.number="form.taxRate"
                    type="number"
                    step="0.01"
                    class="border border-slate-300 rounded-md px-2 py-1.5 w-24 text-right focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                  />
                  <span class="font-medium">{{ money(tax) }}</span>
                </div>
              </div>

              <div class="col-span-6 text-right pr-2 font-semibold">Total</div>
              <div class="col-span-6 text-right font-semibold text-lg">{{ money(total) }}</div>
            </div>
          </div>
        </div>

        <!-- Terms -->
        <div class="mt-8 text-center text-xs tracking-widest text-slate-500">T E R M S</div>
        <textarea
          v-model="form.terms"
          rows="2"
          class="mt-2 border border-slate-300 rounded-md px-2 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
          placeholder="ENTER TERMS HERE: NET 30 Days. Finance charge of 1.5% will be made on unpaid balances after 30 days."
        ></textarea>

        <!-- Actions -->
        <div class="mt-6 flex flex-wrap gap-3">
          <button
            class="bg-slate-700 text-white px-4 py-2 rounded-md shadow hover:bg-slate-800 transition"
          >
            Submit Sales Order
          </button>
          <button
            disabled
            class="bg-gray-300 text-gray-500 border border-gray-300 px-4 py-2 rounded-md shadow cursor-not-allowed"
            title="Fitur sedang diperbaharui"
          >
            Download PDF (Sedang Diperbaharui)
          </button>
        </div>

        <div class="mt-10 text-xs text-right text-slate-500">ArcESB™ 2017 • 17.0.6483.0</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import html2pdf from 'html2pdf.js' - Migrasi ke pdf-lib sedang berlangsung
import * as apiSalesOrder from './apiSalesOrder.js'
import * as apiCustomer from './apiCustomers.js'

const route = useRoute()
const router = useRouter()
const pdfArea = ref(null)

const newItem = () => ({
  uid: crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2),
  name: 'Item',
  itemId: '',
  desc: '',
  unitCost: 0,
  qty: 1,
})

const form = reactive({
  customerName: 'Netsuite Customer',
  customerId: '',
  billTo: {
    name: 'Netsuite Customer',
    addr1: '123 Main St',
    addr2: '',
    city: 'Somewhere',
    state: 'NY',
    postal: '12345',
  },
  shipTo: {
    name: 'Netsuite Customer',
    addr1: 'PO Box 456',
    addr2: '',
    city: 'Somewhere',
    state: 'NY',
    postal: '12345',
  },
  orderNo: '',
  date: new Date().toISOString().slice(0, 10),
  poNo: '',
  items: [newItem(), newItem()],
  taxRate: 11,
  terms:
    'ENTER TERMS HERE: NET 30 Days. Finance charge of 1.5% will be made on unpaid balances after 30 days.',
})

const customers = ref([])
const loading = ref(false)
const error = ref(null)

onMounted(async () => {
  await fetchCustomers()
  if (route.params.id) {
    await fetchOrder(route.params.id)
  }
})

const subtotal = computed(() =>
  form.items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.unitCost) || 0), 0),
)
const tax = computed(() => (subtotal.value * (Number(form.taxRate) || 0)) / 100)
const total = computed(() => subtotal.value + tax.value)

async function fetchCustomers() {
  try {
    const response = await apiCustomer.getCustomers()
    customers.value = response
  } catch (error) {
    console.error('Error fetching customers:', error)
  }
}

async function fetchOrder(id) {
  loading.value = true
  try {
    const response = await apiSalesOrder.getSalesOrderById(id)
    const order = response.data
    // Populate form with order data
    form.orderNo = order.order_number
    form.date = order.order_date
    form.customerId = order.customer_id
    form.customerName = order.customer?.name || ''
    // Populate billTo and shipTo if available
    if (order.customer) {
      form.billTo.name = order.customer.name
      form.shipTo.name = order.customer.name
    }
    // Populate items from product_lines and service_lines
    form.items = []
    if (order.product_lines) {
      order.product_lines.forEach((line) => {
        form.items.push({
          uid: crypto.randomUUID(),
          name: line.product?.name || 'Product',
          itemId: line.product_id,
          desc: line.description,
          unitCost: parseFloat(line.unit_price),
          qty: parseFloat(line.qty),
        })
      })
    }
    if (order.service_lines) {
      order.service_lines.forEach((line) => {
        form.items.push({
          uid: crypto.randomUUID(),
          name: line.service?.name || 'Service',
          itemId: line.service_id,
          desc: line.description,
          unitCost: parseFloat(line.unit_price),
          qty: parseFloat(line.qty),
        })
      })
    }
  } catch (error) {
    console.error('Error fetching order:', error)
    error.value = 'Gagal memuat data order.'
  } finally {
    loading.value = false
  }
}

function addItem() {
  form.items.push(newItem())
}
function removeItem(i) {
  form.items.splice(i, 1)
}
function money(v) {
  return (v || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

async function submitOrder() {
  loading.value = true
  error.value = null
  try {
    const orderData = {
      order_number: form.orderNo,
      order_date: form.date,
      status: 'draft',
      subtotal: subtotal.value,
      tax: tax.value,
      total: total.value,
      customer_id: form.customerId,
      product_lines: form.items
        .filter((item) => item.itemId)
        .map((item, index) => ({
          product_id: item.itemId,
          line_number: index + 1,
          description: item.desc,
          qty: item.qty,
          unit_price: item.unitCost,
          discount: 0,
          line_total: item.qty * item.unitCost,
        })),
      service_lines: [], // For now, assuming all are products
    }

    if (route.params.id) {
      await apiSalesOrder.updateSalesOrder(route.params.id, orderData)
      alert('Sales Order berhasil diperbarui!')
    } else {
      await apiSalesOrder.createSalesOrder(orderData)
      alert('Sales Order berhasil dibuat!')
    }
    router.push({ name: 'daftar Sales Order' })
  } catch (error) {
    console.error('Error submitting order:', error)
    error.value = 'Gagal menyimpan sales order.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/*****
  Tailwind is used for styling; make sure your project is configured with Tailwind.
*****/
</style>
