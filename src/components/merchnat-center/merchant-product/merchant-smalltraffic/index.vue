<template>
  <div>
    <page-template :search-items='searchItems'
                   :columns="columns"
                   pageFlag
                   :url="url"
                   ref="pageWrap">
    </page-template>
    <!-- 预览 -->
    <qrcode-modal :url='QRcodeUrl'
                  v-model="qrcodeShow"></qrcode-modal>
    <!-- 完善信息 -->
    <the-Modal width="800"
               v-model="completeInfo"
               title="完善信息"
               @ok="completeFormOK"
               @cancel="cancel">
      <Form class="completeForm"
            height="450"
            :model="formCompleteItem"
            label-position="right"
            :label-width="100"
            ref="formItem"
            :rules="ruleComplteForm">
        <FormItem label="线路名称">{{formCompleteItem.routeName}}</FormItem>
        <FormItem label="线路别名："
                  prop="nickName">
          <Input v-model="formCompleteItem.nickName"
                 placeholder="填写线路别名"></Input>
        </FormItem>
        <FormItem label="行程说明">
          <ueditor id="tripIntr"
                   v-model="formCompleteItem.tripIntr"
                   :config="config"></ueditor>
        </FormItem>
        <FormItem label="预订须知">
          <ueditor id="orderIntr"
                   v-model="formCompleteItem.orderIntr"
                   :config="config"></ueditor>
        </FormItem>
        <FormItem label="费用说明">
          <ueditor id="feeIntr"
                   v-model="formCompleteItem.feeIntr"
                   :config="config"></ueditor>
        </FormItem>
        <FormItem label="wap轮播图：">
          <up-img v-model="formCompleteItem.linkBreviaryImg"></up-img>
        </FormItem>
      </Form>
    </the-Modal>
  </div>
</template>
<script>
export default {
  data () {
    return {
      url: "merchant/webApi/trafficManage/routeMerGrid",
      searchItems: [
        {
          label: "线路编号",
          type: "input",
          name: "routeCode"
        },
        {
          label: "线路名称",
          type: "input",
          name: "routeName"
        },
      ],
      columns: [
        {
          title: "序号",
          width: 60,
          align: "center",
          render: (h, params) => {
            return h("span", params.index + 1);
          }
        },
        {
          title: '线路编号',
          key: 'routeCode'
        },
        {
          title: '线路名称',
          key: 'routeName'
        },
        {
          title: "来源",
          key: "prodFrom",
          render: (h, params) => {
            return h("span", params.row.prodFrom === "prod" ? "自营" : "分销");
          }
        },
        {
          title: "上下架",
          key: "enabled",
          render: (h, params) => {
            return h("span", params.row.enabled === "T" ? "已上架" : "已下架");
          }
        },
        {
          title: "操作",
          width: 400,
          key: "action",
          align: "center",
          render: (h, params) => {
            let { id, enabled, trafficRouteId } = params.row
            let actions = [
              {
                title: enabled === "T" ? "下架" : "上架",
                action: () => {
                  this.$refs.pageWrap.confirm({
                    url: 'merchant/webApi/trafficManage/batchMerTrafficEnable',
                    param: { id, enabled: enabled === 'T' ? 'F' : 'T', mainUserId: localStorage.getItem('xjsc_2018_userId') },
                    title: '信息',
                    content: enabled === "T" ? "确认下架吗?" : "确认上架吗？",
                    sucessMsg: enabled === "T" ? "下架成功！" : "上架成功！"
                  })
                }
              },
              {
                title: "完善信息",
                action: () => {
                  this.getCompleteInfo(id);
                }
              },
              {
                title: "预览",
                action: () => {
                  this.qrcodeShow = true
                  this.QRcodeUrl = `merchant/webApi/trafficManage/previewTraffic?trafficId=${trafficRouteId}`
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      formCompleteItem: {
        linkMobileImg: "",
        routeName: '',
        nickName: '',
        merchantInfoId: '',
        prodFrom: '',
        routeCode: '',
        enabled: '',
        orderIntr: '',
        feeIntr: '',
        wapUrl: ""
      },
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 120
      },
      completeInfo: false,
      ruleComplteForm: {
        nickName: [
          { required: true, message: "请输入景区别名", trigger: "blur" }
        ],
        subtitle: [
          { required: true, message: "请输入景区副标题", trigger: "blur" }
        ],
        priceShow: [
          { required: true, message: "请输入展示起价", trigger: "blur" }
          // { type: 'number', message: "请输入数字", trigger: "blur"}
        ],
        virtualSale: [
          { required: true, message: "请输入虚拟销量", trigger: "blur" }
        ]
      },
      QRcodeUrl: '',
      qrcodeShow: false,
    };
  },
  mounted () {

  },
  components: {
  },
  methods: {
    getCompleteInfo (id) {
      this.apiGet("/merchant/webApi/trafficManage/merTrafficInfo?merchantTrafficId=" + id).then(res => {
        this.completeInfo = true;
        if (res.status == 200) {
          this.formCompleteItem.id = res.data.id;
          this.formCompleteItem.routeName = res.data.routeName;
          this.formCompleteItem.nickName = res.data.nickName;
          this.formCompleteItem.orderIntr = res.data.orderIntr;
          this.formCompleteItem.tripIntr = res.data.tripIntr;
          this.formCompleteItem.feeIntr = res.data.feeIntr;
          this.formCompleteItem.enabled = res.data.enabled;
          this.formCompleteItem.routeCode = res.data.routeCode;
          this.formCompleteItem.prodFrom = res.data.prodFrom;
          this.formCompleteItem.merchantInfoId = res.data.merchantInfoId;
          this.formCompleteItem.trafficRouteId = res.data.trafficRouteId;
        } else {
          this.$Message.success(res.message);
        }
      });
    },
    completeFormOK () {
      let _this = this;
      this.$refs.formItem.validate((valid) => {
        if (valid) {
          let url = "/merchant/webApi/trafficManage/merchantTrafficUpdate";
          this.common.formPost(this, {
            url,
            params: this.formCompleteItem,
            mold: "modal",
            callback (res) {
              if (res.status == 200) {
                _this.completeInfo = false;
                _this.$Message.success(res.message);
              }
            }
          });
        }
      })

    },
    cancel () {
      this.completeInfo = false
      this.formCompleteItem = {
        linkMobileImg: "",
        routeName: '',
        nickName: '',
        merchantInfoId: '',
        prodFrom: '',
        routeCode: '',
        enabled: '',
        orderIntr: '',
        feeIntr: '',
        wapUrl: ""
      }
    }
  }
};
</script>

<style scope lang="scss">
.completeForm {
  height: 450px;
  overflow: auto;
}
.productTable {
  margin-top: 5px;
}
.ivu-modal-body {
  padding-top: 0px;
}
</style>
