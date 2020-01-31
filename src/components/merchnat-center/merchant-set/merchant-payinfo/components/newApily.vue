<template>
  <Form :model="formItem"
        label-position="right"
        :label-width="180"
        ref="formItem"
        :rules="ruleForm">
    <FormItem label="收款账号pId-partner"
              prop="partner">
      <Input v-model="formItem.partner"></Input>
    </FormItem>
    <FormItem label="支付宝当面付配置私钥"
              prop="zybKey">
      <Input v-model="formItem.zybKey"></Input>
    </FormItem>
    <FormItem label="支付宝订单类型(orderType)"
              prop="orderType">
      <Input v-model="formItem.orderType"></Input>
      <p>
        提示：联系客服配置“移动支付通知”并提供小鲸商城的支付宝订单类型
      </p>
    </FormItem>
    <FormItem label="appid"
              prop="appid">
      <Input v-model="formItem.appid"></Input>
      <p>
        说明：appid非必填项，当账号为【主-子商户模式】时，appid必须填写为【主-子账号签约生成的appid】<br>
        登录支付宝平台：开发者中心 / 网页&移动应用 / 应用列表 找到对应签约的应用即可<br>
        有问题请及时联系QQ客服：2562823061
      </p>
    </FormItem>
    <FormItem label="应用授权链接"
              prop="sellerId">
      <span>跳转到支付宝平台进行应用授权</span>
    </FormItem>
    <FormItem label="当面付授权链接"
              prop="aliPublicKey">
      <span>跳转到支付宝平台进行支付授权</span>
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
        partner: '',
        appid: '',
        zybKey: '',
        orderType: '',
      },
      ruleForm: {
        partner: [
          { required: true, message: '请输入收款账号pId-partner', trigger: 'blur' }
        ],
        appid: [
          { required: true, message: '请输入支付宝当面付配置私钥', trigger: 'blur' }
        ],
        zybKey: [
          { required: true, message: '请输入支付宝订单类型', trigger: 'blur' }
        ],
        orderType: [
          { required: true, message: '请输入appid', trigger: 'blur' }
        ]
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