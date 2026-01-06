<template>
  <div class="p-8 space-y-8">
    <!-- Main Title Section -->
    <div class="flex justify-center items-center mb-8">
      <h1 class="text-4xl font-semibold text-gray-800 font-montserrat">
        Dashboard Service AC Lestari
      </h1>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      <p class="ml-4 text-gray-600">Loading dashboard data...</p>
    </div>

    <!-- Error State with Debug Info -->
    <div v-if="errorMessage && !isLoading" class="space-y-4">
      <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
        <p class="font-bold mb-2">❌ Error Loading Dashboard</p>
        <p class="mb-4">{{ errorMessage }}</p>

        <!-- Debug Information -->
        <details class="mt-4 cursor-pointer">
          <summary class="font-semibold text-red-800 hover:text-red-900">
            🔍 Debug Information
          </summary>
          <div class="mt-3 bg-red-50 p-3 rounded text-sm space-y-2 font-mono text-red-900">
            <div>
              <strong>API URL:</strong><br />
              <code>{{ debugInfo.apiUrl }}</code>
            </div>
            <div>
              <strong>Token Present:</strong><br />
              <code>{{ debugInfo.tokenStatus }}</code>
            </div>
            <div>
              <strong>Error Type:</strong><br />
              <code>{{ debugInfo.errorType }}</code>
            </div>
            <div>
              <strong>Error Message:</strong><br />
              <code>{{ debugInfo.errorDetails }}</code>
            </div>
            <div>
              <strong>Months Parameter:</strong><br />
              <code>{{ monthsToDisplay }}</code>
            </div>
          </div>
        </details>

        <!-- Retry Button -->
        <button
          @click="fetchDashboardData"
          class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition"
        >
          🔄 Retry
        </button>

        <!-- Troubleshooting Guide -->
        <div class="mt-4 bg-yellow-50 border border-yellow-200 p-3 rounded">
          <p class="font-semibold text-yellow-800 mb-2">💡 Troubleshooting:</p>
          <ul class="text-sm text-yellow-900 space-y-1 list-disc list-inside">
            <li>
              Pastikan Backend Server berjalan di <code>{{ getBackendHost() }}</code>
            </li>
            <li>Periksa console (F12) untuk error lebih detail</li>
            <li>Pastikan token masih valid dan tidak expired</li>
            <li>Cek network tab untuk melihat request yang sebenarnya</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-if="!isLoading && dashboardData">
      <!-- Success Message -->
      <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-4">
        <p class="font-bold">✓ Dashboard data retrieved successfully!</p>
      </div>

      <!-- Data Structure Debug -->
      <details class="mb-4 bg-blue-50 border border-blue-200 p-3 rounded cursor-pointer">
        <summary class="font-semibold text-blue-800 hover:text-blue-900">
          🔍 Data Structure (Click to expand)
        </summary>
        <pre class="mt-3 bg-white p-3 rounded text-xs overflow-auto max-h-64">{{
          JSON.stringify(dashboardData, null, 2)
        }}</pre>
      </details>

      <!-- Summary Section - KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Work Orders Today -->
        <div
          class="bg-gradient-to-r from-blue-500 to-teal-400 p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105 flex flex-col items-center"
        >
          <h3 class="text-lg font-semibold text-white">Work Orders Today</h3>
          <p class="text-3xl font-bold text-white">{{ dashboardData.workorder_metrics.today }}</p>
        </div>

        <!-- Work Orders Finished -->
        <div
          class="bg-gradient-to-r from-green-500 to-yellow-400 p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105 flex flex-col items-center"
        >
          <h3 class="text-lg font-semibold text-white">Work Orders Finished</h3>
          <p class="text-3xl font-bold text-white">
            {{ dashboardData.workorder_status.completed }}
          </p>
        </div>

        <!-- Work Orders Pending -->
        <div
          class="bg-gradient-to-r from-red-500 to-pink-400 p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105 flex flex-col items-center"
        >
          <h3 class="text-lg font-semibold text-white">Work Orders Pending</h3>
          <p class="text-3xl font-bold text-white">{{ dashboardData.workorder_metrics.pending }}</p>
        </div>

        <!-- Employees Present -->
        <div
          class="bg-gradient-to-r from-purple-500 to-indigo-400 p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105 flex flex-col items-center"
        >
          <h3 class="text-lg font-semibold text-white">Employees Present</h3>
          <p class="text-3xl font-bold text-white">
            {{ dashboardData.attendance_metrics.present }}/{{
              dashboardData.attendance_metrics.total
            }}
          </p>
        </div>
      </div>

      <!-- Chart Section -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <!-- Workorder Status Pie Chart -->
        <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl">
          <h3 class="text-xl font-semibold text-gray-700 mb-4">Work Orders Status</h3>
          <div class="pie-chart-container">
            <pie-chart :data="pieChartData" :options="chartOptions" />
          </div>
        </div>

        <!-- Sales Line Chart -->
        <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl">
          <h3 class="text-xl font-semibold text-gray-700 mb-4">Sales (Monthly)</h3>
          <div class="line-chart-container">
            <line-chart :data="salesChartData" :options="chartOptions" />
          </div>
        </div>

        <!-- Purchases Line Chart -->
        <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl">
          <h3 class="text-xl font-semibold text-gray-700 mb-4">Purchases (Monthly)</h3>
          <div class="line-chart-container">
            <line-chart :data="purchasesChartData" :options="chartOptions" />
          </div>
        </div>

        <!-- Expenses Line Chart -->
        <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl">
          <h3 class="text-xl font-semibold text-gray-700 mb-4">Expenses (Monthly)</h3>
          <div class="line-chart-container">
            <line-chart :data="expensesChartData" :options="chartOptions" />
          </div>
        </div>
      </div>

      <!-- Comparison Chart -->
      <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">
          Purchases & Expenses vs Sales Comparison
        </h3>
        <div class="comparison-chart-container">
          <BarChart :data="comparisonChartData" :options="comparisonChartOptions" />
        </div>
      </div>
    </div>

    <!-- No Data State -->
    <div
      v-if="!isLoading && !errorMessage && !dashboardData"
      class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded"
    >
      <p class="font-bold mb-2">⚠️ No Dashboard Data</p>
      <p class="mb-4">Dashboard data is empty. Please check:</p>
      <ul class="list-disc list-inside text-sm space-y-1">
        <li>Backend API is returning data correctly</li>
        <li>Token is valid and not expired</li>
        <li>Check browser console (F12) for detailed error logs</li>
      </ul>
      <button
        @click="fetchDashboardData"
        class="mt-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded font-semibold transition"
      >
        🔄 Retry
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { Pie, Line, Bar } from 'vue-chartjs'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Filler,
} from 'chart.js'
import { BASE_URL } from '../base.utils.url.ts'

// Register ChartJS components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Filler,
)

export default {
  name: 'DashboardServiceAC',
  components: {
    PieChart: Pie,
    LineChart: Line,
    BarChart: Bar,
  },
  setup() {
    const router = useRouter()
    const dashboardData = ref(null)
    const isLoading = ref(true)
    const errorMessage = ref('')
    const monthsToDisplay = ref(6)
    const debugInfo = ref({
      apiUrl: '',
      tokenStatus: '',
      errorType: '',
      errorDetails: '',
    })

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
      },
    }

    const comparisonChartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    }

    const getToken = () => localStorage.getItem('token')

    const getBackendHost = () => {
      return BASE_URL.replace(/\/$/, '') || 'http://localhost:8080'
    }

    const fetchDashboardData = async () => {
      try {
        isLoading.value = true
        errorMessage.value = ''

        const token = getToken()
        const apiUrl = `${BASE_URL}dashboard?months=${monthsToDisplay.value}`

        // Update debug info
        debugInfo.value.apiUrl = apiUrl
        debugInfo.value.tokenStatus = token
          ? `✓ Token present (${token.substring(0, 20)}...)`
          : '✗ No token'
        debugInfo.value.errorType = ''
        debugInfo.value.errorDetails = ''

        if (!token) {
          throw new Error('Token not found. Please login first.')
        }

        console.log('🔍 Fetching Dashboard Data')
        console.log('URL:', apiUrl)
        console.log('Token:', token.substring(0, 30) + '...')

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 second timeout
        })

        console.log('✓ Response received:', response.status)
        console.log('Full Response Data:', response.data)

        // Check for both 'success' and 'status' keys (API compatibility)
        if (response.data.success || response.data.status) {
          dashboardData.value = response.data.data
          console.log('✓ Dashboard data loaded successfully')
          console.log('Data Keys:', Object.keys(response.data.data))
          console.log('Workorder Metrics:', response.data.data.workorder_metrics)
          console.log('Attendance Metrics:', response.data.data.attendance_metrics)
          console.log('Workorder Status:', response.data.data.workorder_status)
          console.log('Sales Data Length:', response.data.data.sales_data?.length)
        } else {
          errorMessage.value = response.data.message || 'Failed to load dashboard data'
          debugInfo.value.errorType = 'API Error'
          debugInfo.value.errorDetails = response.data.message || 'Unknown error'
          console.log('API returned success=false:', response.data)
        }
      } catch (error) {
        console.error('❌ Error fetching dashboard:', error)

        // Set debug info for error
        debugInfo.value.errorType = error.code || error.name || 'Unknown Error'
        debugInfo.value.errorDetails = error.message

        if (error.response) {
          // Server responded with error status
          console.error('Response status:', error.response.status)
          console.error('Response data:', error.response.data)
          debugInfo.value.errorDetails = `Server Error: ${error.response.status} - ${error.response.data?.message || error.message}`
          errorMessage.value = `Server Error: ${error.response.status}`
        } else if (error.request) {
          // Request made but no response
          console.error('No response received:', error.request)
          debugInfo.value.errorDetails =
            'Network Error: No response from server. Backend may be down.'
          errorMessage.value = `Network Error: Cannot reach ${getBackendHost()}`
        } else {
          // Something else happened
          console.error('Error setup:', error.message)
          debugInfo.value.errorDetails = error.message
          errorMessage.value = error.message
        }
      } finally {
        isLoading.value = false
      }
    }

    // Computed properties for chart data
    const pieChartData = computed(() => {
      if (!dashboardData.value) return null
      return {
        labels: ['Completed', 'Pending'],
        datasets: [
          {
            label: 'Work Orders Status',
            data: [
              dashboardData.value.workorder_status.completed,
              dashboardData.value.workorder_status.pending,
            ],
            backgroundColor: ['#3b82f6', '#ef4444'],
            borderColor: '#fff',
            borderWidth: 2,
          },
        ],
      }
    })

    const salesChartData = computed(() => {
      if (!dashboardData.value) return null
      return {
        labels: dashboardData.value.sales_data.map((d) => d.month),
        datasets: [
          {
            label: 'Sales',
            data: dashboardData.value.sales_data.map((d) => d.sales),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: '#10b981',
          },
        ],
      }
    })

    const purchasesChartData = computed(() => {
      if (!dashboardData.value) return null
      return {
        labels: dashboardData.value.purchases_data.map((d) => d.month),
        datasets: [
          {
            label: 'Purchases',
            data: dashboardData.value.purchases_data.map((d) => d.purchases),
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: '#f59e0b',
          },
        ],
      }
    })

    const expensesChartData = computed(() => {
      if (!dashboardData.value) return null
      return {
        labels: dashboardData.value.expenses_data.map((d) => d.month),
        datasets: [
          {
            label: 'Expenses',
            data: dashboardData.value.expenses_data.map((d) => d.expenses),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: '#ef4444',
          },
        ],
      }
    })

    const comparisonChartData = computed(() => {
      if (!dashboardData.value) return null
      return {
        labels: dashboardData.value.comparison_data.map((d) => d.month),
        datasets: [
          {
            label: 'Purchases',
            type: 'bar',
            data: dashboardData.value.comparison_data.map((d) => d.purchases),
            backgroundColor: 'rgba(245, 158, 11, 0.6)',
            borderColor: '#f59e0b',
            borderWidth: 1,
          },
          {
            label: 'Expenses',
            type: 'bar',
            data: dashboardData.value.comparison_data.map((d) => d.expenses),
            backgroundColor: 'rgba(239, 68, 68, 0.6)',
            borderColor: '#ef4444',
            borderWidth: 1,
          },
          {
            label: 'Sales',
            type: 'line',
            data: dashboardData.value.comparison_data.map((d) => d.sales),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            fill: false,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: '#3b82f6',
          },
        ],
      }
    })

    onMounted(() => {
      const token = getToken()
      if (!token) {
        router.push('/login')
      } else {
        fetchDashboardData()
      }
    })

    return {
      dashboardData,
      isLoading,
      errorMessage,
      monthsToDisplay,
      debugInfo,
      chartOptions,
      comparisonChartOptions,
      pieChartData,
      salesChartData,
      purchasesChartData,
      expensesChartData,
      comparisonChartData,
      fetchDashboardData,
      getBackendHost,
    }
  },
}
</script>

<style scoped>
/* Chart container styling */
.pie-chart-container {
  height: 350px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.line-chart-container {
  height: 300px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.comparison-chart-container {
  height: 400px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .pie-chart-container {
    height: 300px;
  }

  .line-chart-container {
    height: 250px;
  }

  .comparison-chart-container {
    height: 350px;
  }
}

@media (max-width: 640px) {
  .pie-chart-container {
    height: 250px;
  }

  .line-chart-container {
    height: 200px;
  }

  .comparison-chart-container {
    height: 300px;
  }
}

/* Card hover effect */
.card:hover {
  transform: scale(1.05);
}
</style>
