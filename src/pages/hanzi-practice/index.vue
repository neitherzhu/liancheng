<template>
  <view>
    <up-cell-group>
      <up-cell title="题目数量">
        <template #value>
          <up-input v-model="count" type="number" :border="false" inputAlign="right" />
        </template>
      </up-cell>
    </up-cell-group>
    <view class="mx-10 mt-4">
      <up-button type="primary" size="large" @click="handleStart">
        开始认字
      </up-button>
    </view>
  </view>
</template>

<script setup lang="ts">
const count = ref(50);

const handleStart = () => {
  uni.navigateTo({
    url: `/pages/hanzi-practice/question?count=${count.value}`
  })
};

onShareAppMessage(() => {
  console.log('Share App Message')
})

onShareTimeline(() => {
  console.log('Share Timeline')
})
</script>
