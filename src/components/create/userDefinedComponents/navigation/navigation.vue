<template>
  <div class="navigation-show-box">
    <template v-if="data.list&&data.list.length">
      <div
        v-if="data.type =='navigation1'"
        :style="{background:data.backgroundColor}"
        class="navigation-img-list clearfix"
      >
        <div
          v-for="(item,index) in data.list"
          :key="index"
          :style="{width:itemWidth,'border-right':(((index+1)>=data.lineNum)&&((index+1)%(data.lineNum)==0))?'0':('2px solid ' + (data.borderColor?data.borderColor:'#fff')),'border-bottom':index+1>min?'0':('2px solid ' + (data.borderColor?data.borderColor:'#fff'))}"
          class="navigation-img-item"
        >
          <div
            class="navigation-img-box"
            :style="{ 'background': item.picAddr?'transparent':'#f9f9f9'}"
          >
            <img v-if="item.picAddr" class="navigation-img" :src="item.picAddr" alt>
            <template v-else>
              <i
                style="font-size:30px"
                :style="{'color':data.textColor}"
                v-if="iconData[item.linkUrl]"
                class="icon iconfont item-icon xx-icon"
                :class="iconData[item.linkUrl]"
              ></i>
              <img
                v-else
                class="navigation-box-img"
                src="../../../../assets/images/bannertype1.png"
                alt
              >
            </template>
          </div>
          <div class="text" :style="{color:data.textColor}">{{item.title?item.title:'默认导航'}}</div>
        </div>
      </div>
      <div
        v-if="data.type =='navigation2'"
        :style="{background:data.backgroundColor}"
        class="navigation-img-list type2-list clearfix"
      >
        <div
          v-for="(item,index) in data.list"
          :key="index"
          :style="{width:itemWidth,'border-right':(((index+1)>=data.lineNum)&&((index+1)%(data.lineNum)==0))?'0':('2px solid ' + (data.borderColor?data.borderColor:'#fff')),'border-bottom':index+1>min?'0':('2px solid ' + (data.borderColor?data.borderColor:'#fff'))}"
          style="padding:0"
          class="navigation-img-item"
        >
          <div class="text" :style="{color:data.textColor}">{{item.title?item.title:'默认导航'}}</div>
        </div>
      </div>
      <div
        v-if="data.type =='navigation3'"
        :style="{background:data.backgroundColor}"
        class="navigation-img-list type3-list clearfix"
      >
        <div
          v-for="(item,index) in data.list"
          :key="index"
          :style="{width:itemWidth,'border-right':(((index+1)>=data.lineNum)&&((index+1)%(data.lineNum)==0))?'0':('2px solid ' + (data.borderColor?data.borderColor:'#fff')),'border-bottom':index+1>min?'0':('2px solid ' + (data.borderColor?data.borderColor:'#fff'))}"
          style="padding:0"
          class="navigation-img-item"
        >
          <div class="text" :style="{color:data.textColor}">
            <span class="text-name">{{item.title?item.title:'默认导航'}}</span>
            <span class="text-tag" v-if="item.tagTitle" :style="{background:item.tagBgColor}">
              <span :style="{color: item.tagColor}">{{item.tagTitle}}</span>
            </span>
          </div>
          <div class="subTitle" v-if="item.subtitle">
            <div v-if="item.itemSelectBg">
              <span class="subTitle-name active-name" :style="{background:'url(' + item.itemSelectBg + ') top center no-repeat',backgroundSize:'contain'}">{{item.subtitle}}</span>
            </div>
            <div v-else>
              <span class="subTitle-name">{{item.subtitle}}</span>
            </div>
            
            <!-- <span class="subTitle-name" :class="{'active-name': item.itemSelectBg}" :style="{'background': item.itemSelectBg ? 'url('+item.itemSelectBg+')  no-repeat' : ' ', 'background-size': item.itemSelectBg ? 'contain' : ''}">{{item.subtitle}}</span>             -->
          </div>
        </div>
      </div>
    </template>
    <div class="add-notice" v-if="data.list&&!data.list.length">请新增图文导航</div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object
    }
  },
  watch: {},
  computed: {
    max() {
      return this.data.list.length;
    },
    min() {
      if (this.num2 == 0) {
        //整除
        if (this.num1 == 0) {
          //this.data.list.lenght ===0
          return 0;
        } else {
          return (this.num1 - 1) * this.data.lineNum;
        }
      } else {
        // 没有整除
        return this.num1 * this.data.lineNum;
      }
    },
    num1() {
      //取整数
      return Math.floor(this.data.list.length / this.data.lineNum);
    },
    num2() {
      //余数
      return this.data.list.length % this.data.lineNum;
    },
    itemWidth() {
      return (1 / this.data.lineNum) * 100 + "%";
    }
  },
  data() {
    return {
      iconData: {
        home: "icon-nav-home",
        order: "icon-nav-orders",
        personal: "icon-member",
        shopcart: "icon-shopping-car",
        ticket: "icon-nav-ticket",
        hotel: "icon-nav-hotel",
        shop: "icon-nav-goods",
        strategy: "icon-nav-raiders",
        route: "icon-nav-tours",
        repast: "icon-nav-foods",
        ai_p: "icon-AIpaiyipai",
         customtel:'icon-bohao'
      },
      defaultImgList: [
        //默认图片
        {
          url: require("../../../../assets/images/login_bg.jpg")
        },
        {
          url: require("../../../../assets/images/login_bg.jpg")
        },
        {
          url: require("../../../../assets/images/login_bg.jpg")
        }
      ]
    };
  },
  methods: {}
};
</script>
<style lang="scss">
.navigation-show-box {
  .add-notice {
    line-height: 100px;
    // padding-top: 50px;
    height: 100px;
    text-align: center;
    font-size: 16px;
    background: #cccccc;
  }
  .navigation-img-list {
    // height: 100px;
    // padding-top: 15px;
    background: #fff;
    .navigation-img-item {
      // margin-bottom: 15px;
      padding: 15px 0;
      text-align: center;
      float: left;
      border-bottom: 4px solid #ffffff;
      // border-right: 4px solid #fff;
      .navigation-img-box {
        width: 40px;
        height: 40px;
        border-radius: 5px;
        text-align: center;
        margin: 0 auto;
        .navigation-img {
          float: left;
          width: 40px;
          height: 40px;
        }
        .navigation-box-img {
          margin-top: 12px;
          width: 29.5px;
          height: 16.5px;
          margin-right: 4px;
        }
      }
      .text {
        text-align: center;
        font-size: 12px;
        color: #999;
        padding-top: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .no-img-box {
        .no-img {
          width: 31px;
          height: 18px;
        }
        .no-img-text {
          font-size: 8px;
          color: #999;
          margin-top: 5px;
        }
      }
    }
  }
  .navigation-img-list.type2-list {
    // height: 52px;
    padding-top: 0;
    .navigation-img-item {
      .text {
        height: 52px;
        line-height: 52px;
        padding-top: 0;
      }
    }
  }
  .navigation-img-list.type3-list {    
    padding-top: 0;
    border: 2px solid #e5e5e5;
    border-radius: 5px;
    .navigation-img-item {
      border-right: 2px solid #e5e5e5;
      .text {
        // height: 25px;
        line-height: 25px;
        // padding-top: 20px;
        position: relative;
        .text-name{
          position: relative;
          z-index: 1;
          font-size: 18px;
          color: #333;
        }
        .text-tag{
          position: absolute;
          z-index: 2;
          top: 2px;
          right: 0;
          color: #fff;
          font-size: 12px;
          text-align: center;
          width: 36px;
          height: 20px;
          line-height: 20px;
          display: block;
          border-radius: 6px;
          border-bottom-left-radius: 0;
        }
      }
      .subTitle{
        text-align: center;
        height: 25px;
        line-height: 25px;
        position: relative;
        margin-bottom: 5px;
        .subTitle-name {
          display: block;
          position: relative;
          z-index: 2;
          text-align: center;
          color: #999;
          line-height: 25px;
          font-size: 12px;
          // width: 100%;
          // height: 25px;
        }
        .active-name {
          color: #fff;
        }
        .subTitle-bg {
          display: block;
          position: absolute;
          z-index: 1;
          height: 25px;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          img{
            // max-width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
