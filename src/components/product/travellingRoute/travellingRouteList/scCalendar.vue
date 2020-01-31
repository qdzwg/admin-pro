<template>
  <row class="sc-calendar">
    <Col span="18">
      <div class="head-box">
        <h3 class="i-b calendar-title">{{ routeName }}</h3>
        <Select
          v-model="ticketType"
          style="width:200px"
          @on-change="changeTicketType"
        >
          <Option v-for="item in cityList" :value="item.id" :key="item.id">{{
            item.ticketName
          }}</Option>
        </Select>
      </div>
      <div style="font-size:14px;color:red">
        选择日期（点击鼠标单个选中）（日历中价格单位为人民币,多票型共享一个日库存）
      </div>
      <show-calendar
        ref="fullCa"
        :isFirstLoad="false"
        class="test-fc"
        :action="action"
        :extend="extend"
        :param="calendarParam"
        @getCheckInfo="getCheckInfo"
      >
      </show-calendar>
    </Col>
    <Col span="6">
      <Form
        style="margin-top:85px;"
        class="form-wrap"
        ref="rightform"
        :model="formItem"
        :rules="ruleValidate"
      >
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
            <tr>
              <td>销售价</td>
              <td>
                <FormItem prop="salePrice">
                  <InputNumber
                    :min="0"
                    :max="1000000"
                    v-model="formItem.salePrice"
                  ></InputNumber>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>成本价</td>
              <td>
                <FormItem prop="price">
                  <InputNumber
                    :min="0"
                    :max="1000000"
                    v-model="formItem.price"
                  ></InputNumber>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>库存</td>
              <td>
                <FormItem prop="stock">
                  <InputNumber
                    :min="0"
                    :max="1000000"
                    v-model="formItem.stock"
                  ></InputNumber>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="2" class="handleTd">
                <Button type="primary" @click="save">保存</Button>
                <Button type="ghost" @click="resetFun">重置</Button>
                <Button type="ghost" @click="cancelFun">返回列表</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </Form>
    </Col>
  </row>
</template>

<script>
import showCalendar from "@/components/global/showCalendar";
import moment from "moment";
export default {
  components: { showCalendar },
  props: {},
  data() {
    return {
      routeName: this.$route.query.name,
      cityList: [],
      ticketType: "",
      routeLineDetailId: "",
      selectDateList: [],
      action: "/product/api/routeProduct/selectRouteCalendar",
      extend: [
        {
          title: "成本价",
          key: "price",
          render: (h, params) => {
            let { price } = params.row;
            let text = typeof price === "undefined" ? "--" : price;
            return h("b", text);
          }
        },
        {
          title: "销售价",
          key: "salePrice",
          render: (h, params) => {
            let { salePrice } = params.row;
            let text = typeof salePrice === "undefined" ? "--" : salePrice;
            return h("b", text);
          }
        },
        {
          title: "库存",
          key: "stockModel",
          render: (h, params) => {
            let { totalNum, stock } = params.row;
            let text =
              typeof totalNum === "undefined" ? "--" : stock + "/" + totalNum;
            return h("b", text);
          }
        }
      ],
      calendarParam: {
        ticketType: "",
        routeInfoId: "",
        modelType: "route"
      },
      // :rules="[{ pattern: /^[0-9]\d*$/, message: '数据格式不正确'}]"
      formItem: {
        price: 0,
        salePrice: 0,
        stock: 0
      },
      ruleValidate: {
        price: [{ required: true, message: "请输入成本价" }],
        salePrice: [{ required: true, message: "请输入销售价" }],
        stock: [{ required: true, message: "请输入库存数量" }]
      }
    };
  },
  watch: {},
  computed: {},
  methods: {
    save() {
      this.$refs.rightform.validate(valid => {
        if (!this.selectDateList.length) {
          this.$Message.warning("请选择要修改的日期");
          return;
        }
        let dateList = this.selectDateList.map(item => {
          return item.date;
        });
        let dates = dateList.join(",");
        if (dateList)
          if (valid) {
            this.apiPost("/product/api/routeProduct/saveRouteDailyPriceStock", {
              ...this.formItem,
              dates,
              ticketId: this.$route.query.id,
              ticketType: this.ticketType,
              routeLineDetailId: this.routeLineDetailId
            }).then(res => {
              if (res.status == 200) {
                this.$refs.rightform.resetFields();
                this.$Message.success("修改成功");
                this.$refs.fullCa.init();
              } else {
                let message = res.message;
                message && this.$Message.warning(message);
              }
            });
          }
      });
    },
    resetFun() {
      this.$refs.rightform.resetFields();
    },
    cancelFun() {
      this.$router.go(-1);
    },
    getCheckInfo(data) {
      this.selectDateList = data;
    },
    changeTicketType(value) {
      let info = this.cityList.filter(item => {
        return item.id == value;
      })[0];
      this.calendarParam.routeLineDetailId = info.routeLineDetailId;
      this.calendarParam.ticketType = value;
      this.ticketType = value;
      this.routeLineDetailId = info.routeLineDetailId;
      this.$refs.fullCa.init();
      this.resetFun();
    }
  },
  async created() {
    let id = this.$route.query.id;
    let info = await this.apiPost("product/api/routeProduct/routeTicketList", {
      routeInfoId: id
    });
    if (info.status == 200) {
      let ticketInfo = info.data[0];
      this.calendarParam.routeLineDetailId = ticketInfo.routeLineDetailId;
      this.calendarParam.ticketType = ticketInfo.id;
      this.calendarParam.routeInfoId = id;
      this.calendarParam.modelType = "route";
      this.cityList = info.data;
      this.ticketType = ticketInfo.id;
      this.routeLineDetailId = ticketInfo.routeLineDetailId;
      this.$refs.fullCa.init();
    }
  },
  mounted() {},
  beforeRouteEnter(to, from, next) {
    next(async vm => {});
  }
};
</script>
<style>
.sc-calendar .ivu-input-number-handler-wrap {
  display: none;
}
</style>
<style lang="scss" scoped>
.sc-calendar {
  .head-box {
    display: flex;
    justify-content: space-between;
    .calendar-title {
      width: 250px;
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
  .form-wrap {
    width: 400px;
    padding-left: 20px;
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
}
</style>
