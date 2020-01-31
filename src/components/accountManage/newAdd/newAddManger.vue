<template>
    <div class="newAddManger">
        <Form :model="formItem" label-position="right" :label-width="120" ref="formItem" :rules="ruleComplteForm">
            <FormItem label="联系人姓名：" prop="name">
                <Input v-model="formItem.name" style="width:33%;" :maxlength="10"></Input>
            </FormItem>
            <FormItem label="联系人手机号：" prop="phone">
                <Input v-model="formItem.phone" style="width:33%;"></Input>
            </FormItem>
            <FormItem label="身份证号：" prop="idNo">
                <Input v-model="formItem.idNo" style="width:33%;"></Input>
            </FormItem>
            <FormItem label="邮箱：">
                <Input v-model="formItem.email" style="width:33%;"></Input>
            </FormItem>
            <FormItem label="公司名称：">
                <Input v-model="formItem.corpName" style="width:33%;" :maxlength="50"></Input>
            </FormItem>
            <FormItem label="导游证号：">
                <Input v-model="formItem.guideNo" style="width:33%;" :maxlength="20"></Input>
            </FormItem>
            <FormItem label="导游证图片：">
                <my-img :limitNum="1" :uploadList="singleImgList" @getImgUrl="setWapUrl"></my-img>
                <p>建议上传小于2M的图片</p>
            </FormItem>
            <FormItem label="联系人地址：">
                <select-item ref="select" style="width: 33%;vertical-align: middle;" :span=8 :addrCode="formItem.locationCode" @getProvince="getProvince" @getCity="getCity" @getQu="getQu"></select-item>
                <Input v-model="formItem.address" style="width:33%;margin-top:10px;" :maxlength="30"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="submit" :loading="btnLoading">提交</Button>
                <Button @click='back'>取消</Button>
            </FormItem>

        </Form>
    </div>
</template>


<script>
import { apiPost, apiGet } from "@/fetch/api";
import myImg from "@/components/global/singleImg";
import selectItem from "@/components/global/selectList";
export default {
  components: {
    myImg,
    selectItem
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      let ph = /^1[3-9][0-9]{9}$/;
      if (!ph.test(value)) {
        callback(new Error("最大值99999"));
      } else {
        callback();
      }
    };
    const validateIdNo = (rule, value, callback) => {
      if (!this.isIdCardNo(value)) {
        callback(new Error("最大值99999"));
      } else {
        callback();
      }
    };
    return {
      isEdit: false,
      btnLoading: false,
      singleImgList: [],
      cmbProvince: "",
      cmbCity: "",
      cmbArea: "",
      formItem: {
        name: "",
        phone: null,
        idNo: "",
        corpName: "",
        guideNo: "",
        guideImg: "",
        locationCode: "",
        locationName: "",
        address: "",
        email:"",
      },
      ruleComplteForm: {
        name: [
          { required: true, message: "请填写联系人姓名", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请填写手机号", trigger: "blur" },
          {
            validator: validatePhone,
            message: "手机号码格式不正确",
            trigger: "blur"
          }
        ],
        idNo: [
          { required: true, message: "请填写身份证号码", trigger: "blur" },
          {
            validator: validateIdNo,
            message: "身份证号码格式不正确",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    if (this.$route.query.id) {
      apiPost("/admin/webapi/guide/getById", {
        Id: this.$route.query.id
      }).then(res => {
        if (res.status == 200) {
          this.isEdit = true;
          this.formItem = res.data;
          this.singleImgList = res.data.guideImg
            ? res.data.guideImg.split(",")
            : [];

          if (res.data.locationName) {
            let arr = res.data.locationName.split("-");
            this.cmbProvince = arr[0];
            this.cmbCity = arr[1];
            this.cmbArea = arr[2];
          }
        }
      });
    } else {
      this.isEdit = false;
    }
  },
  methods: {
    isIdCardNo(num) {
      var factorArr = new Array(
        7,
        9,
        10,
        5,
        8,
        4,
        2,
        1,
        6,
        3,
        7,
        9,
        10,
        5,
        8,
        4,
        2,
        1
      );
      var parityBit = new Array(
        "1",
        "0",
        "X",
        "9",
        "8",
        "7",
        "6",
        "5",
        "4",
        "3",
        "2"
      );
      var varArray = new Array();
      var intValue;
      var lngProduct = 0;
      var intCheckDigit;
      var intStrLen = num.length;
      var idNumber = num;
      // initialize
      if (intStrLen != 15 && intStrLen != 18) {
        return false;
      }
      // check and set value
      for (let i = 0; i < intStrLen; i++) {
        varArray[i] = idNumber.charAt(i);
        if ((varArray[i] < "0" || varArray[i] > "9") && i != 17) {
          return false;
        } else if (i < 17) {
          varArray[i] = varArray[i] * factorArr[i];
        }
      }

      if (intStrLen == 18) {
        // check date
        var date8 = idNumber.substring(6, 14);
        if (isDate8(date8) == false) {
          return false;
        }
        // calculate the sum of the products
        for (let i = 0; i < 17; i++) {
          lngProduct = lngProduct + varArray[i];
        }
        // calculate the check digit
        intCheckDigit = parityBit[lngProduct % 11];
        // check last digit
        if (varArray[17] != intCheckDigit) {
          return false;
        }
      } else {
        // length is 15
        // check date
        var date6 = idNumber.substring(6, 12);
        if (isDate6(date6) == false) {
          return false;
        }
      }
      return true;
      function isDate8(sDate) {
        if (!/^[0-9]{8}$/.test(sDate)) {
          return false;
        }
        var year, month, day;
        year = sDate.substring(0, 4);
        month = sDate.substring(4, 6);
        day = sDate.substring(6, 8);
        var iaMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (year < 1700 || year > 2500) return false;
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
          iaMonthDays[1] = 29;
        if (month < 1 || month > 12) return false;
        if (day < 1 || day > iaMonthDays[month - 1]) return false;
        return true;
      }
    },
    setWapUrl(imgArr) {
      this.formItem.guideImg = imgArr[0];
      //   this.$refs.formItem.validateField("linkImg");
    },
    getProvince(sheng, e) {
      //省
      this.cmbProvince = sheng;
      this.formItem.locationName = this.cmbProvince;
    },

    getCity(city, e) {
      //市
      this.cmbCity = city;
      this.formItem.locationName = this.cmbProvince + "-" + this.cmbCity;
    },
    getQu(qu, e) {
      //区
      this.cmbArea = qu;
      this.formItem.locationName =
        this.cmbProvince + "-" + this.cmbCity + "-" + this.cmbArea;
    },
    back() {
      this.$router.back();
    },
    submit() {
      let _this = this;
      this.btnLoading = true;
      this.formItem.locationCode =
        this.$refs.select.sheng +
        "-" +
        this.$refs.select.shi +
        "-" +
        this.$refs.select.qu;
      this.formItem.locationName =
        this.cmbProvince + "-" + this.cmbCity + "-" + this.cmbArea;
      delete this.formItem.createTime;
      delete this.formItem.modifyTime;
      delete this.formItem.deleted;
      this.$refs.formItem.validate(async valid => {
        if (valid) {
          let url = this.isEdit
            ? "/admin/webapi/guide/update"
            : "/admin/webapi/guide/save";
          if (this.isEdit) {
            this.formItem.id = this.$route.query.id;
          }
          let res = await apiPost(url, this.formItem);
          if (res.status == 200) {
            _this.$Message.success("保存成功!");

            _this.$router.push("/commonManger");
          } else {
            this.btnLoading = false;
            _this.$Message.warning(res.message);
          }
        } else {
          this.btnLoading = false;
          //滚动到错误地方
          setTimeout(function() {
            $("#content").scrollTop(
              $(".ivu-form-item-error").offset().top -
                90 +
                $("#content").scrollTop()
            );
          }, 500);
        }
      });
    }
  }
};
</script>


<style lang="scss">
.newAddManger {
}
</style>


