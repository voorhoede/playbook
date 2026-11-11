<script setup lang="ts">
/** The design system's SelfTypingText: types a headline out behind a blinking caret. */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{ text: string }>()

const typed = ref('')
const enhanced = ref(false)
const ended = ref(false)
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const interval = Math.min(70, Math.max(35, Math.round(1000 / props.text.length)))
  let count = 0
  enhanced.value = true
  timer = setInterval(() => {
    if (count >= props.text.length) {
      clearInterval(timer)
      ended.value = true
      return
    }
    count++
    typed.value = props.text.slice(0, count)
  }, interval)
})

onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div
    :class="['self-typing-text', enhanced && 'self-typing-text--enhanced', ended && 'self-typing-text--ended']"
    aria-hidden="true"
  >
    <div class="self-typing-text__placeholder">{{ text }}</div>
    <div class="self-typing-text__text">{{ enhanced ? typed : text }}</div>
  </div>
</template>
