<template>
  <web-view class="h-full" :src="url" />
</template>

<script setup lang="ts">
const url = ref<string>('');

onLoad((params: any) => {
  if (params.url)
    url.value = params.url;
});
</script>

<style lang="scss">
/* 每个页面公共css */
@import "@/static/styles/font.scss";
</style>
