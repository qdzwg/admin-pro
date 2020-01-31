<template>
  <Form
    :model="reserveInfo"
    label-position="right"
    :label-width="120"
    ref="reserveForm"
    class="ticket-reserve"
    :rules="reserveRule"
    v-if="reserveInfo"
  >
    <FormItem label="可购时间限制：">
      <RadioGroup v-model="reserveInfo.buyFarthestType">
        <Radio label="any">
          <span>不限</span>
        </Radio>
        <Radio label="recent">
          <span>可购最近</span>
        </Radio>
        <template v-if="reserveInfo.buyFarthestType == 'recent'">
          <InputNumber
            v-model="reserveInfo.buyFarthestDay"
            :min="0"
            :max="365"
          ></InputNumber>
          天 (控制预订开始时间，当为1时则当天可预订)
        </template>
      </RadioGroup>
    </FormItem>
    <FormItem label="下单日期限制：">
      <FormItem style="width:112px;display:inline-block" prop="openTime">
        <DatePicker
          v-model="reserveInfo.orderBegDay"
          type="date"
          :editable="false"
          placeholder="限制起始日期"
          format="yyyy-MM-dd"
          style="width: 112px"
          @on-change="changOrderBegDay"
        ></DatePicker>
      </FormItem>
      <span>-</span>
      <FormItem style="width:112px;display:inline-block" prop="endTime">
        <DatePicker
          v-model="reserveInfo.orderEndDay"
          :editable="false"
          type="date"
          format="yyyy-MM-dd"
          placeholder="限制结束日期"
          style="width: 112px"
          @on-change="changOrderEndDay"
        ></DatePicker>
      </FormItem>
    </FormItem>
    <FormItem label="下单时间限制：">
      <FormItem style="width:112px;display:inline-block" prop="openTime">
        <TimePicker
          v-model="reserveInfo.dayBegTime"
          format="HH:mm"
          placeholder=""
          style="width: 112px"
        ></TimePicker>
      </FormItem>
      <span>-</span>
      <FormItem style="width:112px;display:inline-block" prop="endTime">
        <TimePicker
          v-model="reserveInfo.dayEndTime"
          format="HH:mm"
          placeholder=""
          style="width: 112px"
        ></TimePicker>
      </FormItem>
    </FormItem>
    <FormItem label="购买数量限定：">
      <InputNumber
        v-model="reserveInfo.minOrder"
        :min="0"
        :max="365"
      ></InputNumber>
      <span>-</span>
      <InputNumber
        v-model="reserveInfo.maxOrder"
        :min="0"
        :max="365"
      ></InputNumber>
    </FormItem>
    <FormItem label="提前预订天数：">
      <InputNumber v-model="reserveInfo.earlyBookDay"></InputNumber> 天
    </FormItem>
    <FormItem label="下单人身份证：" v-if="songIsNeedIdcard.show">
      <RadioGroup v-model="reserveInfo.isNeedIdcard">
        <Radio label="F">
          <span>选填</span>
        </Radio>
        <Radio label="T">
          <span>必填</span>
        </Radio>
      </RadioGroup>
    </FormItem>
    <template v-if="songIsNeedIdcard.show && reserveInfo.isNeedIdcard == 'T'">
      <FormItem label="年龄限定：">
        <Row>
          <Col span="1">
            <FormItem
              prop="minAge"
              :rules="{
                required: true,
                message: '请输入最小年龄',
                type: 'number',
                triggle: 'blur'
              }"
            >
              <InputNumber
                v-model="reserveInfo.minAge"
                :min="0"
                :max="200"
              ></InputNumber>
            </FormItem>
          </Col>
          <Col span="1" style="text-align: center">-</Col>
          <Col span="1">
            <FormItem
              prop="maxAge"
              :rules="{
                required: true,
                message: '请输入最大年龄',
                type: 'number',
                triggle: 'blur'
              }"
            >
              <InputNumber
                v-model="reserveInfo.maxAge"
                :min="0"
                :max="200"
              ></InputNumber>
            </FormItem>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="性别限定：">
        <RadioGroup v-model="reserveInfo.sex">
          <Radio label="">
            <span>不限</span>
          </Radio>
          <Radio label="X">
            <span>仅男士</span>
          </Radio>
          <Radio label="Y">
            <span>仅女士</span>
          </Radio>
        </RadioGroup>
      </FormItem>
    </template>
    <FormItem label="出游人身份证：" v-if="songCertificateWay.show">
      <RadioGroup v-model="reserveInfo.certificateWay">
        <Radio label="0">
          <span>选填</span>
        </Radio>
        <Radio label="1">
          <span>必填</span>
        </Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="购票限制：" prop="ticketLimit" v-if="songIsLimitBuy.show">
      <RadioGroup v-model="reserveInfo.isLimitBuy">
        <Radio :label="item.value" v-for="item in limitList" :key="item.value">
          <span>{{ item.label }}</span>
        </Radio>
      </RadioGroup>
    </FormItem>
    <FormItem
      label=""
      style="display:flex"
      v-if="songIsLimitBuy.show && reserveInfo.isLimitBuy != '0'"
    >
      <span>{{
        reserveInfo.ticketLimit == 1 ? "同一身份证限制" : "同一手机号限制"
      }}</span>
      <InputNumber
        v-model="reserveInfo.isLimitBuyDay"
        :min="0"
        :max="365"
      ></InputNumber>
      <span>天内最多可购买</span>
      <InputNumber
        v-model="reserveInfo.isLimitBuyDayAmount"
        :min="0"
        :max="365"
        @on-change="changeOrderNum('isLimitBuyDayOrder')"
      ></InputNumber>
      <span>张或</span>
      <InputNumber
        v-model="reserveInfo.isLimitBuyDayOrder"
        :min="0"
        :max="365"
        @on-change="changeOrderNum('isLimitBuyDayAmount')"
      ></InputNumber>
      <span>个订单</span>
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
        { value: 0, label: "无" },
        { value: 1, label: "身份证限制" },
        { value: 2, label: "手机号限制" }
      ],
      reserveInfo: this.cloneDeep(this.reserveData),
      reserveRule: {}
    };
  },
  watch: {
    getReserveInfo: function(val) {
      this.reserveInfo = this.cloneDeep(val);
    }
  },
  computed: {
    ...mapGetters("ticket", [
      "songIsLimitBuy",
      "getReserveInfo",
      "songIsNeedIdcard",
      "songCertificateWay"
    ])
  },
  methods: {
    changOrderBegDay(date) {
      this.reserveInfo.orderBegDay = date;
    },
    changOrderEndDay(date) {
      this.reserveInfo.orderEndDay = date;
    },
    changeOrderNum(type) {
      this.formItem[type] = "";
    },
    handleSubmit() {
      return new Promise((resolve, reject) => {
        this.$refs.reserveForm.validate(valid => {
          if (valid) {
            let orderBegDay = this.reserveInfo.orderBegDay;
            let orderEndDay = this.reserveInfo.orderEndDay;
            this.reserveInfo.orderBegDay = orderBegDay
              ? this.filter.formatDate(
                  this.common.changeDate(orderBegDay),
                  "yyyy-MM-dd"
                )
              : "";
            this.reserveInfo.orderEndDay = orderEndDay
              ? this.filter.formatDate(
                  this.common.changeDate(orderEndDay),
                  "yyyy-MM-dd"
                )
              : "";
            resolve(this.cloneDeep(this.reserveInfo));
          } else {
            this.$Message.warning("预定规则验证不通过");
            reject("Fail!");
          }
        });
      });
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
.ticket-reserve {
}
</style>
