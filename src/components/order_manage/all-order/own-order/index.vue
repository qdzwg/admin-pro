<template>
  <div class="own-order">
    <form-list
      ref="formList"
      :search-items="searchItems"
      :search-advanced="searchAdvanced"
      :hannle-items="hannleItems"
    ></form-list>
    <gridTable
      ref="gridTable"
      v-if="complete"
      :columns="columns"
      :params="params"
      :url="url"
    >
      <div slot="footer" class="total">
        <span>支付金额汇总：</span>{{ total }}
      </div>
    </gridTable>
    <confirm
      ref="confirmModel"
      mode="done"
      :content="confirmContent"
      :sucessMsg="sucessMsg"
    ></confirm>
    <!-- 订单明细 -->
    <Modal
      v-model="modal"
      :title="modalTitle"
      @on-ok="ok"
      width="950"
      @on-cancel="cancel"
    >
      <orderInfo
        :result="result"
        :orderType="orderType"
        searchType="orderInfo"
      ></orderInfo>
      <Spin fix v-if="spinShow">
        <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
      </Spin>
      <div slot="footer"></div>
    </Modal>
    <!-- 订单轨迹 -->
    <Modal v-model="modal2" :title="modalTitle" @on-ok="ok" width="800">
      <viewLog :result="viewLogRes"></viewLog>
      <Spin fix v-if="spinShow">
        <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
      </Spin>
      <div slot="footer"></div>
    </Modal>
    <!-- 订单核销 -->
    <Modal
      v-model="checkOrderModal"
      title="订单核销"
      width="800"
      :loading="checkOrderLoading"
    >
      <checkOrderPage
        ref="checkOrderPage"
        :result="checkOrderResult"
      ></checkOrderPage>
      <div slot="footer">
        <Button @click="closeCheckOrderModal">取消</Button>
        <Button v-if="isCanCheck" type="primary" @click="checkOrder"
          >核销</Button
        >
      </div>
    </Modal>
    <!-- 导游订单核销 -->
    <Modal
      v-model="checkOrderModalGuide"
      title="订单核销"
      width="500"
      :loading="checkOrderLoadingGuide"
    >
      <Form :model="guideParams" style="min-height: 150px" ref="guideformItem">
        <FormItem
          label="订单核销归属："
          prop="belong"
          :rules="[
            { required: true, message: '请选择订单核销归属', trigger: 'change' }
          ]"
        >
          <Select
            v-model="guideParams.belong"
            style="width:200px"
            placeholder="请选择订单核销归属"
          >
            <Option
              v-for="sitem in belongList"
              :value="JSON.stringify(sitem)"
              :key="sitem.value"
              >{{ sitem.accName + " " + sitem.realName }}</Option
            >
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="closeCheckOrderModalGuide">取消</Button>
        <Button type="primary" @click="checkOrderGuide">核销</Button>
      </div>
    </Modal>
    <!-- 发货 -->
    <Modal
      v-model="deliverModal"
      title="发货"
      @on-ok="delive"
      ok-text="发货"
      width="800"
      :loading="deliverLoading"
    >
      <deliver ref="delive" :result="deliverResult"></deliver>
    </Modal>
    <!-- 物流 -->
    <Modal v-model="logisticsModal" title="物流信息" ok-text="确定" width="800">
      <logistics :result="logisticsResult"></logistics>
    </Modal>
    <!--异常推送-->
    <Modal v-model="exceptionSendModal" title="异常推送" width="800">
      <div>
        尹订单异常：订单智游宝同步失败，需再次手动推送订单是否再次推送智游宝
      </div>
      <div slot="footer">
        <Button @click="closeSendModal">不推送</Button>
        <Button type="primary" @click="exceptionSend">确认</Button>
      </div>
    </Modal>
    <!--异常订单-->
    <Modal
      v-model="exceptionOrderModal"
      title="异常订单"
      ok-text="确定"
      :loading="expOrderLoading"
      width="900"
    >
      <expOrder ref="expOrder" :expOresult="expOresult"></expOrder>
      <div slot="footer">
        <Button @click="exceptionOrder('F')">拒绝退款</Button>
        <Button type="primary" @click="exceptionOrder('T')">确认退款</Button>
      </div>
    </Modal>
    <!--异常退款-->
    <Modal
      v-model="exceptionRefundModal"
      title="异常退款"
      ok-text="确定"
      :loading="expRefundLoading"
      width="900"
    >
      <expRefund ref="expRefund" :expRresult="expRresult"></expRefund>
      <div slot="footer">
        <Button @click="closeRefundModal">拒绝退款</Button>
        <Button type="primary" @click="exceptionRefund">确认退款</Button>
      </div>
    </Modal>
    <!-- 退单 小交通 -->
    <Modal
      v-model="refundModal"
      title="退单"
      @on-ok="refund"
      @on-cancel="refundCancel"
      width="950"
      :loading="refundLoading"
    >
      <refund
        :result="refundRes"
        ref="refundPage"
        @confirm="subConfirm"
        @closeModal="closeModal"
      ></refund>
      <div slot="footer" v-if="footerShow"></div>
    </Modal>
    <!-- 改签 小交通 -->
    <Modal
      v-model="endorseModal"
      title="改签"
      ok-text="确定"
      @on-ok="endorseSubmit"
      @on-cancel="endorseCancel"
      width="800"
      :loading="endorseLoading"
    >
      <endorse ref="endorse" :result="endorseResult"></endorse>
    </Modal>
  </div>
</template>

<script>
import searchForm from "@/components/global/searchForm";
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
import orderInfo from "../components/orderInfo";
import viewLog from "../components/viewLog";
import checkOrderPage from "../components/checkOrder";
import expOrder from "../components/expOrder";
import expRefund from "../components/expRefund";
import deliver from "../components/deliver";
import logistics from "../components/logistics";
import formList from "../components/formList";
import endorse from "../components/endorse";
import refund from "../components/refund";
import { apiGet, apiPost, apiPostJson } from "@/fetch/api";
export default {
  data() {
    let data = new Date();
    let orderEndTime =
      data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate();
    data = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    let orderStartTime =
      data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate();
    return {
      hannleItems: [
        {
          title: "搜索",
          icon: "ios-search",
          callback: () => {
            this.$refs.formList.handleSubmit2();
            this.totalPrice();
          }
        },
        {
          title: "高级搜索",
          icon: "ios-search",
          callback: () => {
            this.$refs.formList.searchSubmit();
          }
        },
        {
          title: "导出",
          type: "success",
          loading: false,
          callback: () => {
            let _this = this;
            let obj = JSON.parse(
              JSON.stringify(_this.$store.state.list.params)
            );
            obj = Object.assign(obj, _this.$refs.formList.searchForm);
            _this.hannleItems[2].loading = true;
            if (obj.startCreateTime instanceof Date) {
              let data = obj.startCreateTime;
              obj.startCreateTime =
                data.getFullYear() +
                "-" +
                (data.getMonth() + 1) +
                "-" +
                data.getDate();
            }
            if (obj.endCreateTime instanceof Date) {
              let data = obj.endCreateTime;
              obj.endCreateTime =
                data.getFullYear() +
                "-" +
                (data.getMonth() + 1) +
                "-" +
                data.getDate();
            }
            // _this.$store.state.list.params.orderStartTime = _this.$store.state.list.params.orderStartTime instanceof Date ? this.filter.formatDate( new Date(_this.$store.state.list.params.orderStartTime), 'yyyy-MM-dd') :_this.$store.state.list.params.orderStartTime;
            // _this.$store.state.list.params.orderEndTime = _this.$store.state.list.params.orderEndTime instanceof Date ? this.filter.formatDate( new Date(_this.$store.state.list.params.orderEndTime), 'yyyy-MM-dd') :_this.$store.state.list.params.orderEndTime;
            let str = "";
            for (let ele in obj) {
              str += ele + "=" + obj[ele] + "&";
            }
            var url =
              "/etlcenter/api/merchanOrdersExport?" +
              str.substring(0, str.length - 1);
            this.common.exportData(
              "店铺订单",
              url,
              () => {
                _this.hannleItems[2].loading = false;
              },
              _this
            );
          }
        }
      ],
      searchAdvanced: [
        {
          label: "订单来源",
          type: "select",
          name: "wayType",
          data: [
            {
              value: "0",
              label: "pc"
            },
            {
              value: "1",
              label: "wap"
            },
            {
              value: "2",
              label: "微信"
            },
            {
              value: "3",
              label: "支付宝"
            },
            {
              value: "4",
              label: "B2B"
            },
            {
              value: "5",
              label: "OTA"
            }
          ]
        },
        {
          label: "订单状态",
          type: "select",
          name: "orderStatus",
          data: [
            {
              value: "0",
              label: "待支付"
            },
            {
              value: "1",
              label: "待发货"
            },
            {
              value: "2",
              label: "待收货"
            },
            {
              value: "3",
              label: "待消费"
            },
            {
              value: "4",
              label: "已完成"
            },
            {
              value: "5",
              label: "已关闭"
            },
            {
              value: "6",
              label: "退款中"
            },
            {
              value: "8",
              label: "订单异常"
            },
            {
              value: "21",
              label: "待退款"
            },
            {
              value: "24",
              label: "服务中"
            }
          ]
        },
        {
          label: "联系人",
          type: "input",
          name: "linkName"
        },
        {
          label: "身份证",
          type: "input",
          name: "linkIdcard"
        },
        {
          label: "游玩开始日期",
          type: "date",
          name: "orderStartTime"
        },
        {
          label: "游玩结束日期",
          type: "date",
          name: "orderEndTime"
        }
      ],
      searchItems: [
        {
          label: "业务类型",
          type: "select",
          name: "orderType",
          data: [
            {
              value: "",
              label: "全部类型"
            }
          ]
        },
        {
          label: "订单号",
          type: "input",
          name: "orderNo"
        },
        {
          label: "手机号",
          type: "input",
          name: "linkMobile"
        },
        {
          label: "产品名称",
          type: "input",
          name: "goodsName"
        },
        {
          label: "下单日期",
          type: "date",
          name: "startCreateTime",
          value: orderStartTime
        },
        {
          label: "下单日期",
          type: "date",
          name: "endCreateTime",
          value: orderEndTime
        },
        {
          label: "消费状态",
          type: "select",
          name: "checkStatus",
          data: [
            {
              value: "",
              label: "--请选择消费状态--"
            }
          ]
        }
      ],
      // 高级筛选
      formShow: false, // 高级筛选显示  隐藏
      columns: [
        {
          title: "序号",
          key: "action",
          align: "center",
          width: 70,
          render: (h, params) => {
            return h("span", params.index + 1);
          }
        },
        {
          title: "业务类型",
          width: 95,
          key: "orderType",
          render: (h, params) => {
            return h("span", this.filter.orderType(params.row.orderType));
          }
        },
        {
          title: "订单号",
          sortable: true,
          align: "center",
          width: 195,
          key: "orderNo"
        },
        {
          title: "订单来源",
          key: "wayType",
          width: 95,
          render: (h, params) => {
            return h("span", this.filter.wayType(params.row.wayType));
          }
        },
        {
          title: "订单状态",
          key: "orderStatus",
          width: 100,
          render: (h, params) => {
            return h("span", this.filter.orderStatus(params.row.orderStatus));
          }
        },
        {
          title: "消费状态",
          key: "checkStatus",
          width: 95,
          render: (h, params) => {
            return h("span", this.filter.checkStatus(params.row.checkStatus));
          }
        },
        {
          title: "游玩时间",
          sortable: true,
          width: 160,
          align: "center",
          key: "startTime"
        },
        {
          title: "支付时间",
          sortable: true,
          width: 160,
          align: "center",
          key: "payTime"
        },
        {
          title: "支付类型",
          key: "payType",
          width: 100,
          render: (h, params) => {
            return h("span", this.filter.payType(params.row.payType));
          }
        },
        {
          title: "产品名称",
          width: 190,
          key: "goodsName"
        },
        {
          title: "数量",
          width: 70,
          key: "amount"
        },
        {
          title: "支付金额",
          sortable: true,
          width: 110,
          key: "paySum"
        },
        {
          title: "联系人",
          width: 110,
          key: "linkName"
        },
        {
          title: "联系电话",
          width: 115,
          key: "linkMobile"
        },
        {
          title: "操作",
          key: "action",
          width: 185,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            const deliver = {
              title: "发货",
              action: async () => {
                let res = await apiGet("/order/orderInfo/toSendGoodsFL", {
                  orderNo: params.row.orderNo
                });
                if (res.success) {
                  this.deliverModal = true;
                  this.deliverResult = res.data;
                } else {
                  this.$Message.error(res.message);
                }
              }
            };
            const recipient = {
              title: "自提收货",
              action: () => {
                this.confirmContent = "确认收货？";
                this.sucessMsg = "收货成功！";
                this.$refs.confirmModel.confirm(
                  "/order/orderInfo/checkOrderByHandleGoodsHx",
                  { orderNo: params.row.orderNo }
                );
              }
            };
            const verification = {
              title: "核销",
              action: async () => {
                let res = await apiGet("/order/orderInfo/toCheckOrderFL", {
                  id: params.row.id
                });
                if (res.success) {
                  this.checkOrderModal = true;
                  this.checkOrderResult = res.data;
                  if (
                    res.data &&
                    res.data.orderInfo.orderType == "family" &&
                    res.data.details &&
                    res.data.details.length > 0
                  ) {
                    let arr = [];
                    res.data.details.forEach((item, index) => {
                      if (item.isCanCheck && item.isCanCheck == "T") {
                        arr.push(item.isCanCheck);
                      }
                    });
                    if (arr.length < 1) {
                      this.isCanCheck = false;
                    } else {
                      this.isCanCheck = true;
                    }
                  }
                } else {
                  this.$Message.error(res.message);
                }
              }
            };
            const verificationGuide = {
              title: "核销",
              action: async () => {
                let res = await apiPost("/admin/userInfo/getAllGuide");
                this.checkOrderModalGuide = true;
                this.guideParams = {
                  orderNo: params.row.orderNo,
                  userId: "",
                  loginAccName: ""
                };
                this.belongList = res;
              }
            }           
            const confirmOrder = {
              title: "确认订单",
              action: () => {
                this.confirmContent = "确认操作？";
                this.sucessMsg = "确认成功！";
                this.$refs.confirmModel.confirm(
                  "/order/orderInfo/confirmOrder",
                  {
                    orderNo: params.row.orderNo,
                    busType: params.row.busType
                  }
                );
              }
            };
            const pmsConfirmOrder = {
              title: "确认订单",
              action: () => {
                this.confirmContent = "确认接单吗？";
                this.sucessMsg = "确认成功！";
                this.$refs.confirmModel.confirm(
                  "/pmsorder/webApi/order/confrimOrder",
                  {
                    orderNo: params.row.orderNo
                  }
                );
              }
            };
            const cancelOrder = {
              title: "取消订单",
              action: () => {
                this.confirmContent = "确认取消订单？";
                this.sucessMsg = "取消成功！";
                this.$refs.confirmModel.confirm(
                  "/order/orderInfo/confirmCancelOrder",
                  { orderNo: params.row.orderNo }
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
            const logisticsNew = {
              title: "物流",
              action: async () => {
                let res = await apiPost(
                  "/order/webapi/orderInfo/viewExpressMsgFL",
                  { orderNo: params.row.orderNo }
                );
                if (res.status === 200) {
                  this.logisticsModal = true;
                  this.logisticsResult = res.data;
                } else {
                  this.$Message.error(res.message);
                }
              }
            };
            //异常订单
            const exceptionOrder = {
              title: "异常订单",
              action: async () => {
                let res = await apiGet(
                  "/order/orderInfo/getExceptionRefundDetail",
                  { orderNo: params.row.orderNo }
                );
                if (res.status == 200) {
                  this.exceptionOrderModal = true;
                  this.expOresult = res.data;
                } else {
                  this.$Message.error(res.message);
                }
              }
            };
            const toReSchedule = {
              title: "改签",
              action: async () => {
                let res = await apiPost(
                  "/order/webapi/orderInfo/toReSchedule",
                  { id: params.row.id }
                );
                if (res.status === 200) {
                  this.endorseModal = true;
                  this.endorseResult = res.data;
                } else {
                  this.$Message.error(res.message);
                }
              }
            };
            //异常推送
            const exceptionSend = {
              title: "异常推送",
              action: async () => {
                this.exceptionSendModal = true;
                this.sendOrderId = params.row.id;
              }
            };
            //异常退款
            const exceptionRefund = {
              title: "异常退款",
              action: async () => {
                let res = await apiGet(
                  "/order/orderInfo/getExceptionRefundDetail",
                  { orderNo: params.row.orderNo }
                );
                if (res.status == 200) {
                  this.exceptionRefundModal = true;
                  this.expRresult = res.data;
                } else {
                  this.$Message.error(res.message);
                }
              }
            };
            let refund = {
              title: "退单",
              action: async () => {
                let res = await apiGet(
                  params.row.orderType === "traffic"
                    ? "/order/api/toRefundB2BTraffic"
                    : "/order/orderInfo/toRefundB2BFL",
                  { id: params.row.id }
                );
                if (res.success) {
                  if (res.data.orderInfo.orderType === "mdse") {
                    this.footerShow = true;
                  } else {
                    this.footerShow = false;
                  }
                  if (res.data.orderInfo.orderType === "traffic") {
                    this.otherUrl = "/order/api/refundTrafficB2B";
                  } else {
                    this.otherUrl = "";
                  }
                  this.refundModal = true;
                  this.refundRes = res.data;
                } else {
                  this.$Message.error(res.message);
                }
              }
            };
            const actions = [
              {
                title: "明细",
                action: async () => {
                  let res = await apiGet("/order/orderInfo/viewOrderFL", {
                    orderNo: params.row.orderNo
                  });
                  if (res.success) {
                    this.modal = true;
                    this.modalTitle = "明细";
                    this.spinShow = false;
                    this.result = res.data;
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
              },
              {
                title: "轨迹",
                action: async () => {
                  let res = await apiGet("/order/orderOptLog/viewLogFL", {
                    id: params.row.id
                  });
                  if (res.success) {
                    this.modal2 = true;
                    this.modalTitle = "轨迹";
                    this.spinShow = false;
                    this.viewLogRes = res.data;
                  } else {
                    this.$Message.error(res.message);
                  }
                }
              }
            ];
            if (params.row["orderType"] === "traffic") {
              if (
                params.row.payStatus === "1" &&
                params.row.orderStatus !== "4" &&
                params.row.orderStatus !== "5"
              ) {
                actions.push(refund);
              }
              if (
                params.row["payStatus"] === "1" &&
                params.row["orderStatus"] === "3"
              ) {
                actions.push(toReSchedule);
              }
            }
            if (params.row.expressNo && params.row.expressType !== "sjtcps") {
              actions.push(logistics);
            }
            if (params.row.expressType && params.row.expressType === "sjtcps") {
              actions.push(logisticsNew);
            }
            if (
              params.row.salesType === "0" &&
              params.row["payStatus"] === "1" &&
              params.row["orderStatus"] !== "4" &&
              params.row["orderStatus"] !== "5"
            ) {
              if (params.row["orderStatus"] === "9") {
                actions.push(confirmOrder, cancelOrder);
              }
              if (
                params.row["orderType"] === "pms_hotel" &&
                params.row["orderStatus"] === "17"
              ) {
                //pms确认订单
                // actions.push(pmsConfirmOrder)
              }
              if (params.row["orderType"] === "mdse") {
                if (
                  params.row["groupStatus"] === "1" ||
                  params.row["groupId"] == null
                ) {
                  if (params.row["checkStatus"] === "0") {
                    if (params.row["deliverType"] !== "0") {
                      actions.push(deliver);
                    } else {
                      actions.push(recipient);
                    }
                  }
                }
              } else {
                  if(params.row['orderType'] === 'pms_hotel'){
                      if((params.row['checkStatus'] === '0'||params.row['checkStatus'] === '4')&&(params.row['orderStatus'] == '10'||params.row['orderStatus'] == '14') &&(params.row['extendParam'] &&JSON.parse(params.row['extendParam']).isDirect==='F')){
                          actions.push(verification)
                      }
                  }else if (
                  params.row['orderType']!=='traffic'&&
                  params.row['orderStatus'] !== '6' &&
                  params.row['orderStatus'] !== '7' &&
                  params.row['orderStatus'] !== '9' &&
                  params.row['extendParam'] && params.row.orderType !== 'guide' && params.row.orderType !== 'show' && params.row['isDsCheck'] == 'F'
                ){
                  actions.push(verification)
                }
              }
            }
            //异常订单
            if (
              params.row.orderStatus == "21" &&
              (params.row.orderType == "park" ||
                params.row.orderType == "family") &&
              this.isAdmin == "T"
            ) {
              actions.push(exceptionOrder);
            }
            //异常推送
            if (
              params.row.orderStatus == "8" &&
              (params.row.orderType == "park" ||
                params.row.orderType == "family")
            ) {
              if (this.isAdmin == "T") {
                actions.push(exceptionRefund);
              }
              actions.push(exceptionSend);
            }
            // 导游核销
            // 导游子账号登录, 核销按钮不需要显示
            // if(params.row.orderStatus == '3'&&params.row.orderType == 'guide'){
            //   actions.push(verificationGuide)
            // }
            if(params.row.orderStatus == '3'&&params.row.checkStatus == '0'&&params.row.orderType == 'show' && params.row['isDsCheck'] == 'F'){
              actions.push(verification)
            }
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      params: {
        page: 1,
        limit: 10,
        sort: "createTime",
        order: "desc"
      },
      url: "/order/orderInfo/gridMerchant",
      modal: false,
      modal2: false,
      formItem: {
        name: "",
        switch: true,
        picAddr: "",
        activityDetail: ""
      },
      formItem2: {},
      result: {},
      viewLogRes: {},
      checkOrderResult: {},
      deliverResult: {},
      modalTitle: "新增角色",
      spinShow: true,
      checkOrderModal: false,
      checkOrderLoading: true,
      expOrderLoading: true,
      expRefundLoading: true,
      deliverLoading: true,
      deliverModal: false,
      logisticsModal: false,
      logisticsData: {},
      confirmContent: "",
      sucessMsg: "",
      logisticsResult: {},
      total: 0,
      orderType: "",
      isCanCheck: true,
      exceptionSendModal: false,
      exceptionOrderModal: false,
      expOresult: {},
      sendOrderId: "",
      exceptionRefundModal: false,
      expRresult: {},
      complete: false,
      isAdmin: "",
      footerShow: false,
      otherUrl: "",
      refundModal: false,
      refundRes: {},
      refundLoading: true,
      endorseModal: false,
      endorseResult: {},
      endorseLoading: true,
      checkOrderModalGuide: false, // 导游订单核销
      checkOrderLoadingGuide: false,
      guideParams: {
        orderNo: "",
        userId: "",
        loginAccName: ""
      },
      belongList: []
    };
  },
  components: {
    searchForm,
    gridTable,
    confirm,
    orderInfo,
    viewLog,
    checkOrderPage,
    expOrder,
    expRefund,
    deliver,
    logistics,
    refund,
    endorse,
    formList
  },
  async created() {
    await apiPostJson("/admin/sysparam/findSysParamList", {
      types: ["business_type", "checkstatus"]
    }).then(res => {
      res.data.business_type.map(item => {
        this.searchItems[0].data.push({
          value: item.key,
          label: item.value
        });
      });
      res.data.checkstatus.map(ele => {
        this.searchItems[6].data.push({
          value: ele.key,
          label: ele.value
        });
      });
    });
  },
  async mounted () {
    console.log(this.$refs.formList.searchForm)
    let res = await apiPost('/order/webapi/orderInfo/gridMerchant')
    if (res.status === 200) {
      this.params.mainUserInfoId = res.data.mainUserInfoId;
      this.params.contentType = res.data.contentType;
      this.params = Object.assign(this.$refs.formList.searchForm, this.params);
      let obj = this.params;
      if (obj.startCreateTime instanceof Date) {
        let data = obj.startCreateTime;
        obj.startCreateTime =
          data.getFullYear() +
          "-" +
          (data.getMonth() + 1) +
          "-" +
          data.getDate();
      }
      if (obj.endCreateTime instanceof Date) {
        let data = obj.endCreateTime;
        obj.endCreateTime =
          data.getFullYear() +
          "-" +
          (data.getMonth() + 1) +
          "-" +
          data.getDate();
      }
      this.$refs.formList.handleSubmit2();
      this.isAdmin = res.data.userInfo.ifAdmin;
      this.complete = true;
    } else {
      this.$Message.error(res.message);
    }
    this.totalPrice();
  },
  methods: {
    ok() {
      this.modal = false;
    },
    async checkOrder() {
      let validate = this.$refs["checkOrderPage"].handleSubmit();
      if (validate) {
        let url =
          validate.orderType == "pms_hotel"
            ? "/pmsorder/webApi/order/checkPmsOrderByHandle"
            : "/order/orderInfo/checkOrderByHandle";
        let res = await apiPost(url, validate);
        if (res.success || res.status == 200) {
          this.checkOrderModal = false;
          this.$Message.success(res.message);
          this.$refs.gridTable.loadpage();
        } else {
          this.$Message.error(res.message);
        }
      } else {
        this.checkOrderLoading = false;
        this.$nextTick(() => {
          this.checkOrderLoading = true;
        });
      }
    },
    async checkOrderGuide() {
      this.$refs.guideformItem.validate(async valid => {
        if (valid) {
          this.checkOrderLoadingGuide = true;
          let item = JSON.parse(this.guideParams.belong);
          let formParam = {
            userId: item.id,
            loginAccName: item.accName,
            orderNo: this.guideParams.orderNo
          };
          let url = "/order/orderInfo/guideCheck";
          let res = await apiGet(url, formParam);
          this.checkOrderLoadingGuide = false;
          if (res.status == 200) {
            this.checkOrderModalGuide = false;
            this.$Message.success(res.message || "核销成功!");
            this.$refs.gridTable.loadpage();
          } else {
            this.$Message.warning(res.message);
          }
        }
      });
    },
    async delive() {
      let validate = this.$refs["delive"].handleSubmit();
      if (validate) {
        let res = await apiPost(
          "/order/orderInfo/checkOrderByHandleGoods",
          validate
        );
        if (res.success) {
          this.deliverModal = false;
          this.$Message.info(res.message);
          this.$refs.gridTable.loadpage();
        } else {
          this.$Message.error(res.message);
          this.deliverLoading = false;
          this.$nextTick(() => {
            this.deliverLoading = true;
          });
        }
      } else {
        this.deliverLoading = false;
        this.$nextTick(() => {
          this.deliverLoading = true;
        });
      }
    },
    async refund() {
      let validate = this.$refs["refundPage"].handleSubmit();
      if (validate) {
        let res = await apiPost(
          this.otherUrl ? this.otherUrl : "/order/orderRefund/doRefundB2B",
          validate
        );
        if (res.success) {
          this.refundModal = false;
          this.$Message.info(res.message);
          this.$refs.gridTable.loadpage();
        } else {
          this.$Message.error(res.message);
          this.refundLoading = false;
          this.$nextTick(() => {
            this.refundLoading = true;
          });
        }
      } else {
        this.refundLoading = false;
        this.$nextTick(() => {
          this.refundLoading = true;
        });
      }
    },
    refundCancel() {
      this.$refs.refundPage.rest();
    },
    async endorseSubmit() {
      let validate = this.$refs["endorse"].handleSubmit();
      if (validate) {
        let res = await apiPost(
          "/order/orderEndorse/changeStartDate",
          validate
        );
        if (
          this.endorseResult.order &&
          this.endorseResult.order.orderType == "traffic"
        ) {
          res = await apiPost(
            "/order/webapi/orderInfo/reScheduleForTraffic",
            validate
          );
        }
        if (res.success) {
          this.endorseModal = false;
          this.$Message.info(res.message);
          this.$refs.gridTable.loadpage();
        } else {
          this.$Message.error(res.message);
          this.endorseLoading = false;
          this.$nextTick(() => {
            this.endorseLoading = true;
          });
        }
      } else {
        this.endorseLoading = false;
        this.$nextTick(() => {
          this.endorseLoading = true;
        });
      }
    },
    endorseCancel() {
      this.$refs.endorse.rest();
    },
    subConfirm(obj) {
      this.confirmContent = obj.confirmContent;
      this.sucessMsg = obj.sucessMsg;
      this.$refs.confirmModel.confirm(obj.url, obj.par);
    },
    sucessDone() {
      this.refundModal = false;
    },
    closeModal() {
      this.$refs.refundPage.rest();
      this.refundModal = false;
    },
    // 高级筛选
    // 其中订单来源筛选无效果？都是wap？
    async searchSubmit() {
      this.formShow = true;
      this.$store.state.list.params = Object.assign(
        this.$store.state.list.params,
        this.formItem2
      );
      await this.$store.dispatch("postApi");
    },
    cancel() {
      // this.$Message.info('Clicked cancel')
    },
    async totalPrice () {
      let res = await apiPost('/order/orderInfo/getTotalPaySum', this.$store.state.list.params)
      this.total = res
    },
    closeCheckOrderModal() {
      this.checkOrderModal = false;
    },
    closeCheckOrderModalGuide() {
      this.checkOrderModalGuide = false;
    },
    closeSendModal() {
      this.exceptionSendModal = false;
    },
    async exceptionSend() {
      let res = await apiPost("/order/webapi/orderInfo/syncToZyb", {
        orderId: this.sendOrderId
      });
      if (res.status == 200) {
        this.exceptionSendModal = false;
        this.$Message.info(res.message);
        this.$refs.gridTable.loadpage();
      } else {
        this.$Message.error(res.message);
      }
    },
    closeOrderModal() {
      this.exceptionOrderModal = false;
    },
    async exceptionOrder(flag) {
      let validate = this.$refs["expOrder"].handleSubmit();
      let expValidate = Object.assign(validate, { approval: flag });
      console.log("expValidate", expValidate);
      if (expValidate) {
        if (expValidate.errorTips) {
          this.$Message.error("退款金额大于实付金额");
          return false;
        } else if (expValidate.errorTips0) {
          this.$Message.error("退款金额不能为空");
          return false;
        } else {
          let res = await apiGet(
            "/order/orderInfo/exceptionOrderRefund",
            expValidate
          );
          if (res.success) {
            this.exceptionOrderModal = false;
            this.$Message.info(res.message);
            this.$refs.gridTable.loadpage();
          } else {
            this.exceptionOrderModal = false;
            this.$Message.error(res.message);
            this.$refs.gridTable.loadpage();
          }
        }
      } else {
        this.expOrderLoading = false;
        this.$nextTick(() => {
          this.expOrderLoading = true;
        });
      }
    },
    async closeRefundModal() {
      let validate = this.$refs["expRefund"].handleSubmit();
      let expValidate = Object.assign(validate, {
        approval: "F",
        exceptionOrder: "exceptionOrder"
      });
      if (expValidate) {
        let res = await apiGet(
          "/order/orderInfo/exceptionOrderRefund",
          expValidate
        );
        if (res.success) {
          this.exceptionRefundModal = false;
          this.$Message.info(res.message);
          this.$refs.gridTable.loadpage();
        } else {
          this.$Message.error(res.message);
        }
      } else {
        this.expRefundLoading = false;
        this.$nextTick(() => {
          this.expRefundLoading = true;
        });
      }
      // this.exceptionRefundModal = false;
    },
    async exceptionRefund() {
      let validate = this.$refs["expRefund"].handleSubmit();
      if (validate) {
        let res = await apiPost(
          "/order/webapi/orderInfo/refundErrorOrder",
          validate
        );
        if (res.status == 200) {
          this.exceptionRefundModal = false;
          this.$Message.info(res.message);
          this.$refs.gridTable.loadpage();
        } else {
          this.$Message.error(res.message);
        }
      } else {
        this.expRefundLoading = false;
        this.$nextTick(() => {
          this.expRefundLoading = true;
        });
      }
    }
  }
};
</script>
<style scoped>
.total {
  padding: 0 10px;
  color: #f00;
  font-size: 16px;
}
.total span {
  font-size: 12px;
  margin-right: 20px;
}
</style>
