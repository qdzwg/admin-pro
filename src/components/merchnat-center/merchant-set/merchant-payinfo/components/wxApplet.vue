<template>
  <Form
    :model="formItem"
    label-position="right"
    :label-width="180"
    ref="formItem"
    :rules="ruleForm"
  >
    <FormItem label="应用ID(appid)" prop="appid">
      <Input v-model="formItem.appid"></Input>
      <p>
        登录
        <a href="https://mp.weixin.qq.com" target="_blank"
          >https://mp.weixin.qq.com</a
        >
        ，我们可以在菜单 “设置”-“开发设置” 看到小程序的 AppID 了 。
      </p>
    </FormItem>
    <FormItem label="应用密钥(appsecret)" prop="appsecret">
      <Input v-model="formItem.appsecret"></Input>
    </FormItem>
    <FormItem label="企业码(corpCode)" prop="corpCode">
      <Input v-model="formItem.corpCode"></Input>
    </FormItem>
    <FormItem label="订单类型(orderType)" prop="orderType">
      <Input v-model="formItem.orderType"></Input>
    </FormItem>
    <FormItem label="智游宝私钥(zybKey)" prop="zybKey">
      <Input v-model="formItem.zybKey"></Input>
    </FormItem>
    <slot name="submit" :formItem="formItem"></slot>
  </Form>
</template>

<script>
export default {
  components: {},
  props: {
    formItem: {
      type: Object,
      default: function() {
        return {
          appid: "",
          appsecret: "",
          corpCode: "",
          orderType: "",
          zybKey: ""
        };
      }
    }
  },
  data() {
    return {
      ruleForm: {
        appid: [{ required: true, message: "请输入应用ID", trigger: "blur" }],
        appsecret: [
          { required: true, message: "请输入应用密钥", trigger: "blur" }
        ],
        corpCode: [
          { required: true, message: "请输入企业码", trigger: "blur" }
        ],
        orderType: [
          { required: true, message: "请输入订单类型", trigger: "blur" }
        ],
        zybKey: [
          { required: true, message: "请输入智游宝私钥", trigger: "blur" }
        ]
      }
    };
  },
  watch: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped></style>
