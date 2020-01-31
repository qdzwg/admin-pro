<template>
  <div>
    <Form height="450"
          :model="formItem"
          label-position="right"
          :label-width="120"
          ref="formItem"
          :rules="ruleComplteForm">
      <h2 class="page-title">添加</h2>
      <div class="form-title">基本信息</div>
      <FormItem label="门票名称："
                prop="modelName">
        <Input v-model="formItem.modelName"
               placeholder="请输入门票名称"
               style="width:33%"></Input>
      </FormItem>
      <FormItem label="门票别名："
                prop="nickName">
        <Input v-model="formItem.nickName"
               placeholder="请输入门票别名"
               style="width:33%"></Input>
      </FormItem>
      <FormItem label="票型说明：">
        <Input v-model="formItem.modelExplain"
               type="textarea"
               :autosize="{minRows: 2,maxRows: 5}"
               placeholder="请填写门票说明"
               style="width:33%"></Input>
      </FormItem>
      <FormItem label="是否立即上架：">
        <Select v-model="formItem.enabled"
                style="width:200px">
          <Option value="T">是</Option>
          <Option value="F">否</Option>
        </Select>
      </FormItem>
      <FormItem label="销售渠道："
                prop="sellType">
        <Select v-model="formItem.sellType"
                style="width:200px">
          <Option value="">请选择</Option>
          <Option value="0">分销市场+店铺</Option>
          <Option value="1">仅分销市场</Option>
          <Option value="2">仅店铺</Option>
        </Select>
      </FormItem>
      <FormItem v-if="formItem.sellType=='0'||formItem.sellType=='2'"
                label="预订须知：">
        <ueditor id="ue2"
                 ref="mustKnow"
                 :config="config"></ueditor>
      </FormItem>
      <FormItem label="库存模式："
                prop="stockModel">
        <RadioGroup v-model="formItem.stockModel">
          <Radio label="day">
            <span>日库存</span>
          </Radio>
          <Radio label="unlimit">
            <span>无限库存</span>
          </Radio>
          <Radio label="limit">
            <span>有限库存</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem v-if="formItem.stockModel=='limit'"
                label="有限库存数量："
                prop="totalStockNum">
        <InputNumber v-model="formItem.totalStockNum"></InputNumber>
      </FormItem>
      <FormItem label="建议最低零售价："
                prop="priceMin">
        <InputNumber v-model="formItem.priceMin"
                     :min="0"></InputNumber>元
      </FormItem>
      <FormItem label="建议最高零售价："
                prop="priceMax">
        <InputNumber v-model="formItem.priceMax"
                     :min="0"></InputNumber>元
      </FormItem>
      <div>
        <table class="table">
          <thead>
            <tr>
              <th>
                <Icon class="add-icon"
                      @click="add"
                      type="android-add-circle"></Icon>
              </th>
              <th>时间段/星期（预订周期不能重复）</th>
              <th>成本价</th>
              <th>门市价</th>
              <th>渠道类别</th>
              <th v-if="formItem.sellType=='2'||formItem.sellType=='0'">零售价</th>
              <th v-if="formItem.sellType=='1'||formItem.sellType=='0'">供货价</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item,index) in tableList">
              <template v-if="formItem.sellType=='0'">
                <tr>
                  <td class="center-td"
                      rowspan="2">
                    <Icon class="delete-icon"
                          @click="del(index)"
                          type="android-remove-circle"></Icon>
                  </td>
                  <td rowspan="2"
                      class="time center-td">
                    <div>
                      <DatePicker type="date"
                                  v-model="item.startTime"
                                  placeholder="开始时间"
                                  style="width: 120px"></DatePicker>
                      <span>-</span>
                      <DatePicker type="date"
                                  v-model="item.endTime"
                                  placeholder="结束时间"
                                  style="width: 120px"></DatePicker>
                    </div>
                    <div>
                      <CheckboxGroup v-model="item.week">
                        <Checkbox label="1">
                          <span>一</span>
                        </Checkbox>
                        <Checkbox label="2">
                          <span>二</span>
                        </Checkbox>
                        <Checkbox label="3">
                          <span>三</span>
                        </Checkbox>
                        <Checkbox label="4">
                          <span>四</span>
                        </Checkbox>
                        <Checkbox label="5">
                          <span>五</span>
                        </Checkbox>
                        <Checkbox label="6">
                          <span>六</span>
                        </Checkbox>
                        <Checkbox label="0">
                          <span>日</span>
                        </Checkbox>
                      </CheckboxGroup>
                    </div>
                    <div>
                      <Button type="ghost"
                              @click="selectAll(index)"
                              size="small">全选</Button>
                      <Button type="ghost"
                              @click="selectTime(index)"
                              size="small">平时</Button>
                      <Button type="ghost"
                              @click="selectWeekend(index)"
                              size="small">周末</Button>
                    </div>
                  </td>
                  <td class="num"
                      rowspan="2">
                    <InputNumber v-model="item.costPrice"></InputNumber>
                  </td>
                  <td class="num"
                      rowspan="2">
                    <InputNumber v-model="item.rackPrice"></InputNumber>
                  </td>
                  <td>店铺</td>
                  <td>
                    <InputNumber value=""
                                 v-model="item.retailPrice"></InputNumber>
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td colspan="2">分销市场</td>
                  <td>
                    <InputNumber v-model="item.supplyPrice"></InputNumber>
                  </td>
                </tr>
              </template>
              <template v-if="formItem.sellType=='1'">
                <tr>
                  <td class="center-td">
                    <Icon class="delete-icon"
                          @click="del(index)"
                          type="android-remove-circle"></Icon>
                  </td>
                  <td class="time">
                    <div>
                      <DatePicker type="date"
                                  v-model="item.startTime"
                                  placeholder="开始时间"
                                  style="width: 120px"></DatePicker>
                      <span>-</span>
                      <DatePicker type="date"
                                  v-model="item.endTime"
                                  placeholder="结束时间"
                                  style="width: 120px"></DatePicker>
                    </div>
                    <div>
                      <CheckboxGroup v-model="item.week">
                        <Checkbox label="1">
                          <span>一</span>
                        </Checkbox>
                        <Checkbox label="2">
                          <span>二</span>
                        </Checkbox>
                        <Checkbox label="3">
                          <span>三</span>
                        </Checkbox>
                        <Checkbox label="4">
                          <span>四</span>
                        </Checkbox>
                        <Checkbox label="5">
                          <span>五</span>
                        </Checkbox>
                        <Checkbox label="6">
                          <span>六</span>
                        </Checkbox>
                        <Checkbox label="0">
                          <span>日</span>
                        </Checkbox>
                      </CheckboxGroup>
                    </div>
                    <div>
                      <Button type="ghost"
                              @click="selectAll(index)"
                              size="small">全选</Button>
                      <Button type="ghost"
                              @click="selectTime(index)"
                              size="small">平时</Button>
                      <Button type="ghost"
                              @click="selectWeekend(index)"
                              size="small">周末</Button>
                    </div>
                  </td>
                  <td class="num">
                    <InputNumber v-model="item.costPrice"></InputNumber>
                  </td>
                  <td class="num">
                    <InputNumber v-model="item.rackPrice"></InputNumber>
                  </td>
                  <td>分销市场</td>
                  <td>
                    <InputNumber v-model="item.supplyPrice"></InputNumber>
                  </td>
                </tr>
              </template>
              <template v-if="formItem.sellType=='2'">
                <tr>
                  <td class="center-td">
                    <Icon class="delete-icon"
                          @click="del(index)"
                          type="android-remove-circle"></Icon>
                  </td>
                  <td class="time">
                    <div>
                      <DatePicker type="date"
                                  v-model="item.startTime"
                                  placeholder="开始时间"
                                  style="width: 120px"></DatePicker>
                      <span>-</span>
                      <DatePicker type="date"
                                  v-model="item.endTime"
                                  placeholder="结束时间"
                                  style="width: 120px"></DatePicker>
                    </div>
                    <div>
                      <CheckboxGroup v-model="item.week">
                        <Checkbox label="1">
                          <span>一</span>
                        </Checkbox>
                        <Checkbox label="2">
                          <span>二</span>
                        </Checkbox>
                        <Checkbox label="3">
                          <span>三</span>
                        </Checkbox>
                        <Checkbox label="4">
                          <span>四</span>
                        </Checkbox>
                        <Checkbox label="5">
                          <span>五</span>
                        </Checkbox>
                        <Checkbox label="6">
                          <span>六</span>
                        </Checkbox>
                        <Checkbox label="0">
                          <span>日</span>
                        </Checkbox>
                      </CheckboxGroup>
                    </div>
                    <div>
                      <Button type="ghost"
                              @click="selectAll(index)"
                              size="small">全选</Button>
                      <Button type="ghost"
                              @click="selectTime(index)"
                              size="small">平时</Button>
                      <Button type="ghost"
                              @click="selectWeekend(index)"
                              size="small">周末</Button>
                    </div>
                  </td>
                  <td class="num">
                    <InputNumber v-model="item.costPrice"></InputNumber>
                  </td>
                  <td class="num">
                    <InputNumber v-model="item.rackPrice"></InputNumber>
                  </td>
                  <td>店铺</td>
                  <td>
                    <InputNumber v-model="item.retailPrice"></InputNumber>
                  </td>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
      </div>
      <div class="form-title">预定规则</div>
      <FormItem label="可购时间限制：">
        <RadioGroup v-model="formItem.buyFarthestType">
          <Radio label="any">
            <span>不限</span>
          </Radio>
          <Radio label="recent">
            <span>可购最近</span>
            <template v-if="formItem.buyFarthestType=='recent'">
              <InputNumber></InputNumber>天 (控制预订开始时间，当为1时则当天可预订)
            </template>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="下单日期限制：">
        <Row>
          <Col span="2">
          <FormItem prop="openTime">
            <DatePicker v-model="formItem.orderBegDay"
                        type="date"
                        placeholder=""
                        style="width: 112px"></DatePicker>
          </FormItem>
          </Col>
          <Col span="1"
               style="text-align: center">-</Col>
          <Col span="2">
          <FormItem prop="endTime">
            <DatePicker v-model="formItem.orderEndDay"
                        type="date"
                        placeholder=""
                        style="width: 112px"></DatePicker>
          </FormItem>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="下单时间限制：">
        <Row>
          <Col span="2">
          <FormItem prop="openTime">
            <TimePicker v-model="formItem.dayBegTime"
                        format="HH:mm"
                        placeholder=""
                        style="width: 112px"></TimePicker>
          </FormItem>
          </Col>
          <Col span="1"
               style="text-align: center">-</Col>
          <Col span="2">
          <FormItem prop="endTime">
            <TimePicker v-model="formItem.dayEndTime"
                        format="HH:mm"
                        placeholder=""
                        style="width: 112px"></TimePicker>
          </FormItem>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="购买数量限定：">
        <InputNumber v-model="formItem.minOrder"></InputNumber>
        <span>-</span>
        <InputNumber v-model="formItem.maxOrder"></InputNumber>
        <!-- <Row>
                <Col span="1">
                    <FormItem prop="openTime">
                        
                    </FormItem>
                </Col>
                <Col span="1" style="text-align: center">-</Col>
                <Col span="1">
                    <FormItem prop="endTime">
                      <InputNumber  v-model="formItem.maxOrder"></InputNumber>
                    </FormItem>
                </Col> -->
        </Row>
      </FormItem>
      <FormItem label="提前预订天数：">
        <InputNumber v-model="formItem.earlyBookDay"></InputNumber> 天
      </FormItem>
      <FormItem label="下单人身份证：">
        <RadioGroup v-model="formItem.isNeedIdcard">
          <Radio label="F">
            <span>选填</span>
          </Radio>
          <Radio label="T">
            <span>必填</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <template v-if="formItem.isNeedIdcard=='T'">
        <FormItem label="年龄限定："
                  prop="priceShow">
          <Row>
            <Col span="1">
            <FormItem prop="openTime">
              <InputNumber v-model="formItem.minAge"></InputNumber>
            </FormItem>
            </Col>
            <Col span="1"
                 style="text-align: center">-</Col>
            <Col span="1">
            <FormItem prop="endTime">
              <InputNumber v-model="formItem.maxAge"></InputNumber>
            </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="性别限定：">
          <RadioGroup>
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
      <div class="form-title">退改规则</div>
      <FormItem label="退单是否允许：">
        <RadioGroup v-model="formItem.isRetreat">
          <Radio label="F">
            <span>否</span>
          </Radio>
          <Radio label="T">
            <span>是</span>
          </Radio>
        </RadioGroup>
      </FormItem>
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
      <FormItem>
        <Button type="primary"
                @click="submit">保存</Button>
        <Button type="ghost"
                style="margin-left: 8px">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import ueditor from "@/components/global/ueditor";
import store from "@/store";
export default {
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (
        !store.state.menu.asyncRouter.some(item => item.name === vm.$route.name)
      ) {
        vm.$router.back(); //如果没有就不会跳转
      }
    });
  },
  data () {
    return {
      limitType: "any",
      isSelect: "F",
      tableList: [{
        week: [],
        startTime: "",
        endTime: "",
        costPrice: 0,
        rackPrice: 0,
        retailPrice: 0,
        supplyPrice: 0
      }],
      social: [],
      type: "",
      distributionWay: "0",
      lmitList: [
        {
          value: "all",
          label: "无限制"
        }
      ],
      list: [
        {
          value: "0",
          label: "分销市场+店铺"
        },
        {
          value: "1",
          label: "仅分销市场"
        },
        {
          value: "2",
          label: "仅店铺"
        }
      ],
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 200
      },
      formItem: {
        modelName: "",
        nickName: "",
        modelExplain: "",
        enabled: "T",
        sellType: "0",
        stockModel: "day",
        totalStockNum: 0,
        priceMin: 0,
        priceMax: 0,
        buyFarthestType: "ANY",
        buyFarthestDay: "",
        orderBegDay: "",
        orderEndDay: "",
        dayBegTime: "",
        dayEndTime: "",
        minOrder: 0,
        maxOrder: 0,
        earlyBookDay: 0,
        isNeedIdcard: "F",
        minAge: 0,
        maxAge: 0,
        sex: "",
        isRetreat: "F",
        isRetreatAudit: "F",
      },
      ruleComplteForm: {
        modelName: [{ required: true, message: "请填写门票名称", trigger: "blur" }],
        nickName: [{ required: true, message: "请填写门票别名", trigger: "blur" }],
        sellType: [
          { required: true, message: "请选择分销渠道", trigger: "change" }
        ],
        stockModel: [
          { required: true, message: "请选择库存模式", trigger: "change" }
        ],
        totalStockNum: [
          { required: true, type: 'number', message: "请填写有限库存数量", trigger: "blur" }
        ],
        priceMin: [
          { required: true, type: 'number', message: "请填写建议最低零售价", trigger: "blur" }
        ],
        priceMax: [
          { required: true, type: 'number', message: "请填写建议最高零售价", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    "formItem.sellType": "handle"
  },
  methods: {
    handle () { // 用于初始化第一个tr
      this.tableList.splice(0, this.tableList.length, {
        week: [],
        startTime: "",
        endTime: "",
        costPrice: 0,
        rackPrice: 0,
        retailPrice: 0,
        supplyPrice: 0
      })
    },
    selectAll (index) {
      this.tableList[index].week = ["1", "2", "3", "4", "5", "6", "0"]
    },
    selectTime (index) {
      this.tableList[index].week = ["1", "2", "3", "4", "5"]
    },
    selectWeekend (index) {
      this.tableList[index].week = ["6", "0"]
    },
    add () {
      this.tableList.push({
        week: [],
        startTime: "",
        endTime: "",
        costPrice: 0,
        rackPrice: 0,
        retailPrice: 0,
        supplyPrice: 0
      })
    },
    del (index) {
      this.tableList.splice(index, 1)
    },
    submit () {
      let _this = this;
      // this.formCompleteItem.summary = this.$refs.mdseInfo.getUEContent();
      let url = "/list/merchant/merchantMdseInfo/saveMerchantMdseInfo11";
      this.common.formPost(this, {
        url,
        params: this.formCompleteItem,
        mold: "modal",
        callback (res) {
          if (res.success) {
            _this.completeInfo = false;
          }
        }
      });
    }
  },
  components: {
    ueditor
  }
};
</script>
<style scope lang="scss">
.form-title {
  background: #dedbdb;
  padding: 5px;
  border-left: 4px solid rgba(100, 182, 255, 1);
  font-size: 16px;
  margin-bottom: 10px;
}
.page-title {
  margin-bottom: 15px;
}
.ivu-date-picker .ivu-select-dropdown {
  z-index: 1000;
}

.edui-default .edui-editor {
  z-index: 666 !important;
}
.table {
  margin-bottom: 15px;
  width: 100%;
  border-spacing: 0;
  border: 1px solid #ddd;
  border-collapse: separate;
  border-left: 0;
  border-bottom: 0;
  thead {
    tr {
      th {
        border-left: 1px solid #ddd;
        border-bottom: 1px solid #dddddd;
        padding: 8px;
        line-height: 20px;
      }
      th:first-child {
        text-align: center;
      }
    }
  }
  tbody {
    tr {
      td {
        border-left: 1px solid #ddd;
        border-bottom: 1px solid #dddddd;
        padding: 8px;
        line-height: 20px;
      }
      td:first-child {
        // text-align: center
      }
    }
  }
}
td.time {
  width: 330px;
}
.add-icon {
  cursor: pointer;
  color: green;
  font-size: 28px;
}
.delete-icon {
  cursor: pointer;
  color: red;
  font-size: 28px;
}
.center-td {
  text-align: center;
}
</style>

