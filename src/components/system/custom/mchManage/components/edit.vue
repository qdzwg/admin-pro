<template>
  <the-modal
    v-model="value"
    width="800"
    :title="modalTitle"
    @ok="ok"
    @cancel="cancel"
  >
    <Form
      :model="formItem"
      label-position="right"
      :label-width="180"
      ref="formItem"
      :rules="ruleForm"
    >
      <FormItem label="用户名(商户名称)：" prop="accName">
        <Input
          v-model="formItem.accName"
          style="width:200px"
          placeholder="请输入手机号"
        ></Input>
      </FormItem>
      <FormItem label="用户密码：" prop="accPass">
        <Input
          v-model="formItem.accPass"
          type="password"
          style="width:200px"
        ></Input>
      </FormItem>
      <FormItem label="真实姓名：" prop="realName">
        <Input v-model="formItem.realName" style="width:200px"></Input>
      </FormItem>
      <FormItem label="认证类型：" prop="authType">
        <Select v-model="formItem.authType" style="width:200px">
          <Option
            v-for="item in authType"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="用户类型：" prop="customType">
        <Select v-model="formItem.customType" style="width:200px">
          <Option
            v-for="item in customTypeList"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="姓名：" prop="name">
        <Input v-model="formItem.name" style="width:200px"></Input>
      </FormItem>
      <FormItem label="身份证号：" prop="certNo">
        <Input v-model="formItem.certNo" style="width:200px"></Input>
      </FormItem>
      <FormItem label="手持身份证：" prop="businessLicenseAddr">
        <up-img v-model="formItem.businessLicenseAddr" :limitNum="1"></up-img>
      </FormItem>
      <FormItem label="个人/法人证件身份证正面：" prop="certNoPositiveAddr">
        <up-img v-model="formItem.certNoPositiveAddr" :limitNum="1"></up-img>
      </FormItem>
      <FormItem label="个人/法人证件身份证反面：" prop="certNoReverseSideAddr">
        <up-img v-model="formItem.certNoReverseSideAddr" :limitNum="1"></up-img>
      </FormItem>
      <FormItem label="所属地区：" prop="areaCode">
        <select-item
          :areaCode="formItem.areaCode"
          @getAll="getShopArea"
        ></select-item>
      </FormItem>
    </Form>
  </the-modal>
</template>

<script>
import selectItem from "@/components/global/select";
export default {
  components: { selectItem },
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
        accName: "",
        accPass: "",
        realName: "",
        authType: "",
        customType: "",
        name: "",
        certNo: "",
        businessLicenseAddr: "",
        certNoPositiveAddr: "",
        certNoReverseSideAddr: "",
        areaCode: ""
      },
      ruleForm: {
        accName: [{ required: true, message: "请输入用户名" }],
        accPass: [{ required: true, message: "请输入密码" }],
        name: [{ required: true, message: "请输入姓名" }],
        certNo: [{ required: true, message: "请输入身份证号" }],
        businessLicenseAddr: [{ required: true, message: "请上传手持身份证" }],
        certNoPositiveAddr: [
          { required: true, message: "请上传法人证件身份证正面" }
        ],
        certNoReverseSideAddr: [
          { required: true, message: "请上传法人证件身份证反面" }
        ],
        areaCode: [{ required: true, message: "请选择所属地区" }]
      }
    };
  },
  watch: {},
  computed: {
    modalTitle: function(val) {
      return this.id ? "新增商户" : "编辑商户";
    }
  },
  methods: {
    ok() {
      let editUrl = this.id
        ? "/admin/userAuth/userManageList/update"
        : "/admin/userAuth/manageSave";
      this.$refs.formItem.validate(valid => {
        if (valid) {
          let params = { ...this.formItem };
          if (this.id) {
            params.id = this.id;
          }
          this.apiPost(editUrl, params).then(res => {
            if (res.success) {
              this.$emit("input", false);
            } else {
              res.message && this.$Message.warning(res.message);
            }
          });
        }
      });
    },
    cancel() {
      this.$emit("input", false);
      this.$refs.formItem.resetFields();
    },
    getShopArea(data) {
      this.formItem.areaCode =
        data[0].code + "-" + data[1].code + "-" + data[2].code;
      this.formItem.areaName =
        data[0].name + "-" + data[1].name + "-" + data[2].name;
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped></style>
