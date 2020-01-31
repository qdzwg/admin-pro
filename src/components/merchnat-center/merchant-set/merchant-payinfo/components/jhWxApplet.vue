<template>
  <Form :model="formItem"
        label-position="right"
        :label-width="180"
        ref="formItem"
        :rules="ruleForm">
    <FormItem label="建行凭证唯一ID(Partner)"
              prop="Partner">
      <Input v-model="formItem.Partner"></Input>
    </FormItem>
    <FormItem label="小程序微信应用ID(tp_app_id)"
              prop="tp_app_id">
      <Input v-model="formItem.tp_app_id"></Input>
      <p>登录微信公众号平台【服务号】<a href="https://mp.weixin.qq.com"
           target="_blank">https://mp.weixin.qq.com</a> 下滑页面点击左侧菜单“开发”→“基本配置”按钮→“公众号开发信息”→开发者ID(AppID)→复制信息到此框内
      </p>
    </FormItem>
    <FormItem label="建行支付配置私钥(appSecret)"
              prop="appSecret">
      <Input v-model="formItem.appSecret"></Input>
    </FormItem>
    <FormItem label="智游宝密钥(zybSecret)"
              prop="zybSecret">
      <Input v-model="formItem.zybSecret"></Input>
    </FormItem>
    <FormItem label="订单类型(orderType)"
              prop="orderType">
      <Input v-model="formItem.orderType"></Input>
      <p>联系智游宝客服，提供智游宝微信私钥、和智游宝企业码给客服配置后获取微信订单类型复制信息到此框内</p>
    </FormItem>
    <slot name="submit"
          :formItem="formItem"></slot>
  </Form>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      formItem: {
        Partner: '',
        tp_app_id: '',
        zybSecret: '',
        orderType: '',
        appSecret: '',
      },
      ruleForm: {
        Partner: [
          { required: true, message: '建行凭证唯一ID', trigger: 'blur' }
        ],
        tp_app_id: [
          { required: true, message: '小程序微信应用ID', trigger: 'blur' }
        ],
        appSecret: [
          { required: true, message: '建行支付配置私钥', trigger: 'blur' }
        ],
        zybSecret: [
          { required: true, message: '智游宝密钥', trigger: 'blur' }
        ],
        orderType: [
          { required: true, message: '订单类型', trigger: 'blur' }
        ],
      },
    };
  },
  watch: {},
  computed: {},
  methods: {},
  created () { },
  mounted () { }
};
</script>
<style lang="scss" scoped>
</style>