<template>
  <div class="newtable">
    <h4 class="table-title">订单信息</h4>
    <table class="table"
           border
           width=100%>
      <tr>
        <td class="title">订单编号</td>
        <td><span class="fontweight">{{orderInfo.orderNo}}</span></td>
        <td class="title">下单时间</td>
        <td><span class="fontweight">{{orderInfo.createTime}}</span></td>
        <td class="title">交易流水</td>
        <td><span class="fontweight">{{orderInfo.externalOrderNo}}</span></td>
      </tr>
      <tr>
        <td class="title">支付时间</td>
        <td><span class="fontweight">{{orderInfo.payTime}}</span></td>
        <td class="title">支付方式</td>
        <td><span class="fontweight">{{orderInfo.payType}}</span></td>
        <td class="title">订单来源</td>
        <td><span class="fontweight">{{orderInfo.wayType}}</span></td>
      </tr>
      <tr>
        <td class="title">订单业务</td>
        <td><span class="fontweight">{{orderInfo.orderType}}</span></td>
        <td class="title">消费时间</td>
        <td><span class="fontweight">{{checkTime ? filter.formatDate(checkTime, 'yyyy-MM-dd') : '未消费'}}</span></td>
        <td class="title">游玩时间</td>
        <td><span class="fontweight">{{orderInfo.startTime}}</span></td>
      </tr>
      <tr>
        <td class="title">数量</td>
        <td><span class="fontweight">{{orderInfo.amount}}</span></td>
        <td class="title">单价(￥)</td>
        <td><span class="fontweight">{{orderInfo.settleSum}}</span></td>
        <td class="title">实付金额(￥)</td>
        <td><span class="fontweight">{{orderInfo.orderSum}}</span></td>
      </tr>
      <tr>
        <td class="title">用户名</td>
        <td><span class="fontweight">{{orderInfo.linkName}}</span></td>
        <td class="title">优惠金额(￥)</td>
        <td><span class="fontweight">{{orderInfo.couponSum}}</span></td>
        <td class="title">结算金额(￥)</td>
        <td><span class="fontweight">{{orderInfo.paySum}}</span></td>
      </tr>
      <tr>
        <td class="title">产品名</td>
        <td><span class="fontweight">{{orderInfo.goodsName}}</span></td>
        <td class="title">产品别名</td>
        <td><span class="fontweight">{{orderInfo.nickName}}</span></td>
        <td class="title">订单内容</td>
        <td><span class="fontweight">{{orderInfo.orderInfo}}</span></td>
      </tr>
      <tr>
        <td class="title">第三方交易号</td>
        <td><span class="fontweight" v-if="gatewayTransNo">{{gatewayTransNo}}</span></td>
        <td class="title">应退款金额</td>
        <td><span class="fontweight">{{orderInfo.orderSum}}</span></td>
        <td class="title"></td>
        <td><span class="fontweight"></span></td>
      </tr>     
    </table>
    <div style="margin-top:15px;">确认退单后直接全额退款至付款账户，取消退单则同步订单已完成，不退款，确认需要退单吗？</div>
  </div>
</template>
<script>
export default {
  data () {
    return {   
        orderInfo: {},
        refund: {},
        gatewayTransNo:'',
        checkTime:''
    }
  },
  props: ['expRresult'],
  watch: {
    expRresult () {
        this.orderInfo = this.expRresult.orderInfo;
        this.orderInfo.payType = this.filter.payType(this.orderInfo.payType);
        this.orderInfo.wayType = this.filter.wayType(this.orderInfo.wayType);
        this.orderInfo.orderType = this.filter.orderType(this.orderInfo.orderType);
        this.gatewayTransNo = this.expRresult.gatewayTransNo;
        this.refund = this.expRresult.refund;
        this.checkTime = this.expOresult&&this.expOresult.checkTime?this.expOresult.checkTime:'';
    }
  },
  methods: {
    handleSubmit () {
      let expRefundData = {
        orderId: this.orderInfo?this.orderInfo.id:'',
        orderNo: this.orderInfo?this.orderInfo.orderNo:''
      }
      return expRefundData;
    }
  }
}
</script>
