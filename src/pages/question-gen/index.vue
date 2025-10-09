<template>
  <view>
    <up-toast ref="toastRef" />
    <painter :palette="paintPallette" width-pixels="2479" @img-o-k="onImgOK" />
    <view v-if="images.length" class="mt-20 flex items-center justify-center">
      <image
        v-for="(image, i) in images" :key="i" class="mx-1" :src="image" mode="aspectFit"
        @click="handlePreview(i)"
      />
    </view>
    <view>
      <view v-if="!images.length">
        <up-cell title="最大得数" :label="`${maxScore}以内`" :border="false">
          <template #value>
            <up-input v-model="maxScore" type="number" :border="false" input-align="right" />
          </template>
        </up-cell>
        <up-cell-group v-for="(x, i) in groups" :key="x" class="text-10">
          <up-cell v-if="groups.length > 1">
            <template #title>
              <text class="c-primary">
                生成条件{{ i + 1 }}
              </text>
            </template>
            <template #value>
              <text class="c-primary" @click="handleCloseGroup(i)">
                删除
              </text>
            </template>
          </up-cell>
          <up-cell title="题型" :is-link="true" @click="handleOpenPicker(i)">
            <template #value>
              <text>{{ columns[0].find(c => c.value === x.type)?.label }}</text>
            </template>
          </up-cell>
          <up-cell title="运算位数">
            <template #value>
              <up-input v-model="x.mixCount" type="number" :border="false" input-align="right" />
            </template>
          </up-cell>
          <up-cell title="题目数量">
            <template #value>
              <up-input v-model="x.count" type="number" :border="false" input-align="right" />
            </template>
          </up-cell>
        </up-cell-group>
        <up-button v-if="groups.length < 7" size="large" class="my-2" @click="handleAddGroup">
          <up-icon name="plus" size="14" style="width:20px;height:20px" />
          <text class="ml-1">
            添加题目生成条件
          </text>
        </up-button>
      </view>
      <view class="mx-10 mt-10">
        <up-button v-if="!images.length" type="primary" size="large" @click="handleGen">
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
  <up-picker
    :show="showPicker" :columns="columns" key-name="label" @cancel="handlePickerCancel"
    @confirm="handlePickerConfirm"
  />
</template>

<script setup lang="ts">
import type { Question, QuestionType } from '@/utils/biz/math';
import { genrateRandomMathQuestions, isValidNumber } from '@/utils/biz/math';
import { chunk } from 'lodash';
import storage from '@/utils/storage';

interface DefaultGenData {
  mixCount: number;
  count: number;
  type: 1;
};
interface ColumnsData {
  label: string;
  value: QuestionType;
  title: string;
};

interface QuestionData {
  title: string;
  list: Question[];
};

const defaultGenData: DefaultGenData = {
  mixCount: 2,
  count: 100,
  type: 1,
};

const images = ref<string[]>([]);
const maxScore = ref(10);
const paintPallette = ref({});
const toastRef = ref();
const groups = ref([{ ...defaultGenData }]);
const questions = ref<QuestionData[]>([]);
const pageIndex = ref(0);
const showPicker = ref(false);
const groupTargetIndex = ref(0);
const columns = reactive<ColumnsData[][]>([
  [
    { label: '1+1=', value: 1, title: '加减运算' },
    { label: '1x2=', value: 8, title: '乘法运算' },
    { label: '( )+1=2', value: 2, title: '括号运算' },
    { label: '1+( )=2', value: 3, title: '括号运算' },
    { label: '1○1=2', value: 4, title: '填写合适的+、-' },
    { label: '1○1=2○0', value: 5, title: '填写合适的+、-' },
    { label: '最小能填几', value: 6, title: '最小能填几' },
    { label: '最大能填几', value: 7, title: '最大能填几' },
  ],
]);

const handleOpenPicker = (i: number) => {
  groupTargetIndex.value = i;
  showPicker.value = true;
};

const handlePickerCancel = () => {
  showPicker.value = false;
};

const handlePickerConfirm = (e: any) => {
  groups.value[groupTargetIndex.value].type = e.value[0].value;
  showPicker.value = false;
};

// 添加题目生成条件
const handleAddGroup = () => {
  groups.value.push({ ...defaultGenData });
};
const handleCloseGroup = (i: number) => {
  groups.value.splice(i, 1);
};

// 开始生成题目
const gen = () => {
  const views: any = [];
  let totalHeight = 0;

  let isBreak = false;
  let questionData = questions.value.shift();

  while (questionData) {
    const splitCount = questionData.mixCount === 3 ? 3 : questionData.mixCount > 3 ? 2 : 4;
    const questionWidth = 2479 / splitCount;
    const questionHeight = 135;
    const titleHeight = 110;

    if (questionData.title) {
      views.push({
        type: 'text',
        text: questionData.title,
        css: {
          left: '80px',
          top: `${totalHeight + 20}px`,
          width: '2079px',
          textAlign: 'left',
          fontSize: '80px',
        },
      });
      totalHeight += titleHeight - questionHeight;
      questionData.title = '';

      if (totalHeight + questionHeight >= 3508) {
        questions.value.unshift(questionData);
        break;
      }
    }

    const lists = chunk(questionData.list, splitCount);
    let item = lists.shift();

    while (!isBreak && item) {
      item.forEach((y: Question, i: number) => {
        questionData!.list.shift();
        const left = (i % splitCount) * questionWidth + 80;
        const top = totalHeight + questionHeight;
        views.push({
          type: 'text',
          text: y.question,
          css: {
            left: `${left}px`,
            top: `${top}px`,
            fontSize: '90px',
          },
        });
      });
      totalHeight += questionHeight;
      const hasNextQuestion = !!questionData.list.length;
      if (totalHeight + (hasNextQuestion ? questionHeight * 2 : titleHeight) >= 3508) {
        isBreak = true;
        questions.value.unshift(questionData);
      }
      else {
        item = lists.shift();
      }
    }

    if (isBreak) {
      break;
    }

    totalHeight += questionHeight;
    questionData = questions.value.shift();
  }

  paintPallette.value = {
    width: '2479px',
    height: '3508px',
    background: '#fff',
    views,
  };
};

// 开始生成题目前的校验
const handleGen = () => {
  let errorText = '';
  storage.set('maxScore', String(maxScore.value));
  storage.set('question-gen-cache', JSON.stringify(groups.value));
  const isError = groups.value.some((x: DefaultGenData) => {
    if (!isValidNumber(maxScore.value)) {
      errorText = '请输入最大得数';
    }
    else if (!isValidNumber(x.mixCount)) {
      errorText = '请输入运算位数';
    }
    else if (x.mixCount > 4) {
      errorText = '放过孩子吧, 最多4位运算';
    }
    else if (!isValidNumber(x.count)) {
      errorText = '请输入题目数量';
    }
    return !!errorText;
  });
  if (isError) {
    return toastRef.value.show({
      message: errorText,
    });
  }

  // 生成题目
  questions.value = groups.value.map((x: DefaultGenData) => {
    const title = columns[0].find((c: ColumnsData) => c.value === x.type)!.title;
    const list = genrateRandomMathQuestions({
      maxScore: maxScore.value,
      count: x.count,
      mixCount: x.mixCount,
      type: x.type,
    });
    return { title, list, mixCount: Number(x.mixCount) };
  });
  // 渲染题目
  gen();
};
// 重新生成
const handleRegen = () => {
  images.value = [];
  questions.value = [];
  pageIndex.value = 0;
};

// 渲染完一张题目图片后的回调
const onImgOK = (e: any) => {
  images.value.push(e.detail.path);
  if (questions.value.length) {
    gen();
  }
};

// 保存图片
const handleSave = () => {
  images.value.forEach((image: string, i: number) => {
    uni.saveImageToPhotosAlbum({
      filePath: image,
      success() {
        if (i === images.value.length - 1) {
          toastRef.value.show({
            message: '保存成功',
          });
        }
      },
    });
  });
};

// 预览图片
const handlePreview = (i: number) => {
  uni.previewImage({
    current: i,
    urls: images.value,
  });
};

onMounted(() => {
  try {
    let v = storage.get('question-gen-cache');
    const s = storage.get('maxScore');

    if (v) {
      v = JSON.parse(v);
      groups.value = v;
    }

    if (s) {
      maxScore.value = Number(s);
    }
  }
  catch (e) { console.log(e); }
});

onShareAppMessage(() => {
  console.log('Share App Message');
});

onShareTimeline(() => {
  console.log('Share Timeline');
});
</script>
