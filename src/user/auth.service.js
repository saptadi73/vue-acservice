import axios from 'axios'
import { BASE_URL } from '../base.utils.url.ts'

const authService = {
  register(user) {
    return axios
      .post(`${BASE_URL}auth/register`, {
        name: user.name,
        email: user.email,
        password: user.password,
        role_id: user.role_id,
      })
      .then((response) => {
        if (response.data.status) {
          console.log('Registration success')
          return response.data
        }
      })
      .catch((error) => {
        console.error('Registration error:', error)
        throw error
      })
  },

  login(credentials) {
    return axios
      .post(`${BASE_URL}auth/login`, credentials)
      .then((response) => {
        if (response.data.status) {
          localStorage.setItem('token', response.data.data.token)
          localStorage.setItem('user', JSON.stringify(response.data.data))
          localStorage.setItem('roles', JSON.stringify([response.data.data.role]))
          return response.data
        }
      })
      .catch((error) => {
        console.error('Login error:', error)
        throw error
      })
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('roles')
    localStorage.removeItem('email')
  },
}

export default authService
