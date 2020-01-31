<template>
  <div class="title-edit-box">
    <!-- {{index}}{{pageData}} -->
    <!-- {{pageData}} -->
    <!-- <div class="edit-notice">
      建议图片宽度750,高度200-950，支持类型:jpg、png。轮播图要求一组内的图片高度必须完全一致。
    </div> -->
    <table class="edit-table">
      <tr>
        <td class="title">
          <span class="red">*</span>
          标题名称
        </td>
        <td>
          <Input
            @on-change="changeTitle"
            :maxlength="12"
            v-model="pageData.title"
            placeholder="请填写标题名称"
            :class="{ error: errorShow }"
            size="small"
          ></Input>
        </td>
      </tr>
      <tr>
        <td class="title">
          标题名称图片
        </td>
        <td>
          <div class="shop-info-img">
            <template v-if="pageData.titlePic">
              <img class="img-show" :src="pageData.titlePic" alt="" />
              <div class="cover-del">
                <Icon
                  @click="titlePicDel"
                  class="del-svg"
                  type="ios-trash-outline"
                ></Icon>
              </div>
            </template>
            <Upload
              v-else
              class="img-up"
              :class="{ error: errorShow }"
              :format="['jpg', 'jpeg', 'png']"
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
        </td>
      </tr>
      <!-- <tr>
        <td class="title">
          选择图片
        </td>
        <td>
          <div class="layer-img-upload-box">
            <img class="img-show" :src="pageData.icon" v-if="pageData.icon" />
            <div>
              <Upload
                :format="['jpg', 'jpeg', 'png']"
                :on-success="setImgUrl"
                :show-upload-list="false"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                action="/static/manage/uiFileUpload/dispatch?action=upload"
              >
                <Button v-if="pageData.icon" type="primary" size="small"
                  >更换图片</Button
                >
                <Button v-else type="primary" size="small">选择图片</Button>
              </Upload>
            </div>
          </div>
          <span class="img-upload-tip">建议图片尺寸360*220</span>
        </td>
      </tr> -->
      <tr>
        <td class="title">
          <span class="red">*</span>
          显示位置
        </td>
        <td>
          <RadioGroup v-model="pageData.position">
            <Radio label="left">居左</Radio>
            <Radio label="center">居中</Radio>
            <Radio label="right">居右</Radio>
          </RadioGroup>
        </td>
      </tr>
      <tr v-if="!pageData.titlePic||pageData.titlePic==''">
        <td class="title">
          <!-- <span class="red">*</span> -->
          字体颜色
        </td>
        <td>
          <ColorPicker v-model="pageData.titleColor" />
          <Input
            v-model="pageData.titleColor"
            placeholder="请填写颜色"
            style="width:100px"
          ></Input>
          <Button @click="titleColorReset" type="primary" size="small"
            >重置</Button
          >
        </td>
      </tr>
      <tr v-if="!pageData.titlePic||pageData.titlePic==''">
        <td class="title">
          标题字号
        </td>
        <td>
          <!-- {} -->
          <Select style="width:100px;" v-model="pageData.titleFontSize">
            <Option
              v-for="(item, index) in fontList"
              :value="item.key"
              :key="index"
              >{{ item.value }}</Option
            >
          </Select>
          <!-- <InputNumber style="width:50px" :max="50" :min="10" v-model="pageData.titleFontSize"></InputNumber> -->
        </td>
      </tr>
      <tr>
        <td class="title">
          <!-- <span class="red">*</span> -->
          副标题
        </td>
        <td>
          <Input
            :maxlength="20"
            @on-focus="focus"
            placeholder="请填写副标题"
            @on-blur="blur"
            v-model="pageData.subtitle"
            size="small"
          ></Input>
        </td>
      </tr>

      <tr>
        <td class="title">背景颜色</td>
        <td>
          <ColorPicker v-model="pageData.backgroundColor" />
          <Input
            v-model="pageData.backgroundColor"
            placeholder="请填写颜色"
            style="width:100px"
          ></Input>
          <Button @click="backgroundColorReset" type="primary" size="small"
            >重置</Button
          >
        </td>
      </tr>
      <tr>
        <td class="title">导航名称</td>
        <td>
          <Input
            :maxlength="4"
            v-model="pageData.navigationName"
            size="small"
          ></Input>
        </td>
      </tr>
      <tr>
        <td class="title">是否导航名称icon自定义颜色</td>
        <td>
          <RadioGroup v-model="pageData.ifIconColor">
            <Radio label="T">是</Radio>
            <Radio label="F">否</Radio>
          </RadioGroup>
        </td>
      </tr>
      <tr v-if="pageData.ifIconColor=='T'">
        <td class="title">
          导航名称icon颜色
        </td>
        <td>
          <ColorPicker v-model="pageData.nameColor" />
          <Input
            v-model="pageData.nameColor"
            placeholder="请填写颜色"
            style="width:100px"
          ></Input>
          <Button @click="nameColorReset" type="primary" size="small"
            >重置</Button
          >
        </td>
      </tr>
      <tr v-if="pageData.ifIconColor=='T'">
        <td class="title">
          导航名称icon背景色
        </td>
        <td>
          <ColorPicker v-model="pageData.nameBgColor" />
          <Input
            v-model="pageData.nameBgColor"
            placeholder="请填写颜色"
            style="width:100px"
          ></Input>
          <Button @click="nameBgColorReset" type="primary" size="small"
            >重置</Button
          >
        </td>
      </tr>
      <!-- <tr>
        <td class="title">导航名称箭头图片</td>
        <td>
          <div class="shop-info-img">
            <template v-if="pageData.navigationNamePic">
              <img class="img-show" :src="pageData.navigationNamePic" alt="" />
              <div class="cover-del">
                <Icon
                  @click="navigationNamePicDel"
                  class="del-svg"
                  type="ios-trash-outline"
                ></Icon>
              </div>
            </template>
            <Upload
              v-else
              class="img-up"
              :format="['jpg', 'jpeg', 'png']"
              :on-success="backImgUrl"
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
        </td>
      </tr> -->
      <!-- <tr>
        <td class="title">
          导航位置
        </td>
        <td>
          <RadioGroup v-model="pageData.navigationNamePosition">
            <Radio label="left">居左</Radio>
            <Radio label="center">居中</Radio>
            <Radio label="right">居右</Radio>
          </RadioGroup>
        </td>
      </tr> -->
      <tr>
        <td class="title">链接</td>
        <td>
          <custom-link :itemData="pageData"></custom-link>
          <!-- <Select placeholder='设置链接页面' size='small' v-model="pageData.linkUrl">
            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select> -->
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import customLink from "@/components/otherRouter/custompageLink";
// import { mapState } from "vuex";
import { mapActions, mapState } from "vuex";
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
      fontList: [
        {
          key: "12",
          value: "12px"
        },
        {
          key: "13",
          value: "13px"
        },
        {
          key: "14",
          value: "14px"
        },
        {
          key: "15",
          value: "15px"
        },
        {
          key: "16",
          value: "16px"
        },
        {
          key: "18",
          value: "18px"
        },
        {
          key: "20",
          value: "20px"
        },
        {
          key: "22",
          value: "22px"
        },
        {
          key: "24",
          value: "24px"
        },
        {
          key: "25",
          value: "25px"
        },
        {
          key: "26",
          value: "26px"
        },
        {
          key: "28",
          value: "28px"
        }
      ],
      activeIndex: null, //需要设置图片的下标
      // pageData: this.testData,
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
    titlePicDel() {
      this.pageData.titlePic = "";
      if (this.pageData.title == "") {
        this.setErrorShow(true);
      }
    },
    navigationNamePicDel() {
      this.pageData.navigationNamePic = "";
    },
    focus() {
      this.pageData.isFocus = true;
    },
    blur() {
      this.pageData.isFocus = false;
    },
    titleColorReset() {
      this.pageData.titleColor = "#413838";
    },
    backgroundColorReset() {
      this.pageData.backgroundColor = "#fff";
    },
    nameColorReset() {
      this.pageData.nameColor = "#413838";
    },
    nameBgColorReset() {
      this.pageData.nameBgColor = "#fff";
    },
    typeSelect(val) {
      this.pageData.type = val;
    },
    handleMaxSize() {},
    handleFormatError() {},
    setImgUrl(res, file) {
      this.pageData.titlePic = res.prefix + res.url;
      this.setErrorShow(false);
    },
    backImgUrl(res, file) {
      this.pageData.navigationNamePic = res.prefix + res.url;
    },
    del(index) {
      this.pageData.list.splice(index, 1);
    },
    delImg(index) {
      this.pageData.icon = "";
    },
    imgIndex(index) {
      this.activeIndex = index;
    },
    add() {
      this.pageData.list.push({
        picAddr: "",
        text: "",
        linkUrl: ""
      });
    },
    changeTitle() {
      if (this.pageData.title == "" && !this.pageData.titlePic) {
        this.setErrorShow(true);
      } else {
        this.setErrorShow(false);
      }
    },
    ...mapActions("defined", ["setErrorShow"])
  }
};
</script>
<style lang="scss">
.title-edit-box {
  .title{
    width: 100px !important;
  }
  .shop-info-img {
    height: 15px;
    max-width: 50px;
    position: relative;
    .img-up {
      border: 1px solid #d7d7d7;
      height: 30px;
      width: 30px;
      text-align: center;
      line-height: 30px;
      color: #3bb4f2;
      cursor: pointer;
      .ivu-upload.ivu-upload-select {
        width: 100%;
      }
    }
    .img-up.error {
      border-color: red;
      color: red;
    }
    .img-show {
      width: 100%;
      height: 100%;
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
        font-size: 16px;
        padding: 0 10px;
        cursor: pointer;
        margin-top: 0px;
      }
    }
  }
  .shop-info-img:hover .cover-del {
    display: block;
  }
}
</style>
