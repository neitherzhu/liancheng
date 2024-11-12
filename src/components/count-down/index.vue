<template>
  <view class="w-full h-full fixed top-0 left-0 right-0 bottom-0 z-10 flex items-center justify-center">
    <view class="rounded-full c-white size-30 flex items-center justify-center text-20"
      :class="props.colors[coundDonwSeconds - 1] || props.colors[0]">{{ coundDonwSeconds }}</view>
  </view>
</template>

<script setup lang="ts">
type CoundDownProps = {
  startNum?: number;
  colors?: string[];
  autoStart?: boolean;
};

export type CountDownMethod = {
  start: () => void;
  stop: () => void;
};

const props = withDefaults(defineProps<CoundDownProps>(), {
  startNum: 3,
  colors: ["bg-my-blue", "bg-my-orange", "bg-my-green"],
});

const emit = defineEmits(["onStop"]);

let timer: number;
const coundDonwSeconds = ref<number>(props.startNum);

const stop = () => {
  emit("onStop");
  clearInterval(timer);
};

const start = () => {
  coundDonwSeconds.value = props.startNum;
  timer = setInterval(() => {
    if (coundDonwSeconds.value === 1) {
      stop();
    } else {
      coundDonwSeconds.value -= 1;
    }
  }, 1000);
};

onMounted(() => {
  props.autoStart && start()
})

defineExpose<CountDownMethod>({
  start,
  stop,
});
</script>
