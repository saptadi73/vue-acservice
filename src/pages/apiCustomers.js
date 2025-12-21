import api from '../user/axios'

export const getCustomers = async () => {
  try {
    console.log('🌐 API Call - GET /customers/all')
    const response = await api.get('/customers/all')
    console.log('📦 Customers response:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Error fetching customers:', error)
    console.error('📛 Error response:', error.response)
    throw error
  }
}
