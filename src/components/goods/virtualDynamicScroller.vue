<template>
  <DynamicScroller
    class="scroller"
    :items="items"
    :min-item-size="50"
  >
    <template v-slot="{ item, index, active }">
      <DynamicScrollerItem
        :item="item"
        :active="active"
        :size-dependencies="[item.goods_name]"
        :data-index="index"
      >
        <div class="main">
          <div class="index">{{ index+1 }}</div>
          <div class="desc">{{ item.goods_name }}</div>
        </div>
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
  <!-- minItemSize: 列表项初次渲染使用的最小高度-->
  <!-- active: 保持视图，防止不必要的重新计算 -->
  <!-- sizeDependencies: 影响高度的值，如果发生变化，则重新计算 -->
</template>

<script>
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

export default {
  components: {
    DynamicScroller,
    DynamicScrollerItem,
  },
  props: {
    items: Array,
  },
};
</script>

<style scoped lang="less">
.scroller {
  height: 100%;
}
.main {
  display: flex;
}
.index {
  width: 90px;
  text-align: center;
}
.desc {
  padding: 12px;
  margin: 10px 0;
  text-align: center;
  border: 1px solid #ebeef5;
  border-radius: 5px;
}
</style>