<template>
  <the-modal
    v-model="value"
    width="600"
    title="个性化配置"
    @ok="okFun"
    @cancel="cancel"
  >
    <Form
      :model="formItem"
      label-position="right"
      :label-width="160"
      ref="formItem"
    >
      <FormItem label="域名：" prop="domain">
        <Input v-model="formItem.domain" placeholder="请输入域名"></Input>
      </FormItem>
      <FormItem label="wap端域名：" prop="wapDomain">
        <Input
          v-model="formItem.wapDomain"
          placeholder="请输入wap端域名"
        ></Input>
      </FormItem>
      <FormItem label="登录页欢迎语：" prop="welcomeContent">
        <Input
          v-model="formItem.welcomeContent"
          placeholder="请输入登录页欢迎语"
        ></Input>
      </FormItem>
      <FormItem label="登录页logo图片：" prop="logoUrl">
        <up-img v-model="formItem.logoUrl"></up-img>
      </FormItem>
      <FormItem label="首页左上角logo：" prop="indexLogo">
        <up-img v-model="formItem.indexLogo"></up-img>
      </FormItem>
      <FormItem label="登录页背景图图片：" prop="backPicUrl">
        <up-img v-model="formItem.backPicUrl"></up-img>
      </FormItem>
      <FormItem label="著作公司名称：" prop="corpName">
        <Input
          v-model="formItem.corpName"
          placeholder="@2019  浙江深大智能科技有限公司"
        ></Input>
      </FormItem>
      <FormItem label="备案号：" prop="recordNo">
        <Input
          v-model="formItem.recordNo"
          style="width:200px"
          placeholder="浙ICP备09019008号"
        ></Input>
      </FormItem>
    </Form>
  </the-modal>
</template>

<script>
export default {
  components: {},
  props: {
    userInfoId: {
      type: String,
      default: ""
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formItem: {
        domain: "",
        wapDomain: "",
        welcomeContent: "",
        logoUrl: "",
        indexLogo: "",
        backPicUrl: "",
        corpName: "",
        recordNo: ""
      }
    };
  },
  watch: {},
  computed: {},
  methods: {
    cancel() {
      this.$emit("input", false);
      this.$refs.formItem.resetFields();
    },
    okFun() {
      this.$refs.formItem.validate(valid => {
        if (valid) {
          this.apiPost("/admin/userLoginConfig/saveEntity", {
            ...this.formItem,
            mainUserInfoId: this.userInfoId
          }).then(res => {
            if (res.success) {
              this.$emit("input", false);
              this.$refs.formItem.resetFields();
              this.$Message.success("操作成功");
            } else {
              res.message && this.$Message.warning(res.message);
            }
          });
        }
      });
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped></style>
