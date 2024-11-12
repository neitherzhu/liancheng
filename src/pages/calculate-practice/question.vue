<template>
  <count-down v-if="ready && !go" :autoStart="true" @onStop="handleCountDownStop" />
  <view v-if="go" class="fixed top-0 left-0 right-0 bottom-0 bg-white">
    <view class="text-16 flex items-center w-full h-full justify-center">{{ questions[currentIndex].question }}</view>
    <view class="absolute left-0 top-0 bottom-0" style="right: 50%" @click="handlePrev"></view>
    <view class="absolute right-0 top-0 bottom-0" style="left: 50%" @click="handleNext"></view>
  </view>
  <view v-if="timeup" class="fixed top-0 left-0 right-0 bottom-0 bg-white">
    <view class="w-full h-full flex flex-col items-center justify-center" @click="handleRestart">
      <view v-if="useTimer">恭喜你，<span class="c-blue">{{ minutes }}分钟</span>一共回答了<span class="c-blue">{{
        questions.length
          }}</span>题！
      </view>
      <view v-else>恭喜你，<span class="c-blue">{{
        questions.length
          }}</span>题一共花费了<span class="c-blue">{{ timeStr }}</span>！</view>
      <view class="text-2 c-gray4 mt-6">点击屏幕继续</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import CountDown from "@/components/count-down/index";
import { getTimerStr } from '@/utils/index'
import {
  genrateRandomMathQuestions,
  Question,
} from "@/utils/biz/math";
const maxScore = ref(10);
const mixCount = ref(2);
const useTimer = ref(false); // 计时模式
const minutes = ref(1);
const count = ref(100); // 答题数量

const ready = ref(false); // 开始倒计时
const go = ref(false); // 开始
const timeup = ref(false); // 时间到

const questions = ref<Question[]>([]); // 所有题目的缓存
const currentIndex = ref(-1)

const startTime = ref(0); // 开始时间
const timeStr = ref('');

const timer = ref(0); // 计时器
const canClick = ref(false)

const genOneByOne = () => {
  const [q] = genrateRandomMathQuestions({
    maxScore: maxScore.value,
    count: 1,
    upset: false,
    mixCount: mixCount.value,
    normal: true,
  });
  questions.value.push(q);
  count.value += 1;
  currentIndex.value += 1;
};

const genAll = () => {
  questions.value = genrateRandomMathQuestions({
    maxScore: maxScore.value,
    count: count.value,
    upset: false,
    mixCount: mixCount.value,
    normal: true,
  });

  currentIndex.value += 1;
}

const handleCountDownStop = () => {
  startTime.value = Date.now();
  go.value = true;
  // 计时模式，一题一题生成
  if (useTimer.value) {
    genOneByOne();
    timer.value = setInterval(() => {
      timeup.value = true;
      ready.value = false
      go.value = false
      setTimeout(() => {
        canClick.value = true
      }, 1000)
    }, 60 * 1000 * minutes.value);
  } else {
    genAll()
  }
};

onUnmounted(() => {
  timer.value && clearInterval(timer.value)
})

const handlePrev = () => {
  currentIndex.value = Math.max(0, currentIndex.value - 1);
};

const handleNext = () => {
  if (useTimer.value) {
    genOneByOne()
  } else {
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
      currentIndex.value = nextIndex
    }
  }
}

const handleRestart = () => {
  if (!canClick.value) return

  uni.navigateBack()
}

onLoad((options: any) => {
  maxScore.value = Number(options.maxScore)
  mixCount.value = Number(options.mixCount)
  count.value = Number(options.count)
  minutes.value = Number(options.minutes)
  useTimer.value = options.type === 'time'
  ready.value = true;
})
</script>
