// src/api.js

import axios from 'axios'
import { BASE_URL } from '@/base.utils.url'

// URL base API (sesuaikan dengan URL API yang Anda gunakan)
const apiBaseUrl = BASE_URL

// Membuat instance axios dengan baseURL
const apiCustomerInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000, // set timeout untuk request
  headers: {
    'Content-Type': 'application/json',
  },
})

// Fungsi untuk mendapatkan semua data
export const getAllBrand = async () => {
  try {
    const response = await apiCustomerInstance.get('/customers/brand')
    return response.data // Mengembalikan data dari response
  } catch (error) {
    console.error('Error fetching all data:', error)
    return error.response ? error.response.data : null
  }
}

// Fungsi untuk mendapatkan data berdasarkan ID
export const getAllTipe = async () => {
  try {
    const response = await apiCustomerInstance.get(`/customers/tipe`)
    return response.data // Mengembalikan data dari response
  } catch (error) {
    console.error(`Error fetching data tipe:`, error)
    return error.response ? error.response.data : null
  }
}

export default apiCustomerInstance
