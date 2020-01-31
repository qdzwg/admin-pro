<template>
  <div class="product-warper p-t-30">
    <div class="banner-handler">
      <Button size="small" @click="del(index)" type="error">删除</Button>
      <Button size="small" @click="productEdit(index)" type="primary">编辑</Button>
    </div>
    <div v-if="data.list.length||data.title">
      <template v-if="styleType=='Product__normal'">
        <div class="re-title">
          <i></i>
          <p>{{data.title}}</p>
          <i></i>
        </div>
        <div class="product-img-warper" v-if="data.list.length">
          <Carousel arrow='never' :radius-dot="true" autoplay>
            <CarouselItem v-for="(item,index) in data.list" :key="index">
              <div class="product-carousel">
                <!-- {{data.list}} -->
                <span class="title">{{item.businessType=='ticket'?'门票':item.businessType=='room'?"房型":item.businessType=='mdse'?'商品':item.businessType=='route'?'跟团游':item.businessType=='repast'?'餐饮':"无类型"}}</span>
                <img class="product-img" :src="item.linkMobileImg" alt="">
                <div class="product-info">
                  <div class="prodcut-detail">
                    <!-- <span v-if='item.businessType=="mdse"' class="prodcut-title">{{(item.nickName||item.name)?filter.cutstr((item.nickName||item.name),28):''}}</span>
                    <span v-else class="prodcut-title">{{item.parkNickName?filter.cutstr(item.parkNickName,28):''}}</span> -->
                    <span class="prodcut-title">{{(item.nickName||item.name)?filter.cutstr((item.nickName||item.name),28):''}}</span>
                    <div class="prodcut-price">￥
                      <span class="num" v-if="item.businessType=='repast'">{{item.priceShow?item.priceShow:''}}</span>
                      <span v-else class="num">{{item.parkPriceShow?item.parkPriceShow:''}}
                          <span class="unit"> 起/人</span>
                      </span>
                      
                    </div>
                  </div>
                  <div class="prodcut-sell">
                    <span class="nickName">{{item.subtitle?filter.cutstr(item.subtitle,30):""}}</span>
                    <span class="sell-num">已售{{item.virtualSale?item.virtualSale:item.sellNum}}份</span>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </Carousel>
        </div>
        <div v-else class="list-no-data">
          请新增产品
        </div>
      </template>
      <template v-if="styleType=='Product__normal2'">
        <div class="style2">
          <div>
            <span class="style2-name">{{data.title}}</span>
            <!-- <span class="more">更多 ></span> -->
          </div>

          <div class="product-img-warper" v-if="data.list.length">
            <Carousel arrow='never' :radius-dot="true" autoplay>
              <CarouselItem v-for="(item,index) in data.list" :key="index">
                <div class="product-carousel">
                  <span class="num2" v-if="item.businessType=='repast'">￥{{item.priceShow?item.priceShow:''}}起</span>
                  <span class="num2" v-else>￥{{item.parkPriceShow?item.parkPriceShow:''}}起</span>
                  <!-- {{index}} -->
                  <!-- <span class="title">{{item.businessType=='ticket'?'门票':item.businessType=='room'?"房型":item.businessType=='mdse'?'商品':"无类型"}}</span> -->
                  <img class="product-img" :src="item.linkMobileImg" alt="">
                  <div class="product-info">
                    <span v-if='item.businessType=="mdse"||item.businessType=="repast"' class="prodcut-title">{{(item.nickName||item.name)?filter.cutstr((item.nickName||item.name),28):''}}</span>
                    <span v-else class="prodcut-title">{{item.parkNickName?filter.cutstr(item.parkNickName,28):''}}</span>
                    <div class="item-nick-name">{{item.content?filter.removeHtmlTag(item.content,30):""}}</div>
                  </div>
                </div>
              </CarouselItem>
            </Carousel>
          </div>
          <div v-else class="list-no-data">
            请新增产品
          </div>
        </div>
      </template>
    </div>
    <div v-else class="product-no-data">
      请编辑产品信息
    </div>

    <div class="add-notice" v-if="!defaultImgList.length">
      <div>请新增轮播图片</div>
      <div>
        最多上传5张
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
    },
    styleType: {
      type: String
    }
  },
  computed: {
    imgList() {
      return this.data;
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
  methods: {
    del(index) {
      this.$emit("delteCom", index);
    },
    productEdit(index) {
      this.$emit("showProductEdit", index);
      this.$store.dispatch("setIndex", index);
    }
  }
};
</script>
<style lang="scss">
.product-carousel {
  position: relative;
  .num2 {
    position: absolute;
    bottom: 60px;
    left: 15px;
    padding: 2px 10px;
    border-radius: 2px;
    color: #fff;
    background: #f9692c;
  }
  img.product-img {
    width: 100%;
    height: 156px;
  }
  .title {
    position: absolute;
    top: 12px;
    left: 12px;
    background: #94cb66;
    padding: 3px 5px;
    display: inline-block;
    padding: 1px 10px;
    border-radius: 15px;
    border: 1px solid #fff;
  }
}
.product-img-warper {
  .ivu-carousel-dots.ivu-carousel-dots-inside {
    left: 155px !important;
    bottom: 65px !important;
    li {
      button {
        padding: 3px;
      }
    }
    li.ivu-carousel-active {
      button {
        background: #94cb66;
      }
    }
  }
}

.re-title {
  text-align: center;
  height: 42px;
  line-height: 42px;
  p {
    display: inline-block;
    padding: 0 8px;
    font-weight: 600;
    color: #000;
    font-size: 16px;
  }
  i {
    width: 42px;
    height: 2px;
    vertical-align: middle;
    background: #90c656;
    display: inline-block;
  }
}
.product-info {
  padding: 0px 17px;
  padding-right: 25px;
  .item-nick-name {
    font-size: 10px;
    color: #999;
  }
  .prodcut-detail {
    overflow: auto;
    .prodcut-title {
      color: #333;
      font-size: 14px;
      float: left;
      margin-top: 7px;
    }
    .prodcut-price {
      float: right;
      color: #f9692c;
      font-size: 10px;
      .num {
        font-size: 22px;
         .unit {
        font-size: 12px;
        color: #999;
      }
      }
     
    }
  }
  .prodcut-sell {
    .sell-num {
      color: #999;
      font-size: 10px;
      float: right;
    }
    .nickName {
      float: left;
      color: #999;
      font-size: 10px;
    }
  }
}

.product-no-data {
  height: 244px;
  background: #cccccc;
  text-align: center;
  line-height: 244px;
  font-size: 18px;
}
.list-no-data {
  height: 244px;
  background: #cccccc;
  text-align: center;
  line-height: 202px;
  font-size: 18px;
}
.style2 {
  .style2-name {
    display: inline-block;
    margin-bottom: 8px;
    padding-left: 8px;
    margin-left: 15px;
    border-left: 4px solid #3f98f6;
    color: #000;
    font-size: 16px;
  }
  .more {
    float: right;
    color: #999;
    margin-top: 5px;
    margin-right: 5px;
  }
  .item-name {
    color: #333;
    font-size: 14px;
  }
}
</style>
