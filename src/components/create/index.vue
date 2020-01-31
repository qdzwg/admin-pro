<template>
  <div class="create-warper clearfix">
    <div style="height:calc(100% - 52px)">
      <Col class="component-list" span="8">
        <div class="title">基础模板</div>
        <draggable
          @remove="remove"
          @start="comStart"
          :list="list1"
          :options="{
            sort: false,
            group: { name: 'people', pull: 'clone', put: false },
            animation: 150
          }"
          :no-transition-on-drag="true"
        >
          <div
            class="component-item"
            v-for="(element, index) in list1"
            :key="index"
          >
            <div
              class="component-content"
              @click="componentItemClick(element)"
              :class="{
                'layer-component-item':
                  isAddLayer && element.data.category == 'layer'
              }"
            >
              <i class="xx-icon component-icon" :class="element.icon"></i>
              <!--如果添加了弹框组，展示显示或隐藏-->
              <template v-if="isAddLayer && element.data.category == 'layer'">
                <i
                  v-if="isShowLayer"
                  class="xx-icon component-icon component-icon1 icon-xianshi"
                ></i>
                <i
                  v-else
                  class="xx-icon component-icon component-icon1 icon-yincang"
                ></i>
              </template>
              <div class="text">{{ element.name }}</div>
            </div>
            <div class="remove-content">模块放置区域</div>
          </div>
        </draggable>
        <!-- {{pageSetData}} -->
        <!-- {{list2}} -->
      </Col>
      <Col span="16" class="page-head-box">
        <!-- {{isLocal}} -->
        <!-- <div v-if='isLocal&&isEditPage' class="use-local"> -->
        <div v-if="isLocal" class="use-local">
          <div class="use-local-box clearfix">
            <span>浏览器中有未保存的内容，是否使用该内容替换当前页面？</span>
            <Button class="use-btn" size="small" @click="useLocal">使用</Button>
            <Icon @click="noUseLocal" type="close-circled fr close-svg"></Icon>
          </div>
        </div>
        <div
          @click="headEdit"
          class="page-head"
          :style="{ 'background-image': headImgUrl }"
        >
          <div class="customPage-page-title">{{ pageSetData.title }}</div>
          <div v-if="headShow" @click.stop="stop" class="head-edit-box">
            <div class="head-edit-title">
              页面设置
              <Icon
                class="name-icon"
                type="ios-information-outline"
                size="14"
              ></Icon>
            </div>
            <div class="head-edit-body">
              <table class="head-set">
                <tr>
                  <td class="title">页面名称</td>
                  <td>
                    <Input
                      :maxlength="12"
                      v-model="pageSetData.title"
                      size="small"
                    ></Input>
                  </td>
                </tr>
                <tr>
                  <td
                    style="vertical-align: top;padding-top: 8px;"
                    class="title"
                  >
                    页面描述
                  </td>
                  <td>
                    <Input v-model="pageSetData.describe" size="small"></Input>
                    <p style="margin-top:5px;color:red">
                      页面分享给好友时，会自动展示页面描述
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="vertical-align: top;" class="title">页面背景</td>
                  <td>
                    <!-- {{pageSetData}} -->
                    <!-- {{pageSetData.backgroundSet}} -->
                    <RadioGroup
                      @on-change="backgroundTypeChange"
                      v-model="pageSetData.backgroundSet"
                    >
                      <Radio label="default">默认背景色</Radio>
                      <Radio label="custom">自定义背景色</Radio>
                      <Radio label="customBgImg">自定义背景图</Radio>
                    </RadioGroup>
                    <div
                      style="margin-top:10px"
                      v-if="pageSetData.backgroundSet == 'custom'"
                    >
                      <ColorPicker v-model="pageSetData.color1" />
                      <Input
                        v-model="pageSetData.color1"
                        placeholder="请填写颜色"
                        style="width:100px"
                      ></Input>
                    </div>
                    <div v-if="pageSetData.backgroundSet == 'customBgImg'">
                      <div class="img-cover-box" v-if="pageSetData.bgImg">
                        <img
                          style="height:60px;width:100px;"
                          :src="pageSetData.bgImg"
                          alt
                        />
                        <div class="tag-cover">
                          <Icon
                            class="trash-icon"
                            @click="delImgUrl"
                            type="ios-trash-outline"
                          ></Icon>
                        </div>
                      </div>
                      <div v-else class="img-up-box">
                        <Upload
                          :format="['jpg', 'jpeg', 'png']"
                          :on-success="setImgUrl"
                          :show-upload-list="false"
                          :max-size="2048"
                          :on-format-error="handleFormatError"
                          :on-exceeded-size="handleMaxSize"
                          action="/static/manage/uiFileUpload/dispatch?action=upload"
                        >
                          <Icon
                            class="add-icon"
                            type="ios-plus-outline"
                            color="#3BB4F2"
                            size="14"
                          ></Icon>
                          <span class="text">添加图片</span>
                        </Upload>
                      </div>
                      <p style="margin-top:5px">建议上传尺寸750X310px的图片</p>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <!-- 头部编辑页面不作为组件单独处理 -->
      </Col>
      <Col span="16" class="component-ul">
        <!-- background:(pageSetData.backgroundSet!='default'&&list2.length>0)?pageSetData.color1:'#f7f7f7', -->
        <draggable
          class="draggable-box"
          :style="{
            background:
              pageSetData.backgroundSet == 'customBgImg' && list2.length > 0
                ? pageSetData.bgImg
                  ? 'url(' +
                    pageSetData.bgImg +
                    ')' +
                    ' top center no-repeat'
                  : ''
                : pageSetData.color1,
                backgroundSize: pageSetData.bgImg ? 'contain' : ''
          }"
          @end="onEnd"
          @start="comStart"
          :list="list2"
          :options="{ group: 'people', animation: 150, disabled: vuxDisabled }"
          :no-transition-on-drag="true"
        >
          <template v-for="(item, index) in list2">
            <!--弹框组件，有动画-->
            <transition name="fade" v-if="item.category == 'layer'">
              <div
                class="component-li"
                v-show="isShowLayer"
                :class="[
                  { 'hide-bottom': item.hideBottom },
                  item.componentClass
                ]"
              >
                <div @click="edit(index)" class="component-content">
                  <div
                    class="left"
                    :style="{
                      'border-color':
                        pageSetData.backgroundSet == 'customBgImg'
                          ? 'transparent'
                          : pageSetData.color1
                    }"
                    :class="{ 'active-left': editIndex == index }"
                  >
                    <left-show :data="item"></left-show>
                    <!-- <div class="component-item" v-for="(element,index) in list1" :key="index">
                      <div class="component-content">
                        <i class="xx-icon component-icon" :class='element.icon'></i>
                        <div class="text">{{element.name}}</div>
                      </div>
                      <div class="remove-content">模块放置区域</div>
                    </div>-->
                  </div>
                  <div v-if="editIndex == index" class="right">
                    <div class="right-option">
                      <div class="option-item" @click.stop="indexDel(index)">
                        <Icon class="option-icon" type="trash-a"></Icon>
                      </div>
                    </div>
                    <!-- <div class="right-component-edit">
                      <right-edit :data='item'></right-edit>
                    </div>-->
                  </div>
                </div>
              </div>
            </transition>
            <div
              v-else
              class="component-li"
              :class="[{ 'hide-bottom': item.hideBottom }]"
            >
              <div @click="edit(index)" class="component-content">
                <div
                  class="left"
                  :style="{
                    'border-color':
                      pageSetData.backgroundSet == 'customBgImg'
                        ? 'transparent'
                        : pageSetData.color1
                  }"
                  :class="{ 'active-left': editIndex == index }"
                >
                  <left-show :data="item"></left-show>
                  <!-- <div class="component-item" v-for="(element,index) in list1" :key="index">
                    <div class="component-content">
                      <i class="xx-icon component-icon" :class='element.icon'></i>
                      <div class="text">{{element.name}}</div>
                    </div>
                    <div class="remove-content">模块放置区域</div>
                  </div>-->
                </div>
                <div v-if="editIndex == index" class="right">
                  <div class="right-option">
                    <div
                      v-if="index != list2.length - 1"
                      class="option-item"
                      @click.stop="hideBottom(index)"
                    >
                      <i class="xx-icon icon-quxiaojianju1 option-icon"></i>
                      <!-- <Icon style="font-size:14px" class="option-icon" type="chevron-up"></Icon> -->
                    </div>
                    <div
                      class="option-item"
                      :class="{ 'no-action': index == 0 }"
                      @click.stop="up(index)"
                    >
                      <Icon class="option-icon" type="arrow-up-a"></Icon>
                    </div>
                    <div
                      class="option-item"
                      :class="{ 'no-action': index == list2.length - 1 }"
                      @click.stop="down(index)"
                    >
                      <Icon class="option-icon" type="arrow-down-a"></Icon>
                    </div>
                    <div class="option-item" @click.stop="indexDel(index)">
                      <Icon class="option-icon" type="trash-a"></Icon>
                    </div>
                  </div>
                  <!-- <div class="right-component-edit">
                    <right-edit :data='item'></right-edit>
                  </div>-->
                </div>
              </div>
            </div>
          </template>
          <div v-if="!list2.length" class="no-components">
            <img src="../../assets/images/no-com.png" alt />
            <div class="text">未添加任何模块</div>
            <div class="text">请将左侧模块拖动到这里开始装修</div>
          </div>
        </draggable>
        <div style="height:250px">
          <!-- 处理底部撑开无法添加到最后组件的功能 -->
        </div>
        <div
          v-if="!headShow && list2.length && (editIndex || editIndex == 0)"
          class="user-edit-box"
          :style="{ top: editComTop + 'px' }"
        >
          <right-edit :index="editIndex" :data="list2[editIndex]"></right-edit>
        </div>
      </Col>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import leftShow from "./userDefinedComponents/leftShow";
import rightEdit from "./userDefinedComponents/rightEdit";
import { apiPost, apiGet, apiPostJson } from "@/fetch/api";
import { mapActions, mapState } from "vuex";
import { customLinkObj } from "@/common/data";

export default {
  components: {
    draggable,
    leftShow,
    rightEdit
    // ueditor
  },
  created() {
    // 默认本地是不能缓存信息的，只有在编辑页面发生改变或是新增页面的时候才能缓存
    // localStorage.setItem("xjsc_local_is_use_2018_11_12", "F");
    // 判断是基础模板编辑还是自定义模板编辑
    if (this.$route.name == "template-add-edit") {
      this.custompageTemplate = true;
    } else {
      this.custompageTemplate = false;
    }
    // 重置vuex中的list
    this.reset([]);
    // apiGet("/admin/api/pluginsIcon/selectList");
    // 重置editIndex
    this.setEditIndex(null);
  },
  mounted() {
    let _this = this;
    this.setDefine(true);
    // console.log("mounted");
    // 获取上次的页面类型
    let oldPageType = localStorage.getItem("curentPageType");
    let oldId = localStorage.getItem("curentPageId_xjsc");
    // 如果上次使用的是编辑页面当前这次又是新增页面就不用缓存并且清除缓存

    if (oldPageType == "edit" && !this.$route.query.id) {
      localStorage.removeItem("userDefinedList");
    } else if (oldPageType == "edit" && this.$route.query.id) {
      // 上次使用的是编辑页面，当前又是编辑页面
      // 前后两次编辑页面ID相同，就提取缓存，否则删除缓存
      if (oldId == this.$route.query.id) {
        let userDefinedList = localStorage.getItem("userDefinedList");
        if (userDefinedList) {
          this.arr = JSON.parse(userDefinedList);
          if (this.arr && this.arr.length) {
            this.isLocal = true;
          }
        }
      } else {
        localStorage.removeItem("userDefinedList");
      }
    } else if (oldPageType == "save") {
      // 上个页面是保存成功的页面，则不用本地缓存
      localStorage.removeItem("userDefinedList");
    } else {
      let userDefinedList = localStorage.getItem("userDefinedList");
      if (userDefinedList) {
        this.arr = JSON.parse(userDefinedList);
        if (this.arr && this.arr.length) {
          this.isLocal = true;
        }
      }
    }
    // 本地缓存当前页面是编辑还是新增页面
    localStorage.setItem(
      "curentPageType",
      this.$route.query.id ? "edit" : "add"
    );
    // 本地缓存当前页面是编辑页面的Id
    localStorage.setItem("curentPageId_xjsc", this.$route.query.id);
    // localStorage.removeItem("userDefinedList");
    window.onunload = function(e) {
      // 监听浏览器离开，关闭事件(页面路由图改变无法触发)
      var e = window.event || e;
      if (_this.list2 && _this.list2.length) {
        if (_this.isEditPage) {
          // 新增页面
          localStorage.setItem("userDefinedList", JSON.stringify(_this.list2));
        } else {
          // 编辑页面
          if (localStorage.getItem("xjsc_local_is_use_2018_11_12") == "T") {
            // 编辑已经发生改变了
            localStorage.setItem(
              "userDefinedList",
              JSON.stringify(_this.list2)
            );
          } else {
            localStorage.setItem("userDefinedList", []);
          }
        }
      }
    };
  },
  destroyed() {
    this.setDefine(false); // 暂时没作用
    if (this.list2 && this.list2.length) {
      localStorage.setItem(
        "testasdadsadadazzzz",
        localStorage.getItem("xjsc_local_is_use_2018_11_12")
      );
      localStorage.setItem("userDefinedList", JSON.stringify(this.list2));
      // localStorage.setItem("testzzzz11", "testzzzz11");
    }
  },
  computed: {
    ...mapState({
      list2: state => {
        //   console.log(state)
        return state.defined.list;
      },
      test: state => {
        return state.defined;
      },
      vuxDisabled: state => {
        return state.defined.vuxDisabled;
      },
      editIndex: state => {
        return state.defined.editIndex;
        // return this.$store.state.userDefinded.editIndex
      },
      isShowLayer: state => {
        return state.defined.isShowLayer;
        // return this.$store.state.userDefinded.editIndex
      }
    })
  },
  watch: {
    list2: {
      handler(val) {
        // 只有在编辑页面，切不变的时候才不需要就缓存信息
        // 编辑页面(基础模板和自定义页面编辑页面)，只有在原有数据改变的时候才会这么处理
        // 目前，有2次改变记录是编辑页面必定发生的
        this.initNum++;
        if (this.initNum > 2 && !this.isEditPage) {
          // 改变次数大于2并且是编辑页面的时候，这个时候，页面才会缓存本地信息
          // 缓存本地信息是要可以存的，暂时用本地缓存
          localStorage.setItem("xjsc_local_is_use_2018_11_12", "T");
        }
      },
      deep: true
    },
    editIndex(val) {
      // console.log(val)
      // 将组件对应的编辑下标设置到vuex状态里面
      // console.log(val);
      if (val || val == 0) {
        let errList = $(".draggable-box .component-li");
        if (errList.length > 0) {
          this.$nextTick(() => {
            let scroll_offset = errList.eq(val).offset().top;
            // 第一个组价top值
            let testTop = errList.eq(0).offset().top;

            // 弹窗组件，特殊处理
            if (errList.eq(val).hasClass("my-layer-box")) {
              scroll_offset = errList
                .eq(val)
                .find(".component-content")
                .offset().top;
            }
            this.editComTop = scroll_offset - testTop;
          });
        }
      }
    }
  },
  data() {
    return {
      initNum: 0,
      isEditPage: true, // 是够是编辑页
      hideIndex: null,
      templateCode: "",
      codeArr: [
        "MTI20180316172401",
        "MTI20180316172801",
        "MTI20180316173101",
        "MTI18062213232769",
        "MTI18111911405880"
      ],
      startLength: 0,
      pageType: "customPage",
      checkVal: true,
      custompageTemplate: null, // 是否是基础模板编辑
      arr: [],
      editComTop: null,
      testFlag: true,
      isLocal: false,
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 200
      },
      pageSetData: {
        color1: "#f7f7f7",
        bgImg: "",
        backgroundSet: "default",
        describe: "",
        title: "页面标题"
      },
      isAddLayer: false, // 是否添加了弹窗广告，一个页面只能添加一个弹窗广告。
      headShow: false, // 头部编辑页是否显示
      // editIndex: null,
      value1: 0,
      headImgUrl: "url(" + require("../../assets/images/top.jpg") + ")",
      list1: [
        {
          imgUrl:
            "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
          icon: "icon-tupian",
          name: "图片广告",
          data: {
            category: "banner", // 组件类型
            hideBottom: false,
            data: {
              type: "banner1", // 样式类型
              imgHeightAuto: "T",
              imgFill: "fill", // 图片填充
              hideText: "T", // 是否隐藏文字
              casaulBackUrl: "", //轮播图背景图
              list: []
            }
          }
        },
        {
          imgUrl:
            "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
          icon: "icon-chanpinfengfu",
          name: "图文导航",
          data: {
            category: "navigation", // 组件类型
            data: {
              type: "navigation1", // 样式类型
              backgroundColor: "#fff", // 背景颜色
              textColor: "#000", // 背景颜色
              activeBgUrl: "", //宋城导航选中背景图
              tagBgUrl: "", //宋城导航tag图标背景图
              list: [
                Object.assign(
                  {
                    picAddr: "",
                    title: "",
                    subtitle: "",
                    tagTitle: "",
                    itemSelectBg: "",
                    itemTagBg: "",
                    tagBgColor: "#413838",
                    tagColor: "#413838"
                  },
                  customLinkObj
                ),
                Object.assign(
                  {
                    picAddr: "",
                    title: "",
                    subtitle: "",
                    tagTitle: "",
                    itemSelectBg: "",
                    itemTagBg: "",
                    tagBgColor: "#413838",
                    tagColor: "#413838"
                  },
                  customLinkObj
                ),
                Object.assign(
                  {
                    picAddr: "",
                    title: "",
                    subtitle: "",
                    tagTitle: "",
                    itemSelectBg: "",
                    itemTagBg: "",
                    tagBgColor: "#413838",
                    tagColor: "#413838"
                  },
                  customLinkObj
                ),
                Object.assign(
                  {
                    picAddr: "",
                    title: "",
                    subtitle: "",
                    tagTitle: "",
                    itemSelectBg: "",
                    itemTagBg: "",
                    tagBgColor: "#413838",
                    tagColor: "#413838"
                  },
                  customLinkObj
                )
              ]
            }
          }
        },
        {
          imgUrl:
            "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
          icon: "icon-biaoti",
          name: "标题",
          data: {
            category: "title",
            data: {
              title: "", // 标题名称
              subtitle: "", // 副标题
              ifIconColor: 'F',
              position: "center", // 显示位置
              backgroundColor: "", // 背景颜色
              navigationName: "", // 导航名称
              titlePic: "", // 标题名称图片
              navigationNamePic: "", //导航名称图片
              linkUrl: "", // 链接
              isFocus: false
            }
          }
        },
        {
          imgUrl:
            "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
          icon: "icon-sousuo-m",
          name: "搜索框",
          data: {
            category: "banner4",
            list: []
          }
        },
        {
          imgUrl:
            "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
          icon: "icon-tupian",
          name: "富文本",
          data: {
            category: "banner5",
            list: []
          }
        },
        {
          imgUrl:
            "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
          icon: "icon-fenzubuju",
          name: "自由布局",
          data: {
            category: "freeLayout",
            list: [],
            casaulList: [],
            height: 0, //左右间距
            imgHeightAuto: "F", //适应图片
            hideText: "T", //是否隐藏文字
            bgTransparent: "F", // 背景透明
            mainImgWidth: 65 //主图宽度百分比
          }
        },
        {
          imgUrl:
            "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
          icon: "icon-shebeifenzuguanli",
          name: "产品分组",
          data: {
            pxType: "all",
            category: "banner7",
            list: []
          }
        },
        {
          imgUrl:
            "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
          icon: "icon-remove_from_queue",
          name: "产品",
          data: {
            category: "product",
            data: {
              // type: "product1", //样式
              pxType: "all",
              listType: "type1",
              productTag: "str1",
              tagUrl: "",
              list: []
            }
          }
        },
        {
          imgUrl:
            "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
          icon: "icon-font60",
          name: "公告",
          data: {
            category: "notice",
            data: {
              content: "",
              textColor: "#999",
              backgroundColor: "#fff"
            }
          }
        },
        {
          imgUrl:
            "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
          icon: "icon-dianpu-copy",
          name: "店招",
          data: {
            category: "shopinfo",
            data: {
              name: "",
              textColor: "#999",
              introduction: "",
              tel: "",
              logoUrl: "",
              backUrl: ""
            }
          }
        },
        {
          imgUrl:
            "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
          icon: "icon-wenben",
          name: "文本",
          data: {
            category: "text",
            data: {
              content: "",
              textColor: "#999",
              backgroundColor: "#fff",
              fontSize: "14px",
              position: "left",
              linkUrl: ""
            }
          }
        },
        {
          imgUrl:
            "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
          icon: "icon-fengexian",
          name: "辅助线",
          data: {
            category: "subline",
            data: {
              sideWidth: "type1",
              style: "solid",
              lineColor: "#999"
            }
          }
        },
        {
          imgUrl:
            "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
          icon: "icon-xukuang",
          name: "辅助空白",
          data: {
            category: "subBlank",
            data: {
              height: 0,
              backgroundColor: "#fff"
            }
          }
        },
        {
          imgUrl:
            "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
          icon: "icon-tianqi",
          name: "天气",
          data: {
            category: "weather",
            data: {
              provinceCode: "110000",
              province: "北京市",
              cityCode: "110100",
              city: "市辖区",
              areaCode: "110101",
              area: "东城区",
              weather: "",
              temperature: "",
              backgroundColor: "#999"
            }
          }
        },
        {
          imgUrl:
            "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
          icon: "icon-gonglve11",
          name: "攻略",
          data: {
            category: "strategy",
            data: {
              imgList: [],
              listType: "singleRow",
              textShow: [],
              position: "lb",
              dataList: [],
              tagArr: [],
              imgArr: []
            }
          }
        },
        // {
        //   imgUrl:
        //     "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
        //   icon: "icon-gonglve11",
        //   name: "攻略分组",
        //   data: {
        //     category: "strategyGroup",
        //     data: {
        //       type: "productGroup1", // 样式
        //       pxType: "all",
        //       menuType: "type1",
        //       activeColor: "#f05b47",
        //       pageInteraction: "normal",
        //       listType: "singleRow",
        //       textType: ["productName"],
        //       list: [
        //         {
        //           groupName: "组名",
        //           dataList: [],
        //           imgArr: [],
        //           tagArr: []
        //         },
        //         {
        //           groupName: "组名",
        //           dataList: [],
        //           imgArr: [],
        //           tagArr: []
        //         },
        //         {
        //           groupName: "组名",
        //           dataList: [],
        //           imgArr: [],
        //           tagArr: []
        //         },
        //         {
        //           groupName: "组名",
        //           dataList: [],
        //           imgArr: [],
        //           tagArr: []
        //         }
        //       ]
        //     }
        //   }
        // },
        {
          imgUrl:
            "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
          icon: "icon-danchuang",
          name: "弹窗广告",
          data: {
            category: "layer",
            componentClass: "my-layer-box", // 自定义组件class
            data: {
              picAddr: "", // 图片地址
              linkUrl: "", // 图片链接
              couponCode: "", // 券码
              interval: "oneDay", // 时间间隔
              rate: "1", // 弹出次数
              time: "3", // 展示时间(秒)
              channel: ["wap", "miniApp"] // 投放渠道
            }
          }
        },
        {
          imgUrl:
            "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
          icon: "icon-sousuo-m",
          name: "地址电话",
          data: {
            category: "addressPhone",
            hideBottom: false,
            data: {
              borderColor: "#cbcbcb", //边框颜色
              backgroundColor: "#fff", //背景颜色
              phoneBackgroundColor: "#4698ae", //电话背景颜色
              text: "", //文字
              textColor: "#413838", //文字颜色
              position: "", //坐标
              textPosition: "left",
              phone: "", //电话
              phonePosition: "right"
            }
          }
        }
      ]
    };
  },
  methods: {
    delImgUrl() {
      this.pageSetData.bgImg = "";
    },
    setImgUrl(res, file) {
      console.log(res, file);
      this.pageSetData.bgImg = res.prefix + res.url;
      // this.pageData.list[this.activeIndex].picAddr = res.prefix + res.url;
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
    hideBottom(index) {
      this.list2[index].hideBottom = !this.list2[index].hideBottom;
    },
    check() {
      console.log(this.list2)
      // 验证
      this.checkVal = true;
      try {
        this.list2.forEach((item, index) => {
          if (item.category == "banner") {
            // 轮播图
            // 验证list不能为空
            if (
              this.$route.name == "template-add-edit" &&
              this.codeArr.indexOf(this.templateCode) > -1
            ) {
            } else {
              if (!item.data.list.length) {
                this.scrolltest(index);
                throw new Error("请添加一个图片广告");
              }
            }
          } else if (item.category == "navigation") {
            // 导航图
            if (!item.data.lineNum) {
              this.scrolltest(index);
              throw new Error("请选择单行数量");
            }
            if (!item.data.list.length) {
              this.scrolltest(index);
              throw new Error("请添加一个图文导航");
            } else {
              let flag = false;
              let imgFlag = false;
              let nameFlag = false;
              let iconData = {
                home: "icon-nav-home",
                order: "icon-nav-orders",
                personal: "icon-member",
                shopcart: "icon-shopping-car",
                ticket: "icon-nav-ticket",
                hotel: "icon-nav-ticket",
                shop: "icon-nav-goods",
                strategy: "icon-nav-raiders",
                route: "icon-nav-tours",
                repast: "icon-nav-foods",
                ai_p: "icon-AIpaiyipai",
                customtel: "icon-bohao"
              };
              item.data.list.forEach((it, i) => {
                if (!it.linkUrl) {
                  flag = true;
                }
                if (!it.picAddr && !iconData[it.linkUrl]) {
                  imgFlag = true;
                }
                if (!it.title) {
                  nameFlag = true;
                }
              });

              if (item.data.type == "navigation1" && imgFlag) {
                // 只有在navigation1时候才会要求上传图片
                this.setErrorShow(true);
                this.scrolltest(index);
                throw new Error("请上传导航图片");
              }
              if (nameFlag) {
                this.setErrorShow(true);
                this.scrolltest(index);
                throw new Error("请填写导航名称");
              }
              if (flag) {
                this.setErrorShow(true);
                this.scrolltest(index);
                throw new Error("请选择链接页面");
              }
            }
          } else if (item.category == "title") {
            // 标题
            if (!item.data.title && !item.data.titlePic) {
              // let titlePic=!item.data.titlePic
              let scTipFlag =
                item.data.hasOwnProperty("titlePic") && !item.data.titlePic;
              this.scrolltest(index);
              this.setErrorShow(true);
              throw new Error(
                scTipFlag
                  ? "请填写标题名称或者上传标题名称图片"
                  : "请填写标题名称"
              );
            }
            // if (!item.data.subtitle) {
            //   this.scrolltest(index);
            //   this.setErrorShow(true);
            //   throw new Error("请填写副标题");
            // }
            if (!item.data.position) {
              this.scrolltest(index);
              throw new Error("请选择显示位置");
            }
          } else if (item.category == "search") {
            // 搜索
            // if (!item.data.searchDetailList.length) {
            //   this.scrolltest(index);
            //   this.setErrorShow(true);
            //   throw new Error("请选择搜索内容");
            // }
          } else if (item.category == "richText") {
            // 富文本框
            if (!item.data.content) {
              this.scrolltest(index);
              throw new Error("请填写富文本内容");
            }
          } else if (item.category == "freeLayout") {
            // 自由布局
            let val = item.data.type;
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

            let flag = false;
            item.data.list.forEach((it, i) => {
              if (i < limitNum && !it.picAddr) {
                flag = true;
              }
            });
            if (flag) {
              this.scrolltest(index);
              this.setErrorShow(true);
              throw new Error("请上传图片");
            }
            if (!item.data.casaulList.length) {
              this.scrolltest(index);
              throw new Error("请添加一个左侧轮播图");
            }
          } else if (item.category == "productGroup") {
            // 产品分组
            if (
              !item.data.list.length &&
              this.$route.name != "template-add-edit"
            ) {
              this.scrolltest(index);
              throw new Error("请添加产品分组");
            }
          } else if (item.category == "product") {
            // 产品分组
            // if (!item.data.productTag) {
            //   this.scrolltest(index);
            //   throw new Error("请选择产品标签");
            // }
            if (item.data.productTag == "type4" && !item.data.tagUrl) {
              this.scrolltest(index);
              throw new Error("请上传自定义图片");
            }
            if (
              !item.data.list.length &&
              this.$route.name != "template-add-edit"
            ) {
              this.scrolltest(index);
              throw new Error("请关联产品");
            }
          } else if (item.category == "notice") {
            // 公告
            if (!item.data.content) {
              this.scrolltest(index);
              this.setErrorShow(true);
              throw new Error("请填写公告内容");
            }
          } else if (item.category == "text") {
            // 文本
            if (!item.data.content) {
              this.scrolltest(index);
              this.setErrorShow(true);
              throw new Error("请填写文本内容");
            }
            if (!item.data.fontSize) {
              this.scrolltest(index);
              throw new Error("请选择字号");
            }
          } else if (item.category == "shopinfo") {
            // 店招
            if (!item.data.name) {
              this.scrolltest(index);
              this.setErrorShow(true);
              throw new Error("请填写店铺名称");
            }
            if (item.data.tel) {
              var regu = /(^1([0-9]{10})$)|(^0[0-9]{2,3}-[0-9]{7,8}$)|(^400[0-9]{7}$)/;
              var re = new RegExp(regu);
              if (!re.test(item.data.tel)) {
                this.scrolltest(index);
                this.setErrorShow(true);
                throw new Error("请填写正确的电话号码");
              }
            }
            if (!item.data.logoUrl) {
              this.scrolltest(index);
              this.setErrorShow(true);
              throw new Error("请上传店铺logo");
            }
          } else if (item.category == "strategy") {
            // 攻略
            if (
              !item.data.dataList.length &&
              this.$route.name != "template-add-edit"
            ) {
              this.scrolltest(index);
              throw new Error("请关联攻略");
            }
          } else if (item.category == "strategyGroup") {
            // 攻略分组
          } else if (item.category == "layer") {
            // 弹框组件
            if (!item.data.picAddr) {
              this.setShowLayer(true);
              this.scrolltest(index);
              this.setErrorShow(true);
              throw new Error("请选择上传图片");
            } else if (!item.data.couponCode) {
              this.setShowLayer(true);
              this.scrolltest(index);
              this.setErrorShow(true);
              throw new Error("请填写优惠券编码");
            }else if (!item.data.interval) {
              this.setShowLayer(true);
              this.scrolltest(index);
              this.setErrorShow(true);
              throw new Error("请选择时间间隔");
            } else if (!item.data.rate) {
              this.setShowLayer(true);
              this.scrolltest(index);
              this.setErrorShow(true);
              throw new Error("请选择弹出次数");
            } else if (!item.data.time) {
              this.setShowLayer(true);
              this.scrolltest(index);
              this.setErrorShow(true);
              throw new Error("请选择展示时间");
            } else if (!item.data.channel || !item.data.channel.length) {
              this.setShowLayer(true);
              this.scrolltest(index);
              this.setErrorShow(true);
              throw new Error("请选择投放渠道");
            }
          }
        });
      } catch (error) {
        console.log(error)
        this.checkVal = false;
        this.$Message.warning(error.message);
      }
    },
    listSplice(index, obj) {
      this.listpush({
        index: index,
        obj: obj
      });
    },
    // 选择基础模板的接口请求
    baseTemplate(url) {
      apiGet(url).then(res => {
        this.pageSetData.title = res.data.name ? res.data.name : "";
        this.pageSetData.describe = "";
        // 基础模板中的一些特殊字段处理,也不处理是否是使用了基础模板，直接做兼容处理
        let arr = JSON.parse(res.data.templateContent);
        // console.log(arr);
        let code = res.data.code;
        arr.forEach((item, index) => {
          // 匹配模板中的xsjc_banner_top和xsjc_banner_normal为"[]"
          if (item.category == "freeLayout") {
            // 自定义布局，list个数初始为4个
            let addNum = 4 - item.data.list.length;
            for (let i = 0; i < addNum; i++) {
              arr[index].data.list.push(
                Object.assign(
                  {
                    picAddr: "",
                    text: ""
                  },
                  customLinkObj
                )
              );
            }
          }
          if (item.category == "product") {
            arr[index].data.list = [];
          }
          if (this.codeArr.indexOf(code) > -1) {
            // 兼容老的基础模板中的特殊字符
            if (item.category == "banner") {
              arr[index].data.list = [];
            }
            if (item.category == "productGroup") {
              // arr[index].data.list = [];
              //  parseArr[index].data.list[0].data = "xjsctype_park";
              // parseArr[index].data.list[1].data = "xjsctype_hotel";
              // parseArr[index].data.list[2].data = "xjsctype_mdse";
              arr[index].data.list[0].data = [];
              arr[index].data.list[1].data = [];
              arr[index].data.list[2].data = [];
            }
          }
        });
        console.log(arr);
        this.reset(arr);
      });
    },
    getData(url) {
      this.isEditPage = false;
      localStorage.setItem("xjsc_local_is_use_2018_11_12", "F");
      apiGet(url + "?time=" + new Date().getTime(), {
        id: this.$route.query.id
      }).then(res => {
        // 编辑页面
        let dataList = [];
        this.templateCode = res.data.code;
        // console.log(this.$route.name);
        if (this.$route.name == "template-add-edit") {
          // 基础模板
          this.pageSetData.title = res.data.name ? res.data.name : "";
          this.pageSetData.describe = "";
          if (res.data.templateContent) {
            dataList = JSON.parse(res.data.templateContent);
          }
          // 匹配模板中的xsjc_banner_top和xsjc_banner_normal为"[]"
          dataList.forEach((item, index) => {
            // 判断是否有弹框广告组件
            if (item.category == "layer") {
              this.isAddLayer = true;
            }
            if (item.category == "product") {
              dataList[index].data.list = [];
            }
            if (this.codeArr.indexOf(res.data.code) > -1) {
              // 匹配模板中的xsjc_banner_top和xsjc_banner_normal为"[]"
              if (item.category == "banner") {
                dataList[index].data.list = [];
              }
              // //老的基础模板中固定的
              // parseArr[index].data.list[0].data = "xjsctype_park";
              // parseArr[index].data.list[1].data = "xjsctype_hotel";
              // parseArr[index].data.list[2].data = "xjsctype_mdse";
              // 全部替换成[]
              if (item.category == "productGroup") {
                item.data.list.forEach((it, i) => {
                  dataList[index].data.list[i].data = [];
                });
              }
            }
          });
          this.$emit("updata", res.data);
        } else if (this.$route.name == "create") {
          // 自定义页面
          // 回传父组件当前页面数据
          this.$emit("sendPageData", res.data);
          this.pageType = res.data.renovationPageType
            ? res.data.renovationPageType
            : "customPage";
          this.pageSetData.title = res.data.renovationPageName
            ? res.data.renovationPageName
            : "";
          this.pageSetData.describe = res.data.renovationPageDescribe
            ? res.data.renovationPageDescribe
            : "";

          if (res.data.pageBackFlag && res.data.pageBackFlag == "customBgImg") {
            // 自定义背景图片
            this.pageSetData.bgImg = res.data.renovationPageBack
              ? res.data.renovationPageBack
              : "";
          } else {
            this.pageSetData.color1 = res.data.renovationPageBack
              ? res.data.renovationPageBack
              : "#f7f7f7";
          }
          this.pageSetData.backgroundSet = res.data.pageBackFlag;
          if (res.data.content) {
            dataList = JSON.parse(res.data.content);
            // console.log(dataList)
          }
        }
        // 组件初始数据
        dataList.forEach((item, index) => {
          // 判断是否有弹框广告组件
          if (item.category == "layer") {
            this.isAddLayer = true;
          }
          if (item.category == "freeLayout") {
            // 自定义布局，list个数初始为4个
            let addNum = 4 - item.data.list.length;
            for (let i = 0; i < addNum; i++) {
              dataList[index].data.list.push(
                Object.assign(
                  {
                    picAddr: "",
                    text: ""
                  },
                  customLinkObj
                )
              );
            }
          }
          // 轮播图-兼容新增的功能热区设置
          if (item.category == "banner") {
            dataList[index].data.list.forEach((it, i) => {
              if (!it.hotList) {
                // 如果不存在热区key值，需要初始化
                dataList[index].data.list[i].hotList = [];
              }
            });
          }
          //产品兼容老数据标签文字字段，老数据无，新增数据有，对老数据初始化
          if (item.category == "product") {
            if (item.data && !item.data.textTagList) {
              let arr = [];
              if (item.data.list && item.data.list.length) {
                item.data.list.forEach(it => {
                  arr.push({
                    tagTitle: "",
                    tagType: "type1"
                  });
                });
              }
              item.data.textTagList = arr;
            }
          }
          //产品分组兼容老数据标签文字字段，老数据无，新增数据有，对老数据初始化
          if (item.category == "productGroup") {
            item.data.list.forEach(it => {
              if (!it.textTagList) {
                let arr = [];
                it.data.forEach(() => {
                  arr.push({
                    tagTitle: "",
                    tagType: "type1"
                  });
                });
                it.textTagList = arr;
              }
            });
          }
        });
        let comList = [];
        let flag = true; // 用来判断是老版本是新版本
        dataList.forEach((item, index) => {
          let obj = {};
          if (item.type == "Banner__swiper1") {
            flag = false;
            // 轮播图-banner1 老版本中的外链转换成自定义外链
            obj.type = "banner1";
            obj.imgFill = "fill";
            obj.list = item.data.map((it, index) => {
              return Object.assign(customLinkObj, {
                picAddr: it.picAddr,
                title: it.title,
                linkUrl: "customlink",
                customLinkurl: item.picLink
              });
            });
            comList.push({
              category: "banner",
              hideBottom: false,
              data: obj
            });
          } else if (item.type == "Bill__normal") {
            // 轮播图-banner2
            flag = false;
            obj.type = "banner2";
            obj.imgFill = "fill";
            obj.list = item.data.map((it, index) => {
              return Object.assign(customLinkObj, {
                picAddr: it.picAddr,
                title: it.title,
                linkUrl: "customlink",
                customLinkurl: item.picLink
              });
            });
            comList.push({
              category: "banner",
              hideBottom: false,
              data: obj
            });
          } else if (item.type == "Nav__normal") {
            // 导航1
            flag = false;
            obj.type = "navigation1";
            obj.lineNum = "4";
            obj.backgroundColor = "#fff";
            obj.textColor = "#000";
            obj.list = item.data.map((it, i) => {
              return Object.assign(customLinkObj, {
                picAddr: it.picAddr,
                title: it.title,
                linkUrl: it.businessType
              });
            });
            comList.push({
              category: "navigation",
              hideBottom: false,
              data: obj
            });
          } else if (item.type == "Nav__normal2") {
            // 导航2
            flag = false;
            obj.type = "navigation1";
            obj.backgroundColor = "#fff";
            obj.lineNum = "4";
            obj.textColor = "#000";
            obj.list = item.data.map((it, i) => {
              return Object.assign(customLinkObj, {
                picAddr: it.picAddr,
                title: it.title,
                linkUrl: it.businessType
              });
            });
            comList.push({
              category: "navigation",
              hideBottom: false,
              data: obj
            });
          } else if (item.type == "Search__normal") {
            //  { "type": "search1", "height": 33, "textColor": "#413838", "position": "left",
            // "hostWordList": [ { "hotWord": "" } ], "placeholder": "", "backgroundColor": "#fff", "borderColor": "#cbcbcb" }
            // 搜索框
            flag = false;
            obj.type = "search1";
            obj.height = 33;
            obj.textColor = "#413838";
            obj.position = "left";
            obj.hostWordList = [
              {
                hotWord: ""
              }
            ];
            obj.placeholder = "";
            obj.backgroundColor = "#fff";
            obj.borderColor = "#cbcbcb";
            comList.push({
              category: "search",
              hideBottom: false,
              data: obj
            });
          } else if (item.type == "ProductList__normal") {
            // 产品分组
            flag = false;
            obj.type = "productGroup1";
            obj.menuType = "type1";
            obj.pageInteraction = "type1";
            obj.listType = "listType";
            obj.list = item.data;
            comList.push({
              category: "productGroup",
              hideBottom: false,
              data: obj
            });
          } else if (
            item.type == "Product__normal" ||
            item.type == "Product__normal2"
          ) {
            // 产品
            //  { "listType": "type1", "productTagShow": true,
            //  "productTag": "", "tagUrl": "", "list": []
            flag = false;
            obj.listType = "type1";
            obj.productTagShow = true;
            obj.productTag = "type1";
            obj.tagUrl = "";
            obj.list = item.data.list;
            comList.push({
              category: "product",
              hideBottom: false,
              data: obj
            });
          } else if (item.type == "Header__logo") {
            // console.log("asdad")
            // 头部
            // "name": "", "textColor": "#999",
            //  "introduction": "", "tel": "", "logoUrl": "", "backUrl": ""
            flag = false;
            obj.name = item.data.name;
            obj.textColor = "#999";
            obj.introduction = item.data.intro;
            obj.tel = item.data.tel;
            obj.logoUrl = item.data.logoUrl;
            obj.backUrl = "";
            comList.push({
              category: "shopinfo",
              hideBottom: false,
              data: obj
            });
          } else if (item.type == "Footer__normal") {
            // 老版本的头尾都不要
            flag = false;
            this.del(index);
          }
        });
        // console.log(comList);
        // console.log(comList);
        if (flag) {
          // true当前的数据是新数据但是其中固定模板的数据替换的话，前端不好操作
          this.reset(dataList);
        } else {
          this.reset(comList);
        }
      });
    },
    // 格式化，用来兼容组件新老两个版本的格式
    dataListFormatter(arr) {},
    scrolltest(index) {
      let errList = $(".draggable-box .component-li");
      if (errList.length > 0) {
        // let scroll_offset = errList.eq(index).offset().top - 60;
        // console.log('scroll_offset',scroll_offset);
        let scroll_offset = errList.eq(index).offset().top;
        // 第一个组价top值
        let testTop = errList.eq(0).offset().top;
        if (scroll_offset != 0) {
          $("#content").animate(
            {
              scrollTop: scroll_offset - testTop
            },
            300
          );
        }
        //  $("#content").scrollTop(
        //       $(".ivu-form-item-error").offset().top -
        //         90 +
        //         $("#content").scrollTop()
        //     );
        this.setEditIndex(index);
        // this.editIndex = index
      }
    },
    comStart() {
      //  console.log(this.list2.length)
      this.startLength = this.list2.length;
    },
    comEnd() {
      // console.log("22")
      // this.testFlag = true
    },
    noUseLocal() {
      // 不适用本地缓存
      this.isLocal = false;
    },
    stop() {
      // 用于阻止事件冒泡
    },
    ...mapActions("defined", [
      "del",
      "setDefine",
      "reset",
      "listpush",
      "setErrorShow",
      "setEditIndex",
      "setShowLayer"
    ]),
    useLocal() {
      // 立即使用本地缓存
      // let arr = JSON.parse(localStorage.getItem("userDefinedList"));
      this.reset(this.arr);
      // localStorage.removeItem("userDefinedList");
      this.isLocal = false;
    },
    edit(index) {
      // 打开对应组件的编辑页面
      // this.editIndex = index
      this.setEditIndex(index);
      this.headShow = false;
    },
    backgroundTypeChange(val) {
      if (val == "default") {
        // 选了默认
        this.pageSetData.color1 = "#f7f7f7";
      }
    },
    headEdit() {
      // 头部编辑
      // console.log("11");
      this.headShow = !this.headShow;
      this.setEditIndex(null);
      // this.editIndex = null
    },
    onEnd(e) {
      // 组件拖拽结束
      // console.log("editIndex", this.editIndex);
      // console.log("new", e.newIndex);
      // console.log("old", e.oldIndex);
      if (this.editIndex || this.editIndex == 0) {
        // if (e.newIndex == e.oldIndex) {
        //   //没有拖拽，原地拖动
        //   console.log("yuandi")
        // }
        // if (e.newIndex < this.editIndex && e.oldIndex < this.editIndex) {
        //   //拖拽前后的位置都在展示编辑页面的前面，this.editIndex值不变
        //   console.log("<")
        // }
        // if (e.newIndex > this.editIndex && e.oldIndex > this.editIndex) {
        //   //拖拽前后的位置都在展示编辑页面的后面，this.editIndex值不变
        //   console.log(">")
        // }
        if (e.newIndex >= this.editIndex && e.oldIndex < this.editIndex) {
          // 拖拽前在编辑页前，拖拽后在编辑页面后面
          this.setEditIndex(this.editIndex--);
          // this.editIndex--
        } else if (
          e.newIndex <= this.editIndex &&
          e.oldIndex > this.editIndex
        ) {
          // 拖拽前在编辑页后，拖拽后在编辑页面前
          // this.editIndex++
          this.setEditIndex(this.editIndex++);
        } else if (e.oldIndex == this.editIndex) {
          // 拖拽的就是编辑页面,并且拖拽前后的下标改变
          // this.editIndex = e.newIndex
          this.setEditIndex(e.newIndex);
        }
      }
    },
    remove(e) {
      // 一个页面只能添加一个弹出广告
      if (this.isAddLayer && this.list2[e.newIndex].data.category == "layer") {
        this.$Message.warning("一个页面只能添加一个弹出广告，请勿重复添加");
        return;
      }
      // console.log(this.startLength)
      // 拖拽成功
      // 只要拖拽过后，刷新本地缓存的list,并设置
      if (this.startLength == 0 && e.newIndex == 1) {
        // 用于处理第一次拖拽组件拖拽到后面的情况
        e.newIndex = 0;
      }
      localStorage.removeItem("userDefinedList");
      this.isLocal = false;
      // 开发中发现如果不重置会出现不可控的情况,因为直接赋值会影响原对象,暂时使用重置的方式
      this.list1[0] = {
        imgUrl:
          "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
        icon: "icon-tupian",
        name: "图片广告",
        data: {
          category: "banner", // 组件类型
          hideBottom: false,
          data: {
            type: "banner1", // 样式类型
            imgHeightAuto: "T",
            imgFill: "fill", // 图片填充
            hideText: "T", // 是否隐藏文字
            casaulBackUrl: "", //轮播图背景图
            list: []
          }
        }
      };
      this.list1[1] = {
        imgUrl:
          "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
        icon: "icon-chanpinfengfu",
        name: "图文导航",
        data: {
          category: "navigation", // 组件类型
          hideBottom: false,
          data: {
            type: "navigation1", // 样式类型
            lineNum: "4",
            borderColor: "#fff",
            backgroundColor: "#fff", // 背景颜色
            textColor: "#999", // 背景颜色
            activeBgUrl: "", //宋城导航选中背景图
            tagBgUrl: "", //宋城导航tag图标背景图
            list: [
              Object.assign(
                {
                  picAddr: "",
                  title: "",
                  subtitle: "",
                  tagTitle: "",
                  itemSelectBg: "",
                  itemTagBg: "",
                  tagBgColor: "#413838",
                  tagColor: "#413838"
                },
                customLinkObj
              ),
              Object.assign(
                {
                  picAddr: "",
                  title: "",
                  subtitle: "",
                  tagTitle: "",
                  itemSelectBg: "",
                  itemTagBg: "",
                  tagBgColor: "#413838",
                  tagColor: "#413838"
                },
                customLinkObj
              ),
              Object.assign(
                {
                  picAddr: "",
                  title: "",
                  subtitle: "",
                  tagTitle: "",
                  itemSelectBg: "",
                  itemTagBg: "",
                  tagBgColor: "#413838",
                  tagColor: "#413838"
                },
                customLinkObj
              ),
              Object.assign(
                {
                  picAddr: "",
                  title: "",
                  subtitle: "",
                  tagTitle: "",
                  itemSelectBg: "",
                  itemTagBg: "",
                  tagBgColor: "#413838",
                  tagColor: "#413838"
                },
                customLinkObj
              )
            ]
          }
        }
      };
      this.list1[2] = {
        imgUrl:
          "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
        icon: "icon-biaoti",
        name: "标题",
        data: {
          category: "title",
          hideBottom: false,
          data: Object.assign(
            {
              title: "默认标题", // 标题名称
              titleColor: "#413838",
              nameColor: "#413838",
              nameBgColor: "#413838",
              ifIconColor: 'F',
              titleFontSize: "18",
              subtitle: "", // 副标题
              position: "center", // 显示位置
              backgroundColor: "#fff", // 背景颜色
              navigationName: "导航名称", // 导航名称
              titlePic: "", // 标题名称图片
              navigationNamePic: "", // 导航名称图片
              isFocus: false
            },
            customLinkObj
          )
        }
      };
      this.list1[3] = {
        imgUrl:
          "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
        icon: "icon-sousuo-m",
        name: "搜索框",
        data: {
          category: "search",
          hideBottom: false,
          data: {
            type: "search1", // 类别
            height: 33,
            textColor: "#413838",
            position: "left",
            hostWordList: [
              {
                hotWord: ""
              }
            ],
            // searchList: [], //搜索内容
            // searchDetailList: [], //[{key:value}]
            placeholder: "", // 搜索提示
            backgroundColor: "#fff", // 背景颜色
            borderColor: "#cbcbcb" // 边框颜色
          }
        }
      };
      this.list1[4] = {
        imgUrl:
          "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
        icon: "icon-tupian",
        name: "富文本",
        data: {
          category: "richText",
          hideBottom: false,
          data: {
            type: "richText", // 类别
            content: "", // 富文本内容
            backgroundColor: "#fff" // 背景颜色
          }
        }
      };
      this.list1[5] = {
        imgUrl:
          "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
        icon: "icon-fenzubuju",
        name: "自由布局",
        data: {
          category: "freeLayout",
          hideBottom: false,
          data: {
            type: "freeLayout1",
            list: [
              Object.assign(
                {
                  picAddr: "",
                  text: ""
                },
                customLinkObj
              ),
              Object.assign(
                {
                  picAddr: "",
                  text: ""
                },
                customLinkObj
              ),
              Object.assign(
                {
                  picAddr: "",
                  text: ""
                },
                customLinkObj
              ),
              Object.assign(
                {
                  picAddr: "",
                  text: ""
                },
                customLinkObj
              )
            ],
            casaulList: [],
            height: 0, //左右间距
            imgHeightAuto: "F", //是否自适应图片
            bgTransparent: "F", // 透明背景
            hideText: "T", //是否隐藏文字
            mainImgWidth: 65 // 主图宽度百分比
          }
        }
      };
      this.list1[6] = {
        imgUrl:
          "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
        icon: "icon-fenzubuju",
        name: "产品分组",
        data: {
          category: "productGroup",
          hideBottom: false,
          data: {
            type: "productGroup1", // 样式
            pxType: "all",
            menuType: "type1",
            pageInteraction: "type1",
            listType: "type1",
            textType: ["productName"],
            menuBgUrl: "",
            list: [
              {
                groupName: "默认分组",
                subtitle: "",
                data: [],
                imgArr: [],
                textTagList: []
              },
              {
                groupName: "默认分组",
                subtitle: "",
                data: [],
                imgArr: [],
                textTagList: []
              },
              {
                groupName: "默认分组",
                subtitle: "",
                data: [],
                imgArr: [],
                textTagList: []
              },
              {
                groupName: "默认分组",
                subtitle: "",
                data: [],
                imgArr: [],
                textTagList: []
              },
              {
                groupName: "默认分组",
                subtitle: "",
                data: [],
                imgArr: [],
                textTagList: []
              }
            ]
          }
        }
      };
      this.list1[7] = {
        imgUrl:
          "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
        icon: "icon-remove_from_queue",
        name: "产品",
        data: {
          category: "product",
          hideBottom: false,
          data: {
            // type: "product1", //样式
            listType: "type1",
            productTagShow: false,
            pxType: "all",
            productTag: "",
            tagUrl: "",
            imgStyle: "rightAngle",
            textType: ["productName"],
            list: [],
            imgArr: [],
            textTagList: []
          }
        }
      };
      this.list1[8] = {
        imgUrl:
          "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
        icon: "icon-font60",
        name: "公告",
        data: {
          category: "notice",
          hideBottom: false,
          data: {
            content: "",
            textColor: "#999",
            backgroundColor: "#fff"
          }
        }
      };
      this.list1[9] = {
        imgUrl:
          "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
        icon: "icon-dianpu-copy",
        name: "店招",
        data: {
          category: "shopinfo",
          hideBottom: false,
          data: {
            name: "",
            textColor: "#999",
            introduction: "",
            tel: "",
            logoUrl: "",
            backUrl: ""
          }
        }
      };
      this.list1[10] = {
        imgUrl:
          "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
        icon: "icon-wenben",
        name: "文本",
        data: {
          category: "text",
          hideBottom: false,
          data: Object.assign(
            {
              content: "",
              textColor: "#999",
              backgroundColor: "#fff",
              fontSize: "14px",
              position: "center"
            },
            customLinkObj
          )
        }
      };
      this.list1[11] = {
        imgUrl:
          "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
        icon: "icon-fengexian",
        name: "辅助线",
        data: {
          category: "subline",
          hideBottom: false,
          data: {
            sideWidth: "type1",
            style: "solid",
            lineColor: "#999"
          }
        }
      };
      this.list1[12] = {
        imgUrl:
          "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
        icon: "icon-xukuang",
        name: "辅助空白",
        data: {
          category: "subBlank",
          hideBottom: false,
          data: {
            height: 30,
            backgroundColor: "#fff"
          }
        }
      };
      this.list1[14] = {
        imgUrl:
          "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
        icon: "icon-gonglve11",
        name: "攻略",
        data: {
          category: "strategy",
          hideBottom: false,
          data: {
            listType: "singleRow",
            sortRule: "defaultSort",
            imgList: [],
            textShow: [],
            position: "lb",
            dataList: [],
            tagArr: [],
            imgArr: []
          }
        }
      };

      // this.list1[15] = {
      //   imgUrl:
      //     "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
      //   icon: "icon-gonglve11",
      //   name: "攻略分组",
      //   data: {
      //     category: "strategyGroup",
      //     hideBottom: false,
      //     data: {
      //       type: "productGroup1", // 样式
      //       sortRule: "defaultSort",
      //       pxType: "all",
      //       menuType: "type1",
      //       activeColor: "#f05b47",
      //       pageInteraction: "normal",
      //       listType: "singleRow",
      //       textType: ["productName"],
      //       list: [
      //         {
      //           groupName: "组名",
      //           dataList: [],
      //           imgArr: [],
      //           tagArr: []
      //         },
      //         {
      //           groupName: "组名",
      //           dataList: [],
      //           imgArr: [],
      //           tagArr: []
      //         },
      //         {
      //           groupName: "组名",
      //           dataList: [],
      //           imgArr: [],
      //           tagArr: []
      //         },
      //         {
      //           groupName: "组名",
      //           dataList: [],
      //           imgArr: [],
      //           tagArr: []
      //         }
      //       ]
      //     }
      //   }
      // };
      this.list1[16] = {
        imgUrl:
          "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
        icon: "icon-danchuang",
        name: "弹窗广告",
        data: {
          category: "layer",
          componentClass: "my-layer-box", // 自定义组件class
          data: {
            picAddr: "", // 图片地址
            linkUrl: "", // 图片链接
            couponCode: "", // 券码
            interval: "oneDay", // 时间间隔
            rate: "1", // 弹出次数
            time: "3", // 展示时间(秒)
            channel: ["wap", "miniApp"] // 投放渠道
          }
        }
      };
      this.list1[17] = {
        imgUrl:
          "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
        icon: "icon-sousuo-m",
        name: "地址电话",
        data: {
          category: "addressPhone",
          hideBottom: false,
          data: {
            borderColor: "#cbcbcb", //边框颜色
            backgroundColor: "#fff", //背景颜色
            phoneBackgroundColor: "#4698ae", //电话背景颜色
            text: "", //文字
            position: "", //坐标
            textPosition: "left",
            phone: "", //电话
            phonePosition: "right"
          }
        }
      };
      //替换成需要的对象结构
      this.list2.splice(e.newIndex, 1, this.list1[e.oldIndex].data);
      // this.list2.splice(e.newIndex, 0, this.list1[e.oldIndex].data);
      if (this.editIndex || this.editIndex == 0) {
        if (e.newIndex <= this.editIndex) {
          this.setEditIndex(this.editIndex++);
          // this.editIndex++
        }
      }
      // 拖拽后，编辑页面指定到当前页面
      this.setEditIndex(e.newIndex);
      // this.editIndex = e.newIndex
      // 拖拽后头部编辑页面隐藏
      this.headShow = false;
      // console.log(this.list1)
      // 一个页面只能添加一个弹出广告
      if (this.list2[e.newIndex].category == "layer") {
        this.isAddLayer = true;
      }
    },
    indexDel(index) {
      // 删除-右侧编辑消失-状态管理器中删除操作（直接本地删除也可以）
      // this.editIndex = null
      this.setEditIndex(null);
      this.isAddLayer = false;
      this.del(index);
    },
    up(index) {
      // 页面交互已经处理，最后一个组件只能上移动，第一个组件不能上移
      // this.editIndex = null
      if (index != 0) {
        let obj = this.list2[index - 1];
        this.$set(this.list2, index - 1, this.list2[index]);
        this.$set(this.list2, index, obj);
        // this.editIndex--
        let editIndex = this.editIndex;
        this.setEditIndex(editIndex--);
      }
    },
    down(index) {
      //  this.editIndex = null
      // 页面交互已经处理，第一个组件只能下移，最后一个不能下移
      if (index != this.list2.length - 1) {
        let obj = this.list2[index + 1];
        this.$set(this.list2, index + 1, this.list2[index]);
        this.$set(this.list2, index, obj);
        let editIndex = this.editIndex;
        this.setEditIndex(editIndex++);
        // this.editIndex++
      }
    },
    // 弹框组件点击时
    componentItemClick(item) {
      if (item.data && item.data.category == "layer") {
        // 页面是否已经添加了弹框广告
        if (this.isAddLayer) {
          if (!this.isShowLayer) {
            this.setShowLayer(true);
            // $('.my-layer-box').removeClass('hide')
            // this.editIndex = $('.my-layer-box').data('editindex')
            this.setEditIndex($(".my-layer-box").data("editindex"));
          } else {
            this.setShowLayer(false);
            $(".my-layer-box").data("editindex", this.editIndex);
            // $('.my-layer-box').addClass('hide')
            this.setEditIndex(null);
            // this.editIndex = null
          }
        }
      }
    }
  }
};
</script>
<style lang="scss">
@import "../../assets/styles/font/iconfont.css";
.create-warper {
  height: 100%;
  padding-bottom: 50px;
  position: relative;
  .img-up-box {
    display: inline-block;
    height: 60px;
    width: 100px;
    text-align: center;
    line-height: 60px;
    border: 1px solid #d9d9d9;
    .text {
      margin-left: 5px;
    }
  }
  .img-cover-box {
    height: 60px;
    width: 100px;
    position: relative;
    .tag-cover {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      text-align: center;
      line-height: 60px;
      .trash-icon {
        color: #fff;
        font-size: 20px;
        padding: 10px;
        cursor: pointer;
      }
    }
  }
  .img-cover-box:hover {
    .tag-cover {
      display: block;
    }
  }
  .use-local {
    // text-align: center;
    margin-bottom: 5px;
    .use-local-box {
      display: inline-block;
      height: 30px;
      line-height: 30px; // background: #efca10;
      .close-svg {
        // display: none;
        color: #999;
        font-size: 20px;
        margin-left: 15px;
        margin-top: 6px;
        cursor: pointer;
      }
      .use-btn {
        color: #2db7f5;
      }
    }
  }
  .template-handle {
    height: 52px;
    padding: 10px;
    width: 100%;
    .save {
      margin-right: 15px;
    }
  }
  .component-list {
    position: absolute;
    width: 323px;
    padding: 10px;
    padding-top: 0;
    border: 1px solid #cbcbcb;
    .title {
      font-size: 16px;
      padding: 15px 0;
      color: #010101;
      margin-left: 5px;
    }
  }
  .page-head-box {
    margin-left: 390px;
    position: relative; // width: 375px;
    .page-head {
      width: 375px;
      height: 75px;
      background-size: 100% 100%;
      position: relative;
      .customPage-page-title {
        position: absolute;
        width: 100%;
        text-align: center;
        color: #fff;
        font-size: 18px;
        height: 30px;
        line-height: 30px;
        bottom: 9px;
      }
      .head-edit-box {
        position: absolute;
        top: 0;
        left: 100%;
        margin-left: 46px;
        width: 342px;
        z-index: 999;
        border: 1px solid #d7d7d7;
        .head-edit-title {
          background: #e4e4e4;
          height: 34px;
          line-height: 34px;
          padding-left: 10px;
        }
        .head-edit-body {
          padding: 10px;
          background: #fff;
          .head-set {
            width: 100%;
            tr {
              td {
                padding: 5px 0;
              }
              td.title {
                width: 60px;
              }
            }
          }
        }
      }
    }
  }
  .component-ul {
    // height: calc(100% - 75px);
    // overflow: auto;
    margin-left: 390px;
    position: relative;
    .user-edit-box {
      position: absolute;
      left: 420px;
      width: 340px;
      margin-bottom: 50px;
      padding-bottom: 150px;
    }
    .draggable-box {
      border: 1px solid #cbcbcb;
      width: 375px;
      position: relative;
      .component-li {
        margin-bottom: 10px;
        cursor: pointer;
        // opacity:0;
      }
      .component-li.hide-bottom {
        margin-bottom: 0;
      }
      .component-li:last-child {
        margin-bottom: 0;
      }
      .component-item:first-child {
        margin-top: 10px;
      }
      .component-item {
        width: calc(100% - 15px);
        // margin-top: 10px;
        border: 1px dotted #f05b47;
        border-radius: 10px; // margin-left: 137.5px;
        padding: 10px;
        margin: 0 7.5px 10px;
        .component-content {
          display: none;
        }
        .remove-content {
          display: block;
          height: 84px;
          line-height: 84px;
          font-size: 14px;
          color: #f05b47;
        }
      }
    }
    .no-components {
      text-align: center;
      padding: 167px 0;
      background: #f7f7f7;
      img {
        width: 75px;
        height: 75px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 13px;
        color: #999;
        margin-bottom: 3px;
      }
    }
    .component-li {
      width: 375px;
      .component-content {
        width: 375px; // margin-bottom: 10px;
        width: 373px;
        position: relative;
        .left {
          width: 373px;
          border: 2px solid #eeeeee;
          .demo {
            border: 2px solid red;
            height: 350px;
            width: 100%;
            background: red;
            color: #ffffff;
            font-size: 32px;
            text-align: center;
          }
        }
        .left.active-left {
          border: 2px solid #f05b47 !important;
        }
        .left:hover {
          width: 373px;
          border: 2px solid #f05b47 !important;
        }
        .right {
          margin-left: 8px;
          width: 375px;
          height: 250px; //   background: yellow;
          position: absolute;
          left: 100%;
          top: 0;
          .table.edit-table {
            width: 100%;
          }
          .right-option {
            border: 1px solid #d7d7d7;
            float: left;
            text-align: center;
            .option-item {
              .option-icon {
                font-size: 20px;
                padding: 5px;
                cursor: pointer;
                color: #cdcdcd;
              }
            }
            .option-item:hover {
              .option-icon {
                color: #f05b47;
              }
            }
            .option-item.no-action {
              .option-icon {
                color: #f1eeee;
                cursor: not-allowed;
              }
            }
          }
          .right-component-edit {
            margin-left: 33px;
            padding-bottom: 50px;
          }
        }
      }
    }
    .component-li:last-child {
      .component-content {
        margin-bottom: 0;
      }
    }
  }
}
.component-item {
  width: 33.33%;
  margin-bottom: 15px; // height: 100px;
  // margin-right: 15px;
  display: inline-block;
  text-align: center;
  .component-content {
    position: relative;
    cursor: pointer;
    padding: 10px;
    height: 82px;
    width: 82px;
    border: 1px solid #cbcbcb;
    border-radius: 15px;
    display: inline-block;
    .component-icon {
      font-size: 26px;
      color: #999;
    }
    .component-icon1 {
      font-size: 16px;
      position: absolute;
      right: 5px;
      top: 5px;
    }
    .text {
      font-size: 12px;
      color: #666;
    }
  }
  .remove-content {
    display: none;
  }
}
.component-item:hover {
  .component-content {
    border: 1px solid #f05b47;
    .component-icon {
      color: #f05b47;
    }
    .text {
      color: #f05b47;
    }
  }
}
.component-item {
  .layer-component-item {
    border: 1px solid #f05b47;
    .component-icon {
      color: #f05b47;
    }
    .text {
      color: #f05b47;
    }
  }
}

/*渐入渐出*/
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave {
  opacity: 1;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
</style>
