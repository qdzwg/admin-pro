<template>
  <div class="banner-edit-box" :class="{'banner2-yhyt':pageData.type=='banner2'}">
    <!-- {{pageData}} -->
    <div class="edit-notice">建议图片宽度750,高度200-950，支持类型:jpg、png。轮播图要求一组内的图片高度必须完全一致。</div>
    <table class="edit-table">
      <tr>
        <td class="title">
          <span class="red">*</span>
          模板样式
        </td>
        <td>
          <div class="banner-type-select">
            <!-- 轮播图 -->
            <Col span="8">
              <div
                class="type-item clearfix"
                @click="typeSelect('banner1')"
                :class="{active:pageData.type=='banner1'}"
              >
                <div class="type-item-box">轮播图</div>

                <!-- <img @click="typeSelect('banner1')" class="type-img fl" src="http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg" alt=""> -->
              </div>
            </Col>
            <!-- 一行一图 -->
            <Col span="8">
              <div
                class="type-item clearfix"
                @click="typeSelect('banner2')"
                :class="{active:pageData.type=='banner2'}"
              >
                <div class="type-item-box">一行一图</div>
                <!-- <img @click="typeSelect('banner2')" class="type-img fl" src="http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg" alt=""> -->
              </div>
            </Col>
            <!-- 横向滑动 -->
            <Col span="8">
              <div
                class="type-item clearfix"
                @click="typeSelect('banner3')"
                :class="{active:pageData.type=='banner3'}"
              >
                <div class="type-item-box">横向滑动</div>
                <!-- <img @click="typeSelect('banner3')" class="type-img fl" src="http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg" alt=""> -->
              </div>
            </Col>
            <!-- 单图横滑 -->
            <Col span="8" style="margin-top: 10px;">
              <div
                class="type-item clearfix"
                @click="typeSelect('banner4')"
                :class="{active:pageData.type=='banner4'}"
              >
                <div class="type-item-box">单图横滑</div>
              </div>
            </Col>
          </div>
        </td>
      </tr>
      <tr v-if="pageData.type=='banner2'">
        <td class="title">
          <span class="red">*</span>
          适应图片
        </td>
        <td>
          <RadioGroup @on-change="imgHeightAutoChange" v-model="pageData.imgHeightAuto">
            <Radio label="T">是</Radio>
            <Radio label="F">否</Radio>
          </RadioGroup>
        </td>
      </tr>
      <tr>
        <td class="title">
          <span class="red">*</span>
          图片填充
        </td>
        <td>
          <RadioGroup v-model="pageData.imgFill">
            <Radio label="fill">填充</Radio>
            <Radio label="white">留白</Radio>
          </RadioGroup>
        </td>
      </tr>
      <tr>
        <td class="title">
          <span class="red">*</span>
          图片倒角
        </td>
        <td>
          <RadioGroup v-model="pageData.imgRadius">
            <Radio label="normal">直角</Radio>
            <Radio label="special">圆角</Radio>
          </RadioGroup>
        </td>
      </tr>
      <tr>
        <td style="width:80px" class="title">是否隐藏文字</td>
        <td>
          <RadioGroup v-model="pageData.hideText">
            <Radio label="T">是</Radio>
            <Radio label="F">否</Radio>
          </RadioGroup>
        </td>
      </tr>
      <tr>
        <td style="width:80px" class="title">轮播图背景</td>
        <td>
          <div class='shop-info-img'>
            <template v-if='pageData&&pageData.casaulBackUrl'>
              <img class="img-show" :src="pageData.casaulBackUrl" alt="">
              <div class="cover-del">
                <Icon @click="casaulBackUrlDel" class="del-svg" type="ios-trash-outline"></Icon>
              </div>
            </template>
            <Upload v-else class="img-up" :format="['jpg','jpeg','png']" :on-success="casaulImgUrl" :show-upload-list="false" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" action="/static/manage/uiFileUpload/dispatch?action=upload">
              <Icon class="add-icon" type="ios-plus-outline" size='14'></Icon>
            </Upload>
          </div>
        </td>
      </tr>
    </table>
    <div v-if="pageData.list&&pageData.list.length" class="img-text-list">
      <draggable
        :list="pageData.list"
        :options="{animation:150,disabled:disabled}"
        :no-transition-on-drag="true"
      >
        <div v-for="(item,index) in pageData.list" :key="index" class="img-text-item clearfix">
          <!-- {{item}} -->
          <Icon @click="del(index)" type="close-circled del-icon"></Icon>
          <div
            v-if="pageData.type=='banner2'"
            @click="hotSetModalShow(index)"
            class="fl hot-link-set"
          >点击设置热度链接</div>
          <div class="img-show fl" v-if="item.picAddr">
            <img class="img" :src="item.picAddr" alt />
            <div @click="imgIndex(index)" class="del-cover">
              <!-- <Icon class="trash-icon" @click="delImg(index)" type="ios-trash-outline"></Icon> -->
              <Upload
                :format="['jpg','jpeg','png']"
                :on-success="setImgUrl"
                :show-upload-list="false"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                action="/static/manage/uiFileUpload/dispatch?action=upload"
              >
                <!-- <Icon class="add-icon" type="ios-plus-outline" color='#3BB4F2' size='14'></Icon> -->
                <span class="change">更换图片</span>
              </Upload>
            </div>
          </div>
          <div v-else @click="imgIndex(index)" class="img-add fl">
            <Upload
              :format="['jpg','jpeg','png']"
              :on-success="setImgUrl"
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
          <div class="fl text">文字链接</div>
          <div class="fl link-text">
            <div>
              <Input
                @on-focus="disabled=true"
                @on-blur="disabled=false"
                v-model="item.title"
                size="small"
              ></Input>
            </div>
            <div class="link">
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
      v-if="pageData.list.length<5"
      class="upload-img-btn"
      :format="['jpg','jpeg','png']"
      :on-success="addBanner"
      :show-upload-list="false"
      :max-size="2048"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      action="/static/manage/uiFileUpload/dispatch?action=upload"
    >
      <Icon class="add-icon" type="ios-plus-outline" color="#3BB4F2" size="14"></Icon>添加一个图片广告
    </Upload>
    <div class="add-notice">最多支持添加5个广告，拖动选中的广告可对其排序</div>
    <Modal :mask-closable="false" class="hot-link-modal" width="800" v-model="modal" title="热区编辑器">
      <Steps size="small" :current="111">
        <Step title="添加热区" content></Step>
        <Step title="调整热区大小及位置" content></Step>
        <Step title="设置关联链接" content></Step>
        <Step title="保存生效" content></Step>
      </Steps>
      <template>
        <div v-if="modal" @click="toggleFalg=false" ref="hotWarper" class="hot-warper">
          <img
            class="hot-img"
            ondragenter="return false"
            :style="{height:pageData.imgHeightAuto=='F'?'347px':'auto'}"
            :src="hotImg"
            alt
          />
          <template v-for="(item,index) in pageData.list[addIndex].hotList">
            <vue-draggable-resizable
              :minWidth="100"
              :minHeight="60"
              :w="item.width"
              :h="item.height"
              :x="item.left"
              :y="item.top"
              @dragging="onDrag"
              @resizing="onResize"
              @activated="onActivated(index)"
              :key="index"
              :parent="true"
            >
              <div
                class="hot-box"
                @dblclick="linkModalShow(index)"
                :style="{background:item.color}"
              >
                <div class="hot-text">
                  <template v-if="item.linkUrl">
                    <div>{{getName(item.linkUrl)}}</div>
                  </template>
                  <template v-else>
                    <div>双击设置</div>
                    <div>关联链接</div>
                  </template>
                </div>

                <Icon @click.stop="boxDel(index)" type="close-circled del-icon"></Icon>
              </div>
            </vue-draggable-resizable>
          </template>
        </div>
      </template>

      <div slot="footer">
        <Button @click="hotBoxAdd" type="primary">添加热区</Button>
        <!-- <Button @click="modal=false">保存</Button> -->
      </div>
    </Modal>
    <Modal width="300" class="hot-linkselect-modal" v-model="modal1" title="设置链接">
      <custom-link
        v-if="pageData.list[addIndex]&&pageData.list[addIndex].hotList[linkUrlIndex]"
        :itemData="pageData.list[addIndex].hotList[linkUrlIndex]"
      ></custom-link>
      <div slot="footer">
        <Button type="primary" @click="modal1=false">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import VueDraggableResizable from "vue-draggable-resizable";
import draggable from "vuedraggable";
import customLink from "@/components/otherRouter/custompageLink";
import { mapState } from "vuex";
import { parse } from "path";
import { linkList } from "@/common/data";
import { customLinkObj } from "@/common/data";
import "vue-draggable-resizable/dist/VueDraggableResizable.css";
export default {
  components: {
    draggable,
    customLink,
    VueDraggableResizable
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
      // console.log('this.list2[this.index].data', this.list2[this.index].data);
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
      warperHeight: null,
      linkUrlIndex: 0,
      modal1: false,
      handleIndex: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      addIndex: 0,
      pointerPosition: {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        zIndex: 0
      },
      toggleFalg: false,
      distance: 0,
      position: {
        x: 0,
        y: 0
      },
      pointerPosition: {
        x: 0,
        y: 0
      },
      zIndex: 1,
      hotImg: "",
      modal: false,
      disabled: false,
      activeIndex: null, //需要设置图片的下标
      // pageData: this.data,
      disabledGroup: "fill",
      typeList: [
        {
          businessType: "ticket",
          name: "景区门票"
        },
        {
          businessType: "hotel",
          name: "酒店"
        },
        {
          businessType: "shop",
          name: "特色商品"
        },
        {
          businessType: "strategy",
          name: "游玩攻略"
        },
        {
          businessType: "route",
          name: "跟团游"
        },
        {
          businessType: "repast",
          name: "餐饮"
        }
      ]
    };
  },
  methods: {
    imgHeightAutoChange(val) {
      if (val == "T") {
        //说明是固定高度变成自适应高度
        this.topChange(true);
      } else {
        //自适应变成固定高度
        this.topChange(false);
      }
    },
    getName(url) {
      let item = linkList.find(item => {
        return url == item.value;
      });
      // console.log(item);
      return item.label ? item.label : "";
    },
    realChange(index, w, h, flag) {
      //flag是true的时候代表固定高度变成自适应高度
      //flag是fales的时候代表自适应高度变为固定高度
      //
      //自适应高度
      let autoHeight = parseFloat(((750 * (h * 100)) / (w * 100)).toFixed(2));
      // console.log(autoHeight)
      //固定高度
      let fixedHeight = 347;
      let ratio = flag
        ? (autoHeight * 100) / (fixedHeight * 100)
        : (fixedHeight * 100) / (autoHeight * 100);
      ratio = parseFloat(ratio.toFixed(3));
      this.pageData.list[index].hotList.forEach((item, i) => {
        // 比例计算
        this.pageData.list[index].hotList[i].top = parseFloat(
          ((item.top * (ratio * 1000)) / 1000).toFixed(2)
        );
        this.pageData.list[index].hotList[i].height = parseFloat(
          ((item.height * (ratio * 1000)) / 1000).toFixed(2)
        );
      });
      // console.log(this.pageData.list[index].hotList);
    },
    topChange(flag) {
      //固定高度变成自适应高度
      let _this = this;
      this.pageData.list.forEach((item, index) => {
        // console.log(item);
        if (item.orginWidth && item.orginHeight) {
          //说明是新数据
          _this.realChange(index, item.orginWidth, item.orginHeight, flag);
        } else {
          //说明是老数据
          let img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = function() {
            _this.pageData.list[index].orginWidth = parseFloat(
              this.width.toFixed(2)
            );
            _this.pageData.list[index].orginHeight = parseFloat(
              this.height.toFixed(2)
            );
            _this.realChange(
              index,
              parseFloat(this.width.toFixed(2)),
              parseFloat(this.height.toFixed(2)),
              flag
            );
          };
          img.src = item.picAddr;
        }
      });
    },
    linkModalShow(index) {
      this.linkUrlIndex = index;
      this.pageData.list[this.addIndex].hotList[index].popShow = true;
      this.modal1 = true;
    },
    boxDel(index) {
      this.pageData.list[this.addIndex].hotList.splice(index, 1);
      this.$Message.success("删除成功！");
    },
    onActivated(index) {
      this.handleIndex = index;
    },
    onResize(x, y, width, height) {
      this.moveFlag = true;
      this.pageData.list[this.addIndex].hotList[this.handleIndex].left = x;
      this.pageData.list[this.addIndex].hotList[this.handleIndex].top = y;
      this.pageData.list[this.addIndex].hotList[this.handleIndex].width = width;
      this.pageData.list[this.addIndex].hotList[
        this.handleIndex
      ].height = height;
    },
    onDrag(x, y) {
      this.moveFlag = true;
      this.pageData.list[this.addIndex].hotList[this.handleIndex].left = x;
      this.pageData.list[this.addIndex].hotList[this.handleIndex].top = y;
    },
    hotBoxAdd(index) {
      if (this.pageData.list[this.addIndex].hotList.length > 30) {
        this.$Message.warning("最多只能添加30个热区");
      } else {
        this.pageData.list[this.addIndex].hotList.push(
          Object.assign(
            {
              popShow: false,
              width: 100,
              height: 60,
              left: 0,
              top: 0,
              color: this.getColor(),
              zIndex: this.pageData.list[this.addIndex].hotList.length + 1
            },
            customLinkObj
          )
        );
        this.zIndex++;
      }
    },
    getColor() {
      let a = parseInt(Math.random() * 255);
      let b = parseInt(Math.random() * 255);
      let c = parseInt(Math.random() * 255);
      return "rgba(" + a + "," + b + "," + c + ",0.5)";
    },
    hotSetModalShow(index) {
      this.modal = true;
      this.addIndex = index;
      if (this.pageData.list[index].picAddr) {
        this.hotImg = this.pageData.list[index].picAddr;
        // console.log(this.pageData.list[index]);
        this.$nextTick(() => {
          //计算hot-warper的高度
          this.warperHeight = $(".hot-img").height();
          // console.log(this.warperHeight);
          // console.log(this.warperHeight)
          $(".hot-img").on("mousedown", function(e) {
            e.preventDefault();
          });
        });
      } else {
        this.$Notice.warning("请先上传图片");
      }
    },
    addBanner(res, file) {
      let _this = this;
      let url = res.prefix + res.url;
      let img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function() {
        // console.log(this.width);
        // console.log(this.height);
        _this.pageData.list.push(
          Object.assign(
            {
              orginWidth: parseFloat(this.width.toFixed(2)),
              orginHeight: parseFloat(this.height.toFixed(2)),
              picAddr: url,
              title: "",
              hotList: []
            },
            customLinkObj
          )
        );
      };
      img.src = url;
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
      this.pageData.list[this.activeIndex].hotList = [];
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
    casaulBackUrlDel() {
      this.pageData.casaulBackUrl = "";
    },
    casaulImgUrl(res, file) {
      this.pageData.casaulBackUrl = res.prefix + res.url;
    },
  }
};
</script>
<style lang='scss'>
.hot-linkselect-modal {
  .ivu-modal-mask {
    z-index: 999;
  }
  .ivu-modal-wrap {
    z-index: 999;
  }
}
.hot-link-modal {
  .ivu-modal-mask {
    z-index: 998;
  }
  .ivu-modal-wrap {
    z-index: 998;
  }
  .hot-warper {
    display: inline-block;
    margin: 0 auto;
    margin-top: 10px;
    position: relative;
    .hot-box {
      width: 100%;
      height: 100%;
      position: relative;
      .hot-text {
        width: 100%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 12px;
        color: #fff;
        text-align: center;
      }
      &:hover {
        .del-icon {
          display: block;
        }
      }
      .del-icon {
        position: absolute;
        top: -8px;
        right: -8px;
        font-size: 18px;
        color: #f05b47;
        cursor: pointer;
        display: none;
      }
    }
    .hot-img {
      width: 750px;
      height: auto;
      display: block;
    }
    .imagescale-box {
      position: absolute;

      .imagescale-pointer0 {
        cursor: nw-resize;
        top: 0;
        margin-top: -4px;
        left: 0;
        margin-left: -4px;
      }
      .imagescale-pointer1 {
        cursor: n-resize;
        top: 0;
        margin-top: -4px;
        left: 50%;
        margin-left: -4px;
      }
      .imagescale-pointer2 {
        cursor: ne-resize;
        top: 0;
        margin-top: -4px;
        left: 100%;
        margin-left: -3px;
      }
      .imagescale-pointer3 {
        cursor: w-resize;
        top: 50%;
        margin-top: -4px;
        left: 0;
        margin-left: -4px;
      }
      .imagescale-pointer4 {
        cursor: e-resize;
        top: 50%;
        margin-top: -4px;
        left: 100%;
        margin-left: -3px;
      }
      .imagescale-pointer5 {
        cursor: sw-resize;
        top: 100%;
        margin-top: -3px;
        left: 0;
        margin-left: -4px;
      }
      .imagescale-pointer6 {
        cursor: s-resize;
        top: 100%;
        margin-top: -3px;
        left: 50%;
        margin-left: -4px;
      }
      .imagescale-pointer7 {
        cursor: se-resize;
        top: 100%;
        margin-top: -3px;
        left: 100%;
        margin-left: -3px;
      }
      .pointer {
        position: absolute;
        width: 6px;
        height: 6px;
        overflow: hidden;
        font-size: 0px;
        display: block;
        background-color: #3c9dd0;
      }
    }
  }
}
.banner-edit-box {
  .hot-link-set {
    width: 28px;
    line-height: 14px;
    color: blue;
    cursor: pointer;
  }
  &.banner2-yhyt {
    .img-text-list {
      .img-text-item {
        .link-text {
          width: calc(100% - 125px);
        }
      }
    }
  }

  .add-notice {
    margin-top: 10px;
  }
  .upload-img-btn {
    margin-top: 10px;
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
  .shop-info-img {
    // height: 75px;
    height: 15px;
    width: 150px;
    // border: 1px solid red;
    position: relative;
    .img-up {
      border: 1px solid #d7d7d7;
      height: 15px;
      width: 150px;
      text-align: center;
      line-height: 15px;
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
      // line-height: 75px;
      .del-svg {
        color: #fff;
        font-size: 10px;
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

