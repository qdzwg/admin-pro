<template>
  <div class="mealCoupon"
       id="mealCoupon">
    <div class="step"
         v-if="type!='edit'&&type!='add'">
      <Steps :current="2">
        <Step title="产品类型"></Step>
        <Step title="餐饮信息"
              class="step-back"
              style="cursor:pointer"></Step>
        <Step title="餐券信息"></Step>
        <Step title="完成"></Step>
      </Steps>
    </div>
    <Form :model="formItem"
          label-position="right"
          :label-width="130"
          ref="formItem"
          :rules="ruleForm">
      <div id="base"
           class="form-title">基本信息</div>
      <FormItem label="餐券名称："
                prop="name">
        <Input v-model="formItem.name"
               style="width:33%"
               placeholder="请输入餐券名称"
               :maxlength="20"></Input>
      </FormItem>
      <FormItem label="餐券别名：">
        <Input v-model="formItem.alias"
               style="width:33%"
               placeholder="名称构成:产品名称+数量+特色，例如“中午双人套餐"
               :maxlength="20"></Input>
      </FormItem>
      <!-- <FormItem label="虚拟销量：">
        <Input number
               v-model="formItem.displayedSales"
               @on-keyup="proveNum"
               style="width:33%"
               :max="2000"
               :maxlength="4"></Input>
      </FormItem> -->
      <FormItem label="餐券说明：">
        <Input v-model="formItem.description"
               type="textarea"
               placeholder="请填写餐券说明"
               style="width:33%"
               :maxlength="200"></Input>
      </FormItem>
      <template v-if="type=='edit'">
        <FormItem label="库存模式："
                  prop="stockMode">
          <Select v-model="formItem.stockMode"
                  style="width:200px"
                  disabled>
            <Option value="unlimit">无限库存</Option>
            <Option value="limit">有限库存</Option>
          </Select>
        </FormItem>
        <FormItem v-if="formItem.stockMode=='limit'"
                  label="总库存："
                  prop="totalStock">
          <Input number
                 v-model="formItem.totalStock"
                 @on-keyup="prove"
                 style="width:200px"
                 placeholder="总库存数量"
                 :maxlength="9"></Input>
          <span style="margin-left:10px;color:red">已售库存:{{stockNum}}</span>
        </FormItem>
      </template>
      <template v-else>
        <FormItem label="库存模式："
                  prop="stockMode">
          <Select v-model="formItem.stockMode"
                  style="width:200px">
            <Option value="unlimit">无限库存</Option>
            <Option value="limit">有限库存</Option>
          </Select>
        </FormItem>
        <FormItem v-if="formItem.stockMode=='limit'"
                  label="总库存："
                  prop="totalStock">
          <Input number
                 v-model="formItem.totalStock"
                 @on-keyup="prove"
                 style="width:200px"
                 placeholder="总库存数量"
                 :maxlength="9"></Input>

        </FormItem>
      </template>

      <FormItem label="成本价："
                prop="costPrice">
        <Input number
               v-model="formItem.costPrice"
               @on-keyup="proveCost"
               style="width:200px"
               :maxlength="8"></Input>
      </FormItem>
      <!-- <FormItem label="门市价："
                prop="rackPrice">
        <Input number
               v-model="formItem.rackPrice"
               @on-keyup="proveRack"
               style="width:200px"
               :maxlength="8"></Input>
      </FormItem> -->
      <FormItem label="零售价："
                prop="priceSettle">
        <Input number
               v-model="formItem.priceSettle"
               @on-keyup="proveSettle"
               style="width:200px"
               :maxlength="8"></Input>
      </FormItem>

      <div id="rules"
           class="form-title">预订规则</div>
      <!-- <FormItem label="提前预定限制：">
        <Select v-model="formItem.isAdvanceBooking" style="width:200px">
          <Option value="F">无限制</Option>
          <Option value="T">有限制</Option>
        </Select>

        <template v-if="formItem.isAdvanceBooking=='T'">
          需提前
          <FormItem prop="earlyBookDay" style="display:inline-block; width:100px;">
            <Input v-model="formItem.earlyBookDay" :max="30" :min="0" :maxlength="2"></Input>
          </FormItem>
          天，
          <FormItem prop="earlyBookHour" style="display:inline-block; width:100px;">
            <Input v-model="formItem.earlyBookHour" :max="24" :min="0" :maxlength="2"></Input>
          </FormItem>
          小时，
          <FormItem prop="earlyBookMinute" style="display:inline-block; width:100px;">
            <Input v-model="formItem.earlyBookMinute" :max="60" :min="0" :maxlength="2"></Input>
          </FormItem>
          分钟可预订
        </template>
      </FormItem> -->
      <FormItem label="预订日期限制：">
        <Select v-model="formItem.isBookingDateRestrict"
                style="width:200px;display:inline-block">
          <Option value="F">无限制</Option>
          <Option value="T">有限制</Option>
        </Select>
        <template v-if="formItem.isBookingDateRestrict=='T'">
          <span>在</span>
          <FormItem prop="orderBegDay"
                    style="width:120px;display:inline-block">
            <DatePicker :editable="false"
                        @on-change='setBegDate'
                        :options="startOption"
                        :value="formItem.orderBegDay"
                        type="date"
                        format="yyyy-MM-dd"></DatePicker>
          </FormItem>
          <span>至</span>
          <FormItem prop="orderEndDay"
                    style="width:120px;display:inline-block">
            <DatePicker :editable="false"
                        @on-change='setEndDate'
                        :options="endOption"
                        :value="formItem.orderEndDay"
                        type="date"
                        format="yyyy-MM-dd"></DatePicker>
          </FormItem>
          <span>期间内可预订</span>
        </template>
      </FormItem>

      <FormItem label="预订时间限制：">
        <Select v-model="formItem.isBookingTimeRestrict"
                style="width:200px">
          <Option value="F">无限制</Option>
          <Option value="T">有限制</Option>
        </Select>
        <template v-if="formItem.isBookingTimeRestrict=='T'">
          <span>在</span>
          <FormItem prop="dayBegTime"
                    style="width:120px;display:inline-block">
            <TimePicker :editable="false"
                        v-model="formItem.dayBegTime"
                        format="HH:mm"></TimePicker>
          </FormItem>
          <span>至</span>
          <FormItem prop="dayEndTime"
                    style="width:120px;display:inline-block">
            <TimePicker :editable="false"
                        v-model="formItem.dayEndTime"
                        format="HH:mm"></TimePicker>
          </FormItem>
          <span>时间内可预订</span>
        </template>
      </FormItem>
      <!--宋城新增-->
      <!-- <FormItem label="出游人证件：">        
        <RadioGroup v-model="formItem.certificateWay">
          <Radio label="0">
            <span>全填</span>
          </Radio>
          <Radio label="1">
            <span>选填</span>
          </Radio>
        </RadioGroup>        
      </FormItem> -->
      <FormItem label="购票限制：">
        <!-- {{formItem.bookLimit}} -->
        <RadioGroup v-model="formItem.isLimitBuy">
          <Radio label="0">
            <span>无</span>
          </Radio>
          <!-- <Radio label="1">
            <span>身份证限制</span>
          </Radio> -->
          <Radio label="2">
            <span>手机号限制</span>
          </Radio>
        </RadioGroup>
        <!-- <div
          v-if="formItem.isLimitBuy=='1'"
         
        >
          <span>同一身份证限制</span>
          <Input v-model="formItem.isLimitBuyDay"
               style="width:200px;"></Input>
          <span>天内最多可购买</span>
          <Input v-model="formItem.isLimitBuyDayAmount"
               style="width:200px;"></Input>
               <span>张或</span>
               <Input v-model="formItem.isLimitBuyDayOrder"
               style="width:200px;"></Input>
               <span>个订单</span>
        </div> -->
        <div v-if="formItem.isLimitBuy=='2'">
          <span>同一手机号限制</span>
          <Input v-model="formItem.isLimitBuyDay"
               style="width:200px;"></Input>
          <span>天内最多可购买</span>
          <Input v-model="formItem.isLimitBuyDayAmount"
               style="width:200px;"></Input>
               <span>张或</span>
               <Input v-model="formItem.isLimitBuyDayOrder"
               style="width:200px;"></Input>
               <span>个订单</span>
        </div>
      </FormItem>
      <!-- <FormItem label="预订数量限制："> -->
      <!-- <Select  v-model="formItem.hotelConfinrm" style="width:200px">
                <Option value="0">是</Option>
                <Option value="1">否</Option>
              </Select> -->
      <!-- <template >
                    每个
                <Select  v-model="formItem.hotelConfinrm" style="width:150px">
                    <Option value="0">手机号</Option>
                    <Option value="1">身份证号</Option>
                    <Option value="2">身份证号+手机号</Option>
                </Select>
                <Select  v-model="formItem.hotelConfinrm" style="width:150px">
                    <Option value="0">整个销售时间段</Option>
                    <Option value="1">每日</Option>
                    <Option value="2">每周</Option>
                    <Option value="3">每月</Option>
                    <Option value="4">每三月</Option>
                </Select>
                限购
                <Input style="width:100px"></Input>
               <Select  v-model="formItem.hotelConfinrm" style="width:100px">
                    <Option value="0">张票</Option>
                    <Option value="1">笔订单</Option>
                </Select>   
                </template>
          </FormItem> -->
      <div id="validationRule"
           class="form-title">验证规则</div>
      <FormItem label="验证星期限制："
                prop="checkAllGroup">
        <CheckboxGroup v-model="formItem.checkAllGroup"
                       style="display:inline-block">
          <Checkbox label="1">一</Checkbox>
          <Checkbox label="2">二</Checkbox>
          <Checkbox label="3">三</Checkbox>
          <Checkbox label="4">四</Checkbox>
          <Checkbox label="5">五</Checkbox>
          <Checkbox label="6">六</Checkbox>
          <Checkbox label="0">日</Checkbox>
        </CheckboxGroup>
        <div style="display:inline-block">
          <a @click="selectTime"
             style="margin-left:20px;">工作日</a>
          <a @click="selectWeekend"
             style="margin:0 20px;">周末</a>
          <a @click="selectWeekAll">全选</a>
        </div>
      </FormItem>
      <FormItem label="验证日期限制："
                required>
        <Row>
          <Col span="3">
          <FormItem prop='checkBegDay'>
            <DatePicker :editable="false"
                        :value="formItem.checkBegDay"
                        @on-change="setBegDate2"
                        type="date"
                        :options="options3"
                        format="yyyy-MM-dd"></DatePicker>
          </FormItem>
          </Col>
          <Col span="1"
               style="text-align: center">至</Col>
          <Col span="3">
          <FormItem prop='checkEndDay'>
            <DatePicker :editable="false"
                        :value="formItem.checkEndDay"
                        @on-change="setEndDate2"
                        type="date"
                        :options="options4"
                        format="yyyy-MM-dd"></DatePicker>
          </FormItem>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="延时验证限制：">
        <Select v-model="formItem.isDelayedRestrict"
                style="width:200px">
          <Option value="F">无限制</Option>
          <Option value="T">有限制</Option>
        </Select>
        <template v-if="formItem.isDelayedRestrict=='T'">
          <span>下单</span>
          <FormItem prop="checkHour"
                    style="width:120px;display:inline-block">
            <Input style="width:100px"
                   v-model="formItem.checkHour"
                   :min="0"
                   :max="720"
                   number
                   :maxlength="3"></Input>
          </FormItem>
          <span>小时，</span>
          <FormItem prop="checkMinute"
                    style="width:120px;display:inline-block">
            <Input style="width:100px"
                   v-model="formItem.checkMinute"
                   :min="0"
                   :max="59"
                   number
                   :maxlength="2"></Input>
          </FormItem>
          <span>分钟后可验证</span>
        </template>

      </FormItem>
      <FormItem label="过期自动完结：">
        <Select v-model="checkDay"
                style="width:200px">
          <Option value="F">无限制</Option>
          <Option value="T">有限制</Option>
        </Select>
        <template v-if="checkDay=='T'">
          <span style="margin-right:10px;">订单过了有效期</span>
          <FormItem prop="checkRelativeDay"
                    style="display:inline-block">
            <Input v-model="formItem.checkRelativeDay"
                   number
                   :maxlength="2"
                   style="width:100px;"></Input>
          </FormItem>
          <span style="margin-left:10px;">天后系统自动检票</span>
          <p style="color:red">备注：有效期取下单时该餐券的有效期</p>
        </template>

      </FormItem>

      <div id="backRule"
           class="form-title">退改规则</div>

      <FormItem label="退单是否允许：">
        <RadioGroup v-model="formItem.isRetreat">
          <Radio label="F">否</Radio>
          <Radio label="T">是</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="退单是否审核：">
        <RadioGroup v-model="formItem.isRetreatAudit">
          <Radio label="F">否</Radio>
          <Radio label="T">是</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="过期是否可退：">
        <RadioGroup v-model="formItem.isExpiredRetreat">
          <Radio label="F">否</Radio>
          <Radio label="T">是</Radio>
        </RadioGroup>
      </FormItem>
      <div id="products"
           class="form-title">商品详情</div>
      <template v-if="dataShow">
        <FormItem label="预订须知："
                  prop="bookingNotice">
          <!-- <ueditor id="ue2"
                   ref="mustKnow"
                   :content="formItem.bookingNotice"
                   :config="config"></ueditor> -->
          <ueditor v-model="formItem.bookingNotice"></ueditor>
        </FormItem>
        <FormItem label="图文详情："
                  prop="introduction">
          <!-- <ueditor id="ue7"
                   ref="mustKnow7"
                   :content="formItem.introduction"
                   :config="config"></ueditor> -->
          <ueditor v-model="formItem.introduction"></ueditor>
        </FormItem>
      </template>

      <FormItem label="缩略图："
                prop="thumbnail">
        <Input v-model="formItem.thumbnail"
               style="display:none"></Input>
          <my-img :limitNum="1" 
          :uploadList="singleImgList"
          @getImgUrl="setWapUrl"></my-img>
        <!-- <up-img :limitNum="1"
                :uploadList="singleImgList"
                @getImgUrl="setWapUrl"></up-img> -->
        <p>建议上传小于2M， 宽750px，高560px的JPG/PNG格式的图片</p>
      </FormItem>
      <FormItem>
        <div class="save-cancel">
          <Button type="primary"
                  @click="submit"
                  :loading='btnLoading'>保存</Button>
          <Button v-if="type!='edit'&&type!='add'"
                  type="ghost"
                  @click="back"
                  style="margin-left: 8px">取消</Button>
          <Button v-else
                  type="ghost"
                  @click="back2"
                  style="margin-left: 8px">返回列表</Button>
        </div>
      </FormItem>
    </Form>
    <div class="fixed-box">
      <ul>
        <li>
          <a>快捷导航</a>
        </li>
        <li>
          <a href="javascript:;"
             class="tartg-a"
             @click="hashClick('base')">基本信息</a>
        </li>
        <li>
          <a href="javascript:;"
             class="tartg-a"
             @click="hashClick('rules')">预订规则</a>
        </li>
        <li>
          <a href="javascript:;"
             class="tartg-a"
             @click="hashClick('validationRule')">验证规则</a>
        </li>
        <li>
          <a href="javascript:;"
             class="tartg-a"
             @click="hashClick('backRule')">退改规则</a>
        </li>
        <li>
          <a href="javascript:;"
             class="tartg-a"
             @click="hashClick('products')">商品详情</a>
        </li>
        <li>
          <Button size="small"
                  :loading='btnLoading'
                  @click="submit"
                  type="primary">保存</Button>
          <!-- <button type="button" class="btn btn-primary btn-primary-outline" onclick="goTicketPublish()">保存，下一步</button> -->
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
// import ueditor from "@/components/global/ueditor";
import ueditor from '@/components/global/vueUEditor';
import store from "@/store";
import { apiPost, apiGet } from "@/fetch/api";
import myImg from '@/components/global/singleImg';
// import quillEditor from "@/components/global/vueQuillEditor";

export default {
 
  data () {
    const validateNum = (rule, value, callback) => {
      if (value > 99999) {
        callback(new Error("最大值99999"));
      } else {
        callback();
      }
    };
    const validateNum2 = (rule, value, callback) => {
      if (value > 999999) {
        callback(new Error("最大值999999"));
      } else {
        callback();
      }
    };
    return {
      type: "",
      singleImgList: [],
      orderType: "F",
      orderdayType: "F",
      earlyBook: "F",
      btnLoading: false,
      timeShow: true,
      timeShow2: true,
      options3: {},
      options4: {},
      config: {
        initialFrameWidth: 800,
        initialFrameHeight: 200
      },
      dataShow: false, //保证页面在有数据的情况下一定展示
      stockNum: 0, //保存已售库存
      formItem: {
        isLimitBuy: '0',
        isLimitBuyDay: '',
        isLimitBuyDayAmount: '',
        isLimitBuyDayOrder: '',
        certificateWay: '0',
        checkAllGroup: [],
        eateryId: "",
        couponId: "",
        name: "", //餐券名称
        alias: "", //餐券别名
        thumbnail: "", //主图
        displayedSales: null, //虚拟销量
        stockMode: "unlimit", //库存模式
        description: "", //餐券说明
        costPrice: "", //成本价
        rackPrice: "0", //门市价
        priceSettle: "", //零售价
        isAdvanceBooking: "F", //提前预定限制
        isBookingDateRestrict: "F", //预订日期限制
        isBookingTimeRestrict: "F", //预订时间限制
        checkWeekDay: "", //验证星期限制
        orderBegDay: null,
        orderEndDay: null,
        dayBegTime: "",
        dayEndTime: "",
        noticeid: "",
        totalStock: null,
        earlyBookDay: null,
        earlyBookHour: null,
        earlyBookMinute: null,
        checkBegDay: null,
        checkEndDay: null,
        isDelayedRestrict: "F",
        checkHour: null,
        checkMinute: null,
        checkRelativeDay: null,
        isRetreat: "T",
        isRetreatAudit: "F",
        isExpiredRetreat: "F",
        merchantDisplayedSales: 10 //店铺虚拟销量
      },
      checkDay: 'F',
      ruleForm: {
        name: [{ required: true, message: "请填写餐券名称", trigger: "blur" }],
        costPrice: [
          {
            required: true,
            type: "number",
            message: "请填写成本价"
          },
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: "数据格式不正确"
          },
          {
            validator: validateNum,
            message: "数值不能大于99999"
          }
        ],
        rackPrice: [
          {
            required: true,
            type: "number",
            message: "请填写门市价"
          },
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: "数据格式不正确"
          },
          {
            validator: validateNum,
            message: "数值不能大于99999"
          }
        ],
        priceSettle: [
          {
            required: true,
            type: "number",
            message: "请填写零售价"
          },
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: "数据格式不正确"
          },
          {
            validator: validateNum,
            message: "数值不能大于99999"
          }
        ],
        noticeid: [
          { required: true, message: "请填写预订须知", trigger: "blur" },
          { max: 2000, message: "字数应在2000以内" }
        ],
        stockMode: [
          { required: true, message: "请选择库存模式", trigger: "change" }
        ],
        totalStock: [
          {
            required: true,
            type: "number",
            message: "请填写库存数量",
            trigger: "blur"
          },
          {
            validator: validateNum2,
            message: "数值不能大于999999"
          }
        ],
        checkAllGroup: [
          {
            required: true,
            type: "array",
            message: "请选择验证星期"
          }
        ],
        checkBegDay: [
          {
            required: true,
            message: "请选择验证日期",
            trigger: "change"
          }
        ],
        checkEndDay: [
          {
            required: true,
            message: "请选择验证日期",
            trigger: "change"
          }
        ],
        orderBegDay: [
          {
            required: true,
            message: "请选择预订日期",
            trigger: "change"
          }
        ],
        orderEndDay: [
          {
            required: true,
            message: "请选择预订日期",
            trigger: "change"
          }
        ],
        dayBegTime: [
          {
            required: true,
            message: "请选择预订时间",
            trigger: "change"
          }
        ],
        dayEndTime: [
          {
            required: true,
            message: "请选择预订时间",
            trigger: "change"
          }
        ],
        thumbnail: [
          { required: true, message: "请选择缩略图", trigger: "blur" }
        ],
        introduction: [
          { required: true, message: "请填写图文详情", trigger: "blur" }
        ],
        bookingNotice: [
          { required: true, message: "请填写预订须知", trigger: "blur" }
        ],
        checkHour: [
          { required: true, message: "不能为空" },
          { pattern: /^[0-9]\d*$/, message: "数据格式不正确" },
          { type: "number", max: 720, message: "最大值720" }
        ],
        checkMinute: [
          { required: true, message: "不能为空" },
          { pattern: /^[0-9]\d*$/, message: "数据格式不正确" },
          { type: "number", max: 59, message: "最大值59" }
        ],
        checkRelativeDay: [
          { required: true, message: "不能为空" },
          { pattern: /^[0-9]\d*$/, message: "数据格式不正确" },
          { type: "number", max: 30, message: "最大值30" }
        ]
      },
      startOption: {},
      endOption: {}
    };
  },
  created () {
    let _this = this;
    if (this.$route.query.id) {
      this.type = "edit";
      apiGet(
        "/product/api/repastProduct/queryCouponInfo?couponId=" +
        this.$route.query.id
      ).then(res => {
        if (res.status == 200) {
          res.data.checkAllGroup = res.data.checkWeekDay
            ? res.data.checkWeekDay.split(",")
            : "";
          res.data.isExpiredRetreat = res.data.isExpiredRetreat
            ? res.data.isExpiredRetreat
            : "F";
          res.data.isDelayedRestrict = res.data.isDelayedRestrict
            ? res.data.isDelayedRestrict
            : "F";
          res.data.isBookingDateRestrict = res.data.isBookingDateRestrict
            ? res.data.isBookingDateRestrict
            : "F";

          if (res.data && (res.data.checkRelativeDay || res.data.checkRelativeDay == 0)) {
            this.checkDay = 'T'
          }
          this.formItem = res.data;
          this.formItem.couponId = this.$route.query.id;
          this.formItem.isRetreatAudit = res.data.isRetreatAudit ? res.data.isRetreatAudit : "F";
          this.formItem.isLimitBuy = res.data.isLimitBuy ? res.data.isLimitBuy + '' : '';
          this.formItem.isRetreat = res.data.isRetreat ? res.data.isRetreat : "T";
          if (res.data &&(res.data.totalStock || res.data.totalStock == 0) &&(res.data.leftStockNum || res.data.leftStockNum == 0)) {
            this.stockNum = res.data.totalStock - res.data.leftStockNum;
          }
          // this.formItem.checkAllGroup =res.data.checkWeekDay?res.data.checkWeekDay.split(","):[]

          this.singleImgList.push(res.data.thumbnail);
        }
        this.dataShow = true;
        this.$nextTick(function () {
          _this.hashClick("base");
        });
      });
    } else if (this.$route.query.eateryId) {
      this.dataShow = true;
      this.type = "add";
      this.formItem.eateryId = this.$route.query.eateryId;
      this.$nextTick(function () {
        _this.hashClick("base");
      });
    } else {
      this.dataShow = true;
      this.type = "";
      this.$nextTick(function () {
        _this.hashClick("mealCoupon");
      });
    }
  },
  mounted () {
    $(".step-back").click(() => {
      this.$router.back(-1);
    });
  },
  methods: {
    prove () {
      if (this.formItem.totalStock.length) {
        this.formItem.totalStock = this.formItem.totalStock.replace(
          /[^\.\d]/g,
          ""
        );
      }
    },
    proveNum () {
      if (this.formItem.displayedSales.length) {
        this.formItem.displayedSales = this.formItem.displayedSales.replace(
          /[^\.\d]/g,
          ""
        );
      }
    },
    proveCost () {
      if (this.formItem.costPrice.length) {
        this.formItem.costPrice = this.formItem.costPrice.replace(
          /[^\.\d]/g,
          ""
        );
      }
    },
    proveRack () {
      if (this.formItem.rackPrice.length) {
        this.formItem.rackPrice = this.formItem.rackPrice.replace(
          /[^\.\d]/g,
          ""
        );
      }
    },
    proveSettle () {
      if (this.formItem.priceSettle.length) {
        this.formItem.priceSettle = this.formItem.priceSettle.replace(
          /[^\.\d]/g,
          ""
        );
      }
    },
    hashClick (val) {
      $("#content").scrollTop(
        $("#" + val).offset().top - 63 + $("#content").scrollTop()
      );
    },
    selectTime () {
      this.formItem.checkAllGroup = ["1", "2", "3", "4", "5"];

      this.$refs.formItem.validateField("checkAllGroup");
      //   this.timeShow = !this.timeShow;
    },
    selectWeekend () {
      this.formItem.checkAllGroup = ["6", "0"];

      this.$refs.formItem.validateField("checkAllGroup");
      //   this.timeShow2 = !this.timeShow2;
    },
    selectWeekAll () {
      this.formItem.checkAllGroup = ["1", "2", "3", "4", "5", "6", "0"];

      this.$refs.formItem.validateField("checkAllGroup");
    },
    setBegDate2 (time) {
      let _this = this;
      this.formItem.checkBegDay = time;
      this.options4 = {
        disabledDate (date) {
          let startTime = _this.formItem.checkBegDay
            ? new Date(_this.formItem.checkBegDay).valueOf() -
            1 * 24 * 60 * 60 * 1000
            : "";
          return date && date.valueOf() < startTime;
        }
      };
    },
    setEndDate2 (time) {
      if (time) {
        let _this = this;
        this.formItem.checkEndDay = time;
        let endTime = this.formItem.checkEndDay
          ? new Date(this.formItem.checkEndDay).valueOf()
          : "";
        this.options3 = {
          disabledDate (date) {
            return date && date.valueOf() > endTime;
          }
        };
      } else {
        this.options3 = {
          disabledDate (date) {
            return false;
          }
        };
      }
    },
    setBegDate (time) {
      this.formItem.orderBegDay = time;
      // 重置结束时间规则
      this.endOption = {
        disabledDate: date => {
          let startTime = this.formItem.orderBegDay
            ? new Date(this.formItem.orderBegDay).valueOf() -
            1 * 24 * 60 * 60 * 1000
            : "";
          return date && date.valueOf() < startTime;
        }
      };
    },
    setEndDate (time) {
      if (time) {
        this.formItem.orderEndDay = time;
        let endTime = this.formItem.orderEndDay
          ? new Date(this.formItem.orderEndDay).valueOf() -
          1 * 24 * 60 * 60 * 1000
          : "";
        this.startOption = {
          disabledDate (date) {
            return date && date.valueOf() > endTime;
          }
        };
      } else {
        this.startOption = {
          disabledDate (date) {
            return false;
          }
        };
      }
    },
    setWapUrl (url) {
      console.log('urlurl', url)
      this.formItem.thumbnail = url[0];
      this.$refs.formItem.validateField("thumbnail");
    },
    submit () {
      let _this = this;
      if (this.formItem.checkAllGroup) {
        this.formItem.checkWeekDay =
          this.formItem.checkAllGroup.length > 0
            ? this.formItem.checkAllGroup.join(",")
            : "";
      }

      // this.formItem.introduction = this.$refs.mustKnow7
      //   ? this.$refs.mustKnow7.getUEContent()
      //   : "";
      // this.$refs.formItem.validateField("introduction");
      // this.formItem.bookingNotice = this.$refs.mustKnow
      //   ? this.$refs.mustKnow.getUEContent()
      //   : "";
      // this.$refs.formItem.validateField("bookingNotice");
      this.formItem.alias = this.formItem.alias
        ? this.formItem.alias
        : this.formItem.name;
      this.btnLoading = true;
      setTimeout(function () {
        _this.btnLoading = false;
      }, 3000);
      this.$refs.formItem.validate(async valid => {
        this.scrollError();
        if (valid) {
          let url = "";
          if (this.type == "edit") {
            url = "/product/api/repastProduct/editCouponSave";
          } else if (this.type == "add") {
            url = "/product/api/repastProduct/addCouponSave";
          } else {
            url = "/product/api/RepastPush/saveCoupon";
          }
          let res = await apiPost(url, this.formItem);
          if (res.status == 200) {
            _this.$Message.success("保存成功!");
            if (this.type != "edit" && this.type != "add") {
              window.location.href = '/cateringList';
                
            } else {
              this.$router.push("/cateringList");
            }
          } else {
            this.btnLoading = false;
            _this.$Message.warning(res.message);
          }
        } else {
          setTimeout(function () {
            $("#content").scrollTop(
              $(".ivu-form-item-error").offset().top -
              90 +
              $("#content").scrollTop()
            );
          }, 500);
        }
      });
    },
    back () {
      window.location.href =
        window.location.href.split("/manage")[0] +
        "/admin/index#/product/parkPublish/selectProduct";
    },
    back2 () {
      this.$router.back(-1);
    },
    scrollError () {
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
    }
  },
  components: {
    ueditor,
    myImg
    // quillEditor
  }
};
</script>
<style lang="scss">
.mealCoupon {
  width: 100%;
  .ql-container {
    height: 150px;
  }
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
  .remark {
    color: red;
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
          color: #000;
          padding: 3px 7px;
          text-decoration: none;
          border-bottom: 1px solid #e2d5d5;
        }
        a.active {
          color: #2d8cf0;
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
  .save-cancel {
    padding-bottom: 50px;
  }
}
</style>

