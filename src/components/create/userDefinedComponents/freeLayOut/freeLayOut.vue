<template>
  <div class="freelayout-show-box">
    <!-- {{data}} -->
    <template v-if='data.list&&data.list.length'>
      <template v-if='data.type=="freeLayout1"'>
        <Row class="list1" :style="{'background':data.bgTransparent === 'T'?'':'white'}">
          <Col class="list1-item item-style" span="12" style="float:none; display:inline-block; vertical-align:top" v-for="(item,index) in data.list" :key='index'>
          <div class="list1-item-content" :class="{'fixed-height':data.imgHeightAuto=='F'}" :style="{'background': item.picAddr?'transparent':'#f9f9f9', 'margin': '4px ' + data.height+'px'}">
            <div class="list1-img-box" :class="{'list1-main-box': data.hideText=='T'}" v-if='item.picAddr'>
              <img class="list1-cover-img"  :src="item.picAddr" alt="">
            </div>            
            <template v-else>
              <img class="list1-item-img" src="./../../../../assets/images/bannertype2.png" alt="">
              <div>
                图片空缺中
              </div>
            </template>
            <template v-if="data.hideText=='F'">
              <div class="" style="height:25px; line-height:25px;">
                {{item.text}}
              </div>
            </template>            
          </div>
          </Col>
        </Row>
      </template>
      <template v-if='data.type=="freeLayout2"'>
        <Row class="list1" :style="{'background':data.bgTransparent === 'T'?'':'white'}">
          <Col class="list1-item item-style" span="12" v-for="(item,index) in data.list" v-if='index<2' :key='index'>
          <div class="list1-item-content" :class="{'fixed-height':data.imgHeightAuto=='F'}" :style="{'background': item.picAddr?'transparent':'#f9f9f9', 'margin': '4px ' + data.height+'px'}">
            <div class="list1-img-box" :class="{'list1-main-box': data.hideText=='T'}" v-if='item.picAddr'>
              <img class="list1-cover-img" :src="item.picAddr" alt="">
            </div>            
            <template v-else>
              <img class="list1-item-img" src="./../../../../assets/images/bannertype2.png" alt="">
              <div>
                图片空缺中
              </div>
            </template>
            <template v-if="data.hideText=='F'">
              <div class="" style="height:25px; line-height:25px;">
                {{item.text}}
              </div>
            </template>
          </div>
          </Col>
        </Row>
      </template>
      <template v-if='data.type=="freeLayout3"'>
        <Row class="list1" :style="{'background':data.bgTransparent === 'T'?'':'white'}">
          <Col class="list1-item item-style" span="8" v-for="(item,index) in data.list" v-if='index<3' :key='index'>
          <div class="list1-item-content list3-item-content"  :class="{'fixed-height3':data.imgHeightAuto=='F'}" :style="{'background': item.picAddr?'transparent':'#f9f9f9', 'margin': '4px ' + data.height+'px'}">
            <div v-if='item.picAddr' class="list3-img-box" :class="{'list3-main-box':data.hideText=='T'}">
              <img class="list1-cover-img"  :src="item.picAddr" alt="">
            </div>            
            <template v-else>
              <img class="list3-item-img" src="./../../../../assets/images/bannertype2.png" alt="">
              <div>
                图片空缺中
              </div>
            </template>
            <template v-if="data.hideText=='F'">
              <div class="" style="height:25px; line-height:25px;">
                {{item.text}}
              </div>
            </template>
          </div>
          </Col>
        </Row>
      </template>
      <template v-if='data.type=="freeLayout4"'>
        <Row class="list1 list4" :style="{'background':data.bgTransparent === 'T'?'':'white'}">
          <Col class="list1-item item-style" v-for="(item,index) in data.list" :span='index==0?"24":"12"' :class="{'list4-first-item':index==0}" v-if='index<3' :key='index'>
          <div class="list1-item-content list3-item-content"  :class="{'fixed-height4':data.imgHeightAuto=='F'}" :style="{'background': item.picAddr?'transparent':'#f9f9f9', 'margin': index!=0?'4px '+data.height+'px':''}" >
            <div class="top-img-box" :class="{'top-main-box':data.hideText=='T'}" v-if='item.picAddr'>
              <img class="list1-cover-img" :src="item.picAddr" alt="">
            </div>            
            <template v-else>
              <img class="list4-item-img" src="./../../../../assets/images/bannertype2.png" alt="">
              <div :class='{"small-size":index!=0}'>
                图片空缺中
              </div>
            </template>
            <template v-if="data.hideText=='F'">
              <div class="" style="height:25px; line-height:25px;">
                {{item.text}}
              </div>
            </template>
          </div>
          </Col>
        </Row>
      </template>
    </template>
    <template v-if='data.type=="freeLayout5"||data.type=="freeLayout6"'>
      <div class="list5 clearfix" :class='{"list6":data.type=="freeLayout6"}' :style="{'background':data.bgTransparent === 'T'?'':'white'}">
        <div class="list5-left fl" :style="{'width': data.mainImgWidth+'%'}">
          <div class="list5-left-content item"  :class="{'fixed-height6':data.imgHeightAuto=='F'}" :style="{'background': data.list[0].picAddr?'transparent':'#f9f9f9','margin': '0px '+data.height+'px'}">
            <div class="left-img-box" :class="{'left-main-box':data.hideText=='T'}" v-if='data.list[0].picAddr'>
              <img class="cover-img" :src="data.list[0].picAddr" alt="">
            </div>            
            <template v-else>
              <img class="item-img" src="./../../../../assets/images/bannertype2.png" alt="">
              <div>
                图片空缺中
              </div>
            </template>
            <template v-if="data.hideText=='F'">
              <div class="" style="height:25px; line-height:25px;">
                {{data.list[0].text}}
              </div>
            </template>
            <!-- <img class="list1-cover-img" v-if='item.picAddr' :src="item.picAddr" alt=""> -->
            <!-- <template v-else>
              <img class="list3-item-img" src="./../../../../assets/images/bannertype2.png" alt="">
              <div :class='{"small-size":index!=0}'>
                图片空缺中
              </div>
            </template> -->
          </div>
        </div>
        <div class="list5-right fr" :style="{'width': (100 - data.mainImgWidth) + '%'}">
          <div v-for="(item,index) in data.list" :key='index' v-if='index!=0&&index<limit' class="list5-right-content item" :class="{'fixed-height6':data.imgHeightAuto=='F'}" :style="{'background': item.picAddr?'transparent':'#f9f9f9','marginRight': data.height+'px', 'marginTop': (index>1 && index<limit)?data.height+'px': '0px' }">
            <div class="right-img-box" :class="{'right-main-box':data.hideText=='T'}" v-if='item.picAddr'>
              <img class="cover-img" :src="item.picAddr"  alt="">
            </div>            
            <template v-else>
              <img class="item-img" src="./../../../../assets/images/bannertype2.png" alt="">
              <div>
                图片空缺中
              </div>
            </template>
            <template v-if="data.hideText=='F'">
              <div class="" style="height:25px; line-height:25px;">
                {{item.text}}
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
    <template v-if="data.type=='freeLayout7'">
      <div class="list5 list7 clearfix" :class='{"list6":data.type=="freeLayout7"}' :style="{'background':data.bgTransparent === 'T'?'':'white'}">
        <div class="list5-left list7-left" :style="{'width': '50%', 'height': '100%'}">   
          <div
            v-if="data.casaulList&&!data.casaulList.length"
            class="demo-carousel"
          >
            <template>
              <div class="no-carousel-box">
                <img  class="no-carousel-img" src="../../../../assets/images/bannertype1.png" alt style="width:100%; height:100%;">
                <div class="no-carousel-text" style="text-align:center; padding: 5px 0;">请在右侧添加你需要的图片</div>
              </div>
            </template>
          </div>       
          <!-- {{data.casaulList}} -->
          <div class="freeLayout7-left-casaul" v-else>
            <Carousel
              class="banner-list"
              arrow="never"
              radius-dot
              :dots="data.casaulList&&data.casaulList.length>1?'inside':'none'"
              autoplay
              loop
            >
              <CarouselItem
                class="banner-item"
                style="height:250px"
                v-for="(item,index) in data.casaulList"
                :key="index"
              >
                <div style="height:100%;background:#fff" class="demo-carousel">                 
                  <img   style="height:100%;width:100%" class="carousel-img" v-if="item.picAddr" :src="item.picAddr" alt>
                  <div v-else class="no-carousel-box">
                    <img class="no-carousel-img" src="../../../../assets/images/bannertype1.png" alt>
                    <div class="no-carousel-text">请在右侧添加你需要的图片</div>
                  </div>
                </div>
              </CarouselItem>
            </Carousel>
          </div>
        </div>
        <div class="list5-right list7-right" :style="{'width': '50%'}">
          
          <div v-for="(item,index) in data.list" :key='index' v-if='index<limit' class="list5-right-content item" :class="{'fixed-height6':data.imgHeightAuto=='F'}" :style="{'background': item.picAddr?'transparent':'#f9f9f9'}">
            <div class="right-img-box" :class="{'right-main-box':data.hideText=='T'}" v-if='item.picAddr'>
              <img class="cover-img" :src="item.picAddr"  alt="">
            </div>            
            <template v-else>
              <img class="item-img" src="./../../../../assets/images/bannertype2.png" alt="">
              <div>
                图片空缺中
              </div>
            </template>
            <!-- <template v-if="data.hideText=='F'">
              <div class="" style="height:25px; line-height:25px;">
                {{item.text}}
              </div>
            </template> -->
          </div>
                    
        </div>
      </div>
    </template>
    <!-- <div class="add-notice" v-if="data.list&&!data.list.length">
      请新增图文导航
    </div> -->
    
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object
    }
  },
  watch:{
    // casaulListLength(){
    //   this.casaulListShow = false
    //   this.$nextTick(()=>{
    //     this.casaulListShow = true
    //   })
    // }
  },
  computed: {
    // casaulListLength(){
    //   return this.casaulList&&this.casaulList.length?this.casaulList.length:0
    // },
    itemWidth() {
      return (1 / this.data.list.length) * 100 + "%";
    },
    limit() {
      if(this.data.type == 'freeLayout7'){
        return 2;
      }else{
        return this.data.type == "freeLayout5" ? 4 : 3;
      }      
    }
  },
  data() {
    return {
      casaulListShow:true,
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
.freelayout-show-box {
  .add-notice {
    line-height: 100px;
    // padding-top: 50px;
    height: 100px;
    text-align: center;
    font-size: 16px;
    background: #cccccc;
  }
  .list5 {
    // background: #fff;
    // padding: 8px 4px;
    // padding: 8px 4px 20px 4px;
    line-height:normal;
    .item {
      background: #f9f9f9;
      font-size: 11px;
      color: #999;
      text-align: center;
      .cover-img {
        height: 100%;
        width: 100%;
        line-height:normal;
      }
    }
    .list5-left {
      width: 234px;
      .item {
        font-size: 13px;
        // height: 274px;
      }
      .fixed-height6{
        // height: 274px;
        height: 299px;
        .left-img-box{
          height: 274px;
        }
        .left-main-box{
          height: 299px;
        }
      }
      .item-img {
        width: 158.5px;
        height: 84px;
        margin-top: 80px;
      }
    }
    .list5-right {
      width: 121px;
      .item-img {
        width: 71px;
        height: 38.5px;
        margin-top: 16px;
      }
      .item {
        // height: 88.5px;
        // margin-bottom: 4px;
      }
      .fixed-height6{
        // height: 88.5px;
        height: 96px;
        .right-img-box{
          height: 71px
        }
        .right-main-box{
          height: 96px;
        }
      }
    }
  }
  .list6 {
    .list5-left {
      // width: 234px;
      .item {
        // font-size: 13px;
        // height: 234px;
      }
      .fixed-height6{
        // height: 234px;
        height: 259px;
        .left-img-box{
          height: 234px;
        }
        .left-main-box{
          height: 259px;
        }
      }
      .item-img {
        width: 158.5px;
        height: 84px;
        margin-top: 80px;
      }
    }
    .list5-right {
      width: 121px;
      .item-img {
        width: 71px;
        height: 38.5px;
        margin-top: 16px;
      }
      .item {
        // height: 115px;
        // margin-bottom: 4px;
      }
      .fixed-height6{
        // height: 115px;
        height: 125px;
        .right-img-box{
          height: 100px;
        }
        .right-main-box{
          height: 125px;
        }
      }
    }
  }
  .list1 {
    // background: #fff;
    padding: 6px 2px;
    .list1-item {
      .list1-item-content {
        background: #f9f9f9;
        text-align: center;
        // height: 173.5px;
        font-size: 13px;
        // margin: 4px 2px;
        color: #999;
        
        .small-size {
          font-size: 11px;
        }
        .list1-item-img {
          margin-top: 44px;
          width: 106px;
          height: 56.5px;
          margin-right: 13px;
        }
        .list3-item-img {
          margin-top: 28px;
          height: 38.5px;
          width: 71px;
        }
        .list4-item-img {
          margin-top: 28px;
          height: 43px;
          width: 80px;
        }
        .list1-cover-img {
          width: 100%;
          height: 100%;
        }
      }
      .list3-item-content {
        // height: 113.5px;
      }
      .fixed-height3{
        height: 113.5px;
        .list3-img-box{
          height: 88.5px;
        }
        .list3-main-box{
          height: 113.5px;
        }
      }
      .fixed-height4{
        height: 113.5px;
        .top-img-box{
          height: 88.5px;
        }
        .top-main-box{
          height: 113.5px;
        }
      }
    }
    .fixed-height{
      height: 173.5px;
      .list1-img-box {
        height: 148.5px;
      }
      .list1-main-box{
        height: 173.5px;
      }
    }
    .list1-item.list4-first-item {
      .list1-item-content {
        // height: 175px;
        .list4-item-img {
          width: 157.5px;
          height: 84px;
        }
      }
      .fixed-height4{
        height: 175px;
        .top-img-box{
          height: 150px;
        }
        .top-main-box{
          height: 175px;
        }
      }
    }
  }
  .list7 {
    // padding: 0 10px;
    display: flex;
    // justify-content: center;
    // align-items: center;
    .list7-left{
      flex: 1;
      // width: 49%;
      margin-right: 2.5px;      
      
      .freeLayout7-left-casaul{
        border-top-left-radius: 18px;
        border-bottom-left-radius: 18px;
        overflow: hidden;
        // .banner-item{
        //   img{
        //     border-top-left-radius: 15px;
        //     border-bottom-left-radius: 15px;
        //   }
        // }
        .ivu-carousel-dots-inside{
          bottom: auto;
          top: 3px;
          // right: 5px;
        }
        .ivu-carousel-dots{
          text-align: right;
          padding-right: 10px;
          li{
            button{
              background: #fff;
              opacity: 1.0;
            }
          } 
          li.ivu-carousel-active{
            button.radius{
              background: #ffb119;
              width: 12px;
              border-radius: 4px;
            }
          }
        }
      }
    }
    .list7-right{
      margin-left: 2.5px;
      flex: 1;
      // width: 49%;
      // margin-top: -5px;
      height: 250px;
      display: flex;
      overflow: hidden;
      flex-direction: column; 
      border-top-right-radius: 18px;
      border-bottom-right-radius: 18px;
      .fixed-height6{        
        height: 122.5px !important;  
        margin-top: 2.5px; 
        // flex: 1;     
        .right-img-box{
          // margin-top: 5px !important;
          height: 100%;
        }
      }
      .fixed-height6:first-child{
        margin-top: 0;
        margin-bottom: 2.5px;
        // height: 122.5px !important;  
      }
    }
  } 
}
</style>
