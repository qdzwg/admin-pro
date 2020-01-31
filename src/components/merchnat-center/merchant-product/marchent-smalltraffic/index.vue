<template>
  <div>
    <searchForm :search-items='searchItems'></searchForm>
    <gridTable ref="gridTable" :params="params" :columns="columns" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>
    <!-- 预览 -->
    <qrcode-modal ref="qrcodemodal"></qrcode-modal>
    <!-- 完善信息 -->
    <Modal width="800" v-model="completeInfo" title="完善信息" :loading="loading" @on-ok="completeFormOK"  @on-cancel="cancel" :type="type">
        <Form  class="completeForm" height="450" :model="formCompleteItem" label-position="right" :label-width="100" ref="formItem" :rules="ruleComplteForm">
          <FormItem label="线路名称">{{formCompleteItem.routeName}}</FormItem>
          <FormItem label="线路别名：" prop="nickName">
            <Input v-model="formCompleteItem.nickName" placeholder="填写线路别名"></Input>
          </FormItem>
          <FormItem label="行程说明">
            <ueditor id="routeIntr" ref="routeIntr" :config="config"></ueditor>
          </FormItem>
          <FormItem label="预订须知">
            <ueditor id="orderNotice" ref="orderNotice" :config="config"></ueditor>
          </FormItem>
          <FormItem label="费用说明">
            <ueditor id="freeIntr" ref="freeIntr" :config="config"></ueditor>
          </FormItem>
          <FormItem label="wap轮播图：">
            <single-img :limitNum="1" :uploadList="singleImgList" @getImgUrl="setWapUrl"></single-img>
          </FormItem>
        </Form>
    </Modal>
    <!-- 全员推广 -->
    <extent-modal ref="extendmodal">
    </extent-modal>
  </div>
</template>
<script>
import { apiGet, apiPost } from "@/fetch/api";
import searchForm from "@/components/global/searchForm";
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
import singleImg from "@/components/global/upImg";
import ueditor from "@/components/global/ueditor";
import qrcodeModal from "../productCommon/qrcodeModal";
import extentModal from "../productCommon/extentModal";
export default {
  data() {
    return {
      selectArrIds: "",
      parkName: "",
      total: 0,
      modalPage: 1,
      data6: [],
      productModal: false,
      formCompleteItem: {
        linkMobileImg: "",
        nickName: "",
        wapUrl: ""
      },
      limitNum: 2,
      singleImgList: [],
      wapImgList: [],
      pcSingleImgList: [],
      pcWapImgList: [],
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 120
      },
      completeInfo: false,
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
            let actions = [
              {
                title: params.row.enabled === "T" ? "下架" : "上架",
                action: () => {
                  this.mode = "done";
                  this.content =
                    params.row.enabled === "T" ? "确认下架吗?" : "确认上架吗？";
                  this.sucessMsg =
                    params.row.enabled === "T" ? "下架成功！" : "上架成功！";
                  this.$refs.confirmModel.confirm(
                    "list/merchant/merchantHotelInfo/enabled?id=" +
                      params.row.id +
                      "&" +
                      params.row.id
                  );
                }
              },
              {
                title: "完善信息",
                action: () => {
                  this.completeInfo = true;
                  this.singleImgList = [];
                  this.wapImgList = [];
                  this.pcSingleImgList = [];
                  this.pcWapImgList = [];
                  this.formCompleteItem.id = params.row.id;
                  this.formCompleteItem.nickName = params.row.params;
                  this.formCompleteItem.hotelInfoId = params.row.hotelInfoId;
                  this.formCompleteItem.productCode = params.row.productCode;
                  this.$refs.freeIntr.init();
                  this.$refs.routeIntr.init();
                  this.$refs.orderNotice.init();
                }
              },
              {
                title: "预览",
                action: () => {
                  // apiGet()
                  this.$refs.qrcodemodal.preLookModal = true;
                }
              }
            ];
            // if (params.row.src === "prod") {
            //   actions.push({
            //     title: "全员推广",
            //     action: () => {
            //       this.$refs.extendmodal.extentmodal = true;
            //     }
            //   });
            // }

            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      data: "",
      params: { page: 1, limit: 10, sort: "createTime", order: "desc" },
      url: "/product/wapapi/trafficProduct/pageRouteInfo",
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
      modal: false,
      formItem: {
        latitudeLongitude: "",
        switch: true,
        remark: ""
      },
      type: "add",
      loading: true,
      ruleForm: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ]
      },
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
      }
    };
  },
  mounted() {
    // this.loadpage(this.params)
  },
  components: {
    searchForm,
    gridTable,
    confirm,
    singleImg,
    ueditor,
    qrcodeModal,
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
      apiGet("list/merchant/merchantParkInfo/addProds?ids=" + ids).then(res => {
        if (res.success) {
          this.$store.dispatch("postApi");
          this.$Message.success(res.message);
        } else {
          this.$Message.success(res.message);
        }
      });
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
      apiPost("list/merchant/merchantParkInfo/parkGrid", params).then(data => {
        this.data6 = data.rows;
        this.total = data.total;
      });
    },
    setWapUrl(url) {
      this.formCompleteItem.wapUrl = url.join(",");
    },
    setWapListUrl(url) {
      this.formCompleteItem.wapUrl = url.join(",");
    },
    pcSetWapUrl(url) {
      this.formCompleteItem.linkImg = url.join(",");
    },
    pcSetWapListUrl(url) {
      this.formCompleteItem.pcUrl = url.join(",");
    },
    copy() {
      var clipboard = new Clipboard(".tag-read");
      clipboard.on("success", e => {
        this.$Message.success("地址复制成功");
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        // 不支持复制
        // console.log('该浏览器不支持自动复制')
        this.$Message.warning("该浏览器不支持自动复制");
        // 释放内存
        clipboard.destroy();
      });
    },
    completeFormOK() {
      let _this = this;
      this.formCompleteItem.freeIntr = this.$refs.freeIntr.getUEContent();
      this.formCompleteItem.routeIntr = this.$refs.routeIntr.getUEContent();
      this.formCompleteItem.orderNotice = this.$refs.orderNotice.getUEContent();
      let url = "/product/wapapi/trafficProduct/trafficUpdate";
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
        this.$refs.confirmModel.confirm("list/product/parkInfoChange/" + ids);
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

