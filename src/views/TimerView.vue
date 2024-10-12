<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useTimerStore } from '../stores/timerStore'

const timerStore = useTimerStore()

const isRunning = ref(false)
const isPaused = ref(false)
const currentEmomRound = ref(1)

// Timer Display Computeds
const formattedTime = computed(() => {
  const minutes = Math.floor(timerStore.currentTime / 60)
  const seconds = timerStore.currentTime % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const totalTime = computed(() => {
  return timerStore.currentPhase === 'Work' ? timerStore.workTime : timerStore.restTime
})

const progress = computed(() => {
  return ((totalTime.value - timerStore.currentTime) / totalTime.value) * 100
})

const strokeDasharray = computed(() => {
  const circumference = 2 * Math.PI * 80
  return `${circumference} ${circumference}`
})

const strokeDashoffset = computed(() => {
  const circumference = 2 * Math.PI * 80
  return circumference - (progress.value / 100) * circumference
})

// Timer Controls Computeds
const startPauseText = computed(() => {
  if (isRunning.value)
    return 'Pause'
  if (isPaused.value)
    return 'Resume'
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

// Phase color
const phaseColor = computed(() => {
  return timerStore.currentPhase === 'Work' ? 'text-red-500' : 'text-green-500'
})

// EMOM-specific computeds
// @ts-expect-error dont care
const isEmomMode = computed(() => timerStore.mode === 'EMOM')
const emomRoundDisplay = computed(() => `Round ${currentEmomRound.value} / ${timerStore.rounds}`)

// Watch for phase changes
watch(() => timerStore.currentPhase, () => {
  const circle = document.querySelector('.progress-ring__circle') as SVGCircleElement
  if (circle) {
    circle.style.transition = 'none'
    circle.setAttribute('stroke-dashoffset', '0')
    setTimeout(() => {
      circle.style.transition = 'stroke-dashoffset 1s linear'
    }, 50)
  }
})

// EMOM-specific watch
watch(() => timerStore.currentTime, (newTime) => {
  if (isEmomMode.value && newTime === 0) {
    if (currentEmomRound.value < timerStore.rounds) {
      currentEmomRound.value++
      timerStore.reset()
      timerStore.start()
    }
    else {
      resetTimer()
    }
  }
})

// Timer Control Functions
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
  currentEmomRound.value = 1
}
</script>

<template>
  <div class="flex flex-col items-center justify-between h-full p-4">
    <div class="flex-grow flex flex-col items-center justify-center w-full max-w-md">
      <div class="relative w-full pb-[100%] mb-4">
        <svg class="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 180 180">
          <circle
            class="text-gray-200 dark:text-gray-700"
            stroke-width="12"
            stroke="currentColor"
            fill="transparent"
            r="84"
            cx="90"
            cy="90"
          />
          <circle
            class="progress-ring__circle"
            :class="phaseColor"
            stroke-width="12"
            :stroke-dasharray="strokeDasharray"
            :stroke-dashoffset="strokeDashoffset"
            stroke="currentColor"
            fill="transparent"
            r="84"
            cx="90"
            cy="90"
          />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <div class="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white">
            {{ formattedTime }}
          </div>
          <div v-if="!isEmomMode" class="text-xl md:text-2xl mt-1 font-semibold" :class="[phaseColor]">
            {{ timerStore.currentPhase }}
          </div>
        </div>
      </div>
      <div class="text-lg md:text-xl mb-4 text-center text-gray-600 dark:text-gray-300">
        <template v-if="isEmomMode">
          {{ emomRoundDisplay }}
        </template>
        <template v-else>
          Round {{ timerStore.currentRound }} / {{ timerStore.rounds }}
        </template>
      </div>
    </div>
    <div class="flex justify-center space-x-4 w-full max-w-md">
      <button
        class="flex-1 px-4 py-3 text-white rounded-lg flex items-center justify-center transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500 shadow-md text-sm md:text-base"
        :class="[startPauseColor, { 'opacity-50 cursor-not-allowed': timerStore.isFinished }]"
        :disabled="timerStore.isFinished"
        @click="toggleStartPause"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="startPauseIcon" />
        </svg>
        {{ startPauseText }}
      </button>
      <button
        class="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500 shadow-md text-sm md:text-base"
        :class="{ 'opacity-50 cursor-not-allowed': !isRunning && !isPaused }"
        :disabled="!isRunning && !isPaused"
        @click="resetTimer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Reset
      </button>
    </div>
  </div>
</template>

<style scoped>
.progress-ring__circle {
  transition: stroke-dashoffset 1s linear;
  transform-origin: 50% 50%;
}

button:active {
  transform: scale(0.98);
}
</style>