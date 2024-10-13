import { onMounted, onUnmounted, ref } from 'vue'

export function useKeepAwake() {
  const wakeLock = ref<WakeLockSentinel | null>(null)
  let intervalId: number | null = null

  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLock.value = await navigator.wakeLock.request('screen')
      }
      catch (err) {
        console.error(`Failed to request Wake Lock: ${err}`)
        fallbackKeepAwake()
      }
    }
    else {
      console.warn('Wake Lock API not supported')
      fallbackKeepAwake()
    }
  }

  const releaseWakeLock = () => {
    if (wakeLock.value) {
      wakeLock.value.release()
        .then(() => {
          wakeLock.value = null
          console.log('Wake Lock released')
        })
        .catch((err) => {
          console.error(`Failed to release Wake Lock: ${err}`)
        })
    }
    if (intervalId !== null) {
      window.clearInterval(intervalId)
      intervalId = null
    }
  }

  const fallbackKeepAwake = () => {
    if (!wakeLock.value && intervalId === null) {
      intervalId = window.setInterval(() => {
        if (document.hidden) {
          window.clearInterval(intervalId!)
          intervalId = null
        }
        else {
          // Create and play a short, silent audio to keep the device awake
          const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA')
          audio.play().catch(e => console.error('Audio playback failed:', e))
        }
      }, 30000) // Every 30 seconds
    }
  }

  onMounted(() => {
    requestWakeLock()
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock()
      }
      else {
        releaseWakeLock()
      }
    })
  })

  onUnmounted(() => {
    releaseWakeLock()
  })

  return {
    requestWakeLock,
    releaseWakeLock,
  }
}
