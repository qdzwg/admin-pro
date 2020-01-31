<template>
  <Form :model="formItem"
        label-position="right"
        :label-width="180"
        ref="formItem"
        :rules="ruleForm">
    <FormItem label="支付宝-appid"
              prop="appid">
      <Input v-model="formItem.appid"></Input>
      <p>
        登录支付宝商家平台，请点击https://www.alipay.com/ 点击左侧信息栏“账户管理”→下拉至“商户信息管理”→点击“查看PID\KEY”→进入新页面
        点击最上方“开发者中心—生活号”菜单→“生活号应用”下查看APPID—— 如未开通生活号请点击右方“创建应用”创建后复制APPID即可
      </p>
    </FormItem>
    <FormItem label="应用私钥-privateKey"
              prop="privateKey">
      <Input v-model="formItem.privateKey"></Input>
      <p>
        “应用公钥”与之对应的“应用私钥” 首次设置需下载“支付宝秘钥工具”按支付宝提示操作成功后复制“应用私钥2048”
      </p>
    </FormItem>
    <FormItem label="应用公钥-publicKey"
              prop="publicKey">
      <Input v-model="formItem.publicKey"></Input>
      <p>
        登录支付宝商家平台https://www.alipay.com/ 点击左侧信息栏“账户管理”→下拉至“商户信息管理”→点击“查看PID\KEY”→进入新页面
        点击“开放平台秘钥”→“RSA(SHA1)密钥”右侧点击“设置应用公钥”“应用私钥” 首次设置需下载“支付宝秘钥工具”按支付宝提示操作成功
        后复制“应用公钥2048”
      </p>
    </FormItem>
    <FormItem label="合作身份者ID-partner"
              prop="partner">
      <Input v-model="formItem.partner"></Input>
    </FormItem>
    <FormItem label="密钥-md5Key"
              prop="md5Key">
      <Input v-model="formItem.md5Key"></Input>
    </FormItem>
    <FormItem label="支付宝账号-sellerId"
              prop="sellerId">
      <Input v-model="formItem.sellerId"></Input>
    </FormItem>
    <FormItem label="支付宝公钥-aliPublicKey"
              prop="aliPublicKey">
      <Input v-model="formItem.aliPublicKey"></Input>
      <p>
        登录支付宝商家平台https://www.alipay.com/ 点击左侧信息栏“账户管理”→下拉至“商户信息管理”→点击“查看PID\KEY”→进入新页面
        点击“开放平台秘钥”查看“RSA2(SHA256)密钥”→“支付宝公钥”
      </p>
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
        appid: '',
        privateKey: '',
        publicKey: '',
        partner: '',
        md5Key: '',
        sellerId: '',
        aliPublicKey: ''
      },
      ruleForm: {
        appid: [
          { required: true, message: '请输入支付宝appid', trigger: 'blur' }
        ],
        privateKey: [
          { required: true, message: '请输入应用私钥', trigger: 'blur' }
        ],
        publicKey: [
          { required: true, message: '请输入应用公钥', trigger: 'blur' }
        ],
        partner: [
          { required: true, message: '请输入合作身份者ID', trigger: 'blur' }
        ],
        md5Key: [
          { required: true, message: '支付宝当面付配置私钥', trigger: 'blur' }
        ],
        sellerId: [
          { required: true, message: '请输入支付宝账号', trigger: 'blur' }
        ],
        aliPublicKey: [
          { required: true, message: '请输入支付宝公钥', trigger: 'blur' }
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