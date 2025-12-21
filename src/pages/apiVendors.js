import api from '../user/axios'

export const getVendors = async () => {
  try {
    console.log('🌐 API Call - GET /vendors')
    const response = await api.get('/vendors')
    console.log('📦 Vendors response:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Error fetching vendors:', error)
    console.error('📛 Error response:', error.response)
    throw error
  }
}
