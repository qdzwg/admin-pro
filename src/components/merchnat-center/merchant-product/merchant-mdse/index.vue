<template>
  <div>
    <page-template
      :search-items="searchItems"
      :columns="columns"
      pageFlag
      :url="url"
      ref="pageWrap"
    >
    </page-template>
    <qrcode-modal v-model="previewFlag" :url="QRcodeUrl"></qrcode-modal>
    <!-- 获取景区产品 -->
    <Modal
      width="800"
      v-model="productModal"
      title="获取景区产品"
      :loading="loading"
      @on-ok="ok"
      @on-cancel="cancel"
      :type="type"
    >
      <Input
        v-model="parkName"
        placeholder="景区名称"
        style="width: 200px"
      ></Input>
      <Button @click="getDataList" type="primary">搜索</Button>
      <Button @click="asynMore" type="primary">批量选择</Button>
      <Table
        @on-selection-change="selectMore"
        size="small"
        class="productTable"
        border
        :columns="columns7"
        :data="data6"
      ></Table>
      <Page
        @on-change="changeModalListPage"
        :total="total"
        show-elevator
      ></Page>
      <div slot="footer"></div>
    </Modal>
    <!-- 预览 -->

    <!-- 完善信息 -->
    <Modal
      width="800"
      v-model="completeInfo"
      title="完善信息"
      :loading="loading"
      @on-ok="completeFormOK"
      @on-cancel="cancel"
      :type="type"
    >
      <Form
        class="completeForm"
        height="450"
        :model="formCompleteItem"
        label-position="right"
        :label-width="100"
        ref="formItem"
        :rules="ruleComplteForm"
      >
        <FormItem label="景区名称">
          西湖
        </FormItem>
        <FormItem label="景区别名：" prop="nickName">
          <Input
            v-model="formCompleteItem.nickName"
            placeholder="填写景区别名"
          ></Input>
        </FormItem>
        <FormItem label="景区副标题：" prop="subtitle">
          <Input
            v-model="formCompleteItem.subtitle"
            placeholder="填写景区副标题"
          ></Input>
        </FormItem>
        <FormItem label="展示起价：" prop="priceShow">
          <Input
            v-model="formCompleteItem.priceShow"
            placeholder="填写展示起价"
          ></Input>
        </FormItem>
        <FormItem label="虚拟销量：" prop="virtualSale">
          <Input
            v-model="formCompleteItem.virtualSale"
            placeholder="填写虚拟销量"
          ></Input>
        </FormItem>
        <FormItem label="WAP端主图：">
          <up-img
            :limitNum="1"
            v-model="formCompleteItem.linkMobileImg"
          ></up-img>
        </FormItem>
        <FormItem label="WAP端轮播图：">
          <up-img :limitNum="5" v-model="formCompleteItem.wapUrl"></up-img>
        </FormItem>
        <FormItem v-if="completeInfo" label="景点介绍">
          <ueditor
            id="introduce"
            v-model="formCompleteItem.content"
            :config="config"
          ></ueditor>
        </FormItem>
        <FormItem v-if="completeInfo" label="预订须知">
          <ueditor
            id="must"
            v-model="formCompleteItem.orderNotice"
            :config="config"
          ></ueditor>
        </FormItem>
      </Form>
    </Modal>
    <!-- 全员推广 -->
    <extent-modal v-model="extendFlag"></extent-modal>
  </div>
</template>
<script>
import extentModal from "../productCommon/extentModal";
export default {
  data() {
    return {
      previewFlag: false,
      QRcodeUrl: "",
      extendFlag: false,
      url: "merchant/merchantMdseInfo/grid",
      selectArrIds: "",
      parkName: "",
      total: 0,
      modalPage: 1,
      data6: [],
      productModal: false,
      // formCompleteItem: {
      //   linkMobileImg: '',
      //   wapUrl: ''
      // },
      limitNum: 2,
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 120
      },
      // completeInfo: false,
      mode: "",
      content: "",
      sucessMsg: "",
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
          title: "商品名称",
          key: "name"
        },
        {
          title: "商品编码",
          key: "productCode"
        },
        {
          title: "来源",
          key: "prodFrom",
          render: (h, params) => {
            return h("span", params.row.prodFrom === "prod" ? "自营" : "分销");
          }
        },
        {
          title: "总库存",
          key: "stockNum",
          render: (h, params) => {
            let { stockNum } = params.row;
            return h("span", stockNum ? stockNum : "暂无库存");
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
            let { id, enabled } = params.row;
            let actions = [
              {
                title: "完善信息",
                action: () => {
                  // "/mdse/" + id
                  this.$router.push({ path: `/mdse/${id}` });
                }
              },
              {
                title: "预览",
                action: () => {
                  this.QRcodeUrl = `merchant/merchantMdseInfo/previewInfo?id=${id}`;
                  this.previewFlag = true;
                }
              },
              {
                title: enabled === "T" ? "下架" : "上架",
                action: () => {
                  this.$refs.pageWrap.confirm({
                    url: "merchant/merchantMdseInfo/enabled",
                    param: { id, enabled: enabled === "T" ? "F" : "T" },
                    title: "信息",
                    content: enabled === "T" ? "确认下架吗?" : "确认上架吗？",
                    sucessMsg: enabled === "T" ? "下架成功！" : "上架成功！"
                  });
                }
              }
            ];
            if (params.row.prodFrom === "prod") {
              actions.push({
                title: "全员推广",
                action: () => {
                  this.extendFlag = true;
                }
              });
            }
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      data: "",
      searchItems: [
        {
          label: "商品名称",
          type: "input",
          name: "name"
        },
        {
          label: "状态",
          type: "select",
          name: "enabled",
          data: [
            {
              value: "",
              label: "请选择"
            },
            {
              value: "T",
              label: "已上架"
            },
            {
              value: "F",
              label: "已下架"
            }
          ]
        },
        {
          label: "来源",
          type: "select",
          name: "prodFrom",
          data: [
            {
              value: "",
              label: "请选择"
            },
            {
              value: "prod",
              label: "自营"
            },
            {
              value: "dist_market",
              label: "分销"
            }
          ]
        }
      ],
      modal: false,
      formItem: {
        latitudeLongitude: "",
        switch: true,
        remark: ""
      },
      type: "add",
      // loading: true,
      ruleForm: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ]
      },
      QRcodeUrl: ""
      // ruleComplteForm: {
      //   nickName: [
      //     { required: true, message: '请输入景区别名', trigger: 'blur' }
      //   ],
      //   subtitle: [
      //     { required: true, message: '请输入景区副标题', trigger: 'blur' }
      //   ],
      //   priceShow: [
      //     { required: true, message: '请输入展示起价', trigger: 'blur' }
      //     // { type: 'number', message: "请输入数字", trigger: "blur"}
      //   ],
      //   virtualSale: [
      //     { required: true, message: '请输入虚拟销量', trigger: 'blur' }
      //   ]
      // }
    };
  },
  mounted() {
    // this.loadpage(this.params)
  },
  components: {
    extentModal
  },
  methods: {
    asynMore() {
      this.syncHandler(this.selectArrIds.join(","));
    },
    selectMore(selection) {
      let selectArr = [];
      selection.forEach((item, index) => {
        selectArr.push(item.id);
      });
      this.selectArrIds = selectArr;
    },
    syncHandler(ids) {
      this.apiGet("list/merchant/merchantParkInfo/addProds?ids=" + ids).then(
        res => {
          if (res.success) {
            this.$store.dispatch("postApi");
            this.$Message.success(res.message);
          } else {
            this.$Message.warning(res.message);
          }
        }
      );
    },
    changeModalListPage(page) {
      this.modalPage = page;
      this.getDataList();
    },
    getProduct() {
      this.productModal = true;
      this.getDataList();
    },
    getDataList() {
      let params = {
        page: this.modalPage,
        limit: 10,
        sort: "createTime",
        order: "desc",
        name: this.parkName
      };
      this.apiPost("list/merchant/merchantParkInfo/parkGrid", params).then(
        data => {
          this.data6 = data.rows;
          this.total = data.total;
        }
      );
    },
    completeFormOK() {
      let _this = this;
      let url = "list/merchant/merchantParkInfo/updateMerchantParkInfo";
      this.common.formPost(this, {
        url,
        params: this.formCompleteItem,
        mold: "modal",
        callback(res) {
          if (res.success) {
            _this.completeInfo = false;
          }
        }
      });
    },
    ok() {},
    cancel() {
      // this.$Message.info('Clicked cancel')
    },
    showModal() {
      this.modal = true;
      this.type = "add";
      this.formItem.roleName = "";
      this.formItem.switch = true;
      this.formItem.remark = "";
      this.modalTitle = "新增角色";
    },
    delAll() {
      this.mode = "delete";
      this.content = "确认删除吗？";
      this.sucessMsg = "删除成功";
      let selection = this.$refs.gridTable.selection;
      if (selection.length) {
        let ids = "";
        selection.forEach(element => {
          ids += element.id + ",";
        });
        this.$refs.confirmModel.confirm("/product/parkInfoChange/" + ids);
      } else {
        this.$Message.warning("请选择一条数据！");
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
