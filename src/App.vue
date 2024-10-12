<script setup lang="ts">
import { ref, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import FooterMenu from './components/FooterMenu.vue';
import { useTimerStore } from './stores/timerStore';

const isDarkMode = ref(false);
const timerStore = useTimerStore();
const route = useRoute();

watch(isDarkMode, (newValue) => {
  if (newValue) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
};
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <header class="bg-blue-500 text-white p-4">
      <h1 class="text-2xl font-bold">{{ timerStore.timerType.toUpperCase() }} Timer</h1>
    </header>
    <main class="flex-grow container mx-auto px-4 py-8">
      <RouterView />
    </main>
    <FooterMenu />
    <button @click="toggleDarkMode" class="fixed top-4 right-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </button>
  </div>
</template>