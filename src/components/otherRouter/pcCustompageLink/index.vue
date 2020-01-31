<template>
  <div class="linkUrl">
  
    <Select
      size="small"
      :class="{'error':!itemData.linkUrl&&errorShow&&show}"
      v-if="(itemData.linkUrl!='customlink'||!itemData.customLinkurl)&&(itemData.linkUrl!='custompage'||!itemData.customPageId)&&(itemData.linkUrl!='customtel'||!itemData.customTel)"
      placeholder="设置链接页面"
      @on-change="change"
      v-model="itemData.linkUrl"
    >
      <Option v-for="item in linkList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <template v-else>
      <template v-if="itemData.linkUrl=='customlink'">
        <div @click="showModal" class="customlink">
          <div class="custom-link-text">自定义地址:{{itemData.customLinkurl}}</div>
          <Icon @click.stop="customlinkDel" type="ios-close customlink-del"></Icon>
        </div>
      </template>
      <template v-if="itemData.linkUrl=='custompage'">
        <div @click="showModal2" class="customlink">
          <div class="custom-link-text">自定义页面:{{itemData.customPageName}}</div>
          <Icon @click.stop="customPageDel" type="ios-close customlink-del"></Icon>
        </div>
      </template>
      <template v-if="itemData.linkUrl=='customtel'">
        <div @click="showModal3" class="customlink">
          <div class="custom-link-text">自定义电话:{{itemData.customTel}}</div>
          <Icon @click.stop="telDel" type="ios-close customlink-del"></Icon>
        </div>
      </template>
    </template>
    <Modal v-model="modal1" title="自定义链接" :mask-closable="false" :closable="false">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="110">
        <FormItem label="链接地址：" prop="custompageLinkUrl">
          <Input @on-enter="ok" v-model="formValidate.custompageLinkUrl" placeholder="请输入地址"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="ok" type="primary">确定</Button>
        <Button @click="cancel">取消</Button>
      </div>
    </Modal>
    <Modal v-model="modal3" title="自定义电话" :mask-closable="false" :closable="false">
      <Form
        ref="formValidateTel"
        :model="formValidateTel"
        :rules="ruleValidateTel"
        :label-width="110"
      >
        <FormItem label="电话号码：" prop="tel">
          <Input @on-enter="telOk" v-model="formValidateTel.tel" placeholder="请输入电话号码"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="telOk" type="primary">确定</Button>
        <Button @click="telCancel">取消</Button>
      </div>
    </Modal>
    <Modal v-model="modal2" title="自定义页选择" width="1000" @on-cancel="cancel">
      <Form ref="formInline" inline>
        <FormItem>
          <Input v-model="pageName" placeholder="页面名称"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="getList">搜索</Button>
        </FormItem>
      </Form>
      <Table border size="small" :columns="columns7" :data="data6"></Table>
      <Page @on-change="pageChange" style="margin-top:10px" :total="total" show-elevator></Page>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import { apiPost, apiGet } from "@/fetch/api";
import { mapState } from "vuex";
export default {
  props: {
    itemData: {
      type: Object
    },
    show: {
      //默认是不验证的，在vux配置errorShow，并且父组件中prop中设置了show为true时候才显示错误提示
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      errorShow: state => {
        return state.defined.errorShow;
      }
    })
  },
  data() {
    return {
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
          value: "theater",
          label: "剧院列表"
        },
        {
          value: "custompage",
          label: "自定义页"
        },
        {
          value: "customlink",
          label: "自定义链接"
        },
        {
          value: "customtel",
          label: "自定义电话"
        }
      ],
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
                      this.itemData.customPageId = params.row.id;
                      this.itemData.customPageName =
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
      modal3: false,
      formValidate: {
        custompageLinkUrl: ""
      },
      formValidateTel: {
        tel: ""
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
      ruleValidateTel: {
        tel: [
          {
            required: true,
            message: "请输入电话号码",
            trigger: "blur"
          },
          {
            pattern: /(^1([0-9]{10})$)|(^0[0-9]{2,3}-[0-9]{7,8}$)|(^400[0-9]{7}$)/,
            message: "格式不正确"
          }
        ]
      },
      modal1: false,
      selectIndex: null,
      page: 1,
      limit: 10,
      pageName: "",
      total: 0
    };
  },
  methods: {
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
      this.itemData.customPageId = "";
      this.itemData.linkUrl = "";
      this.itemData.customPageName = "";
    },
    telDel() {
      this.itemData.customTel = "";
      this.itemData.linkUrl = "";
    },
    customlinkDel(index) {
      this.itemData.customLinkurl = "";
      // this.itemData.customLinkurlType = "http";
      this.itemData.linkUrl = "";
    },
    showModal(index) {
      this.modal1 = true;
      this.formValidate.custompageLinkUrl = this.itemData.customLinkurl;
    },
    showModal2(index) {
      this.modal2 = true;
      this.getList();
    },
    showModal3(index) {
      this.modal3 = true;
      this.formValidateTel.tel = this.itemData.customTel;
    },
    ok() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.itemData.customLinkurl = this.formValidate.custompageLinkUrl;
          this.modal1 = false;
        }
      });
    },
    telOk() {
      // console.log(11);
      this.$refs.formValidateTel.validate(valid => {
        if (valid) {
          this.itemData.customTel = this.formValidateTel.tel;
          this.modal3 = false;
        }
      });
    },
    cancel() {
      if (this.formValidate.custompageLinkUrl) {
        // this.itemData.customLinkurl = this.formValidate.custompageLinkUrl;
        this.modal1 = false;
      } else {
        this.itemData.customLinkurl = "";
        this.itemData.linkUrl = "";
        this.modal1 = false;
      }
    },
    telCancel() {
      if (this.formValidateTel.tel) {
        this.modal3 = false;
      } else {
        this.itemData.customTel = "";
        this.itemData.linkUrl = "";
        this.modal3 = false;
      }
    },
    change(val) {
      // console.log(val);
      if (val == "custompage") {
        //自定义页面
        this.modal2 = true;
        this.getList();
      } else if (val == "customlink") {
        //自定义链接
        this.modal1 = true;
        this.formValidate.custompageLinkUrl = "";
      } else if (val == "customtel") {
        //自定义电话
        this.modal3 = true;
        this.formValidateTel.tel = "";
      }
    }
  }
};
</script>
<style lang="scss">
.linkUrl {
  .customlink {
    padding-left: 5px;
    background: #cbcbcb;
    width: 160px;
    height: 24px;
    line-height: 24px;
    position: relative;

    .custom-link-text {
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
}
</style>
