<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a
        href="#"
        class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
      >
        <img class="w-8 h-8 mr-2" src="../assets//images/ac_lestari.png" alt="logo" />
        <span class="font-bold text-[#ca13c5] font-Poppins">AC</span
        ><span class="font-semibold text-[#2b94f1] font-Roboto">Lestari</span
        ><span class="text-base font-bold font-Poppins text-[#BDB76B}">.com</span>
      </a>
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            Sign in
          </h1>
          <form class="space-y-4 md:space-y-6" @submit.prevent="login">
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Email</label
              >
              <input
                type="email"
                name="email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                required=""
              />
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Password</label
              >
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
              />
            </div>
            <button
              type="submit"
              class="w-full text-white bg-blue-800 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
      <ToastCard v-if="showToast" :message_toast="toastMessage" v-on:dismissToast="tutupToast" />
    </div>
  </section>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { BASE_URL } from '../base.utils.url.ts'
import router from '../router'
import ToastCard from '../components/ToastCard.vue'

const showToast = ref(false)
const toastMessage = ref('')

async function login() {
  try {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('roles')
    localStorage.removeItem('user_roles')
    localStorage.removeItem('email')
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const dataLogin = { email: email, password: password }
    const response = await axios.post(`${BASE_URL}auth/login`, dataLogin, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.data.status) {
      const token = response.data.data.token
      const role = response.data.data.role

      // Simpan token
      localStorage.setItem('token', token)

      // Simpan user data (email dari form)
      localStorage.setItem('user', JSON.stringify({ email, role }))

      // Simpan roles (format lama)
      localStorage.setItem('roles', JSON.stringify([role]))

      // Simpan email
      localStorage.setItem('email', email)

      // Fetch user roles dari API
      try {
        const rolesResponse = await axios.get(`${BASE_URL}roles/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (rolesResponse.data.success || rolesResponse.data.status) {
          const users = rolesResponse.data.data || rolesResponse.data.users || []
          const currentUser = users.find((u) => u.email === email)

          if (currentUser && currentUser.roles) {
            // Simpan user_roles dari API
            localStorage.setItem('user_roles', JSON.stringify(currentUser.roles))
          } else {
            // Fallback jika tidak ada roles dari API
            const userRoles = [
              {
                id: role,
                name: role.toLowerCase(),
                label: role,
              },
            ]
            localStorage.setItem('user_roles', JSON.stringify(userRoles))
          }
        }
      } catch (rolesError) {
        console.error('Error fetching roles:', rolesError)
        // Fallback: simpan role dari login response
        const userRoles = [
          {
            id: role,
            name: role.toLowerCase(),
            label: role,
          },
        ]
        localStorage.setItem('user_roles', JSON.stringify(userRoles))
      }

      // Tunggu sebentar sebelum navigate
      await router.push('/main/dashboard')
      return
    } else {
      showToast.value = true
      toastMessage.value = response.data.message || 'Login gagal'
      console.log(response.data)
    }
  } catch (error) {
    showToast.value = true
    toastMessage.value = error.response?.data?.message || 'Login gagal. Silahkan coba lagi.'
    console.error('Login error:', error)
  }
}

function tutupToast() {
  showToast.value = false
  window.location.reload()
}
</script>

<style lang="scss" scoped></style>
