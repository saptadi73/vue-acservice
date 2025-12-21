import api from '../user/axios'

export const getChartOfAccounts = async (params = {}) => {
  try {
    const response = await api.get('/chart-of-accounts', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching chart of accounts:', error)
    throw error
  }
}

export const getChartOfAccountById = async (id) => {
  try {
    const response = await api.get(`/chart-of-accounts/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching chart of account by ID:', error)
    throw error
  }
}

export const createChartOfAccount = async (data) => {
  try {
    const response = await api.post('/chart-of-accounts', data)
    return response.data
  } catch (error) {
    console.error('Error creating chart of account:', error)
    throw error
  }
}

export const updateChartOfAccount = async (id, data) => {
  try {
    const response = await api.put(`/chart-of-accounts/${id}`, data)
    return response.data
  } catch (error) {
    console.error('Error updating chart of account:', error)
    throw error
  }
}

export const deleteChartOfAccount = async (id) => {
  try {
    const response = await api.delete(`/chart-of-accounts/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting chart of account:', error)
    throw error
  }
}
