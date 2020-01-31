<template>
  <div class="priceInventoryCl">
    <Row>
      <Col span="18">
        <div class="head-box">
          <h3 class="i-b calendar-title">{{ routeName }}</h3>
        </div>
        <div style="font-size:14px;color:red; padding-bottom:10px;">
          选择日期（点击鼠标单个选中）（日历中价格单位为人民币,多票型共享一个日库存）
        </div>
        <full-calendar
          ref="fullCa"
          class="test-fc"
          :action="action"
          :extend="extend"
          :param="calendarParam"
          @getCheckInfo="getCheckInfo"
        >
        </full-calendar>
      </Col>
      <Col span="6">
        <Form
          style="margin-top:66px;margin-left:10px;"
          ref="formItem"
          :model="formItem"
          :rules="ruleForm"
        >
          <table class="table">
            <thead>
              <tr>
                <th colspan="2">编辑价格和库存（人民币）</th>
              </tr>
              <tr v-if="sellType == '3'">
                <td colspan="2">请先设置分销渠道以及周期价格</td>
              </tr>
              <tr>
                <th>名称</th>
                <th>值</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="sellType == '0' || sellType == '2'">
                <td>成本价</td>
                <td>
                  <FormItem
                    prop="price"
                    :rules="[
                      { required: true, message: '该项不能为空！' },
                      {
                        pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
                        message: '数据格式不正确'
                      }
                    ]"
                  >
                    <Input v-model="formItem.price"></Input>
                  </FormItem>
                </td>
              </tr>
              <tr v-if="sellType == '0' || sellType == '2'">
                <td>门市价</td>
                <td>
                  <FormItem
                    prop="merchantLinePrice"
                    :rules="[
                      { required: true, message: '该项不能为空！' },
                      {
                        pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
                        message: '数据格式不正确'
                      }
                    ]"
                  >
                    <Input v-model="formItem.merchantLinePrice"></Input>
                  </FormItem>
                </td>
              </tr>
              <tr v-if="sellType == '0' || sellType == '1'">
                <td>建议零售价</td>
                <td>
                  <span>{{ minimumPrice }}</span>
                  <span>~</span>
                  <span>{{ highestPrice }}</span>
                </td>
              </tr>
              <tr v-if="sellType == '0' || sellType == '2'">
                <td>零售价</td>
                <td>
                  <FormItem
                    prop="salePrice"
                    :rules="[
                      { required: true, message: '该项不能为空！' },
                      {
                        pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
                        message: '数据格式不正确'
                      }
                    ]"
                  >
                    <Input v-model="formItem.salePrice"></Input>
                  </FormItem>
                </td>
              </tr>
              <tr v-if="sellType == '0' || sellType == '1'">
                <td>{{ formItem.prodFrom == "prod" ? "分销价" : "采购价" }}</td>
                <td>
                  <FormItem
                    prop="disPrice"
                    :rules="[
                      { required: true, message: '该项不能为空！' },
                      {
                        pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
                        message: '数据格式不正确'
                      }
                    ]"
                  >
                    <Input
                      v-if="formItem.prodFrom == 'dis'"
                      readonly
                      v-model="formItem.disPrice"
                    ></Input>
                    <Input v-else v-model="formItem.disPrice"></Input>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>库存</td>
                <td>
                  <span v-if="formItem.stockModel == 'unlimit'">无限库存</span>
                  <div v-if="formItem.stockModel == 'limit'">
                    有限库存
                    <Input
                      v-if="formItem.prodFrom == 'dis'"
                      style="width:100px;"
                      readonly
                      v-model="formItem.stock"
                    ></Input>
                    <Input
                      v-else
                      style="width:100px;"
                      v-model="formItem.stock"
                    ></Input>
                    在售：{{ formItem.saleNum }}
                  </div>
                  <Input
                    v-if="
                      formItem.stockModel == 'day' && formItem.prodFrom == 'dis'
                    "
                    style="width:150px;"
                    readonly
                    v-model="formItem.stock"
                  ></Input>
                  <Input
                    v-if="formItem.stockModel == 'day'"
                    style="width:150px;"
                    v-model="formItem.stock"
                  ></Input>
                </td>
              </tr>
              <tr v-if="sellType == '0' || sellType == '2'">
                <td>零售状态</td>
                <td>
                  <Select v-model="salePriceStatus" style="width:150px;">
                    <Option value="T">在售</Option>
                    <Option value="F">停售</Option>
                  </Select>
                </td>
              </tr>
              <tr v-if="sellType == '0' || sellType == '1'">
                <td>分销状态</td>
                <td>
                  <Select v-model="disPriceStatus" style="width:150px;">
                    <Option value="T">在售</Option>
                    <Option value="F">停售</Option>
                  </Select>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <span>调整原因:</span>
                  <Input
                    class="reason"
                    v-model="formItem.remark"
                    type="textarea"
                    :rows="4"
                  ></Input>
                </td>
              </tr>
              <tr>
                <td colspan="2" class="handleTd">
                  <Button type="primary" @click="save">保存</Button>
                  <Button type="ghost" @click="reset">重置</Button>
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
import fullCalendar from "@/components/global/fullCalendar";
import moment from "moment";
import { apiPost, apiGet } from "@/fetch/api";
let demoEvents = [
  {
    title: "Sunny 725-727",
    start: "2018-07-2",
    end: "2018-07-4",
    cssClass: "family"
  }
];
export default {
  mounted() {
    apiGet("/product/productPriceStockCalendar/calendarFL", {
      ticketId: this.$route.params.id,
      modelType: "ticket"
    }).then(res => {
      this.routeName = res.data.parkTicket.modelName;
      this.highestPrice = res.data.highestPrice;
      this.minimumPrice = res.data.minimumPrice;
      this.formItem.stockModel = res.data.parkTicket.stockModel;
      this.formItem.prodFrom = res.data.prodFrom;
      this.sellType = res.data.parkTicket.sellType;
    });
  },
  data() {
    return {
      routeName: "",
      action: "/product/productPriceStockCalendar/getCalendar",
      extend: [
        {
          title: "零",
          key: "salePrice",
          render: (h, params) => {
            let salePrice =
              typeof params.row.salePrice === "undefined"
                ? "--"
                : params.row.salePrice;
            return h("b", salePrice);
          }
        },
        {
          title: "分",
          key: "disPrice",
          render: (h, params) => {
            let disPrice =
              typeof params.row.disPrice === "undefined"
                ? "--"
                : params.row.disPrice;
            return h("b", disPrice);
          }
        },
        {
          title: "在售状态",
          key: "salePriceStatus",
          render: (h, params) => {
            if (typeof params.row.salePriceStatus === "undefined") {
              return h("a", "--");
            } else {
              if (params.row.salePriceStatus == "T") {
                return h("a", { style: { color: "#2b85e4" } }, "在售");
              } else {
                return h("a", { style: { color: "#f40" } }, "停售");
              }
            }
          }
        },
        // {
        //   title: '采',
        //   key: 'disPrice',
        //   render: (h, params) => {
        //     let disPrice = typeof params.row.disPrice === 'undefined' ? '--' : params.row.disPrice
        //     return h('b', disPrice)
        //   }
        // },
        {
          title: "已售",
          key: "saleNum",
          render: (h, params) => {
            let saleNum =
              typeof params.row.saleNum === "undefined"
                ? "--"
                : params.row.saleNum;
            return h("b", saleNum);
          }
        },
        {
          title: "库存",
          render: (h, params) => {
            if (params.row.stockModel == "unlimit") {
              return h("b", "无限库存");
            } else {
              let stock = params.row.stock ? params.row.stock : "--";
              let totalNum = params.row.totalNum ? params.row.totalNum : "--";
              return h("b", stock + "/" + totalNum);
            }
          }
        }
      ],
      calendarParam: {
        ticketId: this.$route.params.id,
        modelType: "ticket"
      },
      minimumPrice: "",
      highestPrice: "",
      sellType: "",
      salePriceStatus: "T",
      disPriceStatus: "T",
      formItem: {
        dates: "",
        modelType: "ticket",
        ticketId: "",
        prodFrom: "prod",
        price: "",
        merchantLinePrice: "",
        salePrice: "",
        stock: "",
        stockModel: "",
        remark: "",
        saleNum: "",
        salePriceStatus: "T",
        disPriceStatus: "T",
        sellType: ""
      },
      ruleForm: {},
      selectCheckAll: false,
      name: "Sunny!",
      fcEvents: demoEvents
    };
  },
  methods: {
    save() {
      this.formItem.modelType = "ticket";
      if (this.sellType == "0" || this.sellType == "2") {
        this.formItem.salePriceStatus = this.salePriceStatus;
      }
      if (this.sellType == "0" || this.sellType == "1") {
        this.formItem.disPriceStatus = this.disPriceStatus;
      }
      this.formItem.ticketId = this.$route.params.id;
      this.$refs.formItem.validate(async valid => {
        if (valid) {
          let res = await this.apiPost(
            "/product/productPriceStockCalendar/savePriceStock",
            this.formItem
          );
          if (res.success) {
            this.$Message.success("修改成功！");
            this.$refs.fullCa.reload();
          } else {
            this.$Message.warning(res.message);
          }
        }
      });
    },
    reset() {
      (this.formItem = {
        price: "", // 成本价
        merchantLinePrice: "", // 门市价
        // minimumPrice: "", // 建议最低零售价
        // highestPrice: "", // 建议最高零售价
        salePrice: "", // 零售价
        disPrice: "", // 分销价
        stock: "", // 库存
        remark: "" // 调整原因
      }),
        this.$refs.formItem.resetFields();
    },
    getCheckInfo(items) {
      if (items.length) {
        console.log(items);
        this.formItem = items[0];
        let dates = "";
        items.forEach(element => {
          dates = element.date + ",";
        });
        this.formItem.dates = dates;
        this.formItem.modelType = this.modelType;
        this.formItem.ticketId = this.ticketId;
      }
    },
    changeValue() {
      this.selectCheckAll = false;
    },
    seletAll(flag) {
      this.$refs.fullCa.selectAll(flag);
    },
    changeMonth(start, end, current) {
      console.log(
        "changeMonth",
        start.format(),
        end.format(),
        current.format()
      );
    },
    eventClick(event, jsEvent, pos) {
      console.log("eventClick", event, jsEvent, pos);
    },
    dayClick(day, jsEvent) {
      console.log("dayClick", day, jsEvent);
    },
    moreClick(day, events, jsEvent) {
      console.log("moreCLick", day, events, jsEvent);
    }
  },
  components: {
    fullCalendar
  }
};
</script>
<style lang="scss">
.priceInventoryCl {
  .head-box {
    .calendar-title {
      width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      height: 35px;
      line-height: 35px;
    }
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
