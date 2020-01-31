<template>
  <div class="right-edit-box">
    <!-- {{data}} -->
<!-- {{index}} -->
    <!-- <div class="test-scoped">1231231</div> -->
    <!-- {{data.navigation}} -->
    <div class="right-edit-name">
      {{comName}}
      <Icon class="name-icon" type="ios-information-outline" size='14'></Icon>
    </div>
    <div class="right-edit-body" :class="{'small-padding':data.category=='productGroup'}">
      <banner-edit v-if='data.category=="banner"' :index='index'></banner-edit>
      <navigation-edit v-if='data.category=="navigation"' :index='index'></navigation-edit>
      <title-edit  v-if='data.category=="title"' :index='index'></title-edit>
      <search-edit v-if='data.category=="search"' :index='index'></search-edit>
      <address-phone-edit v-if='data.category=="addressPhone"' :index='index'></address-phone-edit>
      <rich-text-edit v-if='data.category=="richText"' :index='index'></rich-text-edit>
      <free-layout-edit v-if='data.category=="freeLayout"' :index='index'></free-layout-edit>
      <product-group-edit v-if='data.category=="productGroup"' :index='index'></product-group-edit>
      <product-edit v-if='data.category=="product"' :index='index'></product-edit>
      <notice-edit v-if='data.category=="notice"' :index='index'></notice-edit>
      <text-box-edit v-if='data.category=="text"' :index='index'></text-box-edit>
      <subline-edit v-if='data.category=="subline"' :index='index'></subline-edit>
      <sub-blank-edit v-if='data.category=="subBlank"' :index='index'></sub-blank-edit>
      <shop-info-edit v-if='data.category=="shopinfo"' :index='index'></shop-info-edit>
      <weather-edit v-if='data.category=="weather"' :index='index'></weather-edit>
      <layer-edit v-if='data.category=="layer"' :index='index'></layer-edit>
      <strategy-edit v-if='data.category=="strategy"' :index='index'></strategy-edit>
      <!-- <strategy-group-edit v-if='data.category=="strategyGroup"' :index='index'></strategy-group-edit> -->
    </div>
  </div>
</template>
<script>
import bannerEdit from "./banner/bannerEdit";
import navigationEdit from "./navigation/navigationEdit";
import titleEdit from "./title/titleEdit";
import searchEdit from "./search/searchEdit";
import addressPhoneEdit from "./addressPhone/addressPhoneEdit";
import richTextEdit from "./richText/richTextEdit";
import freeLayoutEdit from "./freeLayOut/freeLayOutEdit";
import productGroupEdit from "./productGroup/productGroupEdit";
import productEdit from "./product/productEdit";
import noticeEdit from "./notice/noticeEdit";
import textBoxEdit from "./textBox/textBoxEdit";
import sublineEdit from "./subline/sublineEdit";
import subBlankEdit from "./subBlank/subBlankEdit";
import shopInfoEdit from "./shopinfo/shopInfoEdit"
import weatherEdit from "./weather/weatherEdit"
import layerEdit from "./layer/layerEdit"
import strategyEdit from "./strategy/strategyEdit"
// import strategyGroupEdit from "./strategyGroup/strategyGroupEdit"
import { mapActions, mapState } from "vuex";
export default {
  components: {
    bannerEdit,
    navigationEdit,
    titleEdit,
    searchEdit,
    addressPhoneEdit,
    richTextEdit,
    freeLayoutEdit,
    productGroupEdit,
    productEdit,
    noticeEdit,
    textBoxEdit,
    sublineEdit,
    subBlankEdit,
    shopInfoEdit,
    weatherEdit,
    layerEdit,
    strategyEdit,
    // strategyGroupEdit
  },
  props: {
    data: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  data() {
    return {
      nameList: {
        banner: "图片广告",
        navigation: "图文导航",
        title: "标题",
        search: "搜索框",
        addressPhone: "地址电话",
        richText: "富文本",
        freeLayout: "自由布局",
        productGroup: "产品分组",
        product: "产品",
        notice: "公告",
        text: "文本",
        subline: "辅助线",
        subBlank: "辅助空白",
        shopinfo:'店招',
        strategy:'攻略',
        // strategyGroup:'攻略分组',
        layer:'广告弹框',
      }
    };
  },
  computed: {
    comName() {
      // 组件名称
      return this.nameList[this.data.category];
    }
  },
  methods: {
    ...mapActions("defined", ["del"])
  }
};
</script>
<style lang='scss'>
.right-edit-box {
  border: 1px solid rgba(215, 215, 215, 1);
  // .test-scoped{
  //   background: yellow;
  //   height: 24px;
  // }
  .blue{
    color: #3bb4f2;
  }
  .del-cover{
    display: none;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 20px;
    text-align: center;
    cursor: pointer;
    line-height: 20px;
    background: rgba(0,0,0,0.7);
    .trash-icon{
      font-size: 20px;
      color: #fff;
    }
  }
  .right-edit-name {
    background: #e4e4e4;
    height: 34px;
    line-height: 34px;
    padding-left: 10px;
  }
  .type-item {
    padding: 0 3px;
    // border: 2px solid #fff;
    height: 57px;
    line-height: 57px;
    text-align: center;
    .type-img {
      width: 100%;
      height: 57px;
    }
    .type-item-box {
      border: 2px solid #cbcbcb;
    }
  }
  .type-item7{
    line-height: 20px
  }
  .type-item.active {
    .type-item-box {
      border: 2px solid #f05b47;
    }
  }
  .notice {
    margin-top: 10px;
  }
  .img-text-list {
    .img-text-item:hover {
      .del-icon {
        display: inline-block;
      }
    }
    .img-text-item:last-child {
      margin-bottom: 0;
    }
    .img-text-item {
      padding: 5px;
      border: 1px solid rgba(215, 215, 215, 1);
      position: relative;
      margin-bottom: 12px;
      .del-icon {
        font-size: 20px;
        position: absolute;
        right: -9px;
        top: -11px;
        color: #f05b47;
        cursor: pointer;
        display: none;
      }
      .img-add {
        cursor: pointer;
        color: #3bb4f2;
        height: 56px;
        line-height: 56px;
        width: 56px;
        text-align: center;
        border: 1px solid rgba(215, 215, 215, 1);
        font-size: 14px;
        .add-icon {
          
        }
      }
      .img-add.error{
        border-color:red;
        color: red;
      }
      .img-show {
        height: 56px;
        width: 56px;
        position: relative;
        .img {
          width: 100%;
          height: 100%;
        }
        .del-cover {
          cursor: pointer;
          display: none;
          text-align: center;
          position: absolute;
          height: 20px;
          left: 0;
          right: 0;
          // top: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          .trash-icon {
            color: #fff;
            font-size: 20px;
            // padding: 5px 10px;
            // margin-top: 13px;
            cursor: pointer;
          }
          .change {
            color: #57a3f3;
          }
        }
      }
      .img-show:hover {
        .del-cover {
          display: block;
        }
      }
      .text {
        writing-mode: tb-rl;
        text-align: center;
        padding-right: 3px;
        height: 56px;
        width: 28px;
      }
      .link-text {
        width: calc(100% - 90px);
        .link {
          margin-top: 6px;
        }
      }
    }
  }
  .right-edit-body {
    padding: 10px;
    background: #fff;
  }
  .small-padding {
    padding: 5px;
  }
  .edit-table {
    width: 100%;
    td {
      padding: 5px 0;
    }
    .title {
      width: 60px;
      //   text-align: center;
      background: #fff;
      .red {
        color: red;
        vertical-align: middle;
      }
    }
  }
  .error {
    // Select
    .ivu-select-selection {
      border-color: red;
    }
    .ivu-select-placeholder {
      color: red;
    }
    .ivu-select-arrow {
      color: red;
    }
    .ivu-select-dropdown {
      .ivu-select-dropdown-list {
        .ivu-select-item {
          color: red;
        }
      }
    }
    //Input
    .ivu-input {
      border-color: red;
    }
    input.ivu-input::-webkit-input-placeholder,
    textarea::-webkit-input-placeholder {
      color: red;
    }
    input.ivu-input:-moz-placeholder,
    textarea:-moz-placeholder {
      color: red;
    }
    input.ivu-input::-moz-placeholder,
    textarea::-moz-placeholder {
      color: red;
    }
    input.ivu-input:-ms-input-placeholder,
    textarea:-ms-input-placeholder {
      color: red;
    }
  }
}
</style>
