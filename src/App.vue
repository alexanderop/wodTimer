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
    <header class="bg-blue-500 text-white p-4 fixed top-0 left-0 right-0 z-10">
      <h1 class="text-2xl font-bold">
        {{ timerStore.timerType.toUpperCase() }} Timer
      </h1>
    </header>
    <main class="flex-grow overflow-y-auto pt-16 pb-20 px-1">
      <div class="container mx-auto py-8">
        <RouterView />
      </div>
    </main>
    <footer class="fixed bottom-0 left-0 right-0 z-10">
      <FooterMenu />
    </footer>
    <button class="fixed top-4 right-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-full z-20" @click="toggleDarkMode">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
main {
  height: calc(100vh - 4rem); /* Adjust based on your header and footer heights */
}
</style>
