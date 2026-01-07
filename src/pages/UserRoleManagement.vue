<template>
  <div class="container mx-auto p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">User Role Management</h1>
      <p class="text-gray-600">Kelola relasi antara user dan roles</p>
    </div>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Section: Assign Roles -->
      <div class="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Assign Roles to User
        </h2>

        <div class="space-y-4">
          <!-- User Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-900 mb-2"> Select User </label>
            <select
              v-model="selectedUserId"
              @change="onUserSelected"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Choose User --</option>
              <option v-for="user in usersList" :key="user.id" :value="user.id">
                {{ user.name }} ({{ user.email }})
              </option>
            </select>
          </div>

          <!-- Role Selection (Multi-select) -->
          <div v-if="selectedUserId">
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Select Roles (Multiple)
            </label>
            <div
              class="space-y-2 max-h-48 overflow-y-auto border-2 border-gray-400 dark:border-gray-500 rounded-lg p-4 bg-white dark:bg-gray-800"
            >
              <div
                v-for="role in rolesList"
                :key="role.id"
                class="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <input
                  type="checkbox"
                  :id="`role-${role.id}`"
                  :value="role.id"
                  v-model="selectedRoleIds"
                  class="w-5 h-5 text-blue-600 bg-white dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-400 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer"
                />
                <label
                  :for="`role-${role.id}`"
                  class="ml-3 text-base font-medium text-gray-900 dark:text-gray-100 cursor-pointer select-none"
                >
                  {{ role.label || role.name || role.id }}
                </label>
              </div>
            </div>
          </div>

          <!-- Current Roles Display -->
          <div v-if="selectedUserId && currentUserRoles.length > 0">
            <label class="block text-sm font-medium text-gray-900 mb-2"> Current Roles </label>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="role in currentUserRoles"
                :key="role.id"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {{ role.label || role.name || role.id }}
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4">
            <button
              @click="assignRoles"
              :disabled="!selectedUserId || selectedRoleIds.length === 0 || isAssigning"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition"
            >
              <span v-if="!isAssigning">Assign Roles</span>
              <span v-else>Assigning...</span>
            </button>
            <button
              @click="resetForm"
              class="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Section: Users List with Roles -->
      <div class="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Users and Their Roles
        </h2>

        <div class="space-y-4 max-h-96 overflow-y-auto">
          <div
            v-for="user in usersList"
            :key="user.id"
            class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <div class="font-semibold text-gray-900 dark:text-white">{{ user.name }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ user.email }}</div>
            <div v-if="user.roles.length > 0" class="flex flex-wrap gap-1">
              <span
                v-for="role in user.roles"
                :key="role.id"
                class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              >
                {{ role.label || role.name || role.id }}
              </span>
            </div>
            <div v-else class="text-sm text-gray-500 dark:text-gray-400 italic">
              No roles assigned
            </div>
          </div>

          <div v-if="usersList.length === 0" class="text-center py-8 text-gray-500">
            No users found
          </div>
        </div>
      </div>
    </div>

    <!-- Add Role Section (Individual Add) -->
    <div class="mt-8 bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">Add Single Role to User</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-900 mb-2"> User </label>
          <select
            v-model="singleRoleUserId"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">-- Choose User --</option>
            <option v-for="user in usersList" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2"> Role </label>
          <select
            v-model="singleRoleId"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">-- Choose Role --</option>
            <option v-for="role in rolesList" :key="role.id" :value="role.id">
              {{ role.label || role.name || role.id }}
            </option>
          </select>
        </div>

        <div class="flex items-end">
          <button
            @click="addSingleRole"
            :disabled="!singleRoleUserId || !singleRoleId || isAddingSingle"
            class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition"
          >
            <span v-if="!isAddingSingle">Add Role</span>
            <span v-else>Adding...</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Remove Role Section -->
    <div class="mt-8 bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">Remove Role from User</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-900 mb-2"> User </label>
          <select
            v-model="removeRoleUserId"
            @change="onRemoveUserSelected"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">-- Choose User --</option>
            <option v-for="user in usersList" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Role to Remove
          </label>
          <select
            v-model="removeRoleId"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">-- Choose Role --</option>
            <option v-for="role in userRolesToRemove" :key="role.id" :value="role.id">
              {{ role.label }}
            </option>
          </select>
        </div>

        <div class="flex items-end">
          <button
            @click="removeRole"
            :disabled="!removeRoleUserId || !removeRoleId || isRemoving"
            class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition"
          >
            <span v-if="!isRemoving">Remove Role</span>
            <span v-else>Removing...</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <ToastCard v-if="showToast" :message_toast="toastMessage" @dismissToast="closeToast" />
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, computed, onMounted } from 'vue'
import { BASE_URL } from '../base.utils.url.ts'
import ToastCard from '../components/ToastCard.vue'

// State
const usersList = ref([])
const rolesList = ref([])
const selectedUserId = ref('')
const selectedRoleIds = ref([])
const singleRoleUserId = ref('')
const singleRoleId = ref('')
const removeRoleUserId = ref('')
const removeRoleId = ref('')
const isLoading = ref(false)
const isAssigning = ref(false)
const isAddingSingle = ref(false)
const isRemoving = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

// Computed Properties
const currentUserRoles = computed(() => {
  const user = usersList.value.find((u) => u.id === selectedUserId.value)
  return user ? user.roles : []
})

const userRolesToRemove = computed(() => {
  const user = usersList.value.find((u) => u.id === removeRoleUserId.value)
  return user ? user.roles : []
})

// Functions
const getToken = () => localStorage.getItem('token')

const showNotification = (message) => {
  toastMessage.value = message
  showToast.value = true
}

const closeToast = () => {
  showToast.value = false
}

const loadUsers = async () => {
  try {
    const token = getToken()
    const response = await axios.get(`${BASE_URL}roles/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    console.log('Users response:', response.data) // Debug log
    if (response.data.success || response.data.status) {
      usersList.value = response.data.data || response.data.users || []
      console.log('Loaded users:', usersList.value) // Debug log
    }
  } catch (error) {
    console.error('Error loading users:', error)
    showNotification('Failed to load users')
  }
}

const loadRoles = async () => {
  try {
    const token = getToken()
    const response = await axios.get(`${BASE_URL}roles`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    console.log('Roles response:', response.data) // Debug log
    if (response.data.success || response.data.status) {
      const roles = response.data.data || response.data.roles || []
      // Ensure each role has a label property
      rolesList.value = roles.map((role) => ({
        ...role,
        label: role.label || role.name || role.id,
      }))
      console.log('Loaded roles:', rolesList.value) // Debug log
    }
  } catch (error) {
    console.error('Error loading roles:', error)
    showNotification('Failed to load roles')
  }
}

const loadData = async () => {
  isLoading.value = true
  try {
    await Promise.all([loadUsers(), loadRoles()])
  } finally {
    isLoading.value = false
  }
}

const onUserSelected = () => {
  // Update selected role IDs based on current user roles
  selectedRoleIds.value = currentUserRoles.value.map((r) => r.id)
}

const assignRoles = async () => {
  if (!selectedUserId.value || selectedRoleIds.value.length === 0) {
    showNotification('Please select a user and at least one role')
    return
  }

  isAssigning.value = true
  try {
    const token = getToken()
    const response = await axios.post(
      `${BASE_URL}roles/users/${selectedUserId.value}/roles`,
      { role_ids: selectedRoleIds.value },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )
    if (response.data.success) {
      showNotification('Roles assigned successfully')
      await loadUsers()

      // Update localStorage if current user's roles were changed
      const currentUserEmail = localStorage.getItem('email')
      const selectedUser = usersList.value.find((u) => u.id === selectedUserId.value)
      if (selectedUser && selectedUser.email === currentUserEmail) {
        localStorage.setItem('user_roles', JSON.stringify(selectedUser.roles))
      }

      resetForm()
    } else {
      showNotification(response.data.message || 'Failed to assign roles')
    }
  } catch (error) {
    console.error('Error assigning roles:', error)
    showNotification(error.response?.data?.message || 'Error assigning roles')
  } finally {
    isAssigning.value = false
  }
}

const addSingleRole = async () => {
  if (!singleRoleUserId.value || !singleRoleId.value) {
    showNotification('Please select a user and a role')
    return
  }

  isAddingSingle.value = true
  try {
    const token = getToken()
    const response = await axios.post(
      `${BASE_URL}roles/users/${singleRoleUserId.value}/roles/${singleRoleId.value}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )
    if (response.data.success) {
      showNotification('Role added successfully')
      await loadUsers()

      // Update localStorage if current user's roles were changed
      const currentUserEmail = localStorage.getItem('email')
      const selectedUser = usersList.value.find((u) => u.id === singleRoleUserId.value)
      if (selectedUser && selectedUser.email === currentUserEmail) {
        localStorage.setItem('user_roles', JSON.stringify(selectedUser.roles))
      }

      singleRoleUserId.value = ''
      singleRoleId.value = ''
    } else {
      showNotification(response.data.message || 'Failed to add role')
    }
  } catch (error) {
    console.error('Error adding role:', error)
    showNotification(error.response?.data?.message || 'Error adding role')
  } finally {
    isAddingSingle.value = false
  }
}

const onRemoveUserSelected = () => {
  removeRoleId.value = ''
}

const removeRole = async () => {
  if (!removeRoleUserId.value || !removeRoleId.value) {
    showNotification('Please select a user and a role')
    return
  }

  isRemoving.value = true
  try {
    const token = getToken()
    const response = await axios.delete(
      `${BASE_URL}roles/users/${removeRoleUserId.value}/roles/${removeRoleId.value}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )
    if (response.data.success) {
      showNotification('Role removed successfully')
      await loadUsers()

      // Update localStorage if current user's roles were changed
      const currentUserEmail = localStorage.getItem('email')
      const selectedUser = usersList.value.find((u) => u.id === removeRoleUserId.value)
      if (selectedUser && selectedUser.email === currentUserEmail) {
        localStorage.setItem('user_roles', JSON.stringify(selectedUser.roles))
      }

      removeRoleUserId.value = ''
      removeRoleId.value = ''
    } else {
      showNotification(response.data.message || 'Failed to remove role')
    }
  } catch (error) {
    console.error('Error removing role:', error)
    showNotification(error.response?.data?.message || 'Error removing role')
  } finally {
    isRemoving.value = false
  }
}

const resetForm = () => {
  selectedUserId.value = ''
  selectedRoleIds.value = []
}

// Lifecycle
onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
// Add any custom styles here if needed
</style>
