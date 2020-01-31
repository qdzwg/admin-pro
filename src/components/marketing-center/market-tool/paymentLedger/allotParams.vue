<template>
  <div>
    <form-tempte
      :formItems="formItems"
      :formAction="formAction"
      :formData="formData"
    ></form-tempte>
  </div>
</template>
<script>
import formTempte from "@/components/global/formTempte";
export default {
  data() {
    return {
      formItems: [
        {
          label: "对接渠道",
          type: "select",
          name: "channel",
          data: [
            {
              label: "支付中心",
              value: "pay_centet"
            }
          ],
          validate: [
            { required: true, message: "请选择对接渠道", trigger: "change" }
          ]
        },
        {
          label: "分账类型",
          type: "select",
          name: "splitAccountType",
          data: [],
          validate: [
            { required: true, message: "请选择分账类型", trigger: "change" }
          ],
          tip: `<p>农行目前只支持套票；建行目前只支持单票；切换渠道后请务务必删除对应票型，否则分账存在金额问题；</p>
          <p>建行配置的企业码即柜台码，一个票型配置了多个取一个，其他无效；分账金额目前为无效配置</p>`
        }
      ],
      formAction: "/marketing/webApi/marketPayAccountConfig/saveConfig",
      formData: {}
    };
  },
  components: {
    formTempte
  },
  async created() {
    await this.$store.dispatch("getInfo", ["splitAccountType"]);
    let res = this.$store.state.baseInfoConfig.res;
    res.splitAccountType.forEach(element => {
      this.formItems[1].data.push({
        value: element.value,
        label: element.key
      });
    });
  },
  async mounted() {
    let res = await this.apiGet(
      "/marketing/webApi/marketPayAccountConfig/getCongig"
    );
    if (res.status === 200) {
      this.formData = {
        channel: res.data.channel,
        splitAccountType: res.data.splitAccountType
      };
    } else {
      this.$Message.error(res.message);
    }
  }
};
</script>
