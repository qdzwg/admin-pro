<template>
  <div>
    <img v-if="data.picAddr" class="navigation-item-img  img-l-10" :src="data.picAddr" alt="">
    <i v-else :style='{color:data.iconColor}' class="icon iconfont item-icon xx-icon" :class="data.icon"></i>
    <div class="navigation-item-info">
      <div class="title">
        {{data.title}}
      </div>
      <div class="text">
        {{data.subtitle}}
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
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.item-icon {
  font-size: 40px;
  float: left;
  color: #000;
  margin-right: 5px;
}
.navigation-item-img {
  width: 35px;
  height: 35px;
  float: left;
  margin-top: 15px;
}
.navigation-item-info {
  width: calc(100% - 65px);
  text-align: center;
  margin-top: 7px;
  float: left;
  color: #ffffff;
  margin-left: 5px;
  .title {
    font-size: 16px;
    margin-bottom: 4px;
    white-space: nowrap;
  }
  .text {
    font-size: 11px;
    white-space: nowrap;
  }
}
</style>

