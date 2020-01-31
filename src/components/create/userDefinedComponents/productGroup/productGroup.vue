<template>
  <div class="productgroup-show-box">
    <!-- {{data.list}} -->
    <template v-if="data.list&&data.list.length">
      <template v-if="data.type=='productGroup1'">
        <Row class="menu-list">
          <Col
            class="menu-item"
            v-for="(item,index) in data.list"
            :key="index"
            :class="{'no-padding':data.menuType=='type2'}"
            :style="{width: ((1/data.list.length)*100+'%')}"
          >
            <template v-if="data.menuType=='type1'">
              <div
                class="menu-item-content"
                @click="changeIndex(index)"
                :class="{'active':editIndex==index}"
              >{{item.groupName?item.groupName:'默认名称'}}</div>
            </template>
            <template v-if="data.menuType=='type2'">
              <div
                class="menu-item-content"
                :class="{'type2-active':editIndex==index}"
                @click="changeIndex(index)"
              >{{item.groupName?item.groupName:'默认名称'}}</div>
              <div v-if="editIndex==index" class="test"></div>
            </template>
            <template v-if="data.menuType=='type3'">
              <div
                class="menu-item-content menu3-type"
                :class="{'type3-active':editIndex==index}"
                @click="changeIndex(index)"
              >
                <div class="menu-item-name">{{item.groupName?item.groupName:'默认名称'}}</div>
              </div>
            </template>
            <template v-if="data.menuType=='type4'">
              <div
                class="menu-item-content menu4-type"
                :class="{'type4-active':editIndex==index}"
                @click="changeIndex(index)"                
              >
                <div class="menu-item-name">
                  <div class="name-span">
                    <span class="name-name">{{item.groupName?item.groupName:'默认名称'}}</span>
                    <span v-if="data.menuBgUrl && editIndex==index" class="selected-bg">
                      <img :src="data.menuBgUrl" alt="">
                    </span>
                  </div>
                  <span class="sub-title" v-if="item.subTitle">{{item.subTitle}}</span>                  
                </div>   
              </div>
            </template>
          </Col>
        </Row>
        <Row class="data-list">
          <Col
            v-for="(item,index) in data.list"
            :key="index"
            v-show="editIndex==index"
            span="24"
            :class="{'product-slide-box':data.listType=='type3'}"
          >
            <!-- {{data.list.length}} -->
            <div
              :style="{width:(data.listType=='type3'&&item.data&&item.data.length)?(item.data.length*190 + 'px'):'100%'}"
              class="productgroup-ul clearfix"
            >
              <div
                v-for="(it,i) in item.data"
                :key="i"
                class="productgroup-li"
                :class="{'productgroup-li2':data.listType=='type2','productgroup-li3':data.listType=='type3'}"
              >
                <div class="productgroup-img-box">
                  <img
                    :class="{'img-raduis':data.imgStyle&&data.imgStyle=='fillet', 'img-raduis2': data.imgStyle&&data.imgStyle=='halfFillet'}"
                    class="productgroup-li-img"
                    v-if="item.imgArr instanceof Array && item.imgArr[i]"
                    :src="item.imgArr[i]"
                    alt
                  />
                  <img
                    class="productgroup-li-img"
                    :class="{'img-raduis':data.imgStyle&&data.imgStyle=='fillet', 'img-raduis2': data.imgStyle&&data.imgStyle=='halfFillet'}"
                    v-else
                    :src="it.linkMobileImg"
                    alt
                  />
                  
                </div>
                <div style="width:100%" class="productgroup-li-name">
                  <template
                    v-if="it.businessType=='mdse'||it.businessType=='route'||it.businessType=='theater'"
                  >
                    <template
                      v-if="it.businessType=='mdse'||it.businessType=='theater'"
                    >{{(it.nickName||it.name)?(it.nickName||it.name):''}}</template>
                    <template v-else>{{it.parkNickName}}</template>
                  </template>
                  <template v-else>
                    <template
                      v-if="data.textType.length==2"
                    >【{{it.parkNickName}}】{{(it.nickName||it.name)?(it.nickName||it.name):''}}</template>
                    <template
                      v-if="data.textType.length==0"
                    >{{(it.nickName||it.name)?(it.nickName||it.name):''}}</template>
                    <template
                      v-if="data.textType.length==1&&data.textType=='mdseName'"
                    >【{{it.parkNickName}}】</template>
                    <template
                      v-if="data.textType.length==1&&data.textType=='productName'"
                    >{{(it.nickName||it.name)?(it.nickName||it.name):''}}</template>
                  </template>
                </div>
                <div class="productgroup-li-type">
                  <span>{{filter.productTypes(it.businessType)}}</span>
                </div>
                <div class="productgroup-li-price clearfix">
                  <span
                    class="fl tag-title"
                    v-if="item.textTagList&&item.textTagList[i]&&item.textTagList[i].tagTitle"
                  >{{item.textTagList[i].tagTitle}}</span>
                  <div
                    style="font-size:14px;color:#f01026"
                    :class="{'fr':item.textTagList&&item.textTagList[i]&&item.textTagList[i].tagTitle}"
                    class="price-bar"
                  >
                    <span
                      class
                      style="font-size:18px"
                      v-if="it.businessType=='route'||it.businessType=='theater'"
                      :class="{'op-0':!(it.parkPriceShow||it.parkPriceShow==0)}"
                    >
                      <span class="unit">￥</span>
                      {{(it.parkPriceShow||it.parkPriceShow==0)?it.parkPriceShow:''}}
                      <span
                        class="price-txt"
                      >起</span>
                      <span class="sellNum fr">已售{{it.sellNum>10000?(it.sellNum/10000)+'万':it.sellNum}}</span>
                    </span>
                    <span
                      style="font-size:18px"
                      :class="{'op-0':!(it.priceShow||it.priceShow==0)}"
                      v-else
                    >
                      <span class="unit">￥</span>
                      {{(it.priceShow||it.priceShow==0)?it.priceShow:''}}
                      <span
                        class="price-txt"
                      >起</span>
                      <span class="sellNum fr">已售{{it.sellNum>10000?(it.sellNum/10000)+'万':it.sellNum}}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </template>
      <template v-if="data.type=='productGroup2'">
        <div class="productGroup2-box clearfix">
          <div class="productGroup2-box-left fl">
            <ul class="menu-ul">
              <li
                v-for="(item,index) in data.list"
                :key="index"
                class="menu-li"
                @click="changeIndex(index)"
                :class="{'active':editIndex==index,'menu-li-type2':data.menuType=='type2','menu-li-type3':data.menuType=='type3'}"
              >
                <div
                  style=" -webkit-box-orient: vertical;"
                  class="menu-li-name"
                >{{item.groupName?item.groupName:'默认名称'}}</div>
              </li>
            </ul>
          </div>
          <div class="productGroup2-box-right fr">
            <div
              v-for="(item,index) in data.list"
              :key="index"
              v-show="editIndex==index"
              class="right-list-item"
            >
              <div
                class="title"
                :class="{'title-none':index==editIndex&&data.menuType=='type3'}"
              >{{item.groupName}}</div>
              <template v-if="item.data&&item.data.length">
                <div v-for="(it,i) in item.data" :key="i" class="right-list-content clearfix">
                  <div
                    class="fl img-box"
                    :style="{ 'background': it.linkMobileImg?'transparent':'#f9f9f9'}"
                  >
                    <template
                      v-if="(item.imgArr instanceof Array && item.imgArr[i])||it.linkMobileImg"
                    >
                      <img
                        :class="{'img-raduis':data.imgStyle&&data.imgStyle=='fillet', 'img-raduis2': data.imgStyle&&data.imgStyle=='halfFillet'}"
                        class="showImg"
                        v-if="item.imgArr instanceof Array && item.imgArr[i]"
                        :src="item.imgArr[i]"
                        alt
                      />
                      <template v-else>
                        <img
                          class="showImg"
                          :class="{'img-raduis':data.imgStyle&&data.imgStyle=='fillet', 'img-raduis2': data.imgStyle&&data.imgStyle=='halfFillet'}"
                          v-if="it.linkMobileImg"
                          :src="it.linkMobileImg"
                          alt
                        />
                      </template>
                    </template>
                    <template v-else>
                      <img class="right-img" src="./../../../../assets/images/mdsedefault.png" alt />
                      <div class="noimg-notice">图片空缺中</div>
                    </template>
                  </div>
                  <div class="name-content fr">
                    <div style="background:transparent" class="name">{{it.nickName}}</div>
                    <div class="price-bar clearfix" style="margin-top:16px">
                      <span
                        class="fl tag-title"
                        v-if="item.textTagList&&item.textTagList[i]&&item.textTagList[i].tagTitle"
                      >{{item.textTagList[i].tagTitle}}</span>
                      <div
                        :class="{'fr':item.textTagList&&item.textTagList[i]&&item.textTagList[i].tagTitle}"
                        style="color:#f63;font-size:14px"
                      >
                        <span
                          :class="{'op-0':!(it.parkPriceShow||it.parkPriceShow==0)}"
                          style="font-size:18px"
                          v-if="it.businessType=='route'||it.businessType=='theater'"
                        >
                          <span class="unit">￥</span>
                          {{(it.parkPriceShow||it.parkPriceShow==0)?it.parkPriceShow:''}}
                          <span
                            class="price-txt"
                          >起</span>
                          <span class="sellNum fr">已售{{it.sellNum>10000?(it.sellNum/10000)+'万':it.sellNum}}</span>
                        </span>
                        <span
                          :class="{'op-0':!(it.priceShow||it.priceShow==0)}"
                          style="font-size:18px"
                          v-else
                        >
                          <span class="unit">￥</span>
                          {{(it.priceShow||it.priceShow==0)?it.priceShow:''}}
                          <span
                            class="price-txt"
                          >起</span>
                          <span class="sellNum fr">已售{{item.sellNum>10000?(item.sellNum/10000)+'万':item.sellNum}}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="right-list-content clearfix">
                  <div class="fl img-box">
                    <img class="right-img" src="./../../../../assets/images/mdsedefault.png" alt />
                    <div class="noimg-notice">图片空缺中</div>
                  </div>
                  <div class="name-content fr">
                    <div class="name">此处显示产品名称</div>
                  </div>
                </div>
                <div class="right-list-content clearfix">
                  <div class="fl img-box">
                    <img class="right-img" src="./../../../../assets/images/mdsedefault.png" alt />
                    <div class="noimg-notice">图片空缺中</div>
                  </div>
                  <div class="name-content fr">
                    <div class="name">此处显示产品名称</div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>
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
  computed: {
    widthNum() {
      return this.data.list && this.data.list.length
        ? 24 / this.data.list.length
        : null;
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
.productgroup-show-box {
  .productGroup2-box {
    .productGroup2-box-right {
      width: 299px;
      max-height: 425px;
      overflow: hidden;
      .right-list-item {
        border-radius: 9px;
        background: #fff;
        margin-bottom: 10px;
        .title {
          height: 41.5px;
          line-height: 41.5px;
          font-size: 12px;
          color: #999;
          padding-left: 10px;
          border-bottom: 1px solid #eeeee7;
        }
        .title.title-none {
          display: none;
        }
        .right-list-content {
          padding: 15px 10px;
          .img-box {
            width: 105px;
            height: 68px;
            background: #f9f9f9;
            text-align: center;
            .right-img {
              margin-top: 10px;
              height: 30px;
              width: 53px;
            }
            .noimg-notice {
              font-size: 10px;
              color: #999;
            }
            .showImg {
              width: 100%;
              height: 100%;
              &.img-raduis{
                border-radius: 3px;
              }
              &.img-raduis2{
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
              }
            }
          }

          .name-content {
            width: 160px;
            height: 68px;
            position: relative;
            .price-bar {
              .tag-title {
                margin-top: 5px;
                height: 18px;
                line-height: 18px;
                padding: 0 5px;
                background: #ecf4f6;
                color: #4993a5;
                font-size: 10px;
              }
              .op-0 {
                opacity: 0;
              }
              .unit {
                font-size: 11px;
              }
              .price-txt {
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
            .name {
              background: #f9f9f9;
              padding-left: 10px;
              height: 24px;
              line-height: 24px;
              font-size: 14px;
              color: #333;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .add-svg {
              position: absolute;
              right: 0;
              bottom: 0;
              font-size: 16px;
              color: #f05b47;
            }
          }
        }
      }
      .right-list-item:last-child {
        margin-bottom: 0;
      }
    }
    .productGroup2-box-left {
      .menu-ul {
        background: #fff;
        list-style: none;
        .menu-li {
          text-align: left;
          width: 66px;
          height: 48px;
          // line-height: 41px;
          padding: 0 7px;
          border-bottom: 1px solid #eeeee7;
          display: flex;
          display: -webkit-flex;
          align-items: center;
          -webkit-align-items: center;
          color: #999;
          .menu-li-name {
            margin-top: 2px;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-wrap: break-word;
            word-break: normal;
            line-height: 15px;
          }
        }
        .menu-li.active {
          background: #f05b47;
          color: #fff;
        }
        .menu-li.menu-li-type2 {
          background: #fff;
          color: #999;
          position: relative;
        }
        .menu-li.menu-li-type2.active {
          color: #413838;
        }
        .menu-li.menu-li-type2.active::after {
          content: "";
          position: absolute;
          top: 6px;
          bottom: 6px;
          right: 0;
          width: 3px;
          background: #f05b47;
        }
        .menu-li.menu-li-type3 {
          background: #fff;
          color: #999;
          position: relative;
        }
        .menu-li.menu-li-type3.active {
          color: #413838;
        }
        .menu-li.menu-li-type3.active::after {
          content: "";
          position: absolute;
          top: 0px;
          bottom: 0px;
          right: -10px;
          width: 10px;
          background: #fff;
        }
        .menu-li:last-child {
          border-bottom: none;
        }
      }
    }
  }
  // margin: 15px 0;
  .data-list {
    .product-slide-box {
      overflow: hidden;
    }
    .productgroup-ul {
      .productgroup-li {
        padding: 8px 4px;
        background: #fff;
        // height: 250px;
        height: 280px;
        text-align: center;
        .productgroup-img-box {
          height: 174px;
          .productgroup-li-img {
            width: 100%;
            height: 100%;
            &.img-raduis{
              border-radius: 3px;
            }
            &.img-raduis2{
              border-top-left-radius: 5px;
              border-top-right-radius: 5px;
            }
          }
        }
        .productgroup-li-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
          font-size: 14px;
          color: #333;
          padding: 0 10px;
          height: 24px;
          line-height: 24px;
          margin-top: 8px;
        }
        .productgroup-li-type{
          height: 25px;
          line-height: 25px;
          margin-top: 5px;
          text-align: left;
          span{
            // display: block;
            background-color: rgba(247,65,108,0.1);
            padding: 3px 12px;
            margin-left: 3px;
            color: #f32645;
            border-radius: 7px;
            font-size: 12px;
          }
        }
        .productgroup-li-price {
          margin-top: 10px;
          // width: 67.5px;
          // height: 17px; // background: #f9f9f9;
          padding: 0 3px;
          text-align: left;
          color: #999;
          // overflow: hidden;
          // text-overflow: ellipsis;
          // white-space: nowrap;
          .price-bar {
            color: #f63;
            .op-0 {
              opacity: 0;
            }
            .unit {
              font-size: 11px;
            }
            .price-txt {
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
          .tag-title {
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
      .productgroup-li.productgroup-li2 {
        //  display: inline-block;
        width: 50%;
        float: left;
      }
      .productgroup-li.productgroup-li3 {
        display: inline-block;
        height: 187.5px;
        width: 169px;
        float: left;
        .productgroup-img-box {
          height: 110px;
          width: 161px;
        }
      }
    }
  }
  .menu-list {
    background: #fff;
    .menu-item.no-padding {
      padding: 0;
    }
    .menu-item {
      text-align: center;
      display: inline-block;
      .menu-item-content {
        width: 72px;
        margin: 0 auto;
        text-align: center;
        position: relative;
        height: 49px;
        line-height: 49px;
        font-size: 14px;
        color: #413838;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .menu-item-content.active {
        color: #f05b47;
      }
      .menu-item-content.active::after {
        position: absolute;
        left: 0;
        bottom: 0px;
        content: "";
        width: 100%;
        height: 2px;
        background: #f05b47;
        border-radius: 1px;
      }
      .menu-item-content.type2-active {
        background: #f05b47;
        color: #fff;
      }
      .test {
        z-index: 100;
        position: absolute;
        left: 50%;
        margin-left: -2px;
        width: 4.25px;
        height: 4.25px;
        border-left: 4.25px solid transparent;
        border-right: 4.25px solid transparent;
        border-top: 4.25px solid #f05b47;
        border-bottom: 4.25px solid transparent;
      }
      .menu-item-content.menu3-type {
        padding: 6px 0;
        .menu-item-name {
          height: 37px;
          line-height: 37px;
          // display: inline-block;
          // border-radius: 50%;
        }
      }
      .menu-item-content.menu3-type.type3-active {
        .menu-item-name {
          // background: #f05b47;
          color: #fff;
          border-radius: 18.5px;
          display: block;
          width: 100%;
          text-align: center;
        }
      }
      .menu-item-content.menu4-type {
        padding: 6px 0;
        .menu-item-name {
          // height: 37px;
          line-height: 20px;
          // position: relative;
          .name-span{
            position: relative;
            padding-top: 5px;
            .name-name{
              position: relative;
              z-index: 2;
            }
            .selected-bg{
              display: block;
              position: absolute;
              top: 0;
              right: 5px;
              z-index: 1;
              width: 25px;
              height: 25px;
              img{
                display: block;
                width: 100%;
                height: 100%;
              }
            }
          }       
          .sub-title {
            font-size: 12px;
            display: block;
            color:#999;
          }
        }
      }
      .menu-item-content.menu4-type.type4-active {
        font-size: 16px;
        .menu-item-name {
          // background: #f05b47;
          // color: #fff;
          // border-radius: 18.5px;
          display: block;
          width: 100%;
          text-align: center;
          
        }
      }
    }
  }
}
</style>
