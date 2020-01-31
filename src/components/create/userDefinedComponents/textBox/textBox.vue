<template>
  <div class="textBox-show-box" :style="{ background: data.backgroundColor}">
    <!-- {{data}}121 -->
    <!-- {{formatStr}} -->
    <div class="notice-content">
      <div class="have-content" v-if="data.content" :style="{'font-size':data.fontSize,color:data.textColor,'text-align':data.position}">
        <div v-html="formatStr"></div>
      </div>
      <div v-else class="no-content" :style="{'text-align':data.position}">
        <Icon class="notice-svg" type="ios-paper-outline"></Icon>
        <span :style="{'font-size':data.fontSize,color:data.textColor}">点击设置文本</span>
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
  computed: {
    formatStr() {
      return this.data.content.replace(/\n/g, "<br/>");

      // let str = this.date
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
<style lang="scss">
.textBox-show-box {
  padding: 0 10px;
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
    padding: 5px 0;
    word-wrap: break-word;
    word-break: normal;
  }
}
</style>
