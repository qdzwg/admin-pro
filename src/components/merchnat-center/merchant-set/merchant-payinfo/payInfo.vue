<template>
  <div class="pay-info">
    <keep-alive>
      <component
        ref="payInfo"
        v-bind:is="currentComponent"
        :formItem="formItem"
        keep
      >
        <div class="btn-wrap" slot="submit" slot-scope="slotProps">
          <Button type="primary" @click="submitFun(slotProps.formItem)"
            >提交</Button
          >
          <Button type="ghost" style="margin-left:15px;" @click="goBackFun"
            >返回</Button
          >
        </div>
      </component>
    </keep-alive>
  </div>
</template>

<script>
import { paySet } from "@/mixins/merchant";
export default {
  mixins: [paySet],
  components: {
    OldApliy: () => import("./components/oldApily"),
    NewApliy: () => import("./components/newApily"),
    wx: () => import("./components/wx"),
    WxApplet: () => import("./components/wxApplet"), //微信小程序
    GhPay: () => import("./components/ghPay"),
    JhWx: () => import("./components/jhWx"),
    JhWxApplet: () => import("./components/jhWxApplet")
  },
  props: {},
  data() {
    return {
      currentComponent: "",
      formItem: {
        appid: "",
        appsecret: "",
        corpCode: "",
        orderType: "",
        zybKey: ""
      },
      saveUrl: ""
    };
  },
  watch: {},
  computed: {},
  methods: {
    submitFun(formItem) {
      let vaildDom = this.$refs.payInfo.$refs.formItem;
      vaildDom.validate(valid => {
        if (valid) {
          this.apiPost(this.saveUrl, formItem).then(res => {
            if (res.success) {
              this.$Message.success("操作成功");
              this.$router.go(-1);
            } else {
              this.$Message.warn(res.message ? res.message : "操作失败");
            }
          });
        }
      });
    },
    goBackFun() {
      let vaildDom = this.$refs.payInfo.$refs.formItem;
      vaildDom.validate(vaild => {
        this.$router.go(-1);
        vaildDom.resetFields();
      });
    }
  },
  created() {},
  mounted() {},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      //确定加载那个组件
      let comList = vm.comList;
      let comKey = to.query.comKey;
      let comName = comList.filter(item => {
        return item.key == comKey;
      });
      if (!comName) {
        vm.$router.go(-1);
      }
      vm.currentComponent = comName[0].comName;
      let detailUrl = comName[0].detailUrl;
      vm.saveUrl = comName[0].saveUrl;
      vm.apiGet(detailUrl).then(res => {
        if (res.success || res.status == 200) {
          let info = res.data;
          if (!res.passFlag) {
            vm.$router.go(-1);
            return;
          }
          vm.formItem = info;
        }
      });
    });
  }
};
</script>
<style lang="scss" scoped>
.pay-info {
  width: 1000px;
  margin: 0 auto;
  .btn-wrap {
    text-align: center;
  }
}
</style>
