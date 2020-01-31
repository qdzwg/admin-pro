<template>
  <div class="navigation-custompage-box">
    <div :style="{width:width}" class="clearfix handel-box">
      <!-- <Button type="info" class=''>预览</Button> -->
      <Button @click="save" type="primary" style="margin-right:15px;" class>保存</Button>
    </div>
    <div class="clearfix">
      <div class="page-range fl custom-item">
        <div class="title-text">尾部备案应用页面</div>
        <CheckboxGroup class="page-range-item" v-model="pageData.range">
          <Checkbox label="homepage">
            <span>店铺主页</span>
          </Checkbox>
          <Checkbox label="strategyDetaliPage">
            <span>攻略详情</span>
          </Checkbox>
          <Checkbox label="strategyListPage">
            <span>攻略列表</span>
          </Checkbox>
          <Checkbox label="custompage">
            <span>自定义页</span>
          </Checkbox>
        </CheckboxGroup>
        <!-- {{pageData}} -->
        <!-- {{pageData.list}} -->
      </div>
      <div class="fl navigation-custom-show custom-item">
        <div class="page-top">
          <img class="top-img" src="../../../assets/images/top.jpg" alt>
        </div>
        <div
          :style="{backgroundColor:pageData.backgroundColor,backgroundImage:'url('+pageData.imgUrl+')'}"
          class="bottom-info-box clearfix"
        >
          <div class="bottom-info-logo">
            <img :src="pageData.logo" alt="">
          </div>
          <div class="bottom-info-code-list">
            <div class="bottom-info-code-item" v-for="(item, index) in pageData.codeList" :key='index'>
              <img :src="item.imgUrl" alt="">
              <div>{{item.name}}</div>
            </div>
          </div>
          <div class="bottom-info-link-list">
            <div class="bottom-info-link-item" :style="{width:100/pageData.lineNum+'%'}" v-for="(item, index) in pageData.linkList" :key='index'><div :style="{backgroundColor:pageData.linkBackgroundColor}">{{item.text}}</div></div>
          </div>
          <div class="bottom-info-text">
            <div>{{pageData.address}}</div>
            <div>{{pageData.info}}</div>
          </div>
        </div>
      </div>
      <div class="fl navigation-custom-edit custom-item" style="width:400px;">
        <div class="title-text">尾部备案</div>
        <div class="navigation-edit-content">
          <table class="navigation-edit-table">
            <tr>
              <td>底部图片</td>
              <td>
                <div class="img-cover-box" v-if="pageData.imgUrl">
                  <img style="height:60px;width:100px;" :src="pageData.imgUrl" alt>
                  <div class="tag-cover">
                    <Icon class="trash-icon" @click="delImgUrl('imgUrl')" type="ios-trash-outline"></Icon>
                  </div>
                </div>
                <div v-else class="img-up-box">
                  <Upload
                    :format="['jpg','jpeg','png','gif']"
                    :on-success="setImgUrl"
                    :show-upload-list="false"
                    :max-size="2048"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    action="/static/manage/uiFileUpload/dispatch?action=upload"
                  >
                    <Button type="primary">上传图片</Button>
                  </Upload>
                </div>
                <p style="margin-top:5px">建议上传尺寸750X310px的图片</p>
              </td>
            </tr>
            <tr>
              <td>背景颜色</td>
              <td>
                <ColorPicker v-model="pageData.backgroundColor"/>
                <Input v-model="pageData.backgroundColor" placeholder="请填写颜色" style="width:100px"></Input>
                <Button @click="backgroundColorReset" type="info">重置</Button>
              </td>
            </tr>
            <tr>
              <td>LOGO</td>
              <td>
                <div class="img-cover-box" v-if="pageData.logo">
                  <img style="height:60px;width:100px;" :src="pageData.logo" alt>
                  <div class="tag-cover">
                    <Icon class="trash-icon" @click="delImgUrl('logo')" type="ios-trash-outline"></Icon>
                  </div>
                </div>
                <div v-else class="img-up-box">
                  <Upload
                    :format="['jpg','jpeg','png','gif']"
                    :on-success="setLogo"
                    :show-upload-list="false"
                    :max-size="2048"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    action="/static/manage/uiFileUpload/dispatch?action=upload"
                  >
                    <Button type="primary">上传图片</Button>
                  </Upload>
                </div>
                <p style="margin-top:5px">建议上传尺寸750X310px的图片</p>
              </td>
            </tr>
            <tr>
              <td class="title">每行友情链接数量
                <!-- <span class="red">*</span> -->
              </td>
              <td>
                <RadioGroup v-model="pageData.lineNum">
                  <Radio label="3">
                    <span>3</span>
                  </Radio>
                  <Radio label="4">
                    <span>4</span>
                  </Radio>
                  <Radio label="5">
                    <span>5</span>
                  </Radio>
                  <Radio label="6">
                    <span>6</span>
                  </Radio>
                </RadioGroup>
              </td>
            </tr>
            <tr>
              <td>友情链接背景色</td>
              <td>
                <ColorPicker v-model="pageData.linkBackgroundColor"/>
                <Input v-model="pageData.linkBackgroundColor" placeholder="请填写颜色" style="width:100px"></Input>
                <Button @click="linkBackgroundColorReset" type="info">重置</Button>
              </td>
            </tr>
          </table>
            <template v-for="(link, index) in pageData.linkList">
            <table class="navigation-edit-table" style="border: 1px solid #dcdcdc;margin-bottom: 10px;padding: 10px;" :key="index">
              <tr>
                <td class="title">友情链接</td>
                <td>
                  <Input style="width: 230px;" v-model='link.text' :maxlength="30" size='small'></Input><Icon @click='delLink(index)' style="font-size: 20px;vertical-align: middle;margin-left:10px;" type="ios-trash-outline"></Icon>
                </td>
              </tr>
              <tr>
                <td class="title">链接地址</td>
                <td>
                  <custom-link :show="true" :itemData="link.customLinkObj"></custom-link>
                </td>
              </tr>
            </table>
            </template>
            <table class="navigation-edit-table">
              <tr>
                <td colspan="2">
                  <div style="padding:0 10px;margin-bottom:15px;">
                    <Button @click="addLink" long>
                      <Icon class="add-icon" type="ios-plus-outline" color="#3BB4F2" size="14"></Icon>添加一个友情链接
                    </Button>
                  </div>
                </td>
              </tr>
            </table>
            <template v-for="(code, index) in pageData.codeList">
            <table class="navigation-edit-table" style="border: 1px solid #dcdcdc;margin-bottom: 10px;padding: 10px;" :key="index+99">
              <tr>
                <td class="title">二维码名称</td>
                <td>
                  <Input style="width: 230px;" v-model='code.name' :maxlength="5" size='small'></Input><Icon @click='delCode(index)' style="font-size: 20px;vertical-align: middle;margin-left:10px;" type="ios-trash-outline"></Icon>
                </td>
              </tr>
              <tr>
                <td class="title">二维码图片</td>
                <td>
                  <div class="img-cover-box" v-if="code.imgUrl">
                    <img style="height:60px;width:100px;" :src="code.imgUrl" alt>
                    <div class="tag-cover">
                      <Icon class="trash-icon" @click="listImgDel(index)" type="ios-trash-outline"></Icon>
                    </div>
                  </div>
                  <div v-else class="img-up-box"
                  @click="imgIndex(index)"
                  >
                    <Upload
                      :format="['jpg','jpeg','png','gif']"
                      :on-success="setListImgUrl"
                      :show-upload-list="false"
                      :max-size="2048"
                      :on-format-error="handleFormatError"
                      :on-exceeded-size="handleMaxSize"
                      action="/static/manage/uiFileUpload/dispatch?action=upload"
                    >
                      <Button type="primary">上传图片</Button>
                    </Upload>
                  </div>
                  <p style="margin-top:5px">建议上传尺寸750X310px的图片</p>
                </td>
              </tr>
            </table>
            </template>
          <table class="navigation-edit-table">
            <tr>
              <td colspan="2">
                <div v-if="pageData.codeList.length<3" style="padding:0 10px;margin-bottom:15px;">
                  <Button @click="addCode" long>
                    <Icon class="add-icon" type="ios-plus-outline" color="#3BB4F2" size="14"></Icon>添加一个二维码
                  </Button>
                </div>
              </td>
            </tr>
            <tr>
              <td class="title">地址</td>
              <td>
                <Input v-model='pageData.address' :maxlength="30" size='small'></Input>
              </td>
            </tr>
            <tr>
              <td class="title">备案信息</td>
              <td>
                <Input type="textarea" v-model='pageData.info' :maxlength="60" size='small'></Input>
              </td>
            </tr>
          </table>
          <div class="content-edit">
            
          </div>
        </div>
      </div>
    </div>
    <Modal v-model="modal1" title="自定义链接" :mask-closable="false" :closable="false">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="110">
        <FormItem label="链接地址：" prop="custompageLinkUrl">
          <!-- {{formValidate.custompageLinkUrl}} -->
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
        <!-- <Button @click="ok" type="primary">确定</Button>
        <Button @click="cancel">取消</Button>-->
      </div>
    </Modal>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import customLink from "@/components/otherRouter/custompageLink";
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
        imgUrl: "",
        address: "",
        info: "",
        logo: "",
        linkBackgroundColor: "#ffffff",
        backgroundColor: "#ffffff",
        lineNum: '4',
        linkList: [{
          text: '',
          customLinkObj: {},
          backgroundColor: '#fff',
        }],
        codeList: [{
          name: "",
          imgUrl: ""
        }],
      },
      editIndex: null,
      linkList: [
        {
          value: "home",
          label: "店铺主页"
        },
        {
          value: "strategy",
          label: "游玩攻略"
        },
        {
          value: "shopcart",
          label: "购物车"
        },
        {
          value: "personal",
          label: "个人中心"
        },
        {
          value: "order",
          label: "我的订单"
        },
        {
          value: "coupon",
          label: "优惠券"
        },
        {
          value: "receivecoupons",
          label: "领取优惠券"
        },
        {
          value: "accountcenter",
          label: "账户中心"
        },
        {
          value: "ticket",
          label: "景区列表"
        },
        {
          value: "hotel",
          label: "酒店列表"
        },
        {
          value: "shop",
          label: "商品列表"
        },
        {
          value: "repast",
          label: "餐饮列表"
        },
        {
          value: "route",
          label: "跟团游列表"
        },
        {
          value: "custompage",
          label: "自定义页"
        },
        {
          value: "customlink",
          label: "自定义链接"
        }
      ],
      selectIndex: null,
      page: 1,
      limit: 10,
      pageName: "",
      total: 0,
    };
  },
  components: {
    draggable,
    customLink
  },
  computed: {
    ...mapState({
      errorShow: state => {
        return state.defined.errorShow;
      }
    }),
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
            imgUrl: "",
            address: "",
            info: "",
            logo: "",
            linkBackgroundColor: "#ffffff",
            backgroundColor: "#ffffff",
            lineNum: '4',
            linkList: [{
              text: '',
              customLinkObj: {},
              backgroundColor: '#fff',
            }],
            codeList: [{
              name: "",
              imgUrl: ""
            }],
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
      console.log(this.pageData);
      let flag = true;
      let _this = this;
        // try {
        //   this.pageData.list.forEach((item, index) => {
        //     if (
        //       !this.iconData[item.linkUrl] &&
        //       (!item.defaultImgUrl || !item.selectImgUrl)
        //     ) {
        //       if (!item.defaultImgUrl) {
        //         throw new Error("请上传底部导航" + item.title + "默认图片！");
        //       }
        //       if (!item.selectImgUrl) {
        //         throw new Error("请上传底部导航" + item.title + "选中图片！");
        //       }
        //     }
        //     if (!item.title) {
        //       throw new Error("请填写标题！");
        //     }
        //     if (!item.linkUrl) {
        //       throw new Error("请选择跳转链接！");
        //     }
        //   });
        // } catch (error) {
        //   flag = false;
        //   this.setErrorShow(true);
        //   this.$Message.warning(error.message);
        // }

        if (flag) {
          apiPost("/merchant/webApi/merchantRenovationTob/saveRenovation", {
            id: this.$route.query.id,
            content: JSON.stringify(this.pageData),
            pageType: "bottomFilingPage",
            pageName: "底部备案",
            pageDescribe: ""
          }).then(res => {
            if (res.status == 200) {
              this.setErrorShow(false);
              this.$Message.success("保存成功!");
              this.$router.push("/shop-decorate");
            } else {
              this.$Message.error(res.message);
            }
          });
        }
    },
    setActiveIndex(index) {
      this.activeIndex = index;
    },
    linkBackgroundColorReset() {
      this.pageData.linkBackgroundColor = "#fff";
    },
    linkListBackgroundColorReset(index) {
      this.pageData.linkList[index].backgroundColor = "#fff";
    },
    backgroundColorReset() {
      this.pageData.backgroundColor = "#fff";
    },
    listImgDel(index) {
      this.pageData.codeList[index].imgUrl = "";
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
    delImgUrl(prop) {
      this.pageData[prop] = "";
    },
    delImg(prop) {
      this.pageData[prop].imgUrl = "";
    },
    setLogo(res, file) {
      this.pageData.logo = res.prefix + res.url;
    },
    setImgUrl(res, file) {
      this.pageData.imgUrl = res.prefix + res.url;
    },
    setImgLeft(res, file) {
      this.pageData.left.imgUrl = res.prefix + res.url;
    },
    setImgRight(res, file) {
      this.pageData.right.imgUrl = res.prefix + res.url;
    },
    delLink(index) {
      this.pageData.linkList.splice(index,1);
    },
    delCode(index) {
      this.pageData.codeList.splice(index,1);
    },
    addLink() {
      this.pageData.linkList.push({
        text: "",
        backgroundColor: "#fff",
        customLinkObj: {},
      });
    },
    addCode() {
      this.pageData.codeList.push({
        name: "",
        imgUrl: "",
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
    imgIndex(index) {
      this.activeIndex = index;
    },
    setListImgUrl(res, file) {
      this.pageData.codeList[this.activeIndex].imgUrl = res.prefix + res.url;
    },
  }
};
</script>
<style lang='scss'>
@import "./../../../assets/styles/font/iconfont.css";
.navigation-custompage-box {
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
    width: 135px;
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
    width: 375px;
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
            width: 200px;
            .navigation-right-table {
              width: 100%;
              td {
                padding: 5px 0;
              }
              td:first-child {
                width: 30px;
              }
            }
          }
        }
        .navigation-li:last-child {
          margin-bottom: 0;
        }
      }
      .content-edit {
        padding: 15px 0px;
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
    }
    .bottom-info-box {
      padding: 20px 0px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      border: 1px solid rgba(215, 215, 215, 1);
      color: #fff;
      text-align: center;
      min-height: 360px;
      .bottom-info-logo {
        margin: 20px 0px;
        img {
          width: 130px;
          height: 30px;
        }
      }
      .bottom-info-code-list {
        display: flex;
        font-size: 14px;
        line-height: 32px;
        justify-content: center;
        .bottom-info-code-item {
          display: flex;
          flex-grow: 0;
          flex-shrink: 0;
          margin: 0px 10px;
          flex-direction: column;
          img {
            width: 100px;
            height: 100px;
          }
        }
      }
      .bottom-info-link-list {
        display: flex;
        flex-wrap: wrap;
        color: #ccc;
        justify-content: center;
        font-size: 16px;
        line-height: 36px;
        margin: 20px 5px 10px;
        .bottom-info-link-item {
          flex-grow: 0;
          flex-shrink: 0;
          border: 1px solid transparent;
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
