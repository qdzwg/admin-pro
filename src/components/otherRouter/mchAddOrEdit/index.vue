<template>
  <div class="comboTickets-addoredit">
    <Form
      height="450"
      :model="formItem"
      label-position="right"
      :label-width="120"
      ref="formItem"
      :rules="ruleComplteForm"
    >
      <FormItem
        label="商户编码："
        prop="mchId"
        v-if="type == 'edit' || type == 'see'"
      >
        <Input
          v-model="formItem.mchId"
          disabled
          placeholder="请输入商户编码"
          style="width:33%"
          :maxlength="20"
        ></Input>
      </FormItem>
      <FormItem label="商户名称：" prop="mchName">
        <Input
          v-model="formItem.mchName"
          placeholder="请输入商户名称"
          style="width:33%"
          :maxlength="20"
        ></Input>
      </FormItem>
      <FormItem label="签约景区：" prop="parkId">
        <Select v-model="formItem.parkId" style="width:120px">
          <Option
            v-for="(item, index) in parkList"
            :value="item.parkId"
            :key="index"
            >{{ item.parkName }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="法人姓名：" prop="legalName">
        <Input
          v-model="formItem.legalName"
          placeholder="请输入法人姓名"
          style="width:33%"
          :maxlength="20"
        ></Input>
      </FormItem>
      <FormItem label="法人身份证号：" prop="legalCertNo">
        <Input
          v-model="formItem.legalCertNo"
          placeholder="请输入法人身份证号"
          style="width:33%"
          :maxlength="20"
        ></Input>
      </FormItem>
      <FormItem label="法人手机号：" prop="legalPhone">
        <Input
          v-model="formItem.legalPhone"
          placeholder="请输入法人手机号"
          style="width:33%"
          :maxlength="20"
        ></Input>
      </FormItem>
      <FormItem label="联系人：" prop="contact">
        <Input
          v-model="formItem.contact"
          placeholder="请输入联系人姓名"
          style="width:33%"
          :maxlength="20"
        ></Input>
      </FormItem>
      <FormItem label="联系人手机号：" prop="contactPhone">
        <Input
          v-model="formItem.contactPhone"
          placeholder="请输入联系人手机号"
          style="width:33%"
          :maxlength="20"
        ></Input>
      </FormItem>
      <FormItem label="公司电话：" prop="companyPhone">
        <Input
          v-model="formItem.companyPhone"
          placeholder="请输入公司电话"
          style="width:33%"
          :maxlength="20"
        ></Input>
      </FormItem>
      <FormItem label="公司邮箱：" prop="companyEmail">
        <Input
          v-model="formItem.companyEmail"
          placeholder="请输入公司邮箱"
          style="width:33%"
          :maxlength="20"
        ></Input>
      </FormItem>
      <FormItem label="公司地址：" prop="companyAddress">
        <Input
          v-model="formItem.companyAddress"
          placeholder="请输入公司地址"
          style="width:33%"
          :maxlength="20"
        ></Input>
      </FormItem>
      <FormItem label="开户行名称：" prop="bank">
        <Input
          v-model="formItem.bank"
          placeholder="请输入开户行名称"
          style="width:33%"
          :maxlength="20"
        ></Input>
      </FormItem>
      <FormItem label="户名：" prop="accountName">
        <Input
          v-model="formItem.accountName"
          placeholder="请输入户名"
          style="width:33%"
          :maxlength="20"
        ></Input>
      </FormItem>
      <FormItem label="账户：" prop="account">
        <Input
          v-model="formItem.account"
          placeholder="请输入账户"
          style="width:33%"
          :maxlength="20"
        ></Input>
      </FormItem>
      <FormItem label="法人身份证图片：" prop="legalCertImageUrl">
        <Input
          v-model="formItem.legalCertImageUrl"
          style="display:none"
        ></Input>
        <my-img
          :limitNum="1"
          :uploadList="singleImgList"
          @getImgUrl="setWapUrl"
        ></my-img>
        <p>仅支持jpg、png两种格式, 大小不超过2 MB</p>
      </FormItem>
      <FormItem label="经营许可证编号：" prop="businessLicense">
        <Input
          v-model="formItem.businessLicense"
          placeholder="请输入经营许可证编号"
          style="width:33%"
          :maxlength="20"
        ></Input>
      </FormItem>
      <FormItem label="经营许可证图片：" prop="businessLicenseImageUrl">
        <Input
          v-model="formItem.businessLicenseImageUrl"
          style="display:none"
        ></Input>
        <my-img
          :limitNum="1"
          :uploadList="singleImgList2"
          @getImgUrl="setWapUrl2"
        ></my-img>
        <p>仅支持jpg、png两种格式, 大小不超过2 MB</p>
      </FormItem>
      <FormItem label="许可证有效期：">
        <DatePicker
          @on-change="setBegDate"
          :options="startOption"
          :value="formItem.businessLicenseStartTime"
          type="date"
          format="yyyy-MM-dd"
        ></DatePicker>
        <span> > </span>
        <DatePicker
          @on-change="setEndDate"
          :options="endOption"
          :value="formItem.businessLicenseEndTime"
          type="date"
          format="yyyy-MM-dd"
        ></DatePicker>
      </FormItem>
      <FormItem v-if="this.type != 'see'">
        <Button type="primary" @click="submit">保存</Button>
        <Button type="ghost" style="margin-left: 8px" @click="quxiao"
          >取消</Button
        >
      </FormItem>
    </Form>
  </div>
</template>
<script>
import ueditor from "@/components/global/ueditor";
import store from "@/store";
import myImg from "@/components/global/singleImg";
import { apiPost, apiGet, apiPostJson } from "@/fetch/api";
export default {
  data() {
    return {
      type: "",
      parkList: [],
      mchId: "",
      singleImgList: [],
      singleImgList2: [],
      formItem: {
        sellType: "2",
        mchId: "",
        mchName: "",
        parkId: "",
        parkName: "",
        legalName: "",
        legalCertNo: "",
        legalPhone: "",
        contact: "",
        contactPhone: "",
        companyPhone: "",
        companyEmail: "",
        companyAddress: "",
        bank: "",
        accountName: "",
        account: "",
        legalCertImageUrl: "",
        businessLicense: "",
        businessLicenseImageUrl: "",
        businessLicenseStartTime: "",
        businessLicenseEndTime: ""
      },
      ruleComplteForm: {
        mchName: [
          { required: true, message: "请填写商户名称", trigger: "blur" }
        ]
      },
      startOption: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      endOption: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now();
        }
      },
      wapImgList: [],
      dataShow: false // 保证页面在有数据的情况下一定展示
    };
  },
  watch: {},
  created() {
    if (this.$route.query && this.$route.query.detailId) {
      this.type = "see";
      this.mchId = this.$route.query.detailId;
    } else if (this.$route.query && this.$route.query.id) {
      this.type = "edit";
      this.mchId = this.$route.query.id;
    } else {
      this.type = "add";
    }
    this.getParkList();
    if (this.type == "see" || this.type == "edit") {
      this.getMchDetail();
    }
  },
  methods: {
    setBegDate(time) {
      this.formItem.businessLicenseStartTime = time;
      // 重置结束时间规则
      this.endOption = {
        disabledDate(date) {
          return date && date.valueOf() < new Date(time).valueOf();
        }
      };
      // 先选择结束时间再次选择开始时间大于结束，将结束时间置空
      if (
        this.formItem.businessLicenseEndTime &&
        new Date(time).valueOf() >
          new Date(this.formItem.businessLicenseEndTime).valueOf()
      ) {
        this.formItem.businessLicenseEndTime = null;
      }
    },
    setEndDate(time) {
      if (time) {
        this.formItem.businessLicenseEndTime = time;
        let endTime = this.formItem.businessLicenseEndTime
          ? new Date(this.formItem.businessLicenseEndTime).valueOf() -
            1 * 24 * 60 * 60 * 1000
          : "";
        this.options3 = {
          disabledDate(date) {
            return date && date.valueOf() > endTime;
          }
        };
      } else {
        this.options3 = {
          disabledDate(date) {
            return false;
          }
        };
      }
    },
    setWapUrl(url) {
      let _this = this;
      this.formItem.legalCertImageUrl = url.join(",");
      _this.$refs.formItem.validateField("legalCertImageUrl");
    },
    setWapUrl2(url) {
      let _this = this;
      this.formItem.businessLicenseImageUrl = url.join(",");
      _this.$refs.formItem.validateField("businessLicenseImageUrl");
    },
    getParkList() {
      this.apiGet("/admin/api/mchInfo/loadParks").then(res => {
        if (res.success || res.status == 200) {
          this.parkList = res.parks;
        }
      });
    },
    getMchDetail() {
      this.apiGet("/admin/api/mchInfo/get", { mchId: this.mchId }).then(res => {
        if (res.status == 200 || res.success) {
          this.formItem = res.mch;
          this.formItem.parkId = res.mch.parkId ? res.mch.parkId : "";
          this.singleImgList = res.mch.legalCertImageUrl
            ? res.mch.legalCertImageUrl.split(",")
            : [];
          this.singleImgList2 = res.mch.businessLicenseImageUrl
            ? res.mch.businessLicenseImageUrl.split(",")
            : [];
        }
      });
    },
    submit() {
      let _this = this;
      // 做一个深拷贝，改变数据字段
      let postParams = JSON.parse(JSON.stringify(this.formItem));
      let url = "";
      if (this.type == "edit") {
        url = "/admin/api/mchInfo/update";
        postParams.id = this.mchId;
      }
      if (this.type == "add") {
        url = "/admin/api/mchInfo/create";
      }
      this.$refs.formItem.validate(async valid => {
        this.scrollError();
        if (valid) {
          let res = await apiPost(url, postParams);
          if (res.status == 200) {
            _this.$router.push("/merchant");
            if (_this.type == "add") {
              let msg = res.message ? res.message : "保存成功";
              _this.$Message.success(msg);
            } else if (_this.type == "edit") {
              let msg = res.message ? res.message : "修改成功";
              _this.$Message.success(msg);
            }
          } else {
            _this.$Message.warning(res.message);
          }
        } else {
          // 滚动到错误地方
          this.$nextTick(() => {
            setTimeout(function() {
              $("#content").scrollTop(
                $(".ivu-form-item-error").offset().top -
                  90 +
                  $("#content").scrollTop()
              );
            }, 500);
          });
          return;
        }
      });
    },

    scrollError() {
      let errList = $(".ivu-form-item-error");
      if (errList.length > 0) {
        let scroll_offset = errList.eq(0).offset().top;
        $("#content").animate(
          {
            scrollTop: scroll_offset
          },
          300
        );
      }
    },
    quxiao() {
      this.$router.push('/merchant')
    },
    //轮播图
    setWapListUrl(imgArr) {
      if (imgArr.length > 5) {
        this.formItem.linkImg = imgArr.slice(0, 5).join(",");
      } else {
        this.formItem.linkImg = imgArr.join(",");
      }
      this.$refs.formItem.validateField("linkImg");
    }
  },
  components: {
    ueditor,
    myImg
  }
};
</script>
<style scope lang="scss">
.form-title {
  background: #dedbdb;
  padding: 5px;
  border-left: 4px solid rgba(100, 182, 255, 1);
  font-size: 16px;
  margin-bottom: 10px;
}
.page-title {
  margin-bottom: 15px;
}
.ivu-date-picker .ivu-select-dropdown {
  z-index: 1000;
}

.edui-default .edui-editor {
  z-index: 666 !important;
}
.table {
  margin-bottom: 15px;
  width: 100%;
  border-spacing: 0;
  border: 1px solid #ddd;
  border-collapse: separate;
  border-left: 0;
  border-bottom: 0;
  thead {
    tr {
      th {
        border-left: 1px solid #ddd;
        border-bottom: 1px solid #dddddd;
        padding: 8px;
        line-height: 20px;
      }
      th:first-child {
        text-align: center;
      }
    }
  }
  tbody {
    tr {
      td {
        border-left: 1px solid #ddd;
        border-bottom: 1px solid #dddddd;
        padding: 8px;
        line-height: 20px;
      }
      td:first-child {
        // text-align: center
      }
    }
  }
}
td.time {
  width: 450px;
}
.add-icon {
  cursor: pointer;
  color: green;
  font-size: 28px;
}
.delete-icon {
  cursor: pointer;
  color: red;
  font-size: 28px;
}
.center-td {
  text-align: center;
}
.comboTickets-addoredit {
  em {
    font-style: normal;
    margin: 0 5px;
  }
  .nowDayRule {
    .ivu-form-item-label {
      width: 132px !important;
    }
  }
}
.comboTickets-addoredit {
  .travellSubject {
    height: 32px;
    .subject-list {
      float: left;
      margin-right: 10px;
      .subject-list-item {
        display: inline-block;
        margin-right: 10px;
        position: relative;
        .subject-list-item-del {
          display: none;
          position: absolute;
          top: -5px;
          right: -5px;
          font-size: 14px;
          cursor: pointer;
        }
      }
      .subject-list-item:hover {
        .subject-list-item-del {
          display: inline-block;
        }
      }
    }
    .subject-input {
      float: left;
    }
  }
  .dayStock-input-box {
    .ivu-form-item-content {
      margin-left: 0 !important;
    }
  }
  .label-item:hover {
  }

  .step {
    width: 60%;
    margin: 2.5rem auto;
  }
}
</style>
