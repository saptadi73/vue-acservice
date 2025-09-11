<template>
  <div class="bg-gray-50 p-4 min-h-screen flex flex-col items-center justify-center">
    <div class="mx-auto w-full max-w-sm">
      <div class="mb-8 flex flex-col items-center justify-center">
        <div class="mb-6 pb-8 w-full border-b border-gray-200">
          <img class="mx-auto h-12 w-auto" src="../assets/images/ac_lestari.png" alt="Singhe UI" />
        </div>
        <h2 class="text-center text-xl leading-snug font-bold text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <div
        class="bg-white py-10 px-8 rounded-md shadow hover:shadow-md duration-200 transform-shadow"
      >
        <form @submit="login">
          <div class="space-y-6">
            <div>
              <label for="email" class="block mb-2 text-sm font-medium leading-normal text-gray-900"
                >Email address</label
              >
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                v-model="email"
                required
                class="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-500 text-base leading-7"
              />
            </div>
            <div>
              <div class="mb-2 flex items-center justify-between">
                <label for="password" class="block text-sm font-medium leading-normal text-gray-900"
                  >Password</label
                >
                <a
                  href="#"
                  class="text-sm font-semibold leading-normal text-teal-500 hover:text-teal-900 duration-200 transition"
                  >Forgot password?</a
                >
              </div>
              <div class="flex items-stretch rounded-md shadow-sm">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  v-model="password"
                  required
                  class="peer block w-full rounded-tl-md rounded-bl-md border-0 py-2 text-gray-900 placeholder:text-gray-400 text-base leading-7 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-500"
                />
                <button
                  type="button"
                  class="bg-gray-100 w-16 text-sm text-gray-500 -ml-1 ring-1 ring-inset ring-gray-300 rounded-tr-md rounded-br-md peer-focus:ring-2 peer-focus:ring-inset peer-focus:ring-teal-500"
                >
                  <font-awesome-icon icon="fa-regular fa-eye-slash" />
                  <!-- <font-awesome-icon icon="fa-regular fa-eye" /> -->
                </button>
              </div>
            </div>
            <div>
              <button
                type="submit"
                class="w-full rounded-md bg-teal-500 px-3 py-2 text-base font-semibold leading-7 text-white shadow-sm hover:bg-teal-900 duration-200 transition"
              >
                Sign in
              </button>
            </div>
          </div>
        </form>
        <div v-if="error" class="mt-4 text-red-600 text-center font-semibold">{{ error }}</div>
      </div>
      <p class="mt-8 text-center text-sm text-gray-500">
        Not a member?
        <a
          href="#"
          class="font-semibold leading-6 text-teal-500 hover:text-teal-900 duration-200 transform"
          >Register</a
        >
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      error: '',
      loading: false,
    }
  },
  methods: {
    async login(e) {
      e.preventDefault()
      this.error = ''
      this.loading = true
      // Simulasi login API
      try {
        // Ganti dengan request ke backend Anda
        if (this.email === 'admin@example.com' && this.password === 'password123') {
          const token = 'dummy-token-1234567890'
          localStorage.setItem('auth_token', token)
          // Redirect ke dashboard atau halaman utama
          this.$router.push({ name: 'DashboardBengkel' })
        } else {
          this.error = 'Email atau password salah.'
        }
      } catch (err) {
        this.error = 'Terjadi kesalahan, silakan coba lagi.'
        console.log('Login error:', err)
      }
      this.loading = false
    },
  },
}
</script>
