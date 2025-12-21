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
    const response = await api.post('/accounting/journals/miscellaneous', data)
    return response.data
  } catch (error) {
    console.error('Error creating journal entry:', error)
    throw error
  }
}

export const updateJournalEntry = async (id, data) => {
  try {
    const response = await api.put(`/accounting/journals/${id}`, data)
    return response.data
  } catch (error) {
    console.error('Error updating journal entry:', error)
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
