<script setup lang="ts">
import { ref } from 'vue'
import { useTimerStore } from '../stores/timerStore'
import { useRouter } from 'vue-router'

const timerStore = useTimerStore()
const router = useRouter()

const workTime = ref(timerStore.workTime)
const restTime = ref(timerStore.restTime)
const rounds = ref(timerStore.rounds)
const timerType = ref(timerStore.timerType)

function updateSettings() {
  timerStore.updateSettings({
    workTime: workTime.value,
    restTime: restTime.value,
    rounds: rounds.value,
    timerType: timerType.value,
  })
  
  // Navigate to the index page after updating settings
  router.push('/')
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md max-w-md mx-auto">
    <h2 class="text-xl sm:text-2xl font-bold mb-6 flex items-center justify-center text-gray-800 dark:text-white">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      Timer Settings
    </h2>
    
    <div class="space-y-6">
      <div class="flex flex-col">
        <label class="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
          </svg>
          Timer Type
        </label>
        <select 
          v-model="timerType" 
          class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="tabata">Tabata</option>
          <option value="emom">EMOM</option>
        </select>
      </div>

      <div class="flex flex-col">
        <label class="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
          </svg>
          Work Time (seconds)
        </label>
        <input 
          v-model.number="workTime" 
          type="number" 
          class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white no-spinner"
        >
      </div>

      <div v-if="timerType === 'tabata'" class="flex flex-col">
        <label class="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
          </svg>
          Rest Time (seconds)
        </label>
        <input 
          v-model.number="restTime" 
          type="number" 
          class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white no-spinner"
        >
      </div>

      <div class="flex flex-col">
        <label class="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
          Rounds
        </label>
        <input 
          v-model.number="rounds" 
          type="number" 
          class="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white no-spinner"
        >
      </div>
    </div>

    <button 
      class="w-full mt-8 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      @click="updateSettings"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      Update Settings
    </button>
  </div>
</template>

<style scoped>
/* Hide number input spinners */
.no-spinner::-webkit-inner-spin-button,
.no-spinner::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* For Firefox */
.no-spinner {
  -moz-appearance: textfield;
}

/* For IE/Edge */
.no-spinner::-ms-clear {
  display: none;
}

/* Ensure consistent styling across browsers */
.no-spinner {
  appearance: textfield;
}
</style>