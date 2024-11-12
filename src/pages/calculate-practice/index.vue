<template>
  <up-toast ref="toastRef"></up-toast>
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
  <view v-if="!ready && !go && !timeup" class="pb-20">
    <up-cell-group>
      <up-cell title="最大得数" :label="`${maxScore}以内`">
        <template #value>
          <up-input v-model="maxScore" type="number" :border="false" inputAlign="right" />
        </template>
      </up-cell>
      <up-cell title="运算位数">
        <template #value>
          <up-input v-model="mixCount" type="number" :border="false" inputAlign="right" />
        </template>
      </up-cell>
      <up-cell title="计时模式" label="按固定时间计算题数">
        <template #value>
          <up-switch v-model="useTimer" />
        </template>
      </up-cell>
      <up-cell title="计时时间" v-if="useTimer">
        <template #value>
          <up-input v-model="minutes" type="number" :border="false" inputAlign="right" />
        </template>
      </up-cell>
      <up-cell title="题目数量" v-else>
        <template #value>
          <up-input v-model="count" type="number" :border="false" inputAlign="right" />
        </template>
      </up-cell>
    </up-cell-group>
    <view class="mx-10 mt-4">
      <up-button type="primary" size="large" @click="handleStart">
        开始视算
      </up-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import CountDown from "@/components/count-down/index";
import { isValidNumber } from "@/utils/biz/math";
const maxScore = ref(10);
const mixCount = ref(2);
const useTimer = ref(false); // 计时模式
const minutes = ref(1);
const count = ref(100); // 答题数量

const toastRef = ref()

const handleStart = () => {
  let errorText = "";
  if (!isValidNumber(maxScore.value)) {
    errorText = "请输入最大得数";
  } else if (!isValidNumber(mixCount.value)) {
    errorText = "请输入运算位数";
  } else if (mixCount.value > 3) {
    errorText = "放过孩子, 最多3位运算";
  }

  if (useTimer) {
    if (!isValidNumber(minutes.value)) {
      errorText = "请输入计时时间";
    } else if (minutes.value > 10) {
      errorText = "放过孩子, 时间也太长了";
    }
  } else {
    if (!isValidNumber(count.value)) {
      errorText = "请输入题目数量";
    }
  }

  if (errorText) {
    return toastRef.value.show({
      message: errorText,
    });
  }

  uni.navigateTo({
    url: `/pages/calculate-practice/question?maxScore=${maxScore.value}&mixCount=${mixCount.value}&minutes=${minutes.value}&count=${count.value}&type=${useTimer.value ? 'time' : 'count'}`
  })
};
</script>
