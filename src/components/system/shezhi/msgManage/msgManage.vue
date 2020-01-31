<template>
  <div class="manage">
    <div class="to-up">
      <div class="msg-num">
        <p class="num">剩余短信数量：1000条</p>
        <p>
          <Icon type="information-circled"></Icon>
          短信数量不足，请及时充值，以免影响店铺消息推送
        </p>
      </div>
      <div>
        <span>签名设置：</span>
        <Input v-model="signName" style="width: 200px"></Input>
        <Button type="text">预览</Button>
        <Button type="text" @click="editSignFun">修改</Button>
        <Button type="text" @click="passTipFun">审核未通过</Button>
      </div>
      <p class="tip">
        支付成功短信系统默认140字内免费，超出部分需按收费条数计算
      </p>
    </div>
    <Modal v-model="toUpFlag" width="360">
      <div class="content">
        <p style="text-align:center">
          你的店铺短信套餐可用条数已不足XX条，请及时充值，避免影响使用！
        </p>
      </div>
      <div slot="footer">
        <Button type="primary" @click="gotoUP">去充值</Button>
      </div>
    </Modal>
    <the-modal v-model="editFlag" @on="confirmSign" @cancel="cancelFun">
      <Form
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        :label-width="80"
      >
        <FormItem label="签名：" prop="signName">
          <Input
            v-model="formValidate.signName"
            placeholder="请输入签名"
            style="width:200px"
          ></Input>
          <p>自定义签名每月可修改一次字数限制为2-8个字，可以包含数字、英文</p>
        </FormItem>
      </Form>
    </the-modal>
  </div>
</template>

<script>
import theModal from "@/components/global/theModal.vue";
export default {
  components: { theModal },
  props: {},
  data() {
    return {
      toUpFlag: true,
      signName: "",
      editSignName: "",
      editFlag: false,
      formValidate: { signName: "" },
      ruleValidate: {
        signName: [{ required: true, min: 2, max: 8, message: "请输入签名" }]
      }
    };
  },
  watch: {},
  computed: {},
  methods: {
    passTipFun() {
      this.$Modal.info({
        content: "<p>运营商签名审核未通过，请及时更换签名</p>",
        onOk: () => {}
      });
    },
    cancelFun() {
      this.editFlag = false;
      this.editSignName = "";
    },
    confirmSign() {
      this.editFlag = false;
    },
    editSignFun() {
      this.editFlag = true;
    },
    gotoUP() {}
  },
  created() {
    this.apiGet("/merchant/api/merchantMessage/sign/get").then(res => {});
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.manage {
  font-size: 16px;
  .to-up {
    padding: 10px;
    .msg-num {
      display: flex;
      margin-bottom: 20px;
      .num {
        margin-right: 20px;
      }
    }
    .tip {
      padding-top: 10px;
    }
  }
  .content {
    padding: 40px 10px 10px;
    font-size: 18px;
  }
}
</style>
