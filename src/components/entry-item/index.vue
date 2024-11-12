<template>
  <navigator :url="props.url" class="mx-10 my-4 c-white p-4 rounded-md relative" :class="props.normalClass"
    :hover-class="props.hoverClass">
    <view class="text-8"><text>
        <slot></slot>
      </text></view>
    <view v-if="props.extra" class="mt-2"><text class="text-3">{{ props.extra }}</text></view>
    <view class="w-full h-full absolute right-0 top-0" v-if="props.icon">
      <image :src="props.icon" mode="aspectFit" :style="iconStyle" />
    </view>
  </navigator>
</template>

<script setup lang="ts">
export type EntryItemProps = {
  url: string;
  icon?: string
  iconStyle?: Record<string, string>
  extra?: string
  normalClass?: string
  hoverClass?: string
}

const props = defineProps<EntryItemProps>()

const iconStyle = {
  ...props.iconStyle,
  height: '100%'
}
</script>
