<!-- components/LoadingOverlay.vue -->
<template>
  <div
    v-if="loadingStore.isLoading"
    class="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div class="text-center">
      <!-- Elegant spinner -->
      <div class="relative w-24 h-24 mx-auto">
        <!-- Outer ring -->
        <div class="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse"></div>
        <!-- Spinning ring -->
        <div
          class="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"
        ></div>
        <!-- Inner ring -->
        <div
          class="absolute inset-3 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin"
          style="animation-duration: 1.5s; animation-direction: reverse"
        ></div>
        <!-- Center dot -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div
            class="w-4 h-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full animate-pulse"
          ></div>
        </div>
      </div>
      <p class="mt-4 text-gray-700 text-sm font-medium">Loading, please wait...</p>
    </div>
  </div>
</template>

<script setup>
import { useLoadingStore } from '../stores/loading'
const loadingStore = useLoadingStore()
</script>
