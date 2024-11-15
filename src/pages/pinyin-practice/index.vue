<template>
  <view>
    <up-cell-group>
      <up-cell title="包含韵母">
        <template #value>
          <up-switch v-model="ym" />
        </template>
      </up-cell>
      <up-cell title="包含声母">
        <template #value>
          <up-switch v-model="sm" />
        </template>
      </up-cell>
      <up-cell title="包含整体认读音节">
        <template #value>
          <up-switch v-model="zt" />
        </template>
      </up-cell>
      <up-cell title="包含双拼音节">
        <template #value>
          <up-switch v-model="dpy" />
        </template>
      </up-cell>
      <up-cell title="包含三拼音节">
        <template #value>
          <up-switch v-model="tpy" />
        </template>
      </up-cell>
      <up-cell title="题目数量">
        <template #value>
          <up-input v-model="count" type="number" :border="false" inputAlign="right" />
        </template>
      </up-cell>
    </up-cell-group>
    <view class="mx-10 mt-4">
      <up-button type="primary" size="large" @click="handleStart">
        开始拼读
      </up-button>
    </view>
  </view>
</template>

<script setup lang="ts">
const ym = ref(true);
const sm = ref(true);
const zt = ref(true);
const dpy = ref(true);
const tpy = ref(true);
const count = ref(30);

const handleStart = () => {
  uni.navigateTo({
    url: `/pages/pinyin-practice/question?ym=${ym.value}&sm=${sm.value}&zt=${zt.value}&dpy=${dpy.value}&tpy=${tpy.value}&count=${count.value}`
  })
};

onShareAppMessage(() => {
  console.log('Share App Message')
})

onShareTimeline(() => {
  console.log('Share Timeline')
})
</script>
