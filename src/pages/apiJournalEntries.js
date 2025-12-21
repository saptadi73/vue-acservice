import api from '../user/axios'

export const getJournalEntries = async (params = {}) => {
  try {
    const response = await api.get('/accounting/journals', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching journal entries:', error)
    throw error
  }
}

export const getJournalEntryById = async (id) => {
  try {
    const response = await api.get(`/accounting/journals/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching journal entry by ID:', error)
    throw error
  }
}

export const createMiscellaneousJournal = async (data) => {
  try {
    console.log('🌐 API Call - POST /accounting/journals/miscellaneous')
    console.log('📤 Request payload:', JSON.stringify(data, null, 2))
    const response = await api.post('/accounting/journals/miscellaneous', data)
    console.log('📥 API Response:', response)
    console.log('📦 Response data:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ API Error creating journal entry:', error)
    console.error('📛 Error response:', error.response)
    console.error('📛 Error data:', error.response?.data)
    throw error
  }
}

export const updateJournalEntry = async (id, data) => {
  try {
    console.log(`🌐 API Call - PUT /accounting/journals/${id}`)
    console.log('📤 Request payload:', JSON.stringify(data, null, 2))
    const response = await api.put(`/accounting/journals/${id}`, data)
    console.log('📥 API Response:', response)
    console.log('📦 Response data:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ API Error updating journal entry:', error)
    console.error('📛 Error response:', error.response)
    console.error('📛 Error data:', error.response?.data)
    throw error
  }
}

export const deleteJournalEntry = async (id) => {
  try {
    const response = await api.delete(`/accounting/journals/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting journal entry:', error)
    throw error
  }
}
