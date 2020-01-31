<template>
  <div class="traffic-bill">
    <Form :model="formItem" label-position="right" :label-width="110" ref="formItem" :rules="ruleForm">
      <FormItem label="线路名称：" prop="routeName">{{formItem.routeName}}</FormItem>
      <FormItem label="日期：" prop="occDate">{{formItem.occDate}}</FormItem>
      <FormItem label="起始站：" prop="beginSiteName">{{formItem.beginSiteName}}</FormItem>
      <FormItem label="终点站：" prop="endSiteName">{{formItem.endSiteName}}</FormItem>
      <FormItem label="班次：" prop="checkedShiteTime">{{formItem.checkedShiteTime}}</FormItem>
      <FormItem label="数量：" prop="quantity">{{formItem.quantity}}</FormItem>
      <FormItem label="合计：" prop="totalPriceDist">{{formItem.totalPriceDist}}</FormItem>
      <template v-for="(user, index) in formItem.realNames">
        <div :key="index">
        <FormItem :label="'乘客'+(index+1)+'姓名：'" :prop="'realNames.' + index + '.linkName'" :rules="{required: true, message: '请填写姓名', trigger: 'blur'}">
          <Input style="width:180px;" v-model="user.linkName" :maxlength="10" placeholder="请填写姓名"></Input>
        </FormItem>
        <FormItem :label="'乘客'+(index+1)+'身份证：'" :prop="'realNames.' + index + '.certificateNo'" :rules="[{required: true, message: '请填写身份证', trigger: 'blur'},{validator: common.validate.IdCodeValid,message: '请填写正确的身份证'}]">
          <Input style="width:180px;" v-model="user.certificateNo" placeholder="请填写身份证"></Input>
        </FormItem>
        </div>
      </template>
      <FormItem label="联系人：" prop="linkName">
        <Input style="width:180px;" v-model="formItem.linkName" :maxlength="10" placeholder="请填写联系人"></Input>
      </FormItem>
      <FormItem label="手机：" prop="linkMobile">
        <Input style="width:180px;" v-model="formItem.linkMobile" :maxlength="11" placeholder="请填写手机"></Input>
      </FormItem>
      <FormItem label="身份证：" prop="certificateNo">
        <Input style="width:180px;" v-model="formItem.certificateNo" placeholder="请填写身份证"></Input>
      </FormItem>
      <FormItem label="备注：" prop="remark">
        <Input style="min-width:180px" :maxlength="60" v-model="formItem.remark" placeholder="请填写备注"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" size="large" @click="saveBill">保存</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { apiPostJson, apiGet } from "@/fetch/api";
export default {
  data() {
    return {
      formItem: {
        beginSiteCode: '',
        beginSiteName: '',
        certificateNo: '',
        checkedShiteTime: '',
        endSiteCode: '',
        endSiteName: '',
        linkMobile: '',
        linkName: '',
        modelType: '',
        occDate: '',
        quantity: '',
        remark: '',
        routeCode: '',
        routeName: '',
        shiteCode: '',
        totalPriceDist: '',
        realNames: [{
          linkName: '',
          certificateNo: '',
        }],
      },
      ruleForm: {
        linkName: [{ required: true, message: "请填写联系人", trigger: "blur" }],
        linkMobile: [
          {
            validator: this.common.validate.phone,
            required: true,
            message: "请填写正确的手机",
            trigger: "blur"
          }
        ],
      }
    };
  },
  mounted() {
    let formItem = localStorage.getItem('trafficBill')?JSON.parse(localStorage.getItem('trafficBill')):{};
    this.formItem.accountType= 1
    this.formItem.beginSiteCode= formItem.beginSiteCode
    this.formItem.beginSiteName= formItem.beginSiteName
    this.formItem.certificateNo= formItem.certificateNo
    this.formItem.checkedShiteTime= formItem.checkedShiteTime
    this.formItem.endSiteCode= formItem.endSiteCode
    this.formItem.endSiteName= formItem.endSiteName
    this.formItem.linkMobile= formItem.linkMobile
    this.formItem.linkName= formItem.linkName
    this.formItem.modelType= "traffic"
    this.formItem.occDate= formItem.occDate
    this.formItem.quantity= formItem.quantity
    this.formItem.remark= formItem.remark
    this.formItem.routeCode= formItem.routeCode
    this.formItem.routeName= formItem.routeName
    this.formItem.shiteCode= formItem.shiteCode
    this.formItem.totalPriceDist= formItem.totalPriceDist
    this.formItem.wayType= 5
    while (this.formItem.realNames.length<this.formItem.quantity) {
      this.formItem.realNames.push({
        linkName: '',
        certificateNo: '',
      });
    }
  },
  methods: {
    saveBill() {
      this.$refs.formItem.validate((vaild)=>{
        if(vaild){
          let formItem = {
            accountType: 1,
            beginSiteCode: this.formItem.beginSiteCode,
            beginSiteName: this.formItem.beginSiteName,
            certificateNo: this.formItem.certificateNo,
            checkedShiteTime: this.formItem.checkedShiteTime,
            endSiteCode: this.formItem.endSiteCode,
            endSiteName: this.formItem.endSiteName,
            linkMobile: this.formItem.linkMobile,
            linkName: this.formItem.linkName,
            realNames: this.formItem.realNames,
            modelType: "traffic",
            occDate: this.formItem.occDate,
            quantity: this.formItem.quantity,
            remark: this.formItem.remark,
            routeCode: this.formItem.routeCode,
            routeName: this.formItem.routeName,
            shiteCode: this.formItem.shiteCode,
            totalPriceDist: this.formItem.totalPriceDist,
            wayType: 5,
          }
          apiPostJson('/distmarket/webApi/distMarketTrafficOrder/saveScenic', formItem).then(res => {
            if (res.status == 200 || res.success) {
              this.$router.push({
                path: "/topay",
                query: { orderCode: res.orderCode }
              });
            } else {
              this.$Message.warning(res.message);
            }
          });
        }else{
        }
      });
    },
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


