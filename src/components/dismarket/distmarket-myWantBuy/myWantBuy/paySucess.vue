<template>
    <div class="pay-success">
        <div class="paySuccessTxt">{{this.formItem.payType==100?"恭喜您，订单提交成功！":"恭喜您，支付成功啦！"}}</div>
        <div class="paySuccessImg">
            <div class="paySuccessImgWrap">
                <div class="paySuccessBorderTop">
                    <img src="../../../../assets/images/success.png" alt="">
                </div>
                <div class="paySuccessBorderBottom"></div>
            </div>
        </div>
        <Form class="form" :model="formItem" label-position="right" :label-width="90" ref="formItem">
            <FormItem label="订单编号">{{formItem.orderCode?formItem.orderCode:formItem.orderNo}}</FormItem>
            <FormItem label="本单合计" class="orderTotalPrice">￥{{formItem.orderTotalPrice?formItem.orderTotalPrice:formItem.opValue}}元</FormItem>
            <FormItem>
                <a href="javascript:void(0);" @click='back'>返回</a>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import { apiPost, apiGet } from "@/fetch/api";
export default {
  data() {
    return {
      orderNo: "",
      time: 10,
      formItem: {}
    };
  },
  mounted() {
    if (this.$route.query.payOrderNo) {
      apiGet(
        "/order/webapi/capitalAccountPay/recharge/payNotice?payOrderNo=" +
          this.$route.query.payOrderNo
      ).then(res => {
        this.formItem = res.data.capitalAccountDetail;
      });
    } else {
      this.orderNo = this.$route.query.orderNo;
      // this.setTimeoutTime()
      apiPost("/distmarket/myWantBuy/getPayInfo", {
        orderCode: this.$route.query.orderNo
      }).then(res => {
        // console.log(res);
        this.formItem = res.dMarketOrderInfoVo;
      });
    }
  },
  methods: {
    back() {
      if (this.$route.query.payOrderNo) {
        this.$router.push("/distributorCapitalManage");
      } else {
        this.$router.push("/myWantBuy");
      }
    },
    setTimeoutTime() {
      setTimeout(() => {
        this.time = this.time - 1;
        if (this.time < 0) {
          this.$router.push("/myWantBuy");
        } else {
          this.setTimeoutTime();
        }
      }, 1000);
    }
  }
};
</script>
<style lang="scss" scoped>
.pay-success {
  text-align: center;
  .paySuccessTxt {
    line-height: 162px;
    border-top: 1px solid #e9eaec;
    background-color: #f3f7fe;
    border-bottom: 1px solid #e9eaec;
    text-align: center;
    font-size: 24px;
    color: #1aad19;
  }
  .paySuccessImg {
    height: 84px;
    margin-top: -42px;
    text-align: center;
    .paySuccessImgWrap {
      display: inline-block;
      width: 84px;
      height: 84px;

      .paySuccessBorderTop {
        width: 100%;
        height: 42px;
        background-color: #f3f7fe;
        float: left;
        border-bottom: none;
        img {
          margin-top: 5px;
        }
      }
      .paySuccessBorderBottom {
        border: 1px solid #e9eaec;
        background-color: #f3f7fe;
        height: 84px;
        border-top: none;
        border-radius: 50%;
      }
    }
  }
  .form {
    width: 230px;
    text-align: left;
    color: #413838;
    display: inline-block;
    .orderTotalPrice {
      color: #fc4150;
    }
    a {
      display: inline-block;
      width: 84px;
      color: #413838;
      line-height: 30px;
      text-align: center;
      background-color: #f2f2f2;
      border: 1px solid #ccc;
    }
  }
}
</style>


