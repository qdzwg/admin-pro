<template>
  <div class="pay-success">
    <div class="paySuccessTxt">订单支付失败！</div>
    <div class="paySuccessImg">
      <div class="paySuccessImgWrap">
        <div class="paySuccessBorderTop">
          <img src="../../../../assets/images/fail.png" alt="">
        </div>
        <div class="paySuccessBorderBottom"></div>
      </div>
    </div>
    <Form class="form" :model="formItem" label-position="right" :label-width="64" ref="formItem">
      <FormItem label="失败的原因">系统繁忙，请稍后再试。</FormItem>
      <FormItem><a href="javascript:void(0);" @click='back'>返回</a></FormItem>
    </Form>
  </div>
</template>
<script>
import { apiPost } from "@/fetch/api";
export default {
  data() {
    return {
      orderNo: "",
      time: 10,
      formItem: {}
    };
  },
  mounted() {
    this.orderNo = this.$route.query.orderNo;
    // this.setTimeoutTime()
    apiPost("/distmarket/myWantBuy/getPayInfo", {
      orderCode: this.$route.query.orderNo
    }).then(res => {
      // console.log(res);
      this.formItem = res.dMarketOrderInfoVo;
    });
  },
  methods: {
    back() {
      this.$router.push("/myWantBuy");
    },
    setTimeoutTime() {
      setTimeout(() => {
        this.time = this.time - 1;
        if (this.time < 0) {
          this.$router.push("/myWantBuy");
        }else{
            this.setTimeoutTime()
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


