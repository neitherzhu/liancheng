<template>
  <view>
    <up-toast ref="toastRef"></up-toast>
    <painter :palette="paintPallette" @imgOK="onImgOK" widthPixels="2479" />
    <view class="mt-20 flex items-center justify-center" v-if="images.length">
      <image class="mx-1" v-for="(image, i) in images" :key="i" :src="image" mode="aspectFit"
        @click="handlePreview(i)" />
    </view>
    <view>
      <view v-if="!images.length">
        <up-cell-group class="text-10">
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
          <up-cell title="题目数量">
            <template #value>
              <up-input v-model="count" type="number" :border="false" inputAlign="right" />
            </template>
          </up-cell>
          <up-cell title="打乱模式" label="打乱题目顺序">
            <template #value>
              <up-switch v-model="upset" />
            </template>
          </up-cell>
        </up-cell-group>
      </view>
      <view class="mx-10 mt-10">
        <up-button type="primary" size="large" @click="handleGen" v-if="!images.length">
          开始生成
        </up-button>
        <template v-else>
          <up-button type="primary" size="large" @click="handleRegen">
            重新生成
          </up-button>
          <up-button type="success" size="large" class="mt-5" @click="handleSave">
            保存到相册
          </up-button>
        </template>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { genrateRandomMathQuestions, isValidNumber } from '@/utils/biz/math'

const images = ref<string[]>([])
const maxScore = ref(10)
const mixCount = ref(2)
const count = ref(100)
const upset = ref(false)
const paintPallette = ref({})
const remainCount = ref(0)
const toastRef = ref()

const handleGen = () => {
  let errorText = ''
  if (!isValidNumber(maxScore.value)) {
    errorText = '请输入最大得数'
  } else if (!isValidNumber(mixCount.value)) {
    errorText = '请输入运算位数'
  } else if (mixCount.value > 4) {
    errorText = '放过孩子吧, 最多4位运算'
  } else if (!isValidNumber(count.value)) {
    errorText = '请输入题目数量'
  }
  if (errorText) {
    return toastRef.value.show({
      message: errorText,
    })
  }
  remainCount.value = count.value
  gen(remainCount.value >= 100 ? 100 : remainCount.value, true)
}
const gen = (count: number, isFirst?: boolean) => {
  const questions = genrateRandomMathQuestions({
    maxScore: maxScore.value,
    count,
    upset: upset.value,
    mixCount: mixCount.value
  })
  remainCount.value -= count

  paintPallette.value = {
    width: '2479px',
    height: '3508px',
    background: '#fff',
    views: [
      isFirst && {
        type: 'text',
        text: `${maxScore.value}以内的加减法`,
        css: {
          top: '10px',
          width: '2479px',
          textAlign: 'center',
          fontSize: '80px'
        }
      },
      ...questions.map((x, i) => {
        const c = 25
        const d = isFirst ? 120 : 0
        const l = Math.floor(i / c)
        const t = i % c
        const left = (2479 / 4) * l + 20
        const top = ((3508 - d) / c) * t + d + 20
        return {
          type: 'text',
          text: x.question,
          css: {
            left: left + 'px',
            top: top + 'px',
            fontSize: '60px'
          }
        }
      })
    ].filter(Boolean)
  }
}
const handleRegen = () => {
  images.value = []
}
const onImgOK = (e: any) => {
  images.value.push(e.detail.path)
  if (remainCount.value) {
    gen(remainCount.value >= 100 ? 100 : remainCount.value)
  }
}
const handleSave = () => {
  images.value.forEach((image: string, i: number) => {
    uni.saveImageToPhotosAlbum({
      filePath: image,
      success: function () {
        if (i === images.value.length - 1) {
          toastRef.value.show({
            message: '保存成功'
          })
        }
      }
    })
  })
}
const handlePreview = (i: number) => {
  uni.previewImage({
    current: i,
    urls: images.value
  })
}

onShareAppMessage(() => {
  console.log('Share App Message')
})

onShareTimeline(() => {
  console.log('Share Timeline')
})
</script>
