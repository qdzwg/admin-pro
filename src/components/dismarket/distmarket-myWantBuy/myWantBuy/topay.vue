<template>
  <div>
    <div class="form">
      <div style="display:none" v-html="htmlStr">{{htmlStr}}</div>
      <!-- <p
        style="font-size:16px;color:#f63"
        v-if="pageData.payOverTime"
      >请在{{pageData.payOverTime}}分钟之内支付，否则订单将取消</p> -->
      <div class="formLine"></div>
      <Form class="formItem" ref="formItem" label-position="right" :model="formItem">
        <FormItem label="订单号：">{{pageData.orderCode?pageData.orderCode:''}}</FormItem>
        <FormItem label="金额："><span>{{pageData.orderTotalPrice?('￥'+pageData.orderTotalPrice):''}}元</span></FormItem>
      </Form>
      <div class="formLine"></div>
      <Form class="formPayType" ref="formPayType" label-position="right" :model="formItem">
        <FormItem label="选择支付方式：">
          <!-- {{group}} -->
          <!-- <RadioGroup @change="test" v-model="payType" type="button" size="large">
            <Radio
              v-for="(item,index) in list"
              :key="index"
              style="margin-right:15PX"
              :label="item.name"
            >
              <span
                v-if="item.icon"
                class="xx-icon"
                style="font-size:26px;"
                :class="item.icon"
                :style="{color:item.color?item.color:''}"
              ></span>
              <span>{{item.label}}</span>
            </Radio>
          </RadioGroup> -->
          <div class="payType">
            <div
              class="payTypeItem"
              :class="{payTypeItemSel:item.name==payType}"
              v-for="(item,index) in list"
              @click='payTypeChange(item)'
              :key="index"
              style="margin-right:15PX"
              :label="item.name"
            >
              <div class="payTypeSel"></div>
              <span
                v-if="item.icon"
                class="xx-icon"
                style="font-size:26px;"
                :class="item.icon"
                :style="{color:item.color?item.color:''}"
              ></span>
              <span class="payTypeTxt">{{item.label}}</span>
            </div>
          </div>
        </FormItem>
      </Form>
      <div class="formLine lastLine"></div>
      <Button size="large" @click="topay" type="primary">{{button}}</Button>
    </div>
    <!-- 预览 -->
    <Modal width="550" v-model="preLookModal" :title="payType=='37'?'支付宝付款二维码':'微信支付二维码'">
      <div>
        <p style="fon-size:20px">请您及时付款，以便订单尽快处理！订单号：{{pageData.orderCode}}</p>
        <p>
          应付金额:
          <span style="color:red;font-size:20px">￥{{pageData.orderTotalPrice}}</span>
        </p>
        <!-- <p style="font-size:22px;color:red">{{payType=='37'?'请用手机支付宝扫描支付':'请用手机微信扫描支付'}}</p> -->
        <center id="target" style="margin-top:20px;">
          <qrcode :value="qrcodeUrl" :options="{ size: 200}"></qrcode>
        </center>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import confirm from "@/components/global/confirm";
import QRcode from "@xkeshi/vue-qrcode";
import { apiGet, apiPost } from "@/fetch/api";
export default {
  data() {
    return {
      htmlStr:'',
      button: '去付款',
      show: false,
      codeUrl: "", //二维码图片
      qrcodeUrl: "zz", //生成二维码地址
      copyUrl: "", //短链接
      copyLongUrl: "", //长链接
      preLookModal: false,
      pageData: {},
      payType: "6",
      list: [
        {
          label: "备用金",
          name: "6",
          icon: 'icon-qiandai',
          color: '#ffd853'
        }
      ],
      formItem: {
        name: "",
        phone: "",
        idNo: "",
        remark: "",
        locationCode: ""
      }
    };
  },
  mounted() {
    apiPost("/distmarket/myWantBuy/getPayInfo", {
      orderCode: this.$route.query.orderCode
    }).then(res => {
      // console.log(res);
      this.pageData = res.dMarketOrderInfoVo;
      apiGet("/admin/webApi/userPayInfo/getSuppPayConfig", {
        suppMainUid: this.pageData.supplyerId
      }).then(res => {
        if (res.status == 200) {
          if (res.data.aliPayConfig == "T") {
            this.list.push({
              label: "支付宝支付",
              name: "37",
              icon: "icon-big-Pay",
              color: "#2d8cf0"
            });
          }
          if (res.data.wxConfig == "T") {
            this.list.push({
              label: "微信支付",
              name: "35",
              icon: "icon-weixinzhifu",
              color: "#07b74f"
            });
          }
          if (res.data.ylPayConfig == "T") {
            //银联支付
            this.list.push({
              label: "银联支付",
              name: "40"
            });
          }
          if (this.pageData.payType == 100) {
            //银联支付
            this.list.push({
              label: "到付",
              name: "100"
            });
          }
        } else {
          this.$Message.warning(res.message);
        }
      });
      this.payStatus();
    });
  },
  components: {
    confirm,
    qrcode: QRcode
  },
  beforeRouteLeave(to,from,next) {
    clearTimeout(window.setIntervalTime);
    next();
  },
  beforeDestroy() {
    clearTimeout(window.setIntervalTime);
  },
  destroyed() {
    clearTimeout(window.setIntervalTime);
  },
  methods: {
    test() {
      // console.log(1);
    },
    payTypeChange(item) {
      this.payType = item.name;
      this.button = "去付款"
      if(item.name == 100){
        this.button = "确定"
      }
    },
    removeTime() {
      clearTimeout(window.setIntervalTime);
    },
    payStatus() {
      //轮询 支佛是否完成
      window.setIntervalTime = setTimeout(() => {
        this.removeTime();
        this.payStatus()
        apiGet(
          "/order/orderPay/checkPay?payOrderNo=" +
            this.pageData.payOrderCode +
            "&userType=B"
        ).then(res => {
          if (res.status == 200) {
            if (res.data && res.data.payStatus == "1") {
              this.removeTime();
              this.$router.push(
                "/pay-success?orderNo=" + this.$route.query.orderCode
              );
            }
            // if(res.data&&res.data.payStatus=='4'){
            //   this.removeTime();
            //   this.$router.push('/pay-fail?orderNo=' + this.$route.query.orderCode)
            // }
          }else{
            // console.log('支付状态查询失败!')
          }
        });
      }, 1000);
    },
    spotPay() {
      apiPost("/order/orderInfo/spotPayUpdateAfter", {
        payOrderNo: this.pageData.payOrderCode,
      }).then(res => {
        if (res.status == 200 || res.success) {
          this.removeTime();
          this.$router.push(
              "/pay-success?orderNo=" + this.$route.query.orderCode
            );
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    topay() {
      if (this.payType == "100") {
        this.spotPay();
        return
      }
      if (this.payType == "6") {
        this.pageData.accountId = this.pageData.vmAccountId;
      }
      if (this.payType == "40" || this.payType == "37" || this.payType == "35") {
        this.pageData.accountId = this.pageData.supplyerId;
      }
      apiPost("/order/orderPay/toPay", {
        userType: "B",
        payType: this.payType,
        payOrderNo: this.pageData.payOrderCode,
        accountId: this.pageData.accountId,
        vmAccountId: this.pageData.vmAccountId,
        supplyerId: this.pageData.supplyerId,
        orderNo: this.$route.query.orderCode,
        redirectUrl: "",
        paySum: this.pageData.orderTotalPrice,
        extendParamJson: "{" + "orderInfo:" + this.pageData.extendParamJson + "}",
        orderDescription: "test"
      }).then(res => {
        if (res.status == 200 || res.success) {
          if (this.payType == "6") {
            //备用金
            this.$Message.success("支付成功!");
            this.removeTime();
            this.$router.push(
              "/pay-success?orderNo=" + this.$route.query.orderCode
            );
          } else if (this.payType == "37") {
            //支付宝
            this.preLookModal = true;
            this.qrcodeUrl = res.data;
            //  this.$Message.success("支付成功!");
            // this.payStatus();
          } else if (this.payType == "35") {
            //微信
            this.preLookModal = true;
            this.qrcodeUrl = res.data;
            // this.payStatus();
          } else if (this.payType == "40") {
            //银联支付
            // this.preLookModal = true;
            // this.qrcodeUrl = res.data;
            this.htmlStr = res.data;
            this.$nextTick(() => {
              document.all.pay_form.target = '_blank';
              document.all.pay_form.submit();
            })
          }
        } else {
          this.$Message.warning(res.message);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.form {
  text-align: center;
  width: 100%;
  color: #413838;
  .formLine {
    border-top: 1px solid #e9eaec;
  }
  .lastLine {
    margin-bottom: 30px;
  }
  .formItem {
    text-align: left;
    display: inline-block;
    min-width: 830px;
    width: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: #fbfcff;
    .ivu-form-item {
      margin: 0px;
      span {
        color: #fc4150;
      }
    }
  }
  .formPayType {
    text-align: left;
    display: inline-block;
    min-width: 830px;
    width: 100%;
    .ivu-form-item {
      padding-top: 30px;
      padding-bottom: 30px;
      margin: 0px;
      .payType {
        .payTypeItem {
          cursor: pointer;
          display: inline-block;
          vertical-align: middle;
          line-height: 52px;
          position: relative;
          text-align: center;
          border: 1px solid #ede8ee;
          width: 140px;
          height: 56px;
          margin-right: 30px;
          &:hover {
            border-color: #f05b47;
          }
          span {
            font-size: 16px;
            display: inline-block;
            vertical-align: middle;
          }
          .payTypeTxt {
            margin-left: 10px;
          }
        }
        .payTypeItemSel {
          border: 2px solid #f05b47;
          .payTypeSel {
            position: absolute;
            right: -2px;
            bottom: -2px;
            width: 23px;
            height: 23px;
            background-image: url('../../../../assets/images/guide.png');
            background-repeat: no-repeat;
            background-size: 100%;
          }
        }
      }
    }
  }
}
</style>