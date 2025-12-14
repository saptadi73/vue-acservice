import api from '../user/axios'

export const getPurchaseOrders = async () => {
  try {
    const response = await api.get('/orders/purchase')
    return response.data
  } catch (error) {
    console.error('Error fetching purchase orders:', error)
    throw error
  }
}

export const getPurchaseOrderById = async (id) => {
  try {
    const response = await api.get(`/orders/purchase/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching purchase order by ID:', error)
    throw error
  }
}

export const createPurchaseOrder = async (orderData) => {
  try {
    const response = await api.post('/orders/purchase', orderData)
    return response.data
  } catch (error) {
    console.error('Error creating purchase order:', error)
    throw error
  }
}

export const updatePurchaseOrder = async (id, orderData) => {
  try {
    const response = await api.post(`/orders/update/purchase/${id}`, orderData)
    return response.data
  } catch (error) {
    console.error('Error updating purchase order:', error)
    throw error
  }
}

export const deletePurchaseOrder = async (id) => {
  try {
    const response = await api.post(`/orders/delete/purchase/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting purchase order:', error)
    throw error
  }
}

export const deletePurchaseOrderLine = async (id) => {
  try {
    const response = await api.post(`/orders/delete/purchase/product-lines/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting purchase order line:', error)
    throw error
  }
}

export const addPurchaseOrderLine = async (id, lineData) => {
  try {
    const response = await api.post(`/orders/add/purchase/product-lines/${id}`, lineData)
    return response.data
  } catch (error) {
    console.error('Error adding purchase order line:', error)
    throw error
  }
}
