<template>
    <div class="account">
        <div class="contents" v-if="(formPasswordShow==false)&&(type=='edit'||gatheringShow=='edit')">
           <div style="margin:15px 0;"><img  src="./../../../../assets/images/zfb.png" alt=""> <span class="span">支付宝(旧方式,即将下架)</span> 
           <Button type="primary" @click="clickMode()">设置</Button></div>
           <div style="margin:15px 0;"><img  src="./../../../../assets/images/wx.png" alt=""> <span class="span">微  信</span>  
           <Button type="primary" @click="clickMode2()">设置</Button></div>
           <div style="margin:15px 0;"><img  src="./../../../../assets/images/zfb.png" alt=""> <span class="span">支付宝</span>   
           <Button type="primary" @click="clickMode3()">设置</Button></div>  
           <!-- <div style="margin:15px 0;"><img  src="./../../../../assets/images/wx.png" alt=""> <span class="span">微信小程序</span>  
           <Button type="primary" @click="clickMode4()">设置</Button></div>  -->
           <div style="margin:15px 0;"><img  src="./../../../../assets/images/icbc.png" alt=""> <span class="span">银联</span>  
           <Button type="primary" @click="clickMode5()">设置</Button></div>
        </div>

        <template v-if="formPasswordShow">
            <Form :model="formPasswordItem" label-position="right" :label-width="180" ref="formPasswordItem" :rules="rulePassWord">
                <FormItem label="请输入主账户密码：" prop="passWord">
                    <Input type="password" v-model="formPasswordItem.passWord" style="width:30%;"></Input>
                    <Button type="primary" @click="submit">提交</Button>
                </FormItem>
            </Form>
        </template>
         <!-- 弹出支付宝1层 -->
    <template v-if="gatheringShow=='zfb'"  >
        <Form :model="formItem" label-position="right" :label-width="180" ref="formItem" :rules="ruleForm" style="padding:0 50px;">
          <FormItem label="支付宝-appid" prop="appid">
            <Input v-model="formItem.appid" ></Input>
            <p>
                帮助信息</br>
                登录支付宝商家平台，请点击https://www.alipay.com/ 点击左侧信息栏“账户管理”→下拉至“商户信息管理”→点击“查看PID\KEY”→进入新页面
                 点击最上方“开发者中心—生活号”菜单→“生活号应用”下查看APPID—— 如未开通生活号请点击右方“创建应用”创建后复制APPID即可
            </p>
          </FormItem>
          <FormItem label="应用私钥-privateKey" prop="privateKey">
           <Input v-model="formItem.privateKey" ></Input>
           <p>
               帮助信息</br>
                “应用公钥”与之对应的“应用私钥” 首次设置需下载“支付宝秘钥工具”按支付宝提示操作成功后复制“应用私钥2048”
           </p>
          </FormItem>
          <FormItem label="应用公钥-publicKey" prop="publicKey">
           <Input v-model="formItem.publicKey" ></Input>
           <p>
               帮助信息</br>
                登录支付宝商家平台https://www.alipay.com/ 点击左侧信息栏“账户管理”→下拉至“商户信息管理”→点击“查看PID\KEY”→进入新页面
                 点击“开放平台秘钥”→“RSA(SHA1)密钥”右侧点击“设置应用公钥”“应用私钥” 首次设置需下载“支付宝秘钥工具”按支付宝提示操作成功
                 后复制“应用公钥2048”
           </p>
          </FormItem>
          <FormItem label="合作身份者ID-partner" prop="partner">
            <Input v-model="formItem.partner" ></Input>
          </FormItem>
          <FormItem label="密钥-md5Key" prop="md5Key">
            <Input v-model="formItem.md5Key" ></Input>
          </FormItem>
          <FormItem label="支付宝账号-sellerId" prop="sellerId">
            <Input v-model="formItem.sellerId" ></Input>
          </FormItem>
          <FormItem label="支付宝公钥-aliPublicKey" prop="aliPublicKey">
            <Input v-model="formItem.aliPublicKey" ></Input>
            <p>
                帮助信息</br>
                登录支付宝商家平台https://www.alipay.com/ 点击左侧信息栏“账户管理”→下拉至“商户信息管理”→点击“查看PID\KEY”→进入新页面
                点击“开放平台秘钥”查看“RSA2(SHA256)密钥”→“支付宝公钥”
            </p>
          </FormItem>
          <FormItem>
              <Button type="primary" @click="ok">提交</Button>
              <Button @click="goBack">返回</Button>
          </FormItem>
        </Form>
    </template>


     <!-- 弹出微信层 -->
    <template v-if="gatheringShow=='wx'" >
        <Form :model="formItem2" label-position="right" :label-width="150" ref="formItem2" :rules="ruleForm2" style="padding:0 50px;">          
                    
          <FormItem label="智游宝企业码" prop="corpCode">
            <Input v-model="formItem2.corpCode" ></Input>
          </FormItem>
          <FormItem label="智游宝企业秘钥" prop="zybKey">
            <Input v-model="formItem2.zybKey" ></Input>
          </FormItem>
          <FormItem label="订单类型(orderType)" prop="orderType">
            <Input v-model="formItem2.orderType" ></Input>
          </FormItem>
          <FormItem>
              <Button type="primary" @click="ok">提交</Button>
              <Button @click="goBack">返回</Button>
          </FormItem>
        </Form>
    </template>


       <!-- 弹出支付宝2层 -->
    <template v-if="gatheringShow=='alipayzyb'"  >
        <Form :model="formItem3" label-position="right" :label-width="150" ref="formItem3" :rules="ruleForm3" style="padding:0 50px;">
          
          <FormItem label="合作身份者ID-partner" prop="partner">
            <Input v-model="formItem3.partner" ></Input>
          </FormItem>
          <FormItem label="支付宝当面付配置私钥" prop="zybKey">
            <Input v-model="formItem3.zybKey" ></Input>
          </FormItem>
          <FormItem label="订单类型(orderType)" prop="orderType">
            <Input v-model="formItem3.orderType" ></Input>
          </FormItem>            
         <FormItem>
              <Button type="primary" @click="ok">提交</Button>
              <Button @click="goBack">返回</Button>
          </FormItem>          
        </Form>
    </template>
<!-- 微信小程序 -->
    <template v-if="gatheringShow=='wxMin'">
        <Form :model="formItem4" label-position="right" :label-width="150" ref="formItem4" :rules="ruleForm4" style="padding:0 50px;">
            <FormItem label="应用ID(appid)" prop="appid">
                <Input v-model="formItem4.appid"></Input>
                <p>帮助信息
                    登录 https://mp.weixin.qq.com ，我们可以在菜单 “设置”-“开发设置” 看到小程序的 AppID 了 。</p>
            </FormItem>
            <FormItem label="应用密钥(appsecret)" prop="appsecret">
                <Input v-model="formItem4.appsecret"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="ok">提交</Button>
              <Button @click="goBack">返回</Button>
          </FormItem>
        </Form>
    </template>
        <!-- 银联 -->
       <template v-if="gatheringShow=='icbc'" >
        <Form :model="formItem5" label-position="right" :label-width="150" ref="formItem5" :rules="ruleForm5" style="padding:0 50px;">
          <FormItem label="银联商户号" prop="accountId">
            <Input v-model="formItem5.accountId"></Input>
          </FormItem>
          <FormItem label="支付密钥" prop="payPrivateKey">
            <Input v-model="formItem5.payPrivateKey"></Input>
          </FormItem>
          <FormItem label="订单类型（orderTpye）" prop="orderType">
            <Input v-model="formItem5.orderType"></Input>
          </FormItem>
          <FormItem>
              <Button type="primary" @click="ok">提交</Button>
              <Button @click="goBack">返回</Button>
          </FormItem>
        </Form>
    </template>
    </div>
</template>

<script>
import { apiGet,apiPost } from "@/fetch/api.js";
export default {
  data() {
    return {
      formPasswordShow: false,
      formPasswordItem: {
        passWord: ""
      },
      formItem: {
        appid: "",
        privateKey: "",
        publicKey: "",
        partner: "",
        md5Key: "",
        sellerId: "",
        aliPublicKey: ""
      },
      formItem2: {
        appid: "",
        appsecret: "",
        orderType: "",
        zybKey: "",
        corpCode: "",
        transAuth: "F"
      },
      formItem3: {
        partner: "",
        zybKey: "",
        orderType: "",
        textarea: "",
        appid:""
      },
      formItem4:{
          appid:'',
          appsecret:'',
      },
      formItem5:{
          accountId:'',
          payPrivateKey:'',
          orderType:'',
      },
      textShow: false,
      modalTitle: "",
      gatheringShow:"edit",
      type: "edit",
      loading: true,
      rulePassWord:{
          passWord:[
              {required: true, message: "请输入密码", trigger: "blur"}
          ]
      },
      ruleForm: {
        appid: [{ required: true, message: "请输入支付宝", trigger: "blur" }],
        privateKey: [
          { required: true, message: "请输入应用私钥", trigger: "blur" }
        ],
        publicKey: [
          { required: true, message: "请输入应用公钥", trigger: "blur" }
        ],
        partner: [
          { required: true, message: "请输入合作身份者ID", trigger: "blur" }
        ],
        md5Key: [{ required: true, message: "请输入密钥", trigger: "blur" }],
        sellerId: [
          { required: true, message: "请输入支付宝账号", trigger: "blur" }
        ],
        aliPublicKey: [
          { required: true, message: "请输入支付宝公钥", trigger: "blur" }
        ]
      },
      ruleForm2: {
        appid: [{ required: true, message: "请输入应用ID", trigger: "blur" }],
        appsecret: [
          { required: true, message: "请输入应用密钥", trigger: "blur" }
        ],
        orderType: [
          { required: true, message: "请输入订单类型", trigger: "blur" }
        ],
        zybKey: [
          { required: true, message: "请输入智游宝微信私钥", trigger: "blur" }
        ],
        corpCode: [
          { required: true, message: "请输入智游宝企业码", trigger: "blur" }
        ]
      },
      ruleForm3: {
        partner: [
          { required: true, message: "请输入合作身份者ID", trigger: "blur" }
        ],
        md5Key: [{ required: true, message: "请输入密钥", trigger: "blur" }],
        orderType: [
          { required: true, message: "请输入订单类型", trigger: "blur" }
        ]
      },
       ruleForm4: {
        appid: [
          { required: true, message: "请输入应用ID", trigger: "blur" }
        ],
        appsecret: [{ required: true, message: "请输入应用密钥", trigger: "blur" }],
      },
    ruleForm5: {
        accountId: [{ required: true, message: "请输入银联商户号", trigger: "blur" }],
        payPrivateKey: [
          { required: true, message: "请输入支付密钥", trigger: "blur" }
        ],
        orderType: [
          { required: true, message: "请输入订单类型", trigger: "blur" }
        ],
       
      },
    };
  },
  mounted() {
    // console.log(this.formItem2.transAuth)
  },
  methods: {
    ok() {
      let _this = this;

      let url = "",
        params = {},
        modal = "";
      if (_this.type === "zfb") {
        url = "/admin/userPayInfo/saveAliPay";
        params = this.formItem;
        modal='formItem'
      } else if (_this.type === "wx") {
        url = "/admin/userPayInfo/saveWxPay";
        params = this.formItem2;
         modal='formItem2'
      } else if (_this.type === "alipayzyb") {
        url = "/admin/userPayInfo/saveZybAlipay";
        params = this.formItem3;
        modal='formItem3'
      }else if(_this.type==='wxMin'){
        url = "/merchant/merchantPayInfo/saveWxMiniProgram";
        params = this.formItem4;
        modal='formItem4'
      }else if(_this.type==='icbc'){
        url = "/admin/userPayInfo/saveYlPayInfo";
        params = this.formItem5;
        modal='formItem5' 
      }
      this.common.formPost(this, {
        url,
        params: params,
        mold: "page",
        modalName:modal,
        callback(res) {
          if (res.success||res.status==200) {
              _this.$Message.success('操作成功')
            _this.formPasswordShow = false; 
            _this.type = "edit";
            _this.gatheringShow='edit'
          }else{
              _this.$Message.warning(res.message)
          }
        }
      });
    },
    submit(){
        let _this=this
        let url="/admin/userInfo/sensitiveCheck"
        this.common.formPost(this,
        {
         url,
         params:this.formPasswordItem,
         mold:'page',
         modalName:'formPasswordItem',
          callback(res) {
          if (res.success) {
              _this.formPasswordShow = false;
              if(_this.type=='zfb'){
                  _this.gatheringShow='zfb'
                  _this.zfbPay()
              }else if(_this.type=='wx'){
                  _this.gatheringShow='wx'
                  _this.wxPay()
              }else if(_this.type=='alipayzyb'){
                  _this.gatheringShow='alipayzyb'
                  _this.zybPay()
              }else if(_this.type=="wxMin"){
                  _this.gatheringShow='wxMin'
                  _this.wxMinPay()
              }else if(_this.type=='icbc'){
                  _this.gatheringShow='icbc'
                  _this.icbcPay()
              }
            _this.formPasswordItem.passWord=""
          }else{
              _this.$Message.warning(res.message)
          }
        }

        })
    },
    goBack(){
      this.formPasswordShow = false; 
      this.type = "edit";
      this.gatheringShow='edit'
    },
    clickMode() {
      this.formPasswordShow = true;
      this.type = "zfb";
      // apiPost('/merchant/merchantPayInfo/saveAliPay').then((res)=>{
      //         console.log(res)
      // })
    },
    zfbPay(){
        apiGet('/admin/userPayInfo/alipayFL').then(res=>{
            if(res.success){
                this.formItem=res.data
            }
        })
    },
    wxPay(){
        apiGet('/admin/userPayInfo/wxpayFL').then(res=>{
            if(res.success){
                this.formItem2=res.data
            }
        })
    },
    zybPay(){
        apiGet('/admin/userPayInfo/zybAlipayFL').then(res=>{
            if(res.success){
                this.formItem3=res.data
            }
        })
    },
    wxMinPay(){
        apiGet('/merchant/merchantPayInfo/wxMiniProgramFL').then(res=>{
            if(res.success){
                this.formItem4=res.data
            }
        })
    },
    //银联
     icbcPay(){
        apiGet('/admin/userPayInfo/ylpayInfo').then(res=>{
            if(res.status==200){
                this.formItem5=res.data
            }
        })
    },
    clickMode2() {
      this.formPasswordShow = true;
      this.type = "wx";
    //   apiPost("/merchant/merchantPayInfo/saveWxPay").then(res => {
    //     console.log(res);
    //   });
    },
    clickMode3() {
      this.formPasswordShow = true;
      this.type = "alipayzyb";
    //   apiPost("/merchant/merchantPayInfo/saveAliPayZyb").then(res => {
    //     console.log(res);
    //   });
    },
    clickMode4(){
      this.formPasswordShow = true;
      this.type = "wxMin";
    },
     clickMode5(){
      this.formPasswordShow = true;
      this.type = "icbc";
    },

    qrCodeUrl() {
      apiGet("/merchant/merchantPayInfo/alipayShow").then(res => {
        if (res.success) {
          this.$Message.success("生成授权链接成功！");
          this.textShow = true;
          this.formItem3.textarea = res.message;
        } else {
          this.$Message.error("生成授权链接失败！");
        }
      });
    },
    copy() {
      if (this.formItem3.textarea == "") {
        this.$Message.error("请生成授权链接！");
      }
    },
    onCopy() {
      this.$Message.success("复制成功！");
    },
    onError() {
      this.$Message.error("复制失败！");
    }
  }
};
</script>

<style scoped lang="scss">
.account {
  width: 100%;

  .contents {
    width: 500px;
    margin: 50px auto;
    img {
      width: 37px;
      height: 37px;
      vertical-align: middle;
    }
    div .span {
      display: inline-block;
      width: 132px;
      margin: 0 50px 0 30px;
    }
  }
}
</style>


