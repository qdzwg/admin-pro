<template >
  <div class="strategy-group">
    <!-- {{data}} -->
    <strategy-menu
      @indexChange="change"
      :list="data.list"
      :menuType="data.menuType"
      :activeColor="data.activeColor"
    ></strategy-menu>
    <strategy-content :showIndex="activeIndex" :listType="data.listType" :list="data.list" :data='data'></strategy-content>
  </div>
</template>
<script>
import strategyMenu from "./module/menu";
import strategyContent from "./module/strategyContent";
export default {
  components: {
    strategyMenu,
    strategyContent
  },
  data() {
    return {
      activeIndex: 0
    };
  },
  props: {
    data: {
      type: Object
    }
  },
  methods: {
    change(index) {
      this.activeIndex = index;
    }
  }
};
</script>
<style lang="scss">
</style>