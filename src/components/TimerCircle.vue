<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
  currentTime: number
  totalTime: number
  currentPhase: string
  isEmomMode: boolean
  currentRound: number
  totalRounds: number
}

const props = defineProps<Props>()

const formattedTime = computed(() => {
  const minutes = Math.floor(props.currentTime / 60)
  const seconds = props.currentTime % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const progress = computed(() => {
  return ((props.totalTime - props.currentTime) / props.totalTime) * 100
})

const strokeDasharray = computed(() => {
  const circumference = 2 * Math.PI * 90
  return `${circumference} ${circumference}`
})

const strokeDashoffset = computed(() => {
  const circumference = 2 * Math.PI * 90
  return circumference - (progress.value / 100) * circumference
})

const phaseColor = computed(() => {
  return props.currentPhase === 'Work' ? 'text-red-500' : 'text-green-500'
})

const circleColor = computed(() => {
  return props.currentPhase === 'Work' ? '#EF4444' : '#10B981'
})

const isLastFiveSeconds = computed(() => props.currentTime <= 5 && props.currentTime > 0)

const pulseClass = computed(() => {
  return isLastFiveSeconds.value ? 'animate-pulse' : ''
})

const timerScale = ref(1)
const isTransitioning = ref(false)
const previousRound = ref(props.currentRound)

const roundProgress = computed(() => {
  return ((props.currentRound - 1) / props.totalRounds) * 100
})

watch(() => props.currentTime, (newTime, oldTime) => {
  if (newTime !== oldTime) {
    timerScale.value = 1.1
    setTimeout(() => {
      timerScale.value = 1
    }, 100)
  }
})

watch(() => props.currentRound, (newRound, oldRound) => {
  if (newRound !== oldRound) {
    isTransitioning.value = true
    setTimeout(() => {
      previousRound.value = newRound
      isTransitioning.value = false
    }, 500)
  }
})
</script>

<template>
  <div class="relative w-full max-w-md aspect-square">
    <svg class="w-full h-full" viewBox="0 0 200 200">
      <!-- Outer circle (round progress) -->
      <circle
        class="text-gray-200 dark:text-gray-700"
        stroke-width="8"
        stroke="currentColor"
        fill="transparent"
        r="96"
        cx="100"
        cy="100"
      />
      <circle
        class="transition-all duration-300 ease-in-out"
        :stroke="circleColor"
        stroke-width="8"
        fill="transparent"
        r="96"
        cx="100"
        cy="100"
        :stroke-dasharray="2 * Math.PI * 96"
        :stroke-dashoffset="2 * Math.PI * 96 * (1 - roundProgress / 100)"
        transform="rotate(-90 100 100)"
      />
      
      <!-- Main timer circle -->
      <circle
        class="text-gray-300 dark:text-gray-600"
        stroke-width="12"
        stroke="currentColor"
        fill="transparent"
        r="90"
        cx="100"
        cy="100"
      />
      <circle
        class="progress-ring__circle transition-all duration-300 ease-in-out"
        :class="[phaseColor, pulseClass]"
        stroke-width="12"
        :stroke="circleColor"
        :stroke-dasharray="strokeDasharray"
        :stroke-dashoffset="strokeDashoffset"
        fill="transparent"
        r="90"
        cx="100"
        cy="100"
      />

      <!-- Tick marks -->
      <g v-for="i in 12" :key="i" :transform="`rotate(${i * 30} 100 100)`">
        <line x1="100" y1="20" x2="100" y2="30" stroke="currentColor" stroke-width="2" />
      </g>
    </svg>

    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <transition
        enter-active-class="transition ease-out duration-500"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition ease-in duration-500"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          v-if="!isTransitioning"
          class="flex flex-col items-center"
          :key="previousRound"
        >
          <div 
            class="text-6xl md:text-7xl font-bold text-gray-800 dark:text-white transition-transform duration-100 ease-in-out"
            :style="{ transform: `scale(${timerScale})` }"
          >
            {{ formattedTime }}
          </div>
          <div class="text-2xl md:text-3xl mt-2 font-semibold" :class="[phaseColor]">
            {{ currentPhase }}
          </div>
          <div class="text-lg mt-1 text-gray-600 dark:text-gray-300">
            Round {{ currentRound }} / {{ totalRounds }}
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.progress-ring__circle {
  transition: stroke-dashoffset 1s linear;
  transform-origin: 50% 50%;
  transform: rotate(-90deg);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>