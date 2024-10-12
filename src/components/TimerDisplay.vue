<script setup lang="ts">
import { computed, watch } from 'vue';
import { useTimerStore } from '../stores/timerStore';

const timerStore = useTimerStore();

const formattedTime = computed(() => {
  const minutes = Math.floor(timerStore.currentTime / 60);
  const seconds = timerStore.currentTime % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const totalTime = computed(() => {
  return timerStore.currentPhase === 'Work' ? timerStore.workTime : timerStore.restTime;
});

const progress = computed(() => {
  return ((totalTime.value - timerStore.currentTime) / totalTime.value) * 100;
});

const strokeDasharray = computed(() => {
  const circumference = 2 * Math.PI * 90; // 90 is the radius of the circle
  return `${circumference} ${circumference}`;
});

const strokeDashoffset = computed(() => {
  const circumference = 2 * Math.PI * 90;
  return circumference - (progress.value / 100) * circumference;
});

watch(() => timerStore.currentPhase, () => {
  // Reset the animation when the phase changes
  const circle = document.querySelector('.progress-ring__circle') as SVGCircleElement;
  if (circle) {
    circle.style.transition = 'none';
    circle.setAttribute('stroke-dashoffset', '0');
    setTimeout(() => {
      circle.style.transition = 'stroke-dashoffset 1s linear';
    }, 50);
  }
});
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div class="relative w-64 h-64">
      <svg class="w-full h-full" viewBox="0 0 200 200">
        <circle
          class="text-gray-200 dark:text-gray-700"
          stroke-width="12"
          stroke="currentColor"
          fill="transparent"
          r="94"
          cx="100"
          cy="100"
        />
        <circle
          class="progress-ring__circle text-blue-500"
          stroke-width="12"
          :stroke-dasharray="strokeDasharray"
          :stroke-dashoffset="strokeDashoffset"
          stroke="currentColor"
          fill="transparent"
          r="94"
          cx="100"
          cy="100"
        />
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <div class="text-5xl font-bold">{{ formattedTime }}</div>
        <div class="text-xl mt-2">{{ timerStore.currentPhase }}</div>
      </div>
    </div>
    <div class="text-xl mt-4">
      Round {{ timerStore.currentRound }} / {{ timerStore.rounds }}
    </div>
  </div>
</template>

<style scoped>
.progress-ring__circle {
  transition: stroke-dashoffset 1s linear;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}
</style>