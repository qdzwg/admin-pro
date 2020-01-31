<template>
  <the-modal
    v-model="value"
    width="600"
    title="认证信息"
    noFooter
    @cancel="cancel"
  >
    <Form
      :model="formItem"
      label-position="right"
      :label-width="160"
      ref="formItem"
    >
      <FormItem label="认证类型：">
        <span>{{ formItem.authType | authTypeText }}</span>
      </FormItem>
      <FormItem label="用户类型：">
        <span>{{ formItem.customType | customText }}</span>
      </FormItem>
      <FormItem label="企业名称：">
        <span>{{ formItem.corpName }}</span>
      </FormItem>
      <FormItem label="法人：">
        <span>{{ formItem.legalPerson }}</span>
      </FormItem>
      <FormItem label="法人证件号：">
        <span>{{ formItem.legalPersonCertNo }}</span>
      </FormItem>
      <FormItem label="身份证图片（正面）：">
        <up-img
          v-model="formItem.certNoPositiveAddr"
          :editFlag="false"
        ></up-img>
      </FormItem>
      <FormItem label="身份证图片（反面）：">
        <up-img
          v-model="formItem.certNoReverseSideAddr"
          :editFlag="false"
        ></up-img>
      </FormItem>
      <FormItem label="营业执照图片：">
        <up-img
          v-model="formItem.businessLicenseAddr"
          :editFlag="false"
        ></up-img>
      </FormItem>
      <FormItem label="营业执照号：">
        <span>{{ formItem.businessLicenseNo }}</span>
      </FormItem>
      <FormItem label="联系人：">
        <span>{{ formItem.createBy }}</span>
      </FormItem>
      <FormItem label="邮箱：">
        <span>{{ formItem.email }}</span>
      </FormItem>
      <FormItem label="电话：">
        <span>{{ formItem.phone }}</span>
      </FormItem>
      <FormItem label="所属地区：">
        <span>{{ formItem.areaName }}</span>
      </FormItem>
      <FormItem label="审核状态：">
        <span>{{ formItem.auditStatus | auditStatusTexts }}</span>
      </FormItem>
      <FormItem label="推荐人：">
        <span>{{ formItem.recommendName }}</span>
      </FormItem>
      <FormItem label="景区名称：">
        <span>{{ formItem.parkName }}</span>
      </FormItem>
      <FormItem label="审核信息：">
        <span>{{ formItem.auditMsg }}</span>
      </FormItem>
      <FormItem label="创建时间：">
        <span>{{ formItem.createTime }}</span>
      </FormItem>
    </Form>
  </the-modal>
</template>

<script>
export default {
  components: {},
  props: {
    id: {
      type: String,
      default: ""
    },
    value: {
      type: Boolean,
      default: false
    },
    customTypeList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    authType: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      formItem: {
        authType: "",
        customType: "",
        corpName: "",
        legalPerson: "",
        legalPersonCertNo: "",
        certNoPositiveAddr: "",
        certNoReverseSideAddr: "",
        businessLicenseAddr: "",
        businessLicenseNo: "",
        createBy: "",
        email: "",
        phone: "",
        areaName: "",
        auditStatus: "", //审核状态
        recommendName: "",
        parkName: "",
        auditMsg: "",
        createTime: ""
      }
    };
  },
  watch: {
    value: function(val) {
      if (val) {
        this.apiGet("/admin/userAuth/viewAuthFL", {
          userAuthId: this.id
        }).then(res => {
          if (res.status == 200 || res.success) {
            this.formItem = res.userAuth;
          }
        });
      }
    }
  },
  computed: {},
  methods: {
    cancel() {
      this.$emit("input", false);
    }
  },
  filters: {
    authTypeText: function(val) {
      let text = val;
      if (val == "corp") {
        text = "企业";
      } else if (val == "person") {
        text = "个人";
      }
      return text;
    },
    customText: function(val) {
      let text = val;
      if (val == "provider") {
        text = "供应商";
      } else if (val == "travel") {
        text = "旅行社";
      }
      return text;
    },
    auditStatusText: function(val) {
      let text = "审核失败";
      if (val == "audit_success") {
        text = "审核成功";
      }
      return text;
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped></style>
