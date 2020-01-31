<template>
  <div class="pcnavigation-custompage-box">
    <div :style="{width:width}" class="clearfix handel-box">
      <!-- <Button type="info" class=''>预览</Button> -->
      <Button @click="save" type="primary" style="margin-right:15px;" class>保存</Button>
    </div>
    <div style="margin-bottom:15px">
      <div>店铺导航说明：</div>
      <div>店铺的各个页面可以通过导航串联起来，通过设置店铺导航方便买家在栏目之间快速切换。</div>
    </div>
    <div class="clearfix">
      <!-- <div class="page-range fl custom-item">
        <div class="title-text">导航应用页面</div>
        <CheckboxGroup class="page-range-item" v-model="pageData.range">
          <Checkbox label="homepage">
            <span>店铺主页</span>
          </Checkbox>
          <Checkbox label="orderpage">
            <span>订单</span>
          </Checkbox>
          <Checkbox label="personalpage">
            <span>个人中心</span>
          </Checkbox>
          <Checkbox label="shopcartpage">
            <span>购物车</span>
          </Checkbox>
          <Checkbox label="custompage">
            <span>自定义页</span>
          </Checkbox>
        </CheckboxGroup>    
      </div> -->
      <div class="fl navigation-custom-show custom-item">
        <!-- <div class="page-top">
          <img class="top-img" src="../../../assets/images/top.jpg" alt>
        </div> -->
        <div
          :style="{background:pageData.backgroundColor,'border-top':'1px solid ' + pageData.backgroundLineColor}"
          class="bottom-navigation-box clearfix"
          :class="{'no-list':!pageData.list.length}"
        >
          <div
            v-for="(item,index) in pageData.list"
            :key="index"
            @click="setActiveIndex(index)"
            :class="{'active':index==activeIndex}"
            :style="{width:navigationWidth, backgroundColor:activeIndex==index?pageData.selectBackgroundColor:pageData.backgroundColor}"
            class="bottom-navigation-item"
          >           
            <div
              class="navigation-text"
              :style="{color:activeIndex==index?pageData.selectTextColor:pageData.textColor}"
            >{{item.title?item.title:'默认导航'}}</div>
          </div>
        </div>
        <div class="page-content"></div>
        
      </div>
      <div class="fl navigation-custom-edit custom-item" style="width:400px;">
        <div class="title-text">PC导航</div>
        <div class="navigation-edit-content">
          <div>导航最少需要2个导航项，最多支持12个导航项。</div>
          <table class="navigation-edit-table">
            <tr>
              <td>文字颜色</td>
              <td>
                <ColorPicker v-model="pageData.textColor"/>
                <Button @click="textColorReset" type="info">重置</Button>
              </td>
            </tr>
            <tr>
              <td>选中文字颜色</td>
              <td>
                <ColorPicker v-model="pageData.selectTextColor"/>
                <Button @click="selectTextColorResert" type="info">重置</Button>
              </td>
            </tr>
            <tr>
              <td>导航背景</td>
              <td>
                <ColorPicker v-model="pageData.backgroundColor"/>
                <Button @click="backgroundColorReset" type="info">重置</Button>
              </td>
            </tr>
            <tr>
              <td>背景线颜色</td>
              <td>
                <ColorPicker v-model="pageData.backgroundLineColor"/>
                <Button @click="backgroundLineColorReset" type="info">重置</Button>
              </td>
            </tr>
            <tr>
              <td>导航选中背景色</td>
              <td>                
                <ColorPicker v-model="pageData.selectBackgroundColor"/>
                <Button @click="selectBackgroundColorReset" type="info">重置</Button>
              </td>
            </tr>
          </table>
          <div class="navigation-ul">
            <draggable
              :list="pageData.list"
              :options="{animation:150}"
              :no-transition-on-drag="true"
            >
              <div
                v-for="(item,index) in pageData.list"
                :key="index"
                class="navigation-li clearfix"
              >
                <Icon
                  v-if="pageData.list.length>2"
                  @click="navigationDel(index)"
                  type="close-circled navigation-li-del"
                ></Icon>
               
                <div class="navigation-li-right fr">
                  <table class="navigation-right-table">
                    <tr>
                      <td>文字</td>
                      <td>
                        <Input
                          size="small"
                          :class="{'error':errorShow&&!item.title}"
                          v-model="item.title"
                          placeholder="请填写名称"
                          maxlength="6"
                        ></Input>
                      </td>
                    </tr>
                    <tr>
                      <td>链接</td>
                      <td>
                        <pcustom-link :show="true" :itemData="item"></pcustom-link>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </draggable>
          </div>
        </div>
        <div v-if="pageData.list.length<12" style="padding:0 10px;margin-bottom:15px;">
          <Button @click="add" long>
            <Icon class="add-icon" type="ios-plus-outline" color="#3BB4F2" size="14"></Icon>添加一个导航项
          </Button>
        </div>
      </div>
    </div>
    <Modal v-model="modal1" title="自定义链接" :mask-closable="false" :closable="false">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="110">
        <FormItem label="链接地址：" prop="custompageLinkUrl">         
          <Input @on-enter="ok" v-model="formValidate.custompageLinkUrl">
            <span slot="prepend">http://</span>
          </Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="ok" type="primary">确定</Button>
        <Button @click="cancel">取消</Button>
      </div>
    </Modal>
    <Modal v-model="modal2" title="自定义页选择" width="1000">
      <Form ref="formInline" inline>
        <FormItem>
          <Input v-model="pageName" placeholder="页面名称"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="getList">搜索</Button>
        </FormItem>
      </Form>
      <Table border :columns="columns7" :data="data6"></Table>
      <Page @on-change="pageChange" style="margin-top:10px" :total="total" show-elevator></Page>
      <div slot="footer">
        
      </div>
    </Modal>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import pcustomLink from "@/components/otherRouter/pcCustompageLink";
import { apiPost, apiGet } from "@/fetch/api";
import { mapActions, mapState } from "vuex";
export default {
  mounted() {
    let _this = this;
    this.width = $("#app").width() - 220 + "px";
    $(window).resize(function() {
      _this.width = $("#app").width() - 220 + "px";
      // console.log(_this.width)
    });
  },
  data() {
    return {
      width: "",
       iconData: {
        home: "icon-nav-home",
        order: "icon-nav-orders",
        personal: "icon-member",
        shopcart: "icon-shopping-car",
        ticket:'icon-nav-ticket',
        hotel:'icon-nav-hotel',
        shop:'icon-nav-goods',
        strategy:'icon-nav-raiders',
        route:'icon-nav-tours',
        repast:'icon-nav-foods',
        ai_p:'icon-AIpaiyipai',
        customtel:'icon-bohao'
      },
      columns7: [
        {
          title: "页面名称",
          key: "renovationPageName"
        },
        {
          title: "更新时间",
          key: "modifyTime"
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.pageData.list[this.selectIndex].customPageId =
                        params.row.id;
                      this.pageData.list[this.selectIndex].customPageName =
                        params.row.renovationPageName;
                      this.modal2 = false;
                    }
                  }
                },
                "选择"
              )
            ]);
          }
        }
      ],
      data6: [],
      modal2: false,
      formValidate: {
        custompageLinkUrl: ""
      },
      ruleValidate: {
        custompageLinkUrl: [
          {
            required: true,
            message: "请输入自定义链接",
            trigger: "blur"
          }
        ]
      },
      modal1: false,
      activeIndex: null,
      pageData: {
        range: [],
        textColor: "#999",
        selectTextColor: "#000",
        backgroundColor: "#ffffff",
        backgroundLineColor: "#d7d7d7",
        selectBackgroundColor: "#f63",
        list: []
      },
      editIndex: null,
      social: [],
      color1: "#19be6b",
      selectIndex: null,
      page: 1,
      limit: 10,
      pageName: "",
      total: 0
    };
  },
  components: {
    draggable,
    pcustomLink
  },
  computed: {
    ...mapState({
      errorShow: state => {
        return state.defined.errorShow;
      }
    }),
    navigationWidth() {
      return this.pageData.list.length
        ? (1 / this.pageData.list.length) * 100 + "%"
        : "100%";
    }
  },
  created() {
    if (this.$route.query && this.$route.query.id) {
      apiGet(
        "/merchant/webApi/merchantRenovationTob/getRenovationById?id=" +
          this.$route.query.id
      ).then(res => {
        // console.log(res)
        if (res.data.content) {
          this.pageData = JSON.parse(res.data.content);
        } else {
          this.pageData = {
            range: [],
            textColor: "#999",
            selectTextColor: "#000",
            backgroundColor: "#ffffff",
            backgroundLineColor: "#d7d7d7",
            selectBackgroundColor: "#f63",
            list: [
              {
                defaultImgUrl: "",
                selectImgUrl: "",
                title: "",
                linkUrl: "",
                customLinkurl: "",
                customPageId: "",
                customPageName: "",
                icon: ""
              },
              {
                defaultImgUrl: "",
                selectImgUrl: "",
                title: "",
                linkUrl: "",
                customLinkurl: "",
                customPageId: "",
                customPageName: "",
                icon: ""
              }
            ]
          };
        }
      });
    } else {
    }
  },
  methods: {
    ...mapActions("defined", ["setErrorShow"]),
    pageChange(page) {
      this.page = page;
      this.getList();
    },
    getList() {
      apiPost("/merchant/webApi/merchantRenovationTob/selectCustomPage", {
        page: this.page,
        limit: this.limit,
        pageName: this.pageName
      }).then(res => {
        this.data6 = res.data.rows;
        this.total = res.data.total;
      });
    },
    customPageDel(index) {
      this.pageData.list[index].customPageId = "";
      this.pageData.list[index].linkUrl = "";
      this.pageData.list[index].customPageName = "";
    },
    customlinkDel(index) {
      this.pageData.list[index].customLinkurl = "";
      this.pageData.list[index].linkUrl = "";
    },
    showModal(index) {
      this.modal1 = true;
      this.formValidate.custompageLinkUrl = this.pageData.list[
        index
      ].customLinkurl;
    },
    showModal2(index) {
      this.modal2 = true;
      this.getList();
    },
    getSelectIndex(index) {
      this.selectIndex = index;
    },
    ok() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.pageData.list[
            this.selectIndex
          ].customLinkurl = this.formValidate.custompageLinkUrl;
          this.modal1 = false;
        }
      });
    },
    cancel() {
      if (this.pageData.list[this.selectIndex].customLinkurl) {
        this.modal1 = false;
      } else {
        this.pageData.list[this.selectIndex].customLinkurl = "";
        this.pageData.list[this.selectIndex].linkUrl = "";
        this.modal1 = false;
      }
    },
    change(val) {
      if (val == "custompage") {
        //自定义页面
        this.modal2 = true;
        this.getList();
      } else if (val == "customlink") {
        //自定义链接
        this.modal1 = true;
        this.formValidate.custompageLinkUrl = "";
      }
    },
    save() {
      let flag = true;
      let _this = this;
      try {
        this.pageData.list.forEach((item, index) => {           
          if (!item.title) {
            throw new Error("请填写标题！");
          }
          if (!item.linkUrl) {
            throw new Error("请选择跳转链接！");
          }
        });
      } catch (error) {
        flag = false;
        this.setErrorShow(true);
        this.$Message.warning(error.message);
      }
      if (flag) {
        apiPost("/merchant/webApi/merchantRenovationTob/saveRenovation", {
          id: this.$route.query.id,
          content: JSON.stringify(this.pageData),
          pageType: "pcPage",
          pageName: "官网主页",
          pageDescribe: ""
        }).then(res => {
          this.setErrorShow(false);
          this.$Message.success("保存成功!");
          this.$router.push("/shop-decorate");
        });
      }
    },
    setActiveIndex(index) {
      this.activeIndex = index;
    },
    textColorReset() {
      this.pageData.textColor = "#999";
    },
    selectTextColorResert() {
      this.pageData.selectTextColor = "#000";
    },
    backgroundColorReset() {
      this.pageData.backgroundColor = "#fff";
    },
    backgroundLineColorReset() {
      this.pageData.backgroundLineColor = "#d7d7d7";
    },
    selectBackgroundColorReset() {
      this.pageData.selectBackgroundColor = "#f63";
    },
    defaultImgDel(index) {
      this.pageData.list[index].defaultImgUrl = "";
    },
    selectImgDel(index) {
      this.pageData.list[index].selectImgUrl = "";
    },
    navigationDel(index) {
      this.pageData.list.splice(index, 1);
      this.$Message.success("删除成功!");
    },
    changeEditIndex(index) {
      this.editIndex = index;
    },
    add() {
      this.pageData.list.push({
        defaultImgUrl: "",
        selectImgUrl: "",
        title: "",
        linkUrl: "",
        customLinkurl: "",
        customPageId: "",
        customPageName: "",
        icon: ""
      });
    },
     handleMaxSize (file) {
                this.$Notice.warning({
                    title: '图片超过2M',
                    desc: '图片：' + file.name + '太大， 不能超过2M'
                });
            },
    handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式错误',
                    desc: '文件： ' + file.name + '格式错误, 请选择图片格式jpg,png上传'
                });
            },
    setDefaultImgUrl(res, file) {
      this.pageData.list[this.editIndex].defaultImgUrl = res.prefix + res.url;
    },
    setSelectImgUrl(res, file) {
      this.pageData.list[this.editIndex].selectImgUrl = res.prefix + res.url;
    }
  }
};
</script>
<style lang='scss'>
@import "./../../../assets/styles/font/iconfont.css";
.pcnavigation-custompage-box {
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
  .handel-box {
    position: fixed;
    z-index: 99;
    bottom: 0px;
    text-align: center;
    // background: #ffffff;
    padding-bottom: 7px;
  }
  .customlink {
    // width: 220px;
    // height: 35px;
    // line-height: 35px;
    padding-left: 5px;
    background: #cbcbcb;
    width: 100%;
    position: relative;

    .text {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .customlink-del {
      position: absolute;
      font-size: 16px;
      color: #f05b47;
      padding: 5px;
      top: -12px;
      right: -10px;
      cursor: pointer;
    }
  }
  .custom-item {
    width: 700px;
    margin-right: 15px;
    .title-text {
      background: rgba(228, 228, 228, 1);
      font-size: 14px;
      height: 35px;
      padding-left: 10px;
      line-height: 35px;
    }
  }
  .navigation-custom-edit {
    border: 1px solid rgba(215, 215, 215, 1);
    margin-bottom: 50px;
    .navigation-edit-content {
      padding: 10px;
      .navigation-edit-table {
        width: 100%;
        tr {
          td {
            padding: 5px 0;
          }
          td:first-child {
            width: 85px;
          }
        }
      }
      .navigation-ul {
        .navigation-li {
          padding: 5px;
          margin-bottom: 10px;
          border: 1px solid rgba(215, 215, 215, 1);
          position: relative;
          .navigation-li-del {
            position: absolute;
            top: -10px;
            right: -8px;
            font-size: 18px;
            color: #f05b47;
            cursor: pointer;
          }
          .navigation-li-left {
            padding: 7px 5px;
            .left-item.error {
              border-color: red;
              .upload-div.ivu-upload {
                .add-icon {
                  color: red;
                }
                .upload-text {
                  color: red;
                }
              }
            }
            .left-item {
              cursor: pointer;
              text-align: center;
              width: 75px;
              height: 75px;
              border: 1px solid rgba(215, 215, 215, 1);
              .add-icon {
                color: #3bb4f2;
              }
              .icon-default {
                height: 75px;
                width: 75px;
                position: relative;
                line-height: 75px;
                .navigation-default-icon {
                  font-size: 30px;
                }
                .icon-cover {
                  display: none;
                  background: rgba(0, 0, 0, 0.6);
                  color: #3bb4f2;
                  position: absolute;
                  height: 24px;
                  line-height: 24px;
                  left: 0;
                  bottom: 0;
                  right: 0;
                }
              }
              .icon-default:hover {
                .icon-cover {
                  display: block;
                }
              }
              .navigation-img-box {
                height: 100%;
                width: 100%;
                position: relative;
                .left-item-img {
                  width: 100%;
                  height: 100%;
                }
                .cover {
                  display: none;
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  left: 0;
                  top: 0;
                  background: rgba(0, 0, 0, 0.6);
                  .del-icon {
                    font-size: 20px;
                    color: #fff;
                    margin-top: 22px;
                    cursor: pointer;
                    padding: 5px;
                  }
                }
              }
              .navigation-img-box:hover {
                .cover {
                  display: block;
                }
              }
              .ivu-upload.upload-div {
                padding: 13px 0;
                .upload-text {
                  margin-top: 12px;
                  color: rgb(59, 180, 242);
                }
                .add-icon {
                  font-size: 16px;
                }
              }
            }
            .left-item:first-child {
              margin-right: 5px;
            }
          }
          .navigation-li-right {
            width: 100% !important;
            .navigation-right-table {
              width: 100%;
              td {
                padding: 5px 0;
              }
              td:first-child {
                width: 30px;
              }
            }
            .linkUrl{
              .customlink{
                width: 100%;
                .custom-link-text{

                }
              }
            }
          }
        }
        .navigation-li:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  .navigation-custom-show {
    .page-top {
      height: 75px;
      .top-img {
        width: 100%;
        height: 75px;
      }
    }
    .page-content {
      height: 340px;
      border-left: 1px solid rgba(215, 215, 215, 1);
      border-right: 1px solid rgba(215, 215, 215, 1);
      border-bottom: 1px solid rgba(215, 215, 215, 1);
    }
    .bottom-navigation-box {
      border: 1px solid rgba(215, 215, 215, 1);
      .bottom-navigation-item {
        padding: 10px 5px;
        float: left;
        text-align: center;
        cursor: pointer;
        .default-img {
          height: 40px;
          width: 40px;
        }
        .navigation-text {
          font-size: 12px;
          color: #999;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .item-icon {
          font-size: 30px;
        }
      }
    }
    .no-list {
      border-bottom: 0;
      border-left: 0;
      border-right: 0;
    }
  }
  .page-range {
    border: 1px solid rgba(215, 215, 215, 1);
    height: 500px;

    .page-range-item {
      padding: 10px;
      .ivu-checkbox-wrapper.ivu-checkbox-group-item {
        width: 30%;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
