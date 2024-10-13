<script setup lang="ts">
import { useTimerStore } from '../stores/timerStore'

const timerStore = useTimerStore()

const props = defineProps<{
  timerType: 'tabata' | 'emom'
}>()

const updateSettings = () => {
  if (props.timerType === 'tabata') {
    timerStore.updateTabataSettings(
      timerStore.tabataSettings.workTime,
      timerStore.tabataSettings.restTime,
      timerStore.tabataSettings.rounds
    )
  } else {
    timerStore.updateEmomSettings(
      timerStore.emomSettings.intervalTime,
      timerStore.emomSettings.rounds
    )
  }
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
    <h2 class="text-2xl font-bold mb-4">{{ props.timerType.toUpperCase() }} Settings</h2>
    <div v-if="props.timerType === 'tabata'" class="space-y-4">
      <div>
        <label class="block mb-2">Work Time (seconds)</label>
        <input v-model.number="timerStore.tabataSettings.workTime" type="number" class="input w-full" min="1" />
      </div>
      <div>
        <label class="block mb-2">Rest Time (seconds)</label>
        <input v-model.number="timerStore.tabataSettings.restTime" type="number" class="input w-full" min="1" />
      </div>
      <div>
        <label class="block mb-2">Rounds</label>
        <input v-model.number="timerStore.tabataSettings.rounds" type="number" class="input w-full" min="1" />
      </div>
    </div>
    <div v-else class="space-y-4">
      <div>
        <label class="block mb-2">Interval Time (seconds)</label>
        <input v-model.number="timerStore.emomSettings.intervalTime" type="number" class="input w-full" min="1" />
      </div>
      <div>
        <label class="block mb-2">Rounds</label>
        <input v-model.number="timerStore.emomSettings.rounds" type="number" class="input w-full" min="1" />
      </div>
    </div>
    <button @click="updateSettings" class="btn btn-primary w-full mt-6">
      Update Settings
    </button>
  </div>
</template>
