<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTimerStore } from '../stores/timerStore'

const timerStore = useTimerStore()

const isRunning = ref(false)
const isPaused = ref(false)

const startPauseText = computed(() => {
  if (isRunning.value)
    return 'Pause'
  if (isPaused.value)
    return 'Continue'
  return 'Start'
})

const startPauseIcon = computed(() => {
  if (isRunning.value) {
    return 'M10 9v6m4-6v6m-9-6h14M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z'
  }
  else {
    return 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
})

const startPauseColor = computed(() => {
  if (isRunning.value)
    return 'bg-yellow-500 hover:bg-yellow-600'
  if (isPaused.value)
    return 'bg-blue-500 hover:bg-blue-600'
  return 'bg-green-500 hover:bg-green-600'
})

function toggleStartPause() {
  if (isRunning.value) {
    timerStore.pause()
    isRunning.value = false
    isPaused.value = true
  }
  else {
    timerStore.start()
    isRunning.value = true
    isPaused.value = false
  }
}

function resetTimer() {
  timerStore.reset()
  isRunning.value = false
  isPaused.value = false
}
</script>

<template>
  <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
    <button
      class="px-6 py-3 text-white rounded-lg flex items-center justify-center transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
      :class="[startPauseColor, { 'opacity-50 cursor-not-allowed': timerStore.isFinished }]"
      :disabled="timerStore.isFinished"
      @click="toggleStartPause"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="startPauseIcon" />
      </svg>
      {{ startPauseText }}
    </button>
    <button
      class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
      :class="{ 'opacity-50 cursor-not-allowed': !isRunning && !isPaused && !timerStore.elapsedTime }"
      :disabled="!isRunning && !isPaused && !timerStore.elapsedTime"
      @click="resetTimer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Reset
    </button>
  </div>
</template>

<style scoped>
button:active {
  transform: scale(0.98);
}
</style>
