<template>
  <div>
    <!-- <div>
       <div contenteditable="true" style="width:150px;height:250px;border:1px solid red">
         <button contenteditable="false">asdasda</button>
       </div>
    </div> -->
    <!-- {{componentList}} -->
    <Row>
      <Col span="12" class="indexDefined">
      <component-header ref="header"></component-header>
      <div class="componentList" :class="{ havePaddingTop: nopadding,'handler-none':!nopadding }">
        <draggable element="div" @end="onEnd" v-model="componentList">
          <div v-for="(item,index) in componentList" :key="index">
            <!-- {{index}} -->
            <div class="component-box" :class='{active:index==borderIndex}'>
              <!-- 轮播图 -->
              <banner v-if="item.type=='Banner__swiper1'" @showBannerEdit="setBannerEditShow" @delteCom="del" :data="item.data" :index="index"></banner>
              <!-- 一行意图 -->
              <list-banner v-if="item.type=='Bill__normal'" @showBannerEdit="setBannerEditShow" @delteCom="del" :data="item.data" :index="index"></list-banner>
              <!-- 搜索框 -->
              <search v-if="item.type=='Search__normal'" @indexSearchEdit="showSearchEdit" :itemList="item.data" :index="index" @delteCom="del"></search>
              <!-- 产品组件 -->
              <product-group v-if="item.type=='ProductList__normal'" @indexProductGroupEdit="productGroupEdit" :productList="item.data" :index="index" @delteCom="del"></product-group>
              <!-- 图文导航1 -->
              <navigation v-if="item.type=='Nav__normal'||item.type=='Nav__normal2'" :styleTpye='item.type' @showNavigationEdit="indexNavigationEditShow" :navigationList="item.data" :index="index" @delteCom="del"></navigation>
              <!-- 产品？ -->
              <product v-if="item.type=='Product__normal'||item.type=='Product__normal2'" :styleType='item.type' :data="item.data" @showProductEdit="indexPorductEditShow" :index="index" @delteCom="del"></product>
              <!--图文logo -->
              <head-logo v-if="item.type=='Header__logo'" :index="index" :data='item.data' @showHeadLogoEdit='indexShowHeadLogoEdit' @delteCom="del"></head-logo>
            </div>
          </div>
        </draggable>
        <Button v-if='nopadding' @click="selectComponent" class="add-buttton" type="ghost" icon="android-add-circle"></Button>
      </div>
      <div class="footer-content" :class="{havePaddingTop: nopadding}">
        <!-- 底部菜单 -->
        <defined-footer :footerListData='indexFooterListData' v-if="!tabOnlyOne" @showFooterEdit="setFooterShow" @footerDel="indexFooterDel"></defined-footer>
        <div class="no-footer-data" v-if="tabOnlyOne">
          请选择底部菜单组件
        </div>
      </div>
      </Col>
      <!-- 组件选择 -->
      <Col v-if='nopadding' span="12" class="definedContent">
      <div v-if="componentsShow.show" class="component-name-list">
        <h3 class="component-title">基础组件</h3>
        <Row>
          <Col class="component" span="6">
          <Button type="ghost" @click="headLogo">头部logo</Button>
          </Col>
          <Col class="component" span="6">
          <Button type="ghost" @click="bannerSelectShow">图片广告</Button>
          </Col>
          <Col class="component" span="6">
          <Button type="ghost" @click="toggle('indexNavigationSelectShow')">图文导航</Button>
          </Col>
          <Col class="component" span="6">
          <Button type="ghost" @click="addSearch('Search__normal')">搜索框</Button>
          </Col>
          <Col class="component" span="6">
          <Button type="ghost" @click="addProductGroup('ProductList__normal')">产品分组</Button>
          </Col>
          <Col class="component" span="6">
          <Button type="ghost" @click="toggle('indexProductSelect')">产品</Button>
          </Col>
          <Col v-if="tabOnlyOne" class="component" span="6">
          <Button type="ghost" @click="addTab">底部菜单</Button>
          </Col>
        </Row>
      </div>
      <!-- 轮播图选择 -->
      <div v-if="componentsShow.bannerShow" class="component-name-list">
        <h3 class="component-title">图片广告</h3>
        <Row>
          <Col class="viewpager" span="8">
          <!-- 轮播图 -->
          <div @click="bannerSelect('Banner__swiper1')">
            <img src="../../../assets/images/style5.jpg" alt="">
            <div>轮播图</div>
          </div>
          </Col>
          <!-- 一行一图 -->
          <Col class="viewpager" span="8">
          <div @click="bannerSelect('Bill__normal')">
            <img src="../../../assets/images/style6.jpg" alt="">
            <div>腰部广告</div>
          </div>
          </Col>
          <Col class="continueUp" span="8"> 持续更新中...
          </Col>
        </Row>
      </div>

      <!-- 图文导航类型选择 -->
      <div v-if="componentsShow.indexNavigationSelectShow" class="component-name-list">
        <h3 class="component-title">图文导航类型选择</h3>
        <Row>
          <Col class="viewpager" span="8">
          <!-- 样式1 -->
          <div @click="addNavigation('Nav__normal')">
            <img src="../../../assets/images/style1.gif" alt="">
            <div>样式1</div>
          </div>
          </Col>
          <!-- 样式2 -->
          <Col class="viewpager" span="8">
          <div @click="addNavigation('Nav__normal2')">
            <img src="../../../assets/images/style2.jpg" alt="">
            <div>样式2</div>
          </div>
          </Col>
          <Col class="continueUp" span="8"> 持续更新中...
          </Col>
        </Row>
      </div>

      <!-- 产品类型选择 -->
      <div v-if="componentsShow.indexProductSelect" class="component-name-list">
        <h3 class="component-title">产品类型选择</h3>
        <Row>
          <Col class="viewpager" span="8">

          <div @click="addProduct('Product__normal')">
            <img src="../../../assets/images/style3.gif" alt="">
            <div>样式1</div>
          </div>
          </Col>

          <Col class="viewpager" span="8">
          <div @click="addProduct('Product__normal2')">
            <img src="../../../assets/images/style4.jpg" alt="">
            <div>样式2</div>
          </div>
          </Col>
          <Col class="continueUp" span="8"> 持续更新中...
          </Col>
        </Row>
      </div>

      <!-- 轮播图编辑 -->
      <banner-edit :bannerType='indexBannerType' @setImgData="setBannerData" v-if="componentsShow.bannerEditShow" :data="data" :index="bannerEditIndex"></banner-edit>
      <!-- 搜索框设置 -->
      <search-edit @getSearchList="getList"  :index="searchEditIndex" v-if="componentsShow.searchEditShow"></search-edit>
      <!-- 产品分组编辑 -->
      <product-group-edit @indexProductGroupData="setProductGroupData" :productList="productEditData" :index="productGroupIndex" v-if="componentsShow.productGroupEditShow"></product-group-edit>
      <!-- 图文导航编辑 -->
      <navigation-edit :navigationType='indexNavigationType' @setNavigationData="indeNavigationSetData" :navigationData="indexNavigationData" :index="navigationEditIndex" v-if="componentsShow.navigationEditShow"></navigation-edit>
      <!-- 底部菜单编辑 -->
      <footer-edit @setFooterData="indexSetFooterData" :footerData="indexFooterListData" v-if="componentsShow.indexFooterEditShow"></footer-edit>
      <!-- 产品编辑 -->
      <product-edit :productType='indexProductType' @indexProductUpData="productUpData" :productData="productData" v-if="componentsShow.indexPorductEdit" :index="indexProductIndex"></product-edit>
      <!-- 图文logo编辑 -->
      <headlogo-edit @setHeadLogoUpData='indexHeadLogoUpData' :pageData='headLogoData' v-if="componentsShow.indexHeadLogoEdit" :index='indexHeadLogoEditIndex'></headlogo-edit>
      </Col>
    </Row>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import banner from "./definedComponents/banner";
import search from "./definedComponents/search";
import bannerEdit from "./definedComponents/bannerEdit";
import componentHeader from "./definedComponents/head";
import listBanner from "./definedComponents/listBanner";
import searchEdit from "./definedComponents/searchEdit";
import productGroup from "./definedComponents/productGroup";
import productGroupEdit from "./definedComponents/productGroupEdit";
import navigationEdit from "./definedComponents/navigationEdit";
import navigation from "./definedComponents/navigation";
import definedFooter from "./definedComponents/footer";
import footerEdit from "./definedComponents/footerEdit";
import product from "./definedComponents/product";
import productEdit from "./definedComponents/productEdit";
import headLogo from "./definedComponents/headLogo";
import headlogoEdit from "./definedComponents/headLogoEdit";
import showControl from "./showControl.js";
import { apiPost, apiGet } from "@/fetch/api";
import { mapState } from "vuex";
import VueCookies from "vue-cookies";

// import { SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG } from 'constants';
export default {
  components: {
    draggable,
    banner,
    search,
    bannerEdit,
    componentHeader,
    listBanner,
    searchEdit,
    productGroup,
    productGroupEdit,
    navigation,
    navigationEdit,
    definedFooter,
    footerEdit,
    product,
    productEdit,
    headLogo,
    headlogoEdit
  },
  data() {
    return {
      indexBannerType: "",
      indexProductType: "",
      indexNavigationType: "",
      nopadding: true,
      headLogoData: {},
      indexHeadLogoEditIndex: null, //图文logo回传下标
      productData: {}, //产品编辑回传的对应数据
      indexProductIndex: null,
      indexFooterListData: {},
      footerData: [], //编辑时回传的数据
      indexFooterShowIndex: false, //当前底部菜单编辑页展示对应的下标
      tabOnlyOne: true, //底部菜单，每次只能一个
      indexNavigationData: [], //图文导航编辑是传给编辑图文导航的data
      navigationEditIndex: null, //对应图文导航数据喜下标
      productEditData: [],
      searchType: [],
      itemList: [],
      searchEditIndex: null,
      searchEditShow: false, // 搜索框编辑是否显示
      bannerEditIndex: null, //编辑轮播图下标
      bannerEditShow: false, //轮播图编辑
      show: true, //组件选择
      bannerShow: false, //广告图片选择
      componentList: [], //组件列表
      tempalteId: null,
      data: [],
      componentsShow: {
        show: true,
        searchEditShow: false,
        bannerEditShow: false,
        bannerShow: false,
        productGroupEditShow: false,
        navigationEditShow: false,
        indexNavigationSelectShow: false, // 图文导航选择
        indexFooterEditShow: false, //底部菜单显示,
        indexProductSelect: false, //产品类别
        indexPorductEdit: false, //产品编辑
        indexHeadLogoEdit: false // 图文logo编辑
      }
    };
  },
  created() {
    this.getTemplateData();
  },
  computed: {
    ...mapState({ borderIndex: state => state.indexdefined.borderIndex })
  },
  methods: {
    setPadding() {
      this.nopadding = !this.nopadding;
    },
    getTemplateData() {
      apiGet(
        "/merchant/merchantTemplateCustom/getTemplateCustom?t=" +
          new Date().getTime()
      ).then(res => {
        if (res.success) {
          let data =
            res.data && res.data.template ? JSON.parse(res.data.template) : [];
          // console.log(JSON.parse(res.data.template))
          // 底部菜单不在组件循环里面，要单独获取数据
          let footerItem = data.find(item => {
            return item.type === "Footer__normal";
          });
          if (footerItem) {
            // 如果有底部菜单
            this.tabOnlyOne = false;
            this.indexFooterListData = footerItem.data;
          }
          this.$refs.header.title =
            res.data && res.data.name ? res.data.name : "";
          this.componentList = data;
          this.tempalteId = res.data && res.data.id ? res.data.id : null;
          this.$emit(
            "setStaut",
            res.data && res.data.status ? res.data.status : "0",
            res.data && res.data.id ? res.data.id : null
          );
        }
      });
    },
    save() {
      apiPost("/merchant/merchantTemplateCustom/saveTemplateCustom ", {
        id: this.tempalteId ? this.tempalteId : null,
        template: JSON.stringify(this.componentList),
        name: this.$refs.header.title
      }).then(res => {
        if (res.success) {
          this.$Message.success("自定义模板保存成功！");
          this.getTemplateData();
        }
      });
      // console.log(this.componentList)
    },
    toggle(key) {
      //保证右侧每次只能展示一个
      showControl(this, key);
    },
    onEnd() {
      // 每次拖住完成后，重置下标，并且，右侧变成组件选择菜单
      this.toggle("show");
    },
    indexHeadLogoUpData(index, val) {
      //更新头部logo数据
      this.componentList[index].data = val;
    },
    indexShowHeadLogoEdit(index) {
      //图文logo编辑展示
      this.indexHeadLogoEditIndex = index;
      this.toggle("indexHeadLogoEdit");
      this.headLogoData = this.componentList[index].data;
    },
    productUpData(data, index) {
      this.componentList[index].data = data;
    },
    indexPorductEditShow(index) {
      //产品编辑
      this.indexProductIndex = index;
      this.toggle("indexPorductEdit");
      this.indexProductType = this.componentList[index].type;
      this.productData = this.componentList[index].data;
    },
    indexSetFooterData(list) {
      let footerIndex;
      this.componentList.forEach((item, index) => {
        if (item.type == "Footer__normal") {
          footerIndex = index;
          return false;
        }
      });
      this.componentList[footerIndex].data = list; //更新数据，但是当前的footer不在循环里面手动更新数据
      this.indexFooterListData = list;
    },
    setFooterShow() {
      this.toggle("indexFooterEditShow");
      let footerIndex;
      this.componentList.forEach((item, index) => {
        if (item.type == "Footer__normal") {
          footerIndex = index;
          return false;
        }
      });
      this.indexFooterListData = this.componentList[footerIndex].data;
      // console.log(this.indexFooterListData)
    },
    indexFooterDel() {
      //底部菜单删除保证最多只有一个
      let footerIndex;
      this.componentList.forEach((item, index) => {
        //查
        if (item.type == "Footer__normal") {
          footerIndex = index;
          return false;
        }
      });
      this.componentList.splice(footerIndex, 1);
      this.toggle("show");
      this.tabOnlyOne = true;
      this.$Message.success("组件删除成功");
    },
    indeNavigationSetData(index, list) {
      // console.log(list,index)
      this.componentList[index].data = list;
    },
    indexNavigationEditShow(index) {
      // console.log(index)
      this.navigationEditIndex = index;
      this.indexNavigationType = this.componentList[index].type;
      this.toggle("navigationEditShow");
      this.indexNavigationData = this.componentList[index].data;
    },
    setProductGroupData(list, index) {
      // 编辑页数据回传
      this.componentList[index].data = list;
      // console.log(this.componentList[index].data)
    },
    productGroupEdit(index) {
      // 产品分组编辑显示,同时将选择的值会给组件
      this.toggle("productGroupEditShow");
      this.productGroupIndex = index;
      this.productEditData = this.componentList[index].data;
    },
    getList(index, list) {
      this.componentList[index].data = list;
    },
    showSearchEdit(index) {
      // 搜索框 编辑设置
      //  console.log(index)
      this.searchEditIndex = index;
      this.toggle("searchEditShow");
      // this.searchType = [];
      // this.componentList[index].data.forEach(element => {
      //   this.searchType.push(element.businessType);
      // });
    },
    setBannerData(index, data) {
      // 轮播图编辑页，回传的编辑内容及在组件列表的下标
      this.componentList[index].data = data;
    },
    setBannerEditShow(index) {
      // showControl(this, "bannerEditShow");
      this.toggle("bannerEditShow");
      this.bannerEditIndex = index;
      this.data = this.componentList[index].data;
      this.indexBannerType = this.componentList[index].type;
    },
    del(index) {
      this.$store.dispatch("setIndex", null); //置空选中组件
      this.componentList.splice(index, 1);
      this.toggle("show");
      this.$Message.success("组件删除成功");
    },
    selectComponent() {
      // 选择组件
      this.toggle("show");
      this.$Message.success("请选择基础组件");
      this.$store.dispatch("setIndex", null);
      $("#content").scrollTop(100);
    },
    bannerSelectShow() {
      // 图片广告选择
      this.toggle("bannerShow");
    },
    bannerSelect(type) {
      //轮播图两种样式选择
      this.componentList.push({
        type: type,
        data: []
      });
      this.toggle("show");
    },
    addSearch() {
      //新增搜索组件
      this.componentList.push({
        type: "Search__normal",
        // data: [
        //   {
        //     name: "景区",
        //     businessType: "ticket"
        //   },
        //   {
        //     name: "酒店",
        //     businessType: "room"
        //   },
        //   {
        //     name: "商品",
        //     businessType: "mdse"
        //   },
        //   {
        //     name: "餐饮",
        //     businessType: "repast"
        //   },
        //   {
        //     name: "跟团游",
        //     businessType: "route"
        //   }
        // ]
      });
    },
    addProductGroup(type) {
      //新增产品分组
      this.componentList.push({
        type: "ProductList__normal",
        data: []
      });
    },
    addProduct(type) {
      //新增产品
      this.componentList.push({
        type: type,
        data: {
          title: "默认标题",
          list: []
        }
      });
    },
    addNavigation(type) {
      //新增图文导航
      this.componentList.push({
        type: type,
        data: []
      });
    },
    addTab() {
      this.componentList.push({
        type: "Footer__normal",
        data: {
          bgColor: "#2366c9",
          selectColor: "#3f98f6",
          list: []
        }
      });
      this.indexFooterListData = {
        bgColor: "#2366c9",
        selectColor: "#3f98f6",
        list: []
      };
      this.tabOnlyOne = false;
    },
    headLogo() {
      //logo模块
      this.componentList.push({
        type: "Header__logo",
        data: {
          logoUrl: "",
          name: "",
          color: "rgb(57, 114, 174)",
          intro: "",
          tel: ""
        }
      });
    }
  }
};
</script>
<style lang="scss">
@import "../../../assets/styles/font/iconfont.css";

.banner-handler {
  // display:none
}
.havePaddingTop {
  .p-t-30 {
    padding-top: 30px;
  }
  .component-box {
    margin-bottom: 5px;
  }
  .component-box.active {
    border: 2px dotted red;
    // padding: 5px;
    // margin: 3px;
  }
}
.handler-none {
  .banner-handler {
    display: none;
  }
}
.img-add-btn-box {
  text-align: center;
  margin-top: 15px;
}
.search-box {
  padding: 10px 15px;
}
.component-box {
  margin-bottom: 15px;
  position: relative;
  .banner-handler {
    padding: 3px 5px;
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 99;
  }
}
.handler-none {
  .component-box {
    margin-bottom: 0px;
  }
}
.demo-carousel {
  img {
    height: 187px;
    width: 100%;
  }
}
.viewpager {
  padding: 7px;
  cursor: pointer;
  text-align: center;
  img {
    width: 100%;
    // height: 70px;
  }
}
.continueUp {
  text-align: center;
  padding-top: 50px;
}
.viewpager:hover {
  border: 1px solid red;
  padding: 6px;
  border-radius: 5px;
}
.indexDefined {
  position: relative;
  width: 375px !important;
  margin-right: 25px;
  .add-buttton {
    width: 100%;
    .ivu-icon-android-add-circle {
      font-size: 20px;
      color: #1296db;
    }
  }
  .componentList {
    height: 460px;
    overflow-y: auto;
    overflow-x: hidden;
    border: 1px solid #cccccc;
    border-bottom: none;
    border-top: none;
  }
}
.index-title {
  background: #aaaaaa;
  text-align: center;
  color: #ffffff;
  font-size: 16px;
  padding: 5px 10px;
}
.definedContent {
  padding-left: 25px;
  height: 626px;
  overflow: auto;
  border: 1px solid #dddee1;
  .component-name-list {
    // border: 1px solid #dddee1;
    padding: 15px;
  }
  .component-title {
    margin-bottom: 10px;
    padding-bottom: 5px;
    border-bottom: 1px solid #dddee1;
  }
}
.component {
  text-align: center;
  margin-bottom: 10px;
  button {
    width: 80px;
  }
}
.img-list {
  border: 1px solid #dddee1;
  padding: 5px;
  position: relative;
  .img-delete {
    cursor: pointer;
    position: absolute;
    top: -12px;
    right: -12px;
    font-size: 24px;
    color: #aaa;
  }
}
.img-list:hover {
  .img-delete {
    display: inline-block;
  }
}
.img-box {
  width: 120px;
  float: left;
  text-align: center;
  margin-top: 8px;
  img {
    width: 100px;
    height: 57px;
  }
}
.img-detail {
  margin-left: 130px;
  .content {
    width: calc(100% - 50px);
    padding: 9px 5px;
  }
}
// ::-webkit-scrollbar {
//   width: 3px; /* 滚动条宽度为0 */
//   background: #aaaaaa;
//   height: 8px;
// }
.footer-content {
  border: 1px solid #cccccc;
  border-top: none;
  // height: 91px;
}
.no-footer-data {
  height: 91px;
  background: #cccccc;
  font-size: 18px;
  text-align: center;
  line-height: 90px;
}
</style>

