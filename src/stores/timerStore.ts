import { defineStore } from 'pinia'

export const useTimerStore = defineStore('timer', {
  state: () => ({
    currentTime: 0,
    workTime: 20,
    restTime: 10,
    rounds: 8,
    currentRound: 1,
    timerType: 'tabata',
    isRunning: false,
    currentPhase: 'Work',
    interval: null as number | null,
  }),
  actions: {
    start() {
      if (!this.isRunning) {
        this.isRunning = true
        this.interval = setInterval(() => {
          if (this.currentTime > 0) {
            this.currentTime--
          }
          else {
            this.nextPhase()
          }
        }, 1000)
      }
    },
    pause() {
      if (this.isRunning) {
        this.isRunning = false
        if (this.interval) {
          clearInterval(this.interval)
        }
      }
    },
    reset() {
      this.pause()
      this.currentTime = this.workTime
      this.currentRound = 1
      this.currentPhase = 'Work'
    },
    nextPhase() {
      if (this.timerType === 'tabata') {
        if (this.currentPhase === 'Work') {
          if (this.currentRound < this.rounds) {
            this.currentPhase = 'Rest'
            this.currentTime = this.restTime
          }
          else {
            this.pause()
            this.reset()
          }
        }
        else {
          this.currentPhase = 'Work'
          this.currentTime = this.workTime
          this.currentRound++
        }
      }
      else if (this.timerType === 'emom') {
        if (this.currentRound < this.rounds) {
          this.currentRound++
          this.currentTime = this.workTime
        }
        else {
          this.pause()
          this.reset()
        }
      }
      this.playAudioCue()
    },
    updateSettings(settings: { workTime: number, restTime: number, rounds: number, timerType: string }) {
      this.workTime = settings.workTime
      this.restTime = settings.restTime
      this.rounds = settings.rounds
      this.timerType = settings.timerType
      this.reset()
    },
    playAudioCue() {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime) // 440 Hz = A4 note
      oscillator.connect(audioContext.destination)
      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.2) // Play for 0.2 seconds
    },
  },
})
