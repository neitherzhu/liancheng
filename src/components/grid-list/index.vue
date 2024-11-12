<template>
  <view class="flex flex-col" :style="gridListStyle">
    <view class="flex flex-1 w-full" v-for="(_, i) in props.count" :key="i">
      <view class="flex flex-1 m-1 items-center justify-center rounded-md text-8 c-white" :class="props.colorClass"
        :hover-class="props.hoverColorClass" v-for="(_, j) in props.count" :key="i + '-' + j"
        @click="handleClick(numbers[props.count * i + j])">{{
          numbers[props.count * i + j] }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { shuffleArray } from "@/utils";

type GridListProps = {
  count: number;
  colorClass: string;
  hoverColorClass: string;
};

const props = withDefaults(defineProps<GridListProps>(), {
  count: 5,
  colorClass: "bg-my-blue",
  hoverColorClass: "bg-my-blue-500",
});

const emit = defineEmits(["click", "finished"]);

const numbers = ref<number[]>([]);
const current = ref<number>(1);

const { screenWidth } = uni.getSystemInfoSync();

const gridListStyle = ref({
  width: screenWidth * 0.9 + "px",
  height: screenWidth * 0.9 + "px",
});

const genrateNumbers = (count: number): number[] => {
  const array = [];

  for (let i = 0; i < count * count; i++) {
    array.push(i + 1);
  }

  return shuffleArray(array);
};

const handleClick = (n: number) => {
  if (n === current.value) {
    current.value = n + 1;
    if (n === props.count * props.count) {
      emit("finished");
    } else {
      emit("click", current.value);
    }
  }
};

watchEffect(() => {
  numbers.value = genrateNumbers(props.count);
});
</script>
