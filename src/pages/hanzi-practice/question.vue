<template>
  <count-down v-if="ready && !go" :autoStart="true" @onStop="handleCountDownStop" />
  <view v-if="go" class="fixed top-0 left-0 right-0 bottom-0 bg-white">
    <view class="text-16 flex items-center w-full h-full justify-center">{{ questions[currentIndex] }}</view>
    <view class="absolute z-10 left-0 right-0 bottom-0 top-0" @click="handleNext(true)"></view>
  </view>
  <!-- <view class="absolute z-10 left-0 right-0 bottom-0 top-0" @click="handleNext(true)"> -->
  <!-- <view class="absolute left-0 right-0 top-0 flex items-center justify-center c-white text-8"
      :class="{ 'bg-black bg-op-10': showTip }" style="bottom: 49.9%" @click="handleNext(false)">
      <text v-if="showTip">回答错误点击</text>
    </view>
    <view class="absolute left-0 right-0 bottom-0 flex items-center justify-center c-white text-8"
      :class="{ 'bg-black bg-op-10': showTip }" style="top: 50.9%" @click="handleNext(true)">
      <text v-if="showTip">回答正确点击</text>
    </view> -->
  <!-- </view> -->
  <view v-if="timeup" class="fixed top-0 left-0 right-0 bottom-0 bg-white">
    <view class="w-full h-full flex flex-col items-center justify-center" @click="handleRestart">
      <view v-if="!errorQuestions.length">恭喜你，认字练习完成！</view>
      <view v-else>恭喜你，认字练习完成，本次错误<span class="c-red">{{ errorQuestions.length }}</span>题！</view>
      <view v-if="errorQuestions.length" class="c-blue mt-4">查看错题</view>
      <view class="text-2 c-gray4 mt-6">点击屏幕继续</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import storage from '@/utils/storage'
import CountDown from "@/components/count-down/index";
import { getTimerStr } from '@/utils/index'
import {
  genrateRandomHanziQuestions,
} from "@/utils/biz/hanzi";
const count = ref(30);

const ready = ref(false); // 开始倒计时
const go = ref(false); // 开始
const timeup = ref(false); // 时间到

const questions = ref<string[]>([]); // 所有题目的缓存
const currentIndex = ref(0)

const startTime = ref(0); // 开始时间
const timeStr = ref('');

const timer = ref(0); // 计时器
const canClick = ref(false)

const showTip = ref(true); // 是否显示操作提示

const errorQuestions = ref([])

let cache = storage.get('hzr') || ''

const genAll = () => {
  questions.value = genrateRandomHanziQuestions({
    count: count.value,
    cache
  });
  go.value = true;
  ready.value = false;
  cache += questions.value[0]
  storage.set('hzr', cache)
};

const handleCountDownStop = () => {
  startTime.value = Date.now();
  go.value = true;
  showTip.value = false;
  genAll()
};

onUnmounted(() => {
  timer.value && clearInterval(timer.value)
})

const handlePrev = () => {
  currentIndex.value = Math.max(0, currentIndex.value - 1);
};

const handleNext = (isCorrect: boolean) => {
  if (!go.value) return
  const nextIndex = currentIndex.value + 1
  if (!questions.value[nextIndex]) {
    timeup.value = true
    ready.value = false
    go.value = false
    timeStr.value = getTimerStr(Date.now() - startTime.value)
    setTimeout(() => {
      canClick.value = true
    }, 1000)
  } else {
    if (!isCorrect) {
      errorQuestions.value.push(questions.value[currentIndex.value])
    }

    cache += questions.value[nextIndex]
    storage.set('hzr', cache)
    currentIndex.value = nextIndex
  }
}

const handleRestart = () => {
  if (!canClick.value) return

  uni.navigateBack()
}

onLoad((options: any) => {
  // showTip.value = true;
  count.value = Number(options.count)
  ready.value = true;
})
</script>
