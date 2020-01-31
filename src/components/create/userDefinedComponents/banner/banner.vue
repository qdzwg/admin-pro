<template>
  <!-- <div class="banner-show-box" :class="{'both-margin':data.imgFill=='white'}"> -->
  <div class="banner-show-box">
    <!-- {{data}} -->
    <!-- {{data.imgFill}} -->
    <template v-if="data.list&&data.list.length">
      <template v-if="data.type=='banner1'">
        <!-- 轮播图 -->
        <div :style="{height: data.casaulBackUrl ? '186.5px' : '181.5px', 'margin':data.imgFill=='white'?'0 5px':'0'}">
          <Carousel
            class="banner-list"
            arrow="never"
            radius-dot
            :dots="data.list&&data.list.length>1?'inside':'none'"
            autoplay
            loop            
          >
            <CarouselItem
              class="banner-item"
              style="height:181.5px; overflow:hidden"
              v-for="(item,index) in data.list"
              :key="index"
              :style="{borderRadius: data.imgRadius=='special'?'5px':'0px',overflow: 'hidden'}"
            >
              <div class="demo-carousel" :style="{borderRadius: data.imgRadius=='special'?'5px':'0px',overflow: 'hidden'}">
                <!-- {{index}} -->
                <div v-if="data.hideText=='F'" :style="{borderRadius: data.imgRadius=='special'?'5px':'0px',overflow: 'hidden'}" class="img-text">{{item.title}}</div>
                <img class="carousel-img" v-if="item.picAddr" :src="item.picAddr" :style="{borderRadius: data.imgRadius=='special'?'5px':'0px',overflow: 'hidden'}" alt>
                <div v-else class="no-carousel-box">
                  <img class="no-carousel-img" src="../../../../assets/images/bannertype1.png" :style="{borderRadius: data.imgRadius=='special'?'5px':'0px',overflow: 'hidden'}" alt>
                  <div class="no-carousel-text">请在右侧添加你需要的图片</div>
                </div>
              </div>
            </CarouselItem>
          </Carousel>
          <div v-if="data.casaulBackUrl" style="height:5px;" :style="{background: data.casaulBackUrl ? 'url('+data.casaulBackUrl+') bottom center no-repeat' : '', backgroundSize: data.casaulBackUrl ? 'contain' : ''}"></div>
        </div>
        
      </template>
      <template v-if="data.type=='banner2'">
        <!-- <div class="one-line-img" :style='{"height":data.list.length*181.5 + (data.list.length-1)*10 +"px"}'> -->
        <div class="one-line-img" :style="{'margin':data.imgFill=='white'?'0 5px':'0'}">
          <div v-for="(item,index) in data.list" :key="index" class="demo-carousel clearfix">
            <!-- {{index}} -->
            <div  v-if="data.hideText=='F'" class="img-text">{{item.title}}</div>
            <img class="carousel-img fl" :class="{'fixed-height':data.imgHeightAuto=='F'}"  v-if="item.picAddr" :src="item.picAddr" alt>
            <div v-else class="no-carousel-box">
              <img class="no-carousel-img" src="../../../../assets/images/bannertype2.png" alt>
              <div class="no-carousel-text">请在右侧添加你需要的图片</div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="data.type=='banner3'">
        <div class="slider-warper" :style="{'margin':data.imgFill=='white'?'0 5px':'0'}">
          <div
            class="banner-slider-box"
            :style="{width:data.list.length?((data.list.length*171 - 8) + 'px'):'100%'}"
          >
            <div class="banner-slider-item" v-for="(item,index) in data.list" :key="index">
              <div  v-if="data.hideText=='F'" class="img-text">{{item.title}}</div>
              <img class="slider-img" v-if="item.picAddr" :src="item.picAddr" alt>
              <div v-else class="no-slider-box">
                <img class="no-slider-img" src="../../../../assets/images/bannertype2.png" alt>
                <div class="no-slider-text">图片空缺</div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="data.type=='banner4'">
        <div class="slider-warper" :style="{'margin':data.imgFill=='white'?'0 5px':'0'}">
          <div
            class="banner-slider-box banner-slider-bcg-box"
            :style="{width:data.list.length?((data.list.length*324) + 'px'):'100%'}"
          >
            <div :style="{backgroundImage:item.picAddr?('url('+item.picAddr+')'):'none',borderRadius: data.imgRadius=='special'?'5px':'0px'}" class="banner-slider-item banner-slider-bcg" v-for="(item,index) in data.list" :key="index">
              <div v-if="data.hideText=='F'" class="img-text">{{item.title}}</div>
              <div v-if="!item.picAddr" class="no-slider-box">
                <img class="no-slider-img" src="../../../../assets/images/bannertype2.png" alt>
                <div class="no-slider-text">图片空缺</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
    <div
      v-if="data.list&&!data.list.length"
      class="demo-carousel"
      :class="{'no-data-type2':data.type=='banner2','no-data-type3':data.type=='banner3','no-data-type4':data.type=='banner4'}"
    >
      <!-- {{index}} -->
      <template v-if="data.type=='banner1'">
        <div class="no-carousel-box">
          <img class="no-carousel-img" src="../../../../assets/images/bannertype1.png" alt>
          <div class="no-carousel-text">请在右侧添加你需要的图片</div>
        </div>
      </template>
      <template v-if="data.type=='banner2'">
        <div class="no-carousel-box">
          <img class="no-carousel-img" src="../../../../assets/images/bannertype2.png" alt>
          <div class="no-carousel-text">请在右侧添加你需要的图片</div>
        </div>
        <!-- <div class="no-carousel-box">
          <img class="no-carousel-img" src="../../../../assets/images/bannertype2.png" alt="">
          <div class="no-carousel-text">请在右侧添加你需要的图片</div>
        </div>
        <div class="no-carousel-box">
          <img class="no-carousel-img" src="../../../../assets/images/bannertype2.png" alt="">
          <div class="no-carousel-text">请在右侧添加你需要的图片</div>
        </div>-->
      </template>
      <template v-if="data.type=='banner3'">
        <div class="overflow-box">
          <div class="no-carousel-box">
            <img class="no-carousel-img" src="../../../../assets/images/bannertype2.png" alt>
            <div class="no-carousel-text">图片空缺中</div>
          </div>
          <div class="no-carousel-box">
            <img class="no-carousel-img" src="../../../../assets/images/bannertype2.png" alt>
            <div class="no-carousel-text">图片空缺中</div>
          </div>
          <div class="no-carousel-box">
            <img class="no-carousel-img" src="../../../../assets/images/bannertype2.png" alt>
            <div class="no-carousel-text">图片空缺中</div>
          </div>
        </div>
      </template>
      <template v-if="data.type=='banner4'">
        <div class="overflow-box">
          <div class="no-carousel-box">
            <img class="no-carousel-img" src="../../../../assets/images/bannertype2.png" alt>
            <div class="no-carousel-text">图片空缺中</div>
          </div>
          <div class="no-carousel-box">
            <img class="no-carousel-img" src="../../../../assets/images/bannertype2.png" alt>
            <div class="no-carousel-text">图片空缺中</div>
          </div>
        </div>
      </template>
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
  watch: {
    imgFill() {
      this.show = true;
    }
  },
  computed: {
    imgFill() {
      return this.data.imgFill;
    }
  },
  data() {
    return {
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
.banner-show-box.both-margin {
  margin: 0 4px;
}
.banner-show-box {
  .slider-warper {
    overflow: hidden;
    margin: 10px 0px;
  }
  .banner-slider-box {
    height: 122px;
    .banner-slider-item {
      margin-right: 4px;
      text-align: center;
      display: inline-block;
      width: 162.5px;
      height: 122px;
      position: relative;
      .img-text {
        position: absolute;
        left: 5px;
        right: 5px;
        bottom: 6px;
        font-size: 14px;
        color: #fff;
        overflow: hidden;
        text-align: left;
      }
      .slider-img {
        height: 100%;
        width: 100%;
      }
      .no-slider-box {
        .no-slider-img {
          width: 94px;
          height: 55px;
          margin-top: 24px;
        }
        .no-slider-text {
          font-size: 11px;
          color: #999;
        }
      }
    }
    .banner-slider-item:last-child {
      margin-right: 0;
    }
    .banner-slider-bcg {
      width: 320px;
      height: 140px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% auto;
      overflow: hidden;
    }
  }
  .banner-slider-bcg-box {
    height: 140px;
  }
  .add-notice {
    // line-height: 187px;
    padding-top: 50px;
    height: 181.5px;
    text-align: center;
    font-size: 16px;
    background: #cccccc;
  }
  // .ivu-carousel-active {
  //   padding: 4px;
  // }
  .banner-list.both-margin {
    margin: 0 5px;
  }
  .banner-list {
    height: 181.5px;
    .banner-item.banner-type1 {
      height: 181.5px;
    }
    .ivu-carousel-dots {
      li {
        margin: 0 5px;
        button.radius {
          width: 7px;
          height: 7px;
          background: #fff;
          opacity: 1.0;
        }
      }
      li.ivu-carousel-active {
        // bottom: 2px;
        button.radius {
          // transform: scale(1.5);
          // height: 12px;
          // width: 12px;
          background: #ffb119;
          width: 12px;
          border-radius: 3px;
        }
      }
    }
  }
  .demo-carousel {
    background: #fff;
    // height: 181.5px;
    position: relative;
    .img-text {
      position: absolute;
      left: 5px;
      right: 5px;
      bottom: 10px;
      height: 30px;
      line-height: 30px;
      overflow: hidden;
      font-size: 16px;
      color: #fff;
    }
    img.carousel-img {
      width: 100%;
      height: 181.5px;
    }
    // img.
    .no-carousel-box {
      height: 181.5px;
      text-align: center;
      .no-carousel-img {
        width: 174px;
        height: 101px;
        margin-top: 30px;
        margin-right: 21px;
      }
      .no-carousel-text {
        font-size: 13px;
        color: #999;
        margin-top: 6px;
      }
    }
  }
  .demo-carousel.no-data-type2 {
    .no-carousel-box {
      margin-bottom: 8px;
      margin-left: 4px;
      margin-right: 4px;
      border-radius: 5px;
      background: #f9f9f9;
      .no-carousel-img {
        height: auto;
      }
    }
    .no-carousel-box:last-child {
      margin-bottom: 0;
    }
  }
  .demo-carousel.no-data-type3 {
    overflow: hidden;
    .overflow-box {
      width: 700px;
      .no-carousel-box {
        width: 160px;
        height: 110px;
        float: left;
        margin-bottom: 8px;
        margin-left: 4px;
        margin-right: 4px;
        border-radius: 5px;
        background: #f9f9f9;
        .no-carousel-img {
          height: 43px;
          width: 80px;
          margin-right: 10px;
        }
      }
    }

    .no-carousel-box:last-child {
      margin-bottom: 0;
    }
  }
  .demo-carousel.no-data-type4 {
    overflow: hidden;
    .overflow-box {
      width: 700px;
      .no-carousel-box {
        width: 320px;
        height: 140px;
        float: left;
        margin-bottom: 8px;
        margin-left: 4px;
        margin-right: 4px;
        border-radius: 5px;
        background: #f9f9f9;
        .no-carousel-img {
          height: 86px;
          width: 160px;
          margin-right: 10px;
          margin-top: 20px;
        }
      }
    }

    .no-carousel-box:last-child {
      margin-bottom: 0;
    }
  }
  .one-line-img.both-margin {
    margin: 0 5px;
  }
  .one-line-img {
    background: #eeeeee;
    .demo-carousel {
      margin-bottom: 10px;
      height: auto;
      .carousel-img {
        width: 100%;
        height: auto;
      }
      .carousel-img.fixed-height{
         height: 181.5px;
      }
    }
    .demo-carousel:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
