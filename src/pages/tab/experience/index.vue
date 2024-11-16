<template>
  <view>
    <entry-item v-for="item in navs" :key="item.text" :url="item.url" :normalClass="item.class"
      :hoverClass="item['hover-class']">{{ item.text }}</entry-item>
  </view>
</template>

<script setup lang="ts">
import EntryItem from "@/components/entry-item/index";
import { COLOR_CLASSES, COLOR_HOVER_CLASSES } from "@/constants/index";

const navs = [
  {
    text: "题目生成",
    url: "/pages/question-gen/index",
    class: COLOR_CLASSES[0],
    "hover-class": COLOR_HOVER_CLASSES[0],
  },
  {
    text: "视算练习",
    url: "/pages/calculate-practice/index",
    class: COLOR_CLASSES[1],
    "hover-class": COLOR_HOVER_CLASSES[1],
  },
  {
    text: "拼音练习",
    url: "/pages/pinyin-practice/index",
    class: COLOR_CLASSES[2],
    "hover-class": COLOR_HOVER_CLASSES[2],
  },
  {
    text: "认字练习",
    url: "/pages/hanzi-practice/index",
    class: COLOR_CLASSES[3],
    "hover-class": COLOR_HOVER_CLASSES[3],
  }
];

onShareAppMessage(() => {
  console.log('Share App Message')
})

onShareTimeline(() => {
  console.log('Share Timeline')
})
</script>
