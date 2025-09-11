<template>
  <div
    class="container mx-auto p-8 bg-gradient-to-br from-blue-50 via-white to-teal-50 min-h-screen rounded-2xl shadow-xl"
  >
    <!-- Title -->
    <div class="flex flex-col items-center mb-8">
      <div class="flex items-center gap-3">
        <span class="inline-block bg-blue-100 p-3 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5"
            />
          </svg>
        </span>
        <h2 class="text-3xl font-bold text-blue-700 font-lexend tracking-wide">Service Reminder</h2>
      </div>
      <div class="w-24 h-1 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full mt-4"></div>
    </div>

    <!-- Search Bar -->
    <div class="mb-6 flex justify-center">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari pelanggan..."
        class="px-6 py-3 border-2 border-blue-200 rounded-full w-full max-w-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-lg"
      />
    </div>

    <!-- Table -->
    <table class="min-w-full bg-white border border-blue-100 rounded-2xl shadow-xl overflow-hidden">
      <thead>
        <tr class="bg-gradient-to-r from-blue-100 to-teal-100">
          <th class="px-6 py-4 text-left font-semibold text-blue-700">Nama Pelanggan</th>
          <th class="px-6 py-4 text-left font-semibold text-blue-700">Tipe</th>
          <th class="px-6 py-4 text-left font-semibold text-blue-700">Brand</th>
          <th class="px-6 py-4 text-left font-semibold text-blue-700">No. HP</th>
          <th class="px-6 py-4 text-left font-semibold text-blue-700">Last Service</th>
          <th class="px-6 py-4 text-left font-semibold text-blue-700">Next Service</th>
          <th class="px-6 py-4 text-left font-semibold text-blue-700">Pengingat Otomatis</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="customer in filteredCustomers"
          :key="customer.id"
          :class="
            (customer.autoReminder ? 'bg-teal-50' : 'bg-white') + ' hover:bg-blue-50 transition-all'
          "
        >
          <td class="px-6 py-4 font-medium text-gray-800">{{ customer.name }}</td>
          <td class="px-6 py-4 text-gray-700">{{ customer.type }}</td>
          <td class="px-6 py-4 text-gray-700">{{ customer.brand }}</td>
          <td class="px-6 py-4 text-gray-700">{{ customer.phone }}</td>
          <td class="px-6 py-4">
            <span
              class="inline-block px-3 py-1 rounded-full text-xs font-bold"
              :class="
                isServiceDue(customer.nextService)
                  ? 'bg-red-100 text-red-600'
                  : 'bg-green-100 text-green-600'
              "
            >
              {{ customer.lastService }}
            </span>
          </td>
          <td class="px-6 py-4">
            <span
              class="inline-block px-3 py-1 rounded-full text-xs font-bold"
              :class="
                isServiceDue(customer.nextService)
                  ? 'bg-red-100 text-red-600'
                  : 'bg-green-100 text-green-600'
              "
            >
              {{ customer.nextService }}
            </span>
          </td>
          <td class="px-6 py-4">
            <label
              :for="'toggleReminder-' + customer.id"
              class="inline-flex relative items-center cursor-pointer"
            >
              <input
                :id="'toggleReminder-' + customer.id"
                type="checkbox"
                v-model="customer.autoReminder"
                class="sr-only"
                @click="toggleReminder(customer)"
              />
              <span
                class="w-11 h-6 rounded-full transition-all duration-300"
                :class="
                  customer.autoReminder
                    ? 'bg-gradient-to-r from-green-400 to-teal-400'
                    : 'bg-gray-300'
                "
              ></span>
              <span
                class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ease-in-out duration-300"
                :class="customer.autoReminder ? 'transform translate-x-5' : ''"
              ></span>
            </label>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      customers: [
        {
          id: 1,
          name: 'John Doe',
          licensePlate: 'B123XYZ',
          type: 'Sedan',
          brand: 'Toyota',
          phone: '081234567890',
          lastService: '2025-08-01',
          nextService: '2025-09-01',
          autoReminder: false,
        },
        {
          id: 2,
          name: 'Jane Smith',
          licensePlate: 'B456ABC',
          type: 'SUV',
          brand: 'Honda',
          phone: '081298765432',
          lastService: '2025-07-15',
          nextService: '2025-08-15',
          autoReminder: true,
        },
        {
          id: 3,
          name: 'Mike Johnson',
          licensePlate: 'B789DEF',
          type: 'Coupe',
          brand: 'BMW',
          phone: '081234598761',
          lastService: '2025-06-20',
          nextService: '2025-07-20',
          autoReminder: false,
        },
        // More customers
      ],
    }
  },
  computed: {
    filteredCustomers() {
      return this.customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          customer.licensePlate.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          customer.type.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          customer.brand.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          customer.phone.includes(this.searchQuery),
      )
    },
  },
  methods: {
    toggleReminder(customer) {
      customer.autoReminder = !customer.autoReminder
    },
    isServiceDue(nextService) {
      // Simple check: if nextService date < today, return true
      const today = new Date().toISOString().slice(0, 10)
      return nextService < today
    },
  },
}
</script>

<style scoped>
/* Modern Table Styles */
table {
  border-collapse: separate;
  border-spacing: 0;
}
th,
td {
  transition:
    background 0.2s,
    color 0.2s;
}
</style>
