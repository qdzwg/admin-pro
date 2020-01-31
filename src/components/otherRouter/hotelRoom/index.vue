<template>
  <div style="padding-bottom:50px">
    <Form
      :model="formItem"
      label-position="right"
      :label-width="120"
      ref="formItem"
      required
      :rules="ruleForm"
    >
      <div class="form-title">基本信息</div>
      <FormItem label="酒店名称：" prop="hotelName">
        <Input
          v-if="types == 'edit'"
          v-model="formItem.hotelName"
          style="width:33%"
          placeholder="请输入酒店名称"
          :maxlength="64"
        ></Input>
        <Input
          v-else
          v-model="formItem.hotelName"
          disabled
          style="width:33%"
          placeholder="请输入酒店名称"
          :maxlength="64"
        ></Input>
      </FormItem>

      <FormItem label="房型名称：" prop="modelName">
        <Input
          v-model="formItem.modelName"
          style="width:33%"
          placeholder="请输入房型名称"
          :maxlength="64"
        ></Input>
      </FormItem>
      <FormItem label="房型别名：" prop="nickName">
        <Input
          v-model="formItem.nickName"
          style="width:33%"
          placeholder="请输入房型别名"
          :maxlength="64"
        ></Input>
      </FormItem>
      <FormItem label="房型编码：" v-if="types == 'edit'" prop="modelCode">
        <Input
          v-model="formItem.modelCode"
          style="width:33%"
          disabled
          placeholder="请输入房型编码"
          :maxlength="64"
        ></Input>
        <!-- <span>{{formItem.modelCode}}</span>        -->
      </FormItem>
      <FormItem label="是否电商核销：" prop="extendsParamOne">
        <RadioGroup v-model="formItem.extendsParamOne">
          <Radio label="T">
            <span>是</span>
          </Radio>
          <Radio label="F">
            <span>否</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem
        v-if="formItem.extendsParamOne == 'T'"
        label="电商编码："
        prop="extendsParamTwo"
      >
        <Input
          v-model="formItem.extendsParamTwo"
          disabled
          style="width:200px"
          placeholder="请选择电商编码"
        ></Input>
        <Button type="primary" @click="selectCode('extendsParamTwo')"
          >选择</Button
        >
      </FormItem>
      <FormItem label="床型：" prop="bedType">
        <Select v-model="formItem.bedType" style="width:200px">
          <Option
            v-for="(item, index) in bedTypeList"
            :key="index"
            :value="item.key"
            >{{ item.value }}</Option
          >
          <!-- <Option value="1">大床</Option>
          <Option value="2">双床</Option>
          <Option value="3">子母床</Option>
          <Option value="4">圆床</Option>
          <Option value="5">三床</Option> -->
        </Select>
      </FormItem>
      <FormItem label="房型面积：">
        <InputNumber
          v-model="formItem.buildingArea"
          :max="9999999"
          :min="0"
        ></InputNumber>
        m²
      </FormItem>
      <FormItem label="楼层：">
        <Input v-model="formItem.floors" style="width:200px"></Input> 层
      </FormItem>
      <FormItem label="宽带：" prop="broadBand">
        <Select v-model="formItem.broadBand" style="width:200px">
          <Option
            :value="item.value"
            v-for="(item, i) in broadBands"
            :key="i"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="WiFi：" prop="wirelessFidelity">
        <Select v-model="formItem.wirelessFidelity" style="width:200px">
          <Option
            :value="item.value"
            v-for="(item, i) in wirelessFidelitys"
            :key="i"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="是否有窗：" prop="window">
        <Select v-model="formItem.window" style="width:200px">
          <Option value="0">有窗</Option>
          <Option value="1">无窗</Option>
        </Select>
      </FormItem>
      <FormItem label="限住人数：" prop="personLim">
        <Select v-model="formItem.personLim" style="width:200px">
          <Option
            :value="item.value"
            v-for="(item, i) in personLims"
            :key="i"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="早餐：" prop="breakfast">
        <Select v-model="formItem.breakfast" style="width:200px">
          <Option
            :value="item.value"
            v-for="(item, i) in breakfasts"
            :key="i"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="房型主图：" prop="linkMobileImg">
        <Input v-model="formItem.linkMobileImg" style="display:none"></Input>
        <my-img
          :limitNum="1"
          :uploadList="singleImgList"
          @getImgUrl="setWapUrl"
        ></my-img>
        <p>建议上传小于2M， 宽750px，高560px的JPG/PNG格式的图片</p>
      </FormItem>

      <FormItem label="房型说明：" prop="modelDetail">
        <ueditor v-model="formItem.modelDetail"></ueditor>
      </FormItem>
      <FormItem label="预订须知：" prop="noticeid">
        <ueditor v-model="formItem.noticeid"></ueditor>
      </FormItem>

      <div style="margin-left:120px;">
        <table class="table" style="width:60%;">
          <thead>
            <tr>
              <th>
                <Icon
                  class="add-icon"
                  @click="add"
                  type="android-add-circle"
                ></Icon>
              </th>
              <th>时间段/星期（预订周期不能重复）</th>
              <!-- <th>库存模式</th> -->
              <th>成本价</th>
              <th>销售价</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in formItem.tableList">
              <tr>
                <td class="center-td">
                  <Icon
                    class="delete-icon"
                    @click="del(index)"
                    type="android-remove-circle"
                  ></Icon>
                </td>
                <td class="time center-td">
                  <div>
                    <Row>
                      <Col span="11">
                        <FormItem
                          :prop="'tableList.' + index + '.startTime'"
                          :rules="{
                            required: true,
                            type: 'date',
                            message: '开始时间不能为空',
                            trigger: 'change'
                          }"
                          :label-width="1"
                        >
                          <DatePicker
                            type="date"
                            v-model="item.startTime"
                            placeholder="开始时间"
                            format="yyyy-MM-dd"
                            style="width: 120px"
                            :options="dateOptions[index].startTimeOptions"
                            @on-open-change="startTimeOpenChange($event, index)"
                          ></DatePicker>
                        </FormItem>
                      </Col>
                      <Col span="2" style="text-align: center">- </Col>
                      <Col span="11">
                        <FormItem
                          :prop="'tableList.' + index + '.endTime'"
                          :rules="{
                            required: true,
                            type: 'date',
                            message: '结束时间不能为空',
                            trigger: 'change'
                          }"
                          :label-width="1"
                        >
                          <DatePicker
                            type="date"
                            v-model="item.endTime"
                            placeholder="结束时间"
                            format="yyyy-MM-dd"
                            style="width: 120px"
                            :options="dateOptions[index].endTimeOptions"
                            @on-open-change="endTimeOpenChange($event, index)"
                          ></DatePicker>
                        </FormItem>
                      </Col>
                    </Row>
                  </div>
                  <div>
                    <CheckboxGroup
                      v-model="item.weeks"
                      @on-change="changeWeeksData"
                    >
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
                    <Button type="ghost" @click="selectAll(index)" size="small"
                      >全选</Button
                    >
                    <Button type="ghost" @click="selectTime(index)" size="small"
                      >平时</Button
                    >
                    <Button
                      type="ghost"
                      @click="selectWeekend(index)"
                      size="small"
                      >周末</Button
                    >
                  </div>
                </td>
                <!-- <td>
     
                  <div>日库存</div>
                  <FormItem
                      :prop="'tableList.' + index + '.totalStockNum'"
                      :rules="[{required: true, message: '请填写日库存', trigger: 'blur'},{ pattern: /^[0-9]\d*$/, message: '数据格式不正确', trigger: 'blur' }]"
                      class="dayStock-input-box"
                    >
                      <Input style="width:200px" v-model="item.totalStockNum" placeholder="请填写日库存" :maxlength="8"></Input>
                    </FormItem>
                </td> -->
                <td class="num">
                  <FormItem
                    :prop="'tableList.' + index + '.costPrice'"
                    :rules="[
                      {
                        required: true,
                        message: '成本价不能为空',
                        trigger: 'blur'
                      },
                      {
                        validator: common.validate.floatNumber,
                        trigger: 'blur'
                      }
                    ]"
                    :label-width="1"
                  >
                    <Input
                      v-model="item.costPrice"
                      placeholder="请输入成本价"
                      style="width:120px"
                    ></Input>
                  </FormItem>
                </td>
                <td class="num">
                  <FormItem
                    :prop="'tableList.' + index + '.retailPrice'"
                    :rules="[
                      {
                        required: true,
                        message: '销售价不能为空',
                        trigger: 'blur'
                      },
                      {
                        validator: common.validate.floatNumber,
                        trigger: 'blur'
                      }
                    ]"
                    :label-width="1"
                  >
                    <Input
                      v-model="item.retailPrice"
                      placeholder="请输入销售价"
                      style="width:120px"
                    ></Input>
                  </FormItem>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div class="form-title">预订规则</div>
      <FormItem label="提前预定限制：">
        <!-- <Select  v-model="earlyBook" style="width:200px">
                <Option value="F">无限制</Option>
                <Option value="T">有限制</Option>
              </Select> -->
        <template>
          需提前
          <FormItem
            prop="earlyBookDay"
            style="display:inline-block; width:100px;"
          >
            <Input v-model="formItem.earlyBookDay" :max="30" :min="0"></Input>
          </FormItem>
          天，
          <FormItem
            prop="earlyBookHour"
            style="display:inline-block; width:100px;"
          >
            <Input v-model="formItem.earlyBookHour" :max="24" :min="0"></Input>
          </FormItem>
          小时，
          <FormItem
            prop="earlyBookMinute"
            style="display:inline-block; width:100px;"
          >
            <Input
              v-model="formItem.earlyBookMinute"
              :max="60"
              :min="0"
            ></Input>
          </FormItem>
          分钟可预订
        </template>
      </FormItem>
      <FormItem label="预订日期限制：">
        <!-- <Select  v-model="orderType" style="width:200px">
                <Option value="F">无限制</Option>
                <Option value="T">有限制</Option>
              </Select> -->
        <template>
          在
          <DatePicker
            @on-change="setBegDate"
            :options="startOption"
            :value="formItem.orderBegDay"
            type="date"
            format="yyyy-MM-dd"
          ></DatePicker>
          <span>至</span>
          <DatePicker
            @on-change="setEndDate"
            :options="endOption"
            :value="formItem.orderEndDay"
            type="date"
            format="yyyy-MM-dd"
          ></DatePicker>
          期间内可预订
        </template>
      </FormItem>
      <FormItem label="预订时间限制：">
        <!-- <Select  v-model="orderdayType" style="width:200px">
                <Option value="F">无限制</Option>
                <Option value="T">有限制</Option>
              </Select> -->
        <template>
          在
          <TimePicker v-model="formItem.dayBegTime" format="HH:mm"></TimePicker>
          <span>至</span>
          <TimePicker v-model="formItem.dayEndTime" format="HH:mm"></TimePicker>
          时间内可预订
        </template>
      </FormItem>
      <FormItem label="预订连住限制：">
        <Select v-model="formItem.minBookDay" style="width:200px">
          <Option
            :value="item.value"
            v-for="(item, i) in minBookDays"
            :key="i"
            >{{ item.label }}</Option
          >
        </Select>
        <span>预订时必须连选要求的晚数才能预订</span>
      </FormItem>

      <!--宋城新增-->
      <FormItem label="出游人证件：">
        <RadioGroup v-model="formItem.certificateWay">
          <Radio label="0">
            <span>全填</span>
          </Radio>
          <Radio label="1">
            <span>选填</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="购票限制：">
        <!-- {{formItem.bookLimit}} -->
        <RadioGroup v-model="formItem.isLimitBuy">
          <Radio label="0">
            <span>无</span>
          </Radio>
          <Radio label="1">
            <span>身份证限制</span>
          </Radio>
          <Radio label="2">
            <span>手机号限制</span>
          </Radio>
        </RadioGroup>
        <div v-if="formItem.isLimitBuy == '1'">
          <span>同一身份证限制</span>
          <Input v-model="formItem.isLimitBuyDay" style="width:200px;"></Input>
          <span>天内最多可购买</span>
          <Input
            v-model="formItem.isLimitBuyDayAmount"
            style="width:200px;"
          ></Input>
          <span>张或</span>
          <Input
            v-model="formItem.isLimitBuyDayOrder"
            style="width:200px;"
          ></Input>
          <span>个订单</span>
        </div>
        <div v-if="formItem.isLimitBuy == '2'">
          <span>同一手机号限制</span>
          <Input v-model="formItem.isLimitBuyDay" style="width:200px;"></Input>
          <span>天内最多可购买</span>
          <Input
            v-model="formItem.isLimitBuyDayAmount"
            style="width:200px;"
          ></Input>
          <span>张或</span>
          <Input
            v-model="formItem.isLimitBuyDayOrder"
            style="width:200px;"
          ></Input>
          <span>个订单</span>
        </div>
      </FormItem>

      <div class="form-title">退改规则</div>
      <FormItem label="退单是否允许：">
        <Select
          v-model="formItem.isRetreat"
          @on-change="returnAllow"
          style="width:200px"
        >
          <Option value="F">不允许退单</Option>
          <Option value="T">允许退单</Option>
        </Select>
      </FormItem>
      <FormItem label="退单日期限制：" v-if="formItem.isRetreat == 'T'">
        <Select v-model="formItem.retreatPeriodType" style="width:200px">
          <Option value="2">无限制</Option>
          <Option value="0">提前退</Option>
          <Option value="3">入住当天不可退</Option>
        </Select>
        <span v-if="formItem.retreatPeriodType == '0'">
          提前
          <InputNumber
            v-if="lyDay == 'T'"
            v-model="formItem.earlyDay"
            :max="30"
            :min="1"
          ></InputNumber>
          <InputNumber
            v-if="lyDay == 'H'"
            v-model="formItem.earlyHour"
            :max="24"
            :min="1"
          ></InputNumber>
          <Select v-model="lyDay" style="width:100px">
            <Option value="T">天</Option>
            <Option value="H">小时</Option>
          </Select>
          可退单
        </span>
      </FormItem>
      <FormItem label="退单是否审核：" v-if="formItem.isRetreat == 'T'">
        <Select v-model="formItem.isRetreatAudit" style="width:200px">
          <Option value="T">审核</Option>
          <Option value="F">不审核</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="submit">保存</Button>
        <Button type="ghost" @click="back" style="margin-left: 8px"
          >取消</Button
        >
      </FormItem>
    </Form>
    <ec-code v-model="ecFlag" @get-code="getEcCode"></ec-code>
  </div>
</template>
<script>
import store from "@/store";
import { apiPost } from "@/fetch/api";
import myImg from "@/components/global/singleImg";
import ueditor from "@/components/global/vueUEditor";
import { ecCode } from "./components/index";
export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (
        !store.state.menu.asyncRouter.some(item => item.name === vm.$route.name)
      ) {
        vm.$router.back(); // 如果没有就不会跳转
      }
    });
  },
  data() {
    return {
      singleImgList: [],
      orderType: "F",
      orderdayType: "F",
      earlyBook: "F",
      hotelList: [],
      bedTypeList: [],
      minBookDays: [
        {
          value: 1,
          label: "1晚"
        },
        {
          value: 2,
          label: "2晚"
        },
        {
          value: 3,
          label: "3晚"
        },
        {
          value: 4,
          label: "4晚"
        }
      ],
      personLims: [
        {
          value: 0,
          label: "无限制"
        },
        {
          value: 1,
          label: "1人"
        },
        {
          value: 2,
          label: "2人"
        },
        {
          value: 3,
          label: "3人"
        },
        {
          value: 4,
          label: "4人"
        }
      ],
      breakfasts: [
        {
          value: 0,
          label: "无早餐"
        },
        {
          value: 1,
          label: "1份"
        },
        {
          value: 2,
          label: "2份"
        },
        {
          value: 3,
          label: "3份"
        },
        {
          value: 4,
          label: "4份"
        }
      ],
      wirelessFidelitys: [
        {
          value: 0,
          label: "免费"
        },
        {
          value: 1,
          label: "未维护"
        }
      ],
      broadBands: [
        {
          value: 0,
          label: "免费"
        },
        {
          value: 1,
          label: "未维护"
        }
      ],
      options3: {},
      options4: {},
      formItem: {
        sellType: "2",
        id: this.$route.query.houseId,
        extendsParamOne: "T",
        hotelName: "",
        hotelId: this.$route.query.hotelId,
        modelName: "",
        nickName: "",
        hotelCode: "",
        linkMobileImg: "",
        bedType: "",
        floors: "",
        buildingArea: null,
        broadBand: null,
        wirelessFidelity: null,
        window: null,
        personLim: "",
        breakfast: "",
        modelDetail: "",
        orderBegDay: "",
        orderEndDay: "",
        dayBegTime: "",
        dayEndTime: "",
        noticeid: "",
        minBookDay: "",
        hotelConfinrm: "",
        earlyBookDay: "",
        earlyBookHour: "",
        earlyBookMinute: "",
        isRetreat: "F",
        retreatPeriodType: "",
        earlyDay: 1,
        earlyHour: 1,
        isRetreatAudit: "",
        tableList: [
          {
            startTime: "",
            endTime: "",
            // totalStockNum: "",
            retailPrice: "",
            costPrice: "",
            weeks: []
          }
        ],
        certificateWay: "0",
        isLimitBuy: "0",
        isLimitBuyDay: "",
        isLimitBuyDayAmount: "",
        isLimitBuyDayOrder: ""
      },
      dateOptions: [
        {
          startTimeOptions: {
            disabledDate: date => {
              return date && date.valueOf() < Date.now() - 86400000;
            }
          },
          endTimeOptions: {
            disabledDate: date => {
              return date && date.valueOf() < Date.now() - 86400000;
            }
          }
        }
      ],
      hotelId: this.$route.query.hotelId,
      houseId: this.$route.query.houseId,
      lyDay: "",
      types: "", // 判断是新添加还是修改
      ruleForm: {
        hotelName: [
          { required: true, message: "请填写酒店名称", trigger: "blur" }
        ],
        modelName: [
          { required: true, message: "请填写房型名称", trigger: "blur" }
        ],
        nickName: [
          { required: true, message: "请填写房型别名", trigger: "blur" }
        ],
        modelCode: [
          { required: true, message: "请填写房型编码", trigger: "blur" }
        ],
        extendsParamOne: [
          { required: true, message: "请选择是否电商核销", trigger: "change" }
        ],
        extendsParamTwo: [
          { required: true, message: "请选择电商编码", trigger: "blur" }
        ],
        bedType: [{ required: true, message: "请选择床型", trigger: "change" }],
        wirelessFidelity: [
          {
            type: "number",
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        broadBand: [
          {
            type: "number",
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        window: [
          { required: true, message: "请选择是否有窗", trigger: "change" }
        ],
        personLim: [
          {
            type: "number",
            required: true,
            message: "请选择限住人数",
            trigger: "change"
          }
        ],
        breakfast: [
          {
            type: "number",
            required: true,
            message: "请选择早餐",
            trigger: "change"
          }
        ],
        noticeid: [
          { required: true, message: "请填写预订须知", trigger: "blur" }
        ],
        modelDetail: [
          { required: true, message: "请填写房型说明", trigger: "blur" }
        ],
        linkMobileImg: [
          { required: true, message: "请选择房型主图", trigger: "blur" }
        ],
        earlyBookDay: [{ pattern: /^[0-9]\d*$/, message: "数据格式不正确" }],
        earlyBookHour: [{ pattern: /^[0-9]\d*$/, message: "数据格式不正确" }],
        earlyBookMinute: [{ pattern: /^[0-9]\d*$/, message: "数据格式不正确" }]
      },
      startOption: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      endOption: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now();
        }
      },
      ecCodeType: "",
      ecFlag: false
    };
  },
  created() {
    if (this.$route.query.hotelId && this.$route.query.houseId) {
      this.types = "edit";
      this.getRoom(); // 根据id修改
    } else {
      if (this.$route.query.hotelId && !this.$route.query.houseId) {
        this.types = "add";
        this.getHotel(this.$route.query.hotelId);
      }
    }
  },
  mounted() {},
  methods: {
    startTimeOpenChange(e, index) {
      const tableList = this.formItem.tableList;
      if (e) {
        if (tableList[index].endTime) {
          this.dateOptions[index].startTimeOptions = {
            disabledDate: date => {
              let endTime = new Date(tableList[index].endTime).valueOf();
              return (
                date &&
                (date.valueOf() > endTime ||
                  date.valueOf() < Date.now() - 86400000)
              );
            }
          };
        }
      }
    },
    endTimeOpenChange(e, index) {
      const tableList = this.formItem.tableList;
      if (e) {
        if (tableList[index].startTime) {
          this.dateOptions[index].endTimeOptions = {
            disabledDate: date => {
              let startTime = new Date(tableList[index].startTime).valueOf();
              return date && date.valueOf() < startTime;
            }
          };
        }
      }
    },
    selectAll(index) {
      this.formItem.tableList[index].weeks = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "0"
      ];
    },
    selectTime(index) {
      this.formItem.tableList[index].weeks = ["1", "2", "3", "4", "5"];
    },
    selectWeekend(index) {
      this.formItem.tableList[index].weeks = ["6", "0"];
    },
    add() {
      // console.log(this.formItem)
      this.formItem.tableList.push({
        startTime: "",
        endTime: "",
        // totalStockNum: "",
        weeks: [],
        costPrice: "",
        retailPrice: ""
      });
      this.dateOptions.push({
        startTimeOptions: {
          disabledDate: date => {
            return date && date.valueOf() < Date.now() - 86400000;
          }
        },
        endTimeOptions: {
          disabledDate: date => {
            return date && date.valueOf() < Date.now() - 86400000;
          }
        }
      });
    },
    del(index) {
      this.formItem.tableList.splice(index, 1);
      this.dateOptions.splice(index, 1);
      // this.$Message.error('请到该票型下的价格库存日历中删除库存！');
    },
    returnAllow(val) {
      if (val == "T") {
        this.formItem.retreatPeriodType = this.formItem.retreatPeriodType
          ? this.formItem.retreatPeriodType
          : "2";
        this.formItem.isRetreatAudit = this.formItem.isRetreatAudit
          ? this.formItem.isRetreatAudit
          : "F";
      }
    },
    setBegDate(time) {
      this.formItem.orderBegDay = time;

      // 重置结束时间规则
      this.endOption = {
        disabledDate(date) {
          return date && date.valueOf() < new Date(time).valueOf();
        }
      };

      // 先选择结束时间再次选择开始时间大于结束，将结束时间置空
      if (
        this.formItem.orderEndDay &&
        new Date(time).valueOf() > new Date(this.formItem.orderEndDay).valueOf()
      ) {
        this.formItem.orderEndDay = null;
      }
    },
    setEndDate(time) {
      console.log(time);
      this.formItem.orderEndDay = time;
      if (time) {
        let endTime = this.formItem.orderEndDay
          ? new Date(this.formItem.orderEndDay).valueOf() -
            1 * 24 * 60 * 60 * 1000
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
    selectCode(type) {
      this.ecCodeType = type;
      this.ecFlag = true;
    },
    getEcCode(code) {
      this.formItem[this.ecCodeType] = code;
    },
    // 根据id修改
    getRoom() {
      apiPost("/product/api/hotelPush/findHotelRoomById", {
        roomId: this.$route.query.houseId
      }).then(res => {
        if (res && res.data && res.status == 200) {
          res.data.retreatPeriodType = res.data.retreatPeriodType
            ? res.data.retreatPeriodType
            : "";
          // this.formItem = res.data;
          this.formItem.sellType = "2";
          this.formItem.hotelName = res.data.hotelName;
          this.formItem.modelName = res.data.modelName;
          this.formItem.nickName = res.data.nickName;
          this.formItem.modelCode = res.data.modelCode;
          this.formItem.extendsParamOne = res.data.extendsParamOne;
          this.formItem.bedType = res.data.bedType;
          this.formItem.buildingArea = res.data.buildingArea
            ? parseInt(res.data.buildingArea)
            : null;
          this.formItem.floors = res.data.floors;
          this.formItem.broadBand = res.data.broadBand;
          this.formItem.wirelessFidelity = res.data.wirelessFidelity;
          this.formItem.window = res.data.window;
          this.formItem.personLim = res.data.personLim;
          this.formItem.breakfast = res.data.breakfast;
          this.formItem.modelDetail = res.data.modelDetail;
          this.formItem.noticeid = res.data.noticeid;
          this.formItem.earlyBookDay = res.data.earlyBookDay;
          this.formItem.earlyBookHour = res.data.earlyBookHour;
          this.formItem.earlyBookMinute = res.data.earlyBookMinute;
          this.formItem.hotelCode = res.data.hotelCode;
          this.formItem.isRetreat = res.data.isRetreat;
          this.formItem.isRetreatAudit = res.data.isRetreatAudit;
          this.formItem.minBookDay = res.data.minBookDay;
          this.formItem.retreatPeriodType = res.data.retreatPeriodType;
          this.formItem.dayBegTime = res.data.dayBegTime;
          this.formItem.dayEndTime = res.data.dayEndTime;
          this.formItem.orderBegDay = res.data.orderBegDay;
          this.formItem.orderEndDay = res.data.orderEndDay;
          this.formItem.earlyHour = res.data.earlyHour;
          this.formItem.extendsParamTwo = res.data.extendsParamTwo;
          this.formItem.earlyDay = res.data.earlyDay;
          this.formItem.ruleBuyCode = res.data.ruleBuyCode;
          this.formItem.ruleSoldCode = res.data.ruleSoldCode;
          this.formItem.bookRuleId = res.data.bookRuleId;
          this.formItem.soldRuleId = res.data.soldRuleId;
          this.formItem.certificateWay = res.data.certificateWay
            ? res.data.certificateWay + ""
            : "";
          this.formItem.isLimitBuy = res.data.isLimitBuy + "";
          this.formItem.isLimitBuyDay = res.data.isLimitBuyDay
            ? res.data.isLimitBuyDay + ""
            : "";
          this.formItem.isLimitBuyDayOrder = res.data.isLimitBuyDayOrder
            ? res.data.isLimitBuyDayOrder + ""
            : "";
          this.formItem.isLimitBuyDayAmount = res.data.isLimitBuyDayAmount
            ? res.data.isLimitBuyDayAmount + ""
            : "";
          this.formItem.tableList = [];
          this.lyDay = res.data.lyDay;
          this.singleImgList = res.data.linkMobileImg
            ? res.data.linkMobileImg.split(",")
            : [];
          this.formItem.linkMobileImg = res.data.linkMobileImg
            ? res.data.linkMobileImg
            : "";
          this.hotelId = res.data.hotelId;
          this.bedTypeList = res.data.sysParamVoList;
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    setWapUrl(url) {
      this.formItem.linkMobileImg = url.join(",");
      this.$refs.formItem.validateField("linkMobileImg");
    },
    async getHotel(hotelId) {
      let hotelres = await apiPost("/product/api/hotelPush/findHotelById", {
        hotelId
      });
      this.formItem.hotelName = hotelres.data.hotelInfoVo.name;
      this.bedTypeList = hotelres.data.bedTypeList;
    },
    submit() {
      this.scrollError();
      let _this = this;

      let postParams = JSON.parse(JSON.stringify(this.formItem));
      // console.log('postParams',postParams)
      if (postParams.tableList && postParams.tableList.length > 0) {
        postParams.tableList.forEach((item, index) => {
          postParams.tableList[index].weeks = postParams.tableList[
            index
          ].weeks.join(",");
          postParams.tableList[index].startTime = this.filter.formatDate(
            this.common.changeDate(postParams.tableList[index].startTime),
            "yyyy-MM-dd"
          );
          postParams.tableList[index].endTime = this.filter.formatDate(
            this.common.changeDate(postParams.tableList[index].endTime),
            "yyyy-MM-dd"
          );
        });
        postParams.hotelRoomPriceJson = JSON.stringify(postParams.tableList);
      }
      // delete postParams.tableList;
      let url =
        this.types == "edit"
          ? "/product/api/hotelPush/saveEditHotelRoom"
          : "/product/api/hotelPush/saveNewHotelRoom";
      if (this.lyDay == "T") {
        // 选择时间的话，时间类型只能是一种,另外一个值就需要置空
        postParams.earlyHour = null;
      } else {
        postParams.earlyDay = null;
      }
      this.$refs.formItem.validate(async valid => {
        if (valid) {
          let res = await this.apiPost(url, postParams);
          if (res.status == 200) {
            let msg = res.message ? res.message : "操作成功!";
            _this.$Message.success(msg);
            this.$router.push("/hotelRoom?id=" + this.hotelId);
          } else {
            let msg = res.message ? res.message : "操作失败!";
            _this.$Message.warning(msg);
          }
        } else {
          setTimeout(function() {
            $("#content").scrollTop(
              $(".ivu-form-item-error").offset().top -
                90 +
                $("#content").scrollTop()
            );
          }, 500);
        }
      });
    },
    back() {
      this.$router.push("/hotelRoom?id=" + this.hotelId);
    },
    scrollError() {
      let errList = $(".ivu-form-item-error");
      if (errList.length > 0) {
        let scroll_offset = errList.eq(0).offset().top;
        $("#content").animate(
          {
            scrollTop: scroll_offset
          },
          300
        );
      }
    },
    changeWeeksData(e) {
      this.$forceUpdate();
    }
  },
  components: {
    myImg,
    ueditor,
    ecCode
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
.remark {
  color: red;
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
        text-align: center;
        .tr-img {
          height: 58px;
          width: 58px;
          margin: 0 auto;
          //   line-height: 80px;
          //   border: 1px dashed#ccc;
          //   border-radius: 5px;
          //   text-align: center;
          margin-bottom: 5px;
          img {
            width: 100%;
            height: 100%;
          }
        }
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
