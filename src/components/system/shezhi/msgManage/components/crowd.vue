<template>
  <theModal
    v-model="value"
    width="400"
    okText="发送"
    @ok="okFun"
    @cancel="cancelFun"
  >
    <Form
      ref="formItem"
      :model="formItem"
      :rules="ruleValidate"
      :label-width="100"
    >
      <FormItem label="群发对象：">
        <CheckboxGroup v-model="children">
          <Checkbox
            disabled
            :label="item.value"
            v-for="item in childrenList"
            :key="item.value"
            >{{ item.label }}</Checkbox
          >
        </CheckboxGroup>
      </FormItem>
      <FormItem label="客源数据来源：">
        <RadioGroup v-model="formItem.customType">
          <Radio
            :label="item.value"
            v-for="item in resourceList"
            :key="item.value"
            >{{ item.label }}</Radio
          >
        </RadioGroup>
      </FormItem>
      <FormItem label="按购买周期：" style="margin-bottom:0">
        <Select
          v-model="formItem.days"
          style="width:200px"
          @on-change="getCount"
        >
          <Option
            :value="item.value"
            v-for="item in dateList"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <FormItem>
        <p>选择人群总数{{ count }}人</p>
      </FormItem>
    </Form>
  </theModal>
</template>

<script>
import theModal from "@/components/global/theModal.vue";
export default {
  components: { theModal },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    id: {
      required: true
    }
  },
  data() {
    return {
      children: ["0"],
      count: 0,
      formItem: {
        customType: "ZYB",
        days: 1
      },
      ruleValidate: {},
      childrenList: [{ value: "0", label: "联盟推广" }],
      resourceList: [{ value: "ZYB", label: "智游宝" }],
      dateList: [
        { value: 1, label: "近1天有交易记录" },
        { value: 7, label: "近7天有交易记录" },
        { value: 15, label: "近15天有交易记录" },
        { value: 30, label: "近30天有交易记录" }
      ]
    };
  },
  watch: {
    value: function(val) {
      if (val) {
        this.getCount();
      }
    }
  },
  computed: {},
  methods: {
    cancelFun() {
      this.$emit("input", false);
    },
    okFun() {
      let params = {
        ...this.formItem,
        messageTemplateId: this.id
      };
      this.apiGet("/merchant/api/merchantMessage/send/batchsend", params).then(
        res => {
          if (res.status == 200 || res.success) {
            this.$emit("input", false);
          } else {
            res.message && this.$Message.warning(res.message);
          }
        }
      );
    },
    getCount() {
      let params = {
        ...this.formItem,
        messageTemplateId: this.id
      };
      this.apiGet(
        "/merchant/api/merchantMessage/send/customcount",
        params
      ).then(res => {
        if (res.status == 200 || res.success) {
          this.count = res.data;
        } else {
          res.message && this.$Message.warning(res.message);
        }
      });
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped></style>
