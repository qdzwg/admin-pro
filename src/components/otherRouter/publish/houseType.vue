<template>
  <div class="houseType">
    <div class="step">
      <Steps :current="2">
        <Step title="产品类型"></Step>
        <Step title="酒店信息" class="step-back" style="cursor:pointer"></Step>
        <Step title="房型信息"></Step>
        <Step title="完成"></Step>
      </Steps>
    </div>
    <Form
      :model="formItem"
      label-position="right"
      required
      :label-width="120"
      ref="formItem"
      :rules="ruleComplteForm"
    >
      <div id="base" class="form-title">基本信息</div>
      <div>
        <FormItem label="房型名称：" prop="modelName">
          <Input
            v-model="formItem.modelName"
            style="width:33%"
            :maxlength="64"
          ></Input>
        </FormItem>
        <FormItem label="房型别名：" prop="nickName">
          <Input
            v-model="formItem.nickName"
            style="width:33%"
            :maxlength="64"
          ></Input>
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
            placeholder="请填写电商编码"
          ></Input>
          <Button type="primary" @click="selectCode('extendsParamTwo')"
            >选择</Button
          >
        </FormItem>
        <FormItem label="床型：" prop="bedType">
          <Select
            v-model="formItem.bedType"
            style="width:180px"
            placeholder="请选择床型"
          >
            <Option
              v-for="(item, index) in bedTypeList"
              :value="item.value"
              :key="index"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="房型面积：" prop="buildingArea">
          <Input
            v-model="formItem.buildingArea"
            style="width:180px;"
            placeholder="请填写房型面积"
          ></Input>
          <span>㎡</span>
        </FormItem>
        <FormItem label="楼层：" prop="floor">
          <Input
            v-model="formItem.floor"
            style="width:180px;"
            placeholder="请填写楼层"
          ></Input>
          <span>层</span>
        </FormItem>
        <FormItem label="宽带：" prop="broadBand">
          <Select
            v-model="formItem.broadBand"
            style="width:180px"
            placeholder="请选择宽带"
          >
            <Option
              v-for="(item, index) in broadBandList"
              :value="item.value"
              :key="index"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="WIFI：" prop="wirelessFidelity">
          <Select
            v-model="formItem.wirelessFidelity"
            style="width:180px"
            placeholder="请选择WIFI"
          >
            <Option
              v-for="(item, index) in wirelessFidelityList"
              :value="item.value"
              :key="index"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="是否有窗：" prop="window">
          <Select
            v-model="formItem.window"
            style="width:180px"
            placeholder="请选择"
          >
            <Option
              v-for="(item, index) in windowList"
              :value="item.value"
              :key="index"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="限住人数：" prop="personLim">
          <Select
            v-model="formItem.personLim"
            style="width:180px"
            placeholder="请选择"
          >
            <Option
              v-for="(item, index) in personLimList"
              :value="item.value"
              :key="index"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="早餐：" prop="breakfast">
          <Select
            v-model="formItem.breakfast"
            style="width:180px"
            placeholder="请选择"
          >
            <Option
              v-for="(item, index) in breakfastList"
              :value="item.value"
              :key="index"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="房型图片：" prop="linkMobileImg">
          <Input v-model="formItem.linkMobileImg" style="display:none"></Input>
          <my-img
            :limitNum="5"
            :uploadList="wapImgList"
            @getImgUrl="setWapListUrl"
          ></my-img>
          <p>
            最多上传5张，建议上传小于2M， 宽750px，高440px的JPG/PNG格式的图片
          </p>
        </FormItem>
        <FormItem label="房型说明：" prop="modelDetail">
          <ueditor v-model="formItem.modelDetail"></ueditor>
        </FormItem>
        <FormItem label="预订须知：" prop="noticeid">
          <ueditor v-model="formItem.noticeid"></ueditor>
        </FormItem>
        <div style="margin-left: 120px;">
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
                              @on-open-change="
                                startTimeOpenChange($event, index)
                              "
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
                      <CheckboxGroup v-model="item.weeks">
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
                      <Button
                        type="ghost"
                        @click="selectAll(index)"
                        size="small"
                        >全选</Button
                      >
                      <Button
                        type="ghost"
                        @click="selectTime(index)"
                        size="small"
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
      </div>

      <div id="rule" class="form-title">预订规则</div>
      <FormItem label="提前预订限制：">
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
        <template>
          在
          <DatePicker
            v-model="formItem.orderBegDay"
            @on-change="setBegDate"
            type="date"
            :options="options3"
            format="yyyy-MM-dd"
          ></DatePicker>
          <span>至</span>
          <DatePicker
            v-model="formItem.orderEndDay"
            @on-change="setEndDate"
            type="date"
            :options="options4"
            format="yyyy-MM-dd"
          ></DatePicker>
          期间内可预订
        </template>
      </FormItem>
      <FormItem label="预订时间限制：">
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
          <Option value="1">1晚</Option>
          <Option value="2">2晚</Option>
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

      <div id="tuigai" class="form-title">退改规则</div>
      <FormItem label="退单是否允许：">
        <Select
          @on-change="setDefault"
          v-model="formItem.isRetreat"
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
            v-if="lyDay == '0'"
            v-model="formItem.earlyDay"
            :min="1"
            :max="120"
          ></InputNumber>
          <InputNumber
            v-if="lyDay == '1'"
            v-model="formItem.earlyHour"
            :min="1"
            :max="120"
          ></InputNumber>
          <Select v-model="lyDay" style="width:100px">
            <Option value="0">天</Option>
            <Option value="1">小时</Option>
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
      <FormItem style="padding-bottom:5rem">
        <Button
          type="primary"
          :loading="saveLoading"
          @click="submit"
          style="width:8rem;"
          >保存</Button
        >
        <Button type="ghost" @click="back" style="margin-left: 8px"
          >取消</Button
        >
      </FormItem>
    </Form>
    <div class="fixed-box">
      <ul>
        <li>
          <a>快捷导航</a>
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('base')"
            >基本信息</a
          >
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('rule')"
            >预订规则</a
          >
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('tuigai')"
            >退改规则</a
          >
        </li>
        <li>
          <Button
            size="small"
            :loading="saveLoading"
            @click="submit"
            type="primary"
            >保存</Button
          >
          <!-- <Button size="small" @click="check" type="primary">验证</Button> -->
          <!-- <button type="button" class="btn btn-primary btn-primary-outline" onclick="goTicketPublish()">保存，下一步</button> -->
        </li>
      </ul>
    </div>
    <ec-code v-model="ecFlag" @get-code="getEcCode"></ec-code>
  </div>
</template>
<script>
import ueditor from "@/components/global/vueUEditor";
import myImg from "@/components/global/singleImg";
import { ecCode } from "@/components/otherRouter/hotelRoom/components";
export default {
  mounted() {
    $(".step-back").click(() => {
      this.$router.back(-1);
    });
  },
  data() {
    return {
      ecFlag: false,
      getEcCode: "",
      wapImgList: [],
      bedTypeList: [
        { value: "0", label: "单人床" },
        { value: "1", label: "大床" },
        { value: "2", label: "双床" },
        { value: "3", label: "子母床" },
        { value: "4", label: "圆床" },
        { value: "5", label: "三床" }
      ],
      broadBandList: [
        { value: "0", label: "免费" },
        { value: "1", label: "收费" },
        { value: "2", label: "无" }
      ],
      wirelessFidelityList: [
        { value: "0", label: "免费" },
        { value: "1", label: "收费" },
        { value: "2", label: "无" }
      ],
      windowList: [
        { value: "0", label: "有窗" },
        { value: "1", label: "无窗" }
      ],
      personLimList: [
        { value: "0", label: "无限制" },
        { value: "1", label: "1人" },
        { value: "2", label: "2人" },
        { value: "3", label: "3人" },
        { value: "4", label: "4人" }
      ],
      breakfastList: [
        { value: "0", label: "不含早" },
        { value: "1", label: "1份" },
        { value: "2", label: "2份" },
        { value: "3", label: "3份" },
        { value: "4", label: "4份" }
      ],
      saveLoading: false,
      trIndex: null,
      limitType: "any",
      isSelect: "F",
      earlyBook: "F",
      orderType: "F",
      orderdayType: "F",
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 200
      },
      formItem: {
        modelName: "", //房型名称
        nickName: "", //房型别名
        bedType: "", //床型
        buildingArea: "", //面积
        floor: "", //楼层
        broadBand: "", //宽带
        wirelessFidelity: "", //wifi
        window: "", //窗户
        personLim: "", //限住人数
        breakfast: "", //早餐
        linkMobileImg: "", //房型图片
        modelDetail: "", //房型说明
        noticeid: "", //预订须知
        extendsParamOne: "T", //是否电商核销
        hotelRoomPriceJson: "", //房型价格库存
        certificateWay: "0",
        isLimitBuy: "0",
        isLimitBuyDay: "",
        isLimitBuyDayAmount: "",
        isLimitBuyDayOrder: "",
        orderBegDay: "",
        orderEndDay: "",
        dayBegTime: "",
        dayEndTime: "",
        noticeid: "",
        minBookDay: "1",
        hotelConfinrm: "0",
        earlyBookDay: null,
        earlyBookHour: null,
        earlyBookMinute: null,
        isRetreat: "F",
        retreatPeriodType: "0",
        earlyDay: "",
        earlyHour: "",
        isRetreatAudit: "",
        sellType: "2",
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
        autoCheck: "F"
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
      options4: {},
      options3: {},
      lyDay: null,
      ruleComplteForm: {
        noticeid: [
          { required: true, message: "请填写预订须知", trigger: "blur" }
        ],
        modelName: [
          { required: true, message: "请填写房型名称", trigger: "blur" }
        ],
        nickName: [
          { required: true, message: "请填写房型别名", trigger: "blur" }
        ],
        extendsParamOne: [
          { required: true, message: "请选择是否电商核销", trigger: "change" }
        ],
        bedType: [{ required: true, message: "请选择床型", trigger: "change" }],
        // buildingArea: [
        //   { required: true, message: '请填写房型面积', trigger: 'blur' },
        // ],
        // floor: [
        //   { required: true, message: '请填写楼层', trigger: 'blur' },
        // ],
        broadBand: [
          { required: true, message: "请选择宽带", trigger: "change" }
        ],
        window: [
          { required: true, message: "请选择是否有窗", trigger: "change" }
        ],
        personLim: [
          { required: true, message: "请选择限住人数", trigger: "change" }
        ],
        breakfast: [
          { required: true, message: "请选择早藏", trigger: "change" }
        ],
        breakfast: [
          { required: true, message: "请选择早藏", trigger: "change" }
        ],
        linkMobileImg: [
          { required: true, message: "请选择房型图片", trigger: "blur" }
        ],
        modelDetail: [
          { required: true, message: "请填写房型说明", trigger: "blur" }
        ],
        noticeid: [
          { required: true, message: "请填写预订须知", trigger: "blur" }
        ],
        earlyBookDay: [{ pattern: /^[0-9]\d*$/, message: "数据格式不正确" }],
        earlyBookHour: [{ pattern: /^[0-9]\d*$/, message: "数据格式不正确" }],
        earlyBookMinute: [{ pattern: /^[0-9]\d*$/, message: "数据格式不正确" }]
      }
    };
  },

  methods: {
    selectCode(type) {
      this.ecCodeType = type;
      this.ecFlag = true;
    },
    getEcCode(code) {
      this.formItem[this.ecCodeType] = code;
    },
    setWapListUrl(imgArr) {
      this.formItem.linkMobileImg = imgArr.join(",");
      this.$refs.formItem.validateField("linkMobileImg");
    },
    startTimeOpenChange(e, index) {
      console.log(e, index);
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
      // this.formItem.tableList[index].weeks = "1, 2, 3, 4, 5, 6, 0"
    },
    selectTime(index) {
      this.formItem.tableList[index].weeks = ["1", "2", "3", "4", "5"];
      // this.formItem.tableList[index].weeks = "1, 2, 3, 4, 5"
    },
    selectWeekend(index) {
      this.formItem.tableList[index].weeks = ["6", "0"];
      // this.formItem.tableList[index].weeks = "6, 0"
    },
    setDefault(val) {
      if (val == "T") {
        this.formItem.retreatPeriodType = this.formItem.retreatPeriodType
          ? this.formItem.retreatPeriodType
          : "2";
        this.formItem.isRetreatAudit = this.formItem.isRetreatAudit
          ? this.formItem.isRetreatAudit
          : "F";
      }
    },
    hashClick(val) {
      $("#content").scrollTop(
        $("#" + val).offset().top - 63 + $("#content").scrollTop()
      );
    },

    setBegDate(time) {
      this.formItem.orderBegDay = time;
      this.options4 = {
        disabledDate: date => {
          let startTime = this.formItem.orderBegDay
            ? new Date(this.formItem.orderBegDay).valueOf()
            : "";
          return date && date.valueOf() < startTime;
        }
      };
    },
    setEndDate(time) {
      if (time) {
        this.formItem.orderEndDay = time;
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
    add() {
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
    test() {},
    back() {
      this.$router.back(-1);
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
    submit() {
      this.saveLoading = true;
      this.scrollError();
      let postParams = JSON.parse(JSON.stringify(this.formItem));
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

      delete postParams.tableList;
      let _this = this;
      let url = "/product/api/hotelPush/saveRooms";
      this.$refs.formItem.validate(async valid => {
        if (valid) {
          let res = await this.apiPost(url, postParams);
          if (res.status == 200) {
            let msg = res.message ? res.message : "保存成功!";
            _this.$Message.success(msg);
            window.location.href = "/hotelInfo";
          } else {
            let msg = res.message ? res.message : "保存失败!";
            _this.$Message.warning(msg);
            this.saveLoading = false;
          }
        } else {
          this.saveLoading = false;
          setTimeout(function() {
            $("#content").scrollTop(
              $(".ivu-form-item-error").offset().top -
                90 +
                $("#content").scrollTop()
            );
          }, 500);
        }
      });
    }
  },
  components: {
    ueditor,
    myImg,
    ecCode
  }
};
</script>
<style lang="scss">
.houseTypeIntroduce {
  width: 120px;
}
.table-item {
  position: relative;
  border-radius: 3px;
  .error-content {
    display: none;
    color: #ed3f14;
    position: absolute;
    left: 0px;
    top: 32px;
  }
}
.table-item.table-item-error {
  .error-content {
    display: inline;
  }
  .ivu-select {
    .ivu-select-selection {
      border-color: #ed3f14;
    }
  }
  .ivu-input {
    border-color: #ed3f14;
  }
  .ivu-input-number {
    border-color: #ed3f14;
  }
}
.houseType {
  width: 100%;
  .step {
    width: 60%;
    margin: 2.5rem auto;
  }

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

  .fixed-box {
    position: fixed;
    top: 40%;
    right: 24px;
    background: #ffffff;
    z-index: 1000;
    ul {
      list-style: none;
      li {
        text-align: center;
        width: 100px;
        button {
          width: 100%;
        }
        a {
          display: block;
          padding: 3px 7px;
          text-decoration: none;
          border-bottom: 1px solid #e2d5d5;
        }
      }
      li:first-child a {
        color: #ffffff;
        background: #0099ff;
      }
    }
    .btn-primary-outline {
      color: #5a98de;
      background-color: transparent;
      background-image: none;
      border-color: #5a98de;
    }
  }
}
</style>
