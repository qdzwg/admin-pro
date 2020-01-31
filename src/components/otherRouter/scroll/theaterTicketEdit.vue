<template>
  <div class="theater-ticket-edit">
    <Form
      :model="formItem"
      label-position="right"
      :label-width="145"
      ref="formItem"
      :rules="ruleComplteForm"
    >
      <div id="base" class="form-title">基本信息</div>
      <FormItem label="景点名称：" prop="name">
        <Input v-model="formItem.name" style="width:33%" :maxlength="64"></Input>
      </FormItem>
      <FormItem label="票型名称：" prop="name">
        <Input v-model="formItem.name" style="width:33%" :maxlength="64"></Input>
      </FormItem>
      <FormItem label="外部编码：">
        <Input v-model="formItem.code" style="width:33%" :maxlength="64"></Input>
      </FormItem>
      <FormItem label="票型价格：">
        <Input v-model="formItem.code" style="width:33%" :maxlength="64"></Input>
      </FormItem>
      <FormItem label="票型类型：" prop="enabled">
        <Select v-model="formItem.enabled" style="width:200px">
          <Option value="T">上架</Option>
          <Option value="F">下架</Option>
        </Select>
      </FormItem>
      <FormItem label="票型说明：">
        <Input v-model="formItem.code" style="width:33%" :maxlength="64"></Input>
      </FormItem>
      <FormItem label="是否立即上架：" prop="enabled">
        <Select v-model="formItem.enabled" style="width:200px">
          <Option value="T">上架</Option>
          <Option value="F">下架</Option>
        </Select>
      </FormItem>
      <FormItem label="缩略图：">
        <Input v-model="formItem.linkMobileImg" style="display:none"></Input>
        <my-img :limitNum="1" :uploadList="singleImgList" @getImgUrl="setWapUrl"></my-img>
        <p>建议上传小于1M， 宽750px，高560px的JPG/PNG格式的图片</p>
      </FormItem>
      <div id="bookingRule" class="form-title">预订规则</div>
      <FormItem label="可购时间限制：">
        <RadioGroup class="time-limit">
          <Radio label="1">
            <span>不限</span>
          </Radio>
          <Radio label="2">
            <div class="time-limit-content">
              <span style="margin-right:5px">最近可购</span>
              <Input style="width:33%" :maxlength="64"></Input>
              <span style="margin-left:5px">天</span>
              <span style="margin-left:10px">（控制预订开始时间，当为1时则当天可预订）</span>
            </div>
          </Radio>
          <Radio label="3">
            <div class="time-limit-content">
              <span style="margin-right:5px">可够时间段限制</span>
              <DatePicker
                v-model="formItem.startDate"
                @on-change="setBegDate"
                type="date"
                :options="options3"
                format="yyyy-MM-dd"
              ></DatePicker>
              <span>至</span>
              <DatePicker
                v-model="formItem.endDate"
                @on-change="setEndDate"
                type="date"
                :options="options4"
                format="yyyy-MM-dd"
              ></DatePicker>
            </div>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="购买数据限定：" required>
        <!-- {{formItem.lowPrice}} -->
        <FormItem
          prop="lowPrice"
          :rules="[{required: true, message: '不能为空' },{validator:min},{ pattern: /^([1-9]\d*)$/, message: '数据格式不正确'}]"
          style="display:inline-block"
        >
          <Input v-model="formItem.lowPrice" style="width:100px" :maxlength="64"></Input>
        </FormItem>
        <span>至</span>
        <FormItem
          prop="highPrice"
          :rules="[{required: true, message: '不能为空' },{validator:max},{ pattern:/^([1-9]\d*)$/, message: '数据格式不正确'}]"
          style="display:inline-block"
        >
          <Input v-model="formItem.highPrice" style="width:100px" :maxlength="64"></Input>
        </FormItem>
      </FormItem>
      <FormItem label="下单人身份证：">
        <RadioGroup>
          <Radio label="apple">
            <span>选填</span>
          </Radio>
          <Radio label="android">
            <span>必填</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <!-- <FormItem label="演出单位：">
        <Input v-model="formItem.playDepart" style="width:33%" :maxlength="64"></Input>
      </FormItem>
      <FormItem label="价格区间：" required>
        <FormItem
          prop="lowPrice"
          :rules="[{required: true, message: '不能为空' },{validator:min},{ pattern: /^([1-9]\d*)$/, message: '数据格式不正确'}]"
          style="display:inline-block"
        >
          <Input v-model="formItem.lowPrice" style="width:100px" :maxlength="64"></Input>
        </FormItem>
        <span>至</span>
        <FormItem
          prop="highPrice"
          :rules="[{required: true, message: '不能为空' },{validator:max},{ pattern:/^([1-9]\d*)$/, message: '数据格式不正确'}]"
          style="display:inline-block"
        >
          <Input v-model="formItem.highPrice" style="width:100px" :maxlength="64"></Input>
        </FormItem>
      </FormItem>

      <FormItem label="轮播图：" prop="linkImg">
        <Input v-model="formItem.linkImg" style="display:none"></Input>
        <my-img :limitNum="5" :uploadList="wapImgList" @getImgUrl="setWapListUrl"></my-img>
        <p>最多上传5张，建议上传小于1M， 宽750px，高560px的JPG/PNG格式的图片</p>
      </FormItem>
      <FormItem label="预订须知：" required>
        <ueditor
          id="ue3"
          ref="noticeid"
          :content="formItem.bookingNotice"
          @contentChange="bookingNoticeChange"
          :config="config"
        ></ueditor>
      </FormItem>
      <div id="programDetail" class="form-title">节目详情</div>
      <FormItem label="简介描述：" required>
        <ueditor
          id="ue4"
          ref="detail"
          :content="formItem.introduction"
          @contentChange="introductionChange"
          :config="config"
        ></ueditor>
      </FormItem>
      <FormItem label="详情介绍：" required>
        <ueditor
          id="ue5"
          ref="detailIntro"
          :content="formItem.summary"
          @contentChange="summaryChange"
          :config="config"
        ></ueditor>
      </FormItem>
      <div id="bookRule" class="form-title">预订规则</div>
      <FormItem label="当日限制购票时间：" prop="isIntradayBookingTime">
        <RadioGroup v-model="formItem.isIntradayBookingTime">
          <Radio label="F">
            <span>不限</span>
          </Radio>
          <Radio label="T">
            <span>限制时间</span>
          </Radio>
        </RadioGroup>
        <template v-if="formItem.isIntradayBookingTime=='T'">
          <FormItem style="display:inline-block" prop="earlyBookHour">
            <TimePicker
              @on-change="timeChange"
              format="HH:mm"
              :value="time"
              placeholder="选择时间"
              style="width: 112px"
            ></TimePicker>
          </FormItem>
          <span>（限制时间为当天最迟可购时间）</span>
        </template>
      </FormItem>
      <FormItem label="整单购票数量限制：" prop="maxNum">
        <Input v-model="formItem.maxNum" style="width:150px" :maxlength="64"></Input>
      </FormItem>-->
      <FormItem>
        <div class="save-cancel">
          <Button type="primary" :loading="btnLoading" @click="submit">保存</Button>
          <Button type="ghost" style="margin-left: 8px" @click="back">取消</Button>
        </div>
      </FormItem> 
    </Form>
    <div class="fixed-box">
      <ul>
        <li>
          <a>快捷导航</a>
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('base')">基本信息</a>
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('programDetail')">景点信息</a>
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('bookRule')">分销设置</a>
        </li>
        <li>
          <Button size="small" :loading="btnLoading" @click="submit" type="primary">保存</Button>
          <!-- <button type="button" class="btn btn-primary btn-primary-outline" onclick="goTicketPublish()">保存，下一步</button> -->
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import ueditor from "@/components/global/ueditor";
import store from "@/store";
import { apiPost, apiGet, apiPostJson } from "@/fetch/api";
import myImg from "@/components/global/singleImg";
import selectItem from "@/components/global/selectList";
export default {
  data() {
    const validateNum = (rule, value, callback) => {
      if (value > 999999) {
        callback(new Error("最大值999999"));
      } else {
        callback();
      }
    };
    return {
      time: "1:22",
      options4: {},
      options3: {},
      config: {
        initialFrameWidth: 800,
        initialFrameHeight: 200
      },
      btnLoading: false,
      singleImgList: [],
      wapImgList: [],
      formItem: {
        id: "",
        name: "", //节目名称
        code: "", //节目编码(外部节目编码)
        playDepart: "", //演出单位
        startDate: "", //开始日期
        endDate: "", //结束日期
        enabled: "", //节目状态 F下架 T上架
        lowPrice: "", //最低价格
        highPrice: "", //最高价格
        linkMobileImg: "", //移动端图片 缩略图
        linkImg: "", //主图 轮播图
        bookingNotice: "", //预定须知
        introduction: "", //简介
        summary: "", //	详情
        isIntradayBookingTime: "F", //当日限制购票时间,'F'不限制,'T'有限制
        earlyBookHour: "1", //限制时间小时数
        earlyBookMinute: "22", //限制时间分钟数
        maxNum: "" //整单购票数量限制
      },
      ruleComplteForm: {
        name: [{ required: true, message: "请填写节目名称", trigger: "blur" }],
        enabled: [{ required: true, message: "请选择节目状态" }],
        linkImg: [{ required: true, message: "请上传轮播图" }],
        bookingNotice: [{ required: true, message: "请填写预订须知" }],
        introduction: [{ required: true, message: "请填写预订须知" }],
        maxNum: [
          { required: true, message: "请填写数量", trigger: "blur" },
          {
            max: 9,
            pattern: /^[1-9]\d*$/,
            message: "数据格式不正确"
          },
          {
            validator: validateNum,
            message: "数值不能大于999999"
          }
        ],
        isIntradayBookingTime: [
          { required: true, message: "请选择当日限制购票时间" }
        ],
        earlyBookHour: [{ required: true, message: "请选择时间" }]
        // tel: [
        //   {
        //     pattern: /(^1(3|4|7|5|8)([0-9]{9})$)|(^0[0-9]{2,3}-[0-9]{8}$)|(^400[0-9]{7}$)/,
        //     message: "数据格式不正确"
        //   }
        // ]
        // trafficDesc: [
        //   {
        //     max: 500,
        //     message: "交通描述字数不能超过500"
        //   }
        // ],
        // summary: [
        //   {
        //     max: 500,
        //     message: "酒店简介字数不能超过500"
        //   }
        // ],
        // aliasName: [
        //   { required: true, message: "请填写酒店别名", trigger: "blur" },
        //   { max: 64, message: "酒店别名字数不能超过64个" }
        // ],
        // hotelLevel: [
        //   { required: true, message: "请选择酒店星级", trigger: "blur" }
        // ],
        // hotelType: [
        //   { required: true, message: "请选择酒店类别", trigger: "blur" }
        // ],
        // name: [{ required: true, message: "请填写酒店名称", trigger: "blur" }],
        // linkTel: [
        //   { required: true, message: "请填写联系电话", trigger: "blur" }
        // ],
        // tel: [
        //   { required: true, message: "请填写联系电话", trigger: "blur" },
        //   {
        //     pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
        //     message: "请填写正确的号码",
        //     trigger: "blur"
        //   }
        // ],
        // latitudeLongitude: [
        //   { required: true, message: "请选择地图坐标", trigger: "blur" }
        // ],
        // addr: [{ required: true, message: "请填写详细地址", trigger: "blur" }],
        // sellType: [
        //   { required: true, message: "请选择分销渠道", trigger: "change" }
        // ],
        // subtitle: [
        //   { required: true, message: "请填写酒店副标题", trigger: "blur" },
        //   { max: 64, message: "酒店副标题字数不能超过64个" }
        // ],
        // merchantFictSaleNum: [
        //   {
        //     required: true,
        //     type: "number",
        //     message: "请填写店铺虚拟销量"
        //   },
        //   {
        //     max: 9,
        //     pattern: /^[1-9]\d*$/,
        //     message: "数据格式不正确"
        //   }
        // ],
        // distPriceShow: [
        //   {
        //     required: true,
        //     type: "number",
        //     message: "请填写分销展示价"
        //   },
        //   {
        //     pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
        //     message: "数据格式不正确"
        //   },
        //   {
        //     validator: validateNum,
        //     message: "数值不能大于999999"
        //   }
        // ],
        // distFictSaleNum: [
        //   {
        //     required: true,
        //     type: "number",
        //     message: "请填写分销虚拟销量"
        //   },
        //   {
        //     max: 9,
        //     pattern: /^[1-9]\d*$/,
        //     message: "数据格式不正确"
        //   }
        // ],
        // linkMobileImg: [
        //   { required: true, message: "请选择缩略图", trigger: "blur" }
        // ],
        // picUrl: [{ required: true, message: "请选择轮播图", trigger: "blur" }],
        // content: [{ required: true, message: "请填写详细信息" }],
        // noticeid: [{ required: true, message: "请填写详细信息" }],
        // distPolicy: [{ required: true, message: "请填写详细信息" }],
        // salePolicy: [{ required: true, message: "请填写详细信息" }]
      }
    };
  },
  computed: {},
  created() {
    // this.gethotelBrand(); //查询酒店品牌
    // this.getSysparam();
  },
  mounted() {
    //this.getSysparam()            //获取下拉框内容
    // this.$refs.hotelName.focus()
  },
  methods: {
    summaryChange(content) {
      this.formItem.summary = content;
    },
    introductionChange(content) {
      this.formItem.introduction = content;
    },
    bookingNoticeChange(content) {
      this.formItem.bookingNotice = content;
    },
    hashClick(val) {
      $("#content").scrollTop(
        $("#" + val).offset().top - 63 + $("#content").scrollTop()
      );
    },
    timeChange(val) {
      if (val) {
        //   earlyBookHour: "", //限制时间小时数
        // earlyBookMinute:
        this.formItem.earlyBookHour = val.split(":")[0];
        this.formItem.earlyBookMinute = val.split(":")[1];
      } else {
        this.formItem.earlyBookHour = "";
        this.formItem.earlyBookMinute = "";
      }
    },
    min(rule, value, callback) {
      if (
        this.formItem.lowPrice &&
        parseFloat(value) > parseFloat(this.formItem.highPrice)
      ) {
        callback(new Error("不能大于" + this.formItem.highPrice));
      } else {
        callback();
      }
    },
    max(rule, value, callback) {
      if (
        this.formItem.highPrice &&
        parseFloat(value) < parseFloat(this.formItem.lowPrice)
      ) {
        callback(new Error("不能小于" + this.formItem.lowPrice));
      } else {
        callback();
      }
    },
    setBegDate(time) {
      this.formItem.startDate = time;
      this.options4 = {
        disabledDate: date => {
          let startTime = this.formItem.startDate
            ? new Date(this.formItem.startDate).valueOf()
            : "";
          return date && date.valueOf() < startTime;
        }
      };
    },
    setEndDate(time) {
      if (time) {
        this.formItem.endDate = time;
        let endTime = this.formItem.endDate
          ? new Date(this.formItem.endDate).valueOf() - 1 * 24 * 60 * 60 * 1000
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
    back() {
      this.$router.back();
    },
    //初始化发布页面
    setWapUrl(imgArr) {
      this.formItem.linkMobileImg = imgArr.join(",");
      // this.$refs.formItem.validateField("linkMobileImg");
    },
    setWapListUrl(imgArr) {
      this.formItem.linkImg = imgArr.join(",");
      this.$refs.formItem.validateField("linkImg");
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
      this.btnLoading = true;
      let _this = this;
      this.$refs.formItem.validate(async valid => {
        this.scrollError();
        if (valid) {
          if (!this.formItem.bookingNotice) {
            this.$Message.warning("请填写预订须知");
            this.btnLoading = false;
            return;
          }
          if (!this.formItem.introduction) {
            this.$Message.warning("请填写简介描述");
            this.btnLoading = false;
            return;
          }
          let res = await apiPost(url, this.formItem);
          if (res.status == 200) {
            _this.$Message.success("保存成功!");
            _this.$router.push("/houseType");
          } else {
            this.btnLoading = false;
            _this.$Message.warning(res.message);
          }
        } else {
          this.btnLoading = false;
        }
      });
    }
  },
  components: {
    ueditor,
    myImg,
    selectItem
  }
};
</script>
<style scope lang="scss">
.theater-ticket-edit {
  width: 100%;

  .time-limit {
    .ivu-radio-wrapper.ivu-radio-group-item {
      width: 100%;
      margin-bottom: 15px;
      .time-limit-content {
        display: inline-block;
      }
    }
    .ivu-radio-wrapper.ivu-radio-group-item:last-child {
      margin-bottom: 0;
    }
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
}
.save-cancel {
  padding-bottom: 50px;
}
</style>





