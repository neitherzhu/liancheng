<template>
  <view>
    <up-toast ref="toastRef" />
    <up-cell-group>
      <up-cell title="输入中文字词" label="如‘中国，你好’，以中文逗号分隔" />
      <up-textarea v-model="words" placeholder="可以不填，直接从之前输入的词库中生成" />
      <up-cell title="从词库中自动生成" :label="`词库中已有${wordCount}个词`">
        <template #value>
          <up-switch v-model="genFromCache" />
        </template>
      </up-cell>
      <template v-if="genFromCache">
        <up-cell title="数量">
          <template #value>
            <up-input v-model="count" type="number" :border="false" input-align="right" />
          </template>
        </up-cell>
      </template>
    </up-cell-group>
    <view class="mx-10 mt-4">
      <up-button type="primary" size="large" @click="handleStart">
        开始生成拼音
      </up-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import storage from '@/utils/storage/index';

const words = ref('');
const genFromCache = ref(false);
const count = ref(50);
const toastRef = ref();

const getWordList = (words: string): string[] => {
  if (!words.length) return [];

  return words.split(/,|，/g);
};

let cachedWords = '';

const wordCount = ref(0);

const setStorage = (key: string, words: string) => {
  storage.set(key, words);
};

onMounted(() => {
  cachedWords = storage.get('words');
  wordCount.value = getWordList(cachedWords).length;
});
const handleStart = () => {
  // 缓存输入的内容
  if (words.value) {
    cachedWords = (cachedWords ? (`${cachedWords}，`) : '') + words.value;
    // 去重
    cachedWords = [...new Set(getWordList(cachedWords))].join('，');
    // 缓存
    setStorage('words', cachedWords);
  }

  let wordList = [];
  // 从词库中生成
  if (genFromCache.value) {
    wordList = getWordList(cachedWords);

    if (wordList.length < count.value) {
      return toastRef.value.show({
        message: '词库数量不足，请手动输入',
      });
    }
  }
  else {
    wordList = getWordList(words.value);

    if (!wordList.length) {
      return toastRef.value.show({
        message: '请输入词语',
      });
    }

    setStorage('tmp-words', words.value);
  }

  uni.navigateTo({
    url: `/pages/words-pinyin-practice/question?count=${count.value}&useCache=${genFromCache.value}`,
  });
};

onShareAppMessage(() => {
  console.log('Share App Message');
});

onShareTimeline(() => {
  console.log('Share Timeline');
});
</script>
