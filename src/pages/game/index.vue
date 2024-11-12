<template>
  <view class="flex flex-col items-center">
    <template v-if="gridListProps.isStart">
      <view class="flex items-center w-full justify-between c-gray-600 mb-10">
        <text class="pl-4">下一个：{{ nextAnswer }}</text>
        <view class="flex items-center pr-4">用时：
          <my-timer ref="timerRef" />
        </view>
      </view>
      <grid-list class="flex items-center justify-center" :count="gridListProps.count" :key="gridListProps.key"
        :colorClass="gridListProps.colorClass" :hoverColorClass="gridListProps.hoverColorClass"
        @finished="handleGameFinished" @click="handleClick" />
    </template>
    <count-down v-else :autoStart="true" ref="countDownRef" @onStop="handleCountDownStop" />
    <button v-if="gridListProps.isFinished" class="c-white mt-10" :class="color.colorClass"
      :hover-class="color.hoverColorClass" style="width: 50%" @click="handleRestart()">
      重新开始
    </button>
    <up-modal :show="modalProps.open" title="挑战成功" :content='modalProps.content' :closeOnClickOverlay="true"
      @confirm="handleModalOk" @close="handleModalOk"></up-modal>
  </view>
</template>

<script setup lang="ts">
import storage from '@/utils/storage'
import { getTimerStr } from '@/utils/index'
import GridList from '@/components/grid-list/index'
import CountDown, { CountDownMethod } from '@/components/count-down/index'
import MyTimer, { MyTimerMethod } from '@/components/my-timer/index'
import { COLOR_CLASSES, COLOR_HOVER_CLASSES } from '@/constants/index'

const getRandomColorClass = () => {
  const i = Math.floor(Math.random() * COLOR_CLASSES.length)

  return {
    colorClass: COLOR_CLASSES[i],
    hoverColorClass: COLOR_HOVER_CLASSES[i]
  }
}

type GridListProps = {
  count: number
  colorClass: string
  hoverColorClass: string
  key: number
  isStart: boolean
  isFinished: boolean
}

const color = ref<{ colorClass: string, hoverColorClass: string }>(getRandomColorClass())
const gridListProps = ref<GridListProps>({
  count: 0,
  key: Date.now(),
  isStart: false,
  isFinished: false,
  ...color.value
})

const modalProps = ref<{ open: boolean, content: string }>({
  open: false,
  content: ''
})

let countFromOptions = 0
const countDownRef = ref<CountDownMethod>(null)
const timerRef = ref<MyTimerMethod>(null)
const nextAnswer = ref('1')

const handleClick = (answer: string) => {
  nextAnswer.value = answer
}

const handleModalOk = () => {
  modalProps.value.open = false
}

const handleGameFinished = () => {
  const diff = timerRef.value?.stop()
  gridListProps.value.isFinished = true

  const cache = storage.get(`br-${gridListProps.value.count}`)
  const isNewRecord = !cache || Number(cache) > diff

  if (isNewRecord) {
    storage.set(`br-${gridListProps.value.count}`, String(diff))
  }

  modalProps.value.content = `用时${getTimerStr(diff)}`
  modalProps.value.open = true
}

const handleCountDownStop = () => {
  gridListProps.value.isStart = true
}

const handleRestart = (count = countFromOptions) => {
  gridListProps.value.isFinished = false
  gridListProps.value.isStart = false
  // 设置要生成的方块数量
  gridListProps.value.count = count
  color.value = getRandomColorClass()
  gridListProps.value = {
    ...gridListProps.value,
    ...color.value,
  }
}

watchEffect(() => {
  if (gridListProps.value.isStart) {
    timerRef.value?.start()
  }
})

onLoad((options: any) => {
  countFromOptions = Number(options.count)
})

onMounted(() => {
  handleRestart(countFromOptions)
})

onUnload(() => {
  timerRef.value?.stop()
  countDownRef.value?.stop()
})
</script>
