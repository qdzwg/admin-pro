<template>
  <div class="navigation-edit-box">
    <div class="edit-notice">建议上传方形或者圆形图片，最小支持50×50像素，建议使用150×150像素，每行可添加最多5个导航，支持类型：jpg、png。</div>
    <table class="edit-table">
      <tr>
        <td class="title">
          <span class="red">*</span>模板样式
        </td>
        <td>
          <div class="type-select">
            <!-- 图文导航 -->
            <Col span="8">
              <div
                class="type-item clearfix"
                @click="typeSelect('navigation1')"
                :class="{active:pageData.type=='navigation1'}"
              >
                <div class="type-item-box">图文导航</div>
                <!-- <img @click="typeSelect('navigation1')" class="type-img fl" src="http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg" alt=""> -->
              </div>
            </Col>
            <!-- 文字导航 -->
            <Col span="8">
              <div
                class="type-item clearfix"
                @click="typeSelect('navigation2')"
                :class="{active:pageData.type=='navigation2'}"
              >
                <div class="type-item-box">文字导航</div>
                <!-- <img @click="typeSelect('navigation2')" class="type-img fl" src="http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg" alt=""> -->
              </div>
            </Col>
            <!-- 文字导航样式二 -->
            <Col span="8">
              <div
                class="type-item clearfix"
                @click="typeSelect('navigation3')"
                :class="{active:pageData.type=='navigation3'}"
              >
                <div class="type-item-box">宋城导航</div>                
              </div>
            </Col>
          </div>
        </td>
      </tr>
      <tr>
        <td class="title">
          <span class="red">*</span>单行数量
        </td>
        <td>
          <Select v-model="pageData.lineNum" style="width:200px">
            <Option v-for="item in numList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </td>
      </tr>
      <tr>
        <td class="title">
          <span class="red">*</span>边框颜色
        </td>
        <td>
          <ColorPicker v-model="pageData.borderColor" />
          <Input v-model="pageData.borderColor" placeholder="请填写颜色" style="width:100px"></Input>
          <Button @click="borderColorReset" type="primary" size="small">重置</Button>
        </td>
      </tr>
      <tr>
        <td class="title">
          <span class="red">*</span>背景颜色
        </td>
        <td>
          <ColorPicker v-model="pageData.backgroundColor" />
          <Input v-model="pageData.backgroundColor" placeholder="请填写颜色" style="width:100px"></Input>
          <Button @click="backgroundColorReset" type="primary" size="small">重置</Button>
        </td>
      </tr>
      <tr>
        <td class="title">文字颜色</td>
        <td>
          <ColorPicker v-model="pageData.textColor" />
          <Input v-model="pageData.textColor" placeholder="请填写颜色" style="width:100px"></Input>
          <Button @click="textColorReset" type="primary" size="small">重置</Button>
        </td>
      </tr>
      <!-- <tr>
        <td class="title">选中背景</td>
        <td>
          <div class='shop-info-img'>
            <template v-if='pageData.activeBgUrl'>                 
              <img class="img-show" :src="pageData.activeBgUrl" alt="">
              <div class="cover-del">
                <Icon @click="activeBgUrlDel" class="del-svg" type="ios-trash-outline"></Icon>
              </div>                
            </template>                
            <Upload v-else class="img-up" :format="['jpg','jpeg','png']" :on-success="activeImgUrl" :show-upload-list="false" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" action="/static/manage/uiFileUpload/dispatch?action=upload">
              <Icon class="add-icon" type="ios-plus-outline" size='14'></Icon>
            </Upload>               
          </div>
        </td>
      </tr>
      <tr>
        <td class="title">标签背景</td>
        <td>
          <div class='shop-info-img'>
            <template v-if='pageData.tagBgUrl'>                 
              <img class="img-show" :src="pageData.tagBgUrl" alt="">
              <div class="cover-del">
                <Icon @click="tagBgUrlDel" class="del-svg" type="ios-trash-outline"></Icon>
              </div>                
            </template>                
            <Upload v-else class="img-up" :format="['jpg','jpeg','png']" :on-success="tagImgUrl" :show-upload-list="false" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" action="/static/manage/uiFileUpload/dispatch?action=upload">
              <Icon class="add-icon" type="ios-plus-outline" size='14'></Icon>
            </Upload>               
          </div>
        </td>
      </tr> -->
    </table>
    <div v-if="pageData.list&&pageData.list.length" class="img-text-list">
      <draggable
        :list="pageData.list"
        :options="{animation:150,disabled:disabled}"
        :no-transition-on-drag="true"
      >
        <div v-for="(item,index) in pageData.list" :key="index" class="img-text-item clearfix">
          <div v-if="pageData.type=='navigation1'||pageData.type=='navigation2'" class="navigation-normal" style="position: relative">
            <Icon @click="del(index)" type="close-circled del-icon"></Icon>
            <div class="img-show fl" v-if="item.picAddr">
              <img class="img" :src="item.picAddr" alt />
              <div class="del-cover">
                <Icon class="trash-icon" @click="delImg(index)" type="ios-trash-outline"></Icon>
              </div>
            </div>
            <div
              v-else
              @click="imgIndex(index)"
              class="img-add fl"
              :class="{'error':errorShow&&!item.picAddr&&!iconData[item.linkUrl]&&pageData.type=='navigation1'}"
            >
              <template v-if="iconData[item.linkUrl]">
                <div class="default-icon">
                  <i
                    class="xx-icon"
                    style="font-size:30px;"
                    :style="{'color':pageData.textColor}"
                    :class="iconData[item.linkUrl]"
                  ></i>
                  <div class="default-icon-cover">
                    <Upload
                      :format="['jpg','jpeg','png']"
                      :on-success="setImgUrl"
                      :show-upload-list="false"
                      :max-size="2048"
                      :on-format-error="handleFormatError"
                      :on-exceeded-size="handleMaxSize"
                      action="/static/manage/uiFileUpload/dispatch?action=upload"
                    >
                      <Icon class="add-icon" type="ios-plus-outline" size="14"></Icon>
                    </Upload>
                  </div>
                </div>
              </template>
              <template v-else>
                <Upload
                  :format="['jpg','jpeg','png']"
                  :on-success="setImgUrl"
                  :show-upload-list="false"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  action="/static/manage/uiFileUpload/dispatch?action=upload"
                >
                  <Icon class="add-icon" type="ios-plus-outline" size="14"></Icon>
                </Upload>
              </template>
            </div>
            <div></div>
            <div class="fl text">文字链接</div>
            <div class="fl link-text">
              <div>
                <Input
                  :class="{'error':errorShow&&!item.title}"
                  v-model="item.title"
                  @on-focus="disabled=true"
                  @on-blur="disabled=false"
                  :maxlength="5"
                  placeholder="导航名称"
                  size="small"
                ></Input>              
              </div>
             
              <div class="link">
                <custom-link :itemData="item" :show="true"></custom-link>
                <!-- <Select placeholder='设置链接页面' size='small' v-model="item.businessType" :class="{'error':!item.businessType&&errorShow}">
                    <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>-->
              </div>
            </div>
          </div>
          <div v-else class="navigation-personal" style="position: relative">
            <div class="fl" style="width:135px;">
              <div class="itemSelectBg" style="width: 56px; height: 28px; display: flex; align-items: center;">
              <Icon @click="del(index)" type="close-circled del-icon"></Icon>
              <div class="img-show" v-if="item.itemSelectBg">
                <img class="img" :src="item.itemSelectBg" alt />
                <div class="del-cover">
                  <Icon class="trash-icon" @click="delImgSbg(index)" type="ios-trash-outline"></Icon>
                </div>
              </div>
              <div
                v-else
                @click="imgIndex(index)"
                class="img-add fl"             
              >
                <Upload
                  :format="['jpg','jpeg','png']"
                  :on-success="setImgUrlSbg"
                  :show-upload-list="false"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  action="/static/manage/uiFileUpload/dispatch?action=upload"
                >
                  <Icon class="add-icon" type="ios-plus-outline" size="14"></Icon>
                </Upload>
              </div>
            </div>
            <!-- <div class="itemTagBg" style="margin-top:4px; width: 56px; height: 56px; display: flex; align-items: center;">
              <Icon @click="del(index)" type="close-circled del-icon"></Icon>
              <div class="img-show" v-if="item.itemTagBg">
                <img class="img" :src="item.itemTagBg" alt />
                <div class="del-cover">
                  <Icon class="trash-icon" @click="delImgTbg(index)" type="ios-trash-outline"></Icon>
                </div>
              </div>
              <div
                v-else
                @click="imgIndex(index)"
                class="img-add fl"             
              >
                <Upload
                  :format="['jpg','jpeg','png']"
                  :on-success="setImgUrlTbg"
                  :show-upload-list="false"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  action="/static/manage/uiFileUpload/dispatch?action=upload"
                >
                  <Icon class="add-icon" type="ios-plus-outline" size="14"></Icon>
                </Upload>
              </div>
            </div>   -->
              <div style="margin-top:5px;">
                <!-- <span style="width:30px; display:inline-block; vertical-align: middle">标签背景颜色</span> -->
                <span style="display:inline-block; vertical-align: middle">
                  <ColorPicker v-model="item.tagBgColor"/>
                  <Input v-model="item.tagBgColor" placeholder="请填写标签背景颜色" style="width:70px"></Input>
                </span>
              </div>
              <div style="margin-top:5px;">
                <!-- <span style="width:30px; display:inline-block; vertical-align: middle">标签文字颜色</span> -->
                <span style="display:inline-block; vertical-align: middle">
                  <ColorPicker v-model="item.tagColor"/>
                  <Input v-model="item.tagColor" placeholder="请填写标签文字颜色" style="width:70px"></Input>
                </span>
              </div>
            </div>
                      
            
            <div></div>
            <div class="fl text">文字链接</div>
            <div class="fl link-text">
              <div>
                <Input
                  :class="{'error':errorShow&&!item.title}"
                  v-model="item.title"
                  @on-focus="disabled=true"
                  @on-blur="disabled=false"
                  :maxlength="5"
                  placeholder="导航名称"
                  size="small"
                ></Input>              
              </div>
              <div style="margin-top:6px;">
                <Input 
                  placeholder="导航副标题" 
                  :maxlength="4" 
                  size="small" 
                  v-model="item.subtitle" 
                  @on-focus="disabled=true"
                  @on-blur="disabled=false"></Input>
              </div>
              <div style="margin-top:6px;">
                <Input 
                  placeholder="标签名称" 
                  :maxlength="4" 
                  size="small" 
                  v-model="item.tagTitle" 
                  @on-focus="disabled=true"
                  @on-blur="disabled=false"></Input>
              </div>
              <div class="link">
                <custom-link :itemData="item" :show="true"></custom-link>
              </div>
            </div>
          </div>
        </div>
      </draggable>
    </div>
    <Button style="margin-top:5px;" v-if="pageData.list&&pageData.list.length<20" @click="add" long>
      <Icon class="add-icon" type="ios-plus-outline" color="#3BB4F2" size="14"></Icon>添加一个图文导航
    </Button>
    <div style="margin-top:10px">最多支持添加4行20个导航，拖动选中的图文导航可对其排序</div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import customLink from "@/components/otherRouter/custompageLink";
import { mapState } from "vuex";
export default {
  components: {
    draggable,
    customLink
  },
  props: {
    data: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  watch: {
    // lineNum: {
    //   handler(val, oldVal) {
    //     console.log("val", val);
    //   },
    //   deep: true
    // }
  },
  computed: {
    pageData() {
      return this.list2[this.index].data;
    },
    ...mapState({
      list2: state => {
        //   console.log(state)
        return state.defined.list;
      },
      errorShow: state => {
        return state.defined.errorShow;
      }
    })
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
        customtel: "icon-bohao"
      },
      disabled: false,
      numList: [
        {
          value: "1",
          label: "一个"
        },
        {
          value: "2",
          label: "两个"
        },
        {
          value: "3",
          label: "三个"
        },
        {
          value: "4",
          label: "四个"
        },
        {
          value: "5",
          label: "五个"
        }
      ],
      color1: "#fff",
      activeIndex: null, //需要设置图片的下标
      // pageData: this.data,
      disabledGroup: "fill",
      typeList: [
        {
          value: "ticket",
          label: "景区门票"
        },
        {
          value: "hotel",
          label: "酒店"
        },
        {
          value: "shop",
          label: "特色商品"
        },
        {
          value: "strategy",
          label: "游玩攻略"
        },
        {
          value: "route",
          label: "跟团游"
        },
        {
          value: "repast",
          label: "餐饮"
        }
      ]
    };
  },
  methods: {
    borderColorReset() {
      this.pageData.borderColor = "#fff";
    },
    backgroundColorReset() {
      //背景颜色重置为#fff
      this.pageData.backgroundColor = "#fff";
    },
    textColorReset() {
      //背景颜色重置为#fff
      this.pageData.textColor = "#999";
    },
    typeSelect(val) {
      this.pageData.type = val;
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "图片超过2M",
        desc: "图片：" + file.name + "太大， 不能超过2M"
      });
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件： " + file.name + "格式错误, 请选择图片格式jpg,png上传"
      });
    },
    setImgUrl(res, file) {
      this.pageData.list[this.activeIndex].picAddr = res.prefix + res.url;
    },
    del(index) {
      this.pageData.list.splice(index, 1);
    },
    delImg(index) {
      this.pageData.list[index].picAddr = "";
    },
    imgIndex(index) {
      this.activeIndex = index;
    },
    add() {
      this.pageData.list.push({
        picAddr: "",
        title: "",
        subtitle: "",
        tagTitle: '',
        itemSelectBg: '',
        itemTagBg: '',
        linkUrl: "",
        customLinkurl: "",
        customPageId: "",
        customPageName: "",
        strategyArr: []
        // customLinkurlType: "http"
      });
    },
    // activeBgUrlDel() {
    //   this.pageData.activeBgUrl = '';
    // },
    // activeImgUrl(res, file) {
    //   this.pageData.activeBgUrl = res.prefix + res.url;
    // },
    // tagBgUrlDel() {
    //   this.pageData.tagBgUrl = '';
    // },
    // tagImgUrl(res,file) {
    //   this.pageData.tagBgUrl = res.prefix + res.url;
    // }
    setImgUrlSbg(res, file) {
      this.pageData.list[this.activeIndex].itemSelectBg = res.prefix + res.url;
    },
    setImgUrlTbg(res, file) {
      this.pageData.list[this.activeIndex].itemTagBg = res.prefix + res.url;
    },
    delImgSbg(index) {
      this.pageData.list[index].itemSelectBg = "";
    },
    delImgTbg(index) {
      this.pageData.list[index].itemTagBg = "";
    }
  }
};
</script>
<style lang='scss'>
.navigation-edit-box {
  // .img-text-list{
  //   .img-text-item{
  //     .img-add{
  //       width: 56px;
  //     }
  //   }
  // }
  .img-add {
    .default-icon {
      width: 100%;
      height: 100%;
      position: relative;
      .default-icon-cover {
        display: none;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        background: rgba(0, 0, 0, 0.6);
      }
    }
    .default-icon:hover {
      .default-icon-cover {
        display: block;
      }
    }
  }
  .shop-info-img {
    height: 75px;
    width: 75px;
    // border: 1px solid red;
    position: relative;
    
    .img-up {
      border: 1px solid #d7d7d7;
      height: 75px;
      width: 75px;
      text-align: center;
      line-height: 75px;
      color: #3BB4F2;
      cursor: pointer;
      .ivu-upload.ivu-upload-select {
        width: 100%;
      }
    }
    .img-up.error{
      border-color: red;
      color: red;
    }
    .img-show {
      width: 100%;
      // height: 100%;
            
    }
    .cover-del {
      display: none;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      text-align: center;
      .del-svg {
        color: #fff;
        font-size: 24px;
        padding: 10px;
        cursor: pointer;
        margin-top: 14px;
      }
    }
  }
  .shop-info-img:hover .cover-del {
    display: block;
  }

  .img-text-list .img-text-item .navigation-personal .text{
    // height: 85px;
    margin-top: 20px;
  }
  .img-text-list .img-text-item .img-add{
    // margin-top: 14px;
  }
  .img-text-list .img-text-item .navigation-personal  .img-add{
    line-height: 28px;
    height: 28px;
    width:56px;
  }
  .img-text-list .img-text-item .navigation-personal .img-show{
    max-width: 56px;
    height: auto;
    max-height: 28px;
    .del-cover{
      top: 0;
      cursor: pointer;
      .trash-icon{
        font-size: 14px;
      }
    }
  }
  .img-text-list .img-text-item .navigation-personal .link-text{
    // width: calc(100% - 90px);
    width: calc(100% - 165px)
  }
}
</style>

