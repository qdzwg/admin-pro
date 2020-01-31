<template>
  <div class="rich-show-box">
    <!-- {{data}} -->
    <div class="rich-show-content" v-if='data.content' :style="{background:data.backgroundColor}">
      <dl v-html="data.content">
        {{data.content}}
      </dl>
    </div>
    <div class="set-notice" v-else>
      <img class="set-notice-img" src="../../../../assets/images/text-rich.png" alt="">
      <div class="set-notice-text">点击编辑富文本内容</div>
      <div style="margin-top:4px" class="set-notice-text">你可以对文字进行简单的排版操作也可以直接插入图片</div>
    </div>
    <!-- {{data.content}} -->
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
.rich-show-box {
  word-wrap: break-word;
  .rich-show-content{
    padding: 10px;
  }
  img {
    width: 100%;
  }
  .set-notice {
    text-align: center;
    background: #fff;
    padding: 30px;
    .set-notice-img{
      height: 88px;
      width: 150px;
      margin-right: 20px;
    }
    .set-notice-text{
      font-size: 11px;
      color: #999;
      margin-top: 8px;
    }
  }
}
</style>
