// stores/customers.js
import { defineStore } from 'pinia'

function addMonths(dateStr, months = 3) {
  const d = new Date(dateStr)
  const day = d.getDate()
  d.setMonth(d.getMonth() + months)
  if (d.getDate() < day) d.setDate(0)
  return d.toISOString().slice(0, 10)
}

function withComputedService(c) {
  const last = c.lastService ? c.lastService : null
  const next = c.nextService ? c.nextService : last ? addMonths(last, 3) : null
  return { ...c, _lastService: last, _nextService: next }
}

function daysUntil(dateStr, now = new Date()) {
  if (!dateStr) return Infinity
  const d = new Date(dateStr)
  return Math.ceil((d - now) / (1000 * 60 * 60 * 24))
}

export const useCustomersStore = defineStore('customers', {
  state: () => ({
    customers: [],
  }),
  getters: {
    overdueCount(state) {
      const now = new Date()
      return state.customers
        .map((c) => withComputedService(c))
        .reduce((acc, c) => acc + (daysUntil(c._nextService, now) < 0 ? 1 : 0), 0)
    },
  },
  actions: {
    setCustomers(list) {
      this.customers = Array.isArray(list) ? list : []
    },
    clear() {
      this.customers = []
    },
  },
})
