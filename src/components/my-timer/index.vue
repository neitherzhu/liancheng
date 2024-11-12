<template>
  <text>{{ timerStr }}</text>
</template>

<script lang="ts" setup>
import { getTimerStr } from '@/utils/index'

export type MyTimerMethod = {
  start: () => void
  stop: () => number | undefined
}

const timerStr = ref('')
const timer = ref()
const startTime = ref(0)

const formatTime = () => {
  const endMs = Date.now()
  const diff = endMs - startTime.value

  return getTimerStr(diff)
}


const start = () => {
  if (startTime.value) return
  startTime.value = Date.now()

  timer.value = setInterval(() => {
    timerStr.value = formatTime()
  }, 100)
}

const stop = () => {
  if (!startTime.value) return
  const endMs = Date.now()
  clearInterval(timer.value)
  timerStr.value = formatTime()

  return endMs - startTime.value
}

defineExpose<MyTimerMethod>({
  start,
  stop,
});
</script>
