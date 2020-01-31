<template>
  <div class="newtable">
    <h4 class="table-title">订单信息</h4>
    <div class="w-table-border ">
      <table class="table"
             border
             width=100%>
        <tr>
          <td class="title">订单编号</td>
          <td><span class="fontweight">{{orderInfo.orderNo}}</span></td>
          <td class="title">外部交易号</td>
          <td><span class="fontweight">{{orderInfo.outOrderNo || '无'}}</span></td>
          <td class="title">下单时间</td>
          <td><span class="fontweight">{{orderInfo.createTime}}</span></td>
        </tr>
        <tr>
          <td class="title">支付时间</td>
          <td><span class="fontweight">{{orderInfo.payTime || '无'}}</span></td>
          <td class="title">支付方式</td>
          <td><span class="fontweight">{{orderInfo.payType | payType}}</span></td>
          <td class="title">订单来源</td>
          <td><span class="fontweight">{{orderInfo.wayType | wayType}}</span></td>
        </tr>
        <tr>
          <td class="title">订单业务</td>
          <td><span class="fontweight">{{orderInfo.orderType | orderType}}</span></td>
          <td class="title">消费时间</td>
          <td><span class="fontweight">{{orderInfo.checkTime ? (orderInfo.checkTime | formatDate('yyyy-MM-dd')):"未消费"}}</span></td>
          <td class="title"
              v-if="orderInfo.orderType == 'eatery'">使用时间</td>
          <td class="title"
              v-else>游玩时间</td>
          <td><span class="fontweight"
                  v-if="orderInfo.orderType != 'hotel'&&orderInfo.orderType!='mdse'&&orderInfo.orderType!='eatery'">{{orderInfo.startTime | formatDate('yyyy-MM-dd')}}
              <span v-if="orderTicket && orderTicket.fsStartTime && orderTicket.fsStartTime!=''">{{orderTicket.fsStartTime}} - {{orderTicket.fsEndTime}}</span>
            </span>
            <span v-else>无</span></td>
        </tr>
        <tr>
          <td class="title">用户名</td>
          <td><span class="fontweight">{{orderInfo.buyerName || '无'}}</span></td>
          <td class="title">数量</td>
          <td><span class="fontweight">{{orderInfo.amount}}</span></td>
          <td class="title">单价(￥)</td>
          <td><span class="fontweight">{{orderInfo.orderType=='pms_hotel'?orderRefund.refundPrice:orderInfo.price}}</span></td>
        </tr>
        <tr>
          <td class="title">总金额</td>
          <td><span class="fontweight">{{orderInfo.paySum}}<span v-if="orderInfo.postage"
                    style="margin-left:5px;">(含邮费：{{orderInfo.postage}})</span></span></td>
          <td class="title">优惠金额(￥)</td>
          <td><span class="fontweight">{{orderInfo.couponSum || 0}}</span></td>
          <td class="title">结算金额(￥)</td>
          <td><span class="fontweight"
                  v-if="orderInfo.salesType&&orderInfo.salesType == '1'">{{orderInfo.settleSum}}</span></td>
        </tr>
        <!-- 酒店特殊字段 -->
        <template v-if="orderInfo.orderType == 'hotel'">
          <tr>
            <td class="title">入住时间</td>
            <td><span class="fontweight">{{orderInfo.startTime | formatDate('yyyy-MM-dd')}}</span></td>
            <td class="title">离店时间</td>
            <td colspan="3"><span class="fontweight">{{orderInfo.endTime | formatDate('yyyy-MM-dd')}}</span></td>
          </tr>
        </template>
        <!-- 商品特殊字段 -->
        <template v-if="orderInfo.orderType == 'shop'">
          <tr>
            <td class="title">收货地址</td>
            <td colspan="5"><span class="fontweight">{{orderInfo.linkAddr || '无'}}</span></td>
          </tr>
        </template>
        <tr>
          <td class="title">订单内容</td>
          <td><span class="fontweight">{{orderInfo.orderInfo}}</span></td>
          <td class="title">备注</td>
          <td colspan="3"><span class="fontweight">{{orderInfo.remark || '无'}}</span></td>
        </tr>
        <template v-if="orderInfo.orderType == 'theater_ticket'">
          <tr>
            <td class="title">演出场次</td>
            <td><span class="fontweight">{{threatJson.placeAndTime}}</span></td>
            <td class="title">票型</td>
            <td><span class="fontweight">{{threatJson.ticketName}}</span></td>
            <td class="title">座位号</td>
            <td><span class="fontweight">{{threatJson.seats}}</span></td>
          </tr>
        </template>
      </table>
      <h4 class="table-title ptop">退单明细</h4>
      <Table border
             size="small"             
             :columns="orderType=='family'?refundColumns2:refundColumns"
             :data="refundDetail"></Table>
      <table class="table"
             border
             width=100%
             v-if="orderRefund&&orderRefund.rejectReason"
             style="margin-top:10px;">
        <tr>
          <td class="title">驳回理由</td>
          <td><span class="fontweight">{{orderRefund.rejectReason}}</span></td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      orderInfo: '',
      orderTicket: '',
      orderRefund: '',
      refundStatusMap: '',
      threatJson: '',
      refundDetail: [],
      refundColumns: [
        {
          title: '产品名称',
          align: 'center',
          width: 210,
          render: (h, params) => {
            let text = params.row.orderInfo
            if (this.orderInfoMain && this.orderInfoMain.specParam) {
              text += '  规格信息:' + this.orderInfoMain.specParam
            } else if (params.row.orderType === 'route' && params.row.detailType === '0') {
              text += '【成人票】'
            } else if (params.row.orderType === 'route' && params.row.detailType === '1') {
              text += '【儿童票】'
            } else {
              if (params.row.mdseDetail) {
                text += '  规格信息:' + params.row.mdseDetail.specParam
              }
            }
            return h('span', text)
          }
        },
        {
          title: '游玩日期',
          align: 'center',
          width: 180,
          render: (h, params) => {
            let text = ''
            switch (params.row.orderType) {
              case 'mdse':
              case 'eatery':
                text = ''
                break
              case 'hotel':
                text = '入住时间：' + this.filter.formatDate(params.row.startDate, 'yyyy-MM-dd') + '<br>' + '离店时间：' + this.filter.formatDate(params.row.endDate, 'yyyy-MM-dd')
                break
              default:
                text = this.filter.formatDate(params.row.startDate, 'yyyy-MM-dd')
            }
            return h('span', {
              domProps: {
                innerHTML: text
              }
            })
          }
        },
        {
          title: '订单数量',
          align: 'center',
          width: 85,
          key: 'amount'
        },
        {
          title: '单价',
          align: 'center',
          width: 80,
          render: (h, params) => {
            return h('span', params.row.refundPrice)
          }
        },
        {
          title: '申请退单数量',
          align: 'center',
          width: 115,
          key: 'refundNum'
        },
        {
          title: '退单状态',
          align: 'center',
          width: 85,
          render: (h, params) => {
            return h('span', this.refundStatusMap[this.orderRefund.status])
          }
        },
        {
          title: '扣费百分比',
          align: 'center',
          width: 105,
          key: 'refundFeePercent',
          render: (h, params) => {
            return h('span', params.row.refundFeePercent || 0)
          }
        },
        {
          title: '审核人',
          align: 'center',
          width: 105,
          render: (h, params) => {
            return h('span', this.orderRefund.auditLoginName)
          }
        }
      ],
      refundColumns2: [
        {
          title: '产品名称',
          align: 'center',
          width: 210,
          render: (h, params) => {
            let text = params.row.orderInfo
            if (this.orderInfoMain && this.orderInfoMain.specParam) {
              text += '  规格信息:' + this.orderInfoMain.specParam
            } else if (params.row.orderType === 'route' && params.row.detailType === '0') {
              text += '【成人票】'
            } else if (params.row.orderType === 'route' && params.row.detailType === '1') {
              text += '【儿童票】'
            } else {
              if (params.row.mdseDetail) {
                text += '  规格信息:' + params.row.mdseDetail.specParam
              }
            }
            return h('span', text)
          }
        },
        {
          title: '游玩日期',
          align: 'center',
          width: 180,
          render: (h, params) => {
            let text = ''
            switch (params.row.orderType) {
              case 'mdse':
              case 'eatery':
                text = ''
                break
              case 'hotel':
                text = '入住时间：' + this.filter.formatDate(params.row.startDate, 'yyyy-MM-dd') + '<br>' + '离店时间：' + this.filter.formatDate(params.row.endDate, 'yyyy-MM-dd')
                break
              default:
                text = this.filter.formatDate(params.row.startDate, 'yyyy-MM-dd')
            }
            return h('span', {
              domProps: {
                innerHTML: text
              }
            })
          }
        },
        {
          title: '订单数量',
          align: 'center',
          width: 85,
          key: 'amount'
        },
        {
          title: '单价',
          align: 'center',
          width: 80,
          render: (h, params) => {
            return h('span', params.row.refundPrice)
          }
        },
        {
          title: '申请退单数量',
          align: 'center',
          width: 115,
          key: 'refundNum'
        },
        {
          title: '退单状态',
          align: 'center',
          width: 85,
          render: (h, params) => {
            return h('span', this.refundStatusMap[params.row.refundStatus])
          }
        },
        {
          // title: '扣费百分比',
          title: '扣费金额',
          align: 'center',
          width: 105,
          key: 'refundFee',
          render: (h, params) => {
            return h('span', params.row.refundFee || 0)
          }
        },
        {
          title: '审核人',
          align: 'center',
          width: 105,
          render: (h, params) => {
            return h('span', this.orderRefund.auditLoginName)
          }
        }
      ]
    }
  },
  props: ['result', 'orderType'],
  watch: {
    result () {
      this.orderInfo = this.result.orderInfo
      this.orderRefund = this.result.orderRefund
      this.refundStatusMap = this.result.refundStatusMap
      this.refundDetail = this.result.list
      this.threatJson = this.result.threatJson
      let refundFlag = -1
      this.refundColumns.forEach((el, index) => {
        if (el.key === 'refundSeats') {
          // this.refundColumns.splice(index, 1)
          refundFlag = index
        }
      })
      if (this.result.orderInfo.orderType === 'theater_ticket' && refundFlag === -1) {
        this.refundColumns.push(
          {
            title: '退单座位号',
            align: 'center',
            width: 115,
            key: 'refundSeats'
          }
        )
      }
      if (this.result.orderInfo.orderType !== 'theater_ticket' && refundFlag !== -1) {
        this.refundColumns.splice(refundFlag, 1)
      }
    }
  }
}
</script>
