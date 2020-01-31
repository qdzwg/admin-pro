<template>
  <div class="navigation-edit-box">
    <!-- {{data}} -->
    <div
      class="edit-notice"
    >自定义图片宽高，等比缩放，支持类型:jpg、png。自由布局属于可自定义功能，商家既可以展示商品，也可以展示活动海报。同时能在海报或者图片上，设置链接到页面地址</div>
    <table class="edit-table">
      <tr>
        <td class="title">
          <span class="red">*</span>
          模板样式
        </td>
        <td>
          <div class="type-select">
            <!-- 图文导航 -->
            <Col style="margin-bottom:10px" span="8">
              <div
                @click="typeSelect('freeLayout1')"
                class="type-item clearfix"
                :class="{active:pageData.type=='freeLayout1'}"
              >
                <div class="type-item-box">两左两右</div>
                <!-- <img @click="typeSelect('freeLayout1')" class="type-img fl" src="http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg" alt=""> -->
              </div>
            </Col>
            <!-- 文字导航 -->
            <Col style="margin-bottom:10px" span="8">
              <div
                @click="typeSelect('freeLayout2')"
                class="type-item clearfix"
                :class="{active:pageData.type=='freeLayout2'}"
              >
                <div class="type-item-box">一行两图</div>
                <!-- <img @click="typeSelect('freeLayout2')" class="type-img fl" src="http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg" alt=""> -->
              </div>
            </Col>
            <Col style="margin-bottom:10px" span="8">
              <div
                @click="typeSelect('freeLayout3')"
                class="type-item clearfix"
                :class="{active:pageData.type=='freeLayout3'}"
              >
                <div class="type-item-box">一行三图</div>
                <!-- <img @click="typeSelect('freeLayout3')" class="type-img fl" src="http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg" alt=""> -->
              </div>
            </Col>
            <Col span="8" style="margin-bottom:10px">
              <div
                @click="typeSelect('freeLayout4')"
                class="type-item clearfix"
                :class="{active:pageData.type=='freeLayout4'}"
              >
                <div class="type-item-box">一上两下</div>
                <!-- <img @click="typeSelect('freeLayout4')" class="type-img fl" src="http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg" alt=""> -->
              </div>
            </Col>
            <Col span="8" style="margin-bottom:10px">
              <div
                @click="typeSelect('freeLayout5')"
                class="type-item clearfix"
                :class="{active:pageData.type=='freeLayout5'}"
              >
                <div class="type-item-box">一左三右</div>
                <!-- <img @click="typeSelect('freeLayout5')" class="type-img fl" src="http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg" alt=""> -->
              </div>
            </Col>
            <Col span="8" style="margin-bottom:10px">
              <div
                @click="typeSelect('freeLayout6')"
                class="type-item clearfix"
                :class="{active:pageData.type=='freeLayout6'}"
              >
                <div class="type-item-box">一左两右</div>
                <!-- <img @click="typeSelect('freeLayout6')" class="type-img fl" src="http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg" alt=""> -->
              </div>
            </Col>
            <Col span="8">
              <div
                @click="typeSelect('freeLayout7')"
                class="type-item type-item7 clearfix"
                :class="{active:pageData.type=='freeLayout7'}"
              >
                <div class="type-item-box">一左两右（左侧轮播）</div>                
              </div>
            </Col>
          </div>
        </td>
      </tr>
      <!-- <tr>
        <td class="title" style="width:80px">
          <span class="red">*</span>
          隐藏文字
        </td>
        <td>
          <RadioGroup v-model="pageData.hideText">
            <Radio label="T">是</Radio>
            <Radio label="F">否</Radio>
          </RadioGroup>
        </td>
      </tr>
      <tr>
        <td class="title">
          <span class="red">*</span>
          适应图片
        </td>
        <td>
          <RadioGroup v-model="pageData.imgHeightAuto">
            <Radio label="T">是</Radio>
            <Radio label="F">否</Radio>
          </RadioGroup>
          <span
            style="display:inline-block; vertical-align:middle; width:140px; font-size:12px;"
          >（选“是”将按上传图比例自适应高度）</span>
        </td>
      </tr>
      <tr>
        <td class="title">
          <span class="red">*</span>
          背景透明
        </td>
        <td>
          <RadioGroup v-model="pageData.bgTransparent">
            <Radio label="T">是</Radio>
            <Radio label="F">否</Radio>
          </RadioGroup>
        </td>
      </tr> -->
      <!-- <tr class="title" v-if="pageData.type=='freeLayout5' || pageData.type=='freeLayout6'">
        <td>

          <span class="red">*</span>
          左右比例
        </td>
        <td class="clearfix">
          <div class="slide-box">
            <Slider v-model="pageData.mainImgWidth" show-input :max="100"></Slider>
          </div>
          <span class="silde-unit">%</span>
        </td>
      </tr>
      <tr class="title" v-if="pageData.type=='freeLayout7'">
        <td>

          <span class="red">*</span>
          左右比例
        </td>
        <td class="clearfix">
          <div class="slide-box">
            <Slider v-model="pageData.mainImgWidth" show-input :max="100"></Slider>
          </div>
          <span class="silde-unit">%</span>
        </td>
      </tr>
      <tr class="title">
        <td>
          <span class="red">*</span>
          图片间距
        </td>
        <td class="clearfix">
          <div class="slide-box">
            <Slider v-model="pageData.height" show-input :max="50"></Slider>
          </div>
          <span class="silde-unit">px</span>
        </td>
      </tr> -->
    </table>
    <div class="freelayout7-upload-casaul" v-if="pageData.type=='freeLayout7'">
      <div v-if="pageData.casaulList&&pageData.casaulList.length" class="img-text-list">
        <draggable
          :list="pageData.casaulList"
          :options="{animation:150,disabled:disabled}"
          :no-transition-on-drag="true"
        >
          <div v-for="(item,index) in pageData.casaulList" :key="index" class="img-text-item clearfix">
           
            <Icon @click="del(index)" type="close-circled del-icon"></Icon>
            
            <div class="img-show fl" v-if="item.picAddr">
              <img class="img" :src="item.picAddr" alt />
              <div @click="imgIndex(index)" class="del-cover">
                
                <Upload
                  :format="['jpg','jpeg','png']"
                  :on-success="setImgUrl2"
                  :show-upload-list="false"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  action="/static/manage/uiFileUpload/dispatch?action=upload"
                >
                 
                  <span class="change">更换图片</span>
                </Upload>
              </div>
            </div>
            <div v-else @click="imgIndex(index)" class="img-add fl">
              <Upload
                :format="['jpg','jpeg','png']"
                :on-success="setImgUrl2"
                :show-upload-list="false"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                action="/static/manage/uiFileUpload/dispatch?action=upload"
              >
                <Icon class="add-icon" type="ios-plus-outline" color="#3BB4F2" size="14"></Icon>
              </Upload>
            </div>
            <div></div>
            <div class="fl text">链接</div>
            <div class="fl link-text">
              <!-- <div>
                <Input
                  @on-focus="disabled=true"
                  @on-blur="disabled=false"
                  v-model="item.title"
                  size="small"
                ></Input>
              </div> -->
              <div class="link" style="margin-top:16px;">
                <custom-link :itemData="item"></custom-link>
                <!-- <Select placeholder='设置链接页面' size='small' v-model="item.picLink">
                  <Option v-for="item in typeList" :value="item.businessType" :key="item.value">{{ item.name }}</Option>
                </Select>-->
              </div>
            </div>
          </div>
        </draggable>
      </div>
      <Upload
        v-if="pageData.casaulList&&pageData.casaulList.length<5"
        class="upload-img-btn"
        :format="['jpg','jpeg','png']"
        :on-success="addCasaul"
        :show-upload-list="false"
        :max-size="2048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        action="/static/manage/uiFileUpload/dispatch?action=upload"
      >
        <Icon class="add-icon" type="ios-plus-outline" color="#3BB4F2" size="14"></Icon>添加一个左侧轮播图
      </Upload>
    </div>  
    <div v-if="pageData.list&&pageData.list.length" class="img-text-list">
      <draggable
        :list="pageData.list"
        :options="{animation:150,disabled:disabled}"
        :no-transition-on-drag="true"
      >
        <div
          v-for="(item,index) in pageData.list"
          :key="index"
          class="img-text-item clearfix"
          v-if="index<limitNum"
          @click="imgIndex2(index)"
        >
          <div class="img-show fl" v-if="item.picAddr">
            <img class="img" :src="item.picAddr" alt />
            <div class="del-cover">
              <Upload
                :format="['jpg','jpeg','png']"
                :on-success="setImgUrl"
                :show-upload-list="false"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                action="/static/manage/uiFileUpload/dispatch?action=upload"
              >
                <span class="change">图片更换{{limitNum}}</span>
              </Upload>
            </div>
          </div>
          <div v-else class="img-add fl" :class="{'error':errorShow&&!item.picAddr}">
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
          <div></div>
          <div class="fl text">链接</div>
          <div class="fl link-text">
            <!-- <div>
              <Input
                v-model="item.text"
                @on-focus="disabled=true"
                @on-blur="disabled=false"
                size="small"
              ></Input>
            </div> -->
            <div class="link" style="margin-top:16px;">
              <custom-link :itemData="item"></custom-link>
              <!-- <Select placeholder='设置链接页面' size='small' v-model="item.linkUrl">
                <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>-->
              <!-- <p style="color:red">asdsadsad</p> -->
            </div>
          </div>
        </div>
      </draggable>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import customLink from "@/components/otherRouter/custompageLink";
import { customLinkObj } from "@/common/data";
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
  computed: {
    limitNum() {
      let val = this.pageData.type;
      let limitNum = 4;
      if (val == "freeLayout1") {
        limitNum = 4;
      } else if (val == "freeLayout2") {
        limitNum = 2;
      } else if (val == "freeLayout3") {
        limitNum = 3;
      } else if (val == "freeLayout4") {
        limitNum = 3;
      } else if (val == "freeLayout5") {
        limitNum = 4;
      } else if (val == "freeLayout6") {
        limitNum = 3;
      } else if (val == "freeLayout7") {
        limitNum = 2;
      }
      return limitNum;
    },
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
  watch: {
    // pageData: {
    //   handler(val, oldVal) {
    //     console.log("val", val);
    //   },
    //   deep: true
    // }
  },
  data() {
    return {
      disabled: false,
      // limitNum: 4, //默认对应的是freeLayout1对应的数量是4
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
    backgroundColorReset() {
      //背景颜色重置为#fff
      this.pageData.backgroundColor = "#fff";
    },
    textColorReset() {
      //背景颜色重置为#fff
      this.pageData.textColor = "#000";
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
    setImgUrl2(res, file) {
      this.pageData.casaulList[this.activeIndex].picAddr = res.prefix + res.url;
    },
    imgIndex(index) {
      this.activeIndex = index;
    },
    imgIndex2(index) {
      this.activeIndex = index;
    },
    //自由布局：左侧轮播右侧两图
    addCasaul(res, file) {
      let _this = this;
      let url = res.prefix + res.url;
      _this.pageData.casaulList.push(
          Object.assign(
            {
              picAddr: url,
              title: ""
            },
            customLinkObj
          )
        );
      // let img = new Image();
      // img.crossOrigin = "anonymous";
      // img.onload = function() {       
      //   _this.pageData.casaulList.push(
      //     Object.assign(
      //       {
      //         picAddr: url,
      //         title: ""
      //       },
      //       customLinkObj
      //     )
      //   );
      // };
      // img.src = url;
    },
    del(index) {
      this.pageData.casaulList.splice(index, 1);
      // console.log(this.pageData)
      // console.log("ww")
    },
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
  .slide-box {
    display: inline-block;
    width: 210px;
  }
  .silde-unit {
    float: right;
    font-size: 14px;
    color: #999;
    margin-top: 8px;
  }
  .upload-img-btn {
    margin: 10px 0;
    text-align: center;
    background: #f7f7f7;
    border: 1px solid #dddee1;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    .add-icon {
      margin-right: 5px;
    }
  }
  .upload-img-btn:hover {
    background: #ffffff;
    border-color: #57a3f3;
  }
}
</style>

