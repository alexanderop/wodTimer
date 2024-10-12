import { defineStore } from 'pinia'
import {  ref } from 'vue'

export const useTimerStore = defineStore('timer', () => {
  const currentTime = ref(0)
  const workTime = ref(20)
  const restTime = ref(10)
  const rounds = ref(8)
  const currentRound = ref(1)
  const timerType = ref('tabata')
  const isRunning = ref(false)
  const currentPhase = ref('Work')
  const interval = ref<number | null>(null)

  function start() {
    if (!isRunning.value) {
      isRunning.value = true
      interval.value = setInterval(() => {
        if (currentTime.value > 0) {
          currentTime.value--
        }
        else {
          nextPhase()
        }
      }, 1000)
    }
  }

  function pause() {
    if (isRunning.value) {
      isRunning.value = false
      if (interval.value) {
        clearInterval(interval.value)
      }
    }
  }

  function reset() {
    pause()
    currentTime.value = workTime.value
    currentRound.value = 1
    currentPhase.value = 'Work'
  }

  function nextPhase() {
    if (timerType.value === 'tabata') {
      if (currentPhase.value === 'Work') {
        if (currentRound.value < rounds.value) {
          currentPhase.value = 'Rest'
          currentTime.value = restTime.value
        }
        else {
          pause()
          reset()
        }
      }
      else {
        currentPhase.value = 'Work'
        currentTime.value = workTime.value
        currentRound.value++
      }
    }
    else if (timerType.value === 'emom') {
      if (currentRound.value < rounds.value) {
        currentRound.value++
        currentTime.value = workTime.value
      }
      else {
        pause()
        reset()
      }
    }
    playAudioCue()
  }

  function updateSettings(settings: { workTime: number, restTime: number, rounds: number, timerType: string }) {
    workTime.value = settings.workTime
    restTime.value = settings.restTime
    rounds.value = settings.rounds
    timerType.value = settings.timerType
    reset()
  }

  function playAudioCue() {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime) // 440 Hz = A4 note
    oscillator.connect(audioContext.destination)
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.2) // Play for 0.2 seconds
  }

  return {
    currentTime,
    workTime,
    restTime,
    rounds,
    currentRound,
    timerType,
    isRunning,
    currentPhase,
    start,
    pause,
    reset,
    nextPhase,
    updateSettings,
    playAudioCue,
  }
})
