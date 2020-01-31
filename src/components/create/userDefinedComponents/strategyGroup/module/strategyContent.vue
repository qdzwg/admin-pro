<template>
  <div class="strategy-body">
    <!-- {{data}} -->
    <template v-for="(item,index) in list">
      <stragegy v-if="index==showIndex" :key="index" :listType="listType" :data="item" :comData='data'></stragegy>
    </template>
  </div>
</template>
<script>
import stragegy from "../../strategy/strategy";
export default {
  components: {
    stragegy
  },
  props: {
    data:{
      type:Object,
      default:()=>{}
    },
    listType: {
      type: String
    },
    showIndex: {
      type: String | Number,
      default: 0
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    showIndex(val) {
      this.activeIndex = val;
    }
  },
  data() {
    return {
      activeIndex: this.showIndex
    };
  }
};
</script>
<style lang="scss">
</style>