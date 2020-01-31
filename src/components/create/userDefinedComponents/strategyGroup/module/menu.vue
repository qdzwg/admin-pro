<template>
  <div class="menu-list">
    <template v-for="(item,index) in list">
      <span
        @click="changeIndex(index)"
        :key="index"
        class="menu-item"
        :class="{'active':activeIndex==index}"
        :style="{ 'background':activeIndex==index?activeColor:'#fff'}"
      >{{item.groupName?item.groupName:'组名'}}</span>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    activeColor: {
      type: String,
      default: "#f05b47"
    },
    list: {
      type: Array,
      default: () => []
    },
    menuType: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      activeIndex: 0
    };
  },
  methods: {
    changeIndex(index) {
      this.activeIndex = index;
      this.$emit("indexChange", index);
    }
  }
};
</script>
<style lang="scss" scoped>
.menu-list {
  padding: 10px 12.5px;
  .menu-item {
    display: inline-block;
    text-align: center;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    padding: 0 15px;
    color: #666;
    margin-right: 10px;
    border-radius: 15px;
    // background: #ffffff;
    &:last-child {
      margin-right: 0;
    }
    &.active {
      color: #ffffff;
    }
  }
}
</style>