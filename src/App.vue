<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterView } from 'vue-router'
import FooterMenu from './components/FooterMenu.vue'
import { useKeepAwake } from './composables/useKeepAwake'
import { useTimerStore } from './stores/timerStore'

const isDarkMode = ref(true)
const timerStore = useTimerStore()

useKeepAwake()

watch(isDarkMode, (newValue) => {
  if (newValue) {
    document.documentElement.classList.add('dark')
    return
  }
  document.documentElement.classList.remove('dark')
}, { immediate: true })

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
}
</script>

<template>
  <div class="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <header class="bg-blue-600 dark:bg-blue-800 text-white p-4 fixed top-0 left-0 right-0 z-10 flex justify-between items-center">
      <h1 class="text-2xl font-bold">
        {{ timerStore.timerType.toUpperCase() }} Timer
      </h1>
      <button class="p-2 bg-blue-500 dark:bg-blue-700 rounded-full" @click="toggleDarkMode">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>
    </header>
    <main class="flex-grow overflow-y-auto pt-16 pb-20 px-4">
      <div class="container mx-auto py-8">
        <RouterView />
      </div>
    </main>
    <footer class="fixed bottom-0 left-0 right-0 z-10">
      <FooterMenu />
    </footer>
  </div>
</template>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

body {
  @apply antialiased;
}

.btn {
  @apply px-4 py-2 rounded-lg font-semibold text-white transition-colors duration-200;
}

.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800;
}

.btn-secondary {
  @apply bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800;
}

.input {
  @apply px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600;
}
</style>
