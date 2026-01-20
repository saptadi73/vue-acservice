// stores/serviceAlerts.js
import { defineStore } from 'pinia'

export const useServiceAlertsStore = defineStore('service-alerts', {
  state: () => ({
    overdueCount: 0,
  }),
  actions: {
    setOverdueCount(n) {
      this.overdueCount = Number.isFinite(n) ? n : 0
    },
    reset() {
      this.overdueCount = 0
    },
  },
})
