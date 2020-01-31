<template>
  <div class="product-show-box" :class='{"product-slide-box":data.listType=="type3"}'>
    <!-- {{data}} -->
    
    <div :class='{"product-slide-warper":data.listType=="type3"}' :style='{width:(data.listType=="type3"&&data.list&&data.list.length)?(data.list.length*170 + "px"):"100%"}'>
      <template v-if='data.list&&data.list.length'>
          <template>
            <div v-for='(item,index) in data.list' :key='index' class="product-item" :class='{"two-col":data.listType=="type2"}'>
              <div class="product-content">
                <img class="tag-img" v-if='data.productTag=="type3"' style='top:-1px;left:-1px' src="./../../../../assets/images/product1.png" alt="">
                <img class="tag-img" v-if='data.productTag=="type2"' src="./../../../../assets/images/product2.png" alt="">
                <img class="tag-img" v-if='data.productTag=="type1"' src="./../../../../assets/images/product3.png" alt="">
                <img class="tag-img" v-if='data.productTag=="fine"' src="./../../../../assets/images/product5.png" alt="">
                <template v-if='data.productTag=="type4"'>
                  <img class="tag-img" v-if='data.tagUrl' :src="data.tagUrl" alt="">
                  <img class="tag-img" v-else src="./../../../../assets/images/product4.png" alt="">
                </template>

              <div class="product-img">
                <img class="cover-img" :class="{'b-r-3':data.imgStyle=='fillet'}" v-if="data.imgArr && data.imgArr.length && data.imgArr[index]" :src="data.imgArr[index]" alt="">
                <img class="cover-img" :class="{'b-r-3':data.imgStyle=='fillet'}"  v-else :src="item.linkMobileImg" alt="">
              </div>
              <div class="product-name">
               
                <template v-if="item.businessType=='mdse'||item.businessType=='route'||item.businessType=='theater'">
                     <template v-if="item.businessType=='mdse'||item.businessType=='theater'">
                       {{(item.nickName||item.name)?(item.nickName||item.name):''}}
                     </template>
                      <template v-else>
                       {{item.parkNickName}}
                     </template>
                </template>
                <template v-else>
                  <template v-if="data.textType.length==2">
                    【{{item.parkNickName}}】{{(item.nickName||item.name)?(item.nickName||item.name):''}}
                  </template>
                  <template v-if="data.textType.length==0">
                      {{(item.nickName||item.name)?(item.nickName||item.name):''}}
                  </template>
                  <template v-if="data.textType.length==1&&data.textType=='mdseName'">
                      【{{item.parkNickName}}】
                  </template>
                  <template v-if="data.textType.length==1&&data.textType=='productName'">
                      {{(item.nickName||item.name)?(item.nickName||item.name):''}}
                  </template>
                
                </template>
              </div>
              <div class="product-price clearfix">
                <span class='fl tag-title' v-if='data.textTagList&&data.textTagList.length&&data.textTagList[index]&&data.textTagList[index].tagTitle'>{{data.textTagList[index].tagTitle}}</span>
                <span class='price-bar' :class="{'fr':data.textTagList&&data.textTagList.length&&data.textTagList[index]&&data.textTagList[index].tagTitle}">
                 <span style="font-size:18px" v-if="item.businessType=='route'||item.businessType=='theater'">                    
                    <span class='unit'>￥</span>{{(item.parkPriceShow||item.parkPriceShow==0)?item.parkPriceShow:''}} <span class='price-txt'>起</span>
                    <span class="sellNum fr">已售{{item.sellNum>10000?(item.sellNum/10000)+'万':item.sellNum}}</span>
                 </span>
                  <template v-else>
                    <div class="clearfix">
                      <span :class="{'op-0':!(item.priceShow||item.priceShow==0)}"  style="font-size:18px; float:left; color: #f01026" >
                        <span class='unit'>￥</span>
                        {{(item.priceShow||item.priceShow==0)?item.priceShow:''}}
                        <span class='price-txt'>起</span>
                      </span>
                      <span class="sellNum fr">已售{{item.sellNum>10000?(item.sellNum/10000)+'万':item.sellNum}}</span>
                    </div>                    
                  </template>         
                </span>
              </div>
            </div>
          </div>
        </template>
      </template>
<template v-else>
  <template v-if='data.listType=="type1"'>
            <div class="no-list">
              <div class="no-product">
                <img class="tag-img" v-if='data.productTag=="type3"' style='top:-1px;left:-1px' src="./../../../../assets/images/product1.png" alt="">
                <img class="tag-img" v-if='data.productTag=="type2"' src="./../../../../assets/images/product2.png" alt="">
                <img class="tag-img" v-if='data.productTag=="type1"' src="./../../../../assets/images/product3.png" alt="">
                <img class="tag-img" v-if='data.productTag=="fine"' src="./../../../../assets/images/product5.png" alt="">
                <template v-if='data.productTag=="type4"'>
                  <img class="tag-img" v-if='data.tagUrl' :src="data.tagUrl" alt="">
                  <img class="tag-img" v-else src="./../../../../assets/images/product4.png" alt="">
</template>
              <div class="product-img">
                <img class="img" src="./../../../../assets/images/mdsedefault.png" alt="">
                <div class="add-notice">请在右侧添加商品</div>
              </div>
              <div class="product-name">
                此处显示产品名称
              </div>
              <div class="product-price">

              </div>
            </div>
          </div>
        </template>
<template v-if='data.listType=="type2"'>
  <div class="clearfix">
    <div class="no-list type2-list fl">
      <div class="no-product">
        <img class="tag-img" v-if='data.productTag=="type3"' style='top:-1px;left:-1px' src="./../../../../assets/images/product1.png" alt="">
        <img class="tag-img" v-if='data.productTag=="type2"' src="./../../../../assets/images/product2.png" alt="">
        <img class="tag-img" v-if='data.productTag=="type1"' src="./../../../../assets/images/product3.png" alt="">
        <img class="tag-img" v-if='data.productTag=="fine"' src="./../../../../assets/images/product5.png" alt="">
        <template v-if='data.productTag=="type4"'>
                    <img class="tag-img" v-if='data.tagUrl' :src="data.tagUrl" alt="">
                    <img class="tag-img" v-else src="./../../../../assets/images/product4.png" alt="">
</template>
                <div class="product-img">
                  <img class="img" src="./../../../../assets/images/mdsedefault.png" alt="">
                  <div class="add-notice">请在右侧添加商品</div>
                </div>
                <div class="product-name">
                  此处显示产品名称
                </div>
                <div class="product-price">

                </div>
              </div>
            </div>
            <div class="no-list type2-list fl">
              <div class="no-product">
                <img class="tag-img" v-if='data.productTag=="type3"' style='top:-1px;left:-1px' src="./../../../../assets/images/product1.png" alt="">
                <img class="tag-img" v-if='data.productTag=="type2"' src="./../../../../assets/images/product2.png" alt="">
                <img class="tag-img" v-if='data.productTag=="type1"' src="./../../../../assets/images/product3.png" alt="">
                <img class="tag-img" v-if='data.productTag=="fine"' src="./../../../../assets/images/product5.png" alt="">
<template v-if='data.productTag=="type4"'>
  <img class="tag-img" v-if='data.tagUrl' :src="data.tagUrl" alt="">
  <img class="tag-img" v-else src="./../../../../assets/images/product4.png" alt="">
</template>
                <div class="product-img">
                  <img class="img" src="./../../../../assets/images/mdsedefault.png" alt="">
                  <div class="add-notice">请在右侧添加商品</div>
                </div>
                <div class="product-name">
                  此处显示产品名称
                </div>
                <div class="product-price">

                </div>
              </div>
            </div>
          </div>
        </template>
<template v-if='data.listType=="type3"'>
  <div style="overflow:hidden">
    <div class="clearfix type3-list-content" style='width:700px;'>
      <div class="no-list type3-list fl">
        <div class="no-product">
          <img class="tag-img" v-if='data.productTag=="type3"' style='top:-1px;left:-1px' src="./../../../../assets/images/product1.png" alt="">
          <img class="tag-img" v-if='data.productTag=="type2"' src="./../../../../assets/images/product2.png" alt="">
          <img class="tag-img" v-if='data.productTag=="type1"' src="./../../../../assets/images/product3.png" alt="">
          <img class="tag-img" v-if='data.productTag=="fine"' src="./../../../../assets/images/product5.png" alt="">
          <template v-if='data.productTag=="type4"'>
                      <img class="tag-img" v-if='data.tagUrl' :src="data.tagUrl" alt="">
                      <img class="tag-img" v-else src="./../../../../assets/images/product4.png" alt="">
</template>
                  <div class="product-img">
                    <img class="img" src="./../../../../assets/images/mdsedefault.png" alt="">
                    <div class="add-notice">请在右侧添加商品</div>
                  </div>
                  <div class="product-name">
                    此处显示产品名称
                  </div>
                  <div class="product-price">

                  </div>
                </div>
              </div>
              <div class="no-list type3-list fl">
                <div class="no-product">
                  <img class="tag-img" v-if='data.productTag=="type3"' style='top:-1px;left:-1px' src="./../../../../assets/images/product1.png" alt="">
                  <img class="tag-img" v-if='data.productTag=="type2"' src="./../../../../assets/images/product2.png" alt="">
                  <img class="tag-img" v-if='data.productTag=="type1"' src="./../../../../assets/images/product3.png" alt="">
                  <img class="tag-img" v-if='data.productTag=="fine"' src="./../../../../assets/images/product5.png" alt="">
<template v-if='data.productTag=="type4"'>
  <img class="tag-img" v-if='data.tagUrl' :src="data.tagUrl" alt="">
  <img class="tag-img" v-else src="./../../../../assets/images/product4.png" alt="">
</template>
                  <div class="product-img">
                    <img class="img" src="./../../../../assets/images/mdsedefault.png" alt="">
                    <div class="add-notice">请在右侧添加商品</div>
                  </div>
                  <div class="product-name">
                    此处显示产品名称
                  </div>
                  <div class="product-price">

                  </div>
                </div>
              </div>
              <div class="no-list type3-list fl">
                <div class="no-product">
                  <img class="tag-img" v-if='data.productTag=="type3"' style='top:-1px;left:-1px' src="./../../../../assets/images/product1.png" alt="">
                  <img class="tag-img" v-if='data.productTag=="type2"' src="./../../../../assets/images/product2.png" alt="">
                  <img class="tag-img" v-if='data.productTag=="type1"' src="./../../../../assets/images/product3.png" alt="">
                  <img class="tag-img" v-if='data.productTag=="fine"' src="./../../../../assets/images/product5.png" alt="">
<template v-if='data.productTag=="type4"'>
  <img class="tag-img" v-if='data.tagUrl' :src="data.tagUrl" alt="">
  <img class="tag-img" v-else src="./../../../../assets/images/product4.png" alt="">
</template>
                  <div class="product-img">
                    <img class="img" src="./../../../../assets/images/mdsedefault.png" alt="">
                    <div class="add-notice">请在右侧添加商品</div>
                  </div>
                  <div class="product-name">
                    此处显示产品名称
                  </div>
                  <div class="product-price">

                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
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
    computed: {
      widthNum() {
        return this.data.list && this.data.list.length ?
          24 / this.data.list.length :
          null;
      }
    },
    data() {
      return {
        editIndex: 0,
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
    methods: {
      changeIndex(index) {
        this.editIndex = index;
      }
    }
  };
</script>
<style lang="scss">
  .product-show-box.product-slide-box {
    // width: 100%;
    height: 187.5px;
    overflow: hidden;
    .product-slide-warper {
      .product-item {
        display: inline-block;
        height: 187.5px;
        .product-content {
          height: 110px;
          width: 161px;
          .tag-img {
            width: 30px;
            height: 30px;
          }
          .product-img {
            height: 110px;
            width: 161px;
            .cover-img {}
          }
          .product-name {
            
          }
        }
      }
    }
  }
  .product-show-box {
    .product-item {
      padding: 8px 4px;
      background: #fff;
      height: 250px;
      text-align: center;
      .product-content {
        position: relative;
        .tag-img {
          left: 7px;
          top: 7px;
          position: absolute;
          height: 41px;
          width: 41px;
        }
        .user-define-tag {
          left: 0px;
          top: 0px;
          position: absolute;
          padding: 7px 13px;
          border: 1px dotted #999;
          color: #999;
          font-size: 12px;
        }
        .product-img {
          height: 174px;
          .cover-img {
            width: 100%;
            height: 100%;
            &.b-r-3{
              border-radius: 3px;
            }
          }
        }
        .product-name {
          text-align: left;
          font-size: 14px;
          color: #333;
          padding: 0 3px;
          height: 24px;
          line-height: 24px; // background: #f9f9f9;
          margin-top: 8px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        .product-price {
          margin-top: 10px;
          // width: 67.5px;
          // height: 17px; // background: #f9f9f9;
          padding: 0 3px;
          text-align: left;
          color: #999;
          // overflow: hidden;
          // text-overflow: ellipsis;
          // white-space: nowrap;
          .price-bar{
            color:#f63;
            .op-0{
              opacity: 0;
            }
            .unit{
              font-size: 11px;
            }
            .price-txt{
              font-size: 11px;
              color: #666;
            }
            .sellNum{
              font-size: 12px;
              color: #999;
              height: 27px;
              line-height: 27px;
            }
          }
          .tag-title{
            margin-top: 5px;
            height: 18px;
            line-height: 18px;
            padding: 0 5px;
            background: #ecf4f6;
            color: #4993a5;
            font-size: 10px;
          }
        }
      }
    }
    .product-item.two-col {
      display: inline-block;
      width: 50%;
      .product-content {
        .tag-img {
          width: 30px;
          height: 30px;
        }
      }
    }
    .no-list.type2-list {
      width: 50%;
      display: inline-block;
      .no-product {
        .product-img {
          .img {
            width: 106px;
            height: 56.5px;
            margin-right: 13px;
            margin-top: 48px;
          }
        }
        .tag-img {
          height: 30px;
          width: 30px;
        }
      }
    }
    .type3-list-content {
      height: 187.5px;
    }
    .no-list.type3-list {
      height: 187.5px;
      display: inline-block;
      .no-product {
        .product-img {
          width: 161px;
          height: 110px;
          .img {
            width: 106px;
            height: 56.5px;
            margin-right: 13px;
            margin-top: 20px;
          }
        }
        .tag-img {
          height: 30px;
          width: 30px;
        }
      }
    }
    .no-list {
      padding: 8px 4px;
      background: #fff;
      height: 250px;
      text-align: center;
      .no-product {
        position: relative;
        .tag-img {
          left: 7px;
          top: 7px;
          position: absolute;
          height: 41px;
          width: 41px;
        }
        .product-img {
          height: 174px;
          background: #f9f9f9;
          .img {
            width: 174px;
            height: 93px;
            margin-right: 21px;
            margin-top: 30px;
          }
          .add-notice {
            font-size: 13px;
            color: #999;
          }
        }
        .product-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
          font-size: 12px;
          color: #999;
          padding-left: 10px;
          height: 24px;
          line-height: 24px;
          background: #f9f9f9;
          margin-top: 8px;
        }
        .product-price {
          margin-top: 10px;
          width: 67.5px;
          height: 17px;
          background: #f9f9f9;
          padding-left: 10px;
        }
      }
      .no-product-type2 {
        width: 50%;
        display: inline-block;
      }
    }
  }
</style>
