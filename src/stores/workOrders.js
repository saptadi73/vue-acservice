// stores/workOrders.js
import { defineStore } from 'pinia'
import api from '@/user/axios'

export const useWorkOrdersStore = defineStore('work-orders', {
  state: () => ({
    workOrders: [],
    incompleteCount: 0,
    isLoading: false,
  }),
  getters: {
    incomplete() {
      // Count WOs where status is not "Selesai" (completed)
      return this.workOrders.filter((wo) => wo.status !== 'Selesai').length
    },
  },
  actions: {
    async fetchWorkOrders() {
      this.isLoading = true
      try {
        const response = await api.get('/wo/wo/list')
        this.workOrders = Array.isArray(response.data.data) ? response.data.data : []
        this.incompleteCount = this.incomplete
      } catch (error) {
        console.error('Failed to fetch work orders:', error)
        this.workOrders = []
        this.incompleteCount = 0
      } finally {
        this.isLoading = false
      }
    },
    setWorkOrders(list) {
      this.workOrders = Array.isArray(list) ? list : []
      this.incompleteCount = this.incomplete
    },
    clear() {
      this.workOrders = []
      this.incompleteCount = 0
    },
  },
})
