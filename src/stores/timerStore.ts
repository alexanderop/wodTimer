import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useTimerStore = defineStore('timer', () => {
  const currentTime = ref(0)
  const workTime = ref(20)
  const restTime = ref(10)
  const rounds = ref(8)
  const currentRound = ref(1)
  const timerType = ref('tabata')
  const isRunning = ref(false)
  const currentPhase = ref('Work')
  const interval = ref<ReturnType<typeof setInterval> | null>(null)
  const isFinished = ref(false)
  const elapsedTime = ref(0)
  const elapsedInterval = ref<ReturnType<typeof setInterval> | null>(null)
  const countdownAudio = ref<AudioContext | null>(null)

  const formattedElapsedTime = computed(() => {
    const minutes = Math.floor(elapsedTime.value / 60)
    const seconds = elapsedTime.value % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })

  const playCountdownSound = () => {
    if (!countdownAudio.value) {
      countdownAudio.value = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const oscillator = countdownAudio.value.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(330, countdownAudio.value.currentTime) // 330 Hz = E4 note

    const gainNode = countdownAudio.value.createGain()
    gainNode.gain.setValueAtTime(0.1, countdownAudio.value.currentTime)

    oscillator.connect(gainNode)
    gainNode.connect(countdownAudio.value.destination)

    oscillator.start()
    oscillator.stop(countdownAudio.value.currentTime + 0.1) // Play for 0.1 seconds
  }

  const start = () => {
    if (!isRunning.value) {
      isRunning.value = true
      isFinished.value = false
      interval.value = setInterval(() => {
        if (currentTime.value > 0) {
          currentTime.value--
          if (currentTime.value <= 5) {
            playCountdownSound()
          }
        }
        else {
          nextPhase()
        }
      }, 1000)

      // Start elapsed time counter
      elapsedInterval.value = setInterval(() => {
        elapsedTime.value++
      }, 1000)
    }
  }

  const pause = () => {
    if (isRunning.value) {
      isRunning.value = false
      if (interval.value) {
        clearInterval(interval.value)
      }
      if (elapsedInterval.value) {
        clearInterval(elapsedInterval.value)
      }
      if (countdownAudio.value) {
        countdownAudio.value.close()
        countdownAudio.value = null
      }
    }
  }

  const reset = () => {
    pause()
    currentTime.value = workTime.value
    currentRound.value = 1
    currentPhase.value = 'Work'
    isFinished.value = false
    elapsedTime.value = 0
  }

  const playAudioCue = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime) // 440 Hz = A4 note
    oscillator.connect(audioContext.destination)
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.2) // Play for 0.2 seconds
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
          isFinished.value = true
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
        isFinished.value = true
        reset()
      }
    }
    playAudioCue()
  }

  const updateSettings = (settings: { workTime: number, restTime: number, rounds: number, timerType: string }) => {
    workTime.value = settings.workTime
    restTime.value = settings.restTime
    rounds.value = settings.rounds
    timerType.value = settings.timerType
    reset()
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
    isFinished,
    elapsedTime,
    formattedElapsedTime,
    start,
    pause,
    reset,
    nextPhase,
    updateSettings,
    playAudioCue,
  }
})
