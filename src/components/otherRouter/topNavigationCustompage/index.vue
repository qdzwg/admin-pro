<template>
  <div class="navigation-custompage-box">
    <div :style="{width:width}" class="clearfix handel-box">
      <!-- <Button type="info" class=''>预览</Button> -->
      <Button @click="save" type="primary" style="margin-right:15px;" class>保存</Button>
    </div>
    <div class="clearfix">
      <div class="page-range fl custom-item">
        <div class="title-text">顶部导航应用页面</div>
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
          :style="{background:pageData.backgroundColor,border:'1px solid ' + pageData.borderColor}"
          class="top-navigation-box clearfix"
        >
          <div class="top-navigation-block">
            <div class="top-navigation-left">
              <div v-if='pageData.left.type==="menu"'>
                <div>
                  <i class="top-navigation-menu-icon xx-icon icon-ziyuan2"></i>
                </div>
              </div>
              <div v-if='pageData.left.type==="picture"'>
                <div class="top-navigation-picture">
                  <img :src="pageData.left.imgUrl" alt="">
                  <div v-show="pageData.left.text">{{pageData.left.text}}</div>
                </div>
              </div>
            </div>
            <div class="top-navigation-center">
              <img :src="pageData.imgUrl" alt="">
            </div>
            <div class="top-navigation-right">
              <div v-if='pageData.right.type==="menu"'>
                <div>
                  <i class="top-navigation-menu-icon xx-icon icon-ziyuan2"></i>
                </div>
              </div>
              <div v-if='pageData.right.type==="picture"'>
                <div class="top-navigation-picture">
                  <img :src="pageData.right.imgUrl" alt="">
                  <div v-show="pageData.right.text">{{pageData.right.text}}</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Menu theme="dark" style="width: 100%;">
              <template v-for="(item, index) in (pageData.left.type==='menu'?pageData.left.data:pageData.right.data)">
                <Submenu :name="item.title" :key="index" v-if="item.children&&item.children.length">
                  <template slot="title">
                    <img :src="item.log" v-show='item.log' style="width: 20px;height: 20px;vertical-align: middle;" alt="">
                    {{item.title}}
                  </template>
                  <template v-for="(item1, index1) in item.children">
                    <Submenu :name="item1.title" :key="index1" v-if="item1.children&&item1.children.length">
                      <template slot="title">
                        {{item1.title}}
                      </template>
                      <template v-for="(item2, index2) in item1.children">
                        <Submenu :name="item2.title" :key="index2" v-if="item2.children&&item2.children.length">
                          <template slot="title">
                            {{item2.title}}
                          </template>
                          <MenuItem v-for="(item3, index3) in item2.children" :name="item3.title" :key="index3">{{item3.title}}</MenuItem>
                        </Submenu>
                        <MenuItem :name="item2.title" :key="index2" v-else>{{item2.title}}</MenuItem>
                      </template>
                    </Submenu>
                    <MenuItem :name="item1.title" :key="index1" v-else>{{item1.title}}</MenuItem>
                  </template>
                </Submenu>
                <MenuItem :name="item.title" v-else :key="index">
                    <img :src="item.log" v-show='item.log' style="width: 20px;height: 20px;vertical-align: middle;" alt="">
                {{item.title}}</MenuItem>
              </template>
            </Menu>
          </div>
        </div>
      </div>
      <div class="fl navigation-custom-edit custom-item" style="width: 450px;">
        <div class="title-text">顶部导航</div>
        <div class="navigation-edit-content">
          <table class="navigation-edit-table">
            <tr>
              <td>边框颜色</td>
              <td>
                <ColorPicker v-model="pageData.borderColor"/>
                <Button @click="borderColorReset" type="info">重置</Button>
              </td>
            </tr>
            <tr>
              <td>背景颜色</td>
              <td>
                <ColorPicker v-model="pageData.backgroundColor"/>
                <Button @click="backgroundColorReset" type="info">重置</Button>
              </td>
            </tr>
            <tr>
              <td>左位插入</td>
              <td>
                <RadioGroup v-model="pageData.left.type">
                  <Radio label="menu" :disabled="pageData.right.type==='menu'">
                    <span>菜单目录</span>
                  </Radio>
                  <Radio label="picture">
                    <span>图文</span>
                  </Radio>
                </RadioGroup>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="content-edit">
                  <div class="content-edit-menu" v-if='pageData.left.type==="menu"'>
                    <Button @click="appendMenu(pageData.left.data)" type="primary">添加一级目录</Button>
                    <Tree :data="pageData.left.data" :render="renderContent" multiple></Tree>
                  </div>
                  <div class="content-edit-picture" v-if='pageData.left.type==="picture"'>
                    <table style="width: 100%;">
                      <tr>
                        <td rowspan="2">
                          <div style="height:60px;width:100px;" class="img-cover-box" v-if="pageData.left.imgUrl">
                            <img style="height:60px;width:100px;" :src="pageData.left.imgUrl" alt>
                            <div class="tag-cover">
                              <Icon class="trash-icon" @click="delImg('left')" type="ios-trash-outline"></Icon>
                            </div>
                          </div>
                          <Upload
                            :format="['jpg','jpeg','png','gif']"
                            :on-success="setImgLeft"
                            :show-upload-list="false"
                            :max-size="2048"
                            :on-format-error="handleFormatError"
                            :on-exceeded-size="handleMaxSize"
                            action="/static/manage/uiFileUpload/dispatch?action=upload"
                          >
                            <div  v-if="!pageData.left.imgUrl" style="height:60px;width:100px;line-height: 60px;border: 1px solid #ccc;text-align: center;">
                              上传图片
                            </div>
                          </Upload>
                        </td>
                        <td>文字</td>
                        <td>
                          <Input v-model="pageData.left.text" :maxlength="4"></Input>
                        </td>
                      </tr>
                      <tr>
                        <td>链接</td>
                        <td>
                          <custom-link :show="true" :itemData="pageData.left.customLinkObj"></custom-link>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>中位插入</td>
              <td>
                <div class="img-cover-box" v-if="pageData.imgUrl">
                  <img style="height:60px;width:100px;" :src="pageData.imgUrl" alt>
                  <div class="tag-cover">
                    <Icon class="trash-icon" @click="delImgUrl" type="ios-trash-outline"></Icon>
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
              <td>右位插入</td>
              <td>
                <RadioGroup v-model="pageData.right.type">
                  <Radio label="menu" :disabled="pageData.left.type==='menu'">
                    <span>菜单目录</span>
                  </Radio>
                  <Radio label="picture">
                    <span>图文</span>
                  </Radio>
                </RadioGroup>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="content-edit">
                  <div class="content-edit-menu" v-if='pageData.right.type==="menu"'>
                    <Button @click="appendMenu(pageData.right.data)" type="primary">添加一级目录</Button>
                    <Tree :data="pageData.right.data" :render="renderContent" multiple></Tree>
                  </div>
                  <div class="content-edit-picture" v-if='pageData.right.type==="picture"'>
                    <table style="width: 100%;">
                      <tr>
                        <td rowspan="2">
                          <div style="height:60px;width:100px;" class="img-cover-box" v-if="pageData.right.imgUrl">
                            <img style="height:60px;width:100px;" :src="pageData.right.imgUrl" alt>
                            <div class="tag-cover">
                              <Icon class="trash-icon" @click="delImg('right')" type="ios-trash-outline"></Icon>
                            </div>
                          </div>
                          <Upload
                            :format="['jpg','jpeg','png','gif']"
                            :on-success="setImgRight"
                            :show-upload-list="false"
                            :max-size="2048"
                            :on-format-error="handleFormatError"
                            :on-exceeded-size="handleMaxSize"
                            action="/static/manage/uiFileUpload/dispatch?action=upload"
                          >
                            
                            <div v-if="!pageData.right.imgUrl" style="height:60px;width:100px;line-height: 60px;border: 1px solid #ccc;text-align: center;">
                              上传图片
                            </div>
                          </Upload>
                        </td>
                        <td>文字</td>
                        <td>
                          <Input v-model="pageData.right.text" :maxlength="4"></Input>
                        </td>
                      </tr>
                      <tr>
                        <td>链接</td>
                        <td>
                          <custom-link :show="true" :itemData="pageData.right.customLinkObj"></custom-link>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </td>
            </tr>
          </table>
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
        borderColor: "#dcdcdc",
        backgroundColor: "#ffffff",
        right: {
          type: "picture",
          text: '',
          imgUrl: '',
          customLinkObj: {},
          data: [],
        },
        left: {
          type: "menu",
          text: '',
          imgUrl: '',
          customLinkObj: {},
          data: [
              {
                  title: 'parent 1',
                  expand: true,
                  level: 1,
                  log: '',
                  logName: '',
                  customLinkObj: {
                      linkUrl: "",
                      customLinkurl: "",
                      customPageId: "",
                      customPageName: "",
                      strategyArr: [],
                      customTel: ""
                  },
                  children: [
                      {
                          title: 'child 1-1',
                          expand: true,
                          customLinkObj: {
                              linkUrl: "",
                              customLinkurl: "",
                              customPageId: "",
                              customPageName: "",
                              strategyArr: [],
                              customTel: ""
                          },
                          children: [
                              {
                                  title: 'leaf 1-1-1',
                                  customLinkObj: {
                                      linkUrl: "",
                                      customLinkurl: "",
                                      customPageId: "",
                                      customPageName: "",
                                      strategyArr: [],
                                      customTel: ""
                                  },
                                  expand: true
                              }
                          ]
                      },
                  ]
              }
          ],
        }
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
      currentNode: {},
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
        console.log(JSON.parse(res.data.content))
        if (res.data.content) {
          this.pageData = JSON.parse(res.data.content);
        } else {
          this.pageData = {
            range: [],
            borderColor: "#dcdcdc",
            imgUrl: "",
            backgroundColor: "#ffffff",
            left: {
              type: "menu",
              text: '',
              imgUrl: '',
              customLinkObj: {},
              data: [
                {
                    title: 'parent 1',
                    expand: true,
                    level: 1,
                    log: '',
                    logName: '',
                    customLinkObj: {
                        linkUrl: "",
                        customLinkurl: "",
                        customPageId: "",
                        customPageName: "",
                        strategyArr: [],
                        customTel: ""
                    },
                    children: [
                        {
                            title: 'child 1-1',
                            expand: true,
                            customLinkObj: {
                                linkUrl: "",
                                customLinkurl: "",
                                customPageId: "",
                                customPageName: "",
                                strategyArr: [],
                                customTel: ""
                            },
                            children: [
                                {
                                    title: 'leaf 1-1-1',
                                    customLinkObj: {
                                        linkUrl: "",
                                        customLinkurl: "",
                                        customPageId: "",
                                        customPageName: "",
                                        strategyArr: [],
                                        customTel: ""
                                    },
                                    expand: true
                                }
                            ]
                        },
                    ]
                }
              ]
            },
            right: {
              type: "picture",
              text: '',
              imgUrl: '',
              customLinkObj: {},
              data: []
            }
          };
        }
      });
    } else {
    }
  },
  methods: {
    ...mapActions("defined", ["setErrorShow"]),
    renderContent (h, { root, node, data }) {
        return h('span', {
            style: {
                display: 'inline-block',
                width: '100%'
            }
        }, [
            h('Input', {
                style: {
                    width: '130px'
                },
                props: {
                    type: 'text',
                    maxlength: 10,
                    value: data.title
                },
                on: {
                    // change: (event) => {
                    //   data.title = event;
                    // },
                    input: (event) => {
                      data.title = event;
                    }
                }
            }),
            h('span', {
                style: {
                    display: 'inline-block',
                    marginRight: '20px',
                    float: 'right',
                },
                on: {
                    click: () => { this.currentNode = data; }
                }
            }, [
                data.level < 4 ? h('Button', {
                    props: {
                        type: "primary",
                        size: 'small',
                        icon: 'ios-plus-empty'
                    },
                    on: {
                        click: () => { this.append(data) }
                    }
                }) : null,
                h('Button', {
                    props: {
                        type: 'ghost',
                        size: 'small',
                        icon: 'ios-minus-empty'
                    },
                    on: {
                        click: () => { this.remove(root, node, data) }
                    }
                }),
                h(customLink, {
                    style: {
                      width: '160px',
                      display: 'inline-block',
                      verticalAlign: 'middle',
                    },
                    props: {
                        show: true,
                        itemData: data.customLinkObj
                    },
                    on: {
                        'on-change': (event) => {
                        console.log(event)
                        }
                    }
                }),
                data.level == 1 ? h("Upload", {
                    props: {
                        format: ['jpg','jpeg','png','gif'],
                        maxSize: 2048,
                        action: "/static/manage/uiFileUpload/dispatch?action=upload",
                        onSuccess: this.setIcon,
                        onFormatError: this.handleFormatError,
                        onExceededSize: this.handleMaxSize,
                        onRemove: this.delIcon(data),
                        defaultFileList: data.log?[{name: data.logName,url:data.log}]:[]
                    },
                },data.log?'':'上传图片'):null
            ])
        ]);
    },
    appendMenu (data) {
        data.push({
            title: '标题名称',
            customLinkObj: {
                linkUrl: "",
                customLinkurl: "",
                customPageId: "",
                customPageName: "",
                strategyArr: [],
                customTel: ""
            },
            level: 1,
            log: '',
            logName: '',
            children: [],
            expand: true
        });
    },
    append (data) {
      if(data.level == 4){
        return;
      }
        const children = data.children || [];
        children.push({
            title: '标题名称',
            level: data.level+1,
            customLinkObj: {
                linkUrl: "",
                customLinkurl: "",
                customPageId: "",
                customPageName: "",
                strategyArr: [],
                customTel: ""
            },
            expand: true
        });
        this.$set(data, 'children', children);
    },
    remove (root, node, data) {
        const parentKey = root.find(el => el === node).parent;
        if(parentKey!==undefined){
          const parent = root.find(el => el.nodeKey === parentKey).node;
          const index = parent.children.indexOf(data);
          parent.children.splice(index, 1);
        }else{
          let list = this.pageData.left.type === "menu" ? this.pageData.left.data: this.pageData.right.data;
          const index = list.indexOf(data);
          list.splice(index, 1);
        }
    },
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
            pageType: "topNavigationPage",
            pageName: "顶部导航",
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
    borderColorReset() {
      this.pageData.borderColor = "#dcdcdc";
    },
    backgroundColorReset() {
      this.pageData.backgroundColor = "#fff";
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
    delImgUrl() {
      this.pageData.imgUrl = "";
    },
    delImg(prop) {
      this.pageData[prop].imgUrl = "";
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
    setIcon(res, file) {
      this.currentNode.log = res.prefix + res.url;
      this.currentNode.logName = file.name;
      console.log(this.currentNode)
    },
    delIcon(data) {
      return function () {
        data.log = '';
        data.logName = '';
      }
    },
    setSelectImgUrl(res, file) {
      this.pageData.list[this.editIndex].selectImgUrl = res.prefix + res.url;
    }
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
    .top-navigation-box {
      border: 1px solid rgba(215, 215, 215, 1);
      .top-navigation-block {
        line-height: 0px;
        font-size: 20px;
        padding: 0px 10px;
        height: 88px;
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: space-between;
        img {
          width: 55px;
          height: 55px;
        }
        .top-navigation-menu-icon {
          font-size: 55px;
        }
        .top-navigation-center {
          min-width: 200px;
          flex-shrink: 1;
          img {
            width: 200px;
            height: 78px;
          }
        }
        .top-navigation-picture {
          div {
            margin-top: 3px;
            white-space: nowrap;
            height: 20px;
            line-height: 20px;
          }
        }
      }
      .top-navigation-item {
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
