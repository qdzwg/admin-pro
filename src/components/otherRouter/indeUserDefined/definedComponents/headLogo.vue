<template>
  <div class="head-logo p-t-30">
    <div class="banner-handler">
      <Button size="small" @click="del(index)" type="error">删除</Button>
      <Button size="small" @click="bannerEdit(index)" type="primary">编辑</Button>
    </div>
    <div :style='{"border-top":"2px solid " + data.color}' class="heag-logo-warper">
      <img class="logo-img" v-if='data.logoUrl' :src="data.logoUrl" alt="">
      <Icon class="logo-img" style="font-size:58px" v-else type="image"></Icon>
      <div>
        <div class="logo-introduce">
          <div :style='{color:data.color}' class="logo-introduce-name">{{data.name?filter.cutstr(data.name,16):'请填写名称'}}</div>
          <div style="white-space:normal; word-break:break-all;margin-top:5px" class="logo-introduce-detail">{{data.intro?filter.cutstr(data.intro,24):'请填写简介'}}</div>
        </div>
        <div class="customer">
          <div v-if='data.tel.trim()' class="customer-tel">
            <img src="../../../../assets/images/kefu.png" alt="">
            <!-- <Icon class="headLogo-icon" type="ios-telephone"></Icon> -->
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    index: {
      type: Number
    },
    data: {
      type: Object
    }
  },
  computed: {
    imgList() {
      return this.data;
    }
  },
  data() {
    return {};
  },
  methods: {
    del(index) {
      this.$emit("delteCom", index);
    },
    bannerEdit(index) {
      this.$emit("showHeadLogoEdit", index);
      this.$store.dispatch("setIndex", index);
    }
  }
};
</script>
<style scoped lang="scss">
// @import '../../../../assets/styles/indexDefined/iconfont.css';
.heag-logo-warper {
  overflow: auto;
}
.head-logo {
  padding-left: 5px;
  padding-right: 5px;
  padding-bottom: 5px;
  overflow: hidden;
  .logo-img {
    color: #aaa;
    margin-left: 10px;
    height: 56px;
    width: 56px;
    float: left;
    margin-top: 10px;
    margin-right: 15px;
  }
  .logo-introduce {
    height: 57px;
    float: left;
    padding-left: 15px;
    font-size: 14px;
    margin-top: 10px;
    border-left: 1px solid #dddddd;
    .logo-introduce-name {
      // padding-top: 8px;
      font-size: 18px;
    }
    .logo-introduce-detail {
      font-size: 12px;
      color: #999;
    }
  }
  .customer {
    float: right;
    height: 70px;
    margin-right: 15px;
    .customer-tel {
      background: #ddd;
      height: 40px;
      width: 40px;
      padding: 8px;
      border-radius: 50%;
      margin-top: 20px;
      img {
        width: 100%;
      }
    }
  }
}
</style>
