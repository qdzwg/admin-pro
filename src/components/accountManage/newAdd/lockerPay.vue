<template>
    <div class="orderPay">
        <Form :model="formItem" :label-width="120" label-position="right">
            <FormItem label="账户信息：">
                <span>{{formItem.buyerName}}备用金账户充值!请支付{{formItem.paySum}} 元</span>

            </FormItem>
            <FormItem label="金额：">
                <span>{{formItem.paySum}}</span>
            </FormItem>
            <FormItem label="选择支付方式：">
                <RadioGroup v-model="formItem.payType">
                    <Radio label="37" v-if="formItem.zybAlipayFlag=='T'">
                        <span><img src="./../../../assets/images/zfb.png" alt="" style="vertical-align: middle;"></span>
                    </Radio>
                    <Radio label="23" v-else>
                        <span><img src="./../../../assets/images/zfb.png" alt="" style="vertical-align: middle;"></span>
                    </Radio>
                    <Radio label="35">
                        <span><img src="./../../../assets/images/wx.png" alt="" style="vertical-align: middle;"></span>
                    </Radio>
                </RadioGroup>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="addPay">去支付</Button>
            </FormItem>
        </Form>

        <Modal width="550" v-model="preLookModal" :title="formItem.payType=='37'?'支付宝付款二维码':'微信支付二维码'">
            <div>
                <p style="fon-size:20px">请您及时付款，以便订单尽快处理！订单号：{{this.formItem.payOrderNo}}</p>
                <p>
                    应付金额:
                    <span style="color:red;font-size:20px">￥{{this.formItem.paySum}}</span>
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
import QRcode from "@xkeshi/vue-qrcode";
import { apiPost, apiGet } from "@/fetch/api";
export default {
  components: { qrcode: QRcode },
  data() {
    return {
      preLookModal: false,
      qrcodeUrl: "",
      formItem: {
        orderNo: "",
        amount: "",
        payType: ""
      },
      dataList: {
        userType: "",
        payOrderNo: "",
        accountId: "",
        paySum: "",
        payType: "",
        extendParamJson: {
          orderInfo: ""
        }
      }
    };
  },
  created() {
    if (this.$route.query.payOrder) {
      this.formItem = this.$route.query.payOrder;
    }
    if (this.$route.query.zybAlipayFlag) {
      this.formItem.zybAlipayFlag = this.$route.query.zybAlipayFlag;
    }
  },
  destroyed () {
    clearInterval(this.setIntervalTime)
  },
  methods: {
    removeTime() {
      clearInterval(this.setIntervalTime);
    },
    //支付轮询
    payStatus() {
      //轮询 支付是否完成
      this.setIntervalTime = setInterval(() => {
        apiGet(
          "/order/orderPay/checkPay?payOrderNo=" +
            this.formItem.payOrderNo +
            "&userType=B"
        ).then(res => {
          if (res.status == 200) {
            if (res.data && res.data.payStatus == "1") {
              this.removeTime();
              this.$router.push(
                "/lockerPaySucess?payOrderNo=" + this.formItem.payOrderNo
              );
            }
            
          } else {
            // console.log("支付状态查询失败!");
          }
        });
      }, 3000);
    },
    addPay() {
      apiPost("/order/orderPay/toPay", {
        userType: this.formItem.userType,
        payOrderNo: this.formItem.payOrderNo,
        accountId: this.formItem.accountId,
        paySum: this.formItem.paySum,
        payType: this.formItem.payType,
        extendParamJson: '{' + 'orderInfo:' + this.formItem.orderDescription + '}',
      }).then(res => {
        if (res.status == 200) {
          this.preLookModal = true;
          this.qrcodeUrl = res.data;
          this.payStatus();
          this.$Message.success('操作成功')
        }else{
            this.$Message.warning(res.message)
        }
      });
    },
    toPay(text) {
      apiGet("/order/orderPay/toPayPage", {
        payOrderNo: this.formItem.payOrderNo,
        payType: this.formItem.payType,
        redirectUrl: "",
        payData: text
      }).then(res => {
        if (res.status == 200) {
          // console.log(res);
        } else {
          this.$Message.warning(res.message);
        }
      });
    }
  }
};
</script>

