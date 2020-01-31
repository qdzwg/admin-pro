<template>
  <div class="shopinfo-show-box">
    <div :style="{'background-image':data.backUrl?'url('+data.backUrl+')':'none'}" class="shopinfo-box">
      <div class="clearfix tel-box">
        <!-- <img v-if='data.tel' class="tel-img fr" src="./../../../../assets/images/banner4.jpg" alt=""> -->
      </div>
      <div class="shopinfo-content clearfix">
        <div class="shopinfo-logo fl" :style="{'background':data.logoUrl?'transparent':'#f9f9f9'}">
          <img class="logo-img" v-if='data.logoUrl' :src="data.logoUrl" alt="">
          <template v-else>
            <img class="default-logo" src="./../../../../assets/images/bannertype2.png" alt="">
            <div class="default-text">图片空缺中</div>
          </template>
        </div>
        <div class="fl shopinfo">
          <div :style="{color:data.textColor}" class="shopinfo-title" :class="{'have-name':data.name}">
            <span>{{data.name?data.name:'请填写店铺名称'}}</span>
            <i style="font-size:18px;color:#f05b47" v-if='data.tel' class='xx-icon icon-dianhua'></i>
            </div>
          <div :style="{color:data.textColor}" class="shopinfo-intro" :class="{'have-intro':data.introduction}">{{data.introduction?data.introduction:'请填写简介'}}</div>
        </div>
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
  },
  methods: {}
};
</script>
<style lang="scss">
.shopinfo-show-box {
  .shopinfo-box {
    background: #fff;
    background-size: 100% 100%;
    height: 160px;
    .shopinfo-content {
      margin-top: 20px;
      padding-bottom: 10px;
      margin-left: 10px;
      margin-right: 15px;
      .shopinfo {
        margin-left: 10px;
        width: calc(100% - 85px);
        .shopinfo-title {
          height: 27px;
          line-height: 27px;
          background: #f9f9f9;
          // background: red;
          font-size: 16px;
          color: #999;
        }
        .shopinfo-title.have-name {
          background: transparent;
        }
        .shopinfo-intro {
          height: 23px;
          line-height: 23px;
          background: #f9f9f9;
          // background: red;
          margin-top: 10px;
          font-size: 12px;
          color: #999;
        }
        .shopinfo-intro.have-intro {
          line-height: normal;
          background: transparent;
        }
      }
      .shopinfo-logo {
        width: 75px;
        height: 75px;
        // background: #f9f9f9;
        // background: red;
        text-align: center;
        .logo-img {
          width: 100%;
          height: 100%;
        }
        .default-logo {
          width: 56px;
          height: 30px;
          margin-top: 15px;
        }
        .default-text {
          font-size: 12px;
          color: #999;
        }
      }
    }
    .tel-box {
      padding-right: 15px;
      height: 55px;
      .tel-img {
        width: 30px;
        height: 55px;
      }
    }
  }
}
</style>
