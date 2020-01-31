<template>
  <div class="newtable">
    <h4 class="table-title">订单信息</h4>
    <table class="table"
           border
           width=100%>
      <tr>
        <td class="title">订单编号</td>
        <td><span class="fontweight">{{orderInfo.orderNo}}</span></td>
        <td class="title">联系人</td>
        <td><span class="fontweight">{{orderInfo.linkName || '无'}}</span></td>
        <td class="title">下单时间</td>
        <td><span class="fontweight">{{orderInfo.createTime | formatDate('yyyy-MM-dd')}}</span></td>
      </tr>
    </table>
    <h4 class="table-title ptop">订单详情</h4>
    <Table border
           :columns="columns"
           :data="details"></Table>
    <Form :model="refundForm"
          :label-width="110"
          style="margin-top:20px;"
          :rules="ruleValidate"
          ref="refundForm"
          inline
          v-if="orderInfo.orderType !== 'mdse'">
      <FormItem label="退单金额："
                prop="refundSum">
        <Input v-model="refundForm.refundSum"
               readonly></Input>
      </FormItem>
      <FormItem label="手续费：">
        <Input v-model="refundForm.refundRee"
               readonly
               style="width:120px;"></Input>
        <span style="color:red;font-size:10px">{{text}}</span>
      </FormItem>
    </Form>
    <!-- 退款并发货 -->
    <Modal v-model="deliveryRefundMold"
           title="退款发货"
           @on-ok="deliveryRefundSubmit"
           class="deliveryRefund"
           :loading="loading">
      <Form :model="deliveryRefundForm"
            :label-width="120"
            :rules="deliveryRefundRuleValidate"
            ref="deliveryRefundFormValidate">
        <FormItem label="卖家地址：">
          {{mechantAddr || '无'}}
        </FormItem>
        <FormItem label="物流类型："
                  prop="express">
          <Select v-model="deliveryRefundForm.express"
                  style="width:200px;"
                  label-in-value
                  transfer
                  @on-change="change">
            <Option v-for="item in expressList"
                    :key="item.key"
                    :value="item.key">{{item.value}}</Option>
          </Select>
        </FormItem>
        <FormItem label="物流单号："
                  prop="expressNo">
          <Input v-model="deliveryRefundForm.expressNo"
                 placeholder="请填写物流单号..."></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import realName from './realName'
import { apiPost, apiGet } from '@/fetch/api'
export default {
  data () {
    return {
      orderInfo: '',
      columns: [],
      details: [],
      ids: [],
      nums: [],
      text: '',
      refundForm: {
        refundSum: '',
        refundRee: ''
      },
      ruleValidate: {
        refundSum: { required: true, type: 'number', message: '退单金额不能为空！' }
      },
      deliveryRefundRuleValidate: {
        express: [{
          required: true, message: '请选择物流类型', trigger: 'change'
        }],
        expressNo: [
          { required: true, message: '请填写物流单号', trigger: 'blur' }
        ]
      },
      defaultColumns: [
        {
          title: '产品名称',
          render: (h, params) => {
            let text = params.row.orderInfo
            if (params.row.orderType === 'route' && params.row.detailType === '0') {
              text += '【成人票】'
            } else if (params.row.orderType === 'route' && params.row.detailType === '1') {
              text += '【儿童票】'
            }
            return h('span', text)
          }
        },
        {
          title: '单价',
          align: 'center',
          width: 85,
          key: 'price'
        },
        {
          title: '总数',
          align: 'center',
          width: 80,
          key: 'amount'
        },
        {
          title: '已消费数',
          align: 'center',
          width: 85,
          key: 'checkAmount'
        },
        {
          title: '已退数',
          align: 'center',
          width: 80,
          key: 'refundAmount'
        },
        {
          title: '可退数',
          align: 'center',
          width: 80,
          key: 'leftAmount'
        },
        {
          title: '退单数',
          width: 140,
          align: 'center',
          render: (h, params) => {
            return h('InputNumber', {
              props: {
                min: 0,
                max: params.row.leftAmount,
                value: params.row.nums,
                readonly: !params.row['_disableExpand']
              },
              on: {
                'on-change': (event) => {
                  // console.log(params.row)
                  this.details[params.row._index].nums = event
                  this.getRefundMoney(params)
                }
              }
            })
          }
        }
      ],
      mdseColumns: [
        {
          title: '产品名称',
          render: (h, params) => {
            let text = params.row.orderInfo ? params.row.orderInfo : ''
            if (params.row.mdseDetail) {
              text += '  规格信息：' + params.row.mdseDetail.specParam
            }
            return h('span', text)
          }
        },
        {
          title: '总数量',
          align: 'center',
          width: 80,
          key: 'amount'
        },
        {
          title: '已消费',
          align: 'center',
          width: 80,
          key: 'checkAmount'
        },
        {
          title: '已退',
          align: 'center',
          width: 80,
          key: 'refundAmount'
        },
        {
          title: '可退',
          align: 'center',
          width: 80,
          key: 'leftAmount'
        },
        {
          title: '操作',
          align: 'center',
          width: 180,
          key: 'action',
          render: (h, params) => {
            let actions = []
            const refund = {
              title: '仅退款',
              action: () => {
                this.$emit('confirm', {
                  confirmContent: '确认退款？',
                  sucessMsg: '退单申请成功！',
                  url: '/order/orderRefund/doRefundB2B',
                  par: { id: this.orderInfo.id, detailIds: params.row.id, nums: params.row.leftAmount, refundType: 0 }
                })
              }
            }
            const rejectedRefund = {
              title: '退货并退款',
              action: () => {
                this.$emit('confirm', {
                  confirmContent: '确认退货并退款？',
                  sucessMsg: '操作成功！',
                  url: '/order/orderRefund/doRefundB2B',
                  par: { id: this.orderInfo.id, detailIds: params.row.id, nums: params.row.leftAmount, refundType: 1 }
                })
              }
            }
            const deliveryRefund = {
              title: '退款发货',
              action: async () => {
                this.deliveryRefundMold = true
                let res = await apiGet('/order/webapi/orderRefund/toBackGoods', { id: params.row.id })
                this.mechantAddr = res.data.mechantAddr
                this.expressList = res.data.expressType
                this.deliveryRefundForm.id = res.data.detail.id
              }
            }
            if (params.row.refundStatus && params.row.refundStatus === '0') {
              actions.push(refund)
              if (params.row.expressNo) {
                actions.push(rejectedRefund)
              }
            } else if (params.row.refundStatus && params.row.refundStatus === '1' && params.row.refundAudit === '1' && params.row.refundWay === '1' && !params.row.expressNoBack) {
              actions.push(deliveryRefund)
            }
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      confirmContent: '',
      sucessMsg: '',
      deliveryRefundMold: false,
      mechantAddr: '',
      deliveryRefundForm: {
        id: ''
      },
      expressList: [],
      loading: true,
      orderDetailModel: []
    }
  },
  props: ['result'],
  watch: {
    result () {
      let expand =
        {
          title: '实名制',
          width: 80,
          type: 'expand',
          render: (h, params) => {
            if (params.row.orderDetailModels && params.row.orderDetailModels.length > 0) {
              return h(realName, {
                props: {
                  row: params.row.orderDetailModels,
                  multiple: true
                },
                on: {
                  checks: (items) => {
                    params.row.nums = items.length
                    this.details[params.row._index].nums = items.length
                    this.orderDetailModel[params.row._index] = items
                    this.getRefundMoney(params)
                  }
                }
              })
            }
          }
        }
      this.columns.forEach((el, num) => {
        if (el.type === 'expand') {
          this.defaultColumns.splice(num, 1)
        }
      })
      let flag = false
      this.orderDetailModel = []
      this.result.details.forEach((element, index) => {
        if (element.orderDetailModels && element.orderDetailModels.length) {
          this.result.details[index]['_disableExpand'] = false
          flag = true
        } else {
          this.result.details[index]['_disableExpand'] = true
        }
        element.nums = 0
      })
      if (flag) {
        this.defaultColumns.push(expand)
      }
      this.orderInfo = this.result.orderInfo
      this.details = this.result.details
      if (this.result.orderInfo.orderType !== 'mdse') {
        this.columns = this.defaultColumns
      } else {
        this.columns = this.mdseColumns
      }
      this.refundForm.refundSum = ''
      this.refundForm.refundRee = ''
      this.text = ''
    }
  },
  components: { realName },
  methods: {
    async getRefundMoney (params) {
      let flag = false
      this.ids = []
      this.nums = []
      this.details.forEach(element => {
        this.ids.push(element.id)
        this.nums.push(element.nums||0)
      })
      this.nums.forEach(element => {
        if (element !== 0) {
          flag = true
        }
      })
      if (flag) {
        let res = await apiPost((params.row.orderType=="traffic")?"/order/webapi/orderRefund/getTrafficRefundMoney":'/order/webapi/orderRefund/getRefundMoney', { 'detailIds': this.ids.join(','), 'nums': this.nums.join(','), 'id': this.orderInfo.id })
        if (res.status === 200) {
          this.refundForm.refundSum = res.data.finalZyRefundSum
          this.refundForm.refundRee = res.data.refundFee
          this.text = res.data.refundFeePercent?('退票手续费率为:' + res.data.refundFeePercent + '%，实际手续费以提交申请时为准'):("退费手续费为："+res.data.refundFee+"元");
        } else {
          this.$Message.error(res.message)
        }
      } else {
        this.refundForm.refundSum = ''
        this.refundForm.refundRee = ''
        this.text = ''
      }
    },
    handleSubmit () {
      let checkData = this.refundForm
      this.$refs['refundForm'].validate((valid) => {
        if (valid) {
          let detailModelsArray = []
          this.orderDetailModel.forEach(element => {
            if (element) {
              element.forEach(el => {
                detailModelsArray.push(el)
              })
            }
          })
          let detailModels = {}
          detailModelsArray.forEach(element => {
            detailModels[element.id] = element.orderDetailId
          })
          checkData = this.refundForm
          checkData.id = this.orderInfo.id
          checkData.detailIds = this.ids + ''
          checkData.nums = this.nums + ''
          checkData.orderDetailModelJson = JSON.stringify(detailModels)
        } else {
          checkData = false
        }
      })
      return checkData
    },
    deliveryRefundSubmit () {
      this.$refs['deliveryRefundFormValidate'].validate(async (valid) => {
        if (valid) {
          let res = await apiPost('/order/orderRefund/backGoodsB', this.deliveryRefundForm)
          if (res.success) {
            this.$Message.info(res.message)
            this.deliveryRefundMold = false
            this.$emit('closeModal')
          } else {
            this.$Message.error(res.message)
            this.loading = false
            this.$nextTick(() => {
              this.loading = true
            })
          }
        } else {
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
        }
      })
    },
    change (option) {
      this.deliveryRefundForm.expressType = option.label
    },
    uniqueArr (arr1, arr2) {
      arr1.push(...arr2)
      let arr3 = Array.from(new Set(arr1))
      return arr3
    },
    rest () {
      this.$refs['refundForm'].resetFields()
    }
  }
}
</script>
<style>
.deliveryRefund .ivu-modal-mask,
.deliveryRefund .ivu-modal-wrap {
  z-index: 1001;
}
</style>
