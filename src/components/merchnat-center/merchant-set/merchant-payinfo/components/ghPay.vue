<template>
  <Form :model="formItem"
        label-position="right"
        :label-width="180"
        ref="formItem"
        :rules="ruleForm">
    <FormItem label="工行APP应用ID(partner)"
              prop="partner">
      <Input v-model="formItem.partner"></Input>
      <p>登录微信公众号平台【服务号】<a href="https://mp.weixin.qq.com"
           target="_blank">https://mp.weixin.qq.com</a>下滑页面点击左侧菜单“开发”→“基本配置”按钮→“公众号开发信息”→开发者ID(AppID)→复制信息到此框内</p>
    </FormItem>
    <FormItem label="微信应用ID(wx_appid)"
              prop="wx_appid">
      <Input v-model="formItem.wx_appid"></Input>
    </FormItem>
    <FormItem label="智游宝密钥"
              prop="md5Key">
      <Input v-model="formItem.md5Key"></Input>
    </FormItem>
    <FormItem label="智游宝企业码(corpCode)"
              prop="corpCode">
      <Input v-model="formItem.corpCode"></Input>
    </FormItem>
    <FormItem label="订单类型(orderType)"
              prop="orderType">
      <Input v-model="formItem.orderType"></Input>
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
        wx_appid: '',
        md5Key: '',
        corpCode: '',
        orderType: '',
      },
      ruleForm: {
        partner: [
          { required: true, message: '请输入工行APP应用ID', trigger: 'blur' }
        ],
        wx_appid: [
          { required: true, message: '请输入微信应用ID', trigger: 'blur' }
        ],
        md5Key: [
          { required: true, message: '请输入智游宝密钥', trigger: 'blur' }
        ],
        corpCode: [
          { required: true, message: '请输入智游宝企业码', trigger: 'blur' }
        ],
        orderType: [
          { required: true, message: '请输入订单类型', trigger: 'blur' }
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