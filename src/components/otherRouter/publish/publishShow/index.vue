<template>
  <div class="comboPublish-box">
    <div class="step">
      <Steps :current="1">
        <Step title="产品类型"></Step>
        <Step title="演出信息"></Step>
        <Step title="完成"></Step>
      </Steps>
    </div>
    <Form
      :model="formItem"
      label-position="right"
      :label-width="120"
      ref="formItem"
      :rules="ruleComplteForm"
    >
      <div id="base" class="form-title">基本信息</div>

      <FormItem label="景区：" prop="parkId">
        <Select
          v-model="formItem.parkId"
          style="width:180px"
          placeholder="请选择景区"
        >
          <Option
            v-for="(item, index) in parkList"
            :value="item.id"
            :key="index"
            >{{ item.name }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="商户：" prop="mchId">
        <Select
          v-model="formItem.mchId"
          style="width:180px"
          placeholder="请选择商户"
        >
          <Option
            v-for="(item, index) in mchList"
            :value="item.id"
            :key="index"
            >{{ item.mchName }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="演出票编码：" prop="code" v-if="isEdit">
        <Input
          v-model="formItem.code"
          style="width:33%;"
          disabled
          placeholder="请填写演出票编码"
        ></Input>
      </FormItem>
      <FormItem label="演出票编码：" v-else>
        <Input
          value="系统自动生成"
          disabled
          style="width:33%;"
          placeholder="请填写演出票编码"
        ></Input>
      </FormItem>
      <FormItem label="演出票名称：" prop="name">
        <Input
          v-model="formItem.name"
          style="width:33%;"
          placeholder="请填写演出票名称"
        ></Input>
      </FormItem>
      <FormItem label="别名：" prop="alias">
        <Input
          v-model="formItem.alias"
          style="width:33%;"
          placeholder="请填写演出票别名"
        ></Input>
      </FormItem>

      <FormItem label="价格模式：" prop="priceModel">
        <RadioGroup v-model="formItem.priceModel">
          <Radio label="0">
            <span>标准模式</span>
          </Radio>
          <Radio label="1">
            <span>提前订/当天订双价模式</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="是否电商核销：" prop="sysCheckFlag">
        <RadioGroup v-model="formItem.sysCheckFlag">
          <Radio label="T">
            <span>是</span>
          </Radio>
          <Radio label="F">
            <span>否</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <template
        v-if="formItem.priceModel == '0' && formItem.sysCheckFlag == 'T'"
      >
        <FormItem label="电商编码：" prop="todayThirdCode">
          <Input
            v-model="formItem.todayThirdCode"
            style="width:200px"
            disabled
            placeholder="请选择电商编码"
          ></Input>
          <Button type="primary" @click="selectCode('todayThirdCode')"
            >选择</Button
          >
        </FormItem>
      </template>
      <template
        v-if="formItem.priceModel == '1' && formItem.sysCheckFlag == 'T'"
      >
        <FormItem label="提前购电商编码：" prop="beforeThirdCode">
          <Input
            v-model="formItem.beforeThirdCode"
            style="width:200px"
            disabled
            placeholder="请选择提前购电商编码"
          ></Input>
          <Button type="primary" @click="selectCode('beforeThirdCode')"
            >选择</Button
          >
        </FormItem>
        <FormItem label="当天购电商编码：" prop="todayThirdCode">
          <Input
            v-model="formItem.todayThirdCode"
            style="width:200px"
            disabled
            placeholder="请选择当天购电商编码"
          ></Input>
          <Button type="primary" @click="selectCode('todayThirdCode')"
            >选择</Button
          >
        </FormItem>
      </template>

      <FormItem label="缩略图：" prop="linkMobileImg">
        <Input v-model="formItem.linkMobileImg" style="display:none"></Input>
        <my-img
          :limitNum="1"
          :uploadList="singleImgList"
          @getImgUrl="setWapUrl"
        ></my-img>
        <p>建议上传小于2M， 宽750px，高560px的JPG/PNG格式的图片</p>
      </FormItem>
      <FormItem label="详情介绍：">
        <ueditor v-model="formItem.ticketExplain"></ueditor>
      </FormItem>
      <FormItem label="销售时间：">
        <Row>
          <Col span="4">
            <DatePicker
              type="date"
              @on-change="startDateSet"
              v-model="formItem.orderBegDay"
              placeholder="请选择开始日期"
            ></DatePicker>
          </Col>
          <Col span="1" style="text-align: center">-</Col>
          <Col span="4">
            <DatePicker
              type="date"
              @on-change="endDateSet"
              v-model="formItem.orderEndDay"
              placeholder="请选择结束日期"
            ></DatePicker>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="使用有效期：">
        <Row>
          <Col span="4">
            <DatePicker
              type="date"
              @on-change="startTimeSet"
              v-model="formItem.startTime"
              placeholder="请选择开始时间"
            ></DatePicker>
          </Col>
          <Col span="1" style="text-align: center">-</Col>
          <Col span="4">
            <DatePicker
              type="date"
              @on-change="endTimeSet"
              v-model="formItem.endTime"
              placeholder="请选择结束时间"
            ></DatePicker>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="预订须知：">
        <ueditor v-model="formItem.bookExplain"></ueditor>
      </FormItem>
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
            @on-change="changeOrderNum('isLimitBuyDayOrder')"
          ></Input>
          <span>张或</span>
          <Input
            v-model="formItem.isLimitBuyDayOrder"
            @on-change="changeOrderNum('isLimitBuyDayAmount')"
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
            @on-change="changeOrderNum('isLimitBuyDayOrder')"
            style="width:200px;"
          ></Input>
          <span>张或</span>
          <Input
            v-model="formItem.isLimitBuyDayOrder"
            @on-change="changeOrderNum('isLimitBuyDayAmount')"
            style="width:200px;"
          ></Input>
          <span>个订单</span>
        </div>
      </FormItem>
      <FormItem label="退单是否允许：">
        <RadioGroup v-model="formItem.isRetreat">
          <!-- {{formItem.isRetreat}} -->
          <Radio label="F">
            <span>否</span>
          </Radio>
          <Radio label="T">
            <span>是</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <div v-if="formItem.isRetreat == 'T'">
        <FormItem label="退单时间限制：">
          <RadioGroup v-model="formItem.retreatPeriodType">
            <Radio label="0">
              <span>提前退</span>
            </Radio>
            <Radio label="1">
              <span>绝对日期前</span>
            </Radio>
            <Radio label="3">
              <span>游玩当天不可退</span>
            </Radio>
            <Radio label="2">
              <span>不限</span>
            </Radio>
          </RadioGroup>
        </FormItem>
      </div>
      <div
        v-if="formItem.isRetreat == 'T' && formItem.retreatPeriodType == '0'"
      >
        <FormItem label="提前：" label-position="left">
          <Input
            v-model="formItem.earlyDay"
            style="width:100px"
            :maxlength="8"
          ></Input>
          <span>天允许退（0代表游玩当天）</span>
        </FormItem>
      </div>
      <div
        v-if="formItem.isRetreat == 'T' && formItem.retreatPeriodType == '1'"
      >
        <FormItem label="截止：" label-position="left">
          <!-- <Input v-model="formItem.absoluteDate" style="width:100px" :maxlength="8"></Input> -->
          <DatePicker
            type="datetime"
            @on-change="absolutDateSet"
            :value="nowTime"
            placeholder="请选择截止日期"
          ></DatePicker>
        </FormItem>
      </div>
      <FormItem label="退单是否审核：" v-if="formItem.isRetreat == 'T'">
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
        <Button type="primary" @click="saveToNext" :loading="btnLoading">
          <template>
            提交
          </template>
        </Button>
        <Button
          v-if="isEdit"
          type="ghost"
          style="margin-left: 8px"
          @click="goback"
          >返回列表</Button
        >
        <Button v-else type="ghost" style="margin-left: 8px" @click="test"
          >取消</Button
        >
      </FormItem>
    </Form>

    <Modal v-model="model" title="查看模板">
      <p>
        您有新的演出订单，订单内容{OrderCode}，游玩日期{TravelDate}
        ，X份，实付金额XX，请即时处理。
      </p>
      <div slot="footer">
        <Button @click="templateCancel">关闭</Button>
      </div>
    </Modal>
    <ec-code v-model="ecFlag" @get-code="getEcCode"></ec-code>
  </div>
</template>
<script>
// import ueditor from "@/components/global/ueditor";
import ueditor from "@/components/global/vueUEditor";
import myImg from "@/components/global/singleImg";
import selectItem from "@/components/global/selectList";
import leaveWord from "@/components/global/leaveWord";
import { apiPost, apiGet, apiPostJson } from "@/fetch/api";
import ecCode from "./components/ecCode";
import store from "@/store";
export default {
  data() {
    return {
      ecFlag: false,
      ecCodeType: "",
      singleImgList: [],
      parkList: [],
      mchList: [],
      model: false,
      btnLoading: false,
      nowTime:
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate(),
      formItem: {
        parkId: "",
        mchId: "",
        code: "",
        name: "",
        alias: "",
        priceModel: "0",
        sysCheckFlag: "T",
        thirdCode: "",
        beforeThirdCode: "",
        todayThirdCode: "",
        ticketExplain: "",
        bookExplain: "",
        orderBegDay: "",
        orderEndDay: "",
        startTime: "",
        endTime: "",
        certificateWay: "0",
        isLimitBuy: "0",
        isLimitBuyDay: "",
        isLimitBuyDayAmount: "",
        isLimitBuyDayOrder: "",
        isRetreat: "F",
        isRetreatAudit: "F",
        msgTemplate: "",
        retreatPeriodType: "0",
        earlyDay: 0,
        absoluteDate: "",
        linkImg: ""
      },
      ruleComplteForm: {
        parkId: [
          {
            required: true,
            message: "请选择景区",
            trigger: "change",
            type: "number"
          }
        ],
        mchId: [
          {
            required: true,
            message: "请选择商户",
            trigger: "change",
            type: "number"
          }
        ],
        code: [
          { required: true, message: "请填写演出票编码", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请填写演出票名称", trigger: "blur" }
        ],
        alias: [
          { required: true, message: "请填写演出票别称", trigger: "blur" }
        ],
        priceModel: [
          { required: true, message: "请选择价格模式", trigger: "change" }
        ],
        sysCheckFlag: [
          { required: true, message: "请选择是否电商核销", trigger: "change" }
        ],
        linkMobileImg: [
          { required: true, message: "请选择缩略图", trigger: "blur" }
        ]
      },

      config: {
        initialFrameWidth: 800,
        initialFrameHeight: 200
      },
      isEdit: "",
      dataShow: false // 保证页面在有数据的情况下一定展示
    };
  },

  watch: {},
  mounted() {},
  methods: {
    startTimeSet(time) {
      this.formItem.startTime = time;
    },
    endTimeSet(time) {
      this.formItem.endTime = time;
    },
    startDateSet(time) {
      this.formItem.orderBegDay = time;
    },
    endDateSet(time) {
      this.formItem.orderEndDay = time;
    },
    absolutDateSet(time) {
      this.formItem.absoluteDate = time;
    },
    setWapUrl(imgArr) {
      this.formItem.linkImg = imgArr.join(",");
      this.formItem.linkMobileImg = imgArr.join(",");
      this.$refs.formItem.validateField("linkMobileImg");
    },
    selectCode(type) {
      this.ecCodeType = type;
      this.ecFlag = true;
    },
    getEcCode(code) {
      this.formItem[this.ecCodeType] = code;
    },
    //保存，下一步
    saveToNext() {
      let _this = this;
      this.btnLoading = true;

      let formParam = JSON.parse(JSON.stringify(this.formItem));
      formParam.startTime = formParam.startTime ? this.filter.formatDate(
        this.common.changeDate(formParam.startTime),
        "yyyy-MM-dd"
      ) : '';
      formParam.endTime = formParam.endTime ? this.filter.formatDate(
        this.common.changeDate(formParam.endTime),
        "yyyy-MM-dd"
      ) : '';
      formParam.orderBegDay = formParam.orderBegDay ? this.filter.formatDate(
        this.common.changeDate(formParam.orderBegDay),
        "yyyy-MM-dd"
      ) : '';
      formParam.orderEndDay = formParam.orderEndDay ? this.filter.formatDate(
        this.common.changeDate(formParam.orderEndDay),
        "yyyy-MM-dd"
      ) : '';
      this.$refs.formItem.validate(async valid => {
        this.scrollError();
        if (valid) {
          let url = "/product/api/showTicketApi/saveEdit";
          if (this.isEdit) {
            formParam.id = this.$route.query.id;
            delete formParam.createTime;
            delete formParam.modifyTime;
          }
          let res = await apiPost(url, formParam);
          if (res.success || res.status == 200) {
            _this.$Message.success("保存成功!");
            _this.$router.push("/ycList");
          } else {
            this.btnLoading = false;
            if (this.isEdit) {
              _this.$Message.warning("修改失败");
            } else {
              _this.$Message.warning("保存失败");
            }
          }
        } else {
          this.btnLoading = false;
          // 滚动到错误地方
          this.$nextTick(() => {
            setTimeout(function() {
              $("#content").scrollTop(
                $(".ivu-form-item-error").offset().top -
                  90 +
                  $("#content").scrollTop()
              );
            }, 500);
          });
          return;
        }
      });
    },
    getModal() {
      this.model = true;
    },
    templateCancel() {
      this.model = false;
    },
    //编辑
    getPageData() {
      apiPost(
        "/product/api/showTicketApi/edit?id=" + this.$route.query.id
      ).then(res => {
        this.initData(res);
      });
    },
    //获取商户景区等参数
    async getMchName() {
      this.$store.commit("showLoading");
      await this.apiPost("/product/api/showTicketApi/add").then(res => {
        if (res.success) {
          this.parkList = res.park;
          this.mchList = res.mch;
        }
      });
      this.$store.commit("hideLoading");
    },
    //初始化页面数据
    initData(res) {
      this.dataShow = true;
      if (res && res.data && (res.success || res.status == 200)) {
        this.formItem.parkId = res.data.parkId;
        this.formItem.mchId = res.data.mchId;
        this.formItem.code = res.data.code;
        this.formItem.name = res.data.name;
        this.formItem.alias = res.data.alias;
        this.formItem.priceModel = res.data.priceModel;
        this.formItem.sysCheckFlag = res.data.sysCheckFlag;
        this.formItem.thirdCode = res.data.thirdCode;
        this.formItem.beforeThirdCode = res.data.beforeThirdCode;
        this.formItem.todayThirdCode = res.data.todayThirdCode;
        this.formItem.ticketExplain = res.data.ticketExplain;
        this.formItem.bookExplain = res.data.bookExplain;
        this.formItem.orderBegDay = res.ruleBuy.orderBegDay;
        this.formItem.orderEndDay = res.ruleBuy.orderEndDay;
        this.formItem.startTime = res.ruleBuy.startTime;
        this.formItem.endTime = res.ruleBuy.endTime;
        this.formItem.isLimitBuyDay = res.ruleBuy.isLimitBuyDay;
        this.formItem.isLimitBuyDayAmount = res.ruleBuy.isLimitBuyDayAmount;
        this.formItem.isLimitBuyDayOrder = res.ruleBuy.isLimitBuyDayOrder;
        this.formItem.msgTemplate = res.data.msgTemplate;
        this.formItem.certificateWay = res.ruleBuy.certificateWay;
        this.formItem.isLimitBuy = res.ruleBuy.isLimitBuy + "";
        this.formItem.isRetreat = res.ruleSold.isRetreat;
        this.formItem.isRetreatAudit = res.ruleSold.isRetreatAudit
          ? res.ruleSold.isRetreatAudit
          : "F";
        this.formItem.retreatPeriodType = res.ruleSold.retreatPeriodType;
        this.formItem.earlyDay = res.ruleSold.earlyDay;
        this.formItem.absoluteDate = res.ruleSold.absoluteDate;
        this.singleImgList.push(res.data.linkMobileImg);
        this.formItem.linkMobileImg = res.data.linkMobileImg;
      } else {
        this.$Message.warning(res.message);
        return;
      }
    },
    test() {
      window.location.href = "/yclist";
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
    goback() {
      this.$router.back();
    },
    changeOrderNum(type) {
      this.formItem[type] = "";
    }
  },
  created() {
    this.getMchName();
    this.isEdit = this.$route && this.$route.query && this.$route.query.id;
    if (this.isEdit) {
      this.getPageData();
    }
  },
  components: {
    ueditor,
    myImg,
    selectItem,
    leaveWord,
    ecCode
  }
};
</script>
<style scope lang="scss">
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
.step-list {
  padding-top: 20px;
  display: inline-block;
  margin: 0 auto;
}

.step-list .step-item {
  display: inline-block;
  width: 160px;
  text-align: center;
  cursor: pointer;
  position: relative;
}

.step-list .step-item .line-img {
  position: absolute;
  top: 10px;
  left: 92px;
}

.step-list .step-item .line-img.line-nodo-img {
  top: 3px;
  width: 157px;
  left: 84px;
}

.step-list .step-item .step-title {
  margin-top: 10px;
  color: #19a2fe;
}

.step-list .step-item .step-img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.step-list .step-item .step-nodo {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-bottom: 9px;
}
.senicInfo {
  margin-top: 10px;
  display: inline-block;
  padding: 5px 10px;
  border: 1px solid rgba(35, 192, 250, 1);
  .address {
    color: #999;
  }
}
.comboPublish-box {
  .travellSubject {
    .subject-list {
      float: left;
      margin-right: 10px;
      .subject-list-item {
        display: inline-block;
        margin-right: 10px;
        position: relative;
        .subject-list-item-del {
          display: none;
          position: absolute;
          top: -5px;
          right: -5px;
          font-size: 14px;
          cursor: pointer;
        }
      }
      .subject-list-item:hover {
        .subject-list-item-del {
          display: inline-block;
        }
      }
    }
    .subject-input {
      float: left;
    }
  }
}
</style>
