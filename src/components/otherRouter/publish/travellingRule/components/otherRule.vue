<template>
  <Form
    :model="formItem"
    label-position="right"
    :label-width="120"
    ref="formItem"
    class="other-rule"
  >
    <slot name="title1"></slot>
    <FormItem label="提前预订限制：">
      <!-- {{formItem.isEarlyBook}} -->
      <Select v-model="formItem.isEarlyBook" style="width:120px">
        <Option value="F">无限制</Option>
        <Option value="T">有限制</Option>
      </Select>
      <template v-if="formItem.isEarlyBook == 'T'">
        <span class="unit">
          需提前
        </span>
        <FormItem
          class="i-b"
          prop="earlyBookDay"
          :rules="[
            { required: true, message: '不能为空' },
            { pattern: /^[1-9]\d*$/, message: '数据格式不正确' }
          ]"
        >
          <Input
            :maxlength="6"
            v-model="formItem.earlyBookDay"
            style="width: 80px"
          ></Input>
        </FormItem>
        <span class="unit">天</span>
        <FormItem
          class="i-b"
          v-if="s_earlyBookHour && s_earlyBookHour.show"
          prop="earlyBookHour"
          :rules="[
            { required: true, message: '不能为空' },
            { pattern: /^[1-9]\d*$/, message: '数据格式不正确' }
          ]"
        >
          <Input
            :maxlength="6"
            v-model="formItem.earlyBookHour"
            style="width: 80px"
          ></Input>
        </FormItem>
        <span class="unit">小时</span>
      </template>
    </FormItem>
    <FormItem label="预订日期限制：">
      <Select v-model="formItem.isOrderDate" style="width:120px">
        <Option value="F">无限制</Option>
        <Option value="T">有限制</Option>
      </Select>
      <template v-if="formItem.isOrderDate == 'T'">
        <span class="unit">
          在
        </span>
        <FormItem
          style="width:120px;display:inline-block"
          class="no-margin"
          prop="orderBegDay"
          :rules="[{ required: true, message: '开始时间不能为空' }]"
        >
          <DatePicker
            @on-change="setBeg"
            format="yyyy-MM-dd"
            :options="options3"
            :editable="false"
            type="date"
            :value="formItem.orderBegDay"
            placeholder="开始时间"
            style="width: 120px"
          ></DatePicker>
        </FormItem>
        <span class="unit">至</span>
        <FormItem
          style="width:120px;display:inline-block"
          class="no-margin"
          prop="orderEndDay"
          :rules="[{ required: true, message: '结束时间不能为空' }]"
        >
          <DatePicker
            @on-change="setEnd"
            format="yyyy-MM-dd"
            :options="options4"
            :editable="false"
            type="date"
            :value="formItem.orderEndDay"
            placeholder="结束时间"
            style="width: 120px"
          ></DatePicker>
        </FormItem>
        <span class="unit">期间内可预订</span>
      </template>
    </FormItem>
    <FormItem label="预订数量限制：">
      <!-- isLimitNum: "", //是否限制数量
        minOrder: "", //最小购买数量限制
        maxOrder: "", //最大购买数量限制 -->
      <Select v-model="formItem.isLimitNum" style="width:120px">
        <Option value="F">无限制</Option>
        <Option value="T">有限制</Option>
      </Select>
      <template v-if="formItem.isLimitNum == 'T'">
        <span class="unit">
          每次下单数量最少
        </span>
        <FormItem
          class="i-b"
          prop="minOrder"
          :rules="[
            { required: true, message: '不能为空' },
            { pattern: /^([1-9]\d*)$/, message: '数据格式不正确' }
          ]"
        >
          <Input
            :maxlength="3"
            v-model="formItem.minOrder"
            style="width: 80px"
          ></Input>
        </FormItem>
        <span class="unit">张，最多</span>
        <FormItem
          class="i-b"
          prop="maxOrder"
          :rules="[
            { required: true, message: '不能为空' },
            { validator: orderMax },
            { pattern: /^([1-9]\d*)$/, message: '数据格式不正确' }
          ]"
        >
          <Input
            :maxlength="3"
            v-model="formItem.maxOrder"
            style="width: 80px"
          ></Input>
        </FormItem>
        <span class="unit">张</span>
      </template>
    </FormItem>
    <FormItem
      label="出游人身份证："
      v-if="s_certificateWay && s_certificateWay.show"
    >
      <RadioGroup v-model="formItem.certificateWay">
        <Radio :label="0">
          <span>选填</span>
        </Radio>
        <Radio :label="1">
          <span>全填</span>
        </Radio>
      </RadioGroup>
    </FormItem>
    <template v-if="s_isLimitBuy && s_isLimitBuy.show">
      <FormItem label="购票限制：">
        <RadioGroup v-model="formItem.isLimitBuy">
          <Radio
            :label="item.value"
            v-for="item in limitList"
            :key="item.value"
          >
            <span>{{ item.label }}</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="" style="display:flex" v-if="formItem.isLimitBuy != '0'">
        <span>{{
          formItem.isLimitBuy == 1 ? "同一身份证限制" : "同一手机号限制"
        }}</span>
        <InputNumber
          v-model="formItem.isLimitBuyDay"
          :min="0"
          :max="365"
        ></InputNumber>
        <span>天内最多可购买</span>
        <InputNumber
          v-model="formItem.isLimitBuyDayAmount"
          :min="0"
          :max="365"
          @on-change="changeOrderNum('isLimitBuyDayOrder')"
        ></InputNumber>
        <span>张或</span>
        <InputNumber
          v-model="formItem.isLimitBuyDayOrder"
          :min="0"
          :max="365"
          @on-change="changeOrderNum('isLimitBuyDayAmount')"
        ></InputNumber>
        <span>个订单</span>
      </FormItem>
    </template>
    <slot name="title2" v-if="s_checkType && s_checkType.show"></slot>
    <!-- checkType: "", //过期检票操作
        refundAfterDay: "", //过期X天完结 退款
        checkRelativeDay: "", //过期X天完结 检票 -->
    <FormItem label="过期检票操作：" v-if="s_checkType && s_checkType.show">
      <Select v-model="formItem.checkType" style="width:120px">
        <Option value="0">无限制</Option>
        <!-- <Option value="1">自定完结</Option> -->
        <Option value="2">自动检票</Option>
      </Select>
      <template v-if="formItem.checkType == '2'">
        <FormItem
          class="i-b"
          prop="checkRelativeDay"
          :rules="[
            { required: true, message: '不能为空' },
            { pattern: /^\d+$/, message: '数据格式不正确' }
          ]"
        >
          <Input
            :maxlength="3"
            v-model="formItem.checkRelativeDay"
            style="width: 80px"
          ></Input>
        </FormItem>
        <span class="unit">天后自动检验</span>
      </template>
    </FormItem>
    <slot name="title3"></slot>
    <FormItem
      label="退单是否允许："
      prop="isRetreat"
      :rules="{ required: true }"
    >
      <RadioGroup v-model="formItem.isRetreat">
        <Radio label="F">
          <span>否</span>
        </Radio>
        <Radio label="T">
          <span>是</span>
        </Radio>
      </RadioGroup>
    </FormItem>
    <template v-if="formItem.isRetreat == 'T'">
      <FormItem label="退单是否需要审核：">
        <RadioGroup v-model="formItem.isRetreatAudit">
          <Radio label="F">
            <span>否</span>
          </Radio>
          <Radio label="T">
            <span>是</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="游玩日前是否可退：">
        <Select v-model="formItem.isBeforeRetreat" style="width:120px">
          <Option value="T">是</Option>
          <Option value="F">否</Option>
        </Select>
        <div
          v-if="formItem.isBeforeRetreat == 'T'"
          style="padding:0px;display: inline-block;"
          class="before-list i-b"
        >
          <div style="margin:0px" class="before-item i-b">
            <FormItem
              class="i-b"
              prop="refundBeforeDay"
              :rules="[{ pattern: /^[1-9]\d*$/, message: '数据格式不正确' }]"
            >
              <Input
                v-model="formItem.refundBeforeDay"
                :maxlength="3"
                style="width: 50px"
              ></Input>
            </FormItem>
            <template
              v-if="formItem.refundBeforeDay && formItem.refundBeforeDay != '0'"
            >
              <span>天前可退，{{ formItem.refundBeforeDay }}天</span>
              <FormItem
                v-if="formItem.refundBeforeDay"
                class="i-b"
                prop="refundBeforeTime"
              >
                <TimePicker
                  :editable="false"
                  v-model="formItem.refundBeforeTime"
                  format="HH:mm"
                  placeholder=""
                  style="width: 112px"
                ></TimePicker>
              </FormItem>
              <span class="unit">点退票截止，扣费</span>
            </template>
            <template v-else>
              <span>天前可退,扣费</span>
            </template>
            <FormItem
              class="i-b"
              prop="refundBeforeVal"
              :rules="[{ pattern: /^\d+$/, message: '数据格式不正确' }]"
            >
              <Input
                :maxlength="2"
                v-model="formItem.refundBeforeVal"
                style="width: 50px"
              ></Input>
            </FormItem>
            <span class="unit">%</span>
          </div>
        </div>
      </FormItem>
      <FormItem label="游玩当天是否可退：">
        <Select v-model="formItem.isTodayRetreat" style="width:120px">
          <Option value="T">是</Option>
          <Option value="F">否</Option>
        </Select>
        <div
          v-if="formItem.isTodayRetreat == 'T'"
          style="padding:0px;display: inline-block;"
          class="before-list i-b"
        >
          <div style="margin:0px" class="before-item i-b">
            <span class="unit">当天</span>
            <FormItem class="i-b">
              <TimePicker
                :editable="false"
                v-model="formItem.refundTodayTime"
                format="HH:mm"
                placeholder=""
                style="width: 112px"
              ></TimePicker>
            </FormItem>
            <span class="unit">点退票截止，扣费</span>
            <FormItem class="i-b" prop="refundTodayVal">
              <Input
                :maxlength="2"
                v-model="formItem.refundTodayVal"
                style="width: 50px"
              ></Input>
            </FormItem>
            <span class="unit">%</span>
          </div>
        </div>
      </FormItem>
      <FormItem label="游玩日后是否可退：">
        <Select v-model="formItem.isAfterRetreat" style="width:120px">
          <Option value="T">是</Option>
          <Option value="F">否</Option>
        </Select>
        <div
          v-if="formItem.isAfterRetreat == 'T'"
          style="padding:0px;display: inline-block;"
          class="before-list i-b"
        >
          <div style="margin:0px" class="before-item i-b">
            <FormItem
              class="i-b"
              prop="refundAfterDayIn"
              :rules="[{ pattern: /^[1-9]\d*$/, message: '数据格式不正确' }]"
            >
              <Input
                v-model="formItem.refundAfterDayIn"
                :maxlength="3"
                style="width: 50px"
              ></Input>
            </FormItem>
            <template
              v-if="
                formItem.refundAfterDayIn && formItem.refundAfterDayIn != '0'
              "
            >
              <span class="unit"
                >天内可退，{{ formItem.refundAfterDayIn }}天</span
              >
              <FormItem class="i-b">
                <TimePicker
                  :editable="false"
                  v-model="formItem.refundAfterTime"
                  format="HH:mm"
                  placeholder=""
                  style="width: 112px"
                ></TimePicker>
              </FormItem>
              <span class="unit">点退票截止，扣费</span>
            </template>
            <template v-else>
              <span>天内可退,扣费</span>
            </template>
            <FormItem
              class="i-b"
              prop="refundAfterVal"
              :rules="[{ pattern: /^\d+$/, message: '数据格式不正确' }]"
            >
              <Input
                :maxlength="2"
                v-model="formItem.refundAfterVal"
                style="width: 50px"
              ></Input>
            </FormItem>
            <span class="unit">%</span>
          </div>
        </div>
      </FormItem>
    </template>
  </Form>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  components: {},
  props: {},
  data() {
    return {
      options3: {},
      options4: {},
      songCertificateWay: {
        show: false
      },
      songIsLimitBuy: {
        show: false
      },
      limitList: [
        { value: 0, label: "无" },
        { value: 1, label: "身份证限制" },
        { value: 2, label: "手机号限制" }
      ],
      formItem: {},
      ruleComplteForm: {}
    };
  },
  watch: {
    getOtherRule: {
      handler: function(val) {
        this.formItem = this.cloneDeep(val);
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters("travellingRule", [
      "getOtherRule",
      "s_isLimitBuy",
      "s_checkType",
      "s_certificateWay",
      "s_earlyBookHour"
    ])
  },
  methods: {
    setBeg(time) {
      // orderBegDay: "", //允许开始下单日期
      // orderEndDay: "", //允许结束下单日期
      this.formItem.orderBegDay = time;
      this.options4 = {
        disabledDate: date => {
          let startTime = this.formItem.orderBegDay
            ? new Date(this.formItem.orderBegDay).valueOf() -
              1 * 24 * 60 * 60 * 1000
            : "";
          return date && date.valueOf() < startTime;
        }
      };
    },
    setEnd(time) {
      if (time) {
        this.formItem.orderEndDay = time;
        let endTime = this.formItem.orderEndDay
          ? new Date(this.formItem.orderEndDay).valueOf()
          : "";
        this.options3 = {
          disabledDate(date) {
            return date && date.valueOf() > endTime;
          }
        };
      } else {
        this.options3 = {
          disabledDate(date) {
            return false;
          }
        };
      }
    },
    changeOrderNum(type) {
      this.formItem[type] = "";
    },
    orderMax(rule, value, callback) {
      if (
        this.formItem.maxOrder &&
        parseFloat(value) < parseFloat(this.formItem.minOrder)
      ) {
        callback(new Error("不能小于" + this.formItem.minOrder));
      } else {
        callback();
      }
    },
    handleSubmit() {
      return new Promise((resolve, reject) => {
        try {
          this.$refs.formItem.validate(valid => {
            if (valid) {
              try {
                let info = this.cloneDeep(this.formItem);
                resolve(info);
              } catch (err) {
                console.log(err);
              }
            } else {
              reject("Fail!");
            }
          });
        } catch (err) {
          console.log(err);
        }
      });
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
.other-rule {
}
</style>
