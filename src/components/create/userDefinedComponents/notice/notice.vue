<template>
  <div class="notice-show-box" :style="{ background: data.backgroundColor}">
    <!-- {{data}}121 -->
    <div class="notice-content">
      <template v-if='data.content'>
        <div class="have-content clearfix" :style="{color:data.textColor}">
          <i style="margin-right:5px" class="xx-icon icon-shengyin fl"></i>
          <div style="width:320px;overflow:hidden;height:43px" class="fl">{{data.content}}</div>
        </div>
      </template>
      <div v-else class="no-content">
        <Icon class="notice-svg" type="ios-paper-outline"></Icon>
        <span>点击设置公告</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object
    }
  },
  computed: {},
  data() {
    return {};
  },
  methods: {}
};
</script>
<style lang="scss">
.notice-show-box {
  padding: 0 10px;
  .notice-content {
    overflow: hidden;
  }
  .no-content {
    overflow: hidden;
    height: 43px;
    line-height: 43px;
    text-align: center;
    font-size: 14px;
    color: #999;
    .notice-svg {
      color: #f05b47;
      vertical-align: middle;
      font-size: 18px;
    }
  }
  .have-content {
    height: 43px;
    line-height: 43px;
    font-size: 14px;
    // color: #999;
  }
}
</style>
