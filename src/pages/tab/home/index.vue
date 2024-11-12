<template>
  <view>
    <entry-item v-for="x in nav" :key="x.count" :url="`/pages/game/index?count=${x.count}`" :icon="p4"
      :normalClass="x.class" :extra="x.extra" :hoverClass="x['hover-class']" :iconStyle="x.style">{{ x.count }} x {{
        x.count }} </entry-item>
  </view>
</template>

<script setup lang="ts">
import storage from "@/utils/storage/index";
import { getTimerStr } from "@/utils/common/index";
import EntryItem from "@/components/entry-item/index";
import { COLOR_CLASSES, COLOR_HOVER_CLASSES } from "@/constants/index";
import p4 from "@/static/images/icon.png";

const NAVS = [
  { count: 3, style: { transform: "translateX(38%)" } },
  { count: 4, style: { transform: "translateX(22%)" } },
  { count: 5, style: { transform: "translateX(10%)" } },
  { count: 6 },
  { count: 7, style: { transform: "translateX(-8%)" } }
];
const nav = NAVS.map((x, i) => ({
  ...x,
  class: COLOR_CLASSES[i],
  "hover-class": COLOR_HOVER_CLASSES[i],
  extra: "最佳记录：" + getTimerStr(Number(storage.get(`br-${x.count}`))),
}));
</script>
