<template>
  <div class="ruleAndCalendar-box">
    <Row>
      <Col span="18">
      <div class="head-box">
        <h3 class="i-b calendar-title"> {{routeName}}</h3>
        <template v-for='item in ticketTypeArr'>
          <Button v-if='item=="0"' @click="selectType('0')" class="head-btn" :class='{active:ticketType=="0"}'>成人票</Button>
          <Button v-if='item=="1"' @click="selectType('1')" class="head-btn" :class='{active:ticketType=="1"}'>儿童票</Button>
        </template>
      </div>
      <div style="font-size:14px;color:red">
        选择日期（点击鼠标单个选中）（日历中价格单位为人民币,多票型共享一个日库存）
      </div>
      <full-calendar v-if='show' @dateSelect='dateData' :ticketTypes="ticketType" ref="fullCa" class="test-fc" first-day='1' locale="zh-cn" @changeSelectAll="changeValue" @changeMonth="changeMonth" @eventClick="eventClick" @dayClick="dayClick" @moreClick="moreClick">
        <template slot="fc-event-card" slot-scope="p">
          <p>
            <i class="fa"></i> {{ p.event.title }} test</p>
        </template>
        <template slot="fc-select-All">
          <Checkbox v-model="selectCheckAll" @on-change="seletAll">全选</Checkbox>
        </template>
      </full-calendar>
      </Col>
      <Col span="6">
      <Form style='margin-top:85px;' ref="rightform" :model="formValidate" :rules="ruleValidate">
        <table class="table">
          <thead>
            <tr>
              <th colspan="2">编辑价格和库存（人民币）</th>
            </tr>
            <tr>
              <th style="width:68px">名称</th>
              <th>值</th>
            </tr>
          </thead>
          <tbody>
            <!-- sfsfs -->
            <tr v-if='channel!="1"'>
              <td>成本价</td>
              <td>
                <FormItem prop='price' :rules="[{required: true, message: '该项不能为空！'},{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                  <Input v-model="formValidate.price"></Input>
                </FormItem>
              </td>
            </tr>
            <tr v-if='channel!="1"'>
              <td>门市价</td>
              <td>
                <FormItem prop='merchantLinePrice' :rules="[{required: true, message: '该项不能为空！'},{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                  <Input v-model="formValidate.merchantLinePrice"></Input>
                </FormItem>
              </td>
            </tr>
            <tr v-if='channel!="1"'>
              <td>建议零售</td>
              <td>
                <FormItem style="width:68px;float:left" >
                  <Input :disabled='true' v-model="formValidate.minimumPrice"></Input>
                </FormItem>
                <span style="padding:0 10px;float:left;height:33px;line-height:33px">至</span>
                <FormItem style="width:68px;float:left" >
                  <Input :disabled='true' v-model="formValidate.highestPrice"></Input>
                </FormItem>
              </td>
            </tr>
            <tr v-if='channel!="1"'>
              <td>店铺零售</td>
              <td>
                <FormItem prop='salePrice' :rules="[{required: true, message: '该项不能为空！'},{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                  <Input v-model="formValidate.salePrice"></Input>
                </FormItem>
              </td>
            </tr>
            <!-- <tr v-if='channel!="2"'>
                <td>分销结算</td>
                <td>
                  <FormItem prop='disPrice' :rules="[{required: true, message: '该项不能为空！'},{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                    <Input v-model="formValidate.disPrice"></Input>
                  </FormItem>
                </td>
              </tr> -->
            <tr>
              <td>库存量</td>
              <td>
                <FormItem>
                  <Input :disabled='true' v-model="formValidate.stock"></Input>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <span>调整原因:</span>
                <Input class="reason" v-model="formValidate.remark" type="textarea" :rows="4"></Input>
              </td>
            </tr>
            <tr>
              <td colspan="2" class="handleTd">
                <Button type="primary" @click="save" :loading="btnLoading">保存</Button>
                <Button type="ghost" @click="reset">重置</Button>
                <Button type="ghost" @click="editBack">返回列表</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </Form>
      </Col>
    </Row>
  </div>
</template>
<script>
import fullCalendar from "./../calendartest/palaceCalendar";
import moment from "moment";
import { apiPost, apiGet } from "@/fetch/api";
import common from "./../../../common/index.js";
let demoEvents = [
  {
    title: "Sunny 725-727",
    start: "2018-07-2",
    end: "2018-07-4",
    cssClass: "family"
  }
];
export default {
  mounted() {},
  created() {
    apiGet("/merchant/api/merchantRouteInfo/editMerchantRouteInfo", {
      id: this.$route.params.id
    }).then(res => {
      this.routeName = res.data.name;
    });
    apiGet("/merchant/api/merchantRouteInfo/editMerchantRouteLine", {
      id: this.$route.params.id
    }).then(res => {
      this.ticketTypeStr = res.data.ticketType;
      if (this.ticketTypeStr.split(",").length == 2) {
        this.ticketType = "0";
      } else if (this.ticketTypeStr.split(",").length == 1) {
        this.ticketType = this.ticketTypeStr.split(",")[0];
      } else {
        this.$Message.warning("票型error！");
      }
      this.show = true;
    });
  },
  computed: {
    ticketTypeArr() {
      return this.ticketTypeStr.split(",");
    }
  },
  watch: {
    // formValidate: {
    //   handler(val) {
    //     this.$nextTick(function() {
    //       this.$refs.rightform.validate();
    //     });
    //   },
    //   deep: true
    // }
  },
  data() {
    return {
      btnLoading: false,
      fixedShow: true,
      show: false,
      ticketTypeStr: "",
      routeName: "",
      channel: "",
      common: common,
      ticketType: "0",
      formValidate: {
        price: "", //成本价
        merchantLinePrice: "", //门市价
        minimumPrice: "", //建议最低零售价
        highestPrice: "", //建议最高零售价
        salePrice: "", //零售价
        disPrice: "", //分销价
        stock: "", //库存
        remark: "" //调整原因
      },
      ruleValidate: {
        // price: [{ validator: this.common.validate.floatNumber }],
        // merchantLinePrice: [{ validator: this.common.validate.floatNumber }],
        // minimumPrice: [{ validator: this.common.validate.floatNumber }],
        // highestPrice: [{ validator: this.common.validate.floatNumber }],
        // salePrice: [{ validator: this.common.validate.floatNumber }],
        // disPrice: [{ validator: this.common.validate.floatNumber }],
        stock: [{ validator: this.common.validate.integer }]
      },
      selectCheckAll: false,
      name: "Sunny!",
      fcEvents: demoEvents
    };
  },
  methods: {
      editBack(){
          this.$router.back()
      },
    getDataRight() {
      this.$refs.fullCa.getCalendar();
    },
    changeState() {
      this.btnLoading = false;
    },
    del() {
      this.reset();
    },
    reset() {
      this.formValidate = {
        price: "", //成本价
        merchantLinePrice: "", //门市价
        minimumPrice: "", //建议最低零售价
        highestPrice: "", //建议最高零售价
        salePrice: "", //零售价
        disPrice: "", //分销价
        stock: "", //库存
        remark: "" //调整原因
      };
      this.$refs.rightform.resetFields();
      
    },
    toggleShow() {
      this.fixedShow = !this.fixedShow;
    },
    hashClick(val) {
      $("#content").scrollTop(
        $("#" + val).offset().top - 63 + $("#content").scrollTop()
      );
    },
    getName(data) {
      this.routeName = data.name;
      this.channel = data.channel;
      this.ticketTypeStr = data.ticketType;
      if (this.ticketTypeStr.split(",").length == 2) {
        this.ticketType = "0";
      } else if (this.ticketTypeStr.split(",").length == 1) {
        this.ticketType = this.ticketTypeStr.split(",")[0];
      } else {
        this.$Message.warning("票型error！");
      }
      this.show = true;
    },
    selectType(type) {
      this.ticketType = type;
      this.$refs.fullCa.emitChangeMonth(moment().startOf("month"));
    },
    dateData(dateData) {
      this.formValidate = {
        price: dateData.price ? dateData.price : "", //成本价
        merchantLinePrice: dateData.merchantLinePrice
          ? dateData.merchantLinePrice
          : "", //门市价
        minimumPrice: dateData.minimumPrice ? dateData.minimumPrice : "", //建议最低零售价
        highestPrice: dateData.highestPrice ? dateData.highestPrice : "", //建议最高零售价
        salePrice: dateData.salePrice ? dateData.salePrice : "", //零售价
        disPrice: dateData.disPrice ? dateData.disPrice : "", //分销价
        stock: dateData.totalNum ? dateData.totalNum : "", //库存
        remark: dateData.remark ? dateData.remark : "" //调整原因
      };
    },
    save() {
       
      if (this.$refs.fullCa.social && this.$refs.fullCa.social.length) {
        this.formValidate.dates = this.$refs.fullCa.social.join(",");
        this.formValidate.ticketId = this.$route.params.id;
        this.formValidate.ticketType = this.ticketType;
         this.btnLoading=true
        setTimeout(()=>{
            this.btnLoading=false 
        },2000)
        //请求借口
        //成功后刷新数据
        this.$refs.rightform.validate(async valid => {
          if (valid) {
            apiPost(
              "/merchant/api/merchantRouteInfo/saveRouteDailyPriceStock",
              this.formValidate
            ).then(res => {
              if (res.status == 200) {
                this.$Message.success(res.message);
                this.$refs.fullCa.social = [];
                this.$refs.fullCa.getCalendar();
                this.$refs.fullCa.social = [];
                this.$refs.fullCa.weekSelect = [];
                this.selectCheckAll = false;
                this.reset();
              } else {
                this.$Message.warning(res.message);
              }
            });
          }
        });
      } else {
        this.$Message.warning("请选择项！");
      }
    },
    changeValue() {
      this.selectCheckAll = false;
    },
    seletAll(flag) {
      this.$refs.fullCa.selectAll(flag);
    },
    changeMonth(start, end, current) {
      // console.log(
      //   "changeMonth",
      //   start.format(),
      //   end.format(),
      //   current.format()
      // );
    },
    eventClick(event, jsEvent, pos) {
      // console.log("eventClick", event, jsEvent, pos);
    },
    dayClick(day, jsEvent) {
      // console.log("dayClick", day, jsEvent);
    },
    moreClick(day, events, jsEvent) {
      // console.log("moreCLick", day, events, jsEvent);
    }
  },
  components: {
    fullCalendar
  }
};
</script>
<style lang='scss'>
.ruleAndCalendar-box {
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
  .head-box {
    .calendar-title {
      width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .head-btn {
      float: right;
      margin-right: 25px;
      padding: 3px 15px;
    }
    .head-btn.active {
      color: #2b85e4;
      background-color: #fff;
      border-color: #2b85e4;
    }
  }

  .i-b {
    display: inline-block;
  }
  .handleTd {
    text-align: center;
  }
  .reason {
    display: inline-block;
    width: calc(100% - 70px);
    margin-left: 10px;
  }
  .app {
    color: green;
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
      }
    }
  }
}
</style>