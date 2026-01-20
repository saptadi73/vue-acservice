<template>
  <header class="sticky top-0 z-30 flex-none">
    <nav class="bg-white border-b border-gray-200">
      <div class="px-4 xl:px-6">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <button
              type="button"
              class="inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-100 bg-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-200 hover:border-gray-200 tansition-all duration-200"
              @click="$emitter.emit('haddleSidebar')"
            >
              <font-awesome-icon icon="fa-solid fa-bars" />
            </button>
            <img
              class="ml-3 md:ml-4 h-8 w-auto lg:hidden"
              src="../assets/images/ac_lestari.png"
              alt=""
            />
          </div>
          <div class="flex items-center space-x-2 mg:space-x-4">
            <div class="hidden md:block relative">
              <HeaderSearchBengkel></HeaderSearchBengkel>
            </div>

            <PopoverGroup class="md:hidden">
              <Popover class="relative flex flex-col">
                <PopoverButton
                  class="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-100 bg-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-200 hover:border-gray-200 tansition-all duration-200"
                >
                  <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
                </PopoverButton>
                <transition
                  enter-active-class="transition ease-out duration-200"
                  enter-from-class="opacity-0 translate-y-1"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition ease-in duration-150"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 translate-y-1"
                >
                  <PopoverPanel
                    class="fixed left-0 right-0 top-16 p-4 shadow-sm bg-white border-b border-t border-gray-200"
                  >
                    <div class="relative">
                      <HeaderSearchBengkel></HeaderSearchBengkel>
                    </div>
                  </PopoverPanel>
                </transition>
              </Popover>
            </PopoverGroup>

            <Popover class="relative flex flex-col">
              <PopoverButton
                class="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-100 bg-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-200 hover:border-gray-200 tansition-all duration-200"
              >
                <font-awesome-icon icon="fa-regular fa-bell" />
                <span
                  v-if="overdueCount > 0"
                  class="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white"
                  aria-hidden="true"
                ></span>
              </PopoverButton>
              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-1"
              >
                <PopoverPanel
                  class="absolute right-0 top-full mt-2 w-56 rounded-md bg-white shadow-md ring-1 ring-gray-200 p-3 text-sm"
                >
                  <div class="flex items-center justify-between">
                    <div class="font-medium text-gray-900">Terlambat</div>
                    <div
                      class="inline-flex items-center justify-center rounded-full bg-rose-100 text-rose-700 px-2 py-0.5 text-xs font-semibold"
                    >
                      {{ overdueCount }}
                    </div>
                  </div>
                  <p class="mt-2 text-gray-600">Jumlah unit yang terlambat servis.</p>
                </PopoverPanel>
              </transition>
            </Popover>

            <PopoverGroup>
              <Popover class="relative flex flex-col">
                <!-- <PopoverButton class="outline-none">
                                <img class="h-10 w-10 rounded-full" src="@assets/images/placeholder-person.png" alt="">
                            </PopoverButton> -->
                <PopoverButton
                  class="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-100 bg-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-200 hover:border-gray-200 tansition-all duration-200"
                >
                  <font-awesome-icon icon="fa-solid fa-user" />
                </PopoverButton>
                <transition
                  enter-active-class="transition ease-out duration-200"
                  enter-from-class="opacity-0 translate-y-1"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition ease-in duration-150"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 translate-y-1"
                >
                  <PopoverPanel
                    class="absolute right-0 top-full mt-2 w-40 rounded-md bg-white shadow-md ring-1 ring-gray-200 focus:outline-none"
                  >
                    <div
                      class="block px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-100"
                    >
                      {{ userEmail }}
                    </div>
                    <a
                      href="#"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                      >Settings</a
                    >
                    <button
                      @click="handleSignOut"
                      class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                    >
                      Sign out
                    </button>
                  </PopoverPanel>
                </transition>
              </Popover>
            </PopoverGroup>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { Popover, PopoverButton, PopoverGroup, PopoverPanel } from '@headlessui/vue'
import HeaderSearchBengkel from '../components/HeaderSearchBengkel.vue'
import { useRouter } from 'vue-router'

import { inject, computed, onMounted, onUnmounted } from 'vue'
import { useCustomersStore } from '../stores/customers'

const $emitter = inject('$emitter')
const router = useRouter()

const customers = useCustomersStore()
const overdueCount = computed(() => customers.overdueCount)

onMounted(() => {
  if ($emitter && typeof $emitter.on === 'function') {
    $emitter.on('customers:updated', customers.setCustomers)
  }
})

onUnmounted(() => {
  if ($emitter && typeof $emitter.off === 'function') {
    $emitter.off('customers:updated', customers.setCustomers)
  }
})

// Get user email from localStorage
const userEmail = computed(() => {
  return localStorage.getItem('email') || 'Guest'
})

function handleSignOut() {
  // Clear all user data from localStorage
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('roles')
  localStorage.removeItem('user_roles')
  localStorage.removeItem('email')

  // Redirect to login
  router.push('/login')
}
</script>
