<template>
  <CountDown v-if="ready && !go" :auto-start="true" @on-stop="handleCountDownStop" />
  <view v-if="go" class="fixed bottom-0 left-0 right-0 top-0 bg-white">
    <view class="h-full w-full flex items-center justify-center text-16">
      {{ questions[currentIndex] }}
    </view>
    <view class="absolute bottom-0 left-0 right-0 top-0 z-10" @click="handleNext(true)" />
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
  <view v-if="timeup" class="fixed bottom-0 left-0 right-0 top-0 bg-white">
    <view class="h-full w-full flex flex-col items-center justify-center" @click="handleRestart">
      <view v-if="!errorQuestions.length">
        恭喜你，拼音拼读完成！
      </view>
      <view v-else>
        恭喜你，拼音拼读完成，本次错误<span class="c-red">{{ errorQuestions.length }}</span>题！
      </view>
      <view v-if="errorQuestions.length" class="mt-4 c-blue">
        查看错题
      </view>
      <view class="mt-6 text-2 c-gray4">
        点击屏幕继续
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import CountDown from '@/components/count-down/index';
import { getTimerStr } from '@/utils/index';
import {
  genrateRandomPinyinQuestions,
} from '@/utils/biz/pinyin';

const ym = ref(true);
const sm = ref(true);
const zt = ref(true);
const dpy = ref(true);
const tpy = ref(true);
const count = ref(30);

const ready = ref(false); // 开始倒计时
const go = ref(false); // 开始
const timeup = ref(false); // 时间到

const questions = ref<string[]>([]); // 所有题目的缓存
const currentIndex = ref(0);

const startTime = ref(0); // 开始时间
const timeStr = ref('');

const timer = ref(0); // 计时器
const canClick = ref(false);

const showTip = ref(true); // 是否显示操作提示

const errorQuestions = ref([]);

const genAll = () => {
  questions.value = genrateRandomPinyinQuestions({
    ym: ym.value,
    sm: sm.value,
    zt: zt.value,
    dpy: dpy.value,
    tpy: tpy.value,
    count: count.value,
  });
  go.value = true;
  ready.value = false;
};

const handleCountDownStop = () => {
  startTime.value = Date.now();
  go.value = true;
  showTip.value = false;
  genAll();
};

onUnmounted(() => {
  timer.value && clearInterval(timer.value);
});

// const handlePrev = () => {
//   currentIndex.value = Math.max(0, currentIndex.value - 1);
// };

const handleNext = (isCorrect: boolean) => {
  if (!go.value) return;
  const nextIndex = currentIndex.value + 1;
  if (!questions.value[nextIndex]) {
    timeup.value = true;
    ready.value = false;
    go.value = false;
    timeStr.value = getTimerStr(Date.now() - startTime.value);
    setTimeout(() => {
      canClick.value = true;
    }, 1000);
  }
  else {
    if (!isCorrect) {
      errorQuestions.value.push(questions.value[currentIndex.value]);
    }
    currentIndex.value = nextIndex;
  }
};

const handleRestart = () => {
  if (!canClick.value) return;

  uni.navigateBack();
};

onLoad((options: any) => {
  // showTip.value = true;
  ym.value = options.ym === 'true';
  sm.value = options.sm === 'true';
  zt.value = options.zt === 'true';
  dpy.value = options.dpy === 'true';
  tpy.value = options.tpy === 'true';
  count.value = Number(options.count);
  ready.value = true;
});
</script>
