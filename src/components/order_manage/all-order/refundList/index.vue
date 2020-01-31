<template>
  <div class="refundList">
    <list
      ref="gridTable"
      :columns="columns"
      :url="url"
      :searchItems="searchItems"
    ></list>
    <confirm
      ref="confirmModel"
      mode="done"
      :content="confirmContent"
      :sucessMsg="sucessMsg"
    ></confirm>

    <!-- 弹出层 明细 -->
    <Modal v-model="modal" title="明细" width="800">
      <refundInfo :result="refundResult" :orderType="orderType"></refundInfo>
      <div slot="footer"></div>
    </Modal>
    <!-- 审核 -->
    <Modal
      v-model="modal2"
      title="审核"
      @on-ok="toaudit"
      :loading="toauditLoading"
      width="950"
      @on-cancel="cancel"
    >
      <toaudit :result="toauditResult" ref="toauditPage"></toaudit>
    </Modal>
  </div>
</template>

<script>
import list from "@/components/global/list";
import confirm from "@/components/global/confirm";
import refundInfo from "../components/refundInfo";
import toaudit from "../components/toaudit";
import { apiGet, apiPost } from "@/fetch/api";
export default {
  data() {
    let data = new Date();
    let refundStartTime =
      data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate();
    data = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    let refundEndTime =
      data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate();
    return {
      searchItems: [
        {
          label: "订单号",
          type: "input",
          name: "orderNo"
        },
        {
          label: "产品名称",
          type: "input",
          name: "orderInfo"
        },
        {
          label: "申请人",
          type: "input",
          name: "refundLoginName"
        },
        {
          label: "退单开始时间",
          type: "date",
          name: "refundStartTime",
          value: refundStartTime
        },
        {
          label: "退单结束时间",
          type: "date",
          name: "refundEndTime",
          value: refundEndTime
        },
        {
          label: "游玩开始时间",
          type: "date",
          name: "orderStartTime"
        },
        {
          label: "游玩结束时间",
          type: "date",
          name: "orderEndTime"
        }
        // {
        //   label: '退单类型',
        //   type: 'select',
        //   name: 'applyFrom',
        //   data: [
        //     {
        //       value: '',
        //       label: '全部退票规则'
        //     },
        //     {
        //       value: 'byUser',
        //       label: '游客发起'
        //     },
        //     {
        //       value: 'byPark',
        //       label: '景区发起'
        //     },
        //     {
        //       value: 'byError',
        //       label: '异常订单'
        //     }
        //   ]
        // }
      ],
      columns: [
        {
          title: "序号",
          align: "center",
          width: 70,
          render: (h, params) => {
            return h("span", params.index + 1);
          }
        },
        {
          title: "订单号",
          sortable: true,
          align: "center",
          key: "orderNo"
        },
        {
          title: "退单号",
          sortable: true,
          align: "center",
          key: "refundNo"
        },
        {
          title: "订单金额(元)",
          key: "orderSum",
          sortable: true
        },
        {
          title: "退单金额(元)",
          key: "refundSum",
          sortable: true
        },

        {
          title: "手续费(元)",
          sortable: true,
          key: "fee"
        },
        {
          title: "申请人",
          key: "refundLoginName"
        },
        {
          title: "游玩/下单时间",
          sortable: true,
          key: "travelDate"
        },
        {
          title: "操作",
          key: "action",
          width: 130,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            // 分销商审核完毕供货商审核
            const supplierReview = {
              title: "审核",
              action: async () => {
                let res = await apiGet("/order/orderRefund/toAuditSupplyFL", {
                  orderNo: params.row.orderNo,
                  refundNo: params.row.refundNo
                });
                if (res.success) {
                  this.modal2 = true;
                  this.toauditType = "supply";
                  this.toauditResult = res.data;
                } else {
                  this.$Message.error(res.message);
                }
              }
            };
            // 分销商审核
            const distributorReview = {
              title: "审核",
              action: async () => {
                let res = await apiGet("/order/orderRefund/toAuditFL", {
                  orderNo: params.row.orderNo,
                  refundNo: params.row.refundNo
                });
                if (res.success) {
                  this.modal2 = true;
                  this.toauditType = "";
                  this.toauditResult = res.data;
                } else {
                  this.$Message.error(res.message);
                }
              }
            };
            const recipient = {
              title: "确认收货",
              action: async () => {
                this.confirmContent = "确认收货？";
                this.sucessMsg = "收货成功！";
                this.$refs.confirmModel.confirm(
                  "/order/orderRefund/doConfirmTheGoods",
                  { orderRefundNo: params.row.refundNo }
                );
              }
            };
            const refund = {
              title: "退款",
              action: async () => {
                this.confirmContent = "确认退款？";
                this.sucessMsg = "退款成功！";
                this.$refs.confirmModel.confirm(
                  "/order/orderRefund/refundByHandle",
                  { refundNo: params.row.refundNo }
                );
              }
            };
            const logistics = {
              title: "物流",
              action: () => {
                window.open(
                  "https://www.kuaidi100.com/chaxun?com=" +
                    params.row.expressType +
                    "&nu=" +
                    params.row.expressNo
                );
              }
            };
            // 商家同城配送
            // const logisticsNew = {
            //   title: '物流',
            //   action: async () => {
            //     this.logisticsModal = true
            //     let res = await apiGet('/order/webapi/orderInfo/viewExpressMsgFL', { orderNo: params.row.orderNo })
            //     this.logisticsResult = res.data
            //   }
            // }
            const actions = [
              {
                title: "明细",
                action: async () => {
                  let res = await apiGet("/order/orderRefund/viewRefundFL", {
                    orderNo: params.row.orderNo,
                    refundNo: params.row.refundNo
                  });
                  if (res.success) {
                    this.modal = true;
                    this.spinShow = false;
                    this.refundResult = res.data;
                    this.orderType = res.data.orderInfo.orderType;
                  } else {
                    this.$Message.error(res.message);
                  }
                  if (params.row.orderType === "traffic") {
                    let res = await apiGet(
                      "/order/api/trafficOrderDetailForB",
                      {
                        orderNo: params.row.orderNo
                      }
                    );
                    if (res.status == 200) {
                      this.$set(this.result, "siteInfo", res.data);
                    } else {
                      this.$Message.error(res.message);
                    }
                  }
                }
              }
            ];
            if (params.row["orderType"] === "mdse") {
              if (
                params.row["auditStatus"] === "3" &&
                params.row["saleType"] === "2"
              ) {
                // 分销商审核完毕供货商审核
                actions.push(supplierReview);
              }
              if (
                params.row["status"] === "7" &&
                params.row["saleType"] !== "1" &&
                params.row["expressNo"]
              ) {
                actions.push(recipient);
              }
              if (
                params.row["auditStatus"] === "0" &&
                params.row["saleType"] !== "2"
              ) {
                actions.push(distributorReview);
              }
            } else {
              if (
                params.row["saleType"] !== "1" &&
                params.row["auditStatus"] === "0"
              ) {
                actions.push(distributorReview);
              }
            }
            if (params.row["refundStatus"] === "6") {
              actions.push(refund);
            }
            if (params.row["expressNo"]) {
              actions.push(logistics);
            }
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      url: "/order/orderRefund/grid",
      modal: false,
      modal2: false,
      modalTitle: "",
      refundResult: {},
      confirmContent: "",
      sucessMsg: "",
      toauditResult: {},
      toauditLoading: true,
      toauditType: "",
      orderType: ""
    };
  },
  components: {
    list,
    confirm,
    refundInfo,
    toaudit
  },
  mounted() {
    // var _this = this
  },
  methods: {
    cancel() {
      // this.$Message.info('Clicked cancel')
      this.$refs.toauditPage.rest();
    },
    async toaudit() {
      let validate = this.$refs["toauditPage"].handleSubmit();
      if (validate) {
        let url = "/order/orderRefund/audit";
        if (this.toauditType === "supply") {
          url = "/order/orderRefund/auditSupply";
        }
        let res = await apiPost(url, validate);
        if (res.success) {
          this.modal2 = false;
          this.$Message.info(res.message);
          this.$refs.gridTable.loadpage();
        } else {
          this.$Message.error(res.message);
          this.toauditLoading = false;
          this.$nextTick(() => {
            this.toauditLoading = true;
          });
        }
      } else {
        this.toauditLoading = false;
        this.$nextTick(() => {
          this.toauditLoading = true;
        });
      }
    }
  }
};
</script>

<style scope lang="scss">
.fontweight {
  color: #333;
  font-weight: 300;
}
.table {
  border-collapse: collapse; // 合并边框
  border-spacing: 0 20px;
}
.title {
  background-color: #f5fafe;
}
td {
  height: 30px;
  box-sizing: border-box;
}
th {
  height: 30px;
}
</style>
