<template>
  <div class="line-show-box" :class='{"line-type2":data.sideWidth=="type2"}'>
    <div :style="{'border-color':data.lineColor,'border-top-style':data.style}" class="line"></div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
<style lang="scss">
.line-show-box{
  padding: 10px 0;
  .line{
    border-top: 1px solid;
  }
}
.line-type2{
  padding-left: 10px;
  padding-right: 10px;
}
</style>
