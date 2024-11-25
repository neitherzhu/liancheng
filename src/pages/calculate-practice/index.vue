<template>
  <up-toast ref="toastRef"></up-toast>
  <view>
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
      <up-cell title="计时时间" v-if="useTimer" label="分钟">
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

onShareAppMessage(() => {
  console.log('Share App Message')
})

onShareTimeline(() => {
  console.log('Share Timeline')
})
</script>
