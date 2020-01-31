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
        登录微信公众号平台【服务号】
        <a href="https://mp.weixin.qq.com/"></a
        >下滑页面点击左侧菜单“开发”→“基本配置”按钮→“公众号开发信息”→开发者ID(AppID)→复制信息到此框内
      </p>
    </FormItem>
    <FormItem label="应用密钥(appsecret)" prop="appsecret">
      <Input v-model="formItem.appsecret"></Input>
      <p>
        登录微信公众号平台【服务号】
        <a href="https://mp.weixin.qq.com/"></a>
        下滑页面点击左侧菜单“开发”→“基本配置”按钮→“公众号开发信息”→开发者密码(AppSecret)→复制信息到此框内
      </p>
    </FormItem>
    <FormItem label="微信订单类型(orderType)" prop="orderType">
      <Input v-model="formItem.orderType"></Input>
      <p>
        联系智游宝客服，提供智游宝微信私钥、和智游宝企业码给客服配置后获取微信订单类型复制信息到此框内
      </p>
    </FormItem>
    <FormItem label="智游宝微信私钥(zybKey)" prop="zybKey">
      <Input v-model="formItem.zybKey"></Input>
      <p>
        说明：appid非必填项，当账号为【主-子商户模式】时，appid必须填写为【主-子账号签约生成的appid】<br />
        登录支付宝平台：开发者中心 / 网页&移动应用 / 应用列表
        找到对应签约的应用即可<br />
        有问题请及时联系QQ客服：2562823061
      </p>
    </FormItem>
    <FormItem label="智游宝企业码(corpCode)" prop="corpCode">
      <Input v-model="formItem.corpCode"></Input>
    </FormItem>
    <FormItem label="公众号多平台使用" prop="transAuth">
      <RadioGroup v-model="formItem.transAuth">
        <Radio label="F">是</Radio>
        <Radio label="T">否</Radio>
      </RadioGroup>
      <p>
        否：公众号授权域名填写:www.lotsmall.cn<br />
        是：第三方平台如果也需要使用此公众号时选择,公众号授权域名需填写:weixin.zhiyoubao.com,并且第三方授权逻辑需要按照文档进行调整(智游宝微景区除外)
      </p>
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
          orderType: "",
          zybKey: "",
          corpCode: "",
          transAuth: "F"
        };
      }
    }
  },
  data() {
    return {
      ruleForm: {
        appsecret: [
          { required: true, message: "请输入应用密钥", trigger: "blur" }
        ],
        appid: [{ required: true, message: "请输入应用ID", trigger: "blur" }],
        zybKey: [
          { required: true, message: "请输入智游宝微信私钥", trigger: "blur" }
        ],
        orderType: [
          { required: true, message: "请输入微信订单类型", trigger: "blur" }
        ],
        corpCode: [
          { required: true, message: "请输入智游宝企业码", trigger: "blur" }
        ],
        transAuth: [
          {
            required: true,
            message: "请选择是否公众号多平台使用",
            trigger: "change"
          }
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
