<template>
  <Form
    :model="returnInfo"
    label-position="right"
    :label-width="120"
    ref="returnForm"
    :rules="returnRule"
    class="ticket-return"
    v-if="returnInfo"
  >
    <FormItem
      label="退单是否允许："
      prop="isRetreat"
      :rules="{
        required: true,
        message: '请选择是否允许退单',
        triggle: 'change'
      }"
    >
      <RadioGroup v-model="returnInfo.isRetreat">
        <Radio label="F">
          <span>否</span>
        </Radio>
        <Radio label="T">
          <span>是</span>
        </Radio>
      </RadioGroup>
    </FormItem>
    <template v-if="returnInfo.isRetreat == 'T'">
      <FormItem label="退单时间限制：">
        <RadioGroup v-model="returnInfo.retreatPeriodType">
          <Radio
            :label="item.value"
            v-for="item in limitList"
            :key="item.value"
          >
            <span>{{ item.label }}</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem
        label="提前："
        v-if="
          !returnInfo.retreatPeriodType || returnInfo.retreatPeriodType == '0'
        "
        prop="earlyDay"
        :rules="{
          required: true,
          message: '输入天数',
          type: 'number',
          triggle: 'blur'
        }"
      >
        <InputNumber
          :max="365"
          :min="0"
          v-model="returnInfo.earlyDay"
        ></InputNumber
        >天允许退（0代表游玩当天）
      </FormItem>
      <FormItem
        label="截至："
        v-if="returnInfo.retreatPeriodType == 1"
        prop="absoluteDate"
        :rules="{
          required: true,
          message: '请选择限制日期',
          triggle: 'change',
          pattern: /.+/
        }"
      >
        <DatePicker
          type="datetime"
          v-model="returnInfo.absoluteDate"
          style="width: 200px"
        ></DatePicker>
      </FormItem>
    </template>

    <FormItem label="退单是否需要审核：" v-if="songIsRetreatAudit.show">
      <RadioGroup v-model="returnInfo.isRetreatAudit">
        <Radio label="F">
          <span>否</span>
        </Radio>
        <Radio label="T">
          <span>是</span>
        </Radio>
      </RadioGroup>
    </FormItem>
  </Form>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  components: {},
  data() {
    return {
      limitList: [
        { value: 0, label: "提前退" },
        { value: 1, label: "绝对日期前" },
        { value: 2, label: "不限" },
        { value: 3, label: "游玩当天不可推" }
      ],
      returnInfo: this.cloneDeep(this.returnData),
      returnRule: {}
    };
  },
  watch: {
    getReturnInfo: function(val) {
      this.returnInfo = this.cloneDeep(val);
    }
  },
  computed: {
    ...mapGetters("ticket", ["songIsRetreatAudit", "getReturnInfo"])
  },
  methods: {
    handleSubmit() {
      try {
        return new Promise((resolve, reject) => {
          this.$refs.returnForm.validate(valid => {
            resolve({ ...this.returnInfo });
            if (valid) {
              resolve({ ...this.returnInfo });
            } else {
              this.$Message.warning("退单规则验证不通过");
              reject("Fail!");
            }
          });
        });
      } catch (err) {
        console.log(err);
      }
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
.ticket-return {
}
</style>
