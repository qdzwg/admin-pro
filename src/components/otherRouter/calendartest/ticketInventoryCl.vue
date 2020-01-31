<template>
  <div class="inventoryCl">
    <Row>
      <Col span="18">
        <div class="head-box">
          <h3 class="i-b calendar-title">{{ routeName }}</h3>
        </div>
        <div style="font-size:14px;color:red; padding-bottom:10px;">
          选择日期（点击鼠标单个选中）（日历中价格单位为人民币,多票型共享一个日库存）
        </div>
        <show-calendar
          ref="fullCa"
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
              <tr>
                <th>名称</th>
                <th>值</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>价格名称</td>
                <td>
                  <FormItem prop="name" style="margin-bottom:0px;">
                    <Input v-model="formItem.name" :maxlength="8"></Input>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td valign="top" style="line-height:32px;">提前购价</td>
                <td>
                  <div>
                    <FormItem
                      label="当天"
                      label-position="left"
                      style="margin-bottom: 5px;"
                    >
                      <TimePicker
                        format="HH:mm"
                        v-model="formItem.beforeTime"
                        placeholder="开始时间"
                        style="width:80px;"
                      ></TimePicker>
                      <!-- <Select v-model="formItem.beforeTime" style="width:80px;">
                        <Option
                          :value="index"
                          v-for="(item, index) in 24"
                          :key="index"
                          >{{ index }}</Option
                        >
                      </Select> -->
                      <span style="padding-left:12px;padding-right:12px;"
                        >前 价格</span
                      >
                      <FormItem prop="secondPrice" style="display:inline-block">
                        <Input
                          style="width:100px"
                          v-model="formItem.secondPrice"
                          placeholder="请填写提前购价格"
                          :maxlength="8"
                        ></Input>
                      </FormItem>
                    </FormItem>
                    <FormItem
                      label="成本价"
                      style="margin-top:5px; margin-bottom: 5px;"
                      :label-width="185"
                      label-position="left"
                    >
                      <Input
                        style="width:100px"
                        v-model="formItem.secondCostPrice"
                        placeholder="请填写提前购成本价"
                        :maxlength="8"
                      ></Input>
                    </FormItem>
                    <FormItem
                      v-if="stockModel == 'day'"
                      label="库存"
                      style="margin-top:5px; margin-bottom: 5px;"
                      :label-width="185"
                      label-position="left"
                    >
                      <Input
                        style="width:100px"
                        v-model="formItem.secondStock"
                        placeholder="请填写提前购库存"
                        :maxlength="8"
                      ></Input>
                    </FormItem>
                  </div>
                  <div>
                    <FormItem
                      label="当天"
                      label-position="left"
                      style="margin-bottom: 5px;"
                    >
                      <TimePicker
                        format="HH:mm"
                        v-model="formItem.endTime"
                        placeholder="结束时间"
                        style="width:80px;"
                      ></TimePicker>
                      <span style="padding-left:12px;padding-right:12px;"
                        >后 价格</span
                      >
                      <FormItem
                        prop="refundBeforeDay"
                        style="display:inline-block"
                      >
                        <Input
                          style="width:100px"
                          v-model="formItem.salePrice"
                          placeholder="请填写当天购价格"
                          :maxlength="8"
                        ></Input>
                      </FormItem>
                    </FormItem>
                    <FormItem
                      label="成本价"
                      style="margin-top:5px; margin-bottom: 5px;"
                      :label-width="185"
                      label-position="left"
                    >
                      <Input
                        style="width:100px"
                        v-model="formItem.price"
                        placeholder="请填写当天购成本价"
                        :maxlength="8"
                      ></Input>
                    </FormItem>
                    <FormItem
                      v-if="stockModel == 'day'"
                      label="库存"
                      style="margin-top:5px; margin-bottom: 5px;"
                      :label-width="185"
                      label-position="left"
                    >
                      <Input
                        style="width:100px"
                        v-model="formItem.totalNum"
                        placeholder="请填写当天购库存"
                        :maxlength="8"
                      ></Input>
                    </FormItem>
                  </div>
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
import showCalendar from "@/components/global/showCalendar";
import moment from "moment";
import { apiPost, apiGet } from "@/fetch/api";

export default {
  mounted() {},
  computed: {},
  watch: {},
  data() {
    return {
      routeName: "",
      action: "/product/api/park/api/getCalendar",
      extend: [
        {
          title: "提前购成本价",
          key: "secondCostPrice",
          render: (h, params) => {
            let secondCostPrice =
              typeof params.row.secondCostPrice === "undefined"
                ? "--"
                : params.row.secondCostPrice;
            return h("b", secondCostPrice);
          }
        },
        {
          title: "当天购成本价",
          key: "price",
          render: (h, params) => {
            let price =
              typeof params.row.price === "undefined" ? "--" : params.row.price;
            return h("b", price);
          }
        },
        {
          title: "提前购价",
          key: "secondPrice",
          render: (h, params) => {
            let secondPrice =
              typeof params.row.secondPrice === "undefined"
                ? "--"
                : params.row.secondPrice;
            return h("b", secondPrice);
          }
        },
        {
          title: "当天购价",
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
          title: "当天购库存",
          key: "totalNum",
          render: (h, params) => {
            let stock =
              params.row.stock || params.row.stock == 0
                ? params.row.stock
                : "--";
            let totalNum = params.row.totalNum ? params.row.totalNum : "--";
            return h("b", stock + "/" + totalNum);
          }
        },
        {
          title: "提前购库存",
          key: "secondLeftStock",
          render: (h, params) => {
            let secondLeftStock =
              params.row.secondLeftStock || params.row.secondLeftStock == 0
                ? params.row.secondLeftStock
                : "--";
            let secondStock = params.row.secondStock
              ? params.row.secondStock
              : "--";
            return h("b", secondLeftStock + "/" + secondStock);
          }
        }
      ],
      calendarParam: {
        ticketId: this.$route.query.id
      },
      formItem: {
        dates: "",
        name: "",
        beforeTime: "",
        secondPrice: "",
        secondCostPrice: "",
        secondStock: "",
        salePrice: "",
        price: "",
        totalNum: ""
      },
      ruleForm: {
        name: [{ required: true, message: "请填写价格名称", trigger: "blur" }],
        beforeTime: [
          { required: true, message: "请选择提前购时间", trigger: "change" }
        ],
        secondPrice: [
          { required: true, message: "请填写提前购价格", trigger: "blur" }
        ],
        secondCostPrice: [
          { required: true, message: "请填写提前购成本价", trigger: "blur" }
        ],
        secondStock: [
          { required: true, message: "请填写提前购库存", trigger: "blur" }
        ],
        salePrice: [
          { required: true, message: "请填写当天购价格", trigger: "blur" }
        ],
        price: [
          { required: true, message: "请填写当天购成本价", trigger: "blur" }
        ],
        totalNum: [
          { required: true, message: "请填写当天购库存", trigger: "blur" }
        ]
      },
      stockModel: "day"
    };
  },
  methods: {
    save() {
      this.formItem.ticketId = this.$route.query.id;
      let formData = JSON.parse(JSON.stringify(this.formItem));
      console.log(formData);
      if (formData.dates == "") {
        this.$Message.warning("请选择日期！");
        return;
      } else {
        this.$refs.formItem.validate(async valid => {
          this.scrollError();
          if (valid) {
            let res = await this.apiPost(
              "/product/api/park/api/saveCalendar",
              formData
            );
            if (res.success) {
              this.$Message.success("修改成功！");
              this.$refs.fullCa.reload();
              this.formItem.dates = "";
              console.log("this.formItem", this.formItem);
            } else {
              this.$Message.warning(res.message);
            }
          } else {
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
      }
    },
    reset() {
      (this.formItem = {
        dates: "",
        name: "",
        beforeTime: "",
        secondPrice: "",
        secondCostPrice: "",
        secondStock: "",
        salePrice: "",
        price: "",
        totalNum: ""
      }),
        this.$refs.formItem.resetFields();
    },
    getCheckInfo(items) {
      if (items.length) {
        let dates = [];
        items.forEach(element => {
          dates.push(element.date);
        });
        this.formItem.dates = dates.join(",");
        this.formItem.name = "";
        this.formItem.beforeTime = items[0].beforeTime
          ? items[0].beforeTime
          : "";
        this.formItem.secondPrice = items[0].secondPrice
          ? items[0].secondPrice + ""
          : "";
        this.formItem.secondCostPrice = items[0].secondCostPrice
          ? items[0].secondCostPrice + ""
          : "";
        this.formItem.secondStock = items[0].secondStock
          ? items[0].secondStock + ""
          : "";
        this.formItem.salePrice = items[0].salePrice
          ? items[0].salePrice + ""
          : "";
        this.formItem.price = items[0].price ? items[0].price + "" : "";
        this.formItem.totalNum = items[0].totalNum
          ? items[0].totalNum + ""
          : "";
      }
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
    }
  },
  components: {
    showCalendar
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let stockModel = to.query.stockModel;
      vm.stockModel = stockModel;
      if (stockModel !== "day") {
        let extend = vm.extend.filter(item => {
          return item.key != "totalNum" && item.key != "secondLeftStock";
        });
        vm.extend = extend;
      }
    });
  }
};
</script>
<style lang="scss">
.inventoryCl {
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
