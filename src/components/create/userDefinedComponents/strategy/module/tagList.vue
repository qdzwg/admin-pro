<template>
  <div v-if="arr.length" class="tag-list">
    <!-- {{arr}} -->
    <span
      v-for="(item,index) in arr"
      :key="index"
      class="tag-item type1"
      :class="{'type1':item.labelKey=='0','type2':item.labelKey=='1','type3':item.labelKey=='2'}"
    >{{item.labelName}}</span>
  </div>
</template>
<script>
export default {
  props: {
    arr: {
      type: Array,
      default: () => []
    }
  }
};
</script>
<style lang="scss" scoped>
.tag-list {
  position: absolute;
  left: 8px;
  top: 10px;
  .tag-item {
    margin-bottom: 3px;
    border-radius: 2px;
    display: inline-block;
    text-align: center;
    height: 20px;
    line-height: 20px;
    color: #fff;
    font-size: 10px;
    padding: 0 10px;
    margin-right: 5px;
    &:last-child {
      margin-right: 0;
    }
    &.type1 {
      background: #ffb72f;
    }
    &.type2 {
      background: #ff6231;
      border-bottom-right-radius: 16px;
    }
    &.type3 {
      background: #ff214f;
      border-radius: 10px;
    }
  }
}
</style>