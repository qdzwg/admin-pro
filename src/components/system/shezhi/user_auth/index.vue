<template>
    <div class="details-info">
        <template v-if="!audit_success">
            <Form :model="formItem" label-position="right" :label-width="180" ref="formItem" :rules="ruleForm">
                <FormItem label="我要认证:">
                    <RadioGroup v-model="formItem.authType">
                        <Radio label="person">个人</Radio>
                        <Radio label="corp">企业</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="用户类型：">
                    <RadioGroup v-model="formItem.customType">
                        <Radio label="provider">供应商</Radio>
                        <Radio label="travel">旅行社</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="姓名:" prop="name" v-if='formItem.authType=="person"'>
                    <Input v-model="formItem.name" style="width:33%;"></Input>
                </FormItem>
                <FormItem label="身份证号:" prop="certNo" v-if='formItem.authType=="person"'>
                    <Input v-model="formItem.certNo" style="width:33%;"></Input>
                </FormItem>
                <FormItem label="身份证图片地址（正面）:" prop="certNoPositiveAddr" v-if='formItem.authType=="person"'>
                    <Input v-model="formItem.certNoPositiveAddr" style="width:33%;margin-top:10px;display:none;"></Input>
                    <my-img :limitNum="1" :uploadList="singleImgList1" @getImgUrl="setWapUrl1"></my-img>
                </FormItem>
                <FormItem label="身份证图片地址（反面）:" prop="certNoReverseSideAddr" v-if='formItem.authType=="person"'>
                    <Input v-model="formItem.certNoReverseSideAddr" style="width:33%;margin-top:10px;display:none;"></Input>
                    <my-img :limitNum="1" :uploadList="singleImgList2" @getImgUrl="setWapUrl2"></my-img>
                </FormItem>
                <FormItem label="手持身份证图片地址:" prop="certNoInHandAddr" v-if='formItem.authType=="person"'>
                    <Input v-model="formItem.certNoInHandAddr" style="width:33%;margin-top:10px;display:none;"></Input>
                    <my-img :limitNum="1" :uploadList="singleImgList3" @getImgUrl="setWapUrl3"></my-img>
                </FormItem>
                <FormItem label="企业名称:" prop="corpName" v-if='formItem.authType=="corp"'>
                    <Input v-model="formItem.corpName" style="width:33%;"></Input>
                </FormItem>
                <FormItem label="法人:" prop="legalPerson" v-if='formItem.authType=="corp"'>
                    <Input v-model="formItem.legalPerson" style="width:33%;"></Input>
                </FormItem>
                <FormItem label="法人证件号:" prop="legalPersonCertNo" v-if='formItem.authType=="corp"'>
                    <Input v-model="formItem.legalPersonCertNo" style="width:33%;"></Input>
                </FormItem>
                <FormItem label="法人身份证图片地址（正面）:" prop="certNoPositiveAddr" v-if='formItem.authType=="corp"'>
                    <Input v-model="formItem.certNoPositiveAddr" style="width:33%;margin-top:10px;display:none;"></Input>
                    <my-img :limitNum="1" :uploadList="singleImgList1" @getImgUrl="setWapUrl1"></my-img>
                </FormItem>
                <FormItem label="法人身份证图片地址（反面）:" prop="certNoReverseSideAddr" v-if='formItem.authType=="corp"'>
                    <Input v-model="formItem.certNoReverseSideAddr" style="width:33%;margin-top:10px;display:none;"></Input>
                    <my-img :limitNum="1" :uploadList="singleImgList2" @getImgUrl="setWapUrl2"></my-img>
                </FormItem>
                <FormItem label="营业执照:" prop="businessLicenseAddr" v-if='formItem.authType=="corp"'>
                    <Input v-model="formItem.businessLicenseAddr" style="width:33%;margin-top:10px;display:none;"></Input>
                    <my-img :limitNum="1" :uploadList="singleImgList4" @getImgUrl="setWapUrl4"></my-img>
                </FormItem>
                <FormItem label="营业执照号:" prop="businessLicenseNo" v-if='formItem.authType=="corp"'>
                    <Input v-model="formItem.businessLicenseNo" style="width:33%;"></Input>
                </FormItem>
                <FormItem label="联系人:" v-if='formItem.authType=="corp"'>
                    <Input v-model="formItem.contactPerson" style="width:33%;"></Input>
                </FormItem>
                <FormItem label="邮箱:" v-if='formItem.authType=="corp"'>
                    <Input v-model="formItem.email" style="width:33%;"></Input>
                </FormItem>
                <FormItem label="电话:" v-if='formItem.authType=="corp"'>
                    <Input v-model="formItem.phone" style="width:33%;"></Input>
                </FormItem>
                <FormItem label="所属地区:" prop="areaName">
                    <select-item ref="select" style="width: 100%;vertical-align: middle;" :addrCode="formItem.locationCode" @getProvince="getProvince" @getCity="getCity" @getQu="getQu"></select-item>
                    <Input v-model="formItem.areaName" style="width:33%;margin-top:10px;display:none;"></Input>
                </FormItem>
                <FormItem label="旅行社许可证:" prop="travelAddr" v-if='formItem.customType=="travel"'>
                    <Input v-model="formItem.travelAddr" style="width:33%;margin-top:10px;display:none;"></Input>
                    <my-img :limitNum="1" :uploadList="singleImgList5" @getImgUrl="setWapUrl5"></my-img>
                </FormItem>
                <FormItem label="旅行社许可证号码:" v-if='formItem.customType=="travel"'>
                    <Input v-model="formItem.travelNum" style="width:33%;"></Input>
                </FormItem>
                <FormItem label="旅行社类型：" v-if='formItem.customType=="travel"'>
                    <RadioGroup v-model="formItem.travelType">
                        <Radio label="inland">国内社</Radio>
                        <Radio label="foreign">国际社</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="短信验证码:" prop="identifyCode">
                  <Input v-model="formItem.identifyCode" style="width:33%;"></Input>
                  <Button v-if='!waiting' type="primary" @click="getMessage">获取验证码</Button>
                  <Button v-else type="ghost">{{message}}</Button>
                  <div>验证短信将发送到你绑定的手机：+86-{{name}}，请注意查收</div>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="submitForm">提交</Button>
                </FormItem>
            </Form>
        </template>
        <template v-if="formPasswordShow&&audit_success">
            <Form :model="formPasswordItem" label-position="right" :label-width="180" ref="formPasswordItem" :rules="rulePassWord">
                <FormItem label="请输入主账户密码：" prop="passWord">
                    <Input type="password" v-model="formPasswordItem.passWord" style="width:30%;"></Input>
                    <Button type="primary" @click="submit">提交</Button>
                </FormItem>
            </Form>
        </template>

        <template v-if="!formPasswordShow&&audit_success">
            <detailsTable :detailsData="formItem"></detailsTable>
        </template>
    </div>
</template>
<script>
import { apiGet, apiPost } from "@/fetch/api.js";
import detailsTable from "./../add/detailsTable";
import myImg from "@/components/global/singleImg";
import selectItem from "@/components/global/selectList";
export default {
  components: {
    detailsTable,
    myImg,
    selectItem
  },
  watch: {
    "formItem.authType": {
      handler(val, oldVal) {
        this.$refs.formItem.resetFields();
      },
      deep: true
    }
  },
  data() {
    return {
      timer: 60,
      message: '60秒后重试',
      name: '',
      waiting: false,
      singleImgList1: [],
      singleImgList2: [],
      singleImgList3: [],
      singleImgList4: [],
      singleImgList5: [],
      formItem: {
        authType: 'person',
        travelType: 'inland',
        customType: 'provider'
      },
      ruleForm: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        certNo: [{ required: true, message: "请输入身份证号", trigger: "blur" },{
            validator: this.common.validate.IdCodeValid,
            message: "请填写正确的身份证"
          }],
        certNoPositiveAddr: [{ required: true, message: "请选择图片", trigger: "blur" }],
        certNoReverseSideAddr: [{ required: true, message: "请选择图片", trigger: "blur" }],
        certNoInHandAddr: [{ required: true, message: "请选择图片", trigger: "blur" }],
        corpName: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
        // email: [{ required: false, message: "请输入邮箱", trigger: "blur" },{
        //     validator: this.common.validate.email,
        //     message: "请填写正确的邮箱"
        //   }],
        // phone: [{ required: false, message: "请输入电话", trigger: "blur" },{
        //     validator: this.common.validate.phone,
        //     message: "请填写正确的电话"
        //   }],
        legalPerson: [{ required: true, message: "请输入法人", trigger: "blur" }],
        legalPersonCertNo: [{ required: true, message: "请输入法人证件号", trigger: "blur" }],
        businessLicenseAddr: [{ required: true, message: "请选择图片", trigger: "blur" }],
        travelAddr: [{ required: true, message: "请选择图片", trigger: "blur" }],
        businessLicenseNo: [{ required: true, message: "请输入营业执照号", trigger: "blur" }],
        areaName: [{ required: true, message: "请选择所属地区", trigger: "blur" }],
        identifyCode: [{ required: true, message: "请输入短信验证码", trigger: "blur" }],
      },
      audit_success: true,
      formPasswordShow: true,
      formPasswordItem: {
        passWord: ""
      },
      rulePassWord: {
        passWord: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  // watch: {
  //   ['formItem.authType'](val){
  //     this.$nextTick(()=>{
  //     this.$refs.formItem.resetFields();
  //     })
  //   }
  // },
  created() {
    apiPost('/admin/webApi/userAuth/getUserAuthInfo').then(res=>{
      if (res.success||res.status==200) {
        if(res.data){
          this.audit_success = true;
          if(res.data.auditStatus=='wait'){
            this.$Message.warning("认证申请中，请前往“系统管理>设置>认证记录”中，查看申请记录。");
          }
        }else{
          this.audit_success = false;
        }
      } else {
        this.$Message.warning(res.message);
      }
    })
    apiGet("/admin/userStore/detail").then(res => {
      if (res.user && res.user.name) {
        this.name = res.user && res.user.name ? res.user.name : "";
      } else {
        
      }
    });
  },
  methods: {
    setWapUrl1(imgArr) {
      this.formItem.certNoPositiveAddr = imgArr[0];
    },
    setWapUrl2(imgArr) {
      this.formItem.certNoReverseSideAddr = imgArr[0];
    },
    setWapUrl3(imgArr) {
      this.formItem.certNoInHandAddr = imgArr[0];
    },
    setWapUrl4(imgArr) {
      this.formItem.businessLicenseAddr = imgArr[0];
    },
    setWapUrl5(imgArr) {
      this.formItem.travelAddr = imgArr[0];
    },
    getProvince(sheng, e) {
      //省
      this.cmbProvince = sheng;
      this.formItem.areaName = '';
      this.cmbCity = '';
      this.cmbArea = '';
      this.formItem.locationName = this.cmbProvince;
    },
    getCity(city, e) {
      //市
      this.cmbCity = city;
      this.cmbArea = '';
      this.formItem.areaName = '';
      this.formItem.locationName = this.cmbProvince + "-" + this.cmbCity;
    },
    getQu(qu, e) {
      //区
      this.cmbArea = qu;
      this.formItem.locationName =
        this.cmbProvince + "-" + this.cmbCity + "-" + this.cmbArea;
    },
    submitForm() {
      let _this = this;
      // if (this.formItem.authType == 'person') {
        
      // } else {

      // }
      // if (this.formItem.customType == 'provider') {

      // } else {

      // }
      let url = "/admin/userAuth/doSaveAuth";
      if(this.formItem.authType == 'corp' && this.formItem.email && !(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this.formItem.email))){
        return _this.$Message.warning("请输入正确的邮箱!");
      }
      if(this.formItem.authType == 'corp' && this.formItem.phone && !(/^1[3-9][0-9]{9}$/.test(this.formItem.phone))){
        return _this.$Message.warning("请输入正确的电话!");
      }
      if(this.cmbProvince && this.cmbCity && this.cmbArea)
      this.formItem.areaName = this.formItem.locationName;
      this.common.formPost(this, {
        url,
        params: this.formItem,
        callback(res) {
          if (res.success) {
            window.location.reload();
          } else {
            _this.$Message.warning(res.message);
          }
        }
      });
    },
    submit() {
      let _this = this;
      let url = "/admin/userInfo/sensitiveCheck";
      this.common.formPost(this, {
        url,
        params: this.formPasswordItem,
        mold: "page",
        modalName: "formPasswordItem",
        callback(res) {
          if (res.success) {
            _this.formPasswordShow = false;
            _this.getList();
          } else {
            _this.$Message.warning(res.message);
          }
        }
      });
    },
    getMessage() {
      let _this = this;
      _this.waiting = true;
      _this.message = _this.timer + '秒后重试'
      let timer1 = setInterval(()=>{
        _this.timer--
        _this.message = _this.timer + '秒后重试'
        if(!this.timer){
          _this.waiting = false;
          _this.timer = 60;
          clearInterval(timer1);
        }
      },1000);
      apiPost("/admin/userAuth/sendMerchantAuthSmMsg").then(res => {
        if (res.success||res.status==200) {
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    getList() {
      apiGet("/admin/userAuth/authFL").then(res => {
        if (res.success) {
          this.formItem = res.userAuth;
        }
      });
    }
  }
};
</script>
