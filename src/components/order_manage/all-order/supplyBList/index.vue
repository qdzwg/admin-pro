<template>
  <div class="supplyBList">
    <form-list ref="formList"
               :search-items='searchItems'
               :search-advanced="searchAdvanced"
               :hannle-items="hannleItems"></form-list>
    <gridTable ref="gridTable"
               :columns="columns"
               :params="params"
               :data="data"
               :url="url"
               :extraParams="true"></gridTable>
    <confirm ref="confirmModel"
             mode="done"
             :content="confirmContent"
             :sucessMsg="sucessMsg"></confirm>
    <!-- 确认订单 -->
    <Modal v-model="confirmBill"
           title="确认订单"
           width=950>
        <Table ref="table" border :columns="billColumns" :data="billList" @on-selection-change="changeSelection">
          <slot name="footer" slot="footer"></slot> 
        </Table>
        <div slot="footer">
          <Button size="large" @click="billOpt('confirmOrder')" type="primary">确定</Button>
          <Button size="large" @click="billOpt('confirmCancelOrderB')" type="ghost">取消</Button>
        </div>
    </Modal>
    <!-- 订单明细 -->
    <Modal v-model="modal"
           :title="modalTitle"
           @on-ok="ok"
           width=950>
      <orderInfo :result="result"
                 searchType="orderInfo"></orderInfo>
      <Spin fix
            v-if="spinShow">
        <Icon type="load-c"
              size=18
              class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
      </Spin>
      <div slot="footer">
      </div>
    </Modal>
    <!-- 订单轨迹 -->
    <Modal v-model="modal2"
           :title="modalTitle"
           @on-ok="ok"
           width="800">
      <viewLog :result="viewLogRes"></viewLog>
      <Spin fix
            v-if="spinShow">
        <Icon type="load-c"
              size=18
              class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
      </Spin>
      <div slot="footer">
      </div>
    </Modal>
    <!-- 订单核销 -->
    <Modal v-model="checkOrderModal"
           title="订单核销"
           @on-ok="checkOrder"
           ok-text="核销"
           width="800"
           :loading="checkOrderLoading">
      <checkOrderPage ref="checkOrderPage"
                      :result="checkOrderResult"></checkOrderPage>
    </Modal>
    <!-- 发货 -->
    <Modal v-model="deliverModal"
           title="发货"
           @on-ok="delive"
           @on-cancel="deliveCancel"
           ok-text="发货"
           width="800"
           :loading="deliverLoading">
      <deliver ref="delive"
               :result="deliverResult"></deliver>
    </Modal>
    <!-- 物流 -->
    <Modal v-model="logisticsModal"
           title="物流信息"
           ok-text="确定"
           width="800">
      <logistics :result="logisticsResult"></logistics>
    </Modal>
    <!-- 改签 -->
    <Modal v-model="endorseModal"
           title="改签"
           ok-text="确定"
           @on-ok="endorseSubmit"
           @on-cancel="endorseCancel"
           width="800"
           :loading="endorseLoading">
      <endorse ref="endorse"
               :result="endorseResult"></endorse>
    </Modal>
    <!-- 退单 小交通 -->
    <Modal v-model="refundModal"
           title="退单"
           @on-ok="refund"
           @on-cancel="refundCancel"
           width="950"
           :loading="refundLoading">
      <refund :result="refundRes"
              ref="refundPage"
              @confirm="subConfirm"
              @closeModal="closeModal"></refund>
      <div slot="footer"
           v-if="footerShow">
      </div>
    </Modal>
    <confirm ref="refundConfirmModel"
             mode="done"
             :content="refundConfirmContent"
             :sucessMsg="refundSucessMsg"
             @sucessDone="sucessDone"></confirm>
  </div>
</template>

<script>
import searchForm from '@/components/global/searchForm'
import gridTable from '@/components/global/gridTable'
import confirm from '@/components/global/confirm'
import orderInfo from '../components/orderInfo'
import viewLog from '../components/viewLog'
import checkOrderPage from '../components/checkOrder'
import deliver from '../components/deliver'
import logistics from '../components/logistics'
import endorse from '../components/endorse'
import refund from '../components/refund'
import formList from '../components/formList'
import { apiGet, apiPost } from '@/fetch/api'
export default {
  data () {
    let data = new Date();
    let orderEndTime = data.getFullYear() +
      "-" +
      (data.getMonth() + 1) +
      "-" +
      data.getDate();
    data = new Date(Date.now()-2*24*60*60*1000);
    let orderStartTime = data.getFullYear() +
      "-" +
      (data.getMonth() + 1) +
      "-" +
      data.getDate();
    return {
      hannleItems: [
        {
          title: '搜索',
          icon: 'ios-search',
          callback: () => {
            this.$refs.formList.handleSubmit2()
          }
        },
        {
          title: '高级搜索',
          icon: 'ios-search',
          callback: () => {
            this.$refs.formList.searchSubmit()
          }
        }
      ],
      searchItems: [
        {
          label: '业务类型',
          type: 'select',
          name: 'orderType',
          data: [
            {
              value: '',
              label: '全部类型'
            },
            {
              value: 'park',
              label: '景区'
            },
            {
              value: 'hotel',
              label: '酒店'
            },
            {
              value: 'mdse',
              label: '商品'
            },
            {
              value: 'route',
              label: '跟团游'
            },
            {
              value: 'eatery',
              label: '餐饮'
            },
            {
              value: 'theater_ticket',
              label: '剧院'
            },
            {
              value: 'traffic',
              label: '小交通'
            }
          ]
        },
        {
          label: '订单号',
          type: 'input',
          name: 'orderNo'
        },
        {
          label: '手机号',
          type: 'input',
          name: 'linkMobile'
        },
        {
          label: '身份证',
          type: 'input',
          name: 'linkIdcard'
        },
        {
          label: '下单日期',
          type: 'date',
          name: 'orderStartTime',
          value: orderStartTime
        },
        {
          label: '下单日期',
          type: 'date',
          name: 'orderEndTime',
          value: orderEndTime
        }
      ],
      // 高级筛选
      formShow: false, // 高级筛选显示  隐藏
      searchAdvanced: [
        {
          label: '订单来源',
          type: 'select',
          name: 'wayType',
          data: [
            {
              value: '0',
              label: 'pc'
            },
            {
              value: '1',
              label: 'wap'
            },
            {
              value: '2',
              label: '微信'
            },
            {
              value: '3',
              label: '支付宝'
            },
            {
              value: '4',
              label: 'B2B'
            },
            {
              value: '5',
              label: 'OTA'
            },
            {
              value: '6',
              label: '小程序'
            },
            {
              value: '7',
              label: '窗口'
            },
            {
              value: '8',
              label: '自助机'
            },
            {
              value: '9',
              label: '云POS'
            },
            {
              value: '10',
              label: '微信小程序'
            },
            {
              value: '12',
              label: '支付宝小程序'
            },
            {
              value: '12',
              label: '浏览器'
            },
          ]
        },
        {
          label: '订单状态',
          type: 'select',
          name: 'orderStatus',
          data: [
            {
              value: '0',
              label: '待支付'
            },
            {
              value: '1',
              label: '待发货'
            },
            {
              value: '2',
              label: '待收货'
            },
            {
              value: '3',
              label: '待消费'
            },
            {
              value: '4',
              label: '已完成'
            },
            {
              value: '5',
              label: '已关闭'
            },
            {
              value: '6',
              label: '退款中'
            },
            {
              value: '8',
              label: '订单异常'
            }
          ]
        },
        {
          label: '联系人',
          type: 'input',
          name: 'linkName'
        },
        {
          label: '身份证',
          type: 'input',
          name: 'linkIdcard'
        }
      ],
      columns: [
        {
          title: '序号',
          align: 'center',
          width: 70,
          render: (h, params) => {
            return h('span', params.index + 1)
          }
        },
        {
          title: '业务类型',
          width: 95,
          key: 'orderType',
          render: (h, params) => {
            return h('span', this.filter.orderType(params.row.orderType))
          }
        },
        {
          title: '订单号',
          sortable: true,
          align: 'center',
          width: 195,
          key: 'orderNo'
        },
        {
          title: '订单来源',
          key: 'wayType',
          width: 95,
          render: (h, params) => {
            return h('span', this.filter.wayType(params.row.wayType))
          }
        },
        {
          title: '订单状态',
          key: 'orderStatus',
          width: 95,
          render: (h, params) => {
            return h('span', this.filter.orderStatus(params.row.orderStatus))
          }
        },
        {
          title: '消费状态',
          key: 'checkStatus',
          width: 95,
          render: (h, params) => {
            return h('span', this.filter.checkStatus(params.row.checkStatus))
          }
        },
        {
          title: '支付时间',
          sortable: true,
          width: 160,
          align: 'center',
          key: 'payTime'
        },
        {
          title: '支付类型',
          key: 'payType',
          width: 100,
          render: (h, params) => {
            return h('span', this.filter.payType(params.row.payType))
          }
        },
        {
          title: '产品名称',
          width: 180,
          key: 'goodsName'
        },
        {
          title: '数量',
          width: 70,
          key: 'amount'
        },
        {
          title: '订单金额',
          sortable: true,
          width: 110,
          key: 'paySum'
        },
        {
          title: '联系人',
          width: 110,
          key: 'linkName'
        },
        {
          title: '联系电话',
          width: 115,
          key: 'linkMobile'
        },
        {
          title: '操作',
          key: 'action',
          width: 175,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            const deliver = {
              title: '发货',
              action: async () => {
                let res = await apiGet('/order/orderInfo/toSendGoodsFL', {
                  orderNo: params.row.orderNo
                })
                if (res.success) {
                  this.deliverModal = true
                  this.deliverResult = res.data
                } else {
                  this.$Message.error(res.message)
                }
              }
            }
            const recipient = {
              title: '自提收货',
              action: () => {
                this.confirmContent = '确认收货？'
                this.sucessMsg = '收货成功！'
                this.$refs.confirmModel.confirm(
                  '/order/orderInfo/checkOrderByHandleGoodsHx',
                  { orderNo: params.row.orderNo }
                )
              }
            }
            const verification = {
              title: '核销',
              action: async () => {
                let res = await apiGet('/order/orderInfo/toCheckOrderFL', {
                  id: params.row.id
                })
                if (res.success) {
                  this.checkOrderModal = true
                  this.checkOrderResult = res.data
                } else {
                  this.$Message.error(res.message)
                }
              }
            }
            // 酒店二次确认订单
            const confirmOrder = {
              title: '确认订单',
              action: async () => {
                this.billInfo = params.row;
                let res = await apiGet('/order/orderInfo/getWaitConfirmDetails', {
                  orderNo: params.row.orderNo
                })
                if (res.status) {
                  this.confirmBill = true
                  this.selection = [];
                  this.billList = res.dataList
                } else {
                  this.$Message.error(res.message)
                }
              }
            }
            // 酒店二次确认取消订单
            const cancelOrder = {
              title: '取消订单',
              action: () => {
                this.confirmContent = '确认取消订单？'
                this.sucessMsg = '取消成功！'
                this.$refs.confirmModel.confirm(
                  '/order/orderInfo/confirmCancelOrder',
                  { orderNo: params.row.orderNo }
                )
              }
            }
            const logistics = {
              title: '物流',
              action: () => {
                window.open(
                  'https://www.kuaidi100.com/chaxun?com=' +
                  params.row.expressType +
                  '&nu=' +
                  params.row.expressNo
                )
              }
            }
            // 商家同城配送
            const logisticsNew = {
              title: '物流',
              action: async () => {
                let res = await apiPost(
                  '/order/webapi/orderInfo/viewExpressMsgFL',
                  { orderNo: params.row.orderNo }
                )
                if (res.status === 200) {
                  this.logisticsModal = true
                  this.logisticsResult = res.data
                } else {
                  this.$Message.error(res.message)
                }
              }
            }
            // 取消订单
            const cancelB2B = {
              title: '取消',
              action: async () => {
                this.confirmContent = '确认取消订单？'
                this.sucessMsg = '取消成功！'
                this.$refs.confirmModel.confirm('/order/orderInfo/cancelB2B', {
                  orderNo: params.row.orderNo
                })
              }
            }
            const toReSchedule = {
              title: '改签',
              action: async () => {
                let res = await apiPost('/order/webapi/orderInfo/toReSchedule', { id: params.row.id })
                if (res.status === 200) {
                  this.endorseModal = true
                  this.endorseResult = res.data
                } else {
                  this.$Message.error(res.message)
                }
              }
            }
            let refund = {
              title: '退单',
              action: async () => {
                let res = await apiGet(params.row.orderType === "traffic"?'/order/api/toRefundB2BTraffic':'/order/orderInfo/toRefundB2BFL', { id: params.row.id })
                if (res.success) {
                  if (res.data.orderInfo.orderType === 'mdse') {
                    this.footerShow = true
                  } else {
                    this.footerShow = false
                  }
                  if(res.data.orderInfo.orderType === "traffic"){
                    this.otherUrl = '/order/api/refundTrafficB2B';
                  }else{
                    this.otherUrl = '';
                  }
                  this.refundModal = true
                  this.refundRes = res.data
                } else {
                  this.$Message.error(res.message)
                }
              }
            }
            const repeatSendMsg = {
              title: '短信重发',
              action: async () => {
                this.confirmContent = '确认重发短信？'
                this.sucessMsg = '短信重发成功！'
                this.$refs.confirmModel.confirm(
                  '/order/orderInfo/repeatSendMsg',
                  { orderNo: params.row.orderNo }
                )
              }
            }
            const actions = [
              {
                title: '明细',
                action: async () => {
                  let res = await apiGet('/order/orderInfo/viewOrderFL', {
                    orderNo: params.row.orderNo
                  })
                  if (res.success) {
                    this.modal = true
                    this.modalTitle = '明细'
                    this.spinShow = false
                    this.result = res.data
                  } else {
                    this.$Message.error(res.message)
                  }
                  if(params.row.orderType === "traffic"){
                    let res = await apiGet('/order/api/trafficOrderDetailForB', {
                      orderNo: params.row.orderNo
                    })
                    if (res.status == 200) {
                      this.$set(this.result,'siteInfo',res.data);
                    } else {
                      this.$Message.error(res.message)
                    }
                  }
                }
              },
              {
                title: '轨迹',
                action: async () => {
                  let res = await apiGet('/order/orderOptLog/viewLogFL', {
                    id: params.row.id
                  })
                  if (res.success) {
                    this.modal2 = true
                    this.modalTitle = '轨迹'
                    this.spinShow = false
                    this.viewLogRes = res.data
                  } else {
                    this.$Message.error(res.message)
                  }
                }
              }
            ]
            // if (params.row.orderStatus === '0') {
            //   actions.push(cancelB2B)
            // }
            if (params.row.expressNo && params.row.expressType !== 'sjtcps') {
              actions.push(logistics)
            }
            if (params.row.payStatus === '1' && params.row.orderStatus !== '4' && params.row.orderStatus !== '5') {
              if(params.row['orderType'] === 'traffic')
              actions.push(refund)
            }
            if (params.row.expressType && params.row.expressType === 'sjtcps') {
              actions.push(logisticsNew)
            }
            if (
              params.row['payStatus'] === '1' &&
              params.row['orderStatus'] !== '4' &&
              params.row['orderStatus'] !== '5'
            ) {
              // 已支付,未完结,未关闭的可以申请退单
              if (params.row['orderType'] === 'mdse') {
                if (params.row['checkStatus'] === '0') {
                  if (params.row['deliverType'] === '0') {
                    actions.push(recipient)
                  } else {
                    actions.push(deliver)
                  }
                }
              } else {
                if (
                  params.row['orderType'] !== 'traffic' &&
                  params.row['orderStatus'] !== '6' &&
                  params.row['orderStatus'] !== '7' &&
                  params.row['orderStatus'] !== '9' &&
                  params.row['extendParam'] &&
                  JSON.parse(params.row['extendParam']).productChannel === '-1'
                ) {
                  actions.push(verification)
                }
              }
            }
            if (
              params.row['payStatus'] === '1' &&
              params.row['orderStatus'] === '9'
            ) {
              actions.push(confirmOrder, cancelOrder)
            }
            if (params.row['payStatus'] === '1' && params.row['orderStatus'] === '3') {
              if (params.row['orderType'] === 'park' && params.row['externalOrderNo'] != null) {
                actions.push(toReSchedule)
              }
              if(params.row['orderType'] === 'traffic'){
                actions.push(toReSchedule)
              }
              if (params.row['orderType'] !== 'mdse') {
                actions.push(repeatSendMsg)
              }
            }
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      data: '',
      params: {
        page: 1,
        limit: 10,
        sort: 'createTime',
        order: 'desc'
      },
      url: '/order/orderInfo/grid',
      confirmBill: false,
      billInfo: {},
      billList: [],
      selection: [],
      billColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "产品名称",
          key: "orderInfo"
        },
        {
          title: "入住离店日期",
          key: "orderInfo",
          render: (h, params) => {
            return h("span", this.filter.formatDate(params.row.startDate, 'yyyy-MM-dd')+'-'+this.filter.formatDate(params.row.endDate, 'yyyy-MM-dd'));
          }
        },
        {
          title: "单价",
          key: "price"
        },
        {
          title: "总数量",
          key: "amount"
        }
      ],
      modal: false,
      modal2: false,
      formItem: {
        name: '',
        switch: true,
        picAddr: '',
        activityDetail: ''
      },
      formItem2: {},
      result: {},
      viewLogRes: {},
      checkOrderResult: {},
      deliverResult: {},
      modalTitle: '',
      checkOrderModal: false,
      checkOrderLoading: true,
      deliverLoading: true,
      deliverModal: false,
      logisticsModal: false,
      logisticsData: {},
      confirmContent: '',
      sucessMsg: '',
      logisticsResult: {},
      spinShow: true,
      refundConfirmContent: '',
      refundSucessMsg: '',
      footerShow: false,
      refundModal: false,
      refundRes: {},
      refundLoading: true,
      endorseModal: false,
      endorseResult: {},
      endorseLoading: true
    }
  },
  components: {
    searchForm,
    gridTable,
    confirm,
    orderInfo,
    viewLog,
    checkOrderPage,
    deliver,
    logistics,
    endorse,
    refund,
    formList
  },
  async created () {
    let res = await apiPost('/order/webapi/orderInfo/grid')
    if (res.status === 200) {
      this.params.supplierId = res.data.supplierId
      this.params.salesType = res.data.salesType
      if(this.$refs.formList)
      this.params = Object.assign(
        this.$refs.formList.searchForm,
        this.params
      );
      let obj = this.params;
      if(obj.orderStartTime instanceof Date){
        let data = obj.orderStartTime
        obj.orderStartTime = data.getFullYear() +
      "-" +
      (data.getMonth() + 1) +
      "-" +
      data.getDate();
      }
      if(obj.orderEndTime instanceof Date){
        let data = obj.orderEndTime
        obj.orderEndTime = data.getFullYear() +
      "-" +
      (data.getMonth() + 1) +
      "-" +
      data.getDate();
      }
      if(this.$refs.formList)
      this.$refs.formList.handleSubmit2()
    } else {
      this.$Message.error(res.message)
    }
    // this.$refs.gridTable.loadpage()
  },
  mounted () {
    // var _this = this
  },
  methods: {
    async billOpt (arg) {
      if(this.selection.length){
        let ids = [];
        this.selection.map(item=>{
          ids.push(item.orderDetailNo);
        });
        let res = await apiGet(
          '/order/orderInfo/'+arg,
          {
            orderNo: this.billInfo.orderNo,
            orderDetailNo: ids.join(','),
            busType: this.billInfo.busType
          }
        )
        if (res.status === 200 || res.success) {
          this.confirmBill = false;
          this.$Message.success("操作成功！");
          this.$refs.gridTable.loadpage()
          this.$Modal.remove();
        } else {
          this.$Message.error(res.message)
        }
      } else {
        this.$Message.warning("请选择一条数据！");
      }
    },
    changeSelection (selection) {
      this.selection = selection;
    },
    ok () {
      this.modal = false
    },
    async checkOrder () {
      let validate = this.$refs['checkOrderPage'].handleSubmit()
      if (validate) {
        let res = await apiPost(
          '/order/orderInfo/checkOrderByHandle',
          validate
        )
        if (res.success) {
          this.checkOrderModal = false
          this.$Message.info(res.message)
          this.$refs.gridTable.loadpage()
        } else {
          this.$Message.error(res.message)
          this.checkOrderLoading = false
        }
      } else {
        this.checkOrderLoading = false
        this.$nextTick(() => {
          this.checkOrderLoading = true
        })
      }
    },
    async delive () {
      let validate = this.$refs['delive'].handleSubmit()
      if (validate) {
        let res = await apiPost(
          '/order/orderInfo/checkOrderByHandleGoods',
          validate
        )
        if (res.success) {
          this.deliverModal = false
          this.$Message.info(res.message)
          this.$refs.gridTable.loadpage()
        } else {
          this.deliverLoading = false
          this.$nextTick(() => {
            this.deliverLoading = true
          })
          this.$Message.error(res.message)
        }
      } else {
        this.deliverLoading = false
        this.$nextTick(() => {
          this.deliverLoading = true
        })
      }
    },
    async endorseSubmit () {
      let validate = this.$refs['endorse'].handleSubmit()
      if (validate) {
        let res = await apiPost(
          '/order/orderEndorse/changeStartDate',
          validate
        )
        if(this.endorseResult.order&&this.endorseResult.order.orderType=="traffic"){
          res = await apiPost(
          '/order/webapi/orderInfo/reScheduleForTraffic',
          validate)
        }
        if (res.success) {
          this.endorseModal = false
          this.$Message.info(res.message)
          this.$refs.gridTable.loadpage()
        } else {
          this.$Message.error(res.message)
          this.endorseLoading = false
          this.$nextTick(() => {
            this.endorseLoading = true
          })
        }
      } else {
        this.endorseLoading = false
        this.$nextTick(() => {
          this.endorseLoading = true
        })
      }
    },
    // 高级筛选
    // 其中订单来源筛选无效果？都是wap？
    async searchSubmit () {
      this.formShow = true
      this.$store.state.list.params = Object.assign(
        this.$store.state.list.params,
        this.formItem2
      )
      await this.$store.dispatch('postApi')
    },
    endorseCancel () {
      this.$refs.endorse.rest()
    },
    deliveCancel () {
      this.$refs.delive.rest()
    },
    async refund () {
      let validate = this.$refs['refundPage'].handleSubmit()
      if (validate) {
        let res = await apiPost(this.otherUrl?this.otherUrl:'/order/orderRefund/doRefundB2B', validate)
        if (res.success) {
          this.refundModal = false
          this.$Message.info(res.message)
          this.$refs.gridTable.loadpage()
        } else {
          this.$Message.error(res.message)
          this.refundLoading = false
          this.$nextTick(() => {
            this.refundLoading = true
          })
        }
      } else {
        this.refundLoading = false
        this.$nextTick(() => {
          this.refundLoading = true
        })
      }
    },
    refundCancel () {
      this.$refs.refundPage.rest()
    },
    subConfirm (obj) {
      this.confirmContent = obj.confirmContent
      this.sucessMsg = obj.sucessMsg
      this.$refs.refundConfirmModel.confirm(obj.url, obj.par)
    },
    sucessDone () {
      this.refundModal = false
    },
    closeModal () {
      this.$refs.refundPage.rest()
      this.refundModal = false
    }
  }
}
</script>

<style scoped lang="scss">
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
