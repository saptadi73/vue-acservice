import api from '../user/axios'

export const getSalesOrders = async () => {
  try {
    const response = await api.get('/orders/sale')
    return response.data
  } catch (error) {
    console.error('Error fetching sales orders:', error)
    throw error
  }
}

export const getSalesOrderById = async (id) => {
  try {
    const response = await api.get(`/orders/sale/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching sales order by ID:', error)
    throw error
  }
}

export const createSalesOrder = async (orderData) => {
  try {
    const response = await api.post('/orders/sale', orderData)
    return response.data
  } catch (error) {
    console.error('Error creating sales order:', error)
    throw error
  }
}

export const updateSalesOrder = async (id, orderData) => {
  try {
    const response = await api.post(`/orders/update/sale/${id}`, orderData)
    return response.data
  } catch (error) {
    console.error('Error updating sales order:', error)
    throw error
  }
}

export const deleteProductLine = async (id) => {
  try {
    const response = await api.post(`/orders/delete/sale/product-lines/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting product line:', error)
    throw error
  }
}

export const addServiceLine = async (id, serviceData) => {
  try {
    const response = await api.post(`/orders/add/sale/service-lines/${id}`, serviceData)
    return response.data
  } catch (error) {
    console.error('Error adding service line:', error)
    throw error
  }
}
