<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
  currentTime: number
  totalTime: number
  currentPhase: string
  isEmomMode: boolean
  currentRound: number
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
  const circumference = 2 * Math.PI * 92
  return `${circumference} ${circumference}`
})

const strokeDashoffset = computed(() => {
  const circumference = 2 * Math.PI * 92
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
    }, 500) // Duration of the transition
  }
})
</script>

<template>
  <div class="relative w-full max-w-md aspect-square">
    <svg class="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
      <!-- Background circle -->
      <circle
        class="text-gray-200 dark:text-gray-700"
        stroke-width="16"
        stroke="currentColor"
        fill="transparent"
        r="92"
        cx="100"
        cy="100"
      />
      <!-- Progress circle -->
      <circle
        class="progress-ring__circle"
        :class="[phaseColor, pulseClass]"
        stroke-width="16"
        :stroke="circleColor"
        :stroke-dasharray="strokeDasharray"
        :stroke-dashoffset="strokeDashoffset"
        fill="transparent"
        r="92"
        cx="100"
        cy="100"
      />
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
          <div v-if="!isEmomMode" class="text-2xl md:text-3xl mt-2 font-semibold" :class="[phaseColor]">
            {{ currentPhase }}
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